# Production Readiness & Security Audit Report — Raj Vel Food Products

**Audit Date:** November 27, 2026  
**Target Platform:** Netlify Static Hosting + GitHub Actions CI/CD  
**Application Stack:** Next.js `16.4.6` (App Router, `output: "export"`), React `19.3.1`, TypeScript `5.9.3`, Tailwind CSS `4.3.5`, Node.js `24` LTS

---

## 1. Initial Audit Findings & Security Vulnerabilities

| ID | Finding | Severity | Location | Status |
| --- | --- | --- | --- | --- |
| SEC-01 | **Hardcoded Administrator Credentials Exposed in Client Bundle** (`id: "admin"`, `password: "rajvel@2026"`) | **Critical** | `src/components/BlogAdminClient.tsx` | **Resolved** (removed completely; credential must be treated as compromised and never reused) |
| SEC-02 | **Client-Side Authentication Bypass & `sessionStorage` Auth Flag** (`rvf_blog_admin_auth_v1`) | **Critical** | `src/components/BlogAdminClient.tsx` | **Resolved** (removed insecure `/admin` portal completely) |
| SEC-03 | **Insecure `localStorage` CMS & Unvalidated Image Upload** (`FileReader.readAsDataURL` stored in `localStorage`, no shared persistence, no file type/size/content validation) | **High** | `src/components/BlogContext.tsx`, `src/components/BlogAdminClient.tsx` | **Resolved** (removed; public static `/blog` and `/blog/[slug]` preserved) |
| SEC-04 | **Vulnerable Transitive `postcss <= 8.5.22` in Next.js `15.5.29`** (XSS & path traversal advisories GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-fxqj-rqcc-2cmp, GHSA-r28c-9q8g-f849) | **High** | `node_modules/next/node_modules/postcss` | **Resolved** (upgraded to `next@16.4.6` Active LTS; `npm audit --omit=dev` now reports 0 vulnerabilities) |
| SEC-05 | **Missing Production HTTP Security Headers & CSP** | **High** | `netlify.toml` | **Resolved** (added HSTS, CSP without `unsafe-eval`, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |
| SEC-06 | **Unescaped `dangerouslySetInnerHTML` for JSON-LD** | **Medium** | `src/app/layout.tsx` | **Resolved** (added `serializeJsonLd()` escaping `<`, `>`, `&`, U+2028, U+2029) |
| SEC-07 | **Unbounded Cart Quantities & Form Input Lengths** | **Medium** | `src/components/CartContext.tsx`, `CartDrawer.tsx`, `ContactClient.tsx`, `WholesaleQuoteModal.tsx`, `ServicesClient.tsx` | **Resolved** (clamped bags `1..500`, hardened `localStorage` parsing, added `maxLength` and phone digit validation) |
| SEC-08 | **Relative URLs in `sitemap.xml` and `robots.txt` + Missing `metadataBase`** | **Medium** | `public/sitemap.xml`, `public/robots.txt`, `src/app/layout.tsx` | **Resolved** (replaced with App Router `src/app/sitemap.ts` and `src/app/robots.ts` using configurable `SITE_URL` and added `metadataBase` + canonicals) |
| SEC-09 | **Redundant Build Output (`dist/` + `out/`) & Generated Artifacts in Workspace** | **Low** | `package.json`, `netlify.toml`, `dist/`, `.next-dev/`, `tsconfig.tsbuildinfo` | **Resolved** (single authoritative `out/` export, updated `.gitignore`) |
| SEC-10 | **Moderate Transitive Advisories in `minimatch`/`glob` via `netlify-cli@27.20.1`** (devDependency only, not bundled into site) | **Low / Accepted Dev Risk** | `node_modules/netlify-cli` | **Documented** (monitored via Dependabot; `npm audit --omit=dev` = 0 vulnerabilities; `npm audit --audit-level=high` = 0) |

### Compromised Credentials Requiring Rotation
- **`rajvel@2026`** (previously hardcoded in `src/components/BlogAdminClient.tsx` and exported into client JavaScript bundles): Treat this password as permanently compromised. Do **not** reuse it for Netlify, GitHub, email, domain registrar, or any future CMS account.

---

## 2. Changes Implemented

1. **Removed Insecure Admin & `localStorage` CMS**:
   - Deleted `src/app/admin/page.tsx`, `src/components/BlogAdminClient.tsx`, and `src/components/BlogContext.tsx`.
   - Removed `<BlogProvider>` from `src/app/layout.tsx` and removed the `/admin` link from `src/components/BlogListClient.tsx`.
   - Restored direct static SSG links (`/blog/[slug]`) in `BlogListClient.tsx` so all blog posts remain fully functional and SEO-indexable.
2. **Frontend & Form Hardening**:
   - Added `src/lib/siteConfig.ts` with safe `getSiteUrl()` validation and `serializeJsonLd()` HTML-escape serialization.
   - Bounded cart quantities (`MIN_CART_BAGS = 1`, `MAX_CART_BAGS = 500`) and added strict schema validation + corruption cleanup in `CartContext.tsx`.
   - Added input `maxLength` limits, trimming, and phone digit validation (`7–15` digits) across `CartDrawer.tsx`, `ContactClient.tsx`, and `WholesaleQuoteModal.tsx`.
3. **SEO & Canonical URLs**:
   - Replaced relative `public/sitemap.xml` and `public/robots.txt` with `src/app/sitemap.ts` and `src/app/robots.ts` (`export const dynamic = "force-static"`) emitting absolute URLs from `SITE_URL` and excluding `/admin`.
   - Added `metadataBase`, canonical URLs, and absolute `Organization` JSON-LD `url`/`logo` in `src/app/layout.tsx`.
4. **Netlify Production Configuration**:
   - Updated `netlify.toml` to publish `out/`, pin `NODE_VERSION = "24"`, enforce security headers (including CSP without `unsafe-eval`), configure cache headers for HTML / `/_next/static/*` / `/images/*`, and retain custom `404.html` handling.
5. **Codebase Cleanup**:
   - Deleted unused `src/components/ui/SectionPrimitives.tsx`, obsolete `public/sitemap.xml`, `public/robots.txt`, and generated `dist/`, `.next-dev/`, `tsconfig.tsbuildinfo`.
   - Expanded `.gitignore` and added `.nvmrc` (`24`) and `.env.example`.

---

## 3. Dependencies Updated & Audit Results

- Upgraded `next` from `15.5.29` → **`16.4.6`** (Active LTS) and `eslint-config-next` from `15.5.29` → **`16.4.6`**.
- Migrated ESLint to native Next.js 16 flat config (`eslint .`), removing `@eslint/eslintrc`.
- Pinned `netlify-cli@27.20.1` as an exact `devDependency` for reproducible GitHub Actions deployments.
- **Audit Results**:
  - `npm audit --omit=dev`: **0 vulnerabilities**
  - `npm audit --audit-level=high`: **0 high / 0 critical vulnerabilities**
  - `npm audit` (including devDependencies): **12 moderate** transitive advisories (`minimatch` / `glob`) solely inside `netlify-cli@27.20.1` (never shipped to browser/production).

---

## 4. Files Removed vs. Retained

- **Removed**: `src/app/admin/page.tsx`, `src/components/BlogAdminClient.tsx`, `src/components/BlogContext.tsx`, `src/components/ui/SectionPrimitives.tsx`, `public/sitemap.xml`, `public/robots.txt`, `dist/`, `.next-dev/`, `tsconfig.tsbuildinfo`.
- **Added**: `src/lib/siteConfig.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `tests/security-and-static.test.mjs`, `.github/workflows/ci-deploy.yml`, `.github/dependabot.yml`, `.nvmrc`, `.env.example`, `docs/PRODUCTION_READINESS.md`.
- **Retained**: All public pages, product data, company data, blog articles, WebGL 3D components, cart & quote workflows, and optimized assets in `public/images/`.

---

## 5. CI/CD Architecture

- **Workflow**: `.github/workflows/ci-deploy.yml`
  - **PRs to `main`**: `npm ci` → `npm run lint` → `npm run typecheck` → `npm audit --omit=dev --audit-level=high` → `npm run build` → `npm test` → upload verified `out/` artifact → draft Netlify preview (`netlify deploy --dir=out`, blocked on untrusted fork PRs).
  - **Push/Merge to `main`**: Runs all quality/security gates → reuses verified `out/` artifact → deploys to Netlify production (`netlify deploy --dir=out --prod`) inside the `production` GitHub Environment.
- **Automation**: `.github/dependabot.yml` checks `npm` and `github-actions` weekly.
- **Pinning**: All third-party GitHub Actions are pinned to immutable commit SHAs.

---

## 6. Remaining Risks & Manual Configuration Requirements

### Manual Configuration Required Before First Automated Production Deploy
1. **Initialize / Push to GitHub**: This workspace is not yet initialized as a Git repository (`git init`, set remote, push to `main`).
2. **GitHub Secrets & Variables**:
   - Secret `NETLIFY_AUTH_TOKEN` (Netlify Personal Access Token)
   - Secret `NETLIFY_SITE_ID` (Netlify Site API ID)
   - Variable `SITE_URL` (actual production HTTPS origin, e.g., `https://rajvelfoodproducts.com`)
3. **GitHub Branch Protection & Environment**:
   - Protect `main` branch (require PR + passing `Lint, Typecheck, Audit, Build & Test` status check).
   - Configure the `production` environment in GitHub (optionally require manual reviewer approval).
4. **Netlify Dashboard**:
   - Disable automatic Git-based production builds so GitHub Actions is the sole deployment authority.
   - Verify HTTPS / TLS certificate is active on your custom domain before adding `includeSubDomains` or `preload` to HSTS.
5. **Blog CMS (Optional Future Enhancement)**:
   - If browser-based blog editing is required later, integrate a Git-backed CMS (e.g., Decap CMS or Keystatic) with server-side GitHub OAuth rather than client-side credentials or `localStorage`.

### Outstanding Production Blockers
- **None in code** once `SITE_URL`, `NETLIFY_AUTH_TOKEN`, and `NETLIFY_SITE_ID` are configured in GitHub and automatic Netlify Git builds are disabled.
