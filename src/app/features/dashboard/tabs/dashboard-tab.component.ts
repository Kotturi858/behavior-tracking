import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductivityStoreService } from '../../../core/services/productivity-store.service';
import { AuthPanelComponent } from '../../auth/auth-panel.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard-tab',
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    PercentPipe,
    AuthPanelComponent,
    StatCardComponent
  ],
  template: `
    <section class="hero-grid">
      <app-auth-panel />

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Daily focus</p>
            <h2>Dashboard snapshot</h2>
          </div>

          <label class="date-picker">
            <span>Review date</span>
            <input type="date" [ngModel]="store.selectedDate()" (ngModelChange)="store.setSelectedDate($event)" />
          </label>
        </div>

        <div class="stats-grid">
          <app-stat-card
            label="Completion"
            [value]="(store.dailyCompletionRate() | percent:'1.0-0') ?? '0%'"
            helper="Habits completed for the selected day"
            tone="success"
          />
          <app-stat-card
            label="Pending tasks"
            [value]="store.pendingTasks().length.toString()"
            helper="One-time actions still in motion"
            tone="focus"
          />
          <app-stat-card
            label="Money pending"
            [value]="(store.moneyInsight().pending | currency:'INR':'symbol':'1.0-0') ?? '¥0'"
            helper="Amount still expected back"
          />
          <app-stat-card
            label="Current leader"
            [value]="store.streakLeaders()[0]?.name ?? 'Start a streak'"
            [helper]="(store.streakLeaders()[0]?.currentStreak ?? 0) + ' day run'"
          />
        </div>
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .hero-grid {
      display: grid;
      gap: 1rem;
    }

    .panel-header {
      margin-bottom: 1rem;
    }

    .date-picker {
      display: grid;
      gap: 0.4rem;
    }

    .date-picker span {
      color: var(--muted-text);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
      margin: 0 0 0.25rem;
    }

    .stats-grid {
      display: grid;
      gap: 1rem;
    }
  `
})
export class DashboardTabComponent {
  readonly store = inject(ProductivityStoreService);
}
