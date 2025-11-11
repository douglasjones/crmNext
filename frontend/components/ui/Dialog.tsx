import React from 'react';

// --- Tipos para as props do componente ---
type DialogProps = {
  isOpen: boolean;
  type: 'alert' | 'error' | 'question' | 'success';
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

// --- Componente de Estilos ---
const DialogStyles = () => (
  <style>{`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog-box {
      background-color: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 90%;
      max-width: 400px;
      text-align: center;
    }
    .dialog-message {
      font-size: 16px;
      margin-bottom: 20px;
      color: #374151;
    }
    .dialog-buttons {
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    .dialog-button {
      padding: 10px 20px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .confirm-button {
      background-color: #2A79C8;
      color: white;
    }
    .cancel-button {
      background-color: #e5e7eb;
      color: #374151;
    }
  `}</style>
);

const Dialog: React.FC<DialogProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <>
      <DialogStyles />
      <div className="dialog-overlay">
        <div className="dialog-box">
          <p className="dialog-message">{message}</p>
          <div className="dialog-buttons">
            {onCancel && (
              <button onClick={onCancel} className="dialog-button cancel-button">
                Cancelar
              </button>
            )}
            <button onClick={onConfirm} className="dialog-button confirm-button">
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dialog;
