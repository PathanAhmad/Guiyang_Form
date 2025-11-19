import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeploymentAuth } from '../../contexts/DeploymentAuthContext';
import { getAvailableForms } from '../../services/pilotSurveyApi';
import { assetUrl } from '../../utils/assets';
import SparkOSTypoLogo from '../../Images/SparkOSTypo.svg';

const SurveyList = () => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, roleType: currentRole, keyName, logout } = useDeploymentAuth();
  
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || currentRole !== roleType) {
      navigate(`/deployment_portal/${roleType}`);
      return;
    }

    loadForms();
  }, [isAuthenticated, currentRole, roleType, navigate]);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const availableForms = await getAvailableForms();
      setForms(availableForms);
    } catch (err) {
      console.error('Error loading forms:', err);
      setError(err.message || 'Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  const handleFormClick = (formId) => {
    navigate(`/deployment_portal/${roleType}/surveys/${formId}`);
  };

  const handleBack = () => {
    navigate(`/deployment_portal/${roleType}/dashboard`);
  };

  const handleLogout = () => {
    logout();
    navigate('/deployment_portal');
  };

  const getStatusBadge = (status) => {
    const badges = {
      not_started: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        label: t('pilotSurveys:surveyList.status.notStarted'),
      },
      draft: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        label: t('pilotSurveys:surveyList.status.inProgress'),
      },
      submitted: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: t('pilotSurveys:surveyList.status.completed'),
      },
    };

    const badge = badges[status] || badges.not_started;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getActionButton = (form) => {
    if (form.status === 'submitted') {
      return (
        <button
          onClick={() => handleFormClick(form.formId)}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          {t('pilotSurveys:surveyList.viewSurvey')}
        </button>
      );
    } else if (form.status === 'draft') {
      return (
        <button
          onClick={() => handleFormClick(form.formId)}
          className="w-full px-4 py-2 bg-[#7c59b2] text-white rounded-lg font-medium hover:bg-[#62458f] hover:shadow-lg transition-all duration-200"
        >
          {t('pilotSurveys:surveyList.continueSurvey')}
        </button>
      );
    } else {
      return (
        <button
          onClick={() => handleFormClick(form.formId)}
          className="w-full px-4 py-2 bg-[#7c59b2] text-white rounded-lg font-medium hover:bg-[#62458f] hover:shadow-lg transition-all duration-200"
        >
          {t('pilotSurveys:surveyList.startSurvey')}
        </button>
      );
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (!isAuthenticated || currentRole !== roleType) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={SparkOSTypoLogo}
                alt="SparkOS Logo"
                className="h-8 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{t('pilotSurveys:surveyList.title')}</h1>
                    {keyName && (
                      <p className="text-xs text-gray-500">Access: {keyName}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {i18n.language === 'en' ? '中文' : 'English'}
              </button>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('common:common.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-8">
          {t('pilotSurveys:surveyList.subtitle')}
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-lg font-semibold text-red-900 mb-1">Error</h4>
                <p className="text-red-800">{error}</p>
                <button
                  onClick={loadForms}
                  className="mt-3 text-red-600 hover:text-red-800 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forms List */}
        {!loading && !error && forms.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-gray-600">{t('pilotSurveys:surveyList.noSurveys')}</p>
          </div>
        )}

        {!loading && !error && forms.length > 0 && (
          <div className="space-y-6">
            {forms.map((form) => (
              <div
                key={form.formId}
                className="bg-white rounded-[2.2rem] shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#7c59b2] mb-2">
                        {t(`pilotSurveys:formTitles.${form.formId}`)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {t(`pilotSurveys:formDescriptions.${form.formId}`)}
                      </p>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(form.status)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {form.status !== 'not_started' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {t('pilotSurveys:surveyList.progress', { percent: form.completionPercentage })}
                        </span>
                        <span className="text-sm text-gray-500">
                          {form.completedSections.length} / {form.totalSections} sections
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${form.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Last Modified */}
                  {form.lastModified && (
                    <p className="text-xs text-gray-500 mb-4">
                      Last modified: {new Date(form.lastModified).toLocaleDateString()}
                    </p>
                  )}

                  {/* Action Button */}
                  {getActionButton(form)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyList;

