import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ProductivityStoreService } from '../../../core/services/productivity-store.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FirebaseBlueprintService } from '../../../core/services/firebase-blueprint.service';
import { TrendChartComponent } from '../../../shared/components/trend-chart/trend-chart.component';

@Component({
  selector: 'app-analytics-tab',
  imports: [CommonModule, TrendChartComponent],
  template: `
    <section class="analytics-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Insights dashboard</p>
            <h2>Weekly and monthly trends</h2>
          </div>
        </div>

        <app-trend-chart [labels]="weeklyLabels()" [values]="weeklyValues()" seriesLabel="Daily completion" />
        <app-trend-chart [labels]="monthlyLabels()" [values]="monthlyValues()" seriesLabel="Weekly completion" type="bar" />
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Smart nudges</p>
            <h2>Helpful reminders</h2>
          </div>
        </div>

        <div class="stack-list">
          @for (nudge of notifications.nudges(); track nudge) {
            <article class="note-card">{{ nudge }}</article>
          }
        </div>

        <div class="top-list">
          <div>
            <h3>Top completed habits</h3>
            @for (habit of store.dashboardSummary().topHabits; track habit.habitId) {
              <p>{{ habit.name }} · {{ habit.completionRate | percent:'1.0-0' }}</p>
            }
          </div>
          <div>
            <h3>Growth opportunities</h3>
            @for (habit of store.dashboardSummary().growthHabits; track habit.habitId) {
              <p>{{ habit.name }} · {{ habit.completionRate | percent:'1.0-0' }}</p>
            }
          </div>
        </div>

        <article class="note-card accent">{{ store.getWeekendPatternInsight() }}</article>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Firebase blueprint</p>
            <h2>Schema, indexes, and batching</h2>
          </div>
        </div>

        <div class="schema-grid">
          <div>
            <h3>Collections</h3>
            @for (path of blueprint.collectionMap; track path) {
              <p>{{ path }}</p>
            }
          </div>
          <div>
            <h3>Indexed queries</h3>
            @for (query of blueprint.indexedQueries; track query) {
              <p>{{ query }}</p>
            }
          </div>
        </div>

        <div class="stack-list">
          @for (strategy of blueprint.writeStrategy; track strategy) {
            <article class="note-card">{{ strategy }}</article>
          }
        </div>
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .analytics-grid {
      display: grid;
      gap: 1rem;
    }

    .panel-header {
      margin-bottom: 1rem;
    }

    .stack-list {
      display: grid;
      gap: 0.75rem;
    }

    .top-list {
      display: grid;
      gap: 1rem;
    }

    .schema-grid {
      display: grid;
      gap: 1rem;
    }

    .note-card {
      border-radius: 1.2rem;
      border: 1px solid var(--border-color);
      padding: 1rem;
      background: color-mix(in srgb, var(--card-bg) 78%, transparent);
      display: grid;
      gap: 0.75rem;
    }

    .note-card.accent {
      background: color-mix(in srgb, var(--accent-positive) 10%, var(--card-bg));
    }

    h3 {
      margin: 0;
      color: var(--heading-text);
    }

    .schema-grid p,
    .top-list p {
      color: var(--body-text);
    }
  `
})
export class AnalyticsTabComponent {
  readonly store = inject(ProductivityStoreService);
  readonly notifications = inject(NotificationService);
  readonly blueprint = inject(FirebaseBlueprintService);

  readonly weeklyLabels = computed(() => this.store.dashboardSummary().weeklyTrend.map((point) => point.label));
  readonly weeklyValues = computed(() => this.store.dashboardSummary().weeklyTrend.map((point) => point.value));
  readonly monthlyLabels = computed(() => this.store.dashboardSummary().monthlyTrend.map((point) => point.label));
  readonly monthlyValues = computed(() => this.store.dashboardSummary().monthlyTrend.map((point) => point.value));
}
