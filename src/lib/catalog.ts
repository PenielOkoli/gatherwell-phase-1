import type { Source, Template, ToolDefinition } from '@/types/domain';

export const templates: Template[] = [
  { id: 'alignment', kind: 'alignment', eyebrow: 'GET ON THE SAME PAGE', title: 'Team alignment', description: 'Turn different perspectives into a shared direction.', goal: 'Agree on our three most important priorities for the next month.', duration: 60, participants: 8, format: 'in-person' },
  { id: 'ideas', kind: 'ideas', eyebrow: 'MAKE SPACE FOR POSSIBILITY', title: 'Better ideas, together', description: 'Go from a blank page to ideas worth exploring.', goal: 'Find three practical ways to improve our community welcome experience.', duration: 90, participants: 10, format: 'in-person' },
  { id: 'retrospective', kind: 'retrospective', eyebrow: 'LEARN AND MOVE FORWARD', title: 'A thoughtful retrospective', description: 'Reflect on what happened. Decide what changes.', goal: 'Learn from our last project and choose one improvement to try next.', duration: 30, participants: 6, format: 'remote' },
];
export const sources: Source[] = [
  { id: 'participation', title: 'Make room for every voice', description: 'Quiet reflection before group discussion helps everyone contribute.', href: '/playbook#participation', kind: 'internal-playbook' },
  { id: 'decisions', title: 'End with a clear next step', description: 'Turn the conversation into an action, an owner, and a check-in.', href: '/playbook#decisions', kind: 'internal-playbook' },
  { id: 'timeboxing', title: 'Give each activity a boundary', description: 'Use visible timeboxes and protect the final commitment.', href: '/playbook#timeboxing', kind: 'internal-playbook' },
];
export const agendaTool: ToolDefinition = {
  name: 'buildAgenda', description: 'Build a five-part agenda with an exact total duration.', execution: 'server', requiresConfirmation: false,
};
