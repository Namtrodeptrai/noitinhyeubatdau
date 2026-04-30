// Additional exercises for remaining chapters
EXERCISES['data-types'] = [
  { id:'exdt-1', title:'Kiểm tra kiểu dữ liệu', diff:'easy',
    desc:'Dùng hàm <code>typeof()</code> để kiểm tra kiểu của: số 100, số 3.14, và chuỗi \'SQL\'. Đặt tên cột lần lượt là <code>KieuSo</code>, <code>KieuThuc</code>, <code>KieuChuoi</code>.',
    hint:'SELECT typeof(100) AS KieuSo, typeof(3.14) AS KieuThuc, typeof(\'SQL\') AS KieuChuoi;',
    initSQL:"", check: r => r.length===1 && r[0].columns.includes('KieuSo') && r[0].columns.includes('KieuChuoi') },
];
EXERCISES['crud'] = [
  { id:'excr-1', title:'Thêm sinh viên', diff:'easy',
    desc:'Thêm một sinh viên mới: Họ tên "Lê Văn Test", Tuổi 21, Giới tính "Nam", Lớp "CNTT02", Điểm TB 8.0. Sau đó SELECT để xem kết quả.',
    hint:'INSERT INTO SinhVien (HoTen, Tuoi, GioiTinh, Lop, DiemTB) VALUES (...); SELECT * FROM SinhVien;',
    initSQL:"", check: r => r.length>=1 && JSON.stringify(r).includes('Lê Văn Test') },
  { id:'excr-2', title:'Cập nhật dữ liệu', diff:'medium',
    desc:'Cập nhật điểm TB của sinh viên có MaSV = 5 thành 7.5. Sau đó hiển thị sinh viên đó.',
    hint:'UPDATE ... SET ... WHERE MaSV = 5; SELECT * FROM SinhVien WHERE MaSV = 5;',
    initSQL:"", check: r => r.length>=1 && r[r.length-1].values.some(v=>v[0]===5 && v[5]===7.5) },
];
EXERCISES['limit-distinct'] = [
  { id:'exld-1', title:'Top 5 sản phẩm đắt nhất', diff:'easy',
    desc:'Hiển thị <strong>5 sản phẩm có giá cao nhất</strong>. Hiển thị <code>TenSP</code> và <code>Gia</code>.',
    hint:'ORDER BY Gia DESC LIMIT 5',
    initSQL:"", check: r => r.length===1 && r[0].values.length===5 },
  { id:'exld-2', title:'Danh sách phòng ban', diff:'easy',
    desc:'Hiển thị danh sách các <strong>phòng ban duy nhất</strong> (không trùng) từ bảng NhanVien.',
    hint:'SELECT DISTINCT PhongBan FROM NhanVien;',
    initSQL:"", check: r => r.length===1 && r[0].values.length===3 },
];
EXERCISES['string-funcs'] = [
  { id:'exsf-1', title:'Nối chuỗi thông tin', diff:'medium',
    desc:'Tạo cột <code>ThongTin</code> nối: HoTen + " - " + Lop cho mỗi sinh viên.',
    hint:'Dùng || để nối chuỗi trong SQLite',
    initSQL:"", check: r => r.length===1 && r[0].columns.includes('ThongTin') && String(r[0].values[0][0]).includes(' - ') },
];
EXERCISES['date-funcs'] = [
  { id:'exdf-1', title:'Ngày hiện tại', diff:'easy',
    desc:'Hiển thị ngày hiện tại với tên cột <code>HomNay</code>.',
    hint:'SELECT DATE(\'now\') AS HomNay;',
    initSQL:"", check: r => r.length===1 && r[0].columns[0]==='HomNay' },
];
EXERCISES['full-self-join'] = [
  { id:'exfj-1', title:'Đồng nghiệp cùng phòng', diff:'hard',
    desc:'Tìm các cặp nhân viên <strong>cùng phòng ban</strong>. Hiển thị <code>NhanVien1</code>, <code>NhanVien2</code>, <code>PhongBan</code>. Không hiển thị cặp trùng (A-B mà không B-A).',
    hint:'Self JOIN: FROM NhanVien A, NhanVien B WHERE A.PhongBan = B.PhongBan AND A.MaNV < B.MaNV',
    initSQL:"", check: r => r.length===1 && r[0].columns.length===3 && r[0].values.length>=3 },
];
EXERCISES['unique-notnull-check'] = [
  { id:'exuc-1', title:'Tạo bảng với ràng buộc', diff:'medium',
    desc:'Tạo bảng <code>SanPhamMoi</code> gồm: <code>ID</code> (PRIMARY KEY), <code>TenSP</code> (NOT NULL, UNIQUE), <code>Gia</code> (CHECK >= 0). Thêm 2 sản phẩm và SELECT.',
    hint:'CREATE TABLE SanPhamMoi (ID INTEGER PRIMARY KEY, TenSP TEXT NOT NULL UNIQUE, Gia REAL CHECK(Gia >= 0));',
    initSQL:"", check: r => r.length>=1 && JSON.stringify(r).includes('SanPhamMoi') || (r.length>=1 && r[r.length-1].values.length>=2) },
];
EXERCISES['views'] = [
  { id:'exvw-1', title:'Tạo View thống kê', diff:'medium',
    desc:'Tạo VIEW tên <code>ThongKeDH</code> hiển thị: <code>HoTen</code> khách hàng, <code>SoDon</code> (số đơn hàng), <code>TongChi</code> (tổng tiền). Sau đó SELECT từ view.',
    hint:'CREATE VIEW ThongKeDH AS SELECT KH.HoTen, COUNT(*) AS SoDon, SUM(TongTien) AS TongChi FROM ... JOIN ... GROUP BY ...;',
    initSQL:"", check: r => r.length>=1 && r[r.length-1].columns.includes('TongChi') },
];
EXERCISES['transaction-basics'] = [
  { id:'extx-1', title:'Transaction cơ bản', diff:'medium',
    desc:'Dùng transaction để thêm 2 nhân viên mới vào bảng NhanVien cùng lúc (COMMIT). Sau đó SELECT để xem.',
    hint:'BEGIN; INSERT INTO NhanVien (...) VALUES (...); INSERT INTO NhanVien (...) VALUES (...); COMMIT; SELECT * FROM NhanVien;',
    initSQL:"", check: r => r.length>=1 && r[r.length-1].values.length>=10 },
];
EXERCISES['triggers'] = [
  { id:'extr-1', title:'Tạo Trigger log', diff:'hard',
    desc:'Tạo bảng <code>AuditLog</code> (ID, HanhDong TEXT, ThoiGian TEXT). Tạo trigger <code>log_them_sp</code> chạy AFTER INSERT trên SanPham, ghi log "Thêm SP mới". Thêm 1 sản phẩm và SELECT AuditLog.',
    hint:'CREATE TRIGGER log_them_sp AFTER INSERT ON SanPham BEGIN INSERT INTO AuditLog ... END;',
    initSQL:"", check: r => r.length>=1 && JSON.stringify(r).includes('AuditLog') || JSON.stringify(r).includes('Thêm') },
];

// SVG Diagrams for lessons
const DIAGRAMS = {};

DIAGRAMS['inner-join'] = `
<div class="diagram-container">
<h4>📊 Sơ đồ INNER JOIN</h4>
<svg viewBox="0 0 400 160" class="join-diagram">
  <circle cx="140" cy="80" r="65" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" stroke-width="2"/>
  <circle cx="260" cy="80" r="65" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="2"/>
  <path d="M200,30 A65,65 0 0,1 200,130 A65,65 0 0,1 200,30" fill="rgba(16,185,129,0.35)" stroke="none"/>
  <text x="105" y="85" fill="var(--text-secondary)" font-size="14" font-weight="600">Bảng A</text>
  <text x="270" y="85" fill="var(--text-secondary)" font-size="14" font-weight="600">Bảng B</text>
  <text x="188" y="78" fill="#10b981" font-size="11" font-weight="700">Kết</text>
  <text x="186" y="93" fill="#10b981" font-size="11" font-weight="700">quả</text>
</svg>
<p class="diagram-caption">INNER JOIN chỉ trả về các hàng <strong>khớp ở cả hai bảng</strong> (phần giao màu xanh lá)</p>
</div>`;

DIAGRAMS['left-right-join'] = `
<div class="diagram-container">
<h4>📊 Sơ đồ LEFT JOIN</h4>
<svg viewBox="0 0 400 160" class="join-diagram">
  <circle cx="140" cy="80" r="65" fill="rgba(6,182,212,0.35)" stroke="#06b6d4" stroke-width="2"/>
  <circle cx="260" cy="80" r="65" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="2"/>
  <path d="M200,30 A65,65 0 0,1 200,130 A65,65 0 0,1 200,30" fill="rgba(6,182,212,0.35)" stroke="none"/>
  <text x="95" y="85" fill="white" font-size="13" font-weight="600">Bảng trái</text>
  <text x="95" y="100" fill="white" font-size="11">(tất cả)</text>
  <text x="270" y="85" fill="var(--text-muted)" font-size="13">Bảng phải</text>
  <text x="270" y="100" fill="var(--text-muted)" font-size="11">(khớp/NULL)</text>
</svg>
<p class="diagram-caption">LEFT JOIN lấy <strong>tất cả hàng bảng trái</strong>, bảng phải không khớp thì NULL</p>
</div>`;

DIAGRAMS['full-self-join'] = `
<div class="diagram-container">
<h4>📊 Sơ đồ FULL OUTER JOIN</h4>
<svg viewBox="0 0 400 160" class="join-diagram">
  <circle cx="140" cy="80" r="65" fill="rgba(6,182,212,0.35)" stroke="#06b6d4" stroke-width="2"/>
  <circle cx="260" cy="80" r="65" fill="rgba(245,158,11,0.35)" stroke="#f59e0b" stroke-width="2"/>
  <text x="95" y="85" fill="white" font-size="13" font-weight="600">Bảng A</text>
  <text x="95" y="100" fill="white" font-size="11">(tất cả)</text>
  <text x="265" y="85" fill="white" font-size="13" font-weight="600">Bảng B</text>
  <text x="265" y="100" fill="white" font-size="11">(tất cả)</text>
</svg>
<p class="diagram-caption">FULL JOIN lấy <strong>tất cả hàng từ cả hai bảng</strong></p>
</div>`;

DIAGRAMS['db-tables'] = `
<div class="diagram-container">
<h4>📊 Sơ đồ quan hệ các bảng</h4>
<svg viewBox="0 0 600 280" class="er-diagram">
  <rect x="10" y="10" width="140" height="110" rx="8" fill="var(--bg-card)" stroke="#06b6d4" stroke-width="2"/>
  <rect x="10" y="10" width="140" height="30" rx="8" fill="#06b6d4"/>
  <text x="80" y="30" text-anchor="middle" fill="white" font-size="12" font-weight="700">SinhVien</text>
  <text x="20" y="55" fill="var(--text-secondary)" font-size="10">🔑 MaSV</text>
  <text x="20" y="70" fill="var(--text-secondary)" font-size="10">HoTen, Tuoi</text>
  <text x="20" y="85" fill="var(--text-secondary)" font-size="10">GioiTinh, Lop</text>
  <text x="20" y="100" fill="var(--text-secondary)" font-size="10">DiemTB</text>

  <rect x="230" y="10" width="140" height="100" rx="8" fill="var(--bg-card)" stroke="#f59e0b" stroke-width="2"/>
  <rect x="230" y="10" width="140" height="30" rx="8" fill="#f59e0b"/>
  <text x="300" y="30" text-anchor="middle" fill="white" font-size="12" font-weight="700">KhachHang</text>
  <text x="240" y="55" fill="var(--text-secondary)" font-size="10">🔑 MaKH</text>
  <text x="240" y="70" fill="var(--text-secondary)" font-size="10">HoTen, Email</text>
  <text x="240" y="85" fill="var(--text-secondary)" font-size="10">DiaChi, SĐT</text>

  <rect x="230" y="150" width="140" height="110" rx="8" fill="var(--bg-card)" stroke="#10b981" stroke-width="2"/>
  <rect x="230" y="150" width="140" height="30" rx="8" fill="#10b981"/>
  <text x="300" y="170" text-anchor="middle" fill="white" font-size="12" font-weight="700">DonHang</text>
  <text x="240" y="195" fill="var(--text-secondary)" font-size="10">🔑 MaDH</text>
  <text x="240" y="210" fill="var(--text-secondary)" font-size="10">🔗 MaKH → KhachHang</text>
  <text x="240" y="225" fill="var(--text-secondary)" font-size="10">NgayDat, TongTien</text>
  <text x="240" y="240" fill="var(--text-secondary)" font-size="10">TrangThai</text>

  <rect x="450" y="10" width="140" height="100" rx="8" fill="var(--bg-card)" stroke="#ec4899" stroke-width="2"/>
  <rect x="450" y="10" width="140" height="30" rx="8" fill="#ec4899"/>
  <text x="520" y="30" text-anchor="middle" fill="white" font-size="12" font-weight="700">SanPham</text>
  <text x="460" y="55" fill="var(--text-secondary)" font-size="10">🔑 MaSP</text>
  <text x="460" y="70" fill="var(--text-secondary)" font-size="10">TenSP, DanhMuc</text>
  <text x="460" y="85" fill="var(--text-secondary)" font-size="10">Gia, SoLuong</text>

  <rect x="450" y="150" width="140" height="110" rx="8" fill="var(--bg-card)" stroke="#f59e0b" stroke-width="2"/>
  <rect x="450" y="150" width="140" height="30" rx="8" fill="#f59e0b"/>
  <text x="520" y="170" text-anchor="middle" fill="white" font-size="12" font-weight="700">NhanVien</text>
  <text x="460" y="195" fill="var(--text-secondary)" font-size="10">🔑 MaNV</text>
  <text x="460" y="210" fill="var(--text-secondary)" font-size="10">HoTen, PhongBan</text>
  <text x="460" y="225" fill="var(--text-secondary)" font-size="10">ChucVu, Luong</text>

  <line x1="300" y1="110" x2="300" y2="150" stroke="#10b981" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="308" y="135" fill="#10b981" font-size="9">1:N</text>
</svg>
<p class="diagram-caption">Sơ đồ 5 bảng trong database mẫu. DonHang liên kết với KhachHang qua khóa ngoại MaKH.</p>
</div>`;

DIAGRAMS['normal-forms'] = `
<div class="diagram-container">
<h4>📊 Sơ đồ các dạng chuẩn hóa</h4>
<svg viewBox="0 0 500 200" class="norm-diagram">
  <rect x="20" y="20" width="460" height="160" rx="12" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" stroke-width="2"/>
  <text x="250" y="45" text-anchor="middle" fill="#06b6d4" font-size="13" font-weight="700">3NF</text>
  <rect x="50" y="55" width="400" height="110" rx="10" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" stroke-width="2"/>
  <text x="250" y="78" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="700">2NF</text>
  <rect x="80" y="90" width="340" height="60" rx="8" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="2"/>
  <text x="250" y="115" text-anchor="middle" fill="#10b981" font-size="13" font-weight="700">1NF</text>
  <text x="250" y="135" text-anchor="middle" fill="var(--text-muted)" font-size="10">Mỗi ô = 1 giá trị</text>
</svg>
<p class="diagram-caption">Mỗi dạng chuẩn bao gồm các quy tắc của dạng trước đó</p>
</div>`;

DIAGRAMS['primary-key'] = `
<div class="diagram-container">
<h4>📊 Minh họa PRIMARY KEY</h4>
<svg viewBox="0 0 400 140" class="pk-diagram">
  <rect x="20" y="10" width="360" height="30" rx="6" fill="#06b6d4"/>
  <text x="60" y="30" fill="white" font-size="11" font-weight="700">🔑 MaSV</text>
  <text x="150" y="30" fill="white" font-size="11" font-weight="700">HoTen</text>
  <text x="280" y="30" fill="white" font-size="11" font-weight="700">Lop</text>
  <rect x="20" y="42" width="360" height="25" rx="0" fill="var(--bg-card)" stroke="var(--border)"/>
  <text x="60" y="58" fill="#10b981" font-size="11" font-weight="700">1</text>
  <text x="150" y="58" fill="var(--text-secondary)" font-size="11">Nguyễn Văn An</text>
  <text x="280" y="58" fill="var(--text-secondary)" font-size="11">CNTT01</text>
  <rect x="20" y="67" width="360" height="25" rx="0" fill="var(--bg-card)" stroke="var(--border)"/>
  <text x="60" y="83" fill="#10b981" font-size="11" font-weight="700">2</text>
  <text x="150" y="83" fill="var(--text-secondary)" font-size="11">Trần Thị Bình</text>
  <text x="280" y="83" fill="var(--text-secondary)" font-size="11">CNTT02</text>
  <rect x="20" y="92" width="360" height="25" rx="0" fill="var(--bg-card)" stroke="var(--border)"/>
  <text x="60" y="108" fill="#10b981" font-size="11" font-weight="700">3</text>
  <text x="150" y="108" fill="var(--text-secondary)" font-size="11">Lê Hoàng Cường</text>
  <text x="280" y="108" fill="var(--text-secondary)" font-size="11">CNTT01</text>
  <text x="30" y="132" fill="var(--text-muted)" font-size="9">↑ Duy nhất, không NULL, xác định mỗi hàng</text>
</svg>
</div>`;

