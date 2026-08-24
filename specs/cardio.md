# Cardio entry model (4.2.6)

> Date: 2026-08-24. The last remaining product gap from `improvements.md`. This is a spec for
> discussion — nothing here is built until the user decides the open questions at the bottom.

## Problem

"Cardio" is a muscle group in `exercises.type`, but every entry is forced through the strength
model: `results` requires `reps` + `weight` + `sets`. To log a run the user sets `weight = 0` and
uses `reps` as a stand-in for minutes/distance — an awkward, lossy fit. Concretely:

- `add-result.ui.tsx` shows the same weight/reps/sets fields for cardio as for bench press.
- The 1RM/Epley marker (`progress.lib.ts`) is meaningless for cardio: `calcOneRepMax` on
  `weight = 0` returns `reps`, so "progress" degenerates to "did the number I typed into the Reps
  box go up."
- There is no place to record distance, duration, or pace — the metrics cardio actually cares
  about.

## Constraints

- `exercises.type` already has a `'cardio'` value (schema CHECK allows it), so a cardio *exercise*
  can already be created today. Only the *result* model is wrong.
- Migrations now go through the `PRAGMA user_version` runner (`db.ts`), currently at v2 (v1 =
  schema, v2 = `sets`). A cardio change is migration v3.
- The app's one-sentence promise ("log → see red/yellow/green") must keep working; the marker just
  needs a cardio-appropriate score instead of 1RM.
- All 5 locales must stay complete (fallbackLng = device language).

## Options

### A. Separate `cardio_results` table (recommended)

A dedicated table keyed to the same `exercises` table. Cardio and strength are different shapes,
so they get different storage; the UI branches on `exercise.type`.

**Pros:** no nullable/overloaded columns; each table's CHECKs are honest; strength scoring and
cardio scoring stay cleanly separated; export/backup (just shipped) extends naturally with a
`cardio_results` array. **Cons:** more code (new CRUD, new store methods, branching UI), and the
History screen has to handle two row types.

### B. Nullable cardio columns on `results`

Add `duration_seconds` and `distance_meters` (both nullable) to `results`. Cardio rows leave
`weight`/`reps`/`sets` null or 0; strength rows leave cardio columns null.

**Pros:** one table, one set of CRUD. **Cons:** a single table with two mutually-exclusive column
groups and nulls everywhere; CHECKs get awkward ("either weight/reps OR duration"); the 1RM score
must sniff which group is present; future cardio-only fields keep piling onto the same row.

### C. Keep one table, friendlier UI only

No schema change — just hide weight/reps and show duration/distance fields that get crammed into
the existing columns (e.g. `reps` = minutes, `weight = 0`).

**Pros:** tiny diff. **Cons:** doesn't fix the model — distance still has nowhere to live, the
marker still compares "reps", and the schema stays dishonest. Rejected.

## Recommended schema (Option A)

```sql
CREATE TABLE cardio_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    date TEXT NOT NULL,                                -- 'YYYY-MM-DD'
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
    distance_meters REAL CHECK (distance_meters IS NULL OR distance_meters > 0),
    created_at TEXT NOT NULL
);

CREATE INDEX idx_cardio_results_exercise_id ON cardio_results(exercise_id);
```

- `duration_seconds` is required (every cardio session has a duration).
- `distance_meters` is nullable (some cardio — treadmill walk, jump rope, HIIT — is time-only).
- Distance stored canonically in **meters**; displayed as km or mi per the user's preference.

## Progress calculation for cardio

Strength stays exactly as-is (Epley 1RM per set). Cardio needs its own score in
`progress.lib.ts`:

- **With distance:** score = `distance_meters` (further = better). Optional tiebreaker when
  distance is equal: faster pace (`duration / distance` lower = better).
- **Without distance:** score = `duration_seconds` (longer = better).

`getBestResult` / `getLatestResult` / `getPctChange` get cardio-aware variants (or a generic
"score" abstraction) so the PR/Last/vs-PR header works for cardio too.

## UI changes

- `add-result.ui.tsx` / `edit-result.ui.tsx`: when `exercise.type === 'cardio'`, render
  duration + distance fields instead of weight/reps/sets (units for distance come from settings).
- History rows and the stat header (`exercise-row.ui.tsx` / `result-row.ui.tsx`) render cardio
  entries as e.g. `5.2 km · 32:10` instead of `3 × 100 kg × 5`.
- The About/example copy can optionally mention cardio logging once it exists.

## Migration (v3)

`ALTER TABLE` isn't needed — this is a new table:

```ts
{ version: 3, up: async (db) => {
    await db.execAsync(`CREATE TABLE cardio_results ( ... ); CREATE INDEX ...;`);
} }
```

Existing cardio rows currently stored in `results` (with `weight = 0`) are **not** migrated
automatically — they're already lossy (no distance, "reps" as minutes is ambiguous), and the app is
pre-launch/dev (no users per `data-model.md` context). They can be left behind or dropped.

## Open decisions (confirm before building)

1. **Which cardio metrics?** duration + optional distance (recommended), or distance-only, or
   duration + distance + intensity?
2. **Primary progress signal:** distance (recommended) vs duration vs pace. Should pace be a
   tiebreaker, or should "faster at same distance" count as progress?
3. **Distance units:** canonical meters + km/mi display toggle (recommended), or just km?
4. **Scope of the branch:** does cardio get its own "Add Cardio" flow, or the same Add Result
   screen that swaps fields based on the selected exercise's type?
