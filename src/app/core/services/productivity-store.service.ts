import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, writeBatch, onSnapshot } from '@angular/fire/firestore';
import { DashboardInsightSummary, HabitInsight, MoneyInsight, TrendPoint } from '../models/analytics.models';
import { Habit } from '../models/habit.models';
import { MoneyRecord } from '../models/money.models';
import { MoodOption, ReflectionEntry } from '../models/reflection.models';
import { TaskItem, TaskPriority } from '../models/task.models';
import { demoHabits, demoMoneyRecords, demoReflections, demoTasks } from './demo-data.service';
import { AuthService } from './auth.service';
import { addDays, chunk, DAY_NAMES, differenceInDays, fromDateKey, getLastNDates, toDateKey } from '../utils/date.utils';

interface PersistedState {
  habits: Habit[];
  tasks: TaskItem[];
  moneyRecords: MoneyRecord[];
  reflections: ReflectionEntry[];
}

const STORAGE_KEY = 'productivity-tracker-state-v1';
const DEMO_USER_ID = 'demo-user';

@Injectable({ providedIn: 'root' })
export class ProductivityStoreService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);
  
  readonly selectedDate = signal(toDateKey(new Date()));

  readonly habits = signal<Habit[]>([]);
  readonly tasks = signal<TaskItem[]>([]);
  readonly moneyRecords = signal<MoneyRecord[]>([]);
  readonly reflections = signal<ReflectionEntry[]>([]);
  
  private readonly isDemoMode = computed(() => this.authService.profile()?.provider === 'demo');
  private readonly currentUserId = computed(() => this.authService.profile()?.uid ?? null);

  readonly todayHabits = computed(() =>
    this.habits().filter((habit) => this.isHabitScheduledForDate(habit, this.selectedDate()))
  );

  readonly dailyCompletionRate = computed(() => {
    const habits = this.todayHabits();
    if (!habits.length) {
      return 0;
    }

    const completed = habits.filter((habit) => !!habit.completions[this.selectedDate()]).length;
    return completed / habits.length;
  });

  readonly pendingTasks = computed(() => this.tasks().filter((task) => !task.completed));
  readonly completedTasks = computed(() => this.tasks().filter((task) => task.completed));

  readonly moneyInsight = computed<MoneyInsight>(() => {
    const records = this.moneyRecords();
    return {
      totalLent: records.reduce((sum, record) => sum + record.amount, 0),
      pending: records.filter((record) => record.status === 'unpaid').reduce((sum, record) => sum + record.amount, 0),
      returned: records.filter((record) => record.status === 'paid').reduce((sum, record) => sum + record.amount, 0)
    };
  });

  readonly selectedReflection = computed(() =>
    this.reflections().find((reflection) => reflection.date === this.selectedDate()) ?? null
  );

  readonly streakLeaders = computed(() =>
    [...this.habits()]
      .sort((left, right) => right.currentStreak - left.currentStreak)
      .slice(0, 3)
  );

  readonly dashboardSummary = computed<DashboardInsightSummary>(() => {
    const habitInsights = this.getHabitInsights();
    const topHabits = [...habitInsights].sort((left, right) => right.completionRate - left.completionRate).slice(0, 3);
    const growthHabits = [...habitInsights].sort((left, right) => left.completionRate - right.completionRate).slice(0, 3);

    return {
      dailyCompletionRate: this.dailyCompletionRate(),
      weeklyTrend: this.getCompletionTrend(7, 'daily'),
      monthlyTrend: this.getCompletionTrend(28, 'weekly'),
      topHabits,
      growthHabits,
      encouragement: this.buildEncouragementMessage()
    };
  });

  constructor() {
    // Set up localStorage sync for demo mode
    effect(() => {
      if (this.isDemoMode()) {
        const payload: PersistedState = {
          habits: this.habits(),
          tasks: this.tasks(),
          moneyRecords: this.moneyRecords(),
          reflections: this.reflections()
        };
        globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    });
    
    // Set up Firebase sync for authenticated users
    effect(() => {
      const userId = this.currentUserId();
      const isDemo = this.isDemoMode();
      
      if (userId && !isDemo) {
        this.setupFirebaseSync(userId);
      } else if (isDemo) {
        this.loadDemoData();
      }
    });
  }
  
  private setupFirebaseSync(userId: string): void {
    // Set up real-time listeners for all collections
    this.setupHabitsListener(userId);
    this.setupTasksListener(userId);
    this.setupMoneyRecordsListener(userId);
    this.setupReflectionsListener(userId);
  }
  
  private setupHabitsListener(userId: string): void {
    const habitsRef = collection(this.firestore, `users/${userId}/habits`);
    const q = query(habitsRef, orderBy('createdAt', 'desc'));
    
    onSnapshot(q, (snapshot) => {
      const habits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Habit));
      this.habits.set(habits);
    });
  }
  
  private setupTasksListener(userId: string): void {
    const tasksRef = collection(this.firestore, `users/${userId}/tasks`);
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    
    onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TaskItem));
      this.tasks.set(tasks);
    });
  }
  
  private setupMoneyRecordsListener(userId: string): void {
    const moneyRef = collection(this.firestore, `users/${userId}/moneyRecords`);
    const q = query(moneyRef, orderBy('date', 'desc'));
    
    onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MoneyRecord));
      this.moneyRecords.set(records);
    });
  }
  
  private setupReflectionsListener(userId: string): void {
    const reflectionsRef = collection(this.firestore, `users/${userId}/reflections`);
    const q = query(reflectionsRef, orderBy('date', 'desc'));
    
    onSnapshot(q, (snapshot) => {
      const reflections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ReflectionEntry));
      this.reflections.set(reflections);
    });
  }
  
  private loadDemoData(): void {
    // Load from localStorage for demo mode
    const cachedValue = globalThis.localStorage?.getItem(STORAGE_KEY);

    if (cachedValue) {
      try {
        const parsed = JSON.parse(cachedValue) as PersistedState;
        this.habits.set(parsed.habits ?? []);
        this.tasks.set(parsed.tasks ?? []);
        this.moneyRecords.set(parsed.moneyRecords ?? []);
        this.reflections.set(parsed.reflections ?? []);
      } catch (error) {
        console.error('Unable to parse cached state', error);
        this.seedDemoState();
      }
    } else {
      this.seedDemoState();
    }
  }

  setSelectedDate(date: string): void {
    this.selectedDate.set(date);
  }

  addHabit(input: {
    name: string;
    description?: string;
    recurrence: Habit['recurrence'];
    reminderTime?: string;
    tags?: string[];
    weekdays?: number[];
    customIntervalDays?: number;
  }): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    const habit: Habit = this.recalculateHabit({
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      recurrence: input.recurrence,
      reminderTime: input.reminderTime,
      weekdays: input.weekdays,
      customIntervalDays: input.customIntervalDays,
      tags: input.tags ?? [],
      createdAt: this.selectedDate(),
      completions: {},
      currentStreak: 0,
      bestStreak: 0
    });

    if (userId && !isDemo) {
      // Save to Firebase
      const habitRef = doc(this.firestore, `users/${userId}/habits`, habit.id);
      setDoc(habitRef, habit);
    } else {
      // Demo mode - update local signal
      this.habits.update((habits) => [habit, ...habits]);
    }
  }

  updateHabit(habitId: string, changes: Partial<Omit<Habit, 'id'>>): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    const updatedHabit = this.recalculateHabit({
      ...this.habits().find(h => h.id === habitId)!,
      ...changes
    });

    if (userId && !isDemo) {
      const habitRef = doc(this.firestore, `users/${userId}/habits`, habitId);
      setDoc(habitRef, updatedHabit);
    } else {
      this.habits.update((habits) =>
        habits.map((habit) => (habit.id === habitId ? updatedHabit : habit))
      );
    }
  }

  deleteHabit(habitId: string): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    if (userId && !isDemo) {
      const habitRef = doc(this.firestore, `users/${userId}/habits`, habitId);
      // Note: In a real app, you'd want to delete related habit logs too
      setDoc(habitRef, { deleted: true }); // Soft delete
    } else {
      this.habits.update((habits) => habits.filter((habit) => habit.id !== habitId));
    }
  }

  toggleHabitCompletion(habitId: string, date = this.selectedDate()): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    const habit = this.habits().find(h => h.id === habitId);
    if (!habit) return;

    const currentValue = !!habit.completions[date];
    const completions = { ...habit.completions, [date]: !currentValue };
    const updatedHabit = this.recalculateHabit({ ...habit, completions });

    if (userId && !isDemo) {
      const habitRef = doc(this.firestore, `users/${userId}/habits`, habitId);
      setDoc(habitRef, updatedHabit);
      
      // Also log the completion in a separate collection for analytics
      const completionRef = doc(this.firestore, `users/${userId}/habitLogs`, `${habitId}_${date}`);
      setDoc(completionRef, {
        habitId,
        date,
        completed: !currentValue,
        timestamp: new Date().toISOString()
      });
    } else {
      this.habits.update((habits) =>
        habits.map((h) => (h.id === habitId ? updatedHabit : h))
      );
    }
  }

  addTask(input: { title: string; dueDate: string; priority: TaskPriority; tags: string[]; notes?: string }): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    const task: TaskItem = {
      id: crypto.randomUUID(),
      title: input.title,
      notes: input.notes,
      dueDate: input.dueDate,
      completed: false,
      priority: input.priority,
      tags: input.tags,
      createdAt: this.selectedDate()
    };

    if (userId && !isDemo) {
      const taskRef = doc(this.firestore, `users/${userId}/tasks`, task.id);
      setDoc(taskRef, task);
    } else {
      this.tasks.update((tasks) => [task, ...tasks]);
    }
  }

  toggleTask(taskId: string): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    const task = this.tasks().find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = { ...task, completed: !task.completed };

    if (userId && !isDemo) {
      const taskRef = doc(this.firestore, `users/${userId}/tasks`, taskId);
      setDoc(taskRef, updatedTask);
    } else {
      this.tasks.update((tasks) =>
        tasks.map((t) => (t.id === taskId ? updatedTask : t))
      );
    }
  }

  deleteTask(taskId: string): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    if (userId && !isDemo) {
      const taskRef = doc(this.firestore, `users/${userId}/tasks`, taskId);
      setDoc(taskRef, { deleted: true }); // Soft delete
    } else {
      this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
    }
  }

  addMoneyRecord(input: { personName: string; amount: number; date: string; status: MoneyRecord['status']; notes?: string }): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    const record: MoneyRecord = {
      id: crypto.randomUUID(),
      personName: input.personName,
      amount: input.amount,
      date: input.date,
      status: input.status,
      notes: input.notes
    };

    if (userId && !isDemo) {
      const recordRef = doc(this.firestore, `users/${userId}/moneyRecords`, record.id);
      setDoc(recordRef, record);
    } else {
      this.moneyRecords.update((records) => [record, ...records]);
    }
  }

  toggleMoneyStatus(recordId: string): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    const record = this.moneyRecords().find(r => r.id === recordId);
    if (!record) return;
    
    const updatedRecord: MoneyRecord = {
      ...record,
      status: record.status === 'paid' ? 'unpaid' : 'paid'
    };

    if (userId && !isDemo) {
      const recordRef = doc(this.firestore, `users/${userId}/moneyRecords`, recordId);
      setDoc(recordRef, updatedRecord);
    } else {
      this.moneyRecords.update((records) =>
        records.map((r) => (r.id === recordId ? updatedRecord : r))
      );
    }
  }

  deleteMoneyRecord(recordId: string): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    if (userId && !isDemo) {
      const recordRef = doc(this.firestore, `users/${userId}/moneyRecords`, recordId);
      setDoc(recordRef, { deleted: true }); // Soft delete
    } else {
      this.moneyRecords.update((records) => records.filter((record) => record.id !== recordId));
    }
  }

  saveReflection(input: { text: string; mood: MoodOption; failureReasonTags: string[] }): void {
    const userId = this.currentUserId();
    const isDemo = this.isDemoMode();
    
    const existing = this.reflections().find((reflection) => reflection.date === this.selectedDate());
    const nextReflection: ReflectionEntry = {
      id: existing?.id ?? crypto.randomUUID(),
      date: this.selectedDate(),
      text: input.text,
      mood: input.mood,
      failureReasonTags: input.failureReasonTags
    };

    if (userId && !isDemo) {
      const reflectionRef = doc(this.firestore, `users/${userId}/reflections`, nextReflection.date);
      setDoc(reflectionRef, nextReflection);
    } else {
      this.reflections.update((reflections) => {
        const filtered = reflections.filter((reflection) => reflection.date !== this.selectedDate());
        return [nextReflection, ...filtered].sort((left, right) => right.date.localeCompare(left.date));
      });
    }
  }

  getCompletionTrend(days: number, mode: 'daily' | 'weekly'): TrendPoint[] {
    const dateKeys = getLastNDates(days, this.selectedDate());
    const basePoints = dateKeys.map((dateKey) => ({
      label: mode === 'daily' ? DAY_NAMES[fromDateKey(dateKey).getDay()] : dateKey.slice(5),
      value: Math.round(this.getCompletionRateForDate(dateKey) * 100)
    }));

    if (mode === 'daily') {
      return basePoints;
    }

    return chunk(basePoints, 7).map((week, index) => ({
      label: `Week ${index + 1}`,
      value: Math.round(week.reduce((sum, point) => sum + point.value, 0) / week.length)
    }));
  }

  getWeekendPatternInsight(): string {
    const weekendDates = getLastNDates(28, this.selectedDate()).filter((dateKey) => {
      const day = fromDateKey(dateKey).getDay();
      return day === 0 || day === 6;
    });

    const weekdayDates = getLastNDates(28, this.selectedDate()).filter((dateKey) => {
      const day = fromDateKey(dateKey).getDay();
      return day !== 0 && day !== 6;
    });

    const weekendRate = this.averageCompletionAcrossDates(weekendDates);
    const weekdayRate = this.averageCompletionAcrossDates(weekdayDates);

    if (weekendRate + 0.15 < weekdayRate) {
      return 'Weekends look softer than weekdays. A lighter reminder window could help those habits land more easily.';
    }

    if (weekdayRate + 0.15 < weekendRate) {
      return 'Weekends are a strong reset zone for you. Consider moving one harder habit there.';
    }

    return 'Your rhythm looks steady across the week. Consistency is becoming part of the system.';
  }

  private seedDemoState(): void {
    this.habits.set(demoHabits.map((habit) => this.recalculateHabit(habit)));
    this.tasks.set(demoTasks);
    this.moneyRecords.set(demoMoneyRecords);
    this.reflections.set(demoReflections);
  }

  private averageCompletionAcrossDates(dates: string[]): number {
    if (!dates.length) {
      return 0;
    }

    return dates.reduce((sum, date) => sum + this.getCompletionRateForDate(date), 0) / dates.length;
  }

  private getCompletionRateForDate(date: string): number {
    const scheduledHabits = this.habits().filter((habit) => this.isHabitScheduledForDate(habit, date));
    if (!scheduledHabits.length) {
      return 0;
    }

    const completed = scheduledHabits.filter((habit) => !!habit.completions[date]).length;
    return completed / scheduledHabits.length;
  }

  private getHabitInsights(): HabitInsight[] {
    return this.habits().map((habit) => ({
      habitId: habit.id,
      name: habit.name,
      completionRate: this.getHabitCompletionRate(habit),
      currentStreak: habit.currentStreak,
      bestStreak: habit.bestStreak
    }));
  }

  private getHabitCompletionRate(habit: Habit): number {
    const lastThirtyDays = getLastNDates(30, this.selectedDate());
    const scheduledDates = lastThirtyDays.filter((date) => this.isHabitScheduledForDate(habit, date));
    if (!scheduledDates.length) {
      return 0;
    }

    const completedDates = scheduledDates.filter((date) => !!habit.completions[date]);
    return completedDates.length / scheduledDates.length;
  }

  private buildEncouragementMessage(): string {
    const rate = Math.round(this.dailyCompletionRate() * 100);
    if (rate >= 80) {
      return 'Today is already shaping up well. Keep the gentle momentum going.';
    }

    if (rate >= 50) {
      return 'You have solid traction today. One more small win could shift the whole tone.';
    }

    return 'A fresh restart is available at any point today. Small steps still count fully.';
  }

  private recalculateHabit(habit: Habit): Habit {
    const streaks = this.calculateStreaks(habit);
    return {
      ...habit,
      currentStreak: streaks.current,
      bestStreak: streaks.best
    };
  }

  private calculateStreaks(habit: Habit): { current: number; best: number } {
    const dateKeys = getLastNDates(Math.max(differenceInDays(habit.createdAt, this.selectedDate()) + 1, 1), this.selectedDate());
    let current = 0;
    let best = 0;
    let rolling = 0;

    for (const dateKey of dateKeys) {
      if (!this.isHabitScheduledForDate(habit, dateKey)) {
        continue;
      }

      if (habit.completions[dateKey]) {
        rolling += 1;
        best = Math.max(best, rolling);
      } else {
        rolling = 0;
      }
    }

    for (const dateKey of [...dateKeys].reverse()) {
      if (!this.isHabitScheduledForDate(habit, dateKey)) {
        continue;
      }

      if (habit.completions[dateKey]) {
        current += 1;
      } else {
        break;
      }
    }

    return { current, best };
  }

  isHabitScheduledForDate(habit: Habit, dateKey: string): boolean {
    const date = fromDateKey(dateKey);

    if (habit.recurrence === 'daily') {
      return true;
    }

    if (habit.recurrence === 'weekly') {
      return !!habit.weekdays?.includes(date.getDay());
    }

    const interval = habit.customIntervalDays ?? 1;
    return differenceInDays(habit.createdAt, dateKey) % interval === 0;
  }
}
