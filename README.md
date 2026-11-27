# Raj Vel Food Products — Official Website

Production static business website for **Raj Vel Food Products** (Kadayampatti, Salem, Tamil Nadu — FSSAI Lic. No: `22426179000396`), hosted on **Cloudflare Pages** (zero third-party badge, automatic HTTPS, unlimited static bandwidth).

Product display order:
1. **Semmai** — Pure Gram Flour
2. **Uzhavan** — Multi-Grain Gram Flour
3. **Aruvi** — Multi-Grain Gram Flour

---

## Tech Stack

- **Runtime**: Node.js `24` LTS (`.nvmrc`)
- **Framework**: Next.js `16.4.6` (App Router, `output: "export"`) & React `19.3.1`
- **Language & Styling**: TypeScript `5.9.3`, Tailwind CSS `4.3.5`, Framer Motion `12.43.0`, Lucide React
- **Hosting & CDN**: Cloudflare Pages (`out/` publish directory, security & caching headers in `public/_headers`)

---

## Local Development & Verification

```bash
npm ci
npm run dev
```

Run all quality, security, and static build checks:

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm audit --audit-level=high
```

---

## Cloudflare Pages Deployment

- **Framework preset**: `Next.js (Static HTML Export)` (or `None`)
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Environment variables**:
  - `NODE_VERSION` = `24`
  - `SITE_URL` = `https://rajvelfoodproduct.com`
- **Security & Cache Headers**: Automatically applied from `public/_headers` (exported to `out/_headers`).
- **Custom 404**: Automatically served from `out/404.html`.

### GitHub Actions CI/CD

Defined in `.github/workflows/ci-deploy.yml`:
- Runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm audit --audit-level=high`, `npm run build`, and `npm test` on every PR and push to `main`.
- Optionally deploys verified `out/` artifacts directly to Cloudflare Pages when `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets are configured (or works alongside Cloudflare Pages native Git integration).

---

## Blog Publishing

- Blog articles live as JSON files in `content/blog/` and are statically compiled into `/blog/`, `/blog/<slug>/`, and `/sitemap.xml`.
- You can publish new posts directly via Git (`content/blog/*.json`) or connect GitHub OAuth to Decap CMS at `/admin/` (`public/admin/config.yml`).
