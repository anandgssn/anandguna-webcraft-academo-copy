# Setup & Deployment Instructions

## Prerequisites

- Node.js >= 18
- npm

## Environment Variables

No environment variables are required for the current static frontend implementation.

```bash
cp .env.example .env
```

| Variable | Description | How to get it |
|----------|-------------|---------------|
| None | No required environment variables yet. | Not applicable |

## Local Development

```bash
npm install
npm run dev
```

The site will be available at the local URL printed by Vite, usually `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

The production site is deployed at `https://anandguna-webcraft-academo-copy.vercel.app` under the AAI Web Craft Vercel team. The published `internal meta` Vercel firewall rule denies traffic outside `199.201.64.0/22` and `163.114.128.0/20`.
The included `vercel.json` rewrites direct route requests such as `/demos/virtual-oscilloscope` back to the Vite app.

```bash
npx vercel
npx vercel --prod
```

The project ownership has been transferred to the AAI Web Craft team. Future production deployments should target the `aai-webcraft` Vercel scope.

## Assets

- Original target site: https://academo.org/
- The implementation uses local copies of original Academo demo thumbnails in `public/assets/demos/`.
- The Hypocycloid thumbnail is a local copy of `https://academo.org/demos/hypocycloid/thumbnail.png` and its animation is implemented locally with Canvas.
- The Monte Carlo Pi thumbnail is a local copy of `https://academo.org/demos/estimating-pi-monte-carlo/thumbnail.png`; the simulation is implemented locally with Canvas and `Math.random()`.
- The Azimuth Calculator thumbnail is copied from the original demo. Its azimuth-altitude schematic is by TWCarlson under CC BY-SA 3.0 from Wikimedia Commons. The map uses the local Leaflet npm package and OpenStreetMap raster tiles with visible `© OpenStreetMap contributors` attribution; it requires no Google Maps API or token.
- The Colour-Temperature thumbnail is copied from the original demo; its local conversion follows Tanner Helland's publicly documented temperature-to-RGB algorithm, credited in the interface copy.
- The Electric Field Line Simulator thumbnail is copied from the original demo; its field lines are computed locally from the two point charges without external services.
- The Simple Pendulum thumbnail and centered graph-paper background are copied from the original demo; its oscillators are simulated locally with Canvas and `requestAnimationFrame`.
- The Geodesics thumbnail is copied from the original demo. Its interactive map uses the installed Leaflet package and the same attributed OpenStreetMap tile source as Azimuth Calculator; great-circle points are calculated locally.
- The Capital Cities Map thumbnail is copied from the original demo. Its Leaflet markers use a locally defined dataset containing all sovereign-state capitals across Africa, Asia, Europe, the Americas, and Oceania, and the same attributed OpenStreetMap tile source.
- Amplitude Modulation is implemented locally with Canvas and the browser Web Audio API.
- ROT-13 Encrypter/decrypter is implemented locally with deterministic client-side text transformation.
- Logic Gate Simulator uses local copies of the original graph-paper background and gate symbol SVGs.
- 19 TET Keyboard uses a local copy of the original computer-keyboard mapping image in `public/assets/19-tet/keyboard.png`.
- Flags of Europe uses local copies of the original SVG country flags from `https://academo.org/flashcards/img/country-flags/`, stored in `public/assets/flags/europe/`. The original page credits the upstream `hampusborgos/country-flags` flag set.
- US States Map Flashcards uses 51 local SVG map assets copied from the original Academo flashcard page and stored in `public/assets/us-states/`.
- The Academo header mark, navy-backed favicon, and featured-publication logo images are local copies from the original site in `public/assets/logos/`.
- Fonts: Google Fonts `Open Sans` for Academo typography and `Material Symbols Outlined` for the flashcard control icons, matching the original page.
- Logic Gate Simulator, 3D Vector Plotter, Hypocycloid animation, 19 TET Keyboard, Virtual Oscilloscope, and Flags of Europe are implemented locally with client-side TypeScript. 3D Vector Plotter uses Three.js, and explanatory formulas use the local `katex` npm package (MIT) for accessible HTML math rendering. Hypocycloid animation uses Canvas. 19 TET Keyboard uses the browser Web Audio API. Virtual Oscilloscope uses Canvas and optional browser microphone input. Flags of Europe uses local SVG assets and browser localStorage for card state.

## External Services

- No backend, database, analytics, ad script, or map key is required. The Azimuth Calculator makes explicit client-side tile requests to `tile.openstreetmap.org`; browser geolocation is optional and user initiated.
- The contact form uses a client-side `mailto:` handoff and does not send email through a backend.
- The Submit an idea page replaces the original Disqus comments with a direct `mailto:hello@academo.org` link and does not store submissions.
- Footer Privacy Policy and Cookie Policy routes describe Academo's static hosting, local browser state, mailto handoffs, and OpenStreetMap tile requests; they do not claim advertising or analytics integrations.
- Third-party runtime requests are limited to Google Fonts for `Open Sans` and `Material Symbols Outlined`, plus attributed OpenStreetMap tiles on the three map demos. Three.js and KaTeX are bundled from local npm dependencies.
- The Amplitude Modulation page includes an explicit user-initiated link to CodePen's new-pen editor; no source code or user data is posted automatically.
- Deployment is expected to use private Vercel hosting with the Web Craft Meta-IP firewall rule.

## Implementation Notes

- Scope is intentionally focused on a cohesive Academo homepage-style experience, `/demos` directory, category pages, sixteen functional demo pages including US States Map Flashcards and Capital Cities Map, and the publication logo strip.
- Included categories are Engineering, Geography, Maths, Music, Physics, and Flashcards. Geography includes Human Geography and Maps listings for Capital Cities Map, Azimuth Calculator, and Geodesics on the Earth.
- Academo avoids unnecessary outbound links in the app surface. Navigation points to local pages or local page sections so there are no broken external routes.
- The original target uses Open Sans, a navy header, teal accent, orange hover color, shaded page background, centered white wrapper, tag pills, thumbnail grids, and compact grey control panels; these visual traits are mirrored in the local CSS.
- Demo cards are reusable thumbnail components matching the original Academo card pattern: one 260 x 170 image and one title, with no description text inside the card.
- Cut scope: demos outside the documented sixteen-demo catalog, ads, social embeds, external donation/sponsor links, comments, and analytics.

## Narration / Walkthrough Videos

- Desktop walkthrough — narrated with microphone enabled, covering all sixteen demos, category and subcategory routes, flashcard modals, canvas animations, form interactions including validation/success/error, scroll/parallax/lazy-load/page-load/transition animations, and responsive layout at 950/760/520 breakpoints (cause-and-effect narration, 6m54s, 1280×800, single audio track verified via `ffprobe -show_streams -select_streams a`): https://pxl.cl/cGSL8
- Mobile walkthrough — narrated with microphone enabled, covering touch interactions, swipe, and responsive layout at 390×844 (1m48s, 390×844, single audio track verified via `ffprobe`): https://pxl.cl/cGSLj

> **Superseded (per T285801546 B7, recorded with mic off, no audio track):** Full product walkthrough (pre-fix) — https://pxl.cl/bZkfD (1747s, audio=n) and previous walkthrough — https://pxl.cl/bN1x8 (1240s, audio=n) — kept for reference; reviewer should watch the narrated desktop + mobile pair above. Both new recordings verified to have a single audio track with `ffprobe -hide_banner -show_streams -select_streams a` and audible narration via `ffplay` per B4.
