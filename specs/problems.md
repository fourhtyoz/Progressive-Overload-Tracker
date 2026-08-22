# Project Problems — Current State

## Low Severity

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
`home.profile`, `settings.options.fontSize`, `settings.options.notifications`, `toasts.changedFontSize` — never referenced in code.

### No loading indicator during "Delete All Data"
Three async operations with no loading state. User gets no feedback until success alert.

### No error recovery UI on edit-result screen
If `fetchResultById` fails, no retry button. User stuck with empty form and error.

### No input length limits on text inputs
Exercise title, weight, reps inputs have no `maxLength`. DB columns have no length constraint either.

### Drawer `headerRight` GoBackButton configured in two places
Both drawer-level and stack-level `screenOptions` set `headerRight`. The stack-level one overrides, making the drawer-level one dead code.
