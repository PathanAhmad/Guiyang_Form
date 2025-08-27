import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '../../hooks/useForm';
import { useFormSubmission } from '../../hooks/useApi';
import { validateFasttrackForm, validateDemoForm, validateShowcaseForm } from '../../utils/validation';
import { formsAPI } from '../../services/api';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Card from '../ui/Card';

const UnifiedForm = ({ formType, onSuccess, onBack }) => {
  const { t } = useTranslation();
  const { submitForm, isSubmitting, submitError, submitSuccess, submissionData } = useFormSubmission();
  
  // Define form fields based on form type
  const getInitialValues = () => {
    const base = {
      name: '',
      email: '',
      phone: '',
    };

    if (formType === 'fasttrack') {
      return {
        ...base,
        company: '',
        role: '',
        areaOfInterest: '',
        message: ''
      };
    }

    return base;
  };

  // Choose validation function based on form type
  const getValidationFunction = () => {
    switch (formType) {
      case 'demo':
        return validateDemoForm;
      case 'showcase':
        return validateShowcaseForm;
      case 'fasttrack':
        return validateFasttrackForm;
      default:
        return validateDemoForm;
    }
  };

  // Choose API submission function based on form type
  const getSubmissionFunction = (values) => {
    switch (formType) {
      case 'demo':
        return formsAPI.submitDemo(values);
      case 'showcase':
        return formsAPI.submitShowcase(values);
      case 'fasttrack':
        return formsAPI.submitFasttrack(values);
      default:
        return formsAPI.submitDemo(values);
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validate,
    reset
  } = useForm(
    getInitialValues(),
    getValidationFunction()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validate();
    if (!validation.isValid) {
      return;
    }

    const result = await submitForm(() => getSubmissionFunction(values));
    
    if (result.success && onSuccess) {
      onSuccess(result.data);
    }
  };

  const handleReset = () => {
    reset();
  };

  // Get form title and subtitle based on type
  const getFormTitle = () => t(`forms.${formType}.title`);
  const getFormSubtitle = () => t(`forms.${formType}.subtitle`);
  const getSubmitButtonText = () => {
    switch (formType) {
      case 'demo':
        return t('forms.demo.requestDemo');
      case 'showcase':
        return t('forms.showcase.requestShowcase');
      case 'fasttrack':
        return t('forms.fasttrack.submitApplication');
      default:
        return t('common.submit');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </button>

        <Card className="animate-fade-in shadow-2xl border-2 border-gray-100">
          <Card.Header className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{getFormTitle()}</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              {getFormSubtitle()}
            </p>
          </Card.Header>
          
          <Card.Body className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Basic Fields - All Forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="name"
                  label={t(`forms.${formType}.fields.name.label`)}
                  required
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  error={errors.name}
                  placeholder={t(`forms.${formType}.fields.name.placeholder`)}
                  className="text-lg"
                />
                
                <Input
                  name="email"
                  type="email"
                  label={t(`forms.${formType}.fields.email.label`)}
                  required
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={errors.email}
                  placeholder={t(`forms.${formType}.fields.email.placeholder`)}
                  className="text-lg"
                />
              </div>

              <Input
                name="phone"
                type="tel"
                label={t(`forms.${formType}.fields.phone.label`)}
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                error={errors.phone}
                placeholder={t(`forms.${formType}.fields.phone.placeholder`)}
                hint={formType !== 'fasttrack' ? t(`forms.${formType}.fields.phone.hint`) : undefined}
                className="text-lg"
              />

              {/* Fast Track Additional Fields */}
              {formType === 'fasttrack' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      name="company"
                      label={t('forms.fasttrack.fields.company.label')}
                      required
                      value={values.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      onBlur={() => handleBlur('company')}
                      error={errors.company}
                      placeholder={t('forms.fasttrack.fields.company.placeholder')}
                      className="text-lg"
                    />
                    
                    <Input
                      name="role"
                      label={t('forms.fasttrack.fields.role.label')}
                      required
                      value={values.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      onBlur={() => handleBlur('role')}
                      error={errors.role}
                      placeholder={t('forms.fasttrack.fields.role.placeholder')}
                      className="text-lg"
                    />
                  </div>
                  
                  <Input
                    name="areaOfInterest"
                    label={t('forms.fasttrack.fields.areaOfInterest.label')}
                    value={values.areaOfInterest}
                    onChange={(e) => handleChange('areaOfInterest', e.target.value)}
                    onBlur={() => handleBlur('areaOfInterest')}
                    error={errors.areaOfInterest}
                    placeholder={t('forms.fasttrack.fields.areaOfInterest.placeholder')}
                    className="text-lg"
                  />
                  
                  <Textarea
                    name="message"
                    label={t('forms.fasttrack.fields.message.label')}
                    value={values.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    error={errors.message}
                    placeholder={t('forms.fasttrack.fields.message.placeholder')}
                    hint={t('forms.fasttrack.fields.message.hint')}
                    rows={4}
                    className="text-lg"
                  />
                </>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="flex-1 text-lg py-4"
                  size="lg"
                >
                  {isSubmitting ? t('common.submitting') : getSubmitButtonText()}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="text-lg py-4"
                  size="lg"
                >
                  {t('common.clearForm')}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedForm;
