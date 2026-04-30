// SQL Bot - local SQL learning assistant in Vietnamese
const CHATBOT_KB = [
  { keys: ['sql là gì','sql la gi','giới thiệu sql'], answer: 'SQL (Structured Query Language) là ngôn ngữ truy vấn có cấu trúc, dùng để giao tiếp với cơ sở dữ liệu quan hệ. SQL cho phép bạn tạo, đọc, cập nhật và xóa dữ liệu (CRUD).' },
  { keys: ['select','truy vấn','lấy dữ liệu'], answer: 'Câu lệnh SELECT dùng để lấy dữ liệu:\n\n<code>SELECT cot1, cot2 FROM TenBang;</code>\n<code>SELECT * FROM TenBang;</code> (lấy tất cả cột)\n\nMẹo: Tránh dùng SELECT * trong thực tế, chỉ lấy cột cần thiết.' },
  { keys: ['where','điều kiện','lọc'], answer: 'WHERE dùng để lọc dữ liệu theo điều kiện:\n\n<code>SELECT * FROM SinhVien WHERE DiemTB >= 8;</code>\n\nCác toán tử: =, !=, >, <, BETWEEN, LIKE, IN, IS NULL\nKết hợp: AND, OR, NOT' },
  { keys: ['join','kết hợp','liên kết bảng'], answer: 'JOIN kết hợp dữ liệu từ nhiều bảng:\n\n• <code>INNER JOIN</code> - chỉ lấy hàng khớp cả 2 bảng\n• <code>LEFT JOIN</code> - lấy tất cả bảng trái + khớp bảng phải\n• <code>RIGHT JOIN</code> - ngược LEFT JOIN\n• <code>FULL JOIN</code> - lấy tất cả từ cả 2 bảng' },
  { keys: ['inner join'], answer: 'INNER JOIN lấy các hàng có giá trị khớp ở CẢ HAI bảng:\n\n<code>SELECT * FROM DonHang DH\nINNER JOIN KhachHang KH\nON DH.MaKH = KH.MaKH;</code>' },
  { keys: ['left join'], answer: 'LEFT JOIN lấy TẤT CẢ hàng từ bảng trái, kết hợp với hàng khớp bảng phải. Không khớp thì NULL:\n\n<code>SELECT * FROM KhachHang KH\nLEFT JOIN DonHang DH\nON KH.MaKH = DH.MaKH;</code>' },
  { keys: ['group by','nhóm'], answer: 'GROUP BY nhóm các hàng có cùng giá trị:\n\n<code>SELECT Lop, COUNT(*) AS SoSV\nFROM SinhVien\nGROUP BY Lop;</code>\n\nThường dùng với hàm tổng hợp: COUNT, SUM, AVG, MIN, MAX' },
  { keys: ['order by','sắp xếp'], answer: 'ORDER BY sắp xếp kết quả:\n\n<code>SELECT * FROM SinhVien ORDER BY DiemTB DESC;</code>\n\nASC = tăng dần (mặc định), DESC = giảm dần' },
  { keys: ['insert','thêm','chèn'], answer: 'INSERT thêm dữ liệu mới:\n\n<code>INSERT INTO TenBang (Cot1, Cot2)\nVALUES (GiaTri1, GiaTri2);</code>' },
  { keys: ['update','cập nhật','sửa'], answer: 'UPDATE cập nhật dữ liệu:\n\n<code>UPDATE TenBang\nSET Cot1 = GiaTri1\nWHERE DieuKien;</code>\n\n⚠️ Luôn dùng WHERE để tránh cập nhật toàn bộ bảng!' },
  { keys: ['delete','xóa'], answer: 'DELETE xóa dữ liệu:\n\n<code>DELETE FROM TenBang WHERE DieuKien;</code>\n\n⚠️ Luôn dùng WHERE! Không có WHERE sẽ xóa TOÀN BỘ dữ liệu.' },
  { keys: ['create table','tạo bảng'], answer: 'CREATE TABLE tạo bảng mới:\n\n<code>CREATE TABLE TenBang (\n  ID INTEGER PRIMARY KEY,\n  Ten TEXT NOT NULL,\n  Tuoi INTEGER\n);</code>' },
  { keys: ['primary key','khóa chính'], answer: 'PRIMARY KEY xác định duy nhất mỗi hàng. Đặc điểm: giá trị duy nhất, không NULL, mỗi bảng chỉ có 1.\n\n<code>MaSV INTEGER PRIMARY KEY AUTOINCREMENT</code>' },
  { keys: ['foreign key','khóa ngoại'], answer: 'FOREIGN KEY liên kết 2 bảng, đảm bảo tính toàn vẹn tham chiếu:\n\n<code>FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)</code>' },
  { keys: ['count','đếm'], answer: '<code>COUNT(*)</code> đếm tất cả hàng\n<code>COUNT(Cot)</code> đếm hàng không NULL\n<code>COUNT(DISTINCT Cot)</code> đếm giá trị duy nhất' },
  { keys: ['sum','tổng'], answer: '<code>SUM(Cot)</code> tính tổng giá trị:\n\n<code>SELECT SUM(TongTien) FROM DonHang;</code>' },
  { keys: ['avg','trung bình'], answer: '<code>AVG(Cot)</code> tính trung bình:\n\n<code>SELECT AVG(DiemTB) FROM SinhVien;</code>' },
  { keys: ['like','tìm kiếm','mẫu'], answer: 'LIKE tìm kiếm theo mẫu:\n\n<code>%</code> = nhiều ký tự bất kỳ\n<code>_</code> = 1 ký tự bất kỳ\n\nVí dụ: <code>WHERE HoTen LIKE \'Nguyễn%\'</code>' },
  { keys: ['subquery','truy vấn con'], answer: 'Subquery là SELECT nằm trong SQL khác:\n\n<code>SELECT * FROM SinhVien\nWHERE DiemTB > (SELECT AVG(DiemTB) FROM SinhVien);</code>' },
  { keys: ['index','chỉ mục'], answer: 'INDEX giúp tìm dữ liệu nhanh hơn:\n\n<code>CREATE INDEX idx_ten ON SinhVien(HoTen);</code>\n\nDùng cho cột hay query. Tránh dùng cho bảng nhỏ hoặc cột hay UPDATE.' },
  { keys: ['view','bảng ảo'], answer: 'VIEW là câu SELECT lưu dạng bảng ảo:\n\n<code>CREATE VIEW SVGioi AS\nSELECT * FROM SinhVien WHERE DiemTB >= 8;</code>\n\nSau đó: <code>SELECT * FROM SVGioi;</code>' },
  { keys: ['transaction','giao dịch'], answer: 'Transaction nhóm SQL thành 1 đơn vị:\n\n<code>BEGIN TRANSACTION;\nUPDATE ... ;\nUPDATE ... ;\nCOMMIT;</code>\n\nHoặc ROLLBACK; để hủy. Đảm bảo tính ACID.' },
  { keys: ['acid'], answer: 'ACID là 4 tính chất của Transaction:\n\n• Atomicity - Tất cả hoặc không gì cả\n• Consistency - Luôn nhất quán\n• Isolation - Không ảnh hưởng lẫn nhau\n• Durability - Dữ liệu bền vững sau commit' },
  { keys: ['cte','with'], answer: 'CTE (Common Table Expression) giúp code dễ đọc:\n\n<code>WITH TenCTE AS (\n  SELECT ... FROM ...\n)\nSELECT * FROM TenCTE;</code>' },
  { keys: ['window','rank','row_number'], answer: 'Window Functions tính toán trên "cửa sổ" hàng:\n\n<code>SELECT HoTen,\n  RANK() OVER (ORDER BY DiemTB DESC) AS Hang\nFROM SinhVien;</code>\n\nCác hàm: ROW_NUMBER, RANK, DENSE_RANK, SUM OVER, AVG OVER' },
  { keys: ['normalize','chuẩn hóa','1nf','2nf','3nf'], answer: 'Chuẩn hóa giảm dư thừa dữ liệu:\n\n1NF: Mỗi ô 1 giá trị\n2NF: Mọi cột phụ thuộc toàn bộ khóa chính\n3NF: Không phụ thuộc bắc cầu\n\nQuy tắc: "Mỗi cột phụ thuộc vào khóa, toàn bộ khóa, và chỉ khóa."' },
  { keys: ['distinct','duy nhất','không trùng'], answer: 'DISTINCT loại bỏ giá trị trùng lặp:\n\n<code>SELECT DISTINCT Lop FROM SinhVien;</code>\n<code>SELECT COUNT(DISTINCT Lop) FROM SinhVien;</code>' },
  { keys: ['limit','giới hạn'], answer: 'LIMIT giới hạn số hàng trả về:\n\n<code>SELECT * FROM SinhVien LIMIT 5;</code>\n<code>SELECT * FROM SinhVien LIMIT 5 OFFSET 10;</code> (bỏ qua 10 hàng đầu)' },
  { keys: ['trigger'], answer: 'Trigger tự động chạy khi có sự kiện trên bảng:\n\n<code>CREATE TRIGGER ten_trigger\nAFTER INSERT ON TenBang\nBEGIN\n  -- code tự động\nEND;</code>' },
  { keys: ['having'], answer: 'HAVING lọc SAU khi GROUP BY (WHERE lọc TRƯỚC):\n\n<code>SELECT Lop, AVG(DiemTB)\nFROM SinhVien\nGROUP BY Lop\nHAVING AVG(DiemTB) > 8;</code>' },
  { keys: ['null'], answer: 'NULL = không có giá trị (khác 0 hay chuỗi rỗng).\n\nKiểm tra: <code>WHERE Cot IS NULL</code> hoặc <code>IS NOT NULL</code>\nXử lý: <code>COALESCE(Cot, GiaTriMacDinh)</code>' },
  { keys: ['xin chào','hello','hi','chào'], answer: 'Xin chào! 👋 Mình là SQL Bot, sẵn sàng hỗ trợ bạn học SQL. Bạn có thể hỏi về bất kỳ chủ đề SQL nào, ví dụ:\n\n• SELECT dùng như thế nào?\n• JOIN là gì?\n• Cách tạo bảng?' },
  { keys: ['cảm ơn','thank','cám ơn'], answer: 'Không có gì! 😊 Nếu có thắc mắc gì về SQL, cứ hỏi mình nhé!' },
  { keys: ['bảng','table','database'], answer: 'Database mẫu có 5 bảng:\n\n• <code>SinhVien</code> - Thông tin sinh viên\n• <code>SanPham</code> - Sản phẩm\n• <code>KhachHang</code> - Khách hàng\n• <code>DonHang</code> - Đơn hàng\n• <code>NhanVien</code> - Nhân viên\n\nThử: <code>SELECT * FROM SinhVien;</code>' },
];

const FALLBACK_ANSWERS = [
  'Mình chưa hiểu rõ câu hỏi. Bạn có thể hỏi cụ thể hơn về SQL hoặc bài tập đang làm không? Ví dụ: "gợi ý bài này", "cho code bài này", "SELECT dùng thế nào?", "JOIN là gì?".',
  'Bạn có thể hỏi theo 3 kiểu: giải thích kiến thức, gợi ý bài tập, hoặc xin đáp án mẫu. Ví dụ: "gợi ý bài này từng bước" hoặc "cho code SQL bài này".',
  'Mình chuyên hỗ trợ SQL. Nếu đang bí bài tập, hãy mở bài đó rồi hỏi: "phân tích đề", "gợi ý", "sai ở đâu", hoặc "cho code mẫu".',
];

function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPlainText(text) {
  return escapeHTML(text).replace(/\n/g, '<br>');
}

function stripHTML(value) {
  const div = document.createElement('div');
  div.innerHTML = String(value || '');
  return div.textContent || div.innerText || '';
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function findKBAnswer(question) {
  const q = question.toLowerCase().trim();
  let best = null, bestScore = 0;
  for (const item of CHATBOT_KB) {
    for (const key of item.keys) {
      if (q.includes(key)) {
        const score = key.length;
        if (score > bestScore) { bestScore = score; best = item; }
      }
    }
  }
  return best ? best.answer : null;
}

function findAnswer(question) {
  return findDetailedTopicAnswer(question) || findKBAnswer(question) || FALLBACK_ANSWERS[Math.floor(Math.random() * FALLBACK_ANSWERS.length)];
}

function findDetailedTopicAnswer(question) {
  const q = normalizeText(question);
  if (q.includes('select')) {
    return `<strong>SELECT dùng để lấy dữ liệu.</strong><br>
    Cách nghĩ: chọn cột cần hiển thị, chọn bảng nguồn, rồi thêm điều kiện/sắp xếp nếu cần.<br><br>
    <code>SELECT HoTen, Lop, DiemTB<br>FROM SinhVien<br>WHERE DiemTB &gt;= 8<br>ORDER BY DiemTB DESC;</code><br><br>
    Khi làm bài, hãy kiểm tra đề yêu cầu đúng tên cột alias không. Nếu đề nói "hiển thị HoTen và DiemTB" thì đừng dùng <code>SELECT *</code>.`;
  }
  if (q.includes('where') || q.includes('loc') || q.includes('dieu kien')) {
    return `<strong>WHERE dùng để lọc từng dòng trước khi trả kết quả.</strong><br>
    Mẫu tư duy: <code>WHERE cot operator gia_tri</code>.<br><br>
    <code>SELECT * FROM SinhVien<br>WHERE Lop = 'CNTT01' AND DiemTB &gt; 8;</code><br><br>
    Lỗi hay gặp: text phải có dấu nháy, NULL phải dùng <code>IS NULL</code>, điều kiện có <code>AND/OR</code> nên dùng ngoặc nếu dài.`;
  }
  if (q.includes('join')) {
    return `<strong>JOIN dùng để ghép dữ liệu từ nhiều bảng.</strong><br>
    Bước làm: xác định bảng chính, tìm khóa liên kết, viết điều kiện <code>ON</code>, rồi chọn cột cần hiển thị.<br><br>
    <code>SELECT DH.MaDH, KH.HoTen, DH.TongTien<br>FROM DonHang DH<br>JOIN KhachHang KH ON DH.MaKH = KH.MaKH;</code><br><br>
    Nếu cần giữ cả dòng không có dữ liệu liên quan, dùng <code>LEFT JOIN</code>. Nếu chỉ lấy dòng khớp hai bên, dùng <code>INNER JOIN</code>.`;
  }
  if (q.includes('group by') || q.includes('having') || q.includes('thong ke') || q.includes('tong hop')) {
    return `<strong>GROUP BY dùng để gom dòng thành nhóm và tính thống kê.</strong><br>
    Các cột không nằm trong hàm tổng hợp thường phải nằm trong <code>GROUP BY</code>.<br><br>
    <code>SELECT Lop, COUNT(*) AS SoSV, AVG(DiemTB) AS DiemTB<br>FROM SinhVien<br>GROUP BY Lop<br>HAVING AVG(DiemTB) &gt; 8;</code><br><br>
    <code>WHERE</code> lọc dòng trước khi nhóm. <code>HAVING</code> lọc nhóm sau khi đã tính COUNT/SUM/AVG.`;
  }
  if (q.includes('subquery') || q.includes('truy van con')) {
    return `<strong>Subquery là SELECT nằm trong câu SQL khác.</strong><br>
    Dùng khi điều kiện phụ thuộc vào một kết quả tính ra từ database.<br><br>
    <code>SELECT HoTen, DiemTB<br>FROM SinhVien<br>WHERE DiemTB &gt; (SELECT AVG(DiemTB) FROM SinhVien);</code><br><br>
    Nếu subquery trả một giá trị thì dùng <code>=</code>, <code>&gt;</code>, <code>&lt;</code>. Nếu trả nhiều dòng một cột thì dùng <code>IN</code>.`;
  }
  if (q.includes('create table') || q.includes('tao bang')) {
    return `<strong>CREATE TABLE dùng để tạo bảng mới.</strong><br>
    Hãy xác định tên bảng, danh sách cột, kiểu dữ liệu và ràng buộc.<br><br>
    <code>CREATE TABLE HocVien (<br>&nbsp;&nbsp;MaHV INTEGER PRIMARY KEY,<br>&nbsp;&nbsp;HoTen TEXT NOT NULL,<br>&nbsp;&nbsp;Diem REAL CHECK(Diem BETWEEN 0 AND 10)<br>);</code>`;
  }
  return null;
}

function isExerciseHelpQuestion(question) {
  const q = normalizeText(question);
  return /\b(bai tap|bai nay|giai bai|goi y|hint|loi giai|dap an|code|lam sao|lam bai|bi sai|sai o dau|kho qua|chua dung)\b/.test(q);
}

function wantsExerciseSolution(question) {
  const q = normalizeText(question);
  return /\b(code|loi giai|dap an|viet sql|cho cau lenh|cho minh cau lenh|lam mau|giai luon)\b/.test(q);
}

function wantsExerciseDebug(question) {
  const q = normalizeText(question);
  return /\b(sai|loi|khong dung|chua dung|debug|fix|sua)\b/.test(q);
}

function getCurrentExerciseContext() {
  const section = document.querySelector('.exercises-section[data-lesson-id]');
  const card = section?.querySelector('.exercise-card');
  if (!section || !card || typeof EXERCISES === 'undefined') return null;

  const lessonId = section.dataset.lessonId;
  const exerciseId = card.id?.replace(/^ex-card-/, '');
  const exercise = (EXERCISES[lessonId] || []).find(item => item.id === exerciseId);
  if (!exercise) return null;

  const dialect = typeof getSelectedDialect === 'function' ? getSelectedDialect() : 'sqlite';
  const expectedSQL = typeof getExerciseExpectedSQL === 'function' ? getExerciseExpectedSQL(exercise, dialect) : '';
  const sampleSQL = typeof getExerciseSampleSQL === 'function' ? getExerciseSampleSQL(exercise, dialect) : expectedSQL;
  const editor = document.getElementById(`editor-${exercise.id}`);
  const feedback = document.getElementById(`feedback-${exercise.id}`);
  const result = document.getElementById(`result-${exercise.id}`);

  return {
    lessonId,
    exercise,
    dialect,
    expectedSQL,
    sampleSQL,
    userSQL: editor?.value?.trim() || '',
    feedbackText: feedback?.textContent?.trim() || '',
    resultText: result?.textContent?.trim() || ''
  };
}

function buildExercisePlan(exercise, expectedSQL) {
  const text = normalizeText(`${exercise.desc || ''} ${exercise.hint || ''} ${expectedSQL || ''}`);
  const steps = [];
  if (text.includes('join')) steps.push('Xác định các bảng cần ghép và điều kiện <code>ON</code> giữa khóa chính/khóa ngoại.');
  if (text.includes('left join')) steps.push('Dùng <code>LEFT JOIN</code> nếu đề yêu cầu giữ cả dòng chưa có dữ liệu liên quan.');
  if (text.includes('where')) steps.push('Viết <code>WHERE</code> để lọc đúng dòng trước khi hiển thị kết quả.');
  if (text.includes('group by') || text.includes('count') || text.includes('sum') || text.includes('avg')) steps.push('Nếu đề yêu cầu đếm/tổng/trung bình, dùng hàm tổng hợp và <code>GROUP BY</code> theo cột phân nhóm.');
  if (text.includes('having')) steps.push('Dùng <code>HAVING</code> để lọc sau khi đã nhóm và tính tổng hợp.');
  if (text.includes('order by')) steps.push('Dùng <code>ORDER BY</code> để sắp xếp đúng thứ tự đề yêu cầu.');
  if (text.includes('limit') || text.includes('offset')) steps.push('Dùng <code>LIMIT/OFFSET</code> để lấy đúng số dòng hoặc trang kết quả.');
  if (text.includes('subquery') || text.includes('select avg') || text.includes('select max') || text.includes('select min')) steps.push('Nếu cần so sánh với giá trị tính từ bảng, đặt một <code>SELECT</code> con trong <code>WHERE</code> hoặc <code>FROM</code>.');
  if (text.includes('case')) steps.push('Dùng <code>CASE WHEN ... THEN ... ELSE ... END</code> để tạo cột phân loại.');
  if (text.includes('create table')) steps.push('Với bài tạo bảng, viết đủ tên cột, kiểu dữ liệu và ràng buộc như <code>PRIMARY KEY</code>, <code>NOT NULL</code>, <code>CHECK</code>.');
  if (text.includes('insert')) steps.push('Nếu bài cần thêm dữ liệu, dùng <code>INSERT INTO</code> trước rồi <code>SELECT</code> để kiểm tra kết quả cuối.');
  if (text.includes('update')) steps.push('Nếu bài cần cập nhật, dùng <code>UPDATE ... SET ... WHERE ...</code>; luôn kiểm tra điều kiện <code>WHERE</code>.');
  if (text.includes('delete')) steps.push('Nếu bài cần xóa, dùng <code>DELETE FROM ... WHERE ...</code> rồi chạy câu <code>SELECT</code> kiểm chứng.');
  if (!steps.length) {
    steps.push('Đọc kỹ đề để xác định bảng nguồn.');
    steps.push('Chọn đúng cột cần hiển thị và đặt alias đúng tên đề yêu cầu.');
    steps.push('Thêm điều kiện lọc, nhóm hoặc sắp xếp nếu đề có nhắc đến.');
  }
  return steps.slice(0, 5);
}

function renderCurrentExerciseHelp(question) {
  const ctx = getCurrentExerciseContext();
  if (!ctx) {
    return `<strong>Chưa thấy bài tập đang mở.</strong><br>
    Bạn hãy mở một bài học có phần <strong>Bài Tập Thực Hành</strong>, rồi hỏi mình: "gợi ý bài này", "phân tích đề", "sai ở đâu", hoặc "cho code bài này".`;
  }

  const { exercise, dialect, expectedSQL, sampleSQL, userSQL, feedbackText } = ctx;
  const solutionSQL = expectedSQL || sampleSQL || exercise.hint || '';
  const steps = buildExercisePlan(exercise, solutionSQL);
  const showSolution = wantsExerciseSolution(question);
  const showDebug = wantsExerciseDebug(question);

  let html = `<strong>Đang hỗ trợ bài:</strong> ${escapeHTML(exercise.title)}<br>
  <strong>Đề:</strong> ${escapeHTML(stripHTML(exercise.desc))}<br><br>
  <strong>Cách nghĩ:</strong><ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol>
  <strong>Gợi ý chính:</strong> ${exercise.hint || 'Hãy bắt đầu từ bảng/cột đề yêu cầu, sau đó thêm điều kiện từng bước.'}`;

  if (showDebug) {
    html += `<br><br><strong>Kiểm tra bài của bạn:</strong>`;
    if (userSQL) {
      html += `<br>SQL hiện tại:<br><code>${escapeHTML(userSQL)}</code>`;
    } else {
      html += `<br>Bạn chưa nhập SQL trong editor của bài này. Hãy viết thử một câu rồi hỏi "sai ở đâu".`;
    }
    if (feedbackText) html += `<br><br>Phản hồi hiện tại: ${escapeHTML(feedbackText)}`;
    html += `<br><br>Checklist sửa lỗi: đúng tên cột alias, đúng số dòng, đúng điều kiện lọc, và nếu có <code>GROUP BY</code> thì cột không tổng hợp phải nằm trong nhóm.`;
  }

  if (showSolution) {
    html += solutionSQL
      ? `<br><br><strong>Code mẫu (${escapeHTML(dialect)}):</strong><br><code>${escapeHTML(solutionSQL)}</code><br><br>Bạn có thể dán vào editor, bấm <strong>Chạy thử</strong>, rồi so sánh Expected Output với Your Output.`
      : `<br><br><strong>Chưa có đáp án mẫu tự động cho bài này.</strong><br>Dựa theo gợi ý, hãy viết SQL rồi gửi mình nội dung bạn đã viết để mình soi lỗi.`;
  } else {
    html += `<br><br>Nếu vẫn bí, hỏi <strong>"cho code bài này"</strong>, mình sẽ đưa câu SQL mẫu để bạn so sánh.`;
  }

  return html;
}

// TODO: Điền Gemini API Key của bạn vào đây (Lấy tại https://aistudio.google.com/)
// BẢO MẬT: Hãy vào Google Cloud Console -> API & Services -> Credentials
// -> Edit API Key -> Restrict key (HTTP referrers) -> Thêm domain Vercel của bạn vào (VD: *sql-master.vercel.app/*)
// Nếu để trống, bot sẽ dùng luật cứng mặc định.
const GEMINI_API_KEY = 'AIzaSyCyUrIvMswPNFjuxyYrg1Q9uCXx59gyfkg';

function initChatbot() {
  const toggle = document.getElementById('chatbot-toggle');
  const container = document.getElementById('chatbot-container');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const clearBtn = document.getElementById('chatbot-clear');
  const msgArea = document.getElementById('chatbot-messages');
  const suggestions = document.getElementById('chatbot-suggestions');
  let chatHistory = [];

  // Welcome message
  addBotMessage('Xin chào! 👋 Mình là <strong>SQL Bot</strong>. Mình có thể giải thích SQL, gợi ý bài tập đang mở, soi lỗi câu SQL của bạn và đưa code mẫu khi bạn hỏi "cho code bài này".');

  toggle.addEventListener('click', () => {
    container.classList.toggle('open');
    if (container.classList.contains('open')) input.focus();
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    
    // Lưu lịch sử (định dạng cho Gemini)
    chatHistory.push({ role: 'user', parts: [{ text }] });
    
    input.value = '';
    // Show typing
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot';
    typingEl.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
    msgArea.appendChild(typingEl);
    msgArea.scrollTop = msgArea.scrollHeight;

    try {
      let answerHTML;

      if (!GEMINI_API_KEY) {
        // Fallback: Dùng luật cứng mặc định
        await new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 450));
        answerHTML = isExerciseHelpQuestion(text) ? renderCurrentExerciseHelp(text) : findAnswer(text);
      } else {
        // Gọi Gemini API
        const modelSelect = document.getElementById('chatbot-model');
        const model = modelSelect ? modelSelect.value : 'gemini-1.5-flash';
        
        let systemPrompt = "Bạn là SQL Bot, một chuyên gia dạy SQL thân thiện bằng tiếng Việt. Nhiệm vụ của bạn là hướng dẫn học viên hiểu bài và sửa lỗi code. Tuyệt đối KHÔNG đưa đáp án/code mẫu ngay lập tức trừ khi học viên chủ động xin (ví dụ: 'cho code', 'đáp án là gì'). Thay vào đó, hãy phân tích lỗi hoặc đưa ra gợi ý từng bước. Hãy dùng markdown để format (dùng `code` cho tên cột/bảng, ```sql cho code block). Format câu trả lời ngắn gọn, dễ đọc.";
        
        const ctx = getCurrentExerciseContext();
        if (ctx) {
          systemPrompt += `\n\nBối cảnh bài tập hiện tại:\n- Tiêu đề: ${ctx.exercise.title}\n- Đề bài: ${ctx.exercise.desc}\n- Dialect: ${ctx.dialect}`;
          if (ctx.expectedSQL) systemPrompt += `\n- Đáp án mong đợi (để đối chiếu, không nói cho học viên): ${ctx.expectedSQL}`;
          if (ctx.userSQL) systemPrompt += `\n- Code học viên đang viết: ${ctx.userSQL}`;
          if (ctx.feedbackText) systemPrompt += `\n- Lỗi hệ thống báo: ${ctx.feedbackText}`;
        }

        const payload = {
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: chatHistory,
          generationConfig: { temperature: 0.3 }
        };

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || 'Lỗi kết nối Gemini API');
        }

        const data = await res.json();
        const geminiText = data.candidates[0].content.parts[0].text;
        
        // Convert Markdown to HTML (đơn giản)
        answerHTML = geminiText
          .replace(/```sql\n([\s\S]*?)```/g, '<br><code>$1</code><br>')
          .replace(/```([\s\S]*?)```/g, '<br><code>$1</code><br>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>');
          
        // Lưu lịch sử bot
        chatHistory.push({ role: 'model', parts: [{ text: geminiText }] });
      }

      typingEl.remove();
      addBotMessage(answerHTML);
      
      // Nếu là fallback (không có API Key) thì lưu format cũ cho fallback
      if (!GEMINI_API_KEY) {
        chatHistory.pop(); // Remove user format for Gemini
        chatHistory.push({ role: 'user', text });
        chatHistory.push({ role: 'model', text: answerHTML.replace(/<[^>]*>/g, '') });
      }
      
    } catch (error) {
      typingEl.remove();
      console.error(error);
      addBotMessage(`<strong>Bot gặp lỗi.</strong><br>${formatPlainText(error.message)}<br><br>Vui lòng kiểm tra lại API Key hoặc thử lại sau.`);
      chatHistory.pop(); // Remove failed user message
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  clearBtn.addEventListener('click', () => {
    msgArea.innerHTML = '';
    chatHistory = [];
    addBotMessage('Chat đã được xóa. Hỏi mình bất cứ điều gì về SQL nhé! 😊');
  });

  suggestions.addEventListener('click', e => {
    const chip = e.target.closest('.suggestion-chip');
    if (chip) { input.value = chip.dataset.q; sendMessage(); }
  });

  function addBotMessage(html) {
    const el = document.createElement('div');
    el.className = 'chat-msg bot';
    el.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble">${html}</div>`;
    msgArea.appendChild(el);
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'chat-msg user';
    el.innerHTML = `<div class="msg-avatar">👤</div><div class="msg-bubble">${escapeHTML(text)}</div>`;
    msgArea.appendChild(el);
    msgArea.scrollTop = msgArea.scrollHeight;
  }
}
