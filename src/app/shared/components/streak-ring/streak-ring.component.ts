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
      width: clamp(4rem, 12vw, 8rem);
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
      font-size: clamp(1.2rem, 4vw, 1.75rem);
      line-height: 1;
    }

    span {
      font-size: clamp(0.7rem, 2vw, 0.85rem);
      color: var(--muted-text);
      margin: 0;
    }

    .caption {
      color: var(--muted-text);
      margin: 0;
      font-size: clamp(0.75rem, 2.5vw, 0.9rem);
      text-align: center;
    }

    /* Mobile-first responsive design */
    @media (max-width: 640px) {
      :host {
        gap: 0.5rem;
      }

      .ring {
        width: clamp(3.5rem, 15vw, 5rem);
      }

      .inner {
        gap: 0.25rem;
      }

      strong {
        font-size: clamp(1rem, 5vw, 1.4rem);
      }

      span {
        font-size: clamp(0.6rem, 2.5vw, 0.75rem);
      }

      .caption {
        font-size: clamp(0.7rem, 3vw, 0.8rem);
      }
    }

    @media (min-width: 641px) and (max-width: 768px) {
      .ring {
        width: clamp(5rem, 10vw, 6.5rem);
      }

      strong {
        font-size: clamp(1.3rem, 3.5vw, 1.5rem);
      }

      .caption {
        font-size: clamp(0.8rem, 2.2vw, 0.85rem);
      }
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
