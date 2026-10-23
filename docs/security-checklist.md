# Security checklist

This is a bounded Phase 1 public demo, not a claim of complete production security. Deployment and static typing alone do not establish security.

## Implemented

- [x] Provider SDK, environment access, and bearer-token comparison are behind `import 'server-only'`.
- [x] No secret uses a `NEXT_PUBLIC_` prefix. Only public catalog data and a validated format value cross into client props.
- [x] `.env*`, `.vercel`, dependencies and generated build files are ignored; `.env.example` contains placeholders only.
- [x] Live AI is disabled by default and requires both `AI_MODE=live` and a matching private bearer token of at least 32 characters. Missing or short tokens fail closed.
- [x] The public browser UI always requests demo answers and contains no token-entry mechanism or embedded access token.
- [x] Server Actions validate unknown input with strict runtime schemas. Unsupported fields are rejected.
- [x] Workshop title is bounded to 3–80 characters, goal to 12–600, groups to 2–30 whole people, and duration to 30/60/90 minutes.
- [x] Assistant questions are bounded to 5–800 characters; actual request bytes are limited to 4 KiB regardless of Content-Length. Invalid JSON/content type and foreign Origin headers are rejected.
- [x] Server Action request bodies are limited to 16 KiB.
- [x] Model requests have 350 maximum output tokens, no retries, and a 15-second abort timeout.
- [x] Provider errors return a generic message. No provider error, prompt, key, or access token is explicitly logged by application code.
- [x] React escapes text. No `dangerouslySetInnerHTML`, executable model output, arbitrary remote URL fetching, or model tools are enabled.
- [x] Preference cookie is HttpOnly, SameSite=Lax, Secure in production, scoped to `/`, and expires after 30 days. It stores only a non-sensitive format enum.
- [x] Browser-local saved workshops are schema-validated and capped at 20. Storage failures do not falsely report a successful save.
- [x] Frame embedding is denied, MIME sniffing is disabled, sensitive device capabilities are disabled, and referrer leakage is reduced.
- [x] Assistant responses use `Cache-Control: no-store`.

## Operating limits / before public paid AI access

- [ ] Add account authentication and per-record ownership checks before private server persistence.
- [ ] Replace the single trusted-client token with user/session authorization where appropriate.
- [ ] Add a shared durable rate limiter, per-user quotas, provider spend caps, and abuse monitoring. There is no claim of distributed rate limiting in this foundation.
- [ ] Review generated advice for quality and accessibility with real facilitators; do not treat it as guaranteed accurate.
- [ ] Add a strict nonce-based script CSP if needed. The current CSP only restricts framing, object content, and base URLs; it is not a full script-execution policy.
- [ ] Review host logging/retention and privacy requirements before collecting personal information. Browser localStorage is not encrypted and is accessible to scripts on this origin.
- [ ] Add retention/deletion controls before storing workshop content on a server.
- [ ] Monitor dependency advisories and keep the lockfile updated.

## If a secret leaks

Revoke it at the provider immediately, replace it in the hosting environment, redeploy, review usage, and remove it from Git history if committed. Deleting a string from the latest commit is not sufficient. Never paste production secrets into a README, screenshot, issue, or browser JavaScript.

See `assessment.md` for the actual verification performed and its limits.
