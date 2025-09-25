# TaskNest – Todo App (MERN Stack)

##Giới thiệu
Đề tài: **TaskNest – Quản lý Công việc Cá nhân**  
- Quản lý công việc với các thông tin: `title`, `status`, `dueDate`.  
- Chức năng:  
  - CRUD (Create, Read, Update, Delete)  
  - Filter theo trạng thái (All | Done | Pending)  
  - Filter theo ngày (from, to)  
  - Phân trang danh sách công việc  
  - Thống kê số nhiệm vụ hoàn thành/chưa hoàn thành  

Công nghệ: **MongoDB Atlas + Express + React + Node.js**

---

## Cài đặt và chạy Backend

### 1. Clone repo
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/server
```

### 2. Tạo file `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://admin:example_123@cluster0.p5f5kqm.mongodb.net/todos?retryWrites=true&w=majority
```

### 3. Cài dependencies
```bash
npm install
```

### 4. Chạy server
```bash
npm start   # hoặc node server.js
```

### 5. Kết quả
Server chạy tại:  
```
http://localhost:5000
```

---

## API Endpoints

### Tạo công việc
```bash
curl -X POST http://localhost:5000/api/todos   -H "Content-Type: application/json"   -d '{"title":"Learn MERN","dueAt":"2025-09-30"}'
```

### Lấy danh sách công việc
```bash
curl http://localhost:5000/api/todos
```
Tham số hỗ trợ:
- `status=true|false` → lọc theo trạng thái  
- `from=YYYY-MM-DD&to=YYYY-MM-DD` → lọc theo deadline  
- `page=1&limit=5` → phân trang  

Ví dụ:
```bash
curl "http://localhost:5000/api/todos?status=false&page=1&limit=5"
```

### Cập nhật trạng thái
```bash
curl -X PUT http://localhost:5000/api/todos/<id>   -H "Content-Type: application/json"   -d '{"status":true}'
```

### Xóa công việc
```bash
curl -X DELETE http://localhost:5000/api/todos/<id>
```

### Thống kê
```bash
curl http://localhost:5000/api/todos/stats
# -> { "done": 2, "pending": 5 }
```

---

## Frontend (React + Vite)

### 1. Vào thư mục client
```bash
cd ../client
```

### 2. Tạo file `.env`
```env
VITE_API_BASE=http://localhost:5000
```

### 3. Cài dependencies
```bash
npm install
```

### 4. Chạy frontend
```bash
npm run dev
```

Mở trình duyệt:  
[http://localhost:5173](http://localhost:5173)

---

## Kết quả
- Thêm công việc (title + dueDate).  
- Hiển thị danh sách công việc.  
- Filter trạng thái (All | Done | Pending).  
- Filter theo ngày.  
- Phân trang.  
- Thống kê số công việc hoàn thành / chưa hoàn thành.  

---

## Tài khoản MongoDB Atlas
- **Username**: `admin`  
- **Password**: `example_123`  
- **Cluster URI**:  
  ```
  mongodb+srv://admin:example_123@cluster0.p5f5kqm.mongodb.net/todos?retryWrites=true&w=majority
  ```
