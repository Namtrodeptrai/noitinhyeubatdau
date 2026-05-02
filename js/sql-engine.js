// SQL Engine - uses sql.js (SQLite in browser via WebAssembly)
let db = null;
let sqlReady = false;
let SQLRuntime = null;
let baseDbBytes = null;
let userDb = null;
let userDataTables = [];

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
      locateFile: file => `js/${file}`
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
    const topMatch = out.match(/^(\s*(?:--[^\n]*\n\s*)*)SELECT\s+TOP\s*\(?\s*(\d+)\s*\)?\s+/i);
    if (topMatch) {
      out = out.replace(/^(\s*(?:--[^\n]*\n\s*)*)SELECT\s+TOP\s*\(?\s*\d+\s*\)?\s+/i, '$1SELECT ');
      out = appendLimit(out, topMatch[2]);
    }
    out = out.replace(/\s+OFFSET\s+(\d+)\s+ROWS\s+FETCH\s+(?:NEXT|FIRST)\s+(\d+)\s+ROWS\s+ONLY/ig, ' LIMIT $2 OFFSET $1');
    out = out.replace(/\bGETDATE\s*\(\s*\)/ig, "DATETIME('now')");
    out = out.replace(/\bSYSDATETIME\s*\(\s*\)/ig, "DATETIME('now')");
    out = out.replace(/\bLEN\s*\(/ig, 'LENGTH(');
    out = out.replace(/\[([^\]]+)\]/g, '"$1"');
    out = out.replace(/\bINT\s+IDENTITY\s*\(\s*1\s*,\s*1\s*\)\s+PRIMARY\s+KEY\b/ig, 'INTEGER PRIMARY KEY AUTOINCREMENT');
    out = replaceFunctionCalls(out, 'ISNULL', inner => `IFNULL(${inner})`);
    out = replaceFunctionCalls(out, 'CONCAT', inner => splitSqlArgs(inner).join(' || '));
    out = replaceFunctionCalls(out, 'CONVERT', inner => {
      const args = splitSqlArgs(inner);
      return args[1] || args[0] || 'NULL';
    });
    out = replaceFunctionCalls(out, 'TRY_CONVERT', inner => {
      const args = splitSqlArgs(inner);
      return args[1] || args[0] || 'NULL';
    });
    out = out.replace(/\bGETUTCDATE\s*\(\s*\)/ig, "DATETIME('now')");
    out = out.replace(/\bNEWID\s*\(\s*\)/ig, "LOWER(HEX(RANDOMBLOB(16)))");
    notes.push('Đã mô phỏng một số hàm/cú pháp SQL Server bằng SQLite để chạy trong trình duyệt.');
  }

  return { sql: out, dialect: selected, translated: out !== sql, notes };
}

function detectSQLDialect(sql, requested = 'auto') {
  if (requested && requested !== 'auto' && SQL_DIALECTS[requested]) {
    return { dialect: requested, confidence: 'manual', signals: ['Người dùng chọn dialect'] };
  }

  const source = String(sql || '');
  const scores = {
    mysql: 0,
    postgresql: 0,
    sqlserver: 0,
    sqlite: 0
  };
  const signals = {
    mysql: [],
    postgresql: [],
    sqlserver: [],
    sqlite: []
  };
  const add = (dialect, score, label) => {
    scores[dialect] += score;
    signals[dialect].push(label);
  };

  if (/`[^`]+`/.test(source)) add('mysql', 3, 'identifier dùng backtick');
  if (/\bAUTO_INCREMENT\b/i.test(source)) add('mysql', 4, 'AUTO_INCREMENT');
  if (/\bENGINE\s*=\s*\w+/i.test(source)) add('mysql', 5, 'ENGINE=...');
  if (/\bDEFAULT\s+CHARSET\b/i.test(source)) add('mysql', 4, 'DEFAULT CHARSET');
  if (/\/\*!/.test(source)) add('mysql', 4, 'MySQL conditional comment');
  if (/^\s*(LOCK|UNLOCK)\s+TABLES\b/im.test(source)) add('mysql', 3, 'LOCK/UNLOCK TABLES');
  if (/^\s*DELIMITER\b/im.test(source)) add('mysql', 4, 'DELIMITER');

  if (/^\s*GO\s*$/im.test(source)) add('sqlserver', 5, 'GO batch separator');
  if (/\[[^\]]+\]\s*\.\s*\[[^\]]+\]/.test(source)) add('sqlserver', 5, '[schema].[table]');
  if (/\bIDENTITY\s*\(\s*\d+\s*,\s*\d+\s*\)/i.test(source)) add('sqlserver', 5, 'IDENTITY(seed, increment)');
  if (/\bSET\s+IDENTITY_INSERT\b/i.test(source)) add('sqlserver', 5, 'SET IDENTITY_INSERT');
  if (/\bOBJECT_ID\s*\(/i.test(source)) add('sqlserver', 4, 'OBJECT_ID()');
  if (/\bNVARCHAR\b|\bDATETIME2\b|\bMONEY\b/i.test(source)) add('sqlserver', 3, 'SQL Server data type');
  if (/^\s*INSERT\s+(?:\[[^\]]+\]\.)?\[[^\]]+\]\s*\(/im.test(source)) add('sqlserver', 4, 'INSERT [table] (...)');
  if (/\bSELECT\s+TOP\s*\(?\s*\d+/i.test(source)) add('sqlserver', 3, 'SELECT TOP');

  if (/^\s*COPY\s+[\s\S]+?\s+FROM\s+stdin\s*;/im.test(source)) add('postgresql', 6, 'COPY FROM stdin');
  if (/^\s*\\\.\s*$/im.test(source)) add('postgresql', 4, 'COPY terminator \\.');
  if (/\bSET\s+search_path\b/i.test(source)) add('postgresql', 4, 'search_path');
  if (/\bCREATE\s+EXTENSION\b/i.test(source)) add('postgresql', 4, 'CREATE EXTENSION');
  if (/\bOWNER\s+TO\b/i.test(source)) add('postgresql', 3, 'OWNER TO');
  if (/\bCOMMENT\s+ON\b/i.test(source)) add('postgresql', 3, 'COMMENT ON');
  if (/\bSERIAL\b|\bBIGSERIAL\b|\bJSONB\b|\bUUID\b|\bBYTEA\b/i.test(source)) add('postgresql', 3, 'PostgreSQL data type');
  if (/::\s*(?:regclass|text|integer|numeric|date|timestamp|uuid)\b/i.test(source)) add('postgresql', 3, 'PostgreSQL cast ::type');

  if (/\bPRAGMA\b/i.test(source)) add('sqlite', 4, 'PRAGMA');
  if (/\bsqlite_sequence\b/i.test(source)) add('sqlite', 5, 'sqlite_sequence');
  if (/^\s*BEGIN\s+TRANSACTION\s*;/im.test(source)) add('sqlite', 2, 'BEGIN TRANSACTION');

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const dialect = best && best[1] > 0 ? best[0] : 'sqlite';
  return {
    dialect,
    confidence: best && best[1] >= 6 ? 'high' : best && best[1] >= 3 ? 'medium' : 'low',
    signals: signals[dialect].slice(0, 5)
  };
}

function parenBalance(line) {
  let balance = 0;
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];
    if (quote) {
      if (ch === quote && next === quote) {
        i += 1;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '\'' || ch === '"' || ch === '`') {
      quote = ch;
    } else if (ch === '(') {
      balance += 1;
    } else if (ch === ')') {
      balance -= 1;
    }
  }
  return balance;
}

function cleanSQLIdentifierPart(part) {
  let value = String(part || '').trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('`') && value.endsWith('`'))) {
    return value.slice(1, -1).replace(/""/g, '"').replace(/``/g, '`');
  }
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).replace(/]]/g, ']');
  }
  return value;
}

function splitQualifiedIdentifier(ref) {
  const parts = [];
  let current = '';
  let quote = null;
  const source = String(ref || '').trim();
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (quote) {
      current += ch;
      if (quote === '[' && ch === ']') {
        quote = null;
      } else if (ch === quote && next === quote) {
        current += next;
        i += 1;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === '`' || ch === '[') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '.') {
      if (current.trim()) parts.push(cleanSQLIdentifierPart(current));
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(cleanSQLIdentifierPart(current));
  return parts;
}

function finalTableNameFromRef(ref) {
  const parts = splitQualifiedIdentifier(ref);
  return parts[parts.length - 1] || cleanSQLIdentifierPart(ref);
}

function quoteTableRefForSQLite(ref) {
  return quoteSQLIdentifier(finalTableNameFromRef(ref));
}

function quoteSQLLiteral(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function parsePostgresCopyCell(value) {
  if (value === '\\N') return null;
  return String(value || '')
    .replace(/\\t/g, '\t')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\\\/g, '\\');
}

function splitPostgresCopyRow(line) {
  return String(line || '').split('\t').map(parsePostgresCopyCell);
}

function convertPostgresCopyBlocks(sql) {
  const lines = String(sql || '').split(/\r?\n/);
  const out = [];
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const header = lines[i].match(/^\s*COPY\s+(.+?)\s*(?:\(([^)]*)\))?\s+FROM\s+stdin\s*;/i);
    if (!header) {
      out.push(lines[i]);
      continue;
    }

    const tableName = quoteTableRefForSQLite(header[1]);
    const columns = header[2]
      ? header[2].split(',').map(item => quoteSQLIdentifier(cleanSQLIdentifierPart(item)))
      : [];
    const rows = [];
    i += 1;
    while (i < lines.length && !/^\s*(?:\\\.)\s*$|^\s*\.\s*$/.test(lines[i])) {
      rows.push(splitPostgresCopyRow(lines[i]));
      i += 1;
    }

    blocks.push({ table: finalTableNameFromRef(header[1]), rows: rows.length });
    rows.forEach(row => {
      const values = row.map(quoteSQLLiteral).join(', ');
      const columnSQL = columns.length ? ` (${columns.join(', ')})` : '';
      out.push(`INSERT INTO ${tableName}${columnSQL} VALUES (${values});`);
    });
  }
  return { sql: out.join('\n'), blocks };
}

function translatePostgresScriptForSQLite(sql) {
  let out = String(sql || '');
  const copy = convertPostgresCopyBlocks(out);
  out = copy.sql;
  out = out.replace(/\bpublic\./ig, '');
  out = out.replace(/"public"\s*\./ig, '');
  out = out.replace(/^\s*SET\s+search_path\b[^\n;]*(?:;)?/gim, '');
  out = out.replace(/^\s*SELECT\s+pg_catalog\.[^\n;]*(?:;)?/gim, '');
  out = out.replace(/^\s*CREATE\s+EXTENSION\b[\s\S]*?;\s*/gim, '');
  out = out.replace(/^\s*COMMENT\s+ON\b[\s\S]*?;\s*/gim, '');
  out = out.replace(/^\s*ALTER\s+(?:TABLE|SEQUENCE|VIEW|DATABASE|SCHEMA)\b[\s\S]*?\bOWNER\s+TO\b[\s\S]*?;\s*/gim, '');
  out = out.replace(/\bBIGSERIAL\b/ig, 'INTEGER');
  out = out.replace(/\bSERIAL\b/ig, 'INTEGER');
  out = out.replace(/\bBOOLEAN\b/ig, 'INTEGER');
  out = out.replace(/\bUUID\b|\bJSONB?\b|\bBYTEA\b/ig, 'TEXT');
  out = out.replace(/\bcharacter\s+varying\s*(?:\([^)]*\))?/ig, 'TEXT');
  out = out.replace(/\b(?:varchar|char|text)\s*(?:\([^)]*\))?/ig, 'TEXT');
  out = out.replace(/\btimestamp\s+(?:with|without)\s+time\s+zone\b/ig, 'TEXT');
  out = out.replace(/\b(?:timestamp|date|time)\s*(?:\([^)]*\))?/ig, 'TEXT');
  out = out.replace(/\bdouble\s+precision\b/ig, 'REAL');
  out = out.replace(/\b(?:numeric|decimal|real)\s*(?:\([^)]*\))?/ig, 'REAL');
  out = out.replace(/\b(?:bigint|integer|smallint)\b/ig, 'INTEGER');
  out = out.replace(/::\s*(?:regclass|text|integer|numeric|date|timestamp|uuid)\b/ig, '');
  out = out.replace(/\bDEFAULT\s+nextval\s*\([^)]+\)/ig, '');
  return { sql: out, copyBlocks: copy.blocks };
}

function stripSQLControlFlow(sql) {
  const lines = String(sql || '').split(/\r?\n/);
  const kept = [];
  let skippingIfCondition = false;
  let ifDepth = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      kept.push(line);
      return;
    }

    if (skippingIfCondition) {
      ifDepth += parenBalance(line);
      if (ifDepth <= 0 || /^\)\s*(?:BEGIN)?\s*;?$/i.test(trimmed)) {
        skippingIfCondition = false;
      }
      return;
    }

    if (/^IF\b/i.test(trimmed)) {
      const inlineAction = line.match(/\b(DROP\s+TABLE\b[\s\S]*|CREATE\s+TABLE\b[\s\S]*|INSERT\s+INTO\b[\s\S]*|UPDATE\b[\s\S]*|DELETE\s+FROM\b[\s\S]*)$/i);
      if (inlineAction) kept.push(inlineAction[1]);
      ifDepth = parenBalance(line);
      if (ifDepth > 0 && !inlineAction) skippingIfCondition = true;
      return;
    }

    if (/^(BEGIN|END)\s*;?$/i.test(trimmed)) return;
    if (/^PRINT\b/i.test(trimmed)) return;
    kept.push(line);
  });

  return kept.join('\n');
}

function collapseQualifiedStatementTargets(sql) {
  const ident = '(?:\\[[^\\]]+\\]|`[^`]+`|"[^"]+"|[A-Za-z_][\\w$]*)';
  const qualified = `(${ident})\\s*\\.\\s*(${ident})`;
  let out = String(sql || '');
  out = out.replace(new RegExp(`\\b(INSERT)\\s+(INTO\\s+)?${qualified}`, 'ig'), (_, prefix, into = '', _schema, table) => `${prefix} ${into}${table}`);
  out = out.replace(new RegExp(`\\b(CREATE\\s+TABLE(?:\\s+IF\\s+NOT\\s+EXISTS)?|DROP\\s+TABLE(?:\\s+IF\\s+EXISTS)?|ALTER\\s+TABLE|UPDATE|DELETE\\s+FROM)\\s+${qualified}`, 'ig'), (_, prefix, _schema, table) => `${prefix} ${table}`);
  return out;
}

function prepareSQLScriptForSQLite(sql, dialect = 'sqlite') {
  let out = String(sql || '').replace(/^\uFEFF/, '');
  const selected = SQL_DIALECTS[dialect] ? dialect : 'sqlite';
  let copyBlocks = [];

  // Database-level statements from SQL Server/MySQL dumps are not meaningful in sql.js.
  out = out.replace(/^\s*GO\s*;?\s*$/gim, ';');
  out = out.replace(/\/\*![\s\S]*?\*\/;?/g, '');
  out = out.replace(/^\s*CREATE\s+DATABASE\b[\s\S]*?;\s*/gim, '');
  out = out.replace(/^\s*DROP\s+DATABASE\b[\s\S]*?;\s*/gim, '');
  out = out.replace(/^\s*ALTER\s+DATABASE\b[\s\S]*?;\s*/gim, '');
  out = out.replace(/^\s*CREATE\s+DATABASE\b[^\n]*$/gim, '');
  out = out.replace(/^\s*DROP\s+DATABASE\b[^\n]*$/gim, '');
  out = out.replace(/^\s*ALTER\s+DATABASE\b[^\n]*$/gim, '');
  out = out.replace(/^\s*USE\s+(?:\[[^\]]+\]|`[^`]+`|"[^"]+"|[^\s;]+)\s*;?\s*$/gim, '');
  out = out.replace(/^\s*SET\s+(?:ANSI_NULLS|QUOTED_IDENTIFIER|NOCOUNT|XACT_ABORT|SQL_MODE|TIME_ZONE|NAMES|FOREIGN_KEY_CHECKS|UNIQUE_CHECKS)\b[\s\S]*?;\s*/gim, '');
  out = out.replace(/^\s*SET\s+(?:ANSI_NULLS|QUOTED_IDENTIFIER|NOCOUNT|XACT_ABORT|SQL_MODE|TIME_ZONE|NAMES|FOREIGN_KEY_CHECKS|UNIQUE_CHECKS)\b[^\n]*$/gim, '');
  out = out.replace(/^\s*LOCK\s+TABLES\b[\s\S]*?;\s*/gim, '');
  out = out.replace(/^\s*UNLOCK\s+TABLES\s*;\s*/gim, '');

  if (selected === 'sqlserver') {
    out = stripSQLControlFlow(out);
    out = collapseQualifiedStatementTargets(out);
    out = out.replace(/^\s*DROP\s+TABLE\s+(?!IF\s+EXISTS\b)/gim, 'DROP TABLE IF EXISTS ');
    out = out.replace(/^\s*ALTER\s+TABLE\b[\s\S]*?\b(?:ADD|DROP|CHECK|NOCHECK)\s+CONSTRAINT\b[\s\S]*?(?=^\s*(?:CREATE|INSERT|DROP|ALTER|SELECT|UPDATE|DELETE|;|$))/gim, '');
    out = out.replace(/\[dbo\]\s*\./ig, '');
    out = out.replace(/\bdbo\./ig, '');
    out = out.replace(/^\s*INSERT\s+(?=(?:\[[^\]]+\]|"[^"]+"|[A-Za-z_][\w$]*)\s*\()/gim, 'INSERT INTO ');
    out = out.replace(/^\s*INSERT\s+(?!INTO\b)(?=(?:\[[^\]]+\]|"[^"]+"|`[^`]+`|[A-Za-z_][\w$]*)\s+(?:VALUES|SELECT)\b)/gim, 'INSERT INTO ');
    out = out.replace(/\bN'/g, "'");
    out = out.replace(/\[(nvarchar|varchar|nchar|char|text|ntext)\]\s*(?:\(\s*(?:MAX|\d+)\s*\))?/ig, 'TEXT ');
    out = out.replace(/\b(nvarchar|varchar|nchar|char|text|ntext)\s*(?:\(\s*(?:MAX|\d+)\s*\))?/ig, 'TEXT ');
    out = out.replace(/\[(datetime2?|smalldatetime|date|time)\]\s*(?:\([^)]*\))?/ig, 'TEXT ');
    out = out.replace(/\b(datetime2?|smalldatetime|date|time)\s*(?:\([^)]*\))?/ig, 'TEXT ');
    out = out.replace(/\[(decimal|numeric|money|smallmoney|float|real)\]\s*(?:\([^)]*\))?/ig, 'REAL ');
    out = out.replace(/\b(decimal|numeric|money|smallmoney|float|real)\s*(?:\([^)]*\))?/ig, 'REAL ');
    out = out.replace(/\[(int|bigint|smallint|tinyint|bit)\]/ig, 'INTEGER ');
    out = out.replace(/\b(int|bigint|smallint|tinyint|bit)\b/ig, 'INTEGER ');
    out = out.replace(/\[(varbinary|binary|image|xml|uniqueidentifier|sysname)\]\s*(?:\([^)]*\))?/ig, 'TEXT ');
    out = out.replace(/\b(varbinary|binary|image|xml|uniqueidentifier|sysname)\s*(?:\([^)]*\))?/ig, 'TEXT ');
    out = out.replace(/\bIDENTITY\s*\(\s*\d+\s*,\s*\d+\s*\)/ig, '');
    out = out.replace(/\b(?:CLUSTERED|NONCLUSTERED)\b/ig, '');
    out = out.replace(/\b(?:ROWGUIDCOL|PERSISTED|SPARSE|FILESTREAM)\b/ig, '');
    out = out.replace(/\s+COLLATE\s+[\w_]+/ig, '');
    out = out.replace(/\s+NOT\s+FOR\s+REPLICATION\b/ig, '');
    out = out.replace(/\s+WITH\s*\([^)]*\)/ig, '');
    out = out.replace(/\s+ON\s+\[PRIMARY\]/ig, '');
    out = out.replace(/\s+TEXTIMAGE_ON\s+\[PRIMARY\]/ig, '');
    out = out.replace(/\s+ON\s+"PRIMARY"/ig, '');
    out = out.replace(/\s+TEXTIMAGE_ON\s+"PRIMARY"/ig, '');
    out = out.replace(/^\s*SET\s+IDENTITY_INSERT\b[^\n;]*(?:;)?/gim, '');
  }

  if (selected === 'postgresql') {
    const translated = translatePostgresScriptForSQLite(out);
    out = translated.sql;
    copyBlocks = translated.copyBlocks;
  }

  if (selected === 'mysql') {
    out = collapseQualifiedStatementTargets(out);
    out = out.replace(/`/g, '"');
    out = out.replace(/\bUNSIGNED\b/ig, '');
    out = out.replace(/\bTINYINT\b\s*\(\s*1\s*\)/ig, 'INTEGER');
    out = out.replace(/\b(?:INT|INTEGER|BIGINT|SMALLINT|MEDIUMINT|TINYINT)\b\s*(?:\(\s*\d+\s*\))?/ig, 'INTEGER');
    out = out.replace(/\b(?:VARCHAR|CHAR|TEXT|LONGTEXT|MEDIUMTEXT|TINYTEXT|ENUM|SET)\b\s*(?:\([^)]*\))?/ig, 'TEXT');
    out = out.replace(/\b(?:DATETIME|TIMESTAMP|DATE|TIME)\b\s*(?:\([^)]*\))?/ig, 'TEXT');
    out = out.replace(/\b(?:DECIMAL|NUMERIC|DOUBLE|FLOAT)\b\s*(?:\([^)]*\))?/ig, 'REAL');
    out = out.replace(/\bAUTO_INCREMENT\b/ig, '');
    out = out.replace(/\s+CHARACTER\s+SET\s+\w+/ig, '');
    out = out.replace(/\s+COLLATE\s+\w+/ig, '');
    out = out.replace(/\)\s*ENGINE\s*=\s*\w+[^;]*;/ig, ');');
    out = out.replace(/\)\s*DEFAULT\s+CHARSET\s*=\s*[\w-]+[^;]*;/ig, ');');
  }

  if (selected === 'postgresql') {
    out = collapseQualifiedStatementTargets(out);
  }

  out = terminateLineSeparatedStatements(out);
  const normalized = normalizeSQLForExecution(out, selected);
  return {
    ...normalized,
    sql: normalized.sql,
    translated: normalized.translated || normalized.sql !== sql,
    copyBlocks,
    notes: [
      ...(normalized.notes || []),
      'Đã bỏ qua các lệnh quản trị database không hỗ trợ trong trình duyệt như USE, GO, CREATE DATABASE, SET.'
    ]
  };
}

function terminateLineSeparatedStatements(sql) {
  const lines = String(sql || '').split(/\r?\n/);
  const statementStart = /^(INSERT(?:\s+INTO)?|UPDATE|DELETE\s+FROM|DROP\s+TABLE|CREATE\s+(?:UNIQUE\s+)?INDEX|ALTER\s+TABLE|SELECT)\b/i;
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || /^\s*(?:--|\/\*)/.test(trimmed) || /[;,]$/.test(trimmed)) return line;
    if (!statementStart.test(trimmed) || parenBalance(line) !== 0) return line;

    const nextLine = lines.slice(index + 1).find(item => {
      const nextTrimmed = item.trim();
      return nextTrimmed && !/^\s*--/.test(nextTrimmed);
    });
    const nextTrimmed = nextLine?.trim() || '';
    if (!nextTrimmed || nextTrimmed === ';' || statementStart.test(nextTrimmed) || /^CREATE\s+TABLE\b/i.test(nextTrimmed)) {
      return `${line};`;
    }
    return line;
  }).join('\n');
}

function splitSQLStatements(sql) {
  const statements = [];
  let current = '';
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  const source = String(sql || '');

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      current += ch;
      if (ch === '\n') lineComment = false;
      continue;
    }

    if (blockComment) {
      current += ch;
      if (ch === '*' && next === '/') {
        current += next;
        i += 1;
        blockComment = false;
      }
      continue;
    }

    if (quote) {
      current += ch;
      if (ch === quote && next === quote) {
        current += next;
        i += 1;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '-' && next === '-') {
      current += ch + next;
      i += 1;
      lineComment = true;
      continue;
    }

    if (ch === '/' && next === '*') {
      current += ch + next;
      i += 1;
      blockComment = true;
      continue;
    }

    if (ch === '\'' || ch === '"' || ch === '`') {
      quote = ch;
      current += ch;
      continue;
    }

    if (ch === ';') {
      if (current.trim()) statements.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

function stripSQLCommentsForCheck(statement) {
  return String(statement || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split(/\r?\n/)
    .filter(line => !/^\s*--/.test(line))
    .join('\n')
    .trim();
}

function cleanUploadStatement(statement) {
  let stmt = String(statement || '').trim();
  stmt = stmt.replace(/,\s*\)/g, ')');
  stmt = stmt.replace(/^\s*CREATE\s+TABLE([\s\S]*)$/i, match => {
    const lines = match.split(/\r?\n/).filter(line => {
      const trimmed = line.trim().replace(/,$/, '');
      if (/^(KEY|INDEX|UNIQUE\s+KEY|UNIQUE\s+INDEX|FULLTEXT\s+KEY|SPATIAL\s+KEY)\b/i.test(trimmed)) return false;
      if (/^CONSTRAINT\b[\s\S]*\bFOREIGN\s+KEY\b/i.test(trimmed)) return false;
      return true;
    });
    return lines.join('\n').replace(/,\s*\)/g, ')');
  });
  return stmt;
}

function shouldSkipUploadSQLStatement(statement) {
  const stmt = stripSQLCommentsForCheck(statement);
  if (!stmt) return true;
  return /^(IF|WITH\s+CHECK|WITH\s+NOCHECK|BEGIN|END|GO|USE|SET|PRINT|DECLARE|EXEC|EXECUTE|CREATE\s+(?:OR\s+ALTER\s+)?(?:PROCEDURE|PROC|FUNCTION|TRIGGER|VIEW|SCHEMA)|ALTER\s+TABLE|CREATE\s+(?:UNIQUE\s+)?(?:CLUSTERED\s+|NONCLUSTERED\s+)?INDEX|ALTER\s+INDEX|DROP\s+INDEX|CREATE\s+DATABASE|DROP\s+DATABASE|ALTER\s+DATABASE|LOCK\s+TABLES|UNLOCK\s+TABLES|DELIMITER|SELECT\s+pg_catalog|COPY\s+)/i.test(stmt);
}

function classifyUploadSQLStatement(statement) {
  const stmt = stripSQLCommentsForCheck(statement);
  if (!stmt) return { action: 'skip', kind: 'empty', reason: 'empty/comment' };
  if (/^(GO|USE|SET|PRINT|DECLARE|EXEC|EXECUTE|BEGIN|END|COMMIT|ROLLBACK|LOCK\s+TABLES|UNLOCK\s+TABLES|DELIMITER)\b/i.test(stmt)) {
    return { action: 'skip', kind: 'session', reason: 'session/database command' };
  }
  if (/^(CREATE|DROP|ALTER)\s+DATABASE\b/i.test(stmt)) {
    return { action: 'skip', kind: 'database', reason: 'database-level command' };
  }
  if (/^CREATE\s+(?:OR\s+ALTER\s+)?(?:PROCEDURE|PROC|FUNCTION|TRIGGER|VIEW|SCHEMA|EXTENSION|SEQUENCE)\b/i.test(stmt)) {
    return { action: 'skip', kind: 'object', reason: 'non-table object' };
  }
  if (/^(CREATE\s+(?:UNIQUE\s+)?(?:CLUSTERED\s+|NONCLUSTERED\s+)?INDEX|ALTER\s+INDEX|DROP\s+INDEX)\b/i.test(stmt)) {
    return { action: 'skip', kind: 'index', reason: 'index metadata' };
  }
  if (/^ALTER\s+TABLE\b[\s\S]*\b(?:ADD|DROP|CHECK|NOCHECK)\s+CONSTRAINT\b/i.test(stmt)) {
    return { action: 'skip', kind: 'constraint', reason: 'constraint metadata' };
  }
  if (/^(COMMENT\s+ON|SELECT\s+pg_catalog|SELECT\s+setval|ALTER\s+(?:TABLE|SEQUENCE|VIEW)\b[\s\S]*\bOWNER\s+TO\b|ALTER\s+SEQUENCE|DROP\s+SEQUENCE)/i.test(stmt)) {
    return { action: 'skip', kind: 'metadata', reason: 'dump metadata' };
  }
  if (/^CREATE\s+TABLE\b/i.test(stmt) || /^DROP\s+TABLE\b/i.test(stmt)) {
    return { action: 'execute', kind: 'schema' };
  }
  if (/^(INSERT|REPLACE|UPDATE|DELETE|COPY|\\copy)\b/i.test(stmt)) {
    return { action: 'execute', kind: 'data' };
  }
  return { action: 'execute', kind: 'unknown' };
}

function inferSQLiteColumnType(typeText) {
  const text = String(typeText || '').toUpperCase();
  if (/\b(INT|BIT|BOOL)\b/.test(text)) return 'INTEGER';
  if (/\b(REAL|FLOAT|DOUBLE|DECIMAL|NUMERIC|MONEY)\b/.test(text)) return 'REAL';
  if (/\b(BLOB|BINARY|VARBINARY|IMAGE)\b/.test(text)) return 'BLOB';
  return 'TEXT';
}

function readLeadingIdentifier(source) {
  const text = String(source || '').trim();
  if (!text) return null;
  const first = text[0];
  if (first === '"' || first === '`') {
    let value = first;
    for (let i = 1; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];
      value += ch;
      if (ch === first && next === first) {
        value += next;
        i += 1;
        continue;
      }
      if (ch === first) {
        return { raw: value, name: cleanSQLIdentifierPart(value), rest: text.slice(i + 1).trim() };
      }
    }
    return null;
  }
  if (first === '[') {
    const end = text.indexOf(']');
    if (end === -1) return null;
    const raw = text.slice(0, end + 1);
    return { raw, name: cleanSQLIdentifierPart(raw), rest: text.slice(end + 1).trim() };
  }
  const match = text.match(/^([A-Za-z_][\w$]*|[^\s,()]+)\s*([\s\S]*)$/);
  return match ? { raw: match[1], name: cleanSQLIdentifierPart(match[1]), rest: (match[2] || '').trim() } : null;
}

function findCreateTableBody(statement) {
  const source = String(statement || '').trim();
  const match = source.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([\s\S]+?)\s*\(/i);
  if (!match) return null;
  const tableRef = match[1].trim();
  const start = match[0].lastIndexOf('(');
  let depth = 0;
  let quote = null;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (quote) {
      if (ch === quote && next === quote) {
        i += 1;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '\'' || ch === '"' || ch === '`') {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
      if (depth === 0) {
        return {
          table: finalTableNameFromRef(tableRef),
          body: source.slice(start + 1, i)
        };
      }
    }
  }
  return null;
}

function parseCreateTableColumns(statement) {
  const parsed = findCreateTableBody(statement);
  if (!parsed?.table) return null;
  const columns = splitSqlArgs(parsed.body)
    .map(part => part.trim().replace(/,$/, ''))
    .filter(Boolean)
    .filter(part => !/^(CONSTRAINT|PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK|KEY|INDEX|FULLTEXT\s+KEY|SPATIAL\s+KEY)\b/i.test(part))
    .map(part => {
      const column = readLeadingIdentifier(part);
      if (!column?.name) return null;
      return {
        name: column.name,
        type: inferSQLiteColumnType(column.rest)
      };
    })
    .filter(Boolean);
  return columns.length ? { table: parsed.table, columns } : null;
}

function ensureCreateTableShape(statement) {
  const shape = parseCreateTableColumns(statement);
  if (!shape?.columns?.length) return null;
  const changes = [];
  if (!tableExistsInUserDb(shape.table)) {
    const cols = shape.columns.map(column => `${quoteSQLIdentifier(column.name)} ${column.type}`).join(', ');
    userDb.run(`CREATE TABLE IF NOT EXISTS ${quoteSQLIdentifier(shape.table)} (${cols});`);
    changes.push(`rebuilt table ${shape.table}`);
    return changes;
  }
  const existing = new Set(getUserDbColumnNames(shape.table).map(column => column.toLowerCase()));
  shape.columns.forEach(column => {
    if (!existing.has(column.name.toLowerCase())) {
      userDb.run(`ALTER TABLE ${quoteSQLIdentifier(shape.table)} ADD COLUMN ${quoteSQLIdentifier(column.name)} ${column.type};`);
      existing.add(column.name.toLowerCase());
      changes.push(`added column ${shape.table}.${column.name}`);
    }
  });
  return changes.length ? changes : null;
}

function parseAlterTableAddColumn(statement) {
  const source = String(statement || '').trim();
  const match = source.match(/^ALTER\s+TABLE\s+((?:"[^"]+"|`[^`]+`|\[[^\]]+\]|[A-Za-z_][\w$]*)(?:\s*\.\s*(?:"[^"]+"|`[^`]+`|\[[^\]]+\]|[A-Za-z_][\w$]*))?)\s+ADD\s+(?:COLUMN\s+)?([\s\S]+)$/i);
  if (!match || /\bCONSTRAINT\b/i.test(match[2])) return null;
  const column = readLeadingIdentifier(match[2]);
  if (!column?.name) return null;
  return {
    table: finalTableNameFromRef(match[1]),
    column: {
      name: column.name,
      type: inferSQLiteColumnType(column.rest)
    }
  };
}

function ensureAlterTableAddColumn(statement) {
  const parsed = parseAlterTableAddColumn(statement);
  if (!parsed?.table || !parsed.column?.name) return null;
  if (!tableExistsInUserDb(parsed.table)) {
    userDb.run(`CREATE TABLE ${quoteSQLIdentifier(parsed.table)} (${quoteSQLIdentifier(parsed.column.name)} ${parsed.column.type});`);
    return [`created table ${parsed.table}`];
  }
  const existing = new Set(getUserDbColumnNames(parsed.table).map(column => column.toLowerCase()));
  if (existing.has(parsed.column.name.toLowerCase())) return [];
  userDb.run(`ALTER TABLE ${quoteSQLIdentifier(parsed.table)} ADD COLUMN ${quoteSQLIdentifier(parsed.column.name)} ${parsed.column.type};`);
  return [`added column ${parsed.table}.${parsed.column.name}`];
}

function normalizeUploadStatementFallback(statement) {
  return String(statement || '')
    .replace(/\s+COLLATE\s+[\w_]+/ig, '')
    .replace(/\s+CONSTRAINT\s+(?:"[^"]+"|\[[^\]]+\]|[A-Za-z_][\w$]*)\s+DEFAULT\s+\({0,2}[^,\n)]+\){0,2}/ig, '')
    .replace(/\bDEFAULT\s*\(\s*DATETIME\s*\(\s*'now'\s*\)\s*\)/ig, 'DEFAULT CURRENT_TIMESTAMP')
    .replace(/\bDEFAULT\s*\(\s*GETDATE\s*\(\s*\)\s*\)/ig, 'DEFAULT CURRENT_TIMESTAMP')
    .replace(/\b(?:ASC|DESC)\b(?=\s*[,)])/ig, '')
    .replace(/\s+ON\s+"PRIMARY"/ig, '')
    .replace(/\s+TEXTIMAGE_ON\s+"PRIMARY"/ig, '')
    .replace(/,\s*\)/g, ')');
}

function rewriteInsertWithExplicitColumns(statement) {
  const source = String(statement || '').trim();
  const match = source.match(/^INSERT\s+(OR\s+\w+\s+)?INTO\s+((?:"[^"]+"|`[^`]+`|\[[^\]]+\]|[A-Za-z_][\w$]*)(?:\s*\.\s*(?:"[^"]+"|`[^`]+`|\[[^\]]+\]|[A-Za-z_][\w$]*))?)\s+VALUES\s*([\s\S]+)$/i);
  if (!match) return null;
  const target = {
    table: finalTableNameFromRef(match[2]),
    valueCount: countInsertValues(source)
  };
  if (!target.table || !target.valueCount) return null;
  const existingColumns = getUserDbColumnNames(target.table);
  const columns = [...existingColumns];
  while (columns.length < target.valueCount) {
    const name = `col_${columns.length + 1}`;
    userDb.run(`ALTER TABLE ${quoteSQLIdentifier(target.table)} ADD COLUMN ${quoteSQLIdentifier(name)} TEXT;`);
    columns.push(name);
  }
  return `INSERT ${match[1] || ''}INTO ${quoteSQLIdentifier(target.table)} (${columns.slice(0, target.valueCount).map(quoteSQLIdentifier).join(', ')}) VALUES ${match[3]}`;
}

function prepareSQLStatementForSQLite(statement, fallbackDialect = 'sqlite') {
  const detected = detectSQLDialect(statement, 'auto');
  const dialect = detected.confidence === 'low' ? fallbackDialect : detected.dialect;
  return prepareSQLScriptForSQLite(statement, dialect).sql;
}

function repairAndRunUploadStatement(statement, classification, fallbackDialect) {
  const attempts = [];
  const prepared = prepareSQLStatementForSQLite(statement, fallbackDialect);
  if (prepared && prepared !== statement) attempts.push(prepared);
  const fallback = normalizeUploadStatementFallback(prepared || statement);
  if (fallback && fallback !== statement && fallback !== prepared) attempts.push(fallback);

  for (const attempt of attempts) {
    try {
      userDb.run(attempt);
      return { ok: true, repaired: true, statement: attempt, changes: ['rewrote unsupported dialect syntax'] };
    } catch {}
  }

  if (classification.kind === 'schema' && /^CREATE\s+TABLE\b/i.test(stripSQLCommentsForCheck(statement))) {
    try {
      const changes = ensureCreateTableShape(statement);
      if (changes) return { ok: true, repaired: true, statement, changes };
    } catch {}
  }

  if (/^ALTER\s+TABLE\b/i.test(stripSQLCommentsForCheck(statement))) {
    try {
      const changes = ensureAlterTableAddColumn(statement);
      if (changes) return { ok: true, repaired: true, statement, changes: changes.length ? changes : ['column already exists'] };
    } catch {}
  }

  if (classification.kind === 'data') {
    try {
      ensureInsertTargetShape(statement);
      const rewritten = rewriteInsertWithExplicitColumns(statement);
      if (rewritten) {
        userDb.run(rewritten);
        return { ok: true, repaired: true, statement: rewritten, changes: ['rewrote INSERT with explicit columns'] };
      }
    } catch {}
  }

  return { ok: false };
}

function tableExistsInUserDb(tableName) {
  if (!userDb) return false;
  const safeName = String(tableName || '').replace(/'/g, "''").toLowerCase();
  const result = userDb.exec(`SELECT 1 FROM sqlite_master WHERE type = 'table' AND lower(name) = '${safeName}'`);
  return !!result[0]?.values?.length;
}

function getUserDbColumnNames(tableName) {
  if (!userDb || !tableExistsInUserDb(tableName)) return [];
  const info = userDb.exec(`PRAGMA table_info(${quoteSQLIdentifier(tableName)})`);
  return (info[0]?.values || []).map(row => String(row[1]));
}

function parseInsertTarget(statement) {
  const source = String(statement || '').trim();
  const match = source.match(/^INSERT\s+(?:OR\s+\w+\s+)?INTO\s+((?:"[^"]+"|`[^`]+`|\[[^\]]+\]|[A-Za-z_][\w$]*)(?:\s*\.\s*(?:"[^"]+"|`[^`]+`|\[[^\]]+\]|[A-Za-z_][\w$]*))?)\s*(?:\(([\s\S]*?)\))?\s+VALUES\s*\(/i);
  if (!match) return null;
  const columns = match[2]
    ? splitSqlArgs(match[2]).map(cleanSQLIdentifierPart).filter(Boolean)
    : [];
  return {
    table: finalTableNameFromRef(match[1]),
    columns
  };
}

function countInsertValues(statement) {
  const valueMatch = String(statement || '').match(/\bVALUES\s*\(([\s\S]*)$/i);
  if (!valueMatch) return 0;
  let inner = valueMatch[1];
  let depth = 1;
  let quote = null;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    const next = inner[i + 1];
    if (quote) {
      if (ch === quote && next === quote) {
        i += 1;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '\'' || ch === '"' || ch === '`') {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
      if (depth === 0) {
        inner = inner.slice(0, i);
        break;
      }
    }
  }
  return splitSqlArgs(inner).length;
}

function ensureInsertTargetShape(statement) {
  const target = parseInsertTarget(statement);
  if (!target?.table) return null;

  const shapeChanges = [];
  let columns = target.columns;
  if (!columns.length) {
    const count = countInsertValues(statement);
    if (tableExistsInUserDb(target.table)) {
      const existingColumns = getUserDbColumnNames(target.table);
      if (existingColumns.length >= count) return null;
      columns = Array.from({ length: count - existingColumns.length }, (_, index) => `col_${existingColumns.length + index + 1}`);
    } else {
      columns = Array.from({ length: count }, (_, index) => `col_${index + 1}`);
    }
  }
  if (!columns.length) return null;

  if (!tableExistsInUserDb(target.table)) {
    userDb.run(`CREATE TABLE ${quoteSQLIdentifier(target.table)} (${columns.map(column => `${quoteSQLIdentifier(column)} TEXT`).join(', ')});`);
    shapeChanges.push(`created table ${target.table}`);
    return shapeChanges;
  }

  const existing = new Set(getUserDbColumnNames(target.table).map(column => column.toLowerCase()));
  columns.forEach(column => {
    if (!existing.has(String(column).toLowerCase())) {
      userDb.run(`ALTER TABLE ${quoteSQLIdentifier(target.table)} ADD COLUMN ${quoteSQLIdentifier(column)} TEXT;`);
      existing.add(String(column).toLowerCase());
      shapeChanges.push(`added column ${target.table}.${column}`);
    }
  });
  return shapeChanges.length ? shapeChanges : null;
}

function executeUserDataSQLScript(sql, options = {}) {
  if (!userDb) return { error: 'Chưa có database riêng. Hãy upload CSV, JSON hoặc SQL trước.' };
  const start = performance.now();
  const detection = detectSQLDialect(sql, options.dialect || 'auto');
  const normalized = prepareSQLScriptForSQLite(sql, detection.dialect);
  const statements = splitSQLStatements(normalized.sql);
  const metadata = [];
  const failed = [];
  const repaired = [];
  const ignored = [];
  const shapeFixes = [];
  let executed = 0;
  let dataStatements = 0;
  let schemaStatements = 0;

  try {
    userDb.run('BEGIN TRANSACTION;');
    statements.forEach((statement, index) => {
      const cleaned = cleanUploadStatement(statement);
      const classification = classifyUploadSQLStatement(cleaned);
      if (classification.action === 'skip') {
        metadata.push({
          index: index + 1,
          kind: classification.kind,
          reason: classification.reason,
          statement: cleaned.slice(0, 120)
        });
        return;
      }
      if (classification.kind === 'data') {
        dataStatements += 1;
        const changes = ensureInsertTargetShape(cleaned);
        if (changes?.length) shapeFixes.push(...changes.map(change => ({ index: index + 1, change })));
      }
      if (classification.kind === 'schema') schemaStatements += 1;
      try {
        userDb.run(cleaned);
        executed += 1;
      } catch (error) {
        const recovery = repairAndRunUploadStatement(cleaned, classification, detection.dialect);
        if (recovery.ok) {
          executed += 1;
          repaired.push({
            index: index + 1,
            kind: classification.kind,
            error: error.message,
            changes: recovery.changes || [],
            statement: (recovery.statement || cleaned).slice(0, 180)
          });
          (recovery.changes || []).forEach(change => {
            if (/^(created table|rebuilt table|added column|rewrote INSERT)/i.test(change)) {
              shapeFixes.push({ index: index + 1, change });
            }
          });
          return;
        }
        if (classification.kind !== 'data') {
          ignored.push({
            index: index + 1,
            kind: classification.kind,
            error: error.message,
            statement: cleaned.slice(0, 180)
          });
          return;
        }
        failed.push({
          index: index + 1,
          kind: classification.kind,
          error: error.message,
          statement: cleaned.slice(0, 180)
        });
      }
    });
    const fatalFailures = failed.filter(item => item.kind === 'data');
    if (fatalFailures.length) {
      const first = fatalFailures[0];
      throw new Error(`Không import đủ dữ liệu. Statement dữ liệu ${first.index} lỗi: ${first.error}`);
    }
    userDb.run('COMMIT;');
  } catch (error) {
    try { userDb.run('ROLLBACK;'); } catch {}
    return {
      error: error.message,
      failed,
      metadata,
      normalized: {
        ...normalized,
        detectedDialect: detection,
        importStats: {
          statements: statements.length,
          executed,
          schema: schemaStatements,
          data: dataStatements,
          metadata: metadata.length,
          failed: failed.length,
          repaired: repaired.length,
          ignored: ignored.length,
          shapeFixes: shapeFixes.length,
          failedSamples: failed.slice(0, 3),
          repairedSamples: repaired.slice(0, 3),
          ignoredSamples: ignored.slice(0, 3),
          metadataSamples: metadata.slice(0, 3)
        }
      }
    };
  }

  refreshUserDataTables();
  const tables = getUserDataSummary().tables || [];
  const time = (performance.now() - start).toFixed(1);

  if (!tables.length && failed.length) {
    const first = failed[0];
    return {
      error: `Không import được bảng nào. Lỗi đầu tiên ở statement ${first.index}: ${first.error}`,
      failed,
      metadata,
      normalized: {
        ...normalized,
        detectedDialect: detection
      }
    };
  }

  if (!tables.length) {
    return {
      error: 'Không tìm thấy bảng dữ liệu để import. File SQL có thể chỉ chứa stored procedure, view, index, constraint hoặc metadata hệ thống.',
      metadata,
      normalized: {
        ...normalized,
        detectedDialect: detection
      }
    };
  }

  return {
    results: [],
    time,
    normalized: {
      ...normalized,
      detectedDialect: detection,
      importStats: {
        statements: statements.length,
        executed,
          schema: schemaStatements,
          data: dataStatements,
          metadata: metadata.length,
          failed: failed.length,
          repaired: repaired.length,
          ignored: ignored.length,
          shapeFixes: shapeFixes.length,
          copyRows: (normalized.copyBlocks || []).reduce((sum, block) => sum + block.rows, 0),
          failedSamples: failed.slice(0, 3),
          repairedSamples: repaired.slice(0, 3),
          ignoredSamples: ignored.slice(0, 3),
          metadataSamples: metadata.slice(0, 3),
          shapeFixSamples: shapeFixes.slice(0, 3)
        }
    }
  };
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

function escapeResultHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatResults(data) {
  if (data.error) {
    return `<div class="error-msg">❌ Lỗi: ${escapeResultHTML(data.error)}</div>`;
  }
  let prefix = '';
  if (data.normalized?.translated) {
    const dialectName = SQL_DIALECTS[data.normalized.dialect]?.name || data.normalized.dialect;
    prefix = `<div class="dialect-warning"><strong>${escapeResultHTML(dialectName)}</strong> đã được chuyển sang SQLite để chạy kiểm tra. <code>${escapeResultHTML(data.normalized.notes[0] || '')}</code></div>`;
  }
  if (!data.results || data.results.length === 0) {
    return `${prefix}<div class="success-msg">✅ Câu lệnh thực thi thành công! (${data.time}ms)</div>`;
  }
  let html = prefix;
  data.results.forEach(r => {
    html += '<table><tr>';
    r.columns.forEach(c => { html += `<th>${escapeResultHTML(c)}</th>`; });
    html += '</tr>';
    r.values.forEach(row => {
      html += '<tr>';
      row.forEach(v => { html += `<td>${v === null ? '<em>NULL</em>' : escapeResultHTML(v)}</td>`; });
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

function ensureUserDatabase() {
  if (!SQLRuntime) return false;
  if (!userDb) userDb = new SQLRuntime.Database();
  return true;
}

function resetUserDataDatabase() {
  if (!SQLRuntime) return false;
  if (userDb) userDb.close();
  userDb = new SQLRuntime.Database();
  userDataTables = [];
  return true;
}

function quoteSQLIdentifier(identifier) {
  return `"${String(identifier).replace(/"/g, '""')}"`;
}

function normalizeIdentifier(value, fallback = 'col') {
  let text = String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!text) text = fallback;
  if (/^\d/.test(text)) text = `${fallback}_${text}`;
  return text;
}

function makeUniqueName(base, used) {
  let name = base;
  let index = 2;
  while (used.has(name.toLowerCase())) {
    name = `${base}_${index}`;
    index += 1;
  }
  used.add(name.toLowerCase());
  return name;
}

function getUserDataTableNames() {
  if (!userDb) return new Set();
  const result = userDb.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'");
  const names = result[0]?.values?.map(row => String(row[0]).toLowerCase()) || [];
  return new Set(names);
}

function detectDelimiter(text) {
  const firstLine = String(text || '').split(/\r?\n/).find(line => line.trim()) || '';
  const candidates = [',', ';', '\t'];
  return candidates
    .map(delimiter => ({ delimiter, count: firstLine.split(delimiter).length }))
    .sort((a, b) => b.count - a.count)[0]?.delimiter || ',';
}

function parseDelimitedText(text, delimiter = ',') {
  const rows = [];
  let row = [];
  let value = '';
  let quote = false;
  const source = String(text || '').replace(/^\uFEFF/, '');

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (quote) {
      if (ch === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (ch === '"') {
        quote = false;
      } else {
        value += ch;
      }
      continue;
    }

    if (ch === '"') {
      quote = true;
    } else if (ch === delimiter) {
      row.push(value);
      value = '';
    } else if (ch === '\n') {
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else if (ch !== '\r') {
      value += ch;
    }
  }

  row.push(value);
  rows.push(row);
  return rows.filter(items => items.some(item => String(item).trim() !== ''));
}

function tableRowsFromDelimited(text) {
  const rows = parseDelimitedText(text, detectDelimiter(text));
  if (rows.length < 2) throw new Error('File CSV/TSV cần có dòng header và ít nhất 1 dòng dữ liệu.');
  const used = new Set();
  const columns = rows[0].map((header, index) => makeUniqueName(normalizeIdentifier(header, `col_${index + 1}`), used));
  return rows.slice(1).map(raw => {
    const record = {};
    columns.forEach((column, index) => {
      record[column] = raw[index] ?? '';
    });
    return record;
  });
}

function normalizeJsonRows(parsed, fallbackName) {
  if (Array.isArray(parsed)) {
    return [{ tableName: fallbackName, rows: parsed }];
  }
  if (parsed && typeof parsed === 'object') {
    const groups = Object.entries(parsed)
      .filter(([, value]) => Array.isArray(value))
      .map(([key, value]) => ({ tableName: key, rows: value }));
    if (groups.length) return groups;
    return [{ tableName: fallbackName, rows: [parsed] }];
  }
  throw new Error('JSON cần là array object hoặc object chứa các array bảng.');
}

function normalizeRecordRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Không có dòng dữ liệu để tạo bảng.');
  }

  return rows.map(item => {
    if (item && typeof item === 'object' && !Array.isArray(item)) return item;
    return { value: item };
  });
}

function inferSQLiteType(values) {
  const nonEmpty = values.filter(value => value !== null && value !== undefined && String(value).trim() !== '');
  if (!nonEmpty.length) return 'TEXT';
  if (nonEmpty.every(value => /^-?\d+$/.test(String(value).trim()))) return 'INTEGER';
  if (nonEmpty.every(value => /^-?(?:\d+\.?\d*|\.\d+)$/.test(String(value).trim()))) return 'REAL';
  if (nonEmpty.every(value => /^(true|false)$/i.test(String(value).trim()))) return 'INTEGER';
  return 'TEXT';
}

function coerceSQLiteValue(value, type) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  if (type === 'INTEGER') {
    if (/^(true|false)$/i.test(String(value).trim())) return /^true$/i.test(String(value).trim()) ? 1 : 0;
    return Number.parseInt(value, 10);
  }
  if (type === 'REAL') return Number.parseFloat(value);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function createUserTableFromRows(tableName, rows, source = '') {
  if (!ensureUserDatabase()) throw new Error('SQL Engine chưa sẵn sàng.');
  const normalizedRows = normalizeRecordRows(rows);
  const tableNames = getUserDataTableNames();
  const safeTableName = makeUniqueName(normalizeIdentifier(tableName, 'uploaded_data'), tableNames);
  const sourceColumns = [...new Set(normalizedRows.flatMap(row => Object.keys(row)))];
  const usedColumns = new Set();
  const columnMap = sourceColumns.map((key, index) => ({
    source: key,
    name: makeUniqueName(normalizeIdentifier(key, `col_${index + 1}`), usedColumns)
  }));
  if (!columnMap.length) throw new Error('Không tìm thấy cột trong dữ liệu upload.');

  const columns = columnMap.map(column => {
    const values = normalizedRows.map(row => row[column.source]);
    return { ...column, type: inferSQLiteType(values) };
  });

  const createSql = `CREATE TABLE ${quoteSQLIdentifier(safeTableName)} (${columns.map(column => `${quoteSQLIdentifier(column.name)} ${column.type}`).join(', ')});`;
  userDb.run(createSql);

  const insertSql = `INSERT INTO ${quoteSQLIdentifier(safeTableName)} (${columns.map(column => quoteSQLIdentifier(column.name)).join(', ')}) VALUES (${columns.map(() => '?').join(', ')});`;
  const stmt = userDb.prepare(insertSql);
  try {
    userDb.run('BEGIN TRANSACTION;');
    normalizedRows.forEach(row => {
      stmt.run(columns.map(column => coerceSQLiteValue(row[column.source], column.type)));
    });
    userDb.run('COMMIT;');
  } catch (error) {
    try { userDb.run('ROLLBACK;'); } catch {}
    throw error;
  } finally {
    stmt.free();
  }

  refreshUserDataTables();
  return {
    tableName: safeTableName,
    source,
    rows: normalizedRows.length,
    columns: columns.map(column => ({ name: column.name, type: column.type }))
  };
}

function refreshUserDataTables() {
  if (!userDb) {
    userDataTables = [];
    return userDataTables;
  }
  const result = userDb.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
  const tableNames = result[0]?.values?.map(row => String(row[0])) || [];
  userDataTables = tableNames.map(name => {
    const info = userDb.exec(`PRAGMA table_info(${quoteSQLIdentifier(name)})`);
    const count = userDb.exec(`SELECT COUNT(*) AS rows FROM ${quoteSQLIdentifier(name)}`);
    return {
      name,
      rows: Number(count[0]?.values?.[0]?.[0] || 0),
      columns: (info[0]?.values || []).map(row => ({ name: String(row[1]), type: String(row[2] || 'TEXT') }))
    };
  });
  return userDataTables;
}

function getUserDataSummary() {
  refreshUserDataTables();
  return {
    ready: !!userDb,
    tables: userDataTables
  };
}

function executeUserDataSQL(sql, options = {}) {
  if (!userDb) return { error: 'Chưa có database riêng. Hãy upload CSV, JSON hoặc SQL trước.' };
  if (options.script) return executeUserDataSQLScript(sql, options);
  const start = performance.now();
  try {
    const normalized = normalizeSQLForExecution(sql, options.dialect || getSelectedDialect());
    const results = userDb.exec(normalized.sql);
    refreshUserDataTables();
    const time = (performance.now() - start).toFixed(1);
    return { results, time, normalized };
  } catch (e) {
    return { error: e.message };
  }
}

function readUploadedFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Không đọc được file ${file.name}.`));
    reader.readAsText(file, 'utf-8');
  });
}

function baseNameFromFile(fileName) {
  return String(fileName || 'uploaded_data').replace(/\.[^.]+$/, '');
}

async function importUserDataFile(file, options = {}) {
  if (!ensureUserDatabase()) throw new Error('SQL Engine chưa sẵn sàng.');
  const text = await readUploadedFileAsText(file);
  const ext = String(file.name || '').split('.').pop().toLowerCase();
  const fallbackName = baseNameFromFile(file.name);

  if (ext === 'sql') {
    const result = executeUserDataSQL(text, { dialect: options.dialect || getSelectedDialect(), script: true });
    if (result.error) throw new Error(result.error);
    return {
      fileName: file.name,
      type: 'sql',
      message: 'Đã chạy file SQL và cập nhật schema.',
      detectedDialect: result.normalized?.detectedDialect || null,
      stats: result.normalized?.importStats || null
    };
  }

  if (ext === 'json') {
    const parsed = JSON.parse(text);
    const groups = normalizeJsonRows(parsed, fallbackName);
    const imported = groups.map(group => createUserTableFromRows(group.tableName, group.rows, file.name));
    return { fileName: file.name, type: 'json', imported };
  }

  if (['csv', 'tsv', 'txt'].includes(ext)) {
    const rows = tableRowsFromDelimited(text);
    const imported = [createUserTableFromRows(fallbackName, rows, file.name)];
    return { fileName: file.name, type: ext || 'csv', imported };
  }

  throw new Error(`Chưa hỗ trợ định dạng .${ext || 'unknown'}. Hãy dùng CSV, TSV, JSON hoặc SQL.`);
}

async function importUserDataFiles(files, options = {}) {
  const items = Array.from(files || []);
  if (!items.length) return [];
  const results = [];
  for (const file of items) {
    results.push(await importUserDataFile(file, options));
  }
  refreshUserDataTables();
  return results;
}
