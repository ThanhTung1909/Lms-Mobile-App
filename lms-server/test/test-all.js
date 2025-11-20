// test/test-all.js
import { execSync } from 'child_process';

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║              🚀 RUNNING ALL TESTS - LMS SERVER 🚀                 ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

const tests = [
    { name: 'Authentication', file: 'test-auth.js' },
    { name: 'Courses', file: 'test-courses.js' },
    { name: 'Users', file: 'test-users.js' }
];

let passed = 0;
let failed = 0;

for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`${i + 1}️⃣  Testing ${test.name}...`);

    try {
        execSync(`node test/${test.file}`, {
            stdio: 'inherit'
        });
        passed++;
    } catch (error) {
        console.error(`❌ ${test.name} tests failed\n`);
        failed++;
    }
}

console.log('\n╔════════════════════════════════════════════════════════════════════╗');
if (failed === 0) {
    console.log('║                  ✅ ALL TESTS PASSED! ✅                          ║');
} else {
    console.log(`║              ⚠️  ${passed} PASSED, ${failed} FAILED ⚠️                           ║`);
}
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

process.exit(failed > 0 ? 1 : 0);