# Deploy SQL Master

Ứng dụng có thể chạy theo 2 kiểu:

- **Vercel + KV/Upstash Redis**: dùng serverless API trong thư mục `api/` để đăng nhập/lưu tiến độ tập trung. Mật khẩu được hash bằng bcrypt.
- **Render web service**: dùng `server.js` để có API đăng nhập và lưu tiến độ trên server có disk. Mật khẩu được hash bằng bcrypt.

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
BCRYPT_ROUNDS=12
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

Vercel không phù hợp với `server.js` dạng long-running server ghi file `data/users.json`. Bản này dùng serverless API trong `api/` và cần một KV/Redis REST store để tài khoản dùng được trên nhiều thiết bị.

```text
vercel.json
.vercelignore
```

Cấu hình storage trước khi deploy:

1. Tạo Vercel KV hoặc Upstash Redis.
2. Thêm biến môi trường vào Vercel Project:

```text
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
BCRYPT_ROUNDS=12
```

Hoặc dùng tên biến Upstash:

```text
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
BCRYPT_ROUNDS=12
```

Nếu thiếu KV/Redis env, `/api/health` sẽ trả `dynamic: false`; app vẫn học được bằng tiến độ local/guest nhưng sẽ không tạo tài khoản dùng chung nhiều thiết bị.

Các file lớn/local không được đưa lên Vercel:

```text
node-v22.15.0-win-x64/
node.zip
node-installer.msi
data/
render.yaml
```

Cách deploy:

1. Đưa project lên GitHub.
2. Vào Vercel, chọn **New Project** và import repo.
3. Framework chọn **Other** nếu Vercel hỏi.
4. Build Command để trống, Install Command dùng `npm install`, Output Directory là `.` theo `vercel.json`.
5. Deploy xong mở URL Vercel.

Sau khi deploy, kiểm tra:

```text
https://your-domain.vercel.app/api/health
```

Kết quả đúng khi storage đã bật:

```json
{"ok":true,"dynamic":true,"storage":"redis","password":"bcrypt"}
```
