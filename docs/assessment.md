# Phase 1 submission and evidence

## Requirement map

| Required deliverable | Implementation / evidence |
|---|---|
| New product foundation | `docs/product-brief.md`: Gatherwell, a workshop planning assistant |
| Next.js App Router | `src/app/layout.tsx`, `page.tsx`, `/playbook`, `/about`, `/api/assistant` |
| TypeScript enabled | `tsconfig.json` with `strict: true`; typed application and tests |
| Server vs Client Components | Server pages + `src/components/workspace.tsx`; explanation in `docs/architecture.md` |
| Server Actions | `createWorkshop` and `savePreferredFormat` in `src/app/actions.ts` |
| Shared messages/tools/sources | `Message`, `ToolDefinition`, `Source` in `src/types/domain.ts` |
| Server-only environment and secrets | `.env.example`, `src/lib/server/ai.ts`, `server-only` guards |
| Security checklist | `docs/security-checklist.md` |
| Module 1 product-to-boundary mapping | Table in `docs/architecture.md` |
| Vercel AI SDK plus provider adapter | `ai`, `@ai-sdk/openai` in package manifest/lockfile; `generateText` in server module |
| AI/frontend boundary note | `docs/ai-sdk-boundary.md` |
| GitHub repository and live Vercel URL | [Repository](https://github.com/PenielOkoli/gatherwell-phase-1) · [Live app](https://gatherwell-phase-1.vercel.app) |

## Automated evidence

Ten domain/boundary tests cover invalid shapes, length and numeric limits, all 18 duration/kind/format combinations, exact agenda totals, remote wording, larger-group breakouts, saved-data validation, malformed JSON, actual body-size enforcement, content type, foreign origins, demo labels, no-cache responses, and fail-closed live authorization.

## Verification log

Completed on **23 October 2026**:

| Check | Result |
|---|---|
| `npm run typecheck` | Passed, strict TypeScript |
| `npm test` | 10 tests passed, 0 failed |
| `npm run build` | Passed; Next.js 16.4.2 production build |
| Dependency audit during install/lockfile update | 0 reported vulnerabilities |
| Vercel production build | Ready; real Next.js server functions deployed |
| Live routes `/`, `/playbook`, `/about` | HTTP 200; security header present |
| Live assistant | HTTP 200; `mode: demo`; `Cache-Control: no-store` |
| Live malformed JSON | HTTP 400 |
| Live request above 4 KiB | HTTP 413 |
| Live foreign Origin | HTTP 403 |
| Live mode without authorization | HTTP 403 |
| Browser agenda generation | Five activities totaling 60 minutes; result focus moved to agenda heading |
| Template selection | Retrospective populated 30 minutes, six people, remote, with matching agenda activities |
| Local save / reopen | Saved workshop survived reload and reopened on localhost and production |
| Server preference | Remote preference survived reload on localhost and production |
| Download | Browser downloaded a Markdown file; contents inspected for goal, settings, instructions and outcomes |
| Guide UI | Curated participation answer rendered with an explicit demo label |
| Responsive layout | Desktop 1440 × 1000 and mobile 390 × 844 tested; no horizontal overflow (scrollbar-adjusted content widths 1425 and 375 respectively) |
| Browser console | No errors in captured production browser logs |

Screenshots: [desktop](screenshots/desktop.png), [mobile](screenshots/mobile.png).

Accessibility evidence includes labeled form controls, visible keyboard focus styles, a skip link, semantic headings, expandable buttons with `aria-expanded` and `aria-controls`, pending/disabled controls, status and error announcements, and reduced-motion CSS. This is not a formal WCAG conformance audit or screen-reader usability study.

Live paid-model quality is outside this submission's verified scope. The provider branch is type-checked and authorization-tested but was not exercised with a paid key. GitHub Actions is supplied as an optional example because the available credential lacks workflow-write scope; no automated CI run is claimed.
