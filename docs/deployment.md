# Deployment

Publication and verification details will be recorded here after GitHub and Vercel confirm the new project.

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
