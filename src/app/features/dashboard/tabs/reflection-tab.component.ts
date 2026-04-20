import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductivityStoreService } from '../../../core/services/productivity-store.service';

@Component({
  selector: 'app-reflection-tab',
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Reflection</p>
          <h2>Daily journal and mood</h2>
        </div>
      </div>

      <form class="two-column-form" (ngSubmit)="saveReflection()">
        <label>
          <span>Mood</span>
          <select [(ngModel)]="reflectionDraft.mood" name="reflectionMood">
            @for (mood of moodOptions; track mood) {
              <option [value]="mood">{{ mood }}</option>
            }
          </select>
        </label>
        <label>
          <span>Failure tags</span>
          <input [(ngModel)]="reflectionDraft.failureReasonTags" name="reflectionTags" placeholder="energy-dip, context-switches" />
        </label>
        <label class="full-width">
          <span>Journal entry</span>
          <textarea [(ngModel)]="reflectionDraft.text" name="reflectionText" rows="5"></textarea>
        </label>
        <button type="submit" class="primary-action">Save reflection</button>
      </form>

      @if (store.selectedReflection(); as reflection) {
        <article class="item-card">
          <div class="item-header">
            <strong>{{ reflection.date | date:'mediumDate' }}</strong>
            <span class="pill">{{ reflection.mood }}</span>
          </div>
          <p>{{ reflection.text }}</p>
          <div class="tags-row">
            @for (tag of reflection.failureReasonTags; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
        </article>
      }
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

    .full-width {
      grid-column: 1 / -1;
    }

    .primary-action {
      border: 0;
      border-radius: 999px;
      padding: 0.7rem 1rem;
      background: var(--accent-primary);
      color: white;
      cursor: pointer;
      font-weight: 600;
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

    .pill {
      color: var(--muted-text);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
      margin: 0 0 0.25rem;
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

    @media (max-width: 1024px) {
      .two-column-form {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class ReflectionTabComponent {
  readonly store = inject(ProductivityStoreService);

  readonly moodOptions = ['energized', 'steady', 'reflective', 'stretched', 'reset'];

  reflectionDraft = {
    text: '',
    mood: 'steady',
    failureReasonTags: ''
  };

  saveReflection(): void {
    this.store.saveReflection({
      text: this.reflectionDraft.text.trim(),
      mood: this.reflectionDraft.mood as any,
      failureReasonTags: this.parseTags(this.reflectionDraft.failureReasonTags)
    });
  }

  private parseTags(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
