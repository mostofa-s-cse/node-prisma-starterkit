# Node.js Authentication API

A Node.js server built using **Express.js**, **PostgreSQL**, and **Prisma ORM**, following the **MVC architecture**. This project includes user authentication with **email verification**, **OTP**, **JWT access tokens**, and **refresh tokens**, along with robust error handling.

## Features

- User Registration with OTP email verification
- Secure Login with hashed passwords
- Token-based authentication (Access and Refresh tokens)
- Resend OTP functionality
- Middleware for route protection
- Scalable and modular MVC architecture
- Error handling with centralized middleware
- errorLogger
- API Version control

---

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Prisma ORM**: Database access
- **PostgreSQL**: Database
- **JWT**: Token-based authentication
- **Nodemailer**: Email services
- **bcrypt**: Password hashing

---

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- PostgreSQL installed and running

### Installation

1. Clone the repository HTTPS:
   >git clone https://github.com/mostofa-s-cse/node-express-prisma-boilerplate.git

   >cd node-express-prisma-boilerplate

- ### Or

- Clone the repository SSH:

  > git clone git@github.com:mostofa-s-cse/node-express-prisma-boilerplate.git

  > cd node-express-prisma-boilerplate
- Git Branch Change
  > git checkout database-postgresql
  
2. Install dependencies:
   >npm install 
- ### or
  > yarn install

3. Set up environment variables
    ```bash
      SERVER_URL=http://localhost
      PORT=5000
      DATABASE_URL=postgresql://root:password@localhost:5432
      JWT_SECRET=
      JWT_REFRESH_SECRET=
      EMAIL_USER=demo@gmail.com
      EMAIL_PASSWORD=cxbdtxtqkbdbkjkw

Make sure you replace your_jwt_secret, your_refresh_token_secret, your_postgres_connection_url, and other placeholders with your actual values.

4. Set up the PostgreSQL Database with Prisma
   1. Install the Prisma CLI:
   >npm install @prisma/cli
   
   2.Run Prisma migrations to create the database schema:
   >npx prisma migrate dev --name init

This will create the database tables based on the Prisma schema.

5. Run the Application
   ```bash
   npm run dev
   
## API Endpoints
### Version 1
Base URL: http://localhost:5000/api/v1
1. Register a New User
- Endpoint: POST /auth/register
- Request Body:

   ```json
   {
    "name":"example",
    "email": "example@gmail.com",
    "password": "password123"
   }
- Response:
   ```json
   {
    "success": true,
    "data": {
        "message": "User registered successfully. Please verify your email."
    }


2. Verify User Email
- Endpoint: POST /auth/verify
- Request Body:

   ```json
   {
      "email": "user@example.com",
      "otp":"254627"
   }
- Response:
   ```json
   {
      "success": true,
      "message": "Email verified successfully."
   }

3. Resend OTP
- Endpoint: POST /auth/resend-otp
- Request Body:

   ```json
   {
      "email": "user@example.com"
   }
  
- Response:
   ```json
   {
    "success": true,
    "data": {
        "message": "OTP sent successfully. Please check your email."
    }
   }

4. User Login
- Endpoint: POST /auth/login
- Request Body
   ```json
   {
      "email": "user@example.com",
      "password": "password123"
   }
- Response:
   ```json
   {
   "success": true,
    "data": { 
        "accessToken": "new_access_token_here",
        "refreshToken": "new_refresh_token_here"
    }
   }

5. Refresh Token
- Endpoint: POST /auth/refresh
- Request Body
   ```json
   {
       "refreshToken": "your_refresh_token_here"
   }
- Response:
   ```json
   {
    "success": true,
    "data": {
        "accessToken": "new_access_token_here",
        "refreshToken": "new_refresh_token_here"
    }
   }