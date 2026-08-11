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

Authentication and Netlify Functions run through the local Netlify proxy:

```bash
npm run dev:netlify
```

The complete local app is then available at `http://localhost:8888`.

## Member authentication

The member area uses Google OpenID Connect and verifies membership against the
read-only Airtable `Members` table from server-side Netlify Functions. These
variables must be present locally in `.env` and in the Netlify Functions
environment for production:

- `AIRTABLE_API_TOKEN`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `AUTH_SESSION_SECRET` — a unique random value of at least 32 characters

The committed code never exposes these values to Vite or browser JavaScript.
The development-only sentinel in the ignored local `.env` derives an isolated
local signing key from the Google client secret; Netlify production rejects that
sentinel and requires an independent `AUTH_SESSION_SECRET`.

Register these exact authorized redirect URIs in Google Cloud:

- Production: `https://www.entheo.community/api/auth/google/callback`
- Local: `http://localhost:8888/api/auth/google/callback`

## Build

```bash
npm run build
npm run build:netlify
npm run preview
```

## Structure

- `src/routes/1.tsx` — the sole page, mounted as the `/` index route
- `src/designs/d1.css` — the landing page's visual system and responsive layout
- `src/lib/hooks.ts` — document-title and reveal-on-scroll behavior
- `tsr.config.json` — maps `1.tsx` to `/` through TanStack Router's virtual route configuration
