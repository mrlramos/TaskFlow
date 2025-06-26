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

### ✅ Phase 3: Message Queue (COMPLETED)
- [x] RabbitMQ setup with Docker
- [x] Async audit logging system
- [x] Task history tracking with full CRUD audit
- [x] Audit logs API endpoints
- [x] RabbitMQ management interface integration

### 🐳 Phase 4: Docker & DevOps (IN PROGRESS)
- [x] Dockerfile for Node.js application
- [ ] Docker Compose for full stack (API + PostgreSQL + RabbitMQ)
- [ ] Multi-stage build optimization
- [ ] Environment-specific configurations
- [ ] Health checks and monitoring
- [ ] Integration testing with containerized services
- [ ] Production-ready deployment setup

### 📋 Phase 5: Frontend (PLANNED)
- [ ] React application
- [ ] Task management UI
- [ ] API integration
- [ ] Docker integration for frontend

### 📊 Phase 6: Observability & Monitoring (PLANNED)
- [ ] ELK Stack setup (Elasticsearch + Logstash + Kibana)
- [ ] Centralized logging with structured logs
- [ ] Custom dashboards for task metrics
- [ ] Real-time audit log visualization
- [ ] Application performance monitoring (APM)
- [ ] Alert system for critical events
- [ ] Docker Compose integration with ELK stack

## 🏃‍♂️ Quick Start

### 🐳 Docker Compose (Recommended)
Complete stack with one command:
```bash
# Start all services (API + PostgreSQL + RabbitMQ)
docker-compose up

# Or run in background
docker-compose up -d

# Test the API
curl http://localhost:3000/health
curl http://localhost:3000/tasks
```

**Access Points:**
- **API**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (user: `taskflow_user`, pass: `taskflow_pass`)
- **PostgreSQL**: localhost:5432 (database: `taskflow`)

### 🔧 Manual Setup (Alternative)
If you prefer running services manually:

#### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- RabbitMQ (via Docker or native install)
- Create database: `CREATE DATABASE taskflow;`

#### Installation
```bash
# Navigate to API directory
cd taskflow-api

# Install dependencies
npm install

# Configure environment (update .env with your DB credentials)
cp .env.example .env

# Start RabbitMQ (Docker - recommended)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Start development server
npm run dev

# Test the API
curl http://localhost:3000/tasks

# Test audit system
curl http://localhost:3000/audit
```

#### Environment Variables
Create a `.env` file in `taskflow-api/`:
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

### Task Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create new task |
| GET | `/tasks/:id` | Get task by ID |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

### Audit System  
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/audit` | List all audit logs |
| GET | `/audit/summary` | Get audit statistics |
| GET | `/audit/task/:taskId` | Get audit logs for specific task |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

## 🧪 Testing

### 🐳 Docker Compose Testing
```bash
# Start all services
docker-compose up -d

# Wait for services to be healthy (30-60 seconds)
docker-compose ps

# Test API endpoints
curl http://localhost:3000/health
curl http://localhost:3000/tasks
curl http://localhost:3000/audit

# View logs
docker-compose logs -f api
docker-compose logs -f postgres
docker-compose logs -f rabbitmq

# Stop services
docker-compose down
```

### Using Insomnia REST Client

Import the provided collection for easy API testing:

1. Import `taskflow-api/insomnia-collection.json` into Insomnia
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

## 🔧 Docker Commands

### Service Management
```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# Restart specific service
docker-compose restart api

# Rebuild after code changes
docker-compose build api
docker-compose up api

# Clean reset (removes volumes)
docker-compose down -v
```

### Development
```bash
# View real-time logs
docker-compose logs -f api

# Connect to PostgreSQL
docker-compose exec postgres psql -U taskflow_user -d taskflow

# Check service health
docker-compose ps
```

## 🎯 Current Status

**Phase 3 completed** - Full-stack API with PostgreSQL + Sequelize ORM + RabbitMQ audit system is running and fully functional.

**Key achievements:**
- ✅ SOLID principles implementation
- ✅ Clean separation of concerns (Controller → Service → Model → Database)
- ✅ Industry-standard folder structure with proper naming conventions
- ✅ Sequelize ORM with validations and relationships
- ✅ Environment-based configuration (development/production)
- ✅ Automatic database sync and sample data seeding
- ✅ Professional error handling and validation
- ✅ Comprehensive API testing setup (Insomnia collection)
- ✅ RabbitMQ async audit system with full CRUD tracking
- ✅ Message queue integration with task lifecycle events
- ✅ Audit logs API with history tracking

**Next step**: Containerizing the application with Docker for easier deployment and testing of the integrated services (Node.js + PostgreSQL + RabbitMQ).

**Technology Stack:**
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Sequelize ORM  
- **Message Queue**: RabbitMQ (planned)
- **Frontend**: React (planned)
- **DevOps**: Docker + Docker Compose (planned)
- **Architecture**: Clean Architecture + SOLID principles
- **Validation**: Sequelize built-in validations
- **Environment**: dotenv configuration management

**Final Goal:** Complete containerized microservices architecture with full observability stack:
- **TaskFlow API** (Node.js) 
- **PostgreSQL** Database
- **RabbitMQ** Message Broker
- **React** Frontend
- **ELK Stack** (Elasticsearch + Logstash + Kibana) for observability
- **Docker Compose** orchestrating all services
- **Real-time monitoring** and **centralized logging**
- **Production-ready** deployment with health checks and alerts