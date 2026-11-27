import test from 'node:test';
import assert from 'node:assert/strict';
import { countOpenTasks } from '../src/open-tasks.js';
import { completeTask, createTask } from '../src/tasks.js';

test('counts only open tasks', () => {
  const tasks = [
    createTask('1', 'Read docs'),
    completeTask(createTask('2', 'Write tests')),
    createTask('3', 'Review changes'),
  ];

  assert.equal(countOpenTasks(tasks), 2);
});

test('returns zero for an empty list or a list with no open tasks', () => {
  assert.equal(countOpenTasks([]), 0);
  assert.equal(
    countOpenTasks([completeTask(createTask('1', 'Read docs'))]),
    0,
  );
});
