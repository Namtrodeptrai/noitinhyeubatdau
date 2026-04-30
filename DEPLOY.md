# Deploy SQL Master

Ứng dụng có thể chạy theo 2 kiểu:

- **Vercel static**: phù hợp nhất để public web học SQL nhanh. SQL Bot, bài giảng, bài tập và tiến độ vẫn chạy bằng trình duyệt/localStorage. Tài khoản nếu dùng sẽ là tài khoản local trên từng trình duyệt.
- **Render web service**: dùng `server.js` để có API đăng nhập và lưu tiến độ trên server có disk.

## Chạy local khi đã cài Node.js

```bash
npm install
npm start
```

Mở:

```text
http://localhost:8080
```

## Deploy Render

1. Đưa thư mục này lên GitHub.
2. Vào Render, chọn **New Web Service** và kết nối repo.
3. Render sẽ đọc `render.yaml`.
4. Deploy xong, mở URL Render cấp.

Backend lưu dữ liệu vào:

```text
data/users.json
```

Trên Render, `render.yaml` đã khai báo disk 1GB để dữ liệu tài khoản/progress không mất sau mỗi lần restart.

## Biến môi trường

Render tự cấp `PORT`. Có thể cấu hình thêm:

```text
NODE_ENV=production
DATA_DIR=/opt/render/project/src/data
```

Chatbot hiện dùng SQL Bot nội bộ, không cần cấu hình API key.

## API hiện có

```text
GET  /api/health
GET  /api/auth/me
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/progress
PUT  /api/progress
```

Nếu mở bằng `file://`, app vẫn chạy fallback bằng localStorage, nhưng để nhiều người dùng chung tài khoản/progress thì phải chạy qua backend.

## Deploy Vercel

Vercel không phù hợp với `server.js` dạng long-running server ghi file `data/users.json`, nên project đã có cấu hình static:

```text
vercel.json
.vercelignore
```

Các file lớn/local không được đưa lên Vercel:

```text
node-v22.15.0-win-x64/
node.zip
node-installer.msi
data/
server.js
render.yaml
```

Cách deploy:

1. Đưa project lên GitHub.
2. Vào Vercel, chọn **New Project** và import repo.
3. Framework chọn **Other** nếu Vercel hỏi.
4. Build Command và Install Command để trống, Output Directory là `.` theo `vercel.json`.
5. Deploy xong mở URL Vercel.

Trên Vercel, `/api/*` không dùng backend. `auth.js` sẽ tự fallback về localStorage, nên người học vẫn dùng web, SQL Bot, bài tập và tiến độ bình thường trên trình duyệt của họ.
