# Firestore Schema

## Collections

```text
users/{userId}
users/{userId}/habits/{habitId}
users/{userId}/habitLogs/{habitId_dateKey}
users/{userId}/tasks/{taskId}
users/{userId}/moneyRecords/{recordId}
users/{userId}/reflections/{dateKey}
users/{userId}/dailySummaries/{dateKey}
users/{userId}/weeklySummaries/{weekKey}
```

## Habit document

```ts
{
  name: string;
  description?: string;
  recurrence: 'daily' | 'weekly' | 'custom';
  weekdays?: number[];
  customIntervalDays?: number;
  reminderTime?: string;
  tags: string[];
  createdAt: Timestamp;
  currentStreak: number;
  bestStreak: number;
}
```

## Habit log document

```ts
{
  habitId: string;
  date: string;
  completed: boolean;
  completionSource: 'manual' | 'reminder';
}
```

## Daily summary document

```ts
{
  date: string;
  completedHabits: number;
  scheduledHabits: number;
  completionRate: number;
  topHabitIds: string[];
  missedHabitIds: string[];
  totalPendingMoney: number;
}
```
