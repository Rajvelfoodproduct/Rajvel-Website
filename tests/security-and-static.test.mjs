import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const OUT_DIR = path.join(ROOT, "out");

function walkFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

const EXPECTED_ROUTES = [
  "/",
  "/about/",
  "/products/",
  "/products/semmai/",
  "/products/uzhavan/",
  "/products/aruvi/",
  "/services/",
  "/facilities/",
  "/blog/",
  "/blog/pure-gram-flour-vs-multi-grain-flour/",
  "/blog/why-milling-temperature-and-grain-cleaning-matter/",
  "/blog/storing-30kg-gram-flour-bags-for-maximum-freshness/",
  "/contact/",
];

const SECRET_PATTERNS = [
  { name: "Compromised legacy admin password", regex: /rajvel@2026/i },
  { name: "Hardcoded ADMIN_CREDENTIALS block", regex: /ADMIN_CREDENTIALS/ },
  { name: "Client-side admin auth session key", regex: /rvf_blog_admin_auth/ },
  { name: "GitHub personal access token", regex: /ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,}/ },
  { name: "AWS access key", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  {
    name: "Hardcoded password literal",
    regex: /\bpassword\s*:\s*["'][^"']{4,}["']/i,
  },
];

test("Security: no hardcoded credentials or secrets exist in src/ or out/", () => {
  const textExtensions = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".html",
    ".css",
    ".xml",
    ".txt",
    ".toml",
  ]);

  const filesToScan = [...walkFiles(SRC_DIR), ...walkFiles(OUT_DIR)].filter(
    (file) => textExtensions.has(path.extname(file).toLowerCase())
  );

  assert.ok(filesToScan.length > 0, "Expected source and output files to scan");

  for (const file of filesToScan) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(ROOT, file);
    for (const pattern of SECRET_PATTERNS) {
      assert.equal(
        pattern.regex.test(content),
        false,
        `Detected ${pattern.name} in ${rel}`
      );
    }
  }
});

test("Security: insecure /admin route is completely removed from src/ and out/", () => {
  assert.equal(fs.existsSync(path.join(SRC_DIR, "app", "admin")), false);
  assert.equal(fs.existsSync(path.join(OUT_DIR, "admin")), false);
  assert.equal(
    fs.existsSync(path.join(SRC_DIR, "components", "BlogAdminClient.tsx")),
    false
  );
  assert.equal(
    fs.existsSync(path.join(SRC_DIR, "components", "BlogContext.tsx")),
    false
  );
});

test("Static export: all public routes, 404.html, sitemap.xml, and robots.txt exist in out/", () => {
  assert.equal(fs.existsSync(OUT_DIR), true, "Expected out/ directory from next build");

  for (const route of EXPECTED_ROUTES) {
    const filePath =
      route === "/"
        ? path.join(OUT_DIR, "index.html")
        : path.join(OUT_DIR, route.replace(/^\/|\/$/g, ""), "index.html");
    assert.equal(
      fs.existsSync(filePath),
      true,
      `Missing static HTML for route ${route} (${filePath})`
    );
  }

  assert.equal(fs.existsSync(path.join(OUT_DIR, "404.html")), true, "Missing out/404.html");
  assert.equal(fs.existsSync(path.join(OUT_DIR, "sitemap.xml")), true, "Missing out/sitemap.xml");
  assert.equal(fs.existsSync(path.join(OUT_DIR, "robots.txt")), true, "Missing out/robots.txt");
});

test("SEO: sitemap.xml and robots.txt use absolute canonical URLs and exclude /admin", () => {
  const sitemap = fs.readFileSync(path.join(OUT_DIR, "sitemap.xml"), "utf8");
  const robots = fs.readFileSync(path.join(OUT_DIR, "robots.txt"), "utf8");

  const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
    (m) => m[1]
  );
  assert.ok(locs.length >= EXPECTED_ROUTES.length, "Sitemap missing expected routes");

  for (const loc of locs) {
    assert.match(loc, /^https?:\/\/[^/]+\//, `Non-absolute sitemap URL: ${loc}`);
    assert.equal(loc.includes("/admin"), false, `Admin route leaked into sitemap: ${loc}`);
  }

  assert.match(
    robots,
    /Sitemap:\s*https?:\/\/[^/\s]+\/sitemap\.xml/i,
    "robots.txt must contain an absolute Sitemap URL"
  );
});

test("Assets: all referenced /images/* files in exported HTML exist in out/", () => {
  const htmlFiles = walkFiles(OUT_DIR).filter((f) => f.endsWith(".html"));
  assert.ok(htmlFiles.length > 0, "No HTML files found in out/");

  const missingAssets = new Set();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/(?:src|href)="(\/images\/[^"?#]+)"/g)) {
      const assetPath = path.join(OUT_DIR, match[1].replace(/^\//, ""));
      if (!fs.existsSync(assetPath)) {
        missingAssets.add(match[1]);
      }
    }
  }

  assert.deepEqual(
    Array.from(missingAssets),
    [],
    `Missing static image assets: ${Array.from(missingAssets).join(", ")}`
  );
});

test("Netlify configuration: publishes out/, pins Node 24, and enforces security headers", () => {
  const toml = fs.readFileSync(path.join(ROOT, "netlify.toml"), "utf8");
  assert.match(toml, /publish\s*=\s*"out"/);
  assert.match(toml, /NODE_VERSION\s*=\s*"24"/);
  assert.match(toml, /Strict-Transport-Security\s*=/);
  assert.match(toml, /X-Content-Type-Options\s*=\s*"nosniff"/);
  assert.match(toml, /Referrer-Policy\s*=/);
  assert.match(toml, /X-Frame-Options\s*=\s*"DENY"/);
  assert.match(toml, /Permissions-Policy\s*=/);
  assert.match(toml, /Content-Security-Policy\s*=/);
  assert.equal(
    toml.includes("unsafe-eval"),
    false,
    "CSP must not allow unsafe-eval"
  );
});

test("HTTP smoke test: all public routes return 200 and unknown routes return 404", async () => {
  const server = http.createServer((req, res) => {
    const reqPath = (req.url || "/").split("?")[0];
    let target = path.join(OUT_DIR, reqPath);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      target = path.join(target, "index.html");
    }
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(target).pipe(res);
      return;
    }
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(path.join(OUT_DIR, "404.html")).pipe(res);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    for (const route of EXPECTED_ROUTES) {
      const response = await fetch(`${baseUrl}${route}`);
      assert.equal(response.status, 200, `Expected 200 for ${route}`);
      const html = await response.text();
      assert.match(html, /<title>.*Raj Vel Food Products.*<\/title>/i);
    }

    const semmaiRes = await fetch(`${baseUrl}/products/semmai/`);
    assert.match(await semmaiRes.text(), /Semmai/);

    const uzhavanRes = await fetch(`${baseUrl}/products/uzhavan/`);
    assert.match(await uzhavanRes.text(), /Uzhavan/);

    const aruviRes = await fetch(`${baseUrl}/products/aruvi/`);
    assert.match(await aruviRes.text(), /Aruvi/);

    const notFoundRes = await fetch(`${baseUrl}/non-existent-route-check/`);
    assert.equal(notFoundRes.status, 404);
    assert.match(await notFoundRes.text(), /PAGE NOT FOUND/i);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
