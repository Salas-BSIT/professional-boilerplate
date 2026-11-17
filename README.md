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

  ------------------------------------------------------------------------------
  Variable                   Required Default / Example         Description
  ---------------- ------------------ ------------------------- ----------------
  `NODE_ENV`                       No `development`             Application
                                                                environment:
                                                                `development`,
                                                                `production`, or
                                                                `test`.

  `PORT`                           No `3000`                    Port used by the
                                                                Express server.

  `DB_HOST`                       Yes `localhost`               MySQL server
                                                                hostname.

  `DB_PORT`                        No `3306`                    MySQL server
                                                                port.

  `DB_USERNAME`                   Yes `root`                    MySQL username.

  `DB_PASSWORD`                   Yes Your local MySQL password MySQL password.
                                                                The Joi schema
                                                                requires a
                                                                non-empty value.

  `DB_DATABASE`                   Yes `boilerplate_db`          Name of the
                                                                database used by
                                                                the application.

  `FRONTEND_URL`                   No `http://localhost:4200`   Allowed frontend
                                                                origin for CORS.
  ------------------------------------------------------------------------------

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

  -----------------------------------------------------------------------
  Method          Endpoint           Description           Success status
  --------------- ------------------ --------------- --------------------
  `GET`           `/api/users`       Retrieves a                 `200 OK`
                                     paginated list  
                                     of users.       

  `GET`           `/api/users/:id`   Retrieves one               `200 OK`
                                     user by ID.     

  `POST`          `/api/users`       Creates a user.        `201 Created`

  `PUT`           `/api/users/:id`   Updates the                 `200 OK`
                                     supplied user   
                                     fields.         

  `DELETE`        `/api/users/:id`   Deletes a user.     `204 No Content`
  -----------------------------------------------------------------------

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

  ------------------------------------------------------------------------
                 HTTP status Error code / condition  Meaning
  -------------------------- ----------------------- ---------------------
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
  ------------------------------------------------------------------------

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

### ==================================Reflection Questions=================================

### 1. What was the most challenging part of building this boilerplate? How did you overcome it?

The most challenging part was connecting the application to MySQL and
making sure the database schema matched the TypeORM entities. I
encountered problems such as the missing `users` table, the TypeORM
migration command syntax, and a duplicate unique index on the email
column. I worked through these issues by checking the DataSource
configuration, reviewing the `User` entity and generated migration,
correcting the duplicate index definition, and running the migration
again. These problems helped me understand how the application, ORM, and
database work together.

### 2. How does this boilerplate differ from your Midterm project? What specific improvements did you make?

Compared with my Midterm project, which focused more on planning and
designing API resources and endpoints, this boilerplate provides a more
complete and reusable backend structure. I organized the application
into routes, controllers, services, entities, and middleware. I also
added or integrated request validation with Joi, centralized error
handling, TypeORM migrations, password hashing, pagination, security
middleware, and structured logging with Winston. These improvements make
the code easier to maintain, test, and extend when adding more features.

### 3. Why is centralized error handling better than try-catch in every controller?

Centralized error handling keeps error responses consistent and avoids
repeating the same response logic in every controller. Controllers can
focus on handling requests and application logic, while the
error-handling middleware processes errors in one place. This makes the
code cleaner and easier to maintain. It also provides one place to log
errors and control which details are returned to clients. Try-catch is
still useful when a controller needs to handle a particular error
locally or recover from it.

### 4. How does request validation with Joi improve security and code quality?

Joi checks incoming request data before the application uses it. It can
verify required fields, data types, string lengths, email formats, and
allowed values. This helps reject malformed or unexpected input early,
reduces avoidable errors, and keeps invalid data from reaching business
logic or the database. Validation is one layer of protection; it does
not replace authorization, safe database queries, password hashing, or
other security controls.

### 5. What's the difference between `synchronize: true` and migrations? Why are migrations essential for production?

With `synchronize: true`, TypeORM automatically tries to make the
database schema match the entities when the application starts. This can
be convenient during local development, but automatic schema changes can
be risky when a production database already contains important data.

Migrations describe specific database changes in versioned files. They
can be reviewed, applied in a controlled order, and tracked across
different environments. Migrations are essential for production because
they make schema updates predictable, repeatable, and easier to review,
while reducing the risk of unexpected changes to existing data. This
project uses `synchronize: false` and manages schema changes through
migrations.

### 6. How does structured logging (Winston) help in production debugging compared to `console.log`?

Winston provides configurable log levels and a consistent structure for
recording information such as timestamps, messages, and error details.
Logs can be directed to files or other configured transports, making
them easier to organize and review. This helps developers identify when
an error happened and understand the request or operation involved.
`console.log` is useful for quick local debugging, but it does not
provide the same built-in logging levels, formatting, and transport
configuration.

### 7. If you had to add a new feature (e.g., Product CRUD), how would you use this boilerplate? What would you need to add?

I would follow the same structure already used for users. First, I would
create a `Product` entity with fields such as `id`, `name`,
`description`, and `price`. Next, I would create Joi schemas to validate
product creation, updates, and route parameters. I would add a product
service for database operations, a product controller for handling HTTP
requests, and product routes for the CRUD endpoints. I would then
register the entity in the TypeORM DataSource, generate and run a
migration, and add tests for the new endpoints. Finally, I would
document the Product API endpoints in the README. If products needed
categories or images, I would add the related entities or storage
integration as separate parts of the feature.

### 8. What additional features would you add to make this boilerplate even more production-ready?

I would add a complete authentication and authorization system, such as
secure login with appropriately managed access tokens and role-based
permissions. I would also add more unit and integration tests, API
documentation with Swagger/OpenAPI, and automated testing and deployment
through a CI/CD pipeline. For production operations, I would improve log
storage and monitoring, add database backup and recovery procedures,
strengthen environment and secrets management, and configure deployment
behind HTTPS. I would also review rate limits, input validation, and
database indexes based on the application's expected usage.

