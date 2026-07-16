const fs = require('fs');
const http = require('http');
const path = require('path');

const port = process.env.PORT || 3000;
const assetDir = path.join(__dirname, 'assets');
const rootDir = __dirname;

const contentTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>History of Liverpool FC</title>
  <style>
    :root {
      --red: #c8102e;
      --deep-red: #690014;
      --gold: #f6c453;
      --cream: #fff7ed;
      --ink: #111111;
      --muted: #ffd9d9;
      --line: rgba(255, 255, 255, 0.22);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Tahoma, Arial, sans-serif;
      color: var(--cream);
      background:
        radial-gradient(circle at 12% 14%, rgba(246, 196, 83, 0.22), transparent 28%),
        radial-gradient(circle at 88% 6%, rgba(200, 16, 46, 0.32), transparent 30%),
        linear-gradient(135deg, #070707 0%, #250009 46%, #7f0018 100%);
      padding: 24px 16px 36px;
    }

    main {
      width: min(1160px, 100%);
      margin: 0 auto;
      display: grid;
      gap: 22px;
    }

    .hero {
      min-height: 560px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      display: grid;
      align-items: end;
      padding: clamp(28px, 6vw, 70px);
      border: 1px solid rgba(246, 196, 83, 0.38);
      background:
        linear-gradient(to bottom, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.9)),
        url("/meme-3.jpg") center / cover,
        linear-gradient(135deg, var(--red), #111);
      box-shadow: 0 34px 90px rgba(0, 0, 0, 0.52);
    }

    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(110deg, rgba(105, 0, 20, 0.84) 0%, rgba(105, 0, 20, 0.5) 43%, rgba(0, 0, 0, 0.2) 100%),
        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 44px);
    }

    .hero-content {
      position: relative;
      width: min(850px, 100%);
      z-index: 1;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      min-height: 38px;
      padding: 8px 16px;
      border-radius: 999px;
      color: var(--gold);
      background: rgba(0, 0, 0, 0.48);
      border: 1px solid rgba(246, 196, 83, 0.62);
      font-weight: 900;
    }

    h1 {
      margin: 22px 0 14px;
      font-size: clamp(42px, 8vw, 102px);
      line-height: 0.95;
      letter-spacing: 0;
      text-transform: uppercase;
      text-shadow: 0 7px 0 rgba(0, 0, 0, 0.5), 0 18px 36px rgba(0, 0, 0, 0.52);
    }

    .lead {
      margin: 0;
      max-width: 760px;
      color: var(--muted);
      font-size: clamp(18px, 2.3vw, 25px);
      font-weight: 700;
      line-height: 1.7;
    }

    .student {
      width: min(760px, 100%);
      margin: 22px 0 0;
      padding: 13px 16px;
      border-radius: 8px;
      color: var(--cream);
      background: rgba(0, 0, 0, 0.56);
      border: 1px solid rgba(246, 196, 83, 0.5);
      font-size: clamp(16px, 2vw, 22px);
      font-weight: 900;
      line-height: 1.45;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .stat,
    .timeline,
    .story,
    .gallery figure {
      border-radius: 8px;
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 22px 48px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(12px);
    }

    .stat {
      min-height: 116px;
      padding: 18px;
      display: grid;
      align-content: center;
      gap: 6px;
    }

    .stat strong {
      color: var(--gold);
      font-size: clamp(28px, 4vw, 46px);
      line-height: 1;
    }

    .stat span {
      color: rgba(255, 247, 237, 0.86);
      font-weight: 800;
      line-height: 1.35;
    }

    .story {
      padding: clamp(24px, 4vw, 42px);
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 28px;
      align-items: center;
    }

    .story img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: #220009;
    }

    h2 {
      margin: 0 0 12px;
      color: var(--gold);
      font-size: clamp(28px, 4vw, 48px);
      line-height: 1.12;
      letter-spacing: 0;
    }

    .story p,
    .timeline p {
      margin: 0;
      color: rgba(255, 247, 237, 0.84);
      font-size: 17px;
      line-height: 1.75;
    }

    .timeline {
      padding: clamp(24px, 4vw, 42px);
    }

    .timeline-grid {
      margin-top: 22px;
      display: grid;
      gap: 14px;
    }

    .event {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 18px;
      padding: 18px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.26);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .year {
      color: var(--gold);
      font-size: 28px;
      font-weight: 900;
      line-height: 1;
    }

    .event h3 {
      margin: 0 0 6px;
      font-size: 21px;
      line-height: 1.25;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .gallery figure {
      min-height: 390px;
      overflow: hidden;
      position: relative;
      margin: 0;
    }

    .gallery img {
      width: 100%;
      height: 100%;
      min-height: 390px;
      object-fit: cover;
      display: block;
      background: linear-gradient(160deg, #111 0%, #7f0018 55%, #c8102e 100%);
    }

    .gallery figcaption {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 16px;
      padding: 14px;
      border-radius: 8px;
      color: #160000;
      background: var(--gold);
      font-weight: 900;
      text-align: center;
      line-height: 1.35;
    }

    .footer {
      text-align: center;
      color: rgba(255, 247, 237, 0.82);
      font-size: 15px;
      font-weight: 800;
    }

    @media (max-width: 860px) {
      .stats,
      .story,
      .gallery {
        grid-template-columns: 1fr;
      }

      .event {
        grid-template-columns: 1fr;
      }

      .hero {
        min-height: 520px;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="hero-content">
        <div class="tag">This Is Anfield</div>
        <h1>History of Liverpool FC</h1>
        <p class="lead">
          จากสโมสรที่ถือกำเนิดในเมืองท่า สู่หนึ่งในทีมฟุตบอลที่มีเรื่องราวเข้มข้นที่สุดในโลก
          ลิเวอร์พูลคือประวัติศาสตร์ของศรัทธา เสียงเชียร์ และค่ำคืนยุโรปที่ไม่มีวันลืม
        </p>
        <p class="student">นายพงษ์ชัยพัฒน์ เจ๊กทิม<br>รหัสนักศึกษา 69319011557</p>
      </div>
    </section>

    <section class="stats" aria-label="ข้อมูลสำคัญของลิเวอร์พูล">
      <div class="stat">
        <strong>1892</strong>
        <span>ปีที่ Liverpool Football Club ก่อตั้งขึ้น</span>
      </div>
      <div class="stat">
        <strong>Anfield</strong>
        <span>สนามเหย้าระดับตำนานของสโมสร</span>
      </div>
      <div class="stat">
        <strong>YNWA</strong>
        <span>You Will Never Walk Alone เพลงแห่งศรัทธา</span>
      </div>
      <div class="stat">
        <strong>Red</strong>
        <span>สีแดงที่กลายเป็นสัญลักษณ์ของความยิ่งใหญ่</span>
      </div>
    </section>

    <section class="story">
      <img src="/meme-2.jpg" alt="ภาพประกอบประวัติศาสตร์ลิเวอร์พูล" onerror="this.style.display='none'">
      <div>
        <h2>จุดเริ่มต้นของหงส์แดง</h2>
        <p>
          ลิเวอร์พูลก่อตั้งขึ้นในปี 1892 หลังจากการเปลี่ยนแปลงครั้งใหญ่ที่สนามแอนฟิลด์
          จากจุดเริ่มต้นเล็ก ๆ สโมสรค่อย ๆ สร้างตัวตนผ่านฟุตบอลที่หนักแน่น แฟนบอลที่ภักดี
          และบรรยากาศในสนามที่ทำให้คู่แข่งรู้ทันทีว่า ที่นี่ไม่เหมือนที่ไหน
        </p>
      </div>
    </section>

    <section class="timeline">
      <h2>เส้นทางประวัติศาสตร์</h2>
      <p>ช่วงเวลาสำคัญที่หล่อหลอมให้ลิเวอร์พูลกลายเป็นสโมสรระดับตำนาน</p>
      <div class="timeline-grid">
        <article class="event">
          <div class="year">1892</div>
          <div>
            <h3>กำเนิดสโมสร</h3>
            <p>Liverpool FC ถือกำเนิดขึ้นและเริ่มต้นเส้นทางที่ผูกพันกับสนามแอนฟิลด์อย่างแน่นแฟ้น</p>
          </div>
        </article>
        <article class="event">
          <div class="year">1960s</div>
          <div>
            <h3>ยุค Bill Shankly</h3>
            <p>ชางคลีย์สร้างรากฐานของทีม เปลี่ยนสโมสรให้มีจิตวิญญาณนักสู้ และทำให้แฟนบอลเชื่อมั่นในคำว่า Liverpool Way</p>
          </div>
        </article>
        <article class="event">
          <div class="year">1970s-80s</div>
          <div>
            <h3>ยุคทองของยุโรป</h3>
            <p>ลิเวอร์พูลกลายเป็นพลังสำคัญของฟุตบอลอังกฤษและฟุตบอลยุโรป ด้วยทีมที่มีวินัย แข็งแกร่ง และเล่นเพื่อกันและกัน</p>
          </div>
        </article>
        <article class="event">
          <div class="year">2005</div>
          <div>
            <h3>ปาฏิหาริย์อิสตันบูล</h3>
            <p>หนึ่งในค่ำคืนที่ยิ่งใหญ่ที่สุดของฟุตบอลยุโรป ลิเวอร์พูลกลับมาจากสถานการณ์แทบเป็นไปไม่ได้จนกลายเป็นตำนาน</p>
          </div>
        </article>
        <article class="event">
          <div class="year">2019-20</div>
          <div>
            <h3>การกลับสู่จุดสูงสุด</h3>
            <p>ยุคใหม่ของทีมเต็มไปด้วยพลัง การเพรสซิ่ง และความเชื่อมั่น จนพาลิเวอร์พูลกลับมายืนแถวหน้าของโลกฟุตบอลอีกครั้ง</p>
          </div>
        </article>
      </div>
    </section>

    <section class="gallery" aria-label="ภาพประกอบลิเวอร์พูล">
      <figure>
        <img src="/meme-1.jpg" alt="ค่ำคืนที่แอนฟิลด์" onerror="this.hidden = true">
        <figcaption>ค่ำคืนแห่งแอนฟิลด์</figcaption>
      </figure>
      <figure>
        <img src="/meme-2.jpg" alt="ตำนานของลิเวอร์พูล" onerror="this.hidden = true">
        <figcaption>ศรัทธาของเหล่าเดอะค็อป</figcaption>
      </figure>
      <figure>
        <img src="/meme-3.jpg" alt="ถ้วยรางวัลของลิเวอร์พูล" onerror="this.hidden = true">
        <figcaption>ประวัติศาสตร์ที่ถูกยกขึ้นเหนือศีรษะ</figcaption>
      </figure>
    </section>

    <p class="footer">จัดทำโดย นายพงษ์ชัยพัฒน์ เจ๊กทิม รหัสนักศึกษา 69319011557</p>
  </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname.startsWith('/assets/') || requestUrl.pathname.startsWith('/meme-')) {
    const fileName = path.basename(requestUrl.pathname);
    const baseDir = requestUrl.pathname.startsWith('/assets/') ? assetDir : rootDir;
    const filePath = path.join(baseDir, fileName);
    const ext = path.extname(fileName).toLowerCase();

    if (!contentTypes[ext] || !filePath.startsWith(baseDir)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentTypes[ext] });
      res.end(data);
    });
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
