import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductivityStoreService } from '../../../core/services/productivity-store.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-money-tab',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, StatCardComponent],
  template: `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="section-kicker">Money tracking</p>
          <h2>Loans and reimbursements</h2>
        </div>
      </div>

      <div class="stats-grid money-stats">
        <app-stat-card label="Total lent" [value]="(store.moneyInsight().totalLent | currency:'INR':'symbol':'1.0-0') ?? '¥0'" />
        <app-stat-card label="Pending" [value]="(store.moneyInsight().pending | currency:'INR':'symbol':'1.0-0') ?? '¥0'" tone="focus" />
        <app-stat-card label="Returned" [value]="(store.moneyInsight().returned | currency:'INR':'symbol':'1.0-0') ?? '¥0'" tone="success" />
      </div>

      <form class="two-column-form" (ngSubmit)="createMoneyRecord()">
        <label>
          <span>Person</span>
          <input [(ngModel)]="moneyDraft.personName" name="personName" placeholder="Riya" />
        </label>
        <label>
          <span>Amount</span>
          <input [(ngModel)]="moneyDraft.amount" name="moneyAmount" type="number" min="0" />
        </label>
        <label>
          <span>Date</span>
          <input [(ngModel)]="moneyDraft.date" name="moneyDate" type="date" />
        </label>
        <label>
          <span>Status</span>
          <select [(ngModel)]="moneyDraft.status" name="moneyStatus">
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </label>
        <label class="full-width">
          <span>Notes</span>
          <textarea [(ngModel)]="moneyDraft.notes" name="moneyNotes" rows="2"></textarea>
        </label>
        <button type="submit" class="primary-action">Save record</button>
      </form>

      <div class="list-grid compact">
        @for (record of store.moneyRecords(); track record.id) {
          <article class="item-card">
            <div class="item-header">
              <div>
                <strong>{{ record.personName }}</strong>
                <p>{{ record.amount | currency:'INR':'symbol':'1.0-0' }}</p>
              </div>
              <button type="button" class="icon-button" (click)="store.deleteMoneyRecord(record.id)">Delete</button>
            </div>
            <div class="meta-row">
              <span>{{ record.date | date:'mediumDate' }}</span>
              <button type="button" class="ghost-link" (click)="store.toggleMoneyStatus(record.id)">
                {{ record.status === 'paid' ? 'Marked returned' : 'Marked pending' }}
              </button>
            </div>
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

    .money-stats {
      margin-bottom: 2rem;
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
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
      margin-bottom: 0.5rem;
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
    }

    .icon-button {
      background: transparent;
      color: var(--heading-text);
      border: 1px solid var(--border-color);
    }

    .meta-row {
      color: var(--body-text);
    }

    .ghost-link {
      background: transparent;
      color: var(--heading-text);
      border: 1px solid var(--border-color);
    }

    @media (max-width: 1024px) {
      .two-column-form {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class MoneyTabComponent {
  readonly store = inject(ProductivityStoreService);

  moneyDraft: {
    personName: string;
    amount: number;
    date: string;
    status: string;
    notes: string;
  } = {
    personName: '',
    amount: 0,
    date: this.store.selectedDate(),
    status: 'unpaid',
    notes: ''
  };

  createMoneyRecord(): void {
    if (!this.moneyDraft.personName.trim() || !this.moneyDraft.amount) {
      return;
    }

    this.store.addMoneyRecord({
      personName: this.moneyDraft.personName.trim(),
      amount: Number(this.moneyDraft.amount),
      date: this.moneyDraft.date,
      status: this.moneyDraft.status as any,
      notes: this.moneyDraft.notes.trim()
    });

    this.moneyDraft = { ...this.moneyDraft, personName: '', amount: 0, notes: '' };
  }
}
