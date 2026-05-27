# TypeBuilder (Form Builder SaaS)

A production-ready Form Builder SaaS built with Turborepo, Next.js, tRPC, Drizzle ORM, Zod, and Express.

## Features

- **Public & Unlisted Forms**: Create forms that are discoverable on the Explore page or keep them unlisted with a direct link.
- **Dynamic Field Types**: Support for Short text, Long text, Email, Number, Single select, and Rating.
- **Type-Safe Validation**: Fully powered by Zod schemas on both frontend and backend.
- **Creator Dashboard**: View form analytics, responses, and manage fields via the builder interface.
- **Modern UI**: Built with Tailwind CSS, supporting glassmorphism and vibrant custom themes.
- **Rate Limiting**: Integrated `express-rate-limit` for public API endpoints.
- **API Documentation**: Auto-generated OpenAPI specs via Scalar available at `/docs`.

## Demo Credentials & Data

The database has been seeded with a demo user and 3 sample forms:
- **Demo User Email**: `demo@streamyst.com`
- **Sample Forms**:
  1. Anime Character Poll (Public) - Theme: `anime`
  2. Tech Startup Feedback (Public) - Theme: `tech`
  3. Internal Event Registration (Unlisted) - Theme: `default`

*(Note: Authentication for the demo is mocked in the TRPC context to automatically use this demo user. No password required for the demo dashboard).*

## API Documentation

The backend exposes an OpenAPI endpoint using Scalar.
- Visit: `http://localhost:8000/docs` to view the interactive API documentation.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   The `.env` file must be created at the root with a `DATABASE_URL` pointing to your PostgreSQL instance.
   ```bash
   DATABASE_URL=postgres://postgres:postgres@localhost:5433/dev
   NODE_ENV=development
   PORT=8000
   BASE_URL=http://localhost:8000
   ```

3. **Start Database (Optional, uses Docker)**
   ```bash
   docker compose up -d
   ```

4. **Run Migrations & Seed Data**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

6. **Open the Apps**
   - **Frontend**: `http://localhost:3000`
   - **API / Docs**: `http://localhost:8000/docs`
