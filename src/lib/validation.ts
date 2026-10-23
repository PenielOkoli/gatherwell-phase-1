import { z } from 'zod';

export const workshopSchema = z.object({
  title: z.string().trim().min(3, 'Give your workshop a title of at least 3 characters.').max(80),
  goal: z.string().trim().min(12, 'Describe your outcome in at least 12 characters.').max(600),
  duration: z.union([z.literal(30), z.literal(60), z.literal(90)]),
  participants: z.number().int().min(2).max(30),
  format: z.enum(['in-person', 'remote']),
  kind: z.enum(['alignment', 'ideas', 'retrospective']),
}).strict();
export const assistantSchema = z.object({ question: z.string().trim().min(5).max(800) }).strict();
export const preferencesSchema = z.object({ format: z.enum(['in-person', 'remote']) }).strict();
export const storedPlanSchema = workshopSchema.extend({
  id: z.string().max(100), createdAt: z.string().max(60),
  sourceIds: z.array(z.string().max(80)).max(5),
  steps: z.array(z.object({ id: z.string().max(100), title: z.string().max(100), minutes: z.number().int().min(1).max(90), instruction: z.string().max(2000), outcome: z.string().max(300) })).length(5),
});
