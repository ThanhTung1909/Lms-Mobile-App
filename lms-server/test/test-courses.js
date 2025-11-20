// test-courses.js - Test toàn bộ Course Routes
const BASE_URL = 'http://localhost:5000/api/v1';

let educatorToken = '';
let studentToken = '';
let newCourseId = '';

// Helper functions
const log = {
    success: (msg) => console.log(`✅ ${msg}`),
    error: (msg) => console.log(`❌ ${msg}`),
    info: (msg) => console.log(`ℹ️  ${msg}`),
    warning: (msg) => console.log(`⚠️  ${msg}`),
};

function printSection(title) {
    console.log('\n' + '='.repeat(70));
    log.info(title);
    console.log('='.repeat(70));
}

// ============================================
// SETUP: Login as Educator & Student
// ============================================
async function setupTokens() {
    printSection('SETUP: Đăng nhập để lấy tokens');

    try {
        // Login as Educator
        const educatorRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'dinotimo@gmail.com',
                password: 'password123'
            })
        });
        const educatorData = await educatorRes.json();
        if (educatorData.success) {
            educatorToken = educatorData.data.token;
            log.success(`Educator token: ${educatorToken.substring(0, 30)}...`);
        }

        // Login as Student
        const studentRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'thanhtung@gmail.com',
                password: 'password123'
            })
        });
        const studentData = await studentRes.json();
        if (studentData.success) {
            studentToken = studentData.data.token;
            log.success(`Student token: ${studentToken.substring(0, 30)}...`);
        }
    } catch (error) {
        log.error(`Setup failed: ${error.message}`);
    }
}

// ============================================
// TEST 1: GET /courses - Lấy danh sách courses (Public)
// ============================================
async function testGetAllCourses() {
    printSection('TEST 1: GET /courses - Lấy danh sách khóa học (Public)');

    try {
        const response = await fetch(`${BASE_URL}/courses`);
        const data = await response.json();

        if (response.ok && data.success) {
            log.success(`Lấy ${data.data.courses.length} khóa học`);
            console.log(`   📊 Total: ${data.data.pagination.total}`);
            console.log(`   📄 Page: ${data.data.pagination.page}/${data.data.pagination.totalPages}`);

            if (data.data.courses.length > 0) {
                const course = data.data.courses[0];
                console.log(`   📚 Course đầu tiên:`);
                console.log(`      - ID: ${course.courseId}`);
                console.log(`      - Title: ${course.title}`);
                console.log(`      - Price: $${course.price}`);
                console.log(`      - Creator: ${course.creator?.fullName}`);
            }
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 2: GET /courses?search=javascript - Tìm kiếm
// ============================================
async function testSearchCourses() {
    printSection('TEST 2: GET /courses?search=javascript - Tìm kiếm khóa học');

    try {
        const response = await fetch(`${BASE_URL}/courses?search=javascript&status=published`);
        const data = await response.json();

        if (response.ok && data.success) {
            log.success(`Tìm thấy ${data.data.courses.length} khóa học`);
            data.data.courses.forEach((course, idx) => {
                console.log(`   ${idx + 1}. ${course.title} - $${course.price}`);
            });
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 3: GET /courses/:id - Chi tiết course (Public)
// ============================================
async function testGetCourseById() {
    printSection('TEST 3: GET /courses/:id - Lấy chi tiết khóa học');

    const courseId = 'course_js_intro';

    try {
        const response = await fetch(`${BASE_URL}/courses/${courseId}`);
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Lấy chi tiết thành công');
            console.log(`   📖 Title: ${data.data.title}`);
            console.log(`   💰 Price: $${data.data.price} (Discount: ${data.data.discount}%)`);
            console.log(`   ⭐ Rating: ${data.data.avgRating}/5 (${data.data.totalRatings} reviews)`);
            console.log(`   👥 Students: ${data.data.studentCount}`);
            console.log(`   📚 Chapters: ${data.data.Chapters?.length || 0}`);
            console.log(`   👨‍🏫 Creator: ${data.data.creator?.fullName}`);
            console.log(`   🏷️  Categories: ${data.data.Categories?.map(c => c.name).join(', ')}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 4: POST /courses - Tạo course mới (Educator only)
// ============================================
async function testCreateCourse() {
    printSection('TEST 4: POST /courses - Tạo khóa học mới (Educator only)');

    const newCourse = {
        title: `Test Course ${Date.now()}`,
        description: '<h2>Test Course Description</h2><p>This is a test course created by automated test.</p>',
        price: 99.99,
        discount: 20,
        thumbnailUrl: 'https://via.placeholder.com/800x400',
        categoryIds: ['cat_programming']
    };

    try {
        const response = await fetch(`${BASE_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${educatorToken}`
            },
            body: JSON.stringify(newCourse)
        });
        const data = await response.json();

        if (response.status === 201 && data.success) {
            log.success('Tạo khóa học thành công');
            newCourseId = data.data.courseId;
            console.log(`   📖 Course ID: ${data.data.courseId}`);
            console.log(`   📝 Title: ${data.data.title}`);
            console.log(`   💰 Price: $${data.data.price}`);
            console.log(`   📊 Status: ${data.data.status}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 5: POST /courses - Student không được tạo (Should fail)
// ============================================
async function testCreateCourseAsStudent() {
    printSection('TEST 5: POST /courses - Student tạo course (Expected fail)');

    try {
        const response = await fetch(`${BASE_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                title: 'Should not be created',
                description: 'Test'
            })
        });
        const data = await response.json();

        if (response.status === 403) {
            log.success('Đúng! Student bị chặn khi tạo course');
            console.log(`   Message: ${data.message}`);
        } else {
            log.error('Sai! Student không nên được tạo course');
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 6: PUT /courses/:id - Cập nhật course (Creator only)
// ============================================
async function testUpdateCourse() {
    printSection('TEST 6: PUT /courses/:id - Cập nhật khóa học');

    if (!newCourseId) {
        log.warning('Không có courseId để test');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/courses/${newCourseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${educatorToken}`
            },
            body: JSON.stringify({
                title: 'Updated Test Course',
                price: 79.99,
                discount: 30,
                status: 'published'
            })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Cập nhật thành công');
            console.log(`   📝 New Title: ${data.data.title}`);
            console.log(`   💰 New Price: $${data.data.price}`);
            console.log(`   📊 New Status: ${data.data.status}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 7: POST /courses/:id/enroll - Đăng ký course (Student)
// ============================================
async function testEnrollCourse() {
    printSection('TEST 7: POST /courses/:id/enroll - Đăng ký khóa học');

    const courseId = 'course_web_dev'; // Course chưa enroll

    try {
        const response = await fetch(`${BASE_URL}/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.status === 201 && data.success) {
            log.success('Đăng ký thành công');
            console.log(`   📖 Course ID: ${data.data.courseId}`);
            console.log(`   💰 Price Paid: $${data.data.pricePaid}`);
            console.log(`   📅 Enrolled At: ${data.data.enrolledAt}`);
        } else if (response.status === 400) {
            log.warning(`Đã đăng ký trước đó: ${data.message}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 8: POST /courses/:id/enroll - Enroll lại (Should fail)
// ============================================
async function testEnrollDuplicate() {
    printSection('TEST 8: POST /courses/:id/enroll - Đăng ký lại (Expected fail)');

    const courseId = 'course_js_intro'; // Already enrolled

    try {
        const response = await fetch(`${BASE_URL}/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.status === 400) {
            log.success('Đúng! Không cho phép đăng ký lại');
            console.log(`   Message: ${data.message}`);
        } else {
            log.error('Sai! Không nên cho phép đăng ký lại');
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 9: POST /courses/:id/rate - Đánh giá course
// ============================================
async function testRateCourse() {
    printSection('TEST 9: POST /courses/:id/rate - Đánh giá khóa học');

    const courseId = 'course_js_intro'; // Enrolled course

    try {
        const response = await fetch(`${BASE_URL}/courses/${courseId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                rating: 5,
                comment: 'Khóa học rất tuyệt vời! Tôi đã học được rất nhiều kiến thức.'
            })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Đánh giá thành công');
            console.log(`   ⭐ Rating: ${data.data.rating}/5`);
            console.log(`   💬 Comment: ${data.data.comment}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 10: POST /courses/:id/rate - Rate chưa enroll (Should fail)
// ============================================
async function testRateWithoutEnroll() {
    printSection('TEST 10: POST /courses/:id/rate - Rate chưa enroll (Expected fail)');

    // Sử dụng course vừa tạo (chắc chắn chưa enroll)
    const courseId = newCourseId || 'course_py_adv';

    try {
        const response = await fetch(`${BASE_URL}/courses/${courseId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                rating: 4,
                comment: 'Good'
            })
        });
        const data = await response.json();

        if (response.status === 403) {
            log.success('Đúng! Phải enroll trước khi rate');
            console.log(`   Message: ${data.message}`);
        } else {
            log.error('Sai! Không nên cho phép rate khi chưa enroll');
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 11: DELETE /courses/:id - Xóa course (Creator only)
// ============================================
async function testDeleteCourse() {
    printSection('TEST 11: DELETE /courses/:id - Xóa khóa học');

    if (!newCourseId) {
        log.warning('Không có courseId để xóa');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/courses/${newCourseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${educatorToken}`
            }
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Xóa khóa học thành công');
            console.log(`   Message: ${data.message}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 12: Pagination test
// ============================================
async function testPagination() {
    printSection('TEST 12: GET /courses?page=1&limit=2 - Test phân trang');

    try {
        const response = await fetch(`${BASE_URL}/courses?page=1&limit=2`);
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Phân trang hoạt động');
            console.log(`   📄 Page: ${data.data.pagination.page}`);
            console.log(`   📊 Limit: ${data.data.pagination.limit}`);
            console.log(`   📚 Total: ${data.data.pagination.total}`);
            console.log(`   🔢 Total Pages: ${data.data.pagination.totalPages}`);
            console.log(`   📖 Courses in page: ${data.data.courses.length}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// MAIN
// ============================================
async function runAllTests() {
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║              🧪 TEST COURSE ROUTES - COMPLETE 🧪                  ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝');

    await setupTokens();
    await new Promise(r => setTimeout(r, 500));

    await testGetAllCourses();
    await new Promise(r => setTimeout(r, 500));

    await testSearchCourses();
    await new Promise(r => setTimeout(r, 500));

    await testGetCourseById();
    await new Promise(r => setTimeout(r, 500));

    await testCreateCourse();
    await new Promise(r => setTimeout(r, 500));

    await testCreateCourseAsStudent();
    await new Promise(r => setTimeout(r, 500));

    await testUpdateCourse();
    await new Promise(r => setTimeout(r, 500));

    await testEnrollCourse();
    await new Promise(r => setTimeout(r, 500));

    await testEnrollDuplicate();
    await new Promise(r => setTimeout(r, 500));

    await testRateCourse();
    await new Promise(r => setTimeout(r, 500));

    await testRateWithoutEnroll();
    await new Promise(r => setTimeout(r, 500));

    await testPagination();
    await new Promise(r => setTimeout(r, 500));

    await testDeleteCourse(); // Di chuyển xuống cuối
    await new Promise(r => setTimeout(r, 500));

    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ HOÀN THÀNH TEST COURSES ✅                    ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
}

runAllTests();