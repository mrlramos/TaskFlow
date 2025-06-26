const { Task } = require('../models');
const auditService = require('./audit.service');

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
      const task = await Task.create({
        title,
        description: description || '',
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate: dueDate || null
      });

      // Publish audit event asynchronously
      auditService.publishTaskCreated(task.toJSON());

      return task;
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

    // Store old data for audit
    const oldTaskData = task.toJSON();
    const { title, description, status, priority, dueDate } = taskData;

    try {
      await task.update({
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        priority: priority || task.priority,
        dueDate: dueDate !== undefined ? dueDate : task.dueDate
      });

      // Publish audit event asynchronously
      auditService.publishTaskUpdated(task.toJSON(), oldTaskData);

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

    // Store task data for audit before deletion
    const taskData = task.toJSON();
    
    await task.destroy();

    // Publish audit event asynchronously
    auditService.publishTaskDeleted(taskData);

    return task;
  }
}

module.exports = new TaskService();