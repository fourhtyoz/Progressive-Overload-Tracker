# Progressive Overload Tracker — Project Overview

## What it is

A React Native (Expo) mobile app for tracking strength-training progress using the progressive overload principle — gradually increasing weight, reps, or volume over time.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo (~51) |
| Database | SQLite via `expo-sqlite` (legacy API) |
| State management | MobX + mobx-react-lite |
| Navigation | React Navigation — Drawer navigator |
| Persistence (prefs) | AsyncStorage |
| i18n | i18next + react-i18next (EN, DE, ES, RU, TR) |
| UI extras | react-native-select-dropdown, react-native-toast-message, react-native-date-picker |

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
| weight | INTEGER | weight lifted |
| units | TEXT | kg / lbs / etc. |

## Screens

| Screen | Visible in drawer | Purpose |
|---|---|---|
| **Home** | Yes | Landing page with image cards linking to the main sections |
| **Add Result** | Yes | Log a workout entry — pick muscle group, exercise, enter weight, reps, units |
| **History** | Yes | Browse all exercises and their results; filter by muscle group, sort by date |
| **Settings** | Yes | Change language, units, theme (light/dark); delete all data; contact developer |
| **About** | Yes | Educational content about the progressive overload concept |
| **Add Exercise** | No (hidden) | Create a new exercise — pick muscle group, enter name |
| **Edit Result** | No (hidden) | Edit an existing result — change date, exercise, weight, reps, units |

## What the user can do

1. **Create exercises** — choose a muscle group and give the exercise a name; duplicates are blocked.
2. **Log workout results** — select an existing exercise, enter weight + reps + units; the current date is recorded automatically.
3. **Browse history** — view all exercises with their logged results, filter by muscle group, sort ascending/descending by date.
4. **Edit results** — change any field of a logged result including the date.
5. **Delete results** — remove individual entries from history.
6. **Change settings** — switch language, toggle light/dark theme, change measurement units; preferences persist across sessions.
7. **Delete all data** — drops and recreates both database tables (with confirmation dialog).
8. **Read about progressive overload** — informational section explaining the training concept.

## State management

- **exerciseStore** — holds the exercises list, muscle group options, loading/error state; fetches from DB on init.
- **settingsStore** — holds theme, language, units, notifications; reads/writes AsyncStorage and syncs i18n language on change.
