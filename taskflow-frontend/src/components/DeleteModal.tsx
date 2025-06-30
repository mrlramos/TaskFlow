import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Task } from '../types/Task';
import './DeleteModal.css';

interface DeleteModalProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  task,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key press following React best practices
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && !isDeleting && !internalLoading) {
      onCancel();
    }
    // Tab trap for accessibility
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [onCancel, isDeleting, internalLoading]);

  // Focus management and cleanup following React best practices
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Focus the cancel button initially for better accessibility
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 100);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      setInternalLoading(false);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click with proper event handling
  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isDeleting && !internalLoading) {
      onCancel();
    }
  }, [onCancel, isDeleting, internalLoading]);

  // Enhanced confirm handler with better UX
  const handleConfirm = useCallback(async () => {
    if (isDeleting || internalLoading) return;
    
    try {
      setInternalLoading(true);
      await onConfirm();
    } catch (error) {
      console.error('Error deleting task:', error);
      setInternalLoading(false);
    }
  }, [onConfirm, isDeleting, internalLoading]);

  const handleCancel = useCallback(() => {
    if (!isDeleting && !internalLoading) {
      onCancel();
    }
  }, [onCancel, isDeleting, internalLoading]);

  // Early return following React patterns
  if (!isOpen || !task) {
    return null;
  }

  const isLoading = isDeleting || internalLoading;

  return (
    <div 
      className="delete-modal-overlay" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div 
        className={`delete-modal ${isLoading ? 'deleting' : ''}`}
        ref={modalRef}
      >
        <div className={`delete-modal-header ${isLoading ? 'deleting' : ''}`}>
          <h3 id="delete-modal-title">🗑️ Delete Task</h3>
          {!isLoading && (
            <button 
              className="close-button"
              onClick={handleCancel}
              aria-label="Close delete dialog"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        <div className={`delete-modal-content ${isLoading ? 'deleting' : ''}`}>
          <div className="warning-icon" aria-hidden="true">⚠️</div>
          <p id="delete-modal-description" className="warning-text">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          
          <div className="task-preview">
            <h4 className="task-title">{task.title}</h4>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              <span className={`status-badge ${task.status}`}>
                {task.status === 'pending' ? '📋 Pending' :
                 task.status === 'in-progress' ? '⚡ In Progress' : '✅ Completed'}
              </span>
              <span className={`priority-badge ${task.priority}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="delete-modal-actions">
          {isLoading && (
            <div className="delete-loading-overlay">
              <div className="delete-loading-content">
                <div className="delete-loading-spinner" aria-hidden="true"></div>
                <span>Deleting task...</span>
              </div>
              <p className="delete-progress-text">
                Please wait while we remove "{task.title}" from your tasks.
              </p>
            </div>
          )}
          
          <button 
            ref={cancelButtonRef}
            className="btn-cancel"
            onClick={handleCancel}
            disabled={isLoading}
            type="button"
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button 
            ref={deleteButtonRef}
            className={`btn-delete ${isLoading ? 'loading' : ''}`}
            onClick={handleConfirm}
            disabled={isLoading}
            type="button"
            aria-label={`Delete task "${task.title}"`}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner" aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              <>
                Delete Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add display name for better debugging
DeleteModal.displayName = 'DeleteModal';

export default React.memo(DeleteModal); 