import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirebaseBlueprintService {
  readonly collectionMap = [
    'users/{userId}',
    'users/{userId}/habits/{habitId}',
    'users/{userId}/habitLogs/{habitId_dateKey}',
    'users/{userId}/tasks/{taskId}',
    'users/{userId}/moneyRecords/{recordId}',
    'users/{userId}/reflections/{dateKey}',
    'users/{userId}/dailySummaries/{dateKey}',
    'users/{userId}/weeklySummaries/{weekKey}'
  ];

  readonly indexedQueries = [
    'tasks: where(completed == false) + orderBy(dueDate)',
    'moneyRecords: where(status == unpaid) + orderBy(date desc)',
    'habitLogs: where(date >= startOfWeek) + orderBy(date)',
    'dailySummaries: where(date >= startOfMonth) + orderBy(date)'
  ];

  readonly writeStrategy = [
    'Batch habit completion updates with daily summary recalculation.',
    'Store per-day aggregates so dashboards read summaries instead of scanning raw logs.',
    'Use optimistic local signals cache, then sync to Firestore in one write batch.'
  ];
}
