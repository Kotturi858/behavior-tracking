import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule],
  template: `
    <article class="stat-card" [class]="tone()">
      <span class="label">{{ label() }}</span>
      <strong class="value">{{ value() }}</strong>
      @if (helper()) {
        <p class="helper">{{ helper() }}</p>
      }
    </article>
  `,
  styles: `
    .stat-card {
      padding: 1rem 1.1rem;
      border-radius: 1.25rem;
      border: 1px solid var(--border-color);
      background: var(--card-bg);
      box-shadow: var(--shadow-soft);
      display: grid;
      gap: 0.35rem;
    }

    .label {
      color: var(--muted-text);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .value {
      font-size: clamp(1.4rem, 2vw, 2rem);
      color: var(--heading-text);
    }

    .helper {
      margin: 0;
      color: var(--body-text);
      font-size: 0.92rem;
    }

    .success {
      background: linear-gradient(180deg, color-mix(in srgb, var(--accent-positive) 16%, var(--card-bg)), var(--card-bg));
    }

    .focus {
      background: linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 14%, var(--card-bg)), var(--card-bg));
    }
  `
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly helper = input('');
  readonly tone = input<'default' | 'success' | 'focus'>('default');
}
