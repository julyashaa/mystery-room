import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useCinematicMotion } from '../hooks/useCinematicMotion';

export default function HotelPassage({ hasKey }: { hasKey: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const cinematic = useCinematicMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [.82, 1.16]);
  const y = useTransform(scrollYProgress, [0, 1], [35, -35]);
  return <div className="hotel-passage" ref={ref}>
    <motion.div className="passage-architecture" aria-hidden="true" style={{ scale: cinematic ? scale : 1 }}><i /><i /><i /></motion.div>
    <motion.div className="passage-copy" style={{ y: cinematic ? y : 0 }}><span className="eyebrow">РЕСЕПШЕН → КОРИДОР</span><p>Дальше — <em>тише.</em></p><span className="passage-hint">{hasKey ? 'КЛЮЧ № 404 У ВАС. ОСТАЛОСЬ НАЙТИ ДВЕРЬ.' : 'ЗДЕСЬ КАЖДАЯ ДВЕРЬ ПОМНИТ СВОЕГО ГОСТЯ.'}</span></motion.div>
  </div>;
}
