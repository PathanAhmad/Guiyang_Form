import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Page components
import MainApp from './MainApp';
import LoginPage from './pages/LoginPage';
import QueueDashboard from './pages/QueueDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main application routes (forms, etc.) */}
          <Route path="/*" element={<MainApp />} />
          
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
    </AuthProvider>
  );
}

export default App;