const http = require('http');
const { Pool } = require('pg');

// เชื่อมต่อ PostgreSQL ผ่าน Environment Variable ของ Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

const port = process.env.PORT || 3000;

// ป้องกันข้อมูลจากฐานข้อมูลถูกตีความเป็น HTML
function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pageTemplate({ students = [], error = null }) {
  const studentRows = students
    .map(
      (student, index) => `
        <tr>
          <td>
            <span class="number">${String(index + 1).padStart(2, '0')}</span>
          </td>
          <td>
            <span class="student-id">
              ${escapeHtml(student.student_id)}
            </span>
          </td>
          <td>
            <div class="student">
              <div class="avatar">
                ${escapeHtml(student.student_name).charAt(0).toUpperCase() || '?'}
              </div>

              <div>
                <strong>${escapeHtml(student.student_name)}</strong>
                <small>Active student</small>
              </div>
            </div>
          </td>
          <td>
            <span class="status">
              <span class="status-dot"></span>
              Active
            </span>
          </td>
        </tr>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>Student Database Dashboard</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        >

        <style>
          :root {
            --background: #050816;
            --surface: rgba(13, 20, 45, 0.72);
            --surface-hover: rgba(21, 32, 67, 0.85);
            --border: rgba(148, 163, 184, 0.16);
            --text: #f8fafc;
            --muted: #94a3b8;
            --cyan: #22d3ee;
            --purple: #a855f7;
            --green: #34d399;
            --red: #fb7185;
          }

          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            min-height: 100vh;
            margin: 0;
            overflow-x: hidden;
            color: var(--text);
            font-family: "Kanit", sans-serif;
            background:
              radial-gradient(
                circle at 15% 20%,
                rgba(34, 211, 238, 0.15),
                transparent 30%
              ),
              radial-gradient(
                circle at 85% 15%,
                rgba(168, 85, 247, 0.18),
                transparent 32%
              ),
              radial-gradient(
                circle at 50% 100%,
                rgba(59, 130, 246, 0.12),
                transparent 40%
              ),
              var(--background);
          }

          body::before {
            position: fixed;
            inset: 0;
            z-index: -1;
            content: "";
            opacity: 0.35;
            background-image:
              linear-gradient(
                rgba(255, 255, 255, 0.025) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.025) 1px,
                transparent 1px
              );
            background-size: 42px 42px;
            mask-image: linear-gradient(to bottom, black, transparent);
          }

          .orb {
            position: fixed;
            z-index: -1;
            width: 340px;
            height: 340px;
            border-radius: 50%;
            filter: blur(110px);
            animation: float 9s ease-in-out infinite alternate;
          }

          .orb-one {
            top: -100px;
            left: -100px;
            background: rgba(34, 211, 238, 0.23);
          }

          .orb-two {
            right: -100px;
            bottom: -100px;
            background: rgba(168, 85, 247, 0.23);
            animation-delay: -4s;
          }

          .container {
            width: min(1180px, calc(100% - 32px));
            margin: 0 auto;
            padding: 56px 0;
          }

          .topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 42px;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .logo {
            display: grid;
            width: 48px;
            height: 48px;
            place-items: center;
            border: 1px solid rgba(34, 211, 238, 0.35);
            border-radius: 15px;
            color: var(--cyan);
            font: 700 23px "Space Mono", monospace;
            background: linear-gradient(
              145deg,
              rgba(34, 211, 238, 0.17),
              rgba(168, 85, 247, 0.13)
            );
            box-shadow:
              inset 0 0 20px rgba(34, 211, 238, 0.08),
              0 0 30px rgba(34, 211, 238, 0.1);
          }

          .brand strong {
            display: block;
            font-size: 18px;
            letter-spacing: 0.4px;
          }

          .brand small {
            color: var(--muted);
          }

          .connection {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 9px 15px;
            border: 1px solid rgba(52, 211, 153, 0.18);
            border-radius: 999px;
            color: #a7f3d0;
            font: 12px "Space Mono", monospace;
            background: rgba(52, 211, 153, 0.07);
          }

          .pulse {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--green);
            box-shadow: 0 0 0 rgba(52, 211, 153, 0.5);
            animation: pulse 1.8s infinite;
          }

          .hero {
            margin-bottom: 32px;
          }

          .eyebrow {
            margin-bottom: 10px;
            color: var(--cyan);
            font: 700 12px "Space Mono", monospace;
            letter-spacing: 2.5px;
            text-transform: uppercase;
          }

          h1 {
            max-width: 780px;
            margin: 0;
            font-size: clamp(34px, 6vw, 68px);
            line-height: 1.06;
            letter-spacing: -2px;
          }

          .gradient-text {
            color: transparent;
            background: linear-gradient(
              90deg,
              var(--cyan),
              #818cf8,
              var(--purple)
            );
            background-clip: text;
            -webkit-background-clip: text;
          }

          .description {
            max-width: 650px;
            margin: 18px 0 0;
            color: var(--muted);
            font-size: 16px;
            line-height: 1.75;
          }

          .statistics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin: 34px 0 20px;
          }

          .stat-card,
          .table-card,
          .error-card {
            border: 1px solid var(--border);
            background: var(--surface);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
          }

          .stat-card {
            position: relative;
            overflow: hidden;
            padding: 21px;
            border-radius: 20px;
          }

          .stat-card::after {
            position: absolute;
            top: -35px;
            right: -35px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            content: "";
            background: var(--glow);
            filter: blur(35px);
          }

          .stat-label {
            display: block;
            margin-bottom: 7px;
            color: var(--muted);
            font-size: 13px;
          }

          .stat-value {
            font: 700 29px "Space Mono", monospace;
          }

          .table-card {
            overflow: hidden;
            border-radius: 24px;
          }

          .table-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 22px 25px;
            border-bottom: 1px solid var(--border);
          }

          .table-header h2 {
            margin: 0;
            font-size: 19px;
          }

          .table-header span {
            color: var(--muted);
            font: 12px "Space Mono", monospace;
          }

          .table-wrapper {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            padding: 15px 24px;
            color: var(--muted);
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 1.3px;
            text-align: left;
            text-transform: uppercase;
            background: rgba(255, 255, 255, 0.018);
          }

          td {
            padding: 17px 24px;
            border-top: 1px solid rgba(148, 163, 184, 0.1);
          }

          tbody tr {
            transition:
              background 180ms ease,
              transform 180ms ease;
          }

          tbody tr:hover {
            background: var(--surface-hover);
          }

          .number {
            color: #64748b;
            font: 12px "Space Mono", monospace;
          }

          .student-id {
            color: var(--cyan);
            font: 700 13px "Space Mono", monospace;
          }

          .student {
            display: flex;
            align-items: center;
            gap: 13px;
          }

          .student strong,
          .student small {
            display: block;
          }

          .student strong {
            font-size: 15px;
            font-weight: 500;
          }

          .student small {
            margin-top: 2px;
            color: var(--muted);
            font-size: 11px;
          }

          .avatar {
            display: grid;
            flex: 0 0 40px;
            height: 40px;
            place-items: center;
            border: 1px solid rgba(129, 140, 248, 0.25);
            border-radius: 13px;
            color: #c4b5fd;
            font-weight: 700;
            background: linear-gradient(
              145deg,
              rgba(34, 211, 238, 0.13),
              rgba(168, 85, 247, 0.2)
            );
          }

          .status {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 6px 10px;
            border-radius: 999px;
            color: #a7f3d0;
            font-size: 11px;
            background: rgba(52, 211, 153, 0.08);
          }

          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--green);
          }

          .empty {
            padding: 55px 20px;
            color: var(--muted);
            text-align: center;
          }

          .error-card {
            padding: 36px;
            border-color: rgba(251, 113, 133, 0.25);
            border-radius: 24px;
          }

          .error-card h2 {
            margin: 0 0 9px;
            color: var(--red);
          }

          .error-code {
            overflow-wrap: anywhere;
            color: #fda4af;
            font: 13px/1.7 "Space Mono", monospace;
          }

          footer {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-top: 22px;
            color: #64748b;
            font: 11px "Space Mono", monospace;
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.55);
            }

            70% {
              box-shadow: 0 0 0 8px rgba(52, 211, 153, 0);
            }

            100% {
              box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
            }
          }

          @keyframes float {
            from {
              transform: translate(0, 0) scale(1);
            }

            to {
              transform: translate(60px, 40px) scale(1.12);
            }
          }

          @media (max-width: 700px) {
            .container {
              width: min(100% - 22px, 1180px);
              padding: 27px 0;
            }

            .topbar {
              align-items: flex-start;
              margin-bottom: 38px;
            }

            .connection {
              padding: 8px 10px;
              font-size: 0;
            }

            .connection::after {
              content: "ONLINE";
              font-size: 10px;
            }

            h1 {
              letter-spacing: -1px;
            }

            .statistics {
              grid-template-columns: 1fr;
            }

            th,
            td {
              padding: 14px 16px;
              white-space: nowrap;
            }

            footer {
              flex-direction: column;
            }
          }
        </style>
      </head>

      <body>
        <div class="orb orb-one"></div>
        <div class="orb orb-two"></div>

        <main class="container">
          <header class="topbar">
            <div class="brand">
              <div class="logo">S</div>
              <div>
                <strong>Student Core</strong>
                <small>Database Management System</small>
              </div>
            </div>

            <div class="connection">
              <span class="pulse"></span>
              DATABASE CONNECTED
            </div>
          </header>

          <section class="hero">
            <div class="eyebrow">// PostgreSQL Database</div>

            <h1>
              ระบบฐานข้อมูล
              <span class="gradient-text">นักศึกษา</span>
            </h1>

            <p class="description">
              แดชบอร์ดสำหรับตรวจสอบข้อมูลนักศึกษาแบบเรียลไทม์
              เชื่อมต่อกับ PostgreSQL และให้บริการผ่าน Railway
            </p>
          </section>

          ${
            error
              ? `
                <section class="error-card">
                  <h2>ไม่สามารถเชื่อมต่อฐานข้อมูลได้</h2>
                  <div class="error-code">
                    ${escapeHtml(error)}
                  </div>
                </section>
              `
              : `
                <section class="statistics">
                  <article
                    class="stat-card"
                    style="--glow: rgba(34, 211, 238, 0.4)"
                  >
                    <span class="stat-label">นักศึกษาทั้งหมด</span>
                    <strong class="stat-value">${students.length}</strong>
                  </article>

                  <article
                    class="stat-card"
                    style="--glow: rgba(52, 211, 153, 0.4)"
                  >
                    <span class="stat-label">สถานะระบบ</span>
                    <strong class="stat-value" style="color: var(--green)">
                      ONLINE
                    </strong>
                  </article>

                  <article
                    class="stat-card"
                    style="--glow: rgba(168, 85, 247, 0.4)"
                  >
                    <span class="stat-label">Database Engine</span>
                    <strong class="stat-value" style="color: #c4b5fd">
                      PG
                    </strong>
                  </article>
                </section>

                <section class="table-card">
                  <div class="table-header">
                    <h2>รายชื่อนักศึกษา</h2>
                    <span>${students.length} RECORDS FOUND</span>
                  </div>

                  <div class="table-wrapper">
                    ${
                      students.length
                        ? `
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>รหัสนักศึกษา</th>
                                <th>ชื่อ–นามสกุล</th>
                                <th>สถานะ</th>
                              </tr>
                            </thead>

                            <tbody>
                              ${studentRows}
                            </tbody>
                          </table>
                        `
                        : `
                          <div class="empty">
                            ยังไม่มีข้อมูลนักศึกษาในฐานข้อมูล
                          </div>
                        `
                    }
                  </div>
                </section>
              `
          }

          <footer>
            <span>STUDENT CORE © ${new Date().getFullYear()}</span>
            <span>POWERED BY NODE.JS + POSTGRESQL</span>
          </footer>
        </main>
      </body>
    </html>
  `;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // ตอบเฉพาะหน้าแรก
  if (req.url !== '/' && req.url !== '/favicon.ico') {
    res.statusCode = 404;
    res.end('<h1>404 — Page Not Found</h1>');
    return;
  }

  // ป้องกัน browser ขอ favicon แล้วไป query ฐานข้อมูลโดยไม่จำเป็น
  if (req.url === '/favicon.ico') {
    res.statusCode = 204;
    res.end();
    return;
  }

  let client;

  try {
    client = await pool.connect();

    const result = await client.query(`
      SELECT student_id, student_name
      FROM students
      ORDER BY student_id ASC
    `);

    res.statusCode = 200;
    res.end(
      pageTemplate({
        students: result.rows,
      })
    );
  } catch (error) {
    console.error('Database error:', error);

    res.statusCode = 500;
    res.end(
      pageTemplate({
        error:
          process.env.NODE_ENV === 'production'
            ? 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง'
            : error.message,
      })
    );
  } finally {
    // คืน connection เสมอ แม้ query เกิดข้อผิดพลาด
    client?.release();
  }
});

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
