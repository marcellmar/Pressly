import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import global styles and our new theme
import './styles/global.css';
import './styles/pressly-theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
