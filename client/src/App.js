import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import GlobalMotion from './components/ui/GlobalMotion';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';

// Module Pages
import GroupManagement from './modules/group-management/pages/GroupManagement';
import ResourceManagement from './modules/resource-management/pages/ResourceManagement';
import SkillMatching from './modules/skill-matching/pages/SkillMatching';
import AcademicProgress from './modules/academic-progress/pages/AcademicProgress';
import KuppiAds from './modules/kuppi-ads';
import TaskManagement from './modules/reminder-progress/pages/TaskManagement';
import ProgressDashboard from './modules/reminder-progress/pages/ProgressDashboard';

// Add dark theme styles
import './styles/dark-theme.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <>
      <GlobalMotion />
      <div data-route-shell>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>

          <Route
            path="/groups/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<GroupManagement />} />
          </Route>

          <Route
            path="/resources/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ResourceManagement />} />
          </Route>

          <Route
            path="/skills/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="*" element={<SkillMatching />} />
          </Route>

          <Route
            path="/academic/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AcademicProgress />} />
            <Route path="*" element={<AcademicProgress />} />
          </Route>

          <Route
            path="/progress/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProgressDashboard />} />
            <Route path="*" element={<ProgressDashboard />} />
          </Route>

          <Route
            path="/kuppi/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <KuppiAds />
              </React.Suspense>
            } />
            <Route path="*" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <KuppiAds />
              </React.Suspense>
            } />
          </Route>

          <Route
            path="/tasks/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TaskManagement />} />
            <Route path="*" element={<TaskManagement />} />
          </Route>

          <Route
            path="/progress/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProgressDashboard />} />
            <Route path="*" element={<ProgressDashboard />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface-100 text-warm-500">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fffaf2',
                color: '#3D3D3D',
                border: '1px solid #eadfce',
                boxShadow: '0 18px 40px rgba(61,61,61,0.12)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#0077B6',
                  secondary: '#fffaf2',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#E07A5F',
                  secondary: '#fffaf2',
                },
              },
            }}
          />
          
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
