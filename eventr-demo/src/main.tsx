import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import MSW browser setup for development
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./api/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// Initialize the app with MSW
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});