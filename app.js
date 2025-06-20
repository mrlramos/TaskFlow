const express = require('express');

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Mock data - array to simulate database
let tasks = [
  {
    id: 1,
    title: "Study Node.js",
    description: "Learn basic Node.js concepts",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-12-30",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Setup PostgreSQL",
    description: "Install and configure PostgreSQL database",
    status: "pending",
    priority: "medium",
    dueDate: "2024-12-25",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Variable to control auto-increment ID
let nextId = 3;

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World! 🚀', 
    status: 'API running!' 
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// ============ CRUD ROUTES FOR TASKS ============

// GET /tasks - List all tasks
app.get('/tasks', (req, res) => {
  res.json({
    success: true,
    data: tasks,
    total: tasks.length
  });
});

// POST /tasks - Create new task
app.post('/tasks', (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  
  // Basic validation
  if (!title) {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }
  
  // Create new task
  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    status: status || 'pending',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    data: newTask
  });
});

// GET /tasks/:id - Find task by ID
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  res.json({
    success: true,
    data: task
  });
});

// PUT /tasks/:id - Update task
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  const { title, description, status, priority, dueDate } = req.body;
  
  // Update task
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    status: status || tasks[taskIndex].status,
    priority: priority || tasks[taskIndex].priority,
    dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: tasks[taskIndex]
  });
});

// DELETE /tasks/:id - Delete task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTask,
    message: 'Task deleted successfully'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`✅ Visit http://localhost:${PORT} to test`);
});

module.exports = app;