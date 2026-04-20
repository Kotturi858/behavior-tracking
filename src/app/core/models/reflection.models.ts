export type MoodOption = 'energized' | 'steady' | 'reflective' | 'stretched' | 'reset';

export interface ReflectionEntry {
  id: string;
  date: string;
  text: string;
  mood: MoodOption;
  failureReasonTags: string[];
}
