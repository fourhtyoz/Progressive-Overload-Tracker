# Project Problems — Current State

## High Severity

### ExerciseStore queries DB before tables are created
`exerciseStore` constructor calls `this.initialize()` at module import time, which queries the `exercises` table. But `initializeDatabase()` (which creates tables) runs later in a `useEffect` in `index.tsx`. On fresh install, the initial query fails with "no such table: exercises". The error is caught but the user sees an empty list with an error on first launch.

### Zero reps passes validation
In both `handleChangeReps` functions (AddResultScreen, EditResultScreen): `if (num && num < 1)` — when `num` is `0`, the expression short-circuits to falsy, so the validation error never triggers. Users can submit results with 0 reps.

### Massive SelectDropdown duplication
The `SelectDropdown` with `renderButton`/`renderItem` callbacks is copy-pasted across 5 screens (AddResult, EditResult, AddExercise, History, Settings) with near-identical styling. Each instance is 20-40 lines. Should be a shared `<ThemedDropdown>` component.

### Singleton stores initialized at module scope
Both stores are instantiated at module import time with constructors that kick off async initialization. This causes the DB race condition above, makes testing impossible (can't reset state), and runs side effects at import time.

---

## Medium Severity

### Weight validation allows negative numbers
`handleChangeWeight` only checks `isNaN(num)` but never checks for negative values. Users can enter "-50" as weight. The translation key `errors.weightMustBePositive` exists in all 5 language files but is never used.

### `useEffect` dependency on entire `route` object
EditResultScreen uses `[route]` as dependency. The `route` object is a new reference on every render in React Navigation, causing the effect to re-run on every render — re-fetching the result and resetting all form fields. Should be `[route.params.resultId]`.

### `deleteTables()` has no error handling
No try/catch. If DROP TABLE fails, the error propagates unhandled.

### `handleDeleteAllData` has no error handling
Three sequential async operations with no try/catch. If any fails, no user feedback is shown and data may be in an inconsistent state.

### `exerciseExist` silently returns `false` on DB error
A DB error is treated as "exercise does not exist", allowing duplicate exercises to be added without the user knowing the DB is failing.

### `ExerciseStore` is a thin pass-through wrapper
Methods like `addResult`, `updateResult`, `deleteResult`, `fetchResultById` are one-liners that just call `db.ts` and return. They add indirection without store-level logic.

### Settings persistence split between store and screen
Language, units, and theme are persisted to AsyncStorage inside the settings screen component, not inside the store's setter methods. If any other code path calls `settingsStore.setTheme(...)`, the change won't be persisted.

### `navigation.getParent()` cast is fragile
AddResultScreen and EditResultScreen cast `navigation.getParent()` to `NavigationProp<DrawerParamList>`. If the navigation hierarchy changes, this silently fails.

### `settingsStore` properties are `string` instead of union types
`theme` should be `'light' | 'dark'`, `units` should be `'kg' | 'lb'`, `language` should be a union of supported codes. Plain `string` means typos compile without error.

### Zero memoization anywhere
No `useMemo`, `useCallback`, or `React.memo` in the entire codebase. `filteredResults` in Exercise re-sorts on every render. AboutScreen recreates its content array on every render.

### Hardcoded English strings in accessibility labels and error messages
"Database Error", "Edit result", "Change date", "Loading", "Failed to add result" — all untranslated.

### Inconsistent mixing of Tamagui tokens and raw COLORS
Some styles use `$color`/`$colorMuted` while others use `settingsStore.isDark ? COLORS.xxx : COLORS.yyy`. Defeats the purpose of the Tamagui theme system.

---

## Low Severity

### `exerciseExist` silently returns `false` on DB error
DB error treated as "exercise does not exist".

### Dead settings: `fontSize` and `notifications` stored but never used
`fontSize` is loaded from AsyncStorage and has a setter, but no component reads it. `notifications` has a toggle but is never called. Dead code.

### Dead `globalStyles` entries
`input`, `inputWithOption`, `exerciseText`, `exerciseTextPlaceholder`, `wrapper`, `itemWrapper`, `inputLabel`, `buttonWrapper`, `date` — defined but never referenced.

### Unnecessary `import React` in all component files
11 files import `React` explicitly. With React 18's automatic JSX runtime, this is unnecessary.

### Pointless state reset before navigation
AddExerciseScreen resets state (`setMuscleGroup('')`, `setTitle('')`) then immediately calls `navigation.goBack()`. The component is about to unmount.

### No DB connection lifecycle management
`dbPromise` is set once and never cleared. No `closeDatabase()` function. No recovery path if the connection becomes invalid.

### All screens eagerly imported in drawer navigator
All screen modules load at app start. React Navigation supports lazy loading.

### `progress` return type is `string` instead of union
Always one of `'better' | 'worse' | 'neutral' | 'new'` but typed as `string`.

### `DBResult<T>` not consistently used as return type
Some DB functions have explicit return types, others have inferred. Shapes differ (some include `error` field, some don't).

### Toast config uses `props: object`
`success: (props: object)` provides no type safety for the spread into `BaseToast`.

### `FONT_SIZE` computed once at module load
`Dimensions.get('window')` called once at module load. Stale after rotation or split-screen.

### Unused translation keys
`home.profile`, `settings.options.fontSize`, `settings.options.notifications`, `toasts.changedFontSize`, `errors.weightMustBePositive` — never referenced in code.

### No loading indicator during "Delete All Data"
Three async operations with no loading state. User gets no feedback until success alert.

### No error recovery UI on edit-result screen
If `fetchResultById` fails, no retry button. User stuck with empty form and error.

### No input length limits on text inputs
Exercise title, weight, reps inputs have no `maxLength`. DB columns have no length constraint either.

### Drawer `headerRight` GoBackButton configured in two places
Both drawer-level and stack-level `screenOptions` set `headerRight`. The stack-level one overrides, making the drawer-level one dead code.
