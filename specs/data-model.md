# Data model & schema rework

> Date: 2026-08-23. Captures the review of the SQLite schema and the plan to rework it. This is a
> prerequisite for the remaining product gaps (`improvements.md` 4.2.2 sets, 4.2.6 cardio, 4.2.7
> export/backup) and the cheaper hygiene fixes that should ride along with the 1RM/PR work.

## Goal

Make the schema a correct, self-consistent foundation instead of a denormalized single-model table,
and — critically — introduce a migration mechanism so schema changes no longer destroy or strand
existing user data.

## Current schema

`app/shared/api/db.ts:22-39`, created with `CREATE TABLE IF NOT EXISTS` only:

```sql
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL
);

CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    exercise TEXT NOT NULL,      -- denormalized copy of exercises.title
    date TEXT NOT NULL,          -- 'YYYY-MM-DD', no time component
    muscleGroup TEXT NOT NULL,   -- denormalized copy of exercises.type
    reps INTEGER NOT NULL,
    weight REAL NOT NULL,
    units TEXT NOT NULL,         -- 'kg' | 'lb', free text
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);
```

## Verdict

Correct and adequate for the app's *current* promise (log weight×reps, see better/worse/same). The
`FOREIGN KEY ... ON DELETE CASCADE` plus `PRAGMA foreign_keys = ON` (`db.ts:13`) are done right —
that is why the rename/delete feature works. It is **not broken**.

It **must be reworked** before the remaining features, because the model is a single "weighted
strength set" with no sets dimension, no exercise-kind distinction, denormalized copies, and — the
blocker — **no migration path**. The last point is what turns any schema change into a
data-destroying or data-stranding event.

## Problems (ordered by impact)

1. **No migration mechanism (blocker).** `initializeDatabase` (`db.ts:20-40`) only does
   `CREATE TABLE IF NOT EXISTS`. No `PRAGMA user_version`, no migration runner. Adding `sets`
   (4.2.2) or reworking for cardio (4.2.6) would leave existing installs on the old schema, or
   require a drop/recreate that erases history — with no export (4.2.7) to back it up first.

2. **Denormalized columns (`results.exercise`, `results.muscleGroup`).** Both duplicate the parent
   `exercises` row. `muscleGroup` is fully redundant with `exercises.type` (the user always selects
   a muscle, then an exercise filtered by that muscle, so they can never differ). `exercise` exists
   only to show the title without a JOIN, and is the reason `renameExercise` runs a second
   `UPDATE` (`db.ts:75-84`) to stay in sync — a crash between the two leaves stale titles. Read
   impact is low: `result-row.ui.tsx` renders only `date`/`weight`/`reps`/`units`, so the two
   columns are write-only and can be dropped and derived via JOIN.

3. **No constraints or indexes.** `type` and `units` are free text — `'lbs'` or `'KG'` would
   silently break the kg/lb conversion and unit display. `reps`/`weight` have no `CHECK`
   (validation lives only in the form). No `UNIQUE(title, type)` — duplicate prevention is
   app-layer only (`exerciseExist` + `isTitleTaken`), and case-insensitive, which a plain `UNIQUE`
   index cannot express without `COLLATE NOCASE`. No index on `results.exercise_id`, so every
   `WHERE exercise_id = ?` is a full scan (SQLite does not auto-index foreign keys).

4. **`weight REAL` float.** Fine for display, but floating point can produce `0.1+0.2` artifacts
   and fuzzy equality in the 1RM/score comparisons. Storing integer grams (or canonical kg) is
   cleaner.

5. **Per-row `units`, mixed units allowed.** One exercise can have some kg and some lb rows. The
   app already normalizes precisely at compare time (the 4.1.1 fix), but "what is my PR" is
   ambiguous until normalized. Canonical storage (always kg) + a display-unit preference is the
   cleaner model.

6. **Model is a single "weighted strength set."** `date` is TEXT with no time (same-day entries
   order only by `id`); `weight === 0` is overloaded as "bodyweight" (4.1.4); `reps` doubles as
   cardio duration/distance (4.2.6). No sets dimension (4.2.2), no workout-session concept.

## Target schema

```sql
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL COLLATE NOCASE,
    type TEXT NOT NULL CHECK (type IN (
        'trapezius','shoulders','chest','biceps','triceps','forearms',
        'legs','glutes','back','abs','cardio'
    )),
    UNIQUE (title, type)
);

CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    date TEXT NOT NULL,                                    -- 'YYYY-MM-DD'
    reps INTEGER NOT NULL CHECK (reps > 0),
    weight REAL NOT NULL CHECK (weight >= 0),
    units TEXT NOT NULL CHECK (units IN ('kg','lb')),
    created_at TEXT NOT NULL                               -- set at insert, for stable ordering
);

CREATE INDEX idx_results_exercise_id ON results(exercise_id);
```

Changes from current:

- **Drop `results.exercise` and `results.muscleGroup`.** Title and muscle come from the `exercises`
  JOIN. (The `TResult` type and the `addResult`/`updateResult` signatures shrink accordingly.)
- **Add constraints**: `CHECK` on `type`, `units`, `reps`, `weight`; `UNIQUE(title, type)` with
  `COLLATE NOCASE` so duplicates are impossible at the DB level (supersedes `exerciseExist`).
- **Add `created_at`** (or promote `date` to a full timestamp) so same-day entries have a stable,
  meaningful order that isn't "whatever AUTOINCREMENT happened to assign."
- **Index** `results.exercise_id`.

### Deferred / optional (do not build now)

- **`sets` column (4.2.2)** — **done** (migration v2): `ALTER TABLE results ADD COLUMN sets
  INTEGER NOT NULL DEFAULT 1 CHECK (sets > 0)`. Recorded and displayed everywhere; does not affect
  the 1RM marker.
- **Cardio (4.2.6)** — likely a separate entry model (duration/distance) rather than overloading
  `reps`; own spec, own migration.
- **Canonical units** — store kg + a per-user display unit instead of per-row `units`. Larger
  churn; only if the per-row mixed-unit case becomes a real problem.
- **Integer grams** — replace `REAL` weight with integer grams for exact arithmetic. Nice, but
  optional; `REAL` + `CHECK` is acceptable for now.

## Migration plan

Introduce `PRAGMA user_version` as the schema version and a small ordered migration runner in
`db.ts`. Sketch:

```ts
const MIGRATIONS: { version: number; up: (db: SQLiteDatabase) => Promise<void> }[] = [
    { version: 1, up: async (db) => { /* baseline: current tables */ } },
    { version: 2, up: async (db) => { /* hygiene: recreate tables with constraints + index */ } },
];

export async function initializeDatabase() {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    let current = row?.user_version ?? 0;
    for (const m of MIGRATIONS) {
        if (m.version <= current) continue;
        await db.withExclusiveTransactionAsync(async (txn) => {
            await m.up(txn);
            await txn.execAsync(`PRAGMA user_version = ${m.version}`);
        });
        current = m.version;
    }
}
```

Notes:

- **Fresh installs** run all migrations in order and end at `user_version = N`. The baseline v1
  stamps the current schema so existing installs that already have the tables are recognized.
- **Existing installs** (currently at implicit version 0) will be migrated: v1 must be written to
  be a no-op if the tables already exist (use `CREATE TABLE IF NOT EXISTS`), then v2 applies the
  hygiene changes.
- **Constraint changes require table recreation.** SQLite cannot `ALTER TABLE ... ADD CONSTRAINT`.
  Migration v2 must use the recreate pattern: create `exercises_new`/`results_new`, `INSERT INTO
  ... SELECT` (dropping the denormalized columns, de-duplicating on `(title, type)`), drop the old
  tables, rename. `ALTER TABLE ... DROP COLUMN` (SQLite ≥ 3.35) can be used for the column drops
  as an alternative to recreation.
- **De-dup step**: on v2, collapse any existing duplicate `(title, type)` pairs (keep lowest `id`,
  repoint its results) before the `UNIQUE` constraint is applied.
- Wrap each migration in `withExclusiveTransactionAsync` so a partial migration can't leave a
  half-migrated DB.

## Sequencing

1. **Blocker first**: land the `PRAGMA user_version` + migration runner with v1 = current schema
   (a no-op migration that stamps existing DBs). No user-visible change; unlocks everything else.
   Alternatively, build export/backup (4.2.7) first so a destructive migration is recoverable.
2. **Hygiene (migration v2)** — can ride along with the 1RM/PR work, since it's independent of
   scoring: drop denormalized columns, add constraints + `UNIQUE` + index. This touches `db.ts`,
   `TResult`, and the `addResult`/`updateResult`/`fetchResultsByExerciseId` signatures, plus the
   store wrappers.
3. **Feature migrations later**: `sets` (4.2.2), cardio model (4.2.6), each its own migration and
   spec.

## Files touched (migration v2)

- `app/shared/api/db.ts` — migration runner, recreated DDL, updated CRUD signatures.
- `app/shared/types/index.ts` — `TResult` drops `exercise`/`muscleGroup`.
- `app/shared/stores/exercise.store.ts` — `addResult`/`updateResult` no longer pass the
  denormalized fields.
- `app/pages/history/ui/exercise-row.ui.tsx` — title/muscle already come from the exercise row; no
  change expected to reads.
- (verify) `app/pages/add-result/add-result.ui.tsx`, `edit-result.ui.tsx` — they pass
  `exercise.title`/`muscleGroup` into the store; those args go away.

## Open decisions

1. **`created_at` vs full timestamp on `date`.** Minimal: add `created_at` for stable ordering and
   keep `date` as `YYYY-MM-DD`. Larger: store a full ISO timestamp and derive the display date.
2. **Canonical units now or later.** Recommend later (keep per-row `units` + `CHECK`); note it here
   so it isn't forgotten.
3. **`REAL` vs integer grams.** Recommend keeping `REAL` + `CHECK` for now; integer grams only if
   float artifacts actually surface.
