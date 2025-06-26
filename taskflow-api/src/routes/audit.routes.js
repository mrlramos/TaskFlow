const express = require('express');
const auditController = require('../controllers/audit.controller');

const router = express.Router();

// GET /audit - Get all audit logs
router.get('/', auditController.getAllAuditLogs);

// GET /audit/summary - Get audit summary and statistics
router.get('/summary', auditController.getAuditSummary);

// GET /audit/task/:taskId - Get audit logs for specific task
router.get('/task/:taskId', auditController.getTaskAuditLogs);

module.exports = router; 