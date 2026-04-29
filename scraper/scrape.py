#!/usr/bin/env python3
"""Instagram profile scraper — uses feed/user API with browser session cookies."""
import json
import sys
import time
from pathlib import Path

import requests
import browser_cookie3

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
OUTPUT_JSON = Path(__file__).parent.parent / "data" / "posts.json"

IG_APP_ID = "936619743392459"
BASE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "X-IG-App-ID": IG_APP_ID,
    "Accept": "*/*",
    "Referer": "https://www.instagram.com/",
}


def build_post_record(item: dict) -> dict:
    shortcode = item.get("code", item.get("pk", ""))
    caption_obj = item.get("caption") or {}
    caption = caption_obj.get("text", "") if caption_obj else ""
    hashtags = [w.lstrip("#") for w in caption.split() if w.startswith("#")]
    mentions = [w.lstrip("@") for w in caption.split() if w.startswith("@")]
    is_video = item.get("media_type") == 2

    # Image URL: carousel → first item, video → thumbnail, photo → direct
    if "carousel_media" in item and item["carousel_media"]:
        source = item["carousel_media"][0]
    else:
        source = item
    candidates = source.get("image_versions2", {}).get("candidates", [])
    image_url = candidates[0]["url"] if candidates else ""

    return {
        "id": shortcode,
        "timestamp": item.get("taken_at", 0),
        "caption": caption,
        "hashtags": hashtags,
        "mentions": mentions,
        "is_video": is_video,
        "image_filename": f"{shortcode}.jpg",
        "_image_url": image_url,
    }


def download_image(url: str, dest: Path, session: requests.Session) -> bool:
    try:
        r = session.get(url, timeout=30, headers={"User-Agent": BASE_HEADERS["User-Agent"]})
        r.raise_for_status()
        dest.write_bytes(r.content)
        return True
    except Exception as e:
        print(f"⚠ {e}")
        return False


def make_session() -> requests.Session:
    session = requests.Session()
    for name, fn in [("Firefox", browser_cookie3.firefox), ("Chromium", browser_cookie3.chromium)]:
        try:
            cookies = fn(domain_name=".instagram.com")
            session.cookies.update(cookies)
            print(f"✓ Loaded {name} session cookies")
            return session
        except Exception as e:
            print(f"⚠ {name}: {e}")
    print("⚠ No browser cookies — unauthenticated request")
    return session


def fetch_page(session: requests.Session, user_id: str, max_id: str | None = None) -> dict:
    url = f"https://www.instagram.com/api/v1/feed/user/{user_id}/?count=12"
    if max_id:
        url += f"&max_id={max_id}"
    r = session.get(url, headers=BASE_HEADERS)
    r.raise_for_status()
    return r.json()


def get_user_id(session: requests.Session, username: str) -> str:
    url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}"
    r = session.get(url, headers=BASE_HEADERS)
    r.raise_for_status()
    return r.json()["data"]["user"]["id"]


def scrape(username: str) -> None:
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    session = make_session()

    print(f"→ Resolving user ID for: {username}")
    user_id = get_user_id(session, username)
    print(f"  user_id = {user_id}")

    all_items: list[dict] = []
    max_id = None

    while True:
        try:
            data = fetch_page(session, user_id, max_id)
        except requests.HTTPError as e:
            print(f"  ⚠ Pagination stopped ({e}) — saving {len(all_items)} posts collected so far")
            break
        items = data.get("items", [])
        all_items.extend(items)
        print(f"  fetched {len(items)} posts (total so far: {len(all_items)})")

        if not data.get("more_available") or not items:
            break
        max_id = data.get("next_max_id")
        time.sleep(1.5)

    print(f"\n→ Downloading images for {len(all_items)} posts…")
    posts = []
    for i, item in enumerate(all_items, 1):
        record = build_post_record(item)
        image_url = record.pop("_image_url")
        posts.append(record)

        dest = IMAGES_DIR / record["image_filename"]
        print(f"  [{i}/{len(all_items)}] {record['id']}", end="  ", flush=True)
        if dest.exists():
            print("(cached)")
        else:
            ok = download_image(image_url, dest, session)
            print("✓" if ok else "✗")

    OUTPUT_JSON.write_text(json.dumps(posts, indent=2, ensure_ascii=False))
    print(f"\n✓ {len(posts)} posts saved → {OUTPUT_JSON}")
    print(f"✓ Images → {IMAGES_DIR}")


if __name__ == "__main__":
    username = sys.argv[1] if len(sys.argv) > 1 else "label_gabriel"
    scrape(username)
