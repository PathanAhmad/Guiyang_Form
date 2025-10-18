import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '../../hooks/useForm';
import { useFormSubmission } from '../../hooks/useApi';
import { parentSurveyAPI } from '../../services/api';
import { validateParentSurveyForm } from '../../utils/validation';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Radio from '../ui/Radio';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Select from '../ui/Select';
import { countryOptions } from '../../utils/countries';

const ParentSurveyForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { submitForm, isSubmitting, submitError, submitSuccess, submissionData } = useFormSubmission();

  const { values, errors, handleChange, validate, setFieldErrors } = useForm(
    {
      // Respondent info
      name: '',
      consentParticipate: false,
      confirmAdult: false,
      contactEmail: '',
      country: '',
      age: '',
      contactPhone: '',
      wechatId: '',
      relationship: '',
      relationshipOther: '',
      childAgeRange: '',
      schoolingLevel: '',
      aiFamiliarity: '',
      childDevices: [],
      childDevicesOther: '',
      // Section 2A
      parentAiUsageFrequency: '',
      parentAiExperience: '',
      parentAiConfidence: '',
      parentAiPurposes: [],
      parentAiPurposesOther: '',
      // Section 2B
      childAiUsageLocation: '',
      childAiFrequency: '',
      childAiPurposes: [],
      childAiPurposesOther: '',
      childObservedChanges: [],
      childObservedChangesOther: '',
      childBenefits: [],
      childBenefitsOther: '',
      childConcerns: [],
      childConcernsOther: '',
      parentGuidanceConfidence: '',
      // Section 3
      importanceHumanInvolvement: '',
      aiSupportEmotionalFocus: '',
      likelihoodEncourageAi: '',
      preferredGuardrails: [],
      preferredGuardrailsOther: '',
      // Section 4
      preAiLearningHabits: '',
      preAiLearningHabitsOther: '',
      postAiImprovements: [],
      engagingEnjoyable: '',
      aiInclusivity: '',
      specificLearningConsiderations: [],
      // Section 5 (formerly Section 6)
      aiRoleNextFiveYears: '',
      aiRoleNextFiveYearsOther: '',
      considerSparkOSFuture: '',
      // Optional
      additionalFeedback: ''
    },
    validateParentSurveyForm
  );

  // Section configuration and navigation
  const sections = useMemo(() => [
    { id: 'intro', titleKey: 'parentSurvey.intro.title', fields: ['consentParticipate','confirmAdult'] },
    { id: 'section1', titleKey: 'parentSurvey.section1.title', fields: ['name','contactEmail','country','age','contactPhone','wechatId','relationship','relationshipOther','childAgeRange','schoolingLevel','aiFamiliarity','childDevices','childDevicesOther'] },
    { id: 'section2A', titleKey: 'parentSurvey.section2A.title', fields: ['parentAiUsageFrequency','parentAiExperience','parentAiConfidence','parentAiPurposes','parentAiPurposesOther'] },
    { id: 'section2B', titleKey: 'parentSurvey.section2B.title', fields: ['childAiUsageLocation','childAiFrequency','childAiPurposes','childAiPurposesOther','childObservedChanges','childObservedChangesOther','childBenefits','childBenefitsOther','childConcerns','childConcernsOther','parentGuidanceConfidence'] },
    { id: 'section3', titleKey: 'parentSurvey.section3.title', fields: ['importanceHumanInvolvement','aiSupportEmotionalFocus','likelihoodEncourageAi','preferredGuardrails','preferredGuardrailsOther'] },
    { id: 'section4', titleKey: 'parentSurvey.section4.title', fields: ['preAiLearningHabits','preAiLearningHabitsOther','postAiImprovements','engagingEnjoyable','aiInclusivity','specificLearningConsiderations'] },
    { id: 'section5', titleKey: 'parentSurvey.section6.title', fields: ['aiRoleNextFiveYears','aiRoleNextFiveYearsOther','considerSparkOSFuture'] },
    { id: 'section6', titleKey: 'parentSurvey.optional.title', fields: ['additionalFeedback'] },
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSections = sections.length;

  const [touched, setTouched] = useState({});

  // Define required fields per section in order (for progressive highlighting)
  const requiredFieldsBySection = useMemo(() => ({
    intro: ['consentParticipate', 'confirmAdult'],
    // Only non-MCQ fields remain required
    section1: ['name','contactEmail','country','age','contactPhone','wechatId'],
    section2A: [],
    section2B: [],
    section3: [],
    section4: [],
    section5: [],
    section6: []
  }), []);

  const sectionValidation = useMemo(() => {
    const v = validateParentSurveyForm(values);
    return v;
  }, [values]);

  const currentSection = sections[currentIndex];
  const currentSectionErrors = useMemo(() => {
    const allErrors = sectionValidation.errors || {};
    const relevant = {};
    currentSection.fields.forEach((f) => {
      if (allErrors[f]) relevant[f] = allErrors[f];
    });
    return relevant;
  }, [currentSection, sectionValidation]);

  const isCurrentSectionValid = useMemo(() => Object.keys(currentSectionErrors).length === 0, [currentSectionErrors]);

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
  const shouldShowError = (field) => {
    return Boolean(sectionValidation.errors?.[field]) && Boolean(touched[field]);
  };

  // Translate backend/client validation messages to i18n
  const translateError = (message) => {
    if (!message) return undefined;
    const msg = String(message);
    const lower = msg.toLowerCase();
    // Normalize any required-type messages to generic required copy
    if (
      lower.includes('is required') ||
      lower.includes('must confirm') ||
      lower.includes('consent') ||
      lower.includes('required')
    ) {
      return t('parentSurvey.validation.requiredField', { defaultValue: '*Required Field' });
    }
    if (lower.includes('must be at least') && lower.includes('characters')) {
      return t('parentSurvey.validation.nameMinLength');
    }
    if (lower.includes('valid email')) {
      return t('parentSurvey.validation.emailInvalid');
    }
    if (lower.includes('whole number')) {
      return t('parentSurvey.validation.ageInvalid');
    }
    if (lower.includes('phone number')) {
      return t('parentSurvey.validation.phoneInvalid');
    }
    if (lower.includes('select up to 3')) {
      return t('parentSurvey.validation.selectUpTo3');
    }
    if (lower.includes('please specify')) {
      return t('parentSurvey.validation.specifyOther');
    }
    return msg; // fallback
  };

  const fieldError = (field) => (shouldShowError(field) ? translateError(sectionValidation.errors[field]) : undefined);

  const handleFocus = (field) => {
    const reqList = requiredFieldsBySection[currentSection.id] || [];
    const idx = reqList.indexOf(field);
    if (idx > -1) {
      const toTouch = reqList.slice(0, idx);
      if (toTouch.length) {
        setTouched((prev) => {
          const next = { ...prev };
          toTouch.forEach((f) => { next[f] = true; });
          return next;
        });
      }
    }
  };

  const goNext = () => {
    if (!isCurrentSectionValid) {
      // Mark all required fields in this section as touched to reveal errors
      const reqList = requiredFieldsBySection[currentSection.id] || [];
      if (reqList.length) {
        setTouched((prev) => ({ ...prev, ...reqList.reduce((acc, f) => (acc[f]=true, acc), {}) }));
      }
      return; // gate progression
    }
    setCurrentIndex((idx) => Math.min(idx + 1, totalSections - 1));
  };

  const goPrev = () => setCurrentIndex((idx) => Math.max(idx - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateParentSurveyForm(values);
    setFieldErrors(v.errors || {});
    if (!v.isValid) return;
    const result = await submitForm(() => parentSurveyAPI.submit(values));
    if (result.success && onSuccess) onSuccess(result.data);
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('parentSurvey.successTitle')}</h3>
          <p className="text-gray-600 mb-4">
            {t('parentSurvey.successMessage')}
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
    <Card>
      <Card.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{t(currentSection.titleKey)}</span>
              <span>{t('parentSurvey.progress.sectionOf', { current: currentIndex + 1, total: totalSections })}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded mt-2">
              <div className="h-2 bg-primary-400 rounded" style={{ width: `${((currentIndex + 1) / totalSections) * 100}%` }} />
            </div>
          </div>

          {/* Intro */}
          {currentSection.id === 'intro' && (
            <div>
              <p className="text-gray-600 mb-3">{t('parentSurvey.intro.description')}</p>
              <div className="space-y-2">
                <Checkbox 
                  name="consentParticipate"
                  checked={values.consentParticipate}
                  onChange={(e) => handleChange('consentParticipate', e.target.checked)}
                  onBlur={() => markTouched('consentParticipate')}
                  onFocus={() => handleFocus('consentParticipate')}
                  label={t('parentSurvey.intro.consent')}
                  required
                  error={fieldError('consentParticipate')}
                />
                <Checkbox 
                  name="confirmAdult"
                  checked={values.confirmAdult}
                  onChange={(e) => handleChange('confirmAdult', e.target.checked)}
                  onBlur={() => markTouched('confirmAdult')}
                  onFocus={() => handleFocus('confirmAdult')}
                  label={t('parentSurvey.intro.adult')}
                  required
                  error={fieldError('confirmAdult')}
                />
              </div>
            </div>
          )}

          {/* Section 1: Background Information */}
          {currentSection.id === 'section1' && (
          <div>
            <div className="space-y-6">
              <Input
                name="name"
                label={t('parentSurvey.section1.name.label')}
                placeholder={t('parentSurvey.section1.name.placeholder')}
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => markTouched('name')}
                onFocus={() => handleFocus('name')}
                required
                error={fieldError('name')}
                className="max-w-md"
              />
              <Input
                type="email"
                name="contactEmail"
                label={t('parentSurvey.section1.contactEmail.label')}
                placeholder={t('parentSurvey.section1.contactEmail.placeholder')}
                value={values.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                onBlur={() => markTouched('contactEmail')}
                onFocus={() => handleFocus('contactEmail')}
                required
                error={fieldError('contactEmail')}
                className="max-w-md"
              />
              <Select
                name="country"
                label={t('parentSurvey.section1.country.label')}
                value={values.country}
                onChange={(e) => handleChange('country', e.target.value)}
                onBlur={() => markTouched('country')}
                onFocus={() => handleFocus('country')}
                required
                error={fieldError('country')}
                options={[
                  { value: '', label: t('parentSurvey.section1.country.placeholder') },
                  ...countryOptions.map(o => ({ value: o.value, label: t(`countryNames.${o.value}`, { defaultValue: o.value }) }))
                ]}
                className="max-w-md"
              />
              <Input
                type="number"
                name="age"
                label={t('parentSurvey.section1.age.label')}
                placeholder={t('parentSurvey.section1.age.placeholder')}
                value={values.age}
                onChange={(e) => handleChange('age', e.target.value)}
                onBlur={() => markTouched('age')}
                onFocus={() => handleFocus('age')}
                required
                error={fieldError('age')}
                className="max-w-[160px]"
              />
              <Input
                name="contactPhone"
                label={t('parentSurvey.section1.contactPhone.label')}
                placeholder={t('parentSurvey.section1.contactPhone.placeholder')}
                value={values.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                onBlur={() => markTouched('contactPhone')}
                onFocus={() => handleFocus('contactPhone')}
                required
                error={fieldError('contactPhone')}
                className="max-w-md"
                showCountryCode
              />
              <Input
                name="wechatId"
                label={t('parentSurvey.section1.wechatId.label')}
                placeholder={t('parentSurvey.section1.wechatId.placeholder')}
                value={values.wechatId}
                onChange={(e) => handleChange('wechatId', e.target.value)}
                onBlur={() => markTouched('wechatId')}
                onFocus={() => handleFocus('wechatId')}
                required
                error={fieldError('wechatId')}
                className="max-w-md"
              />
              <Radio.Group
                name="relationship"
                label={t('parentSurvey.section1.relationship.label')}
                value={values.relationship}
                onChange={(e) => handleChange('relationship', e.target.value)}
                onBlur={() => markTouched('relationship')}
                onFocus={() => handleFocus('relationship')}
                error={fieldError('relationship')}
                options={[
                  { value: 'parent', label: t('parentSurvey.section1.relationship.options.parent') },
                  { value: 'guardian', label: t('parentSurvey.section1.relationship.options.guardian') },
                  { value: 'other', label: t('parentSurvey.section1.relationship.options.other') }
                ]}
              />
              {values.relationship === 'other' && (
                <Input
                  name="relationshipOther"
                  value={values.relationshipOther}
                  onChange={(e) => handleChange('relationshipOther', e.target.value)}
                  onBlur={() => markTouched('relationshipOther')}
                  error={fieldError('relationshipOther')}
                  placeholder={t('parentSurvey.section1.relationship.otherPlaceholder')}
                  className="ml-6 max-w-md"
                />
              )}

              <Radio.Group
                name="childAgeRange"
                label={t('parentSurvey.section1.childAgeRange.label')}
                value={values.childAgeRange}
                onChange={(e) => handleChange('childAgeRange', e.target.value)}
                onBlur={() => markTouched('childAgeRange')}
                onFocus={() => handleFocus('childAgeRange')}
                error={fieldError('childAgeRange')}
                options={[
                  { value: '5-10', label: t('parentSurvey.section1.childAgeRange.options.5_10') },
                  { value: '11-15', label: t('parentSurvey.section1.childAgeRange.options.11_15') },
                  { value: '16-18', label: t('parentSurvey.section1.childAgeRange.options.16_18') },
                  { value: 'above18', label: t('parentSurvey.section1.childAgeRange.options.above18') },
                  { value: 'preferNotSay', label: t('parentSurvey.section1.childAgeRange.options.preferNotSay') }
                ]}
              />

              <Radio.Group
                name="schoolingLevel"
                label={t('parentSurvey.section1.schoolingLevel.label')}
                value={values.schoolingLevel}
                onChange={(e) => handleChange('schoolingLevel', e.target.value)}
                onBlur={() => markTouched('schoolingLevel')}
                onFocus={() => handleFocus('schoolingLevel')}
                error={fieldError('schoolingLevel')}
                options={[
                  { value: 'primary', label: t('parentSurvey.section1.schoolingLevel.options.primary') },
                  { value: 'secondary', label: t('parentSurvey.section1.schoolingLevel.options.secondary') },
                  { value: 'higherSecondary', label: t('parentSurvey.section1.schoolingLevel.options.higherSecondary') },
                  { value: 'university', label: t('parentSurvey.section1.schoolingLevel.options.university') }
                ]}
              />

              <Radio.Group
                name="aiFamiliarity"
                label={t('parentSurvey.section1.aiFamiliarity.label')}
                value={values.aiFamiliarity}
                onChange={(e) => handleChange('aiFamiliarity', e.target.value)}
                onBlur={() => markTouched('aiFamiliarity')}
                onFocus={() => handleFocus('aiFamiliarity')}
                error={fieldError('aiFamiliarity')}
                options={[
                  { value: 'notFamiliar', label: t('parentSurvey.section1.aiFamiliarity.options.notFamiliar') },
                  { value: 'somewhat', label: t('parentSurvey.section1.aiFamiliarity.options.somewhat') },
                  { value: 'familiar', label: t('parentSurvey.section1.aiFamiliarity.options.familiar') },
                  { value: 'very', label: t('parentSurvey.section1.aiFamiliarity.options.very') }
                ]}
              />

              <Checkbox.Group
                name="childDevices"
                label={t('parentSurvey.section1.childDevices.label')}
                values={values.childDevices}
                onChange={(newValues) => handleChange('childDevices', newValues)}
                otherOption={true}
                otherValue={values.childDevicesOther}
                onOtherChange={(val) => handleChange('childDevicesOther', val)}
                otherPlaceholder={t('parentSurvey.section1.childDevices.otherPlaceholder')}
                options={[
                  { value: 'laptop', label: t('parentSurvey.section1.childDevices.options.laptop') },
                  { value: 'tablet', label: t('parentSurvey.section1.childDevices.options.tablet') },
                  { value: 'smartphone', label: t('parentSurvey.section1.childDevices.options.smartphone') },
                  { value: 'schoolDevice', label: t('parentSurvey.section1.childDevices.options.schoolDevice') },
                  { value: 'other', label: t('parentSurvey.section1.childDevices.options.other') }
                ]}
              />
            </div>
          </div>
          )}

          {/* Section 2A: Parent/Guardian AI Usage */}
          {currentSection.id === 'section2A' && (
          <div>
            {/* Section title is already shown in the progress indicator; avoid duplicate heading */}
            <div className="space-y-6">
              <Radio.Group
                name="parentAiUsageFrequency"
                label={t('parentSurvey.section2A.aiUsage.label')}
                value={values.parentAiUsageFrequency}
                onChange={(e) => handleChange('parentAiUsageFrequency', e.target.value)}
                onBlur={() => markTouched('parentAiUsageFrequency')}
                onFocus={() => handleFocus('parentAiUsageFrequency')}
                error={fieldError('parentAiUsageFrequency')}
                options={[
                  { value: 'regularly', label: t('parentSurvey.section2A.aiUsage.options.regularly') },
                  { value: 'fewTimes', label: t('parentSurvey.section2A.aiUsage.options.fewTimes') },
                  { value: 'triedOnce', label: t('parentSurvey.section2A.aiUsage.options.triedOnce') },
                  { value: 'no', label: t('parentSurvey.section2A.aiUsage.options.no') },
                  { value: 'notSure', label: t('parentSurvey.section2A.aiUsage.options.notSure') }
                ]}
              />

              <Radio.Group
                name="parentAiExperience"
                label={t('parentSurvey.section2A.experience.label')}
                value={values.parentAiExperience}
                onChange={(e) => handleChange('parentAiExperience', e.target.value)}
                onBlur={() => markTouched('parentAiExperience')}
                onFocus={() => handleFocus('parentAiExperience')}
                error={fieldError('parentAiExperience')}
                options={[
                  { value: 'veryPositive', label: t('parentSurvey.section2A.experience.options.veryPositive') },
                  { value: 'somewhatPositive', label: t('parentSurvey.section2A.experience.options.somewhatPositive') },
                  { value: 'neutral', label: t('parentSurvey.section2A.experience.options.neutral') },
                  { value: 'somewhatNegative', label: t('parentSurvey.section2A.experience.options.somewhatNegative') },
                  { value: 'veryNegative', label: t('parentSurvey.section2A.experience.options.veryNegative') }
                ]}
              />

              <Radio.Group
                name="parentAiConfidence"
                label={t('parentSurvey.section2A.confidence.label')}
                value={values.parentAiConfidence}
                onChange={(e) => handleChange('parentAiConfidence', e.target.value)}
                onBlur={() => markTouched('parentAiConfidence')}
                onFocus={() => handleFocus('parentAiConfidence')}
                error={fieldError('parentAiConfidence')}
                options={[
                  { value: 'notConfident', label: t('parentSurvey.section2A.confidence.options.notConfident') },
                  { value: 'slightlyConfident', label: t('parentSurvey.section2A.confidence.options.slightlyConfident') },
                  { value: 'confident', label: t('parentSurvey.section2A.confidence.options.confident') },
                  { value: 'veryConfident', label: t('parentSurvey.section2A.confidence.options.veryConfident') }
                ]}
              />

              <Checkbox.Group
                name="parentAiPurposes"
                label={t('parentSurvey.section2A.purposes.label')}
                values={values.parentAiPurposes}
                onChange={(newValues) => handleChange('parentAiPurposes', newValues)}
                otherOption={true}
                otherValue={values.parentAiPurposesOther}
                onOtherChange={(val) => handleChange('parentAiPurposesOther', val)}
                otherPlaceholder={t('parentSurvey.section2A.purposes.otherPlaceholder')}
                options={[
                  { value: 'workProductivity', label: t('parentSurvey.section2A.purposes.options.workProductivity') },
                  { value: 'learningResearch', label: t('parentSurvey.section2A.purposes.options.learningResearch') },
                  { value: 'creativeTasks', label: t('parentSurvey.section2A.purposes.options.creativeTasks') },
                  { value: 'everydayAssistance', label: t('parentSurvey.section2A.purposes.options.everydayAssistance') },
                  { value: 'other', label: t('parentSurvey.section2A.purposes.options.other') }
                ]}
              />
            </div>
          </div>
          )}

          {/* Section 2B: Current AI Usage by Child */}
          {currentSection.id === 'section2B' && (
          <div>
            {/* Section title already shown above; remove duplicate heading */}
            <div className="space-y-6">
              <Radio.Group
                name="childAiUsageLocation"
                label={t('parentSurvey.section2B.childUsage.label')}
                value={values.childAiUsageLocation}
                onChange={(e) => handleChange('childAiUsageLocation', e.target.value)}
                options={[
                  { value: 'school', label: t('parentSurvey.section2B.childUsage.options.school') },
                  { value: 'home', label: t('parentSurvey.section2B.childUsage.options.home') },
                  { value: 'both', label: t('parentSurvey.section2B.childUsage.options.both') },
                  { value: 'triedOnce', label: t('parentSurvey.section2B.childUsage.options.triedOnce') },
                  { value: 'no', label: t('parentSurvey.section2B.childUsage.options.no') },
                  { value: 'notSure', label: t('parentSurvey.section2B.childUsage.options.notSure') }
                ]}
              />

              <Radio.Group
                name="childAiFrequency"
                label={t('parentSurvey.section2B.frequency.label')}
                value={values.childAiFrequency}
                onChange={(e) => handleChange('childAiFrequency', e.target.value)}
                options={[
                  { value: 'rarely', label: t('parentSurvey.section2B.frequency.options.rarely') },
                  { value: 'monthly', label: t('parentSurvey.section2B.frequency.options.monthly') },
                  { value: 'weekly', label: t('parentSurvey.section2B.frequency.options.weekly') },
                  { value: 'severalWeekly', label: t('parentSurvey.section2B.frequency.options.severalWeekly') },
                  { value: 'daily', label: t('parentSurvey.section2B.frequency.options.daily') }
                ]}
              />

              <Checkbox.Group
                name="childAiPurposes"
                label={t('parentSurvey.section2B.purposes.label')}
                values={values.childAiPurposes}
                onChange={(newValues) => handleChange('childAiPurposes', newValues)}
                otherOption={true}
                otherValue={values.childAiPurposesOther}
                onOtherChange={(val) => handleChange('childAiPurposesOther', val)}
                otherPlaceholder={t('parentSurvey.section2B.purposes.otherPlaceholder')}
                options={[
                  { value: 'homework', label: t('parentSurvey.section2B.purposes.options.homework') },
                  { value: 'language', label: t('parentSurvey.section2B.purposes.options.language') },
                  { value: 'research', label: t('parentSurvey.section2B.purposes.options.research') },
                  { value: 'practice', label: t('parentSurvey.section2B.purposes.options.practice') },
                  { value: 'creativityCoding', label: t('parentSurvey.section2B.purposes.options.creativityCoding') },
                  { value: 'writing', label: t('parentSurvey.section2B.purposes.options.writing') },
                  { value: 'accessibility', label: t('parentSurvey.section2B.purposes.options.accessibility') },
                  { value: 'entertainment', label: t('parentSurvey.section2B.purposes.options.entertainment') },
                  { value: 'other', label: t('parentSurvey.section2B.purposes.options.other') }
                ]}
              />

              {/* Removed open-ended childAiToolsOften */}

              <Checkbox.Group
                name="childObservedChanges"
                label={t('parentSurvey.section2B.observedChanges.label')}
                values={values.childObservedChanges}
                onChange={(newValues) => handleChange('childObservedChanges', newValues)}
                otherOption={true}
                otherValue={values.childObservedChangesOther}
                onOtherChange={(val) => handleChange('childObservedChangesOther', val)}
                otherPlaceholder={t('parentSurvey.section2B.observedChanges.otherPlaceholder')}
                options={[
                  { value: 'improvedFocus', label: t('parentSurvey.section2B.observedChanges.options.improvedFocus') },
                  { value: 'curiosityInitiative', label: t('parentSurvey.section2B.observedChanges.options.curiosityInitiative') },
                  { value: 'betterTimeManagement', label: t('parentSurvey.section2B.observedChanges.options.betterTimeManagement') },
                  { value: 'increasedDependency', label: t('parentSurvey.section2B.observedChanges.options.increasedDependency') },
                  { value: 'noChange', label: t('parentSurvey.section2B.observedChanges.options.noChange') },
                  { value: 'other', label: t('parentSurvey.section2B.observedChanges.options.other') }
                ]}
              />

              <Checkbox.Group
                name="childBenefits"
                label={t('parentSurvey.section2B.benefits.label')}
                values={values.childBenefits}
                onChange={(newValues) => handleChange('childBenefits', newValues)}
                otherOption={true}
                otherValue={values.childBenefitsOther}
                onOtherChange={(val) => handleChange('childBenefitsOther', val)}
                otherPlaceholder={t('parentSurvey.section2B.benefits.otherPlaceholder')}
                maxSelection={3}
                options={[
                  { value: 'personalizedPace', label: t('parentSurvey.section2B.benefits.options.personalizedPace') },
                  { value: 'assistance247', label: t('parentSurvey.section2B.benefits.options.assistance247') },
                  { value: 'instantAnswers', label: t('parentSurvey.section2B.benefits.options.instantAnswers') },
                  { value: 'adaptiveGuidance', label: t('parentSurvey.section2B.benefits.options.adaptiveGuidance') },
                  { value: 'emotionalSupport', label: t('parentSurvey.section2B.benefits.options.emotionalSupport') },
                  { value: 'accessibilitySupports', label: t('parentSurvey.section2B.benefits.options.accessibilitySupports') },
                  { value: 'other', label: t('parentSurvey.section2B.benefits.options.other') }
                ]}
              />

              <Checkbox.Group
                name="childConcerns"
                label={t('parentSurvey.section2B.concerns.label')}
                values={values.childConcerns}
                onChange={(newValues) => handleChange('childConcerns', newValues)}
                otherOption={true}
                otherValue={values.childConcernsOther}
                onOtherChange={(val) => handleChange('childConcernsOther', val)}
                otherPlaceholder={t('parentSurvey.section2B.concerns.otherPlaceholder')}
                maxSelection={3}
                options={[
                  { value: 'privacySafety', label: t('parentSurvey.section2B.concerns.options.privacySafety') },
                  { value: 'screenTimeDependency', label: t('parentSurvey.section2B.concerns.options.screenTimeDependency') },
                  { value: 'accuracyBias', label: t('parentSurvey.section2B.concerns.options.accuracyBias') },
                  { value: 'reducedHumanConnection', label: t('parentSurvey.section2B.concerns.options.reducedHumanConnection') },
                  { value: 'reducedCreativity', label: t('parentSurvey.section2B.concerns.options.reducedCreativity') },
                  { value: 'misuseOverreliance', label: t('parentSurvey.section2B.concerns.options.misuseOverreliance') },
                  { value: 'other', label: t('parentSurvey.section2B.concerns.options.other') }
                ]}
              />

              {/* Removed open-ended aiSupportTeachersParents */}

              <Radio.Group
                name="parentGuidanceConfidence"
                label={t('parentSurvey.section2B.guidanceConfidence.label')}
                value={values.parentGuidanceConfidence}
                onChange={(e) => handleChange('parentGuidanceConfidence', e.target.value)}
                options={[
                  { value: 'very', label: t('parentSurvey.section2B.guidanceConfidence.options.very') },
                  { value: 'somewhat', label: t('parentSurvey.section2B.guidanceConfidence.options.somewhat') },
                  { value: 'unsure', label: t('parentSurvey.section2B.guidanceConfidence.options.unsure') },
                  { value: 'needSupport', label: t('parentSurvey.section2B.guidanceConfidence.options.needSupport') }
                ]}
              />
            </div>
          </div>
          )}

          {/* Section 3: Perception and Expectations */}
          {currentSection.id === 'section3' && (
          <div>
            {/* Section title already shown above; remove duplicate heading */}
            <div className="space-y-6">
              {/* Removed open-ended perceivedBenefits and perceivedConcerns */}

              <Radio.Group
                name="importanceHumanInvolvement"
                label={t('parentSurvey.section3.humanInvolvement.label')}
                value={values.importanceHumanInvolvement}
                onChange={(e) => handleChange('importanceHumanInvolvement', e.target.value)}
                options={[
                  { value: 'very', label: t('parentSurvey.section3.humanInvolvement.options.very') },
                  { value: 'somewhat', label: t('parentSurvey.section3.humanInvolvement.options.somewhat') },
                  { value: 'neutral', label: t('parentSurvey.section3.humanInvolvement.options.neutral') },
                  { value: 'less', label: t('parentSurvey.section3.humanInvolvement.options.less') }
                ]}
              />

              <Radio.Group
                name="aiSupportEmotionalFocus"
                label={t('parentSurvey.section3.emotionalFocus.label')}
                value={values.aiSupportEmotionalFocus}
                onChange={(e) => handleChange('aiSupportEmotionalFocus', e.target.value)}
                options={[
                  { value: 'yes', label: t('parentSurvey.section3.emotionalFocus.options.yes') },
                  { value: 'maybe', label: t('parentSurvey.section3.emotionalFocus.options.maybe') },
                  { value: 'no', label: t('parentSurvey.section3.emotionalFocus.options.no') },
                  { value: 'notSure', label: t('parentSurvey.section3.emotionalFocus.options.notSure') }
                ]}
              />

              <Radio.Group
                name="likelihoodEncourageAi"
                label={t('parentSurvey.section3.likelihoodEncourage.label')}
                value={values.likelihoodEncourageAi}
                onChange={(e) => handleChange('likelihoodEncourageAi', e.target.value)}
                options={[
                  { value: 'veryLikely', label: t('parentSurvey.section3.likelihoodEncourage.options.veryLikely') },
                  { value: 'somewhatLikely', label: t('parentSurvey.section3.likelihoodEncourage.options.somewhatLikely') },
                  { value: 'neutral', label: t('parentSurvey.section3.likelihoodEncourage.options.neutral') },
                  { value: 'unlikely', label: t('parentSurvey.section3.likelihoodEncourage.options.unlikely') }
                ]}
              />

              <Checkbox.Group
                name="preferredGuardrails"
                label={t('parentSurvey.section3.guardrails.label')}
                values={values.preferredGuardrails}
                onChange={(newValues) => handleChange('preferredGuardrails', newValues)}
                otherOption={true}
                otherValue={values.preferredGuardrailsOther}
                onOtherChange={(val) => handleChange('preferredGuardrailsOther', val)}
                otherPlaceholder={t('parentSurvey.section3.guardrails.otherPlaceholder')}
                options={[
                  { value: 'citations', label: t('parentSurvey.section3.guardrails.options.citations') },
                  { value: 'showSteps', label: t('parentSurvey.section3.guardrails.options.showSteps') },
                  { value: 'limitsTakeHome', label: t('parentSurvey.section3.guardrails.options.limitsTakeHome') },
                  { value: 'transparency', label: t('parentSurvey.section3.guardrails.options.transparency') },
                  { value: 'teacherReviewFlag', label: t('parentSurvey.section3.guardrails.options.teacherReviewFlag') },
                  { value: 'other', label: t('parentSurvey.section3.guardrails.options.other') }
                ]}
              />
            </div>
          </div>
          )}

          {/* Section 4: Experience Before and After Using AI */}
          {currentSection.id === 'section4' && (
          <div>
            {/* Section title already shown above; remove duplicate heading */}
            <div className="space-y-6">
              <Radio.Group
                name="preAiLearningHabits"
                label={t('parentSurvey.section4.preHabits.label')}
                value={values.preAiLearningHabits}
                onChange={(e) => handleChange('preAiLearningHabits', e.target.value)}
                options={[
                  { value: 'independent', label: t('parentSurvey.section4.preHabits.options.independent') },
                  { value: 'needsGuidance', label: t('parentSurvey.section4.preHabits.options.needsGuidance') },
                  { value: 'easilyDistracted', label: t('parentSurvey.section4.preHabits.options.easilyDistracted') },
                  { value: 'motivationStruggle', label: t('parentSurvey.section4.preHabits.options.motivationStruggle') },
                  { value: 'other', label: t('parentSurvey.section4.preHabits.options.other') }
                ]}
              />
              {values.preAiLearningHabits === 'other' && (
                <Input
                  name="preAiLearningHabitsOther"
                  value={values.preAiLearningHabitsOther}
                  onChange={(e) => handleChange('preAiLearningHabitsOther', e.target.value)}
                  placeholder={t('parentSurvey.section4.preHabits.otherPlaceholder')}
                  className="ml-6 max-w-md"
                />
              )}

              <Checkbox.Group
                name="postAiImprovements"
                label={t('parentSurvey.section4.postImprovements.label')}
                values={values.postAiImprovements}
                onChange={(newValues) => handleChange('postAiImprovements', newValues)}
                options={[
                  { value: 'selfLearningCuriosity', label: t('parentSurvey.section4.postImprovements.options.selfLearningCuriosity') },
                  { value: 'confidenceCommunication', label: t('parentSurvey.section4.postImprovements.options.confidenceCommunication') },
                  { value: 'emotionalAwareness', label: t('parentSurvey.section4.postImprovements.options.emotionalAwareness') },
                  { value: 'focusTimeManagement', label: t('parentSurvey.section4.postImprovements.options.focusTimeManagement') },
                  { value: 'none', label: t('parentSurvey.section4.postImprovements.options.none') }
                ]}
              />

              <Radio.Group
                name="engagingEnjoyable"
                label={t('parentSurvey.section4.engaging.label')}
                value={values.engagingEnjoyable}
                onChange={(e) => handleChange('engagingEnjoyable', e.target.value)}
                options={[
                  { value: 'yes', label: t('parentSurvey.section4.engaging.options.yes') },
                  { value: 'somewhat', label: t('parentSurvey.section4.engaging.options.somewhat') },
                  { value: 'no', label: t('parentSurvey.section4.engaging.options.no') }
                ]}
              />

              <Radio.Group
                name="aiInclusivity"
                label={t('parentSurvey.section4.inclusivity.label')}
                value={values.aiInclusivity}
                onChange={(e) => handleChange('aiInclusivity', e.target.value)}
                options={[
                  { value: 'yes', label: t('parentSurvey.section4.inclusivity.options.yes') },
                  { value: 'somewhat', label: t('parentSurvey.section4.inclusivity.options.somewhat') },
                  { value: 'no', label: t('parentSurvey.section4.inclusivity.options.no') },
                  { value: 'notSure', label: t('parentSurvey.section4.inclusivity.options.notSure') }
                ]}
              />

              <Checkbox.Group
                name="specificLearningConsiderations"
                label={t('parentSurvey.section4.learningConsiderations.label')}
                values={values.specificLearningConsiderations}
                onChange={(newValues) => handleChange('specificLearningConsiderations', newValues)}
                options={[
                  { value: 'adhd', label: t('parentSurvey.section4.learningConsiderations.options.adhd') },
                  { value: 'autism', label: t('parentSurvey.section4.learningConsiderations.options.autism') },
                  { value: 'dyslexia', label: t('parentSurvey.section4.learningConsiderations.options.dyslexia') },
                  { value: 'languageSupport', label: t('parentSurvey.section4.learningConsiderations.options.languageSupport') },
                  { value: 'visualHearingSupport', label: t('parentSurvey.section4.learningConsiderations.options.visualHearingSupport') },
                  { value: 'other', label: t('parentSurvey.section4.learningConsiderations.options.other') },
                  { value: 'preferNotSay', label: t('parentSurvey.section4.learningConsiderations.options.preferNotSay') }
                ]}
              />
            </div>
          </div>
          )}


          {/* Section 5: Looking Ahead */}
          {currentSection.id === 'section5' && (
          <div>
            {/* Section title already shown above; remove duplicate heading */}
            <div className="space-y-6">
              <Radio.Group
                name="aiRoleNextFiveYears"
                label={t('parentSurvey.section6.aiRole.label')}
                value={values.aiRoleNextFiveYears}
                onChange={(e) => handleChange('aiRoleNextFiveYears', e.target.value)}
                options={[
                  { value: 'supplementary', label: t('parentSurvey.section6.aiRole.options.supplementary') },
                  { value: 'assistant', label: t('parentSurvey.section6.aiRole.options.assistant') },
                  { value: 'tutor', label: t('parentSurvey.section6.aiRole.options.tutor') },
                  { value: 'monitoring', label: t('parentSurvey.section6.aiRole.options.monitoring') },
                  { value: 'other', label: t('parentSurvey.section6.aiRole.options.other') }
                ]}
              />
              {values.aiRoleNextFiveYears === 'other' && (
                <Input
                  name="aiRoleNextFiveYearsOther"
                  value={values.aiRoleNextFiveYearsOther}
                  onChange={(e) => handleChange('aiRoleNextFiveYearsOther', e.target.value)}
                  placeholder={t('parentSurvey.section6.aiRole.otherPlaceholder')}
                  className="ml-6 max-w-md"
                />
              )}

              <Radio.Group
                name="considerSparkOSFuture"
                label={t('parentSurvey.section5.considerSparkOS.label', { defaultValue: 'Would you consider SparkOS for your child’s future learning experience?' })}
                value={values.considerSparkOSFuture}
                onChange={(e) => handleChange('considerSparkOSFuture', e.target.value)}
                onBlur={() => markTouched('considerSparkOSFuture')}
                onFocus={() => handleFocus('considerSparkOSFuture')}
                error={fieldError('considerSparkOSFuture')}
                options={[
                  { value: 'definitelyYes', label: t('parentSurvey.section5.considerSparkOS.options.definitelyYes', { defaultValue: 'Definitely yes' }) },
                  { value: 'maybe', label: t('parentSurvey.section5.considerSparkOS.options.maybe', { defaultValue: 'Maybe' }) },
                  { value: 'notSure', label: t('parentSurvey.section5.considerSparkOS.options.notSure', { defaultValue: 'Not sure' }) },
                  { value: 'no', label: t('parentSurvey.section5.considerSparkOS.options.no', { defaultValue: 'No' }) }
                ]}
              />

              {/* Email is collected in Section 1; duplicate removed */}
            </div>
          </div>
          )}

          {/* Section 6: Optional Feedback */}
          {currentSection.id === 'section6' && (
          <div>
            {/* Section title already shown above; remove duplicate heading */}
            <div className="space-y-6">
              <Textarea
                name="additionalFeedback"
                label={t('parentSurvey.section6.additionalThoughts.label', { defaultValue: t('parentSurvey.optional.idealAiCompanion.label') })}
                value={values.additionalFeedback}
                onChange={(e) => handleChange('additionalFeedback', e.target.value)}
              />
            </div>
          </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 flex items-center gap-3">
            <Button type="button" variant="secondary" className="flex-1" disabled={currentIndex === 0 || isSubmitting} onClick={goPrev}>
              {t('common.previous')}
            </Button>
            {currentIndex < totalSections - 1 && (
              <Button type="button" className="flex-1" disabled={!isCurrentSectionValid || isSubmitting} onClick={goNext}>
                {t('common.next')}
              </Button>
            )}
            {currentIndex === totalSections - 1 && (
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? t('common.submitting') : t('common.submit')}
              </Button>
            )}
          </div>

          {submitError && <p className="text-red-600 mt-2">{submitError}</p>}
        </form>
      </Card.Body>
    </Card>
  );
};

export default ParentSurveyForm;



