/**
 * Cloudflare Worker entrypoint:
 * - Serves static Next.js export from ./out via env.ASSETS
 * - Provides /api/auth and /api/callback for Decap CMS GitHub OAuth login
 *   (requires GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET Worker secrets)
 */
const ALLOWED_ORIGIN = "https://rajvelfoodproduct.com";

function escapeJsString(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function renderOAuthCallbackPage(status, payload) {
  const safePayload = escapeJsString(JSON.stringify(payload));
  const message =
    status === "success"
      ? `authorization:github:success:${JSON.stringify(payload)}`
      : `authorization:github:error:${JSON.stringify(payload)}`;
  const safeMessage = escapeJsString(message);
  const safeOrigin = escapeJsString(ALLOWED_ORIGIN);

  return new Response(
    `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Authenticating...</title></head>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          if (e.origin !== ${safeOrigin}) return;
          window.opener.postMessage(${safeMessage}, e.origin);
          window.removeEventListener("message", receiveMessage, false);
          window.close();
        }
        window.addEventListener("message", receiveMessage, false);
        if (window.opener) {
          window.opener.postMessage("authorizing:github", ${safeOrigin});
        } else {
          document.body.textContent = "Authentication complete (" + ${safePayload} + "). You may close this window.";
        }
      })();
    </script>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    }
  );
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth") {
      if (!env.GITHUB_CLIENT_ID) {
        return new Response(
          "GitHub OAuth is not configured yet. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Cloudflare Worker Settings -> Variables and Secrets.",
          { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
      }

      const state = crypto.randomUUID();
      const redirectUri = `${url.origin}/api/callback`;
      const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
      githubAuthUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
      githubAuthUrl.searchParams.set("scope", "repo,user");
      githubAuthUrl.searchParams.set("state", state);

      return Response.redirect(githubAuthUrl.toString(), 302);
    }

    if (url.pathname === "/api/callback") {
      const code = url.searchParams.get("code");
      if (!code || !env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
        return renderOAuthCallbackPage("error", {
          error: "Missing OAuth code or server credentials",
        });
      }

      const tokenRes = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        }
      );

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        return renderOAuthCallbackPage("error", {
          error: tokenData.error_description || "Failed to obtain access token",
        });
      }

      return renderOAuthCallbackPage("success", {
        token: tokenData.access_token,
        provider: "github",
      });
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
