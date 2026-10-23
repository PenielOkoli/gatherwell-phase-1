import 'server-only';
import { cookies } from 'next/headers';
import type { WorkshopFormat } from '@/types/domain';

export async function getPreferredFormat(): Promise<WorkshopFormat> {
  return (await cookies()).get('gatherwell-format')?.value === 'remote' ? 'remote' : 'in-person';
}
