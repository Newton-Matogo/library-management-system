# Library Management System

A full-stack Library Management System built with **NestJS**, **React**, **Prisma ORM**, and **Supabase PostgreSQL**.

The application allows users to browse books, search by title or author, filter books by genre, and view detailed book information. It also provides authentication, role-based authorization, and book and genre management APIs.

## Technologies Used

### Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication
- bcrypt

### Frontend

- React
- Vite
- React Router
- CSS
- JavaScript

## Features

### Backend

- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Role-based authorization for PATRON and LIBRARIAN users.
- Genre CRUD operations.
- Book CRUD operations.
- Book search by title and author.
- Book filtering by genre.
- Pagination for book listings.
- DTO validation.

### Frontend

- Responsive book catalogue.
- Display of books from the backend API.
- Search books by title or author.
- Debounced live search.
- Filter books by genre.
- View detailed information about individual books.
- Loading, error, and empty states.
- Navigation using React Router.

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

To run the seed script from the API directory:

```bash
npx prisma db seed
```

## Project Structure

```text
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── books/
│   │   ├── genres/
│   │   └── prisma/
│   ├── .env.example
│   └── package.json
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookGrid.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/
│   │   │   ├── BookDetail.jsx
│   │   │   └── HomePage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## Environment Variables

### Backend

Create an `.env` file inside the `api/` directory.

Configure the following variables:

```env
DATABASE_URL="your_supabase_postgresql_connection_string"
JWT_SECRET="your_secret_key"
```

### Frontend

Create an `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Never commit actual `.env` files or database credentials.

## Running the Application

You need to run the backend and frontend in separate terminals.

### 1. Start the Backend

Open a terminal:

```bash
cd api
npm install
npm run start:dev
```

The backend runs at:

`http://localhost:3000`

### 2. Start the Frontend

Open another terminal from the project root:

```bash
cd client
npm install
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| POST   | `/auth/register` | Register a user |
| POST   | `/auth/login`    | Log in a user   |

### Genres

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| GET    | `/genres`     | Get all genres |
| GET    | `/genres/:id` | Get a genre    |
| POST   | `/genres`     | Create a genre |
| PATCH  | `/genres/:id` | Update a genre |
| DELETE | `/genres/:id` | Delete a genre |

### Books

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | `/books`     | Get books           |
| GET    | `/books/:id` | Get a specific book |
| POST   | `/books`     | Create a book       |
| PATCH  | `/books/:id` | Update a book       |
| DELETE | `/books/:id` | Delete a book       |

Book listing supports search, genre filtering, and pagination.

Book creation, updating, and deletion require librarian authorization.

## Testing

A Postman collection is provided in:

`docs/postman_collection.json`

Import the collection into Postman to test the backend API endpoints.

## Author

Library Management System - Full-Stack Development Project
