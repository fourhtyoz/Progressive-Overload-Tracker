# Project Problems — Current State

## Resolved

All previously identified issues have been resolved:

- ✅ Migrated from legacy expo-sqlite to modern promise-based API
- ✅ Store-centric data layer (screens no longer call db.ts directly)
- ✅ Stack-inside-drawer navigation (AddExercise and EditResult are proper stack pushes)
- ✅ All bugs fixed (store refresh, DB race condition, alert timing, dropdown defaults, date parsing, error handling, empty alert message, misspelled functions, untranslated strings)
- ✅ Dead code removed
- ✅ Type safety improved (zero `any` types in source code)
- ✅ Styling centralized (COLORS constant, no hardcoded hex values outside it)
- ✅ i18n consolidated (all translations in JSON files, not constants)
- ✅ Project restructured (feature-sliced: pages/, shared/, features/)
- ✅ Tamagui integrated (all screens and components use Tamagui)
- ✅ ESLint upgraded with import sorting, floating promise detection, unused var detection
- ✅ Unused dependencies removed

## Remaining

### Code quality

- **SettingsScreen dropdown styles are local** — Settings defines its own dropdown styles instead of using `globalStyles`. A global dropdown style change would miss Settings.
- **HomeScreen uses rigid dimension-based sizing** — Card heights use `screenHeight / 2.5` magic fractions. Should use flex or `aspectRatio` for better responsiveness across devices.

### UX

- **Missing accessibility labels on some components** — HomeScreen cards, dropdown buttons, and expand/collapse toggles could use more `accessibilityLabel` props.
- **Expand/collapse uses text arrows** — Exercise component uses `'↑'`/`'↓'` instead of icons. Visually inconsistent with the rest of the app which uses `Ionicons`.

### Testing

- **No test coverage** — Tests were removed. No automated verification of store logic, utils, or DB operations.
