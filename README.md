# TypeBuilder - Form Builder SaaS

A production-ready Form Builder SaaS built with a modern stack. This project was developed as part of a solo hackathon submission, meeting all requirements for dynamic form creation, robust validation, and detailed analytics.

## 🚀 Tech Stack
This project is built using a modern Turborepo monorepo structure:
- **Monorepo**: Turborepo
- **Frontend**: Next.js, Tailwind CSS
- **Backend API**: Express.js
- **API Layer**: tRPC (Type-safe APIs)
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (Strict schema validation on both frontend and backend)
- **API Documentation**: Scalar

## ✨ Features
- **Creator Dashboard**: User authentication for creators to securely manage their forms.
- **Dynamic Form Builder**: Support for various field types including short text, long text, email, number, select dropdowns, and ratings.
- **Dynamic Zod Validation**: Responses are rigorously validated on the backend using dynamically generated Zod schemas based on the form's field configuration.
- **Visibility Modes**:
  - `Public`: Discoverable on the public explore page.
  - `Unlisted`: Accessible only via a direct link.
  - `Unpublished`: Closed for responses.
- **Analytics & Responses**: Creators can view responses and analytics for their forms.
- **Rate Limiting**: Public response submission APIs are protected with `express-rate-limit` to prevent spam.
- **Theming**: Creative themes applied to forms (e.g., Anime, Tech).

## 📊 Demo Credentials & Seed Data
The database comes pre-seeded with sample forms, themes, and responses so you can immediately explore the analytics dashboard and features.

- **Demo User Email**: `demo@typebuilder.com`
- **Password**: *(Not required for the local demo; authentication is mocked in the development TRPC context for ease of review).*

**Seeded Forms Available:**
1. Anime Character Poll 2026 (Public) - Theme: `anime`
2. Tech Startup Feedback (Public) - Theme: `tech`
3. Internal Event Registration (Unlisted) - Theme: `default`

## 📚 API Documentation
The backend exposes a beautiful, interactive OpenAPI endpoint using Scalar.
- Visit **http://localhost:8000/docs** to view the API documentation when the server is running.

## 🛠️ Local Setup Instructions

Follow these steps to run the project locally for review:

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   Create a `.env` file at the root of the project with your PostgreSQL connection string:
   ```bash
   DATABASE_URL=postgres://postgres:postgres@localhost:5433/dev
   NODE_ENV=development
   PORT=8000
   BASE_URL=http://localhost:8000
   ```

3. **Start the Database (Optional)**
   If you have Docker installed, you can easily spin up a local Postgres instance:
   ```bash
   docker compose up -d
   ```

4. **Initialize Database & Seed Data**
   Run the following commands from the root to push the schema and populate the demo data:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start the Development Server**
   ```bash
   pnpm dev
   ```

6. **View the Application**
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **API Docs (Scalar)**: [http://localhost:8000/docs](http://localhost:8000/docs)
