// store/djSlice.ts
import { create } from "zustand";

interface DeckState {
  bpm: number;
  playing: boolean;
  position: number;
  // …
}
interface DJState {
  deckA: DeckState;
  deckB: DeckState;
  crossfader: number;     // 0〜1
  mapping: Record<Action, MidiMapping | null>;
  setMapping: (a: Action, m: MidiMapping) => void;
  // …
}

export const useDJStore = create<DJState>((set) => ({
  deckA: { bpm: 0, playing: false, position: 0 },
  deckB: { bpm: 0, playing: false, position: 0 },
  crossfader: 0.5,
  mapping: defaultMap,
  setMapping: (action, map) =>
    set((s) => ({ mapping: { ...s.mapping, [action]: map } })),
}));