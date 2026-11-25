import test from 'node:test';
import assert from 'node:assert/strict';
import { createTask, completeTask } from '../src/tasks.js';

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
