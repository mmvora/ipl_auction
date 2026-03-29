#!/usr/bin/env python3
"""
Scrape MOTM (Player of the Match) awards from Wikipedia's 2026 IPL page
and update Firebase with counts per player.

Usage:
  python3 update-motm.py          # dry run
  python3 update-motm.py --push   # push to Firebase
"""

import re, json, sys, urllib.request

FIREBASE_URL = "https://iplfantasy-952c4-default-rtdb.firebaseio.com"
WIKI_URL = "https://en.wikipedia.org/wiki/2026_Indian_Premier_League"

# Map Wikipedia name → Firebase squad name (if different)
NAME_MAP = {
    "Mohammad Shami": "Mohammed Shami",
    "Shahbaz Ahmed": "Shahbaz Ahamad",
    "Digvesh Singh": "Digvesh Rathi",
    "Suryakumar Yadav": "Surya Kumar Yadav",
    "T Natarajan": "T. Natarajan",
    "Auqib Nabi": "Auqib Dar",
    "Vijaykumar Vyshak": "Vyshak Vijaykumar",
    "Varun Chakaravarthy": "Varun Chakravarthy",
    "Vaibhav Sooryavanshi": "Vaibhav Suryavanshi",
}

def pkey(name):
    return re.sub(r'[\s.]', '_', name)

def fetch_teams():
    req = urllib.request.Request(f"{FIREBASE_URL}/teams.json")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

def scrape_motm():
    req = urllib.request.Request(WIKI_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8")

    motms = re.findall(r'Player of the match.*?<a[^>]*>([^<]+)</a>', html)
    counts = {}
    for name in motms:
        name = name.strip()
        mapped = NAME_MAP.get(name, name)
        counts[mapped] = counts.get(mapped, 0) + 1
    return counts

def build_squad_index(teams):
    idx = {}
    for tk, td in teams.items():
        squad = td.get("squad", {})
        if not squad:
            continue
        for pk, p in squad.items():
            idx[p.get("name", "")] = (tk, pk)
    return idx

def main():
    dry_run = "--push" not in sys.argv

    print("🌐 Scraping MOTM awards from Wikipedia...")
    motm_counts = scrape_motm()
    total_awards = sum(motm_counts.values())
    print(f"🏆 Found {total_awards} MOTM award(s) across {len(motm_counts)} player(s)\n")

    for name, count in sorted(motm_counts.items(), key=lambda x: -x[1]):
        print(f"   {name:25s} × {count}")

    print(f"\n📥 Fetching teams from Firebase...")
    teams = fetch_teams()
    squad_idx = build_squad_index(teams)

    # Match MOTM winners to squad players
    matched = []
    unmatched = []
    firebase_motm = {}

    for name, count in motm_counts.items():
        if name in squad_idx:
            tk, pk = squad_idx[name]
            matched.append((name, tk, count))
            firebase_motm[pkey(name)] = count
        else:
            # Try case-insensitive
            found = False
            for sn, (tk, pk) in squad_idx.items():
                if sn.lower() == name.lower():
                    matched.append((sn, tk, count))
                    firebase_motm[pkey(sn)] = count
                    found = True
                    break
            if not found:
                unmatched.append((name, count))

    print(f"\n✅ In squads: {len(matched)} player(s) — worth {sum(c for _,_,c in matched) * 50} bonus pts total")
    for name, tk, count in matched:
        print(f"   {tk:12s} | {name:25s} | ×{count} = +{count * 50} pts")

    if unmatched:
        print(f"\n⚠️  Not in any squad: {len(unmatched)} player(s) (no bonus applied)")
        for name, count in unmatched:
            print(f"   {name:25s} | ×{count}")

    if dry_run:
        print(f"\n🔍 DRY RUN — would write /motm with {len(firebase_motm)} entries. Run with --push to apply.")
    else:
        print(f"\n🚀 Pushing MOTM data to Firebase...")
        data = json.dumps(firebase_motm).encode("utf-8")
        req = urllib.request.Request(
            f"{FIREBASE_URL}/motm.json",
            data=data,
            headers={"Content-Type": "application/json"},
            method="PUT"
        )
        with urllib.request.urlopen(req) as resp:
            if resp.status == 200:
                print("✅ Done! Fantasy page will update live.")
            else:
                print(f"❌ Failed with status {resp.status}")

if __name__ == "__main__":
    main()
