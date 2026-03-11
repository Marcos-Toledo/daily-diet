# daily-diet

## Tech Stack

- Node.js
- TypeScript
- Fastify
- Knex
- SQLite

## Start project

```bash
npm install
npm run dev
```

## Create database

```bash
npx knex -- migrate:latest
```

## Routes

```
// Users
POST /users

// Meals
GET /meals/summary
POST /meals
GET /meals
GET /meals/:id
PUT /meals/:id
DELETE /meals/:id
```