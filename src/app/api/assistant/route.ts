import { assistantSchema } from '@/lib/validation';
import { demoAnswer } from '@/lib/planner';
import { boundedJSON } from '@/lib/server/http';
import { canUseLiveAI, generateFacilitationAdvice } from '@/lib/server/ai';
import type { Message } from '@/types/domain';

export const runtime = 'nodejs';
export const maxDuration = 20;
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'This origin is not allowed.' }, 403);
  let input: unknown;
  try { input = await boundedJSON(request); }
  catch (error) {
    const reason = error instanceof Error ? error.message : '';
    return json({ error: reason === 'size' ? 'Request is too large.' : 'Send a valid JSON request.' }, reason === 'size' ? 413 : reason === 'content-type' ? 415 : 400);
  }
  const parsed = assistantSchema.safeParse(input);
  if (!parsed.success) return json({ error: 'Ask a question between 5 and 800 characters.' }, 400);
  // The public UI always uses demo mode. Live mode is for a trusted server client.
  const liveRequested = request.headers.get('x-gatherwell-mode') === 'live';
  if (liveRequested && (process.env.AI_MODE !== 'live' || !canUseLiveAI(request.headers.get('authorization')))) return json({ error: 'Live AI access is unavailable or unauthorized.' }, 403);
  try {
    const message: Message = { id: crypto.randomUUID(), role: 'assistant', content: liveRequested ? await generateFacilitationAdvice(parsed.data.question) : demoAnswer(parsed.data.question), sourceIds: liveRequested ? [] : ['participation', 'decisions', 'timeboxing'], mode: liveRequested ? 'live' : 'demo' };
    return json({ message });
  } catch { return json({ error: 'The assistant is unavailable. Please try again later.' }, 503); }
}
