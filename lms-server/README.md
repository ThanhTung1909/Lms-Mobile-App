# 🎓 LMS - Backend Server

Đây là **server backend** cho hệ thống **Quản lý Học tập (Learning Management System - LMS)**, được xây dựng bằng **Node.js**, **Express.js** và **Sequelize ORM**.

---

## 🧰 Công nghệ sử dụng

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **ORM:** Sequelize  
- **Cơ sở dữ liệu:** MySQL (chạy bằng Docker)  
- **Xác thực:** JSON Web Token (JWT)  
- **Mã hóa mật khẩu:** bcryptjs  
- **Quản lý biến môi trường:** dotenv  

---

## ⚙️ Yêu cầu môi trường

Trước khi chạy dự án, hãy đảm bảo bạn đã cài:

- [Node.js](https://nodejs.org/) (Khuyến nghị: **v18+ hoặc v20+**)  
- [Docker](https://www.docker.com/) (để chạy MySQL container)

---

## 🚀 Cài đặt & Khởi chạy

### **Bước 1. Clone Repository**

```bash
git clone <your-repository-url>
cd lms-server

### **Bước 2: Cài đặt Dependencies**

Chạy lệnh sau để cài đặt tất cả các thư viện cần thiết từ `package.json`:

```bash
npm install

### **Bước 3. Khởi chạy Database MySQL bằng Docker**
Mở ứng dụng Docker Desktop và đảm bảo nó đang chạy.
Mở Terminal và chạy lệnh sau để tạo và khởi chạy container MySQL:
code
```bash
docker run --name your_name -e MYSQL_ROOT_PASSWORD=your_password -p 3307:3306 -d mysql:8.4.6
```
--name your_name: Đặt tên cho container.
-e MYSQL_ROOT_PASSWORD=your_password: Rất quan trọng! Thay your_password bằng mật khẩu bạn muốn đặt cho user root.
-p 3307:3306: Map cổng 3307 trên máy của bạn với cổng 3306 bên trong container.
-d mysql:8.4.6: Chạy container từ image mysql:8.4.6 ở chế độ nền.

### **Bước 4. Cấu hình Biến Môi Trường**
Tạo một file mới tên là .env trong thư mục gốc của dự án.
Copy và dán nội dung dưới đây vào file .env, sau đó chỉnh sửa lại cho phù hợp:
code
Env
# Cấu hình Server
PORT=5000

# Cấu hình Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password # <-- Điền mật khẩu bạn đã đặt ở Bước 3
DB_NAME=lms_database
DB_DIALECT=mysql
DB_PORT=3307 # <-- Cổng bạn đã map ở Bước 3

# Cấu hình JSON Web Token
JWT_SECRET=day_la_mot_chuoi_bi_mat_rat_dai_va_khong_doan_duoc

### **Bước 5. Tạo Database trong MySQL**
-- Truy cập container MySQL:
```bash
docker exec -it some-mysql bash
```

-- Đăng nhập MySQL client:
```bash
mysql -u root -p
```

-- Tạo database:
```bash
CREATE DATABASE lms_database;
```

-- Thoát khỏi MySQL và container:
```bash
exit
exit
```
### **Bước 6. Thêm dữ liệu mẫu vào database**
- Mở terminal và đảm bảo là đang ở trong thư mục gốc của dự án (lms-server).
```bash
node seeders/seed.js
```

### **Bước 7. Khởi chạy Server**
Bây giờ mọi thứ đã sẵn sàng. Chạy lệnh sau để khởi động server:

```bash
# Chạy ở chế độ development với nodemon (tự động restart khi có thay đổi)
npm run server

# Hoặc chạy ở chế độ bình thường
npm start
```
Nếu thành công, bạn sẽ thấy các thông báo sau trên terminal:

-- Connection to the database has been established successfully.
-- All models were synchronized successfully.
-- Server is running on port 3000

# Cấu trúc Thư mục

lms-server/
├── configs/
│   └── database.js         # Cấu hình và khởi tạo kết nối Sequelize tới DB.
├── controllers/
│   ├── auth.controller.js  # Logic xử lý cho việc đăng ký, đăng nhập.
│   └── course.controller.js# Logic nghiệp vụ liên quan đến khóa học (tạo, sửa, xóa...).
├── middlewares/
│   └── auth.middleware.js  # Middleware để xác thực JWT và kiểm tra quyền truy cập (role).
├── models/
│   ├── user.model.js       # Định nghĩa model (schema) cho bảng User.
│   └── index.js            # File trung tâm, import tất cả model và định nghĩa các mối quan hệ giữa chúng.
├── routes/
│   ├── auth.routes.js      # Định nghĩa các API endpoint cho việc xác thực (/api/auth/...).
│   └── index.js            # Router tổng, gộp tất cả các router con lại.
├── .env                    # File chứa các biến môi trường. (KHÔNG commit lên Git).
├── server.js               # File chính, điểm khởi đầu của ứng dụng Express.
└── package.json            # Chứa thông tin dự án và danh sách các dependencies.

# 
