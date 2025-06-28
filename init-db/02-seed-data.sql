-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Setup Development Environment', 
 'Configure Docker containers, databases, and development tools for the project', 
 'completed', 
 'high', 
 '2024-01-15 10:00:00+00'),

('Implement User Authentication', 
 'Develop login/logout functionality with JWT tokens and role-based access control', 
 'in-progress', 
 'high', 
 '2024-02-01 18:00:00+00'),

('Create API Documentation', 
 'Generate comprehensive API documentation using Swagger/OpenAPI specifications', 
 'pending', 
 'medium', 
 '2024-01-25 15:30:00+00'),

('Database Migration Scripts', 
 'Write migration scripts for production database updates', 
 'pending', 
 'high', 
 '2024-01-20 12:00:00+00'),

('Unit Tests Implementation', 
 'Write comprehensive unit tests for all service layers and controllers', 
 'pending', 
 'medium', 
 '2024-02-10 17:00:00+00'),

('Frontend Integration', 
 'Connect React frontend with the Node.js API endpoints', 
 'pending', 
 'low', 
 '2024-02-15 14:00:00+00'),

('Performance Optimization', 
 'Optimize database queries and API response times', 
 'pending', 
 'medium', 
 '2024-02-20 16:00:00+00'),

('Security Audit', 
 'Conduct security review and implement necessary security measures', 
 'pending', 
 'high', 
 '2024-01-30 11:00:00+00'),

('Code Review Process', 
 'Establish code review guidelines and implement PR templates', 
 'completed', 
 'medium', 
 '2024-01-10 09:00:00+00'),

('CI/CD Pipeline Setup', 
 'Configure automated testing and deployment pipeline', 
 'in-progress', 
 'high', 
 '2024-01-28 13:00:00+00');

-- Insert corresponding audit logs for completed tasks
INSERT INTO audit_logs (task_id, action, new_data, user_id, timestamp) VALUES
(1, 'CREATE', 
 '{"title": "Setup Development Environment", "description": "Configure Docker containers, databases, and development tools for the project", "status": "pending", "priority": "high", "due_date": "2024-01-15T10:00:00.000Z"}',
 'system_init',
 '2024-01-10 08:00:00+00'),

(1, 'UPDATE',
 '{"title": "Setup Development Environment", "description": "Configure Docker containers, databases, and development tools for the project", "status": "completed", "priority": "high", "due_date": "2024-01-15T10:00:00.000Z"}',
 'developer_01',
 '2024-01-14 16:30:00+00'),

(9, 'CREATE',
 '{"title": "Code Review Process", "description": "Establish code review guidelines and implement PR templates", "status": "pending", "priority": "medium", "due_date": "2024-01-10T09:00:00.000Z"}',
 'system_init',
 '2024-01-08 10:00:00+00'),

(9, 'UPDATE',
 '{"title": "Code Review Process", "description": "Establish code review guidelines and implement PR templates", "status": "completed", "priority": "medium", "due_date": "2024-01-10T09:00:00.000Z"}',
 'tech_lead',
 '2024-01-10 08:45:00+00'); 