import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Set document title from environment variable
document.title = import.meta.env.VITE_APP_TITLE || 'ShopEasy - Modern E-commerce Store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)