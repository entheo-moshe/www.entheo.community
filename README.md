# Entheo Community — Homepage Explorations

Five distinct homepage designs for [Entheo Community](https://www.entheo.community/),
a nationwide fellowship of Entheists founded in 2023.

## Running

```bash
npm install
npm run dev    # serves on http://localhost:3000
```

## The five designs

| Route | Name | Direction |
| ----- | ---- | --------- |
| `/1` | **The Illuminated Herbarium** | A sacred field guide: parchment, gold leaf, Cinzel + EB Garamond, hand-coded engraved botanical plates, a wax-seal CTA. |
| `/2` | **The Night Ceremony** | Bioluminescent cosmos: canvas starfield with shooting stars, aurora, a breathing halo synced to an inhale/exhale cycle, constellation cards. |
| `/3` | **The Bulletin** | The community organ of record: brutalist Archivo masthead, news ticker, public notices, a classifieds-style membership ladder. |
| `/4` | **The Golden Hour** | 1970s sunshine folk: rotating sunburst, rolling hills, ticket-stub sacraments, spinning mandala, a winding road home. |
| `/5` | **Stillness** | Paper, ink, breath: a brush-stroke ensō drawn on load, vast negative space, Shippori Mincho, one vermilion accent. |

The root route `/` is a gallery hub ("Five Doors") linking to all of them, and a
floating pager at the foot of each page moves between explorations.

## Structure

- `src/routes/1.tsx … 5.tsx` — one self-contained page per design
- `src/designs/d1.css … d5.css` — per-design stylesheets (scoped by `.d1 … .d5` class prefixes)
- `src/lib/hooks.ts` — shared `useTitle`, reveal-on-scroll, reduced-motion helpers
- `src/components/Pager.tsx` — the exploration switcher, skinned per design via CSS variables

All illustrations are generated SVG/canvas — no image assets. Every design respects
`prefers-reduced-motion`.

## Build

```bash
npm run build
npm run preview
```
