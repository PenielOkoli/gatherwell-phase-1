import { Workspace } from '@/components/workspace';
import { templates, sources } from '@/lib/catalog';
import { getPreferredFormat } from '@/lib/server/settings';

export default async function Home() {
  const preferredFormat = await getPreferredFormat();
  return <main id="main"><Workspace templates={templates} sources={sources} preferredFormat={preferredFormat} /></main>;
}
