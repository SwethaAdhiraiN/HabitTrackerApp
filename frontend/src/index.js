import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// PUBLIC_INTERFACE
/**
 * React entrypoint. Hydrates App component into the root div.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
