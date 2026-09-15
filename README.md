# 🌿 Verdant Archive — Rare Botanical Specimens & Indoor Plant Nursery

[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-orange?logo=cloudflare)](https://verdant.my)
[![React 19](https://img.shields.io/badge/Framework-React%2019-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build%20Tool-Vite%20v8-purple?logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%206-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

**Verdant Archive** is a high-performance, biophilic digital botanical nursery and rare plant specimen platform built with React 19, Vite, Tailwind CSS v4, and Framer Motion. 

Curated for collectors and interior biophilic designers across Malaysia, the application features an interactive plant care vitality tuner, real-time micro-climate diagnostic matrix, and an editorial specimen showcase.

---

## ✨ Key Features

- 🌿 **Rare Specimen Showcase**: Curated catalog of rare tropical Aroids (*Monstera*, *Calathea*, *Anthurium*) with botanical details, origin tracking, and rarity tags.
- 🧪 **Interactive Plant Vitality Tuner**: Real-time interactive micro-climate simulator measuring moisture levels, sunlight index, air purification score, and plant mood states.
- 🩺 **Botanical Diagnostic Matrix & Care Guides**: Troubleshooting tool for leaf chlorosis, turgor loss, and humidity tuning tailored for tropical indoor spaces.
- 🚚 **Eco-Packaging & Live Guarantee**: Detailed 30-day botanical vitality guarantee and transit packaging documentation.
- ⚡ **Cloudflare Pages Edge Deployment**: Pre-configured HTTP security headers (`_headers`), Content Security Policy (CSP) meta synchronization, and SPA route fallback (`200.html`).

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript 6, Vite 8
- **Styling & Motion**: Tailwind CSS v4, Framer Motion 13
- **Iconography**: Lucide React
- **Code Health**: Oxlint
- **Hosting**: Cloudflare Pages (Git Integration Model)

---

## 📁 Repository Structure

```text
plant-nursery/
├── .agents/
│   └── rules/             # Project standards, Cloudflare setup & contact rules
├── public/
│   ├── _headers           # Cloudflare Edge HTTP Security & CSP Headers
│   ├── favicon.svg        # Botanical favicon
│   ├── verdant-logo.svg   # Custom brand emblem
│   └── *.jpg              # WebP/JPG optimized specimen photography
├── src/
│   ├── App.tsx            # Main application layout, interactive tuner & dialogs
│   ├── index.css          # Tailwind CSS v4 theme variables & custom utilities
│   └── main.tsx           # React root entrypoint
├── CLOUDFLARE.md          # Cloudflare Pages deployment reference
├── GEMINI.md              # Project instruction manifest
├── package.json           # Dependencies, build & postbuild scripts
├── wrangler.jsonc         # Cloudflare Pages build output configuration
└── vite.config.ts         # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher

### Installation & Development

```bash
# Clone repository
git clone https://github.com/eddigitalsolution/plant-nursery.git
cd plant-nursery

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Linting

```bash
# Type-check & build production bundle
npm run build

# Run Oxlint linter
npm run lint

# Preview production build locally
npm run preview
```

---

## 🌐 Cloudflare Pages Deployment

This project uses **Model A: Cloudflare Pages (Git Integration)**:

1. Connect your GitHub repository to **Cloudflare Pages**.
2. Set **Build command**: `npm run build`
3. Set **Build output directory**: `dist`
4. Set **Deploy command**: *(Leave blank for Pages)*
5. Add Environment Variable: `NODE_VERSION=20`

---

## 📄 License

© 2026 Verdant Archive. All rights reserved.
