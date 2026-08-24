# App Polish & UX Improvements

> Analysis date: 2026-08-23. This document originally captured opportunities to make the app feel
> and look less "raw". Phases 1–3 (visual / UX / architecture polish), the Phase 4 correctness
> bugs (4.1.1–4.1.4), the small UX wins (4.2.4, 4.2.5, 4.3), and the model gaps 4.2.1 (1RM),
> 4.2.2 (sets), 4.2.3 (PR stat header) and 4.2.7 (export/backup) are complete and have been
> removed. Remaining work: 4.2.6 (cardio), now specced in `specs/cardio.md` and awaiting a
> decision on its open questions.

## Main idea & business model

**Value proposition:** the app's entire promise is one signal — log a result (exercise, weight,
reps, date) and instantly see a red / yellow / green marker telling you whether you progressed,
stalled, or regressed versus your previous entry for that exercise. That marker is the product.

**Domain:** progressive overload — the principle that you must keep increasing the demand
(weight, reps, or volume) on a muscle to force continued adaptation. The About screen already
enumerates the valid methods (increase weight, increase reps/sets, reduce rest, etc.).

**How progress is currently calculated** (end to end):

1. Results live in SQLite (`results` table) with an `exercise_id` foreign key into `exercises`.
   Each row stores `sets`, `reps`, `weight`, `units` and `date` (see `specs/data-model.md`).
2. On the History screen, each exercise is a collapsible row that lazily loads its results and
   shows a PR / Last / vs-PR stat header (see `specs/1rm-and-pr.md`).
3. Rows are sorted by date (asc/desc). Each row is compared only to its **immediately adjacent**
   neighbor (previous entry in that sort order) via `getProgress()` in
   `app/features/progress/progress.lib.ts`.
4. `getProgress()` scores each entry as an **estimated 1RM** (Epley): `weight_kg × (1 + reps/30)`,
   with `reps === 1` returning `weight_kg` and bodyweight (`weight === 0`) returning `reps`. It
   classifies `better` / `worse` / `neutral` by comparing the two scores; bodyweight-vs-weighted
   comparisons return `neutral`. `sets` is recorded and displayed but does not affect the marker.

---

## Remaining work — product / model gaps

These are design decisions worth revisiting; each should be its own spec and decided with the
user before building.

### 4.2.6 Cardio forced into the strength model
"Cardio" is a muscle group, but every entry requires reps + weight. Logging a run means `weight = 0`
with "reps" standing in for duration/distance — an awkward fit.

**Spec:** `specs/cardio.md` — proposes a separate `cardio_results` table (duration + optional
distance) with its own progress score. Awaiting a decision on the open questions (metrics, progress
signal, distance units, UI flow).

