# invite.studio

**Premium digital invitation platform for Indian weddings, birthdays, anniversaries, and more.**

Live at: [invite.studio](https://invite.studio) (KarthikGuduru/birthday-wishes · thebrainpuddle-dev/invite-studio)

---

## What it is

invite.studio lets anyone create a stunning, shareable digital invitation in minutes. Choose a template, customize names/dates/venue, share the link — no app install needed, works on every device.

The design language draws from South Indian temple aesthetics — marigold garlands, saffron palettes, gold filigree — combined with the clean, modern polish of [thedigitalyes.com](https://thedigitalyes.com) and [Emil Kowalski](https://emilkowalski.com)'s animation philosophy.

---

## Templates

| Category | Templates |
|----------|-----------|
| Wedding | South Indian Temple Wedding × 2 |
| Birthday | Birthday Bash × 2 |
| Anniversary | Anniversary Celebration × 2 |
| Baby Shower | Baby Shower × 2 |
| Engagement | Engagement × 2 |
| Housewarming | Griha Pravesh × 2 |

Each template ships with:
- Cinematic section-color transitions (crimson → saffron → rose → amber)
- Marigold garland hero decoration + diya corner accents
- Google Maps embed (customizable venue URL)
- Countdown timer, photo gallery, RSVP section
- Gold shimmer name animation
- WhatsApp share button

---

## Tech stack

- Pure HTML/CSS/JS — zero build step, zero dependencies
- Hosted as static files (serves from any CDN or GitHub Pages)
- CSS custom properties design system (`marketplace.css`)
- Global UX polish layer (`ux-polish.css` + `ux-polish.js`)

### Design tokens

```css
--gold:        #c9942a
--cream:       #faf7f2
--maroon:      #7b1818
--font-display: 'Playfair Display', Georgia, serif
--font-body:    'Inter', -apple-system, sans-serif
--font-script:  'Great Vibes', cursive
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1)   /* Emil Kowalski */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## Project structure

```
/
├── index.html                  # Marketplace homepage
├── css/
│   ├── marketplace.css         # Global design system
│   └── ux-polish.css           # Animation & interaction layer
├── js/
│   └── ux-polish.js            # Scroll reveal, counters, navbar
└── templates/
    ├── wedding/
    │   ├── wedding-1.html          # South Indian Temple Wedding (flagship)
    │   ├── wedding-1-customize.html
    │   ├── wedding-2.html
    │   └── wedding-2-customize.html
    ├── birthday/
    ├── anniversary/
    ├── babyshower/
    ├── engagement/
    └── housewarming/
```

---

## Customization flow

1. User lands on marketplace (`index.html`)
2. Clicks template → previews with sample names (Arjun & Meghana)
3. Clicks **Customize** → fills form on `*-customize.html`
4. Form injects values into the preview via JS (names, dates, venue, map URL)
5. User shares the link or screenshots

---

## Running locally

```bash
npx serve -l 3456 .
# → open http://localhost:3456
```

---

## Design principles

**Emil Kowalski animation rules applied throughout:**
- Never `transition: all` — always specify individual properties
- Custom easing on every interactive element
- `:active { transform: scale(0.97) }` on all buttons
- Hover effects gated behind `@media (hover: hover) and (pointer: fine)`
- GPU-only animations (`transform`, `opacity`) — no layout thrash
- Scroll reveal with batch stagger (60ms per item, max 280ms)
- `prefers-reduced-motion` respected globally

---

## Repos

| Repo | Purpose |
|------|---------|
| [KarthikGuduru/birthday-wishes](https://github.com/KarthikGuduru/birthday-wishes) | Primary dev repo |
| [thebrainpuddle-dev/invite-studio](https://github.com/thebrainpuddle-dev/invite-studio) | Studio / production repo |
