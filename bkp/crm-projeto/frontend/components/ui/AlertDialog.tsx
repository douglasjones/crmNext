'use client';

import React from 'react';
import styles from './AlertDialog.module.css';

// Ícones SVG para cada tipo de alerta
const icons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
};

export type AlertDialogType = 'success' | 'error' | 'warning' | 'info';

interface AlertDialogProps {
  isOpen: boolean;
  type?: AlertDialogType;
  title?: string;
  message: string;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ 
  isOpen, 
  type = 'info', // Valor padrão é 'info'
  title,
  message, 
  onClose 
}) => {
  if (!isOpen) {
    return null;
  }

  const typeClass = styles[type] || styles.info;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div 
        className={`${styles.dialog} ${typeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.iconContainer}>
          {icons[type]}
        </div>

        {title && <h2 className={styles.title}>{title}</h2>}
        
        <p className={styles.message}>
          {message}
        </p>

        <button 
          onClick={onClose} 
          className={styles.button}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertDialog;
