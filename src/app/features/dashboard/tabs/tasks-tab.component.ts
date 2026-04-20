import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductivityStoreService } from '../../../core/services/productivity-store.service';

@Component({
  selector: 'app-tasks-tab',
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Tasks</p>
          <h2>One-time actions</h2>
        </div>
      </div>

      <form class="two-column-form" (ngSubmit)="createTask()">
        <label>
          <span>Task</span>
          <input [(ngModel)]="taskDraft.title" name="taskTitle" placeholder="Schedule dentist" />
        </label>
        <label>
          <span>Due date</span>
          <input [(ngModel)]="taskDraft.dueDate" name="taskDueDate" type="date" />
        </label>
        <label>
          <span>Priority</span>
          <select [(ngModel)]="taskDraft.priority" name="taskPriority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          <span>Tags</span>
          <input [(ngModel)]="taskDraft.tags" name="taskTags" placeholder="health, admin" />
        </label>
        <label class="full-width">
          <span>Notes</span>
          <textarea [(ngModel)]="taskDraft.notes" name="taskNotes" rows="2"></textarea>
        </label>
        <button type="submit" class="primary-action">Add task</button>
      </form>

      <div class="list-grid compact">
        @for (task of store.tasks(); track task.id) {
          <article class="item-card">
            <div class="item-header">
              <label class="checkbox-row">
                <input type="checkbox" [checked]="task.completed" (change)="store.toggleTask(task.id)" />
                <strong>{{ task.title }}</strong>
              </label>
              <button type="button" class="icon-button" (click)="store.deleteTask(task.id)">Delete</button>
            </div>

            <div class="meta-row">
              <span>{{ task.priority }} priority</span>
              <span>{{ task.dueDate | date:'mediumDate' }}</span>
            </div>

            @if (task.tags.length) {
              <div class="tags-row">
                @for (tag of task.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>
            }
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

    .list-grid {
      display: grid;
      gap: 0.9rem;
    }

    .compact {
      grid-template-columns: 1fr;
    }

    @media (min-width: 640px) {
      .compact {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
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
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .checkbox-row {
      display: flex;
      gap: 0.6rem;
      align-items: flex-start;
      cursor: pointer;
      flex: 1;
      min-width: 0; /* Prevent text overflow */
    }

    .checkbox-row input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      min-width: 1.25rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .checkbox-row strong {
      word-break: break-word;
      line-height: 1.3;
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
      min-height: 44px;
      white-space: nowrap;
    }

    .icon-button {
      background: transparent;
      color: var(--heading-text);
      border: 1px solid var(--border-color);
      min-width: 44px;
      padding: 0.6rem 0.8rem;
    }

    .meta-row {
      color: var(--body-text);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
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

    /* Mobile-first responsive design */
    @media (max-width: 640px) {
      .two-column-form {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .item-card {
        padding: 1.125rem 1rem;
        gap: 0.625rem;
      }

      .item-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .checkbox-row {
        gap: 0.75rem;
        align-items: flex-start;
      }

      .checkbox-row input[type="checkbox"] {
        width: 1.375rem;
        height: 1.375rem;
        margin-top: 0.125rem;
      }

      .meta-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .icon-button {
        align-self: flex-end;
      }

      .tag {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .two-column-form {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class TasksTabComponent {
  readonly store = inject(ProductivityStoreService);

  taskDraft: {
    title: string;
    dueDate: string;
    priority: string;
    tags: string;
    notes: string;
  } = {
    title: '',
    dueDate: this.store.selectedDate(),
    priority: 'medium',
    tags: '',
    notes: ''
  };

  createTask(): void {
    if (!this.taskDraft.title.trim()) {
      return;
    }

    this.store.addTask({
      title: this.taskDraft.title.trim(),
      dueDate: this.taskDraft.dueDate,
      priority: this.taskDraft.priority as any,
      tags: this.parseTags(this.taskDraft.tags),
      notes: this.taskDraft.notes.trim()
    });

    this.taskDraft = { ...this.taskDraft, title: '', tags: '', notes: '' };
  }

  private parseTags(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
