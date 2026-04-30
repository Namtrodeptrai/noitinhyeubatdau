// Lesson content - Chapters 3, 4, 5

// Chapter 3: Functions
LESSON_CONTENT['aggregate'] = `
<h2>⚡ Hàm Tổng Hợp (Aggregate)</h2>
<p>Hàm tổng hợp tính toán trên một <strong>tập hợp các giá trị</strong> và trả về <strong>một giá trị duy nhất</strong>.</p>

<h3>📊 Các hàm tổng hợp chính</h3>
<table>
<tr><th>Hàm</th><th>Mô tả</th></tr>
<tr><td><code>COUNT()</code></td><td>Đếm số hàng</td></tr>
<tr><td><code>SUM()</code></td><td>Tính tổng</td></tr>
<tr><td><code>AVG()</code></td><td>Tính trung bình</td></tr>
<tr><td><code>MIN()</code></td><td>Giá trị nhỏ nhất</td></tr>
<tr><td><code>MAX()</code></td><td>Giá trị lớn nhất</td></tr>
</table>

<h3>🎯 Thực hành</h3>
<button class="try-btn" onclick="trySQL('SELECT COUNT(*) AS TongSV FROM SinhVien;')">▶ Đếm sinh viên</button>
<button class="try-btn" onclick="trySQL('SELECT AVG(DiemTB) AS DiemTBChung FROM SinhVien;')">▶ Điểm TB chung</button>
<button class="try-btn" onclick="trySQL('SELECT MIN(Gia) AS GiaThapNhat, MAX(Gia) AS GiaCaoNhat FROM SanPham;')">▶ Giá min/max</button>
<button class="try-btn" onclick="trySQL('SELECT SUM(SoLuong) AS TongTonKho FROM SanPham;')">▶ Tổng tồn kho</button>
<button class="try-btn" onclick="trySQL(\`SELECT DanhMuc, COUNT(*) AS SoSP, AVG(Gia) AS GiaTB FROM SanPham GROUP BY DanhMuc;\`)">▶ Thống kê theo danh mục</button>

<div class="info-box">
<strong>💡 Lưu ý:</strong> <code>COUNT(*)</code> đếm tất cả hàng kể cả NULL. <code>COUNT(TenCot)</code> chỉ đếm giá trị không NULL.
</div>
`;

LESSON_CONTENT['string-funcs'] = `
<h2>⚡ Hàm Chuỗi (String Functions)</h2>
<p>Các hàm xử lý chuỗi ký tự trong SQL.</p>

<h3>📋 Hàm chuỗi phổ biến</h3>
<table>
<tr><th>Hàm</th><th>Mô tả</th><th>Ví dụ</th></tr>
<tr><td><code>UPPER()</code></td><td>Chuyển thành chữ hoa</td><td>UPPER('abc') → 'ABC'</td></tr>
<tr><td><code>LOWER()</code></td><td>Chuyển thành chữ thường</td><td>LOWER('ABC') → 'abc'</td></tr>
<tr><td><code>LENGTH()</code></td><td>Độ dài chuỗi</td><td>LENGTH('SQL') → 3</td></tr>
<tr><td><code>SUBSTR()</code></td><td>Trích xuất chuỗi con</td><td>SUBSTR('Hello',1,3) → 'Hel'</td></tr>
<tr><td><code>REPLACE()</code></td><td>Thay thế chuỗi</td><td>REPLACE('abc','a','x') → 'xbc'</td></tr>
<tr><td><code>TRIM()</code></td><td>Xóa khoảng trắng</td><td>TRIM('  hi  ') → 'hi'</td></tr>
<tr><td><code>||</code></td><td>Nối chuỗi (SQLite)</td><td>'A' || 'B' → 'AB'</td></tr>
</table>

<h3>🎯 Thực hành</h3>
<button class="try-btn" onclick="trySQL(\`SELECT HoTen, UPPER(HoTen) AS TenHoa, LENGTH(HoTen) AS DoDai FROM SinhVien;\`)">▶ UPPER & LENGTH</button>
<button class="try-btn" onclick="trySQL(\`SELECT HoTen || ' - Lớp ' || Lop AS ThongTin FROM SinhVien;\`)">▶ Nối chuỗi</button>
<button class="try-btn" onclick="trySQL(\`SELECT TenSP, REPLACE(TenSP, ' ', '_') AS TenKhongDau FROM SanPham LIMIT 5;\`)">▶ REPLACE</button>
`;

LESSON_CONTENT['date-funcs'] = `
<h2>⚡ Hàm Ngày Tháng (Date Functions)</h2>
<p>SQLite cung cấp các hàm xử lý ngày tháng:</p>

<h3>📅 Các hàm ngày giờ</h3>
<table>
<tr><th>Hàm</th><th>Mô tả</th></tr>
<tr><td><code>DATE('now')</code></td><td>Ngày hiện tại</td></tr>
<tr><td><code>TIME('now')</code></td><td>Giờ hiện tại</td></tr>
<tr><td><code>DATETIME('now')</code></td><td>Ngày giờ hiện tại</td></tr>
<tr><td><code>STRFTIME()</code></td><td>Định dạng ngày tùy chỉnh</td></tr>
<tr><td><code>JULIANDAY()</code></td><td>Chuyển sang Julian Day (tính khoảng cách ngày)</td></tr>
</table>

<h3>🎯 Thực hành</h3>
<button class="try-btn" onclick="trySQL(\`SELECT DATE('now') AS HomNay, TIME('now') AS BayGio, DATETIME('now') AS NgayGio;\`)">▶ Ngày giờ hiện tại</button>
<button class="try-btn" onclick="trySQL(\`SELECT DATE('now','+7 days') AS Sau7Ngay, DATE('now','-1 month') AS ThangTruoc;\`)">▶ Cộng/trừ ngày</button>
<button class="try-btn" onclick="trySQL(\`SELECT MaDH, NgayDat, CAST(JULIANDAY('now') - JULIANDAY(NgayDat) AS INTEGER) AS SoNgay FROM DonHang;\`)">▶ Số ngày từ đặt hàng</button>

<div class="info-box tip">
<strong>✅ Mẹo:</strong> Dùng <code>JULIANDAY(ngay1) - JULIANDAY(ngay2)</code> thay cho DATEDIFF trong SQLite.
</div>
`;

// Chapter 4: Joins
LESSON_CONTENT['inner-join'] = `
<h2>🔗 INNER JOIN</h2>
<p><strong>INNER JOIN</strong> kết hợp các hàng từ hai bảng khi có giá trị <strong>khớp nhau</strong> ở cả hai bên.</p>

<h3>📝 Cú pháp</h3>
<div class="syntax-box">SELECT A.Cot1, B.Cot2
FROM BangA A
INNER JOIN BangB B ON A.CotChung = B.CotChung;</div>

<h3>🖼️ Minh họa</h3>
<p>Chỉ lấy dữ liệu có ở <strong>CẢ HAI</strong> bảng (phần giao).</p>

<h3>🎯 Thực hành</h3>
<p><strong>Kết hợp DonHang với KhachHang:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT DH.MaDH, KH.HoTen, DH.NgayDat, DH.TongTien
FROM DonHang DH
INNER JOIN KhachHang KH ON DH.MaKH = KH.MaKH;\`)">▶ Đơn hàng + Khách hàng</button>

<p><strong>Kết hợp nhiều bảng:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT KH.HoTen, COUNT(DH.MaDH) AS SoDon, SUM(DH.TongTien) AS TongChi
FROM KhachHang KH
INNER JOIN DonHang DH ON KH.MaKH = DH.MaKH
GROUP BY KH.HoTen
ORDER BY TongChi DESC;\`)">▶ Thống kê chi tiêu</button>

<div class="info-box">
<strong>💡 Ghi nhớ:</strong> INNER JOIN = chỉ lấy hàng <strong>khớp</strong> ở cả 2 bảng. Hàng không khớp sẽ bị loại bỏ.
</div>
`;

LESSON_CONTENT['left-right-join'] = `
<h2>🔗 LEFT JOIN & RIGHT JOIN</h2>

<h3>👈 LEFT JOIN</h3>
<p>Lấy <strong>tất cả</strong> hàng từ bảng bên <strong>trái</strong>, kết hợp với hàng khớp bên phải. Nếu không khớp, cột bên phải = NULL.</p>

<div class="syntax-box">SELECT * FROM BangTrai
LEFT JOIN BangPhai ON BangTrai.Cot = BangPhai.Cot;</div>

<button class="try-btn" onclick="trySQL(\`SELECT KH.HoTen, DH.MaDH, DH.TongTien
FROM KhachHang KH
LEFT JOIN DonHang DH ON KH.MaKH = DH.MaKH;\`)">▶ Tất cả KH (kể cả chưa mua)</button>

<h3>👉 RIGHT JOIN</h3>
<p>Ngược lại với LEFT JOIN - lấy tất cả từ bảng <strong>phải</strong>.</p>
<div class="info-box warning">
<strong>⚠️ Lưu ý:</strong> SQLite không hỗ trợ RIGHT JOIN trực tiếp. Bạn có thể đổi vị trí bảng và dùng LEFT JOIN thay thế.
</div>

<h3>🎯 Tìm khách hàng chưa đặt đơn</h3>
<button class="try-btn" onclick="trySQL(\`SELECT KH.HoTen, KH.Email
FROM KhachHang KH
LEFT JOIN DonHang DH ON KH.MaKH = DH.MaKH
WHERE DH.MaDH IS NULL;\`)">▶ KH chưa mua hàng</button>
`;

LESSON_CONTENT['full-self-join'] = `
<h2>🔗 FULL JOIN & SELF JOIN</h2>

<h3>🔄 FULL OUTER JOIN</h3>
<p>Kết hợp kết quả của cả LEFT và RIGHT JOIN - lấy <strong>tất cả</strong> hàng từ cả hai bảng.</p>
<div class="info-box warning">
<strong>⚠️ SQLite:</strong> Không hỗ trợ FULL OUTER JOIN trực tiếp. Dùng UNION của LEFT JOIN:
</div>
<button class="try-btn" onclick="trySQL(\`SELECT KH.HoTen, DH.MaDH FROM KhachHang KH LEFT JOIN DonHang DH ON KH.MaKH = DH.MaKH
UNION
SELECT KH.HoTen, DH.MaDH FROM DonHang DH LEFT JOIN KhachHang KH ON DH.MaKH = KH.MaKH;\`)">▶ Mô phỏng FULL JOIN</button>

<h3>🪞 SELF JOIN</h3>
<p>Một bảng tự JOIN với chính nó. Hữu ích khi dữ liệu có quan hệ phân cấp.</p>

<button class="try-btn" onclick="trySQL(\`SELECT A.HoTen AS NhanVien, B.HoTen AS DongNghiep
FROM NhanVien A, NhanVien B
WHERE A.PhongBan = B.PhongBan AND A.MaNV != B.MaNV
ORDER BY A.HoTen;\`)">▶ Đồng nghiệp cùng phòng</button>

<div class="info-box tip">
<strong>✅ Khi nào dùng SELF JOIN?</strong>
<ul><li>Tìm nhân viên cùng phòng ban</li><li>Cấu trúc quản lý (sếp - nhân viên)</li><li>So sánh các hàng trong cùng bảng</li></ul>
</div>
`;

// Chapter 5: Subqueries
LESSON_CONTENT['subquery-where'] = `
<h2>🧩 Subquery trong WHERE</h2>
<p><strong>Subquery</strong> (truy vấn con) là một câu SELECT nằm bên trong câu SQL khác.</p>

<h3>📝 Cú pháp</h3>
<div class="syntax-box">SELECT * FROM TenBang
WHERE Cot = (SELECT ... FROM ...);</div>

<h3>🎯 Thực hành</h3>
<p><strong>1. Sinh viên có điểm cao nhất:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT * FROM SinhVien
WHERE DiemTB = (SELECT MAX(DiemTB) FROM SinhVien);\`)">▶ Thử ngay</button>

<p><strong>2. Sản phẩm giá trên trung bình:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT TenSP, Gia FROM SanPham
WHERE Gia > (SELECT AVG(Gia) FROM SanPham)
ORDER BY Gia DESC;\`)">▶ Thử ngay</button>

<p><strong>3. Dùng IN với subquery:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT HoTen, Email FROM KhachHang
WHERE MaKH IN (SELECT MaKH FROM DonHang WHERE TongTien > 500000);\`)">▶ KH mua > 500K</button>

<div class="info-box">
<strong>💡 Tips:</strong> Subquery trả về 1 giá trị dùng <code>=</code>, nhiều giá trị dùng <code>IN</code>.
</div>
`;

LESSON_CONTENT['subquery-from-select'] = `
<h2>🧩 Subquery trong FROM & SELECT</h2>

<h3>📦 Subquery trong FROM (Derived Table)</h3>
<p>Dùng subquery như một bảng tạm trong FROM:</p>
<button class="try-btn" onclick="trySQL(\`SELECT LopInfo.Lop, LopInfo.SoSV, LopInfo.DiemTB
FROM (
  SELECT Lop, COUNT(*) AS SoSV, ROUND(AVG(DiemTB),2) AS DiemTB
  FROM SinhVien GROUP BY Lop
) AS LopInfo
WHERE LopInfo.SoSV >= 2;\`)">▶ Thử ngay</button>

<h3>📌 Subquery trong SELECT (Scalar Subquery)</h3>
<p>Dùng subquery để tính giá trị cho mỗi hàng:</p>
<button class="try-btn" onclick="trySQL(\`SELECT HoTen, DiemTB,
  (SELECT AVG(DiemTB) FROM SinhVien) AS DiemTBChung,
  ROUND(DiemTB - (SELECT AVG(DiemTB) FROM SinhVien), 2) AS ChenhLech
FROM SinhVien;\`)">▶ So sánh với ĐTB chung</button>
`;

LESSON_CONTENT['correlated'] = `
<h2>🧩 Correlated Subqueries</h2>
<p>Subquery tương quan là subquery tham chiếu đến bảng ở câu truy vấn bên ngoài. Nó chạy <strong>cho mỗi hàng</strong> của truy vấn ngoài.</p>

<h3>📝 Cú pháp</h3>
<div class="syntax-box">SELECT * FROM BangA A
WHERE Cot > (SELECT AVG(Cot) FROM BangA B WHERE B.Nhom = A.Nhom);</div>

<h3>🎯 Thực hành</h3>
<p><strong>SV có điểm trên TB lớp mình:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT HoTen, Lop, DiemTB FROM SinhVien S1
WHERE DiemTB > (SELECT AVG(DiemTB) FROM SinhVien S2 WHERE S2.Lop = S1.Lop);\`)">▶ Thử ngay</button>

<p><strong>Dùng EXISTS:</strong></p>
<button class="try-btn" onclick="trySQL(\`SELECT HoTen FROM KhachHang KH
WHERE EXISTS (SELECT 1 FROM DonHang DH WHERE DH.MaKH = KH.MaKH);\`)">▶ KH đã mua hàng</button>

<div class="info-box warning">
<strong>⚠️ Hiệu suất:</strong> Correlated subquery chạy cho TỪNG hàng nên có thể chậm với dữ liệu lớn. Cân nhắc dùng JOIN thay thế.
</div>
`;
