# Database Integration Guide

## Database Used
- PostgreSQL (recommended: Neon)

## Configuration
- Set your `DATABASE_URL` in the `.env` file. Example:
  ```
  DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
  ```
- The Prisma schema is located at `prisma/schema.prisma`.

## Migrations
- To apply migrations:
  - `npx prisma migrate deploy`
- To generate the Prisma client:
  - `npx prisma generate`

## Seeding Data
- (Optional) Add a seed script if you want initial data.

## Troubleshooting
- Ensure your database is running and accessible from your environment.
- Check `.env` for correct credentials.
