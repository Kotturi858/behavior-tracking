import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductivityStoreService } from '../../../core/services/productivity-store.service';
import { StreakRingComponent } from '../../../shared/components/streak-ring/streak-ring.component';

@Component({
  selector: 'app-habits-tab',
  imports: [CommonModule, FormsModule, StreakRingComponent],
  template: `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Habit tracking</p>
          <h2>Recurring systems</h2>
        </div>
        <span class="helper-chip">{{ store.todayHabits().length }} habits scheduled</span>
      </div>

      <form class="two-column-form" (ngSubmit)="createHabit()">
        <label>
          <span>Name</span>
          <input [(ngModel)]="habitDraft.name" name="habitName" placeholder="Read 10 pages" />
        </label>
        <label>
          <span>Reminder</span>
          <input [(ngModel)]="habitDraft.reminderTime" name="habitReminder" type="time" />
        </label>
        <label>
          <span>Recurrence</span>
          <select [(ngModel)]="habitDraft.recurrence" name="habitRecurrence">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom interval</option>
          </select>
        </label>
        <label>
          <span>Tags</span>
          <input [(ngModel)]="habitDraft.tags" name="habitTags" placeholder="health, mindset" />
        </label>
        @if (habitDraft.recurrence === 'custom') {
          <label>
            <span>Every N days</span>
            <input [(ngModel)]="habitDraft.customIntervalDays" name="habitInterval" type="number" min="1" />
          </label>
        }
        @if (habitDraft.recurrence === 'weekly') {
          <label class="full-width">
            <span>Weekdays</span>
            <div class="weekday-row">
              @for (day of weekdayOptions; track day.value) {
                <button
                  type="button"
                  class="weekday-pill"
                  [class.active]="habitDraft.weekdays.includes(day.value)"
                  (click)="toggleWeekday(day.value)"
                >
                  {{ day.label }}
                </button>
              }
            </div>
          </label>
        }
        <label class="full-width">
          <span>Description</span>
          <textarea [(ngModel)]="habitDraft.description" name="habitDescription" rows="2"></textarea>
        </label>
        <button type="submit" class="primary-action">Add habit</button>
      </form>

      <div class="list-grid">
        @for (habit of store.habits(); track habit.id) {
          <article class="item-card">
            <div class="item-header">
              <div>
                <strong>{{ habit.name }}</strong>
                <p>{{ habit.description || 'A steady little promise to yourself.' }}</p>
              </div>
              <button type="button" class="icon-button" (click)="store.deleteHabit(habit.id)">Delete</button>
            </div>

            <div class="meta-row">
              <span>{{ habit.recurrence }}</span>
              <span>{{ habit.reminderTime || 'Flexible reminder' }}</span>
              <span>{{ habit.currentStreak }} day streak</span>
            </div>

            <div class="tags-row">
              @for (tag of habit.tags; track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>

            <div class="item-footer">
              <button type="button" class="primary-action" (click)="store.toggleHabitCompletion(habit.id)">
                {{ habit.completions[store.selectedDate()] ? 'Completed today' : 'Mark today complete' }}
              </button>
              <app-streak-ring [current]="habit.currentStreak" [best]="habit.bestStreak" />
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .panel-header {
      margin-bottom: 1rem;
    }

    .helper-chip {
      background: var(--input-bg);
      color: var(--muted-text);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.85rem;
    }

    .two-column-form {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
      margin-bottom: 2rem;
    }

    input,
    select,
    textarea {
      border-radius: 1rem;
      border: 1px solid var(--border-color);
      padding: 0.85rem 1rem;
      background: var(--input-bg);
      color: var(--heading-text);
      font: inherit;
    }

    textarea {
      resize: vertical;
    }

    :host .two-column-form label {
      display: grid !important;
      gap: 0.4rem !important;
    }

    :host .two-column-form label span {
      color: var(--heading-text) !important;
      font-weight: 500 !important;
      display: block !important;
      margin-bottom: 0.25rem !important;
    }

    .weekday-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .weekday-pill {
      padding: 0.7rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 999px;
      background: transparent;
      color: var(--heading-text);
      cursor: pointer;
      font-weight: 600;
    }

    .weekday-pill.active {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
    }

    .list-grid {
      display: grid;
      gap: 0.9rem;
    }

    .compact .item-card {
      padding-block: 0.95rem;
    }

    .item-card {
      border-radius: 1.2rem;
      border: 1px solid var(--border-color);
      padding: 1rem;
      background: color-mix(in srgb, var(--card-bg) 78%, transparent);
      display: grid;
      gap: 0.75rem;
    }

    .item-header {
      margin-bottom: 0.5rem;
    }

    .primary-action,
    .icon-button {
      border: 0;
      border-radius: 999px;
      padding: 0.7rem 1rem;
      background: var(--accent-primary);
      color: white;
      cursor: pointer;
      font-weight: 600;
    }

    .icon-button {
      background: transparent;
      color: var(--heading-text);
      border: 1px solid var(--border-color);
    }

    .meta-row {
      color: var(--body-text);
    }

    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--accent-secondary) 16%, transparent);
      color: var(--heading-text);
      font-size: 0.86rem;
    }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    @media (max-width: 1024px) {
      .two-column-form {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class HabitsTabComponent {
  readonly store = inject(ProductivityStoreService);

  readonly weekdayOptions = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 }
  ];

  habitDraft: {
    name: string;
    description: string;
    recurrence: string;
    reminderTime: string;
    tags: string;
    weekdays: number[];
    customIntervalDays: number;
  } = {
    name: '',
    description: '',
    recurrence: 'daily',
    reminderTime: '08:00',
    tags: '',
    weekdays: [1, 3, 5],
    customIntervalDays: 2
  };

  createHabit(): void {
    if (!this.habitDraft.name.trim()) {
      return;
    }

    this.store.addHabit({
      name: this.habitDraft.name.trim(),
      description: this.habitDraft.description.trim(),
      recurrence: this.habitDraft.recurrence as any,
      reminderTime: this.habitDraft.reminderTime,
      tags: this.parseTags(this.habitDraft.tags),
      weekdays: this.habitDraft.recurrence === 'weekly' ? this.habitDraft.weekdays : undefined,
      customIntervalDays:
        this.habitDraft.recurrence === 'custom' ? Number(this.habitDraft.customIntervalDays) || 1 : undefined
    });

    this.habitDraft = {
      ...this.habitDraft,
      name: '',
      description: '',
      tags: '',
      recurrence: 'daily'
    };
  }

  toggleWeekday(day: number): void {
    const weekdays = this.habitDraft.weekdays.includes(day)
      ? this.habitDraft.weekdays.filter((value) => value !== day)
      : [...this.habitDraft.weekdays, day].sort((left, right) => left - right);

    this.habitDraft = { ...this.habitDraft, weekdays };
  }

  private parseTags(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
