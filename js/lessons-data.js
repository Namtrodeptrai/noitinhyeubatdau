// Lesson data - Chapter structure following SQL Roadmap
const SQL_CHAPTERS = [
  {
    id: 'basic', title: 'Cơ Bản', num: 1, icon: '📘',
    lessons: [
      { id: 'what-is-sql', title: 'SQL là gì?' },
      { id: 'db-tables', title: 'Database & Tables' },
      { id: 'data-types', title: 'Kiểu dữ liệu' },
      { id: 'crud', title: 'CRUD Operations' }
    ]
  },
  {
    id: 'queries', title: 'Truy Vấn', num: 2, icon: '🔍',
    lessons: [
      { id: 'select', title: 'SELECT' },
      { id: 'where', title: 'WHERE' },
      { id: 'orderby-groupby', title: 'ORDER BY & GROUP BY' },
      { id: 'limit-distinct', title: 'LIMIT & DISTINCT' }
    ]
  },
  {
    id: 'functions', title: 'Hàm SQL', num: 3, icon: '⚡',
    lessons: [
      { id: 'aggregate', title: 'Hàm tổng hợp' },
      { id: 'string-funcs', title: 'Hàm chuỗi' },
      { id: 'date-funcs', title: 'Hàm ngày tháng' }
    ]
  },
  {
    id: 'joins', title: 'JOIN', num: 4, icon: '🔗',
    lessons: [
      { id: 'inner-join', title: 'INNER JOIN' },
      { id: 'left-right-join', title: 'LEFT & RIGHT JOIN' },
      { id: 'full-self-join', title: 'FULL & SELF JOIN' }
    ]
  },
  {
    id: 'subqueries', title: 'Subqueries', num: 5, icon: '🧩',
    lessons: [
      { id: 'subquery-where', title: 'Subquery trong WHERE' },
      { id: 'subquery-from-select', title: 'Subquery trong FROM/SELECT' },
      { id: 'correlated', title: 'Correlated Subqueries' }
    ]
  },
  {
    id: 'constraints', title: 'Ràng Buộc', num: 6, icon: '🔒',
    lessons: [
      { id: 'primary-key', title: 'PRIMARY KEY' },
      { id: 'foreign-key', title: 'FOREIGN KEY' },
      { id: 'unique-notnull-check', title: 'UNIQUE, NOT NULL, CHECK' }
    ]
  },
  {
    id: 'indexes-views', title: 'Index & View', num: 7, icon: '📊',
    lessons: [
      { id: 'indexes', title: 'Indexes' },
      { id: 'views', title: 'Views' }
    ]
  },
  {
    id: 'transactions', title: 'Transactions', num: 8, icon: '🔄',
    lessons: [
      { id: 'transaction-basics', title: 'BEGIN, COMMIT, ROLLBACK' },
      { id: 'acid', title: 'ACID Properties' }
    ]
  },
  {
    id: 'normalization', title: 'Chuẩn Hóa', num: 9, icon: '📐',
    lessons: [
      { id: 'normal-forms', title: '1NF, 2NF, 3NF' },
      { id: 'avoiding-redundancy', title: 'Tránh dư thừa dữ liệu' }
    ]
  },
  {
    id: 'advanced', title: 'Nâng Cao', num: 10, icon: '🚀',
    lessons: [
      { id: 'stored-procedures', title: 'Stored Procedures' },
      { id: 'triggers', title: 'Triggers' },
      { id: 'window-functions', title: 'Window Functions' },
      { id: 'cte', title: 'CTEs (WITH)' }
    ]
  }
];
