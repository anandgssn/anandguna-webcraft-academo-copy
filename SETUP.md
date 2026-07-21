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

The production site is deployed at `https://leg10n-webcraft-academo.vercel.app` under the AAI Web Craft Vercel team. A Vercel firewall restricts access to the approved Meta IP ranges.
The included `vercel.json` rewrites direct route requests such as `/demos/virtual-oscilloscope` back to the Vite app.

```bash
npx vercel
npx vercel --prod
```

The project ownership has been transferred to the AAI Web Craft team. Future production deployments should target the `aai-webcraft` Vercel scope.

## Assets

- Original target site: https://academo.org/
- The implementation uses local copies of original Academo demo thumbnails in `public/assets/demos/`.
- Logic Gate Simulator uses local copies of the original graph-paper background and gate symbol SVGs.
- 19 TET Keyboard uses a local copy of the original computer-keyboard mapping image in `public/assets/19-tet/keyboard.png`.
- Flags of Europe uses local copies of the original SVG country flags from `https://academo.org/flashcards/img/country-flags/`, stored in `public/assets/flags/europe/`. The original page credits the upstream `hampusborgos/country-flags` flag set.
- The Academo header mark, navy-backed favicon, and featured-publication logo images are local copies from the original site in `public/assets/logos/`.
- Fonts: Google Fonts `Open Sans` for Academo typography and `Material Symbols Outlined` for the flashcard control icons, matching the original page.
- Logic Gate Simulator, 3D Vector Plotter, 19 TET Keyboard, Virtual Oscilloscope, and Flags of Europe are implemented locally with client-side TypeScript. 3D Vector Plotter uses Three.js, and its explanatory formulas use the local `mathjax` npm package (Apache-2.0) for SVG math rendering. 19 TET Keyboard uses the browser Web Audio API. Virtual Oscilloscope uses Canvas and optional browser microphone input. Flags of Europe uses local SVG assets and browser localStorage for card state.

## External Services

- No APIs, databases, analytics, or ad scripts are required.
- The contact form uses a client-side `mailto:` handoff and does not send email through a backend.
- The only third-party runtime requests are Google Fonts for `Open Sans` and `Material Symbols Outlined`; Three.js and MathJax are bundled from local npm dependencies.
- Deployment is expected to use private Vercel hosting with the Web Craft Meta-IP firewall rule.

## Replication Notes

- Scope is intentionally focused on a cohesive Academo homepage-style experience, `/demos` directory, category pages, functional Logic Gate Simulator, 3D Vector Plotter, 19 TET Keyboard, Virtual Oscilloscope, and Flags of Europe pages, and publication logo strip.
- Included categories are Engineering, Maths, Music, Physics, and Flashcards. Geography is intentionally out of scope for this iteration.
- The replica avoids outbound links in the app surface. Navigation points to local pages or local page sections so there are no broken external routes.
- The original target uses Open Sans, a navy header, teal accent, orange hover color, shaded page background, centered white wrapper, tag pills, thumbnail grids, and compact grey control panels; these visual traits are mirrored in the local CSS.
- Demo cards are reusable thumbnail components matching the original Academo card pattern: one 260 x 170 image and one title, with no description text inside the card.
- Cut scope: geography, other full demo functionality, ads, social embeds, external donation/sponsor links, comments, and analytics.

## Narration / Walkthrough Videos

- Narrated replica walkthrough: https://pxl.cl/bN1x8
