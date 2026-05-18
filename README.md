# Launchpad Mission Control

**Launchpad Mission Control** is a shared, multi-user web application designed for staff to manage partnerships, student outreach, interactions, and automated communications. It provides administrative controls and a shared database, ensuring all staff members can view and contribute to the organization's outreach efforts.

**Status**: ✅ **ALMOST READY FOR DEVELOPMENT**  
**Last Updated**: May 6, 2026  
**Version**: 1.0

---

## Core Purpose
The application serves as a central hub for tracking and managing the relationship between staff, partners (educational and corporate), and students. It streamlines the process of logging interactions, managing student status, and facilitating outreach through AI-assisted communication.

## ✨ Key Features
- **Shared Workspace & Dashboard**: Real-time overview of recent interactions, quick actions, and administrative review queues.
- **Partner Management**: Detailed tracking of organization contacts (Leadership, Primary, Secondary), school types, and partnership status.
- **Interaction Logging**: Centralized log for infosessions, tabling, meetings, outreach, and interviews, including student participation counts and shared notes.
- **AI-Powered Outreach**: Integration with OpenAI to generate tailored outreach emails based on partner interaction history and staff instructions.
- **Audit Trail**: Full activity logging of all record creations, updates, and deletions for security and accountability.
- **Global Search**: Searchable database for partners, and interactions.

## Technology Stack
- **Frontend**: React + Next.js with Tailwind CSS and [shadcn/ui](https://ui.shadcn.com/) components.
- **Backend**: Node.js + Express with [Prisma ORM](https://www.prisma.io/).
- **Database**: PostgreSQL (hosted on Neon).
- **Authentication**: NextAuth.js with Google Workspace SSO and email/password support.
- **AI**: OpenAI API for intelligent email composition.

## 🚀 Setup Instructions (Frontend & Backend)

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL database (Neon or local)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Launchpad\ Mission\ Control
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
- Copy `.env.example` to `.env` and fill in all required values:
  - `DATABASE_URL` (PostgreSQL connection string)
  - `OPENAI_API_KEY` (OpenAI API key)
  - Email and OAuth credentials as needed

### 4. Database Setup
- Run Prisma migrations:
```bash
npx prisma migrate deploy
```

### 5. Running the App
- Start the development server:
```bash
npm run dev
```

- The app will be available at `http://localhost:3000` (frontend) and API routes at `/api/*`.

### 6. Useful Scripts
- `npm run dev` — Start Next.js frontend and backend
- `npm run build` — Build frontend
- `npm run start` — Start production server

---

## 🛠️ Unified Installation & Setup

This project uses a unified monorepo structure. All dependencies for both frontend (Next.js, React, Tailwind CSS) and backend (Express, Prisma, OpenAI, etc.) are managed in a single `package.json` at the repository root.

### One-Step Install

To install everything needed for development and production, simply run:

```bash
npm install
```

This will install all required dependencies for both the frontend and backend code.

### Quickstart Summary
1. Clone the repository
2. Run `npm install` in the root directory
3. Copy `.env.example` to `.env` and fill in your secrets
4. Run database migrations with `npx prisma migrate deploy`
5. Start the app with `npm run dev`

No separate install steps are needed for frontend or backend—everything is managed together for simplicity.

---

## 📁 Folder Structure

```
Launchpad Mission Control/
├── activity-log/
├── admin/
├── api/
├── app/
├── auth/
├── components/
├── context/
├── dashboard/
├── email/
├── hooks/
├── interactions/
├── lib/
├── login/
├── partners/
├── prisma/
├── public/
├── reports/
├── search/
├── settings/
├── src/
├── .DOCUMENTATION GUIDES/
├── globals.css
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── ... (other config and markdown files)
```

- All frontend, backend, and API code is organized under this single repository root for simplicity and easy integration.
- Documentation and environment templates are in `.DOCUMENTATION GUIDES/`.
- See individual folders for feature-specific code.

---

For more details, see .DOCUMENTATION GUIDES:
- `GETTING_STARTED.md` for a quickstart
- `DATABASE_INTEGRATION_GUIDE.md` for database setup
- `IMPLEMENTATION_SUMMARY.md` for architecture overview

---
*Built for Launchpad Philly staff.*