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
      font-size: clamp(1.2rem, 4vw, 2rem);
      color: var(--heading-text);
      line-height: 1.1;
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

    /* Mobile-first responsive design */
    @media (max-width: 640px) {
      .stat-card {
        padding: 0.875rem 1rem;
        border-radius: 1rem;
        gap: 0.25rem;
      }

      .label {
        font-size: 0.75rem;
      }

      .value {
        font-size: clamp(1.1rem, 5vw, 1.5rem);
      }

      .helper {
        font-size: 0.85rem;
      }
    }

    @media (min-width: 641px) and (max-width: 768px) {
      .stat-card {
        padding: 0.9375rem 1.05rem;
      }

      .value {
        font-size: clamp(1.3rem, 3vw, 1.8rem);
      }
    }
  `
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly helper = input('');
  readonly tone = input<'default' | 'success' | 'focus'>('default');
}
