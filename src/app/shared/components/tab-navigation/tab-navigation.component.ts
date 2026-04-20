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
      -webkit-overflow-scrolling: touch;
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
      min-height: 44px;
      min-width: 44px;
      flex-shrink: 0;
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
      flex-shrink: 0;
    }

    .tab-label {
      font-size: 0.9rem;
    }

    /* Mobile-first responsive design */
    @media (max-width: 640px) {
      .tab-navigation {
        padding: 0.25rem;
        gap: 0.25rem;
        margin: 0 -0.25rem; /* Allow scroll to edge */
      }

      .tab-button {
        padding: 0.6rem 0.8rem;
        font-size: 0.85rem;
        gap: 0.4rem;
      }

      .tab-icon {
        font-size: 1rem;
      }

      .tab-label {
        font-size: 0.75rem;
      }

      /* Hide text on very small screens, show only icons */
      @media (max-width: 380px) {
        .tab-label {
          display: none;
        }

        .tab-button {
          padding: 0.6rem;
          justify-content: center;
        }
      }
    }

    @media (min-width: 641px) and (max-width: 768px) {
      .tab-navigation {
        padding: 0.4rem;
        gap: 0.4rem;
      }

      .tab-button {
        padding: 0.7rem 0.9rem;
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
