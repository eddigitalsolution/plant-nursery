
# Project Standards — Plant Nursery (Verdant Archive)

## UI & Visual Design Standards
- Vector outline icons only (Lucide React line iconography). No glossy 3D AI-slop icons or tacky clipart.
- Clean, uppercase, single-line top-level navbar text with zero wrapped elements on desktop viewports.
- Responsive mobile drawer for small screens (<768px).

## React 19 & TypeScript Architecture
- Type-safe React state management and Framer Motion spring physics.
- Fully typed data structures and zero unhandled TypeScript errors.

## Cloudflare & Security Standards
- Synchronized Content Security Policy in both index.html meta tags and public/_headers.
- public/_headers must be raw HTTP header rules (uncommented).
- wrangler.jsonc configured with pages_build_output_dir output directory.
- package.json postbuild hook generates dist/200.html for single-page application fallback routing.

