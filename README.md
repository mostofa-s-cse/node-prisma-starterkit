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

## Quick Start

```typescript
import { createApp } from 'nodejs-api-starter';

const app = createApp({
  port: 3000,
  redis: {
    url: 'redis://localhost:6379'
  },
  database: {
    url: 'postgresql://user:password@localhost:5432/dbname'
  },
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '24h'
  }
});

app.start();
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

4. Start the application:

Using Docker (recommended):
```bash
docker-compose up
```

Without Docker:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "token": "jwt_token"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### User Profile

#### Get Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "profileImage": "url_to_image"
  }
}
```

#### Update Profile
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "User bio"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "Updated Name",
    "bio": "User bio",
    "email": "user@example.com"
  }
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000

# Redis
REDIS_URL=redis://redis:6379

# Database (Choose one)
DATABASE_URL=postgresql://user:password@postgres:5432/dbname
# or
DATABASE_URL=mysql://user:password@mysql:3306/dbname

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
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
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## NPM Package Usage

### Configuration Options

The package accepts the following configuration options:

```typescript
interface Config {
  port?: number;              // Default: 3000
  redis?: {
    url: string;             // Redis connection URL
    password?: string;       // Redis password
  };
  database?: {
    url: string;             // Database connection URL
    type?: 'postgresql' | 'mysql'; // Database type
  };
  jwt?: {
    secret: string;          // JWT secret key
    expiresIn?: string;      // Token expiration time
  };
  cors?: {
    origin?: string | string[]; // CORS origin
    credentials?: boolean;    // Allow credentials
  };
}
```

### Available Methods

```typescript
// Start the server
app.start();

// Stop the server
app.stop();

// Get Express app instance
const expressApp = app.getExpressApp();

// Get Redis client
const redisClient = app.getRedisClient();

// Get Database client
const dbClient = app.getDatabaseClient();
```

### Example with Custom Configuration

```typescript
import { createApp } from 'nodejs-api-starter';

const app = createApp({
  port: 4000,
  redis: {
    url: 'redis://localhost:6379',
    password: 'your-redis-password'
  },
  database: {
    url: 'postgresql://user:password@localhost:5432/dbname',
    type: 'postgresql'
  },
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '7d'
  },
  cors: {
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true
  }
});

// Add custom middleware
app.getExpressApp().use((req, res, next) => {
  console.log('Custom middleware');
  next();
});

// Start the server
app.start();
``` 