const db = require('../database/connection');

class TaskService {
  async getAllTasks() {
    const result = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows;
  }

  async getTaskById(id) {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createTask(taskData) {
    const { title, description, status, priority, dueDate } = taskData;

    if (!title) {
      throw new Error('Title is required');
    }

    const result = await db.query(
      `INSERT INTO tasks (title, description, status, priority, due_date) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        title,
        description || '',
        status || 'pending',
        priority || 'medium',
        dueDate || null
      ]
    );

    return result.rows[0];
  }

  async updateTask(id, taskData) {
    // First check if task exists
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      return null;
    }

    const { title, description, status, priority, dueDate } = taskData;

    const result = await db.query(
      `UPDATE tasks 
       SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 
       RETURNING *`,
      [
        title || existingTask.title,
        description !== undefined ? description : existingTask.description,
        status || existingTask.status,
        priority || existingTask.priority,
        dueDate !== undefined ? dueDate : existingTask.due_date,
        id
      ]
    );

    return result.rows[0];
  }

  async deleteTask(id) {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
}

module.exports = new TaskService();