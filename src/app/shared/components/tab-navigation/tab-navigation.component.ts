import { CommonModule } from '@angular/common';
import { Component, model, signal } from '@angular/core';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-tab-navigation',
  imports: [CommonModule],
  template: `
    <nav class="tab-navigation">
      @for (tab of tabs(); track tab.id) {
        <button
          type="button"
          class="tab-button"
          [class.active]="activeTab() === tab.id"
          (click)="selectTab(tab.id)"
        >
          @if (tab.icon) {
            <span class="tab-icon">{{ tab.icon }}</span>
          }
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      }
    </nav>
  `,
  styles: `
    .tab-navigation {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;
      background: var(--surface-bg);
      border-radius: 1rem;
      border: 1px solid var(--border-color);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tab-navigation::-webkit-scrollbar {
      display: none;
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      border-radius: 0.75rem;
      color: var(--muted-text);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-button:hover {
      background: var(--input-bg);
      color: var(--heading-text);
    }

    .tab-button.active {
      background: var(--heading-text);
      color: var(--surface-text-inverse);
    }

    .tab-icon {
      font-size: 1.1rem;
    }

    .tab-label {
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .tab-navigation {
        padding: 0.25rem;
        gap: 0.25rem;
      }

      .tab-button {
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
      }

      .tab-icon {
        font-size: 1rem;
      }

      .tab-label {
        font-size: 0.8rem;
      }
    }
  `
})
export class TabNavigationComponent {
  readonly tabs = model<TabItem[]>([]);
  readonly activeTab = model<string>('');

  selectTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
}
