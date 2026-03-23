# Mini Compliance Tracker

A small Express + PostgreSQL app for tracking clients and their compliance tasks.

It includes:

- sign up / login
- client management
- task creation
- task filtering by status and category
- task status toggling between pending and completed

## Stack

- Node.js
- Express
- Sequelize
- PostgreSQL
- plain HTML / CSS / JavaScript

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy the example file and adjust it for your machine:

```bash
cp .env.example .env.dev.local
```

Minimum values to set:

```env
JWT_SECRET=replace-this-with-a-real-secret
JWT_EXPIRY=1d

DB_NAME=testDB
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_SSL=false
```

You can also use a single connection string instead:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/testDB
DB_SSL=false
```

### 3. Make sure PostgreSQL is running

Create the database you reference in your env file. Example:

```sql
CREATE DATABASE testDB;
```

The app uses `sequelize.sync({ alter: true })`, so tables are created automatically on startup.

### 4. Start the app

For local development:

```bash
npm run dev
```

For a production-style run:

```bash
npm start
```

### 5. Open the app

Visit:

```text
http://localhost:3000
```

You should land on the login page.

## Environment variables

The app currently reads env values from `.env.<NODE_ENV>.local`.

Common values:

- `JWT_SECRET`
- `JWT_EXPIRY`
- `DATABASE_URL`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_SSL`
- `PORT`

## Deployment note

For a simple hosted setup, this repo works well on Render with a hosted Postgres database.

If you use Supabase with Render, use the pooled connection string for `DATABASE_URL`, not the direct IPv6 connection string.

## Tradeoffs

- The frontend is plain HTML, CSS, and JavaScript. That keeps the project easy to inspect, but UI state management is manual and will get harder to maintain as the app grows.
- `sequelize.sync({ alter: true })` is convenient for a small project and demo deployment, but it is not a substitute for proper migrations in a production app.
- The app serves frontend and API from the same Express server. That makes deployment simple, but it tightly couples both layers.
- Filtering is intentionally lightweight. Status is handled server-side while category filtering is also re-applied in the browser for responsiveness.

## Assumptions

- Each user only needs to see and manage their own clients and tasks.
- A task belongs to exactly one client.
- Task status only needs two values right now: `pending` and `completed`.
- Authentication is email/password based and JWTs stored in local storage.
- Speed of setup and clarity were prioritized over production ready deployment.
