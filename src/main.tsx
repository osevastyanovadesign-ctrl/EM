import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const navigation = performance.getEntriesByType('navigation')[0];

if (navigation?.type === 'reload') {
  window.scrollTo(0, 0);
}

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
