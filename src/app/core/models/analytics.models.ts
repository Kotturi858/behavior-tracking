export interface TrendPoint {
  label: string;
  value: number;
}

export interface HabitInsight {
  habitId: string;
  name: string;
  completionRate: number;
  currentStreak: number;
  bestStreak: number;
}

export interface MoneyInsight {
  totalLent: number;
  pending: number;
  returned: number;
}

export interface DashboardInsightSummary {
  dailyCompletionRate: number;
  weeklyTrend: TrendPoint[];
  monthlyTrend: TrendPoint[];
  topHabits: HabitInsight[];
  growthHabits: HabitInsight[];
  encouragement: string;
}
