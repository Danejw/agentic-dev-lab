import type { Task } from './tasks.js';

export function findTaskById(tasks: Task[], id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}
