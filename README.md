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
└── routes/          # Route definitions
    └── task.routes.js
```

### Design Patterns Used:
- **MVC Pattern**: Separation of concerns with Models, Views, and Controllers
- **Service Layer**: Business logic isolated from HTTP concerns
- **Dependency Injection**: Controllers depend on services, not data layer directly
- **Single Responsibility**: Each class has one reason to change

## 🚀 Development Steps

### ✅ Phase 1: Basic API (COMPLETED)
- [x] Express server setup
- [x] CRUD routes with mock data
- [x] Basic validation
- [x] Health check endpoint
- [x] **Clean Architecture implementation**
- [x] **Modular structure (Controllers, Services, Routes)**
- [x] **SOLID principles following**

### 🔄 Phase 2: Database Integration (NEXT)
- [ ] PostgreSQL setup
- [ ] Sequelize configuration
- [ ] Database models
- [ ] Replace mock data with real database

### 📋 Phase 3: Message Queue (PLANNED)
- [ ] RabbitMQ setup
- [ ] Async notifications
- [ ] Email notifications for task updates

### 🎨 Phase 4: Frontend (PLANNED)
- [ ] React application
- [ ] Task management UI
- [ ] API integration

## 🏃‍♂️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test the API
curl http://localhost:3000/tasks
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

**Phase 1 completed** - Clean Architecture API with modular structure is running and fully functional.

**Key achievements:**
- ✅ SOLID principles implementation
- ✅ Clean separation of concerns (Controller → Service → Data)
- ✅ Industry-standard folder structure
- ✅ Comprehensive API testing setup

**Next step**: Setting up PostgreSQL + Sequelize for persistent data storage.