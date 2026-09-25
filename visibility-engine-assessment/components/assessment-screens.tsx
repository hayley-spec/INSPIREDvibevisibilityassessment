import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ChartNoAxesCombined, Lightbulb, Share2, Search, Funnel, Target, Trophy, TriangleAlert, ShieldCheck, Users, MessagesSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { sections, flatQuestions, maturityBand } from '../lib/assessment';
import { assessmentCopy as copy } from '../lib/assessment-copy';

const icons = [Target, Lightbulb, Share2, Search, Funnel, ChartNoAxesCombined];
function BrandHeader({ progress, navy = false }: { progress?: number; navy?: boolean }) {
  return <header className={navy ? "assessment-header assessment-header-navy" : "assessment-header"}><img src={navy ? "/official-white-logo.png" : "/inspired-vibe-logo.svg"} alt="INSPIRED Vibe — Business Development Agency" width="270" height="80" />
    {progress !== undefined && <div className="header-progress"><div><span>Your progress</span><strong>{progress}% complete</strong></div><Progress aria-label="Assessment progress" value={progress} /></div>}
  </header>;
}

export function QuestionScreen({ current, selected, onSelect, onNext, onBack }: { current: number; selected?: number; onSelect: (value: number) => void; onNext: () => void; onBack: () => void }) {
  const question = flatQuestions[current];
  const section = sections[question.sectionIndex];
  const progress = Math.round((current + 1) / 24 * 100);
  return <main className="assessment-design">
    <BrandHeader progress={progress} navy />
    <div className="question-stage">
      <section className="question-panel">
        <p className="design-eyebrow">Section {question.sectionIndex + 1} of 6</p>
        <h1>{section.name}</h1>
        <p className="section-lead">{section.lead}</p>
        <div className="question-progress"><Progress value={progress} aria-label="Question progress" /><span>Question {current + 1} of 24</span></div>
        <h2 id="question-heading">{question.prompt}</h2>
        {question.note && <p className="question-note">{question.note}</p>}
        <RadioGroup aria-labelledby="question-heading" value={selected === undefined ? '' : String(selected)} onValueChange={value => onSelect(Number(value))} className="reference-answers">
          {question.choices.map(choice => <label key={choice.label} className={selected === choice.score ? 'reference-answer is-selected' : 'reference-answer'}>
            <RadioGroupItem value={String(choice.score)} className="reference-radio" />
            <span><b>{choice.label}.</b> {choice.text}</span>
          </label>)}
        </RadioGroup>
        <div className="question-navigation"><button onClick={onBack} className="design-back"><ArrowLeft /> Back</button><Button onClick={onNext} disabled={selected === undefined} className="design-cta">{current === 23 ? 'Continue to results' : 'Next question'}<ArrowRight /></Button></div>
      </section>
      <aside className="question-sidebar">
        <div className="question-photo" role="img" aria-label="INSPIRED Vibe podcast conversation" />
        <div className="dimension-guide"><p><img className="brand-star" src="/official-star.png" alt="" /> {copy.welcome.dimensionsHeading}</p><ul>{sections.map((item, index) => { const Icon = icons[index]; return <li key={item.name} aria-current={index === question.sectionIndex ? 'step' : undefined}><Icon /><span>{item.name}</span></li>; })}</ul></div>
      </aside>
    </div>
    <footer className="honesty-note"><ShieldCheck /><p>Answer based on what is <strong>actually happening today,</strong><br />not what is planned for next quarter.</p></footer>
  </main>;
}

function Paragraphs({ items }: { items: string[] }) {
  return <>{items.map((text, index) => <p key={index}>{text}</p>)}</>;
}

function ResultExplanation({ title, tied, children }: { title: string; tied: boolean; children: ReactNode }) {
  if (!tied) return <div className="dynamic-explanation">{children}</div>;
  return <article className="tied-result"><h3>{title}</h3><div className="dynamic-explanation">{children}</div></article>;
}

export function ResultsScreen({ score, dimensions }: { score: number; dimensions: { name: string; score: number }[]; onRestart: () => void }) {
  const high = Math.max(...dimensions.map(d => d.score));
  const low = Math.min(...dimensions.map(d => d.score));
  const strengths = dimensions.map((d, index) => ({ ...d, index })).filter(d => d.score === high);
  const gaps = dimensions.map((d, index) => ({ ...d, index })).filter(d => d.score === low);
  const allEqual = high === low;
  const band = copy.bands[score < 40 ? 0 : score < 60 ? 1 : score < 80 ? 2 : 3];
  const journeyIcons = [Search, ShieldCheck, Users, MessagesSquare];
  return <main className="assessment-design results-design"><div className="results-masthead"><BrandHeader />
    <section className="results-hero"><div className="results-hero-copy">
      <p className="design-eyebrow">{copy.hero.eyebrow}</p><h1>Your Authority Score is</h1>
      <p className="overall-number">{score}<span>/ 100</span></p><p className="maturity-badge">{maturityBand(score)}</p>
      <Paragraphs items={copy.hero.paragraphs} />
      <div className="results-manifesto"><p>{copy.hero.emphasis}</p></div>
      <a className="design-cta results-hero-cta" href="#book-your-review">{copy.review.cta}<ArrowRight /></a>
    </div><div className="results-hero-star" aria-hidden="true" /></section></div>
    <div className="results-content">
      <section className="band-panel"><div><h2>{band.title}</h2><Paragraphs items={band.paragraphs} /></div><div className="band-range"><strong>{band.range}</strong><span>{band.name}</span></div></section>
      <section className="dimension-breakdown"><h2>{copy.breakdown.headline}</h2><div className="breakdown-intro"><Paragraphs items={copy.breakdown.paragraphs} /></div><div className="dimension-grid">{dimensions.map((d, index) => { const Icon = icons[index]; const gap = !allEqual && d.score === low; return <article key={d.name} className={gap ? 'dimension-score is-gap' : 'dimension-score'}><Icon /><h3>{d.name}</h3><div className="score-circle" style={{ '--score': d.score } as CSSProperties} aria-label={d.name + ': ' + d.score + ' out of 100'}><div><strong>{d.score}</strong><span>/100</span></div></div><p>{copy.breakdown.descriptions[index]}</p></article>; })}</div></section>
      <div className={strengths.length > 1 || gaps.length > 1 ? "insight-grid has-tied-results" : "insight-grid"}>
        <section className="insight-card strength-card"><Trophy /><div>
          <p className="design-eyebrow">{copy.strength.eyebrow}</p>
          {strengths.length === 1 && <h2>Your strongest area is {strengths[0].name}</h2>}
          <Paragraphs items={copy.strength.paragraphs} />
          <div className={strengths.length > 1 ? "tied-result-grid" : undefined}>{strengths.map(d => <ResultExplanation key={d.name} title={`Your strongest area is ${d.name}`} tied={strengths.length > 1}><Paragraphs items={copy.strengths[d.index].paragraphs} /></ResultExplanation>)}</div>
          <p className="copy-emphasis">{copy.strength.emphasis}</p>
        </div></section>
        <section className="insight-card gap-card"><TriangleAlert /><div>
          <p className="design-eyebrow">{copy.gap.eyebrow}</p>
          {gaps.length === 1 && <h2>Your biggest opportunity is {gaps[0].name}</h2>}
          <Paragraphs items={copy.gap.paragraphs} />
          <div className={gaps.length > 1 ? "tied-result-grid" : undefined}>{gaps.map(d => <ResultExplanation key={d.name} title={`Your biggest opportunity is ${d.name}`} tied={gaps.length > 1}><Paragraphs items={copy.gaps[d.index].paragraphs} /></ResultExplanation>)}</div>
          <p className="copy-emphasis">{copy.gap.emphasis}</p>
        </div></section>
      </div>
      <section className="buyer-journey"><div><h2>{copy.journey.headline}</h2><Paragraphs items={copy.journey.paragraphs} /><p className="copy-emphasis">{copy.journey.endpoint}</p></div><ol>{copy.journey.steps.map((step,index) => { const Icon = journeyIcons[index]; return <li key={step.title}><Icon /><h3>{step.title}</h3><p>{step.copy}</p></li>; })}</ol></section>
      <div className={gaps.length > 1 ? "priority-video-row has-tied-results" : "priority-video-row"}><section className="priority-panel"><Target /><div><p className="design-eyebrow">{copy.priority.eyebrow}</p>
        {gaps.length === 1 && <h2>Start with {gaps[0].name}</h2>}
        <Paragraphs items={copy.priority.paragraphs.slice(0,2)} />
        <div className={gaps.length > 1 ? "tied-result-grid" : undefined}>{gaps.map(d => <ResultExplanation key={d.name} title={`Start with ${d.name}`} tied={gaps.length > 1}><p>{copy.priority.paragraphs[2].replace('[DYNAMIC PRIORITY AREA]', d.name)}</p><Paragraphs items={copy.priorities[d.index].paragraphs} /></ResultExplanation>)}</div>
        <p>{copy.priority.paragraphs[3]}</p><p className="diagnostic-note">{copy.priority.note}</p>
      </div></section>
      <section className="context-transition"><h2>{copy.transition}</h2><div className="results-video-placeholder" role="img" aria-label="Video placeholder — video to be supplied"><span className="video-placeholder-icon" aria-hidden="true">▶</span><p>Video placeholder</p></div></section></div>
      <section className="review-panel" id="book-your-review"><div><p className="design-eyebrow">{copy.review.eyebrow}</p><h2>{copy.review.headline}</h2><Paragraphs items={copy.review.paragraphs} /><ul>{copy.review.bullets.map(text => <li key={text}>{text}</li>)}</ul><div className="review-booking-strip"><p className="review-note">{copy.review.microcopy}</p><a className="design-cta" href="https://meetings-na2.hubspot.com/amber-halvorson/inspired-vibe-discovery-session" target="_blank" rel="noopener noreferrer">{copy.review.cta}<ArrowRight /></a></div></div><div className="review-photo" role="img" aria-label="Christin and Amber, INSPIRED Vibe co-founders" /></section>
    </div>
  </main>;
}
