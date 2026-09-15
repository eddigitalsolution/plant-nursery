
# Cloudflare Deployment & Architecture — Plant Nursery

## Build Settings
- Build command: npm run build
- Output directory: dist
- Environment variables: NODE_VERSION=20

## Routing & Security Files
- public/_headers: Edge security rules (CSP, X-Frame-Options, Referrer-Policy).
- public/_redirects: SPA route rewrite fallback (/* /index.html 200).
- wrangler.jsonc: Cloudflare Pages manifest (pages_build_output_dir: ./dist).

