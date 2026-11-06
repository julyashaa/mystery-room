import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { KeyRound, X } from 'lucide-react';
import { Dust } from './HotelHero';
import { Reveal } from './UI';
import Flashlight from './Flashlight';
import { useCinematicMotion } from '../hooks/useCinematicMotion';

type Props = { hasKey: boolean; onTakeKey: () => void };

export default function Reception({ hasKey, onTakeKey }: Props) {
  const section = useRef<HTMLElement>(null);
  const registry = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const cinematic = useCinematicMotion();
  const [rings, setRings] = useState(0);
  const [registryOpen, setRegistryOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const wallY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const deskY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const openRegistry = () => {
    registry.current?.showModal();
    setRegistryOpen(true);
  };
  return <section className={`reception ${rings ? 'reception-awake' : ''}`} id="reception" aria-labelledby="reception-title" ref={section}>
    <div className="arrival-line" aria-hidden="true"><span /><KeyRound size={16} /><span /></div>
    <div className="wrap reception-heading"><Reveal><p className="eyebrow">00 / НОЧНАЯ СМЕНА · 02:17</p><h2 id="reception-title" tabIndex={-1}>Мы вас <em>ожидали.</em></h2></Reveal><Reveal><p>Портье отошёл. Или его здесь никогда не было.<br />Позвоните в колокольчик. Загляните в журнал.<br />Некоторые вещи оставлены именно для вас.</p></Reveal></div>
    <div className="reception-scene wrap">
      <motion.div className="reception-wall" style={{ y: cinematic ? wallY : 0 }} aria-hidden="true">
        <div className="wall-trim" /><div className="reception-crest"><span>M</span><i>MYSTERY HOTEL</i><small>NO VACANCIES · NO QUESTIONS</small></div>
        <div className="key-cabinet">{['201','207','211','301','313','319','401','404','409'].map(n => <span key={n} className={n === '404' ? 'empty-slot' : ''}><b>{n}</b><i /></span>)}</div>
        <div className="desk-lamp"><i className="lamp-shade" /><i className="lamp-stem" /><i className="lamp-base" /></div>
        <div className="lamp-pool" />
      </motion.div>
      <Dust />
      <motion.div className="reception-desk" style={{ y: cinematic ? deskY : 0 }}>
        <div className="desk-top" aria-hidden="true" />
        <div className="desk-front" aria-hidden="true"><i /><i /><i /><span>RECEPTION</span></div>
        <div className="desk-objects">
          <div className="desk-object bell-object">
            <button type="button" className="object-button bell-button" aria-label="Позвонить в колокольчик" onClick={() => setRings(n => n + 1)}>
              <motion.span className="bell-sculpture" key={rings} animate={rings && !reduced ? { rotate: [0, -5, 5, -3, 2, 0] } : { rotate: 0 }} transition={{ duration: .65 }} aria-hidden="true"><i className="bell-knob" /><i className="bell-dome" /><i className="bell-base" /></motion.span>
              {rings > 0 && !reduced && <motion.span key={`ripple-${rings}`} className="bell-ripple" initial={{ scale: .6, opacity: .5 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 1.2 }} aria-hidden="true" />}
              <span className="object-caption"><b>01</b> ПОЗВОНИТЬ</span>
            </button>
          </div>
          <div className="desk-object registry-object"><button type="button" className="object-button registry-button" onClick={openRegistry} aria-label="Открыть журнал постояльцев" aria-haspopup="dialog" aria-expanded={registryOpen} aria-controls="guest-registry">
            <span className="registry-book" aria-hidden="true"><i /><span>ЖУРНАЛ<br />ПОСТОЯЛЬЦЕВ</span><small>MYSTERY HOTEL</small><b>✦</b></span><span className="object-caption"><b>02</b> ЗАГЛЯНУТЬ В ЖУРНАЛ</span>
          </button></div>
          <div className="desk-object key-object"><button type="button" className={`object-button room-key-button ${hasKey ? 'key-collected' : ''}`} onClick={onTakeKey} aria-label={hasKey ? 'Ключ от номера 404 уже у вас' : 'Взять ключ от номера 404'} aria-pressed={hasKey}>
            <span className="reception-key" aria-hidden="true"><i className="key-ring" /><span className="key-metal"><i /></span><span className="key-tag"><small>MYSTERY HOTEL</small><strong>404</strong><b>НЕ ТЕРЯЙТЕ</b></span></span><span className="object-caption"><b>03</b> {hasKey ? 'КЛЮЧ УЖЕ У ВАС · ПРОДОЛЖИТЬ ПУТЬ' : 'ВОЗЬМИТЕ КЛЮЧ'}</span>
          </button></div>
        </div>
        <span className="desk-brass-label" aria-hidden="true">ПОЖАЛУЙСТА, НЕ БУДИТЕ ПРОШЛОЕ</span>
      </motion.div>
    </div>
    <div className="wrap reception-clue"><span className="eyebrow">НА ОБОРОТЕ ТАБЛИЧКИ</span><Flashlight id="desk-hidden-clue"><p>«Если ключ на стойке —<br /><em>кто запер дверь изнутри?</em>»</p><span>НЕИЗВЕСТНЫЙ ПОЧЕРК / 02:17</span></Flashlight></div>
    <dialog id="guest-registry" className="registry-dialog" ref={registry} aria-labelledby="registry-title" onClose={() => setRegistryOpen(false)} onClick={event => { if (event.target === event.currentTarget) registry.current?.close(); }}>
      <div className="registry-sheet"><button className="registry-close" aria-label="Закрыть журнал" onClick={() => registry.current?.close()} autoFocus><X size={20} /></button><p className="eyebrow">АРХИВ ПОСТОЯЛЬЦЕВ / ЛИСТ 17</p><h2 id="registry-title">Последняя запись</h2><div className="registry-entry"><span>ВРЕМЯ</span><span>НОМЕР</span><span>ПОСТОЯЛЕЦ</span><b>23:40</b><b>207</b><i>А. Волков</i><b>00:15</b><b>313</b><i>Е. Миронова</i><b>02:17</b><b>404</b><i className="redacted-name">Имя вычеркнуто</i></div><p className="registry-clue">В графе «Выезд» — пусто.<br />Но кто-то уже вернул ключ.</p><p className="registry-handwriting">Не спрашивайте портье.<br />Он скажет, что номер пустовал.</p><span className="registry-stamp">КОПИЯ НЕ СНИМАЛАСЬ</span><button className="registry-return" onClick={() => registry.current?.close()}>Закрыть журнал и вернуться к стойке</button></div>
    </dialog>
  </section>;
}
