export type Task = { id: string; title: string; done: boolean };

export function createTask(id: string, title: string): Task {
  const normalizedId = id.trim();
  const normalizedTitle = title.trim();
  if (!normalizedId || !normalizedTitle) throw new Error('Invalid task');
  return { id: normalizedId, title: normalizedTitle, done: false };
}

export function completeTask(task: Task): Task {
  return { ...task, done: true };
}

export function countCompletedTasks(tasks: Task[]): number {
  return tasks.filter((task) => task.done).length;
}

export function filterTasks(
  tasks: Task[],
  status: 'all' | 'open' | 'done',
): Task[] {
  if (status === 'all') return [...tasks];
  return tasks.filter((task) => (status === 'open' ? !task.done : task.done));
}
