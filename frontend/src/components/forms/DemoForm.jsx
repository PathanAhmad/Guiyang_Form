import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '../../hooks/useForm';
import { useFormSubmission } from '../../hooks/useApi';
import { validateDemoForm } from '../../utils/validation';
import { formsAPI } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

const DemoForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { submitForm, isSubmitting, submitError, submitSuccess, submissionData } = useFormSubmission();
  
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validate,
    reset
  } = useForm(
    {
      name: '',
      email: '',
      phone: ''
    },
    validateDemoForm
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validate();
    if (!validation.isValid) {
      return;
    }

    const result = await submitForm(() => formsAPI.submitDemo(values));
    
    if (result.success && onSuccess) {
      onSuccess(result.data);
    }
  };

  const handleReset = () => {
    reset();
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('forms.demo.successTitle')}</h3>
          <p className="text-gray-600 mb-4">
            {t('forms.demo.successMessage')}
          </p>
          {submissionData?.data?.token && (
            <p className="text-sm text-gray-500 mb-4">
              {t('misc.referenceToken')}: <span className="font-mono font-medium">{submissionData.data.token}</span>
            </p>
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
        <h2 className="text-xl font-semibold text-gray-900">{t('forms.demo.title')}</h2>
        <p className="text-gray-600 mt-1">
          {t('forms.demo.subtitle')}
        </p>
      </Card.Header>
      
      <Card.Body>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="name"
              label={t('forms.demo.fields.name.label')}
              required
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={errors.name}
              placeholder={t('forms.demo.fields.name.placeholder')}
            />
            
            <Input
              name="email"
              type="email"
              label={t('forms.demo.fields.email.label')}
              required
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              placeholder={t('forms.demo.fields.email.placeholder')}
            />
          </div>
          
          <Input
            name="phone"
            type="tel"
            label={t('forms.demo.fields.phone.label')}
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            error={errors.phone}
            placeholder={t('forms.demo.fields.phone.placeholder')}
            hint={t('forms.demo.fields.phone.hint')}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? t('common.submitting') : t('forms.demo.requestDemo')}
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

export default DemoForm;
