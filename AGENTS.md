# Repository Guidelines

## Project Structure & Module Organization
Launchpad Mission Control is a Next.js application using the app router for routing and API routes. The frontend code is organized under `app/` with feature-based directories like `dashboard/`, `partners/`, `interactions/`, and `email/`. Shared components are in `app/components/`, context providers in `app/context/`, and utility functions in `app/lib/`. API endpoints are in `api/` with subdirectories for different resources. Database schema and migrations are managed in `prisma/`. Configuration files like `tsconfig.json`, `tailwind.config.js`, and `package.json` are at the root.

## Build, Test, and Development Commands
- `npm run dev` — Start the Next.js development server on localhost:3000
- `npm run build` — Build the application for production
- `npm run start` — Start the production server
- `npx prisma migrate deploy` — Apply database migrations

## Coding Style & Naming Conventions
Code is written in TypeScript with strict mode enabled in `tsconfig.json`. Use React functional components with hooks. Styling uses Tailwind CSS with shadcn/ui components. File names follow kebab-case for pages (e.g., `page.tsx`) and PascalCase for components (e.g., `AddPartnerForm.tsx`). Import paths use the `@/*` alias configured in TypeScript.

## Testing Guidelines
No automated testing framework is currently configured. Test the application manually by running `npm run dev` and verifying features in the browser.

## Commit & Pull Request Guidelines
Commits follow the pattern "Build V.X.X Description" based on recent history. Pull requests should include a clear description of changes and test any new features.