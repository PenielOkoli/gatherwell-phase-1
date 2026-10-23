# Deployment

Published and verified on **23 October 2026**.

- **GitHub:** https://github.com/PenielOkoli/gatherwell-phase-1
- **Live Vercel URL:** https://gatherwell-phase-1.vercel.app
- Vercel project: `gatherwell-phase-1` in `penielokolis-projects`.
- Public repository, default branch `main`, connected to Vercel for deployments.
- Vercel production status: **Ready**. The application was opened and exercised at the public URL without a login.
- Verified application deployment: `dpl_DpUBbGRmTGarVt48xoAAu1tEwpg6` (application commit `6c3291a`; later documentation-only commits retain the same app).
- Public mode: deterministic agenda builder and curated demo assistant. No paid provider key was configured or used.

The existing GitHub login can create repositories and push application code, but it lacks workflow-write scope. The optional CI workflow is therefore included as `docs/ci-workflow.example.yml`, not activated under `.github/workflows`. Local checks and Vercel builds passed; GitHub Actions was not represented as having run.

## Reproduce a Vercel deployment

1. Import this repository as a new Vercel project.
2. Choose the Next.js framework preset and Node.js 22.x.
3. Use the repository root, `npm ci`, and `npm run build` with default Next.js output settings.
4. Leave provider secrets unset for the public demo; optionally set `AI_MODE=demo` explicitly.
5. Deploy and check the studio, playbook, about page, and assistant.

The home page and Server Actions require a server runtime. Do not configure a static export. `.vercel` holds local project metadata and is excluded from Git. Any provider secrets must be configured in Vercel environment settings for the intended environment and followed by a redeployment.

## Smoke check

- Open the live URL and build a 60-minute agenda.
- Confirm five activities total exactly 60 minutes.
- Choose remote and remember the preference; reload and check the selection.
- Save a workshop; reopen Saved workshops after reload.
- Download a Markdown agenda.
- Ask the guide a participation question; confirm the response is labeled demo.
- Visit `/playbook` and `/about`.
- Send malformed and oversized assistant requests; confirm 400/413 responses.
- Request live mode without authorization; confirm a 403 response.

See `assessment.md` for completed checks and verification limits.
