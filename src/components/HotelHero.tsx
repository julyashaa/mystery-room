import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, KeyRound } from 'lucide-react';
import { useCinematicMotion } from '../hooks/useCinematicMotion';

export function Dust() {
  return <div className="hotel-dust" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ left: `${8 + (i * 23) % 85}%`, top: `${(i * 17) % 90}%`, animationDelay: `${-i * 2.7}s`, animationDuration: `${15 + i % 5 * 3}s` }} />)}</div>;
}

export default function HotelHero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const cinematic = useCinematicMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const [phase, setPhase] = useState<'idle' | 'entering' | 'revealing'>('idle');
  const arrive = () => {
    const corridor = document.getElementById('reception');
    corridor?.scrollIntoView({ behavior: 'instant', block: 'start' });
    document.getElementById('reception-title')?.focus({ preventScroll: true });
  };
  const enter = () => {
    if (phase !== 'idle') return;
    if (reduced) { arrive(); return; }
    setPhase('entering');
  };
  return <>
    <section className={`hero hotel-hero ${phase === 'entering' ? 'is-entering' : ''}`} aria-labelledby="hero-title" ref={heroRef}>
      <div className="hero-depth"><motion.div className="hero-parallax" style={{ y: cinematic ? backgroundY : 0, scale: cinematic ? backgroundScale : 1 }}><div className="hero-image" /></motion.div></div>
      <div className="hero-shade" /><div className="hero-light" /><Dust />
      <div className="hero-content wrap">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9 }}><span className="red-dot" /> MYSTERY HOTEL / EST. UNKNOWN</motion.p>
        <h1 id="hero-title">{['Some secrets', 'are better', 'left'].map((line, i) => <span className="title-mask" key={line}><motion.span initial={{ y: reduced ? 0 : '105%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : .15 + i * .17, ease: [.22, 1, .36, 1] }}>{line}{i === 2 && <> <em>buried.</em></>}</motion.span></span>)}</h1>
        <motion.div initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: reduced ? 0 : .8 }}>
          <p className="hero-description">Добро пожаловать в отель, который хранит секреты.<br />За каждой дверью — чья-то история.<br />За одной из них вас уже ждут.</p>
          <div className="hero-actions"><button className="button hotel-enter" onClick={enter} disabled={phase !== 'idle'}>Войти в отель <KeyRound size={17} /></button><a className="text-link" href="#cases">Выбрать дверь <ArrowDown size={15} /></a></div>
        </motion.div>
      </div>
      <div className="hero-bottom wrap"><a href="#cases" className="scroll-cue"><span className="scroll-line" /> У КАЖДОЙ ДВЕРИ ЕСТЬ ПАМЯТЬ</a><span className="hero-index">03 НОМЕРА <i /> 01 КЛЮЧ</span></div>
      <div className="vertical-note">PLEASE DO NOT DISTURB THE PAST</div>
    </section>
    {phase !== 'idle' && <motion.div className="hotel-transition" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: phase === 'entering' ? 1 : 0 }} transition={{ duration: phase === 'entering' ? .8 : .7, ease: 'easeInOut' }} onAnimationComplete={() => {
      if (phase === 'entering') { arrive(); setPhase('revealing'); }
      else setPhase('idle');
    }}><KeyRound size={25} strokeWidth={1} /><span>ДОБРО ПОЖАЛОВАТЬ</span></motion.div>}
  </>;
}
