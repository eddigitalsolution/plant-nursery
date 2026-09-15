
# Cloudflare Pages & Workers Setup — Plant Nursery

## Configuration
- Target Output: dist
- Deploy Model: Cloudflare Pages (Git Integration)
- wrangler.jsonc: { " name\: \plant-nursery-portal\, \compatibility_date\: \2026-09-14\, \pages_build_output_dir\: \./dist\ }
- Security Headers: public/_headers (Uncommented CSP, X-Frame-Options, Referrer-Policy)
- Local Synchronization: index.html CSP meta tag synchronized with public/_headers rules.

