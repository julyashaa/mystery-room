import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Clock3, KeyRound, LockKeyhole } from 'lucide-react';
import { Reveal } from './UI';
import { Dust } from './HotelHero';

const rooms = [
  { number: '404', title: 'Номер 404', subtitle: 'Гость, которого не было', teaser: 'Дверь заперта изнутри. Чемодан на месте. Единственное, чего нет, — самого гостя.', time: '45–60 мин', difficulty: 'Средняя', note: 'Он всё ещё здесь?', available: true },
  { number: '207', title: 'Последний свидетель', subtitle: 'Интервью без последней страницы', teaser: 'За этой дверью записали интервью. Утром исчез журналист. Диктофон продолжал работать.', time: '60–90 мин', difficulty: 'Сложная', note: 'Не верьте тишине.', available: false },
  { number: '313', title: 'Четвёртая соседка', subtitle: 'Одна комната. Четыре версии.', teaser: 'Три соседки помнят её по-разному. Четвёртая комната пуста. Но по ночам там горит свет.', time: '40–60 мин', difficulty: 'Средняя', note: 'Кто-то не спит.', available: false },
];

export default function HotelDoors() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [crossing, setCrossing] = useState(false);
  const openRoom = () => {
    if (opening) return;
    if (reduced) { navigate('/case/404'); return; }
    setSelected('404');
    setOpening(true);
  };
  return <section id="cases" className={`hotel-archive ${opening ? 'room-opening' : ''}`} aria-labelledby="corridor-title">
    <div className="wrap">
      <Reveal><div className="section-heading"><div><p className="eyebrow">01 / ГОСТИНИЧНЫЙ АРХИВ</p><h2 id="corridor-title" tabIndex={-1}>Выберите <em>свою дверь.</em></h2></div><p>Не все номера готовы принять гостей.<br />Но в одном из них история уже началась.</p></div></Reveal>
      <div className="corridor-sign"><span><KeyRound size={14} /> КЛЮЧИ НА СТОЙКЕ</span><span>404 — 207 — 313</span><span className="corridor-instruction">КОСНИТЕСЬ ДВЕРИ, ЧТОБЫ УЗНАТЬ БОЛЬШЕ</span></div>
      <div className="hotel-gallery"><Dust />{rooms.map(room => {
        const active = selected === room.number || hovered === room.number;
        const isOpening = opening && room.available;
        return <article key={room.number} className={`hotel-room room-${room.number} ${active ? 'is-lit' : ''} ${isOpening ? 'is-opening' : ''}`} onMouseEnter={() => setHovered(room.number)} onMouseLeave={() => setHovered(null)}>
          <div className="room-stage">
            <div className="wall-light" aria-hidden="true"><span /></div>
            <span className="wall-number" aria-hidden="true">{room.number}</span>
            <div className="door-frame">
              <div className="room-beyond" aria-hidden="true"><span className="beyond-light" /><span className="beyond-shadow" /></div>
              <motion.button type="button" className="hotel-door" aria-label={`${room.title}: ${room.available ? 'открыть дверь и начать расследование' : 'скоро, узнать историю'}`} aria-describedby={`room-detail-${room.number}`} aria-controls={`room-detail-${room.number}`} aria-expanded={room.available ? undefined : selected === room.number} aria-disabled={opening} onFocus={() => setHovered(room.number)} onBlur={() => setHovered(null)} onClick={() => {
                if (opening) return;
                if (room.available) openRoom();
                else setSelected(selected === room.number ? null : room.number);
              }} animate={{ rotateY: reduced ? 0 : isOpening ? -104 : active ? -9 : 0 }} transition={{ duration: reduced ? 0 : isOpening ? 1.45 : .7, ease: [.22, .7, .25, 1] }} onAnimationComplete={() => { if (isOpening) setCrossing(true); }}>
                <span className="door-panel panel-top" aria-hidden="true" /><span className="door-panel panel-bottom" aria-hidden="true" />
                <span className="door-plaque"><span>MYSTERY HOTEL</span><strong>{room.number}</strong><i /></span>
                <span className="door-peephole" aria-hidden="true" />
                <span className="door-hardware" aria-hidden="true"><span className="door-handle" /><span className="door-keyhole" /></span>
                {!room.available && <span className="door-hanger" aria-hidden="true">DO NOT<br />DISTURB<span>СКОРО</span></span>}
                <span className="door-bottom" aria-hidden="true" />
              </motion.button>
              <div className="threshold-light" aria-hidden="true" />
            </div>
            <span className="room-whisper" aria-hidden="true">{room.note}</span>
          </div>
          <div className="room-caption">
            <p className="eyebrow">{room.available ? 'КЛЮЧ ДОСТУПЕН' : 'СКОРО / НОМЕР ЗАКРЫТ'}<span className={room.available ? 'red-dot' : 'closed-dot'} /></p>
            <h3>{room.title}</h3><p className="room-subtitle">{room.subtitle}</p>
            <div id={`room-detail-${room.number}`} className="room-detail"><p>{room.teaser}</p><div className="room-facts"><span><Clock3 size={12} />{room.time}</span><span>{room.difficulty}</span></div></div>
            {room.available ? <button className="room-action" onClick={openRoom} disabled={opening}>{opening ? 'Дверь открывается…' : 'Повернуть ключ'}<ArrowUpRight size={16} /></button> : <span className="room-locked"><LockKeyhole size={12} /> Скоро откроется новая история</span>}
          </div>
        </article>;
      })}</div>
      <p className="corridor-footnote"><span>ЖУРНАЛ ПОСТОЯЛЬЦЕВ / 03 ЗАПИСИ</span><span>Некоторые гости никогда не уезжают.</span></p>
    </div>
    <p className="sr-only" role="status">{opening ? 'Дверь 404 открывается. Переходим к расследованию.' : selected && selected !== '404' ? `Номер ${selected} скоро откроется. ${rooms.find(r => r.number === selected)?.teaser}` : ''}</p>
    {crossing && <motion.div className="room-crossing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .55 }} onAnimationComplete={() => navigate('/case/404')} aria-hidden="true"><span>404</span></motion.div>}
  </section>;
}
