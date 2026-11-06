import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { DoorOpen, KeyRound, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCinematicMotion } from '../hooks/useCinematicMotion';

const corridorObjects = [
  { label: '207', side: 'left', depth: 0 },
  { label: '313', side: 'right', depth: 1 },
  { label: '404', side: 'center', depth: 2 },
  { label: 'EXIT', side: 'left', depth: 3 },
];
const CAMERA_START_Z = 0;
const CAMERA_END_Z = 900;

export default function CorridorJourney({ hasKey }: { hasKey: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const cinematic = useCinematicMotion();
  // The dedicated route owns the scroll track, so progress must span exactly
  // from the track's top to its bottom in the document.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Stop before the camera passes the target door. Pushing beyond its depth
  // leaves the sticky scene with no geometry in front of the camera, creating
  // a black frame at the hand-off to the archive section.
  // The corridor becomes fully readable before the camera starts moving.
  // The first part of the section is an in-scene hold, not extra blank space.
  const cameraZ = useTransform(scrollYProgress, [0, .4, .85, 1], [CAMERA_START_Z, CAMERA_START_Z, CAMERA_END_Z, CAMERA_END_Z]);
  const cameraProgress = useTransform(scrollYProgress, [0, .4, .85, 1], [0, 0, 1, 1]);
  const copyY = useTransform(cameraProgress, [0, .15, .3], [0, 0, -28]);
  const copyTransform = useTransform(copyY, value => `translateY(${value}px)`);
  const copyOpacity = useTransform(cameraProgress, [0, .15, .3], [1, 1, 0]);
  const [diagnostics, setDiagnostics] = useState({ progress: 0, cameraZ: CAMERA_START_Z, cameraProgress: 0 });
  useMotionValueEvent(scrollYProgress, 'change', progress => {
    setDiagnostics(current => ({ ...current, progress }));
  });
  useMotionValueEvent(cameraZ, 'change', value => {
    setDiagnostics(current => ({ ...current, cameraZ: value }));
  });
  useMotionValueEvent(cameraProgress, 'change', value => {
    setDiagnostics(current => ({ ...current, cameraProgress: value }));
  });
  return <section className="corridor-journey" ref={ref} aria-labelledby="journey-title">
    <div className="corridor-sticky">
      <div className="corridor-world" style={{ perspective: cinematic ? '850px' : undefined, position: cinematic ? 'fixed' : undefined, zIndex: cinematic ? 20 : undefined }}>
        <button className="corridor-back" type="button" onClick={() => navigate('/reception')}>← Назад к ресепшену</button>
        <div className="camera-rig" style={{ transform: cinematic ? `translateZ(${diagnostics.cameraZ}px)` : undefined }}>
          <div className="corridor-vanishing-light" aria-hidden="true" />
          <div className="corridor-ceiling" aria-hidden="true" />
          <div className="corridor-floor" aria-hidden="true" />
          <div className="corridor-wall corridor-wall-left" aria-hidden="true" />
          <div className="corridor-wall corridor-wall-right" aria-hidden="true" />
          {[0,1,2,3,4,5].map(i => <div key={`lamp-${i}`} className="corridor-lamp" style={{ '--depth': i } as CSSProperties} aria-hidden="true"><i /></div>)}
          {corridorObjects.map(item => <div key={item.label} className={`journey-door journey-door-${item.side}`} style={{ '--depth': item.depth } as CSSProperties} aria-hidden="true"><span>{item.label}</span><i /></div>)}
          <div className="journey-target-door" aria-hidden="true"><span className="target-plaque">MYSTERY HOTEL<strong>404</strong></span><i className="target-handle" /></div>
        </div>
        <div className="journey-vignette" aria-hidden="true" />
        <motion.div className="journey-copy wrap" style={{ transform: cinematic ? copyTransform : undefined, opacity: cinematic ? copyOpacity : undefined }}><p className="eyebrow">РЕСЕПШЕН → КОРИДОР → НОМЕР 404</p><h2 id="journey-title">Идите <em>дальше.</em></h2><p>{hasKey ? 'Ключ в руке. Свет впереди. Дверь уже знает ваш шаг.' : 'Коридор меняет звук, когда вы проходите мимо.'}</p><span className="journey-scroll"><KeyRound size={14} /> ПРОКРУТИТЕ, ЧТОБЫ ВОЙТИ В КОРИДОР</span></motion.div>
        <div className="journey-end-label"><DoorOpen size={14} /> ROOM 404 / END OF HALL</div>
      </div>
    </div>
    {diagnostics.cameraProgress >= .98 && <div className="corridor-finish" role="dialog" aria-label="Коридор завершён"><p className="eyebrow">КОНЕЦ КОРИДОРА</p><p>Вы дошли до конца коридора</p><span>За этими дверями скрываются истории, которые ещё предстоит раскрыть.</span><button className="button" onClick={() => navigate('/rooms')}>Перейти к номерам <ArrowUpRight size={15}/></button><button className="corridor-finish-back" type="button" onClick={() => navigate('/reception')}>Вернуться к ресепшену</button></div>}
  </section>;
}
