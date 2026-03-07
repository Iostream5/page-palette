# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all app code.
- `src/pages/` holds route-level screens (for example `Editor.tsx`, `Dashboard.tsx`).
- `src/components/` contains reusable UI and feature components:
  - `ui/` for shadcn-style primitives
  - `editor/` and `preview/` for domain features
- `src/hooks/`, `src/lib/`, and `src/types/` hold hooks, utilities, and shared types.
- `src/integrations/supabase/` contains Supabase client/types.
- `src/test/` contains test setup and tests (for example `example.test.ts`).
- `public/` is for static assets; `supabase/` is for backend-related config.

## Build, Test, and Development Commands
- `npm run dev` starts Vite dev server on port `8080`.
- `npm run build` creates a production build in `dist/`.
- `npm run build:dev` builds using development mode.
- `npm run preview` serves the built app locally.
- `npm run lint` runs ESLint for `ts/tsx` files.
- `npm run test` runs Vitest once; `npm run test:watch` runs in watch mode.

## Coding Style & Naming Conventions
- Use TypeScript + React function components.
- Prefer path alias imports with `@/` (configured in `tsconfig.json` and `vite.config.ts`).
- Use 2-space indentation and keep files formatted consistently with existing code.
- Component and page filenames: `PascalCase.tsx`.
- Hooks: `useSomething.ts(x)`.
- UI primitive files in `src/components/ui/` use lowercase kebab-case (for example `alert-dialog.tsx`).
- Run `npm run lint` before opening a PR.

## Testing Guidelines
- Framework: Vitest + Testing Library (`jsdom` environment).
- Test files must match `src/**/*.{test,spec}.{ts,tsx}`.
- Keep test setup in `src/test/setup.ts`; add shared utilities there when needed.
- Prefer behavior-focused tests for pages/components and critical editor flows.

## Commit & Pull Request Guidelines
- History uses short subjects (for example `Add component export dialog`, `Enhance Template Builder UX`).
- Prefer imperative, specific commit messages; avoid generic `Changes`.
- PRs should include:
  - clear summary of user-facing impact,
  - linked issue/task (if available),
  - screenshots or GIFs for UI changes,
  - note of commands run (`lint`, `test`, `build`).

## Security & Configuration Tips
- Do not commit secrets. Keep environment values in `.env` only.
- Validate Supabase-related changes in `src/integrations/supabase/` and relevant editor/auth flows before merge.