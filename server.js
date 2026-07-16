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
      --bg: #09090b;
      --panel: rgba(24, 24, 27, 0.9);
      --ink: #f8fafc;
      --muted: #cbd5e1;
      --accent: #facc15;
      --accent-dark: #d97706;
      --hot: #ef4444;
      --line: rgba(250, 204, 21, 0.26);
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
        radial-gradient(circle at 10% 14%, rgba(239, 68, 68, 0.34), transparent 28%),
        radial-gradient(circle at 88% 10%, rgba(250, 204, 21, 0.26), transparent 25%),
        linear-gradient(135deg, #030712 0%, #18181b 48%, #451a03 100%);
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
      border: 1px solid rgba(250, 204, 21, 0.24);
      box-shadow: 0 28px 70px rgba(0, 0, 0, 0.5);
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
        linear-gradient(120deg, rgba(250, 204, 21, 0.16), transparent 42%),
        repeating-linear-gradient(135deg, transparent 0 18px, rgba(250, 204, 21, 0.07) 18px 19px);
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
      background: rgba(250, 204, 21, 0.14);
      color: var(--accent);
      font-size: 14px;
      font-weight: 700;
      border: 1px solid rgba(250, 204, 21, 0.34);
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--hot);
      box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.18);
    }

    h1 {
      margin: 28px 0 14px;
      font-size: clamp(34px, 6vw, 64px);
      line-height: 1.08;
      letter-spacing: 0;
      color: var(--ink);
      text-shadow: 0 3px 0 rgba(250, 204, 21, 0.22);
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
      background: linear-gradient(135deg, var(--hot), var(--accent-dark));
    }

    .button.secondary {
      color: var(--accent);
      background: rgba(255, 255, 255, 0.08);
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
      background: rgba(255, 255, 255, 0.07);
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
      color: var(--ink);
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
      <div class="badge"><span class="dot"></span> โยว่ Server พร้อมขึ้นเวที</div>
      <h1>โยว่! นี้คือ Server <br>ของนายพงษ์ชัยพัฒน์</h1>
      <p class="lead">

      </p>
      <div class="actions">
        <a class="button" href="/">โยว่ หน้าแรก</a>
        <a class="button secondary" href="https://railway.app" target="_blank" rel="noreferrer">Railway Stage</a>
      </div>
    </section>

    <aside class="info" aria-label="ข้อมูลเซิร์ฟเวอร์">
      <div class="stat">
        <p class="label">Rapper Name</p>
        <p class="value">พงษ์ชัยพัฒน์ เจ๊กทิม</p>
      </div>
      <div class="stat">
        <p class="label">Student ID</p>
        <p class="value">69319011557</p>
      </div>
      <div class="stat">
        <p class="label">Vibe</p>
        <p class="value">โยว่ Rapper Mode</p>
      </div>
    </aside>

    <footer>โยว่ เว็บเซิร์ฟเวอร์ธีม Rapper พร้อมขึ้นโชว์บน Railway</footer>
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
