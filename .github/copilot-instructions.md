## Purpose
Short, focused guidance to help AI coding agents be productive in this repo (Laravel + Inertia + React + Vite).

## Big picture
- **Backend:** Laravel (PHP) handles HTTP, controllers render Inertia responses. See [routes/web.php](routes/web.php) and controllers under [app/Http/Controllers](app/Http/Controllers).
- **Frontend:** Inertia + React pages live in [resources/js/pages](resources/js/pages). Pages are resolved by `resolvePageComponent` in [resources/js/app.tsx](resources/js/app.tsx).
- **Routing helpers:** Generated route helpers are under [resources/js/routes](resources/js/routes) (produced by the Wayfinder/Vite plugin). Example: [resources/js/routes/profile/index.ts](resources/js/routes/profile/index.ts) maps to [app/Http/Controllers/Settings/ProfileController.php](app/Http/Controllers/Settings/ProfileController.php).
- **Auth:** Laravel Fortify is used for auth flows; views are wired to Inertia in [app/Providers/FortifyServiceProvider.php](app/Providers/FortifyServiceProvider.php).

## Key workflows (commands)
- Install & start frontend dev: `npm install` then `npm run dev` (entry `resources/js/app.tsx`).
- Build frontend for production: `npm run build`.
- Lint/format: `npm run lint`, `npm run format`.
- Run PHP tests: `php artisan test` or `vendor/bin/phpunit` (phpunit.xml config uses sqlite :memory: for CI/local).

## Project-specific conventions and patterns
- Use route helpers (Wayfinder) rather than hard-coded URLs in React pages. Example import in a page: `import { edit } from '@/routes/profile'` (see [resources/js/pages/settings/profile.tsx](resources/js/pages/settings/profile.tsx)). Use `.form()` helpers when submitting Inertia `Form` components.
- TS path alias: `@/*` maps to `resources/js/*` (see [tsconfig.json](tsconfig.json)). Prefer `@/components`, `@/layouts`, `@/routes` imports.
- Inertia responses: controllers return `Inertia::render('...')` and pass shared props; mirror those prop names in the page components.
- Forms: many server routes expect `_method` overrides; route helper `.form()` produces correct `action` + method for HTML form submissions.

## Integration points & external dependencies
- Vite + `laravel-vite-plugin` and `@laravel/vite-plugin-wayfinder` drive frontend build and route helper generation. See [vite.config.ts](vite.config.ts).
- Tailwind is configured via the PostCSS/Vite integration (see `package.json` dev deps and `resources/css/app.css`).
- Fortify + Inertia integration centralizes auth views and actions in [app/Providers/FortifyServiceProvider.php](app/Providers/FortifyServiceProvider.php) and `app/Actions/Fortify`.

## Quick examples
- To edit profile flow end-to-end: server handler [app/Http/Controllers/Settings/ProfileController.php](app/Http/Controllers/Settings/ProfileController.php) ↔ client page [resources/js/pages/settings/profile.tsx](resources/js/pages/settings/profile.tsx) ↔ route helper [resources/js/routes/profile/index.ts](resources/js/routes/profile/index.ts).

## Guidance when changing code
- Preserve Inertia prop names and types — mismatch between controller props and page typed usage causes runtime errors.
- Update route helper generation if routes change: regenerate or run the task that populates `resources/js/routes` (this repo uses Wayfinder via Vite plugin).
- Use `npm run types` to run TypeScript checks for frontend changes.

## Where to look for examples/tests
- Tests live under `tests/Feature` and `tests/Unit` and run with `php artisan test`.
- Example frontend patterns in `resources/js/pages/*` and shared components in `resources/js/components`.

If any section is unclear or you want the file to be more prescriptive (commit messages, PR checklist, or step-by-step local dev setup with XAMPP), tell me which area to expand.
