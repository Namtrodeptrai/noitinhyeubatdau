// Lesson content - Chapters 6, 7, 8, 9, 10

// Chapter 6: Constraints
LESSON_CONTENT['primary-key'] = `
<h2>🔒 PRIMARY KEY</h2>
<p><strong>PRIMARY KEY</strong> (khóa chính) là cột hoặc nhóm cột xác định <strong>duy nhất</strong> mỗi hàng trong bảng.</p>

<h3>📋 Đặc điểm</h3>
<ul>
<li>Giá trị phải <strong>duy nhất</strong> (không trùng)</li>
<li>Không được <strong>NULL</strong></li>
<li>Mỗi bảng chỉ có <strong>một</strong> PRIMARY KEY</li>
<li>Thường dùng cột ID tự tăng</li>
</ul>

<h3>📝 Cú pháp</h3>
<pre><code>CREATE TABLE Vidu (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    TenCot TEXT NOT NULL
);</code></pre>

<button class="try-btn" onclick="trySQL(\`CREATE TABLE TestPK (ID INTEGER PRIMARY KEY AUTOINCREMENT, Ten TEXT);
INSERT INTO TestPK (Ten) VALUES ('A'), ('B'), ('C');
SELECT * FROM TestPK;\`)">▶ Tạo bảng với PK</button>

<div class="info-box">
<strong>💡 AUTOINCREMENT:</strong> Tự động tăng giá trị ID mỗi khi thêm hàng mới.
</div>
`;

LESSON_CONTENT['foreign-key'] = `
<h2>🔒 FOREIGN KEY</h2>
<p><strong>FOREIGN KEY</strong> (khóa ngoại) liên kết dữ liệu giữa hai bảng, đảm bảo <strong>tính toàn vẹn tham chiếu</strong>.</p>

<h3>📝 Cú pháp</h3>
<pre><code>CREATE TABLE DonHang (
    MaDH INTEGER PRIMARY KEY,
    MaKH INTEGER,
    FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
);</code></pre>

<h3>🎯 Ví dụ minh họa</h3>
<p>Bảng DonHang tham chiếu đến KhachHang qua MaKH:</p>
<button class="try-btn" onclick="trySQL(\`SELECT DH.MaDH, KH.HoTen, DH.TongTien
FROM DonHang DH
JOIN KhachHang KH ON DH.MaKH = KH.MaKH;\`)">▶ Xem liên kết FK</button>

<div class="info-box warning">
<strong>⚠️ Quan trọng:</strong> FK đảm bảo bạn không thể thêm MaKH không tồn tại vào bảng DonHang.
</div>
`;

LESSON_CONTENT['unique-notnull-check'] = `
<h2>🔒 UNIQUE, NOT NULL, CHECK</h2>

<h3>🔹 UNIQUE – Giá trị duy nhất</h3>
<p>Đảm bảo tất cả giá trị trong cột là <strong>khác nhau</strong>.</p>
<pre><code>CREATE TABLE Users (
    Email TEXT UNIQUE,
    Username TEXT UNIQUE
);</code></pre>

<h3>🔹 NOT NULL – Không cho phép NULL</h3>
<p>Bắt buộc cột phải có giá trị:</p>
<pre><code>HoTen TEXT NOT NULL</code></pre>

<h3>🔹 CHECK – Kiểm tra điều kiện</h3>
<p>Đảm bảo giá trị thỏa mãn điều kiện:</p>
<pre><code>Tuoi INTEGER CHECK(Tuoi >= 0 AND Tuoi <= 150),
DiemTB REAL CHECK(DiemTB >= 0 AND DiemTB <= 10)</code></pre>

<button class="try-btn" onclick="trySQL(\`CREATE TABLE TestConstraint (
  ID INTEGER PRIMARY KEY,
  Email TEXT UNIQUE NOT NULL,
  Tuoi INTEGER CHECK(Tuoi >= 18)
);
INSERT INTO TestConstraint VALUES (1, 'a@test.com', 20);
INSERT INTO TestConstraint VALUES (2, 'b@test.com', 25);
SELECT * FROM TestConstraint;\`)">▶ Tạo bảng với constraints</button>

<h3>🔹 DEFAULT – Giá trị mặc định</h3>
<pre><code>TrangThai TEXT DEFAULT 'Chờ xử lý'</code></pre>
`;

// Chapter 7: Indexes & Views
LESSON_CONTENT['indexes'] = `
<h2>📊 Indexes (Chỉ mục)</h2>
<p><strong>Index</strong> giống như mục lục sách - giúp database tìm dữ liệu <strong>nhanh hơn</strong> mà không cần quét toàn bộ bảng.</p>

<h3>📝 Tạo Index</h3>
<div class="syntax-box">CREATE INDEX TenIndex ON TenBang(TenCot);</div>

<button class="try-btn" onclick="trySQL(\`CREATE INDEX idx_sv_lop ON SinhVien(Lop);
CREATE INDEX idx_sp_danhmuc ON SanPham(DanhMuc);
SELECT 'Đã tạo index thành công!' AS KetQua;\`)">▶ Tạo index</button>

<h3>⚡ Khi nào dùng Index?</h3>
<ul>
<li>✅ Cột thường xuất hiện trong <code>WHERE</code>, <code>JOIN</code>, <code>ORDER BY</code></li>
<li>✅ Bảng có nhiều dữ liệu (hàng nghìn/triệu bản ghi)</li>
<li>❌ Bảng nhỏ - index không cần thiết</li>
<li>❌ Cột thường xuyên UPDATE - index làm chậm ghi</li>
</ul>

<h3>🗑️ Xóa Index</h3>
<div class="syntax-box">DROP INDEX TenIndex;</div>
`;

LESSON_CONTENT['views'] = `
<h2>📊 Views (Bảng ảo)</h2>
<p><strong>View</strong> là một câu SELECT được lưu lại dưới dạng "bảng ảo". Dữ liệu không lưu thực tế mà tính khi truy vấn.</p>

<h3>📝 Tạo View</h3>
<div class="syntax-box">CREATE VIEW TenView AS
SELECT ... FROM ... WHERE ...;</div>

<button class="try-btn" onclick="trySQL(\`CREATE VIEW SinhVienGioi AS
SELECT HoTen, Lop, DiemTB FROM SinhVien WHERE DiemTB >= 8.0;

SELECT * FROM SinhVienGioi;\`)">▶ Tạo & dùng View</button>

<button class="try-btn" onclick="trySQL(\`CREATE VIEW ThongKeKH AS
SELECT KH.HoTen, COUNT(DH.MaDH) AS SoDon, COALESCE(SUM(DH.TongTien),0) AS TongChi
FROM KhachHang KH LEFT JOIN DonHang DH ON KH.MaKH = DH.MaKH
GROUP BY KH.HoTen;

SELECT * FROM ThongKeKH ORDER BY TongChi DESC;\`)">▶ View thống kê KH</button>

<h3>✅ Lợi ích của View</h3>
<ul>
<li>Đơn giản hóa truy vấn phức tạp</li>
<li>Bảo mật - giới hạn cột người dùng thấy</li>
<li>Tái sử dụng logic truy vấn</li>
</ul>

<h3>🗑️ Xóa View</h3>
<div class="syntax-box">DROP VIEW TenView;</div>
`;

// Chapter 8: Transactions
LESSON_CONTENT['transaction-basics'] = `
<h2>🔄 Transactions</h2>
<p><strong>Transaction</strong> là một nhóm câu lệnh SQL được thực thi như <strong>một đơn vị</strong>. Hoặc tất cả thành công, hoặc tất cả bị hủy.</p>

<h3>📝 Cú pháp</h3>
<div class="syntax-box">BEGIN TRANSACTION;
  -- Các câu lệnh SQL
  INSERT INTO ...
  UPDATE ...
COMMIT; -- Xác nhận thay đổi
-- hoặc ROLLBACK; để hủy bỏ</div>

<h3>🎯 Ví dụ: Chuyển tiền</h3>
<button class="try-btn" onclick="trySQL(\`-- Mô phỏng chuyển tiền giữa 2 KH
BEGIN TRANSACTION;
UPDATE KhachHang SET SoDienThoai = '0901111111' WHERE MaKH = 1;
UPDATE KhachHang SET SoDienThoai = '0902222222' WHERE MaKH = 2;
COMMIT;
SELECT MaKH, HoTen, SoDienThoai FROM KhachHang WHERE MaKH IN (1,2);\`)">▶ Transaction cập nhật</button>

<h3>📋 Tóm tắt</h3>
<table>
<tr><th>Lệnh</th><th>Mô tả</th></tr>
<tr><td><code>BEGIN</code></td><td>Bắt đầu transaction</td></tr>
<tr><td><code>COMMIT</code></td><td>Xác nhận & lưu thay đổi</td></tr>
<tr><td><code>ROLLBACK</code></td><td>Hủy bỏ tất cả thay đổi</td></tr>
<tr><td><code>SAVEPOINT</code></td><td>Tạo điểm lưu trong transaction</td></tr>
</table>
`;

LESSON_CONTENT['acid'] = `
<h2>🔄 ACID Properties</h2>
<p>ACID là 4 tính chất đảm bảo <strong>tính toàn vẹn</strong> của transactions:</p>

<h3>🅰️ Atomicity (Nguyên tử)</h3>
<p>Transaction là "tất cả hoặc không gì cả". Nếu một phần thất bại, toàn bộ bị rollback.</p>

<h3>🅱️ Consistency (Nhất quán)</h3>
<p>Database luôn chuyển từ trạng thái hợp lệ này sang trạng thái hợp lệ khác. Mọi ràng buộc đều được đảm bảo.</p>

<h3>🅲 Isolation (Cô lập)</h3>
<p>Các transaction đồng thời không ảnh hưởng lẫn nhau. Mỗi transaction "thấy" dữ liệu như chạy riêng lẻ.</p>

<h3>🅳 Durability (Bền vững)</h3>
<p>Khi transaction đã COMMIT, dữ liệu được lưu vĩnh viễn, kể cả khi hệ thống gặp sự cố.</p>

<div class="info-box">
<strong>💡 Ví dụ thực tế:</strong> Khi chuyển khoản ngân hàng, ACID đảm bảo tiền trừ tài khoản A và cộng tài khoản B luôn đồng bộ. Không bao giờ xảy ra trường hợp trừ rồi mà chưa cộng.
</div>
`;

// Chapter 9: Normalization
LESSON_CONTENT['normal-forms'] = `
<h2>📐 Chuẩn Hóa: 1NF, 2NF, 3NF</h2>
<p><strong>Chuẩn hóa</strong> (Normalization) là quá trình tổ chức database để <strong>giảm dư thừa</strong> và <strong>tăng tính toàn vẹn</strong>.</p>

<h3>1️⃣ First Normal Form (1NF)</h3>
<p>Quy tắc: Mỗi ô chỉ chứa <strong>một giá trị</strong> (không có danh sách).</p>
<table>
<tr><th>❌ Vi phạm 1NF</th><th>✅ Đúng 1NF</th></tr>
<tr><td>SĐT: "0901, 0902"</td><td>Mỗi SĐT một hàng riêng</td></tr>
<tr><td>Môn: "Toán, Lý"</td><td>Tạo bảng riêng cho Môn học</td></tr>
</table>

<h3>2️⃣ Second Normal Form (2NF)</h3>
<p>Quy tắc: Đã đạt 1NF + mọi cột không khóa phụ thuộc vào <strong>toàn bộ</strong> khóa chính.</p>

<h3>3️⃣ Third Normal Form (3NF)</h3>
<p>Quy tắc: Đã đạt 2NF + không có <strong>phụ thuộc bắc cầu</strong> (cột A phụ thuộc cột B, B phụ thuộc khóa chính).</p>

<div class="info-box tip">
<strong>✅ Quy tắc đơn giản:</strong> "Mỗi cột phụ thuộc vào khóa chính, toàn bộ khóa chính, và chỉ khóa chính mà thôi."
</div>
`;

LESSON_CONTENT['avoiding-redundancy'] = `
<h2>📐 Tránh Dư Thừa Dữ Liệu</h2>
<p>Dữ liệu dư thừa gây ra nhiều vấn đề: lãng phí bộ nhớ, không nhất quán khi cập nhật.</p>

<h3>❌ Ví dụ dư thừa</h3>
<pre><code>-- Bảng BAD: thông tin KH lặp lại mỗi đơn hàng
| DonHang | TenKH      | EmailKH       | SanPham   |
| DH001   | Nguyễn An  | an@mail.com   | Laptop    |
| DH002   | Nguyễn An  | an@mail.com   | Chuột     |</code></pre>

<h3>✅ Sau khi chuẩn hóa</h3>
<pre><code>-- Bảng KhachHang
| MaKH | TenKH      | EmailKH       |
| 1    | Nguyễn An  | an@mail.com   |

-- Bảng DonHang (chỉ lưu MaKH)
| MaDH  | MaKH | SanPham |
| DH001 | 1    | Laptop  |
| DH002 | 1    | Chuột  |</code></pre>

<button class="try-btn" onclick="trySQL(\`-- Xem cách database mẫu đã được chuẩn hóa
SELECT DH.MaDH, KH.HoTen, KH.Email, DH.TongTien
FROM DonHang DH JOIN KhachHang KH ON DH.MaKH = KH.MaKH;\`)">▶ Xem ví dụ chuẩn hóa</button>

<div class="info-box">
<strong>💡 Lợi ích:</strong> Cập nhật email chỉ cần sửa 1 nơi thay vì nhiều hàng.
</div>
`;

// Chapter 10: Advanced
LESSON_CONTENT['stored-procedures'] = `
<h2>🚀 Stored Procedures</h2>
<p><strong>Stored Procedure</strong> là một nhóm câu lệnh SQL được lưu trữ sẵn trong database để tái sử dụng.</p>

<div class="info-box warning">
<strong>⚠️ Lưu ý:</strong> SQLite không hỗ trợ Stored Procedures. Đây là kiến thức cho MySQL/PostgreSQL/SQL Server.
</div>

<h3>📝 Cú pháp (MySQL)</h3>
<pre><code>DELIMITER //
CREATE PROCEDURE TimSinhVien(IN tenSV VARCHAR(100))
BEGIN
    SELECT * FROM SinhVien WHERE HoTen LIKE CONCAT('%', tenSV, '%');
END //
DELIMITER ;

-- Gọi procedure
CALL TimSinhVien('Nguyễn');</code></pre>

<h3>✅ Lợi ích</h3>
<ul>
<li>Tái sử dụng code SQL</li>
<li>Bảo mật - người dùng chỉ gọi procedure</li>
<li>Hiệu suất - SQL được compile sẵn</li>
<li>Giảm traffic mạng</li>
</ul>
`;

LESSON_CONTENT['triggers'] = `
<h2>🚀 Triggers</h2>
<p><strong>Trigger</strong> là code SQL tự động chạy khi xảy ra sự kiện (INSERT, UPDATE, DELETE) trên bảng.</p>

<h3>📝 Cú pháp SQLite</h3>
<div class="syntax-box">CREATE TRIGGER TenTrigger
AFTER INSERT ON TenBang
BEGIN
    -- Code thực thi
END;</div>

<button class="try-btn" onclick="trySQL(\`CREATE TABLE LogThayDoi (ID INTEGER PRIMARY KEY AUTOINCREMENT, NoiDung TEXT, ThoiGian TEXT);

CREATE TRIGGER log_sv_moi AFTER INSERT ON SinhVien
BEGIN
  INSERT INTO LogThayDoi (NoiDung, ThoiGian)
  VALUES ('Thêm SV: ' || NEW.HoTen, DATETIME('now'));
END;

INSERT INTO SinhVien (HoTen, Tuoi, GioiTinh, Lop, DiemTB) VALUES ('Trigger Test', 21, 'Nam', 'CNTT01', 7.5);
SELECT * FROM LogThayDoi;\`)">▶ Tạo & test Trigger</button>

<h3>📋 Loại Trigger</h3>
<table>
<tr><th>Loại</th><th>Khi nào chạy</th></tr>
<tr><td>BEFORE INSERT</td><td>Trước khi thêm</td></tr>
<tr><td>AFTER INSERT</td><td>Sau khi thêm</td></tr>
<tr><td>BEFORE UPDATE</td><td>Trước khi cập nhật</td></tr>
<tr><td>AFTER DELETE</td><td>Sau khi xóa</td></tr>
</table>
`;

LESSON_CONTENT['window-functions'] = `
<h2>🚀 Window Functions</h2>
<p><strong>Window Functions</strong> tính toán trên một "cửa sổ" các hàng liên quan đến hàng hiện tại, mà <strong>không gộp</strong> kết quả.</p>

<h3>📝 Cú pháp</h3>
<div class="syntax-box">SELECT Cot,
  HamWindow() OVER (
    PARTITION BY CotNhom
    ORDER BY CotSapXep
  )
FROM TenBang;</div>

<h3>📊 Các hàm Window phổ biến</h3>
<table>
<tr><th>Hàm</th><th>Mô tả</th></tr>
<tr><td><code>ROW_NUMBER()</code></td><td>Số thứ tự hàng</td></tr>
<tr><td><code>RANK()</code></td><td>Xếp hạng (bỏ hạng khi trùng)</td></tr>
<tr><td><code>DENSE_RANK()</code></td><td>Xếp hạng (không bỏ hạng)</td></tr>
<tr><td><code>SUM() OVER()</code></td><td>Tổng tích lũy</td></tr>
<tr><td><code>AVG() OVER()</code></td><td>Trung bình cửa sổ</td></tr>
</table>

<button class="try-btn" onclick="trySQL(\`SELECT HoTen, Lop, DiemTB,
  RANK() OVER (ORDER BY DiemTB DESC) AS XepHang,
  RANK() OVER (PARTITION BY Lop ORDER BY DiemTB DESC) AS XepHangLop
FROM SinhVien;\`)">▶ RANK toàn trường & theo lớp</button>

<button class="try-btn" onclick="trySQL(\`SELECT TenSP, DanhMuc, Gia,
  SUM(Gia) OVER (PARTITION BY DanhMuc ORDER BY Gia) AS TongTichLuy
FROM SanPham;\`)">▶ Tổng tích lũy theo danh mục</button>
`;

LESSON_CONTENT['cte'] = `
<h2>🚀 CTEs (WITH Clause)</h2>
<p><strong>CTE</strong> (Common Table Expression) là bảng tạm có tên, định nghĩa bằng <code>WITH</code>, giúp code dễ đọc hơn subquery.</p>

<h3>📝 Cú pháp</h3>
<div class="syntax-box">WITH TenCTE AS (
    SELECT ... FROM ...
)
SELECT * FROM TenCTE;</div>

<h3>🎯 Thực hành</h3>
<button class="try-btn" onclick="trySQL(\`WITH SVGioi AS (
  SELECT * FROM SinhVien WHERE DiemTB >= 8.0
)
SELECT Lop, COUNT(*) AS SoSVGioi, ROUND(AVG(DiemTB),2) AS DiemTB
FROM SVGioi GROUP BY Lop;\`)">▶ CTE đơn giản</button>

<p><strong>Nhiều CTE:</strong></p>
<button class="try-btn" onclick="trySQL(\`WITH
  ThongKeLop AS (
    SELECT Lop, COUNT(*) AS SoSV, AVG(DiemTB) AS DiemTB FROM SinhVien GROUP BY Lop
  ),
  ThongKeDH AS (
    SELECT MaKH, COUNT(*) AS SoDon FROM DonHang GROUP BY MaKH
  )
SELECT * FROM ThongKeLop;\`)">▶ Nhiều CTE</button>

<div class="info-box tip">
<strong>✅ CTE vs Subquery:</strong> CTE dễ đọc hơn, có thể tái sử dụng trong cùng câu query, và hỗ trợ đệ quy (Recursive CTE).
</div>

<h3>🔄 Recursive CTE</h3>
<button class="try-btn" onclick="trySQL(\`WITH RECURSIVE DemSo(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM DemSo WHERE n < 10
)
SELECT n AS 'Số' FROM DemSo;\`)">▶ Đếm 1 đến 10 (Recursive)</button>
`;
