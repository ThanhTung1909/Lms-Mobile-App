// test/test-api.js
// File test đơn giản để kiểm tra các API endpoint

const BASE_URL = 'http://localhost:5000/api/v1';

// Màu sắc cho console
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// Helper function để log kết quả
function logSuccess(message) {
    console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
    console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logInfo(message) {
    console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logWarning(message) {
    console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

// ============================================
// TEST COURSE ROUTES
// ============================================

async function testGetAllCourses() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 1: GET /api/v1/courses - Lấy danh sách khóa học');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/courses`);
        const data = await response.json();

        if (response.ok && data.success) {
            logSuccess('Lấy danh sách khóa học thành công');
            console.log(`   📚 Số lượng khóa học: ${data.data.courses.length}`);
            console.log(`   📄 Tổng số: ${data.data.pagination.total}`);

            if (data.data.courses.length > 0) {
                console.log(`   📖 Khóa học đầu tiên: "${data.data.courses[0].title}"`);
            }
        } else {
            logError(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi kết nối: ${error.message}`);
    }
}

async function testGetCourseById() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 2: GET /api/v1/courses/:id - Lấy chi tiết khóa học');
    console.log('='.repeat(60));

    const courseId = 'course_js_intro';  // ID từ seed data

    try {
        const response = await fetch(`${BASE_URL}/courses/${courseId}`);
        const data = await response.json();

        if (response.ok && data.success) {
            logSuccess('Lấy chi tiết khóa học thành công');
            console.log(`   📖 Title: ${data.data.title}`);
            console.log(`   💰 Price: $${data.data.price}`);
            console.log(`   ⭐ Rating: ${data.data.avgRating}`);
            console.log(`   👥 Số học viên: ${data.data.studentCount}`);
            console.log(`   📚 Số chapters: ${data.data.Chapters?.length || 0}`);
        } else {
            logError(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi kết nối: ${error.message}`);
    }
}

async function testSearchCourses() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 3: GET /api/v1/courses?search=javascript - Tìm kiếm khóa học');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/courses?search=javascript&status=published`);
        const data = await response.json();

        if (response.ok && data.success) {
            logSuccess('Tìm kiếm khóa học thành công');
            console.log(`   🔍 Tìm thấy: ${data.data.courses.length} khóa học`);

            data.data.courses.forEach((course, index) => {
                console.log(`   ${index + 1}. ${course.title}`);
            });
        } else {
            logError(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi kết nối: ${error.message}`);
    }
}

async function testCreateCourse() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 4: POST /api/v1/courses - Tạo khóa học mới (MOCK - không có auth)');
    console.log('='.repeat(60));

    const newCourse = {
        title: "Test Course from API Test",
        description: "<h2>This is a test course</h2>",
        price: 29.99,
        discount: 10
    };

    try {
        const response = await fetch(`${BASE_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer <token>'  // Cần token thật
            },
            body: JSON.stringify(newCourse)
        });

        const data = await response.json();

        if (response.status === 201) {
            logSuccess('Tạo khóa học thành công (nếu có auth)');
            console.log(`   📖 Course ID: ${data.data?.courseId}`);
        } else if (response.status === 401) {
            logWarning('Cần đăng nhập để tạo khóa học (Expected)');
        } else {
            logError(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi kết nối: ${error.message}`);
    }
}

// ============================================
// TEST USER ROUTES
// ============================================

async function testGetProfile() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 5: GET /api/v1/users/profile - Xem profile (MOCK - không có auth)');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            headers: {
                // 'Authorization': 'Bearer <token>'  // Cần token thật
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            logSuccess('Lấy profile thành công (nếu có auth)');
            console.log(`   👤 Name: ${data.data?.fullName}`);
            console.log(`   📧 Email: ${data.data?.email}`);
        } else if (response.status === 401) {
            logWarning('Cần đăng nhập để xem profile (Expected)');
        } else {
            logError(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi kết nối: ${error.message}`);
    }
}

async function testGetEnrolledCourses() {
    console.log('\n' + '='.repeat(60));
    logInfo('TEST 6: GET /api/v1/users/enrolled-courses - Khóa học đã đăng ký');
    console.log('='.repeat(60));

    try {
        const response = await fetch(`${BASE_URL}/users/enrolled-courses`);
        const data = await response.json();

        if (response.ok && data.success) {
            logSuccess('Lấy danh sách enrolled courses thành công');
            console.log(`   📚 Số khóa học: ${data.data?.enrollments?.length || 0}`);
        } else if (response.status === 401) {
            logWarning('Cần đăng nhập (Expected)');
        } else {
            logError(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        logError(`Lỗi kết nối: ${error.message}`);
    }
}

// ============================================
// MAIN TEST RUNNER
// ============================================

async function runAllTests() {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║          🧪 BẮT ĐẦU TEST API LMS SERVER 🧪              ║');
    console.log('╚══════════════════════════════════════════════════════════╝');

    logInfo(`Server URL: ${BASE_URL}`);
    logWarning('Lưu ý: Các test có auth sẽ fail nếu không có JWT token');

    // Test Course Routes
    await testGetAllCourses();
    await new Promise(resolve => setTimeout(resolve, 500));  // Delay 0.5s

    await testGetCourseById();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testSearchCourses();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testCreateCourse();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test User Routes
    await testGetProfile();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testGetEnrolledCourses();

    // Kết thúc
    console.log('\n' + '='.repeat(60));
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║               ✅ HOÀN THÀNH TẤT CẢ TEST ✅              ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    logInfo('Để test đầy đủ các API cần auth, hãy:');
    console.log('   1. Implement auth routes (register/login)');
    console.log('   2. Lấy JWT token sau khi login');
    console.log('   3. Thêm token vào header Authorization\n');
}

// Chạy tests
runAllTests().catch(error => {
    logError(`Lỗi nghiêm trọng: ${error.message}`);
    process.exit(1);
});