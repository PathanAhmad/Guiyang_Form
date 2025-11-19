import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeploymentAuth } from '../../../contexts/DeploymentAuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { getResponse, getFormSubmissions, saveResponse, submitResponse } from '../../../services/pilotSurveyApi';
import { assetUrl } from '../../../utils/assets';
import SurveyProgress from './shared/SurveyProgress';
import SurveyNavigation from './shared/SurveyNavigation';
import SurveySection from './shared/SurveySection';

// Import form implementations
import Form1StudentSurvey from './Form1StudentSurvey';
import Form2TeacherAssessment from './Form2TeacherAssessment';
import Form3EquityInclusion from './Form3EquityInclusion';
import Form4CourseCatalog from './Form4CourseCatalog';
import FormBBehaviorAssessment from './FormBBehaviorAssessment';

const PilotSurveyForm = () => {
  const { roleType, formId, responseId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, roleType: currentRole, keyName, logout } = useDeploymentAuth();
  const { showToast } = useToast();
  
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({});
  const [completedSections, setCompletedSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Helper function to normalize language code for backend
  // Converts 'en-US', 'en-GB' -> 'en', 'zh-CN', 'zh-TW' -> 'zh'
  const normalizeLanguage = (langCode) => {
    if (!langCode) return 'en';
    const baseLang = langCode.split('-')[0].toLowerCase();
    // Backend only accepts 'en' or 'zh'
    return baseLang === 'zh' ? 'zh' : 'en';
  };

  // Define required fields per form and section
  const getRequiredFields = (formId, sectionNumber) => {
    const requiredFieldsMap = {
      form1: {
        1: ['consents'], // Section 0: Intro & Consent
        2: ['fullName', 'dateOfBirth', 'gender', 'languages', 'location', 'dialects'], // NOT identity (optional)
        3: ['enjoyedSubjects', 'strengths', 'pride', 'difficult', 'future', 'inspiration', 'learnNew'],
        4: ['learnBest', 'tests', 'working', 'schedule', 'focus', 'taskPreference', 'challenges', 'tools', 'perfectLesson'], // NOT dislike (can skip)
        5: ['technology', 'learningTools', 'noisyClassroom', 'changes', 'bothers', 'calm'],
        6: ['aiFrequency', 'aiActivities', 'aiEnjoyMost', 'aiConcerns', 'aiFutureSupport'],
        7: ['communicate', 'workingWith', 'sharing', 'feelSchool', 'sleep', 'energy', 'upset', 'askHelp', 'wishTeachers'],
        8: ['funLearning', 'perfectDay', 'section7LearnBest', 'share'],
      },
      form2: {
        1: ['consent'], // Section 0: Intro & Consent
        2: ['assessorName', 'assessorRole', 'frequency'],
        3: ['studentName', 'studentDOB', 'gradeLevel', 'livingSituation', 'educationHistory', 'supportFlags', 'supportNetwork', 'homeResources', 'emotionalSupport', 'pastStress', 'trustedAdult', 'identityStress'],
        4: ['overallProgress', 'strengths', 'supportAreas', 'learningStyle', 'taskApproach', 'executiveFunction', 'progressOverTime', 'gaps', 'extendedTasks', 'metacognitive'],
        5: ['enrollmentReasons', 'goals', 'passion', 'futureReaction', 'selfDoubt', 'barriers'],
        6: ['interaction', 'feedbackResponse', 'emotionalRegulation', 'behavioral', 'selfRegulate', 'triggers', 'empathy'],
        7: ['currentSupport', 'effectiveMethods', 'additionalSupport', 'recommendedGoals', 'timeOfDay', 'visualAids', 'familyResponsive', 'environmentalChanges'],
        8: ['studentAiUsage', 'studentAiActivities', 'futureAiSupport'],
        9: ['additionalObservations', 'suggestions'],
      },
      form3: {
        1: ['consent'], // Section 0: Intro & Consent
        2: ['fullName', 'role', 'tenure'],
        3: ['enrollment', 'identities', 'challengesTable', 'gapsDynamics'], // NOT otherChallenges (optional)
        4: ['unmetNeeds', 'curriculum', 'accessibility', 'assessments', 'followUp', 'leastSupported', 'schoolSystems'],
        5: ['equipped', 'workload', 'limits', 'pdNeeds', 'urgentGaps', 'feedbackLoops', 'confidence'],
        6: ['staffUsage', 'educatorTasks', 'studentPercentage', 'benefitsRisks'],
        7: ['relationshipStrengths', 'barriers', 'restorative', 'events', 'partnerships'],
        8: ['overlooked', 'suggestions', 'exclusion', 'inclusive'],
      },
      form4: {
        1: ['consent'], // Section 0: Intro & Consent
        2: ['name', 'role', 'years'],
        3: ['methodologies'], // Curriculum PDF is separate submission
        4: ['effectiveness', 'whatWorks', 'barriers', 'assessmentFormats', 'assessmentMetrics', 'midFeedback', 'effectiveFormats', 'skillTransfer'],
        5: ['onlineCourses', 'digitalFeatures', 'digitalChallenges', 'readiness', 'platforms', 'supportNeeded', 'privacyConcerns'],
        6: ['newTopics', 'approaches', 'additionalSupport', 'timeline', 'integration', 'partnerships'],
        7: ['successMetrics', 'singleChange', 'additionalComments'],
      },
      formB: {
        1: ['consent'], // Section 0: Intro & Consent
        2: ['studentName', 'studentId', 'assessmentDate', 'assessorName', 'assessorRole'],
        3: ['academicEngagement', 'taskCompletion', 'learningPace'],
        4: ['peerInteraction', 'emotionalRegulation'],
        5: ['classParticipation', 'groupWork'],
        6: ['supportUrgency'],
        7: ['adultRelationships', 'expressesNeeds'],
        8: ['overallProgress'],
        9: [], // Section 8: Strengths & Interests - no strict required fields
        10: ['overallSummary'], // Section 9: Overall Assessment Summary
      },
    };
    return requiredFieldsMap[formId]?.[sectionNumber] || [];
  };

  // Validate current section
  const validateSection = (sectionNumber) => {
    const requiredFields = getRequiredFields(formId, sectionNumber);
    const errors = {};
    
    requiredFields.forEach(field => {
      const value = formData[field];
      // Check for empty values, empty strings, or empty arrays
      if (!value || 
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0)) {
        errors[field] = true;
      }
      
      // Special validation for consents in form1, section 1
      if (formId === 'form1' && sectionNumber === 1 && field === 'consents') {
        if (!Array.isArray(value) || value.length !== 2) {
          errors[field] = true;
        }
      }
    });
    
    return errors;
  };

  const isCurrentSectionValid = useMemo(() => {
    const errors = validateSection(currentSection);
    return Object.keys(errors).length === 0;
  }, [formData, currentSection, formId]);

  // Get form component
  const getFormComponent = () => {
    const forms = {
      form1: Form1StudentSurvey,
      form2: Form2TeacherAssessment,
      form3: Form3EquityInclusion,
      form4: Form4CourseCatalog,
      formB: FormBBehaviorAssessment,
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
  }, [isAuthenticated, currentRole, roleType, formId, responseId, navigate]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For multi-submission forms with "new" route, start with empty form
      if (formId === 'formB' && responseId === 'new') {
        setFormData({});
        setCompletedSections([]);
      } else if (formId === 'formB' && responseId) {
        // Load existing response by ID for multi-submission forms
        // Note: This uses the submissions list API which returns individual responses
        const submissions = await getFormSubmissions(formId);
        const response = submissions.find(s => s._id === responseId);
        
        if (response) {
          setFormData(response.responses || {});
          setCompletedSections(response.completedSections || []);
          
          if (response.status === 'submitted') {
            setSubmitted(true);
          }
        }
      } else {
        // For single-submission forms, use existing logic
        const response = await getResponse(formId);
        
        if (response) {
          setFormData(response.responses || {});
          setCompletedSections(response.completedSections || []);
          
          // If already submitted, show submitted message
          if (response.status === 'submitted') {
            setSubmitted(true);
          }
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
    
    // Clear validation error for this field when user updates it
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const autoSave = useCallback(async () => {
    if (submitted) return; // Don't auto-save if already submitted
    
    try {
      const saveData = {
        responses: formData,
        completedSections,
        language: normalizeLanguage(i18n.language),
      };
      
      // Include responseId for multi-submission forms (except "new")
      if (formId === 'formB' && responseId && responseId !== 'new') {
        saveData.responseId = responseId;
      }
      
      const response = await saveResponse(formId, saveData);
      
      // If this was a new formB submission, update URL with the real ID
      if (formId === 'formB' && responseId === 'new' && response._id) {
        navigate(`/deployment_portal/${roleType}/surveys/formB/${response._id}`, { replace: true });
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [formId, formData, completedSections, i18n.language, submitted, responseId, roleType, navigate]);

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
      const saveData = {
        responses: formData,
        completedSections,
        language: normalizeLanguage(i18n.language),
      };
      
      // Include responseId for multi-submission forms (except "new")
      if (formId === 'formB' && responseId && responseId !== 'new') {
        saveData.responseId = responseId;
      }
      
      const response = await saveResponse(formId, saveData);
      
      // If this was a new formB submission, update URL with the real ID
      if (formId === 'formB' && responseId === 'new' && response._id) {
        navigate(`/deployment_portal/${roleType}/surveys/formB/${response._id}`, { replace: true });
      }
      
      // Show success feedback
      showToast(t('pilotSurveys:form.draftSaved'), 'success');
    } catch (err) {
      console.error('Error saving draft:', err);
      showToast(t('pilotSurveys:form.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const submitData = {
        responses: formData,
        completedSections,
        language: normalizeLanguage(i18n.language),
      };
      
      // Include responseId for multi-submission forms (except "new")
      if (formId === 'formB' && responseId && responseId !== 'new') {
        submitData.responseId = responseId;
      }
      
      await submitResponse(formId, submitData);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      showToast(t('pilotSurveys:form.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    // Validate current section before proceeding
    const errors = validateSection(currentSection);
    
    if (Object.keys(errors).length > 0) {
      // Set validation errors to show in the form
      setValidationErrors(errors);
      // Show a user-friendly message
      showToast(t('pilotSurveys:form.requiredFields'), 'warning');
      
      // Debug logging
      console.log('Validation errors:', errors);
      console.log('Error field names:', Object.keys(errors));
      
      // Wait for React to render error states, then scroll
      setTimeout(() => {
        requestAnimationFrame(() => {
          // Get the first error field name
          const errorFieldNames = Object.keys(errors);
          if (errorFieldNames.length === 0) {
            console.log('No error field names found');
            return;
          }
          
          // Find elements with data-field-name matching error fields
          const errorElements = [];
          errorFieldNames.forEach(fieldName => {
            const element = document.querySelector(`[data-field-name="${fieldName}"]`);
            console.log(`Looking for [data-field-name="${fieldName}"]:`, element);
            if (element) {
              errorElements.push(element);
            }
          });
          
          console.log('Found error elements:', errorElements.length);
          
          if (errorElements.length > 0) {
            // Scroll to the first error field
            const firstError = errorElements[0];
            console.log('Scrolling to first error:', firstError);
            
            // Scroll with better positioning
            firstError.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
            
            // Adjust scroll to add top padding (for header)
            setTimeout(() => {
              window.scrollBy({ top: -120, behavior: 'smooth' });
            }, 300);
            
            // Add pulsing effect to all error fields
            errorElements.forEach((errorElement, index) => {
              const delay = index * 50;
              
              setTimeout(() => {
                // Add a pulsing class or animation
                errorElement.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.4)';
                setTimeout(() => {
                  errorElement.style.boxShadow = '0 0 0 8px rgba(239, 68, 68, 0.2)';
                }, 300);
                setTimeout(() => {
                  errorElement.style.boxShadow = '';
                }, 600);
              }, delay);
              
              // Remove animation when user interacts
              const removeHighlight = () => {
                errorElement.style.boxShadow = '';
                errorElement.removeEventListener('click', removeHighlight, true);
                errorElement.removeEventListener('focus', removeHighlight, true);
                errorElement.removeEventListener('input', removeHighlight, true);
              };
              
              errorElement.addEventListener('click', removeHighlight, true);
              errorElement.addEventListener('focus', removeHighlight, true);
              errorElement.addEventListener('input', removeHighlight, true);
            });
          } else {
            console.log('No error elements found, trying fallback scroll');
            // Fallback: scroll to top of section if no elements found
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      }, 200);
      
      return;
    }
    
    // Clear any previous validation errors
    setValidationErrors({});
    
    // Mark current section as completed
    const sectionId = `section${currentSection}`;
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
    }
    
    setCurrentSection(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    // When navigating back, treat the previous section as not completed
    // so the progress bar reflects the reduced completion.
    const prevSectionIndex = currentSection - 1;
    if (prevSectionIndex >= 1) {
      const prevSectionId = `section${prevSectionIndex}`;
      if (completedSections.includes(prevSectionId)) {
        setCompletedSections(prev => prev.filter(id => id !== prevSectionId));
      }
    }
    setCurrentSection(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    // For multi-submission forms, go back to the assessment list
    if (formId === 'formB') {
      navigate(`/deployment_portal/${roleType}/surveys/formB/list`);
    } else {
      navigate(`/deployment_portal/${roleType}/surveys`);
    }
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
            className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600"
          >
            Back to Surveys
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.2rem] shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-[#7c59b2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('pilotSurveys:form.submitted')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t(`${formId}:thankYou.message`)}
          </p>
          <button
            onClick={handleBack}
            className="w-full px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full hover:shadow-lg transition-all duration-200"
          >
            {t('common:common.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-200 flex flex-col">
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
                    <h1 className="text-lg font-bold text-gray-900">
                      {t(`pilotSurveys:formTitles.${formId}`)}
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

      {loading ? (
        <div className="flex justify-center items-center py-12 flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <main className="flex-grow">
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
            validationErrors={validationErrors}
            canGoNext={isCurrentSectionValid}
          />
        </main>
      )}
    </div>
  );
};

export default PilotSurveyForm;


