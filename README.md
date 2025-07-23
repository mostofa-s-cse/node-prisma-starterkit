# Node.js API Project

A modern Node.js API project with Redis caching, optional database support, and Docker containerization.

## Features

✅ Features

- 🚀 Fast and Scalable Node.js API — built with Express.js and optimized for performance.
- 🔒 Authentication System — secure login with JWT-based access control.
- 🔁 Forgot & Reset Password — email-based password recovery using secure tokens.
- 📧 SMTP with Gmail Integration — send transactional emails (e.g., password reset) using Google Mail SMTP.
- 📧 **Email Queue with Failure Tracking** — robust email queue system with automatic retry, failure tracking, and monitoring.
- 👤 User, Role & Permission Management — flexible RBAC (Role-Based Access Control) system to manage access and authorization.
- 📄 Pagination Support — simple and efficient pagination for listing large datasets.
- 🔄 Redis Caching — cache API responses and frequent queries for improved speed.
- 🐳 Docker Containerization — easy to deploy and scale in containerized environments.
- 📦 Database Support — works with MySQL and PostgreSQL using Prisma ORM.
- 📝 API Documentation — auto-generated Swagger/OpenAPI docs for all routes.
- 📊 Logging System — request and error logging with support for rotating logs.
- 🔍 Request Caching Middleware — intelligently caches specific routes to reduce database load.
- 📤 File Upload Support — handle file uploads with Multer or similar middleware.

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
npx node-prisma-starterkit
```

### Using yarn

```bash
yarn create node-prisma-starterkit
```

### Using pnpm

```bash
pnpx node-prisma-starterkit
```

1. Open project folder
```bash
cd node-prisma-starterkit
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

5. Run the migration
```bash
npx prisma migrate dev --name init
```
6. Start the application:

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

# with root password postgresql
# DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"

# with root password mysql
# DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database>"

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

#### Email Queue Management Scripts

- `npm run email:status`: Show email queue and failure status
- `npm run email:failures`: List email failures with pagination
- `npm run email:retry`: Retry all failed emails
- `npm run email:cleanup`: Clean up resolved failures (default: 30 days)
- `npm run email:scheduler`: Start automatic retry scheduler (default: 5 minutes)

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

## Email Queue System

The project includes a robust email queue system with comprehensive failure tracking and automatic retry capabilities.

### Features

- **Queue Management**: Uses Bull queue with Redis for reliable job processing
- **Failure Tracking**: All failed emails are tracked in the database with detailed error information
- **Automatic Retries**: Configurable exponential backoff retry mechanism
- **Scheduled Retries**: Automatic retry of failed emails at configurable intervals
- **Monitoring**: Real-time queue status and failure analytics
- **Manual Retry**: Ability to manually retry specific failed emails
- **Cleanup**: Automatic cleanup of resolved failures

### Database Schema

The system uses an `EmailFailure` model to track failed emails:

```sql
model EmailFailure {
  id          String   @id @default(uuid())
  jobId       String   @unique
  email       String
  subject     String
  message     String
  error       String   @db.Text
  attempts    Int      @default(0)
  maxAttempts Int      @default(5)
  lastAttempt DateTime @default(now())
  nextRetry   DateTime?
  isResolved  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### API Endpoints

#### Queue Management
- `GET /api/v1/email/queue-status` - Get queue status and failure counts
- `GET /api/v1/email/` - Get all queue jobs (requires auth)
- `GET /api/v1/email/:jobId` - Get specific job details (requires auth)

#### Failure Management
- `GET /api/v1/email/failures` - Get paginated list of email failures (requires auth)
- `GET /api/v1/email/failures/:failureId` - Get specific failure details (requires auth)

#### Retry Operations
- `POST /api/v1/email/failures/:failureId/retry` - Retry specific failed email (requires auth)
- `POST /api/v1/email/failures/retry-all` - Retry all failed emails (requires auth)

#### Cleanup
- `DELETE /api/v1/email/failures/cleanup` - Clean up resolved failures (requires auth)

### Usage Examples

#### Sending Emails with Queue
```typescript
import { addToEmailQueue } from './services/emailQueue.service';

// Basic email
await addToEmailQueue({
  email: 'user@example.com',
  subject: 'Welcome!',
  message: 'Welcome to our platform!'
});

// Email with custom retry configuration
await addToEmailQueue({
  email: 'user@example.com',
  subject: 'Important Update',
  message: 'Important system update'
}, {
  maxAttempts: 10,
  backoffDelay: 2000,
  exponentialBackoff: true
});
```

#### Monitoring Queue Status
```typescript
import { getQueueStatus } from './services/emailQueue.service';

const status = await getQueueStatus();
console.log('Queue Status:', status);
// Output:
// {
//   waiting: 5,
//   active: 2,
//   completed: 150,
//   failed: 3,
//   totalFailures: 10,
//   unresolvedFailures: 7,
//   pendingRetries: 3
// }
```

#### Manual Retry Operations
```typescript
import { retryFailedEmail, retryAllFailedEmails } from './services/emailQueue.service';

// Retry specific failure
await retryFailedEmail('failure-id');

// Retry all failed emails
const results = await retryAllFailedEmails();
console.log(`Retried ${results.length} emails`);
```

### Command Line Management

The project includes a command-line tool for managing the email queue:

```bash
# Show queue status
npm run email:status

# List failures with pagination
npm run email:failures 2 5  # page 2, limit 5

# Retry all failed emails
npm run email:retry

# Clean up resolved failures older than 7 days
npm run email:cleanup 7

# Start automatic retry scheduler (every 10 minutes)
npm run email:scheduler 10
```

### Configuration

The email queue system can be configured through environment variables:

```env
# Redis Configuration (for queue)
REDIS_HOST=localhost
REDIS_PORT=6379

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Automatic Retry Logic

1. **Exponential Backoff**: Failed emails are retried with increasing delays (1s, 2s, 4s, 8s, 16s)
2. **Maximum Attempts**: Default 5 attempts per email (configurable)
3. **Scheduled Retries**: Automatic retry every 5 minutes for emails that haven't reached max attempts
4. **Failure Tracking**: All failures are logged with detailed error information
5. **Resolution Tracking**: Successful emails mark their failures as resolved

### Monitoring and Alerts

The system provides comprehensive monitoring:

- Real-time queue status
- Failure rate tracking
- Retry attempt monitoring
- Error categorization
- Performance metrics

### Best Practices

1. **Monitor Queue Health**: Regularly check queue status and failure rates
2. **Set Appropriate Retry Limits**: Balance between reliability and resource usage
3. **Clean Up Regularly**: Remove resolved failures to maintain database performance
4. **Monitor SMTP Limits**: Be aware of your email provider's sending limits
5. **Use Appropriate Delays**: Set reasonable backoff delays to avoid overwhelming email servers


## License

This project is licensed under the MIT License - see the LICENSE file for details.

