# Visual Branding Guide

## Header Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [🎨]  Project Health & Behaviour Monitor                    [Badge]    │
│         Built for Projecting Success Hackathon • Sponsored by Thales •  │
│         Developed by TortoiseAI                                         │
│         Steady progress. Lasting results.                               │
│                                                          [Upload] [Reset]│
└─────────────────────────────────────────────────────────────────────────┘
```

### Colors in Header:
- 🎨 Logo: Gradient (fuchsia → green)
- Title: Deep Slate (#1A1A2E)
- "Projecting Success Hackathon": Fuchsia (#C724B1)
- "Thales": Deep Slate (#1A1A2E)
- "TortoiseAI": Fuchsia (#C724B1) with underline on hover
- Tagline: Gray italic
- Upload button: Fuchsia background

---

## Upload View Banner

```
┌─────────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════════╗  │
│  ║  Hackathon Challenge: Risky Resource Routines                 ║  │
│  ║                                                                ║  │
│  ║  Sponsor: Thales | Event: Projecting Success Hackathon        ║  │
│  ║                                                                ║  │
│  ║  This tool identifies poor planning behaviours in project     ║  │
│  ║  management through behavioural analytics, helping teams      ║  │
│  ║  prevent delivery failures before they happen.                ║  │
│  ╚═══════════════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────────────┘
```

### Styling:
- Background: Gradient from fuchsia/5 to green/5
- Border: Fuchsia with 20% opacity
- Title: Deep Slate, semibold
- Body text: Gray with strong tags for emphasis

---

## Footer Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Hackathon              Sponsor              Developer             │
│   ───────────            ────────             ─────────             │
│   Projecting Success     Thales               TortoiseAI            │
│   Hackathon                                   [Link]                │
│   Challenge 5: Risky     Innovation in        Demystifying AI       │
│   Resource Routines      Project Management   adoption through      │
│                                                patient, expert       │
│                                                guidance              │
│                                                                     │
│   ─────────────────────────────────────────────────────────────────│
│                                                                     │
│        © 2025 TortoiseAI. Built for educational and                │
│                    demonstration purposes.                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Styling:
- Column headers: Deep Slate, semibold
- Main text: Gray
- TortoiseAI link: Fuchsia with underline on hover
- Copyright: Light gray, centered

---

## Color Palette

### TortoiseAI Brand Colors

**Primary - Tortoise Fuchsia**
```
#C724B1
████████
RGB: 199, 36, 177
HSL: 310°, 69%, 46%
Used for: Links, highlights, primary actions
```

**Accent - Green**
```
#00D9A3
████████
RGB: 0, 217, 163
HSL: 165°, 100%, 43%
Used for: Gradients, accents
```

**Text - Deep Slate**
```
#1A1A2E
████████
RGB: 26, 26, 46
HSL: 240°, 28%, 14%
Used for: Headings, important text
```

---

## Typography

### Headings
- H1 (Main Title): `text-3xl font-bold text-deep-slate`
- H2 (Sections): `text-xl font-semibold text-deep-slate`
- H3 (Subsections): `font-semibold text-deep-slate`

### Body Text
- Primary: `text-gray-600` or `text-gray-700`
- Secondary: `text-gray-500`
- Emphasis: `font-semibold text-tortoise-fuchsia` or `font-semibold text-deep-slate`

### Special Text
- Tagline: `text-sm text-gray-500 italic`
- Links: `text-tortoise-fuchsia hover:underline`

---

## Component Styling

### Buttons

**Primary (Upload)**
```tsx
className="bg-tortoise-fuchsia text-white rounded-lg
           hover:opacity-90 transition-opacity"
```

**Secondary (Reset)**
```tsx
className="bg-gray-200 text-gray-700 rounded-lg
           hover:bg-gray-300 transition-colors"
```

### Badges
```tsx
<Badge variant="info">{tasks.length} tasks loaded</Badge>
```

### Banner/Alert Boxes
```tsx
className="bg-gradient-to-br from-tortoise-fuchsia/5 to-accent-green/5
           border border-tortoise-fuchsia/20 rounded-lg p-6"
```

---

## Responsive Breakpoints

### Mobile (< 768px)
- Header: Logo and title stack, credentials wrap
- Footer: Single column layout
- Banner: Full width padding adjustment

### Tablet (768px - 1024px)
- Header: Two-line layout
- Footer: 2 or 3 columns
- Banner: Standard layout

### Desktop (> 1024px)
- Header: Single line with all elements
- Footer: 3 columns
- Banner: Full layout with generous spacing

---

## Credits Display Pattern

Throughout the application, credits follow this pattern:

**Short Form:**
```
Built for Projecting Success Hackathon | Sponsored by Thales |
Developed by TortoiseAI
```

**Long Form:**
```
Hackathon: Projecting Success Hackathon
Challenge: Challenge 5 - Risky Resource Routines
Sponsor: Thales
Developer: TortoiseAI (with link to tortoiseai.co.uk)
```

**Always Include:**
1. Hackathon name
2. Thales sponsorship
3. TortoiseAI development
4. TortoiseAI link (https://tortoiseai.co.uk)
5. Tagline where appropriate: "Steady progress. Lasting results."

---

## Link Styling

All external links use:
```tsx
<a
  href="https://tortoiseai.co.uk"
  target="_blank"
  rel="noopener noreferrer"
  className="text-tortoise-fuchsia hover:underline font-semibold"
>
  TortoiseAI
</a>
```

---

## Gradient Examples

### Logo Background
```css
background: linear-gradient(to bottom right,
  var(--tortoise-fuchsia),
  var(--accent-green)
);
```

### Banner Background
```css
background: linear-gradient(to bottom right,
  rgba(199, 36, 177, 0.05),   /* fuchsia/5 */
  rgba(0, 217, 163, 0.05)     /* green/5 */
);
```

---

## Accessibility

### Color Contrast Ratios
- Deep Slate on White: 16.9:1 ✓ (AAA)
- Fuchsia on White: 4.8:1 ✓ (AA)
- Gray-600 on White: 7.0:1 ✓ (AAA)

### Focus States
- All interactive elements have visible focus rings
- Links have underline on hover
- Buttons have opacity/color transitions

---

## Brand Voice

**TortoiseAI Positioning:**
- Patient, expert guidance
- Steady progress over quick fixes
- Demystifying AI adoption
- Educational and thoughtful

**Tagline Usage:**
Always use: "Steady progress. Lasting results."

**Tone:**
- Professional but approachable
- Educational, not sales-focused
- Emphasize patience and expertise
- Celebrate steady improvement

---

## File References

- `tailwind.config.js` - Color definitions
- `src/App.tsx` - Header, footer, banner
- `index.html` - Meta tags
- `README.md` - Documentation

---

**Visual Guide Complete!** 🎨

Use this guide to maintain consistent branding across the application.
