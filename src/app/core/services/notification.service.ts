import { computed, Injectable } from '@angular/core';
import { ProductivityStoreService } from './productivity-store.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly reminders = computed(() =>
    this.store.todayHabits().map((habit) => ({
      habitId: habit.id,
      title: habit.name,
      time: habit.reminderTime ?? 'Flexible',
      completed: !!habit.completions[this.store.selectedDate()]
    }))
  );

  readonly nudges = computed(() => {
    const reminders = this.reminders().filter((reminder) => !reminder.completed);
    if (!reminders.length) {
      return ['You cleared your planned habits for today. A short reflection would be a nice way to close the loop.'];
    }

    return reminders.map(
      (reminder) =>
        `${reminder.title} is still open${reminder.time === 'Flexible' ? '' : ` for ${reminder.time}`}. A tiny version still counts.`
    );
  });

  constructor(private readonly store: ProductivityStoreService) {}
}
