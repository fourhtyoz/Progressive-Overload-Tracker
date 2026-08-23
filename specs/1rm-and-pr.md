# Better progress signal — 1RM metric + PR stat header

> Date: 2026-08-23. Supersedes `improvements.md` items 4.2.1 (volume-only metric) and 4.2.3 (no
> personal-best / trend view), which are implemented together as one change to the core loop.

## Goal

Make the red/yellow/green marker reflect **strength**, not just volume, and give each exercise a
compact **personal-best readout** so the user can see "am I close to my best?" without expanding
every row.

## Locked decisions

1. **Progress metric = estimated 1RM (Epley)** for weighted exercises. Bodyweight exercises
   (`weight === 0`) stay reps-based. No user toggle — this is the single metric going forward.
2. **PR surfacing = stat header** (a compact line under each exercise title), not a chart or a
   dedicated detail screen.

## Out of scope

- A settings toggle for "volume vs 1RM" (explicitly declined).
- A chart / sparkline / dedicated trend screen (4.2.3 "trend view" is satisfied by the stat header;
  a full chart is a future item).
- The `sets` column (4.2.2), cardio model (4.2.6), export (4.2.7).

---

## 1. Metric change — `app/features/progress/progress.lib.ts`

Replace the current `weight × reps` score with estimated 1RM. The single scoring function becomes:

```ts
function calcOneRepMax(set: TResult): number {
    if (set.weight === 0) return set.reps;          // bodyweight → reps
    const kg = toKilograms(set.weight, set.units);   // existing precise 0.45359237 conversion
    if (set.reps === 1) return kg;                   // a 1-rep set is its own 1RM
    return kg * (1 + set.reps / 30);                 // Epley
}
```

- `getProgress(currentSet, previousSet)` keeps its signature and the existing
  bodyweight-vs-weighted `neutral` guard, but scores both sides with `calcOneRepMax` instead of
  `calcScore`.
- Deterministic: converts each stored `(weight, units)` to canonical kg with the existing
  `0.45359237` constant before applying Epley. No dependence on `settingsStore`.

### Edge cases

- **`reps === 1`** special-cased to `weight`, otherwise Epley inflates a true 1RM by ~3.3%.
- **Bodyweight** (`weight === 0`) has no 1RM; score remains `reps`. Bodyweight vs weighted
  comparisons still return `neutral`.
- **Reps > 1** uses the standard Epley form.

## 2. PR / stat header — `app/pages/history/ui/exercise-row.ui.tsx`

Add a second line inside each exercise row, under the title/actions line, visible in the collapsed
state:

```
Bench Press (Chest)      [pencil] [trash] [chevron]
  PR 100 kg × 5    Last 90 kg × 5    vs PR -10%
```

### Computed from pure helpers in `progress.lib.ts`

```ts
export function getBestResult(results: TResult[]): TResult | null;   // max calcOneRepMax
export function getLatestResult(results: TResult[]): TResult | null; // date DESC, id DESC
export function getPctChange(current: number, previous: number): number | null; // ((c-p)/p)*100
```

- **PR** = the result with the highest `calcOneRepMax` score (order-independent of the asc/desc
  sort filter). Ties keep the first encountered.
- **Last** = most recent result by `date` (`YYYY-MM-DD`, lexicographic compare works), `id` desc as
  tiebreaker.
- **vs PR** = `getPctChange(score(last), score(pr))`, rounded to whole %, signed. Uses the *1RM*
  score, so it correctly reads as "strength delta", not volume delta.

### Display

- Weighted set → `"{weight} {unit} × {reps}"` (e.g. `100 kg × 5`), reusing the existing
  `t('units.' + units)` pattern.
- Bodyweight set → `"{bodyweight} × {reps}"` (e.g. `Bodyweight × 12`), reusing `result.bodyweight`.
- **Single result** (PR === Last) → hide "vs PR" (there is no comparison).
- **No results** → render nothing (the row still shows the existing "no results" empty state on
  expand).

### Data loading

To show the header without expanding, `exercise-row` will call `exerciseStore.loadResults(id)` on
mount (it already caches into `resultsCache` and is idempotent). This replaces the current
load-on-expand. Tradeoff: all exercises' results are fetched up front (N+1), but cached and cheap
for a personal tracker; `FlatList` virtualization remains deferred from item 3.5.

## 3. i18n — add to all 5 locales (`en/de/es/ru/tr.json`)

Under `history`:

| key           | en       |
| ------------- | -------- |
| `history.pr`  | `PR`     |
| `history.last`| `Last`   |
| `history.vsPr`| `vs PR`  |

The `%` delta is computed in code and appended (e.g. `{t('history.vsPr')} -10%`).

## Files touched

1. `app/features/progress/progress.lib.ts` — `calcOneRepMax` (replaces `calcScore`), `getProgress`
   update, new `getBestResult` / `getLatestResult` / `getPctChange`.
2. `app/pages/history/ui/exercise-row.ui.tsx` — mount-time `loadResults`, stat-header line, keep the
   existing per-row trending icon on each result (still adjacent-neighbor comparison).
3. `app/shared/i18n/{en,de,es,ru,tr}.json` — three `history.*` keys each.

No schema, store, or settings changes.

## Verify

- `npx tsc --noEmit` and `npx eslint .` clean.
- Manual: an exercise with `100×5` then `80×7` should read **worse** on the second entry under 1RM
  (previously it read better under volume) — the primary regression check.
- Manual: `PR`, `Last`, and signed `vs PR` render correctly for weighted, bodyweight, single-result,
  and empty-result exercises, in both light/dark theme.
