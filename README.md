# IPL Fantasy Auction 2026

Live fantasy auction + league tracker built on Firebase Realtime DB and GitHub Pages.

## Pages

| Page | URL path | Description |
|------|----------|-------------|
| Fantasy Standings | `fantasy.html` | Live team rankings with C/VC multipliers and MOTM bonuses |
| Teams & Budgets | `index.html` | Team purses, squads, and spend overview |
| Live Auction | `auction.html` | Viewer-only live auction display |
| Admin Panel | `admin.html` | Auctioneer controls (password: `ipl2026`) |
| Players | `players.html` | Full player pool |
| Rules | `rules.html` | League rules |

## Daily Update Commands

### Update player points

1. Open the fantasy points page on [fantasy.iplt20.com](https://fantasy.iplt20.com)
2. Inspect the page and copy the inner HTML of the `<div class="m11c-plyrSel__list m11c-removeSkill">` element (the player list table)
3. Paste it into `points-input.html` (replace the entire file contents)
4. Run:

```bash
python3 update-points.py          # dry run — check names & points
python3 update-points.py --push   # push to Firebase
```

If the script reports unmatched players, add overrides to the `NAME_MAP` dict in `update-points.py`.

### Update MOTM (Man of the Match) bonuses

Scrapes MOTM winners from the [2026 IPL Wikipedia page](https://en.wikipedia.org/wiki/2026_Indian_Premier_League) and writes counts to Firebase `/motm`.

```bash
python3 update-motm.py            # dry run — see awards
python3 update-motm.py --push     # push to Firebase
```

Each MOTM award adds **50 pts** to a player's base before C/VC multipliers are applied.

### Quick one-liner (both at once)

```bash
python3 update-points.py --push && python3 update-motm.py --push
```

Or dry-run both first:

```bash
python3 update-points.py && python3 update-motm.py
```

### Deploy to GitHub Pages

```bash
git add -A && git commit -m "update" && git push origin main
```

Site deploys automatically from `main` via GitHub Pages (Settings → Pages → Deploy from branch).

## Points Formula

```
player_total = (base_points + motm_count × 50) × multiplier
```

| Role | Multiplier |
|------|-----------|
| Captain | 2× |
| Vice Captain | 1.5× |
| Regular | 1× |

## Tech Stack

- Firebase Realtime Database
- Vanilla HTML/JS (ESM modules)
- Tailwind CSS
- GitHub Pages
- Python 3 (update scripts, no dependencies)
