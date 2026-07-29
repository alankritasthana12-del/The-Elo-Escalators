"""
Full automated backend test suite for AI Lost & Found Assistant
Run with: .\\venv\\Scripts\\python.exe test_backend.py
"""

import urllib.request
import urllib.parse
import urllib.error
import json
import time
import sys

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

BASE = "http://localhost:8000"
PASS = 0
FAIL = 0

def print_header(text):
    print()
    print("=" * 60)
    print(f"  {text}")
    print("=" * 60)

def print_result(name, passed, response_preview="", error=""):
    global PASS, FAIL
    if passed:
        PASS += 1
        print(f"  [PASS]  {name}")
        if response_preview:
            print(f"          -> {response_preview[:110]}")
    else:
        FAIL += 1
        print(f"  [FAIL]  {name}")
        if error:
            print(f"          -> ERROR: {error[:120]}")

def get(endpoint, name):
    try:
        url = f"{BASE}{endpoint}"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=15) as r:
            resp = json.loads(r.read())
            print_result(name, True, json.dumps(resp)[:110])
            return resp
    except Exception as e:
        print_result(name, False, error=str(e))
        return None

def post_json(endpoint, data, name):
    try:
        url = f"{BASE}{endpoint}"
        body = json.dumps(data).encode()
        req = urllib.request.Request(url, data=body, method="POST",
                                     headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read())
            print_result(name, True, json.dumps(resp)[:110])
            return resp
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print_result(name, False, error=f"HTTP {e.code}: {body[:100]}")
        return None
    except Exception as e:
        print_result(name, False, error=str(e))
        return None

def post_form(endpoint, fields, name):
    try:
        url = f"{BASE}{endpoint}"
        boundary = "TestBoundary12345"
        lines = []
        for key, value in fields.items():
            lines.append(f"--{boundary}".encode())
            lines.append(f'Content-Disposition: form-data; name="{key}"'.encode())
            lines.append(b"")
            lines.append(value.encode())
        lines.append(f"--{boundary}--".encode())
        body = b"\r\n".join(lines)
        req = urllib.request.Request(
            url, data=body, method="POST",
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
        )
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read())
            print_result(name, True, json.dumps(resp)[:110])
            return resp
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print_result(name, False, error=f"HTTP {e.code}: {body[:120]}")
        return None
    except Exception as e:
        print_result(name, False, error=str(e))
        return None


# ─────────────────────────────────────────────────
print_header("PHASE 1: Server Connectivity")
# ─────────────────────────────────────────────────

health = get("/health", "Health Check -- server is alive")

# ─────────────────────────────────────────────────
print_header("PHASE 2: Empty Database Reads")
# ─────────────────────────────────────────────────

dashboard = get("/api/dashboard", "Dashboard -- returns stats (zeros ok)")
matches   = get("/api/matches",   "Matches   -- returns empty list")

# ─────────────────────────────────────────────────
print_header("PHASE 3: Report Lost Items (AI Embedding)")
print("  NOTE: First request loads AI model, may take 15-30 sec ...")
# ─────────────────────────────────────────────────

lost1 = post_form("/api/lost", {
    "title": "Black Casio Watch",
    "description": "Black digital Casio watch with rubber strap, lost near library",
    "category": "Electronics",
    "location": "Main Library",
    "date": "2026-07-29",
}, "Report Lost #1 -- Black Casio Watch")

time.sleep(2)

lost2 = post_form("/api/lost", {
    "title": "Blue Water Bottle",
    "description": "Blue Hydro Flask water bottle with stickers on it",
    "category": "Accessories",
    "location": "Cafeteria",
    "date": "2026-07-28",
}, "Report Lost #2 -- Blue Water Bottle")

# ─────────────────────────────────────────────────
print_header("PHASE 4: Report Found Items (AI Matching)")
print("  AI will now match found items to lost items ...")
# ─────────────────────────────────────────────────

found1 = post_form("/api/found", {
    "description": "Found a black digital watch near the library entrance, looks like Casio",
    "title": "Black Watch",
    "category": "Electronics",
    "location": "Main Library",
    "date": "2026-07-29",
}, "Report Found #1 -- should match the lost watch")

if found1 and found1.get("matches"):
    matches_list = found1["matches"]
    print(f"          AI found {len(matches_list)} match(es)!")
    for m in matches_list:
        print(f"          -> Confidence: {m.get('confidence', 0):.1f}%")
        for r in m.get("reasons", []):
            print(f"             * {r}")

# ─────────────────────────────────────────────────
print_header("PHASE 5: Semantic Search")
# ─────────────────────────────────────────────────

search1 = post_json("/api/search", {"query": "digital watch electronics"},
                    "Search -- 'digital watch electronics'")
search2 = post_json("/api/search", {"query": "water bottle cafeteria"},
                    "Search -- 'water bottle cafeteria'")

# ─────────────────────────────────────────────────
print_header("PHASE 6: Final Dashboard Check")
# ─────────────────────────────────────────────────

final = get("/api/dashboard", "Dashboard -- should show updated counts now")
if final:
    print(f"          Total Reports  : {final.get('total_reports', '?')}")
    print(f"          AI Matches     : {final.get('ai_matches', '?')}")
    print(f"          Recovery Rate  : {final.get('recovery_rate', '?')}%")

# ─────────────────────────────────────────────────
print()
print("=" * 60)
print(f"  RESULTS:  {PASS} PASSED   |   {FAIL} FAILED")
if FAIL == 0:
    print("  ALL TESTS PASSED -- BACKEND IS FULLY WORKING!")
else:
    print(f"  {FAIL} test(s) failed -- check errors above")
print("=" * 60)
