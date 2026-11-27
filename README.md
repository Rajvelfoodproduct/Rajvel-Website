# Raj Vel Food Products — Official Website

Production static business website for **Raj Vel Food Products** (Kadayampatti, Salem, Tamil Nadu — FSSAI Lic. No: `22426179000396`), showcasing the company's flour range in priority order:

1. **Semmai** — Pure Gram Flour
2. **Uzhavan** — Multi-Grain Gram Flour
3. **Aruvi** — Multi-Grain Gram Flour

---

## 1. Project Architecture

- **Static Site Export (`output: "export"`)**: Next.js App Router compiles all public routes, product detail pages, blog articles, `sitemap.xml`, `robots.txt`, and `404.html` into a single authoritative `out/` directory.
- **No Unauthenticated Client-Side Backend**: All product, company, process, and blog data live in version-controlled source files (`src/data/siteData.ts`). Wholesale quotes and cart enquiries generate formatted WhatsApp / email messages without storing sensitive customer data server-side.
- **Responsive UI & 3D WebGL**: Mobile-first Tailwind CSS layout with Framer Motion (`useReducedMotion` aware) and GPU WebGL2 particle stages (`GrainSculpture3D`, `ApproachStage3D`) featuring automatic mobile optimization and static fallback rendering.

## 2. Technology Stack

- **Runtime**: Node.js `24` LTS (pinned in `.nvmrc`, `netlify.toml`, and GitHub Actions)
- **Framework**: Next.js `16.4.6` (App Router, static export) & React `19.3.1`
- **Language**: TypeScript `5.9.3` (strict mode)
- **Styling**: Tailwind CSS `4.3.5` (`@tailwindcss/postcss`), `Fraunces` + `Outfit` fonts
- **Animations & Icons**: Framer Motion `12.43.0`, Lucide React `0.475.0`
- **Linting & Deployment CLI**: ESLint `9.39.5` + `eslint-config-next@16.4.6` (flat config), pinned `netlify-cli@27.20.1`

## 3. Local Development Setup

Ensure Node.js 24 LTS is active (e.g., via `nvm use`), then install dependencies reproducibly:

```bash
npm ci
```

Copy the environment example if you want to override `SITE_URL` locally:

```bash
cp .env.example .env.local
```

Start the local development server (uses `.next-dev` so production builds in `.next` never collide with dev manifests):

```bash
npm run dev
```

To clear all Next.js caches and rebuild cleanly:

```bash
npm run dev:clean
```

## 4. Dependency Installation

Always use `npm ci` in CI/CD and clean environments to install exact versions from `package-lock.json`:

```bash
npm ci
```

Keep `package.json` and `package-lock.json` synchronized whenever updating packages.

## 5. Lint and Typecheck Commands

Run ESLint (direct flat-config CLI):

```bash
npm run lint
```

Run strict TypeScript validation:

```bash
npm run typecheck
```

## 6. Testing Instructions

The automated security and static smoke test suite (`tests/security-and-static.test.mjs`) uses Node's built-in test runner and validates:

- Zero hardcoded credentials or secret tokens in `src/` and exported `out/` bundles
- Complete removal of the insecure `/admin` route
- Presence of all static routes, `404.html`, `sitemap.xml`, and `robots.txt` in `out/`
- Absolute canonical URLs in `sitemap.xml` and `robots.txt`
- Zero missing `/images/*` references across all exported HTML files
- Required security headers in `netlify.toml`
- Live HTTP `200` responses for all public routes and `404` for unknown routes

Run after `npm run build`:

```bash
npm test
```

Run the full verification pipeline in one command:

```bash
npm run test:all
```

## 7. Production Build Instructions

Generate the authoritative static export in `out/`:

```bash
npm ci
npm run build
```

## 8. Netlify Deployment Configuration

Netlify settings are defined in `netlify.toml`:

- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: `24`
- **Security headers**: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and `Content-Security-Policy`
- **Caching**: `max-age=0, must-revalidate` for HTML, `max-age=31536000, immutable` for `/_next/static/*`, and `max-age=604800, stale-while-revalidate=86400` for `/images/*`
- **Custom 404**: `/* -> /404.html` (`status = 404`)

> **Important (Single Deployment Authority)**: Because GitHub Actions deploys verified artifacts via Netlify CLI, disable automatic Git-triggered production builds in the Netlify dashboard (**Site configuration → Build & deploy → Build settings → Stop builds**) to prevent duplicate builds and race conditions.

## 9. GitHub Actions Pipeline

Defined in `.github/workflows/ci-deploy.yml`:

- **Pull Requests (`main`)**: Runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm audit --omit=dev --audit-level=high`, `npm run build`, and `npm test`. For trusted branches in the same repository (never untrusted fork PRs), uploads `out/` and deploys a draft preview via `npx netlify deploy --dir=out`.
- **Push / Merge to `main`**: Runs all mandatory checks, stops immediately on any failure, reuses the verified `out/` build artifact, and deploys to Netlify production via `npx netlify deploy --dir=out --prod` inside the protected `production` GitHub Environment.
- **Security Hardening**: Least-privilege `permissions`, SHA-pinned actions, workflow concurrency limits, timeouts, and zero `pull_request_target` usage.

## 10. Required GitHub Secrets and Variables

Configure these in **GitHub Repository → Settings → Secrets and variables → Actions**:

| Name | Type | Description |
| --- | --- | --- |
| `NETLIFY_AUTH_TOKEN` | **Secret** | Personal access token created in Netlify User Settings |
| `NETLIFY_SITE_ID` | **Secret** | API ID of the target Netlify site |
| `SITE_URL` | **Variable** | Canonical production origin (e.g. `https://rajvelfoodproducts.com`, no trailing slash) |

Create a GitHub Environment named `production` with required reviewers if you want manual approval before production deployments.

## 11. Environment Variable Management

- Never commit `.env` or `.env.local` files (ignored via `.gitignore`).
- Only non-sensitive public configuration such as `SITE_URL` should be set in build variables.
- Never place private credentials in `NEXT_PUBLIC_*` variables or frontend components.

## 12. Security Practices

- Zero hardcoded passwords, tokens, or API keys in source or static bundles (enforced by automated tests).
- Client-side `localStorage` is used strictly for non-sensitive shopping cart quantities (bounded `1..500` with schema validation and corrupted-data recovery).
- JSON-LD structured data is serialized with HTML character escaping (`serializeJsonLd` in `src/lib/siteConfig.ts`).
- All external links use `rel="noopener noreferrer"`.
- Strict HTTP security headers and Content Security Policy are enforced via `netlify.toml`.

## 13. Dependency Update Process

- `.github/dependabot.yml` runs weekly on Mondays for both `npm` and `github-actions`.
- Review Dependabot PRs via the automated CI workflow before merging.
- Run `npm audit --omit=dev --audit-level=high` and `npm audit` periodically; never run `npm audit fix --force` blindly.

## 14. Rollback Procedure

1. **Immediate Netlify Rollback (fastest, < 30 seconds)**: Open **Netlify Dashboard → Deploys**, select the last known-good production deploy, and click **Publish deploy**.
2. **Git Rollback**: Revert the offending commit on `main` (`git revert <sha>`) and push to `main` so GitHub Actions builds, tests, and deploys the reverted state cleanly.

## 15. Blog Content Publishing Procedure

The insecure client-side `/admin` portal (which relied on hardcoded frontend credentials and browser-only `localStorage`) has been permanently removed.

### Current Static Publishing Workflow (Zero-Cost, Git-Backed)

1. Add any new cover image to `public/images/` (optimized WebP/JPEG).
2. Add a new entry to `BLOG_ARTICLES` in `src/data/siteData.ts` with a unique `slug`, `category`, `readTime`, `date`, `title`, `excerpt`, `coverImage`, and `content` array.
3. Run `npm run test:all` locally to verify lint, types, build, sitemap generation, and smoke tests.
4. Open a pull request to `main` to review the Netlify draft preview, then merge to publish automatically.

### Future Authenticated CMS Option

If non-technical editors need a browser-based CMS later, connect a maintained Git-backed CMS (such as **Decap CMS** with GitHub OAuth or **Keystatic** with GitHub mode) where authentication is enforced server-side via GitHub OAuth, edits commit to Git, and Netlify/GitHub Actions rebuilds the static site cleanly.
