// Lesson video support. Each lesson uses a curated first-result video for its topic.

const YOUTUBE_SEARCH_QUERIES = {
  'what-is-sql': 'SQL là gì hướng dẫn SQL tiếng Việt',
  'db-tables': 'SQL database table tutorial for beginners',
  'data-types': 'SQL data types tutorial for beginners',
  'crud': 'SQL INSERT UPDATE DELETE tutorial',
  'select': 'SQL SELECT statement tutorial',
  'where': 'SQL WHERE clause tutorial',
  'orderby-groupby': 'SQL ORDER BY GROUP BY tutorial',
  'limit-distinct': 'SQL LIMIT DISTINCT tutorial',
  'aggregate': 'SQL aggregate functions COUNT SUM AVG tutorial',
  'string-funcs': 'SQL string functions CONCAT SUBSTRING tutorial',
  'date-funcs': 'SQL date functions tutorial',
  'inner-join': 'SQL INNER JOIN tutorial',
  'left-right-join': 'SQL LEFT JOIN RIGHT JOIN tutorial',
  'full-self-join': 'SQL FULL OUTER JOIN SELF JOIN tutorial',
  'subquery-where': 'SQL subquery WHERE IN EXISTS tutorial',
  'subquery-from-select': 'SQL subquery FROM SELECT tutorial',
  'correlated': 'SQL correlated subquery tutorial',
  'primary-key': 'SQL primary key tutorial',
  'foreign-key': 'SQL foreign key tutorial',
  'unique-notnull-check': 'SQL UNIQUE NOT NULL CHECK constraints tutorial',
  'indexes': 'SQL create index tutorial',
  'views': 'SQL create view tutorial',
  'transaction-basics': 'SQL transaction commit rollback tutorial',
  'acid': 'database ACID properties tutorial',
  'normal-forms': 'database normalization 1NF 2NF 3NF tutorial',
  'avoiding-redundancy': 'database redundancy normalization tutorial',
  'stored-procedures': 'SQL stored procedure tutorial',
  'triggers': 'SQL trigger tutorial',
  'window-functions': 'SQL window functions row_number rank tutorial',
  'cte': 'SQL CTE WITH tutorial'
};

const YOUTUBE_FIRST_RESULT_FALLBACKS = {
  'what-is-sql': { id: 'GDVNkenmIHU', title: 'Tự học Database và SQL Cơ Bản siêu nhanh trong 10 phút', source: 'Phạm Huy Hoàng' },
  'db-tables': { id: 'kbKty5ZVKMY', title: 'Learn Basic SQL in 15 Minutes | Business Intelligence For Beginners | SQL Tutorial For Beginners 1/3', source: 'Adam Finer - Learn BI' },
  'data-types': { id: 'btjcNSOUTOg', title: 'MySQL 24 - Important Data Types', source: 'Caleb Curry' },
  'crud': { id: 'YOjy9rpneNY', title: 'SQL Data Manipulation: INSERT, UPDATE, DELETE Explained - SQL Tutorial for Beginners', source: 'Data with Baraa' },
  'select': { id: 'HYD8KjPB9F8', title: 'Select Statement in MySQL | Beginner MySQL Series', source: 'Alex The Analyst' },
  'where': { id: 'L9GBpVXq-zc', title: 'SQL - WHERE Clause - W3Schools.com', source: 'w3schools.com' },
  'orderby-groupby': { id: 'zgYqUP_PhQo', title: 'Group By + Order By in MySQL | Beginner MySQL Series', source: 'Alex The Analyst' },
  'limit-distinct': { id: 'r4DNHhVJPB0', title: 'SQL - 2.3 select, limit, distinct, like', source: 'Paul A. Ahlstrom' },
  'aggregate': { id: 'jcoJuc5e3RE', title: 'Basic Aggregate Functions in SQL (COUNT, SUM, AVG, MAX, and MIN)', source: 'Becoming a Data Scientist' },
  'string-funcs': { id: 'KRXSJb9ql1Y', title: 'String Functions in MySQL | Intermediate MySQL Series', source: 'Alex The Analyst' },
  'date-funcs': { id: '7RCxH9x5StM', title: 'SQL Date & Time Functions | DATEPART, DATENAME, DATETRUNC, EOMONTH | #SQL Course 15', source: 'Data with Baraa' },
  'inner-join': { id: 'G3lJAxg1cy8', title: 'Learn MySQL joins in 5 minutes!', source: 'Bro Code' },
  'left-right-join': { id: 'G3lJAxg1cy8', title: 'Learn MySQL joins in 5 minutes!', source: 'Bro Code' },
  'full-self-join': { id: 'XpBkXo3DCEg', title: 'SQL FULL OUTER JOIN - SQL Tutorial #25', source: 'Data with Baraa' },
  'subquery-where': { id: 'sP6MCZ9patk', title: 'SQL Subquery using EXISTS and IN - SQL Tutorial #31', source: 'Data with Baraa' },
  'subquery-from-select': { id: 'GpC0XyiJPEo', title: 'How to do Subqueries in SQL with Examples', source: 'Becoming a Data Scientist' },
  'correlated': { id: 'nJIEIzF7tDw', title: 'Subquery in SQL | Correlated Subquery + Complete SQL Subqueries Tutorial', source: 'techTFQ' },
  'primary-key': { id: '620DzFVz41o', title: 'MySQL: PRIMARY KEYS are easy', source: 'Bro Code' },
  'foreign-key': { id: 'rFssfx37UJw', title: 'MySQL: FOREIGN KEYS are easy (kind of)', source: 'Bro Code' },
  'unique-notnull-check': { id: 'oZNeyL99-5I', title: 'Constraints in SQL | Primary Key | Unique | NOT NULL | Default | Check|  Foreign Key | Constraints', source: 'SQL With RaviMartha' },
  'indexes': { id: 'BIlFTFrEFOI', title: 'SQL indexing best practices | How to make your database FASTER!', source: 'CockroachDB' },
  'views': { id: 'vLLkNI-vkV8', title: "SQL Views In 4 Minutes: Super Useful! Wow! Crazy! Amazing! I'm Crying Tears Of SQL Joy.", source: 'Colt Steele' },
  'transaction-basics': { id: 'GOQVlrQohtM', title: 'MySQL: AUTOCOMMIT, COMMIT, ROLLBACK', source: 'Bro Code' },
  'acid': { id: 'GAe5oB742dw', title: 'ACID Properties in Databases With Examples', source: 'ByteByteGo' },
  'normal-forms': { id: 'GFQaEYEc8_8', title: 'Learn Database Normalization - 1NF, 2NF, 3NF, 4NF, 5NF', source: 'Decomplexify' },
  'avoiding-redundancy': { id: 'GFQaEYEc8_8', title: 'Learn Database Normalization - 1NF, 2NF, 3NF, 4NF, 5NF', source: 'Decomplexify' },
  'stored-procedures': { id: 'DX8I5SmB6jo', title: 'SQL Stored Procedure (Visually Explained) | Comprehensive Guide | #SQL Course 33', source: 'Data with Baraa' },
  'triggers': { id: 'jVbj72YO-8s', title: 'MySQL: TRIGGERS', source: 'Bro Code' },
  'window-functions': { id: 'rIcB4zMYMas', title: 'SQL Window Functions | Clearly Explained | PARTITION BY, ORDER BY, ROW_NUMBER, RANK, DENSE_RANK', source: 'Maven Analytics' },
  'cte': { id: 'K1WeoKxLZ5o', title: 'Advanced SQL Tutorial | CTE (Common Table Expression)', source: 'Alex The Analyst' }
};

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLessonInfoForVideo(lessonId) {
  if (typeof SQL_CHAPTERS === 'undefined') return null;
  for (const chapter of SQL_CHAPTERS) {
    const lesson = chapter.lessons.find(item => item.id === lessonId);
    if (lesson) return { chapter, lesson };
  }
  return null;
}

function getYoutubeQuery(lessonId) {
  if (YOUTUBE_SEARCH_QUERIES[lessonId]) return YOUTUBE_SEARCH_QUERIES[lessonId];
  const info = getLessonInfoForVideo(lessonId);
  return info ? `SQL ${info.lesson.title} ${info.chapter.title} tutorial` : 'SQL tutorial';
}

function getFallbackVideo(lessonId) {
  return YOUTUBE_FIRST_RESULT_FALLBACKS[lessonId] || {
    id: 'GDVNkenmIHU',
    title: 'Tự học Database và SQL Cơ Bản siêu nhanh trong 10 phút',
    source: 'Phạm Huy Hoàng'
  };
}

function getYoutubeWatchUrl(video) {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
}

function getYoutubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function getYoutubeEmbedUrl(video) {
  const canSendOrigin = window.location.protocol === 'http:' || window.location.protocol === 'https:';
  const origin = canSendOrigin && window.location.origin && window.location.origin !== 'null'
    ? `&origin=${encodeURIComponent(window.location.origin)}`
    : '';
  return `https://www.youtube.com/embed/${encodeURIComponent(video.id)}?rel=0&modestbranding=1${origin}`;
}

function renderVideoPlayer(video, query, sourceLabel) {
  return `
    <div class="video-player">
      <iframe
        src="${htmlEscape(getYoutubeEmbedUrl(video))}"
        title="${htmlEscape(video.title)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen></iframe>
    </div>
    <div class="video-list">
      <a class="video-card direct-video-card" href="${htmlEscape(getYoutubeWatchUrl(video))}" target="_blank" rel="noopener">
        <img src="https://i.ytimg.com/vi/${htmlEscape(video.id)}/hqdefault.jpg" alt="">
        <div>
          <strong>${htmlEscape(video.title)}</strong>
          <span>${htmlEscape(video.source)} · ${htmlEscape(sourceLabel)}</span>
        </div>
      </a>
      <a class="video-more-link" href="${htmlEscape(getYoutubeSearchUrl(query))}" target="_blank" rel="noopener">Mở kết quả tìm kiếm YouTube</a>
    </div>`;
}

function renderLessonVideos(lessonId) {
  const query = getYoutubeQuery(lessonId);
  const localFileNote = window.location.protocol === 'file:'
    ? '<div class="video-warning">Bạn đang mở bằng file:// nên YouTube có thể báo Error 153. Nếu bị chặn, hãy mở web bằng localhost để iframe phát ổn định.</div>'
    : '';

  return `
    <section class="video-section" data-video-lesson="${htmlEscape(lessonId)}" data-youtube-query="${htmlEscape(query)}">
      <div class="video-section-head">
        <div>
          <h3>🎬 Video học thêm</h3>
          <p>Video tham khảo theo chủ đề: <strong>${htmlEscape(query)}</strong></p>
        </div>
        <span class="video-source-chip">Video học thêm</span>
      </div>
      ${localFileNote}
      <div class="video-grid" data-video-grid>
        ${renderVideoPlayer(getFallbackVideo(lessonId), query, 'video học thêm')}
      </div>
    </section>`;
}

function initLessonVideos(lessonId) {
  const section = document.querySelector(`.video-section[data-video-lesson="${CSS.escape(lessonId)}"]`);
  if (!section) return;
}
