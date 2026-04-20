import { Component, computed, inject, input } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-shell',
  template: `
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Personal productivity system</p>
          <h1>{{ title() }}</h1>
          <p class="subtitle">{{ subtitle() }}</p>
        </div>

        <button type="button" class="theme-toggle" (click)="theme.toggle()">
          {{ themeLabel() }}
        </button>
      </header>

      <ng-content />
    </div>
  `,
  styles: `
    .shell {
      width: min(100%, calc(100vw - 1rem));
      margin: 0 auto;
      padding: 1rem 0.5rem 2rem;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .eyebrow {
      margin: 0 0 0.45rem;
      color: var(--accent-primary);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.78rem;
      font-weight: 700;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.5rem, 5vw, 3.8rem);
      line-height: 0.95;
      color: var(--heading-text);
      font-family: "Space Grotesk", "Segoe UI", sans-serif;
    }

    .subtitle {
      margin: 0.8rem 0 0;
      color: var(--body-text);
      max-width: 100%;
      font-size: clamp(0.9rem, 2.5vw, 1rem);
      line-height: 1.4;
    }

    .theme-toggle {
      border: 0;
      border-radius: 999px;
      padding: 0.8rem 1rem;
      background: var(--heading-text);
      color: var(--surface-text-inverse);
      font-weight: 600;
      cursor: pointer;
      min-height: 44px;
      white-space: nowrap;
      font-size: 0.9rem;
    }

    /* Mobile-first responsive design */
    @media (max-width: 640px) {
      .shell {
        padding: 0.75rem 0.5rem 1.5rem;
      }

      .topbar {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .theme-toggle {
        align-self: center;
        padding: 0.7rem 1.2rem;
        font-size: 0.85rem;
      }

      h1 {
        font-size: clamp(1.25rem, 6vw, 2rem);
      }

      .subtitle {
        font-size: 0.85rem;
      }
    }

    @media (min-width: 641px) and (max-width: 768px) {
      .shell {
        width: min(100%, calc(100vw - 2rem));
        padding: 1.5rem 1rem 2.5rem;
      }

      .topbar {
        gap: 1.5rem;
      }
    }

    @media (min-width: 769px) {
      .shell {
        width: min(1180px, calc(100vw - 2rem));
        padding: 2rem 0 3rem;
      }
    }
  `
})
export class ShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly theme = inject(ThemeService);
  readonly themeLabel = computed(() => (this.theme.mode() === 'light' ? 'Switch to dark' : 'Switch to light'));
}
