# Node.js API Project

A modern Node.js API project with Redis caching, optional database support, and Docker containerization.

## Features

- 🚀 Fast and scalable Node.js API
- 🔄 Redis caching for improved performance
- 🐳 Docker containerization
- 📦 Database support (MySQL/PostgreSQL)
- 🔒 Secure authentication
- 📝 API documentation
- 📊 Logging system
- 🔍 Request caching middleware
- 📤 File upload support

## Technologies Used

- **Backend Framework**: Node.js
- **Runtime**: Node.js 18 (LTS)
- **Caching**: Redis
- **Database Options**: 
  - MySQL 8.0
  - PostgreSQL 14
- **Containerization**: Docker & Docker Compose
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **ORM**: Prisma

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or higher
- npm or yarn
- Git

## Installation

### Using npm

```bash
npm install nodejs-api-starter
```

### Using yarn

```bash
yarn add nodejs-api-starter
```

### Using pnpm

```bash
pnpm add nodejs-api-starter
```

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables as needed

4. Generate secret key
```bash
npm run generate-secret
```
5. Start the application:

Using Docker (recommended):
```bash
docker-compose up
```

Without Docker:
```bash
npm run dev
```

## API Endpoints

## 🔐 Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "firstName":"Mostofa",
    "lastName":"Shahid",
    "email": "mostofa.s.cse@gmail.com",
    "password": "password123"
}

```

Response:
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "message": "Registration successful. Please verify your email."
    }
}
```

#### Verify User
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
	 "email": "mostofa.s.cse@gmail.com",
   "otp":"457897"
}

```

Response:
```json
{
    "success": true,
    "message": "Email verified successfully",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZWMzYWUyLTRjZDktNDhkNC1hNjY4LWY0YTUyZTJjZTNhOSIsImlhdCI6MTc0NzgzOTk5OSwiZXhwIjoxNzQ3ODQwODk5fQ.MNgggobQcV_lAt9LRYXGgwXCj7LQpj_u3hXkKjCaf4E",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZWMzYWUyLTRjZDktNDhkNC1hNjY4LWY0YTUyZTJjZTNhOSIsImlhdCI6MTc0NzgzOTk5OSwiZXhwIjoxNzQ4NDQ0Nzk5fQ.zzZ1AP6stVlCWT1xgZ31_hoUbCag0gGiXvbyj6yX4nc"
    }
}
```
#### Resend otp
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
	 "email": "mostofa.s.cse@gmail.com"
}

```

Response:
```json
{
    "success": true,
    "message": "OTP sent successfully",
    "data": {
        "message": "New OTP sent successfully"
    }
}
```



#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "mostofa.s.cse@gmail.com",
    "password": "password123"
}
```

Response:
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "f3ec3ae2-4cd9-48d4-a668-f4a52e2ce3a9",
            "email": "mostofa.s.cse@gmail.com",
            "firstName": "Mostofa",
            "lastName": "Shahid",
            "roles": [],
            "permissions": []
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZWMzYWUyLTRjZDktNDhkNC1hNjY4LWY0YTUyZTJjZTNhOSIsImlhdCI6MTc0Nzg0MDIxNywiZXhwIjoxNzQ3ODQxMTE3fQ.DTGFn_5tbnxCBDKf7YhBM_Dg-SlD-7S471I07FIOBW8",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZWMzYWUyLTRjZDktNDhkNC1hNjY4LWY0YTUyZTJjZTNhOSIsImlhdCI6MTc0Nzg0MDIxNywiZXhwIjoxNzQ4NDQ1MDE3fQ.gq6dw6_T6ZI7BMlwy9gC-NXm33099FQcNnYzem49_ik"
    }
}
```

#### Auth user 
```http
GET /api/auth/auth-user
Authorization: Bearer <token>
```

Response:
```json
{
    "success": true,
    "message": "Auth user fetched successfully",
    "data": {
        "id": "f3ec3ae2-4cd9-48d4-a668-f4a52e2ce3a9",
        "email": "mostofa.s.cse@gmail.com",
        "firstName": "Mostofa",
        "lastName": "Shahid",
        "isVerified": true,
        "roles": [],
        "permissions": []
    }
}
```

#### Logout user 
```http
POST /api/auth/logout
Authorization: Bearer <token>
X-Refresh-Token <refreshToken>
```

Response:
```json
{
    "success": true,
    "message": "Logout successful",
    "data": {
        "message": "Logged out successfully",
        "userId": "f3ec3ae2-4cd9-48d4-a668-f4a52e2ce3a9"
    }
}
```
#### Forgot Password
```http
GET /api/auth/auth-user
Content-Type: application/json
```
{
    "email": "mostofa.s.cse@gmail.com"
}

Response:
```json
{
    "success": true,
    "message": "Password reset code sent successfully",
    "data": {
        "message": "Password reset code sent to your email"
    }
}
```

#### Reset password
```http
GET /api/auth/reset-password
Content-Type: application/json
```
{
  "email": "mostofa.s.cse@gmail.com",
  "otp": "715627",
  "newPassword": "newpassword123"
}

Response:
```json
{
    "success": true,
    "message": "Password reset successful",
    "data": {
        "message": "Password reset successful"
    }
}
```
## 👤 User Management

#### Create user
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json
```

{
    "firstName":"Mostofa488",
    "lastName":"Shahid",
    "email": "mostofa.s.cse2@gmail.com",
    "password": "password123",
    "isVerified": true
}

Response:
```json
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "id": "8a069e41-6be5-459c-8f09-2982ea575ee4",
        "email": "mostofa.s.cse2@gmail.com",
        "firstName": "Mostofa488",
        "lastName": "Shahid",
        "profileImage": null,
        "isVerified": false,
        "otp": null,
        "otpExpiry": null,
        "googleId": null,
        "refreshToken": null,
        "createdAt": "2025-05-21T15:22:42.063Z",
        "updatedAt": "2025-05-21T15:22:42.063Z",
        "roles": []
    }
}
```


#### Get user
```http
Get /api/users
Authorization: Bearer <token>
Content-Type: application/json
```

Response:
```json
{
    "success": true,
    "message": "Users retrieved successfully",
    "users": [
        {
            "id": "8a069e41-6be5-459c-8f09-2982ea575ee4",
            "email": "mostofa.s.cse2@gmail.com",
            "firstName": "Mostofa488",
            "lastName": "Shahid",
            "profileImage": null,
            "isVerified": false,
            "otp": null,
            "otpExpiry": null,
            "googleId": null,
            "refreshToken": null,
            "createdAt": "2025-05-21T15:22:42.063Z",
            "updatedAt": "2025-05-21T15:22:42.063Z",
            "roles": []
        },
        {
            "id": "f3ec3ae2-4cd9-48d4-a668-f4a52e2ce3a9",
            "email": "mostofa.s.cse@gmail.com",
            "firstName": "Mostofa",
            "lastName": "Shahid",
            "profileImage": null,
            "isVerified": true,
            "otp": null,
            "otpExpiry": null,
            "googleId": null,
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZWMzYWUyLTRjZDktNDhkNC1hNjY4LWY0YTUyZTJjZTNhOSIsImlhdCI6MTc0Nzg0MDkzMiwiZXhwIjoxNzQ4NDQ1NzMyfQ.w5RjrsNHmQj0_CPM8ugEmQ3tloWAt5zBfawW7VKTCKU",
            "createdAt": "2025-05-21T15:05:40.515Z",
            "updatedAt": "2025-05-21T15:22:12.283Z",
            "roles": []
        }
}
```

#### Search users
```http
GET /api/users/search?query=shahid
Authorization: Bearer <token>
Content-Type: application/json

```

Response:
```json
{
    "success": true,
    "message": "Users search completed",
    "users": [
        {
            "id": "8a069e41-6be5-459c-8f09-2982ea575ee4",
            "email": "mostofa.s.cse2@gmail.com",
            "firstName": "Mostofa488",
            "lastName": "Shahid",
            "profileImage": null,
            "isVerified": false,
            "otp": null,
            "otpExpiry": null,
            "googleId": null,
            "refreshToken": null,
            "createdAt": "2025-05-21T15:22:42.063Z",
            "updatedAt": "2025-05-21T15:22:42.063Z",
            "roles": []
        }
      }
```

#### Update Profile
```http
PATCH /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

```
{
    "firstName": "Updated Name",
    "lastName": "Shahid"
}

Response:
```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "id": "a8f74ccb-30ae-4f92-bd07-25989687121a",
        "email": "hello@gmail.com",
        "firstName": "Updated Name",
        "lastName": "Shahid",
        "profileImage": "/uploads/profiles/profiles-1747805451521-289763896.png",
        "isVerified": false,
        "otp": null,
        "otpExpiry": null,
        "googleId": null,
        "refreshToken": null,
        "createdAt": "2025-05-21T05:27:59.522Z",
        "updatedAt": "2025-05-21T15:27:36.588Z",
        "roles": []
    }
}
```

#### Delete user
```http
DELETE /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json
```
Response:
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```



## 🔐 Role Management

### Create role
```
POST /api/roles
Authorization: Bearer <token>
```
**Request:**
```json
{
  "name": "admin",
  "description": "Administrator with full access"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": { ... }
}
```

### Get roles
```
GET /api/roles
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "roles": [ ... ]
}
```

### Update role
```
PATCH /api/roles/:id
Authorization: Bearer <token>
```
**Request:**
```json
{
  "name": "superadmin",
  "description": "Super Admin with all permissions"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": { ... }
}
```

### Delete role
```
DELETE /api/roles/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

---

## 🛡️ Permission Management

### Create permission
```
POST /api/permissions
Authorization: Bearer <token>
```
**Request:**
```json
{
  "name": "user.create",
  "description": "Permission to create a user"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": { ... }
}
```

### Get permissions
```
GET /api/permissions
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "permissions": [ ... ]
}
```

### Assign permissions to role
```
POST /api/roles/:roleId/permissions
Authorization: Bearer <token>
```
**Request:**
```json
{
  "permissions": ["user.create", "user.delete"]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Permissions assigned to role successfully"
}
```

---

## ⚙️ Queue Job Management

### Get all jobs
```
GET /api/jobs
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Jobs fetched successfully",
  "jobs": [ ... ]
}
```

### Retry failed job
```
POST /api/jobs/retry/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Job retried successfully"
}
```

### Delete job
```
DELETE /api/jobs/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```


## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"

# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL="mysql://root@localhost:3306/nodejs-db"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_ACCESS_SECRET="eeec88c117eb96d9a35f35085ac65cf671534aecf6469d856de22cb0aeeb4bcd"
JWT_REFRESH_SECRET="e5d2dad6b481594d749b87dd273dd54fe5ffe97f67db161a32bd72653c287753"
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mostofa.s.cse@gmail.com
SMTP_PASS=hmshwnqotajpwkgq


# Logging
LOG_LEVEL=debug
LOG_DIR=logs

# Security
BCRYPT_SALT_ROUNDS=12

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

```

## Docker Configuration

The project includes Docker configuration for easy deployment:

- `Dockerfile`: Main application container
- `docker-compose.yml`: Multi-container setup
- `redis.conf`: Redis configuration

To start all services:
```bash
docker-compose up
```

To stop all services:
```bash
docker-compose down
```

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the application
- `npm start`: Start production server
- `npm run test`: Run tests
- `npm run lint`: Run linter

### Code Structure

```
src/
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/        # Data models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Utility functions
└── app.ts         # Application entry point
└── server.ts      # Application entry point
```


## License

This project is licensed under the MIT License - see the LICENSE file for details.

