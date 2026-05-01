(function() {
  const MINDMAPS = {
    'what-is-sql': {
      center: 'SQL là gì?',
      note: 'Ngôn ngữ để hỏi, đọc và thay đổi dữ liệu trong database quan hệ.',
      branches: [
        { label: 'Mục đích', items: ['Truy vấn dữ liệu', 'Thêm sửa xóa bản ghi', 'Quản lý cấu trúc bảng'] },
        { label: 'Làm việc với', items: ['Database', 'Table', 'Row', 'Column'] },
        { label: 'Nhóm lệnh', items: ['SELECT để đọc', 'INSERT/UPDATE/DELETE để ghi', 'CREATE/ALTER/DROP để thiết kế'] },
        { label: 'Tư duy học', items: ['Biết bảng có gì', 'Chọn cột cần lấy', 'Lọc đúng điều kiện', 'Kiểm tra kết quả'] }
      ]
    },
    'db-tables': {
      center: 'Database & Tables',
      note: 'Database là nơi chứa dữ liệu, table là cấu trúc lưu dữ liệu theo hàng và cột.',
      branches: [
        { label: 'Database', items: ['Tập hợp nhiều bảng', 'Có quan hệ giữa bảng', 'Phục vụ một hệ thống'] },
        { label: 'Table', items: ['Có tên bảng rõ nghĩa', 'Mỗi cột có kiểu dữ liệu', 'Mỗi hàng là một bản ghi'] },
        { label: 'Quan hệ', items: ['Khóa chính định danh', 'Khóa ngoại liên kết', 'JOIN để ghép dữ liệu'] },
        { label: 'Thiết kế tốt', items: ['Không nhồi nhiều ý vào một cột', 'Không lưu trùng không cần thiết', 'Tên cột dễ hiểu'] }
      ]
    },
    'data-types': {
      center: 'Kiểu dữ liệu',
      note: 'Kiểu dữ liệu quyết định database lưu, so sánh và tính toán giá trị như thế nào.',
      branches: [
        { label: 'Số', items: ['INTEGER cho số nguyên', 'DECIMAL cho tiền', 'FLOAT cho số xấp xỉ'] },
        { label: 'Chuỗi', items: ['VARCHAR/TEXT cho văn bản', 'Độ dài phù hợp', 'Có thể tìm kiếm bằng LIKE'] },
        { label: 'Ngày giờ', items: ['DATE cho ngày', 'DATETIME/TIMESTAMP cho thời điểm', 'Dễ lọc theo khoảng'] },
        { label: 'Chọn kiểu', items: ['Đúng bản chất dữ liệu', 'Tránh lưu số dưới dạng text', 'Tính tới index và validate'] }
      ]
    },
    crud: {
      center: 'CRUD',
      note: 'Bốn thao tác cơ bản để làm việc với dữ liệu trong hầu hết ứng dụng.',
      branches: [
        { label: 'Create', items: ['INSERT INTO', 'Thêm bản ghi mới', 'Kiểm tra ràng buộc'] },
        { label: 'Read', items: ['SELECT', 'Lọc bằng WHERE', 'Sắp xếp/nhóm dữ liệu'] },
        { label: 'Update', items: ['UPDATE ... SET', 'Luôn có WHERE', 'Kiểm tra trước bằng SELECT'] },
        { label: 'Delete', items: ['DELETE FROM', 'Luôn có WHERE', 'Cẩn thận dữ liệu liên quan'] }
      ]
    },
    select: {
      center: 'SELECT',
      note: 'SELECT dùng để lấy dữ liệu từ một hoặc nhiều bảng.',
      branches: [
        { label: 'Cấu trúc', items: ['SELECT cột', 'FROM bảng', 'WHERE điều kiện'] },
        { label: 'Chọn cột', items: ['Lấy cột cần dùng', 'Đặt alias bằng AS', 'Hạn chế SELECT * khi làm thật'] },
        { label: 'Kết quả', items: ['Trả về bảng kết quả', 'Có thể tính toán cột mới', 'Có thể kết hợp hàm'] },
        { label: 'Thói quen', items: ['Viết từ đơn giản tới phức tạp', 'Chạy thử từng phần', 'Đọc output trước khi sửa'] }
      ]
    },
    where: {
      center: 'WHERE',
      note: 'WHERE lọc hàng, giúp câu truy vấn chỉ lấy dữ liệu đúng điều kiện.',
      branches: [
        { label: 'So sánh', items: ['=', '<>', '>', '<', '>=', '<='] },
        { label: 'Logic', items: ['AND cần đúng tất cả', 'OR chỉ cần đúng một', 'NOT đảo điều kiện'] },
        { label: 'Mẫu thường dùng', items: ['LIKE tìm chuỗi', 'IN chọn nhiều giá trị', 'BETWEEN lọc khoảng'] },
        { label: 'Lỗi hay gặp', items: ['Quên dấu nháy cho text', 'Nhầm AND với OR', 'So sánh NULL bằng ='] }
      ]
    },
    'orderby-groupby': {
      center: 'ORDER BY & GROUP BY',
      note: 'ORDER BY sắp xếp kết quả, GROUP BY gom nhiều dòng thành nhóm để thống kê.',
      branches: [
        { label: 'ORDER BY', items: ['ASC tăng dần', 'DESC giảm dần', 'Có thể sắp nhiều cột'] },
        { label: 'GROUP BY', items: ['Gom theo cột', 'Đi kèm hàm tổng hợp', 'Mỗi nhóm ra một dòng'] },
        { label: 'HAVING', items: ['Lọc sau khi nhóm', 'Dùng với COUNT/SUM/AVG', 'Khác WHERE'] },
        { label: 'Tư duy', items: ['Lọc trước bằng WHERE', 'Nhóm bằng GROUP BY', 'Lọc nhóm bằng HAVING', 'Sắp xếp cuối bằng ORDER BY'] }
      ]
    },
    'limit-distinct': {
      center: 'LIMIT & DISTINCT',
      note: 'LIMIT giới hạn số dòng, DISTINCT loại bỏ giá trị trùng trong kết quả.',
      branches: [
        { label: 'LIMIT', items: ['Lấy vài dòng đầu', 'Dùng khi xem thử dữ liệu', 'Kết hợp ORDER BY để top rõ nghĩa'] },
        { label: 'OFFSET', items: ['Bỏ qua một số dòng', 'Dùng cho phân trang', 'Cẩn thận khi dữ liệu thay đổi'] },
        { label: 'DISTINCT', items: ['Loại dòng trùng', 'Áp dụng trên tổ hợp cột', 'Có thể tốn chi phí'] },
        { label: 'Khi dùng', items: ['Top sản phẩm', 'Danh sách danh mục', 'Preview bảng lớn'] }
      ]
    },
    aggregate: {
      center: 'Hàm tổng hợp',
      note: 'COUNT, SUM, AVG, MIN, MAX giúp biến nhiều dòng dữ liệu thành số liệu thống kê.',
      branches: [
        { label: 'Đếm', items: ['COUNT(*) đếm dòng', 'COUNT(cột) bỏ NULL', 'COUNT(DISTINCT) đếm giá trị khác nhau'] },
        { label: 'Tính toán', items: ['SUM cộng tổng', 'AVG tính trung bình', 'MIN/MAX lấy biên'] },
        { label: 'Đi với GROUP BY', items: ['Thống kê theo nhóm', 'Mỗi nhóm một kết quả', 'HAVING lọc nhóm'] },
        { label: 'Ứng dụng', items: ['Doanh thu', 'Số đơn hàng', 'Điểm trung bình', 'Sản phẩm đắt nhất'] }
      ]
    },
    'string-funcs': {
      center: 'Hàm chuỗi',
      note: 'Hàm chuỗi dùng để chuẩn hóa, cắt ghép và tìm kiếm dữ liệu văn bản.',
      branches: [
        { label: 'Ghép/cắt', items: ['CONCAT ghép chuỗi', 'SUBSTRING cắt chuỗi', 'LEFT/RIGHT lấy đầu/cuối'] },
        { label: 'Độ dài', items: ['LEN/LENGTH đếm ký tự', 'TRIM bỏ khoảng trắng', 'REPLACE thay nội dung'] },
        { label: 'Chuẩn hóa', items: ['UPPER viết hoa', 'LOWER viết thường', 'Chuẩn hóa email/tên'] },
        { label: 'Lưu ý', items: ['Tên hàm khác theo DBMS', 'NULL có thể làm kết quả NULL', 'Không lạm dụng trên cột index'] }
      ]
    },
    'date-funcs': {
      center: 'Hàm ngày tháng',
      note: 'Hàm ngày tháng giúp lọc, cộng trừ và phân tích dữ liệu theo thời gian.',
      branches: [
        { label: 'Lấy thời gian', items: ['CURRENT_DATE', 'GETDATE/NOW', 'CURRENT_TIMESTAMP'] },
        { label: 'Tách phần', items: ['YEAR', 'MONTH', 'DAY', 'DATEPART/EXTRACT'] },
        { label: 'Tính khoảng', items: ['DATEDIFF', 'DATEADD', 'Lọc từ ngày đến ngày'] },
        { label: 'Ứng dụng', items: ['Doanh thu theo tháng', 'Đơn hàng gần đây', 'Tuổi khách hàng', 'SLA/quá hạn'] }
      ]
    },
    'inner-join': {
      center: 'INNER JOIN',
      note: 'INNER JOIN chỉ lấy các dòng có khóa khớp ở cả hai bảng.',
      branches: [
        { label: 'Bản chất', items: ['Phần giao hai bảng', 'Không khớp thì bị loại', 'Dựa trên điều kiện ON'] },
        { label: 'Cú pháp', items: ['FROM A', 'INNER JOIN B', 'ON A.key = B.key'] },
        { label: 'Dùng khi', items: ['Cần dữ liệu đầy đủ hai bên', 'Đơn hàng có khách hàng', 'Chi tiết có sản phẩm'] },
        { label: 'Lỗi hay gặp', items: ['Quên ON', 'Join sai khóa', 'Trùng dòng do quan hệ 1-nhiều'] }
      ]
    },
    'left-right-join': {
      center: 'LEFT & RIGHT JOIN',
      note: 'LEFT JOIN giữ tất cả dòng bên trái, RIGHT JOIN giữ tất cả dòng bên phải.',
      branches: [
        { label: 'LEFT JOIN', items: ['Giữ bảng trái', 'Bảng phải không khớp là NULL', 'Hay dùng để tìm dữ liệu thiếu'] },
        { label: 'RIGHT JOIN', items: ['Giữ bảng phải', 'Có thể đổi thứ tự bảng', 'Ít dùng hơn LEFT JOIN'] },
        { label: 'Tìm thiếu', items: ['WHERE B.id IS NULL', 'Khách chưa mua hàng', 'Sản phẩm chưa có đơn'] },
        { label: 'Lưu ý', items: ['Điều kiện lọc đặt sai có thể biến thành INNER JOIN', 'Cẩn thận NULL', 'Đọc bảng nào là bên giữ'] }
      ]
    },
    'full-self-join': {
      center: 'FULL & SELF JOIN',
      note: 'FULL JOIN lấy tất cả hai bên, SELF JOIN là một bảng tự join với chính nó.',
      branches: [
        { label: 'FULL JOIN', items: ['Giữ cả hai bảng', 'Không khớp vẫn xuất hiện', 'NULL ở phía thiếu'] },
        { label: 'SELF JOIN', items: ['Một bảng dùng hai alias', 'So sánh dòng trong cùng bảng', 'Cây quản lý nhân viên'] },
        { label: 'Alias', items: ['Đặt tên A/B', 'Tránh mơ hồ cột', 'Dễ đọc điều kiện ON'] },
        { label: 'Ứng dụng', items: ['Đối soát dữ liệu', 'Tìm cặp liên quan', 'Quản lý cấp trên - nhân viên'] }
      ]
    },
    'subquery-where': {
      center: 'Subquery trong WHERE',
      note: 'Subquery trong WHERE dùng kết quả truy vấn con làm điều kiện lọc truy vấn ngoài.',
      branches: [
        { label: 'Dạng một giá trị', items: ['= (SELECT ...)', 'So sánh với AVG/MAX', 'Ví dụ điểm trên trung bình'] },
        { label: 'Dạng nhiều giá trị', items: ['IN', 'ANY/SOME', 'ALL'] },
        { label: 'Tồn tại', items: ['EXISTS kiểm tra có dòng', 'NOT EXISTS kiểm tra không có', 'Hay dùng với quan hệ'] },
        { label: 'Tư duy', items: ['Viết truy vấn con trước', 'Kiểm tra output con', 'Đưa vào WHERE ngoài'] }
      ]
    },
    'subquery-from-select': {
      center: 'Subquery FROM/SELECT',
      note: 'Subquery có thể tạo bảng tạm trong FROM hoặc tạo cột tính toán trong SELECT.',
      branches: [
        { label: 'Trong FROM', items: ['Tạo derived table', 'Cần đặt alias', 'Dùng để chia bước xử lý'] },
        { label: 'Trong SELECT', items: ['Tạo cột phụ', 'Có thể tính tổng/đếm liên quan', 'Cẩn thận hiệu năng'] },
        { label: 'Khi nên dùng', items: ['Logic nhiều bước', 'Cần lọc sau thống kê', 'Tách câu truy vấn dễ đọc'] },
        { label: 'Thay thế', items: ['JOIN', 'CTE WITH', 'Window function'] }
      ]
    },
    correlated: {
      center: 'Correlated Subquery',
      note: 'Truy vấn con phụ thuộc vào từng dòng của truy vấn ngoài.',
      branches: [
        { label: 'Đặc điểm', items: ['Dùng cột truy vấn ngoài', 'Chạy theo từng dòng logic', 'Thường đi với EXISTS'] },
        { label: 'Mẫu dùng', items: ['Tìm bản ghi lớn nhất trong nhóm', 'Kiểm tra tồn tại liên quan', 'So sánh với nhóm cùng loại'] },
        { label: 'Cẩn thận', items: ['Có thể chậm', 'Đọc alias rõ ràng', 'Kiểm tra bằng dữ liệu nhỏ'] },
        { label: 'Tối ưu', items: ['Dùng JOIN nếu đơn giản hơn', 'Dùng index đúng khóa', 'Cân nhắc window function'] }
      ]
    },
    'primary-key': {
      center: 'PRIMARY KEY',
      note: 'Khóa chính định danh duy nhất từng dòng trong bảng.',
      branches: [
        { label: 'Quy tắc', items: ['Duy nhất', 'Không NULL', 'Một bảng nên có khóa chính'] },
        { label: 'Kiểu khóa', items: ['Một cột', 'Nhiều cột kết hợp', 'ID tự tăng'] },
        { label: 'Vai trò', items: ['Xác định bản ghi', 'Làm điểm nối foreign key', 'Tăng độ tin cậy dữ liệu'] },
        { label: 'Thiết kế', items: ['Ổn định lâu dài', 'Ngắn gọn', 'Không dùng dữ liệu dễ đổi nếu không cần'] }
      ]
    },
    'foreign-key': {
      center: 'FOREIGN KEY',
      note: 'Khóa ngoại liên kết bảng con với bảng cha để giữ toàn vẹn dữ liệu.',
      branches: [
        { label: 'Bảng cha', items: ['Có primary key', 'Lưu dữ liệu gốc', 'Ví dụ KhachHang'] },
        { label: 'Bảng con', items: ['Chứa foreign key', 'Tham chiếu bảng cha', 'Ví dụ DonHang.MaKH'] },
        { label: 'Ràng buộc', items: ['Không trỏ tới bản ghi không tồn tại', 'Có thể chặn xóa', 'Có thể cascade'] },
        { label: 'Lợi ích', items: ['Dữ liệu nhất quán', 'JOIN rõ nghĩa', 'Tránh đơn hàng mồ côi'] }
      ]
    },
    'unique-notnull-check': {
      center: 'UNIQUE, NOT NULL, CHECK',
      note: 'Các ràng buộc giúp dữ liệu đúng ngay khi được ghi vào database.',
      branches: [
        { label: 'UNIQUE', items: ['Không trùng giá trị', 'Email/số điện thoại', 'Có thể áp dụng nhiều cột'] },
        { label: 'NOT NULL', items: ['Bắt buộc có dữ liệu', 'Cột quan trọng', 'Tránh bản ghi thiếu thông tin'] },
        { label: 'CHECK', items: ['Kiểm tra điều kiện', 'Tuổi > 0', 'Giá >= 0'] },
        { label: 'Tư duy', items: ['Validate ở database', 'Giảm lỗi ứng dụng', 'Thông báo lỗi rõ ràng'] }
      ]
    },
    indexes: {
      center: 'Indexes',
      note: 'Index giúp database tìm dữ liệu nhanh hơn, giống mục lục của một cuốn sách.',
      branches: [
        { label: 'Tăng tốc', items: ['WHERE', 'JOIN', 'ORDER BY'] },
        { label: 'Đánh đổi', items: ['Tốn dung lượng', 'INSERT/UPDATE chậm hơn', 'Không nên tạo bừa'] },
        { label: 'Nên index', items: ['Khóa ngoại', 'Cột lọc thường xuyên', 'Cột join thường xuyên'] },
        { label: 'Kiểm tra', items: ['EXPLAIN plan', 'Đo thời gian', 'Theo dõi query chậm'] }
      ]
    },
    views: {
      center: 'Views',
      note: 'View là truy vấn được lưu lại như một bảng ảo để tái sử dụng.',
      branches: [
        { label: 'Bản chất', items: ['Không phải bảng thật', 'Dựa trên SELECT', 'Luôn lấy dữ liệu mới'] },
        { label: 'Lợi ích', items: ['Ẩn truy vấn phức tạp', 'Dùng lại logic', 'Giới hạn cột nhạy cảm'] },
        { label: 'Cú pháp', items: ['CREATE VIEW', 'SELECT từ view', 'DROP/ALTER khi cần'] },
        { label: 'Lưu ý', items: ['Không phải lúc nào cũng nhanh hơn', 'Một số view khó update', 'Đặt tên rõ nghĩa'] }
      ]
    },
    'transaction-basics': {
      center: 'Transaction',
      note: 'Transaction gom nhiều thao tác thành một đơn vị: hoặc thành công hết, hoặc hủy hết.',
      branches: [
        { label: 'BEGIN', items: ['Bắt đầu giao dịch', 'Các thay đổi tạm thời', 'Chưa xác nhận cuối cùng'] },
        { label: 'COMMIT', items: ['Lưu thay đổi', 'Kết thúc thành công', 'Dữ liệu chính thức'] },
        { label: 'ROLLBACK', items: ['Hủy thay đổi', 'Quay về trước transaction', 'Dùng khi có lỗi'] },
        { label: 'Ứng dụng', items: ['Chuyển tiền', 'Tạo đơn hàng', 'Cập nhật kho và thanh toán'] }
      ]
    },
    acid: {
      center: 'ACID',
      note: 'ACID là bốn tính chất giúp transaction đáng tin cậy.',
      branches: [
        { label: 'Atomicity', items: ['Tất cả hoặc không gì', 'Không nửa vời', 'Rollback khi lỗi'] },
        { label: 'Consistency', items: ['Giữ đúng ràng buộc', 'Dữ liệu hợp lệ', 'Không phá quy tắc'] },
        { label: 'Isolation', items: ['Giao dịch không giẫm nhau', 'Kiểm soát đọc/ghi đồng thời', 'Có mức isolation'] },
        { label: 'Durability', items: ['Commit là bền vững', 'Không mất khi sự cố', 'Ghi log/lưu trữ'] }
      ]
    },
    'normal-forms': {
      center: '1NF, 2NF, 3NF',
      note: 'Chuẩn hóa giúp bảng gọn, ít trùng lặp và dễ cập nhật đúng.',
      branches: [
        { label: '1NF', items: ['Mỗi ô một giá trị', 'Không danh sách trong một cột', 'Dữ liệu dạng bảng'] },
        { label: '2NF', items: ['Đạt 1NF', 'Không phụ thuộc một phần khóa', 'Tách dữ liệu theo thực thể'] },
        { label: '3NF', items: ['Đạt 2NF', 'Không phụ thuộc bắc cầu', 'Cột chỉ phụ thuộc vào khóa'] },
        { label: 'Mục tiêu', items: ['Giảm dư thừa', 'Tránh lỗi cập nhật', 'Thiết kế dễ mở rộng'] }
      ]
    },
    'avoiding-redundancy': {
      center: 'Tránh dư thừa',
      note: 'Dữ liệu trùng lặp không kiểm soát làm tăng lỗi và chi phí bảo trì.',
      branches: [
        { label: 'Dấu hiệu', items: ['Một thông tin lặp nhiều nơi', 'Sửa một chỗ quên chỗ khác', 'Bảng phình to'] },
        { label: 'Hậu quả', items: ['Lỗi cập nhật', 'Dữ liệu mâu thuẫn', 'Tốn dung lượng'] },
        { label: 'Cách xử lý', items: ['Tách bảng', 'Dùng khóa ngoại', 'Tạo view để đọc tiện'] },
        { label: 'Ngoại lệ', items: ['Denormalization có chủ đích', 'Vì hiệu năng đọc', 'Phải có chiến lược đồng bộ'] }
      ]
    },
    'stored-procedures': {
      center: 'Stored Procedures',
      note: 'Stored procedure là khối lệnh SQL được lưu trong database để gọi lại nhiều lần.',
      branches: [
        { label: 'Dùng để', items: ['Đóng gói nghiệp vụ', 'Tái sử dụng logic', 'Giảm lặp code ứng dụng'] },
        { label: 'Thành phần', items: ['Tên procedure', 'Tham số vào/ra', 'Các câu SQL bên trong'] },
        { label: 'Lợi ích', items: ['Quản lý tập trung', 'Có thể phân quyền', 'Phù hợp tác vụ định kỳ'] },
        { label: 'Lưu ý', items: ['Cú pháp khác DBMS', 'Khó version nếu không quản lý', 'Không nhồi quá nhiều logic'] }
      ]
    },
    triggers: {
      center: 'Triggers',
      note: 'Trigger tự chạy khi có INSERT, UPDATE hoặc DELETE trên bảng.',
      branches: [
        { label: 'Thời điểm', items: ['BEFORE', 'AFTER', 'INSTEAD OF'] },
        { label: 'Sự kiện', items: ['INSERT', 'UPDATE', 'DELETE'] },
        { label: 'Ứng dụng', items: ['Ghi audit log', 'Tự cập nhật tổng', 'Chặn thao tác sai'] },
        { label: 'Cẩn thận', items: ['Khó debug', 'Có thể gây vòng lặp', 'Không lạm dụng nghiệp vụ phức tạp'] }
      ]
    },
    'window-functions': {
      center: 'Window Functions',
      note: 'Window function tính toán trên một cửa sổ dòng mà không gom mất chi tiết từng dòng.',
      branches: [
        { label: 'OVER', items: ['Bắt buộc có OVER', 'Xác định cửa sổ', 'Giữ từng dòng kết quả'] },
        { label: 'PARTITION BY', items: ['Chia nhóm logic', 'Tính theo từng nhóm', 'Không giống GROUP BY'] },
        { label: 'ORDER BY', items: ['Xếp thứ tự trong cửa sổ', 'Dùng cho ranking', 'Tính lũy kế'] },
        { label: 'Hàm phổ biến', items: ['ROW_NUMBER', 'RANK', 'SUM() OVER', 'LAG/LEAD'] }
      ]
    },
    cte: {
      center: 'CTE - WITH',
      note: 'CTE đặt tên cho truy vấn tạm, giúp câu SQL nhiều bước dễ đọc hơn.',
      branches: [
        { label: 'Cấu trúc', items: ['WITH ten AS (...)', 'SELECT từ CTE', 'Có thể nhiều CTE'] },
        { label: 'Lợi ích', items: ['Tách bước xử lý', 'Dễ đọc hơn subquery lồng', 'Dùng lại trong truy vấn chính'] },
        { label: 'Recursive CTE', items: ['Xử lý cây/phân cấp', 'Có phần anchor', 'Có phần đệ quy'] },
        { label: 'Lưu ý', items: ['Không luôn nhanh hơn', 'Đặt tên rõ nghĩa', 'Kiểm tra từng CTE riêng'] }
      ]
    }
  };

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function findLessonInfo(lessonId) {
    if (typeof SQL_CHAPTERS === 'undefined') return null;
    for (const chapter of SQL_CHAPTERS) {
      const lesson = chapter.lessons.find(item => item.id === lessonId);
      if (lesson) return { chapter, lesson };
    }
    return null;
  }

  function fallbackMindMap(lessonId) {
    const info = findLessonInfo(lessonId);
    if (!info) return null;
    return {
      center: info.lesson.title,
      note: `Bài thuộc chương ${info.chapter.title}. Hãy nắm ý chính, cú pháp, ví dụ và lỗi thường gặp.`,
      branches: [
        { label: 'Ý chính', items: ['Khái niệm cần nhớ', 'Vấn đề bài học giải quyết', 'Khi nào nên dùng'] },
        { label: 'Cú pháp', items: ['Mẫu câu lệnh', 'Thứ tự viết', 'Điều kiện bắt buộc'] },
        { label: 'Ví dụ', items: ['Chạy trong SQL Editor', 'Quan sát output', 'Sửa từng phần nếu lỗi'] },
        { label: 'Bài tập', items: ['Đọc đề', 'Viết hướng giải', 'Chạy thử và nộp'] }
      ]
    };
  }

  window.renderLessonMindMap = function renderLessonMindMap(lessonId) {
    const data = MINDMAPS[lessonId] || fallbackMindMap(lessonId);
    if (!data) return '';
    return `
      <section class="lesson-mindmap" aria-label="Sơ đồ tư duy bài học">
        <div class="mindmap-head">
          <span>Sơ đồ tư duy</span>
          <h3>🧠 ${escapeHTML(data.center)}</h3>
          <p>${escapeHTML(data.note)}</p>
        </div>
        <div class="mindmap-board">
          <div class="mindmap-center">
            <span>SQL</span>
            <strong>${escapeHTML(data.center)}</strong>
            <small>Nắm khung trước, đọc chi tiết sau</small>
          </div>
          <div class="mindmap-branches">
            ${data.branches.map((branch, index) => `
              <article class="mindmap-branch branch-${(index % 4) + 1}">
                <div class="mindmap-branch-title">
                  <span>${index + 1}</span>
                  <strong>${escapeHTML(branch.label)}</strong>
                </div>
                <ul>
                  ${branch.items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
                </ul>
              </article>
            `).join('')}
          </div>
        </div>
      </section>`;
  };
})();
