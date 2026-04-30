// SQL Engine - uses sql.js (SQLite in browser via WebAssembly)
let db = null;
let sqlReady = false;
let SQLRuntime = null;
let baseDbBytes = null;

const SQL_DIALECTS = {
  sqlite: {
    name: 'SQLite',
    note: 'Chạy trực tiếp bằng sql.js trong trình duyệt.'
  },
  mysql: {
    name: 'MySQL',
    note: 'Hỗ trợ chuyển đổi cú pháp phổ biến như CONCAT(), NOW(), CURDATE(), AUTO_INCREMENT.'
  },
  postgresql: {
    name: 'PostgreSQL',
    note: 'LIMIT/OFFSET và phần lớn SELECT chạy gần giống SQLite; ILIKE được mô phỏng bằng LIKE.'
  },
  sqlserver: {
    name: 'SQL Server / MS SQL',
    note: 'Hỗ trợ chuyển đổi TOP, OFFSET/FETCH, GETDATE(), LEN(), ISNULL() cho bài thực hành.'
  }
};

const SAMPLE_DATA_SQL = `
CREATE TABLE SinhVien (
  MaSV INTEGER PRIMARY KEY AUTOINCREMENT,
  HoTen TEXT NOT NULL,
  Tuoi INTEGER,
  GioiTinh TEXT,
  Lop TEXT,
  DiemTB REAL
);
INSERT INTO SinhVien (HoTen, Tuoi, GioiTinh, Lop, DiemTB) VALUES
('Nguyễn Văn An', 20, 'Nam', 'CNTT01', 8.5),
('Trần Thị Bình', 21, 'Nữ', 'CNTT02', 9.0),
('Lê Hoàng Cường', 22, 'Nam', 'CNTT01', 7.8),
('Phạm Thị Dung', 20, 'Nữ', 'CNTT02', 8.2),
('Hoàng Văn Em', 23, 'Nam', 'CNTT03', 6.5),
('Nguyễn Thị Phương', 21, 'Nữ', 'CNTT01', 9.2),
('Trần Văn Giang', 22, 'Nam', 'CNTT03', 7.0),
('Lê Thị Hoa', 20, 'Nữ', 'CNTT02', 8.8),
('Vũ Đức Hùng', 24, 'Nam', 'CNTT01', 7.5),
('Đặng Thị Kim', 21, 'Nữ', 'CNTT03', 8.0);

CREATE TABLE SanPham (
  MaSP INTEGER PRIMARY KEY AUTOINCREMENT,
  TenSP TEXT NOT NULL,
  DanhMuc TEXT,
  Gia REAL,
  SoLuong INTEGER
);
INSERT INTO SanPham (TenSP, DanhMuc, Gia, SoLuong) VALUES
('Laptop Dell XPS 15', 'Laptop', 28000000, 15),
('iPhone 15 Pro Max', 'Điện thoại', 32000000, 25),
('Samsung Galaxy S24', 'Điện thoại', 24000000, 30),
('MacBook Air M3', 'Laptop', 30000000, 10),
('iPad Pro 12.9', 'Tablet', 27000000, 20),
('AirPods Pro 2', 'Phụ kiện', 5500000, 50),
('Chuột Logitech MX', 'Phụ kiện', 1800000, 40),
('Bàn phím Keychron K2', 'Phụ kiện', 2200000, 35),
('Màn hình LG 27"', 'Màn hình', 7500000, 18),
('Tai nghe Sony WH-1000', 'Phụ kiện', 6800000, 22);

CREATE TABLE KhachHang (
  MaKH INTEGER PRIMARY KEY AUTOINCREMENT,
  HoTen TEXT NOT NULL,
  Email TEXT,
  DiaChi TEXT,
  SoDienThoai TEXT
);
INSERT INTO KhachHang (HoTen, Email, DiaChi, SoDienThoai) VALUES
('Nguyễn Minh Tuấn', 'tuan@email.com', 'Hà Nội', '0901234567'),
('Trần Thu Hà', 'ha@email.com', 'TP.HCM', '0912345678'),
('Lê Quốc Bảo', 'bao@email.com', 'Đà Nẵng', '0923456789'),
('Phạm Thị Lan', 'lan@email.com', 'Hải Phòng', '0934567890'),
('Hoàng Anh Dũng', 'dung@email.com', 'Cần Thơ', '0945678901'),
('Vũ Thị Mai', 'mai@email.com', 'Huế', NULL);

CREATE TABLE DonHang (
  MaDH INTEGER PRIMARY KEY AUTOINCREMENT,
  MaKH INTEGER,
  NgayDat TEXT,
  TongTien REAL,
  TrangThai TEXT,
  FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
);
INSERT INTO DonHang (MaKH, NgayDat, TongTien, TrangThai) VALUES
(1, '2024-01-15', 28000000, 'Đã giao'),
(2, '2024-01-20', 32000000, 'Đã giao'),
(1, '2024-02-10', 5500000, 'Đã giao'),
(3, '2024-02-15', 24000000, 'Đang giao'),
(4, '2024-03-01', 1800000, 'Đã giao'),
(2, '2024-03-10', 7500000, 'Chờ xử lý'),
(5, '2024-03-15', 30000000, 'Đang giao'),
(3, '2024-04-01', 2200000, 'Đã giao');

CREATE TABLE NhanVien (
  MaNV INTEGER PRIMARY KEY AUTOINCREMENT,
  HoTen TEXT NOT NULL,
  PhongBan TEXT,
  ChucVu TEXT,
  Luong REAL
);
INSERT INTO NhanVien (HoTen, PhongBan, ChucVu, Luong) VALUES
('Trần Đại Nghĩa', 'Kỹ thuật', 'Trưởng phòng', 25000000),
('Nguyễn Hữu Tài', 'Kỹ thuật', 'Lập trình viên', 18000000),
('Lê Thị Hồng', 'Kỹ thuật', 'Lập trình viên', 17000000),
('Phạm Văn Đức', 'Kinh doanh', 'Trưởng phòng', 22000000),
('Hoàng Thị Nga', 'Kinh doanh', 'Nhân viên', 14000000),
('Vũ Minh Quân', 'Nhân sự', 'Trưởng phòng', 20000000),
('Đặng Thu Trang', 'Nhân sự', 'Nhân viên', 13000000),
('Bùi Văn Long', 'Kinh doanh', 'Nhân viên', 15000000);
`;

async function initSQL() {
  try {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    SQLRuntime = SQL;
    db = new SQL.Database();
    db.run(SAMPLE_DATA_SQL);
    baseDbBytes = db.export();
    sqlReady = true;
    console.log('SQL Engine initialized successfully');
    return true;
  } catch (e) {
    console.error('SQL init error:', e);
    return false;
  }
}

function resetDatabase() {
  if (!resetDatabaseState()) {
    showOutput('<div class="error-msg">⚠️ Database chưa sẵn sàng. Vui lòng đợi SQL Engine tải xong.</div>');
    return;
  }
  showOutput('<div class="success-msg">✅ Database đã được reset thành công!</div>');
}

function resetDatabaseState() {
  if (!SQLRuntime || !baseDbBytes) return false;
  if (db) db.close();
  db = new SQLRuntime.Database(new Uint8Array(baseDbBytes));
  return true;
}

function getSelectedDialect() {
  const el = document.getElementById('sql-dialect');
  return el?.value || localStorage.getItem('sql_dialect') || 'sqlite';
}

function splitSqlArgs(args) {
  const parts = [];
  let current = '';
  let depth = 0;
  let quote = null;
  for (let i = 0; i < args.length; i++) {
    const ch = args[i];
    const next = args[i + 1];
    if (quote) {
      current += ch;
      if (ch === quote && next === quote) {
        current += next;
        i++;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '\'' || ch === '"' || ch === '`') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function replaceFunctionCalls(sql, functionName, transform) {
  let out = '';
  let i = 0;
  const lower = sql.toLowerCase();
  const target = functionName.toLowerCase() + '(';
  while (i < sql.length) {
    const idx = lower.indexOf(target, i);
    if (idx === -1) {
      out += sql.slice(i);
      break;
    }
    out += sql.slice(i, idx);
    let pos = idx + target.length;
    let depth = 1;
    let quote = null;
    while (pos < sql.length && depth > 0) {
      const ch = sql[pos];
      const next = sql[pos + 1];
      if (quote) {
        if (ch === quote && next === quote) {
          pos += 2;
          continue;
        }
        if (ch === quote) quote = null;
        pos++;
        continue;
      }
      if (ch === '\'' || ch === '"' || ch === '`') {
        quote = ch;
        pos++;
        continue;
      }
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      pos++;
    }
    if (depth !== 0) {
      out += sql.slice(idx);
      break;
    }
    const inner = sql.slice(idx + target.length, pos - 1);
    out += transform(inner);
    i = pos;
  }
  return out;
}

function appendLimit(sql, limit) {
  if (/\bLIMIT\b/i.test(sql)) return sql;
  return sql.replace(/;?\s*$/, ` LIMIT ${limit};`);
}

function normalizeSQLForExecution(sql, dialect = 'sqlite') {
  let out = sql;
  const notes = [];
  const selected = SQL_DIALECTS[dialect] ? dialect : 'sqlite';

  if (selected === 'mysql') {
    out = out.replace(/\bNOW\s*\(\s*\)/ig, "DATETIME('now')");
    out = out.replace(/\bCURDATE\s*\(\s*\)/ig, "DATE('now')");
    out = out.replace(/\bCHAR_LENGTH\s*\(/ig, 'LENGTH(');
    out = out.replace(/\bINT\s+PRIMARY\s+KEY\s+AUTO_INCREMENT\b/ig, 'INTEGER PRIMARY KEY AUTOINCREMENT');
    out = out.replace(/\bAUTO_INCREMENT\b/ig, 'AUTOINCREMENT');
    out = replaceFunctionCalls(out, 'CONCAT', inner => splitSqlArgs(inner).join(' || '));
    notes.push('Đã mô phỏng một số hàm/cú pháp MySQL bằng SQLite để chạy trong trình duyệt.');
  }

  if (selected === 'postgresql') {
    out = out.replace(/\bILIKE\b/ig, 'LIKE');
    out = out.replace(/\bNOW\s*\(\s*\)/ig, "DATETIME('now')");
    out = out.replace(/\bCURRENT_DATE\s*\(\s*\)/ig, "DATE('now')");
    out = replaceFunctionCalls(out, 'CONCAT', inner => splitSqlArgs(inner).join(' || '));
    out = out.replace(/\bSERIAL\s+PRIMARY\s+KEY\b/ig, 'INTEGER PRIMARY KEY AUTOINCREMENT');
    notes.push('Đã mô phỏng một số hàm/cú pháp PostgreSQL bằng SQLite để chạy trong trình duyệt.');
  }

  if (selected === 'sqlserver') {
    const topMatch = out.match(/^\s*SELECT\s+TOP\s*\(?\s*(\d+)\s*\)?\s+/i);
    if (topMatch) {
      out = out.replace(/^\s*SELECT\s+TOP\s*\(?\s*\d+\s*\)?\s+/i, 'SELECT ');
      out = appendLimit(out, topMatch[1]);
    }
    out = out.replace(/\s+OFFSET\s+(\d+)\s+ROWS\s+FETCH\s+(?:NEXT|FIRST)\s+(\d+)\s+ROWS\s+ONLY/ig, ' LIMIT $2 OFFSET $1');
    out = out.replace(/\bGETDATE\s*\(\s*\)/ig, "DATETIME('now')");
    out = out.replace(/\bSYSDATETIME\s*\(\s*\)/ig, "DATETIME('now')");
    out = out.replace(/\bLEN\s*\(/ig, 'LENGTH(');
    out = out.replace(/\[([^\]]+)\]/g, '"$1"');
    out = out.replace(/\bINT\s+IDENTITY\s*\(\s*1\s*,\s*1\s*\)\s+PRIMARY\s+KEY\b/ig, 'INTEGER PRIMARY KEY AUTOINCREMENT');
    out = replaceFunctionCalls(out, 'ISNULL', inner => `IFNULL(${inner})`);
    out = replaceFunctionCalls(out, 'CONCAT', inner => splitSqlArgs(inner).join(' || '));
    notes.push('Đã mô phỏng một số hàm/cú pháp SQL Server bằng SQLite để chạy trong trình duyệt.');
  }

  return { sql: out, dialect: selected, translated: out !== sql, notes };
}

function executeSQL(sql, options = {}) {
  if (!db) return { error: 'Database chưa sẵn sàng. Vui lòng đợi...' };
  const start = performance.now();
  try {
    const normalized = normalizeSQLForExecution(sql, options.dialect || getSelectedDialect());
    const results = db.exec(normalized.sql);
    const time = (performance.now() - start).toFixed(1);
    return { results, time, normalized };
  } catch (e) {
    return { error: e.message };
  }
}

function formatResults(data) {
  if (data.error) {
    return `<div class="error-msg">❌ Lỗi: ${data.error}</div>`;
  }
  let prefix = '';
  if (data.normalized?.translated) {
    const dialectName = SQL_DIALECTS[data.normalized.dialect]?.name || data.normalized.dialect;
    prefix = `<div class="dialect-warning"><strong>${dialectName}</strong> đã được chuyển sang SQLite để chạy kiểm tra. <code>${data.normalized.notes[0] || ''}</code></div>`;
  }
  if (!data.results || data.results.length === 0) {
    return `${prefix}<div class="success-msg">✅ Câu lệnh thực thi thành công! (${data.time}ms)</div>`;
  }
  let html = prefix;
  data.results.forEach(r => {
    html += '<table><tr>';
    r.columns.forEach(c => { html += `<th>${c}</th>`; });
    html += '</tr>';
    r.values.forEach(row => {
      html += '<tr>';
      row.forEach(v => { html += `<td>${v === null ? '<em>NULL</em>' : v}</td>`; });
      html += '</tr>';
    });
    html += '</table>';
  });
  return html;
}

function showOutput(html) {
  const el = document.getElementById('sql-output');
  if (el) el.innerHTML = html;
}

function runSQL() {
  const input = document.getElementById('sql-input');
  if (!input) return;
  const sql = input.value.trim();
  if (!sql) return;
  const result = executeSQL(sql);
  const html = formatResults(result);
  showOutput(html);
  const timeEl = document.getElementById('query-time');
  if (timeEl && result.time) timeEl.textContent = `${result.time}ms`;
}

function trySQL(sql) {
  runDemoSQL(sql);
  document.getElementById('sql-editor-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function runDemoSQL(sql) {
  const result = executeSQL(sql);
  const html = formatResults(result);
  showOutput(html);
  const timeEl = document.getElementById('query-time');
  if (timeEl && result.time) timeEl.textContent = `${result.time}ms`;
}

function clearMainEditor() {
  const input = document.getElementById('sql-input');
  if (!input) return;
  input.value = '';
  updateLineNumbers();
  const timeEl = document.getElementById('query-time');
  if (timeEl) timeEl.textContent = '';
  const output = document.getElementById('sql-output');
  if (output) {
    output.innerHTML = `
      <div class="output-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
        <p>Kết quả sẽ hiển thị tại đây sau khi bạn chạy SQL</p>
      </div>`;
  }
}

function updateLineNumbers() {
  const input = document.getElementById('sql-input');
  const ln = document.getElementById('line-numbers');
  if (!input || !ln) return;
  const lines = input.value.split('\n').length;
  ln.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}
