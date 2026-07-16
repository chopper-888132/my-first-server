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
  <title>this is anfield</title>
  <style>
    :root {
      --red: #c8102e;
      --deep-red: #7f0018;
      --gold: #f6c453;
      --black: #09090b;
      --white: #fff7ed;
      --muted: #ffd7d7;
      --line: rgba(255, 255, 255, 0.2);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Tahoma, Arial, sans-serif;
      color: var(--white);
      background:
        radial-gradient(circle at 18% 14%, rgba(246, 196, 83, 0.28), transparent 26%),
        radial-gradient(circle at 82% 8%, rgba(200, 16, 46, 0.35), transparent 28%),
        linear-gradient(135deg, #050505 0%, #240007 45%, #7f0018 100%);
      padding: 28px 16px;
    }

    main {
      width: min(1120px, 100%);
      margin: 0 auto;
      display: grid;
      gap: 18px;
    }

    .hero {
      min-height: 430px;
      border-radius: 8px;
      border: 1px solid var(--line);
      overflow: hidden;
      position: relative;
      display: grid;
      place-items: center;
      text-align: center;
      padding: clamp(28px, 6vw, 72px);
      background:
        linear-gradient(rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.72)),
        radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.2), transparent 24%),
        linear-gradient(125deg, #c8102e 0%, #7f0018 48%, #111111 100%);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.48);
    }

    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0 2px, transparent 2px 34px),
        repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0 2px, transparent 2px 34px);
      mask-image: linear-gradient(to bottom, transparent 0%, black 16%, black 82%, transparent 100%);
    }

    .hero > * {
      position: relative;
      z-index: 1;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid rgba(246, 196, 83, 0.6);
      color: var(--gold);
      background: rgba(0, 0, 0, 0.36);
      font-weight: 800;
      letter-spacing: 0;
    }

    h1 {
      margin: 24px 0 8px;
      font-size: clamp(46px, 11vw, 132px);
      line-height: 0.9;
      letter-spacing: 0;
      text-transform: uppercase;
      text-shadow: 0 7px 0 #111, 0 14px 32px rgba(0, 0, 0, 0.56);
    }

    .caption {
      margin: 0;
      color: var(--muted);
      font-size: clamp(20px, 3.2vw, 38px);
      font-weight: 900;
      text-shadow: 0 3px 0 rgba(0, 0, 0, 0.72);
    }

    .student {
      width: min(760px, 100%);
      margin: 16px auto 0;
      padding: 12px 16px;
      border-radius: 8px;
      color: var(--white);
      background: rgba(0, 0, 0, 0.42);
      border: 1px solid rgba(246, 196, 83, 0.45);
      font-size: clamp(17px, 2.5vw, 27px);
      font-weight: 900;
      line-height: 1.45;
    }

    .meme-text {
      width: min(860px, 100%);
      margin: 22px auto 0;
      padding: 16px 18px;
      border-radius: 8px;
      color: #160000;
      background: var(--gold);
      border: 3px solid #fff4bd;
      font-size: clamp(24px, 5vw, 56px);
      font-weight: 900;
      line-height: 1.12;
      text-shadow: 0 2px 0 rgba(255, 255, 255, 0.42);
      box-shadow: 0 18px 38px rgba(0, 0, 0, 0.34);
    }

    .scoreboard {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 14px;
      align-items: center;
      margin-top: 22px;
    }

    .club {
      min-height: 86px;
      border-radius: 8px;
      border: 1px solid var(--line);
      display: grid;
      place-items: center;
      padding: 12px;
      background: rgba(255, 255, 255, 0.08);
      font-size: clamp(17px, 2.4vw, 27px);
      font-weight: 900;
    }

    .score {
      min-width: clamp(160px, 27vw, 310px);
      border-radius: 8px;
      color: #111;
      background: #fff;
      border: 5px solid var(--gold);
      padding: 10px 20px;
      font-size: clamp(48px, 10vw, 118px);
      font-weight: 900;
      line-height: 0.9;
      box-shadow: inset 0 -10px 0 rgba(0, 0, 0, 0.12);
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .poster {
      min-height: 390px;
      border-radius: 8px;
      border: 1px solid var(--line);
      overflow: hidden;
      position: relative;
      margin: 0;
      background: linear-gradient(160deg, #111 0%, #7f0018 55%, #c8102e 100%);
      box-shadow: 0 24px 54px rgba(0, 0, 0, 0.34);
    }

    .poster::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 24%, rgba(255, 255, 255, 0.36), transparent 16%),
        linear-gradient(to top, rgba(0, 0, 0, 0.78), transparent 58%);
      z-index: 1;
      pointer-events: none;
    }

    .poster img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .poster img[hidden] {
      display: none;
    }

    .poster .art {
      position: absolute;
      inset: 24px 18px 92px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.18), transparent),
        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0 10px, transparent 10px 22px);
      font-size: clamp(52px, 8vw, 88px);
      font-weight: 900;
      text-shadow: 0 5px 0 rgba(0, 0, 0, 0.64);
    }

    .poster figcaption {
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 18px;
      z-index: 2;
      margin: 0;
      padding: 14px;
      border-radius: 8px;
      color: #160000;
      background: var(--gold);
      font-weight: 900;
      text-align: center;
      line-height: 1.35;
    }

    .poster.king {
      background: linear-gradient(160deg, #451a03 0%, #c8102e 48%, #f6c453 100%);
    }

    .poster.trophy {
      background: linear-gradient(160deg, #111 0%, #4b5563 48%, #c8102e 100%);
    }

    .footer {
      text-align: center;
      color: rgba(255, 255, 255, 0.84);
      font-size: 15px;
      font-weight: 700;
    }

    @media (max-width: 860px) {
      .gallery,
      .scoreboard {
        grid-template-columns: 1fr;
      }

      .score {
        width: 100%;
      }

      .poster {
        min-height: 330px;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div>
        <div class="tag">This is anfield</div>
        <h1>7-0</h1>
        <p class="caption"> Liverpool</p>
        <p class="student">นายพงษ์ชัยพัฒน์ เจ๊กทิม<br>รหัสนักศึกษา 69319011557</p>
        <div class="meme-text">หมาแดงแมนยูกาก</div>
        <div class="scoreboard" aria-label="สกอร์ลิเวอร์พูลพบแมนยู">
          <div class="club">Liverpool</div>
          <div class="score">7 - 0</div>
          <div class="club">Manchester United</div>
        </div>
      </div>
    </section>

    <section class="gallery" aria-label="รูปมีมลิเวอร์พูล">
      <figure class="poster">
        <img src="/meme-1.jpg" alt="ลิเวอร์พูลชนะ 7-0" onerror="this.hidden = true">
        <div class="art">7-0</div>
        <figcaption>คืนที่แอนฟิลด์เสียงดังสุด ๆ</figcaption>
      </figure>
      <figure class="poster king">
        <img src="/meme-2.jpg" alt="มีมราชาลิเวอร์พูล" onerror="this.hidden = true">
        <div class="art">KING</div>
        <figcaption>ราชาแดงยืนหนึ่ง โย่ว!</figcaption>
      </figure>
      <figure class="poster trophy">
        <img src="/meme-3.jpg" alt="ตำนานลิเวอร์พูล" onerror="this.hidden = true">
        <div class="art">LFC</div>
        <figcaption>สีแดงนี้มีตำนานและสกอร์จำไม่ลืม</figcaption>
      </figure>
    </section>

    <p class="footer">หน้าเว็บมีมของนายพงษ์ชัยพัฒน์ เจ๊กทิม รหัสนักศึกษา 69319011557</p>
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
