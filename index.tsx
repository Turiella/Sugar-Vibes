import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './src/contexts/AuthContext';  
import './index.css';  

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("No se pudo encontrar el elemento raíz");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);