import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-streak-ring',
  template: `
    <div class="ring" [style.--progress]="progress()">
      <div class="inner">
        <strong>{{ current() }}</strong>
        <span>current</span>
      </div>
    </div>
    <p class="caption">Best streak: {{ best() }} days</p>
  `,
  styles: `
    :host {
      display: grid;
      justify-items: center;
      gap: 0.75rem;
    }

    .ring {
      --progress: 0.5turn;
      width: 8rem;
      aspect-ratio: 1;
      border-radius: 50%;
      background:
        radial-gradient(circle at center, var(--card-bg) 0 52%, transparent 53%),
        conic-gradient(var(--accent-primary) 0turn var(--progress), rgba(120, 127, 148, 0.18) var(--progress) 1turn);
      display: grid;
      place-items: center;
    }

    .inner {
      display: grid;
      justify-items: center;
      color: var(--heading-text);
    }

    strong {
      font-size: 1.75rem;
    }

    span,
    .caption {
      color: var(--muted-text);
      margin: 0;
    }
  `
})
export class StreakRingComponent {
  readonly current = input.required<number>();
  readonly best = input.required<number>();
  readonly progress = computed(() => {
    const best = Math.max(this.best(), 1);
    const ratio = Math.min(this.current() / best, 1);
    return `${ratio}turn`;
  });
}
