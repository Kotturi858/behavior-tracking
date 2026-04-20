import { Component, inject, signal } from '@angular/core';
import { ProductivityStoreService } from '../../core/services/productivity-store.service';
import { ShellComponent } from '../../shared/components/shell/shell.component';
import { TabNavigationComponent, TabItem } from '../../shared/components/tab-navigation/tab-navigation.component';
import { DashboardTabComponent } from './tabs/dashboard-tab.component';
import { HabitsTabComponent } from './tabs/habits-tab.component';
import { TasksTabComponent } from './tabs/tasks-tab.component';
import { MoneyTabComponent } from './tabs/money-tab.component';
import { ReflectionTabComponent } from './tabs/reflection-tab.component';
import { AnalyticsTabComponent } from './tabs/analytics-tab.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    ShellComponent,
    TabNavigationComponent,
    DashboardTabComponent,
    HabitsTabComponent,
    TasksTabComponent,
    MoneyTabComponent,
    ReflectionTabComponent,
    AnalyticsTabComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  readonly store = inject(ProductivityStoreService);
  
  readonly activeTab = signal<string>('dashboard');
  
  readonly tabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'habits', label: 'Habits', icon: '🎯' },
    { id: 'tasks', label: 'Tasks', icon: '✓' },
    { id: 'money', label: 'Money', icon: '💰' },
    { id: 'reflection', label: 'Reflection', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  constructor() {
    // Component logic handled by individual tab components
  }
}
