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

let nextId = 3;

class TaskService {
  getAllTasks() {
    return tasks;
  }

  getTaskById(id) {
    return tasks.find(task => task.id === id);
  }

  createTask(taskData) {
    const { title, description, status, priority, dueDate } = taskData;

    if (!title) {
      throw new Error('Title is required');
    }

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
    return newTask;
  }

  updateTask(id, taskData) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    const { title, description, status, priority, dueDate } = taskData;

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      priority: priority || tasks[taskIndex].priority,
      dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
      updatedAt: new Date().toISOString()
    };

    return tasks[taskIndex];
  }

  deleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    return tasks.splice(taskIndex, 1)[0];
  }
}

module.exports = new TaskService();