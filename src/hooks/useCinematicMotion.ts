import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/** Keep native scrolling on small screens, but do not rely on pointer heuristics.
 * Embedded browsers can report a coarse pointer on desktop, which used to turn
 * the whole corridor into a static composition. */
export function useCinematicMotion() {
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 700px)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return desktop && !reduced;
}
