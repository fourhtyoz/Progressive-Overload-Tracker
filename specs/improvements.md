# App Polish & UX Improvements

> Analysis date: 2026-08-23. This document captures opportunities to make the app feel and
> look less "raw". It is a planning spec, not a bug list — see `problems.md` for correctness
> issues that were already fixed.
>
> **Status:** Phase 1 (1.1–1.5), Phase 2 (2.1–2.4), and Phase 3 (3.1–3.5) are complete. The Phase
> 4.1 correctness bugs 4.1.1–4.1.3 have been promoted to `problems.md` and fixed (bugs #11–#13).
> Two of the 4.3 minor items (conversion factors, `getProgress` global state) were resolved by the
> same fix. Remaining work: Phase 4.1.4 / 4.2 / remaining 4.3 items.

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
4. `getProgress()` computes a **score** per entry: `weight × reps` (converted to the user's
   *current* default unit), or just `reps` when `weight === 0` (bodyweight), then classifies
   `better` / `worse` / `neutral` by comparing the two scores.

## Root cause

The app is thematically half-built: Tamagui is configured with proper light/dark themes, but
most components bypass them with manual `settingsStore.isDark ? COLORS.x : COLORS.y` ternaries
and hardcoded values. That duplication is the source of the raw look — inconsistent colors,
fonts, and spacing.

---

## Phase 1 — High-impact visual fixes (low risk) ✅ DONE

### 1.1 Make dropdowns theme-aware
`app/shared/ui/themed-dropdown.ui.tsx` renders the menu via `globalStyles.dropdownMenuStyle`
(`backgroundColor: '#E9ECEF'`) and `dropdownItemTxtStyle` (`color: '#151E26'`), both hardcoded
light. In dark mode the dropdown opens as a white menu with dark text. Only the selected
highlight is theme-aware.

**Fix:** drive `dropdownMenuStyle` and `dropdownItemTxtStyle` from `settingsStore.isDark`
(or migrate to Tamagui tokens) so the menu background and text match the active theme.

**Status: ✅ Done** — `ThemedDropdown` now reads `settingsStore.isDark` and inlines theme-aware
`dropdownStyle`; `DropdownItem`/`DropdownItemText` are theme-aware. Removed the now-unused
`dropdownMenuStyle`.

### 1.2 Remove the double header on nested stacks
`app/navigation/drawer.navigator.tsx` gives every drawer screen a header, and the nested
`AddResultStack` / `HistoryStack` also render their own native-stack header (`title: ''` but
still a visible bar). AddResult and History likely show two stacked header bars.

**Fix:** set `headerShown: false` on the nested stack navigators (or on the drawer screen) so
only one header renders.

**Status: ✅ Done** — nested stacks render a single header with a `MenuButton` (hamburger) on the
main screen and native back on pushed screens; `headerShown: false` on the AddResult/History
drawer screens.

### 1.3 Soften navigation colors
`drawer.navigator.tsx:136-149` uses a black header + orange drawer background in light mode, and
orange header + black drawer in dark mode. Orange (`#FFC857`) as a full drawer background is
loud; combined with black headers it reads as unpolished.

**Fix:** neutral header/drawer surfaces with orange as an accent (active item, focus states),
instead of orange/black fills.

**Status: ✅ Done** — headers/drawer now use white/`backgroundDark` surfaces; orange kept only as
`drawerActiveBackgroundColor`.

### 1.4 Add press feedback to home cards
`app/pages/home/home.ui.tsx` uses `Pressable` with no pressed state — tapping a photo card gives
zero feedback. The overlaid text is also un-themed (always white on a fixed dark overlay).

**Fix:** add a pressed opacity/scale style, and theme the label overlay.

**Status: ✅ Done** — all four home `Pressable`s use a pressed-opacity style
(`opacity: pressed ? 0.7 : 1`).

### 1.5 Add empty states
- History with zero exercises renders nothing below the filters (`history.ui.tsx:145`).
- Add a "no exercises yet" / "add your first exercise" empty state with a call-to-action.

**Fix:** render an empty-state block (icon + message + button) when `exercises.length === 0`
and when a filter yields no rows.

**Status: ✅ Done** — History renders `alerts.noExerciseTitle` + `alerts.noExercise` when
`filteredExercises.length === 0`.

---

## Phase 2 — UX / flow consistency ✅ DONE

### 2.1 Standardize feedback channels
Success/error feedback is inconsistent: `Toast` in `add-result`, `Alert` in `add-exercise` and
`edit-result`. Delete/edit on a result uses a 3-button `Alert` as an action sheet
(`result-row.ui.tsx:57`).

**Fix:** pick one channel — Toast for success/error toasts, a dedicated confirm/action pattern
(action sheet or bottom sheet) for destructive actions — and use it everywhere.

**Status: ✅ Done** — success/error now uses `Toast` everywhere (add-exercise, edit-result,
exercise-row delete, settings delete-data). `Alert` is kept only for destructive confirmations and
the edit/delete action sheet (`result-row.ui.tsx`).

### 2.2 Handle the keyboard in forms
`add-result`, `add-exercise`, and `edit-result` are plain `YStack`s with no `ScrollView` /
`KeyboardAvoidingView`. On smaller devices the keyboard covers the submit button.

**Fix:** wrap forms in `KeyboardAvoidingView` + `ScrollView`; add `returnKeyType` / focus flow.

**Status: ✅ Done** — all three forms are wrapped in `KeyboardAvoidingView` + `ScrollView` with
`keyboardShouldPersistTaps="handled"`.

### 2.3 Make the progress indicator discoverable
The "better / worse / same" signal is only a 5px colored left border (`result-row.ui.tsx:73`)
with no legend or label; the only explanation is buried in About.

**Fix:** add a small inline legend or an icon (trending-up / flat / trending-down) next to each
result, with the color semantics documented once.

**Status: ✅ Done** — each result row shows a `trending-up` / `remove` / `trending-down` icon, and
the History screen renders a legend (localized in all 5 languages).

### 2.4 Reconsider alert-driven "add your first exercise" flow
`add-result.ui.tsx:128` uses an `Alert` to nudge users toward adding an exercise. A persistent
empty state with a button would be less interruptive.

**Status: ✅ Done** — `add-result` now renders a persistent empty-state block with an
"Add Exercise" button instead of an `Alert`.

---

## Phase 3 — Architecture & consistency

### 3.1 Migrate to Tamagui theme tokens
Components reference `COLORS.textDarkScreen`, `COLORS.textSecondary`, etc. directly, instead of
`$color`, `$colorMuted`, `$background` already mapped in `tamagui.config.ts`.

**Impact:** deletes hundreds of `isDark ? ... : ...` ternaries and makes theming correct by
construction. This is the biggest long-term fix but touches every screen.

**Status: ✅ Done** — Tamagui components now use `$color`, `$colorMuted`, `$backgroundStrong`, and
`$backgroundSubtle` tokens for theme-dependent colors. Non-Tamagui surfaces (react-navigation
headers, Ionicons, Spinner, raw styles, the inverse button, and the accent input/separator borders)
intentionally keep raw `COLORS` since tokens can't resolve there.

### 3.2 Unify font sizes (single source of truth)
`use-font-size.ts` and `FONT_SIZE` in `global-styles.ts` duplicate the same logic. Many screens
also hardcode `fontSize={16}`/`18` (e.g. `add-result.ui.tsx:147`, `edit-result.ui.tsx:184`)
instead of using the hook.

**Fix:** keep one `useFontSize` (or Tamagui font tokens), delete `FONT_SIZE`, and replace all
hardcoded sizes.

**Status: ✅ Done** — removed `FONT_SIZE` from `global-styles.ts`; all hardcoded
`fontSize={16}`/`18`/`14` now use `useFontSize()` (`large`/`huge`/`normal`).

### 3.3 Remove hardcoded layout widths
History filter labels use `width="33%"` (`history.ui.tsx:67`); settings dropdown items use
`width={200}` (`settings.ui.tsx:132`); home uses ad-hoc `flex` ratios. Fragile across screen
sizes.

**Fix:** use flexible Tamagui layout (`flex`, `gap`, tokens) instead of fixed widths/percentages.

**Status: ✅ Done** — History filter labels use `flex={1}`/`flex={2}` + `gap` instead of
`width="33%"`; settings dropdown items dropped `width={200}` (and the now-unused `width` prop on
`DropdownItem`).

### 3.4 Localize remaining strings
- `error-message.ui.tsx:33` hardcodes `"Error:"` prefix and `"Dismiss error"`.
- `exercise-row.ui.tsx:83` hardcodes `'collapse'/'expand'`.

**Fix:** move these into the i18n JSON files.

**Status: ✅ Done** — `error-message.ui.tsx` uses `errors.errorPrefix`/`errors.dismissError`;
`exercise-row.ui.tsx` uses `history.collapse`/`history.expand`; keys added to all 5 locales.

### 3.5 Reduce N+1 data loading in History
Each expandable exercise fetches its own results on open (`exercise-row.ui.tsx:41`) and never
caches, so re-expanding re-fetches every time. History uses `ScrollView` + `map` instead of a
virtualized list.

**Fix:** cache per-exercise results in the store, and consider `FlatList`/section list for large
histories.

**Status: ✅ Done** — per-exercise results are cached in `exerciseStore.resultsCache` and invalidated
after add/update/delete (from bug #13). `FlatList`/section-list virtualization is deferred.

---

## Phase 4 — Business logic & data model

The items below are separated into **correctness bugs** (arguably belong in `problems.md`) and
**product/model gaps** (design decisions worth revisiting).

### 4.1 Correctness bugs

#### 4.1.1 Progress color depends on the user's *current* unit preference
`getProgress()` reads the mutable `settingsStore.units` at render time and converts weights with
hardcoded rounded factors (`lb→kg = ×0.453`, `kg→lb = ×2.205`). Because both factors are
approximate, changing the unit preference in Settings can **flip historical better/worse/neutral
markers** for the same data. A progress calculation should be deterministic from stored data.

**Fix:** store weight canonically (e.g. always kg) and convert only for display, OR convert each
stored `(weight, units)` pair to one canonical unit at comparison time using precise constants.
Also move the factors to a single constants module (see 4.2.3).

**Status: ✅ Fixed** — promoted to `problems.md` as bug #11. `getProgress` now converts both
weights to canonical kg using the precise constant `0.45359237` before scoring.

#### 4.1.2 Date stored in UTC, rendered as the wrong local day
`add-result` stamps `new Date().toISOString()` (UTC), and `getformattedDate()` splits that UTC
string to render `day.month.year`. An entry logged at 11pm local time can be stored and displayed
as the *next* day. Also, add-result doesn't let the user choose the date at all.

**Fix:** stamp and format in local time (or explicitly expose a date picker on add-result, like
edit-result already has).

**Status: ✅ Fixed** — promoted to `problems.md` as bug #12. Dates are now stamped/rendered in
local time via `toLocalDateString`/`toLocalDate`.

#### 4.1.3 Edited results don't refresh the History view
Result mutations (`updateResult`/`deleteResult`) never invalidate the History screen. Each
collapsible exercise row caches its results in local `useState` guarded by `isLoaded`, so after
edit-result's "go to history", stale values show until the user collapses and re-expands the row.

**Fix:** lift results into `exerciseStore` (with a results cache keyed by exercise id) and
invalidate/refetch after any mutation, so History always reflects the latest data.

**Status: ✅ Fixed** — promoted to `problems.md` as bug #13. Results are now cached in an
observable `exerciseStore.resultsCache` and invalidated after add/update/delete.

#### 4.1.4 Bodyweight vs weighted comparison is inconsistent
`weight === 0` is overloaded to mean "bodyweight", scored as `reps` alone, while weighted sets are
scored as `weight × reps`. The two are different units, so switching a bodyweight exercise to a
tiny external weight always reads as "better", and magnitudes aren't comparable. There is also no
explicit bodyweight flag — `0` is implicit (and the UI renders `0` as `'-'`).

### 4.2 Product / model gaps

#### 4.2.1 Volume-only metric mislabels weight/reps trade-offs
`weight × reps` treats `100kg × 5` as "worse" than `80kg × 7`, even though the user lifted
significantly more weight. For a *strength*-tracking app this is arguably wrong. The About page
lists multiple progressive-overload methods, but the app implements only volume.

**Fix:** offer an estimated-1RM metric (e.g. Epley) as an alternative or the default, and/or let
the user choose "strength vs volume" as their progress metric.

#### 4.2.2 No "sets" dimension
Real progressive overload is sets × reps × weight, but the data model records a single
(weight, reps) per entry — no `sets` column. Increasing sets (an explicitly listed method) can't
be captured or reflected in progress at all.

#### 4.2.3 No personal-best / trend view
Progress is only compared to the immediately adjacent entry, so two consecutive regressions show
"neutral" relative to the bad prior, and there's no "current vs all-time best" or any chart. For a
progress tracker, a per-exercise weight-over-time trend (or at least a "PR" stat) is the biggest
single value gap.

#### 4.2.4 No prefill of the previous result
When logging, add-result doesn't show "last time: 80kg × 8". The user must remember or re-enter it,
which is friction directly against the app's core loop (beat last time).

#### 4.2.5 Exercises can't be renamed or deleted
Once created, an exercise (with its results) is permanent — a typo is stuck forever. Because
`results.exercise` is denormalized, renaming would also desync history unless handled carefully.

#### 4.2.6 Cardio forced into the strength model
"Cardio" is a muscle group, but every entry requires reps + weight. Logging a run means `weight = 0`
with "reps" standing in for duration/distance — an awkward fit.

#### 4.2.7 No export / backup
All data is local SQLite with no export/import. "Delete data" exists in Settings, but there's no
way to back up or migrate a user's progress history.

### 4.3 Minor

- **Duplicate-exercise check is exact & case-sensitive** — `checkExerciseExists` compares
  `title = ? AND type = ?` verbatim, so "bench press" and "Bench Press" are distinct exercises.
- **~~Approximate, non-inverse conversion factors~~** — ✅ Resolved by the 4.1.1 fix (precise
  `0.45359237` kg-per-lb constant).
- **~~`getProgress` reads global state~~** — ✅ Resolved by the 4.1.1 fix; `getProgress` no longer
  depends on `settingsStore`.

---

## Prioritization

1. ~~**Phase 1** (1.1–1.5)~~ — ✅ Done.
2. ~~**Phase 2** (2.1–2.4)~~ — ✅ Done.
3. ~~**Phase 4.1.1–4.1.3** correctness bugs~~ — ✅ Fixed (promoted to `problems.md` as #11–#13).
4. ~~**Phase 3** (3.1–3.5)~~ — ✅ Done.
5. **Phase 4** (4.1.4, 4.2.x product gaps) — larger design decisions (1RM metric, sets, PR/trend
   view, export); each should be its own spec and decided with the user before building. **Next up.**

The remaining Phase 4 correctness bug (4.1.4 bodyweight comparison) could alternatively be
promoted into `problems.md`, since it is a bug rather than polish.
