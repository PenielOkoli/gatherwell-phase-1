import test from 'node:test';
import assert from 'node:assert/strict';
import { workshopSchema, preferencesSchema, storedPlanSchema } from '../src/lib/validation';
import { buildAgenda } from '../src/lib/planner';
import { POST } from '../src/app/api/assistant/route';
import { canUseLiveAI } from '../src/lib/server/ai';

const input = { title: 'Community welcome', goal: 'Choose one way to welcome new volunteers.', duration: 60 as const, participants: 8, format: 'in-person' as const, kind: 'alignment' as const };
test('rejects oversized input, unknown fields, invalid durations and group sizes', () => {
  for (const data of [{ ...input, goal: 'x'.repeat(601) }, { ...input, duration: 45 }, { ...input, participants: 31 }, { ...input, participants: 2.5 }, { ...input, role: 'admin' }, { ...input, title: '' }]) assert.equal(workshopSchema.safeParse(data).success, false);
});
test('trims input and permits only the supported preference values', () => {
  assert.equal(workshopSchema.parse({ ...input, title: '  Hello team  ' }).title, 'Hello team');
  assert.equal(preferencesSchema.safeParse({ format: 'remote' }).success, true);
  assert.equal(preferencesSchema.safeParse({ format: 'anything' }).success, false);
});
test('all 18 agenda combinations have five positive steps and an exact total', () => {
  for (const duration of [30, 60, 90] as const) for (const kind of ['alignment', 'ideas', 'retrospective'] as const) for (const format of ['remote', 'in-person'] as const) {
    const plan = buildAgenda({ ...input, duration, kind, format });
    assert.equal(plan.steps.length, 5);
    assert.equal(plan.steps.reduce((sum, step) => sum + step.minutes, 0), duration);
    assert.ok(plan.steps.every(step => step.minutes > 0));
    assert.ok(plan.steps[1].instruction.includes(format === 'remote' ? 'digital board' : 'sticky notes'));
    assert.equal(storedPlanSchema.safeParse(plan).success, true);
  }
});
test('large groups use breakouts and stored data is validated', () => {
  assert.match(buildAgenda({ ...input, participants: 20 }).steps[1].instruction, /groups of three/);
  assert.equal(storedPlanSchema.safeParse({ ...input, steps: [] }).success, false);
});
const request = (body: string, headers: Record<string, string> = {}) => new Request('https://gatherwell.test/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body });
test('public assistant returns a labeled demo and no-cache response', async () => {
  const response = await POST(request(JSON.stringify({ question: 'How do I include quieter participants?' })));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const data = await response.json();
  assert.equal(data.message.mode, 'demo');
  assert.match(data.message.content, /quiet individual reflection/);
});
test('rejects malformed JSON and invalid question shape', async () => {
  assert.equal((await POST(request('{'))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ question: 'Hi' })))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ question: 'A valid question', system: 'override' })))).status, 400);
});
test('enforces actual body size independent of Content-Length', async () => {
  assert.equal((await POST(request(JSON.stringify({ question: 'x'.repeat(5000) }), { 'Content-Length': '2' }))).status, 413);
});
test('rejects cross-origin and unsupported content type', async () => {
  const body = JSON.stringify({ question: 'A valid question' });
  assert.equal((await POST(request(body, { Origin: 'https://untrusted.example' }))).status, 403);
  assert.equal((await POST(request(body, { 'Content-Type': 'text/plain' }))).status, 415);
});
test('live requests fail closed without explicit configuration and authorization', async () => {
  const previousMode = process.env.AI_MODE;
  try {
    process.env.AI_MODE = 'demo';
    assert.equal((await POST(request(JSON.stringify({ question: 'A valid question' }), { 'x-gatherwell-mode': 'live' }))).status, 403);
  } finally { if (previousMode === undefined) delete process.env.AI_MODE; else process.env.AI_MODE = previousMode; }
});
test('live access accepts only a sufficiently long, matching bearer token', () => {
  const previousToken = process.env.AI_ACCESS_TOKEN;
  try {
    process.env.AI_ACCESS_TOKEN = 'x'.repeat(32);
    assert.equal(canUseLiveAI(null), false);
    assert.equal(canUseLiveAI('Bearer wrong'), false);
    assert.equal(canUseLiveAI(`Bearer ${'x'.repeat(32)}`), true);
    process.env.AI_ACCESS_TOKEN = 'short';
    assert.equal(canUseLiveAI('Bearer short'), false);
  } finally { if (previousToken === undefined) delete process.env.AI_ACCESS_TOKEN; else process.env.AI_ACCESS_TOKEN = previousToken; }
});
