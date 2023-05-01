import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './utils/routes.tsx';
import { ErrorBoundary } from 'react-error-boundary';

const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
