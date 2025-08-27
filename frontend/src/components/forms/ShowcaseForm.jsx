import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '../../hooks/useForm';
import { useFormSubmission } from '../../hooks/useApi';
import { validateShowcaseForm } from '../../utils/validation';
import { formsAPI } from '../../services/api';
import Input from '../ui/Input';
import Radio from '../ui/Radio';
import Checkbox from '../ui/Checkbox';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Card from '../ui/Card';

const ShowcaseForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { submitForm, isSubmitting, submitError, submitSuccess, submissionData } = useFormSubmission();
  
  // Additional state for "other" options
  const [otherFields, setOtherFields] = useState({
    educationFieldsOther: '',
    primaryRoleOther: '',
    sparkosUsageOther: '',
    supportedConditionsOther: ''
  });

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validate,
    reset
  } = useForm(
    {
      // Contact Information
      name: '',
      institution: '',
      position: '',
      email: '',
      phone: '',
      country: '',
      
      // Industry Background
      workInEducation: '',
      educationFields: [],
      primaryRole: '',
      
      // SparkOS Interest
      sparkosUsage: [],
      ageGroups: [],
      neurodiversityWork: '',
      supportedConditions: [],
      
      // Specific Interest Points
      featuresInterest: [],
      implementationTimeline: '',
      pilotInterest: '',
      
      // Additional Information
      currentChallenges: '',
      additionalComments: ''
    },
    validateShowcaseForm
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validate();
    if (!validation.isValid) {
      return;
    }

    // Prepare submission data with "other" fields
    const submissionData = {
      ...values,
      ...otherFields
    };

    const result = await submitForm(() => formsAPI.submitShowcase(submissionData));
    
    if (result.success && onSuccess) {
      onSuccess(result.data);
    }
  };

  const handleReset = () => {
    reset();
    setOtherFields({
      educationFieldsOther: '',
      primaryRoleOther: '',
      sparkosUsageOther: '',
      supportedConditionsOther: ''
    });
  };

  const handleOtherFieldChange = (field, value) => {
    setOtherFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (submitSuccess) {
    return (
      <Card className="animate-fade-in">
        <Card.Body className="text-center py-8">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('forms.showcase.successTitle')}</h3>
          <p className="text-gray-600 mb-4">
            {t('forms.showcase.successMessage')}
          </p>
          {submissionData?.data?.token && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900 font-medium mb-2">{t('misc.importantNotice')}</p>
              <p className="text-sm text-blue-800 mb-2">{t('misc.tokenInstructions')}</p>
              <p className="text-lg font-mono font-bold text-blue-900 bg-white px-3 py-2 rounded border">
                {submissionData.data.token}
              </p>
              <p className="text-xs text-blue-700 mt-2">{t('misc.screenshotReminder')}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleReset} variant="outline">
              {t('common.submitAnotherRequest')}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-900">{t('forms.showcase.title')}</h2>
        <p className="text-gray-600 mt-1">
          {t('forms.showcase.subtitle')}
        </p>
      </Card.Header>
      
      <Card.Body>
        <form onSubmit={handleSubmit} className="space-y-8">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.334 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{t('forms.errors.submissionError')}</h3>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.showcase.sections.contact')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="name"
                label={t('forms.showcase.fields.name.label')}
                required
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                error={errors.name}
                placeholder={t('forms.showcase.fields.name.placeholder')}
              />
              
              <Input
                name="institution"
                label={t('forms.showcase.fields.institution.label')}
                required
                value={values.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                onBlur={() => handleBlur('institution')}
                error={errors.institution}
                placeholder={t('forms.showcase.fields.institution.placeholder')}
              />
              
              <Input
                name="position"
                label={t('forms.showcase.fields.position.label')}
                required
                value={values.position}
                onChange={(e) => handleChange('position', e.target.value)}
                onBlur={() => handleBlur('position')}
                error={errors.position}
                placeholder={t('forms.showcase.fields.position.placeholder')}
              />
              
              <Input
                name="email"
                type="email"
                label={t('forms.showcase.fields.email.label')}
                required
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={errors.email}
                placeholder={t('forms.showcase.fields.email.placeholder')}
              />
              
              <Input
                name="phone"
                type="tel"
                label={t('forms.showcase.fields.phone.label')}
                required
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                error={errors.phone}
                placeholder={t('forms.showcase.fields.phone.placeholder')}
              />
              
              <Input
                name="country"
                label={t('forms.showcase.fields.country.label')}
                required
                value={values.country}
                onChange={(e) => handleChange('country', e.target.value)}
                onBlur={() => handleBlur('country')}
                error={errors.country}
                placeholder={t('forms.showcase.fields.country.placeholder')}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? t('common.submitting') : t('forms.showcase.requestShowcase')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              {t('common.clearForm')}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default ShowcaseForm;
