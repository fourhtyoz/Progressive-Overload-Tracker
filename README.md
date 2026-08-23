# Progressive Overload Tracker

A React Native (Expo) mobile app for tracking strength-training progress using the
progressive overload principle — gradually increasing weight, reps, or volume over time.

## Tech stack

- **Framework:** React Native + Expo SDK 51
- **Database:** SQLite via `expo-sqlite` (promise-based API)
- **State:** MobX + `mobx-react-lite`
- **Navigation:** React Navigation (Drawer + nested native stacks)
- **UI:** Tamagui
- **Persistence (prefs):** AsyncStorage
- **i18n:** i18next + `react-i18next` (EN, DE, ES, RU, TR)

## Getting started

```bash
npm install
npm start          # Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web
```

## Scripts

| Command       | Description                       |
|---------------|-----------------------------------|
| `npm start`   | Start the Expo dev server         |
| `npm run ios` | Run on the iOS simulator          |
| `npm run android` | Run on the Android emulator   |
| `npm run web` | Run in the browser                |
| `npm run lint`| Lint with ESLint                  |
| `npm run fmt` | Format source with Prettier       |

## Project structure

```
app/
├── features/progress/       # progress calculation, unit conversion
├── navigation/              # drawer + stack navigators
├── pages/                   # screens (home, about, add/result, history, settings)
└── shared/
    ├── api/                 # SQLite operations
    ├── constants/           # muscle keys, unit keys, themes, languages
    ├── i18n/                # translations (en, de, es, ru, tr)
    ├── lib/                 # formatters and error helpers
    ├── stores/              # MobX stores
    ├── theme/               # Tamagui config and global styles
    ├── types/               # shared TypeScript types
    └── ui/                  # reusable components
```
