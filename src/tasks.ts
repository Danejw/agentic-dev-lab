export type Task = { id: string; title: string; done: boolean };

export function createTask(id: string, title: string): Task {
  if (!id.trim() || !title.trim()) throw new Error('Invalid task');
  return { id, title: title.trim(), done: false };
}

export function completeTask(task: Task): Task {
  return { ...task, done: true };
}

export function filterTasks(
  tasks: Task[],
  status: 'all' | 'open' | 'done',
): Task[] {
  if (status === 'all') return [...tasks];
  return tasks.filter((task) => (status === 'open' ? !task.done : task.done));
}
