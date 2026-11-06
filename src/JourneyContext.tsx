import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Journey = { hasKey: boolean; corridorComplete: boolean; evidence: string[]; stage: number; verdict: string | null; collectKey: () => void; completeCorridor: () => void; addEvidence: (id: string) => void; setStage: (stage: number) => void; setVerdict: (verdict: string) => void; restartInvestigation: () => void };
const JourneyContext = createContext<Journey | null>(null);
export function JourneyProvider({ children }: { children: ReactNode }) {
  const store = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* storage may be unavailable */ } };
  const remove = (key: string) => { try { localStorage.removeItem(key); } catch { /* noop */ } };
  const [hasKey, setHasKey] = useState(() => store('mystery-key') === '1');
  const [corridorComplete, setComplete] = useState(() => store('mystery-corridor') === '1');
  const [evidence, setEvidence] = useState<string[]>(() => { try { return JSON.parse(store('mystery-evidence') || '[]'); } catch { return []; } });
  const [stage, setStageState] = useState(() => Number(store('mystery-stage') || 1));
  const [verdict, setVerdictState] = useState<string | null>(() => store('mystery-verdict'));
  const value = useMemo(() => ({ hasKey, corridorComplete, evidence, stage, verdict, collectKey: () => { setHasKey(true); write('mystery-key', '1'); }, completeCorridor: () => { setComplete(true); write('mystery-corridor', '1'); }, addEvidence: (id: string) => setEvidence(prev => { if (prev.includes(id)) return prev; const next = [...prev, id]; write('mystery-evidence', JSON.stringify(next)); return next; }), setStage: (next: number) => { setStageState(next); write('mystery-stage', String(next)); }, setVerdict: (next: string) => { setVerdictState(next); write('mystery-verdict', next); }, restartInvestigation: () => { setEvidence([]); setStageState(1); setVerdictState(null); remove('mystery-evidence'); remove('mystery-stage'); remove('mystery-verdict'); } }), [hasKey, corridorComplete, evidence, stage, verdict]);
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}
export function useJourney() { const value = useContext(JourneyContext); if (!value) throw new Error('useJourney must be used inside JourneyProvider'); return value; }
