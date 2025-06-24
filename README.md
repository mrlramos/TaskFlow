# TaskFlow

A modern task management system with async workflow capabilities, built with Node.js, PostgreSQL, RabbitMQ, and React for learning purposes.

## 📋 Project Overview

This is a full-stack CRUD application where users can create, read, update, and delete tasks. Each task has:
- Title and description
- Status (pending/in-progress/completed)
- Priority level (low/medium/high)
- Due date
- Creation and update timestamps

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Sequelize ORM
- **Message Queue**: RabbitMQ (for async notifications)
- **Frontend**: React

## 🏗️ Architecture

The application follows **Clean Architecture** and **SOLID principles** with a modular structure:

```
src/
├── controllers/     # HTTP request handlers
│   └── task.controller.js
├── services/        # Business logic layer
│   └── task.service.js
├── routes/          # Route definitions
│   └── task.routes.js
├── models/          # Database models (Sequelize)
│   ├── index.js
│   └── task.model.js
└── config/          # Configuration files
    └── database.js
```

### Design Patterns Used:
- **MVC Pattern**: Separation of concerns with Models, Views, and Controllers
- **Service Layer**: Business logic isolated from HTTP concerns
- **Repository Pattern**: Data access through Sequelize ORM
- **Dependency Injection**: Controllers depend on services, not data layer directly
- **Single Responsibility**: Each class has one reason to change

### Database Layer:
- **Sequelize ORM**: Object-relational mapping for PostgreSQL
- **Model Validations**: Built-in data validation and constraints
- **Auto-sync**: Automatic table creation and schema updates
- **Environment Config**: Separate configurations for development/production

## 🚀 Development Steps

### ✅ Phase 1: Basic API (COMPLETED)
- [x] Express server setup
- [x] CRUD routes with mock data
- [x] Basic validation
- [x] Health check endpoint
- [x] Clean Architecture implementation
- [x] Modular structure (Controllers, Services, Routes)
- [x] SOLID principles following

### ✅ Phase 2: Database Integration (COMPLETED)
- [x] PostgreSQL setup
- [x] Sequelize ORM configuration
- [x] Task model with validations
- [x] Database connection pooling
- [x] Environment-based configuration
- [x] Auto-sync and sample data seeding
- [x] **Replace mock data with Sequelize ORM**

### 🔄 Phase 3: Message Queue (NEXT)
- [ ] RabbitMQ setup
- [ ] Async notifications
- [ ] Email notifications for task updates

### 📋 Phase 4: Frontend (PLANNED)
- [ ] React application
- [ ] Task management UI
- [ ] API integration

### 🐳 Phase 5: Docker & DevOps (PLANNED)
- [ ] Dockerfile for Node.js application
- [ ] Docker Compose for full stack (API + PostgreSQL + RabbitMQ)
- [ ] Multi-stage build optimization
- [ ] Environment-specific configurations
- [ ] Health checks and monitoring
- [ ] Production deployment setup

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- Create database: `CREATE DATABASE taskflow;`

### Installation
```bash
# Clone and install dependencies
npm install

# Configure environment (update .env with your DB credentials)
cp .env.example .env

# Start development server
npm run dev

# Test the API
curl http://localhost:3000/tasks
```

### Environment Variables
Create a `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow
DB_USER=postgres
DB_PASS=your_password

NODE_ENV=development
PORT=3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create new task |
| GET | `/tasks/:id` | Get task by ID |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/health` | Health check |

## 🧪 Testing

### Using Insomnia REST Client

Import the provided collection for easy API testing:

1. Import `insomnia-collection.json` into Insomnia
2. The collection includes all endpoints with example requests
3. Base URL is pre-configured to `http://localhost:3000`
4. Test data examples are included for POST/PUT requests

### Manual Testing

```bash
# Get all tasks
curl http://localhost:3000/tasks

# Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Test description","priority":"high"}'

# Get specific task
curl http://localhost:3000/tasks/1

# Update task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Delete task
curl -X DELETE http://localhost:3000/tasks/1
```

## 🎯 Current Status

**Phase 2 completed** - Full-stack API with PostgreSQL + Sequelize ORM is running and fully functional.

**Key achievements:**
- ✅ SOLID principles implementation
- ✅ Clean separation of concerns (Controller → Service → Model → Database)
- ✅ Industry-standard folder structure with proper naming conventions
- ✅ Sequelize ORM with validations and relationships
- ✅ Environment-based configuration (development/production)
- ✅ Automatic database sync and sample data seeding
- ✅ Professional error handling and validation
- ✅ Comprehensive API testing setup (Insomnia collection)

**Next step**: Implementing RabbitMQ for async message queue functionality.

**Technology Stack:**
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Sequelize ORM  
- **Message Queue**: RabbitMQ (planned)
- **Frontend**: React (planned)
- **DevOps**: Docker + Docker Compose (planned)
- **Architecture**: Clean Architecture + SOLID principles
- **Validation**: Sequelize built-in validations
- **Environment**: dotenv configuration management

**Final Goal:** Complete containerized microservices architecture with Docker Compose orchestrating:
- TaskFlow API (Node.js)
- PostgreSQL Database
- RabbitMQ Message Broker
- React Frontend
- All services communicating seamlessly in isolated containers