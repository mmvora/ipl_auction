(function () {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap');

    :root {
      --bg: #050d18;
      --surface: rgba(11, 19, 36, 0.9);
      --surface-strong: rgba(16, 28, 49, 0.94);
      --surface-soft: rgba(12, 23, 42, 0.72);
      --border: rgba(121, 144, 178, 0.18);
      --border-strong: rgba(173, 196, 227, 0.26);
      --muted: #94a8cb;
      --muted-strong: #c4d0ea;
      --muted-bg: rgba(15, 30, 56, 0.88);
      --fg: #f5f7ff;
      --gold: #f7c11e;
      --gold-soft: #ffd769;
      --teal: #5de2d7;
      --danger: #f15b6c;
      --success: #4ade80;
      --shadow-soft: 0 24px 80px rgba(3, 8, 18, 0.46);
      --shadow-glow: 0 20px 70px rgba(247, 193, 30, 0.12);
      --space-1: 4px;
      --space-2: 8px;
      --space-3: 12px;
      --space-4: 16px;
      --space-5: 20px;
      --space-6: 24px;
      --space-7: 32px;
      --space-8: 40px;
      --radius-sm: 14px;
      --radius: 22px;
      --radius-lg: 30px;
    }

    * {
      box-sizing: border-box;
      font-family: 'Inter', system-ui, sans-serif;
    }

    html {
      color-scheme: dark;
      scroll-behavior: smooth;
    }

    body {
      background:
        radial-gradient(circle at top, rgba(49, 92, 171, 0.33), transparent 30%),
        radial-gradient(circle at 85% 8%, rgba(247, 193, 30, 0.14), transparent 18%),
        radial-gradient(circle at 15% 28%, rgba(93, 226, 215, 0.09), transparent 18%),
        linear-gradient(180deg, #081220 0%, #040912 100%);
      color: var(--fg);
      min-height: 100vh;
      margin: 0;
      position: relative;
      overflow-x: hidden;
    }

    body::before,
    body::after {
      content: '';
      position: fixed;
      border-radius: 999px;
      filter: blur(110px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.55;
    }

    body::before {
      width: 360px;
      height: 360px;
      top: -90px;
      left: -80px;
      background: rgba(82, 132, 255, 0.14);
    }

    body::after {
      width: 280px;
      height: 280px;
      right: -70px;
      top: 220px;
      background: rgba(247, 193, 30, 0.1);
    }

    .site-chrome,
    main {
      position: relative;
      z-index: 1;
    }

    .top-line {
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(247, 193, 30, 0.3) 12%, var(--gold) 50%, rgba(247, 193, 30, 0.3) 88%, transparent 100%);
    }

    .site-chrome {
      position: sticky;
      top: 0;
      z-index: 30;
      backdrop-filter: blur(18px);
    }

    .header-bar {
      background: rgba(6, 12, 24, 0.76);
      border-bottom: 1px solid rgba(139, 163, 196, 0.12);
    }

    .header-shell {
      max-width: 1180px;
      margin: 0 auto;
      padding: 18px 24px 16px;
    }

    .header-panel {
      padding: 18px;
      border-radius: 28px;
      border: 1px solid rgba(153, 178, 214, 0.14);
      background:
        linear-gradient(180deg, rgba(18, 30, 50, 0.95), rgba(8, 15, 28, 0.96)),
        radial-gradient(circle at top right, rgba(247, 193, 30, 0.14), transparent 36%);
      box-shadow: var(--shadow-soft);
    }

    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 22px;
      margin-bottom: 18px;
    }

    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 0;
    }

    .brand-mark {
      position: relative;
      flex-shrink: 0;
    }

    .brand-mark::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(247, 193, 30, 0.22), transparent 70%);
      z-index: -1;
    }

    .logo-img,
    .logo-fallback {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      flex-shrink: 0;
      box-shadow: 0 12px 30px rgba(247, 193, 30, 0.18);
    }

    .logo-img {
      object-fit: cover;
      border: 1px solid rgba(247, 193, 30, 0.5);
    }

    .logo-fallback {
      background: linear-gradient(135deg, #ffd45a, #f7c11e 50%, #c48900 100%);
      color: #07111e;
      font-size: 15px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-copy {
      min-width: 0;
    }

    .brand-eyebrow {
      color: var(--gold-soft);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .logo-title {
      font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      line-height: 1.04;
      letter-spacing: -0.03em;
      margin: 0 0 4px;
    }

    .brand-subtitle {
      color: var(--muted);
      font-size: 0.86rem;
      line-height: 1.45;
      max-width: 540px;
    }

    .nav-row {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow-x: auto;
      padding: 6px;
      border-radius: 20px;
      background: rgba(9, 18, 34, 0.72);
      border: 1px solid rgba(129, 152, 188, 0.12);
    }

    .nav-row::-webkit-scrollbar {
      display: none;
    }

    .nav-link {
      color: var(--muted);
      font-size: 0.88rem;
      font-weight: 600;
      padding: 10px 14px;
      border-radius: 14px;
      text-decoration: none;
      transition: transform 0.16s ease, color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
      white-space: nowrap;
    }

    .nav-link:hover {
      color: var(--fg);
      background: rgba(255, 255, 255, 0.04);
      transform: translateY(-1px);
    }

    .nav-link.active {
      color: #07111e;
      background: linear-gradient(135deg, #ffe18d 0%, var(--gold) 58%, #d59f00 100%);
      box-shadow: 0 12px 32px rgba(247, 193, 30, 0.22);
    }

    .countdown-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 300px;
      padding: 14px 16px;
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(13, 24, 43, 0.84), rgba(10, 17, 31, 0.94));
      border: 1px solid rgba(139, 164, 201, 0.16);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .countdown-finished {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--gold-soft);
      font-size: 0.95rem;
      font-style: italic;
      line-height: 1.35;
    }

    .countdown-label {
      color: var(--gold-soft);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .countdown-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .countdown-prefix {
      color: var(--muted);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .countdown-grid {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .cd-seg {
      min-width: 52px;
      padding: 8px 10px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(151, 175, 214, 0.14);
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      font-variant-numeric: tabular-nums;
    }

    .cd-num {
      font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
      font-size: 1.02rem;
      font-weight: 700;
      color: var(--fg);
      line-height: 1;
    }

    .cd-unit {
      font-size: 0.6rem;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .cd-sep {
      color: rgba(169, 186, 215, 0.35);
      font-size: 0.85rem;
      font-weight: 700;
    }

    .hero-panel {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.85fr);
      gap: 24px;
      padding: 28px;
      border-radius: var(--radius-lg);
      border: 1px solid rgba(148, 170, 204, 0.16);
      background:
        linear-gradient(180deg, rgba(14, 24, 42, 0.92), rgba(8, 15, 28, 0.98)),
        radial-gradient(circle at top right, rgba(247, 193, 30, 0.14), transparent 34%);
      box-shadow: var(--shadow-soft);
      overflow: hidden;
      isolation: isolate;
    }

    .hero-panel::before {
      content: '';
      position: absolute;
      width: 320px;
      height: 320px;
      right: -100px;
      top: -120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(247, 193, 30, 0.14), transparent 70%);
      z-index: -1;
    }

    .section-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--gold-soft);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .page-title {
      font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
      font-size: clamp(2rem, 4vw, 3.35rem);
      line-height: 0.98;
      letter-spacing: -0.05em;
      margin: 0 0 14px;
      max-width: 11ch;
    }

    .page-subtitle {
      color: var(--muted);
      font-size: 0.98rem;
      line-height: 1.65;
      margin: 0;
      max-width: 62ch;
    }

    .metric-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }

    .metric-card {
      padding: 16px;
      border-radius: 20px;
      border: 1px solid rgba(150, 174, 211, 0.14);
      background: linear-gradient(180deg, rgba(16, 29, 50, 0.76), rgba(10, 18, 33, 0.95));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .metric-label {
      display: block;
      color: var(--muted);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .metric-value {
      display: block;
      font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
      color: var(--fg);
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    .metric-note {
      display: block;
      color: var(--muted);
      font-size: 0.76rem;
      line-height: 1.45;
      margin-top: 6px;
    }

    @media (max-width: 900px) {
      .hero-panel {
        grid-template-columns: 1fr;
      }

      .page-title {
        max-width: none;
      }
    }

    @media (max-width: 900px) {
      .site-chrome {
        position: static;
      }

      .header-shell {
        padding: 10px 12px 12px;
      }

      .header-panel {
        padding: 12px;
        border-radius: 18px;
      }

      .header-top {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        margin-bottom: 12px;
      }

      .brand-cluster {
        align-items: flex-start;
        gap: 12px;
      }

      .logo-img,
      .logo-fallback {
        width: 42px;
        height: 42px;
        border-radius: 12px;
      }

      .logo-title {
        font-size: 1rem;
      }

      .brand-eyebrow {
        margin-bottom: 4px;
        font-size: 0.64rem;
      }

      .brand-subtitle {
        display: none;
      }

      .countdown-card {
        min-width: 0;
        width: 100%;
        padding: 10px 12px;
        border-radius: 16px;
      }

      .countdown-meta {
        align-items: flex-start;
      }

      .countdown-grid {
        width: 100%;
      }

      .cd-seg {
        min-width: 0;
        flex: 1 1 calc(50% - 6px);
        padding: 7px 8px;
      }

      .cd-num {
        font-size: 0.94rem;
      }

      .cd-unit {
        font-size: 0.56rem;
      }

      .cd-sep {
        display: none;
      }

      .nav-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 4px;
        border-radius: 16px;
      }

      .nav-link {
        flex: 1 1 calc(33.333% - 6px);
        text-align: center;
        font-size: 0.76rem;
        padding: 8px 9px;
      }

      .hero-panel {
        padding: 18px;
        border-radius: 20px;
        gap: 16px;
      }

      .page-title {
        font-size: 1.8rem;
        line-height: 1.02;
      }

      .page-subtitle {
        font-size: 0.9rem;
        line-height: 1.55;
      }

      .metric-strip {
        grid-template-columns: 1fr;
      }

      .metric-card {
        padding: 13px 14px;
        border-radius: 16px;
      }

      .metric-value {
        font-size: 1.08rem;
      }

      .metric-note {
        font-size: 0.72rem;
      }
    }

    @media (max-width: 520px) {
      .nav-link {
        flex-basis: calc(50% - 6px);
      }

      .countdown-finished {
        font-size: 0.82rem;
      }
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    function nav(href, label) {
      const active = page === href ? ' active' : '';
      return `<a href="${href}" class="nav-link${active}">${label}</a>`;
    }

    const AUCTION_DATE = new Date('2026-02-28T23:00:00+08:00');
    const AUCTION_LABEL = 'Auction: Sat 28 Feb, 11 PM HKT';

    const headerHTML = `
      <div class="site-chrome">
        <div class="top-line"></div>
        <header class="header-bar">
          <div class="header-shell">
            <div class="header-panel">
              <div class="header-top">
                <div class="brand-cluster">
                  <div class="brand-mark">
                    <img src="logo.jpg" class="logo-img" alt="IFL" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                    <div class="logo-fallback" style="display:none;">IFL</div>
                  </div>
                  <div class="brand-copy">
                    <div class="brand-eyebrow">2026 Season</div>
                    <div class="logo-title">IPL Fantasy League</div>
                    <div class="brand-subtitle">Live auction boards, franchise rosters, and standings with a sharper interface built for desktop and mobile.</div>
                  </div>
                </div>
                <div id="countdown" class="countdown-card">
                  <span class="countdown-label">${AUCTION_LABEL}</span>
                  <div class="countdown-meta">
                    <span class="countdown-prefix">Auction in</span>
                    <div class="countdown-grid">
                      <span class="cd-seg"><span class="cd-num" id="cd-d">--</span><span class="cd-unit">Days</span></span>
                      <span class="cd-sep">:</span>
                      <span class="cd-seg"><span class="cd-num" id="cd-h">--</span><span class="cd-unit">Hours</span></span>
                      <span class="cd-sep">:</span>
                      <span class="cd-seg"><span class="cd-num" id="cd-m">--</span><span class="cd-unit">Mins</span></span>
                      <span class="cd-sep">:</span>
                      <span class="cd-seg"><span class="cd-num" id="cd-s">--</span><span class="cd-unit">Secs</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <nav class="nav-row">
                ${nav('fantasy.html', 'Fantasy')}
                ${nav('index.html', 'Teams')}
                ${nav('players.html', 'Players')}
                ${nav('stats.html', 'Stats')}
                ${nav('rules.html', 'League Rules')}
                ${nav('admin.html', 'Admin')}
              </nav>
            </div>
          </div>
        </header>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    function tick() {
      const diff = AUCTION_DATE - new Date();
      if (diff <= 0) {
        document.getElementById('countdown').innerHTML = '<span class="countdown-finished">🏏 <span>Yatra Pratibha Avsara Prapnotihi</span></span>';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
      document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
      document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
      document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  });
})();
