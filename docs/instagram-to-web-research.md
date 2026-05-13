# Instagram → Web: Complete Research Compendium
*Deep reference for building next-level websites from Instagram business pages*

---

## Table of Contents

1. [The Instagram Data Pipeline](#1-the-instagram-data-pipeline)
2. [Brand DNA Extraction](#2-brand-dna-extraction)
3. [Multi-Page Architecture from Instagram Data](#3-multi-page-architecture-from-instagram-data)
4. [Advanced Visual Techniques Arsenal](#4-advanced-visual-techniques-arsenal)
   - [Scroll & Motion](#41-scroll--motion)
   - [3D, WebGL & Shaders](#42-3d-webgl--shaders)
   - [Post-Processing Effects](#43-post-processing-effects)
   - [Cursors & Micro-interactions](#44-cursors--micro-interactions)
   - [UI Kits with Personality](#45-ui-kits-with-personality)
   - [Page Transitions & Routing](#46-page-transitions--routing)
   - [Typography Effects](#47-typography-effects)
   - [Ambience & Audio](#48-ambience--audio)
   - [Physics & Playful Interactions](#49-physics--playful-interactions)
   - [Particles & Canvas](#410-particles--canvas)
5. [What We Built in Label Gabriel](#5-what-we-built-in-label-gabriel)
6. [The Next-Level Upgrade Path](#6-the-next-level-upgrade-path)

---

## 1. The Instagram Data Pipeline

### 1.1 Extraction Methods

**What We Built (Custom Python Scraper)**
Our scraper (`scraper/scrape.py`) uses Instagram's private API directly:
- Endpoint: `GET /api/v1/feed/user/{user_id}/?count=12`
- Auth: Browser cookies via `browser_cookie3` (reads from Firefox or Chromium)
- Pagination: `max_id` cursor until `more_available: false`
- Rate limiting: 3s sleep between pages
- Data per post: shortcode, timestamp, caption, hashtags, mentions, media_type, image_url candidates

**Alternative Services (when our scraper breaks)**
Instagram updates its GraphQL `doc_id` values every 2–4 weeks, breaking scrapers.

| Service | Approach | Best For |
|---|---|---|
| **Apify** | Actor templates, no-code | Quick setup, non-technical clients |
| **ScraperAPI** | Managed proxy rotation | Robust scraping, API key |
| **EnsembleData** | Dedicated IG API | High-volume, structured data |
| **ScrapeGraphAI** | AI-powered (describe in English) | Flexibility, novel data shapes |
| **Zyte** | Smart proxy + browser | Heavy anti-bot sites |

**What We Can Extract**
```
Profile:
  - bio (text, emojis, links, phone numbers)
  - follower_count, following_count
  - is_business, is_verified
  - profile_pic_url
  - category (Fashion, Beauty, etc.)
  - business contact (email, phone, address)

Posts:
  - id / shortcode
  - timestamp (unix → date)
  - caption (full text, emojis, hashtags, mentions)
  - hashtags[] (parsed from caption)
  - mentions[] (tagged accounts)
  - media_type (1=photo, 2=video, 8=carousel)
  - image_url (multiple resolutions via candidates[])
  - carousel_media[] (each child item)
  - is_video flag
  - like_count, comment_count (if accessible)
  - location (if tagged)
  - accessibility_caption (IG's AI alt text)
```

### 1.2 Data Schema (Our Standard)

```json
{
  "id": "shortcode",
  "timestamp": 1763213400,
  "caption": "full caption text",
  "hashtags": ["tag1", "tag2"],
  "mentions": ["username1"],
  "is_video": false,
  "image_filename": "shortcode.jpg",
  "category": "bridal"
}
```

**Enhancement: Add `category` field** during build via hashtag matching so downstream components don't need to re-compute it.

### 1.3 Image Handling

- Download highest-resolution candidate at scrape time
- Store locally in `data/images/`
- Next.js: copy to `public/images/` or serve via `next/image` with local loader
- Video posts: download thumbnail image (same pipeline)
- Future: use `image_versions2.candidates` array to get multiple sizes → responsive `srcset`

---

## 2. Brand DNA Extraction

The most important step before writing a single line of CSS. Read the Instagram page like a designer, not a developer.

### 2.1 Color System

**Tools**
- **Colorkuler** (`colorkuler.com`): Instagram-specific, analyzes recent posts, scores color harmony + contrast ratios
- **Coolors Image Picker** (`coolors.co/image-picker`): extract from any image
- **PixelPanda** (`pixelpanda.ai`): dominant / vibrant / muted / complementary / Tailwind modes
- **node-vibrant** (npm): programmatic palette extraction from images — ideal for automation
- **color-thief** (npm): dominant color + palette from images in JS

**What to Look For**
- Background bias: Is the feed dark, light, warm, or cool?
- Accent frequency: What color appears on products, decorations, skin tones?
- Desaturation style: Editorial (muted), commercial (vivid), moody (crushed blacks)?
- Neutrals: What are the shadows and mid-tones?

**Label Gabriel's Color DNA**: warm parchment backgrounds, cream+blush garments, gold accents → `#FDFAF6`, `#1C1714`, `#C4A35A`

### 2.2 Typography Signals

**Tools**
- **Peek** (Chrome extension, `trypeek.app`): extracts fonts from any website
- **Brand Kit Extractor** (Chrome extension): colors + fonts + logos
- **WhatFont** (Chrome extension): hover to identify fonts

**What to Look For From Instagram**
- Text overlaid on posts: font weight, case, spacing style
- Story text: font choices (Instagram's built-in fonts reveal aesthetic)
- Caption style: short punchy vs long editorial → writing register
- Caption language: formal/casual, emoji density, multilingual

**Decision Framework**
| Feel | Display Font | UI Font |
|---|---|---|
| Luxury / editorial | Cormorant, Playfair Display, EB Garamond | DM Sans, Inter, Neue Haas Grotesk |
| Modern minimal | Editorial New, Migra | Space Grotesk, Satoshi |
| Playful / artisan | Syne, Cabinet Grotesk | Plus Jakarta Sans |
| Romantic / bridal | Italiana, Libre Baskerville | Lato, Source Sans |

### 2.3 Mood & Aesthetic Archetype

Classify the brand's visual world before opening a code editor:

| Archetype | Signals | Visual Language |
|---|---|---|
| Dark Editorial | Near-black feed, high contrast, magazine-like | Full-bleed, generous negative space, serif display |
| Warm Artisan | Earthy tones, natural light, handmade feel | Textured backgrounds, imperfect grids, warm typography |
| Clean Minimal | White/light backgrounds, product-focused | Grid-heavy, icon-driven, geometric |
| Maximalist Vibrant | Saturated colors, dense composition | Color-block sections, bold display type |
| Romantic Soft | Blush/pastels, flowers, bridal | Soft gradients, script accents, gentle animations |

Label Gabriel: **Warm Artisan** with touches of **Romantic Soft** (bridal) and **Dark Editorial** (our design choice to elevate it).

### 2.4 Content Categorization

**Algorithm for automatic page detection**:
```python
from collections import Counter

def detect_categories(posts, min_posts=3):
    """Cluster posts into pages based on hashtag frequency."""
    hashtag_counts = Counter()
    for post in posts:
        for tag in post["hashtags"]:
            hashtag_counts[tag.lower()] += 1

    # Get tags appearing in >= min_posts
    significant = {tag: n for tag, n in hashtag_counts.items() if n >= min_posts}

    # Semantic grouping (manually curated or via NLP)
    CATEGORY_SEEDS = {
        "bridal":  ["bridalsaree", "keralabride", "bridalwear", "weddingdress", "bridalgown"],
        "baptism": ["baptismdress", "christeningoutfit", "baptismday", "babybaptism"],
        "ethnic":  ["indianfashion", "ethnicwear", "pattayasalwar", "traditionalelegance"],
        "custom":  ["custommade", "custombridal", "handcrafted", "kidsboutique"],
        "salon":   ["homesalonservice", "kannursalon", "beautyathome"],
    }

    categorized = {}
    for post in posts:
        for category, seeds in CATEGORY_SEEDS.items():
            if any(h.lower() in seeds for h in post["hashtags"]):
                categorized.setdefault(category, []).append(post)
                break
    return categorized
```

### 2.5 Caption Intelligence

Mine captions for:
- **Brand voice**: formal/casual, emoji use, poetic/direct
- **CTAs**: "DM us", "Book now", "Call", "Tag a friend" → action buttons + CTA copy
- **Testimonial candidates**: posts beginning "She/He felt..." or client-story structure
- **Price mentions**: extract for product cards
- **Location**: explicit mentions or hashtags (`#alakode`, `#kerala`) → `LocalBusiness` schema
- **Language**: multilingual (Malayalam + English for Label Gabriel) → `lang` attribute, hreflang
- **Narrative arc**: Reel captions with "Part 1/2/3" → potential blog series

---

## 3. Multi-Page Architecture from Instagram Data

### 3.1 Standard Page Set

Every Instagram business site should consider these pages:

```
/ (Home)
  Hero + Brand statement + Category teasers + Contact CTA

/gallery
  All posts, filterable by category, masonry or grid layout

/collections/[slug]  (one per hashtag cluster)
  e.g. /collections/bridal, /collections/baptism

/post/[id]
  Individual post: full image, caption, hashtags, related posts

/about
  Bio text + brand story + location + founding year

/contact
  Inquiry form + phone (from captions) + location map + Instagram link

/services  (if applicable)
  Service-type posts grouped — salon, styling, makeup
```

### 3.2 Navigation Patterns

| Pattern | Best For | Example |
|---|---|---|
| Top nav, transparent → frosted | Editorial/luxury brands | What we built |
| Full-screen overlay | Fashion, minimal | Open hamburger → covers viewport |
| Mega menu with image previews | Multi-category | Hover on "Bridal" → shows photo grid |
| Center logo, split nav | Logo-strong brands | Links left + right of logo |
| Side drawer | Content-heavy | Blog-style sites |
| Tabbed bottom nav | Mobile-first | E-commerce conversion sites |

### 3.3 Routing in Next.js App Router

```
app/
  layout.tsx        # Font loading, cursor, smooth scroll
  page.tsx          # Home
  gallery/
    page.tsx        # All posts
  collections/
    [slug]/
      page.tsx      # Dynamic — receives slug, filters posts
  post/
    [id]/
      page.tsx      # Individual post
  about/
    page.tsx
  contact/
    page.tsx
```

**Static generation** for all posts (ISR or full static):
```ts
// collections/[slug]/page.tsx
export async function generateStaticParams() {
  return CATEGORIES.map(slug => ({ slug }));
}
```

### 3.4 Content Inventory (Label Gabriel Specific)

From hashtag analysis of `posts.json`:

| Page | Hashtag Triggers | Posts |
|---|---|---|
| Bridal Collection | bridalsaree, keralabride, bridalwear, weddingdress, bridalgown | ~40% |
| Baptism & Christening | baptismdress, christeningoutfit, baptismday | ~15% |
| Ethnic & Traditional | indianfashion, ethnicwear, pattayasalwar | ~20% |
| Custom & Kids | custommade, handcrafted, kidsboutique | ~15% |
| **Salon** (new discovery) | homesalonservice, kannursalon, beautyathome | ~10% |
| Behind the Brand | brandstory, behindthebrand, boutiqueowner | uncategorized |

The **Salon** category (`labelgabrielsalon.com` mentioned in caption) was discovered in the data — it's effectively a second brand/business that could be a separate site or sub-section.

---

## 4. Advanced Visual Techniques Arsenal

### 4.1 Scroll & Motion

#### GSAP + ScrollTrigger *(industry standard)*
**Install**: `npm i gsap` — ScrollTrigger is included.

Key patterns:
```js
// Pin a section while content scrolls inside it
ScrollTrigger.create({
  trigger: ".section",
  pin: true,
  start: "top top",
  end: "+=300%",
  scrub: 1
})

// Animate on scroll entry
gsap.from(".card", {
  scrollTrigger: { trigger: ".card", start: "top 80%" },
  y: 60, opacity: 0, stagger: 0.1, duration: 0.8
})

// Scrub: animation tied to scroll position (not time)
gsap.to(".hero-img", {
  scrollTrigger: { trigger: ".hero", scrub: 0.5 },
  scale: 1.15, y: -80
})

// Batch: many elements
ScrollTrigger.batch(".item", {
  onEnter: (elements) => gsap.from(elements, { y: 40, opacity: 0, stagger: 0.05 })
})

// Responsive
ScrollTrigger.matchMedia({
  "(min-width: 768px)": function() { /* desktop animations */ },
  "(max-width: 767px)": function() { /* mobile animations */ }
})
```

Key plugins:
- `ScrollTrigger` — scroll-linked animations
- `ScrollSmoother` — native smooth scroll + scrub (GSAP Club)
- `SplitText` — text splitting (free since v3.13)
- `ScrambleTextPlugin` — character scramble
- `MotionPathPlugin` — animate along SVG paths
- `MorphSVGPlugin` — morph between SVG shapes
- `Flip` — FLIP animations for layout changes

#### Framer Motion *(React-native, declarative)*
**Install**: `npm i framer-motion`

Key hooks:
```ts
const x = useMotionValue(0)           // Raw motion value (no re-render)
const sx = useSpring(x, { stiffness: 100, damping: 15 })  // Spring-smoothed
const y = useTransform(x, [0, 1], [0, 100])  // Derived transform
const bg = useMotionTemplate`rgb(${r}, ${g}, ${b})`  // CSS string template
```

Patterns:
- `whileHover`, `whileTap`, `whileInView` — state-based animation
- `AnimatePresence` — enter/exit animations (required for page transitions)
- `layout` prop — automatic FLIP animation on layout change
- `drag` with `dragConstraints` — draggable elements
- `variants` — named states with orchestration

#### Lenis *(smooth scroll)*
**Install**: `npm i lenis`

```ts
// With React (what we use):
import Lenis from "lenis"

const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
```

Key properties:
- `lerp` (0–1): interpolation amount — lower = smoother/slower
- `smoothTouch: false` — don't override mobile (important for UX)
- `syncTouch: true` — sync to touch velocity instead
- Native scroll (not hijacked) → accessible, no Barba.js conflicts

---

### 4.2 3D, WebGL & Shaders

#### Stack

```
Three.js (core WebGL)
  └── React Three Fiber (React renderer)
        ├── @react-three/drei (helpers)
        ├── @react-three/postprocessing (effects)
        └── @react-three/rapier (physics)
```

**Install**: `npm i three @react-three/fiber @react-three/drei`

#### Basic Scene Setup
```tsx
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Environment preset="studio" />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}
```

#### Key `@react-three/drei` Helpers

```tsx
<Text font="/fonts/Cormorant.woff" fontSize={1}>Label Gabriel</Text>
<Image url="/images/post.jpg" scale={[3, 4]} />
<Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
  {/* floating object */}
</Float>
<Sparkles count={50} size={2} speed={0.4} />
<Html position={[0, 1, 0]}>
  <div className="label">DOM in 3D space</div>
</Html>
```

#### Custom Shader Material
```tsx
import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"

const WaveMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("hotpink") },
  // vertex shader
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  // fragment shader
  `uniform float uTime;
   uniform vec3 uColor;
   varying vec2 vUv;
   void main() {
     float wave = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
     gl_FragColor = vec4(uColor * wave, 1.0);
   }`
)

extend({ WaveMaterial })

function WaveMesh() {
  const mat = useRef()
  useFrame(({ clock }) => { mat.current.uTime = clock.elapsedTime })
  return (
    <mesh>
      <planeGeometry args={[3, 2, 32, 32]} />
      <waveMaterial ref={mat} />
    </mesh>
  )
}
```

#### GSAP + WebGL Shaders *(new pattern, Codrops 2025)*
Animate shader uniforms with GSAP for scroll-driven ripples, reveals, and blurs:
```js
// On scroll: animate a displacement uniform
gsap.to(shaderUniforms, {
  uDistortion: 0.8,
  scrollTrigger: { trigger: ".section", scrub: true }
})
```

#### WebGPU (Three.js r171+, Sept 2025)
```js
import WebGPURenderer from "three/src/renderers/webgpu/WebGPURenderer.js"
const renderer = new WebGPURenderer()
// Automatic WebGL 2 fallback built in
```

TSL (Three Shader Language) — write shaders that compile to both WGSL and GLSL:
```js
import { color, uv, sin, timerLocal } from "three/tsl"
const material = new MeshBasicNodeMaterial()
material.colorNode = sin(uv().x.add(timerLocal())).mix(color("red"), color("blue"))
```

#### Spline *(visual 3D, no-code)*
Design 3D scenes at `spline.design` → export as React component or `<spline-viewer>` web component. Best for hero decorations, product showcases, logo reveals.

---

### 4.3 Post-Processing Effects

**Install**: `npm i @react-three/postprocessing postprocessing`

```tsx
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

function Effects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.4}   // only bright areas glow
        luminanceSmoothing={0.9}
        intensity={0.6}
        mipmapBlur                  // high-quality blur
      />
      <ChromaticAberration
        offset={[0.002, 0.002]}    // RGB split amount
        radialModulation            // stronger at edges
        modulationOffset={0.5}
      />
      <Vignette darkness={0.5} offset={0.4} />
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
}
```

Available effects:
| Effect | Use Case |
|---|---|
| `Bloom` | Glowing lights, luxury shimmer |
| `ChromaticAberration` | Glitch, cinematic lens |
| `Vignette` | Dark corners, focus center |
| `Noise` / `FilmGrain` | Texture, grain, analog feel |
| `DepthOfField` | Bokeh blur on bg objects |
| `MotionBlur` | Fast camera movement |
| `SSAO` | Subtle shadow between objects |
| `ToneMapping` | ACES, Reinhard — cinema look |

---

### 4.4 Cursors & Micro-interactions

#### What We Built (Label Gabriel)
- Dual-layer cursor: gold dot (instant) + ring (RAF lerp at 12%)
- Magnetic CTA button (Framer Motion spring, 35% attraction)
- Cursor glow on right panel (radial-gradient via `useMotionTemplate`)

#### Cursor Libraries
- **Cursify** (`npm i cursify-react`): bubble effect, React/Next.js native
- **MagicMouse.js**: circle follower with hover expand
- **Motion+ Cursor** (Motion library): magnetic zones, snapping, morphing to shapes
- **Custom RAF approach** (what we use): most control, best performance

#### Cursor States (pattern)
```tsx
// Change cursor mode on hover over different element types
const [cursorMode, setCursorMode] = useState<"default" | "view" | "drag" | "link">("default")

// On image hover: ring becomes "VIEW" text
// On draggable: ring becomes "DRAG"
// On link: ring shrinks, dot disappears
```

#### Magnetic Button Pattern
```tsx
function MagneticButton({ children }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18 })
  const sy = useSpring(y, { stiffness: 200, damping: 18 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.35)
    y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  return (
    <motion.div style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}
```

#### 3D Tilt Card
```tsx
function TiltCard({ children }) {
  const rotateX = useMotionValue(0), rotateY = useMotionValue(0)

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - r.top - r.height / 2) / (r.height / 2)
    const y = (e.clientX - r.left - r.width / 2) / (r.width / 2)
    rotateX.set(-x * 15)
    rotateY.set(y * 15)
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0) }}
    >
      {children}
    </motion.div>
  )
}
```

#### Image Reveal on Hover (clip-path)
```css
.reveal-img {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.parent:hover .reveal-img {
  clip-path: inset(0 0% 0 0);
}
```

#### Ripple on Click
```tsx
function Ripple({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gold/20 pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ width: 0, height: 0, x: "-50%", y: "-50%", opacity: 0.6 }}
      animate={{ width: 120, height: 120, opacity: 0 }}
      transition={{ duration: 0.6 }}
    />
  )
}
```

---

### 4.5 UI Kits with Personality

#### Aceternity UI *(highly animated, polished)*
`https://ui.aceternity.com/` — copy-paste components, no npm install needed.

Best components for fashion/editorial:
- **TracingBeam**: scroll progress line with glow (we already use this!)
- **Spotlight**: dramatic cursor-following light
- **Background Beams**: flowing light lines for hero
- **Aurora Background**: shifting color gradient backdrop
- **Moving Border**: animated gradient border
- **3D Card Effect**: perspective tilt on hover
- **Text Generate Effect**: character-by-character reveal
- **Typewriter Effect**: typing animation
- **Wavy Background**: SVG wave animation

#### Magic UI *(50+ animated, ShadCN-based)*
`https://magicui.design/` — install via CLI: `npx shadcn@latest add "https://magicui.design/r/[component]"`

Best components:
- **AnimatedBeam**: glowing lines between elements (connection visualization)
- **BlurIn**: content fades in from blur
- **BorderBeam**: spinning gradient border
- **NumberTicker**: count-up animation (we built our own — Magic UI's is cleaner)
- **WordFadeIn**: word-by-word stagger reveal
- **Shimmer Button**: gradient shimmer CTA
- **Particles**: tsparticles integration
- **Meteors**: diagonal shooting stars background

#### Cult UI *(AI blocks, full Next.js templates)*
`https://www.cult-ui.com/` — production-ready blocks.

Key strengths:
- Full-page templates (not just components)
- AI-generated layout blocks
- Dark mode first

#### Motion+ (from Motion library team)
`https://motion.dev/plus` — paid, but:
- **Cursor**: magnetic zones, snapping, morphing
- **Presence**: sophisticated enter/exit
- **Ticker**: scroll-driven text ticker

---

### 4.6 Page Transitions & Routing

#### View Transitions API *(native browser, 2025+)*
No library needed. Chrome/Edge only (with graceful degradation).

```ts
// Trigger a view transition
document.startViewTransition(() => {
  // DOM update here
  router.push("/gallery")
})
```

```css
/* Name elements for shared-element transitions */
.hero-image { view-transition-name: hero-img; }

/* Customize the animation */
::view-transition-old(hero-img) {
  animation: slide-out 0.4s ease-in;
}
::view-transition-new(hero-img) {
  animation: slide-in 0.4s ease-out;
}
```

Best for: same-domain navigation with shared elements (hero photo → post page).

#### Framer Motion + Next.js App Router
```tsx
// layout.tsx
import { AnimatePresence } from "framer-motion"

export default function Layout({ children }) {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  )
}

// page.tsx
const variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
}

export default function Page() {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {/* content */}
    </motion.main>
  )
}
```

#### Barba.js *(classic, GSAP-friendly)*
`npm i @barba/core`

```js
barba.init({
  transitions: [{
    name: "default",
    leave: ({ current }) => gsap.to(current.container, { opacity: 0, y: -30, duration: 0.4 }),
    enter: ({ next }) => gsap.from(next.container, { opacity: 0, y: 30, duration: 0.4 })
  }]
})
```

Note: Works with Lenis without conflicts (Lenis uses native scroll).

---

### 4.7 Typography Effects

#### GSAP SplitText *(free since v3.13)*
```js
import { SplitText } from "gsap/SplitText"
gsap.registerPlugin(SplitText)

const split = new SplitText(".headline", { type: "chars,words,lines" })

// Character stagger with mask (cinematic reveal)
gsap.from(split.chars, {
  opacity: 0, yPercent: 110, duration: 0.6,
  stagger: 0.03, ease: "power3.out"
})
// Note: mask mode wraps each char in overflow:hidden span
```

#### GSAP ScrambleText
```js
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
gsap.registerPlugin(ScrambleTextPlugin)

gsap.to(".title", {
  duration: 2,
  scrambleText: {
    text: "Label Gabriel",
    chars: "upperCase",    // or custom: "!@#$%^&*"
    revealDelay: 0.5,       // hold scrambled state before revealing
    speed: 0.4
  }
})
```

#### Framer Motion Character Stagger
```tsx
function AnimatedTitle({ text }: { text: string }) {
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          variants={{
            hidden: { opacity: 0, y: 40, rotateX: -90 },
            visible: { opacity: 1, y: 0, rotateX: 0 }
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}
```

#### Vanilla Scramble (no library)
```ts
function scramble(el: HTMLElement, finalText: string) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  let iteration = 0
  const interval = setInterval(() => {
    el.textContent = finalText.split("").map((char, i) => {
      if (i < iteration) return finalText[i]
      return chars[Math.floor(Math.random() * chars.length)]
    }).join("")
    if (iteration >= finalText.length) clearInterval(interval)
    iteration += 1 / 3
  }, 30)
}
```

---

### 4.8 Ambience & Audio

#### Web Audio API *(native, no library)*
```ts
const ctx = new AudioContext()

// Ambient tone (subtle drone)
const osc = ctx.createOscillator()
const gain = ctx.createGain()
osc.type = "sine"
osc.frequency.value = 220
gain.gain.value = 0.05
osc.connect(gain).connect(ctx.destination)
osc.start()

// Fade in on section enter
gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2)
```

#### Howler.js *(recommended, cross-browser)*
`npm i howler`

```ts
import { Howl } from "howler"

const ambient = new Howl({
  src: ["/audio/ambient.mp3"],
  loop: true,
  volume: 0,
  autoplay: true
})

// Fade in on load
ambient.play()
ambient.fade(0, 0.15, 3000)  // fade to 0.15 over 3s

// On page change: crossfade
ambient.fade(0.15, 0, 1000)
newTrack.fade(0, 0.15, 1000)
```

#### UX Rules for Audio
1. **Always silent by default** — user must opt in (or clearly understand)
2. **Persistent mute toggle** — top-right, always visible
3. **Subtle, never intrusive** — ambient texture, not music playing
4. **Volume ≤ 20%** — never competes with content
5. **Respect `prefers-reduced-motion`** — silence for motion-sensitive users
6. **Instant mute on `Escape` key**

#### Sound Design by Brand Type
| Brand Type | Sound Palette |
|---|---|
| Luxury bridal | Soft piano, strings, slow reverb pad |
| Modern fashion | Minimalist tones, vinyl crackle |
| Artisan/handmade | Natural sounds, wood, cloth |
| Salon/beauty | Soft chimes, water, meditative |
| Playful boutique | Light percussion, xylophone |

---

### 4.9 Physics & Playful Interactions

#### Matter.js *(2D rigid body physics)*
`npm i matter-js`

```ts
import Matter from "matter-js"

const { Engine, Render, Runner, Bodies, Composite } = Matter

const engine = Engine.create()
const render = Render.create({
  element: document.body,
  engine,
  options: { width: 800, height: 600, background: "transparent", wireframes: false }
})

// Create balls with brand colors
const ball = Bodies.circle(400, 200, 40, {
  render: { fillStyle: "#C4A35A" }
})
const ground = Bodies.rectangle(400, 600, 800, 30, { isStatic: true })

Composite.add(engine.world, [ball, ground])
Engine.run(engine)
Render.run(render)
```

**Playful patterns with Matter.js**:
- Ball pool of brand hashtags/words (Bodies.circle per word)
- Products falling from top of viewport
- Logo that bounces and settles on load
- User-draggable product cards with constraints
- Click to spawn new items (confetti-like)

#### Rapier *(WASM, 3-5x faster, for 3D)*
`npm i @dimforge/rapier3d-compat` or via `@react-three/rapier`

```tsx
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier"

function Scene() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <RigidBody>
        <mesh><sphereGeometry /><meshStandardMaterial /></mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <CuboidCollider args={[10, 0.1, 10]} />
      </RigidBody>
    </Physics>
  )
}
```

Codrops "When Cells Collide" (Sept 2025): organic particle simulation using Rapier + Three.js — cells repel each other, cluster on hover.

#### Framer Motion Drag
```tsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
  dragElastic={0.2}
  dragMomentum={false}
  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
>
  Drag me
</motion.div>
```

#### Character/Personality Patterns
- **Elastic navigation**: nav links "snap" back with spring after hover
- **Wobbly grid**: masonry cards float independently
- **Cursor trail**: particle dots follow cursor, fade out (fashion = petals / sparks)
- **Confetti on contact form submit**: `react-confetti` or `canvas-confetti`
- **Gravity logo**: on initial load, brand name letters fall and settle
- **Repulsion field**: elements push away from cursor
- **Breathing elements**: continuous gentle scale oscillation (we use this on hero images)

---

### 4.10 Particles & Canvas

#### tsparticles *(configurable JSON-based)*
`npm i @tsparticles/react @tsparticles/slim`

```tsx
import Particles from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

<Particles
  options={{
    particles: {
      number: { value: 30 },
      color: { value: "#C4A35A" },
      size: { value: 2 },
      move: { enable: true, speed: 0.5 },
      opacity: { value: 0.4 }
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" } }
    }
  }}
  init={loadSlim}
/>
```

#### Three.js Particle System
```tsx
// Custom BufferGeometry particle system
function Particles({ count = 500 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#C4A35A" transparent opacity={0.6} />
    </points>
  )
}
```

#### Curtains.js *(WebGL planes on HTML)*
`npm i curtainsjs` — distorts DOM images with shaders.

```js
// Each <img> becomes a WebGL plane with displacement shader
const curtains = new Curtains({ container: "canvas" })
const plane = curtains.addPlane(element, {
  uniforms: { time: { name: "uTime", type: "1f", value: 0 } }
})
// Ripple effect on mouse move
```

#### PixiJS *(2D WebGL, better than Canvas 2D)*
`npm i pixi.js` — for 2D canvas work with complex filters.

Best for: photo walls with displacement/blur effects, 2D particle systems, interactive gallery backgrounds.

---

## 5. What We Built in Label Gabriel

### Component Inventory

| Component | Technique Used |
|---|---|
| `CustomCursor` | Dual-layer RAF lerp cursor (dot + ring) |
| `SmoothScroll` | Lenis with Next.js integration |
| `Hero` | Mouse parallax (Framer Motion spring), magnetic CTA, cursor glow, breathing images, count-up |
| `Marquee` | CSS infinite scroll animation |
| `BrandStatement` | Scroll-triggered reveal |
| `PhotoStrip` | Horizontal scroll strip |
| `ServicesShowcase` | Card grid with hover states |
| `LookbookTeaser` | Hashtag-based category teaser cards |
| `ContactCTA` | Call-to-action with link |
| `Gallery` | Masonry grid, all posts |
| `PostCard` | Individual post card with modal trigger |
| `PostModal` | Lightbox with caption/hashtags |
| `ScrollProgress` | Scroll depth indicator |
| `SplitHeading` | Text split for stagger animation |
| `TracingBeam` | Aceternity UI — scroll progress beam |
| `Navigation` | Sticky, transparent → frosted glass |
| `Footer` | Minimal — Instagram + contact |
| `Emblem` | SVG brand emblem |

### Tech Stack Summary

```
Next.js 14 (App Router)
TypeScript
Tailwind CSS 3.4
Framer Motion 12
Lenis 1.3
Custom CSS (SVG noise texture, dual-layer cursor)
```

### Design System

```
Colors:
  --parchment: #FDFAF6    (background)
  --ink: #1C1714          (text primary)
  --gold: #C4A35A         (accent)
  --stone: #6B6560        (text muted)
  --linen: #E8E0D5        (border)

Fonts:
  Cormorant Garamond — display, italic, high contrast
  DM Sans — UI, light weight, wide tracking

Body texture:
  SVG feTurbulence noise at 2.5% opacity (paper feel)
```

### Data Architecture

```
data/
  posts.json          ← scraped Instagram posts
  images/             ← downloaded post images

website/
  lib/posts.ts        ← getPosts() loader
  app/page.tsx        ← hashtag-based category detection
```

---

## 6. The Next-Level Upgrade Path

Ordered by impact-to-effort ratio for the next project:

### Tier 1 — High Impact, Moderate Effort
1. **GSAP + ScrollTrigger** replacing Framer Motion for scroll-driven work
2. **SplitText** for headline reveals (free since v3.13)
3. **Curtains.js / displacement shader** on gallery images — hover distortion
4. **View Transitions API** for page changes — hero image morphs to gallery
5. **Cursor state machine** — changes appearance per context (view, drag, link)

### Tier 2 — Character-Defining, Higher Effort
6. **R3F scene** in hero — 3D fabric simulation or floating product
7. **Post-processing** (bloom + film grain) for editorial 3D sections
8. **ScrambleText** on nav hover or section headings
9. **Lenis + Barba.js** for full multi-page fluid transitions
10. **Ambient audio** opt-in — subtle brand sound signature

### Tier 3 — Signature/Playful, Significant Effort
11. **Physics-based gallery** — posts as falling cards (Matter.js)
12. **Particle field** reacting to cursor — brand color palette
13. **Rapier + R3F** — organic cell simulation for hero/splash
14. **Custom GLSL shader** for image reveals — dissolve/emerge effect
15. **3D logo reveal** — Spline or custom R3F on first load

### Per-Brand Decision Matrix

| Brand Vibe | Lead Technique | Avoid |
|---|---|---|
| Luxury bridal | Slow parallax, silky scroll, SplitText reveals | Physics, particles |
| Playful boutique | Matter.js ball pool, confetti, elastic interactions | Heavy shaders |
| Modern minimal | View Transitions, ScrambleText, clean motion | 3D overload |
| Dark editorial | Post-processing, displacement shaders, film grain | Bright colors, bounce |
| Artisan/handmade | Texture overlays, organic float, warm audio | WebGL complexity |
| Tech/digital | ScrambleText, particles, physics | Serif fonts |

---

## Sources

- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Text Animations](https://gsap.com/text/)
- [GSAP ScrambleText Plugin](https://gsap.com/docs/v3/Plugins/ScrambleTextPlugin/)
- [Codrops: 3D Scroll-Driven Text Animations](https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/)
- [Codrops: WebGL Shaders with GSAP](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/)
- [Codrops: Layered Zoom Scroll](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/)
- [React Three Fiber GitHub](https://github.com/pmndrs/react-three-fiber)
- [Three.js Journey — Shaders with R3F](https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/)
- [react-three/postprocessing GitHub](https://github.com/pmndrs/react-postprocessing)
- [Codrops: Rapier + Three.js Organic Particles](https://tympanus.net/codrops/2025/09/11/when-cells-collide-the-making-of-an-organic-particle-experiment-with-rapier-three-js/)
- [Aceternity UI](https://ui.aceternity.com/)
- [Magic UI](https://magicui.design/)
- [Cult UI](https://www.cult-ui.com/)
- [Lenis Smooth Scroll](https://www.lenis.dev/)
- [Barba.js + Third Party](https://barba.js.org/docs/advanced/third-party/)
- [Scrapfly — How to Scrape Instagram](https://scrapfly.io/blog/posts/how-to-scrape-instagram)
- [Apify Instagram Scraper](https://apify.com/apify/instagram-scraper)
- [Colorkuler — Instagram Color Palette](https://colorkuler.com/)
- [Peek — Extract Website Assets](https://trypeek.app/)
- [Motion+ Cursor (magnetic)](https://motion.dev/magazine/introducing-magnetic-cursors-in-motion-cursor)
- [Matter.js Physics Engine](https://brm.io/matter-js/)
- [react-three-rapier GitHub](https://github.com/pmndrs/react-three-rapier)
- [Three.js WebGPU Migration Guide](https://www.utsubo.com/blog/webgpu-threejs-migration-guide)
- [Cursify React Cursor Library](https://cursify.vercel.app/)
