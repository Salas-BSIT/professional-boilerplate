# Professional Boilerplate API

A RESTful backend starter project built with **Node.js, Express 5,
TypeScript, TypeORM, and MySQL**. It provides a structured foundation
for managing user records through validated HTTP endpoints, with
database migrations, seed data, centralized error handling, request
logging, and basic security middleware.

## 1. Project Description

Professional Boilerplate API is a TypeScript-based REST API designed to
provide a maintainable starting point for backend application
development. It separates routes, controllers, services, entities,
middleware, and utility functions so that application logic is organized
and easier to extend.

The current implementation focuses on user management. It connects to a
MySQL database through TypeORM and uses migrations to manage database
schema changes. Joi validates incoming request data, while bcrypt hashes
passwords before they are stored.

> **Current scope:** The project includes user CRUD operations and a
> health-check endpoint. Authentication and authorization endpoints are
> not currently implemented.

## 2. Features

-   **User management:** Create, retrieve, update, and delete user
    records.
-   **MySQL integration:** Uses TypeORM to connect to and query a MySQL
    database.
-   **Database migrations:** Maintains database schema changes without
    relying on automatic schema synchronization.
-   **Seed data:** Includes sample administrator and test-user records.
-   **Request validation:** Uses Joi schemas to validate user data,
    route parameters, and pagination query parameters.
-   **Password hashing:** Uses bcrypt to hash passwords before saving
    them.
-   **Centralized error handling:** Returns consistent JSON error
    responses for validation, missing-resource, conflict, and server
    errors.
-   **Pagination and sorting:** Supports paginated user listings with
    selectable sort fields and sort order.
-   **Security middleware:** Uses Helmet, CORS configuration, and rate
    limiting.
-   **Request logging:** Records request details, response status, and
    request duration with Winston.
-   **Health check:** Provides an endpoint that checks application
    uptime and database connectivity.
-   **Graceful shutdown:** Closes the HTTP server and database
    connection when the process receives a shutdown signal.

## 3. Technology Stack

  Technology              Purpose
  ----------------------- ------------------------------------------
  Node.js                 JavaScript runtime
  Express 5               HTTP server and routing
  TypeScript              Static typing
  TypeORM                 Object-relational mapping and migrations
  MySQL / mysql2          Relational database
  Joi                     Request and environment validation
  bcrypt                  Password hashing
  Helmet                  HTTP security headers
  CORS                    Cross-origin request configuration
  express-rate-limit      API request rate limiting
  Winston                 Application and request logging
  dotenv                  Environment variable loading
  ts-node / ts-node-dev   TypeScript execution during development

## 4. Project Structure

``` text
professional-boilerplate/
├── src/
│   ├── config/          # Environment and database configuration
│   ├── controllers/     # HTTP request handlers
│   ├── dto/             # Joi validation schemas
│   ├── entities/        # TypeORM entities
│   ├── middleware/      # Validation, security, logging, error handling
│   ├── migrations/      # Database migration files
│   ├── routes/          # API route definitions
│   ├── seeds/           # Database seed scripts
│   ├── services/        # Business logic and database operations
│   ├── utils/           # Errors, logging, response helpers
│   └── index.ts         # Application entry point
├── tests/
│   ├── integration/
│   └── unit/
├── .env.example
├── package.json
└── tsconfig.json
```

## 5. Setup Instructions

### Prerequisites

Install the following before running the project:

-   Node.js and npm
-   MySQL Server
-   A MySQL client such as MySQL Workbench or phpMyAdmin
-   Git (optional)

### Step 1: Install dependencies

Open a terminal in the project directory and run:

``` bash
npm install
```

### Step 2: Create the database

Create the database in MySQL:

``` sql
CREATE DATABASE boilerplate_db;
```

### Step 3: Configure environment variables

Copy `.env.example` to a new file named `.env`:

``` bash
cp .env.example .env
```

On Windows PowerShell, you can use:

``` powershell
Copy-Item .env.example .env
```

Open `.env` and enter the settings for your local MySQL installation.
Make sure `DB_PASSWORD` is set to the MySQL password; the application's
environment validation requires this variable.

### Step 4: Run database migrations

Apply the migrations to create the required tables. See the migration
instructions below.

### Step 5: Start the development server

``` bash
npm run dev
```

The API uses the port configured by `PORT` (3000 by default). The
health-check endpoint is:

``` text
http://localhost:3000/health
```

### Step 6: Build and run the production version

``` bash
npm run build
npm start
```

The build output is placed in the `dist/` directory.

## 6. Environment Variables

Create a `.env` file in the project root. Do not commit this file or
publish real database credentials.

  ---------------------------------------------------------------------------------
  Variable                      Required Default / Example         Description
  ---------------- --------------------- ------------------------- ----------------
  `NODE_ENV`                          No `development`             Application
                                                                   environment:
                                                                   `development`,
                                                                   `production`, or
                                                                   `test`.

  `PORT`                              No `3000`                    Port used by the
                                                                   Express server.

  `DB_HOST`                          Yes `localhost`               MySQL server
                                                                   hostname.

  `DB_PORT`                           No `3306`                    MySQL server
                                                                   port.

  `DB_USERNAME`                      Yes `root`                    MySQL username.

  `DB_PASSWORD`                      Yes Your local MySQL password MySQL password.
                                                                   The Joi schema
                                                                   requires a
                                                                   non-empty value.

  `DB_DATABASE`                      Yes `boilerplate_db`          Name of the
                                                                   database used by
                                                                   the application.

  `FRONTEND_URL`                      No `http://localhost:4200`   Allowed frontend
                                                                   origin for CORS.
  ---------------------------------------------------------------------------------

Example local configuration:

``` env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=boilerplate_db

FRONTEND_URL=http://localhost:4200
```

Replace the example password with your own local database password. Keep
`.env` private.

## 7. API Documentation

### Base URL

``` text
http://localhost:3000
```

### Response format

Successful responses generally use a JSON structure containing `success`
and `data`. Paginated responses also include `meta`.

Example:

``` json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example User",
    "email": "user@example.com"
  }
}
```

Errors use a structure similar to:

``` json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 25 not found"
  }
}
```

### Health Check

  -----------------------------------------------------------------------
  Method                  Endpoint                Description
  ----------------------- ----------------------- -----------------------
  `GET`                   `/health`               Checks application
                                                  uptime and database
                                                  connectivity.

  -----------------------------------------------------------------------

A successful response returns status `200` and reports the database as
`connected`. If the database check fails, the endpoint returns
`503 Service Unavailable`.

### User Endpoints

All user endpoints are under `/api/users`.

  --------------------------------------------------------------------------
  Method           Endpoint           Description             Success status
  ---------------- ------------------ ---------------- ---------------------
  `GET`            `/api/users`       Retrieves a                   `200 OK`
                                      paginated list   
                                      of users.        

  `GET`            `/api/users/:id`   Retrieves one                 `200 OK`
                                      user by ID.      

  `POST`           `/api/users`       Creates a user.          `201 Created`

  `PUT`            `/api/users/:id`   Updates the                   `200 OK`
                                      supplied user    
                                      fields.          

  `DELETE`         `/api/users/:id`   Deletes a user.       `204 No Content`
  --------------------------------------------------------------------------

#### GET /api/users

Optional query parameters:

  Parameter         Default Allowed values / Description
  ----------- ------------- -----------------------------------------------
  `page`                `1` Integer greater than or equal to 1.
  `limit`              `10` Integer from 1 to 100.
  `sort`        `createdAt` `createdAt`, `updatedAt`, `name`, or `email`.
  `order`            `DESC` `ASC` or `DESC`.

Example:

``` text
GET /api/users?page=1&limit=10&sort=name&order=ASC
```

The response includes `data` and pagination metadata: `total`, `page`,
`limit`, `totalPages`, `hasNextPage`, and `hasPrevPage`.

#### GET /api/users/:id

Example:

``` text
GET /api/users/1
```

Returns the matching user, or a `404 Not Found` error if the user does
not exist.

#### POST /api/users

Example request body:

``` json
{
  "name": "Jamie Santos",
  "email": "jamie@example.com",
  "password": "Jamie1234",
  "age": 21
}
```

Validation rules:

-   `name` is required and must contain 2--100 characters.
-   `email` is required and must be a valid email address.
-   `password` is required, must contain 8--50 characters, and must
    include at least one letter and one number.
-   `age` is optional and, when supplied, must be an integer from 13 to
    120.

The password is hashed using bcrypt before it is stored. The API does
not return the password in the normal user response. An existing email
produces a conflict response.

#### PUT /api/users/:id

Example:

``` text
PUT /api/users/1
```

Example request body:

``` json
{
  "name": "Jamie Santos Updated",
  "email": "jamie.updated@example.com",
  "age": 22,
  "isActive": true
}
```

At least one update field must be supplied. Supported fields are `name`,
`email`, `age`, and `isActive`. The route is named `PUT`, but the
validation schema permits partial updates.

#### DELETE /api/users/:id

Example:

``` text
DELETE /api/users/1
```

Deletes the specified user and returns `204 No Content` when successful.

### Common Error Responses

  --------------------------------------------------------------------------
                   HTTP status Error code / condition  Meaning
  ---------------------------- ----------------------- ---------------------
                         `400` `VALIDATION_ERROR`      Request data did not
                                                       pass validation.

                         `400` `INVALID_JSON`          Request body contains
                                                       invalid JSON.

                         `404` `NOT_FOUND`             The requested user
                                                       does not exist.

                         `404` `ROUTE_NOT_FOUND`       The requested API
                                                       route does not exist.

                         `409` `CONFLICT`              A user with the same
                                                       email already exists.

                         `429` `RATE_LIMIT_EXCEEDED`   The API rate limit
                                                       was exceeded.

                         `500` `INTERNAL_ERROR`        An unexpected server
                                                       error occurred.

                         `503` `SERVICE_UNAVAILABLE`   The health check
                                                       could not reach the
                                                       database.
  --------------------------------------------------------------------------

The API rate limiter allows up to 100 requests per 15-minute window.
Detailed stack traces are included in error responses only when
`NODE_ENV=development`.

> **Authentication note:** The project currently does not implement
> login, JWT issuance, or protected routes. The presence of an
> `Authorization` CORS header does not mean authentication is
> implemented.

## 8. Database Migrations

The project uses TypeORM migrations and has `synchronize: false` in its
DataSource configuration. This means schema changes must be applied
through migrations.

### Generate a migration

After changing an entity, generate a migration with a name and output
path:

``` bash
npm run typeorm -- migration:generate src/migrations/DescribeYourChange -d src/config/data-source.ts
```

Example for an initial schema:

``` bash
npm run typeorm -- migration:generate src/migrations/InitialSchema -d src/config/data-source.ts
```

### Run migrations

``` bash
npm run migration:run
```

Alternatively:

``` bash
npm run typeorm -- migration:run -d src/config/data-source.ts
```

### Revert the most recent migration

``` bash
npm run migration:revert
```

Review generated migration files before running them, especially when
the database contains data. Back up important data before applying
schema changes.

## 9. Database Seeders

The project includes a user seeder that inserts two sample accounts if
their email addresses do not already exist.

Run the seeder after the database and `users` table have been created:

``` bash
npm run seed
```

The current sample records are:

  Name         Email
  ------------ ---------------------
  Admin User   `admin@example.com`
  Test User    `test@example.com`

The seeder source currently hashes these sample passwords with bcrypt:

-   Admin sample password: `Admin123!`
-   Test sample password: `Test123!`

These are development-only sample credentials. Change or remove them
before using the project in a shared or production environment. The
current project does not provide an authentication endpoint for logging
in with these accounts.

## 10. Reflection Answers

The following are sample first-person reflections based on the features
and implementation in this project. Review them and adjust them so they
accurately represent your own experience.

### 1. What did you learn from developing this project?

I learned how to organize a backend application using TypeScript,
Express, and TypeORM. I also learned how routes, controllers, services,
entities, and middleware work together to handle API requests. Working
with MySQL migrations helped me understand how to create and update
database tables in a controlled way.

### 2. What challenges did you encounter, and how did you solve them?

One challenge was configuring the database and making sure the required
tables existed. I encountered errors involving a missing `users` table
and a duplicate email index during migration. I learned to check the
entity configuration, review generated migration files, and run
migrations using the correct TypeORM command. I also encountered an
Express 5 validation issue because `req.query` cannot be assigned
directly, which taught me to handle validated query data separately.

### 3. What would you improve if you continued developing the project?

I would add authentication and authorization using a secure login flow
and role-based access control. I would also improve automated unit and
integration tests, add API documentation such as Swagger, and review the
validation middleware so controllers consistently use the validated
values. I would further improve deployment configuration, database
backup practices, and production logging.

### 4. Why are migrations and validation important?

Migrations make database changes repeatable and easier to track across
development environments. Validation helps prevent invalid or incomplete
data from entering the application. Together, they improve reliability
and make the API easier to maintain.

## 11. Current Limitations

-   Only user-management endpoints and a health-check endpoint are
    currently implemented.
-   Login, registration authentication tokens, and authorization checks
    are not implemented.
-   The project contains unit and integration test folders, but this
    package configuration does not define test scripts.
-   The seeder uses fixed sample accounts and development passwords;
    replace these before deployment.
-   The current update route uses `PUT`, although its schema accepts
    partial updates.

## 12. License and Usage

The package is marked as private in `package.json`. Review the project's
ownership and distribution requirements before publishing or reusing it.
