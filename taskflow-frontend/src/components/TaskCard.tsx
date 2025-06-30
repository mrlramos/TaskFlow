import React, { useCallback, memo, useState } from 'react';
import { Task } from '../types/Task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = memo(({ task, onEdit, onDelete, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'completed': return '#2ed573';
      case 'in-progress': return '#3742fa';
      case 'pending': return '#ffa502';
      default: return '#747d8c';
    }
  }, []);

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [onDelete, task.id]);

  const handleStatusChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    
    // Show loading state immediately
    setIsUpdating(true);
    
    try {
      // Call the parent handler
      await onStatusChange(task.id, newStatus);
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 600);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      // Remove loading state
      setTimeout(() => setIsUpdating(false), 200);
    }
  }, [onStatusChange, task.id]);

  return (
    <div className={`task-card ${task.status} ${isUpdating ? 'status-updating' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button 
            className="btn-edit" 
            onClick={handleEdit}
            title="Edit task"
            disabled={isUpdating}
          >
            ✏️
          </button>
          <button 
            className="btn-delete" 
            onClick={handleDelete}
            title="Delete task"
            disabled={isUpdating}
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="task-badges">
          <span 
            className="badge priority-badge"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority.toUpperCase()}
          </span>
          
          <select
            className={`status-select ${isUpdating ? 'updating' : ''} ${showSuccess ? 'success' : ''}`}
            value={task.status}
            onChange={handleStatusChange}
            style={{ color: getStatusColor(task.status) }}
            disabled={isUpdating}
          >
            <option value="pending">📋 Pending</option>
            <option value="in-progress">⚡ In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <div className="task-dates">
          {task.dueDate && (
            <div className="due-date">
              <span>📅 Due: {formatDate(task.dueDate)}</span>
            </div>
          )}
          <div className="created-date">
            <span>🕐 Created: {formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Add display name for better debugging
TaskCard.displayName = 'TaskCard';

export default TaskCard; 