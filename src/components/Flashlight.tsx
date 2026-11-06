import { useState, type ReactNode, type PointerEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react';
import { Flashlight as FlashlightIcon } from 'lucide-react';

type Props = { children: ReactNode; id: string; label?: string };

/** Pointer light is decorative; the same clue has a keyboard/touch disclosure. */
export default function Flashlight({ children, id, label = 'Осветить надпись' }: Props) {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const mask = useMotionTemplate`radial-gradient(circle 145px at ${x}px ${y}px, black 15%, transparent 100%)`;
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };
  const visible = revealed || !!reduced;
  return <div className={`flashlight-surface ${visible ? 'clue-revealed' : ''}`} onPointerMove={move} onPointerEnter={event => setHovered(event.pointerType === 'mouse')} onPointerLeave={() => setHovered(false)}>
    <span className="surface-scratch" aria-hidden="true">Что-то проступает под слоем пыли.</span>
    <motion.div className="flashlight-beam" aria-hidden="true" style={{ x, y }} animate={{ opacity: hovered && !reduced ? .65 : 0 }} />
    <motion.div className="flashlight-inscription" aria-hidden={!visible} id={id} style={{ maskImage: visible ? 'none' : mask, WebkitMaskImage: visible ? 'none' : mask }}>{children}</motion.div>
    <button type="button" className="flashlight-control" aria-expanded={visible} aria-controls={id} onClick={() => setRevealed(!revealed)} disabled={!!reduced}><FlashlightIcon size={13} />{reduced ? 'Надпись освещена' : revealed ? 'Погасить свет' : label}</button>
  </div>;
}
