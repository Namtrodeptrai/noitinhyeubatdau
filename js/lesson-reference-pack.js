// Additional applied-learning sections appended after the base lesson and deep-dive content.
(function addLessonReferencePack() {
  if (typeof LESSON_CONTENT === 'undefined') return;

  const PACKS = {
    'what-is-sql': {
      focus: 'SQL là ngôn ngữ chuẩn để hỏi, sửa và quản trị dữ liệu trong database quan hệ.',
      realWorld: 'Một trang thương mại điện tử dùng SQL để tìm sản phẩm, tạo đơn hàng, cập nhật tồn kho và thống kê doanh thu.',
      remember: [
        'SQL mô tả kết quả bạn muốn, database engine quyết định cách lấy kết quả đó.',
        'Một câu SQL tốt bắt đầu từ câu hỏi dữ liệu rõ ràng.',
        'Các hệ quản trị có cú pháp khác nhau, nhưng tư duy bảng, dòng, cột và quan hệ là giống nhau.'
      ],
      mistakes: [
        'Học thuộc cú pháp rời rạc mà không hiểu dữ liệu đang nằm ở bảng nào.',
        'Viết truy vấn quá rộng, lấy nhiều cột hoặc nhiều dòng hơn nhu cầu thật.'
      ],
      lab: 'Mở editor và chạy 3 câu: <code>SELECT 1 + 1;</code>, <code>SELECT COUNT(*) FROM SinhVien;</code>, <code>SELECT DISTINCT Lop FROM SinhVien;</code>. Sau đó tự nói mỗi câu trả lời câu hỏi gì.'
    },
    'db-tables': {
      focus: 'Database tổ chức dữ liệu thành bảng; thiết kế bảng tốt giúp truy vấn dễ, dữ liệu ít lỗi.',
      realWorld: 'Hệ thống bán hàng thường tách <code>KhachHang</code>, <code>DonHang</code>, <code>SanPham</code> thay vì nhét mọi thứ vào một bảng.',
      remember: [
        'Mỗi bảng nên mô tả một thực thể hoặc sự kiện chính.',
        'Mỗi dòng là một bản ghi, mỗi cột là một thuộc tính có ý nghĩa ổn định.',
        'Khóa chính giúp phân biệt chính xác từng dòng.'
      ],
      mistakes: [
        'Đặt tên cột quá ngắn hoặc không thống nhất.',
        'Lưu danh sách nhiều giá trị vào một ô, ví dụ một cột chứa nhiều số điện thoại.'
      ],
      lab: 'Vẽ nhanh bảng <code>KhoaHoc</code> gồm 5 cột: mã khóa học, tên, giá, ngày tạo, trạng thái. Tự quyết định cột nào nên là khóa chính.'
    },
    'data-types': {
      focus: 'Kiểu dữ liệu quyết định database lưu, so sánh và kiểm tra giá trị như thế nào.',
      realWorld: 'Nếu giá tiền lưu bằng chuỗi, việc sắp xếp có thể sai: <code>100</code> có thể đứng trước <code>20</code> theo thứ tự chữ.',
      remember: [
        'Số dùng để tính toán nên lưu dạng số, không lưu dạng text.',
        'Ngày tháng nên lưu theo định dạng ổn định, dễ so sánh.',
        '<code>NULL</code> nghĩa là chưa có hoặc không biết giá trị, không phải số 0.'
      ],
      mistakes: [
        'Dùng một kiểu text cho mọi cột vì thấy dễ nhập.',
        'So sánh <code>NULL</code> bằng dấu <code>=</code> thay vì <code>IS NULL</code>.'
      ],
      lab: 'Chạy <code>SELECT typeof(100), typeof(100.5), typeof(&#39;100&#39;);</code> rồi giải thích vì sao kết quả khác nhau.'
    },
    crud: {
      focus: 'CRUD là vòng đời thao tác dữ liệu: tạo, đọc, sửa, xóa.',
      realWorld: 'Tạo tài khoản là INSERT, xem hồ sơ là SELECT, đổi ảnh đại diện là UPDATE, xóa địa chỉ giao hàng là DELETE.',
      remember: [
        'Luôn kiểm tra dữ liệu bằng SELECT trước khi UPDATE hoặc DELETE.',
        'Ghi rõ danh sách cột khi INSERT để tránh sai thứ tự.',
        'Với thao tác quan trọng, nên dùng transaction để có thể rollback.'
      ],
      mistakes: [
        'Quên <code>WHERE</code> trong UPDATE hoặc DELETE.',
        'UPDATE bằng điều kiện không đủ hẹp, làm ảnh hưởng nhiều dòng ngoài ý muốn.'
      ],
      lab: 'Viết quy trình 3 bước: SELECT kiểm tra sinh viên MaSV = 1, UPDATE điểm, SELECT kiểm tra lại.'
    },
    select: {
      focus: 'SELECT là cách đặt câu hỏi với dữ liệu, từ câu hỏi đơn giản đến báo cáo phức tạp.',
      realWorld: 'Một dashboard lớp học dùng SELECT để lấy danh sách học viên, điểm trung bình, top học viên và số học viên theo lớp.',
      remember: [
        'Chỉ chọn cột thật sự cần dùng.',
        'Alias giúp kết quả dễ đọc hơn cho người dùng hoặc API.',
        'Biểu thức trong SELECT có thể tính toán thêm cột mới từ dữ liệu gốc.'
      ],
      mistakes: [
        'Lạm dụng <code>SELECT *</code> trong code production.',
        'Đặt alias có dấu cách nhưng quên quote đúng theo từng hệ quản trị.'
      ],
      lab: 'Viết một SELECT chỉ lấy <code>HoTen</code>, <code>Lop</code>, <code>DiemTB</code> và thêm cột <code>TrangThai</code> bằng CASE.'
    },
    where: {
      focus: 'WHERE lọc từng dòng trước khi dữ liệu đi sang các bước nhóm, sắp xếp hoặc hiển thị.',
      realWorld: 'Trang tìm kiếm sản phẩm dùng WHERE cho danh mục, khoảng giá, từ khóa, trạng thái còn hàng.',
      remember: [
        'Dùng ngoặc khi trộn AND và OR.',
        'Dùng <code>IN</code> khi một cột có thể thuộc nhiều giá trị.',
        'Dùng <code>LIKE</code> cho tìm kiếm mẫu, nhưng cần hiểu wildcard.'
      ],
      mistakes: [
        'Viết điều kiện text thiếu dấu nháy.',
        'Dùng <code>OR</code> quá rộng khiến kết quả vượt nhu cầu.'
      ],
      lab: 'Lọc sinh viên lớp CNTT01 hoặc CNTT02, điểm từ 8 trở lên, rồi sắp xếp điểm giảm dần.'
    },
    'orderby-groupby': {
      focus: 'ORDER BY thay đổi thứ tự hiển thị; GROUP BY biến nhiều dòng thành thống kê theo nhóm.',
      realWorld: 'Báo cáo doanh thu theo tháng cần GROUP BY tháng, còn bảng xếp hạng cần ORDER BY doanh thu giảm dần.',
      remember: [
        'Top N nên luôn có ORDER BY để kết quả có nghĩa.',
        'WHERE lọc dòng trước khi GROUP BY, HAVING lọc nhóm sau khi tổng hợp.',
        'Cột không aggregate trong SELECT thường phải nằm trong GROUP BY.'
      ],
      mistakes: [
        'Dùng HAVING cho điều kiện có thể lọc bằng WHERE.',
        'Chọn thêm cột chi tiết trong truy vấn GROUP BY làm kết quả không hợp lệ ở nhiều DBMS.'
      ],
      lab: 'Tính số sinh viên và điểm trung bình theo lớp, chỉ giữ lớp có từ 2 sinh viên trở lên.'
    },
    'limit-distinct': {
      focus: 'LIMIT kiểm soát số dòng trả về; DISTINCT loại bớt giá trị trùng.',
      realWorld: 'API danh sách sản phẩm dùng LIMIT cho phân trang, còn bộ lọc danh mục dùng DISTINCT để lấy danh sách giá trị duy nhất.',
      remember: [
        'LIMIT không đảm bảo "đầu tiên" nếu thiếu ORDER BY.',
        'DISTINCT xét toàn bộ tổ hợp cột trong SELECT.',
        'OFFSET lớn có thể chậm với bảng nhiều dữ liệu.'
      ],
      mistakes: [
        'Dùng DISTINCT để che lỗi join sai.',
        'Phân trang nhưng không có ORDER BY ổn định.'
      ],
      lab: 'Lấy top 5 sản phẩm giá cao nhất và danh sách danh mục sản phẩm không trùng.'
    },
    aggregate: {
      focus: 'Hàm tổng hợp giúp biến dữ liệu chi tiết thành số liệu quyết định.',
      realWorld: 'Bảng KPI cần COUNT đơn hàng, SUM doanh thu, AVG giá trị đơn, MIN/MAX ngày đặt.',
      remember: [
        '<code>COUNT(*)</code> đếm dòng, <code>COUNT(cột)</code> bỏ qua NULL.',
        'Aggregate thường đi cùng GROUP BY khi cần thống kê theo nhóm.',
        'Alias giúp số liệu dễ đọc và dễ dùng ở giao diện.'
      ],
      mistakes: [
        'Tính AVG trên dữ liệu đã bị nhân dòng do join sai.',
        'Quên xử lý NULL trước khi tính toán.'
      ],
      lab: 'Thống kê mỗi danh mục sản phẩm: số sản phẩm, giá thấp nhất, giá cao nhất, giá trung bình.'
    },
    'string-funcs': {
      focus: 'Hàm chuỗi giúp làm sạch, chuẩn hóa và trình bày dữ liệu text.',
      realWorld: 'Trước khi so khớp email, hệ thống thường trim khoảng trắng và chuyển về chữ thường.',
      remember: [
        'Chuẩn hóa text giúp tìm kiếm ổn định hơn.',
        'Hàm nối chuỗi khác nhau giữa SQLite, MySQL và SQL Server.',
        'Không nên xử lý mọi định dạng phức tạp bằng SQL nếu backend làm rõ hơn.'
      ],
      mistakes: [
        'Tìm kiếm phân biệt hoa thường ngoài ý muốn.',
        'Dùng hàm lên cột trong WHERE có thể làm index khó phát huy.'
      ],
      lab: 'Tạo cột hiển thị <code>HoTen - Lop</code> và cột tên viết hoa cho bảng SinhVien.'
    },
    'date-funcs': {
      focus: 'Hàm ngày tháng phục vụ lọc thời gian, nhóm theo kỳ và tính khoảng cách ngày.',
      realWorld: 'Báo cáo doanh thu theo tháng, đơn hàng 7 ngày gần nhất, số ngày xử lý đều cần hàm ngày tháng.',
      remember: [
        'Lưu ngày theo định dạng ổn định trước khi nghĩ đến báo cáo.',
        'Lọc khoảng thời gian nên dùng cận bắt đầu và cận kết thúc rõ ràng.',
        'Cú pháp ngày tháng khác nhau mạnh giữa các DBMS.'
      ],
      mistakes: [
        'So sánh ngày dưới dạng text không chuẩn.',
        'Lọc theo tháng bằng LIKE khi dữ liệu có cả giờ và timezone phức tạp.'
      ],
      lab: 'Nhóm đơn hàng theo tháng và tính số đơn, tổng tiền cho từng tháng.'
    },
    'inner-join': {
      focus: 'INNER JOIN chỉ trả dòng có liên kết khớp ở cả hai bảng.',
      realWorld: 'Danh sách đơn hàng kèm tên khách hàng cần join DonHang với KhachHang qua MaKH.',
      remember: [
        'Join condition thường nối khóa ngoại với khóa chính.',
        'Alias giúp truy vấn join dễ đọc hơn.',
        'Kiểm tra số dòng sau join để phát hiện nhân bản dữ liệu.'
      ],
      mistakes: [
        'Quên ON, tạo tích Descartes rất lớn.',
        'Join bằng tên thay vì mã định danh.'
      ],
      lab: 'Hiển thị MaDH, HoTen khách hàng, NgayDat, TongTien từ DonHang và KhachHang.'
    },
    'left-right-join': {
      focus: 'LEFT JOIN giữ tất cả dòng bên trái kể cả khi bên phải không có dữ liệu khớp.',
      realWorld: 'Muốn tìm khách chưa mua hàng, hãy lấy KhachHang LEFT JOIN DonHang rồi tìm dòng có DonHang NULL.',
      remember: [
        'Cột bên phải sẽ NULL nếu không tìm thấy dòng khớp.',
        'Điều kiện trong WHERE trên bảng phải có thể làm mất tác dụng giữ dòng của LEFT JOIN.',
        'RIGHT JOIN thường có thể viết lại thành LEFT JOIN bằng cách đổi thứ tự bảng.'
      ],
      mistakes: [
        'Đặt điều kiện bảng phải ở WHERE làm kết quả giống INNER JOIN.',
        'Không hiểu NULL trong kết quả là do không có dòng khớp.'
      ],
      lab: 'Tìm khách hàng chưa có đơn hàng nào và hiển thị HoTen, Email.'
    },
    'full-self-join': {
      focus: 'FULL JOIN giữ dữ liệu không khớp ở cả hai phía; SELF JOIN dùng một bảng như hai vai trò khác nhau.',
      realWorld: 'SELF JOIN hữu ích cho nhân viên - quản lý, sản phẩm cùng danh mục, hoặc tìm cặp dữ liệu liên quan trong cùng bảng.',
      remember: [
        'Self join bắt buộc cần alias rõ ràng.',
        'FULL JOIN không được SQLite hỗ trợ trực tiếp theo cùng cách nhiều DBMS khác.',
        'Cần điều kiện tránh ghép một dòng với chính nó khi so sánh cặp.'
      ],
      mistakes: [
        'Quên điều kiện <code>A.ID &lt;&gt; B.ID</code> trong self join.',
        'Nhầm FULL JOIN với UNION thông thường.'
      ],
      lab: 'Tự mô tả một bảng NhanVien có MaQuanLy và viết ý tưởng join để lấy tên quản lý.'
    },
    'subquery-where': {
      focus: 'Subquery trong WHERE giúp điều kiện lọc phụ thuộc vào kết quả truy vấn khác.',
      realWorld: 'Tìm sinh viên có điểm cao hơn điểm trung bình toàn trường không nên nhập tay số trung bình.',
      remember: [
        'Subquery trả một giá trị dùng với =, &gt;, &lt;.',
        'Subquery trả nhiều giá trị thường dùng với IN.',
        'EXISTS phù hợp khi chỉ cần kiểm tra có dòng liên quan.'
      ],
      mistakes: [
        'Dùng = với subquery trả nhiều dòng.',
        'Không chạy thử subquery riêng trước khi ghép vào truy vấn lớn.'
      ],
      lab: 'Tìm sản phẩm có giá cao hơn giá trung bình của tất cả sản phẩm.'
    },
    'subquery-from-select': {
      focus: 'Subquery trong FROM tạo bảng trung gian; subquery trong SELECT tạo cột tham chiếu.',
      realWorld: 'Bạn có thể tính thống kê theo lớp trước, rồi lọc những lớp có điểm trung bình cao ở truy vấn ngoài.',
      remember: [
        'Subquery trong FROM nên có alias.',
        'Nếu logic dài nhiều bước, CTE thường dễ đọc hơn subquery lồng sâu.',
        'Subquery trong SELECT có thể tốn chi phí nếu chạy theo từng dòng.'
      ],
      mistakes: [
        'Quên đặt tên alias cho bảng con.',
        'Lồng quá nhiều cấp khiến truy vấn khó bảo trì.'
      ],
      lab: 'Tạo bảng con thống kê điểm trung bình theo lớp, sau đó lọc lớp có điểm trung bình từ 8 trở lên.'
    },
    correlated: {
      focus: 'Correlated subquery chạy dựa trên giá trị của từng dòng ở truy vấn ngoài.',
      realWorld: 'Tìm sinh viên cao hơn trung bình của chính lớp mình là bài toán điển hình.',
      remember: [
        'Nếu subquery tham chiếu alias bên ngoài, đó là correlated subquery.',
        'Có thể dễ hiểu hơn nhưng cần chú ý hiệu năng với bảng lớn.',
        'Nhiều bài toán correlated có thể viết lại bằng JOIN hoặc window function.'
      ],
      mistakes: [
        'Không phân biệt trung bình toàn trường và trung bình theo lớp.',
        'Dùng correlated subquery cho mọi việc dù có cách đơn giản hơn.'
      ],
      lab: 'Tìm sinh viên có DiemTB lớn hơn điểm trung bình của lớp mà sinh viên đó thuộc về.'
    },
    'primary-key': {
      focus: 'PRIMARY KEY là định danh duy nhất và ổn định cho từng dòng.',
      realWorld: 'Hai khách hàng có thể cùng tên, nhưng hệ thống phải phân biệt bằng MaKH hoặc CustomerID.',
      remember: [
        'Khóa chính không nên NULL và không được trùng.',
        'Khóa chính càng ổn định càng tốt.',
        'Khóa thay thế như ID số thường dễ dùng trong ứng dụng.'
      ],
      mistakes: [
        'Dùng tên người làm khóa chính.',
        'Cho phép sửa khóa chính quá dễ khiến quan hệ bị rối.'
      ],
      lab: 'So sánh ưu nhược điểm của Email và MaKH nếu chọn làm primary key cho bảng KhachHang.'
    },
    'foreign-key': {
      focus: 'FOREIGN KEY giữ quan hệ dữ liệu đúng giữa bảng con và bảng cha.',
      realWorld: 'DonHang.MaKH phải trỏ tới một khách hàng thật trong KhachHang.',
      remember: [
        'Khóa ngoại thường trỏ tới khóa chính hoặc cột unique.',
        'Cần quyết định hành vi khi dòng cha bị xóa hoặc sửa.',
        'Foreign key giúp ngăn dữ liệu mồ côi.'
      ],
      mistakes: [
        'Chỉ lưu mã liên kết nhưng không khai báo constraint.',
        'Không tính trước ON DELETE khi thiết kế hệ thống.'
      ],
      lab: 'Giải thích chuyện gì nên xảy ra với DonHang nếu xóa một KhachHang đã từng mua hàng.'
    },
    'unique-notnull-check': {
      focus: 'UNIQUE, NOT NULL và CHECK là các luật chất lượng dữ liệu ở tầng database.',
      realWorld: 'Email tài khoản cần UNIQUE, mật khẩu hash cần NOT NULL, điểm số nên CHECK trong khoảng hợp lệ.',
      remember: [
        'NOT NULL dùng cho dữ liệu bắt buộc.',
        'UNIQUE dùng cho dữ liệu không được trùng.',
        'CHECK dùng cho luật giá trị đơn giản.'
      ],
      mistakes: [
        'Chỉ kiểm tra trùng ở frontend hoặc backend, bỏ qua constraint database.',
        'Dùng CHECK cho logic quá phức tạp và khó bảo trì.'
      ],
      lab: 'Thiết kế bảng HocVien có Email không trùng, Diem từ 0 đến 10, TrangThai mặc định là active.'
    },
    indexes: {
      focus: 'Index tăng tốc đọc dữ liệu nhưng có chi phí ghi và dung lượng.',
      realWorld: 'Tìm khách hàng theo email sẽ nhanh hơn nhiều nếu cột Email có index.',
      remember: [
        'Index tốt dựa trên truy vấn thật sự hay chạy.',
        'Index trên cột lọc, join hoặc sort thường có ích.',
        'Quá nhiều index làm INSERT/UPDATE/DELETE chậm hơn.'
      ],
      mistakes: [
        'Tạo index cho mọi cột.',
        'Không đo lại truy vấn sau khi thêm index.'
      ],
      lab: 'Chọn 2 cột trong bảng DonHang mà bạn nghĩ nên index, rồi giải thích vì sao.'
    },
    views: {
      focus: 'View đặt tên cho một truy vấn để dùng lại như một bảng logic.',
      realWorld: 'Một view BaoCaoKhachHang có thể gom số đơn và tổng chi tiêu của từng khách.',
      remember: [
        'View thường không lưu dữ liệu riêng.',
        'View giúp ẩn độ phức tạp của join hoặc aggregate.',
        'Không nên lạm dụng view lồng view quá sâu.'
      ],
      mistakes: [
        'Nghĩ view luôn nhanh hơn truy vấn gốc.',
        'Sửa bảng gốc mà quên kiểm tra view phụ thuộc.'
      ],
      lab: 'Tạo ý tưởng view hiển thị HoTen khách hàng, số đơn, tổng tiền đã mua.'
    },
    'transaction-basics': {
      focus: 'Transaction gom nhiều thao tác thành một đơn vị thành công hoặc thất bại cùng nhau.',
      realWorld: 'Đặt hàng cần tạo đơn, trừ kho, ghi thanh toán; nếu một bước lỗi thì nên rollback.',
      remember: [
        'BEGIN mở giao dịch, COMMIT xác nhận, ROLLBACK hủy.',
        'Transaction giúp tránh dữ liệu nửa vời.',
        'Không giữ transaction mở quá lâu nếu hệ thống nhiều người dùng.'
      ],
      mistakes: [
        'COMMIT quá sớm trước khi kiểm tra đủ điều kiện.',
        'Quên rollback khi bắt lỗi.'
      ],
      lab: 'Mô tả 3 câu SQL cần nằm trong một transaction khi chuyển tiền giữa hai tài khoản.'
    },
    acid: {
      focus: 'ACID là bộ nguyên tắc để transaction đáng tin cậy.',
      realWorld: 'Ngân hàng cần ACID để giao dịch tiền không bị mất, nhân đôi hoặc đọc sai trạng thái.',
      remember: [
        'Atomicity: tất cả hoặc không gì cả.',
        'Consistency: dữ liệu sau giao dịch vẫn đúng luật.',
        'Isolation và Durability quan trọng khi có nhiều người dùng và lỗi hệ thống.'
      ],
      mistakes: [
        'Chỉ hiểu COMMIT/ROLLBACK mà không hiểu isolation.',
        'Thiết kế thao tác tiền bạc không có transaction.'
      ],
      lab: 'Giải thích bằng lời vì sao chuyển tiền cần trừ tài khoản A và cộng tài khoản B trong cùng transaction.'
    },
    'normal-forms': {
      focus: 'Chuẩn hóa giúp mỗi sự thật được lưu một nơi để tránh mâu thuẫn.',
      realWorld: 'Thông tin khách hàng nên nằm ở bảng KhachHang, đơn hàng chỉ cần lưu MaKH.',
      remember: [
        '1NF yêu cầu mỗi ô chứa giá trị nguyên tử.',
        '2NF và 3NF giảm phụ thuộc sai giữa các cột.',
        'Chuẩn hóa tốt giúp UPDATE ít lỗi hơn.'
      ],
      mistakes: [
        'Nhét nhiều giá trị vào một cột dạng danh sách.',
        'Lặp lại thông tin khách hàng ở mọi dòng đơn hàng.'
      ],
      lab: 'Tìm một ví dụ bảng dư thừa trong đời thực và đề xuất tách thành 2 bảng.'
    },
    'avoiding-redundancy': {
      focus: 'Giảm dư thừa giúp tránh lỗi update, insert và delete.',
      realWorld: 'Nếu địa chỉ khách hàng lặp trong mọi đơn, đổi địa chỉ có thể thiếu một số dòng.',
      remember: [
        'Dư thừa không kiểm soát làm dữ liệu mất tin cậy.',
        'Khóa ngoại giúp thay thế việc lặp nguyên thông tin.',
        'Denormalization chỉ nên làm khi có lý do hiệu năng rõ.'
      ],
      mistakes: [
        'Tối ưu đọc quá sớm bằng cách lặp dữ liệu.',
        'Không có quy trình đồng bộ khi cố tình denormalize.'
      ],
      lab: 'So sánh cách lưu tên khách hàng trực tiếp trong DonHang với cách lưu MaKH và join sang KhachHang.'
    },
    'stored-procedures': {
      focus: 'Stored procedure đóng gói logic chạy ở database.',
      realWorld: 'Doanh nghiệp có thể dùng procedure để chốt doanh thu cuối ngày hoặc xử lý batch dữ liệu.',
      remember: [
        'Procedure hữu ích khi nhiều ứng dụng cần cùng quy trình.',
        'Cú pháp procedure khác nhau mạnh giữa các DBMS.',
        'Cần quản lý version và test procedure như code ứng dụng.'
      ],
      mistakes: [
        'Đưa quá nhiều business logic vào database khiến khó bảo trì.',
        'Không document input/output của procedure.'
      ],
      lab: 'Mô tả một procedure tên TaoDonHang cần nhận tham số gì và thực hiện những bước nào.'
    },
    triggers: {
      focus: 'Trigger tự chạy khi INSERT, UPDATE hoặc DELETE xảy ra.',
      realWorld: 'Audit log có thể dùng trigger để ghi ai đã sửa điểm, sửa lúc nào, giá trị cũ mới là gì.',
      remember: [
        'Trigger tốt cho luật dữ liệu gắn chặt với database.',
        'Trigger là logic ẩn, cần document rõ.',
        'Trigger phức tạp có thể làm thao tác ghi chậm và khó debug.'
      ],
      mistakes: [
        'Dùng trigger thay toàn bộ business logic.',
        'Tạo trigger dây chuyền gây hành vi khó đoán.'
      ],
      lab: 'Thiết kế bảng AuditLog tối thiểu gồm hành động, thời gian, bảng bị tác động và mô tả thay đổi.'
    },
    'window-functions': {
      focus: 'Window function tính toán theo nhóm nhưng vẫn giữ từng dòng chi tiết.',
      realWorld: 'Xếp hạng sinh viên trong từng lớp cần RANK() OVER(PARTITION BY Lop ORDER BY DiemTB DESC).',
      remember: [
        'PARTITION BY chia nhóm tính toán.',
        'ORDER BY trong OVER quyết định thứ tự tính rank hoặc lũy kế.',
        'Window function khác GROUP BY vì không gộp mất dòng.'
      ],
      mistakes: [
        'Nhầm ORDER BY của toàn query với ORDER BY trong OVER.',
        'Dùng GROUP BY rồi mất dòng chi tiết cần hiển thị.'
      ],
      lab: 'Hiển thị HoTen, Lop, DiemTB và thứ hạng trong từng lớp.'
    },
    cte: {
      focus: 'CTE dùng WITH để đặt tên cho bước trung gian, giúp truy vấn dài dễ đọc.',
      realWorld: 'Phân tích doanh thu có thể dùng CTE cho bước lọc đơn hợp lệ, bước nhóm theo tháng, bước xếp hạng tháng.',
      remember: [
        'CTE giúp chia truy vấn thành nhiều bước có tên.',
        'CTE không tự động nhanh hơn subquery; lợi ích chính thường là dễ đọc.',
        'Recursive CTE xử lý dữ liệu phân cấp.'
      ],
      mistakes: [
        'Viết quá nhiều CTE nhỏ không cần thiết.',
        'Nghĩ CTE luôn materialized hoặc luôn tối ưu giống nhau ở mọi DBMS.'
      ],
      lab: 'Viết CTE LopStats tính điểm trung bình theo lớp, rồi join lại SinhVien để so sánh từng sinh viên với lớp.'
    }
  };

  function listItems(items) {
    return items.map(item => `<li>${item}</li>`).join('');
  }

  function renderPack(pack) {
    return `
<section class="lesson-reference-pack">
  <div class="lesson-reference-head">
    <span>Góc thực chiến</span>
    <h3>Mở rộng bài học</h3>
    <p>${pack.focus}</p>
  </div>
  <div class="lesson-reference-grid">
    <article>
      <strong>Tình huống thực tế</strong>
      <p>${pack.realWorld}</p>
    </article>
    <article>
      <strong>Điểm cần nhớ</strong>
      <ul>${listItems(pack.remember)}</ul>
    </article>
    <article>
      <strong>Lỗi hay gặp</strong>
      <ul>${listItems(pack.mistakes)}</ul>
    </article>
    <article>
      <strong>Mini lab</strong>
      <p>${pack.lab}</p>
    </article>
  </div>
</section>`;
  }

  Object.entries(PACKS).forEach(([id, pack]) => {
    if (!LESSON_CONTENT[id]) return;
    if (LESSON_CONTENT[id].includes('lesson-reference-pack')) return;
    LESSON_CONTENT[id] += renderPack(pack);
  });
})();
