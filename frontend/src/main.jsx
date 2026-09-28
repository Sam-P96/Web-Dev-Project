import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppPrime from './AppPrime.jsx';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppPrime />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
