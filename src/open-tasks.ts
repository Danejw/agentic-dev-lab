import type { Task } from './tasks.js';

export function countOpenTasks(tasks: Task[]): number {
  return tasks.filter((task) => !task.done).length;
}
