import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import LoadingScreen from './components/LoadingScreen';
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded pages
const StatusPage = lazy(() => import('./pages/StatusPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UpdatesPage = lazy(() => import('./pages/UpdatesPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Verifica autenticação ao iniciar
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/status" replace />} />
        
        <Route 
          path="status" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <StatusPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <DashboardPage />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="updates" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <UpdatesPage />
            </Suspense>
          }
        />
        
        <Route 
          path="admin" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <AdminPage />
              </Suspense>
            </ProtectedRoute>
          } 
        />
      </Route>
      
      <Route path="*" element={<Navigate to="/status" replace />} />
    </Routes>
  );
}

export default App;