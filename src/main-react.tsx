import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import './style.css';

/**
 * Main entry point for React version
 * This will eventually replace the vanilla TypeScript game
 */

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure index.html has <div id="app"></div>'
  );
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Development mode helpers
if (import.meta.env.DEV) {
  console.warn('🦦 Otter River Rush - React Three Fiber Edition');
  console.warn('📊 Development Mode Active');
  console.warn('🎮 Game State available at: window.__gameStore');

  // Expose game store for debugging
  import('./hooks/useGameStore').then(({ useGameStore }) => {
    (window as { __gameStore?: unknown }).__gameStore = useGameStore;
  });
}
