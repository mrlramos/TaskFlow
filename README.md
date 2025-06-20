# Task Management System

A simple task management application built with Node.js, PostgreSQL, RabbitMQ, and React for learning purposes.

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

## 🚀 Development Steps

### ✅ Phase 1: Basic API (COMPLETED)
- [x] Express server setup
- [x] CRUD routes with mock data
- [x] Basic validation
- [x] Health check endpoint

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

## 🎯 Current Status

**Phase 1 completed** - Basic API with mock data is running and fully functional.

**Next step**: Setting up PostgreSQL + Sequelize for persistent data storage.