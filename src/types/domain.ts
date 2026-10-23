export type WorkshopFormat = 'in-person' | 'remote';
export type WorkshopKind = 'alignment' | 'ideas' | 'retrospective';
export interface WorkshopInput {
  title: string;
  goal: string;
  duration: 30 | 60 | 90;
  participants: number;
  format: WorkshopFormat;
  kind: WorkshopKind;
}
export interface AgendaStep {
  id: string;
  title: string;
  minutes: number;
  instruction: string;
  outcome: string;
}
export interface Source {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: 'internal-playbook';
}
export interface WorkshopPlan extends WorkshopInput {
  id: string;
  steps: AgendaStep[];
  sourceIds: string[];
  createdAt: string;
}
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sourceIds: string[];
  mode: 'demo' | 'live';
}
export interface ToolDefinition {
  name: 'buildAgenda';
  description: string;
  execution: 'server';
  requiresConfirmation: boolean;
}
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
export interface Template extends WorkshopInput { id: string; eyebrow: string; description: string; }
