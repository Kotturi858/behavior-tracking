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
      width: min(1180px, calc(100vw - 2rem));
      margin: 0 auto;
      padding: 2rem 0 3rem;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: start;
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
      font-size: clamp(2rem, 4vw, 3.8rem);
      line-height: 0.95;
      color: var(--heading-text);
      font-family: "Space Grotesk", "Segoe UI", sans-serif;
    }

    .subtitle {
      margin: 0.8rem 0 0;
      color: var(--body-text);
      max-width: 48rem;
      font-size: 1rem;
    }

    .theme-toggle {
      border: 0;
      border-radius: 999px;
      padding: 0.8rem 1rem;
      background: var(--heading-text);
      color: var(--surface-text-inverse);
      font-weight: 600;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .topbar {
        flex-direction: column;
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
