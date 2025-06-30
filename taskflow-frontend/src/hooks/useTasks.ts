import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskRequest } from '../types/Task';
import { taskApi } from '../services/api';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Memoized API calls to prevent unnecessary re-renders
    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedTasks = await taskApi.getAllTasks();
            setTasks(fetchedTasks);
        } catch (err) {
            setError('Failed to load tasks. Please check if the API is running.');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<boolean> => {
        try {
            const newTask = await taskApi.createTask(taskData);
            setTasks(prev => [newTask, ...prev]);
            setError(null);
            return true;
        } catch (err) {
            setError('Failed to create task. Please try again.');
            console.error('Error creating task:', err);
            return false;
        }
    }, []);

    const updateTask = useCallback(async (id: number, taskData: Partial<CreateTaskRequest>): Promise<boolean> => {
        try {
            const updatedTask = await taskApi.updateTask(id, taskData);
            setTasks(prev => prev.map(task =>
                task.id === id ? updatedTask : task
            ));
            setError(null);
            return true;
        } catch (err) {
            setError('Failed to update task. Please try again.');
            console.error('Error updating task:', err);
            return false;
        }
    }, []);

    const deleteTask = useCallback(async (id: number): Promise<boolean> => {
        try {
            await taskApi.deleteTask(id);
            setTasks(prev => prev.filter(task => task.id !== id));
            setError(null);
            return true;
        } catch (err) {
            setError('Failed to delete task. Please try again.');
            console.error('Error deleting task:', err);
            return false;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Load tasks on mount
    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        clearError,
        refreshTasks: loadTasks,
    };
}; 