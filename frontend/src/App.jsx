import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DeploymentAuthProvider } from './contexts/DeploymentAuthContext';

// Page components
import MainApp from './MainApp';
import LoginPage from './pages/LoginPage';
import QueueDashboard from './pages/QueueDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SurveyAccessPage from './pages/SurveyAccessPage';

// Deployment Portal components
import DeploymentPortalHome from './pages/DeploymentPortal/DeploymentPortalHome';
import DeploymentLogin from './pages/DeploymentPortal/DeploymentLogin';
import DeploymentDashboard from './pages/DeploymentPortal/DeploymentDashboard';
import SurveyList from './pages/DeploymentPortal/SurveyList';
import PilotSurveyForm from './components/forms/pilot/PilotSurveyForm';

function App() {
  return (
    <AuthProvider>
      <DeploymentAuthProvider>
        <Router>
          <Routes>
            {/* Main application routes (forms, etc.) */}
            <Route path="/*" element={<MainApp />} />

            {/* Survey access routes */}
            <Route path="/survey/management" element={<SurveyAccessPage surveyType="management" />} />
            <Route path="/survey/educators" element={<SurveyAccessPage surveyType="educators" />} />
            <Route path="/survey/learners" element={<SurveyAccessPage surveyType="learners" />} />
            
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
      </DeploymentAuthProvider>
    </AuthProvider>
  );
}

export default App;