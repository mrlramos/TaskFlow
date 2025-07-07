-- Reset sequence and insert minimal sample data
DELETE FROM audit_logs;
DELETE FROM tasks;

-- Reset the sequence to start from 1
ALTER SEQUENCE tasks_id_seq RESTART WITH 1;

-- Insert only one sample task
INSERT INTO tasks (id, title, description, status, priority, due_date) VALUES
(1, 'Welcome to TaskFlow', 
 'This is your first task! You can create, edit, and delete tasks using the interface.', 
 'pending', 
 'medium', 
 '2024-12-31 23:59:59+00');

-- Update sequence to continue from 2 for new tasks
SELECT setval('tasks_id_seq', 1, true);

-- Insert one audit log for the welcome task
INSERT INTO audit_logs (task_id, action, new_data, user_id, timestamp) VALUES
(1, 'CREATE', 
 '{"title": "Welcome to TaskFlow", "description": "This is your first task! You can create, edit, and delete tasks using the interface.", "status": "pending", "priority": "medium", "due_date": "2024-12-31T23:59:59.000Z"}',
 'system_init',
 NOW()); 