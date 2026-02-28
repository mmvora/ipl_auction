# IPL Fantasy Auction — Implementation Plan

## Firebase Config

```js
const firebaseConfig = {
  apiKey: "AIzaSyB6icjFuutJqV3G2alfBrd2rJUmwghJxns",
  authDomain: "iplfantasy-952c4.firebaseapp.com",
  projectId: "iplfantasy-952c4",
  storageBucket: "iplfantasy-952c4.firebasestorage.app",
  messagingSenderId: "50120567665",
  appId: "1:50120567665:web:99123e475943cd71e3a4d0",
  databaseURL: "https://iplfantasy-952c4-default-rtdb.firebaseio.com"
};
```

## Firebase SDK (ESM modules in `<script type="module">`)

```js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js';
import { getDatabase, ref, onValue, set, update, push, get, remove }
  from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js';

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);
```

## Firebase Realtime DB Schema

```
/auction
  status: "idle" | "nominating" | "bidding" | "sold" | "unsold"
  currentPlayer: { name, role, iplTeam, type, basePriceLakhs }
  currentBid: number (in lakhs, e.g. 500 = 5 CR)
  currentBidder: string | null (fantasy team key e.g. "Heet")
  bidHistory/
    <pushId>: { team, amount, prevTeam, prevAmount, ts }

/teams
  Heet:     { name: "Heet Hurricanes",    budgetLakhs: 10000, squad: {} }
  Divij:    { name: "Divij Dragons",      budgetLakhs: 10000, squad: {} }
  Vrushank: { name: "Vrushank Vikings",   budgetLakhs: 10000, squad: {} }
  Shrey:    { name: "Shrey Strikers",     budgetLakhs: 10000, squad: {} }
  Malhaar:  { name: "Malhaar Monarchs",   budgetLakhs: 10000, squad: {} }
  Shivansh: { name: "Shivansh Sharks",    budgetLakhs: 10000, squad: {} }
  Dev:      { name: "Dev Dynamos",        budgetLakhs: 10000, squad: {} }
  Sai:      { name: "Sai Supernovas",     budgetLakhs: 10000, squad: {} }
  Moksh:    { name: "Moksh Mavericks",    budgetLakhs: 10000, squad: {} }
  Darshan:  { name: "Darshan Daredevils", budgetLakhs: 10000, squad: {} }
  Rishab:   { name: "Rishab Risers",      budgetLakhs: 10000, squad: {} }
  Div:      { name: "Div Dominators",     budgetLakhs: 10000, squad: {} }
  Mir:      { name: "Mirs Magicians",     budgetLakhs: 10000, squad: {} }

  Each team squad entry (keyed by player name with underscores):
    /teams/Heet/squad/Virat_Kohli: { name, role, iplTeam, type, priceLakhs }

/sold
  <Player_Name>: { owner: "Heet", priceLakhs: 800, ts: timestamp }

/unsold
  <Player_Name>: true
```

## Constants

- **Starting budget**: 10000 lakhs (= 100 CR)
- **Max squad**: 11 players
- **Admin password**: "ipl2026" (client-side only)
- **Player key**: `name.replace(/[\s.]/g, '_')` (e.g. "Virat_Kohli")

## Bidding Increment Rules (from rules.html)

```js
function nextBid(currentLakhs) {
  if (currentLakhs < 500)  return currentLakhs + 10;   // 10L steps up to 5CR
  if (currentLakhs < 1000) return currentLakhs + 20;   // 20L steps 5CR→10CR
  return currentLakhs + 50;                              // 50L steps above 10CR
}
```

## Price Formatting

```js
function fmtL(lakhs) {
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return (cr % 1 === 0 ? cr : cr.toFixed(1)) + ' CR';
  }
  return lakhs + ' L';
}

function basePriceToLakhs(priceStr) {
  if (priceStr === '5 CR') return 500;
  if (priceStr === '1 CR') return 100;
  return 10; // '10 L'
}
```

## Fantasy Teams Data

```js
const FTMS = [
  { k:'Heet',     n:'Heet Hurricanes',    c:'#0EA5E9', rgb:'14,165,233',  e:'🌀' },
  { k:'Divij',    n:'Divij Dragons',      c:'#DC2626', rgb:'220,38,38',   e:'🐉' },
  { k:'Vrushank', n:'Vrushank Vikings',   c:'#7C3AED', rgb:'124,58,237',  e:'⚔️' },
  { k:'Shrey',    n:'Shrey Strikers',     c:'#F59E0B', rgb:'245,158,11',  e:'⚡' },
  { k:'Malhaar',  n:'Malhaar Monarchs',   c:'#D97706', rgb:'217,119,6',   e:'👑' },
  { k:'Shivansh', n:'Shivansh Sharks',    c:'#0F766E', rgb:'15,118,110',  e:'🦈' },
  { k:'Dev',      n:'Dev Dynamos',        c:'#EA580C', rgb:'234,88,12',   e:'💥' },
  { k:'Sai',      n:'Sai Supernovas',     c:'#9333EA', rgb:'147,51,234',  e:'🌟' },
  { k:'Moksh',    n:'Moksh Mavericks',    c:'#16A34A', rgb:'22,163,74',   e:'🤠' },
  { k:'Darshan',  n:'Darshan Daredevils', c:'#BE123C', rgb:'190,18,60',   e:'😈' },
  { k:'Rishab',   n:'Rishab Risers',      c:'#0369A1', rgb:'3,105,161',   e:'🚀' },
  { k:'Div',      n:'Div Dominators',     c:'#4D7C0F', rgb:'77,124,15',   e:'👊' },
  { k:'Mir',      n:'Mirs Magicians',     c:'#BE185D', rgb:'190,24,93',   e:'🪄' },
];
```

## Auction Flow (Admin Actions)

### 1. Initialize Auction
```js
// Resets everything. Creates all 13 teams with 10000L budget.
await set(ref(db), {
  auction: { status:'idle', currentPlayer:null, currentBid:0, currentBidder:null, bidHistory:null },
  teams: { /* all 13 teams with budgetLakhs:10000, squad:{} */ },
  sold: null, unsold: null
});
```

### 2. Nominate Player
```js
await update(ref(db, 'auction'), {
  status: 'nominating',
  currentPlayer: { name, role, iplTeam, type, basePriceLakhs },
  currentBid: basePriceLakhs,
  currentBidder: null,
  bidHistory: null
});
```

### 3. Place Bid (admin clicks a team button)
```js
// First bid: stays at base price. Subsequent: nextBid(currentBid).
// Can't bid against yourself. Check budget + squad size.
const newBid = currentBidder !== null ? nextBid(currentBid) : currentBid;
const hk = push(ref(db, 'auction/bidHistory')).key;
const u = {};
u[`auction/bidHistory/${hk}`] = { team:k, amount:newBid, prevTeam:currentBidder, prevAmount:currentBid, ts:Date.now() };
u['auction/status'] = 'bidding';
u['auction/currentBid'] = newBid;
u['auction/currentBidder'] = teamKey;
await update(ref(db), u);
```

### 4. Undo Last Bid
```js
// Pop last entry from bidHistory, restore prevTeam/prevAmount
const keys = Object.keys(bidHistory);
const last = bidHistory[keys[keys.length - 1]];
u['auction/currentBid'] = last.prevAmount;
u['auction/currentBidder'] = last.prevTeam || null;
u['auction/status'] = last.prevTeam ? 'bidding' : 'nominating';
u[`auction/bidHistory/${keys[keys.length-1]}`] = null; // delete
await update(ref(db), u);
```

### 5. Sell Player
```js
const u = {};
u['auction/status'] = 'sold';
u[`teams/${buyer}/budgetLakhs`] = currentBudget - currentBid;
u[`teams/${buyer}/squad/${playerKey}`] = { name, role, iplTeam, type, priceLakhs: currentBid };
u[`sold/${playerKey}`] = { owner: buyer, priceLakhs: currentBid, ts: Date.now() };
await update(ref(db), u);
```

### 6. Mark Unsold
```js
await update(ref(db), {
  'auction/status': 'unsold',
  [`unsold/${playerKey}`]: true
});
```

### 7. Next Player → set status back to 'idle', then open picker

## Firebase Listeners (Real-time for all viewers)

```js
onValue(ref(db, 'auction'), snap => { aState = snap.val(); render(); });
onValue(ref(db, 'teams'),   snap => { tData  = snap.val() || {}; renderTeams(); });
onValue(ref(db, 'sold'),    snap => { soldD  = snap.val() || {}; updateStats(); });
onValue(ref(db, 'unsold'),  snap => { unsoldD= snap.val() || {}; updateStats(); });
```

## UI States

| Status      | Viewers See                        | Admin Controls                          |
|-------------|------------------------------------|-----------------------------------------|
| idle        | "Waiting for next player…"         | [Nominate Player] button                |
| nominating  | Player card + base price           | 13 team bid buttons + [Unsold]          |
| bidding     | Player + bid amount + bidder team  | 13 team buttons + [Undo] [Unsold] [Sold!] |
| sold        | SOLD banner + team + price         | [Next Player →]                         |
| unsold      | UNSOLD banner                      | [Next Player →]                         |

## Remaining Players (for picker)
```js
// Filter out sold + unsold from full PLAYERS array (loaded from players.csv or embedded)
const remaining = PLAYERS.filter(p => !soldD[pKey(p.N)] && !unsoldD[pKey(p.N)]);
// Sort by price tier: 5CR first, then 1CR, then 10L
```

## Key Validations Before Bid
- Team can't outbid themselves (`currentBidder !== teamKey`)
- Team has enough budget (`budgetLakhs >= newBid`)
- Team has room (`squad size < 11`)
- Disable team buttons that fail these checks

## Player Data
All 249 players from `players.csv` — embed in JS or fetch at runtime.
Format: `{ N:'Name', R:'Role', T:'IPL Team', Tp:'Indian|Overseas', P:'5 CR|1 CR|10 L' }`
