// Lesson content - Chapters 1 & 2
const LESSON_CONTENT = {};

LESSON_CONTENT['what-is-sql'] = `
<h2>📘 SQL là gì?</h2>
<p><strong>SQL</strong> (Structured Query Language) là ngôn ngữ truy vấn có cấu trúc, dùng để giao tiếp với <strong>cơ sở dữ liệu quan hệ</strong> (Relational Database).</p>

<div class="info-box">
<strong>💡 Tại sao phải học SQL?</strong><br>
SQL là kỹ năng bắt buộc cho lập trình viên, data analyst, data engineer. Hầu hết mọi ứng dụng đều sử dụng database và cần SQL để tương tác với dữ liệu.
</div>

<h3>🎯 SQL dùng để làm gì?</h3>
<ul>
<li><strong>Truy vấn dữ liệu</strong> – Lấy thông tin từ database</li>
<li><strong>Thêm dữ liệu</strong> – Chèn bản ghi mới</li>
<li><strong>Cập nhật dữ liệu</strong> – Sửa đổi bản ghi</li>
<li><strong>Xóa dữ liệu</strong> – Xóa bản ghi</li>
<li><strong>Quản lý cấu trúc</strong> – Tạo/sửa bảng, index, view</li>
</ul>

<h3>🏢 Các hệ quản trị CSDL phổ biến</h3>
<table>
<tr><th>DBMS</th><th>Đặc điểm</th><th>Sử dụng</th></tr>
<tr><td>MySQL</td><td>Miễn phí, phổ biến nhất</td><td>Web apps</td></tr>
<tr><td>PostgreSQL</td><td>Mạnh mẽ, hỗ trợ JSON</td><td>Enterprise</td></tr>
<tr><td>SQL Server</td><td>Microsoft, tích hợp .NET</td><td>Doanh nghiệp</td></tr>
<tr><td>SQLite</td><td>Nhẹ, không cần server</td><td>Mobile, embedded</td></tr>
<tr><td>Oracle</td><td>Enterprise-grade</td><td>Ngân hàng, tài chính</td></tr>
</table>

<h3>📝 Câu lệnh SQL đầu tiên</h3>
<p>Hãy thử chạy câu lệnh SQL đầu tiên trong editor bên dưới:</p>
<div class="syntax-box">SELECT 'Xin chào SQL!' AS LoiChao;</div>
<button class="try-btn" onclick="trySQL(\`SELECT 'Xin chào SQL!' AS LoiChao;\`)">▶ Thử ngay</button>

<div class="info-box tip">
<strong>✅ Mẹo:</strong> Trong website này, bạn có thể thực hành SQL trực tiếp. Database mẫu đã được tạo sẵn với dữ liệu tiếng Việt!
</div>
`;

LESSON_CONTENT['db-tables'] = `
<h2>📘 Database & Tables</h2>
<p>Một <strong>Database</strong> (cơ sở dữ liệu) là tập hợp có tổ chức của dữ liệu. Bên trong database chứa nhiều <strong>Table</strong> (bảng).</p>

<h3>🗂️ Cấu trúc Database</h3>
<p>Hãy hình dung:</p>
<ul>
<li><strong>Database</strong> = Một tủ hồ sơ</li>
<li><strong>Table</strong> = Một ngăn kéo trong tủ</li>
<li><strong>Row</strong> (Hàng) = Một hồ sơ/bản ghi</li>
<li><strong>Column</strong> (Cột) = Một trường thông tin</li>
</ul>

<h3>📋 Ví dụ bảng SinhVien</h3>
<table>
<tr><th>MaSV</th><th>HoTen</th><th>Tuoi</th><th>Lop</th><th>DiemTB</th></tr>
<tr><td>1</td><td>Nguyễn Văn An</td><td>20</td><td>CNTT01</td><td>8.5</td></tr>
<tr><td>2</td><td>Trần Thị Bình</td><td>21</td><td>CNTT02</td><td>9.0</td></tr>
<tr><td>3</td><td>Lê Hoàng Cường</td><td>22</td><td>CNTT01</td><td>7.8</td></tr>
</table>

<h3>🔨 Tạo bảng với CREATE TABLE</h3>
<div class="syntax-box">CREATE TABLE TenBang (
    TenCot1 KieuDuLieu,
    TenCot2 KieuDuLieu,
    ...
);</div>

<p>Ví dụ tạo bảng SinhVien:</p>
<pre><code>CREATE TABLE SinhVien (
    MaSV INTEGER PRIMARY KEY,
    HoTen TEXT NOT NULL,
    Tuoi INTEGER,
    Lop TEXT,
    DiemTB REAL
);</code></pre>

<h3>👀 Xem tất cả dữ liệu trong bảng</h3>
<button class="try-btn" onclick="trySQL('SELECT * FROM SinhVien;')">▶ Xem bảng SinhVien</button>
<button class="try-btn" onclick="trySQL('SELECT * FROM SanPham;')">▶ Xem bảng SanPham</button>

<div class="info-box">
<strong>📌 Lưu ý:</strong> Bấm "Reset DB" trong SQL Editor nếu bạn muốn khôi phục dữ liệu mẫu ban đầu.
</div>
`;

LESSON_CONTENT['data-types'] = `
<h2>📘 Kiểu Dữ Liệu SQL</h2>
<p>Mỗi cột trong bảng phải có một <strong>kiểu dữ liệu</strong> xác định loại giá trị mà cột đó lưu trữ.</p>

<h3>📊 Các kiểu dữ liệu phổ biến</h3>
<table>
<tr><th>Kiểu</th><th>Mô tả</th><th>Ví dụ</th></tr>
<tr><td><code>INTEGER</code></td><td>Số nguyên</td><td>1, 42, -10</td></tr>
<tr><td><code>REAL / FLOAT</code></td><td>Số thực</td><td>3.14, 8.5</td></tr>
<tr><td><code>TEXT / VARCHAR</code></td><td>Chuỗi ký tự</td><td>'Nguyễn Văn A'</td></tr>
<tr><td><code>DATE</code></td><td>Ngày tháng</td><td>'2024-01-15'</td></tr>
<tr><td><code>BOOLEAN</code></td><td>Đúng/Sai</td><td>TRUE, FALSE</td></tr>
<tr><td><code>BLOB</code></td><td>Dữ liệu nhị phân</td><td>Hình ảnh, file</td></tr>
</table>

<h3>🔍 Kiểm tra kiểu dữ liệu</h3>
<p>Dùng <code>typeof()</code> trong SQLite để kiểm tra kiểu:</p>
<button class="try-btn" onclick="trySQL(\`SELECT typeof(42) AS SoNguyen, typeof(3.14) AS SoThuc, typeof('ABC') AS Chuoi;\`)">▶ Thử ngay</button>

<div class="info-box tip">
<strong>✅ Mẹo:</strong> Chọn kiểu dữ liệu phù hợp giúp tiết kiệm bộ nhớ và tăng hiệu suất truy vấn.
</div>
`;

LESSON_CONTENT['crud'] = `
<h2>📘 CRUD Operations</h2>
<p><strong>CRUD</strong> là viết tắt của 4 thao tác cơ bản nhất với dữ liệu:</p>
<table>
<tr><th>Chữ cái</th><th>Thao tác</th><th>Câu lệnh SQL</th></tr>
<tr><td><strong>C</strong></td><td>Create (Tạo)</td><td><code>INSERT INTO</code></td></tr>
<tr><td><strong>R</strong></td><td>Read (Đọc)</td><td><code>SELECT</code></td></tr>
<tr><td><strong>U</strong></td><td>Update (Cập nhật)</td><td><code>UPDATE</code></td></tr>
<tr><td><strong>D</strong></td><td>Delete (Xóa)</td><td><code>DELETE</code></td></tr>
</table>

<h3>➕ INSERT – Thêm dữ liệu</h3>
<div class="syntax-box">INSERT INTO TenBang (Cot1, Cot2) VALUES (GiaTri1, GiaTri2);</div>
<button class="try-btn" onclick="trySQL(\`INSERT INTO SinhVien (HoTen, Tuoi, GioiTinh, Lop, DiemTB) VALUES ('Phạm Văn Test', 20, 'Nam', 'CNTT01', 8.0);\\nSELECT * FROM SinhVien;\`)">▶ Thêm sinh viên mới</button>

<h3>📖 SELECT – Đọc dữ liệu</h3>
<div class="syntax-box">SELECT Cot1, Cot2 FROM TenBang;</div>
<button class="try-btn" onclick="trySQL('SELECT HoTen, DiemTB FROM SinhVien;')">▶ Xem tên và điểm</button>

<h3>✏️ UPDATE – Cập nhật dữ liệu</h3>
<div class="syntax-box">UPDATE TenBang SET Cot1 = GiaTri1 WHERE DieuKien;</div>
<button class="try-btn" onclick="trySQL(\`UPDATE SinhVien SET DiemTB = 9.5 WHERE MaSV = 1;\\nSELECT * FROM SinhVien WHERE MaSV = 1;\`)">▶ Cập nhật điểm</button>

<h3>🗑️ DELETE – Xóa dữ liệu</h3>
<div class="syntax-box">DELETE FROM TenBang WHERE DieuKien;</div>

<div class="info-box warning">
<strong>⚠️ Cảnh báo:</strong> Luôn dùng <code>WHERE</code> khi UPDATE hoặc DELETE. Nếu không, <strong>toàn bộ bảng</strong> sẽ bị ảnh hưởng!
</div>
`;

// Chapter 2: Queries
LESSON_CONTENT['select'] = `
<h2>🔍 Câu Lệnh SELECT</h2>
<p><code>SELECT</code> là câu lệnh được sử dụng nhiều nhất trong SQL, dùng để <strong>truy vấn và lấy dữ liệu</strong> từ bảng.</p>

<h3>📝 Cú pháp cơ bản</h3>
<div class="syntax-box">-- Lấy cột cụ thể
SELECT Cot1, Cot2 FROM TenBang;

-- Lấy tất cả các cột
SELECT * FROM TenBang;</div>

<h3>🎯 Ví dụ thực hành</h3>
<p><strong>1. Lấy tất cả sinh viên:</strong></p>
<button class="try-btn" onclick="trySQL('SELECT * FROM SinhVien;')">▶ Thử ngay</button>

<p><strong>2. Chỉ lấy tên và điểm:</strong></p>
<button class="try-btn" onclick="trySQL('SELECT HoTen, DiemTB FROM SinhVien;')">▶ Thử ngay</button>

<p><strong>3. Đặt tên khác cho cột (Alias):</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT HoTen AS 'Họ Tên', DiemTB AS 'Điểm TB' FROM SinhVien;\`)">▶ Thử ngay</button>

<p><strong>4. Tính toán trong SELECT:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT HoTen, DiemTB, DiemTB * 10 AS 'Điểm Hệ 100' FROM SinhVien;\`)">▶ Thử ngay</button>

<div class="info-box tip">
<strong>✅ Mẹo:</strong> Tránh dùng <code>SELECT *</code> trong thực tế. Chỉ lấy những cột cần thiết để tăng hiệu suất.
</div>
`;

LESSON_CONTENT['where'] = `
<h2>🔍 Mệnh Đề WHERE</h2>
<p><code>WHERE</code> dùng để <strong>lọc dữ liệu</strong> theo điều kiện. Chỉ những hàng thỏa mãn điều kiện mới được trả về.</p>

<h3>📝 Cú pháp</h3>
<div class="syntax-box">SELECT * FROM TenBang WHERE DieuKien;</div>

<h3>⚡ Các toán tử so sánh</h3>
<table>
<tr><th>Toán tử</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>=</code></td><td>Bằng</td><td>Tuoi = 20</td></tr>
<tr><td><code>!=</code> hoặc <code>&lt;&gt;</code></td><td>Khác</td><td>Lop != 'CNTT01'</td></tr>
<tr><td><code>&gt;</code></td><td>Lớn hơn</td><td>DiemTB > 8</td></tr>
<tr><td><code>&lt;</code></td><td>Nhỏ hơn</td><td>Gia < 50000</td></tr>
<tr><td><code>BETWEEN</code></td><td>Trong khoảng</td><td>Tuoi BETWEEN 20 AND 25</td></tr>
<tr><td><code>LIKE</code></td><td>Tìm kiếm mẫu</td><td>HoTen LIKE 'Nguyễn%'</td></tr>
<tr><td><code>IN</code></td><td>Trong danh sách</td><td>Lop IN ('CNTT01','CNTT02')</td></tr>
<tr><td><code>IS NULL</code></td><td>Giá trị NULL</td><td>Email IS NULL</td></tr>
</table>

<h3>🎯 Thực hành</h3>
<p><strong>1. Sinh viên có điểm >= 8:</strong></p>
<button class="try-btn" onclick="trySQL('SELECT * FROM SinhVien WHERE DiemTB >= 8;')">▶ Thử ngay</button>

<p><strong>2. Kết hợp AND/OR:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT * FROM SinhVien WHERE Lop = 'CNTT01' AND DiemTB > 7;\`)">▶ Thử ngay</button>

<p><strong>3. Dùng LIKE tìm tên:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT * FROM SinhVien WHERE HoTen LIKE 'Nguyễn%';\`)">▶ Tìm họ Nguyễn</button>

<p><strong>4. Dùng BETWEEN:</strong></p>
<button class="try-btn" onclick="trySQL('SELECT * FROM SinhVien WHERE Tuoi BETWEEN 20 AND 22;')">▶ Thử ngay</button>

<div class="info-box">
<strong>💡 Ghi nhớ:</strong> <code>%</code> đại diện cho nhiều ký tự, <code>_</code> đại diện cho 1 ký tự trong LIKE.
</div>
`;

LESSON_CONTENT['orderby-groupby'] = `
<h2>🔍 ORDER BY & GROUP BY</h2>

<h3>📊 ORDER BY – Sắp xếp kết quả</h3>
<p>Dùng <code>ORDER BY</code> để sắp xếp kết quả theo thứ tự tăng dần (<code>ASC</code>) hoặc giảm dần (<code>DESC</code>).</p>

<div class="syntax-box">SELECT * FROM TenBang ORDER BY TenCot ASC|DESC;</div>

<button class="try-btn" onclick="trySQL('SELECT * FROM SinhVien ORDER BY DiemTB DESC;')">▶ Sắp xếp theo điểm giảm dần</button>
<button class="try-btn" onclick="trySQL('SELECT * FROM SinhVien ORDER BY HoTen ASC;')">▶ Sắp xếp theo tên A-Z</button>

<h3>📦 GROUP BY – Nhóm dữ liệu</h3>
<p><code>GROUP BY</code> nhóm các hàng có cùng giá trị thành các nhóm tóm tắt.</p>

<div class="syntax-box">SELECT Cot, HamTongHop(Cot2)
FROM TenBang
GROUP BY Cot;</div>

<button class="try-btn" onclick="trySQL(\`SELECT Lop, COUNT(*) AS SoSV, AVG(DiemTB) AS DiemTBLop FROM SinhVien GROUP BY Lop;\`)">▶ Thống kê theo lớp</button>

<h3>🔎 HAVING – Lọc sau khi nhóm</h3>
<p><code>HAVING</code> giống WHERE nhưng dùng sau GROUP BY:</p>
<button class="try-btn" onclick="trySQL(\`SELECT Lop, COUNT(*) AS SoSV, AVG(DiemTB) AS DiemTB FROM SinhVien GROUP BY Lop HAVING AVG(DiemTB) > 7.5;\`)">▶ Lớp có ĐTB > 7.5</button>

<div class="info-box">
<strong>💡 WHERE vs HAVING:</strong><br>
• <code>WHERE</code> lọc <strong>trước</strong> khi nhóm (lọc từng hàng)<br>
• <code>HAVING</code> lọc <strong>sau</strong> khi nhóm (lọc nhóm kết quả)
</div>
`;

LESSON_CONTENT['limit-distinct'] = `
<h2>🔍 LIMIT & DISTINCT</h2>

<h3>🔢 LIMIT – Giới hạn kết quả</h3>
<p><code>LIMIT</code> giới hạn số hàng trả về. Rất hữu ích khi bảng có hàng triệu bản ghi.</p>

<div class="syntax-box">SELECT * FROM TenBang LIMIT SoHang;
SELECT * FROM TenBang LIMIT SoHang OFFSET ViTriBatDau;</div>

<button class="try-btn" onclick="trySQL('SELECT * FROM SinhVien LIMIT 3;')">▶ Lấy 3 sinh viên đầu</button>
<button class="try-btn" onclick="trySQL('SELECT * FROM SinhVien ORDER BY DiemTB DESC LIMIT 3;')">▶ Top 3 điểm cao nhất</button>

<h3>🎯 DISTINCT – Loại bỏ trùng lặp</h3>
<p><code>DISTINCT</code> chỉ trả về các giá trị duy nhất (không trùng).</p>

<div class="syntax-box">SELECT DISTINCT TenCot FROM TenBang;</div>

<button class="try-btn" onclick="trySQL('SELECT DISTINCT Lop FROM SinhVien;')">▶ Danh sách lớp (không trùng)</button>
<button class="try-btn" onclick="trySQL('SELECT DISTINCT GioiTinh FROM SinhVien;')">▶ Giới tính (không trùng)</button>
<button class="try-btn" onclick="trySQL('SELECT DISTINCT DanhMuc FROM SanPham;')">▶ Danh mục sản phẩm</button>

<div class="info-box tip">
<strong>✅ Kết hợp:</strong> Bạn có thể kết hợp DISTINCT với COUNT để đếm giá trị duy nhất:
</div>
<button class="try-btn" onclick="trySQL(\`SELECT COUNT(DISTINCT Lop) AS SoLop FROM SinhVien;\`)">▶ Đếm số lớp</button>
`;
