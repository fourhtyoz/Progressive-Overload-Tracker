# Project Problems — Current State

## Remaining (Intentionally Deferred)

### Minor Optimizations
- **FONT_SIZE not responsive** — Computed once at module load from Dimensions.get('window'). Would require major refactor to use useWindowDimensions hook throughout the app. Current approach works for most use cases.
- **Lazy loading screens** — All screens load at app start. Could use React Navigation's lazy loading, but not critical for current app size.
- **Error recovery UI** — No retry button on edit-result screen if fetchResultById fails. Low priority since DB errors are rare.

### Testing
- **No test coverage** — Tests were removed per user preference. No automated verification of store logic, utils, or DB operations.

