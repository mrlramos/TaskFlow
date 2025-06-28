-- Display summary statistics
SELECT 
    'TASKS SUMMARY' as info,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
    COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks
FROM tasks;

-- Display priority distribution
SELECT 
    'PRIORITY DISTRIBUTION' as info,
    priority,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tasks), 2) || '%' as percentage
FROM tasks 
GROUP BY priority 
ORDER BY 
    CASE priority 
        WHEN 'high' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low' THEN 3 
    END;

-- Display recent tasks
SELECT 
    'RECENT TASKS' as info,
    id,
    title,
    status,
    priority,
    due_date,
    created_at
FROM tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- Display audit log summary
SELECT 
    'AUDIT LOGS SUMMARY' as info,
    COUNT(*) as total_logs,
    COUNT(CASE WHEN action = 'CREATE' THEN 1 END) as create_actions,
    COUNT(CASE WHEN action = 'UPDATE' THEN 1 END) as update_actions,
    COUNT(CASE WHEN action = 'DELETE' THEN 1 END) as delete_actions
FROM audit_logs;

-- Display database info
SELECT 
    'DATABASE INFO' as info,
    current_database() as database_name,
    current_user as connected_user,
    version() as postgres_version; 