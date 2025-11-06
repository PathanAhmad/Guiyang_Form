import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '../../hooks/useForm';
import { useFormSubmission } from '../../hooks/useApi';
import { validateFasttrackForm } from '../../utils/validation';
import { formsAPI } from '../../services/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { countryOptions, getDialCodeByCountry, applyDialCodeToDigits } from '../../utils/countries';

const FastTrackForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { submitForm, isSubmitting, submitError, submitSuccess, submissionData } = useFormSubmission();
  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset
  } = useForm(
    {
      name: '',
      email: '',
      country: '',
      phone: '',
      company: '',
      role: '',
      areaOfInterest: '',
      message: '',
      wechatId: '',
      whatsappId: ''
    },
    validateFasttrackForm
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validate();
    if (!validation.isValid) {
      return;
    }

    const dial = getDialCodeByCountry(values.country);
    const composedPhone = applyDialCodeToDigits(values.phone, dial);
    const payload = { ...values, phone: composedPhone };

    const result = await submitForm(() => formsAPI.submitFasttrack(payload));
    
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('forms.fasttrack.successTitle')}</h3>
          <p className="text-gray-600 mb-4">
            {t('forms.fasttrack.successMessage')}
          </p>
          {submissionData?.data?.token && (
            <p className="text-sm text-gray-500 mb-4">
              {t('misc.referenceToken')}: <span className="font-mono font-medium">{submissionData.data.token}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => onSuccess && onSuccess(submissionData?.data)} variant="outline">
              {t('common.backToHome')}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-900">{t('forms.fasttrack.title')}</h2>
        <p className="text-gray-600 mt-1">
          {t('forms.fasttrack.subtitle')}
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
              label={t('forms.fasttrack.fields.name.label')}
              required
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={touched.name ? errors.name : ''}
              placeholder={t('forms.fasttrack.fields.name.placeholder')}
            />
            
            <Input
              name="email"
              type="email"
              label={t('forms.fasttrack.fields.email.label')}
              required
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : ''}
              placeholder={t('forms.fasttrack.fields.email.placeholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              name="country"
              label={t('forms.fasttrack.fields.country.label')}
              value={values.country}
              onChange={(e) => {
                const newCountry = e.target.value;
                handleChange('country', newCountry);
              }}
              onBlur={() => handleBlur('country')}
              error={touched.country ? errors.country : ''}
              options={[{ value: '', label: t('forms.fasttrack.fields.country.placeholder') }, ...countryOptions]}
            />

            <Input
              name="phone"
              type="tel"
              label={t('forms.fasttrack.fields.phone.label')}
              value={values.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={touched.phone ? errors.phone : ''}
              placeholder={t('forms.fasttrack.fields.phone.placeholder')}
            />

            <Input
              name="company"
              label={t('forms.fasttrack.fields.company.label')}
              required
              value={values.company}
              onChange={(e) => handleChange('company', e.target.value)}
              onBlur={() => handleBlur('company')}
              error={touched.company ? errors.company : ''}
              placeholder={t('forms.fasttrack.fields.company.placeholder')}
            />
          </div>
          
          <Input
            name="role"
            label={t('forms.fasttrack.fields.role.label')}
            required
            value={values.role}
            onChange={(e) => handleChange('role', e.target.value)}
            onBlur={() => handleBlur('role')}
            error={touched.role ? errors.role : ''}
            placeholder={t('forms.fasttrack.fields.role.placeholder')}
          />
          
          <Select
            name="areaOfInterest"
            label={t('forms.fasttrack.fields.areaOfInterest.label')}
            value={values.areaOfInterest}
            onChange={(e) => handleChange('areaOfInterest', e.target.value)}
            onBlur={() => handleBlur('areaOfInterest')}
            error={touched.areaOfInterest ? errors.areaOfInterest : ''}
            options={[
              { value: '', label: t('forms.fasttrack.fields.areaOfInterest.placeholder') },
              { value: 'learn', label: t('forms.fasttrack.fields.areaOfInterest.options.learnSparkOS') },
              { value: 'demo', label: t('forms.fasttrack.fields.areaOfInterest.options.requestDemo') },
              { value: 'pilot', label: t('forms.fasttrack.fields.areaOfInterest.options.pilot') },
              { value: 'partnership', label: t('forms.fasttrack.fields.areaOfInterest.options.partnership') },
              { value: 'research', label: t('forms.fasttrack.fields.areaOfInterest.options.research') },
              { value: 'press', label: t('forms.fasttrack.fields.areaOfInterest.options.press') },
              { value: 'other', label: t('forms.fasttrack.fields.areaOfInterest.options.other') }
            ]}
          />
          
          <Textarea
            name="message"
            label={t('forms.fasttrack.fields.message.label')}
            value={values.message}
            onChange={(e) => handleChange('message', e.target.value)}
            onBlur={() => handleBlur('message')}
            error={touched.message ? errors.message : ''}
            placeholder={t('forms.fasttrack.fields.message.placeholder')}
            hint={t('forms.fasttrack.fields.message.hint')}
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="wechatId"
              label={t('forms.fasttrack.fields.wechatId.label')}
              value={values.wechatId}
              onChange={(e) => handleChange('wechatId', e.target.value)}
              onBlur={() => handleBlur('wechatId')}
              error={touched.wechatId ? errors.wechatId : ''}
              placeholder={t('forms.fasttrack.fields.wechatId.placeholder')}
              hint={t('forms.fasttrack.fields.wechatId.hint')}
            />
            
            <Input
              name="whatsappId"
              label={t('forms.fasttrack.fields.whatsappId.label')}
              value={values.whatsappId}
              onChange={(e) => handleChange('whatsappId', e.target.value)}
              onBlur={() => handleBlur('whatsappId')}
              error={touched.whatsappId ? errors.whatsappId : ''}
              placeholder={t('forms.fasttrack.fields.whatsappId.placeholder')}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? t('common.submitting') : t('forms.fasttrack.submitApplication')}
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

export default FastTrackForm;
