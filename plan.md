IΓÇÖm tracing task-ID handling and test coverage, then IΓÇÖll map the smallest implementation and verification scope.

**Issue:** Not supplied

**Base commit:** `4a633deb85d32564d4b86e225ea856437cafd269`

**Affected files**
- `src/tasks.ts`: Trim `id` before validation and storage.
- `test/tasks.test.ts`: Add padded-ID and whitespace-only-ID cases.

**Implementation plan**
1. In `createTask`, normalize `id` using `id.trim()`.
2. Validate both normalized ID and trimmed title.
3. Return the normalized ID while preserving existing title and task behavior.
4. Extend tests to verify padded IDs are trimmed and whitespace-only IDs are rejected.

**Acceptance criteria**
- `createTask('  1  ', 'Read docs')` returns `{ id: '1', title: 'Read docs', done: false }`.
- `createTask('   ', 'Read docs')` throws `Invalid task`.
- Existing title trimming and task behavior remain unchanged.
- `npm run typecheck` and `npm test` pass.

**Risks / approval needs**
- Low: no public API signature changes.
- No approval needed for this scoped change. No files were modified.

