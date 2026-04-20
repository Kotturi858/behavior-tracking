import { Habit } from '../models/habit.models';
import { MoneyRecord } from '../models/money.models';
import { ReflectionEntry } from '../models/reflection.models';
import { TaskItem } from '../models/task.models';
import { addDays, toDateKey } from '../utils/date.utils';

const today = toDateKey(new Date());

export const demoHabits: Habit[] = [
  {
    id: 'habit-deep-work',
    name: 'Deep work block',
    description: 'Protect one focused hour before lunch.',
    recurrence: 'daily',
    reminderTime: '08:00',
    tags: ['focus', 'work'],
    createdAt: addDays(today, -21),
    completions: {
      [addDays(today, -6)]: true,
      [addDays(today, -5)]: true,
      [addDays(today, -4)]: false,
      [addDays(today, -3)]: true,
      [addDays(today, -2)]: true,
      [addDays(today, -1)]: true,
      [today]: true
    },
    currentStreak: 4,
    bestStreak: 8
  },
  {
    id: 'habit-walk',
    name: 'Evening walk',
    description: 'Twenty minutes outside with no phone.',
    recurrence: 'weekly',
    weekdays: [1, 2, 4, 6],
    reminderTime: '18:30',
    tags: ['health', 'reset'],
    createdAt: addDays(today, -28),
    completions: {
      [addDays(today, -6)]: true,
      [addDays(today, -5)]: false,
      [addDays(today, -3)]: true,
      [addDays(today, -1)]: true
    },
    currentStreak: 2,
    bestStreak: 5
  },
  {
    id: 'habit-budget',
    name: 'Money check-in',
    description: 'Review spends and capture loans.',
    recurrence: 'custom',
    customIntervalDays: 2,
    reminderTime: '20:15',
    tags: ['money'],
    createdAt: addDays(today, -16),
    completions: {
      [addDays(today, -6)]: true,
      [addDays(today, -4)]: true,
      [addDays(today, -2)]: false,
      [today]: true
    },
    currentStreak: 1,
    bestStreak: 3
  }
];

export const demoTasks: TaskItem[] = [
  {
    id: 'task-quarterly-review',
    title: 'Prepare weekly review checklist',
    dueDate: today,
    completed: false,
    priority: 'high',
    tags: ['planning'],
    createdAt: addDays(today, -2)
  },
  {
    id: 'task-renew-gym',
    title: 'Renew gym membership',
    dueDate: addDays(today, 1),
    completed: true,
    priority: 'medium',
    tags: ['admin', 'health'],
    createdAt: addDays(today, -4)
  },
  {
    id: 'task-call-sam',
    title: 'Call Sam about reimbursement',
    dueDate: addDays(today, 2),
    completed: false,
    priority: 'low',
    tags: ['money'],
    createdAt: addDays(today, -1)
  }
];

export const demoMoneyRecords: MoneyRecord[] = [
  {
    id: 'money-1',
    personName: 'Arun',
    amount: 1450,
    date: addDays(today, -9),
    status: 'unpaid',
    notes: 'Concert tickets'
  },
  {
    id: 'money-2',
    personName: 'Maya',
    amount: 780,
    date: addDays(today, -6),
    status: 'paid',
    notes: 'Shared cab'
  },
  {
    id: 'money-3',
    personName: 'Leena',
    amount: 2100,
    date: addDays(today, -2),
    status: 'unpaid',
    notes: 'Weekend stay'
  }
];

export const demoReflections: ReflectionEntry[] = [
  {
    id: 'reflection-1',
    date: today,
    text: 'Strong start to the week. The focused morning block helped everything else feel lighter.',
    mood: 'energized',
    failureReasonTags: ['none']
  },
  {
    id: 'reflection-2',
    date: addDays(today, -1),
    text: 'Energy dipped after lunch, but the evening walk helped me reset.',
    mood: 'steady',
    failureReasonTags: ['energy-dip']
  }
];
