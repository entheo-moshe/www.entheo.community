# Entheo Community

The public landing page for [Entheo Community](https://www.entheo.community/), a
nationwide fellowship of Entheists founded in 2023.

The page uses an illuminated-herbarium direction: parchment, engraved botanical
illustrations, ink, and gold leaf. Its illustrations are generated directly in
SVG, and its motion respects `prefers-reduced-motion`.

## Development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:30000`.

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/routes/1.tsx` — the sole page, mounted as the `/` index route
- `src/designs/d1.css` — the landing page's visual system and responsive layout
- `src/lib/hooks.ts` — document-title and reveal-on-scroll behavior
- `tsr.config.json` — maps `1.tsx` to `/` through TanStack Router's virtual route configuration
