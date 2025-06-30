import axios from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../types/Task';

// API Base Configuration - Use Vite proxy
const API_BASE_URL = '/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Task API Service
export const taskApi = {
    // Get all tasks
    getAllTasks: async (): Promise<Task[]> => {
        try {
            const response = await apiClient.get<ApiResponse<Task[]>>('/tasks');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw new Error('Failed to fetch tasks');
        }
    },

    // Get task by ID
    getTaskById: async (id: number): Promise<Task> => {
        try {
            const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching task ${id}:`, error);
            throw new Error(`Failed to fetch task ${id}`);
        }
    },

    // Create new task
    createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
        try {
            const response = await apiClient.post<ApiResponse<Task>>('/tasks', taskData);
            return response.data.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw new Error('Failed to create task');
        }
    },

    // Update existing task
    updateTask: async (id: number, taskData: UpdateTaskRequest): Promise<Task> => {
        try {
            const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, taskData);
            return response.data.data;
        } catch (error) {
            console.error(`Error updating task ${id}:`, error);
            throw new Error(`Failed to update task ${id}`);
        }
    },

    // Delete task
    deleteTask: async (id: number): Promise<void> => {
        try {
            await apiClient.delete(`/tasks/${id}`);
        } catch (error) {
            console.error(`Error deleting task ${id}:`, error);
            throw new Error(`Failed to delete task ${id}`);
        }
    },
};

// Health check endpoint
export const healthCheck = async (): Promise<boolean> => {
    try {
        const response = await apiClient.get('/health');
        return response.status === 200;
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
}; 