import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, CircleHelp, Flower2, LayoutDashboard, Leaf } from 'lucide-react';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/fraunces';
import './globals.css';

export const metadata: Metadata = { title: 'Gatherwell — Make time together matter', description: 'Thoughtful workshop plans for teams and communities. Turn a shared goal into a clear, practical agenda.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>
    <aside className="sidebar">
      <Link className="brand" href="/" aria-label="Gatherwell home"><Flower2 size={31} strokeWidth={1.6} />gatherwell<span>®</span></Link>
      <div className="workspace-label">YOUR FACILITATION SPACE</div>
      <nav aria-label="Main navigation"><Link href="/"><LayoutDashboard size={18} /> Workshop studio</Link><Link href="/playbook"><BookOpen size={18} /> The playbook</Link><Link href="/about"><CircleHelp size={18} /> About this project</Link></nav>
      <div className="sidebar-note"><Leaf size={23} /><h3>Good things happen<br />when we gather.</h3><p>A little structure.<br />More room for people.</p><Link href="/playbook">Find your starting point <ArrowUpRight size={16} /></Link></div>
      <div className="sidebar-footer"><span className="avatar">G</span><div>Gatherwell studio<small>Phase 1 · Public demo</small></div><span className="status-dot" /></div>
    </aside>
    <div className="app-shell"><header className="topbar"><span>Made for meaningful collaboration</span><span className="demo-badge"><span /> Demo workspace</span></header>{children}<footer className="page-footer"><span>Less planning friction. More human connection.</span><span>Gatherwell · 2026</span></footer></div>
  </body></html>;
}
