const taskService = require('../services/task.service');

class TaskController {
  getAllTasks(req, res) {
    try {
      const tasks = taskService.getAllTasks();
      res.json({
        success: true,
        data: tasks,
        total: tasks.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  getTaskById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const task = taskService.getTaskById(id);
      
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  createTask(req, res) {
    try {
      const newTask = taskService.createTask(req.body);
      res.status(201).json({
        success: true,
        data: newTask
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  updateTask(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedTask = taskService.updateTask(id, req.body);
      
      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }
      
      res.json({
        success: true,
        data: updatedTask
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  deleteTask(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deletedTask = taskService.deleteTask(id);
      
      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }
      
      res.json({
        success: true,
        data: deletedTask,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new TaskController();