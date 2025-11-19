/**
 * Memory Profiling Test for Backend
 * Run this to identify memory leaks in your backend
 */

import { connectDB, closeDB, getPoolStats } from './src/config/db.js';
import { getCache } from './src/lib/cache.js';
import { Post } from './src/models/Post.js';

const cache = getCache();

// Memory monitoring utilities
class MemoryProfiler {
    constructor() {
        this.snapshots = [];
        this.intervals = [];
    }

    takeSnapshot(label) {
        const memUsage = process.memoryUsage();
        const cacheStats = cache.getStats();
        const poolStats = getPoolStats();

        const snapshot = {
            label,
            timestamp: new Date().toISOString(),
            memory: {
                rss: Math.round(memUsage.rss / 1024 / 1024),
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
                external: Math.round(memUsage.external / 1024 / 1024),
            },
            cache: {
                totalItems: cacheStats.totalItems,
                activeItems: cacheStats.activeItems,
                estimatedMemoryKB: cacheStats.estimatedMemoryKB,
                maxSize: cacheStats.maxSize,
            },
            database: poolStats,
            uptime: process.uptime()
        };

        this.snapshots.push(snapshot);

        console.log(`\n📊 Memory Snapshot: ${label}`);
        console.log(`Heap Used: ${snapshot.memory.heapUsed}MB`);
        console.log(`Cache Items: ${cacheStats.activeItems}`);
        console.log(`Cache Memory: ${cacheStats.estimatedMemoryKB}KB`);
        console.log(`DB Connections: ${poolStats.activeCount}/${poolStats.totalCount}`);
    }

    startMonitoring(intervalMs = 10000) {
        const interval = setInterval(() => {
            this.takeSnapshot(`Auto ${Date.now()}`);
        }, intervalMs);
        this.intervals.push(interval);
    }

    stopMonitoring() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }

    generateReport() {
        console.log('\n📈 Memory Leak Analysis Report');
        console.log('================================');

        if (this.snapshots.length < 2) {
            console.log('❌ Not enough snapshots for analysis');
            return;
        }

        const first = this.snapshots[0];
        const last = this.snapshots[this.snapshots.length - 1];

        const heapGrowth = last.memory.heapUsed - first.memory.heapUsed;
        const cacheGrowth = last.cache.estimatedMemoryKB - first.cache.estimatedMemoryKB;

        console.log(`⏱️  Test Duration: ${(last.uptime - first.uptime).toFixed(1)}s`);
        console.log(`📊 Heap Growth: ${heapGrowth > 0 ? '+' : ''}${heapGrowth}MB`);
        console.log(`🗃️  Cache Growth: ${cacheGrowth > 0 ? '+' : ''}${cacheGrowth}KB`);

        // Memory leak detection
        if (heapGrowth > 50) {
            console.log('🚨 POTENTIAL MEMORY LEAK: Heap usage increased significantly');
        }

        if (cacheGrowth > 10000) { // 10MB
            console.log('🚨 POTENTIAL CACHE LEAK: Cache memory increased significantly');
        }

        console.log('\n📋 Full Snapshot History:');
        this.snapshots.forEach(snap => {
            console.log(`${snap.timestamp}: ${snap.label} - Heap: ${snap.memory.heapUsed}MB, Cache: ${snap.cache.activeItems} items`);
        });
    }
}

// Simulate heavy load to test memory behavior
async function simulateLoad() {
    console.log('🔥 Starting Memory Load Simulation...\n');

    const profiler = new MemoryProfiler();
    profiler.takeSnapshot('Initial State');

    try {
        await connectDB();
        profiler.startMonitoring(5000);

        console.log('\n🔄 Simulating database operations...');

        // Create multiple posts to test cache behavior
        for (let i = 0; i < 50; i++) {
            const testPost = {
                title: `Test Post ${i} - Memory Testing ${Date.now()}`,
                slug: `test-memory-${i}-${Date.now()}`,
                content: `This is a test post for memory analysis. Content with some data.`.repeat(10),
                categoryId: 1,
                author: 'Memory Test Bot',
                image: `https://example.com/test-${i}.jpg`
            };

            try {
                await Post.create(testPost);
                if (i % 10 === 0) {
                    profiler.takeSnapshot(`After creating ${i + 1} posts`);
                }
            } catch (error) {
                console.error(`Error creating post ${i}:`, error.message);
            }
        }

        console.log('\n🔍 Simulating search operations...');
        for (let i = 0; i < 100; i++) {
            await Post.search('test', { limit: 5, offset: 0 });
            if (i % 20 === 0) {
                profiler.takeSnapshot(`After ${i + 1} searches`);
            }
        }

        console.log('\n📊 Simulating cache stress test...');
        for (let i = 0; i < 1000; i++) {
            cache.set(`stress-test-${i}`, { data: 'x'.repeat(1000) }, 60000);
            if (i % 100 === 0) {
                profiler.takeSnapshot(`Cache stress test ${i + 1} entries`);
            }
        }

        profiler.takeSnapshot('Before cleanup');

        // Test memory cleanup
        console.log('\n🧹 Testing memory cleanup...');
        cache.clear();

        for (let i = 0; i < 100; i++) {
            cache.delete(`stress-test-${i}`);
        }

        profiler.takeSnapshot('After cleanup');

        // Force garbage collection if available
        if (global.gc) {
            console.log('\n🗑️  Running garbage collection...');
            global.gc();
            profiler.takeSnapshot('After garbage collection');
        }

    } catch (error) {
        console.error('❌ Error during load simulation:', error);
    } finally {
        profiler.stopMonitoring();
        profiler.generateReport();

        await closeDB();
        cache.destroy();

        console.log('\n✅ Memory profiling test completed');
    }
}

// Export for use in other scripts
export { MemoryProfiler, simulateLoad };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    simulateLoad().catch(console.error);
}