# Progressive Overload Tracker — Project Overview

## What it is

A React Native (Expo) mobile app for tracking strength-training progress using the progressive overload principle — gradually increasing weight, reps, or volume over time.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo (~51) |
| Database | SQLite via `expo-sqlite` (modern promise-based API) |
| State management | MobX + mobx-react-lite |
| Navigation | React Navigation — Drawer + nested Native Stacks |
| UI library | Tamagui (all components) |
| Persistence (prefs) | AsyncStorage |
| i18n | i18next + react-i18next (EN, DE, ES, RU, TR) |
| Linting | ESLint (flat config style) + Prettier |
| Dropdowns | react-native-select-dropdown |
| Date picker | @react-native-community/datetimepicker |

## Project structure

```
app/
├── features/
│   └── progress/
│       └── progress.lib.ts              ← progress calculation, unit conversion
├── navigation/
│   └── drawer.navigator.tsx             ← Drawer + stack navigators, type exports
├── pages/
│   ├── about/about.ui.tsx
│   ├── add-exercise/add-exercise.ui.tsx
│   ├── add-result/add-result.ui.tsx
│   ├── edit-result/edit-result.ui.tsx
│   ├── history/
│   │   ├── history.ui.tsx
│   │   └── ui/
│   │       ├── exercise-row.ui.tsx      ← collapsible exercise table
│   │       └── result-row.ui.tsx        ← single result row
│   ├── home/home.ui.tsx
│   └── settings/settings.ui.tsx
├── shared/
│   ├── api/db.ts                        ← SQLite operations
│   ├── constants/settings.ts            ← MUSCLE_KEYS, UNIT_KEYS, THEME_KEYS, LANGUAGES
│   ├── i18n/
│   │   ├── i18n.ts
│   │   └── en.json, de.json, es.json, ru.json, tr.json
│   ├── lib/
│   │   ├── errors.lib.ts                ← handleTransactionError
│   │   └── formatters.lib.ts            ← toTitleCase, getformattedDate
│   ├── stores/
│   │   ├── exercise.store.ts            ← exercises + results CRUD
│   │   └── settings.store.ts            ← theme, language, units
│   ├── theme/
│   │   ├── global-styles.ts             ← COLORS, FONT_SIZE, themes
│   │   └── tamagui.config.ts            ← Tamagui config with app colors
│   ├── types/index.ts                   ← TExercise, TResult, DBResult
│   └── ui/
│       ├── button.ui.tsx                ← Tamagui Button wrapper
│       ├── error-message.ui.tsx         ← Tamagui alert component
│       ├── go-back-button.ui.tsx        ← Tamagui back button
│       └── loader.ui.tsx                ← Tamagui Spinner
└── index.tsx                            ← App entry, providers
```

## Database schema

**exercises**
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | auto-increment |
| title | TEXT | exercise name |
| type | TEXT | muscle group |

**results**
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | auto-increment |
| exercise_id | INTEGER FK | → exercises.id, CASCADE delete |
| exercise | TEXT | denormalized exercise name |
| date | TEXT | ISO date string |
| muscleGroup | TEXT | muscle group |
| reps | INTEGER | rep count |
| weight | REAL | weight lifted (supports decimals) |
| units | TEXT | kg / lbs |

## Navigation structure

```
Drawer
├── Home
├── About
├── AddResult → Stack
│   ├── AddResult (main)
│   └── AddExercise (pushed on top)
├── History → Stack
│   ├── History (main)
│   └── EditResult (pushed on top)
└── Settings
```

## Data flow

All data operations go through `exerciseStore`:
- Screens call store actions (addResult, deleteResult, etc.)
- Store calls `db.ts` for SQLite operations
- Store refreshes its own state after mutations
- Screens observe store state via MobX `observer`

Settings are managed by `settingsStore` with AsyncStorage persistence.

## UI architecture

All components use **Tamagui** for:
- Theme-aware styling (light/dark via `$color`, `$background` tokens)
- Built-in accessibility (roles, labels)
- Consistent spacing via design tokens
- Press animations and focus states

`SelectDropdown` is kept as a third-party component (no Tamagui equivalent for native dropdowns).

## i18n

All user-facing strings live in JSON translation files under `shared/i18n/`. Muscle groups, units, and themes use `t('muscles.chest')`, `t('units.kg')`, `t('themes.light')` pattern. Adding a new language only requires a new JSON file.
