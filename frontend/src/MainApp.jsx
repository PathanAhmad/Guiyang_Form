import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/ui/Layout';
import HomePage from './pages/HomePage';
import UnifiedForm from './components/forms/UnifiedForm';
import DemoForm from './components/forms/DemoForm';
import ShowcaseForm from './components/forms/ShowcaseForm';
import TokenDisplay from './components/ui/TokenDisplay';
import LanguageToggle from './components/ui/LanguageToggle';
import ParentSurveyPage from './pages/ParentSurveyPage';

function MainApp() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'form', 'token'
  const [selectedFormType, setSelectedFormType] = useState(null); // 'demo', 'showcase', 'fasttrack', 'parentSurvey'
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
        // Use comprehensive forms for demo and showcase, UnifiedForm for fasttrack
        if (selectedFormType === 'demo') {
          return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 relative">
              {/* Language Toggle - Fixed Position */}
              <div className="fixed top-6 right-6 z-50">
                <LanguageToggle />
              </div>
              
              <div className="max-w-4xl mx-auto px-4">
                <button
                  onClick={handleBackToHome}
                  className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('common.back')}
                </button>
                <DemoForm onSuccess={handleFormSuccess} />
              </div>
            </div>
          );
        } else if (selectedFormType === 'showcase') {
          return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 relative">
              {/* Language Toggle - Fixed Position */}
              <div className="fixed top-6 right-6 z-50">
                <LanguageToggle />
              </div>
              
              <div className="max-w-4xl mx-auto px-4">
                <button
                  onClick={handleBackToHome}
                  className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('common.back')}
                </button>
                <ShowcaseForm onSuccess={handleFormSuccess} />
              </div>
            </div>
          );
        } else if (selectedFormType === 'parentSurvey') {
          return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 relative">
              <div className="fixed top-6 right-6 z-50">
                <LanguageToggle />
              </div>
              <div className="max-w-5xl mx-auto px-4">
                <button
                  onClick={handleBackToHome}
                  className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('common.back')}
                </button>
                <ParentSurveyPage onBackToHome={handleBackToHome} />
              </div>
            </div>
          );
        } else {
          // Use UnifiedForm for fasttrack (which only needs basic fields)
          return (
            <UnifiedForm 
              formType={selectedFormType}
              onSuccess={handleFormSuccess}
              onBack={handleBackToHome}
            />
          );
        }
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
