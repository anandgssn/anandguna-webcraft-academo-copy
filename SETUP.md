# Setup & Deployment Instructions

## Prerequisites

- Node.js >= 18
- npm

## Environment Variables

No environment variables are required for the current static frontend scaffold.

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

Deploy privately to Vercel, then restrict access with a Vercel firewall that allows only Meta IP ranges.

```bash
npx vercel
npx vercel --prod
```

After deployment, update `site.toml` with the live URL, set the hosting fields, and transfer project ownership to the AAI Web Craft team.

## External Services

- Original target site: https://academo.org/
- No APIs, databases, or third-party services are required yet.

## Narration / Walkthrough Videos

Add the pxl.cl walkthrough video URL here before submission.
