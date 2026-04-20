export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskItem {
  id: string;
  title: string;
  notes?: string;
  dueDate: string;
  completed: boolean;
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
}
