# Frontend & Backend Integration Guide

## Overview
This guide explains how the Next.js frontend connects to the Node.js/Express backend and how to configure API URLs and environment variables.

---

## API URL Configuration
- The frontend makes requests to API routes under `/api/*`.
- By default, Next.js proxies API requests to the backend if both are running together.
- If running separately, set the backend API base URL in your `.env` or config files as needed.

### Example (in .env or config):
```
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## Environment Variables
- Place all sensitive keys (database, OpenAI, OAuth, email) in your `.env` file (see `.env.example`).
- Do not commit `.env` to version control.

## Running Both Servers
- Use `npm run dev` to start the Next.js frontend (and backend if integrated).
- If backend is separate, start it with `node index.js` or your preferred command.

## Troubleshooting
- Ensure both servers are running and accessible.
- Check CORS settings if accessing backend from a different origin.
- Verify all environment variables are set correctly.

---
For more details, see the main `README.md` and `.env.example`.
