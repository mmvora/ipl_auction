(function () {
  // ── Shared styles ─────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    :root {
      --bg:       #060e20;
      --surface:  #0c1829;
      --border:   #1c3058;
      --muted:    #7b8fb5;
      --muted-bg: #0e1e38;
      --fg:       #eef2ff;
      --gold:     #F7C11E;
      --gold-glow: rgba(247,193,30,0.18);
    }

    * { font-family:'Inter',system-ui,sans-serif; box-sizing:border-box; }

    body {
      background: var(--bg);
      color: var(--fg);
      min-height: 100vh;
      margin: 0;
      background-image:
        radial-gradient(ellipse 110% 45% at 50% 0%, #0e2448 0%, var(--bg) 65%);
    }

    /* ── Top shimmer line ── */
    .top-line {
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        #8a6a00 8%,
        var(--gold) 30%,
        #fff3a8 50%,
        var(--gold) 70%,
        #8a6a00 92%,
        transparent 100%
      );
    }

    /* ── Header ── */
    .header-bar {
      background: rgba(7, 13, 30, 0.97);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(8px);
    }

    /* ── Logo ── */
    .logo-img {
      width: 48px; height: 48px; border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--gold);
      box-shadow: 0 0 10px rgba(247,193,30,0.35);
      flex-shrink: 0;
    }
    .logo-fallback {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #c49a00, var(--gold));
      color: #07111e; font-size: 14px; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 0 10px rgba(247,193,30,0.35);
    }

    /* ── Nav ── */
    .nav-link {
      color: var(--muted); font-size: 0.875rem; font-weight: 500;
      padding: 0 2px 14px; position: relative;
      text-decoration: none; transition: color 0.15s; white-space: nowrap;
    }
    .nav-link:hover { color: var(--fg); }
    .nav-link.active { color: var(--gold); font-weight: 600; }
    .nav-link.active::after {
      content: '';
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      border-radius: 1px;
    }

    /* ── Countdown ── */
    .cd-seg {
      background: var(--muted-bg);
      border: 1px solid var(--border);
      border-radius: 5px; padding: 4px 9px;
      display: inline-flex; align-items: baseline; gap: 2px;
      font-variant-numeric: tabular-nums;
    }
    .cd-num { font-size: 0.85rem; font-weight: 700; color: var(--gold); }
    .cd-unit { font-size: 0.6rem; font-weight: 600; color: var(--muted); }
    .cd-sep { color: var(--border); font-size: 0.75rem; }
  `;
  document.head.appendChild(style);

  // ── Header HTML + countdown ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    function nav(href, label) {
      const active = page === href ? ' active' : '';
      return `<a href="${href}" class="nav-link${active}">${label}</a>`;
    }

    // ── Auction date — update this one line for future changes ────────────
    const AUCTION_DATE = new Date('2026-02-28T23:00:00+08:00');
    const AUCTION_LABEL = 'Auction: Sat 28 Feb, 11 PM HKT';
    // ──────────────────────────────────────────────────────────────────────

    const headerHTML = `
      <div class="top-line"></div>
      <header class="header-bar">
        <div style="max-width:1024px;margin:0 auto;padding:0 24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;">
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="logo.jpg" class="logo-img" alt="IFL" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
              <div class="logo-fallback" style="display:none;">IFL</div>
              <div>
                <div style="font-weight:800;font-size:0.95rem;color:var(--fg);line-height:1.2;letter-spacing:0.01em;">IPL Fantasy League</div>
                <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);">2026 Season</div>
              </div>
            </div>
            <div id="countdown" style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
              <span style="font-size:0.65rem;font-weight:700;letter-spacing:0.05em;color:var(--gold);">${AUCTION_LABEL}</span>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:0.65rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:var(--muted);">Auction in</span>
                <div style="display:flex;align-items:center;gap:4px;">
                  <span class="cd-seg"><span class="cd-num" id="cd-d">--</span><span class="cd-unit">d</span></span>
                  <span class="cd-sep">:</span>
                  <span class="cd-seg"><span class="cd-num" id="cd-h">--</span><span class="cd-unit">h</span></span>
                  <span class="cd-sep">:</span>
                  <span class="cd-seg"><span class="cd-num" id="cd-m">--</span><span class="cd-unit">m</span></span>
                  <span class="cd-sep">:</span>
                  <span class="cd-seg"><span class="cd-num" id="cd-s">--</span><span class="cd-unit">s</span></span>
                </div>
              </div>
            </div>
          </div>
          <nav style="display:flex;gap:28px;">
            ${nav('index.html', 'Teams')}
            ${nav('auction.html', 'Auction')}
            ${nav('players.html', 'Players')}
            ${nav('rules.html', 'League Rules')}
          </nav>
        </div>
      </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    function tick() {
      const diff = AUCTION_DATE - new Date();
      if (diff <= 0) {
        document.getElementById('countdown').innerHTML = '<span style="color:var(--gold);font-weight:700;font-size:0.85rem;">🔨 Auction is LIVE!</span>';
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
