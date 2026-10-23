'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowDownToLine, ArrowRight, Bookmark, Check, ChevronDown, Clock3, Flower2, Lightbulb, LoaderCircle, Monitor, Plus, RotateCcw, Send, Sparkles, Users, X } from 'lucide-react';
import { createWorkshop, savePreferredFormat } from '@/app/actions';
import { storedPlanSchema } from '@/lib/validation';
import type { Message, Source, Template, WorkshopFormat, WorkshopInput, WorkshopPlan } from '@/types/domain';

const STORAGE_KEY = 'gatherwell-plans-v1';
const defaultQuestion = 'How can I make sure everyone gets a chance to contribute?';

export function Workspace({ templates, sources, preferredFormat }: { templates: Template[]; sources: Source[]; preferredFormat: WorkshopFormat }) {
  const [input, setInput] = useState<WorkshopInput>({ ...templates[0], format: preferredFormat });
  const [plan, setPlan] = useState<WorkshopPlan | null>(null);
  const [saved, setSaved] = useState<WorkshopPlan[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [view, setView] = useState<'studio' | 'saved'>('studio');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>('step-1');
  const [question, setQuestion] = useState(defaultQuestion);
  const [answer, setAnswer] = useState<Message | null>(null);
  const [asking, setAsking] = useState(false);
  const [assistantError, setAssistantError] = useState('');
  const planHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(raw)) setSaved(raw.slice(0, 20).flatMap(item => { const result = storedPlanSchema.safeParse(item); return result.success ? [result.data] : []; }));
    } catch { setNotice('Local storage is unavailable. You can still download your agenda.'); }
    setStorageReady(true);
  }, []);

  const update = <K extends keyof WorkshopInput>(key: K, value: WorkshopInput[K]) => setInput(current => ({ ...current, [key]: value }));
  function useTemplate(template: Template) {
    setInput({ title: template.title, goal: template.goal, kind: template.kind, duration: template.duration, participants: template.participants, format: template.format });
    setError(''); setView('studio'); setNotice(`“${template.title}” loaded. Make it your own, then build your agenda.`);
    document.getElementById('workshop-title')?.focus();
  }
  function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setNotice('');
    startTransition(async () => {
      try {
        // Only explicitly selected fields cross the server boundary.
        const { title, goal, duration, participants, format, kind } = input;
        const result = await createWorkshop({ title, goal, duration, participants, format, kind });
        if (!result.ok) { setError(result.error); return; }
        setPlan(result.data); setExpanded('step-1'); setNotice('Your agenda is ready. Review it before your session.');
        setTimeout(() => planHeading.current?.focus(), 50);
      } catch { setError('We could not build your agenda. Please try again.'); }
    });
  }
  function persist(next: WorkshopPlan[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setSaved(next); return true; }
    catch { setError('Could not save to this browser. Download your agenda instead.'); return false; }
  }
  function savePlan() {
    if (!plan || !storageReady) return;
    if (persist([plan, ...saved.filter(item => item.id !== plan.id)].slice(0, 20))) setNotice('Saved on this browser. Find it in Saved workshops.');
  }
  function download() {
    if (!plan) return;
    const content = `# ${plan.title}\n\nGoal: ${plan.goal}\n\n${plan.duration} minutes · ${plan.participants} people · ${plan.format}\n\n${plan.steps.map((step, i) => `## ${i + 1}. ${step.title} (${step.minutes} min)\n\n${step.instruction}\n\nOutcome: ${step.outcome}`).join('\n\n')}\n\nPrepared with Gatherwell. Template-based demo; review before facilitating.\n`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'gatherwell-workshop.md'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Your agenda has been downloaded.');
  }
  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAsking(true); setAssistantError('');
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }), signal: AbortSignal.timeout(20000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The guide is unavailable.');
      setAnswer(data.message);
    } catch (error) { setAssistantError(error instanceof Error && error.name !== 'TimeoutError' ? error.message : 'The guide took too long. Please try again.'); }
    finally { setAsking(false); }
  }
  async function rememberFormat() {
    try { const result = await savePreferredFormat({ format: input.format }); setNotice(result.ok ? 'Your preferred format is remembered for 30 days.' : result.error); }
    catch { setNotice('Your format could not be remembered. Please try again.'); }
  }

  return <div className="workspace">
    <section className="hero"><div><div className="eyebrow"><span /> THE WORKSHOP STUDIO</div><h1>Make time together <em>matter.</em></h1><p>A clear purpose. A thoughtful plan. A room where everyone belongs.</p></div><div className="hero-flower" aria-hidden="true"><Flower2 strokeWidth={0.7} /><span>GATHER WITH INTENTION</span></div></section>
    <div className="workspace-tabs"><div><button className={view === 'studio' ? 'active' : ''} onClick={() => setView('studio')}><Sparkles size={16} /> Your workshop</button><button className={view === 'saved' ? 'active' : ''} onClick={() => setView('saved')}><Bookmark size={16} /> Saved workshops <span className="count">{saved.length}</span></button></div><span className="small-note">A little planning goes a long way.</span></div>
    <div role="status" className={notice ? 'notice' : 'sr-only'}>{notice}</div>
    {view === 'saved' ? <section className="saved-panel"><div className="section-heading"><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Your saved workshops</h2></div><button className="button secondary" onClick={() => setView('studio')}><Plus size={17} /> New workshop</button></div><p className="muted">Stored only in this browser, up to 20 workshops. Download anything you want to keep elsewhere.</p>{saved.length ? <div className="saved-grid">{saved.map(item => <article className="saved-card" key={item.id}><span className="tag">{item.kind}</span><h3>{item.title}</h3><p>{item.goal}</p><div className="meta"><span><Clock3 size={14} />{item.duration} min</span><span><Users size={14} />{item.participants} people</span></div><div className="saved-actions"><button className="text-button" onClick={() => { setPlan(item); setInput(item); setView('studio'); setNotice('Saved workshop opened.'); }}>Open agenda <ArrowRight size={16} /></button><button className="icon-button" aria-label={`Remove ${item.title}`} onClick={() => { if (persist(saved.filter(p => p.id !== item.id))) setNotice('Workshop removed from this browser.'); }}><X size={17} /></button></div></article>)}</div> : <div className="empty-saved"><Bookmark size={32} /><h3>A home for your next great gathering.</h3><p>Build an agenda, then save it here for later.</p><button className="button primary" onClick={() => setView('studio')}>Plan a workshop <ArrowRight size={17} /></button></div>}</section> : <>
    <div className="studio-grid">
      <section className="card brief-card"><div className="card-heading"><span className="step-number">01</span><div><h2>Start with the intention</h2><p>Tell us a little about your gathering.</p></div></div>
        <form onSubmit={generate}>
          <label htmlFor="workshop-title">Workshop name</label><input id="workshop-title" value={input.title} onChange={e => update('title', e.target.value)} minLength={3} maxLength={80} required />
          <label htmlFor="goal">What would a good outcome look like?</label><textarea id="goal" value={input.goal} onChange={e => update('goal', e.target.value)} minLength={12} maxLength={600} rows={3} required /><div className="field-hint">Think of one thing you want to leave with.</div>
          <label htmlFor="kind">Type of workshop</label><select id="kind" value={input.kind} onChange={e => update('kind', e.target.value as WorkshopInput['kind'])}><option value="alignment">Team alignment</option><option value="ideas">Idea exploration</option><option value="retrospective">Retrospective</option></select>
          <div className="form-row"><div><label htmlFor="duration"><Clock3 size={14} /> Time together</label><select id="duration" value={input.duration} onChange={e => update('duration', Number(e.target.value) as WorkshopInput['duration'])}><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select></div><div><label htmlFor="participants"><Users size={14} /> Group size</label><input id="participants" type="number" min={2} max={30} value={input.participants} onChange={e => update('participants', Number(e.target.value))} required /></div></div>
          <fieldset><legend>How are you gathering?</legend><div className="segmented"><button type="button" aria-pressed={input.format === 'in-person'} onClick={() => update('format', 'in-person')}><Users size={16} /> In person</button><button type="button" aria-pressed={input.format === 'remote'} onClick={() => update('format', 'remote')}><Monitor size={16} /> Remotely</button></div></fieldset>
          <button type="button" className="remember" onClick={rememberFormat}>Remember this format</button>
          {error && <p role="alert" className="error">{error}</p>}
          <button className="button primary build-button" disabled={pending}>{pending ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}{pending ? 'Building your agenda…' : 'Build my agenda'}{!pending && <ArrowRight size={18} />}</button>
          <p className="demo-disclaimer">Template-based demo · No AI key needed</p>
        </form>
      </section>
      <section className="card agenda-card" aria-busy={pending}><div className="card-heading"><span className="step-number">02</span><div><h2 ref={planHeading} tabIndex={-1}>Your time, thoughtfully planned</h2><p>{plan ? 'A starting point. Make it work for your people.' : 'Your agenda will take shape here.'}</p></div><span className="pill">{plan ? 'READY TO REVIEW' : 'PREVIEW'}</span></div>
        {plan ? <><div className="agenda-summary"><span className="eyebrow">YOUR WORKSHOP</span><h3>{plan.title}</h3><p>{plan.goal}</p><div className="meta"><span><Clock3 size={15} />{plan.duration} minutes</span><span><Users size={15} />{plan.participants} people</span><span>{plan.format === 'remote' ? 'Remote' : 'In person'}</span></div></div><div className="timeline">{plan.steps.map((step, i) => <div className={`timeline-item ${expanded === step.id ? 'expanded' : ''}`} key={step.id}><span className="timeline-number">{String(i + 1).padStart(2, '0')}</span><div className="timeline-content"><button aria-expanded={expanded === step.id} aria-controls={`detail-${step.id}`} onClick={() => setExpanded(expanded === step.id ? null : step.id)}><span>{step.title}</span><span className="duration">{step.minutes} min <ChevronDown size={16} /></span></button><div id={`detail-${step.id}`} hidden={expanded !== step.id}><p>{step.instruction}</p><span className="outcome"><Check size={13} />{step.outcome}</span></div></div></div>)}</div><div className="agenda-bottom"><span><Check size={15} /> {plan.steps.reduce((sum, step) => sum + step.minutes, 0)} minutes, from hello to next steps</span><div><button className="button secondary" onClick={savePlan} disabled={!storageReady}><Bookmark size={16} />{saved.some(item => item.id === plan.id) ? 'Saved' : 'Save'}</button><button className="button secondary" onClick={download}><ArrowDownToLine size={16} /> Download</button></div></div></> : <div className="agenda-empty"><div className="paper-stack"><div className="paper-back" /><div className="paper-front"><Flower2 size={30} strokeWidth={1} /><span>THE PLAN</span><i /><i /><i /><div className="paper-check"><Check size={18} /></div></div><span className="orbit-dot" /></div><h3>Great gatherings start<br />with a little intention.</h3><p>Fill in your workshop details and we’ll shape<br className="desktop-break" /> a timed agenda, from the first hello to the next step.</p><div className="empty-features"><span><Check size={14} /> Clear timeboxes</span><span><Check size={14} /> Inclusive activities</span><span><Check size={14} /> Practical outcomes</span></div></div>}
      </section>
    </div>
    <section className="template-section"><div className="section-heading"><div><div className="eyebrow">SKIP THE BLANK PAGE</div><h2>A good place to begin</h2></div><span className="small-note">Choose a starting point. Make it yours.</span></div><div className="template-grid">{templates.map((template, i) => <button className={`template-card template-${i}`} key={template.id} onClick={() => useTemplate(template)}><div className="template-top"><span className="template-symbol">{i === 0 ? <Users size={22} /> : i === 1 ? <Lightbulb size={23} /> : <RotateCcw size={22} />}</span><ArrowRight size={19} /></div><span className="eyebrow">{template.eyebrow}</span><h3>{template.title}</h3><p>{template.description}</p><div className="meta"><span><Clock3 size={14} />{template.duration} min</span><span><Users size={14} />{template.participants} people</span></div></button>)}</div></section>
    <section className="guide-section"><div className="guide-intro"><span className="guide-icon"><Sparkles size={22} /></span><div className="eyebrow">A LITTLE HELP ALONG THE WAY</div><h2>You don’t have to<br />have all the answers.</h2><p>Ask the facilitator’s guide about making space for people, keeping time, or reaching a decision.</p><span className="tag">DEMO · CURATED RESPONSES</span></div><div className="guide-content"><form onSubmit={ask}><label htmlFor="question">Ask the facilitator’s guide</label><div className="question-row"><input id="question" value={question} onChange={e => setQuestion(e.target.value)} required minLength={5} maxLength={800} /><button className="button primary" disabled={asking} aria-label="Ask guide">{asking ? <LoaderCircle size={18} className="spin" /> : <Send size={18} />}</button></div></form><div aria-live="polite" className="guide-answer">{asking ? <p>Finding a useful starting point…</p> : answer ? <><span className="eyebrow">GATHERWELL GUIDE · DEMO</span><p>{answer.content}</p></> : <p className="muted">Try “How do I include quieter participants?” or “How can I adapt this for a remote team?”</p>}{assistantError && <p role="alert" className="error">{assistantError}</p>}</div><div className="source-links"><span>FROM OUR PLAYBOOK</span>{sources.slice(0, 2).map(source => <Link href={source.href} key={source.id}>{source.title} <ArrowRight size={13} /></Link>)}</div></div></section>
    </>}
  </div>;
}
