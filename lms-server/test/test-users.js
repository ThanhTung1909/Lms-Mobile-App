// test-users.js - Test toàn bộ User Routes
const BASE_URL = 'http://localhost:5000/api/v1';

let studentToken = '';
let userId = '';

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
// SETUP: Login as Student
// ============================================
async function setupToken() {
    printSection('SETUP: Đăng nhập student');

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

        if (data.success) {
            studentToken = data.data.token;
            userId = data.data.user.userId;
            log.success(`Token: ${studentToken.substring(0, 30)}...`);
            log.success(`User ID: ${userId}`);
        }
    } catch (error) {
        log.error(`Setup failed: ${error.message}`);
    }
}

// ============================================
// TEST 1: GET /users/profile - Xem profile
// ============================================
async function testGetProfile() {
    printSection('TEST 1: GET /users/profile - Xem profile');

    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Lấy profile thành công');
            console.log(`   👤 User ID: ${data.data.userId}`);
            console.log(`   📝 Name: ${data.data.fullName}`);
            console.log(`   📧 Email: ${data.data.email}`);
            console.log(`   🎭 Roles: ${data.data.Roles?.map(r => r.name).join(', ')}`);
            console.log(`   📊 Status: ${data.data.status}`);
            console.log(`   📚 Enrolled Courses: ${data.data.stats.enrolledCourses}`);
            console.log(`   🎓 Created Courses: ${data.data.stats.createdCourses}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 2: GET /users/profile - Không có token (Should fail)
// ============================================
async function testGetProfileWithoutAuth() {
    printSection('TEST 2: GET /users/profile - Không có token (Expected fail)');

    try {
        const response = await fetch(`${BASE_URL}/users/profile`);
        const data = await response.json();

        if (response.status === 401) {
            log.success('Đúng! Bị chặn khi không có token');
            console.log(`   Message: ${data.message}`);
        } else {
            log.error('Sai! Không nên truy cập được khi không có token');
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 3: PUT /users/profile - Cập nhật profile
// ============================================
async function testUpdateProfile() {
    printSection('TEST 3: PUT /users/profile - Cập nhật profile');

    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                fullName: 'Thanh Tung Updated',
                avatarUrl: 'https://i.pravatar.cc/300?u=updated'
            })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Cập nhật profile thành công');
            console.log(`   📝 New Name: ${data.data.fullName}`);
            console.log(`   🖼️  New Avatar: ${data.data.avatarUrl}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 4: PUT /users/profile - Rollback lại tên cũ
// ============================================
async function testRollbackProfile() {
    printSection('TEST 4: PUT /users/profile - Rollback tên cũ');

    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                fullName: 'Thanh Tung'
            })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Rollback thành công');
            console.log(`   📝 Name restored: ${data.data.fullName}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 5: GET /users/enrolled-courses - Khóa học đã đăng ký
// ============================================
async function testGetEnrolledCourses() {
    printSection('TEST 5: GET /users/enrolled-courses - Khóa học đã đăng ký');

    try {
        const response = await fetch(`${BASE_URL}/users/enrolled-courses`, {
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success(`Có ${data.data.enrollments.length} khóa học đã đăng ký`);

            data.data.enrollments.forEach((enrollment, idx) => {
                const course = enrollment.course;
                console.log(`\n   ${idx + 1}. ${course.title}`);
                console.log(`      💰 Paid: $${enrollment.pricePaid}`);
                console.log(`      📅 Enrolled: ${new Date(enrollment.enrolledAt).toLocaleDateString()}`);
                console.log(`      👨‍🏫 Creator: ${course.creator?.fullName}`);
                console.log(`      📊 Progress: ${course.progress.percentage}% (${course.progress.completed}/${course.progress.total})`);
            });

            console.log(`\n   📄 Pagination:`);
            console.log(`      Total: ${data.data.pagination.total}`);
            console.log(`      Page: ${data.data.pagination.page}/${data.data.pagination.totalPages}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 6: GET /users/enrolled-courses?status=published - Filter
// ============================================
async function testGetEnrolledCoursesWithFilter() {
    printSection('TEST 6: GET /users/enrolled-courses?status=published - Filter');

    try {
        const response = await fetch(`${BASE_URL}/users/enrolled-courses?status=published`, {
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success(`Có ${data.data.enrollments.length} khóa học published`);
            data.data.enrollments.forEach((enrollment, idx) => {
                console.log(`   ${idx + 1}. ${enrollment.course.title} (${enrollment.course.status})`);
            });
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 7: GET /users/progress - Tiến độ học tập (tất cả)
// ============================================
async function testGetUserProgress() {
    printSection('TEST 7: GET /users/progress - Tiến độ học tập (tất cả khóa)');

    try {
        const response = await fetch(`${BASE_URL}/users/progress`, {
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success(`Tổng ${data.data.totalCompleted} bài học đã hoàn thành`);

            const courses = data.data.progressByCourse;
            if (courses.length > 0) {
                console.log(`\n   📊 Progress theo khóa học:`);
                courses.forEach((course, idx) => {
                    console.log(`\n   ${idx + 1}. ${course.courseTitle}`);
                    console.log(`      ✅ Completed: ${course.totalCompleted} lectures`);
                    console.log(`      ⏱️  Duration: ${Math.floor(course.totalDuration / 60)} minutes`);
                    console.log(`      📚 Lectures:`);
                    course.completedLectures.slice(0, 3).forEach((lecture, lecIdx) => {
                        console.log(`         ${lecIdx + 1}. ${lecture.lectureTitle} (${lecture.duration}s)`);
                    });
                    if (course.completedLectures.length > 3) {
                        console.log(`         ... và ${course.completedLectures.length - 3} bài nữa`);
                    }
                });
            } else {
                log.warning('Chưa có tiến độ nào');
            }
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 8: GET /users/progress?courseId=xxx - Filter theo course
// ============================================
async function testGetUserProgressByCourse() {
    printSection('TEST 8: GET /users/progress?courseId=xxx - Tiến độ 1 khóa');

    const courseId = 'course_js_intro';

    try {
        const response = await fetch(`${BASE_URL}/users/progress?courseId=${courseId}`, {
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success(`Tiến độ khóa ${courseId}`);

            if (data.data.progressByCourse.length > 0) {
                const course = data.data.progressByCourse[0];
                console.log(`   📖 Course: ${course.courseTitle}`);
                console.log(`   ✅ Completed: ${course.totalCompleted} lectures`);
                console.log(`   ⏱️  Total Duration: ${Math.floor(course.totalDuration / 60)} minutes`);
            } else {
                log.warning('Chưa có tiến độ cho khóa này (OK - test passed)');
            }
        } else {
            log.error(`Lỗi: ${data.message}`);
            console.error('Response:', data);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 9: POST /users/progress/:lectureId - Đánh dấu hoàn thành
// ============================================
async function testMarkLectureComplete() {
    printSection('TEST 9: POST /users/progress/:lectureId - Đánh dấu hoàn thành');

    const lectureId = 'js_ch1_lec2'; // Lecture chưa hoàn thành

    try {
        const response = await fetch(`${BASE_URL}/users/progress/${lectureId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.status === 201 && data.success) {
            log.success('Đánh dấu hoàn thành thành công');
            console.log(`   📚 Lecture ID: ${data.data.lectureId}`);
            console.log(`   ✅ Completed At: ${data.data.completedAt}`);
        } else if (response.status === 200) {
            log.warning('Bài học đã hoàn thành trước đó');
            console.log(`   Message: ${data.message}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 10: POST /users/progress/:lectureId - Mark lại (Should return 200)
// ============================================
async function testMarkLectureCompleteDuplicate() {
    printSection('TEST 10: POST /users/progress/:lectureId - Đánh dấu lại');

    const lectureId = 'js_ch1_lec1'; // Already completed

    try {
        const response = await fetch(`${BASE_URL}/users/progress/${lectureId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.status === 200 && data.success) {
            log.success('Đúng! Trả về bài học đã hoàn thành');
            console.log(`   Message: ${data.message}`);
        } else {
            log.error(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 11: POST /users/progress/:lectureId - Chưa enroll (Should fail)
// ============================================
async function testMarkLectureWithoutEnroll() {
    printSection('TEST 11: POST /users/progress/:lectureId - Chưa enroll (Expected fail)');

    // Test với lecture không tồn tại hoặc fake ID
    const fakeLectureId = 'fake_lecture_id_12345';

    try {
        const response = await fetch(`${BASE_URL}/users/progress/${fakeLectureId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.status === 404) {
            log.success('Đúng! Lecture không tồn tại');
            console.log(`   Message: ${data.message}`);
        } else if (response.status === 403) {
            log.success('Đúng! Phải enroll course trước');
            console.log(`   Message: ${data.message}`);
        } else {
            log.warning(`Unexpected status: ${response.status}`);
            console.log(`   Message: ${data.message}`);
        }
    } catch (error) {
        log.error(`Lỗi: ${error.message}`);
    }
}

// ============================================
// TEST 12: Kiểm tra thống kê sau khi update
// ============================================
async function testStatsAfterProgress() {
    printSection('TEST 12: GET /users/profile - Kiểm tra stats sau progress');

    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        const data = await response.json();

        if (response.ok && data.success) {
            log.success('Stats hiện tại:');
            console.log(`   📚 Enrolled Courses: ${data.data.stats.enrolledCourses}`);
            console.log(`   🎓 Created Courses: ${data.data.stats.createdCourses}`);
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
    console.log('║               🧪 TEST USER ROUTES - COMPLETE 🧪                   ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝');

    await setupToken();
    await new Promise(r => setTimeout(r, 500));

    await testGetProfile();
    await new Promise(r => setTimeout(r, 500));

    await testGetProfileWithoutAuth();
    await new Promise(r => setTimeout(r, 500));

    await testUpdateProfile();
    await new Promise(r => setTimeout(r, 500));

    await testRollbackProfile();
    await new Promise(r => setTimeout(r, 500));

    await testGetEnrolledCourses();
    await new Promise(r => setTimeout(r, 500));

    await testGetEnrolledCoursesWithFilter();
    await new Promise(r => setTimeout(r, 500));

    await testGetUserProgress();
    await new Promise(r => setTimeout(r, 500));

    await testGetUserProgressByCourse();
    await new Promise(r => setTimeout(r, 500));

    await testMarkLectureComplete();
    await new Promise(r => setTimeout(r, 500));

    await testMarkLectureCompleteDuplicate();
    await new Promise(r => setTimeout(r, 500));

    await testMarkLectureWithoutEnroll();
    await new Promise(r => setTimeout(r, 500));

    await testStatsAfterProgress();

    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                   ✅ HOÀN THÀNH TEST USERS ✅                     ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
}

runAllTests();