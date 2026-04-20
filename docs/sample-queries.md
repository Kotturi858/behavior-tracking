# Sample Firestore Queries

## Open tasks ordered by due date

```ts
query(
  collection(db, `users/${userId}/tasks`),
  where('completed', '==', false),
  orderBy('dueDate', 'asc')
);
```

## Pending money records

```ts
query(
  collection(db, `users/${userId}/moneyRecords`),
  where('status', '==', 'unpaid'),
  orderBy('date', 'desc')
);
```

## Weekly summaries

```ts
query(
  collection(db, `users/${userId}/dailySummaries`),
  where('date', '>=', startOfWeek),
  where('date', '<=', endOfWeek),
  orderBy('date', 'asc')
);
```

## Batched habit completion update

```ts
const batch = writeBatch(db);

batch.set(doc(db, `users/${userId}/habitLogs/${habitId}_${dateKey}`), {
  habitId,
  date: dateKey,
  completed: true
});

batch.set(doc(db, `users/${userId}/dailySummaries/${dateKey}`), summaryPayload, { merge: true });

await batch.commit();
```
