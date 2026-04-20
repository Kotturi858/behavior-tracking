import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

initializeApp();

const db = getFirestore();

export const recomputeDailySummary = onDocumentWritten(
  'users/{userId}/habitLogs/{logId}',
  async (event) => {
    const userId = event.params.userId;
    const after = event.data?.after.data();

    if (!after) {
      return;
    }

    const date = after['date'] as string;
    const habitLogsSnapshot = await db
      .collection(`users/${userId}/habitLogs`)
      .where('date', '==', date)
      .get();

    const scheduledHabitsSnapshot = await db.collection(`users/${userId}/habits`).get();
    const completedHabits = habitLogsSnapshot.docs.filter((doc) => !!doc.data()['completed']).length;
    const scheduledHabits = scheduledHabitsSnapshot.size;
    const completionRate = scheduledHabits ? completedHabits / scheduledHabits : 0;

    await db.doc(`users/${userId}/dailySummaries/${date}`).set(
      {
        date,
        completedHabits,
        scheduledHabits,
        completionRate,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    logger.info('Daily summary updated', { userId, date, completionRate });
  }
);
