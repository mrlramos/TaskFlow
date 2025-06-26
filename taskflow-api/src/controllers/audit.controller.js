const { AuditLog, Task } = require('../models');

class AuditController {
  // Get all audit logs
  async getAllAuditLogs(req, res) {
    try {
      const auditLogs = await AuditLog.findAll({
        include: [{
          model: Task,
          as: 'task',
          attributes: ['id', 'title']
        }],
        order: [['timestamp', 'DESC']]
      });

      res.json({
        success: true,
        data: auditLogs
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch audit logs'
      });
    }
  }

  // Get audit logs for a specific task
  async getTaskAuditLogs(req, res) {
    try {
      const taskId = parseInt(req.params.taskId);

      if (!taskId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid task ID'
        });
      }

      const auditLogs = await AuditLog.findAll({
        where: { taskId },
        include: [{
          model: Task,
          as: 'task',
          attributes: ['id', 'title']
        }],
        order: [['timestamp', 'DESC']]
      });

      res.json({
        success: true,
        data: auditLogs
      });
    } catch (error) {
      console.error('Error fetching task audit logs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch task audit logs'
      });
    }
  }

  // Get audit summary/statistics
  async getAuditSummary(req, res) {
    try {
      const summary = await AuditLog.findAll({
        attributes: [
          'action',
          [AuditLog.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['action']
      });

      const totalLogs = await AuditLog.count();
      
      const recentActivity = await AuditLog.findAll({
        limit: 10,
        include: [{
          model: Task,
          as: 'task',
          attributes: ['id', 'title']
        }],
        order: [['timestamp', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          summary: summary.map(item => ({
            action: item.action,
            count: parseInt(item.dataValues.count)
          })),
          totalLogs,
          recentActivity
        }
      });
    } catch (error) {
      console.error('Error fetching audit summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch audit summary'
      });
    }
  }
}

module.exports = new AuditController(); 