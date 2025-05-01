import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'

const client = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client} >
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
