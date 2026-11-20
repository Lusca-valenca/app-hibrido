import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Toast } from '../components/Toast';

const ToastContext = createContext(null);

// Mensagens rápidas de feedback (funciona no celular e no navegador)
export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const timer = useRef(null);

  const showToast = useCallback((text) => {
    clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(''), 2200);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast message={message} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
