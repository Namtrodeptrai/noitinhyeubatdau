// Extra detail sections appended to the existing lesson content.
(function enrichLessons() {
  if (typeof LESSON_CONTENT === 'undefined') return;

  const LESSON_DETAILS = {
    'what-is-sql': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: SQL nằm ở đâu trong một ứng dụng?</h3>
  <p>Khi người dùng thao tác trên website hoặc app, dữ liệu thường không nằm trực tiếp trong giao diện. Giao diện gửi yêu cầu đến backend, backend dùng SQL để đọc hoặc thay đổi dữ liệu trong database, rồi trả kết quả về cho người dùng.</p>
  <div class="lesson-flow">
    <span>Người dùng</span><span>Giao diện</span><span>Backend</span><span>SQL</span><span>Database</span>
  </div>

  <h4>Nhóm câu lệnh SQL thường gặp</h4>
  <table>
    <tr><th>Nhóm</th><th>Dùng để làm gì?</th><th>Ví dụ lệnh</th></tr>
    <tr><td>DQL</td><td>Truy vấn dữ liệu</td><td><code>SELECT</code></td></tr>
    <tr><td>DML</td><td>Thêm, sửa, xóa dữ liệu</td><td><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td></tr>
    <tr><td>DDL</td><td>Tạo hoặc thay đổi cấu trúc</td><td><code>CREATE TABLE</code>, <code>ALTER TABLE</code></td></tr>
    <tr><td>DCL/TCL</td><td>Phân quyền và giao dịch</td><td><code>GRANT</code>, <code>COMMIT</code>, <code>ROLLBACK</code></td></tr>
  </table>

  <h4>Tư duy khi viết SQL</h4>
  <ol>
    <li>Xác định câu hỏi dữ liệu: cần lấy thông tin gì?</li>
    <li>Xác định bảng nguồn: dữ liệu nằm ở bảng nào?</li>
    <li>Xác định điều kiện lọc: chỉ lấy những dòng nào?</li>
    <li>Xác định cách trình bày: cần sắp xếp, nhóm, đổi tên cột không?</li>
  </ol>

  <div class="info-box tip">
    <strong>Checklist nhanh:</strong> Nếu đọc một câu SQL mà chưa hiểu, hãy tìm lần lượt <code>SELECT</code> lấy cột nào, <code>FROM</code> lấy từ bảng nào, <code>WHERE</code> lọc điều kiện gì.
  </div>
</section>
`,
    'db-tables': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: thiết kế bảng trước khi viết SQL</h3>
  <p>Một bảng tốt thường mô tả đúng một loại đối tượng hoặc sự kiện. Ví dụ <code>SinhVien</code> lưu thông tin sinh viên, <code>DonHang</code> lưu giao dịch đặt hàng, còn <code>KhachHang</code> lưu thông tin khách hàng.</p>

  <h4>Phân biệt table, row, column và cell</h4>
  <table>
    <tr><th>Khái niệm</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>
    <tr><td>Table</td><td>Tập hợp bản ghi cùng loại</td><td><code>SinhVien</code></td></tr>
    <tr><td>Row</td><td>Một bản ghi cụ thể</td><td>Một sinh viên tên Nguyễn An</td></tr>
    <tr><td>Column</td><td>Một thuộc tính của bản ghi</td><td><code>HoTen</code>, <code>Tuoi</code></td></tr>
    <tr><td>Cell</td><td>Giá trị tại giao điểm hàng và cột</td><td><code>8.5</code> trong cột <code>DiemTB</code></td></tr>
  </table>

  <h4>Quy tắc đặt tên nên dùng</h4>
  <ul>
    <li>Dùng tên rõ nghĩa: <code>NgayDat</code> tốt hơn <code>ND</code>.</li>
    <li>Giữ một phong cách nhất quán: không trộn <code>MaKH</code>, <code>customer_id</code>, <code>IDKhach</code> trong cùng dự án.</li>
    <li>Tránh lưu nhiều ý nghĩa trong một cột, ví dụ <code>DiaChiVaSDT</code>.</li>
    <li>Mỗi bảng nên có một cột định danh như <code>MaSV</code>, <code>MaKH</code>, <code>MaDH</code>.</li>
  </ul>

  <h4>Lỗi người mới thường gặp</h4>
  <ul>
    <li>Tạo một bảng quá lớn chứa mọi thứ, khiến dữ liệu bị lặp lại nhiều lần.</li>
    <li>Không có khóa chính nên khó sửa, xóa hoặc liên kết dữ liệu chính xác.</li>
    <li>Chọn kiểu dữ liệu quá chung chung, ví dụ lưu điểm số bằng text.</li>
  </ul>
</section>
`,
    'data-types': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: chọn kiểu dữ liệu ảnh hưởng đến chất lượng dữ liệu</h3>
  <p>Kiểu dữ liệu không chỉ để database biết cách lưu giá trị. Nó còn giúp kiểm tra dữ liệu sai, tối ưu dung lượng và quyết định cách so sánh khi truy vấn.</p>

  <h4>Cách chọn kiểu dữ liệu</h4>
  <table>
    <tr><th>Dữ liệu</th><th>Nên dùng</th><th>Không nên dùng</th></tr>
    <tr><td>Mã định danh</td><td><code>INTEGER</code> hoặc <code>TEXT</code> nếu có ký tự</td><td><code>REAL</code></td></tr>
    <tr><td>Tên, email, địa chỉ</td><td><code>TEXT</code> hoặc <code>VARCHAR</code></td><td><code>INTEGER</code></td></tr>
    <tr><td>Giá tiền</td><td><code>DECIMAL</code>, <code>NUMERIC</code>, hoặc integer lưu theo đơn vị nhỏ</td><td><code>FLOAT</code> nếu cần chính xác tuyệt đối</td></tr>
    <tr><td>Ngày tháng</td><td><code>DATE</code>, <code>DATETIME</code>, hoặc text chuẩn ISO trong SQLite</td><td>Text tự do như "hôm qua"</td></tr>
  </table>

  <h4>NULL không giống chuỗi rỗng hoặc số 0</h4>
  <p><code>NULL</code> nghĩa là chưa có giá trị hoặc không biết giá trị. Chuỗi rỗng <code>''</code> là có giá trị nhưng nội dung trống. Số <code>0</code> là một giá trị số hợp lệ.</p>
  <div class="syntax-box">-- Tìm sinh viên chưa có điểm
SELECT * FROM SinhVien WHERE DiemTB IS NULL;

-- Không nên viết:
SELECT * FROM SinhVien WHERE DiemTB = NULL;</div>

  <div class="info-box warning">
    <strong>Lưu ý:</strong> SQLite linh hoạt về kiểu dữ liệu hơn MySQL, PostgreSQL hoặc SQL Server. Khi học khái niệm, hãy hiểu cả nguyên tắc chung, không chỉ hành vi của SQLite.
  </div>
</section>
`,
    crud: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: CRUD là vòng đời cơ bản của dữ liệu</h3>
  <p>Hầu hết chức năng trong ứng dụng đều có thể quy về CRUD. Đăng ký tài khoản là create, xem hồ sơ là read, đổi mật khẩu là update, xóa địa chỉ giao hàng là delete.</p>

  <h4>Thứ tự an toàn khi thao tác dữ liệu</h4>
  <ol>
    <li>Dùng <code>SELECT</code> để kiểm tra đúng dòng cần thao tác.</li>
    <li>Viết <code>INSERT</code>, <code>UPDATE</code> hoặc <code>DELETE</code> với điều kiện rõ ràng.</li>
    <li>Chạy lại <code>SELECT</code> để kiểm tra kết quả.</li>
    <li>Với dữ liệu thật, đặt thao tác nguy hiểm trong transaction nếu có thể.</li>
  </ol>

  <h4>Ví dụ quy trình UPDATE an toàn</h4>
  <div class="syntax-box">-- 1. Kiểm tra dòng cần sửa
SELECT * FROM SinhVien WHERE MaSV = 1;

-- 2. Sửa đúng dòng đó
UPDATE SinhVien SET DiemTB = 9.5 WHERE MaSV = 1;

-- 3. Kiểm tra lại
SELECT MaSV, HoTen, DiemTB FROM SinhVien WHERE MaSV = 1;</div>

  <h4>Lỗi hay gặp</h4>
  <ul>
    <li>Quên <code>WHERE</code> khi <code>UPDATE</code> hoặc <code>DELETE</code>.</li>
    <li>Chèn dữ liệu không đúng thứ tự cột khi không ghi rõ danh sách cột.</li>
    <li>Sửa dữ liệu trước khi kiểm tra dòng bị ảnh hưởng.</li>
  </ul>
</section>
`,
    select: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: SELECT là cách đặt câu hỏi với dữ liệu</h3>
  <p>Một câu <code>SELECT</code> tốt trả lời đúng câu hỏi kinh doanh, không chỉ chạy không lỗi. Ví dụ "sinh viên điểm cao" chưa đủ rõ; cần biết cao hơn bao nhiêu, lấy cột nào, sắp xếp ra sao.</p>

  <h4>Thứ tự viết và thứ tự xử lý</h4>
  <table>
    <tr><th>Thứ tự thường viết</th><th>Thứ tự database xử lý logic</th></tr>
    <tr><td><code>SELECT</code></td><td><code>FROM</code></td></tr>
    <tr><td><code>FROM</code></td><td><code>WHERE</code></td></tr>
    <tr><td><code>WHERE</code></td><td><code>GROUP BY</code></td></tr>
    <tr><td><code>ORDER BY</code></td><td><code>SELECT</code>, sau đó <code>ORDER BY</code></td></tr>
  </table>

  <h4>Khi nào không nên dùng SELECT *</h4>
  <ul>
    <li>Khi bảng có nhiều cột nhưng màn hình chỉ cần vài cột.</li>
    <li>Khi API cần dữ liệu ổn định, tránh bị ảnh hưởng nếu sau này bảng thêm cột.</li>
    <li>Khi bảng có cột lớn như mô tả dài, ảnh, JSON hoặc file.</li>
  </ul>

  <div class="syntax-box">-- Rõ ràng hơn SELECT *
SELECT MaSV, HoTen, Lop, DiemTB
FROM SinhVien;</div>
</section>
`,
    where: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: WHERE quyết định dòng nào được giữ lại</h3>
  <p><code>WHERE</code> hoạt động trên từng dòng. Với mỗi dòng, database kiểm tra điều kiện là đúng, sai hay không xác định. Chỉ những dòng có điều kiện đúng mới đi tiếp.</p>

  <h4>Kết hợp điều kiện rõ ràng</h4>
  <div class="syntax-box">-- Sinh viên lớp CNTT01 hoặc CNTT02, và điểm từ 8 trở lên
SELECT HoTen, Lop, DiemTB
FROM SinhVien
WHERE Lop IN ('CNTT01', 'CNTT02')
  AND DiemTB &gt;= 8;</div>

  <h4>Ưu tiên dùng ngoặc khi có AND và OR</h4>
  <p><code>AND</code> thường được xử lý trước <code>OR</code>. Nếu điều kiện dài, hãy dùng ngoặc để người đọc hiểu đúng ý định.</p>
  <div class="syntax-box">-- Rõ nghĩa hơn
WHERE (Lop = 'CNTT01' OR Lop = 'CNTT02')
  AND DiemTB &gt;= 8</div>

  <h4>Lỗi hay gặp</h4>
  <ul>
    <li>Dùng <code>= NULL</code> thay vì <code>IS NULL</code>.</li>
    <li>Quên dấu nháy với dữ liệu text: <code>Lop = CNTT01</code>.</li>
    <li>Viết <code>LIKE</code> nhưng quên ký tự đại diện <code>%</code>.</li>
  </ul>
</section>
`,
    'orderby-groupby': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: ORDER BY sắp xếp, GROUP BY tóm tắt</h3>
  <p><code>ORDER BY</code> không làm thay đổi dữ liệu gốc, chỉ thay đổi thứ tự hiển thị kết quả. <code>GROUP BY</code> gom nhiều dòng thành ít dòng hơn để tính tổng, đếm, trung bình hoặc thống kê.</p>

  <h4>Cách đọc một truy vấn GROUP BY</h4>
  <ol>
    <li><code>FROM</code>: lấy dữ liệu từ bảng nào.</li>
    <li><code>WHERE</code>: loại bớt dòng trước khi nhóm.</li>
    <li><code>GROUP BY</code>: chia dữ liệu thành từng nhóm.</li>
    <li><code>SELECT</code>: trả về khóa nhóm và số liệu tổng hợp.</li>
    <li><code>HAVING</code>: loại bớt nhóm sau khi tính toán.</li>
  </ol>

  <div class="syntax-box">SELECT Lop, COUNT(*) AS SoSinhVien, ROUND(AVG(DiemTB), 2) AS DiemTrungBinh
FROM SinhVien
WHERE DiemTB IS NOT NULL
GROUP BY Lop
HAVING COUNT(*) &gt;= 2
ORDER BY DiemTrungBinh DESC;</div>

  <div class="info-box warning">
    <strong>Lưu ý:</strong> Cột xuất hiện trong <code>SELECT</code> nhưng không nằm trong hàm tổng hợp thường nên có trong <code>GROUP BY</code>. Đây là quy tắc quan trọng khi chuyển sang MySQL cấu hình nghiêm ngặt, PostgreSQL hoặc SQL Server.
  </div>
</section>
`,
    'limit-distinct': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: LIMIT và DISTINCT giúp kiểm soát kết quả</h3>
  <p><code>LIMIT</code> trả ít dòng hơn, còn <code>DISTINCT</code> trả ít giá trị trùng hơn. Hai lệnh này thường dùng khi khám phá dữ liệu hoặc xây dựng phân trang.</p>

  <h4>LIMIT nên đi cùng ORDER BY khi cần top N</h4>
  <p>Nếu không có <code>ORDER BY</code>, database không cam kết thứ tự kết quả. Vì vậy "top 5" mà không sắp xếp thì không có nghĩa rõ ràng.</p>
  <div class="syntax-box">-- Top 5 sản phẩm đắt nhất
SELECT TenSP, Gia
FROM SanPham
ORDER BY Gia DESC
LIMIT 5;</div>

  <h4>DISTINCT áp dụng trên cả bộ cột được chọn</h4>
  <div class="syntax-box">-- Danh sách lớp duy nhất
SELECT DISTINCT Lop FROM SinhVien;

-- Cặp Lop + GioiTinh duy nhất, không chỉ Lop
SELECT DISTINCT Lop, GioiTinh FROM SinhVien;</div>

  <h4>Lỗi hay gặp</h4>
  <ul>
    <li>Dùng <code>DISTINCT</code> để che dữ liệu bị join sai, thay vì sửa điều kiện join.</li>
    <li>Phân trang bằng <code>OFFSET</code> rất lớn trên bảng lớn, khiến truy vấn chậm.</li>
  </ul>
</section>
`,
    aggregate: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: aggregate biến nhiều dòng thành một kết luận</h3>
  <p>Hàm tổng hợp trả lời các câu hỏi như "có bao nhiêu?", "tổng là bao nhiêu?", "cao nhất là gì?", "trung bình mỗi nhóm là bao nhiêu?". Đây là nền tảng của báo cáo và dashboard.</p>

  <h4>COUNT(*) và COUNT(cột)</h4>
  <table>
    <tr><th>Cách viết</th><th>Ý nghĩa</th></tr>
    <tr><td><code>COUNT(*)</code></td><td>Đếm số dòng, kể cả dòng có giá trị NULL ở một số cột</td></tr>
    <tr><td><code>COUNT(Email)</code></td><td>Chỉ đếm dòng mà <code>Email</code> không NULL</td></tr>
    <tr><td><code>COUNT(DISTINCT Lop)</code></td><td>Đếm số lớp khác nhau</td></tr>
  </table>

  <h4>Mẫu truy vấn báo cáo thường dùng</h4>
  <div class="syntax-box">SELECT DanhMuc,
       COUNT(*) AS SoSanPham,
       MIN(Gia) AS GiaThapNhat,
       MAX(Gia) AS GiaCaoNhat,
       ROUND(AVG(Gia), 0) AS GiaTrungBinh
FROM SanPham
GROUP BY DanhMuc
ORDER BY GiaTrungBinh DESC;</div>

  <div class="info-box tip">
    <strong>Mẹo:</strong> Đặt alias dễ đọc cho cột tổng hợp, vì tên mặc định như <code>AVG(Gia)</code> thường khó dùng ở tầng hiển thị.
  </div>
</section>
`,
    'string-funcs': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: xử lý chuỗi dùng nhiều khi làm sạch dữ liệu</h3>
  <p>Dữ liệu nhập từ người dùng thường không đồng nhất: thừa khoảng trắng, viết hoa viết thường lẫn lộn, số điện thoại sai định dạng. Hàm chuỗi giúp chuẩn hóa trước khi tìm kiếm hoặc báo cáo.</p>

  <h4>Những tình huống thực tế</h4>
  <ul>
    <li>Chuẩn hóa email về chữ thường bằng <code>LOWER(Email)</code>.</li>
    <li>Xóa khoảng trắng hai đầu bằng <code>TRIM(HoTen)</code>.</li>
    <li>Lấy mã vùng hoặc tiền tố bằng <code>SUBSTR()</code>.</li>
    <li>Ghép nhiều cột thành một nhãn hiển thị bằng toán tử nối chuỗi.</li>
  </ul>

  <div class="syntax-box">SELECT TRIM(HoTen) AS HoTenSach,
       LOWER(Email) AS EmailChuan,
       SUBSTR(SoDienThoai, 1, 3) AS DauSo
FROM KhachHang;</div>

  <div class="info-box warning">
    <strong>Lưu ý:</strong> Hàm chuỗi khác nhau giữa các hệ quản trị. SQLite dùng <code>||</code> để nối chuỗi, MySQL dùng <code>CONCAT()</code>, SQL Server thường dùng <code>+</code> hoặc <code>CONCAT()</code>.
  </div>
</section>
`,
    'date-funcs': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: ngày tháng nên lưu theo định dạng dễ so sánh</h3>
  <p>Ngày tháng là kiểu dữ liệu dễ sai vì liên quan định dạng, múi giờ và cách hiển thị. Trong SQLite, lưu dạng <code>YYYY-MM-DD</code> hoặc <code>YYYY-MM-DD HH:MM:SS</code> giúp sắp xếp và so sánh ổn định hơn.</p>

  <h4>Các câu hỏi thường gặp với ngày tháng</h4>
  <table>
    <tr><th>Câu hỏi</th><th>Cách nghĩ</th></tr>
    <tr><td>Đơn hàng trong tháng này?</td><td>Lọc theo khoảng ngày bắt đầu và kết thúc tháng</td></tr>
    <tr><td>Đơn hàng đã bao nhiêu ngày?</td><td>Lấy ngày hiện tại trừ ngày đặt</td></tr>
    <tr><td>Doanh thu theo tháng?</td><td>Trích năm-tháng rồi <code>GROUP BY</code></td></tr>
  </table>

  <div class="syntax-box">SELECT STRFTIME('%Y-%m', NgayDat) AS Thang,
       COUNT(*) AS SoDon,
       SUM(TongTien) AS DoanhThu
FROM DonHang
GROUP BY STRFTIME('%Y-%m', NgayDat)
ORDER BY Thang;</div>

  <div class="info-box tip">
    <strong>Mẹo:</strong> Khi lọc theo ngày, ưu tiên dùng khoảng <code>&gt;= ngày_bắt_đầu</code> và <code>&lt; ngày_kết_thúc</code> để tránh lỗi phần giờ phút giây.
  </div>
</section>
`,
    'inner-join': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: INNER JOIN chỉ giữ dữ liệu có quan hệ khớp</h3>
  <p>Khi dùng <code>INNER JOIN</code>, một dòng chỉ xuất hiện nếu tìm được dòng tương ứng ở bảng còn lại. Điều này phù hợp khi bạn chỉ muốn dữ liệu hoàn chỉnh, ví dụ đơn hàng có khách hàng hợp lệ.</p>

  <h4>Cách chọn điều kiện ON</h4>
  <ul>
    <li>Điều kiện join thường nối khóa ngoại với khóa chính: <code>DonHang.MaKH = KhachHang.MaKH</code>.</li>
    <li>Không join bằng tên nếu đã có mã định danh, vì tên có thể trùng hoặc thay đổi.</li>
    <li>Luôn kiểm tra số dòng sau join, nhất là khi join nhiều bảng.</li>
  </ul>

  <div class="syntax-box">SELECT DH.MaDH, KH.HoTen, DH.NgayDat, DH.TongTien
FROM DonHang AS DH
INNER JOIN KhachHang AS KH
  ON DH.MaKH = KH.MaKH
ORDER BY DH.NgayDat DESC;</div>

  <div class="info-box warning">
    <strong>Dấu hiệu join sai:</strong> số dòng tăng bất thường, tổng tiền bị nhân lên, hoặc nhiều dòng trùng nhau không mong muốn.
  </div>
</section>
`,
    'left-right-join': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: LEFT JOIN dùng để không làm mất dòng bên trái</h3>
  <p><code>LEFT JOIN</code> rất hữu ích khi cần báo cáo cả đối tượng chưa có dữ liệu liên quan. Ví dụ vẫn muốn thấy khách hàng chưa mua hàng, lớp chưa có sinh viên, sản phẩm chưa có đơn.</p>

  <h4>Mẫu tìm dữ liệu chưa có liên kết</h4>
  <div class="syntax-box">SELECT KH.MaKH, KH.HoTen
FROM KhachHang AS KH
LEFT JOIN DonHang AS DH
  ON KH.MaKH = DH.MaKH
WHERE DH.MaDH IS NULL;</div>

  <h4>Điều kiện đặt trong ON hay WHERE?</h4>
  <p>Với <code>LEFT JOIN</code>, đặt điều kiện của bảng phải trong <code>WHERE</code> có thể biến kết quả thành gần giống <code>INNER JOIN</code>. Nếu muốn giữ dòng bên trái, hãy cân nhắc đặt điều kiện đó trong <code>ON</code>.</p>

  <div class="info-box tip">
    <strong>Ghi nhớ:</strong> LEFT JOIN trả tất cả dòng từ bảng bên trái. Cột của bảng bên phải sẽ là <code>NULL</code> nếu không có dòng khớp.
  </div>
</section>
`,
    'full-self-join': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: FULL JOIN và SELF JOIN giải quyết hai bài toán khác nhau</h3>
  <p><code>FULL JOIN</code> dùng khi muốn thấy dữ liệu ở cả hai phía dù có khớp hay không. <code>SELF JOIN</code> dùng khi một bảng cần so sánh hoặc liên kết với chính nó.</p>

  <h4>Khi nào cần SELF JOIN?</h4>
  <ul>
    <li>Tìm cặp nhân viên cùng phòng ban.</li>
    <li>Mô hình nhân viên và quản lý trong cùng bảng.</li>
    <li>So sánh các bản ghi cùng loại, ví dụ sản phẩm cùng danh mục nhưng giá khác nhau.</li>
  </ul>

  <div class="syntax-box">SELECT A.HoTen AS NhanVien,
       B.HoTen AS DongNghiep,
       A.PhongBan
FROM NhanVien AS A
JOIN NhanVien AS B
  ON A.PhongBan = B.PhongBan
 AND A.MaNV &lt;&gt; B.MaNV;</div>

  <div class="info-box warning">
    <strong>Lưu ý:</strong> Khi self join, luôn dùng alias như <code>A</code> và <code>B</code>. Nếu không, database không biết bạn đang tham chiếu bản sao nào của bảng.
  </div>
</section>
`,
    'subquery-where': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: subquery trong WHERE dùng để lọc theo kết quả phụ</h3>
  <p>Subquery giúp điều kiện lọc phụ thuộc vào dữ liệu hiện tại, thay vì phải nhập giá trị cố định. Ví dụ "cao hơn điểm trung bình" nên tính từ bảng, không nhập tay số trung bình.</p>

  <h4>Chọn toán tử theo số lượng kết quả</h4>
  <table>
    <tr><th>Subquery trả về</th><th>Toán tử phù hợp</th><th>Ví dụ</th></tr>
    <tr><td>Một giá trị</td><td><code>=</code>, <code>&gt;</code>, <code>&lt;</code></td><td>So với <code>AVG(DiemTB)</code></td></tr>
    <tr><td>Nhiều giá trị một cột</td><td><code>IN</code>, <code>NOT IN</code></td><td>Khách hàng có đơn hàng</td></tr>
    <tr><td>Có hoặc không có dòng</td><td><code>EXISTS</code></td><td>Kiểm tra tồn tại liên kết</td></tr>
  </table>

  <div class="syntax-box">SELECT HoTen, DiemTB
FROM SinhVien
WHERE DiemTB &gt; (SELECT AVG(DiemTB) FROM SinhVien);</div>

  <div class="info-box tip">
    <strong>Mẹo:</strong> Hãy chạy riêng subquery trước để biết nó trả về gì, sau đó mới đặt vào truy vấn lớn.
  </div>
</section>
`,
    'subquery-from-select': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: subquery trong FROM tạo bảng tạm cho bước tiếp theo</h3>
  <p>Khi một phép tính cần nhiều bước, subquery trong <code>FROM</code> giúp bạn tách truy vấn thành lớp trung gian. Lớp bên trong tạo dữ liệu tóm tắt, lớp bên ngoài lọc hoặc sắp xếp kết quả đó.</p>

  <h4>Mẫu phân tích hai bước</h4>
  <div class="syntax-box">SELECT LopInfo.*
FROM (
  SELECT Lop, COUNT(*) AS SoSV, AVG(DiemTB) AS DiemTB
  FROM SinhVien
  GROUP BY Lop
) AS LopInfo
WHERE LopInfo.DiemTB &gt;= 8;</div>

  <h4>Subquery trong SELECT dùng khi cần số liệu tham chiếu</h4>
  <p>Ví dụ mỗi sinh viên cần hiển thị điểm của mình và điểm trung bình toàn trường để so sánh. Subquery trong <code>SELECT</code> tạo thêm một cột tính toán cho từng dòng kết quả.</p>

  <div class="info-box warning">
    <strong>Lưu ý hiệu năng:</strong> Nếu subquery trong <code>SELECT</code> phụ thuộc từng dòng, nó có thể chạy nhiều lần. Với bảng lớn, cân nhắc dùng join, CTE hoặc window function.
  </div>
</section>
`,
    correlated: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: correlated subquery phụ thuộc vào từng dòng bên ngoài</h3>
  <p>Khác với subquery độc lập, correlated subquery đọc giá trị từ dòng hiện tại của truy vấn ngoài. Vì vậy nó phù hợp với câu hỏi "so với nhóm của chính dòng này".</p>

  <h4>Cách nhận diện</h4>
  <p>Nếu subquery bên trong dùng alias của truy vấn ngoài, ví dụ <code>S1.Lop</code>, đó là correlated subquery.</p>
  <div class="syntax-box">SELECT S1.HoTen, S1.Lop, S1.DiemTB
FROM SinhVien AS S1
WHERE S1.DiemTB &gt; (
  SELECT AVG(S2.DiemTB)
  FROM SinhVien AS S2
  WHERE S2.Lop = S1.Lop
);</div>

  <h4>Khi nào dùng EXISTS?</h4>
  <p><code>EXISTS</code> phù hợp khi bạn chỉ cần biết có ít nhất một dòng liên quan hay không, không cần lấy giá trị cụ thể từ subquery.</p>
</section>
`,
    'primary-key': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: khóa chính là danh tính của một dòng</h3>
  <p>Khóa chính giúp database, backend và người dùng phân biệt chính xác từng bản ghi. Hai người có thể trùng họ tên, nhưng không nên trùng <code>MaSV</code>.</p>

  <h4>Khóa tự nhiên và khóa thay thế</h4>
  <table>
    <tr><th>Loại khóa</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>
    <tr><td>Khóa tự nhiên</td><td>Giá trị có sẵn trong nghiệp vụ</td><td>Email, số căn cước</td></tr>
    <tr><td>Khóa thay thế</td><td>Giá trị do hệ thống sinh ra</td><td><code>MaSV</code>, <code>CustomerID</code></td></tr>
  </table>

  <h4>Tiêu chí chọn primary key</h4>
  <ul>
    <li>Duy nhất cho mọi dòng.</li>
    <li>Không đổi theo thời gian hoặc rất hiếm khi đổi.</li>
    <li>Không chứa thông tin nhạy cảm nếu phải lộ ra ngoài URL hoặc API.</li>
    <li>Ngắn gọn để join và index hiệu quả.</li>
  </ul>

  <div class="info-box tip">
    <strong>Thực tế:</strong> Nhiều hệ thống dùng ID số hoặc UUID làm khóa chính, còn email hoặc mã nghiệp vụ đặt thêm <code>UNIQUE</code>.
  </div>
</section>
`,
    'foreign-key': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: khóa ngoại bảo vệ quan hệ giữa các bảng</h3>
  <p>Khóa ngoại đảm bảo một đơn hàng không thể tham chiếu tới khách hàng không tồn tại. Đây là cách database tự bảo vệ tính đúng đắn, thay vì phụ thuộc hoàn toàn vào code ứng dụng.</p>

  <h4>Ba tình huống cần quyết định</h4>
  <table>
    <tr><th>Tình huống</th><th>Phương án thường gặp</th></tr>
    <tr><td>Xóa khách hàng đã có đơn</td><td>Chặn xóa, xóa dây chuyền, hoặc đặt FK thành NULL</td></tr>
    <tr><td>Sửa mã khách hàng</td><td>Cập nhật dây chuyền hoặc không cho sửa khóa chính</td></tr>
    <tr><td>Import dữ liệu cũ</td><td>Kiểm tra dữ liệu cha trước dữ liệu con</td></tr>
  </table>

  <h4>Ví dụ có hành vi khi xóa</h4>
  <div class="syntax-box">FOREIGN KEY (MaKH)
REFERENCES KhachHang(MaKH)
ON DELETE RESTRICT
ON UPDATE CASCADE</div>

  <div class="info-box warning">
    <strong>Lưu ý:</strong> Nếu không bật hoặc không khai báo foreign key, database có thể chứa dữ liệu mồ côi, ví dụ đơn hàng có <code>MaKH</code> nhưng không tìm thấy khách hàng.
  </div>
</section>
`,
    'unique-notnull-check': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: constraint là luật nghiệp vụ ở tầng database</h3>
  <p>Validation ở giao diện giúp người dùng nhập đúng, validation ở backend giúp API an toàn, còn constraint trong database là lớp bảo vệ cuối cùng để dữ liệu không bị sai.</p>

  <h4>Nên đặt luật nào ở database?</h4>
  <ul>
    <li>Dữ liệu bắt buộc: <code>NOT NULL</code>.</li>
    <li>Giá trị không được trùng: <code>UNIQUE</code>.</li>
    <li>Khoảng giá trị hợp lệ: <code>CHECK</code>.</li>
    <li>Giá trị mặc định rõ ràng: <code>DEFAULT</code>.</li>
  </ul>

  <div class="syntax-box">CREATE TABLE HocVien (
  MaHV INTEGER PRIMARY KEY,
  Email TEXT NOT NULL UNIQUE,
  Tuoi INTEGER CHECK (Tuoi &gt;= 16),
  TrangThai TEXT NOT NULL DEFAULT 'active'
);</div>

  <h4>Lỗi hay gặp</h4>
  <ul>
    <li>Để cột quan trọng cho phép NULL rồi phải xử lý quá nhiều trường hợp đặc biệt.</li>
    <li>Chỉ kiểm tra email trùng ở code, dẫn đến race condition khi nhiều request cùng lúc.</li>
    <li>Dùng <code>CHECK</code> quá phức tạp cho logic nên nằm ở backend.</li>
  </ul>
</section>
`,
    indexes: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: index tăng tốc đọc nhưng làm chậm ghi</h3>
  <p>Index giống mục lục: tìm kiếm nhanh hơn, nhưng mỗi lần thêm, sửa, xóa dữ liệu thì mục lục cũng phải cập nhật. Vì vậy không nên tạo index cho mọi cột.</p>

  <h4>Cột đáng cân nhắc tạo index</h4>
  <ul>
    <li>Cột thường dùng trong <code>WHERE</code>, ví dụ <code>Email</code>, <code>MaKH</code>.</li>
    <li>Cột dùng để join giữa bảng lớn.</li>
    <li>Cột thường dùng trong <code>ORDER BY</code> hoặc <code>GROUP BY</code>.</li>
    <li>Tổ hợp cột thường đi cùng nhau trong điều kiện lọc.</li>
  </ul>

  <h4>Composite index</h4>
  <div class="syntax-box">-- Hữu ích cho truy vấn lọc theo Lop rồi sắp xếp hoặc lọc tiếp theo DiemTB
CREATE INDEX idx_sinhvien_lop_diem
ON SinhVien(Lop, DiemTB);</div>

  <div class="info-box warning">
    <strong>Không lạm dụng:</strong> Index chiếm dung lượng và làm thao tác ghi chậm hơn. Hãy tạo index dựa trên truy vấn thật sự thường dùng.
  </div>
</section>
`,
    views: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: view đóng gói truy vấn để dùng lại</h3>
  <p>View giúp đặt tên cho một truy vấn có ý nghĩa nghiệp vụ. Thay vì mỗi màn hình tự viết lại truy vấn thống kê khách hàng, bạn có thể tạo view và truy vấn view đó như một bảng.</p>

  <h4>Khi nào nên dùng view?</h4>
  <ul>
    <li>Truy vấn join hoặc aggregate được dùng lặp lại nhiều nơi.</li>
    <li>Muốn ẩn bớt cột nhạy cảm khỏi một nhóm người dùng.</li>
    <li>Muốn đặt một lớp tên nghiệp vụ dễ hiểu lên cấu trúc bảng phức tạp.</li>
  </ul>

  <div class="syntax-box">CREATE VIEW BaoCaoDonHang AS
SELECT KH.HoTen,
       COUNT(DH.MaDH) AS SoDon,
       COALESCE(SUM(DH.TongTien), 0) AS TongChi
FROM KhachHang AS KH
LEFT JOIN DonHang AS DH ON KH.MaKH = DH.MaKH
GROUP BY KH.MaKH, KH.HoTen;</div>

  <div class="info-box tip">
    <strong>Ghi nhớ:</strong> View thường không lưu dữ liệu riêng. Khi truy vấn view, database chạy câu SELECT phía sau view.
  </div>
</section>
`,
    'transaction-basics': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: transaction giúp nhiều câu lệnh thành một thao tác an toàn</h3>
  <p>Nếu một quy trình cần nhiều câu SQL cùng thành công, hãy nghĩ đến transaction. Ví dụ đặt hàng có thể cần tạo đơn hàng, trừ tồn kho và ghi lịch sử thanh toán. Chỉ một bước lỗi cũng nên hủy toàn bộ.</p>

  <h4>Mẫu thao tác an toàn</h4>
  <div class="syntax-box">BEGIN TRANSACTION;

INSERT INTO DonHang (MaKH, NgayDat, TongTien, TrangThai)
VALUES (1, DATE('now'), 250000, 'Chờ xử lý');

UPDATE SanPham
SET SoLuong = SoLuong - 1
WHERE MaSP = 1 AND SoLuong &gt; 0;

COMMIT;</div>

  <h4>Khi nào cần ROLLBACK?</h4>
  <ul>
    <li>Một câu lệnh trong chuỗi thao tác bị lỗi.</li>
    <li>Kiểm tra sau khi update cho thấy dữ liệu không hợp lệ.</li>
    <li>Người dùng hủy thao tác trước khi xác nhận cuối cùng.</li>
  </ul>
</section>
`,
    acid: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: ACID là tiêu chuẩn để tin dữ liệu</h3>
  <p>ACID không phải cú pháp SQL cụ thể, mà là nhóm nguyên tắc giúp database xử lý giao dịch đáng tin cậy, nhất là khi có lỗi hệ thống hoặc nhiều người dùng thao tác cùng lúc.</p>

  <h4>Ví dụ theo đặt hàng online</h4>
  <table>
    <tr><th>Tính chất</th><th>Trong đặt hàng nghĩa là gì?</th></tr>
    <tr><td>Atomicity</td><td>Tạo đơn và trừ kho cùng thành công, hoặc cùng bị hủy</td></tr>
    <tr><td>Consistency</td><td>Tồn kho không bị âm nếu luật không cho phép</td></tr>
    <tr><td>Isolation</td><td>Hai người mua cùng lúc không làm sai số tồn kho</td></tr>
    <tr><td>Durability</td><td>Đơn đã xác nhận không mất sau khi hệ thống khởi động lại</td></tr>
  </table>

  <h4>Vấn đề khi thiếu isolation</h4>
  <ul>
    <li>Dirty read: đọc dữ liệu chưa commit.</li>
    <li>Non-repeatable read: đọc cùng một dòng hai lần ra hai giá trị khác nhau.</li>
    <li>Phantom read: đọc lại cùng điều kiện nhưng xuất hiện thêm dòng mới.</li>
  </ul>
</section>
`,
    'normal-forms': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: chuẩn hóa là tách dữ liệu theo đúng phụ thuộc</h3>
  <p>Mục tiêu của chuẩn hóa là mỗi sự thật chỉ lưu ở một nơi. Khi một thông tin bị lặp lại ở nhiều dòng, việc sửa sai dễ bị thiếu và sinh ra dữ liệu mâu thuẫn.</p>

  <h4>Nhìn nhanh 1NF, 2NF, 3NF</h4>
  <table>
    <tr><th>Chuẩn</th><th>Câu hỏi kiểm tra</th></tr>
    <tr><td>1NF</td><td>Mỗi ô có đúng một giá trị nguyên tử không?</td></tr>
    <tr><td>2NF</td><td>Cột không khóa có phụ thuộc vào toàn bộ khóa chính không?</td></tr>
    <tr><td>3NF</td><td>Cột không khóa có phụ thuộc vào cột không khóa khác không?</td></tr>
  </table>

  <h4>Dấu hiệu cần chuẩn hóa</h4>
  <ul>
    <li>Cùng một email khách hàng lặp lại trong nhiều đơn hàng.</li>
    <li>Sửa tên phòng ban phải sửa nhiều dòng nhân viên.</li>
    <li>Một cột chứa danh sách như "SQL, Java, Python".</li>
  </ul>

  <div class="info-box tip">
    <strong>Thực tế:</strong> Chuẩn hóa giúp dữ liệu đúng hơn, nhưng báo cáo có thể cần denormalization có kiểm soát để tăng tốc đọc.
  </div>
</section>
`,
    'avoiding-redundancy': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: dư thừa dữ liệu gây lỗi cập nhật</h3>
  <p>Dữ liệu dư thừa không phải lúc nào cũng xấu, nhưng dư thừa không kiểm soát khiến hệ thống khó tin cậy. Vấn đề lớn nhất là cùng một sự thật có nhiều bản sao và các bản sao có thể lệch nhau.</p>

  <h4>Ba loại lỗi do dư thừa</h4>
  <table>
    <tr><th>Lỗi</th><th>Ví dụ</th></tr>
    <tr><td>Update anomaly</td><td>Đổi email khách ở một đơn nhưng quên các đơn khác</td></tr>
    <tr><td>Insert anomaly</td><td>Không thêm được khách hàng nếu chưa có đơn hàng</td></tr>
    <tr><td>Delete anomaly</td><td>Xóa đơn cuối cùng làm mất luôn thông tin khách hàng</td></tr>
  </table>

  <h4>Cách xử lý</h4>
  <ul>
    <li>Tách thực thể riêng thành bảng riêng.</li>
    <li>Dùng khóa ngoại để liên kết thay vì lặp lại toàn bộ thông tin.</li>
    <li>Chỉ denormalize khi có lý do hiệu năng rõ ràng và có cơ chế đồng bộ.</li>
  </ul>
</section>
`,
    'stored-procedures': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: stored procedure đưa logic gần database hơn</h3>
  <p>Stored procedure thường dùng trong hệ thống doanh nghiệp để đóng gói quy trình dữ liệu phức tạp, giảm lặp truy vấn và kiểm soát quyền truy cập ở tầng database.</p>

  <h4>Khi nào nên cân nhắc?</h4>
  <ul>
    <li>Nhiều ứng dụng khác nhau cần dùng cùng một quy trình dữ liệu.</li>
    <li>Quy trình cần chạy gần dữ liệu để giảm round-trip giữa app và database.</li>
    <li>Cần cấp quyền gọi procedure nhưng không cấp quyền trực tiếp lên bảng.</li>
  </ul>

  <h4>Đánh đổi</h4>
  <table>
    <tr><th>Lợi ích</th><th>Hạn chế</th></tr>
    <tr><td>Tái sử dụng logic ở database</td><td>Khó version control hơn code ứng dụng nếu không có quy trình rõ</td></tr>
    <tr><td>Có thể giảm dữ liệu truyền qua mạng</td><td>Cú pháp khác nhau giữa MySQL, PostgreSQL, SQL Server</td></tr>
    <tr><td>Kiểm soát quyền tốt</td><td>Test và debug có thể khó hơn</td></tr>
  </table>
</section>
`,
    triggers: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: trigger tự chạy khi dữ liệu thay đổi</h3>
  <p>Trigger là logic gắn với sự kiện như <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>. Nó phù hợp cho audit log, kiểm tra phụ trợ hoặc đồng bộ một số dữ liệu phát sinh.</p>

  <h4>Trường hợp dùng hợp lý</h4>
  <ul>
    <li>Ghi lịch sử thay đổi giá sản phẩm.</li>
    <li>Tự cập nhật cột <code>UpdatedAt</code> khi bản ghi thay đổi.</li>
    <li>Chặn thao tác không hợp lệ mà constraint thông thường không diễn đạt được.</li>
  </ul>

  <h4>Rủi ro cần nhớ</h4>
  <ul>
    <li>Logic ẩn trong database khiến người đọc code ứng dụng khó thấy toàn bộ hành vi.</li>
    <li>Trigger chạy dây chuyền có thể gây khó debug.</li>
    <li>Trigger phức tạp có thể làm thao tác ghi chậm đi.</li>
  </ul>

  <div class="info-box tip">
    <strong>Nguyên tắc:</strong> Dùng trigger cho luật dữ liệu thật sự gắn chặt với database, không dùng để thay toàn bộ business logic của ứng dụng.
  </div>
</section>
`,
    'window-functions': `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: window function tính toán mà không làm mất từng dòng</h3>
  <p>Khác với <code>GROUP BY</code>, window function vẫn giữ từng dòng gốc và thêm số liệu tính trên một "cửa sổ" dữ liệu. Đây là công cụ mạnh cho xếp hạng, lũy kế và so sánh với trung bình nhóm.</p>

  <h4>PARTITION BY và ORDER BY</h4>
  <table>
    <tr><th>Thành phần</th><th>Ý nghĩa</th></tr>
    <tr><td><code>PARTITION BY</code></td><td>Chia dữ liệu thành nhóm tính riêng</td></tr>
    <tr><td><code>ORDER BY</code></td><td>Xác định thứ tự trong mỗi nhóm</td></tr>
    <tr><td><code>OVER (...)</code></td><td>Khai báo cửa sổ tính toán</td></tr>
  </table>

  <div class="syntax-box">SELECT HoTen, Lop, DiemTB,
       RANK() OVER (PARTITION BY Lop ORDER BY DiemTB DESC) AS XepHangTrongLop,
       AVG(DiemTB) OVER (PARTITION BY Lop) AS DiemTBLop
FROM SinhVien;</div>

  <div class="info-box tip">
    <strong>Ghi nhớ:</strong> Dùng <code>GROUP BY</code> khi cần gom dòng. Dùng window function khi cần giữ từng dòng nhưng thêm số liệu phân tích.
  </div>
</section>
`,
    cte: `
<section class="lesson-deep-dive">
  <h3>Học sâu hơn: CTE giúp truy vấn dài dễ đọc hơn</h3>
  <p>CTE đặt tên cho một truy vấn tạm bằng <code>WITH</code>. Nó đặc biệt hữu ích khi truy vấn có nhiều bước hoặc cần dùng lại cùng một tập dữ liệu trung gian.</p>

  <h4>Mẫu truy vấn nhiều bước</h4>
  <div class="syntax-box">WITH LopStats AS (
  SELECT Lop, AVG(DiemTB) AS DiemTBLop
  FROM SinhVien
  GROUP BY Lop
)
SELECT S.HoTen, S.Lop, S.DiemTB, L.DiemTBLop
FROM SinhVien AS S
JOIN LopStats AS L ON S.Lop = L.Lop
WHERE S.DiemTB &gt; L.DiemTBLop;</div>

  <h4>CTE so với subquery</h4>
  <ul>
    <li>CTE dễ đọc hơn khi có nhiều bước đặt tên rõ ràng.</li>
    <li>Subquery gọn hơn nếu logic chỉ dùng một lần và ngắn.</li>
    <li>CTE đệ quy có thể xử lý dữ liệu phân cấp như cây danh mục hoặc sơ đồ quản lý.</li>
  </ul>
</section>
`
  };

  Object.keys(LESSON_DETAILS).forEach(id => {
    if (!LESSON_CONTENT[id]) return;
    if (LESSON_CONTENT[id].includes('lesson-deep-dive')) return;
    LESSON_CONTENT[id] += LESSON_DETAILS[id];
  });
})();
