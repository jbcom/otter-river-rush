import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './style.css';

/**
 * Main entry point - React Three Fiber game
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
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Development mode helpers
console.warn('🦦 Otter River Rush - React Three Fiber Edition');
console.warn('📊 Development Mode Active');
console.warn('🎮 Game State available at: window.__gameStore');

// Expose game store and debug tools for debugging (always, for E2E tests)
import('./hooks/useGameStore').then(({ useGameStore }) => {
  (window as { __gameStore?: unknown }).__gameStore = useGameStore;
});

// Load debug tools
import('./utils/debug-tools').then(({ debugTools }) => {
  (window as any).debug = debugTools;
});
