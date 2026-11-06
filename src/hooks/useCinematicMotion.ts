import { useReducedMotion } from 'motion/react';

/** Keep native scrolling on small screens, but do not rely on pointer heuristics.
 * Embedded browsers can report a coarse pointer on desktop, which used to turn
 * the whole corridor into a static composition. */
export function useCinematicMotion() {
  const reduced = useReducedMotion();
  // Keep the native touch scroll path active on phones. The corridor uses a
  // fixed visual scene plus a normal document track, so it does not need a
  // desktop-only pointer heuristic to animate.
  return !reduced;
}
