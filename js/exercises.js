// Exercise system - HackerRank style with submit & check
const EXERCISES = {
'what-is-sql': [
  { id:'ex1-1', title:'Câu lệnh đầu tiên', diff:'easy',
    desc:'Viết câu lệnh SQL hiển thị dòng chữ "Hello SQL" với tên cột là <code>LoiChao</code>.',
    hint:'Dùng SELECT với chuỗi trong dấu nháy đơn và AS để đặt tên cột.',
    initSQL:"-- Viết câu lệnh SQL tại đây\n",
    check: r => r.length===1 && r[0].columns[0]==='LoiChao' && r[0].values[0][0]==='Hello SQL' },
  { id:'ex1-2', title:'Phép tính đơn giản', diff:'easy',
    desc:'Dùng SQL để tính <code>123 + 456</code>, đặt tên cột kết quả là <code>Tong</code>.',
    hint:'SELECT có thể tính toán: SELECT 1+2 AS Ten;',
    initSQL:"",
    check: r => r.length===1 && r[0].values[0][0]===579 && r[0].columns[0]==='Tong' },
],
'db-tables': [
  { id:'ex2-1', title:'Xem toàn bộ bảng', diff:'easy',
    desc:'Hiển thị <strong>tất cả dữ liệu</strong> trong bảng <code>SinhVien</code>.',
    hint:'Dùng SELECT * FROM ...',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('MaSV') && r[0].columns.includes('HoTen') && r[0].values.length>=10 },
  { id:'ex2-2', title:'Xem bảng sản phẩm', diff:'easy',
    desc:'Hiển thị <strong>tên sản phẩm</strong> và <strong>giá</strong> của tất cả sản phẩm trong bảng <code>SanPham</code>.',
    hint:'SELECT cot1, cot2 FROM TenBang;',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.length===2 && r[0].columns.includes('TenSP') && r[0].columns.includes('Gia') },
],
'select': [
  { id:'ex3-1', title:'Chọn cột cụ thể', diff:'easy',
    desc:'Lấy <strong>Họ tên</strong> và <strong>Điểm TB</strong> của tất cả sinh viên.',
    hint:'SELECT HoTen, DiemTB FROM SinhVien;',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.length===2 && r[0].columns[0]==='HoTen' && r[0].columns[1]==='DiemTB' },
  { id:'ex3-2', title:'Alias - Đặt tên cột', diff:'easy',
    desc:'Lấy họ tên sinh viên đặt alias là <code>Ho_Ten</code> và điểm TB đặt alias là <code>Diem</code>.',
    hint:'Dùng AS để đặt alias: SELECT Cot AS TenMoi',
    initSQL:"",
    check: r => r.length===1 && r[0].columns[0]==='Ho_Ten' && r[0].columns[1]==='Diem' },
  { id:'ex3-3', title:'Tính toán trong SELECT', diff:'medium',
    desc:'Hiển thị <strong>tên sản phẩm</strong>, <strong>giá gốc</strong>, và <strong>giá sau giảm 10%</strong> (đặt tên cột là <code>GiaGiam</code>).',
    hint:'Giá giảm 10% = Gia * 0.9',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('GiaGiam') && r[0].columns.includes('TenSP') },
],
'where': [
  { id:'ex4-1', title:'Lọc theo điều kiện', diff:'easy',
    desc:'Tìm tất cả sinh viên có <strong>điểm TB >= 8.5</strong>.',
    hint:'SELECT * FROM SinhVien WHERE DiemTB >= 8.5;',
    initSQL:"",
    check: r => r.length===1 && r[0].values.length>=3 && r[0].values.every(v=>v[5]>=8.5) },
  { id:'ex4-2', title:'Kết hợp AND', diff:'easy',
    desc:'Tìm sinh viên <strong>nữ</strong> và có <strong>điểm TB > 8</strong>.',
    hint:'Dùng AND kết hợp 2 điều kiện',
    initSQL:"",
    check: r => r.length===1 && r[0].values.length>=2 && r[0].values.every(v=>v[3]==='Nữ' && v[5]>8) },
  { id:'ex4-3', title:'Dùng LIKE', diff:'medium',
    desc:'Tìm tất cả sinh viên có họ <strong>Nguyễn</strong> (tên bắt đầu bằng "Nguyễn").',
    hint:'Dùng LIKE với % : WHERE HoTen LIKE \'Nguyễn%\'',
    initSQL:"",
    check: r => r.length===1 && r[0].values.length>=2 && r[0].values.every(v=>String(v[1]).startsWith('Nguyễn')) },
  { id:'ex4-4', title:'Dùng BETWEEN', diff:'medium',
    desc:'Tìm sản phẩm có giá từ <strong>5 triệu đến 10 triệu</strong>.',
    hint:'WHERE Gia BETWEEN 5000000 AND 10000000',
    initSQL:"",
    check: r => r.length===1 && r[0].values.every(v=>{ let g=v[3]||v[2]; return g>=5000000 && g<=10000000; }) },
  { id:'ex4-5', title:'Dùng IN', diff:'medium',
    desc:'Tìm sinh viên thuộc lớp <code>CNTT01</code> hoặc <code>CNTT03</code>.',
    hint:'WHERE Lop IN (\'CNTT01\', \'CNTT03\')',
    initSQL:"",
    check: r => r.length===1 && r[0].values.every(v=>['CNTT01','CNTT03'].includes(v[4])) },
],
'orderby-groupby': [
  { id:'ex5-1', title:'Sắp xếp điểm', diff:'easy',
    desc:'Hiển thị tất cả sinh viên, sắp xếp theo <strong>điểm TB giảm dần</strong>.',
    hint:'ORDER BY DiemTB DESC',
    initSQL:"",
    check: r => { if(!r.length||!r[0].values.length) return false; let vals=r[0].values.map(v=>v[5]||v[v.length-1]); return vals.every((v,i)=>i===0||v<=vals[i-1]); }},
  { id:'ex5-2', title:'Đếm theo lớp', diff:'medium',
    desc:'Đếm <strong>số sinh viên</strong> trong mỗi lớp. Hiển thị cột <code>Lop</code> và <code>SoSV</code>.',
    hint:'SELECT Lop, COUNT(*) AS SoSV FROM SinhVien GROUP BY Lop;',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('SoSV') && r[0].values.length>=3 },
  { id:'ex5-3', title:'HAVING', diff:'hard',
    desc:'Tìm các lớp có <strong>điểm trung bình > 8</strong>. Hiển thị <code>Lop</code> và <code>DiemTB</code>.',
    hint:'Dùng GROUP BY ... HAVING AVG(...) > 8',
    initSQL:"",
    check: r => r.length===1 && r[0].values.every(v=>v[1]>8) },
],
'aggregate': [
  { id:'ex6-1', title:'Tổng giá trị tồn kho', diff:'medium',
    desc:'Tính <strong>tổng giá trị tồn kho</strong> = SUM(Gia * SoLuong) của tất cả sản phẩm. Đặt tên cột là <code>TongGiaTri</code>.',
    hint:'SELECT SUM(Gia * SoLuong) AS TongGiaTri FROM SanPham;',
    initSQL:"",
    check: r => r.length===1 && r[0].columns[0]==='TongGiaTri' && r[0].values[0][0]>0 },
  { id:'ex6-2', title:'Min/Max lương', diff:'easy',
    desc:'Tìm <strong>lương thấp nhất</strong> và <strong>lương cao nhất</strong> của nhân viên. Đặt tên <code>LuongMin</code> và <code>LuongMax</code>.',
    hint:'SELECT MIN(Luong) AS LuongMin, MAX(Luong) AS LuongMax FROM NhanVien;',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('LuongMin') && r[0].columns.includes('LuongMax') },
  { id:'ex6-3', title:'Thống kê phòng ban', diff:'hard',
    desc:'Thống kê mỗi phòng ban: <code>PhongBan</code>, <code>SoNV</code> (số nhân viên), <code>LuongTB</code> (lương trung bình). Sắp xếp theo LuongTB giảm dần.',
    hint:'GROUP BY PhongBan, dùng COUNT và AVG, ORDER BY DESC',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('PhongBan') && r[0].columns.includes('SoNV') && r[0].values.length>=3 },
],
'inner-join': [
  { id:'ex7-1', title:'JOIN đơn giản', diff:'easy',
    desc:'Kết hợp bảng <code>DonHang</code> và <code>KhachHang</code> để hiển thị: <code>MaDH</code>, <code>HoTen</code> (khách hàng), <code>TongTien</code>.',
    hint:'SELECT DH.MaDH, KH.HoTen, DH.TongTien FROM DonHang DH INNER JOIN KhachHang KH ON ...',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('HoTen') && r[0].columns.includes('TongTien') && r[0].values.length>=8 },
  { id:'ex7-2', title:'JOIN + GROUP BY', diff:'hard',
    desc:'Tìm <strong>tổng chi tiêu</strong> của mỗi khách hàng. Hiển thị <code>HoTen</code> và <code>TongChi</code>, sắp xếp giảm dần.',
    hint:'JOIN KhachHang, GROUP BY HoTen, SUM(TongTien), ORDER BY DESC',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('TongChi') && r[0].values.length>=4 },
],
'left-right-join': [
  { id:'ex8-1', title:'Tìm KH chưa mua hàng', diff:'medium',
    desc:'Tìm khách hàng <strong>chưa có đơn hàng nào</strong>. Hiển thị <code>HoTen</code> và <code>Email</code>.',
    hint:'LEFT JOIN + WHERE MaDH IS NULL',
    initSQL:"",
    check: r => r.length===1 && r[0].values.length>=1 && r[0].columns.includes('HoTen') },
],
'subquery-where': [
  { id:'ex9-1', title:'Subquery cơ bản', diff:'medium',
    desc:'Tìm sinh viên có điểm TB <strong>cao nhất</strong> (dùng subquery, không dùng ORDER BY LIMIT).',
    hint:'WHERE DiemTB = (SELECT MAX(DiemTB) FROM SinhVien)',
    initSQL:"",
    check: r => r.length===1 && r[0].values.length>=1 && r[0].values[0][5]>=9.0 },
  { id:'ex9-2', title:'SP giá trên trung bình', diff:'medium',
    desc:'Tìm sản phẩm có giá <strong>cao hơn giá trung bình</strong>. Hiển thị <code>TenSP</code> và <code>Gia</code>.',
    hint:'WHERE Gia > (SELECT AVG(Gia) FROM SanPham)',
    initSQL:"",
    check: r => r.length===1 && r[0].values.length>=3 },
],
'window-functions': [
  { id:'ex10-1', title:'Xếp hạng sinh viên', diff:'hard',
    desc:'Xếp hạng sinh viên theo điểm TB giảm dần. Hiển thị <code>HoTen</code>, <code>DiemTB</code>, <code>XepHang</code> (dùng RANK).',
    hint:'RANK() OVER (ORDER BY DiemTB DESC) AS XepHang',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('XepHang') },
  { id:'ex10-2', title:'Xếp hạng theo lớp', diff:'hard',
    desc:'Xếp hạng sinh viên <strong>trong mỗi lớp</strong>. Hiển thị <code>HoTen</code>, <code>Lop</code>, <code>DiemTB</code>, <code>HangTrongLop</code>.',
    hint:'RANK() OVER (PARTITION BY Lop ORDER BY DiemTB DESC)',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('HangTrongLop') },
],
'cte': [
  { id:'ex11-1', title:'CTE cơ bản', diff:'hard',
    desc:'Dùng CTE tên <code>SVGioi</code> chứa sinh viên điểm >= 8, sau đó đếm số SV giỏi mỗi lớp. Hiển thị <code>Lop</code> và <code>SoSVGioi</code>.',
    hint:'WITH SVGioi AS (...) SELECT Lop, COUNT(*) AS SoSVGioi FROM SVGioi GROUP BY Lop;',
    initSQL:"",
    check: r => r.length===1 && r[0].columns.includes('SoSVGioi') },
],
};

function findExercise(id) {
  for (const lessonId in EXERCISES) {
    const found = EXERCISES[lessonId].find(e => e.id === id);
    if (found) return { lessonId, exercise: found };
  }
  return null;
}

function getChapterForLesson(lessonId) {
  if (typeof SQL_CHAPTERS === 'undefined') return null;
  return SQL_CHAPTERS.find(ch => ch.lessons.some(l => l.id === lessonId)) || null;
}

function getChapterExerciseStats(lessonId, solved = JSON.parse(localStorage.getItem('sql_solved') || '[]')) {
  const chapter = getChapterForLesson(lessonId);
  const lessonIds = chapter ? chapter.lessons.map(l => l.id) : [lessonId];
  const ids = lessonIds.flatMap(id => (EXERCISES[id] || []).map(ex => ex.id));
  const done = ids.filter(id => solved.includes(id)).length;
  const total = ids.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return {
    chapterTitle: chapter?.title || 'Phần hiện tại',
    done,
    total,
    percent
  };
}

function isLessonExercisesComplete(lessonId, solved = JSON.parse(localStorage.getItem('sql_solved') || '[]')) {
  const exs = EXERCISES[lessonId] || [];
  return exs.length > 0 && exs.every(ex => solved.includes(ex.id));
}

function updateDialectUI() {
  const dialect = typeof getSelectedDialect === 'function' ? getSelectedDialect() : 'sqlite';
  const dialectInfo = typeof SQL_DIALECTS !== 'undefined' ? SQL_DIALECTS[dialect] : null;
  document.querySelectorAll('.dialect-current-name').forEach(el => {
    el.textContent = dialectInfo?.name || dialect;
  });
  document.querySelectorAll('.dialect-current-note').forEach(el => {
    el.textContent = dialectInfo?.note || '';
  });
  document.querySelectorAll('.exercise-dialect-select').forEach(el => {
    el.value = dialect;
  });
  document.querySelectorAll('.exercise-dialect-tipline').forEach(el => {
    el.textContent = getDialectPracticeTip(dialect);
  });
}

const EXERCISE_DIFF_META = {
  easy: { rank: 1, label: 'Dễ', color: '#10b981' },
  medium: { rank: 2, label: 'Trung bình', color: '#f59e0b' },
  hard: { rank: 3, label: 'Khó', color: '#ef4444' },
  expert: { rank: 4, label: 'Cực khó', color: '#f97316' }
};

const EXERCISE_EXPECTED_SQL = {
  'ex1-1': "SELECT 'Hello SQL' AS LoiChao;",
  'ex1-2': 'SELECT 123 + 456 AS Tong;',
  'ex1-3': "SELECT 'SQL' AS ChuDe, 2026 AS NamHoc;",
  'ex1-4': "SELECT CASE WHEN 10 > 5 THEN 'Dung' ELSE 'Sai' END AS KetQua;",
  'ex1-5': "SELECT 'De' AS MucDo UNION ALL SELECT 'Kho' UNION ALL SELECT 'Cuc kho';",
  'ex2-1': 'SELECT * FROM SinhVien;',
  'ex2-2': 'SELECT TenSP, Gia FROM SanPham;',
  'ex2-3': "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;",
  'ex2-4': "SELECT 'SinhVien' AS Bang, COUNT(*) AS SoDong FROM SinhVien UNION ALL SELECT 'SanPham', COUNT(*) FROM SanPham UNION ALL SELECT 'KhachHang', COUNT(*) FROM KhachHang UNION ALL SELECT 'DonHang', COUNT(*) FROM DonHang UNION ALL SELECT 'NhanVien', COUNT(*) FROM NhanVien;",
  'ex2-5': "WITH Dem AS (SELECT 'SinhVien' AS Bang, COUNT(*) AS SoDong FROM SinhVien UNION ALL SELECT 'SanPham', COUNT(*) FROM SanPham UNION ALL SELECT 'KhachHang', COUNT(*) FROM KhachHang UNION ALL SELECT 'DonHang', COUNT(*) FROM DonHang UNION ALL SELECT 'NhanVien', COUNT(*) FROM NhanVien) SELECT Bang, SoDong FROM Dem WHERE SoDong >= 8;",
  'exdt-1': "SELECT typeof(100) AS KieuSo, typeof(3.14) AS KieuThuc, typeof('SQL') AS KieuChuoi;",
  'exdt-2': "SELECT CAST('2026' AS INTEGER) AS Nam;",
  'exdt-4': 'SELECT TenSP, Gia, typeof(Gia) AS KieuGia FROM SanPham;',
  'excr-1': "INSERT INTO SinhVien (HoTen, Tuoi, GioiTinh, Lop, DiemTB) VALUES ('Lê Văn Test', 21, 'Nam', 'CNTT02', 8.0); SELECT * FROM SinhVien WHERE HoTen = 'Lê Văn Test';",
  'excr-2': 'UPDATE SinhVien SET DiemTB = 7.5 WHERE MaSV = 5; SELECT * FROM SinhVien WHERE MaSV = 5;',
  'excr-3': "INSERT INTO SanPham (TenSP, DanhMuc, Gia, SoLuong) VALUES ('USB Test 128GB', 'Phụ kiện', 350000, 60); SELECT * FROM SanPham WHERE TenSP = 'USB Test 128GB';",
  'excr-4': 'UPDATE SanPham SET SoLuong = SoLuong - 3 WHERE MaSP = 1; SELECT MaSP, SoLuong FROM SanPham WHERE MaSP = 1;',
  'excr-5': "DELETE FROM DonHang WHERE TrangThai = 'Chờ xử lý'; SELECT COUNT(*) AS ConLai FROM DonHang WHERE TrangThai = 'Chờ xử lý';",
  'ex3-1': 'SELECT HoTen, DiemTB FROM SinhVien;',
  'ex3-2': 'SELECT HoTen AS Ho_Ten, DiemTB AS Diem FROM SinhVien;',
  'ex3-3': 'SELECT TenSP, Gia, Gia * 0.9 AS GiaGiam FROM SanPham;',
  'ex3-4': "SELECT HoTen, DiemTB, CASE WHEN DiemTB >= 8 THEN 'Gioi' ELSE 'Can co gang' END AS Loai FROM SinhVien;",
  'ex3-5': 'SELECT TenSP, ROUND(Gia / 1000000.0, 1) AS GiaTrieu FROM SanPham;',
  'ex3-6': 'SELECT TenSP, Gia * SoLuong AS GiaTriTonKho FROM SanPham ORDER BY GiaTriTonKho DESC;',
  'ex4-1': 'SELECT * FROM SinhVien WHERE DiemTB >= 8.5;',
  'ex4-2': "SELECT * FROM SinhVien WHERE GioiTinh = 'Nữ' AND DiemTB > 8;",
  'ex4-3': "SELECT * FROM SinhVien WHERE HoTen LIKE 'Nguyễn%';",
  'ex4-4': 'SELECT * FROM SanPham WHERE Gia BETWEEN 5000000 AND 10000000;',
  'ex4-5': "SELECT * FROM SinhVien WHERE Lop IN ('CNTT01', 'CNTT03');",
  'ex4-6': 'SELECT HoTen, SoDienThoai FROM KhachHang WHERE SoDienThoai IS NULL;',
  'ex4-7': "SELECT * FROM SanPham WHERE DanhMuc IN ('Laptop', 'Điện thoại') AND Gia > 25000000;",
  'ex4-8': "SELECT HoTen, Lop, DiemTB FROM SinhVien WHERE DiemTB > (SELECT AVG(DiemTB) FROM SinhVien) AND Lop <> 'CNTT01';",
  'ex5-1': 'SELECT * FROM SinhVien ORDER BY DiemTB DESC;',
  'ex5-2': 'SELECT Lop, COUNT(*) AS SoSV FROM SinhVien GROUP BY Lop;',
  'ex5-3': 'SELECT Lop, AVG(DiemTB) AS DiemTB FROM SinhVien GROUP BY Lop HAVING AVG(DiemTB) > 8;',
  'ex5-4': 'SELECT TenSP, DanhMuc, Gia FROM SanPham ORDER BY DanhMuc ASC, Gia DESC;',
  'ex5-5': 'SELECT DanhMuc, COUNT(*) AS SoSP FROM SanPham GROUP BY DanhMuc HAVING COUNT(*) >= 2;',
  'ex5-6': 'SELECT S1.Lop, S1.HoTen, S1.DiemTB FROM SinhVien S1 WHERE S1.DiemTB = (SELECT MAX(S2.DiemTB) FROM SinhVien S2 WHERE S2.Lop = S1.Lop) ORDER BY S1.Lop;',
  'exld-1': 'SELECT TenSP, Gia FROM SanPham ORDER BY Gia DESC LIMIT 5;',
  'exld-2': 'SELECT DISTINCT PhongBan FROM NhanVien;',
  'exld-3': 'SELECT * FROM SanPham ORDER BY MaSP ASC LIMIT 3 OFFSET 3;',
  'exld-4': 'SELECT COUNT(DISTINCT DanhMuc) AS SoDanhMuc FROM SanPham;',
  'exld-5': 'SELECT TenSP, Gia FROM SanPham ORDER BY Gia DESC LIMIT 1 OFFSET 1;',
  'ex6-1': 'SELECT SUM(Gia * SoLuong) AS TongGiaTri FROM SanPham;',
  'ex6-2': 'SELECT MIN(Luong) AS LuongMin, MAX(Luong) AS LuongMax FROM NhanVien;',
  'ex6-3': 'SELECT PhongBan, COUNT(*) AS SoNV, AVG(Luong) AS LuongTB FROM NhanVien GROUP BY PhongBan ORDER BY LuongTB DESC;',
  'ex6-4': 'SELECT GioiTinh, AVG(DiemTB) AS DiemTB FROM SinhVien GROUP BY GioiTinh;',
  'ex6-5': 'SELECT COUNT(*) AS TongSV, SUM(CASE WHEN DiemTB >= 8 THEN 1 ELSE 0 END) AS SoSVGioi FROM SinhVien;',
  'ex6-6': 'SELECT DanhMuc, SUM(Gia * SoLuong) AS TongTonKho FROM SanPham GROUP BY DanhMuc HAVING SUM(Gia * SoLuong) > 500000000;',
  'exsf-1': "SELECT HoTen || ' - ' || Lop AS ThongTin FROM SinhVien;",
  'exsf-2': 'SELECT HoTen, UPPER(HoTen) AS TenHoa FROM SinhVien;',
  'exsf-3': 'SELECT Lop, SUBSTR(Lop, 1, 4) AS MaNganh FROM SinhVien;',
  'exsf-4': "SELECT HoTen, Email, SUBSTR(Email, INSTR(Email, '@') + 1) AS Domain FROM KhachHang WHERE Email IS NOT NULL;",
  'exsf-5': "SELECT TenSP, LOWER(REPLACE(TenSP, ' ', '-')) AS Slug FROM SanPham;",
  'exdf-1': "SELECT DATE('now') AS HomNay;",
  'exdf-2': "SELECT DATE('2024-01-15', '+30 days') AS HanXuLy;",
  'exdf-3': "SELECT STRFTIME('%Y-%m', NgayDat) AS Thang, COUNT(*) AS SoDon FROM DonHang GROUP BY Thang;",
  'exdf-4': 'SELECT JULIANDAY(MAX(NgayDat)) - JULIANDAY(MIN(NgayDat)) AS SoNgay FROM DonHang;',
  'exdf-5': "SELECT STRFTIME('%Y-%m', NgayDat) AS Thang, SUM(TongTien) AS DoanhThu FROM DonHang GROUP BY Thang ORDER BY DoanhThu DESC LIMIT 1;",
  'ex7-1': 'SELECT DH.MaDH, KH.HoTen, DH.TongTien FROM DonHang DH INNER JOIN KhachHang KH ON DH.MaKH = KH.MaKH;',
  'ex7-2': 'SELECT KH.HoTen, SUM(DH.TongTien) AS TongChi FROM KhachHang KH INNER JOIN DonHang DH ON KH.MaKH = DH.MaKH GROUP BY KH.MaKH, KH.HoTen ORDER BY TongChi DESC;',
  'ex7-3': "SELECT DH.MaDH, KH.HoTen, DH.TrangThai FROM DonHang DH JOIN KhachHang KH ON DH.MaKH = KH.MaKH WHERE DH.TrangThai = 'Đã giao';",
  'ex7-4': 'SELECT KH.DiaChi, SUM(DH.TongTien) AS DoanhThu FROM KhachHang KH JOIN DonHang DH ON KH.MaKH = DH.MaKH GROUP BY KH.DiaChi;',
  'ex8-1': 'SELECT KH.HoTen, KH.Email FROM KhachHang KH LEFT JOIN DonHang DH ON KH.MaKH = DH.MaKH WHERE DH.MaDH IS NULL;',
  'ex8-2': 'SELECT KH.HoTen, COUNT(DH.MaDH) AS SoDon FROM KhachHang KH LEFT JOIN DonHang DH ON KH.MaKH = DH.MaKH GROUP BY KH.MaKH, KH.HoTen;',
  'ex8-3': 'SELECT KH.HoTen, COALESCE(SUM(DH.TongTien), 0) AS TongChi FROM KhachHang KH LEFT JOIN DonHang DH ON KH.MaKH = DH.MaKH GROUP BY KH.MaKH, KH.HoTen;',
  'ex9-1': 'SELECT * FROM SinhVien WHERE DiemTB = (SELECT MAX(DiemTB) FROM SinhVien);',
  'ex9-2': 'SELECT TenSP, Gia FROM SanPham WHERE Gia > (SELECT AVG(Gia) FROM SanPham);',
  'ex10-1': 'SELECT HoTen, DiemTB, RANK() OVER (ORDER BY DiemTB DESC) AS XepHang FROM SinhVien;',
  'ex10-2': 'SELECT HoTen, Lop, DiemTB, RANK() OVER (PARTITION BY Lop ORDER BY DiemTB DESC) AS HangTrongLop FROM SinhVien;',
  'ex10-3': 'SELECT TenSP, Gia, ROW_NUMBER() OVER (ORDER BY Gia DESC) AS STT FROM SanPham;',
  'ex10-4': 'SELECT NgayDat, TongTien, SUM(TongTien) OVER (ORDER BY NgayDat ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS DoanhThuLuyKe FROM DonHang ORDER BY NgayDat;',
  'ex10-5': 'SELECT NgayDat, TongTien, LAG(TongTien) OVER (ORDER BY NgayDat) AS TongTienTruoc, TongTien - LAG(TongTien) OVER (ORDER BY NgayDat) AS ChenhLech FROM DonHang ORDER BY NgayDat;',
  'ex11-1': 'WITH SVGioi AS (SELECT * FROM SinhVien WHERE DiemTB >= 8) SELECT Lop, COUNT(*) AS SoSVGioi FROM SVGioi GROUP BY Lop;',
  'ex11-2': 'WITH TongChi AS (SELECT MaKH, SUM(TongTien) AS TongChi FROM DonHang GROUP BY MaKH), KhachVIP AS (SELECT * FROM TongChi WHERE TongChi > 20000000) SELECT MaKH, TongChi FROM KhachVIP;',
  'ex11-3': 'WITH RECURSIVE Dem(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM Dem WHERE n < 12) SELECT SUM(n) AS Tong FROM Dem;',
  'ex11-4': 'WITH TonKho AS (SELECT DanhMuc, TenSP, Gia * SoLuong AS GiaTriTonKho FROM SanPham) SELECT DanhMuc, TenSP, GiaTriTonKho, RANK() OVER (PARTITION BY DanhMuc ORDER BY GiaTriTonKho DESC) AS HangDanhMuc FROM TonKho;'
};

const EXERCISE_SAMPLE_SQL = {
  'exdt-3': "CREATE TABLE DemoTypes (Ten TEXT, Gia REAL, Active INTEGER); INSERT INTO DemoTypes VALUES ('Basic SQL', 12.5, 1), ('Advanced SQL', 20.75, 0); SELECT * FROM DemoTypes;",
  'exdt-5': 'CREATE TABLE DiemKiemTra (Diem REAL CHECK(Diem >= 0 AND Diem <= 10)); INSERT INTO DiemKiemTra (Diem) VALUES (8.0), (9.0), (7.5); SELECT AVG(Diem) AS DiemTB FROM DiemKiemTra;',
  'ex7-5': 'WITH TongChi AS (SELECT KH.MaKH, KH.HoTen, SUM(DH.TongTien) AS TongChi FROM KhachHang KH JOIN DonHang DH ON KH.MaKH = DH.MaKH GROUP BY KH.MaKH, KH.HoTen) SELECT HoTen, TongChi FROM TongChi WHERE TongChi > (SELECT AVG(TongChi) FROM TongChi) ORDER BY TongChi DESC;',
  'ex8-4': "SELECT KH.HoTen, CASE WHEN COUNT(DH.MaDH) > 0 THEN 'Da mua' ELSE 'Chua mua' END AS TrangThaiMua FROM KhachHang KH LEFT JOIN DonHang DH ON KH.MaKH = DH.MaKH GROUP BY KH.MaKH, KH.HoTen;",
  'ex9-3': 'SELECT MaDH, TongTien FROM DonHang WHERE TongTien > (SELECT AVG(TongTien) FROM DonHang);',
  'ex9-4': "SELECT TenSP, Gia FROM SanPham WHERE Gia > (SELECT MAX(Gia) FROM SanPham WHERE DanhMuc = 'Phụ kiện');",
  'exfj-1': 'SELECT A.HoTen AS NhanVien1, B.HoTen AS NhanVien2, A.PhongBan FROM NhanVien A JOIN NhanVien B ON A.PhongBan = B.PhongBan AND A.MaNV < B.MaNV;',
  'exfj-2': 'SELECT A.HoTen AS NhanVien1, B.HoTen AS NhanVien2, A.PhongBan FROM NhanVien A JOIN NhanVien B ON A.PhongBan = B.PhongBan AND A.MaNV < B.MaNV;',
  'exfj-3': "WITH Expected(Lop) AS (VALUES ('CNTT01'), ('CNTT02'), ('CNTT03'), ('CNTT04')), Counts AS (SELECT Lop, COUNT(*) AS SoSV FROM SinhVien GROUP BY Lop) SELECT E.Lop, COALESCE(C.SoSV, 0) AS SoSV FROM Expected E LEFT JOIN Counts C ON E.Lop = C.Lop;",
  'exfj-4': 'SELECT A.HoTen, A.PhongBan, A.Luong FROM NhanVien A WHERE A.Luong > (SELECT AVG(B.Luong) FROM NhanVien B WHERE B.PhongBan = A.PhongBan);',
  'exsqfs-1': 'SELECT Lop, DiemTB FROM (SELECT Lop, AVG(DiemTB) AS DiemTB FROM SinhVien GROUP BY Lop) AS T WHERE DiemTB >= 8;',
  'exsqfs-2': 'SELECT TenSP, Gia, Gia - (SELECT AVG(Gia) FROM SanPham) AS ChenhLech FROM SanPham;',
  'exsqfs-3': 'SELECT KH.HoTen, T.TongChi FROM KhachHang KH JOIN (SELECT MaKH, SUM(TongTien) AS TongChi FROM DonHang GROUP BY MaKH) T ON KH.MaKH = T.MaKH;',
  'excorr-1': 'SELECT S1.TenSP, S1.DanhMuc, S1.Gia FROM SanPham S1 WHERE S1.Gia > (SELECT AVG(S2.Gia) FROM SanPham S2 WHERE S2.DanhMuc = S1.DanhMuc);',
  'excorr-2': 'SELECT KH.HoTen FROM KhachHang KH WHERE (SELECT COUNT(*) FROM DonHang DH WHERE DH.MaKH = KH.MaKH) >= 2;',
  'excorr-3': 'SELECT A.HoTen, A.PhongBan, A.Luong FROM NhanVien A WHERE NOT EXISTS (SELECT 1 FROM NhanVien B WHERE B.PhongBan = A.PhongBan AND B.Luong > A.Luong);',
  'exuc-1': "CREATE TABLE SanPhamMoi (ID INTEGER PRIMARY KEY, TenSP TEXT NOT NULL UNIQUE, Gia REAL CHECK(Gia >= 0)); INSERT INTO SanPhamMoi VALUES (1, 'USB Demo', 350000), (2, 'Mouse Demo', 180000); SELECT * FROM SanPhamMoi;",
  'exvw-1': 'CREATE VIEW ThongKeDH AS SELECT KH.HoTen, COUNT(DH.MaDH) AS SoDon, SUM(DH.TongTien) AS TongChi FROM KhachHang KH JOIN DonHang DH ON KH.MaKH = DH.MaKH GROUP BY KH.MaKH, KH.HoTen; SELECT * FROM ThongKeDH;',
  'extx-1': "BEGIN; INSERT INTO NhanVien (HoTen, PhongBan, ChucVu, Luong) VALUES ('Demo A', 'Kỹ thuật', 'Tester', 12000000); INSERT INTO NhanVien (HoTen, PhongBan, ChucVu, Luong) VALUES ('Demo B', 'Kinh doanh', 'Sales', 13000000); COMMIT; SELECT * FROM NhanVien;",
  'expk-1': "CREATE TABLE MonHoc (MaMon TEXT PRIMARY KEY, TenMon TEXT); INSERT INTO MonHoc VALUES ('SQL101', 'Nhap mon SQL'), ('DB201', 'Co so du lieu'); SELECT * FROM MonHoc;",
  'expk-2': "CREATE TABLE DangKyMon (MaSV INTEGER, MaMon TEXT, PRIMARY KEY (MaSV, MaMon)); INSERT INTO DangKyMon VALUES (1, 'SQL101'), (2, 'DB201'); SELECT * FROM DangKyMon;",
  'expk-3': "CREATE TABLE DemoPK (ID INTEGER PRIMARY KEY, Ten TEXT); INSERT INTO DemoPK VALUES (1, 'A'); INSERT OR IGNORE INTO DemoPK VALUES (1, 'B'); SELECT COUNT(*) AS SoDong FROM DemoPK;",
  'exfk-1': 'PRAGMA foreign_key_list(DonHang);',
  'exfk-2': "CREATE TABLE PhongBanMoi (MaPB INTEGER PRIMARY KEY, TenPB TEXT); CREATE TABLE NhanVienMoi (MaNV INTEGER PRIMARY KEY, TenNV TEXT, MaPB INTEGER, FOREIGN KEY (MaPB) REFERENCES PhongBanMoi(MaPB)); PRAGMA foreign_key_list(NhanVienMoi);",
  'exfk-3': "CREATE TABLE PhongBanMoi (MaPB INTEGER PRIMARY KEY, TenPB TEXT); CREATE TABLE NhanVienMoi (MaNV INTEGER PRIMARY KEY, TenNV TEXT, MaPB INTEGER, FOREIGN KEY (MaPB) REFERENCES PhongBanMoi(MaPB)); INSERT INTO PhongBanMoi VALUES (1, 'Ky thuat'); INSERT INTO NhanVienMoi VALUES (1, 'Demo NV', 1); SELECT NV.TenNV, PB.TenPB FROM NhanVienMoi NV JOIN PhongBanMoi PB ON NV.MaPB = PB.MaPB;",
  'exuc-2': "CREATE TABLE UserEmail (ID INTEGER PRIMARY KEY, Email TEXT UNIQUE NOT NULL); INSERT INTO UserEmail (Email) VALUES ('a@example.com'), ('b@example.com'); SELECT Email FROM UserEmail;",
  'exuc-3': "CREATE TABLE UserEmail (Email TEXT UNIQUE NOT NULL); INSERT INTO UserEmail VALUES ('a@example.com'); INSERT OR IGNORE INTO UserEmail VALUES ('a@example.com'); SELECT COUNT(*) AS SoEmail FROM UserEmail;",
  'exuc-4': 'CREATE TABLE DiemHopLe (Diem REAL CHECK(Diem >= 0 AND Diem <= 10)); INSERT INTO DiemHopLe VALUES (8.0), (9.0), (7.5); SELECT AVG(Diem) AS DiemTB FROM DiemHopLe;',
  'exidx-1': 'CREATE INDEX idx_sinhvien_lop ON SinhVien(Lop); PRAGMA index_list(SinhVien);',
  'exidx-2': 'CREATE INDEX idx_sp_dm_gia ON SanPham(DanhMuc, Gia); PRAGMA index_info(idx_sp_dm_gia);',
  'exidx-3': "CREATE INDEX idx_sinhvien_lop ON SinhVien(Lop); EXPLAIN QUERY PLAN SELECT * FROM SinhVien WHERE Lop = 'CNTT01';",
  'exvw-2': 'CREATE VIEW V_SVGioi AS SELECT HoTen, DiemTB FROM SinhVien WHERE DiemTB >= 8; SELECT * FROM V_SVGioi;',
  'exvw-3': 'CREATE VIEW V_TonKhoDanhMuc AS SELECT DanhMuc, SUM(Gia * SoLuong) AS TongTonKho FROM SanPham GROUP BY DanhMuc; SELECT * FROM V_TonKhoDanhMuc;',
  'exvw-4': 'CREATE VIEW V_XepHangSP AS SELECT TenSP, Gia, RANK() OVER (ORDER BY Gia DESC) AS XepHangGia FROM SanPham; SELECT * FROM V_XepHangSP;',
  'extx-2': 'BEGIN; UPDATE SinhVien SET DiemTB = 10 WHERE MaSV = 1; ROLLBACK; SELECT MaSV, DiemTB FROM SinhVien WHERE MaSV = 1;',
  'extx-3': 'BEGIN; UPDATE SinhVien SET DiemTB = 9.9 WHERE MaSV = 1; SAVEPOINT sp1; UPDATE SinhVien SET DiemTB = 1.0 WHERE MaSV = 2; ROLLBACK TO sp1; RELEASE sp1; COMMIT; SELECT MaSV, DiemTB FROM SinhVien WHERE MaSV IN (1, 2) ORDER BY MaSV;',
  'extx-4': "BEGIN; INSERT INTO DonHang (MaKH, NgayDat, TongTien, TrangThai) VALUES (6, '2024-04-15', 1200000, 'Chờ xử lý'); COMMIT; SELECT MaKH, MaDH, TongTien FROM DonHang WHERE MaKH = 6;",
  'exacid-1': 'BEGIN; UPDATE SinhVien SET DiemTB = 10 WHERE MaSV IN (1, 2); ROLLBACK; SELECT MaSV, DiemTB FROM SinhVien WHERE MaSV IN (1, 2) ORDER BY MaSV;',
  'exacid-2': "BEGIN; UPDATE KhachHang SET SoDienThoai = '0999000001' WHERE MaKH = 1; UPDATE KhachHang SET SoDienThoai = '0999000002' WHERE MaKH = 2; COMMIT; SELECT MaKH, SoDienThoai FROM KhachHang WHERE MaKH IN (1, 2) ORDER BY MaKH;",
  'exacid-3': 'CREATE TABLE DiemACID (Diem REAL CHECK(Diem >= 0 AND Diem <= 10)); BEGIN; INSERT INTO DiemACID VALUES (8.0), (9.5); COMMIT; SELECT COUNT(*) AS SoDong FROM DiemACID;',
  'exnf-1': "CREATE TABLE MonHocNF (MaMon TEXT PRIMARY KEY, TenMon TEXT); CREATE TABLE DangKyNF (MaSV INTEGER, MaMon TEXT, PRIMARY KEY (MaSV, MaMon)); INSERT INTO MonHocNF VALUES ('SQL101', 'SQL Co ban'), ('DB201', 'Thiet ke CSDL'); INSERT INTO DangKyNF VALUES (1, 'SQL101'), (2, 'DB201'); SELECT DK.MaSV, MH.TenMon FROM DangKyNF DK JOIN MonHocNF MH ON DK.MaMon = MH.MaMon;",
  'exnf-2': "WITH BadOrders(Email) AS (VALUES ('a@example.com'), ('a@example.com'), ('b@example.com')) SELECT Email, COUNT(*) AS SoLan FROM BadOrders GROUP BY Email HAVING COUNT(*) > 1;",
  'exred-1': "WITH BadOrders(Email) AS (VALUES ('a@example.com'), ('a@example.com'), ('b@example.com')) SELECT Email, COUNT(*) AS SoLan FROM BadOrders GROUP BY Email HAVING COUNT(*) > 1;",
  'exred-2': 'SELECT DH.MaDH, KH.HoTen, KH.Email, DH.TongTien FROM DonHang DH JOIN KhachHang KH ON DH.MaKH = KH.MaKH;',
  'extr-1': "CREATE TABLE AuditLog (ID INTEGER PRIMARY KEY AUTOINCREMENT, HanhDong TEXT, ThoiGian TEXT); CREATE TRIGGER log_them_sp AFTER INSERT ON SanPham BEGIN INSERT INTO AuditLog (HanhDong, ThoiGian) VALUES ('Them SP moi', DATETIME('now')); END; INSERT INTO SanPham (TenSP, DanhMuc, Gia, SoLuong) VALUES ('Demo Trigger', 'Phụ kiện', 100000, 5); SELECT * FROM AuditLog;",
  'extr-2': 'CREATE TABLE DiemLog (ID INTEGER PRIMARY KEY AUTOINCREMENT, MaSV INTEGER, DiemCu REAL, DiemMoi REAL); CREATE TRIGGER log_diem AFTER UPDATE OF DiemTB ON SinhVien BEGIN INSERT INTO DiemLog (MaSV, DiemCu, DiemMoi) VALUES (NEW.MaSV, OLD.DiemTB, NEW.DiemTB); END; UPDATE SinhVien SET DiemTB = 8.9 WHERE MaSV = 1; SELECT * FROM DiemLog;',
  'extr-3': 'CREATE TABLE LogXoaSP (TenSP TEXT); CREATE TRIGGER log_xoa_sp AFTER DELETE ON SanPham BEGIN INSERT INTO LogXoaSP (TenSP) VALUES (OLD.TenSP); END; DELETE FROM SanPham WHERE MaSP = 10; SELECT * FROM LogXoaSP;',
  'extr-4': 'CREATE TABLE ChiTietDonHang (MaSP INTEGER, SoLuong INTEGER); CREATE TRIGGER tru_ton AFTER INSERT ON ChiTietDonHang BEGIN UPDATE SanPham SET SoLuong = SoLuong - NEW.SoLuong WHERE MaSP = NEW.MaSP; END; INSERT INTO ChiTietDonHang VALUES (1, 2); SELECT MaSP, SoLuong FROM SanPham WHERE MaSP = 1;'
};

function getOrderedExercises(lessonId) {
  return (EXERCISES[lessonId] || [])
    .map((exercise, index) => ({ exercise, index }))
    .sort((a, b) => {
      const rankA = EXERCISE_DIFF_META[a.exercise.diff]?.rank || 99;
      const rankB = EXERCISE_DIFF_META[b.exercise.diff]?.rank || 99;
      return rankA - rankB || a.index - b.index;
    });
}

function getNextExercise(lessonId, solved) {
  return getOrderedExercises(lessonId).find(item => !solved.includes(item.exercise.id)) || null;
}

window.SQLExerciseActiveIds = window.SQLExerciseActiveIds || {};

function isExerciseUnlocked(lessonId, exerciseId, solved) {
  const next = getNextExercise(lessonId, solved);
  return solved.includes(exerciseId) || !next || next.exercise.id === exerciseId;
}

function getActiveExerciseItem(lessonId, solved) {
  const ordered = getOrderedExercises(lessonId);
  const selectedId = window.SQLExerciseActiveIds[lessonId];
  const selected = ordered.find(item => item.exercise.id === selectedId);
  if (selected && isExerciseUnlocked(lessonId, selected.exercise.id, solved)) return selected;
  return getNextExercise(lessonId, solved) || ordered[0] || null;
}

function setActiveExercise(lessonId, exerciseId) {
  const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
  if (!isExerciseUnlocked(lessonId, exerciseId, solved)) return;
  window.SQLExerciseActiveIds[lessonId] = exerciseId;
  refreshExerciseSection(lessonId);
}

function setActiveExerciseAfterSolve(lessonId, solved, currentId) {
  const next = getNextExercise(lessonId, solved);
  window.SQLExerciseActiveIds[lessonId] = next ? next.exercise.id : currentId;
}

function getExerciseExpectedSQL(ex, dialect) {
  const source = ex.expectedSQL || EXERCISE_EXPECTED_SQL[ex.id];
  if (!source) return '';
  if (typeof source === 'function') return source(dialect);
  if (typeof source === 'object') return source[dialect] || source.sqlite || Object.values(source)[0] || '';
  return source;
}

function getExerciseSampleSQL(ex, dialect) {
  const source = ex.sampleSQL || EXERCISE_SAMPLE_SQL[ex.id] || getExerciseExpectedSQL(ex, dialect);
  if (!source) return '';
  if (typeof source === 'function') return source(dialect);
  if (typeof source === 'object') return source[dialect] || source.sqlite || Object.values(source)[0] || '';
  return source;
}

function getDialectOptions(selected) {
  const dialects = typeof SQL_DIALECTS !== 'undefined' ? SQL_DIALECTS : {};
  return Object.entries(dialects).map(([value, info]) =>
    `<option value="${value}" ${value === selected ? 'selected' : ''}>${info.name}</option>`
  ).join('');
}

function getDialectPracticeTip(dialect) {
  const tips = {
    sqlite: 'SQLite: dùng LIMIT/OFFSET, nối chuỗi bằng ||, ngày bằng DATE()/STRFTIME().',
    mysql: 'MySQL: dùng LIMIT/OFFSET, CONCAT(), CURDATE()/NOW(), AUTO_INCREMENT.',
    postgresql: 'PostgreSQL: dùng LIMIT/OFFSET, || hoặc CONCAT(), CURRENT_DATE, SERIAL/IDENTITY.',
    sqlserver: 'SQL Server/MS SQL: dùng TOP, OFFSET/FETCH, CONCAT(), GETDATE(), LEN(), ISNULL().'
  };
  return tips[dialect] || '';
}

function setExerciseDialect(value, lessonId) {
  localStorage.setItem('sql_dialect', value);
  const globalSelect = document.getElementById('sql-dialect');
  if (globalSelect) globalSelect.value = value;
  updateDialectUI();
  refreshExerciseSection(lessonId);
}

function getLastSqlResult(results) {
  return (results || []).filter(item => item && Array.isArray(item.columns)).slice(-1)[0] || { columns: [], values: [] };
}

const EXERCISE_SAMPLE_TABLES = {
  SinhVien: {
    title: 'SinhVien',
    previewSQL: 'SELECT * FROM SinhVien ORDER BY MaSV LIMIT 5;',
    columns: [
      ['MaSV', 'INTEGER', 'Mã sinh viên, khóa chính tự tăng.'],
      ['HoTen', 'TEXT', 'Họ tên sinh viên.'],
      ['Tuoi', 'INTEGER', 'Tuổi sinh viên.'],
      ['GioiTinh', 'TEXT', 'Nam hoặc Nữ.'],
      ['Lop', 'TEXT', 'Mã lớp của sinh viên.'],
      ['DiemTB', 'REAL', 'Điểm trung bình.']
    ]
  },
  SanPham: {
    title: 'SanPham',
    previewSQL: 'SELECT * FROM SanPham ORDER BY MaSP LIMIT 5;',
    columns: [
      ['MaSP', 'INTEGER', 'Mã sản phẩm, khóa chính tự tăng.'],
      ['TenSP', 'TEXT', 'Tên sản phẩm.'],
      ['DanhMuc', 'TEXT', 'Danh mục sản phẩm.'],
      ['Gia', 'REAL', 'Giá bán.'],
      ['SoLuong', 'INTEGER', 'Số lượng tồn kho.']
    ]
  },
  KhachHang: {
    title: 'KhachHang',
    previewSQL: 'SELECT * FROM KhachHang ORDER BY MaKH LIMIT 5;',
    columns: [
      ['MaKH', 'INTEGER', 'Mã khách hàng, khóa chính tự tăng.'],
      ['HoTen', 'TEXT', 'Họ tên khách hàng.'],
      ['Email', 'TEXT', 'Email liên hệ.'],
      ['DiaChi', 'TEXT', 'Địa chỉ/tỉnh thành.'],
      ['SoDienThoai', 'TEXT', 'Số điện thoại, có thể NULL.']
    ]
  },
  DonHang: {
    title: 'DonHang',
    previewSQL: 'SELECT * FROM DonHang ORDER BY MaDH LIMIT 5;',
    columns: [
      ['MaDH', 'INTEGER', 'Mã đơn hàng, khóa chính tự tăng.'],
      ['MaKH', 'INTEGER', 'Mã khách hàng liên kết với KhachHang.'],
      ['NgayDat', 'TEXT', 'Ngày đặt hàng.'],
      ['TongTien', 'REAL', 'Tổng tiền đơn hàng.'],
      ['TrangThai', 'TEXT', 'Trạng thái xử lý đơn hàng.']
    ]
  },
  NhanVien: {
    title: 'NhanVien',
    previewSQL: 'SELECT * FROM NhanVien ORDER BY MaNV LIMIT 5;',
    columns: [
      ['MaNV', 'INTEGER', 'Mã nhân viên, khóa chính tự tăng.'],
      ['HoTen', 'TEXT', 'Họ tên nhân viên.'],
      ['PhongBan', 'TEXT', 'Phòng ban làm việc.'],
      ['ChucVu', 'TEXT', 'Chức vụ.'],
      ['Luong', 'REAL', 'Lương hàng tháng.']
    ]
  },
  sqlite_master: {
    title: 'sqlite_master',
    previewSQL: "SELECT type, name, tbl_name FROM sqlite_master WHERE type IN ('table','view') ORDER BY name LIMIT 8;",
    columns: [
      ['type', 'TEXT', 'Loại object trong SQLite.'],
      ['name', 'TEXT', 'Tên table/view/index.'],
      ['tbl_name', 'TEXT', 'Bảng liên quan đến object.'],
      ['rootpage', 'INTEGER', 'Trang gốc nội bộ của SQLite.'],
      ['sql', 'TEXT', 'Câu lệnh tạo object.']
    ]
  }
};

function escapeExerciseHTML(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

function renderHrDataTable(columns = [], rows = [], options = {}) {
  const limit = options.limit || rows.length;
  const visibleRows = (rows || []).slice(0, limit);
  if (!columns.length) {
    return `<div class="hr-empty">${options.emptyText || 'Không có bảng kết quả.'}</div>`;
  }
  return `
    <div class="hr-table-scroll">
      <table class="hr-data-table">
        <thead><tr>${columns.map(col => `<th>${escapeExerciseHTML(col)}</th>`).join('')}</tr></thead>
        <tbody>
          ${visibleRows.map(row => `<tr>${row.map(value => `<td>${value === null ? '<em>NULL</em>' : escapeExerciseHTML(value)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${rows.length > visibleRows.length ? `<div class="hr-table-note">Đang hiện ${visibleRows.length}/${rows.length} dòng mẫu.</div>` : ''}`;
}

function runExercisePreviewSQL(sql, dialect = 'sqlite') {
  if (!sql || typeof executeSQL !== 'function') return null;
  if (typeof resetDatabaseState === 'function') resetDatabaseState();
  const data = executeSQL(sql, { dialect });
  if (typeof resetDatabaseState === 'function') resetDatabaseState();
  return data;
}

function getExerciseTables(ex, expectedSQL = '') {
  if (Array.isArray(ex.sampleTables) && ex.sampleTables.length) {
    return ex.sampleTables.filter(name => EXERCISE_SAMPLE_TABLES[name]);
  }
  const text = `${ex.desc || ''} ${ex.hint || ''} ${expectedSQL || ''}`;
  return Object.keys(EXERCISE_SAMPLE_TABLES).filter(name => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  });
}

function renderInputFormat(tableNames) {
  if (!tableNames.length) {
    return '<p class="hr-muted">Bài này không cần bảng dữ liệu đầu vào; hãy tạo kết quả trực tiếp bằng câu lệnh SQL.</p>';
  }
  return tableNames.map(name => {
    const table = EXERCISE_SAMPLE_TABLES[name];
    return `
      <div class="hr-table-card">
        <div class="hr-table-title">${escapeExerciseHTML(table.title)}</div>
        ${renderHrDataTable(['Name', 'Type', 'Description'], table.columns)}
      </div>`;
  }).join('');
}

function renderSampleInput(tableNames) {
  if (!tableNames.length) {
    return '<p class="hr-muted">No table input.</p>';
  }
  return tableNames.map(name => {
    const table = EXERCISE_SAMPLE_TABLES[name];
    const data = runExercisePreviewSQL(table.previewSQL, 'sqlite');
    const result = data && !data.error ? getLastSqlResult(data.results) : null;
    return `
      <div class="hr-table-card">
        <div class="hr-table-title">${escapeExerciseHTML(table.title)}</div>
        ${result ? renderHrDataTable(result.columns, result.values, { limit: 6 }) : '<div class="hr-empty">Database đang tải, sample sẽ hiện sau khi tải xong.</div>'}
      </div>`;
  }).join('');
}

function renderSampleOutput(expectedData) {
  if (!expectedData) {
    return '<div class="hr-empty">Sample Output sẽ hiện với các bài có đáp án chạy trực tiếp.</div>';
  }
  if (expectedData.error) {
    return `<div class="hr-empty error">Không tạo được sample output: ${escapeExerciseHTML(expectedData.error)}</div>`;
  }
  const result = getLastSqlResult(expectedData.results);
  if (!result.columns.length) {
    return '<div class="hr-empty success">Câu lệnh cần thực thi thành công, không bắt buộc trả về bảng kết quả.</div>';
  }
  return renderHrDataTable(result.columns, result.values, { limit: 10 });
}

function renderOutputFormat(ex, expectedData, expectedSQL = '', exactExpected = true) {
  if (expectedData && !expectedData.error) {
    const result = getLastSqlResult(expectedData.results);
    if (result.columns.length) {
      const columns = result.columns.map(col => `<code>${escapeExerciseHTML(col)}</code>`).join(', ');
      if (!exactExpected) {
        return `<p>Sample Output minh họa một đáp án hợp lệ với các cột: ${columns}. Khi chạy thử, hệ thống vẫn kiểm tra theo điều kiện trong đề bài.</p>`;
      }
      const orderNote = /\border\s+by\b|\blimit\b|\boffset\b|\btop\b|\brank\s*\(|\brow_number\s*\(/i.test(expectedSQL)
        ? ' Thứ tự dòng phải đúng như Sample Output.'
        : ' Nếu đề bài không yêu cầu sắp xếp, hệ thống sẽ so sánh nội dung dòng.';
      return `<p>In ra ${result.values.length} dòng với các cột theo đúng thứ tự: ${columns}.${orderNote}</p>`;
    }
  }
  return `<p>Viết câu SQL đáp ứng đúng yêu cầu đề bài. Sau khi bấm <strong>Chạy thử</strong>, hệ thống sẽ so sánh <strong>Expected Output</strong> với <strong>Your Output</strong>.</p>`;
}

function renderHackerRankProblem(ex, expectedSQL, dialect) {
  const sampleSQL = getExerciseSampleSQL(ex, dialect);
  const tableNames = getExerciseTables(ex, `${expectedSQL || ''} ${sampleSQL || ''}`);
  const expectedData = sampleSQL ? runExercisePreviewSQL(sampleSQL, dialect) : null;
  const exactExpected = !!expectedSQL && sampleSQL === expectedSQL;
  return `
    <div class="hr-problem">
      <section class="hr-section">
        <h5>Problem</h5>
        <div class="hr-problem-text">${ex.desc}</div>
      </section>
      <section class="hr-section">
        <h5>Input Format</h5>
        ${renderInputFormat(tableNames)}
      </section>
      <section class="hr-section">
        <h5>Sample Input</h5>
        ${renderSampleInput(tableNames)}
      </section>
      <section class="hr-section">
        <h5>Sample Output</h5>
        ${renderSampleOutput(expectedData)}
      </section>
      <section class="hr-section">
        <h5>Output Format</h5>
        ${renderOutputFormat(ex, expectedData, sampleSQL, exactExpected)}
      </section>
    </div>`;
}

function normalizeCell(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number(value.toFixed(6));
  return String(value);
}

function normalizeRows(rows, orderSensitive) {
  const normalized = (rows || []).map(row => row.map(normalizeCell));
  return orderSensitive ? normalized : normalized.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

function compareResultSets(expectedResults, actualResults, expectedSql = '') {
  const expected = getLastSqlResult(expectedResults);
  const actual = getLastSqlResult(actualResults);
  const issues = [];
  const expectedColumns = expected.columns.map(String);
  const actualColumns = actual.columns.map(String);
  if (JSON.stringify(expectedColumns) !== JSON.stringify(actualColumns)) {
    issues.push(`Tên hoặc thứ tự cột chưa khớp. Mong muốn: ${expectedColumns.join(', ') || '(không có)'}; thực tế: ${actualColumns.join(', ') || '(không có)'}.`);
  }
  if ((expected.values || []).length !== (actual.values || []).length) {
    issues.push(`Số dòng chưa khớp. Mong muốn ${expected.values.length}, thực tế ${actual.values.length}.`);
  }
  const orderSensitive = /\border\s+by\b|\blimit\b|\boffset\b|\btop\b|\brank\s*\(|\brow_number\s*\(/i.test(expectedSql);
  const expectedRows = normalizeRows(expected.values, orderSensitive);
  const actualRows = normalizeRows(actual.values, orderSensitive);
  if (JSON.stringify(expectedRows) !== JSON.stringify(actualRows)) {
    issues.push(orderSensitive ? 'Dữ liệu hoặc thứ tự dòng chưa khớp.' : 'Dữ liệu dòng chưa khớp.');
  }
  return { ok: issues.length === 0, issues };
}

function renderExerciseComparison(expectedData, actualData, compare) {
  const summaryClass = compare.ok ? 'ok' : 'bad';
  const summaryText = compare.ok
    ? 'Correct: kết quả thực tế khớp với đáp án mong muốn.'
    : `Incorrect: ${compare.issues.join(' ')}`;
  return `
    <div class="ex-compare-summary ${summaryClass}">${summaryText}</div>
    <div class="ex-compare-grid">
      <div class="ex-compare-panel expected">
        <h5>Expected Output</h5>
        ${formatResults(expectedData)}
      </div>
      <div class="ex-compare-panel actual">
        <h5>Your Output</h5>
        ${formatResults(actualData)}
      </div>
    </div>`;
}

function renderActualOnlyResult(actualData) {
  return `
    <div class="ex-compare-panel actual single">
      <h5>Your Output</h5>
      ${formatResults(actualData)}
    </div>`;
}

function renderExerciseCard(ex, displayIndex, solved) {
  const meta = EXERCISE_DIFF_META[ex.diff] || { label: ex.diff, color: '#6b7280' };
  const isSolved = solved.includes(ex.id);
  const dialect = typeof getSelectedDialect === 'function' ? getSelectedDialect() : 'sqlite';
  const expectedSQL = getExerciseExpectedSQL(ex, dialect);
  return `
    <div class="exercise-card exercise-card-split ${isSolved ? 'solved' : ''}" id="ex-card-${ex.id}">
      <aside class="exercise-problem-pane">
        <div class="exercise-pane-head">
          <div class="ex-title-row">
            <span class="ex-number">#${displayIndex}</span>
            <h4 class="ex-title">${ex.title}</h4>
            <span class="ex-diff" style="background:${meta.color}20;color:${meta.color};border:1px solid ${meta.color}40">${meta.label}</span>
            ${isSolved ? '<span class="ex-solved-badge">✅ Đã giải</span>' : ''}
          </div>
        </div>
        ${renderHackerRankProblem(ex, expectedSQL, dialect)}
      </aside>
      <section class="exercise-solve-pane">
        <div class="solve-pane-head">
          <div>
            <span class="solve-pane-kicker">SQL Editor</span>
            <h4>Viết lời giải</h4>
          </div>
          <button class="ex-hint-toggle" onclick="toggleHint('${ex.id}')">💡 Gợi ý</button>
        </div>
        <div class="ex-dialect-tip">
          <strong>Ngôn ngữ hiện tại:</strong> <span class="dialect-current-name"></span>. ${getDialectPracticeTip(dialect)}
        </div>
        <div class="ex-hint" id="hint-${ex.id}" style="display:none">💡 <strong>Gợi ý:</strong> ${ex.hint}</div>
        <div class="ex-editor-wrap">
          <textarea class="ex-editor" id="editor-${ex.id}" placeholder="-- Viết câu lệnh SQL tại đây..." spellcheck="false" oninput="invalidateExerciseRun('${ex.id}')">${ex.initSQL}</textarea>
        </div>
        <div class="ex-actions">
          <button class="ex-btn ex-btn-run" onclick="runExercise('${ex.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg> Chạy thử
          </button>
          <button class="ex-btn ex-btn-submit" id="submit-${ex.id}" onclick="submitExercise('${ex.id}')" disabled>
            📤 Nộp bài
          </button>
          <button class="ex-btn ex-btn-reset" onclick="resetExercise('${ex.id}')">🔄 Reset</button>
        </div>
        <div class="exercise-output-wrap">
          <div class="exercise-output-title">Kết quả</div>
          <div class="ex-result" id="result-${ex.id}"></div>
          <div class="ex-feedback" id="feedback-${ex.id}"></div>
        </div>
      </section>
    </div>`;
}

function renderExerciseList(lessonId, ordered, solved, activeId) {
  const solvedInLesson = solved.filter(id => ordered.some(item => item.exercise.id === id)).length;
  return `
    <aside class="exercise-list-panel">
      <div class="exercise-list-head">
        <span>Danh sách bài tập</span>
        <strong>${solvedInLesson}/${ordered.length}</strong>
      </div>
      <div class="exercise-list-items">
        ${ordered.map((item, index) => {
          const ex = item.exercise;
          const meta = EXERCISE_DIFF_META[ex.diff] || { label: ex.diff, color: '#6b7280' };
          const isSolved = solved.includes(ex.id);
          const unlocked = isExerciseUnlocked(lessonId, ex.id, solved);
          const active = ex.id === activeId;
          const status = isSolved ? 'Đã giải' : unlocked ? 'Đang mở' : 'Khóa';
          return `
            <button class="exercise-list-item ${active ? 'active' : ''} ${isSolved ? 'solved' : ''} ${unlocked ? '' : 'locked'}" type="button" onclick="setActiveExercise('${lessonId}', '${ex.id}')" ${unlocked ? '' : 'disabled'}>
              <span class="exercise-list-number">#${index + 1}</span>
              <span class="exercise-list-meta">
                <strong>${ex.title}</strong>
                <small style="color:${meta.color}">${meta.label}</small>
              </span>
              <span class="exercise-list-status">${status}</span>
            </button>`;
        }).join('')}
      </div>
    </aside>`;
}

function refreshExerciseSection(lessonId) {
  const section = document.querySelector(`.exercises-section[data-lesson-id="${lessonId}"]`);
  if (!section) return;
  section.outerHTML = renderExercises(lessonId);
  updateDialectUI();
}

// Render exercises for a lesson
function renderExercises(lessonId) {
  const exs = EXERCISES[lessonId];
  if (!exs || exs.length === 0) return '';
  const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
  const lessonDone = exs.filter(e => solved.includes(e.id)).length;
  const lessonPercent = exs.length ? Math.round((lessonDone / exs.length) * 100) : 0;
  const ordered = getOrderedExercises(lessonId);
  const next = getNextExercise(lessonId, solved);
  const active = getActiveExerciseItem(lessonId, solved);
  const activeNumber = active ? ordered.findIndex(item => item.exercise.id === active.exercise.id) + 1 : 0;
  const chapterStats = getChapterExerciseStats(lessonId, solved);
  const dialect = typeof getSelectedDialect === 'function' ? getSelectedDialect() : 'sqlite';
  const dialectInfo = typeof SQL_DIALECTS !== 'undefined' ? SQL_DIALECTS[dialect] : null;
  let html = `<div class="exercises-section" data-lesson-id="${lessonId}">
    <h3>🏆 Bài Tập Thực Hành</h3>
    <p style="color:var(--text-muted);margin-bottom:16px">Mỗi lần chỉ mở 1 bài. Hoàn thành bài dễ trước, hệ thống sẽ tự mở bài khó hơn.</p>
    <div class="exercise-stats">
      <span class="ex-stat">📝 ${exs.length} bài tập trong bài này</span>
      <span class="ex-stat solved-stat">✅ ${lessonDone}/${exs.length} đã giải (${lessonPercent}%)</span>
      ${next ? `<span class="ex-stat next-stat">🎯 Đang làm bài #${ordered.findIndex(item => item.exercise.id === next.exercise.id) + 1}: ${EXERCISE_DIFF_META[next.exercise.diff]?.label || next.exercise.diff}</span>` : '<span class="ex-stat next-stat">🎯 Đã hoàn thành toàn bộ</span>'}
    </div>
    <div class="chapter-progress">
      <div class="chapter-progress-label">Tiến độ chương ${chapterStats.chapterTitle}</div>
      <div class="chapter-progress-value">${chapterStats.done}/${chapterStats.total} bài - ${chapterStats.percent}%</div>
      <div class="chapter-progress-bar"><div class="chapter-progress-fill" style="width:${chapterStats.percent}%"></div></div>
    </div>
    <div class="exercise-dialect-toolbar">
      <label>
        <span>Ngôn ngữ SQL</span>
        <select class="exercise-dialect-select" onchange="setExerciseDialect(this.value, '${lessonId}')">
          ${getDialectOptions(dialect)}
        </select>
      </label>
      <div class="exercise-dialect-tipline">${getDialectPracticeTip(dialect)}</div>
    </div>
    <div class="exercise-dialect-note">
      <span>⚙️</span>
      <div><strong>Dialect đang dùng: <span class="dialect-current-name">${dialectInfo?.name || dialect}</span>.</strong> <span class="dialect-current-note">${dialectInfo?.note || ''}</span> Các bài chạy trong trình duyệt bằng SQLite nên một số cú pháp MySQL/PostgreSQL/SQL Server sẽ được chuyển đổi để kiểm tra.</div>
    </div>`;
  html += `<div class="exercise-practice-shell">
    ${renderExerciseList(lessonId, ordered, solved, active?.exercise.id || '')}
    <div class="exercise-active-area">`;
  if (!next) {
    html += `<div class="exercise-complete-card">
      <strong>Hoàn thành phần bài tập này.</strong>
      <span>Bạn đã giải xong ${exs.length}/${exs.length} bài. Có thể chuyển sang bài học tiếp theo hoặc reset tiến độ để làm lại.</span>
    </div>`;
  }
  if (active) {
    html += renderExerciseCard(active.exercise, activeNumber, solved);
  }
  html += '</div></div></div>';
  return html;
}

function toggleHint(id) {
  const el = document.getElementById('hint-' + id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function setExerciseSubmitState(id, canSubmit) {
  const btn = document.getElementById('submit-' + id);
  const card = document.getElementById('ex-card-' + id);
  if (btn) btn.disabled = !canSubmit;
  if (card) card.dataset.runOk = canSubmit ? 'true' : 'false';
}

function invalidateExerciseRun(id) {
  setExerciseSubmitState(id, false);
  const feedbackEl = document.getElementById('feedback-' + id);
  if (feedbackEl) feedbackEl.innerHTML = '';
}

function buildRunSuccessMessage() {
  return `<div class="ex-correct">
    <div class="ex-correct-icon">✓</div>
    <div><strong>Kết quả chạy thử khớp yêu cầu.</strong> Bạn có thể nộp bài.</div>
  </div>`;
}

function buildRunWrongMessage(detail = '') {
  return `<div class="ex-wrong">❌ <strong>Kết quả chưa đúng.</strong> So sánh lại <strong>Expected Output</strong> với <strong>Your Output</strong> rồi sửa câu SQL.${detail ? `<br><span class="ex-error-detail">${detail}</span>` : ''}</div>`;
}

function runExerciseLegacy(id) {
  const editor = document.getElementById('editor-' + id);
  const resultEl = document.getElementById('result-' + id);
  const feedbackEl = document.getElementById('feedback-' + id);
  if (!editor || !resultEl) return;
  setExerciseSubmitState(id, false);
  const sql = editor.value.trim();
  if (!sql) {
    resultEl.innerHTML = '';
    if (feedbackEl) feedbackEl.innerHTML = '<div class="ex-wrong">⚠️ Vui lòng nhập câu lệnh SQL trước khi chạy thử.</div>';
    return;
  }
  const found = findExercise(id);
  if (!found) return;
  const { exercise } = found;
  const dialect = typeof getSelectedDialect === 'function' ? getSelectedDialect() : 'sqlite';
  if (found?.exercise.checkMode === 'text') {
    const dialectName = typeof SQL_DIALECTS !== 'undefined' ? SQL_DIALECTS[dialect]?.name : dialect;
    resultEl.innerHTML = `<div class="dialect-warning">Bài này kiểm tra cấu trúc cú pháp ${dialectName || dialect}; hãy nhấn "Nộp bài" để chấm.</div>`;
    const correct = exercise.check(sql, dialect);
    if (correct) {
      setExerciseSubmitState(id, true);
      if (feedbackEl) feedbackEl.innerHTML = buildRunSuccessMessage();
    } else if (feedbackEl) {
      feedbackEl.innerHTML = buildRunWrongMessage('Cấu trúc câu lệnh chưa khớp yêu cầu.');
    }
    return;
  }
  if (typeof resetDatabaseState === 'function') resetDatabaseState();
  const data = executeSQL(sql, { dialect });
  resultEl.innerHTML = formatResults(data);
  if (data.error) {
    if (feedbackEl) feedbackEl.innerHTML = buildRunWrongMessage(data.error);
    return;
  }
  const correct = exercise.check(data.results || [], data.normalized?.sql || sql, dialect);
  if (correct) {
    setExerciseSubmitState(id, true);
    if (feedbackEl) feedbackEl.innerHTML = buildRunSuccessMessage();
  } else if (feedbackEl) {
    feedbackEl.innerHTML = buildRunWrongMessage();
  }
}

function runExercise(id) {
  const editor = document.getElementById('editor-' + id);
  const resultEl = document.getElementById('result-' + id);
  const feedbackEl = document.getElementById('feedback-' + id);
  if (!editor || !resultEl) return;
  setExerciseSubmitState(id, false);
  const sql = editor.value.trim();
  if (!sql) {
    resultEl.innerHTML = '';
    if (feedbackEl) feedbackEl.innerHTML = '<div class="ex-wrong">⚠️ Vui lòng nhập câu lệnh SQL trước khi chạy thử.</div>';
    return;
  }

  const found = findExercise(id);
  if (!found) return;
  const { exercise } = found;
  const dialect = typeof getSelectedDialect === 'function' ? getSelectedDialect() : 'sqlite';

  if (found?.exercise.checkMode === 'text') {
    const dialectName = typeof SQL_DIALECTS !== 'undefined' ? SQL_DIALECTS[dialect]?.name : dialect;
    const safeSql = sql.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
    resultEl.innerHTML = `<div class="ex-compare-grid">
      <div class="ex-compare-panel expected"><h5>Expected Output</h5><div class="dialect-warning">Cấu trúc ${dialectName || dialect} phải khớp yêu cầu trong đề bài.</div></div>
      <div class="ex-compare-panel actual"><h5>Your Output</h5><pre><code>${safeSql}</code></pre></div>
    </div>`;
    const correct = exercise.check(sql, dialect);
    if (correct) {
      setExerciseSubmitState(id, true);
      if (feedbackEl) feedbackEl.innerHTML = buildRunSuccessMessage();
    } else if (feedbackEl) {
      feedbackEl.innerHTML = buildRunWrongMessage('Cấu trúc câu lệnh chưa khớp yêu cầu.');
    }
    return;
  }

  const expectedSQL = getExerciseExpectedSQL(exercise, dialect);
  let expectedData = null;
  if (expectedSQL) {
    if (typeof resetDatabaseState === 'function') resetDatabaseState();
    expectedData = executeSQL(expectedSQL, { dialect });
    if (expectedData.error) {
      resultEl.innerHTML = `<div class="ex-wrong">Không tạo được đáp án mong muốn cho bài này.<br><span class="ex-error-detail">${expectedData.error}</span></div>`;
      if (feedbackEl) feedbackEl.innerHTML = buildRunWrongMessage(expectedData.error);
      return;
    }
  }

  if (typeof resetDatabaseState === 'function') resetDatabaseState();
  const data = executeSQL(sql, { dialect });
  if (data.error) {
    resultEl.innerHTML = expectedData
      ? renderExerciseComparison(expectedData, data, { ok: false, issues: [data.error] })
      : renderActualOnlyResult(data);
    if (feedbackEl) feedbackEl.innerHTML = buildRunWrongMessage(data.error);
    return;
  }

  const ruleCorrect = exercise.check(data.results || [], data.normalized?.sql || sql, dialect);
  const compare = expectedData ? compareResultSets(expectedData.results || [], data.results || [], expectedSQL) : { ok: ruleCorrect, issues: [] };
  const correct = ruleCorrect && compare.ok;
  resultEl.innerHTML = expectedData ? renderExerciseComparison(expectedData, data, compare) : renderActualOnlyResult(data);
  if (correct) {
    setExerciseSubmitState(id, true);
    if (feedbackEl) feedbackEl.innerHTML = buildRunSuccessMessage();
  } else if (feedbackEl) {
    feedbackEl.innerHTML = buildRunWrongMessage(compare.issues.join(' '));
  }
}

function submitExerciseLegacy(id) {
  const editor = document.getElementById('editor-' + id);
  const feedbackEl = document.getElementById('feedback-' + id);
  const resultEl = document.getElementById('result-' + id);
  const card = document.getElementById('ex-card-' + id);
  if (!editor || !feedbackEl) return;
  const sql = editor.value.trim();
  if (!sql) { feedbackEl.innerHTML = '<div class="ex-wrong">⚠️ Vui lòng nhập câu lệnh SQL trước khi nộp.</div>'; return; }
  if (card?.dataset.runOk !== 'true') {
    feedbackEl.innerHTML = '<div class="ex-wrong">⚠️ Hãy bấm <strong>Chạy thử</strong> và sửa đến khi kết quả hiện xanh rồi mới nộp bài.</div>';
    return;
  }

  const found = findExercise(id);
  if (!found) return;
  const { lessonId, exercise } = found;
  const dialect = typeof getSelectedDialect === 'function' ? getSelectedDialect() : 'sqlite';
  let correct = false;

  if (exercise.checkMode === 'text') {
    correct = exercise.check(sql, dialect);
    const dialectName = typeof SQL_DIALECTS !== 'undefined' ? SQL_DIALECTS[dialect]?.name : dialect;
    resultEl.innerHTML = `<div class="dialect-warning">Bài này kiểm tra cấu trúc cú pháp ${dialectName || dialect}, không thực thi trực tiếp trên SQLite.</div>`;
  } else {
    if (typeof resetDatabaseState === 'function') resetDatabaseState();
    const data = executeSQL(sql, { dialect });
    if (data.error) {
      resultEl.innerHTML = formatResults(data);
      feedbackEl.innerHTML = `<div class="ex-wrong">❌ <strong>Sai!</strong> Câu lệnh SQL bị lỗi. Hãy kiểm tra lại cú pháp.<br><span class="ex-error-detail">${data.error}</span></div>`;
      return;
    }
    resultEl.innerHTML = formatResults(data);
    correct = exercise.check(data.results || [], data.normalized?.sql || sql, dialect);
  }

  if (correct) {
    const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
    if (!solved.includes(id)) {
      solved.push(id);
      localStorage.setItem('sql_solved', JSON.stringify(solved));
      if (window.SQLAuth) window.SQLAuth.saveProgress();
      if (typeof logDailyActivity === 'function') logDailyActivity('exercise');
    }
    setActiveExerciseAfterSolve(lessonId, solved, id);
    const chapterStats = getChapterExerciseStats(lessonId, solved);
    feedbackEl.innerHTML = `<div class="ex-correct">
      <div class="ex-correct-icon">🎉</div>
      <div><strong>Chính xác!</strong> Tiến độ chương ${chapterStats.chapterTitle}: ${chapterStats.done}/${chapterStats.total} bài (${chapterStats.percent}%).</div>
    </div>`;
    card?.classList.add('solved');
    // Update badge
    const badge = card?.querySelector('.ex-title-row');
    if (badge && !badge.querySelector('.ex-solved-badge')) {
      badge.insertAdjacentHTML('beforeend', '<span class="ex-solved-badge">✅ Đã giải</span>');
    }
    updateExerciseStats();
    if (typeof syncCurrentLessonCompletion === 'function') syncCurrentLessonCompletion();
    setTimeout(() => refreshExerciseSection(lessonId), 900);
  } else {
    feedbackEl.innerHTML = `<div class="ex-wrong">❌ <strong>Chưa đúng!</strong> Kết quả chưa khớp yêu cầu. Kiểm tra lại:<ul>
      <li>Tên cột (alias) có đúng không?</li>
      <li>Điều kiện lọc có chính xác không?</li>
      <li>Thử đọc lại gợi ý</li></ul></div>`;
  }
}

function submitExercise(id) {
  const editor = document.getElementById('editor-' + id);
  const feedbackEl = document.getElementById('feedback-' + id);
  const resultEl = document.getElementById('result-' + id);
  const card = document.getElementById('ex-card-' + id);
  if (!editor || !feedbackEl) return;
  const sql = editor.value.trim();
  if (!sql) {
    feedbackEl.innerHTML = '<div class="ex-wrong">⚠️ Vui lòng nhập câu lệnh SQL trước khi nộp.</div>';
    return;
  }
  if (card?.dataset.runOk !== 'true') {
    feedbackEl.innerHTML = '<div class="ex-wrong">⚠️ Hãy bấm <strong>Chạy thử</strong> và sửa đến khi phần so sánh hiện xanh rồi mới nộp bài.</div>';
    return;
  }

  const found = findExercise(id);
  if (!found) return;
  const { lessonId, exercise } = found;
  const dialect = typeof getSelectedDialect === 'function' ? getSelectedDialect() : 'sqlite';
  let correct = false;

  if (exercise.checkMode === 'text') {
    correct = exercise.check(sql, dialect);
  } else {
    const expectedSQL = getExerciseExpectedSQL(exercise, dialect);
    let expectedData = null;
    if (expectedSQL) {
      if (typeof resetDatabaseState === 'function') resetDatabaseState();
      expectedData = executeSQL(expectedSQL, { dialect });
    }
    if (typeof resetDatabaseState === 'function') resetDatabaseState();
    const data = executeSQL(sql, { dialect });
    if (data.error) {
      resultEl.innerHTML = expectedData
        ? renderExerciseComparison(expectedData, data, { ok: false, issues: [data.error] })
        : renderActualOnlyResult(data);
      feedbackEl.innerHTML = `<div class="ex-wrong">❌ <strong>Sai!</strong> Câu lệnh SQL bị lỗi.<br><span class="ex-error-detail">${data.error}</span></div>`;
      return;
    }
    const ruleCorrect = exercise.check(data.results || [], data.normalized?.sql || sql, dialect);
    const compare = expectedData && !expectedData.error
      ? compareResultSets(expectedData.results || [], data.results || [], expectedSQL)
      : { ok: ruleCorrect, issues: [] };
    resultEl.innerHTML = expectedData && !expectedData.error
      ? renderExerciseComparison(expectedData, data, compare)
      : renderActualOnlyResult(data);
    correct = ruleCorrect && compare.ok;
  }

  if (correct) {
    const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
    if (!solved.includes(id)) {
      solved.push(id);
      localStorage.setItem('sql_solved', JSON.stringify(solved));
      if (window.SQLAuth) window.SQLAuth.saveProgress();
      if (typeof logDailyActivity === 'function') logDailyActivity('exercise');
    }
    setActiveExerciseAfterSolve(lessonId, solved, id);
    const chapterStats = getChapterExerciseStats(lessonId, solved);
    feedbackEl.innerHTML = `<div class="ex-correct">
      <div class="ex-correct-icon">🎉</div>
      <div><strong>Chính xác!</strong> Tiến độ chương ${chapterStats.chapterTitle}: ${chapterStats.done}/${chapterStats.total} bài (${chapterStats.percent}%).</div>
    </div>`;
    card?.classList.add('solved');
    const badge = card?.querySelector('.ex-title-row');
    if (badge && !badge.querySelector('.ex-solved-badge')) {
      badge.insertAdjacentHTML('beforeend', '<span class="ex-solved-badge">✅ Đã giải</span>');
    }
    updateExerciseStats();
    if (typeof syncCurrentLessonCompletion === 'function') syncCurrentLessonCompletion();
    setTimeout(() => refreshExerciseSection(lessonId), 900);
  } else {
    setExerciseSubmitState(id, false);
    feedbackEl.innerHTML = `<div class="ex-wrong">❌ <strong>Chưa đúng!</strong> Đáp án thực tế chưa khớp đáp án mong muốn. Hãy sửa rồi chạy thử lại.</div>`;
  }
}

function resetExercise(id) {
  const exercise = findExercise(id)?.exercise;
  const editor = document.getElementById('editor-' + id);
  if (editor && exercise) editor.value = exercise.initSQL;
  const r = document.getElementById('result-' + id);
  const f = document.getElementById('feedback-' + id);
  if (r) r.innerHTML = '';
  if (f) f.innerHTML = '';
  setExerciseSubmitState(id, false);
}

function updateExerciseStats() {
  const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
  document.querySelectorAll('.solved-stat').forEach(el => {
    const section = el.closest('.exercises-section');
    if (!section) return;
    const lessonId = section.dataset.lessonId;
    const exs = EXERCISES[lessonId] || [];
    const total = exs.length;
    const done = exs.filter(ex => solved.includes(ex.id)).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    el.textContent = `✅ ${done}/${total} đã giải (${percent}%)`;
    const chapterStats = getChapterExerciseStats(lessonId, solved);
    section.querySelector('.chapter-progress-value').textContent = `${chapterStats.done}/${chapterStats.total} bài - ${chapterStats.percent}%`;
    section.querySelector('.chapter-progress-fill').style.width = `${chapterStats.percent}%`;
    const active = getNextExercise(lessonId, solved);
    const ordered = getOrderedExercises(lessonId);
    const nextStat = section.querySelector('.next-stat');
    if (nextStat) {
      if (active) {
        const activeNumber = ordered.findIndex(item => item.exercise.id === active.exercise.id) + 1;
        nextStat.textContent = `🎯 Đang làm bài #${activeNumber}: ${EXERCISE_DIFF_META[active.exercise.diff]?.label || active.exercise.diff}`;
      } else {
        nextStat.textContent = '🎯 Đã hoàn thành toàn bộ';
      }
    }
  });
}
