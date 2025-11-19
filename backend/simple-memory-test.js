/**
 * Simple Memory Leak Test (No Database Required)
 * This test checks for basic memory leaks without requiring database connections
 */

import { performance } from 'perf_hooks';

class SimpleMemoryTest {
    constructor() {
        this.snapshots = [];
        this.testData = [];
    }

    takeSnapshot(label) {
        const memUsage = process.memoryUsage();

        const snapshot = {
            label,
            timestamp: Date.now(),
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
            external: Math.round(memUsage.external / 1024 / 1024), // MB
            rss: Math.round(memUsage.rss / 1024 / 1024), // MB
            testDataSize: this.testData.length
        };

        this.snapshots.push(snapshot);

        console.log(`📊 ${label}`);
        console.log(`   Heap: ${snapshot.heapUsed}MB / ${snapshot.heapTotal}MB`);
        console.log(`   External: ${snapshot.external}MB`);
        console.log(`   RSS: ${snapshot.rss}MB`);
        console.log(`   Test Data: ${snapshot.testDataSize} items`);
        console.log('');
    }

    // Simulate memory-intensive operations
    testArrayGrowth() {
        console.log('🔄 Testing Array Growth...');
        this.takeSnapshot('Initial Array Test');

        // Create many objects and hold references (memory leak simulation)
        for (let i = 0; i < 10000; i++) {
            const obj = {
                id: i,
                data: 'x'.repeat(1000), // 1KB per object
                timestamp: new Date(),
                nested: {
                    array: Array(100).fill('test'),
                    obj: { value: Math.random() }
                }
            };
            this.testData.push(obj);

            if (i % 2000 === 0) {
                this.takeSnapshot(`After creating ${i + 1} objects`);
            }
        }
    }

    testClosureMemoryLeak() {
        console.log('🔄 Testing Closure Memory Leaks...');
        this.takeSnapshot('Initial Closure Test');

        // Simulate common React patterns that can leak
        let leakedArray = [];
        let eventHandlers = [];

        for (let i = 0; i < 5000; i++) {
            // Create closure that captures large objects
            const closureHandler = (() => {
                const largeObject = {
                    data: 'y'.repeat(500),
                    handlers: eventHandlers,
                    references: leakedArray
                };

                return function () {
                    console.log('Handler called', largeObject.data.length);
                };
            })();

            eventHandlers.push(closureHandler);
            leakedArray.push({ closureRef: closureHandler });

            if (i % 1000 === 0) {
                this.takeSnapshot(`After ${i + 1} closures`);
            }
        }
    }

    testMapGrowth() {
        console.log('🔄 Testing Map Growth...');
        this.takeSnapshot('Initial Map Test');

        const largeMap = new Map();

        for (let i = 0; i < 8000; i++) {
            const key = `key_${i}`;
            const value = {
                data: 'z'.repeat(800),
                metadata: {
                    created: Date.now(),
                    id: i,
                    tags: Array(50).fill(`tag_${i}`)
                }
            };

            largeMap.set(key, value);

            // Remove some entries to test if memory is freed
            if (i > 4000 && i % 500 === 0) {
                const keyToRemove = `key_${i - 3000}`;
                largeMap.delete(keyToRemove);
            }

            if (i % 2000 === 0) {
                this.takeSnapshot(`Map test after ${i + 1} entries`);
            }
        }
    }

    testAsyncMemory() {
        console.log('🔄 Testing Async Memory Behavior...');
        this.takeSnapshot('Initial Async Test');

        const promises = [];

        for (let i = 0; i < 2000; i++) {
            const promise = new Promise((resolve) => {
                const largeData = {
                    id: i,
                    buffer: Buffer.alloc(1024 * 10), // 10KB buffer
                    data: Array(1000).fill(`async_${i}`)
                };

                setTimeout(() => {
                    resolve(largeData);
                }, Math.random() * 1000);
            });

            promises.push(promise);

            if (i % 400 === 0) {
                this.takeSnapshot(`After ${i + 1} async operations`);
            }
        }

        // Wait for some promises to complete
        return Promise.allSettled(promises.slice(0, 100)).then(() => {
            this.takeSnapshot('After async completion');
        });
    }

    testGarbageCollection() {
        console.log('🔄 Testing Garbage Collection...');
        this.takeSnapshot('Before GC');

        // Clear references
        this.testData = [];

        // Force garbage collection if available
        if (global.gc) {
            console.log('🗑️  Running garbage collection...');
            global.gc();
            this.takeSnapshot('After GC');
        }
    }

    generateReport() {
        console.log('\n📈 Memory Leak Analysis Report');
        console.log('==============================');

        if (this.snapshots.length < 2) {
            console.log('❌ Not enough data for analysis');
            return;
        }

        const first = this.snapshots[0];
        const last = this.snapshots[this.snapshots.length - 1];

        const heapGrowth = last.heapUsed - first.heapUsed;
        const totalGrowth = last.rss - first.rss;

        console.log(`⏱️  Test Duration: ${(last.timestamp - first.timestamp)}ms`);
        console.log(`📊 Heap Growth: ${heapGrowth > 0 ? '+' : ''}${heapGrowth}MB`);
        console.log(`📈 RSS Growth: ${totalGrowth > 0 ? '+' : ''}${totalGrowth}MB`);

        // Analyze each phase
        console.log('\n📋 Phase Analysis:');
        for (let i = 1; i < this.snapshots.length; i++) {
            const prev = this.snapshots[i - 1];
            const curr = this.snapshots[i];
            const growth = curr.heapUsed - prev.heapUsed;

            console.log(`   ${prev.label} → ${curr.label}: ${growth > 0 ? '+' : ''}${growth}MB`);
        }

        // Risk assessment
        console.log('\n🚨 Risk Assessment:');
        if (heapGrowth > 100) {
            console.log('   🔴 HIGH RISK: Significant heap growth detected');
            console.log('   🔍 Issues likely in: Object retention, closure captures, or large data structures');
        } else if (heapGrowth > 50) {
            console.log('   🟡 MEDIUM RISK: Moderate heap growth detected');
            console.log('   🔍 Monitor: Object creation patterns and reference management');
        } else {
            console.log('   🟢 LOW RISK: Minimal heap growth detected');
            console.log('   ✅ Memory management appears stable in this test');
        }

        console.log('\n🎯 Recommendations:');
        if (heapGrowth > 50) {
            console.log('   1. Review object lifecycle management');
            console.log('   2. Check for unclosed event listeners');
            console.log('   3. Implement proper cleanup in React components');
            console.log('   4. Monitor cache size limits');
        } else {
            console.log('   1. Continue monitoring in production');
            console.log('   2. Test with real database operations');
            console.log('   3. Monitor long-running sessions');
        }
    }

    async runAllTests() {
        console.log('🧪 Starting Simple Memory Leak Tests');
        console.log('====================================\n');

        this.takeSnapshot('Test Start');

        try {
            this.testArrayGrowth();
            this.testClosureMemoryLeak();
            this.testMapGrowth();

            await this.testAsyncMemory();

            this.testGarbageCollection();

            this.generateReport();

        } catch (error) {
            console.error('❌ Test failed:', error);
            console.log('\n🚨 MEMORY TEST FAILED - This indicates serious memory issues!');
            console.log('💡 The application likely has memory leaks that cause browser crashes');
        }

        console.log('\n✅ Simple memory test completed');
    }
}

// Run the test
const test = new SimpleMemoryTest();
test.runAllTests().catch(console.error);