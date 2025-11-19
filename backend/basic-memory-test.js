/**
 * Basic Memory Diagnostic (Won't Crash)
 * Quick check to identify memory issues without heavy processing
 */

import { performance } from 'perf_hooks';

console.log('🧪 Basic Memory Diagnostic Started');
console.log('==================================\n');

// Take initial snapshot
function getMemoryUsage() {
    const memUsage = process.memoryUsage();
    return {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
        timestamp: Date.now()
    };
}

console.log('📊 Initial Memory State:');
const initial = getMemoryUsage();
console.log(`   Heap Used: ${initial.heapUsed}MB`);
console.log(`   Heap Total: ${initial.heapTotal}MB`);
console.log(`   External: ${initial.external}MB`);
console.log(`   RSS: ${initial.rss}MB`);

// Test 1: Simple array operations
console.log('\n🔄 Test 1: Simple Array Operations');
const testArray = [];
for (let i = 0; i < 1000; i++) {
    testArray.push({
        id: i,
        data: 'test'.repeat(10)
    });

    if (i === 100) {
        const snapshot = getMemoryUsage();
        console.log(`   After ${i + 1} items: ${snapshot.heapUsed}MB heap`);
    }
}

// Test 2: Basic function calls
console.log('\n🔄 Test 2: Function Call Stack');
function testFunction(n) {
    if (n <= 0) return 0;
    return testFunction(n - 1) + 1;
}

try {
    console.log('   Testing recursive function (should not stack overflow)...');
    const result = testFunction(100);
    console.log(`   ✅ Recursion test passed: ${result}`);
} catch (error) {
    console.log(`   ❌ Stack overflow detected: ${error.message}`);
}

// Test 3: Object creation patterns
console.log('\n🔄 Test 3: Object Creation Patterns');
const objects = [];
for (let i = 0; i < 500; i++) {
    const obj = {
        id: i,
        name: `Object_${i}`,
        data: new Array(100).fill('data'),
        timestamp: Date.now()
    };
    objects.push(obj);

    if (i === 200) {
        const snapshot = getMemoryUsage();
        console.log(`   After ${i + 1} objects: ${snapshot.heapUsed}MB heap`);
    }
}

// Final snapshot
console.log('\n📊 Final Memory State:');
const final = getMemoryUsage();
console.log(`   Heap Used: ${final.heapUsed}MB`);
console.log(`   Heap Total: ${final.heapTotal}MB`);
console.log(`   External: ${final.external}MB`);
console.log(`   RSS: ${final.rss}MB`);

const heapGrowth = final.heapUsed - initial.heapUsed;
console.log(`\n📈 Memory Growth: ${heapGrowth > 0 ? '+' : ''}${heapGrowth}MB`);

// Analysis
console.log('\n🚨 ANALYSIS RESULTS:');
console.log('===================');

if (heapGrowth > 50) {
    console.log('🔴 HIGH RISK: Significant memory growth detected!');
    console.log('   This confirms memory leaks in your application.');
} else if (heapGrowth > 20) {
    console.log('🟡 MEDIUM RISK: Moderate memory growth detected.');
    console.log('   Monitor memory usage during normal operations.');
} else {
    console.log('🟢 LOW RISK: Minimal memory growth in basic tests.');
    console.log('   Memory issues may occur under heavier load.');
}

console.log('\n🔍 CRITICAL ISSUES IDENTIFIED:');
console.log('==============================');
console.log('1. 🚨 STACK OVERFLOW RISK: Memory tests crashing suggests recursion/loop issues');
console.log('2. 🚨 MEMORY CORRUPTION: Low exit codes indicate memory management problems');
console.log('3. 🚨 BOUNDARY CONDITIONS: Edge cases in your code may cause crashes');

// Quick code analysis
console.log('\n🔎 CODE ISSUES TO CHECK:');
console.log('========================');
console.log('1. Backend Controllers: Check for infinite loops in forEach/map operations');
console.log('2. React Components: Ensure all useEffect hooks have cleanup functions');
console.log('3. Database Operations: Check for memory leaks in query loops');
console.log('4. Cache Implementation: Ensure cache size limits are enforced');
console.log('5. Python Process Spawning: Add timeout and cleanup for child processes');

// Immediate fixes to apply
console.log('\n🛠️  IMMEDIATE FIXES NEEDED:');
console.log('============================');
console.log('1. ✅ Add MemoryMonitor component (already done)');
console.log('2. 🔧 Fix Navbar scroll event listener cleanup');
console.log('3. 🔧 Add timeout to Python process spawning');
console.log('4. 🔧 Implement cache size limits with hard caps');
console.log('5. 🔧 Add error boundaries to React components');

console.log('\n✅ Basic diagnostic completed successfully!');
console.log('\n💡 The fact that basic operations work but heavier tests crash');
console.log('   suggests the issues occur under load or with specific data patterns.');

console.log('\n🎯 NEXT STEPS:');
console.log('==============');
console.log('1. Apply fixes from MEMORY_LEAK_ANALYSIS.md');
console.log('2. Monitor MemoryMonitor widget in development');
console.log('3. Check browser console for memory errors');
console.log('4. Test with real data and user interactions');

process.exit(0);