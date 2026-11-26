import test from 'node:test';
import assert from 'node:assert/strict';
import { createTask, completeTask, filterTasks } from '../src/tasks.js';

test('creates a normalized task', () => {
  assert.deepEqual(createTask('1', '  Read docs  '), {
    id: '1',
    title: 'Read docs',
    done: false,
  });
});

test('rejects an empty title', () => {
  assert.throws(() => createTask('1', ' '));
});

test('completes without mutating the original', () => {
  const task = createTask('1', 'Read docs');
  assert.equal(completeTask(task).done, true);
  assert.equal(task.done, false);
});

test('filters tasks by status while preserving their original order', () => {
  const first = createTask('1', 'Read docs');
  const second = completeTask(createTask('2', 'Write tests'));
  const third = createTask('3', 'Review changes');
  const tasks = [first, second, third];

  const allTasks = filterTasks(tasks, 'all');
  assert.deepEqual(allTasks, tasks);
  assert.notStrictEqual(allTasks, tasks);

  const openTasks = filterTasks(tasks, 'open');
  assert.deepEqual(openTasks, [first, third]);
  assert.strictEqual(openTasks[0], first);
  assert.strictEqual(openTasks[1], third);

  const doneTasks = filterTasks(tasks, 'done');
  assert.deepEqual(doneTasks, [second]);
  assert.strictEqual(doneTasks[0], second);
});

test('does not mutate the input array or task objects', () => {
  const tasks = [
    createTask('1', 'Read docs'),
    completeTask(createTask('2', 'Write tests')),
  ];
  const originalTasks = [...tasks];
  const originalValues = tasks.map((task) => ({ ...task }));

  filterTasks(tasks, 'open');

  assert.deepEqual(tasks, originalValues);
  assert.strictEqual(tasks[0], originalTasks[0]);
  assert.strictEqual(tasks[1], originalTasks[1]);
});

test('returns an empty array for each status when given empty input', () => {
  for (const status of ['all', 'open', 'done'] as const) {
    assert.deepEqual(filterTasks([], status), []);
  }
});
