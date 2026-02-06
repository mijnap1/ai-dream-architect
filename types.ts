
export interface DreamAnalysis {
  interpretation: string;
  mood: 'peaceful' | 'tense' | 'surreal' | 'joyful' | 'fearful' | 'mysterious';
  symbols: string[];
  lucidityScore: number; // 1-10
  themes: string[];
  imagePrompt: string;
}

export interface DreamEntry {
  id: string;
  date: string;
  content: string;
  analysis: DreamAnalysis | null;
  imageUrl: string | null;
}

export type ViewState = 'journal' | 'atlas' | 'stats';
