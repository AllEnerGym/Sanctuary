import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './components/Toast.tsx';
import { AppProvider } from './components/AppContext.tsx';
import Modal from './components/Modal.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <ToastProvider>
        <App />
        <Modal />
      </ToastProvider>
    </AppProvider>
  </StrictMode>,
);
