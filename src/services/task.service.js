const { Task } = require('../models');

class TaskService {
  async getAllTasks() {
    return await Task.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async getTaskById(id) {
    return await Task.findByPk(id);
  }

  async createTask(taskData) {
    const { title, description, status, priority, dueDate } = taskData;

    try {
      return await Task.create({
        title,
        description: description || '',
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate: dueDate || null
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new Error(error.errors.map(e => e.message).join(', '));
      }
      throw error;
    }
  }

  async updateTask(id, taskData) {
    const task = await Task.findByPk(id);
    
    if (!task) {
      return null;
    }

    const { title, description, status, priority, dueDate } = taskData;

    try {
      await task.update({
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        priority: priority || task.priority,
        dueDate: dueDate !== undefined ? dueDate : task.dueDate
      });

      return task;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new Error(error.errors.map(e => e.message).join(', '));
      }
      throw error;
    }
  }

  async deleteTask(id) {
    const task = await Task.findByPk(id);
    
    if (!task) {
      return null;
    }

    await task.destroy();
    return task;
  }
}

module.exports = new TaskService();