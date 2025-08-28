import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '../../hooks/useForm';
import { useFormSubmission } from '../../hooks/useApi';
import { validateShowcaseForm } from '../../utils/validation';
import { formsAPI } from '../../services/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Radio from '../ui/Radio';
import Checkbox from '../ui/Checkbox';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { countryOptions, getDialCodeByCountry, applyDialCodeToDigits } from '../../utils/countries';

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

    // Prepare submission data: combine country dial code with typed phone at submit time
    const dial = getDialCodeByCountry(values.country);
    const composedPhone = applyDialCodeToDigits(values.phone, dial);
    const submissionData = {
      ...values,
      phone: composedPhone,
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
              
              <Select
                name="country"
                label={t('forms.showcase.fields.country.label')}
                required
                value={values.country}
                onChange={(e) => {
                  const newCountry = e.target.value;
                  handleChange('country', newCountry);
                }}
                onBlur={() => handleBlur('country')}
                error={errors.country}
                options={[{ value: '', label: t('forms.showcase.fields.country.placeholder') }, ...countryOptions]}
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
            </div>
          </div>

          {/* Industry Background Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.showcase.sections.industry')}</h3>
            
            <div className="space-y-6">
              <Radio.Group
                name="workInEducation"
                label={t('forms.showcase.fields.workInEducation.label')}
                value={values.workInEducation}
                onChange={(e) => handleChange('workInEducation', e.target.value)}
                error={errors.workInEducation}
                required
                options={[
                  { value: 'yes', label: t('forms.showcase.fields.workInEducation.options.yes') },
                  { value: 'no', label: t('forms.showcase.fields.workInEducation.options.no') }
                ]}
              />

              {values.workInEducation === 'yes' && (
                <>
                  <Checkbox.Group
                    name="educationFields"
                    label={t('forms.showcase.fields.educationFields.label')}
                    values={values.educationFields}
                    onChange={(newValues) => handleChange('educationFields', newValues)}
                    error={errors.educationFields}
                    otherOption={true}
                    otherValue={otherFields.educationFieldsOther}
                    onOtherChange={(value) => handleOtherFieldChange('educationFieldsOther', value)}
                    otherPlaceholder={t('forms.showcase.fields.educationFieldsOther.placeholder')}
                    options={[
                      { value: 'k12', label: t('forms.showcase.fields.educationFields.options.k12') },
                      { value: 'specialEducation', label: t('forms.showcase.fields.educationFields.options.specialEducation') },
                      { value: 'preschool', label: t('forms.showcase.fields.educationFields.options.preschool') },
                      { value: 'higherEducation', label: t('forms.showcase.fields.educationFields.options.higherEducation') },
                      { value: 'privateTutoring', label: t('forms.showcase.fields.educationFields.options.privateTutoring') },
                      { value: 'edtech', label: t('forms.showcase.fields.educationFields.options.edtech') },
                      { value: 'contentCreation', label: t('forms.showcase.fields.educationFields.options.contentCreation') },
                      { value: 'government', label: t('forms.showcase.fields.educationFields.options.government') },
                      { value: 'nonprofit', label: t('forms.showcase.fields.educationFields.options.nonprofit') },
                      { value: 'parent', label: t('forms.showcase.fields.educationFields.options.parent') },
                      { value: 'other', label: t('forms.showcase.fields.educationFields.options.other') }
                    ]}
                  />

                  <Radio.Group
                    name="primaryRole"
                    label={t('forms.showcase.fields.primaryRole.label')}
                    value={values.primaryRole}
                    onChange={(e) => handleChange('primaryRole', e.target.value)}
                    error={errors.primaryRole}
                    required
                    options={[
                      { value: 'administrator', label: t('forms.showcase.fields.primaryRole.options.administrator') },
                      { value: 'teacher', label: t('forms.showcase.fields.primaryRole.options.teacher') },
                      { value: 'specialEdCoordinator', label: t('forms.showcase.fields.primaryRole.options.specialEdCoordinator') },
                      { value: 'techDirector', label: t('forms.showcase.fields.primaryRole.options.techDirector') },
                      { value: 'curriculumDeveloper', label: t('forms.showcase.fields.primaryRole.options.curriculumDeveloper') },
                      { value: 'parent', label: t('forms.showcase.fields.primaryRole.options.parent') },
                      { value: 'investor', label: t('forms.showcase.fields.primaryRole.options.investor') },
                      { value: 'researcher', label: t('forms.showcase.fields.primaryRole.options.researcher') },
                      { value: 'other', label: t('forms.showcase.fields.primaryRole.options.other') }
                    ]}
                  />

                  {values.primaryRole === 'other' && (
                    <Input
                      name="primaryRoleOther"
                      value={otherFields.primaryRoleOther}
                      onChange={(e) => handleOtherFieldChange('primaryRoleOther', e.target.value)}
                      placeholder={t('forms.showcase.fields.primaryRoleOther.placeholder')}
                      className="ml-6 max-w-md"
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* SparkOS Interest Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.showcase.sections.interest')}</h3>
            
            <div className="space-y-6">
              <Checkbox.Group
                name="sparkosUsage"
                label={t('forms.showcase.fields.sparkosUsage.label')}
                values={values.sparkosUsage}
                onChange={(newValues) => handleChange('sparkosUsage', newValues)}
                error={errors.sparkosUsage}
                otherOption={true}
                otherValue={otherFields.sparkosUsageOther}
                onOtherChange={(value) => handleOtherFieldChange('sparkosUsageOther', value)}
                otherPlaceholder={t('forms.showcase.fields.sparkosUsageOther.placeholder')}
                options={[
                  { value: 'classroom', label: t('forms.showcase.fields.sparkosUsage.options.classroom') },
                  { value: 'homelearning', label: t('forms.showcase.fields.sparkosUsage.options.homelearning') },
                  { value: 'specialEducation', label: t('forms.showcase.fields.sparkosUsage.options.specialEducation') },
                  { value: 'afterschool', label: t('forms.showcase.fields.sparkosUsage.options.afterschool') },
                  { value: 'therapeuticIntervention', label: t('forms.showcase.fields.sparkosUsage.options.therapeuticIntervention') },
                  { value: 'assessment', label: t('forms.showcase.fields.sparkosUsage.options.assessment') },
                  { value: 'teacherTraining', label: t('forms.showcase.fields.sparkosUsage.options.teacherTraining') },
                  { value: 'lmsIntegration', label: t('forms.showcase.fields.sparkosUsage.options.lmsIntegration') },
                  { value: 'research', label: t('forms.showcase.fields.sparkosUsage.options.research') },
                  { value: 'other', label: t('forms.showcase.fields.sparkosUsage.options.other') }
                ]}
              />

              <Checkbox.Group
                name="ageGroups"
                label={t('forms.showcase.fields.ageGroups.label')}
                values={values.ageGroups}
                onChange={(newValues) => handleChange('ageGroups', newValues)}
                error={errors.ageGroups}
                options={[
                  { value: 'preschool', label: t('forms.showcase.fields.ageGroups.options.preschool') },
                  { value: 'earlyElementary', label: t('forms.showcase.fields.ageGroups.options.earlyElementary') },
                  { value: 'lateElementary', label: t('forms.showcase.fields.ageGroups.options.lateElementary') },
                  { value: 'middleSchool', label: t('forms.showcase.fields.ageGroups.options.middleSchool') },
                  { value: 'highSchool', label: t('forms.showcase.fields.ageGroups.options.highSchool') },
                  { value: 'mixedAges', label: t('forms.showcase.fields.ageGroups.options.mixedAges') }
                ]}
              />

              <Radio.Group
                name="neurodiversityWork"
                label={t('forms.showcase.fields.neurodiversityWork.label')}
                value={values.neurodiversityWork}
                onChange={(e) => handleChange('neurodiversityWork', e.target.value)}
                error={errors.neurodiversityWork}
                options={[
                  { value: 'frequently', label: t('forms.showcase.fields.neurodiversityWork.options.frequently') },
                  { value: 'occasionally', label: t('forms.showcase.fields.neurodiversityWork.options.occasionally') },
                  { value: 'interestedNo', label: t('forms.showcase.fields.neurodiversityWork.options.interestedNo') },
                  { value: 'no', label: t('forms.showcase.fields.neurodiversityWork.options.no') }
                ]}
              />

              {(values.neurodiversityWork === 'frequently' || values.neurodiversityWork === 'occasionally') && (
                <Checkbox.Group
                  name="supportedConditions"
                  label={t('forms.showcase.fields.supportedConditions.label')}
                  values={values.supportedConditions}
                  onChange={(newValues) => handleChange('supportedConditions', newValues)}
                  error={errors.supportedConditions}
                  otherOption={true}
                  otherValue={otherFields.supportedConditionsOther}
                  onOtherChange={(value) => handleOtherFieldChange('supportedConditionsOther', value)}
                  otherPlaceholder={t('forms.showcase.fields.supportedConditionsOther.placeholder')}
                  options={[
                    { value: 'adhd', label: t('forms.showcase.fields.supportedConditions.options.adhd') },
                    { value: 'autism', label: t('forms.showcase.fields.supportedConditions.options.autism') },
                    { value: 'learningDisabilities', label: t('forms.showcase.fields.supportedConditions.options.learningDisabilities') },
                    { value: 'dyslexia', label: t('forms.showcase.fields.supportedConditions.options.dyslexia') },
                    { value: 'processingDisorders', label: t('forms.showcase.fields.supportedConditions.options.processingDisorders') },
                    { value: 'other', label: t('forms.showcase.fields.supportedConditions.options.other') }
                  ]}
                />
              )}
            </div>
          </div>

          {/* Specific Interest Points Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.showcase.sections.features')}</h3>
            
            <div className="space-y-6">
              <Checkbox.Group
                name="featuresInterest"
                label={t('forms.showcase.fields.featuresInterest.label')}
                values={values.featuresInterest}
                onChange={(newValues) => handleChange('featuresInterest', newValues)}
                error={errors.featuresInterest}
                required
                maxSelection={3}
                options={[
                  { value: 'voiceEmotion', label: t('forms.showcase.fields.featuresInterest.options.voiceEmotion') },
                  { value: 'videoEmotion', label: t('forms.showcase.fields.featuresInterest.options.videoEmotion') },
                  { value: 'adaptiveLearning', label: t('forms.showcase.fields.featuresInterest.options.adaptiveLearning') },
                  { value: 'progressTracking', label: t('forms.showcase.fields.featuresInterest.options.progressTracking') },
                  { value: 'personalizedCurriculum', label: t('forms.showcase.fields.featuresInterest.options.personalizedCurriculum') },
                  { value: 'multisensoryLearning', label: t('forms.showcase.fields.featuresInterest.options.multisensoryLearning') },
                  { value: 'collaboration', label: t('forms.showcase.fields.featuresInterest.options.collaboration') },
                  { value: 'behaviorInsights', label: t('forms.showcase.fields.featuresInterest.options.behaviorInsights') }
                ]}
              />

              <Radio.Group
                name="implementationTimeline"
                label={t('forms.showcase.fields.implementationTimeline.label')}
                value={values.implementationTimeline}
                onChange={(e) => handleChange('implementationTimeline', e.target.value)}
                error={errors.implementationTimeline}
                required
                options={[
                  { value: 'immediate', label: t('forms.showcase.fields.implementationTimeline.options.immediate') },
                  { value: 'shortTerm', label: t('forms.showcase.fields.implementationTimeline.options.shortTerm') },
                  { value: 'mediumTerm', label: t('forms.showcase.fields.implementationTimeline.options.mediumTerm') },
                  { value: 'longTerm', label: t('forms.showcase.fields.implementationTimeline.options.longTerm') },
                  { value: 'research', label: t('forms.showcase.fields.implementationTimeline.options.research') }
                ]}
              />

              <Radio.Group
                name="pilotInterest"
                label={t('forms.showcase.fields.pilotInterest.label')}
                value={values.pilotInterest}
                onChange={(e) => handleChange('pilotInterest', e.target.value)}
                error={errors.pilotInterest}
                required
                options={[
                  { value: 'yes', label: t('forms.showcase.fields.pilotInterest.options.yes') },
                  { value: 'no', label: t('forms.showcase.fields.pilotInterest.options.no') },
                  { value: 'maybe', label: t('forms.showcase.fields.pilotInterest.options.maybe') }
                ]}
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="pb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('forms.showcase.sections.additional')}</h3>
            
            <div className="space-y-6">
              <Textarea
                name="currentChallenges"
                label={t('forms.showcase.fields.currentChallenges.label')}
                value={values.currentChallenges}
                onChange={(e) => handleChange('currentChallenges', e.target.value)}
                onBlur={() => handleBlur('currentChallenges')}
                error={errors.currentChallenges}
                placeholder={t('forms.showcase.fields.currentChallenges.placeholder')}
                rows={4}
              />

              <Textarea
                name="additionalComments"
                label={t('forms.showcase.fields.additionalComments.label')}
                value={values.additionalComments}
                onChange={(e) => handleChange('additionalComments', e.target.value)}
                onBlur={() => handleBlur('additionalComments')}
                error={errors.additionalComments}
                placeholder={t('forms.showcase.fields.additionalComments.placeholder')}
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
