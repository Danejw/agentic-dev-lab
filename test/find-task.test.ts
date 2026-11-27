import assert from 'node:assert/strict';
import test from 'node:test';
import { findTaskById } from '../src/find-task.js';
import { createTask } from '../src/tasks.js';

test('finds a task by ID and returns the matching task', () => {
  const first = createTask('1', 'Read docs');
  const matching = createTask('2', 'Write tests');

  assert.strictEqual(findTaskById([first, matching], '2'), matching);
});

test('returns undefined when no task has the requested ID', () => {
  assert.equal(findTaskById([createTask('1', 'Read docs')], '2'), undefined);
});
