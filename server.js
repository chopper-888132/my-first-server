const http = require('http');

const port = process.env.PORT || 3000;

const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My First Server</title>
  <style>
    :root {
      --bg: #0f172a;
      --panel: rgba(255, 255, 255, 0.92);
      --ink: #111827;
      --muted: #5b6475;
      --accent: #14b8a6;
      --accent-dark: #0f766e;
      --line: rgba(15, 23, 42, 0.12);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Tahoma, Arial, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 12% 18%, rgba(20, 184, 166, 0.35), transparent 28%),
        radial-gradient(circle at 90% 8%, rgba(251, 191, 36, 0.24), transparent 24%),
        linear-gradient(135deg, #111827 0%, #0f172a 48%, #022c22 100%);
      display: grid;
      place-items: center;
      padding: 32px 18px;
    }

    main {
      width: min(980px, 100%);
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 22px;
      align-items: stretch;
    }

    .hero,
    .info {
      background: var(--panel);
      border: 1px solid rgba(255, 255, 255, 0.58);
      box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(14px);
    }

    .hero {
      border-radius: 8px;
      padding: clamp(28px, 5vw, 54px);
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(120deg, rgba(20, 184, 166, 0.12), transparent 42%),
        repeating-linear-gradient(135deg, transparent 0 18px, rgba(15, 23, 42, 0.04) 18px 19px);
      pointer-events: none;
    }

    .hero > * {
      position: relative;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(20, 184, 166, 0.12);
      color: var(--accent-dark);
      font-size: 14px;
      font-weight: 700;
      border: 1px solid rgba(20, 184, 166, 0.26);
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 6px rgba(20, 184, 166, 0.15);
    }

    h1 {
      margin: 28px 0 14px;
      font-size: clamp(34px, 6vw, 64px);
      line-height: 1.08;
      letter-spacing: 0;
    }

    .lead {
      margin: 0;
      max-width: 620px;
      color: var(--muted);
      font-size: clamp(17px, 2.3vw, 21px);
      line-height: 1.75;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 32px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 10px 18px;
      border-radius: 8px;
      border: 1px solid transparent;
      text-decoration: none;
      font-weight: 700;
      color: white;
      background: var(--accent-dark);
    }

    .button.secondary {
      color: var(--ink);
      background: white;
      border-color: var(--line);
    }

    .info {
      border-radius: 8px;
      padding: 26px;
      display: grid;
      align-content: center;
      gap: 16px;
    }

    .stat {
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.72);
    }

    .label {
      margin: 0 0 6px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .value {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
    }

    footer {
      grid-column: 1 / -1;
      color: rgba(255, 255, 255, 0.74);
      text-align: center;
      font-size: 14px;
    }

    @media (max-width: 760px) {
      main {
        grid-template-columns: 1fr;
      }

      .hero,
      .info {
        padding: 24px;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="badge"><span class="dot"></span> Server พร้อมใช้งาน</div>
      <h1>สวัสดีครับ<br>นี่คือ Web Server ของผม</h1>
      <p class="lead">
        หน้าเว็บนี้ถูกปรับใหม่ให้ดูทันสมัยขึ้น มีเลย์เอาต์แบบ responsive สีสบายตา
        และยังรันด้วย Node.js แบบเรียบง่ายเหมือนเดิม
      </p>
      <div class="actions">
        <a class="button" href="/">กลับหน้าแรก</a>
        <a class="button secondary" href="https://railway.app" target="_blank" rel="noreferrer">Railway</a>
      </div>
    </section>

    <aside class="info" aria-label="ข้อมูลเซิร์ฟเวอร์">
      <div class="stat">
        <p class="label">ชื่อโปรเจกต์</p>
        <p class="value">My First Server</p>
      </div>
      <div class="stat">
        <p class="label">ระบบ</p>
        <p class="value">Node.js HTTP</p>
      </div>
      <div class="stat">
        <p class="label">สถานะ</p>
        <p class="value">ทำงานปกติ</p>
      </div>
    </aside>

    <footer>สร้างและปรับแต่งสำหรับเว็บเซิร์ฟเวอร์หน้าแรก</footer>
  </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
