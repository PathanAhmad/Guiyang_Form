import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DeploymentAuthProvider } from './contexts/DeploymentAuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';

// Page components
import MainApp from './MainApp.jsx';
import LoginPage from './pages/LoginPage.jsx';
import QueueDashboard from './pages/QueueDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Deployment Portal components
import DeploymentPortalHome from './pages/DeploymentPortal/DeploymentPortalHome.jsx';
import DeploymentLogin from './pages/DeploymentPortal/DeploymentLogin.jsx';
import DeploymentDashboard from './pages/DeploymentPortal/DeploymentDashboard.jsx';
import SurveyList from './pages/DeploymentPortal/SurveyList.jsx';
import PilotSurveyForm from '@/components/forms/pilot/PilotSurveyForm.jsx';

function App() {
  return (
    <AuthProvider>
      <DeploymentAuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Main application routes (forms, etc.) */}
              <Route path="/*" element={<MainApp />} />
              
              {/* Deployment Portal routes */}
              <Route path="/deployment_portal" element={<DeploymentPortalHome />} />
              <Route path="/deployment_portal/:roleType" element={<DeploymentLogin />} />
              <Route path="/deployment_portal/:roleType/dashboard" element={<DeploymentDashboard />} />
              <Route path="/deployment_portal/:roleType/surveys" element={<SurveyList />} />
              <Route path="/deployment_portal/:roleType/surveys/:formId" element={<PilotSurveyForm />} />
              
              {/* Admin login route */}
              <Route path="/admin/login" element={<LoginPage />} />
              
              {/* Protected admin dashboard route */}
              <Route 
                path="/queuedashboard" 
                element={
                  <ProtectedRoute>
                    <QueueDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect /admin to /admin/login */}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            </Routes>
          </Router>
          <ToastContainer />
        </ToastProvider>
      </DeploymentAuthProvider>
    </AuthProvider>
  );
}

export default App;