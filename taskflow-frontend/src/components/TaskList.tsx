import React, { useState, useMemo, useCallback } from 'react';
import { Task, CreateTaskRequest } from '../types/Task';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useDebounce';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import DeleteModal from './DeleteModal';
import './TaskList.css';

const TaskList: React.FC = () => {
  // Use the custom hook instead of reimplementing the logic
  const { tasks, loading, error, createTask, updateTask, deleteTask, clearError } = useTasks();
  
  // Component state
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  // Use debounced search for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleCreateTask = useCallback(async (taskData: CreateTaskRequest) => {
    try {
      setFormLoading(true);
      const success = await createTask(taskData);
      if (success) {
        setShowForm(false);
      }
    } finally {
      setFormLoading(false);
    }
  }, [createTask]);

  const handleUpdateTask = useCallback(async (taskData: CreateTaskRequest) => {
    if (!editingTask) return;

    try {
      setFormLoading(true);
      const success = await updateTask(editingTask.id, taskData);
      if (success) {
        setEditingTask(null);
      }
    } finally {
      setFormLoading(false);
    }
  }, [editingTask, updateTask]);

  const handleDeleteTask = useCallback((id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteModal(true);
    }
  }, [tasks]);

  // Enhanced delete confirmation with proper async handling
  const handleConfirmDelete = useCallback(async (): Promise<void> => {
    if (!taskToDelete) return;

    try {
      const success = await deleteTask(taskToDelete.id);
      if (success) {
        setShowDeleteModal(false);
        setTaskToDelete(null);
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // Keep modal open to show error or retry
      throw error;
    }
  }, [taskToDelete, deleteTask]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  }, []);

  // Optimistic status update for better UX
  const handleStatusChange = useCallback(async (id: number, status: Task['status']) => {
    // Optimistic update - update UI immediately
    const optimisticUpdate = { status };
    
    try {
      // Show immediate feedback
      const success = await updateTask(id, optimisticUpdate);
      if (!success) {
        // If update fails, the error will be shown by the hook
        console.error('Status update failed');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }, [updateTask]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingTask(null);
  }, []);

  // Memoized filtered tasks for performance
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           (task.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ?? false);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, debouncedSearchTerm]);

  // Memoized task counts for performance
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div className="header-top">
          <h1>🚀 TaskFlow</h1>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            ➕ New Task
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={handleClearError}>✕</button>
          </div>
        )}

        <div className="controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <span className="search-info">
                Searching for: "{debouncedSearchTerm}"
              </span>
            )}
          </div>

          <div className="filter-buttons">
            {Object.entries(taskCounts).map(([status, count]) => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status as typeof filter)}
              >
                {status === 'all' ? '📋 All' : 
                 status === 'pending' ? '⏳ Pending' :
                 status === 'in-progress' ? '⚡ In Progress' : '✅ Completed'}
                <span className="count">({count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="task-list-content">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            {tasks.length === 0 ? (
              <>
                <div className="empty-icon">📝</div>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started!</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  ➕ Create First Task
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <h3>No tasks found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask || undefined}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelForm}
          isLoading={formLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default TaskList; 