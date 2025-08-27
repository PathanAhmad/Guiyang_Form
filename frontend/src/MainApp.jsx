import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/ui/Layout';
import HomePage from './pages/HomePage';
import UnifiedForm from './components/forms/UnifiedForm';
import TokenDisplay from './components/ui/TokenDisplay';

function MainApp() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'form', 'token'
  const [selectedFormType, setSelectedFormType] = useState(null); // 'demo', 'showcase', 'fasttrack'
  const [submissionData, setSubmissionData] = useState(null);
  
  const { isAuthenticated } = useAuth();

  const handleCardSelect = (formType) => {
    setSelectedFormType(formType);
    setCurrentView('form');
  };

  const handleFormSuccess = (data) => {
    setSubmissionData(data);
    setCurrentView('token');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedFormType(null);
    setSubmissionData(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'form':
        return (
          <UnifiedForm 
            formType={selectedFormType}
            onSuccess={handleFormSuccess}
            onBack={handleBackToHome}
          />
        );
      case 'token':
        return (
          <TokenDisplay 
            submissionData={submissionData}
            formType={selectedFormType}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return (
          <HomePage 
            onCardSelect={handleCardSelect}
          />
        );
    }
  };

  return (
    <Layout showNavigation={false}>
      {renderCurrentView()}
      
      {/* Admin access link in footer (only show if not authenticated) */}
      {!isAuthenticated && currentView === 'home' && (
        <div className="fixed bottom-4 right-4">
          <a
            href="/admin/login"
            className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-500 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white hover:text-gray-700 hover:border-gray-300 shadow-sm transition-all duration-200"
          >
            🔐 Admin Access
          </a>
        </div>
      )}
    </Layout>
  );
}

export default MainApp;
