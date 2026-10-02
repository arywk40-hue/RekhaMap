# RekhaMap AI

SIH 2026 urban parcel mapping website prototype, IIT Mandi.

## What this repository contains

The existing interactive RekhaMap interface: parcel inspection, map layer controls, review status, field-check flags and demonstration exports. The parcel geometries, confidence values and survey records shown in the interface are synthetic demo data.

This is a frontend prototype. It does not run trained AI segmentation, process real drone imagery, establish legal parcel boundaries or provide a production cadastral backend.

## Run locally

Prerequisites: Node.js 22.13 or newer. The existing build/install scripts require Linux, GNU timeout, flock and curl; on Windows use WSL, and on macOS use a Linux environment.

```sh
npm run install:ci
npm run dev
```

Use the local URL printed by the development server.

```sh
npm run build
npm test
```

## Source layout

- `app/page.tsx`: cadastral dashboard and synthetic parcel data
- `app/globals.css`: interface styling
- `components/ui/`: shared interface components
- `vite.config.ts` and `worker/index.ts`: Vinext / Cloudflare runtime setup
- `.openai/hosting.json`: existing Sites hosting configuration

The original website source has been recovered from the saved RekhaMap Site, source commit `0471a60cdf31cb0a6b4d8e09cd877317f1233d72`. The application files are preserved; this README documents the prototype for submission.
