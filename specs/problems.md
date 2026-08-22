# Project Problems — Current State

## 1. Bugs

### Delete All Data doesn't refresh the store
`SettingsScreen.handleDeleteAllData` drops and recreates DB tables but never calls `exerciseStore.initialize()`. After deletion, the store still holds stale exercises/results. History screen shows old data until a full restart.

### Race condition in database singleton
`getDatabase()` in `db.ts` checks `if (!database)` then awaits `openDatabaseAsync`. Two concurrent callers can both see `null` and open separate connections. Fix: store the promise itself so concurrent callers share the same initialization.

### "No exercises" alert fires before loading completes
`AddResultScreen` checks `exercises.length === 0` in a `useEffect([], ...)` on mount. But `exerciseStore.initialize()` is async — if exercises exist but haven't loaded yet, the user sees a spurious alert. Fix: also check `exerciseStore.isLoading`.

### HistoryScreen muscle dropdown `defaultValue` is always `undefined`
`muscleOptions.filter((item) => item === '-')[0]` — the value `'-'` never exists in `muscleOptions` (which contains muscle types like `'chest'`, `'legs'`). The dropdown's `defaultValue` is always `undefined`.

### `getformattedDate` crashes on unexpected date formats
`date.split('T')[0].split('-')` destructures into `[year, month, day]`. If the date string isn't ISO format, the values are `undefined`, producing `"undefined.undefined.undefi"`.

### `initializeDatabase` failure is silently swallowed
Called in `useEffect` with no `.catch()` and no error state. If DB init fails, the app silently proceeds with no tables and every subsequent query fails with cryptic errors.

### Empty alert message in Result component
`Alert.alert(t('alerts.chooseAction'), '', ...)` — the message body is `''` with a TODO comment. Users see an alert with no description.

### Imprecise unit conversion constants
`0.453` and `2.205` are rough approximations. Exact factors are `0.45359237` and `2.20462262...`. Minor but can cause progress indicator disagreements.

### `useEffect` depends on `route` object reference
`EditResultScreen` uses `[route]` as dependency. Should be `[route.params.resultId]` for correctness.

---

## 2. Code Smells

### Massive dropdown rendering duplication
The same `SelectDropdown` pattern (dark-mode-aware `renderButton` + `renderItem` with conditional `backgroundColor`) is copy-pasted across 12 dropdown instances in 5 files. A single reusable `ThemedDropdown` component would eliminate hundreds of lines.

### AddResultScreen and EditResultScreen are near-clones
Both have identical form structure: muscle dropdown, exercise dropdown, weight + unit dropdown, reps input, submit button. Only difference is EditResultScreen pre-populates from DB and has a date picker. Strong candidate for a shared `ResultForm` component.

### Zero memoization anywhere
No `useMemo`, `useCallback`, or `React.memo` in the entire project. Hot spots:
- `Exercise.tsx`: `filteredResults` re-sorts on every render
- `HistoryScreen.tsx`: `.filter().map()` on every render
- `AboutScreen.tsx`: `content` array (6 objects) recreated on every render
- `Result` component re-renders every time parent `Exercise` re-renders

### Exercise component does too much
Handles: fetching results, local loading state, sort ordering, progress calculation, delete with alert, collapsible toggle, table header rendering, result list rendering. Should be split into data-fetching container + presentational component.

### Unused styles in multiple screens
- `HistoryScreen.tsx`: ~100 lines of unused StyleSheet definitions (`notFound`, `text`, `dropdownWrapper`, `exerciseSection`, `exerciseHeader`, `row`, `headerRow`, `cell`, `cellAction`, `headerCell`)
- `SettingsScreen.tsx`: `optionText` and `options` defined but never used
- `HomeScreen.tsx`: `thirdBox` defined but never used
- `AboutScreen.tsx`: `listItem` defined but never used

### Unnecessary fragment wrapper
`Exercise.tsx` wraps a single `<View>` in `<>...</>`.

### Inconsistent error handling
- `Exercise.tsx` uses `Alert.alert` for delete errors, local `setError` for fetch errors
- `AddExerciseScreen` uses local `setError`
- `AddResultScreen` uses local `setError`
- `SettingsScreen.handleDeleteAllData` has no error handling at all

### Misspelled function names
- `getDeviceLanuguage` in `i18n.ts` (should be `getDeviceLanguage`)
- `handleSucess` in `AddExerciseScreen.tsx` (should be `handleSuccess`)

### Hardcoded English error message
`AddExerciseScreen.tsx` line 48: `setError('Exercise exists')` — not translated. All other errors use `t('errors.xxx')`.

---

## 3. Architecture

### Cross-stack navigation uses `as any` casts
`AddResultScreen` and `EditResultScreen` both use `(navigation.getParent() as any)?.navigate('History')`. Bypasses TypeScript — if the drawer route name changes, the compiler won't catch it.

### Navigation type definitions in wrong place
`AddResultStackParamList` and `HistoryStackParamList` are defined in `DrawerNavigator.tsx` but imported by screens. Should live in `types.ts` or a dedicated navigation types file.

### Stray explicit file in tsconfig.json include
`"app/store/settingsStore.ts"` is listed explicitly alongside `"**/*.ts"` — redundant.

### exerciseStore doesn't refresh after result mutations
`addResult`, `updateResult`, `deleteResult` are thin pass-throughs to DB. They don't refresh the store's exercise list. After result deletion, the component updates local state but the store is unaware.

---

## 4. Type Safety

### `TResult.units` and `TExercise.type` are `string` instead of union types
`units: string` could be `'kg' | 'lb'`. `type: string` could be `typeof MUSCLE_KEYS[number]`. Plain `string` means typos compile without error.

### `SettingsStore` properties are all `string` with no narrowing
`theme`, `language`, `units`, `fontSize` should use union types matching their respective key constants.

### `DBResult` should be a discriminated union
Currently `{ success: boolean; data?: T; error?: string }`. Callers must check `res.error` even on success. Should be `{ success: true; data: T } | { success: false; error: string }`.

### `props` typed as `object` in toast config
`index.tsx` line 38: `success: (props: object)` — barely better than `any`.

### `onChange` handler uses `unknown` for event parameter
`EditResultScreen.tsx` line 116: should use `DateTimePickerEvent` from the library.

---

## 5. Performance

### `Dimensions.get('window')` at module scope
Used in `HomeScreen.tsx`, `HistoryScreen.tsx`, `globalStyles.ts`. Values computed once at import, never update on rotation or split-screen. Should use `useWindowDimensions()` hook.

### `AboutScreen` recreates content array on every render
Six objects with translated strings rebuilt on every render. Should be outside the component or wrapped in `useMemo`.

---

## 6. UX

### "Delete All Data" has no loading indicator
`deleteTables()` + `initializeDatabase()` are async but no loading state. User taps and nothing visible happens.

### Loader background color looks wrong in light mode
`Loader.tsx` uses `COLORS.blackTransparentBorder` (`rgba(0,0,0,0.1)`) in light mode — looks like a bug. Should use the light background color.

### Expand/collapse uses text characters instead of icons
`Exercise.tsx` uses `'↑'` / `'↓'` while the rest of the app uses `Ionicons`. Visually inconsistent.

### HomeScreen uses rigid screen-fraction dimensions
Card heights are `screenHeight / 2.5`, `/ 1.5`, `/ 3`. Magic-number fractions produce different layouts on different devices. Should use flex or `aspectRatio`.

### Missing accessibility labels throughout
No `accessibilityLabel` or `accessibilityRole` on any screen or component. HomeScreen cards, dropdowns, expand/collapse toggle, settings delete button — all lack accessibility annotations.

### SettingsScreen dropdown styles are local, not shared
Settings defines its own dropdown styles while other screens use `globalStyles`. A global dropdown style change would miss Settings.

---

## 7. Testing

### Tests mock `observer` away
Every test mocks `mobx-react-lite` with `observer: jest.fn((component) => component)`, stripping reactive behavior.

### No coverage for stores, utils, or DB operations
Only screen render tests exist. No tests for exerciseStore, settingsStore, getProgress, toTitleCase, groupByExercise, or any DB operations.

### HistoryScreen test suite fails at module load
`DefaultTheme` from `@react-navigation/native` is `undefined` in the test environment — pre-existing mock issue.
