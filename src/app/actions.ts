'use server';

import { cookies } from 'next/headers';
import { buildAgenda } from '@/lib/planner';
import { preferencesSchema, workshopSchema } from '@/lib/validation';
import type { ActionResult, WorkshopPlan, WorkshopFormat } from '@/types/domain';

export async function createWorkshop(input: unknown): Promise<ActionResult<WorkshopPlan>> {
  const parsed = workshopSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check your workshop details.' };
  return { ok: true, data: buildAgenda(parsed.data) };
}

// Real server-side mutation: an HttpOnly preference cookie, read by page.tsx.
export async function savePreferredFormat(input: unknown): Promise<ActionResult<WorkshopFormat>> {
  const parsed = preferencesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Choose a valid workshop format.' };
  (await cookies()).set('gatherwell-format', parsed.data.format, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  return { ok: true, data: parsed.data.format };
}
