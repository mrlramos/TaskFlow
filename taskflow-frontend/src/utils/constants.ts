// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
} as const;

// UI Constants
export const UI_CONFIG = {
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
} as const;

// Task Status Options
export const TASK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
} as const;

// Task Priority Options
export const TASK_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
    TASK_TITLE: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 100,
    },
    TASK_DESCRIPTION: {
        MAX_LENGTH: 500,
    },
} as const;

// Status Display Configuration
export const STATUS_CONFIG = {
    [TASK_STATUS.PENDING]: {
        label: '📋 Pending',
        color: '#ffa502',
    },
    [TASK_STATUS.IN_PROGRESS]: {
        label: '⚡ In Progress',
        color: '#3742fa',
    },
    [TASK_STATUS.COMPLETED]: {
        label: '✅ Completed',
        color: '#2ed573',
    },
} as const;

// Priority Display Configuration
export const PRIORITY_CONFIG = {
    [TASK_PRIORITY.LOW]: {
        label: '🟢 Low',
        color: '#2ed573',
    },
    [TASK_PRIORITY.MEDIUM]: {
        label: '🟡 Medium',
        color: '#ffa502',
    },
    [TASK_PRIORITY.HIGH]: {
        label: '🔴 High',
        color: '#ff4757',
    },
} as const; 