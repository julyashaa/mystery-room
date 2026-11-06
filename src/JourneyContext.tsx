import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Journey = { hasKey: boolean; corridorComplete: boolean; evidence: string[]; stage: number; verdict: string | null; collectKey: () => void; completeCorridor: () => void; addEvidence: (id: string) => void; setStage: (stage: number) => void; setVerdict: (verdict: string) => void; restartInvestigation: () => void };
const JourneyContext = createContext<Journey | null>(null);
export function JourneyProvider({ children }: { children: ReactNode }) {
  const [hasKey, setHasKey] = useState(() => sessionStorage.getItem('mystery-key') === '1');
  const [corridorComplete, setComplete] = useState(() => sessionStorage.getItem('mystery-corridor') === '1');
  const [evidence, setEvidence] = useState<string[]>(() => JSON.parse(sessionStorage.getItem('mystery-evidence') || '[]'));
  const [stage, setStageState] = useState(() => Number(sessionStorage.getItem('mystery-stage') || 1));
  const [verdict, setVerdictState] = useState<string | null>(() => sessionStorage.getItem('mystery-verdict'));
  const value = useMemo(() => ({ hasKey, corridorComplete, evidence, stage, verdict, collectKey: () => { setHasKey(true); sessionStorage.setItem('mystery-key', '1'); }, completeCorridor: () => { setComplete(true); sessionStorage.setItem('mystery-corridor', '1'); }, addEvidence: (id: string) => setEvidence(prev => { if (prev.includes(id)) return prev; const next = [...prev, id]; sessionStorage.setItem('mystery-evidence', JSON.stringify(next)); return next; }), setStage: (next: number) => { setStageState(next); sessionStorage.setItem('mystery-stage', String(next)); }, setVerdict: (next: string) => { setVerdictState(next); sessionStorage.setItem('mystery-verdict', next); }, restartInvestigation: () => { setEvidence([]); setStageState(1); setVerdictState(null); sessionStorage.removeItem('mystery-evidence'); sessionStorage.removeItem('mystery-stage'); sessionStorage.removeItem('mystery-verdict'); } }), [hasKey, corridorComplete, evidence, stage, verdict]);
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}
export function useJourney() { const value = useContext(JourneyContext); if (!value) throw new Error('useJourney must be used inside JourneyProvider'); return value; }
