# Label Gabriel Instagram Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a flawless editorial-grade website for the Instagram fashion label `label_gabriel`, fed by a scraper that pulls post images, captions, and hashtags from the profile.

**Architecture:** A Python scraper (instaloader + browser cookies) downloads all posts into `data/`, producing a `posts.json` manifest. A Next.js 14 (App Router, SSG) website reads that data at build time and renders an immersive editorial gallery with Framer Motion animations and a fashion-magazine aesthetic. LibreUIUX design skills (cloned locally) guide every visual decision.

**Tech Stack:** Python 3.11 + instaloader + browser-cookie3 (scraper) · Next.js 14 App Router + TypeScript + TailwindCSS v3 + Framer Motion + Playfair Display + DM Sans (website) · LibreUIUX design-mastery skills (cloned reference)

---

## File Structure

```
LabelGabriel/
├── scraper/
│   ├── scrape.py              # Instaloader-based profile scraper
│   ├── requirements.txt       # Python deps
│   └── tests/
│       └── test_scrape.py     # Unit tests for data transform logic
├── data/
│   ├── posts.json             # Generated: all post metadata
│   └── images/                # Generated: downloaded post images (jpg)
├── website/
│   ├── app/
│   │   ├── layout.tsx         # Root layout — fonts, metadata, cursor
│   │   ├── page.tsx           # Home: Hero + Gallery
│   │   └── globals.css        # Base styles, CSS variables, grain texture
│   ├── components/
│   │   ├── Navigation.tsx     # Minimal top bar with brand name
│   │   ├── Hero.tsx           # Full-bleed video/image hero with brand statement
│   │   ├── Gallery.tsx        # Masonry/editorial grid of posts
│   │   ├── PostCard.tsx       # Individual card — image + hover reveal
│   │   └── PostModal.tsx      # Lightbox detail view with caption + hashtags
│   ├── lib/
│   │   └── posts.ts           # getPosts(), PostData type
│   ├── public/
│   │   └── images/            # Copied from data/images/ before build
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── libreui/                    # Cloned LibreUIUX reference (not deployed)
│   └── plugins/design-mastery/skills/
└── docs/
    └── design-brief.md        # LibreUIUX premium-saas-design context artifact
```

---

## Task 1: Clone LibreUIUX & Install Design Skills

**Files:**
- Create: `libreui/` (cloned repo — reference only, not deployed)
- Create: `docs/design-brief.md`
- Modify: `website/.claude/` (copy design-mastery skills into project)

- [ ] **Step 1: Clone the LibreUIUX repo**

```bash
cd /home/zenitsu/Desktop/LabelGabriel
git clone --depth=1 https://github.com/HermeticOrmus/LibreUIUX-Claude-Code.git libreui
```

Expected: `libreui/` directory with `plugins/design-mastery/` inside.

- [ ] **Step 2: Copy the relevant skills into the project `.claude/`**

```bash
mkdir -p .claude/skills
cp libreui/plugins/design-mastery/skills/design-principles/SKILL.md .claude/skills/design-principles.md
cp libreui/plugins/design-mastery/skills/premium-saas-design/SKILL.md .claude/skills/premium-saas-design.md
cp libreui/plugins/design-mastery/skills/brand-systems/SKILL.md .claude/skills/brand-systems.md
cp libreui/plugins/design-mastery/agents/design-master.md .claude/agents/design-master.md
cp libreui/plugins/design-mastery/agents/brand-architect.md .claude/agents/brand-architect.md
```

- [ ] **Step 3: Write the LibreUIUX design brief** (the "7 Context Artifacts" #1)

Create `docs/design-brief.md`:

```markdown
# Design Brief: Label Gabriel

## What We're Building
An editorial website showcasing the Instagram fashion label @label_gabriel. The site is a living gallery — a digital lookbook that elevates Instagram content into a high-fashion editorial experience.

## Primary Target Audience
- **Fashion buyers & press**: discovering the brand for the first time
- **Existing followers**: experiencing the label in a more immersive context

## Goals
1. Communicate the brand's aesthetic identity immediately (< 3 seconds)
2. Make every photograph feel intentional and artful
3. Drive Instagram follows and direct contact inquiries

## Aesthetic Reference
Dark editorial: think i-D, System Magazine, Acne Paper. Deep black ground, cream/off-white type, large uncropped imagery, generous negative space, minimal UI chrome.

## Color System
- Background: `#0A0A0A` (near-black)
- Surface: `#141414`
- Text primary: `#F0EBE1` (warm cream)
- Text muted: `#6B6560`
- Accent: `#C8A96E` (warm gold — label stitching reference)

## Typography
- Display (headings, hero): Cormorant Garamond — italic weight, high contrast
- UI (nav, captions, labels): DM Sans — light weight, wide tracking

## Sections
1. Navigation (sticky, transparent → frosted on scroll)
2. Hero (full-bleed, brand statement)
3. Gallery (editorial masonry grid, all posts)
4. Post modal (lightbox with caption + hashtags)
5. Footer (minimal — Instagram link, contact)

## Requirements
- Fully responsive (mobile-first)
- Static site (no server required — data baked at build time)
- WCAG 2.1 AA
- 60fps animations
```

- [ ] **Step 4: Commit**

```bash
git init
git add libreui/ docs/ .claude/
git commit -m "chore: add LibreUIUX design skills and design brief"
```

---

## Task 2: Python Scraper — Scaffold & Tests

**Files:**
- Create: `scraper/requirements.txt`
- Create: `scraper/scrape.py`
- Create: `scraper/tests/test_scrape.py`

- [ ] **Step 1: Create requirements.txt**

```
instaloader>=4.13
browser-cookie3>=0.19
Pillow>=10.0
```

- [ ] **Step 2: Write the failing test for `build_post_record`**

Create `scraper/tests/test_scrape.py`:

```python
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from unittest.mock import MagicMock
from scrape import build_post_record


def test_build_post_record_extracts_all_fields():
    mock_post = MagicMock()
    mock_post.shortcode = "ABC123"
    mock_post.date_utc.isoformat.return_value = "2024-03-15T12:00:00"
    mock_post.caption = "Summer drop #labelgabriel #fashion #minimal"
    mock_post.caption_hashtags = ["labelgabriel", "fashion", "minimal"]
    mock_post.caption_mentions = []
    mock_post.is_video = False
    mock_post.url = "https://example.com/img.jpg"

    record = build_post_record(mock_post)

    assert record["id"] == "ABC123"
    assert record["timestamp"] == "2024-03-15T12:00:00"
    assert record["caption"] == "Summer drop #labelgabriel #fashion #minimal"
    assert record["hashtags"] == ["labelgabriel", "fashion", "minimal"]
    assert record["mentions"] == []
    assert record["is_video"] is False
    assert record["image_filename"] == "ABC123.jpg"


def test_build_post_record_handles_empty_caption():
    mock_post = MagicMock()
    mock_post.shortcode = "XYZ789"
    mock_post.date_utc.isoformat.return_value = "2024-01-01T00:00:00"
    mock_post.caption = None
    mock_post.caption_hashtags = []
    mock_post.caption_mentions = []
    mock_post.is_video = False
    mock_post.url = "https://example.com/img.jpg"

    record = build_post_record(mock_post)

    assert record["caption"] == ""
    assert record["hashtags"] == []
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
cd scraper
pip install -r requirements.txt
python -m pytest tests/test_scrape.py -v
```

Expected: `ImportError: cannot import name 'build_post_record' from 'scrape'`

- [ ] **Step 4: Implement `scrape.py`**

```python
#!/usr/bin/env python3
"""Instagram profile scraper — downloads posts and produces posts.json."""
import json
import shutil
import sys
from pathlib import Path
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


def load_browser_session(loader: instaloader.Instaloader) -> bool:
    """Try to import Instagram session from Chrome cookies."""
    try:
        import browser_cookie3
        cookies = browser_cookie3.chrome(domain_name=".instagram.com")
        loader.context._session.cookies.update(cookies)
        print("✓ Loaded Chrome cookies for Instagram session")
        return True
    except Exception as e:
        print(f"⚠ Could not load Chrome cookies: {e}")
        return False


def scrape(username: str) -> None:
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    L = instaloader.Instaloader(
        download_pictures=True,
        download_videos=False,
        download_video_thumbnails=True,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        post_metadata_txt_pattern="",
        filename_pattern="{shortcode}",
        dirname_pattern=str(IMAGES_DIR),
    )

    load_browser_session(L)

    print(f"→ Loading profile: {username}")
    profile = instaloader.Profile.from_username(L.context, username)
    print(f"  {profile.full_name} — {profile.mediacount} posts")

    posts = []
    for i, post in enumerate(profile.get_posts(), 1):
        print(f"  [{i}/{profile.mediacount}] {post.shortcode}")
        record = build_post_record(post)
        posts.append(record)

        # Download: instaloader saves to dirname_pattern/{shortcode}.jpg
        try:
            L.download_post(post, target=IMAGES_DIR)
        except Exception as e:
            print(f"    ⚠ Download failed: {e}")

    OUTPUT_JSON.write_text(json.dumps(posts, indent=2, ensure_ascii=False))
    print(f"\n✓ Saved {len(posts)} posts → {OUTPUT_JSON}")
    print(f"✓ Images → {IMAGES_DIR}")


if __name__ == "__main__":
    username = sys.argv[1] if len(sys.argv) > 1 else "label_gabriel"
    scrape(username)
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
python -m pytest tests/test_scrape.py -v
```

Expected: `2 passed`

- [ ] **Step 6: Commit**

```bash
cd ..
git add scraper/
git commit -m "feat: add Instagram scraper with instaloader"
```

---

## Task 3: Run the Scraper

**Files:**
- Generated: `data/posts.json`
- Generated: `data/images/*.jpg`

- [ ] **Step 1: Install dependencies**

```bash
cd scraper
pip install -r requirements.txt
```

- [ ] **Step 2: Run the scraper**

```bash
python scrape.py label_gabriel
```

Expected output:
```
✓ Loaded Chrome cookies for Instagram session
→ Loading profile: label_gabriel
  Label Gabriel — N posts
  [1/N] <shortcode>
  ...
✓ Saved N posts → .../data/posts.json
✓ Images → .../data/images
```

If Chrome cookies fail (login required error), run:
```bash
# Fallback: instaloader CLI with interactive login
instaloader --login=<your_instagram_username> label_gabriel
# Then copy downloaded files to data/images/ and convert metadata manually
```

- [ ] **Step 3: Verify output**

```bash
python -c "
import json
posts = json.loads(open('../data/posts.json').read())
print(f'{len(posts)} posts loaded')
print('Sample:', posts[0])
"
```

Expected: JSON array with `id`, `caption`, `hashtags`, `image_filename` fields.

- [ ] **Step 4: Commit data manifest (not images)**

Create `data/.gitignore`:
```
images/
```

```bash
cd ..
git add data/posts.json data/.gitignore
git commit -m "feat: add scraped posts.json for label_gabriel"
```

---

## Task 4: Next.js Project Scaffold

**Files:**
- Create: `website/package.json`
- Create: `website/next.config.ts`
- Create: `website/tailwind.config.ts`
- Create: `website/app/globals.css`
- Create: `website/app/layout.tsx`

- [ ] **Step 1: Scaffold Next.js with TypeScript + Tailwind**

```bash
cd /home/zenitsu/Desktop/LabelGabriel
npx create-next-app@14 website \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-eslint
cd website
```

- [ ] **Step 2: Install Framer Motion and Google Fonts**

```bash
npm install framer-motion
npm install @next/font
```

- [ ] **Step 3: Copy scraped images to public/**

```bash
mkdir -p public/images
cp -r ../data/images/*.jpg public/images/ 2>/dev/null || true
```

- [ ] **Step 4: Write `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 5: Write `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0A",
        surface: "#141414",
        cream: "#F0EBE1",
        muted: "#6B6560",
        gold: "#C8A96E",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        ui: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Write `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-cormorant: "Cormorant Garamond", serif;
  --font-dm-sans: "DM Sans", sans-serif;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0A0A0A;
  color: #F0EBE1;
  font-family: var(--font-dm-sans);
  -webkit-font-smoothing: antialiased;
  cursor: none;
}

/* Grain overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
  z-index: 9999;
}

/* Custom cursor */
.cursor {
  position: fixed;
  width: 8px;
  height: 8px;
  background: #C8A96E;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, background 0.2s;
}

.cursor-ring {
  position: fixed;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(200, 169, 110, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s, opacity 0.3s;
}

::selection {
  background: #C8A96E;
  color: #0A0A0A;
}
```

- [ ] **Step 7: Write `app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Label Gabriel",
  description: "Fashion label — editorial lookbook",
  openGraph: {
    title: "Label Gabriel",
    description: "Fashion label — editorial lookbook",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Verify the dev server boots**

```bash
npm run dev
```

Expected: `ready - started server on http://localhost:3000`  
Open browser to `http://localhost:3000` — default Next.js page renders without errors.

- [ ] **Step 9: Commit**

```bash
git add website/
git commit -m "feat: scaffold Next.js website with editorial design system"
```

---

## Task 5: Data Layer — `lib/posts.ts`

**Files:**
- Create: `website/lib/posts.ts`
- Create: `website/lib/posts.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `website/lib/posts.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";

// We test the transform logic directly — mocking fs
vi.mock("fs", () => ({
  readFileSync: vi.fn(() =>
    JSON.stringify([
      {
        id: "ABC123",
        timestamp: "2024-03-15T12:00:00",
        caption: "Spring collection #labelgabriel",
        hashtags: ["labelgabriel"],
        mentions: [],
        is_video: false,
        image_filename: "ABC123.jpg",
      },
    ])
  ),
}));

import { getPosts, type PostData } from "./posts";

describe("getPosts", () => {
  it("returns an array of PostData", () => {
    const posts = getPosts();
    expect(posts).toHaveLength(1);
  });

  it("parses timestamp as Date", () => {
    const [post] = getPosts();
    expect(post.date).toBeInstanceOf(Date);
    expect(post.date.getFullYear()).toBe(2024);
  });

  it("derives imagePath from image_filename", () => {
    const [post] = getPosts();
    expect(post.imagePath).toBe("/images/ABC123.jpg");
  });

  it("exposes all required fields", () => {
    const [post] = getPosts();
    const required: (keyof PostData)[] = [
      "id", "caption", "hashtags", "mentions", "is_video", "imagePath", "date",
    ];
    for (const field of required) {
      expect(post).toHaveProperty(field);
    }
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd website
npx vitest run lib/posts.test.ts
```

Expected: `Cannot find module './posts'`

- [ ] **Step 3: Install Vitest**

```bash
npm install -D vitest @vitejs/plugin-react jsdom
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Implement `lib/posts.ts`**

```typescript
import fs from "fs";
import path from "path";

export interface PostData {
  id: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  is_video: boolean;
  imagePath: string;
  date: Date;
}

interface RawPost {
  id: string;
  timestamp: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  is_video: boolean;
  image_filename: string;
}

export function getPosts(): PostData[] {
  const dataPath = path.join(process.cwd(), "..", "data", "posts.json");
  const raw: RawPost[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  return raw.map((p) => ({
    id: p.id,
    caption: p.caption,
    hashtags: p.hashtags,
    mentions: p.mentions,
    is_video: p.is_video,
    imagePath: `/images/${p.image_filename}`,
    date: new Date(p.timestamp),
  }));
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npx vitest run lib/posts.test.ts
```

Expected: `4 passed`

- [ ] **Step 6: Commit**

```bash
git add lib/
git commit -m "feat: add posts data layer with type-safe getPosts()"
```

---

## Task 6: CustomCursor Component

**Files:**
- Create: `website/components/CustomCursor.tsx`

- [ ] **Step 1: Implement `CustomCursor.tsx`**

```typescript
"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top = `${y}px`;
      }
      // Lerp the ring toward the cursor
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const animate = () => {
        ringX = lerp(ringX, x, 0.12);
        ringY = lerp(ringY, y, 0.12);
        if (ringRef.current) {
          ringRef.current.style.left = `${ringX}px`;
          ringRef.current.style.top = `${ringY}px`;
        }
        rafId = requestAnimationFrame(animate);
      };
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`, visit `http://localhost:3000`. Move the mouse — a gold dot with a lagging ring should appear. The default cursor should be hidden.

- [ ] **Step 3: Commit**

```bash
git add components/CustomCursor.tsx
git commit -m "feat: add custom editorial cursor"
```

---

## Task 7: Navigation Component

**Files:**
- Create: `website/components/Navigation.tsx`

- [ ] **Step 1: Implement `Navigation.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-void/80 border-b border-cream/5"
          : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-display italic text-xl tracking-widest text-cream/90 uppercase">
        Label Gabriel
      </span>

      <a
        href="https://www.instagram.com/label_gabriel/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-ui text-xs tracking-[0.25em] text-muted uppercase hover:text-gold transition-colors duration-300"
      >
        Instagram ↗
      </a>
    </motion.nav>
  );
}
```

- [ ] **Step 2: Verify in browser**

Nav should be transparent on page load, then frost/darken after scrolling 60px.

- [ ] **Step 3: Commit**

```bash
git add components/Navigation.tsx
git commit -m "feat: add sticky editorial navigation"
```

---

## Task 8: Hero Component

**Files:**
- Create: `website/components/Hero.tsx`

- [ ] **Step 1: Implement `Hero.tsx`**

```typescript
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroProps {
  /** Path to a featured hero image (the most recent post image) */
  featuredImage: string;
}

export function Hero({ featuredImage }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden flex items-end pb-16 px-8"
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y }}
      >
        <img
          src={featuredImage}
          alt="Label Gabriel — featured look"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
      </motion.div>

      {/* Text content */}
      <motion.div className="relative z-10 max-w-3xl" style={{ opacity }}>
        <motion.p
          className="font-ui text-xs tracking-[0.4em] text-gold uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Collection
        </motion.p>

        <motion.h1
          className="font-display italic text-6xl md:text-8xl leading-none text-cream mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Label
          <br />
          <span className="not-italic font-light">Gabriel</span>
        </motion.h1>

        <motion.div
          className="w-12 h-px bg-gold"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="font-ui text-[10px] tracking-[0.3em] text-muted uppercase rotate-90 origin-center">
          Scroll
        </span>
        <div className="w-px h-12 bg-muted/40 relative overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0 h-full bg-gold"
            animate={{ y: ["−100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

The hero should show a full-bleed image with parallax on scroll, the text animates in on load, scroll indicator pulses.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add parallax editorial hero section"
```

---

## Task 9: PostCard Component

**Files:**
- Create: `website/components/PostCard.tsx`

- [ ] **Step 1: Implement `PostCard.tsx`**

```typescript
"use client";

import { motion } from "framer-motion";
import type { PostData } from "@/lib/posts";

interface PostCardProps {
  post: PostData;
  index: number;
  onClick: (post: PostData) => void;
}

export function PostCard({ post, index, onClick }: PostCardProps) {
  return (
    <motion.article
      className="relative group cursor-none overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onClick(post)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <img
          src={post.imagePath}
          alt={post.caption.slice(0, 80) || "Label Gabriel"}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
          {/* Caption preview */}
          {post.caption && (
            <p className="font-ui text-xs text-cream/80 leading-relaxed line-clamp-3 mb-3">
              {post.caption.replace(/#\w+/g, "").trim()}
            </p>
          )}

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="font-ui text-[9px] tracking-widest text-gold uppercase"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* View indicator */}
          <div className="absolute top-4 right-4 w-6 h-6 border border-cream/40 rounded-full flex items-center justify-center">
            <span className="text-cream text-xs">↗</span>
          </div>
        </div>
      </div>

      {/* Post date — below image, minimal */}
      <div className="pt-2 pb-4">
        <time className="font-ui text-[10px] tracking-[0.2em] text-muted uppercase">
          {post.date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>
    </motion.article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PostCard.tsx
git commit -m "feat: add editorial post card with hover reveal"
```

---

## Task 10: PostModal Component

**Files:**
- Create: `website/components/PostModal.tsx`

- [ ] **Step 1: Implement `PostModal.tsx`**

```typescript
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PostData } from "@/lib/posts";

interface PostModalProps {
  post: PostData | null;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  const bodyText = post?.caption.replace(/#\w+/g, "").trim() ?? "";

  return (
    <AnimatePresence>
      {post && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-void/90 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-4 md:inset-12 z-50 flex items-stretch bg-surface border border-cream/5 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Image side */}
            <div className="flex-1 relative overflow-hidden">
              <img
                src={post.imagePath}
                alt={bodyText.slice(0, 80) || "Label Gabriel"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info side */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col p-8 border-l border-cream/5 overflow-y-auto">
              {/* Close */}
              <button
                onClick={onClose}
                className="self-end font-ui text-xs tracking-widest text-muted uppercase hover:text-cream transition-colors mb-12"
              >
                Close ✕
              </button>

              {/* Brand */}
              <span className="font-display italic text-2xl text-cream mb-8">
                Label Gabriel
              </span>

              {/* Date */}
              <time className="font-ui text-[10px] tracking-[0.25em] text-gold uppercase mb-6">
                {post.date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>

              {/* Caption body */}
              {bodyText && (
                <p className="font-ui text-sm text-cream/70 leading-relaxed mb-8">
                  {bodyText}
                </p>
              )}

              {/* Divider */}
              {post.hashtags.length > 0 && (
                <div className="w-8 h-px bg-gold/40 mb-8" />
              )}

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="font-ui text-[10px] tracking-[0.2em] text-muted uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Instagram link */}
              <div className="mt-auto pt-8">
                <a
                  href={`https://www.instagram.com/p/${post.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-xs tracking-[0.25em] text-gold uppercase hover:text-cream transition-colors"
                >
                  View on Instagram ↗
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PostModal.tsx
git commit -m "feat: add editorial post lightbox modal"
```

---

## Task 11: Gallery Component

**Files:**
- Create: `website/components/Gallery.tsx`

- [ ] **Step 1: Implement `Gallery.tsx`**

```typescript
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PostCard } from "./PostCard";
import { PostModal } from "./PostModal";
import type { PostData } from "@/lib/posts";

interface GalleryProps {
  posts: PostData[];
}

export function Gallery({ posts }: GalleryProps) {
  const [selected, setSelected] = useState<PostData | null>(null);

  return (
    <section className="px-4 md:px-8 pb-24">
      {/* Section header */}
      <motion.div
        className="flex items-center gap-8 mb-12 pt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-ui text-xs tracking-[0.35em] text-muted uppercase">
          Collection
        </span>
        <div className="flex-1 h-px bg-cream/10" />
        <span className="font-ui text-xs tracking-[0.35em] text-muted uppercase">
          {posts.length} pieces
        </span>
      </motion.div>

      {/* 3-column editorial grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            index={i}
            onClick={setSelected}
          />
        ))}
      </div>

      <PostModal post={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Gallery.tsx
git commit -m "feat: add editorial gallery grid with modal integration"
```

---

## Task 12: Footer Component

**Files:**
- Create: `website/components/Footer.tsx`

- [ ] **Step 1: Implement `Footer.tsx`**

```typescript
export function Footer() {
  return (
    <footer className="border-t border-cream/5 px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-display italic text-lg text-muted">
        Label Gabriel
      </span>

      <span className="font-ui text-[10px] tracking-[0.3em] text-muted uppercase">
        {new Date().getFullYear()}
      </span>

      <a
        href="https://www.instagram.com/label_gabriel/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-ui text-[10px] tracking-[0.3em] text-muted uppercase hover:text-gold transition-colors"
      >
        @label_gabriel
      </a>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add minimal editorial footer"
```

---

## Task 13: Wire Everything in `app/page.tsx`

**Files:**
- Modify: `website/app/page.tsx`

- [ ] **Step 1: Implement the home page**

```typescript
import { getPosts } from "@/lib/posts";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const posts = getPosts();
  const featuredImage = posts[0]?.imagePath ?? "/images/placeholder.jpg";

  return (
    <main>
      <Navigation />
      <Hero featuredImage={featuredImage} />
      <Gallery posts={posts} />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Start dev server and do a full walkthrough**

```bash
npm run dev
```

Open `http://localhost:3000` and verify:

| Check | Expected |
|-------|----------|
| Hero loads with first post image | Full-bleed image, text animates in |
| Parallax on scroll | Image moves slower than page |
| Nav frosts on scroll | Backdrop-blur appears after 60px |
| Gallery loads all posts | Grid of 3 columns (desktop) |
| PostCard hover | Overlay appears, caption + hashtags visible |
| Click a card | Modal opens with full image + info |
| Press Escape | Modal closes |
| Modal close button | Modal closes |
| Custom cursor | Gold dot + lagging ring throughout |

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire together complete editorial website"
```

---

## Task 14: Responsive QA

**Files:**
- Modify: `website/components/Hero.tsx` (if layout issues found)
- Modify: `website/components/Gallery.tsx` (if layout issues found)
- Modify: `website/components/PostModal.tsx` (if layout issues found)

- [ ] **Step 1: Test mobile (375px)**

In browser DevTools → toggle device toolbar → iPhone SE preset.

Expected:
- Hero text is readable, not clipping
- Gallery shows 1 column
- Modal occupies full screen with scrollable info section

- [ ] **Step 2: Test tablet (768px)**

Expected:
- Gallery shows 2 columns
- Modal shows image + side panel side-by-side

- [ ] **Step 3: Fix any issues found**

Common fixes for mobile modal:

In `PostModal.tsx`, the panel div may need:
```tsx
className="fixed inset-0 md:inset-12 z-50 flex flex-col md:flex-row ..."
```

And the image side:
```tsx
className="h-64 md:flex-1 relative overflow-hidden"
```

- [ ] **Step 4: Commit any fixes**

```bash
git add -p  # stage only changed files
git commit -m "fix: responsive layout for mobile modal and hero"
```

---

## Task 15: Static Export & Final Build

**Files:**
- No new files — validate the build

- [ ] **Step 1: Build the static site**

```bash
npm run build
```

Expected: `Export successful` with `out/` directory generated.

- [ ] **Step 2: Preview the static build**

```bash
npx serve out
```

Visit `http://localhost:3000` and repeat the walkthrough from Task 13 Step 2.

- [ ] **Step 3: Verify no broken images**

```bash
find out/_next/static -name "*.js" | head -5
ls out/images/ | head -10
```

All images referenced in `posts.json` must exist in `out/images/`.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete editorial Label Gabriel website — static export ready"
```

---

## Self-Review Checklist

### Spec Coverage

| Requirement | Task |
|-------------|------|
| Scrape photos from label_gabriel | Task 3 |
| Scrape captions | Task 2 `build_post_record` |
| Scrape hashtags/labels | Task 2 `build_post_record` |
| No interaction data | Task 2 — `download_comments=False`, no likes/views |
| Flawless, elegant UI | Tasks 6–13 — editorial design system, Framer Motion |
| LibreUIUX repo used | Task 1 — skills installed, design brief written |
| Use browser login for scraping | Task 2 `load_browser_session` |

### Known Risks

- **Instagram anti-bot:** If instaloader is blocked, run `scrape.py` once with `--sessionfile` after a manual `instaloader --login` to cache credentials.
- **Private profile:** If `label_gabriel` is private, browser cookies loaded in `load_browser_session` handle this — but the account used must follow the profile.
- **Video posts:** `is_video: true` posts use `download_video_thumbnails=True` — they'll show as still images. Full video playback not in scope.
