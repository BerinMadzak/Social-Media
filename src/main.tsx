import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import { AuthProvider } from './context/AuthContext'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import RedirectToHome from './components/RedirectToHome'
import ProfilePage from './pages/ProfilePage'
import MessagePage from './pages/MessagePage'

const client = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {index: true, element: <HomePage />},
      {path: '/signup', element: <RedirectToHome logged={true}><SignUpPage /></RedirectToHome>},
      {path: '/signin', element: <RedirectToHome logged={true}><SignInPage /></RedirectToHome>},
      {path: '/profile/:user', element: <ProfilePage />},
      {path: '/messages/:user', element: <RedirectToHome logged={false}><MessagePage /></RedirectToHome>}
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client} >
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
