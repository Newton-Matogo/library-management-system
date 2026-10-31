# Library Management System

A backend application for managing a library, built with **NestJS**, **Prisma ORM**, and **Supabase PostgreSQL**.

## Technologies Used

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)

## Database Schema

The database contains three main models:

- **User**: Stores library users and their roles.
- **Genre**: Stores book genres.
- **Book**: Stores book information and references its genre.

The `Role` enum defines two user roles:

- `PATRON`
- `LIBRARIAN`

## Schema Decisions

The `Genre` model is stored in a separate table rather than embedding genre information directly inside the `Book` model.

This design creates a one-to-many relationship: one genre can have many books, while each book belongs to one genre.

The `Book` model stores a `genreId` foreign key that references the `Genre` table.

This approach:

- Avoids repeating genre names and descriptions across multiple books.
- Maintains consistent genre information.
- Uses referential integrity to ensure books reference existing genres.
- Makes it easier to update or manage genres independently.

## Relational Databases vs Document Databases

In a relational database such as PostgreSQL, data is organized into separate tables connected through relationships and foreign keys.

In a document database, related information can instead be embedded inside a document or connected through references.

For this library system, a relational database is suitable because books and genres have a clear relationship, and separating them reduces data duplication.

## Database Seeding

The Prisma seed script creates:

- 4 genres.
- 16 books distributed across the genres.

To run the seed script:

```bash
npx prisma db seed
```

## Running the Application

Navigate to the API folder:

```bash
cd api
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start:dev
```

## Environment Variables

Create an `.env` file inside the `api` directory and configure your PostgreSQL connection using `DATABASE_URL`.

Never commit your actual `.env` file or database credentials.

## Project Structure

The backend implementation is located in the `api/` directory.

- `api/prisma/schema.prisma` - Defines the database models, Role enum, and relationships.
- `api/prisma/seed.ts` - Seeds the database with 4 genres and 16 books.
- `api/src/prisma/prisma.service.ts` - Manages the Prisma database connection in NestJS.
- `api/.env.example` - Provides a placeholder for the PostgreSQL DATABASE_URL.
