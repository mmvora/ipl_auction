(function () {
  // ── Shared styles ─────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    :root { --bg:#09090b; --surface:#0f0f11; --border:#27272a; --muted:#71717a; --muted-bg:#18181b; --fg:#fafafa; --gold:#F7C01A; }
    * { font-family:'Inter',system-ui,sans-serif; box-sizing:border-box; }
    body { background:var(--bg); color:var(--fg); min-height:100vh; margin:0; }
    .header-bar { background:var(--surface); border-bottom:1px solid var(--border); }
    .logo-img { width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid var(--gold); flex-shrink:0; }
    .logo-fallback { width:48px; height:48px; border-radius:50%; background:var(--gold); color:#000; font-size:14px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .nav-link { color:var(--muted); font-size:0.875rem; font-weight:500; padding:0 2px 14px; position:relative; text-decoration:none; transition:color 0.15s; white-space:nowrap; }
    .nav-link:hover { color:var(--fg); }
    .nav-link.active { color:var(--fg); }
    .nav-link.active::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:var(--fg); }
    .top-line { height:1px; background:linear-gradient(90deg,transparent,var(--gold),transparent); opacity:0.6; }
    .cd-seg { background:var(--muted-bg); border:1px solid var(--border); border-radius:5px; padding:4px 9px; display:inline-flex; align-items:baseline; gap:2px; font-variant-numeric:tabular-nums; }
    .cd-num { font-size:0.85rem; font-weight:700; color:var(--fg); }
    .cd-unit { font-size:0.6rem; font-weight:600; color:var(--muted); }
    .cd-sep { color:var(--border); font-size:0.75rem; }
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
                <div style="font-weight:700;font-size:0.9rem;color:var(--fg);line-height:1.2;">IPL Fantasy League</div>
                <div style="font-size:0.65rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);">2026 Season</div>
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
