// Expanded exercise bank inspired by common SQL practice tracks:
// basic SELECT, filtering, aggregation, joins, subqueries, constraints, and advanced SQL.

function addExercises(lessonId, items) {
  if (!EXERCISES[lessonId]) EXERCISES[lessonId] = [];
  const existing = new Set(EXERCISES[lessonId].map(item => item.id));
  items.forEach(item => {
    if (!existing.has(item.id)) EXERCISES[lessonId].push(item);
  });
}

function lastResult(results) {
  return results[results.length - 1] || { columns: [], values: [] };
}

function resultText(results) {
  return JSON.stringify(results).toLowerCase();
}

function colIndex(result, name) {
  return result.columns.findIndex(col => String(col).toLowerCase() === String(name).toLowerCase());
}

function hasColumns(results, names) {
  const r = lastResult(results);
  return names.every(name => colIndex(r, name) !== -1);
}

function isDesc(values) {
  return values.every((value, index) => index === 0 || Number(value) <= Number(values[index - 1]));
}

function isAsc(values) {
  return values.every((value, index) => index === 0 || String(value) >= String(values[index - 1]));
}

function normalizedSqlText(sql) {
  return String(sql).replace(/\s+/g, ' ').trim().toLowerCase();
}

addExercises('what-is-sql', [
  {
    id: 'ex1-3', title: 'Hai giá trị trong một dòng', diff: 'medium',
    desc: 'Hiển thị một dòng gồm <code>ChuDe</code> = "SQL" và <code>NamHoc</code> = 2026.',
    hint: 'SELECT có thể trả về nhiều biểu thức: SELECT ... AS ChuDe, ... AS NamHoc;',
    initSQL: '',
    check: r => hasColumns(r, ['ChuDe', 'NamHoc']) && lastResult(r).values[0]?.[0] === 'SQL' && lastResult(r).values[0]?.[1] === 2026
  },
  {
    id: 'ex1-4', title: 'CASE đầu tiên', diff: 'hard',
    desc: 'Dùng <code>CASE</code> để trả về <code>KetQua</code> là "Dung" nếu 10 lớn hơn 5, ngược lại là "Sai".',
    hint: 'CASE WHEN 10 > 5 THEN ... ELSE ... END AS KetQua',
    initSQL: '',
    check: r => hasColumns(r, ['KetQua']) && lastResult(r).values[0]?.[0] === 'Dung'
  },
  {
    id: 'ex1-5', title: 'Tạo bảng mức độ bằng UNION', diff: 'expert',
    desc: 'Dùng <code>UNION ALL</code> để tạo 3 dòng trong một cột <code>MucDo</code>: "De", "Kho", "Cuc kho".',
    hint: 'SELECT \'De\' AS MucDo UNION ALL SELECT \'Kho\' UNION ALL SELECT \'Cuc kho\';',
    initSQL: '',
    check: r => hasColumns(r, ['MucDo']) && lastResult(r).values.length === 3 && resultText(r).includes('cuc kho')
  }
]);

addExercises('db-tables', [
  {
    id: 'ex2-3', title: 'Liệt kê bảng trong database', diff: 'medium',
    desc: 'Truy vấn danh sách tên bảng hiện có từ <code>sqlite_master</code>. Kết quả phải có cột <code>name</code>.',
    hint: 'SELECT name FROM sqlite_master WHERE type = \'table\';',
    initSQL: '',
    check: r => hasColumns(r, ['name']) && resultText(r).includes('sinhvien') && resultText(r).includes('sanpham')
  },
  {
    id: 'ex2-4', title: 'Đếm dòng nhiều bảng', diff: 'hard',
    desc: 'Tạo kết quả gồm <code>Bang</code> và <code>SoDong</code> cho ít nhất 5 bảng mẫu bằng <code>UNION ALL</code>.',
    hint: 'SELECT \'SinhVien\' AS Bang, COUNT(*) AS SoDong FROM SinhVien UNION ALL ...',
    initSQL: '',
    check: r => hasColumns(r, ['Bang', 'SoDong']) && lastResult(r).values.length >= 5
  },
  {
    id: 'ex2-5', title: 'Bảng có nhiều dữ liệu', diff: 'expert',
    desc: 'Từ kết quả đếm dòng các bảng, chỉ hiển thị những bảng có <code>SoDong >= 8</code>.',
    hint: 'Dùng CTE hoặc derived table rồi WHERE SoDong >= 8.',
    initSQL: '',
    check: r => hasColumns(r, ['Bang', 'SoDong']) && lastResult(r).values.length >= 3 && lastResult(r).values.every(row => Number(row[1]) >= 8)
  }
]);

addExercises('data-types', [
  {
    id: 'exdt-2', title: 'Ép kiểu số', diff: 'easy',
    desc: 'Ép chuỗi "2026" sang số nguyên và đặt alias là <code>Nam</code>.',
    hint: 'CAST(\'2026\' AS INTEGER) AS Nam',
    initSQL: '',
    check: r => hasColumns(r, ['Nam']) && lastResult(r).values[0]?.[0] === 2026
  },
  {
    id: 'exdt-3', title: 'Bảng nhiều kiểu dữ liệu', diff: 'medium',
    desc: 'Tạo bảng <code>DemoTypes</code> có cột text, real và integer. Thêm ít nhất 2 dòng rồi SELECT lại.',
    hint: 'CREATE TABLE DemoTypes (Ten TEXT, Gia REAL, Active INTEGER);',
    initSQL: '',
    check: r => hasColumns(r, ['Ten', 'Gia', 'Active']) && lastResult(r).values.length >= 2
  },
  {
    id: 'exdt-4', title: 'Kiểu dữ liệu của giá', diff: 'hard',
    desc: 'Hiển thị <code>TenSP</code>, <code>Gia</code> và <code>KieuGia</code> bằng hàm <code>typeof(Gia)</code> cho bảng SanPham.',
    hint: 'SELECT TenSP, Gia, typeof(Gia) AS KieuGia FROM SanPham;',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'Gia', 'KieuGia']) && lastResult(r).values.every(row => String(row[2]).length > 0)
  },
  {
    id: 'exdt-5', title: 'CHECK điểm hợp lệ', diff: 'expert',
    desc: 'Tạo bảng <code>DiemKiemTra</code> có cột <code>Diem</code> ràng buộc từ 0 đến 10. Thêm 3 điểm hợp lệ và tính <code>DiemTB</code>.',
    hint: 'Diem REAL CHECK(Diem >= 0 AND Diem <= 10), sau đó SELECT AVG(Diem) AS DiemTB.',
    initSQL: '',
    check: r => hasColumns(r, ['DiemTB']) && Number(lastResult(r).values[0]?.[0]) > 0
  }
]);

addExercises('crud', [
  {
    id: 'excr-3', title: 'Thêm sản phẩm mới', diff: 'easy',
    desc: 'Thêm sản phẩm "USB Test 128GB" vào SanPham rồi SELECT lại sản phẩm đó.',
    hint: 'INSERT INTO SanPham (TenSP, DanhMuc, Gia, SoLuong) VALUES (...); SELECT ... WHERE TenSP = ...;',
    initSQL: '',
    check: r => resultText(r).includes('usb test 128gb')
  },
  {
    id: 'excr-4', title: 'Cập nhật tồn kho', diff: 'hard',
    desc: 'Giảm <code>SoLuong</code> của sản phẩm <code>MaSP = 1</code> đi 3, sau đó hiển thị <code>MaSP</code>, <code>SoLuong</code>.',
    hint: 'UPDATE SanPham SET SoLuong = SoLuong - 3 WHERE MaSP = 1;',
    initSQL: '',
    check: r => hasColumns(r, ['MaSP', 'SoLuong']) && lastResult(r).values.some(row => row[0] === 1 && row[1] === 12)
  },
  {
    id: 'excr-5', title: 'Xóa có kiểm soát', diff: 'expert',
    desc: 'Xóa các đơn hàng có trạng thái "Chờ xử lý", sau đó đếm số đơn còn trạng thái này với alias <code>ConLai</code>.',
    hint: 'DELETE FROM DonHang WHERE TrangThai = \'Chờ xử lý\'; SELECT COUNT(*) AS ConLai ...',
    initSQL: '',
    check: r => hasColumns(r, ['ConLai']) && lastResult(r).values[0]?.[0] === 0
  }
]);

addExercises('select', [
  {
    id: 'ex3-4', title: 'Phân loại bằng CASE', diff: 'medium',
    desc: 'Hiển thị <code>HoTen</code>, <code>DiemTB</code> và <code>Loai</code>: điểm >= 8 là "Gioi", còn lại là "Can co gang".',
    hint: 'CASE WHEN DiemTB >= 8 THEN \'Gioi\' ELSE \'Can co gang\' END AS Loai',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'DiemTB', 'Loai']) && resultText(r).includes('gioi')
  },
  {
    id: 'ex3-5', title: 'Giá theo triệu', diff: 'hard',
    desc: 'Hiển thị <code>TenSP</code> và <code>GiaTrieu</code> = giá chia 1,000,000, làm tròn 1 chữ số.',
    hint: 'ROUND(Gia / 1000000.0, 1) AS GiaTrieu',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'GiaTrieu']) && Number(lastResult(r).values[0]?.[1]) > 0
  },
  {
    id: 'ex3-6', title: 'Giá trị tồn kho', diff: 'expert',
    desc: 'Hiển thị <code>TenSP</code>, <code>GiaTriTonKho</code> = <code>Gia * SoLuong</code>, sắp xếp giảm dần theo giá trị này.',
    hint: 'ORDER BY GiaTriTonKho DESC',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'GiaTriTonKho']) && isDesc(lastResult(r).values.map(row => row[1]))
  }
]);

addExercises('where', [
  {
    id: 'ex4-6', title: 'Tìm giá trị NULL', diff: 'easy',
    desc: 'Tìm khách hàng chưa có số điện thoại. Hiển thị <code>HoTen</code> và <code>SoDienThoai</code>.',
    hint: 'WHERE SoDienThoai IS NULL',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'SoDienThoai']) && lastResult(r).values.some(row => row[1] === null)
  },
  {
    id: 'ex4-7', title: 'Điều kiện phức hợp', diff: 'hard',
    desc: 'Tìm sản phẩm thuộc danh mục Laptop hoặc Điện thoại và có giá trên 25 triệu.',
    hint: 'WHERE DanhMuc IN (...) AND Gia > 25000000',
    initSQL: '',
    check: r => lastResult(r).values.length >= 2 && lastResult(r).values.every(row => resultText([{ values: [row] }]).includes('laptop') || resultText([{ values: [row] }]).includes('thoại'))
  },
  {
    id: 'ex4-8', title: 'Trên trung bình nhưng khác lớp', diff: 'expert',
    desc: 'Tìm sinh viên có điểm cao hơn điểm trung bình toàn bảng và không thuộc lớp CNTT01.',
    hint: 'DiemTB > (SELECT AVG(DiemTB) FROM SinhVien) AND Lop <> \'CNTT01\'',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'Lop', 'DiemTB']) && lastResult(r).values.every(row => row[1] !== 'CNTT01' && Number(row[2]) > 8.05)
  }
]);

addExercises('orderby-groupby', [
  {
    id: 'ex5-4', title: 'Sắp xếp nhiều cột', diff: 'easy',
    desc: 'Hiển thị sản phẩm, sắp xếp theo <code>DanhMuc</code> tăng dần rồi <code>Gia</code> giảm dần.',
    hint: 'ORDER BY DanhMuc ASC, Gia DESC',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'DanhMuc', 'Gia']) && lastResult(r).values.length >= 5
  },
  {
    id: 'ex5-5', title: 'Nhóm danh mục có nhiều sản phẩm', diff: 'hard',
    desc: 'Đếm số sản phẩm theo danh mục và chỉ lấy danh mục có từ 2 sản phẩm trở lên.',
    hint: 'GROUP BY DanhMuc HAVING COUNT(*) >= 2',
    initSQL: '',
    check: r => hasColumns(r, ['DanhMuc']) && lastResult(r).values.every(row => Number(row[1]) >= 2)
  },
  {
    id: 'ex5-6', title: 'Điểm cao nhất mỗi lớp', diff: 'expert',
    desc: 'Hiển thị sinh viên có điểm cao nhất trong từng lớp. Kết quả cần có <code>Lop</code>, <code>HoTen</code>, <code>DiemTB</code>.',
    hint: 'Dùng subquery tương quan hoặc JOIN với bảng MAX(DiemTB) theo Lop.',
    initSQL: '',
    check: r => hasColumns(r, ['Lop', 'HoTen', 'DiemTB']) && lastResult(r).values.length === 3 && lastResult(r).values.every(row => ({ CNTT01: 9.2, CNTT02: 9.0, CNTT03: 8.0 }[row[0]] === row[2]))
  }
]);

addExercises('limit-distinct', [
  {
    id: 'exld-3', title: 'Phân trang sản phẩm', diff: 'medium',
    desc: 'Lấy 3 sản phẩm ở trang thứ 2 khi sắp xếp theo <code>MaSP</code> tăng dần.',
    hint: 'SQLite/MySQL/PostgreSQL: LIMIT 3 OFFSET 3. SQL Server: OFFSET 3 ROWS FETCH NEXT 3 ROWS ONLY.',
    initSQL: '',
    check: r => lastResult(r).values.length === 3
  },
  {
    id: 'exld-4', title: 'Đếm danh mục duy nhất', diff: 'hard',
    desc: 'Đếm số danh mục sản phẩm duy nhất, đặt alias <code>SoDanhMuc</code>.',
    hint: 'COUNT(DISTINCT DanhMuc) AS SoDanhMuc',
    initSQL: '',
    check: r => hasColumns(r, ['SoDanhMuc']) && lastResult(r).values[0]?.[0] === 5
  },
  {
    id: 'exld-5', title: 'Sản phẩm đắt thứ hai', diff: 'expert',
    desc: 'Tìm sản phẩm có giá cao thứ hai. Hiển thị <code>TenSP</code> và <code>Gia</code>.',
    hint: 'ORDER BY Gia DESC LIMIT 1 OFFSET 1',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'Gia']) && lastResult(r).values.length === 1 && Number(lastResult(r).values[0][1]) === 30000000
  }
]);

addExercises('aggregate', [
  {
    id: 'ex6-4', title: 'Điểm trung bình theo giới tính', diff: 'medium',
    desc: 'Tính điểm trung bình theo <code>GioiTinh</code>. Kết quả có <code>GioiTinh</code>, <code>DiemTB</code>.',
    hint: 'GROUP BY GioiTinh',
    initSQL: '',
    check: r => hasColumns(r, ['GioiTinh', 'DiemTB']) && lastResult(r).values.length === 2
  },
  {
    id: 'ex6-5', title: 'Đếm có điều kiện', diff: 'hard',
    desc: 'Tính <code>TongSV</code> và <code>SoSVGioi</code> với sinh viên giỏi là <code>DiemTB >= 8</code>.',
    hint: 'SUM(CASE WHEN DiemTB >= 8 THEN 1 ELSE 0 END) AS SoSVGioi',
    initSQL: '',
    check: r => hasColumns(r, ['TongSV', 'SoSVGioi']) && lastResult(r).values[0]?.[0] === 10 && lastResult(r).values[0]?.[1] >= 5
  },
  {
    id: 'ex6-6', title: 'Danh mục tồn kho lớn', diff: 'expert',
    desc: 'Tính tổng giá trị tồn kho theo danh mục và chỉ lấy danh mục có tổng trên 500 triệu.',
    hint: 'SUM(Gia * SoLuong) AS TongTonKho, GROUP BY DanhMuc, HAVING TongTonKho > 500000000',
    initSQL: '',
    check: r => hasColumns(r, ['DanhMuc']) && lastResult(r).values.length >= 3 && lastResult(r).values.every(row => Number(row[1]) > 500000000)
  }
]);

addExercises('string-funcs', [
  {
    id: 'exsf-2', title: 'Chuẩn hóa chữ hoa', diff: 'easy',
    desc: 'Hiển thị <code>HoTen</code> và <code>TenHoa</code> là họ tên viết hoa.',
    hint: 'UPPER(HoTen) AS TenHoa',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'TenHoa']) && String(lastResult(r).values[0]?.[1]).length > 0
  },
  {
    id: 'exsf-3', title: 'Tách mã ngành từ lớp', diff: 'medium',
    desc: 'Hiển thị <code>Lop</code> và <code>MaNganh</code> là 4 ký tự đầu của lớp.',
    hint: 'SUBSTR(Lop, 1, 4) AS MaNganh',
    initSQL: '',
    check: r => hasColumns(r, ['Lop', 'MaNganh']) && lastResult(r).values.every(row => row[1] === 'CNTT')
  },
  {
    id: 'exsf-4', title: 'Tách domain email', diff: 'hard',
    desc: 'Hiển thị <code>HoTen</code>, <code>Email</code>, <code>Domain</code> cho khách hàng có email.',
    hint: 'SUBSTR(Email, INSTR(Email, \'@\') + 1) AS Domain',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'Email', 'Domain']) && lastResult(r).values.every(row => row[2] === 'email.com')
  },
  {
    id: 'exsf-5', title: 'Tạo slug sản phẩm', diff: 'expert',
    desc: 'Tạo cột <code>Slug</code> bằng cách chuyển <code>TenSP</code> sang chữ thường và thay khoảng trắng bằng dấu gạch ngang.',
    hint: 'LOWER(REPLACE(TenSP, \' \', \'-\')) AS Slug',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'Slug']) && String(lastResult(r).values[0]?.[1]).includes('-')
  }
]);

addExercises('date-funcs', [
  {
    id: 'exdf-2', title: 'Cộng ngày', diff: 'easy',
    desc: 'Từ ngày 2024-01-15, cộng thêm 30 ngày và đặt alias <code>HanXuLy</code>.',
    hint: 'DATE(\'2024-01-15\', \'+30 days\') AS HanXuLy',
    initSQL: '',
    check: r => hasColumns(r, ['HanXuLy']) && lastResult(r).values[0]?.[0] === '2024-02-14'
  },
  {
    id: 'exdf-3', title: 'Đơn hàng theo tháng', diff: 'medium',
    desc: 'Nhóm đơn hàng theo tháng <code>YYYY-MM</code>, hiển thị <code>Thang</code> và <code>SoDon</code>.',
    hint: 'STRFTIME(\'%Y-%m\', NgayDat) AS Thang',
    initSQL: '',
    check: r => hasColumns(r, ['Thang', 'SoDon']) && lastResult(r).values.length >= 4
  },
  {
    id: 'exdf-4', title: 'Khoảng thời gian đơn hàng', diff: 'hard',
    desc: 'Tính số ngày giữa đơn hàng đầu tiên và cuối cùng, đặt alias <code>SoNgay</code>.',
    hint: 'JULIANDAY(MAX(NgayDat)) - JULIANDAY(MIN(NgayDat)) AS SoNgay',
    initSQL: '',
    check: r => hasColumns(r, ['SoNgay']) && Number(lastResult(r).values[0]?.[0]) > 70
  },
  {
    id: 'exdf-5', title: 'Tháng doanh thu cao nhất', diff: 'expert',
    desc: 'Tìm tháng có tổng doanh thu cao nhất. Hiển thị <code>Thang</code>, <code>DoanhThu</code>.',
    hint: 'GROUP BY Thang, ORDER BY DoanhThu DESC, LIMIT 1',
    initSQL: '',
    check: r => hasColumns(r, ['Thang', 'DoanhThu']) && lastResult(r).values.length === 1 && Number(lastResult(r).values[0][1]) > 0
  }
]);

addExercises('inner-join', [
  {
    id: 'ex7-3', title: 'JOIN kèm điều kiện trạng thái', diff: 'medium',
    desc: 'Hiển thị đơn hàng đã giao gồm <code>MaDH</code>, <code>HoTen</code>, <code>TrangThai</code>.',
    hint: 'JOIN KhachHang rồi WHERE TrangThai = \'Đã giao\'',
    initSQL: '',
    check: r => hasColumns(r, ['MaDH', 'HoTen', 'TrangThai']) && lastResult(r).values.every(row => row[2] === 'Đã giao')
  },
  {
    id: 'ex7-4', title: 'Doanh thu theo thành phố', diff: 'hard',
    desc: 'JOIN KhachHang và DonHang để tính <code>DoanhThu</code> theo <code>DiaChi</code>.',
    hint: 'GROUP BY KH.DiaChi, SUM(DH.TongTien) AS DoanhThu',
    initSQL: '',
    check: r => hasColumns(r, ['DiaChi', 'DoanhThu']) && lastResult(r).values.length >= 4
  },
  {
    id: 'ex7-5', title: 'Khách hàng chi tiêu trên trung bình', diff: 'expert',
    desc: 'Tìm khách hàng có tổng chi tiêu lớn hơn mức chi tiêu trung bình của các khách đã mua hàng.',
    hint: 'Tạo bảng tổng chi theo khách, rồi lọc TongChi > AVG(TongChi).',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'TongChi']) && lastResult(r).values.length >= 1 && lastResult(r).values.every(row => Number(row[1]) > 0)
  }
]);

addExercises('left-right-join', [
  {
    id: 'ex8-2', title: 'Số đơn của mọi khách hàng', diff: 'easy',
    desc: 'Hiển thị tất cả khách hàng và số đơn hàng của họ, kể cả khách chưa mua. Alias số đơn là <code>SoDon</code>.',
    hint: 'LEFT JOIN DonHang, COUNT(DH.MaDH) AS SoDon, GROUP BY KH.MaKH',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'SoDon']) && lastResult(r).values.length === 6 && lastResult(r).values.some(row => row[1] === 0)
  },
  {
    id: 'ex8-3', title: 'Tổng chi tiêu kể cả 0', diff: 'hard',
    desc: 'Hiển thị mọi khách hàng với <code>TongChi</code>; khách chưa mua phải có giá trị 0.',
    hint: 'COALESCE(SUM(DH.TongTien), 0) AS TongChi',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'TongChi']) && lastResult(r).values.some(row => row[1] === 0)
  },
  {
    id: 'ex8-4', title: 'Phân loại khách hàng', diff: 'expert',
    desc: 'Dùng LEFT JOIN và CASE để tạo cột <code>TrangThaiMua</code>: "Da mua" hoặc "Chua mua".',
    hint: 'CASE WHEN COUNT(DH.MaDH) > 0 THEN \'Da mua\' ELSE \'Chua mua\' END',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'TrangThaiMua']) && resultText(r).includes('chua mua')
  }
]);

addExercises('full-self-join', [
  {
    id: 'exfj-2', title: 'Cặp nhân viên cùng phòng', diff: 'medium',
    desc: 'Dùng SELF JOIN tìm cặp nhân viên cùng phòng ban, tránh cặp trùng bằng điều kiện mã nhỏ hơn mã lớn.',
    hint: 'A.PhongBan = B.PhongBan AND A.MaNV < B.MaNV',
    initSQL: '',
    check: r => hasColumns(r, ['NhanVien1', 'NhanVien2', 'PhongBan']) && lastResult(r).values.length >= 3
  },
  {
    id: 'exfj-3', title: 'Mô phỏng FULL JOIN với danh sách lớp', diff: 'hard',
    desc: 'Tạo danh sách lớp kỳ vọng CNTT01-CNTT04 bằng CTE, LEFT JOIN với thống kê sinh viên để thấy lớp CNTT04 có 0 sinh viên.',
    hint: 'WITH Expected(Lop) AS (VALUES (...)), Counts AS (...) SELECT ... LEFT JOIN ...',
    initSQL: '',
    check: r => hasColumns(r, ['Lop', 'SoSV']) && lastResult(r).values.some(row => row[0] === 'CNTT04' && Number(row[1]) === 0)
  },
  {
    id: 'exfj-4', title: 'Lương trên trung bình phòng', diff: 'expert',
    desc: 'Tìm nhân viên có lương cao hơn lương trung bình phòng ban của chính họ.',
    hint: 'Có thể dùng SELF JOIN nhóm theo nhân viên hoặc subquery tương quan theo PhongBan.',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'PhongBan', 'Luong']) && lastResult(r).values.length >= 3
  }
]);

addExercises('subquery-where', [
  {
    id: 'ex9-3', title: 'Đơn hàng trên trung bình', diff: 'hard',
    desc: 'Tìm đơn hàng có <code>TongTien</code> lớn hơn trung bình tất cả đơn hàng.',
    hint: 'WHERE TongTien > (SELECT AVG(TongTien) FROM DonHang)',
    initSQL: '',
    check: r => hasColumns(r, ['MaDH', 'TongTien']) && lastResult(r).values.every(row => Number(row[1]) > 16375000)
  },
  {
    id: 'ex9-4', title: 'Đắt hơn mọi phụ kiện', diff: 'expert',
    desc: 'Tìm sản phẩm có giá cao hơn tất cả sản phẩm thuộc danh mục Phụ kiện.',
    hint: 'Gia > (SELECT MAX(Gia) FROM SanPham WHERE DanhMuc = \'Phụ kiện\')',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'Gia']) && lastResult(r).values.every(row => Number(row[1]) > 6800000)
  }
]);

addExercises('subquery-from-select', [
  {
    id: 'exsqfs-1', title: 'Derived table điểm lớp', diff: 'medium',
    desc: 'Tạo derived table thống kê lớp rồi chỉ lấy lớp có điểm trung bình từ 8 trở lên.',
    hint: 'FROM (SELECT Lop, AVG(DiemTB) AS DiemTB FROM SinhVien GROUP BY Lop) AS T WHERE DiemTB >= 8',
    initSQL: '',
    check: r => hasColumns(r, ['Lop', 'DiemTB']) && lastResult(r).values.every(row => Number(row[1]) >= 8)
  },
  {
    id: 'exsqfs-2', title: 'Scalar subquery chênh lệch giá', diff: 'hard',
    desc: 'Hiển thị <code>TenSP</code>, <code>Gia</code>, <code>ChenhLech</code> = Gia - giá trung bình toàn bảng.',
    hint: 'Gia - (SELECT AVG(Gia) FROM SanPham) AS ChenhLech',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'Gia', 'ChenhLech']) && lastResult(r).values.length >= 5
  },
  {
    id: 'exsqfs-3', title: 'JOIN với bảng tổng chi tạm', diff: 'expert',
    desc: 'Tạo derived table tổng chi theo MaKH, JOIN lại KhachHang để hiển thị <code>HoTen</code>, <code>TongChi</code>.',
    hint: 'JOIN (SELECT MaKH, SUM(TongTien) AS TongChi FROM DonHang GROUP BY MaKH) T ON ...',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'TongChi']) && lastResult(r).values.length >= 5
  }
]);

addExercises('correlated', [
  {
    id: 'excorr-1', title: 'Sản phẩm trên trung bình danh mục', diff: 'medium',
    desc: 'Tìm sản phẩm có giá cao hơn giá trung bình trong chính danh mục của nó.',
    hint: 'WHERE Gia > (SELECT AVG(Gia) FROM SanPham S2 WHERE S2.DanhMuc = S1.DanhMuc)',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'DanhMuc', 'Gia']) && lastResult(r).values.length >= 3
  },
  {
    id: 'excorr-2', title: 'Khách có từ 2 đơn', diff: 'hard',
    desc: 'Dùng subquery tương quan để tìm khách hàng có ít nhất 2 đơn hàng.',
    hint: 'WHERE (SELECT COUNT(*) FROM DonHang DH WHERE DH.MaKH = KH.MaKH) >= 2',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen']) && lastResult(r).values.length >= 3
  },
  {
    id: 'excorr-3', title: 'Người lương cao nhất phòng', diff: 'expert',
    desc: 'Dùng <code>NOT EXISTS</code> hoặc subquery tương quan để tìm nhân viên không ai trong phòng có lương cao hơn họ.',
    hint: 'NOT EXISTS (SELECT 1 FROM NhanVien B WHERE B.PhongBan = A.PhongBan AND B.Luong > A.Luong)',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'PhongBan', 'Luong']) && lastResult(r).values.length === 3
  }
]);

addExercises('primary-key', [
  {
    id: 'expk-1', title: 'Tạo khóa chính đơn', diff: 'easy',
    desc: 'Tạo bảng <code>MonHoc</code> có <code>MaMon</code> là PRIMARY KEY, thêm 2 môn và SELECT.',
    hint: 'MaMon TEXT PRIMARY KEY',
    initSQL: '',
    check: r => hasColumns(r, ['MaMon']) && lastResult(r).values.length >= 2
  },
  {
    id: 'expk-2', title: 'Khóa chính kết hợp', diff: 'hard',
    desc: 'Tạo bảng <code>DangKyMon</code> có PRIMARY KEY gồm <code>MaSV</code> và <code>MaMon</code>, thêm 2 dòng và SELECT.',
    hint: 'PRIMARY KEY (MaSV, MaMon)',
    initSQL: '',
    check: r => hasColumns(r, ['MaSV', 'MaMon']) && lastResult(r).values.length >= 2
  },
  {
    id: 'expk-3', title: 'Chặn bản ghi trùng khóa', diff: 'expert',
    desc: 'Tạo bảng có PRIMARY KEY, dùng <code>INSERT OR IGNORE</code> để thử chèn trùng khóa, sau đó đếm còn đúng 1 dòng.',
    hint: 'INSERT OR IGNORE INTO ...; SELECT COUNT(*) AS SoDong FROM ...;',
    initSQL: '',
    check: r => hasColumns(r, ['SoDong']) && lastResult(r).values[0]?.[0] === 1
  }
]);

addExercises('foreign-key', [
  {
    id: 'exfk-1', title: 'Xem khóa ngoại có sẵn', diff: 'medium',
    desc: 'Dùng <code>PRAGMA foreign_key_list(DonHang)</code> để xem DonHang tham chiếu đến bảng nào.',
    hint: 'PRAGMA foreign_key_list(DonHang);',
    initSQL: '',
    check: r => resultText(r).includes('khachhang')
  },
  {
    id: 'exfk-2', title: 'Tạo bảng cha con', diff: 'hard',
    desc: 'Tạo bảng <code>PhongBanMoi</code> và <code>NhanVienMoi</code>, trong đó NhanVienMoi có FOREIGN KEY đến PhongBanMoi. Sau đó chạy PRAGMA kiểm tra.',
    hint: 'FOREIGN KEY (MaPB) REFERENCES PhongBanMoi(MaPB)',
    initSQL: '',
    check: r => resultText(r).includes('phongbanmoi')
  },
  {
    id: 'exfk-3', title: 'JOIN kiểm tra toàn vẹn', diff: 'expert',
    desc: 'Tạo 2 bảng có FOREIGN KEY, thêm dữ liệu hợp lệ rồi JOIN để hiển thị tên nhân viên và tên phòng ban.',
    hint: 'Sau khi INSERT, SELECT NV.TenNV, PB.TenPB FROM NhanVienMoi NV JOIN PhongBanMoi PB ...',
    initSQL: '',
    check: r => hasColumns(r, ['TenNV', 'TenPB']) && lastResult(r).values.length >= 1
  }
]);

addExercises('unique-notnull-check', [
  {
    id: 'exuc-2', title: 'Email không trùng', diff: 'easy',
    desc: 'Tạo bảng <code>UserEmail</code> với <code>Email</code> UNIQUE NOT NULL, thêm 2 email và SELECT.',
    hint: 'Email TEXT UNIQUE NOT NULL',
    initSQL: '',
    check: r => hasColumns(r, ['Email']) && lastResult(r).values.length >= 2
  },
  {
    id: 'exuc-3', title: 'Bỏ qua dữ liệu trùng', diff: 'hard',
    desc: 'Dùng UNIQUE và <code>INSERT OR IGNORE</code> để chèn trùng email nhưng kết quả đếm chỉ còn 1 dòng.',
    hint: 'INSERT OR IGNORE INTO UserEmail ...; SELECT COUNT(*) AS SoEmail FROM UserEmail;',
    initSQL: '',
    check: r => hasColumns(r, ['SoEmail']) && lastResult(r).values[0]?.[0] === 1
  },
  {
    id: 'exuc-4', title: 'CHECK nhiều điều kiện', diff: 'expert',
    desc: 'Tạo bảng điểm có CHECK từ 0 đến 10, thêm dữ liệu hợp lệ và tính điểm trung bình.',
    hint: 'CHECK(Diem >= 0 AND Diem <= 10)',
    initSQL: '',
    check: r => hasColumns(r, ['DiemTB']) && Number(lastResult(r).values[0]?.[0]) > 0
  }
]);

addExercises('indexes', [
  {
    id: 'exidx-1', title: 'Tạo index đơn', diff: 'easy',
    desc: 'Tạo index <code>idx_sinhvien_lop</code> trên cột <code>Lop</code>, sau đó dùng PRAGMA để xem danh sách index.',
    hint: 'CREATE INDEX idx_sinhvien_lop ON SinhVien(Lop); PRAGMA index_list(SinhVien);',
    initSQL: '',
    check: r => resultText(r).includes('idx_sinhvien_lop')
  },
  {
    id: 'exidx-2', title: 'Index nhiều cột', diff: 'hard',
    desc: 'Tạo index <code>idx_sp_dm_gia</code> trên <code>SanPham(DanhMuc, Gia)</code>, sau đó xem thông tin index.',
    hint: 'PRAGMA index_info(idx_sp_dm_gia);',
    initSQL: '',
    check: r => resultText(r).includes('danhmuc') && resultText(r).includes('gia')
  },
  {
    id: 'exidx-3', title: 'Kiểm tra query plan', diff: 'expert',
    desc: 'Tạo index trên <code>SinhVien(Lop)</code>, rồi dùng <code>EXPLAIN QUERY PLAN</code> cho truy vấn lọc theo Lop.',
    hint: 'EXPLAIN QUERY PLAN SELECT * FROM SinhVien WHERE Lop = \'CNTT01\';',
    initSQL: '',
    check: r => resultText(r).includes('index')
  }
]);

addExercises('views', [
  {
    id: 'exvw-2', title: 'View sinh viên giỏi', diff: 'easy',
    desc: 'Tạo view <code>V_SVGioi</code> gồm sinh viên điểm >= 8 và SELECT từ view.',
    hint: 'CREATE VIEW V_SVGioi AS SELECT ... WHERE DiemTB >= 8;',
    initSQL: '',
    check: r => hasColumns(r, ['HoTen', 'DiemTB']) && lastResult(r).values.every(row => Number(row[1]) >= 8)
  },
  {
    id: 'exvw-3', title: 'View doanh thu danh mục', diff: 'hard',
    desc: 'Tạo view <code>V_TonKhoDanhMuc</code> tính tổng giá trị tồn kho theo danh mục rồi SELECT.',
    hint: 'SUM(Gia * SoLuong) AS TongTonKho GROUP BY DanhMuc',
    initSQL: '',
    check: r => hasColumns(r, ['DanhMuc', 'TongTonKho']) && lastResult(r).values.length >= 5
  },
  {
    id: 'exvw-4', title: 'View xếp hạng sản phẩm', diff: 'expert',
    desc: 'Tạo view có <code>TenSP</code>, <code>Gia</code>, <code>XepHangGia</code> bằng RANK theo giá giảm dần.',
    hint: 'RANK() OVER (ORDER BY Gia DESC) AS XepHangGia',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'Gia', 'XepHangGia']) && lastResult(r).values[0]?.[2] === 1
  }
]);

addExercises('transaction-basics', [
  {
    id: 'extx-2', title: 'ROLLBACK cập nhật', diff: 'easy',
    desc: 'Trong transaction, cập nhật điểm MaSV=1 thành 10 rồi ROLLBACK. Sau đó SELECT để điểm vẫn là 8.5.',
    hint: 'BEGIN; UPDATE ...; ROLLBACK; SELECT MaSV, DiemTB FROM SinhVien WHERE MaSV = 1;',
    initSQL: '',
    check: r => hasColumns(r, ['MaSV', 'DiemTB']) && lastResult(r).values[0]?.[1] === 8.5
  },
  {
    id: 'extx-3', title: 'SAVEPOINT từng phần', diff: 'hard',
    desc: 'Cập nhật MaSV=1 thành 9.9, tạo SAVEPOINT, cập nhật MaSV=2 thành 1.0 rồi ROLLBACK TO SAVEPOINT. COMMIT và SELECT MaSV 1,2.',
    hint: 'SAVEPOINT sp1; ... ROLLBACK TO sp1; COMMIT;',
    initSQL: '',
    check: r => hasColumns(r, ['MaSV', 'DiemTB']) && lastResult(r).values.some(row => row[0] === 1 && row[1] === 9.9) && lastResult(r).values.some(row => row[0] === 2 && row[1] === 9.0)
  },
  {
    id: 'extx-4', title: 'Transaction thêm đơn hàng', diff: 'expert',
    desc: 'Trong một transaction, thêm một đơn hàng mới cho MaKH=6 rồi COMMIT. Sau đó SELECT đơn hàng của MaKH=6.',
    hint: 'BEGIN; INSERT INTO DonHang (... MaKH=6 ...); COMMIT; SELECT ... WHERE MaKH = 6;',
    initSQL: '',
    check: r => hasColumns(r, ['MaKH']) && lastResult(r).values.some(row => row[0] === 6 || row.includes(6))
  }
]);

addExercises('acid', [
  {
    id: 'exacid-1', title: 'Atomicity bằng ROLLBACK', diff: 'medium',
    desc: 'Mô phỏng cập nhật 2 dòng trong transaction rồi ROLLBACK, sau đó chứng minh dữ liệu không đổi.',
    hint: 'BEGIN; UPDATE ...; UPDATE ...; ROLLBACK; SELECT ...',
    initSQL: '',
    check: r => lastResult(r).values.length >= 2
  },
  {
    id: 'exacid-2', title: 'Durability bằng COMMIT', diff: 'hard',
    desc: 'Cập nhật số điện thoại của 2 khách hàng trong transaction, COMMIT, rồi SELECT lại 2 khách hàng đó.',
    hint: 'BEGIN; UPDATE KhachHang ...; COMMIT;',
    initSQL: '',
    check: r => hasColumns(r, ['MaKH', 'SoDienThoai']) && lastResult(r).values.length === 2
  },
  {
    id: 'exacid-3', title: 'Consistency với CHECK', diff: 'expert',
    desc: 'Tạo bảng có CHECK điểm 0-10, thêm các điểm hợp lệ trong transaction, COMMIT rồi tính COUNT.',
    hint: 'CREATE TABLE ... CHECK(...); BEGIN; INSERT ...; COMMIT; SELECT COUNT(*) AS SoDong ...',
    initSQL: '',
    check: r => hasColumns(r, ['SoDong']) && Number(lastResult(r).values[0]?.[0]) >= 2
  }
]);

addExercises('normal-forms', [
  {
    id: 'exnf-1', title: 'Tách bảng đăng ký môn', diff: 'medium',
    desc: 'Tạo 2 bảng <code>MonHocNF</code> và <code>DangKyNF</code> để lưu môn học tách khỏi đăng ký, thêm dữ liệu và JOIN lại.',
    hint: 'MonHocNF(MaMon PRIMARY KEY, TenMon), DangKyNF(MaSV, MaMon, PRIMARY KEY(MaSV, MaMon))',
    initSQL: '',
    check: r => hasColumns(r, ['MaSV', 'TenMon']) && lastResult(r).values.length >= 2
  },
  {
    id: 'exnf-2', title: 'Phát hiện dữ liệu lặp', diff: 'hard',
    desc: 'Dùng CTE tạo bảng xấu có email khách hàng lặp lại, sau đó GROUP BY để tìm email xuất hiện nhiều hơn 1 lần.',
    hint: 'WITH BadOrders AS (...) SELECT Email, COUNT(*) AS SoLan FROM BadOrders GROUP BY Email HAVING COUNT(*) > 1',
    initSQL: '',
    check: r => hasColumns(r, ['Email']) && lastResult(r).values.length >= 1
  },
  {
    id: 'exnf-3', title: 'Thiết kế 3NF bằng SQL', diff: 'expert',
    desc: 'Viết SQL tạo ít nhất 3 bảng chuẩn hóa cho khách hàng, đơn hàng và chi tiết đơn hàng, trong đó có PRIMARY KEY và FOREIGN KEY.',
    hint: 'Cần có CREATE TABLE KhachHang..., DonHang..., ChiTietDonHang... và FOREIGN KEY.',
    initSQL: '',
    checkMode: 'text',
    check: sql => /create\s+table/i.test(sql) && (sql.match(/create\s+table/ig) || []).length >= 3 && /foreign\s+key/i.test(sql) && /primary\s+key/i.test(sql)
  }
]);

addExercises('avoiding-redundancy', [
  {
    id: 'exred-1', title: 'Tìm khách bị lặp thông tin', diff: 'medium',
    desc: 'Từ CTE dữ liệu đơn hàng xấu, tìm khách có email bị lặp ở nhiều dòng.',
    hint: 'GROUP BY Email HAVING COUNT(*) > 1',
    initSQL: '',
    check: r => lastResult(r).values.length >= 1
  },
  {
    id: 'exred-2', title: 'JOIN thay vì lặp dữ liệu', diff: 'hard',
    desc: 'Dùng database mẫu đã chuẩn hóa: JOIN DonHang với KhachHang để lấy tên/email thay vì lưu lặp trong DonHang.',
    hint: 'SELECT DH.MaDH, KH.HoTen, KH.Email, DH.TongTien FROM DonHang DH JOIN KhachHang KH ...',
    initSQL: '',
    check: r => hasColumns(r, ['MaDH', 'HoTen', 'Email', 'TongTien']) && lastResult(r).values.length >= 8
  },
  {
    id: 'exred-3', title: 'DDL chống dư thừa', diff: 'expert',
    desc: 'Viết DDL tạo mô hình tách KhachHang, DonHang, SanPham và ChiTietDonHang để không lặp thông tin khách/sản phẩm trong đơn hàng.',
    hint: 'Cần 4 CREATE TABLE và các FOREIGN KEY nối bảng chi tiết.',
    initSQL: '',
    checkMode: 'text',
    check: sql => (sql.match(/create\s+table/ig) || []).length >= 4 && (sql.match(/foreign\s+key/ig) || []).length >= 2
  }
]);

addExercises('stored-procedures', [
  {
    id: 'exsp-1', title: 'Stored Procedure MySQL', diff: 'medium',
    desc: 'Viết procedure MySQL tên <code>TimSinhVienTheoLop</code> nhận tham số lớp và SELECT sinh viên thuộc lớp đó.',
    hint: 'CREATE PROCEDURE TimSinhVienTheoLop(IN p_lop VARCHAR(20)) BEGIN SELECT ... WHERE Lop = p_lop; END',
    initSQL: '',
    checkMode: 'text',
    check: sql => /create\s+procedure\s+TimSinhVienTheoLop/i.test(sql) && /in\s+\w+\s+varchar/i.test(sql) && /select/i.test(sql)
  },
  {
    id: 'exsp-2', title: 'Function PostgreSQL', diff: 'hard',
    desc: 'Viết function PostgreSQL trả về bảng sinh viên có điểm từ tham số đầu vào trở lên.',
    hint: 'CREATE OR REPLACE FUNCTION ... RETURNS TABLE (...) AS $$ ... $$ LANGUAGE SQL;',
    initSQL: '',
    checkMode: 'text',
    check: sql => /create\s+or\s+replace\s+function/i.test(sql) && /returns\s+table/i.test(sql) && /language\s+sql/i.test(sql)
  },
  {
    id: 'exsp-3', title: 'Procedure SQL Server', diff: 'expert',
    desc: 'Viết procedure SQL Server tên <code>sp_TopSanPham</code> nhận <code>@TopN</code> và dùng TOP để lấy sản phẩm đắt nhất.',
    hint: 'CREATE PROCEDURE sp_TopSanPham @TopN INT AS SELECT TOP (@TopN) ... ORDER BY Gia DESC;',
    initSQL: '',
    checkMode: 'text',
    check: sql => /create\s+procedure\s+sp_TopSanPham/i.test(sql) && /@\w+/i.test(sql) && /top\s*\(/i.test(sql) && /order\s+by/i.test(sql)
  }
]);

addExercises('triggers', [
  {
    id: 'extr-2', title: 'Log cập nhật điểm', diff: 'medium',
    desc: 'Tạo bảng log và trigger AFTER UPDATE trên SinhVien để ghi MaSV khi điểm thay đổi. Cập nhật 1 sinh viên và SELECT log.',
    hint: 'CREATE TRIGGER ... AFTER UPDATE OF DiemTB ON SinhVien BEGIN INSERT INTO Log... NEW.MaSV ... END;',
    initSQL: '',
    check: r => lastResult(r).values.length >= 1
  },
  {
    id: 'extr-3', title: 'Log xóa sản phẩm', diff: 'hard',
    desc: 'Tạo trigger AFTER DELETE trên SanPham ghi tên sản phẩm đã xóa vào bảng log, xóa một sản phẩm rồi SELECT log.',
    hint: 'Trong trigger dùng OLD.TenSP.',
    initSQL: '',
    check: r => resultText(r).includes('log') || lastResult(r).values.length >= 1
  },
  {
    id: 'extr-4', title: 'Trigger trừ tồn kho', diff: 'expert',
    desc: 'Tạo bảng ChiTietDonHang và trigger AFTER INSERT để trừ <code>SanPham.SoLuong</code>. Thêm MaSP=1 số lượng 2 rồi SELECT SoLuong còn 13.',
    hint: 'UPDATE SanPham SET SoLuong = SoLuong - NEW.SoLuong WHERE MaSP = NEW.MaSP;',
    initSQL: '',
    check: r => hasColumns(r, ['MaSP', 'SoLuong']) && lastResult(r).values.some(row => row[0] === 1 && row[1] === 13)
  }
]);

addExercises('window-functions', [
  {
    id: 'ex10-3', title: 'ROW_NUMBER theo giá', diff: 'medium',
    desc: 'Đánh số thứ tự sản phẩm theo giá giảm dần với alias <code>STT</code>.',
    hint: 'ROW_NUMBER() OVER (ORDER BY Gia DESC) AS STT',
    initSQL: '',
    check: r => hasColumns(r, ['TenSP', 'Gia', 'STT']) && lastResult(r).values[0]?.[2] === 1
  },
  {
    id: 'ex10-4', title: 'Doanh thu lũy kế', diff: 'hard',
    desc: 'Tính doanh thu lũy kế đơn hàng theo <code>NgayDat</code>, alias <code>DoanhThuLuyKe</code>.',
    hint: 'SUM(TongTien) OVER (ORDER BY NgayDat ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
    initSQL: '',
    check: r => hasColumns(r, ['NgayDat', 'TongTien', 'DoanhThuLuyKe']) && isAsc(lastResult(r).values.map(row => row[0]))
  },
  {
    id: 'ex10-5', title: 'So sánh với đơn trước', diff: 'expert',
    desc: 'Dùng <code>LAG</code> để hiển thị <code>TongTienTruoc</code> và <code>ChenhLech</code> giữa đơn hiện tại với đơn trước theo ngày.',
    hint: 'LAG(TongTien) OVER (ORDER BY NgayDat) AS TongTienTruoc',
    initSQL: '',
    check: r => hasColumns(r, ['TongTienTruoc', 'ChenhLech']) && lastResult(r).values.length >= 8
  }
]);

addExercises('cte', [
  {
    id: 'ex11-2', title: 'Nhiều CTE liên tiếp', diff: 'medium',
    desc: 'Dùng 2 CTE: một CTE tổng chi theo khách, một CTE lọc tổng chi > 20 triệu, rồi SELECT kết quả.',
    hint: 'WITH TongChi AS (...), KhachVIP AS (...) SELECT ... FROM KhachVIP;',
    initSQL: '',
    check: r => hasColumns(r, ['MaKH', 'TongChi']) && lastResult(r).values.every(row => Number(row[1]) > 20000000)
  },
  {
    id: 'ex11-3', title: 'Recursive CTE tính tổng', diff: 'hard',
    desc: 'Dùng recursive CTE tạo số từ 1 đến 12 và tính tổng, alias <code>Tong</code>.',
    hint: 'WITH RECURSIVE Dem(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM Dem WHERE n < 12)',
    initSQL: '',
    check: r => hasColumns(r, ['Tong']) && lastResult(r).values[0]?.[0] === 78
  },
  {
    id: 'ex11-4', title: 'CTE + Window ranking', diff: 'expert',
    desc: 'Dùng CTE tính giá trị tồn kho sản phẩm, sau đó xếp hạng trong từng danh mục với <code>RANK</code>.',
    hint: 'WITH TonKho AS (...) SELECT ..., RANK() OVER (PARTITION BY DanhMuc ORDER BY GiaTriTonKho DESC) AS HangDanhMuc',
    initSQL: '',
    check: r => hasColumns(r, ['DanhMuc', 'TenSP', 'GiaTriTonKho', 'HangDanhMuc']) && lastResult(r).values.length >= 5
  }
]);
