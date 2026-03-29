#!/usr/bin/env python3
"""
Parse points-input.html and update Firebase player points.
Surfaces name mismatches for manual override via NAME_MAP.

Usage:
  python3 update-points.py          # dry run — shows what would be updated
  python3 update-points.py --push   # actually pushes to Firebase
"""

import re, json, sys, urllib.request

FIREBASE_URL = "https://iplfantasy-952c4-default-rtdb.firebaseio.com"

# ── Manual name overrides ──
# Map IPL Fantasy site name → name as stored in your Firebase squad
# Add entries here when the script reports mismatches
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

def fetch_teams():
    req = urllib.request.Request(f"{FIREBASE_URL}/teams.json")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

def parse_points(filepath="points-input.html"):
    with open(filepath, "r") as f:
        html = f.read()
    names = re.findall(r'plyrSel__name.*?<span>(.*?)</span>', html, re.DOTALL)
    points = re.findall(r'tbl__cell--amt.*?<span>(.*?)</span>', html, re.DOTALL)
    return {n.strip(): float(p.strip()) for n, p in zip(names, points)}

def build_squad_index(teams):
    """Build name→(teamKey, playerKey) index from Firebase teams data."""
    idx = {}
    for tk, td in teams.items():
        squad = td.get("squad", {})
        if not squad:
            continue
        for pk, p in squad.items():
            name = p.get("name", "")
            idx[name] = (tk, pk)
    return idx

def main():
    dry_run = "--push" not in sys.argv

    print("📥 Fetching teams from Firebase...")
    teams = fetch_teams()
    squad_idx = build_squad_index(teams)
    all_squad_names = set(squad_idx.keys())

    print(f"📋 Found {len(all_squad_names)} players across all squads\n")

    print("📄 Parsing points-input.html...")
    site_points = parse_points()
    print(f"📋 Found {len(site_points)} players with points\n")

    # Match site names to squad names
    updates = {}
    matched = []
    mismatched = []

    for squad_name, (team_key, player_key) in squad_idx.items():
        # Try direct match
        if squad_name in site_points:
            pts = site_points[squad_name]
            updates[f"teams/{team_key}/squad/{player_key}/points"] = pts
            matched.append((squad_name, team_key, pts))
            continue

        # Try NAME_MAP override
        mapped = None
        for site_name, fb_name in NAME_MAP.items():
            if fb_name == squad_name and site_name in site_points:
                mapped = site_name
                break

        if mapped:
            pts = site_points[mapped]
            updates[f"teams/{team_key}/squad/{player_key}/points"] = pts
            matched.append((squad_name, team_key, pts))
            continue

        # Try case-insensitive / fuzzy
        found = False
        for site_name, pts in site_points.items():
            if site_name.lower() == squad_name.lower():
                updates[f"teams/{team_key}/squad/{player_key}/points"] = pts
                matched.append((squad_name, team_key, pts))
                found = True
                break

        if not found:
            mismatched.append((squad_name, team_key, player_key))

    # Report
    print(f"✅ Matched: {len(matched)} players")
    if matched:
        for name, tk, pts in sorted(matched, key=lambda x: x[1]):
            print(f"   {tk:12s} | {name:25s} | {pts} pts")

    if mismatched:
        print(f"\n❌ UNMATCHED: {len(mismatched)} players (no points found on site)")
        print("   Add overrides to NAME_MAP in update-points.py if name differs on site\n")
        for name, tk, pk in sorted(mismatched, key=lambda x: x[1]):
            print(f"   {tk:12s} | {name:25s} | key: {pk}")

    if dry_run:
        print(f"\n🔍 DRY RUN — {len(updates)} updates ready. Run with --push to apply.")
    else:
        if not updates:
            print("\n⚠️  Nothing to update.")
            return

        print(f"\n🚀 Pushing {len(updates)} updates to Firebase...")
        data = json.dumps(updates).encode("utf-8")
        req = urllib.request.Request(
            f"{FIREBASE_URL}/.json",
            data=data,
            headers={"Content-Type": "application/json", "X-HTTP-Method-Override": "PATCH"},
            method="PATCH"
        )
        with urllib.request.urlopen(req) as resp:
            if resp.status == 200:
                print("✅ Done! Fantasy page will update live.")
            else:
                print(f"❌ Failed with status {resp.status}")

if __name__ == "__main__":
    main()
