import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeploymentAuth } from '../../../contexts/DeploymentAuthContext';
import { getResponse, saveResponse, submitResponse } from '../../../services/pilotSurveyApi';
import { assetUrl } from '../../../utils/assets';
import SurveyProgress from './shared/SurveyProgress';
import SurveyNavigation from './shared/SurveyNavigation';
import SurveySection from './shared/SurveySection';

// Import form implementations
import Form1StudentSurvey from './Form1StudentSurvey';
import Form2TeacherAssessment from './Form2TeacherAssessment';
import Form3EquityInclusion from './Form3EquityInclusion';
import Form4CourseCatalog from './Form4CourseCatalog';

const PilotSurveyForm = () => {
  const { roleType, formId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, roleType: currentRole, keyName, logout } = useDeploymentAuth();
  
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({});
  const [completedSections, setCompletedSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Get form component
  const getFormComponent = () => {
    const forms = {
      form1: Form1StudentSurvey,
      form2: Form2TeacherAssessment,
      form3: Form3EquityInclusion,
      form4: Form4CourseCatalog,
    };
    return forms[formId] || null;
  };

  const FormComponent = getFormComponent();

  useEffect(() => {
    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || currentRole !== roleType) {
      navigate(`/deployment_portal/${roleType}`);
      return;
    }

    loadFormData();
  }, [isAuthenticated, currentRole, roleType, formId, navigate]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getResponse(formId);
      
      if (response) {
        setFormData(response.responses || {});
        setCompletedSections(response.completedSections || []);
        
        // If already submitted, show submitted message
        if (response.status === 'submitted') {
          setSubmitted(true);
        }
      }
    } catch (err) {
      console.error('Error loading form data:', err);
      setError(err.message || 'Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const autoSave = useCallback(async () => {
    if (submitted) return; // Don't auto-save if already submitted
    
    try {
      await saveResponse(formId, {
        responses: formData,
        completedSections,
        language: i18n.language,
      });
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [formId, formData, completedSections, i18n.language, submitted]);

  // Auto-save on field change (debounced)
  useEffect(() => {
    if (loading || submitted) return;
    
    const timer = setTimeout(() => {
      autoSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, autoSave, loading, submitted]);

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      await saveResponse(formId, {
        responses: formData,
        completedSections,
        language: i18n.language,
      });
      // Show success feedback
      alert(t('pilotSurveys.form.draftSaved'));
    } catch (err) {
      console.error('Error saving draft:', err);
      alert(t('pilotSurveys.form.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await submitResponse(formId, {
        responses: formData,
        completedSections,
        language: i18n.language,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert(t('pilotSurveys.form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    // Mark current section as completed
    const sectionId = `section${currentSection}`;
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
    }
    
    setCurrentSection(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    setCurrentSection(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    navigate(`/deployment_portal/${roleType}/surveys`);
  };

  const handleLogout = () => {
    logout();
    navigate('/deployment_portal');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (!isAuthenticated || currentRole !== roleType) {
    return null;
  }

  if (!FormComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h2>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Back to Surveys
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-300/10 to-primary-400/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('pilotSurveys.form.submitted')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t(`${formId}.thankYou.message`)}
          </p>
          <button
            onClick={handleBack}
            className="w-full px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            {t('common.common.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-300/10 to-primary-400/10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={assetUrl('/Images/SparkOSFullLogo.svg')}
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
                    <h1 className="text-lg font-bold text-gray-900">
                      {t(`pilotSurveys.formTitles.${formId}`)}
                    </h1>
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
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {i18n.language === 'en' ? '中文' : 'English'}
              </button>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('common.common.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <FormComponent
            currentSection={currentSection}
            formData={formData}
            onFieldChange={handleFieldChange}
            Progress={SurveyProgress}
            Navigation={SurveyNavigation}
            Section={SurveySection}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            saving={saving}
            submitting={submitting}
            completedSections={completedSections}
          />
        </>
      )}
    </div>
  );
};

export default PilotSurveyForm;


