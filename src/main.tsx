import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import { I18nProvider } from './i18n/context.js';
import { ThemeProvider } from './theme/context.js';
import './index.css';

// Register PWA Service Worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration notice:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);

