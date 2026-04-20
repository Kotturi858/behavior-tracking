export type HabitRecurrence = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  recurrence: HabitRecurrence;
  weekdays?: number[];
  customIntervalDays?: number;
  reminderTime?: string;
  tags: string[];
  createdAt: string;
  completions: Record<string, boolean>;
  currentStreak: number;
  bestStreak: number;
}

export interface HabitCompletionSnapshot {
  habitId: string;
  date: string;
  completed: boolean;
}
