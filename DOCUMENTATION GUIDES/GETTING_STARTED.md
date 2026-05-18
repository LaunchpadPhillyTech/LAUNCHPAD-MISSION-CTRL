# Getting Started

Welcome to Launchpad Mission Control!

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL database (Neon or local)

## Installation
1. Clone the repository.
2. Install dependencies:
   - `npm install`
3. Copy `.env.example` to `.env` and fill in required values.
4. Run database migrations (if needed):
   - `npx prisma migrate deploy`

## Running the App
- Start the development server:
  - `npm run dev`

## Useful Scripts
- `npm run dev` — Start Next.js frontend
- `npm run build` — Build frontend
- `npm run start` — Start production server

---
For backend API and advanced configuration, see DATABASE_INTEGRATION_GUIDE.md.
