import { useState } from 'react';
import Layout from './components/ui/Layout';
import HomePage from './pages/HomePage';
import UnifiedForm from './components/forms/UnifiedForm';
import TokenDisplay from './components/ui/TokenDisplay';
import QueueDashboard from './pages/QueueDashboard';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'form', 'token', 'queue'
  const [selectedFormType, setSelectedFormType] = useState(null); // 'demo', 'showcase', 'fasttrack'
  const [submissionData, setSubmissionData] = useState(null);

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

  const handleViewQueue = () => {
    setCurrentView('queue');
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
      case 'queue':
        return (
          <QueueDashboard onBack={handleBackToHome} />
        );
      default:
        return (
          <HomePage 
            onCardSelect={handleCardSelect}
            onViewQueue={handleViewQueue}
          />
        );
    }
  };

  return (
    <Layout showNavigation={currentView === 'queue'}>
      {renderCurrentView()}
    </Layout>
  );
}

export default App;