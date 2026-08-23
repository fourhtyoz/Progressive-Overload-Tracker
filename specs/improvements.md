# App Polish & UX Improvements

> Analysis date: 2026-08-23. This document originally captured opportunities to make the app feel
> and look less "raw". Phases 1–3 (visual / UX / architecture polish) and the Phase 4 correctness
> bugs (4.1.1–4.1.4) plus small UX wins (4.2.4, 4.2.5, 4.3) are complete and have been removed.
> Remaining work: the product / model gaps below.

## Main idea & business model

**Value proposition:** the app's entire promise is one signal — log a result (exercise, weight,
reps, date) and instantly see a red / yellow / green marker telling you whether you progressed,
stalled, or regressed versus your previous entry for that exercise. That marker is the product.

**Domain:** progressive overload — the principle that you must keep increasing the demand
(weight, reps, or volume) on a muscle to force continued adaptation. The About screen already
enumerates the valid methods (increase weight, increase reps/sets, reduce rest, etc.).

**How progress is currently calculated** (end to end):

1. Results live in SQLite (`results` table), with `exercise` and `muscleGroup` *denormalized*
   into each row alongside the `exercise_id` foreign key.
2. On the History screen, each exercise is a collapsible row that lazily loads its results.
3. Rows are sorted by date (asc/desc). Each row is compared only to its **immediately adjacent**
   neighbor (previous entry in that sort order) via `getProgress()` in
   `app/features/progress/progress.lib.ts`.
4. `getProgress()` computes a **score** per entry: `weight × reps` (converted to canonical kg with
   the precise `0.45359237` constant), or just `reps` when `weight === 0` (bodyweight), then
   classifies `better` / `worse` / `neutral` by comparing the two scores. Bodyweight-vs-weighted
   comparisons return `neutral`.

---

## Remaining work — product / model gaps

These are design decisions worth revisiting; each should be its own spec and decided with the
user before building.

### 4.2.1 Volume-only metric mislabels weight/reps trade-offs
`weight × reps` treats `100kg × 5` as "worse" than `80kg × 7`, even though the user lifted
significantly more weight. For a *strength*-tracking app this is arguably wrong. The About page
lists multiple progressive-overload methods, but the app implements only volume.

**Fix:** offer an estimated-1RM metric (e.g. Epley) as an alternative or the default, and/or let
the user choose "strength vs volume" as their progress metric.

### 4.2.2 No "sets" dimension
Real progressive overload is sets × reps × weight, but the data model records a single
(weight, reps) per entry — no `sets` column. Increasing sets (an explicitly listed method) can't
be captured or reflected in progress at all.

### 4.2.3 No personal-best / trend view
Progress is only compared to the immediately adjacent entry, so two consecutive regressions show
"neutral" relative to the bad prior, and there's no "current vs all-time best" or any chart. For a
progress tracker, a per-exercise weight-over-time trend (or at least a "PR" stat) is the biggest
single value gap.

### 4.2.6 Cardio forced into the strength model
"Cardio" is a muscle group, but every entry requires reps + weight. Logging a run means `weight = 0`
with "reps" standing in for duration/distance — an awkward fit.

### 4.2.7 No export / backup
All data is local SQLite with no export/import. "Delete data" exists in Settings, but there's no
way to back up or migrate a user's progress history.
