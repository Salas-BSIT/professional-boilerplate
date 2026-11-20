
# JWT Secret code:
1689187dd6d00e773b728b529a5e58c7eac0b04a3a312ffe007edd338be4efb228107bbd4870287de645551df736145241b898677822e3e39a182e31cb0a3d67


# Professional Boilerplate API

## 1. Project Description

The Professional Boilerplate API is a RESTful API built using Node.js, Express, TypeScript, and MySQL. It provides user management features and secure authentication using JSON Web Tokens (JWT).

### Features
- User registration and management
- User login using email and password
- JWT-based authentication
- Protected API endpoints
- Password hashing using bcrypt
- Input validation using Joi
- Database management using TypeORM
- Standardized error responses
- Request logging and security middleware

## 2. Authentication Flow

The API uses JWT to authenticate users.

1. A user registers an account.
2. The user logs in using their email and password.
3. The server checks the account credentials.
4. If valid, the server generates a JWT.
5. The user includes the token in requests to protected endpoints.
6. The authentication middleware verifies the token before allowing access.

## 3. How to Get a Token

Send a POST request to:

`http://localhost:3000/api/auth/login`

Request body:

```json
{
  "email": "test@example.com",
  "password": "Test123!"
}
```

If the credentials are correct, the server returns a response containing the JWT token and user information.

## 4. How to Use the Token

For protected endpoints, include the token in the Authorization header.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

`GET http://localhost:3000/api/users`

Without a valid token, the server returns:

- Status: 401 Unauthorized
- Error: UNAUTHORIZED
- Message: No token provided

## 5. API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check server and database status |
| POST | `/api/users` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |

### Protected Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Retrieve all users |
| GET | `/api/auth/me` | Retrieve authenticated user information |

**Note:** The user collection endpoint is protected in the tested configuration. Other user CRUD endpoints should also have authentication middleware added if they are intended to be protected.

### Additional User Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/:id` | Retrieve a user by ID |
| PUT | `/api/users/:id` | Update user information |
| DELETE | `/api/users/:id` | Delete a user |

## 6. Installation and Setup

1. Clone or download the project.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`.
4. Configure your MySQL database and JWT settings.
5. Run database migrations:

```bash
npm run migration:run
```

6. Start the development server:

```bash
npm run dev
```

7. Build the project:

```bash
npm run build
```

The API will run at:

`http://localhost:3000`

## 7. Environment Variables

| Variable | Description |
|---|---|
| NODE_ENV | Application environment |
| PORT | Server port |
| DB_HOST | Database host |
| DB_PORT | Database port |
| DB_USERNAME | Database username |
| DB_PASSWORD | Database password |
| DB_DATABASE | Database name |
| JWT_SECRET | Secret key used to sign JWTs |
| JWT_EXPIRES_IN | Token expiration time |
| FRONTEND_URL | Frontend application URL |

## 8. Reflection Questions

### 1. What is the difference between authentication and authorization?

Authentication verifies who the user is, while authorization determines what the user is allowed to access. For example, logging in verifies a user's identity, while allowing an administrator to manage users is authorization.

### 2. Why is JWT considered stateless?

JWT is stateless because the server can verify the token without storing a session for every user. This makes it easier to handle multiple requests and scale an application.

### 3. What are the three parts of a JWT token?

- Header – Contains the token type and signing algorithm.
- Payload – Contains information about the user.
- Signature – Verifies that the token has not been changed.

### 4. Why should sensitive data never be stored in a JWT payload?

JWT payloads can be decoded by anyone who has the token. Sensitive information such as passwords should never be included because it may be exposed.

### 5. How does bcrypt protect user passwords?

Bcrypt protects passwords by converting them into secure hashes. A salt adds randomness to each password hash, while rounds control the computational cost of hashing and make password guessing more difficult.

### 6. What happens if someone steals a JWT token?

Someone who steals a valid JWT may access protected endpoints as the user. This risk can be reduced by using HTTPS, keeping tokens secure, and setting expiration times.

### 7. Why is HTTPS important when transmitting JWT tokens?

HTTPS encrypts communication between the client and server. It helps prevent attackers from intercepting authentication tokens.

### 8. What is the difference between an access token and a refresh token?

An access token is short-lived and is used to access protected resources. A refresh token lasts longer and can be used to obtain a new access token. This project currently uses an access token without a refresh-token feature.

### 9. How does the authentication middleware know which user is making the request?

The middleware extracts the JWT from the Authorization header and verifies its signature. It then reads the user ID and email from the token payload.

### 10. How would you implement role-based authorization?

I would add a role field to the user entity, such as admin or regular user. I would then create authorization middleware to check the user's role before allowing access to specific endpoints.