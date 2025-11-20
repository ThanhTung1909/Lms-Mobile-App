// test-auth.js - Test authentication flow
const BASE_URL = 'http://localhost:5000/api/v1';

let authToken = '';
let userId = '';

// Helper functions
function logSuccess(msg) {
    console.log(`✅ ${msg}`);
}

function logError(msg) {
    console.log(`❌ ${msg}`);
}

function logInfo(msg) {
    console.log(`ℹ️  ${msg}`);
}

// ============================================
// TEST 1: Register
// ============================================
async function testRegister() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 1: POST /api/v1/auth/register - Đăng ký tài khoản');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Test User',
                email: `testuser_${Date.now()}@gmail.com`,
                password: 'password123',
                role: 'student'
            })
        });

        const data = await response.json();

        if (response.status === 201 && data.success) {
            logSuccess('Đăng ký thành công');
            console.log(`   User ID: ${data.data.user.userId}`);
            console.log(`   Email: ${data.data.user.email}`);
            console.log(`   Token: ${data.data.token.substring(0, 20)}...`);

            authToken = data.data.token;
            userId = data.data.user.userId;
        } else {
            logError(`Đăng ký thất bại: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 2: Login
// ============================================
async function testLogin() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 2: POST /api/v1/auth/login - Đăng nhập');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'thanhtung@gmail.com',
                password: 'password123'
            })
        });

        const data = await response.json();

        if (response.status === 200 && data.success) {
            logSuccess('Đăng nhập thành công');
            console.log(`   User: ${data.data.user.fullName}`);
            console.log(`   Email: ${data.data.user.email}`);
            console.log(`   Roles: ${data.data.user.roles.join(', ')}`);
            console.log(`   Token: ${data.data.token.substring(0, 20)}...`);

            authToken = data.data.token;
            userId = data.data.user.userId;
        } else {
            logError(`Đăng nhập thất bại: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 3: Get Me
// ============================================
async function testGetMe() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 3: GET /api/v1/auth/me - Lấy thông tin user hiện tại');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (response.status === 200 && data.success) {
            logSuccess('Lấy thông tin thành công');
            console.log(`   User ID: ${data.data.userId}`);
            console.log(`   Name: ${data.data.fullName}`);
            console.log(`   Email: ${data.data.email}`);
            console.log(`   Roles: ${data.data.roles.join(', ')}`);
            console.log(`   Status: ${data.data.status}`);
        } else {
            logError(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 4: Get Profile (Protected)
// ============================================
async function testGetProfile() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 4: GET /api/v1/users/profile - Xem profile (Protected)');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (response.status === 200 && data.success) {
            logSuccess('Lấy profile thành công');
            console.log(`   Name: ${data.data.fullName}`);
            console.log(`   Email: ${data.data.email}`);
            console.log(`   Enrolled Courses: ${data.data.stats.enrolledCourses}`);
            console.log(`   Created Courses: ${data.data.stats.createdCourses}`);
        } else {
            logError(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 5: Access without token (Should fail)
// ============================================
async function testUnauthorized() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 5: Truy cập protected route KHÔNG CÓ token (Expected fail)');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/users/profile`);
        const data = await response.json();

        if (response.status === 401) {
            logSuccess('Đúng! Bị chặn khi không có token');
            console.log(`   Message: ${data.message}`);
        } else {
            logError('Sai! Không có token vẫn truy cập được (Security issue!)');
        }
    } catch (error) {
        logError(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 6: Invalid token (Should fail)
// ============================================
async function testInvalidToken() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 6: Token không hợp lệ (Expected fail)');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            headers: {
                'Authorization': 'Bearer invalid_token_here'
            }
        });
        const data = await response.json();

        if (response.status === 401) {
            logSuccess('Đúng! Token không hợp lệ bị reject');
            console.log(`   Message: ${data.message}`);
        } else {
            logError('Sai! Token không hợp lệ vẫn được chấp nhận (Security issue!)');
        }
    } catch (error) {
        logError(`Lỗi: ${error.message}`);
    }
}

// ============================================
// MAIN
// ============================================
async function runAllTests() {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║          🔐 TEST AUTHENTICATION SYSTEM 🔐               ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    logInfo(`Server URL: ${BASE_URL}`);

    // await testRegister();
    // await new Promise(r => setTimeout(r, 500));

    await testLogin();
    await new Promise(r => setTimeout(r, 500));

    await testGetMe();
    await new Promise(r => setTimeout(r, 500));

    await testGetProfile();
    await new Promise(r => setTimeout(r, 500));

    await testUnauthorized();
    await new Promise(r => setTimeout(r, 500));

    await testInvalidToken();

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║               ✅ HOÀN THÀNH TEST AUTH ✅                ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
}

runAllTests();