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
