#!/usr/bin/env python3
"""Instagram profile scraper — downloads posts and produces posts.json."""
import json
import sys
from pathlib import Path

import requests
import instaloader

IMAGES_DIR = Path(__file__).parent.parent / "data" / "images"
OUTPUT_JSON = Path(__file__).parent.parent / "data" / "posts.json"


def build_post_record(post) -> dict:
    return {
        "id": post.shortcode,
        "timestamp": post.date_utc.isoformat(),
        "caption": post.caption or "",
        "hashtags": list(post.caption_hashtags),
        "mentions": list(post.caption_mentions),
        "is_video": post.is_video,
        "image_filename": f"{post.shortcode}.jpg",
    }


def download_image(url: str, dest: Path) -> bool:
    """Download image directly for clean {shortcode}.jpg filename control."""
    try:
        r = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0"})
        r.raise_for_status()
        dest.write_bytes(r.content)
        return True
    except Exception as e:
        print(f"    ⚠ Image download failed: {e}")
        return False


def load_browser_session(loader: instaloader.Instaloader) -> bool:
    """Try to import Instagram session from Chrome cookies."""
    try:
        import browser_cookie3
        cookies = browser_cookie3.chrome(domain_name=".instagram.com")
        loader.context._session.cookies.update(cookies)
        print("✓ Loaded Chrome session cookies")
        return True
    except Exception as e:
        print(f"⚠ Could not load Chrome cookies: {e}")
        return False


def scrape(username: str) -> None:
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    L = instaloader.Instaloader(
        download_pictures=False,   # we handle downloads ourselves
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        quiet=True,
    )

    load_browser_session(L)

    print(f"→ Loading profile: {username}")
    try:
        profile = instaloader.Profile.from_username(L.context, username)
    except instaloader.exceptions.ProfileNotExistsException:
        print(f"✗ Profile '{username}' not found")
        sys.exit(1)

    total = profile.mediacount
    print(f"  {profile.full_name} — {total} posts")

    posts = []
    for i, post in enumerate(profile.get_posts(), 1):
        print(f"  [{i}/{total}] {post.shortcode}", end="  ", flush=True)
        record = build_post_record(post)
        posts.append(record)

        dest = IMAGES_DIR / record["image_filename"]
        if dest.exists():
            print("(cached)")
        else:
            ok = download_image(post.url, dest)
            print("✓" if ok else "✗")

    OUTPUT_JSON.write_text(json.dumps(posts, indent=2, ensure_ascii=False))
    print(f"\n✓ Saved {len(posts)} posts → {OUTPUT_JSON}")
    print(f"✓ Images → {IMAGES_DIR}")


if __name__ == "__main__":
    username = sys.argv[1] if len(sys.argv) > 1 else "label_gabriel"
    scrape(username)
