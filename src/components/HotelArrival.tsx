import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { DoorOpen } from 'lucide-react';
import { Dust } from './HotelHero';

export default function HotelArrival() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);
  const enter = () => {
    if (entering) return;
    setEntering(true);
    const crossingDuration = reduced ? 80 : 1200;
    window.setTimeout(() => {
      navigate('/reception');
      // The crossing layer is only a bridge between the two real scenes.
      // Always unmount it after the hand-off so it cannot remain as an
      // invisible/black interaction shield after navigation to reception.
      window.setTimeout(() => setEntering(false), reduced ? 120 : 450);
    }, crossingDuration);
  };
  return <section className={`hotel-arrival ${entering ? 'is-entering' : ''}`} aria-labelledby="arrival-title">
    <div className="arrival-atmosphere" aria-hidden="true"><div className="arrival-facade"><div className="arrival-sign">MYSTERY <span>ROOM</span></div><div className="arrival-columns"/><div className="arrival-doorway"><div className="arrival-door arrival-door-left"/><div className="arrival-door arrival-door-right"/><div className="arrival-door-light"/><span className="arrival-brass">EST. UNKNOWN</span></div><div className="arrival-lamp arrival-lamp-left"/><div className="arrival-lamp arrival-lamp-right"/></div></div>
    <Dust />
    <div className="arrival-vignette" aria-hidden="true" />
    <div className="arrival-copy wrap">
      <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }}><span className="red-dot" /> MYSTERY HOTEL / ПОЗДНЯЯ НОЧЬ</motion.p>
      <motion.h1 id="arrival-title" initial={{ opacity: 0, y: reduced ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .15 }}>Некоторые двери<br/><em>лучше не открывать.</em></motion.h1>
      <motion.p className="arrival-lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .5 }}>Но вы уже здесь.<br/><span>Отель помнит каждого, кто вошёл.</span></motion.p>
      <button className="button arrival-enter" onClick={enter} disabled={entering}><DoorOpen size={17} /> Войти в отель</button>
    </div>
    {entering && <motion.div className="arrival-crossing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? .1 : 1.1 }} aria-hidden="true" />}
  </section>;
}
