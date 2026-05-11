# ayushsharma: project conventions

## CRITICAL: No dashes

**Em dashes (--) and en dashes (-) are banned repo-wide.** Build fails on any occurrence. Use comma, period, parentheses, or rewrite. Applies to all files: .md, .mdx, .ts, .tsx, comments, prose. No exceptions.

---

## Blog cover SVG template

Every cover at `public/blog/covers/*.svg` must follow this exact structure. No deviations.

### Layout (1600x900)

```
┌─────────────────────────────────────────────────────────┐
│  AYUSHSHARMA.ME · BLOG          (y=180, top label)      │
│                                                         │
│  Title line 1                   (y=390 to 430, title)   │
│  Title line 2                                           │
│  Title line 3 (if needed)                               │
│                                                         │
│  / Ayush Sharma        2026 · Tag  (y=800, bottom bar)  │
└─────────────────────────────────────────────────────────┘
```

### Rules

- **No vertical bars.** Never add `<rect>` accent bars on the left side (or anywhere as decorative stripes).
- **Top label:** `AYUSHSHARMA.ME · BLOG` (exact text, middle dot `·` not slash `/`), letter-spacing="3", font-size="28", x="120", y="180"
- **Title:** x="120", font-size 88 to 100, font-weight="700", letter-spacing="-2" or "-3", split into `<tspan>` lines with dy="110" to "118". Start y around 390 to 430 depending on line count.
- **Bottom left:** `/ Ayush Sharma` at x="120", y="800", font-size="28". The `/` tspan gets accent color + font-weight="700".
- **Bottom right:** Short tag (e.g. `2026 · Essay`, `2026 · Security`, `CVE-XXXX-XXXX`) at x="1480", y="800", font-size="24", text-anchor="end", muted color.
- **Background layers:** bg gradient, grid pattern, radial glow(s). No other decorative elements.
- **accent color** drives: top label color, bottom-left `/` color, glow color. Match post's `accent` frontmatter field.

### Accent colors by post type

| accent | bg dark tones | glow color | label/slash color |
|--------|--------------|------------|-------------------|
| blue | #0b0f17 to #1e293b | rgba(59,130,246,...) | #93c5fd / #3b82f6 |
| red | #0d0a08 to #2a1410 | rgba(239,68,68,...) | #fca5a5 / #ef4444 |
| green | #060d0a to #111f17 | rgba(34,197,94,...) | #4ade80 / #22c55e |

### Reference SVG (do not modify without updating this doc)

`public/blog/covers/claude-4-7-and-the-end-of-prompt-engineering.svg` is canonical.

---

## Blog posts

- Files live in `content/blog/*.mdx`
- Frontmatter fields: `title`, `description`, `date`, `updated`, `tags`, `cover`, `coverAlt`, `accent`, `featured`, `draft` (optional)
- `cover` path must match the SVG filename in `public/blog/covers/`
- No em dashes or en dashes in post prose (use comma, period, or parentheses)
- Personal first-person voice, no AI-generated filler

## General

- Money values stored as integer cents (decimals corrupt across boundaries)
- Keep node_modules out of searches (already in .gitignore)
