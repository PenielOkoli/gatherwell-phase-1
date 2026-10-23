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
| GitHub repository and live Vercel URL | Recorded in `docs/deployment.md` after publishing |

## Automated evidence

Ten domain/boundary tests cover invalid shapes, length and numeric limits, all 18 duration/kind/format combinations, exact agenda totals, remote wording, larger-group breakouts, saved-data validation, malformed JSON, actual body-size enforcement, content type, foreign origins, demo labels, no-cache responses, and fail-closed live authorization.

## Verification log

Final production, browser, deployment, and dependency checks are recorded here as they complete. Live paid-model quality is outside this submission's verified scope.
