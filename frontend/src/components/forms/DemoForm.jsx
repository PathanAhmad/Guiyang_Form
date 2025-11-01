import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '../../hooks/useForm';
import { useFormSubmission } from '../../hooks/useApi';
import { validateDemoForm } from '../../utils/validation';
import { formsAPI } from '../../services/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Radio from '../ui/Radio';
import Checkbox from '../ui/Checkbox';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { countryOptions, getDialCodeByCountry, applyDialCodeToDigits } from '../../utils/countries';

const DemoForm = ({ onSuccess }) => {
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
    validateDemoForm
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validate();
    if (!validation.isValid) {
      return;
    }

    // Prepare submission data: combine country dial code with typed phone at submit time
    const dial = getDialCodeByCountry(values.country);
    const composedPhone = applyDialCodeToDigits(values.phone, dial);
    const submissionData = {
      ...values,
      phone: composedPhone,
      ...otherFields
    };

    const result = await submitForm(() => formsAPI.submitDemo(submissionData));
    
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('forms.demo.successTitle')}</h3>
          <p className="text-gray-600 mb-4">
            {t('forms.demo.successMessage')}
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
        <h2 className="text-xl font-semibold text-gray-900">{t('forms.demo.title')}</h2>
        <p className="text-gray-600 mt-1">
          {t('forms.demo.subtitle')}
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
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.demo.sections.contact')}</h3>
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
                name="institution"
                label={t('forms.demo.fields.institution.label')}
                required
                value={values.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                onBlur={() => handleBlur('institution')}
                error={errors.institution}
                placeholder={t('forms.demo.fields.institution.placeholder')}
              />
              
              <Input
                name="position"
                label={t('forms.demo.fields.position.label')}
                required
                value={values.position}
                onChange={(e) => handleChange('position', e.target.value)}
                onBlur={() => handleBlur('position')}
                error={errors.position}
                placeholder={t('forms.demo.fields.position.placeholder')}
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
              
              <Select
                name="country"
                label={t('forms.demo.fields.country.label')}
                required
                value={values.country}
                onChange={(e) => {
                  const newCountry = e.target.value;
                  handleChange('country', newCountry);
                }}
                onBlur={() => handleBlur('country')}
                error={errors.country}
                options={[{ value: '', label: t('forms.demo.fields.country.placeholder') }, ...countryOptions]}
              />

              <Input
                name="phone"
                type="tel"
                label={t('forms.demo.fields.phone.label')}
                required
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                error={errors.phone}
                placeholder={t('forms.demo.fields.phone.placeholder')}
              />
            </div>
          </div>

          {/* Industry Background Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.demo.sections.industry')}</h3>
            
            <div className="space-y-6">
              <Radio.Group
                name="workInEducation"
                label={t('forms.demo.fields.workInEducation.label')}
                value={values.workInEducation}
                onChange={(e) => handleChange('workInEducation', e.target.value)}
                error={errors.workInEducation}
                required
                options={[
                  { value: 'yes', label: t('forms.demo.fields.workInEducation.options.yes') },
                  { value: 'no', label: t('forms.demo.fields.workInEducation.options.no') }
                ]}
              />

              {values.workInEducation === 'yes' && (
                <>
                  <Checkbox.Group
                    name="educationFields"
                    label={t('forms.demo.fields.educationFields.label')}
                    values={values.educationFields}
                    onChange={(newValues) => handleChange('educationFields', newValues)}
                    error={errors.educationFields}
                    otherOption={true}
                    otherValue={otherFields.educationFieldsOther}
                    onOtherChange={(value) => handleOtherFieldChange('educationFieldsOther', value)}
                    otherPlaceholder={t('forms.demo.fields.educationFieldsOther.placeholder')}
                    options={[
                      { value: 'k12', label: t('forms.demo.fields.educationFields.options.k12') },
                      { value: 'specialEducation', label: t('forms.demo.fields.educationFields.options.specialEducation') },
                      { value: 'preschool', label: t('forms.demo.fields.educationFields.options.preschool') },
                      { value: 'higherEducation', label: t('forms.demo.fields.educationFields.options.higherEducation') },
                      { value: 'privateTutoring', label: t('forms.demo.fields.educationFields.options.privateTutoring') },
                      { value: 'edtech', label: t('forms.demo.fields.educationFields.options.edtech') },
                      { value: 'contentCreation', label: t('forms.demo.fields.educationFields.options.contentCreation') },
                      { value: 'government', label: t('forms.demo.fields.educationFields.options.government') },
                      { value: 'nonprofit', label: t('forms.demo.fields.educationFields.options.nonprofit') },
                      { value: 'parent', label: t('forms.demo.fields.educationFields.options.parent') },
                      { value: 'other', label: t('forms.demo.fields.educationFields.options.other') }
                    ]}
                  />

                  <Radio.Group
                    name="primaryRole"
                    label={t('forms.demo.fields.primaryRole.label')}
                    value={values.primaryRole}
                    onChange={(e) => handleChange('primaryRole', e.target.value)}
                    error={errors.primaryRole}
                    required
                    options={[
                      { value: 'administrator', label: t('forms.demo.fields.primaryRole.options.administrator') },
                      { value: 'teacher', label: t('forms.demo.fields.primaryRole.options.teacher') },
                      { value: 'specialEdCoordinator', label: t('forms.demo.fields.primaryRole.options.specialEdCoordinator') },
                      { value: 'techDirector', label: t('forms.demo.fields.primaryRole.options.techDirector') },
                      { value: 'curriculumDeveloper', label: t('forms.demo.fields.primaryRole.options.curriculumDeveloper') },
                      { value: 'parent', label: t('forms.demo.fields.primaryRole.options.parent') },
                      { value: 'investor', label: t('forms.demo.fields.primaryRole.options.investor') },
                      { value: 'researcher', label: t('forms.demo.fields.primaryRole.options.researcher') },
                      { value: 'other', label: t('forms.demo.fields.primaryRole.options.other') }
                    ]}
                  />

                  {values.primaryRole === 'other' && (
                    <Input
                      name="primaryRoleOther"
                      value={otherFields.primaryRoleOther}
                      onChange={(e) => handleOtherFieldChange('primaryRoleOther', e.target.value)}
                      placeholder={t('forms.demo.fields.primaryRoleOther.placeholder')}
                      className="ml-6 max-w-md"
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* SparkOS Interest Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.demo.sections.interest')}</h3>
            
            <div className="space-y-6">
              <Checkbox.Group
                name="sparkosUsage"
                label={t('forms.demo.fields.sparkosUsage.label')}
                values={values.sparkosUsage}
                onChange={(newValues) => handleChange('sparkosUsage', newValues)}
                error={errors.sparkosUsage}
                otherOption={true}
                otherValue={otherFields.sparkosUsageOther}
                onOtherChange={(value) => handleOtherFieldChange('sparkosUsageOther', value)}
                otherPlaceholder={t('forms.demo.fields.sparkosUsageOther.placeholder')}
                options={[
                  { value: 'classroom', label: t('forms.demo.fields.sparkosUsage.options.classroom') },
                  { value: 'homelearning', label: t('forms.demo.fields.sparkosUsage.options.homelearning') },
                  { value: 'specialEducation', label: t('forms.demo.fields.sparkosUsage.options.specialEducation') },
                  { value: 'afterschool', label: t('forms.demo.fields.sparkosUsage.options.afterschool') },
                  { value: 'therapeuticIntervention', label: t('forms.demo.fields.sparkosUsage.options.therapeuticIntervention') },
                  { value: 'assessment', label: t('forms.demo.fields.sparkosUsage.options.assessment') },
                  { value: 'teacherTraining', label: t('forms.demo.fields.sparkosUsage.options.teacherTraining') },
                  { value: 'lmsIntegration', label: t('forms.demo.fields.sparkosUsage.options.lmsIntegration') },
                  { value: 'research', label: t('forms.demo.fields.sparkosUsage.options.research') },
                  { value: 'other', label: t('forms.demo.fields.sparkosUsage.options.other') }
                ]}
              />

              <Checkbox.Group
                name="ageGroups"
                label={t('forms.demo.fields.ageGroups.label')}
                values={values.ageGroups}
                onChange={(newValues) => handleChange('ageGroups', newValues)}
                error={errors.ageGroups}
                options={[
                  { value: 'preschool', label: t('forms.demo.fields.ageGroups.options.preschool') },
                  { value: 'earlyElementary', label: t('forms.demo.fields.ageGroups.options.earlyElementary') },
                  { value: 'lateElementary', label: t('forms.demo.fields.ageGroups.options.lateElementary') },
                  { value: 'middleSchool', label: t('forms.demo.fields.ageGroups.options.middleSchool') },
                  { value: 'highSchool', label: t('forms.demo.fields.ageGroups.options.highSchool') },
                  { value: 'mixedAges', label: t('forms.demo.fields.ageGroups.options.mixedAges') }
                ]}
              />

              <Radio.Group
                name="neurodiversityWork"
                label={t('forms.demo.fields.neurodiversityWork.label')}
                value={values.neurodiversityWork}
                onChange={(e) => handleChange('neurodiversityWork', e.target.value)}
                error={errors.neurodiversityWork}
                options={[
                  { value: 'frequently', label: t('forms.demo.fields.neurodiversityWork.options.frequently') },
                  { value: 'occasionally', label: t('forms.demo.fields.neurodiversityWork.options.occasionally') },
                  { value: 'interestedNo', label: t('forms.demo.fields.neurodiversityWork.options.interestedNo') },
                  { value: 'no', label: t('forms.demo.fields.neurodiversityWork.options.no') }
                ]}
              />

              {(values.neurodiversityWork === 'frequently' || values.neurodiversityWork === 'occasionally') && (
                <Checkbox.Group
                  name="supportedConditions"
                  label={t('forms.demo.fields.supportedConditions.label')}
                  values={values.supportedConditions}
                  onChange={(newValues) => handleChange('supportedConditions', newValues)}
                  error={errors.supportedConditions}
                  otherOption={true}
                  otherValue={otherFields.supportedConditionsOther}
                  onOtherChange={(value) => handleOtherFieldChange('supportedConditionsOther', value)}
                  otherPlaceholder={t('forms.demo.fields.supportedConditionsOther.placeholder')}
                  options={[
                    { value: 'adhd', label: t('forms.demo.fields.supportedConditions.options.adhd') },
                    { value: 'autism', label: t('forms.demo.fields.supportedConditions.options.autism') },
                    { value: 'learningDisabilities', label: t('forms.demo.fields.supportedConditions.options.learningDisabilities') },
                    { value: 'dyslexia', label: t('forms.demo.fields.supportedConditions.options.dyslexia') },
                    { value: 'processingDisorders', label: t('forms.demo.fields.supportedConditions.options.processingDisorders') },
                    { value: 'other', label: t('forms.demo.fields.supportedConditions.options.other') }
                  ]}
                />
              )}
            </div>
          </div>

          {/* Specific Interest Points Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.demo.sections.features')}</h3>
            
            <div className="space-y-6">
              <Checkbox.Group
                name="featuresInterest"
                label={t('forms.demo.fields.featuresInterest.label')}
                values={values.featuresInterest}
                onChange={(newValues) => handleChange('featuresInterest', newValues)}
                error={errors.featuresInterest}
                required
                maxSelection={3}
                options={[
                  { value: 'voiceEmotion', label: t('forms.demo.fields.featuresInterest.options.voiceEmotion') },
                  { value: 'videoEmotion', label: t('forms.demo.fields.featuresInterest.options.videoEmotion') },
                  { value: 'adaptiveLearning', label: t('forms.demo.fields.featuresInterest.options.adaptiveLearning') },
                  { value: 'progressTracking', label: t('forms.demo.fields.featuresInterest.options.progressTracking') },
                  { value: 'personalizedCurriculum', label: t('forms.demo.fields.featuresInterest.options.personalizedCurriculum') },
                  { value: 'multisensoryLearning', label: t('forms.demo.fields.featuresInterest.options.multisensoryLearning') },
                  { value: 'collaboration', label: t('forms.demo.fields.featuresInterest.options.collaboration') },
                  { value: 'behaviorInsights', label: t('forms.demo.fields.featuresInterest.options.behaviorInsights') }
                ]}
              />

              <Radio.Group
                name="implementationTimeline"
                label={t('forms.demo.fields.implementationTimeline.label')}
                value={values.implementationTimeline}
                onChange={(e) => handleChange('implementationTimeline', e.target.value)}
                error={errors.implementationTimeline}
                required
                options={[
                  { value: 'immediate', label: t('forms.demo.fields.implementationTimeline.options.immediate') },
                  { value: 'shortTerm', label: t('forms.demo.fields.implementationTimeline.options.shortTerm') },
                  { value: 'mediumTerm', label: t('forms.demo.fields.implementationTimeline.options.mediumTerm') },
                  { value: 'longTerm', label: t('forms.demo.fields.implementationTimeline.options.longTerm') },
                  { value: 'research', label: t('forms.demo.fields.implementationTimeline.options.research') }
                ]}
              />

              <Radio.Group
                name="pilotInterest"
                label={t('forms.demo.fields.pilotInterest.label')}
                value={values.pilotInterest}
                onChange={(e) => handleChange('pilotInterest', e.target.value)}
                error={errors.pilotInterest}
                required
                options={[
                  { value: 'yes', label: t('forms.demo.fields.pilotInterest.options.yes') },
                  { value: 'no', label: t('forms.demo.fields.pilotInterest.options.no') },
                  { value: 'maybe', label: t('forms.demo.fields.pilotInterest.options.maybe') }
                ]}
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.demo.sections.additional')}</h3>
            
            <div className="space-y-6">
              <Textarea
                name="currentChallenges"
                label={t('forms.demo.fields.currentChallenges.label')}
                value={values.currentChallenges}
                onChange={(e) => handleChange('currentChallenges', e.target.value)}
                onBlur={() => handleBlur('currentChallenges')}
                error={errors.currentChallenges}
                placeholder={t('forms.demo.fields.currentChallenges.placeholder')}
                rows={4}
              />

              <Textarea
                name="additionalComments"
                label={t('forms.demo.fields.additionalComments.label')}
                value={values.additionalComments}
                onChange={(e) => handleChange('additionalComments', e.target.value)}
                onBlur={() => handleBlur('additionalComments')}
                error={errors.additionalComments}
                placeholder={t('forms.demo.fields.additionalComments.placeholder')}
                rows={4}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
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
