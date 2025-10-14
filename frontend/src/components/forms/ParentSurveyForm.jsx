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

const ParentSurveyForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { submitForm, isSubmitting, submitError, submitSuccess } = useFormSubmission();

  const { values, errors, handleChange, validate, setFieldErrors } = useForm(
    {
      consentParticipate: false,
      confirmAdult: false,
      contactPhone: '',
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
      childAiToolsOften: '',
      childObservedChanges: [],
      childObservedChangesOther: '',
      childBenefits: [],
      childBenefitsOther: '',
      childConcerns: [],
      childConcernsOther: '',
      aiSupportTeachersParents: '',
      parentGuidanceConfidence: '',
      // Section 3
      perceivedBenefits: '',
      perceivedConcerns: '',
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
      // Section 5
      heardOfSparkOS: '',
      sparkosDistinctiveness: [],
      sparkosDistinctivenessOther: '',
      importanceTrackingFocusEmotion: '',
      comfortableBehaviorAnalysis: '',
      trustFeatures: [],
      trustFeaturesOther: '',
      expectedOutcomes: [],
      likelihoodTrySparkOS: 0,
      // Section 6
      aiRoleNextFiveYears: '',
      aiRoleNextFiveYearsOther: '',
      considerSparkOSFuture: '',
      additionalThoughts: '',
      contactEmail: '',
      // Optional
      supportTrainingNeeds: '',
      empathyFocusOpinion: '',
      idealAiCompanion: ''
    },
    validateParentSurveyForm
  );

  // Section configuration and navigation
  const sections = useMemo(() => [
    { id: 'intro', titleKey: 'parentSurvey.intro.title', fields: ['consentParticipate','confirmAdult'] },
    { id: 'section1', titleKey: 'parentSurvey.section1.title', fields: ['contactPhone','relationship','relationshipOther','childAgeRange','schoolingLevel','aiFamiliarity','childDevices','childDevicesOther'] },
    { id: 'section2A', titleKey: 'parentSurvey.section2A.title', fields: ['parentAiUsageFrequency','parentAiExperience','parentAiConfidence','parentAiPurposes','parentAiPurposesOther'] },
    { id: 'section2B', titleKey: 'parentSurvey.section2B.title', fields: ['childAiUsageLocation','childAiFrequency','childAiPurposes','childAiPurposesOther','childAiToolsOften','childObservedChanges','childObservedChangesOther','childBenefits','childBenefitsOther','childConcerns','childConcernsOther','aiSupportTeachersParents','parentGuidanceConfidence'] },
    { id: 'section3', titleKey: 'parentSurvey.section3.title', fields: ['perceivedBenefits','perceivedConcerns','importanceHumanInvolvement','aiSupportEmotionalFocus','likelihoodEncourageAi','preferredGuardrails','preferredGuardrailsOther'] },
    { id: 'section4', titleKey: 'parentSurvey.section4.title', fields: ['preAiLearningHabits','preAiLearningHabitsOther','postAiImprovements','engagingEnjoyable','aiInclusivity','specificLearningConsiderations'] },
    { id: 'section5', titleKey: 'parentSurvey.section5.title', fields: ['heardOfSparkOS','sparkosDistinctiveness','sparkosDistinctivenessOther','importanceTrackingFocusEmotion','comfortableBehaviorAnalysis','trustFeatures','trustFeaturesOther','expectedOutcomes','likelihoodTrySparkOS'] },
    { id: 'section6', titleKey: 'parentSurvey.section6.title', fields: ['aiRoleNextFiveYears','aiRoleNextFiveYearsOther','considerSparkOSFuture','additionalThoughts','contactEmail'] },
    { id: 'optional', titleKey: 'parentSurvey.optional.title', fields: ['supportTrainingNeeds','empathyFocusOpinion','idealAiCompanion'] },
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSections = sections.length;

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

  const goNext = () => {
    if (!isCurrentSectionValid) return; // gate progression
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
              <h2 className="text-xl font-semibold mb-2">{t('parentSurvey.intro.title')}</h2>
              <p className="text-gray-600 mb-3">{t('parentSurvey.intro.description')}</p>
              <div className="space-y-2">
                <Checkbox 
                  name="consentParticipate"
                  checked={values.consentParticipate}
                  onChange={(e) => handleChange('consentParticipate', e.target.checked)}
                  label={t('parentSurvey.intro.consent')}
                />
                <Checkbox 
                  name="confirmAdult"
                  checked={values.confirmAdult}
                  onChange={(e) => handleChange('confirmAdult', e.target.checked)}
                  label={t('parentSurvey.intro.adult')}
                />
              </div>
            </div>
          )}

          {/* Section 1: Background Information */}
          {currentSection.id === 'section1' && (
          <div>
            <h3 className="font-semibold mb-4">{t('parentSurvey.section1.title')}</h3>
            <div className="space-y-6">
              <Input
                name="contactPhone"
                label={t('parentSurvey.section1.contactPhone.label')}
                placeholder={t('parentSurvey.section1.contactPhone.placeholder')}
                value={values.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="max-w-md"
              />
              <Radio.Group
                name="relationship"
                label={t('parentSurvey.section1.relationship.label')}
                value={values.relationship}
                onChange={(e) => handleChange('relationship', e.target.value)}
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
                  placeholder={t('parentSurvey.section1.relationship.otherPlaceholder')}
                  className="ml-6 max-w-md"
                />
              )}

              <Radio.Group
                name="childAgeRange"
                label={t('parentSurvey.section1.childAgeRange.label')}
                value={values.childAgeRange}
                onChange={(e) => handleChange('childAgeRange', e.target.value)}
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
            <h3 className="font-semibold mb-4">{t('parentSurvey.section2A.title')}</h3>
            <div className="space-y-6">
              <Radio.Group
                name="parentAiUsageFrequency"
                label={t('parentSurvey.section2A.aiUsage.label')}
                value={values.parentAiUsageFrequency}
                onChange={(e) => handleChange('parentAiUsageFrequency', e.target.value)}
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
            <h3 className="font-semibold mb-4">{t('parentSurvey.section2B.title')}</h3>
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

              <Textarea
                name="childAiToolsOften"
                label={t('parentSurvey.section2B.toolsOften.label')}
                placeholder={t('parentSurvey.section2B.toolsOften.placeholder')}
                value={values.childAiToolsOften}
                onChange={(e) => handleChange('childAiToolsOften', e.target.value)}
              />

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

              <Textarea
                name="aiSupportTeachersParents"
                label={t('parentSurvey.section2B.supportTeachersParents.label')}
                placeholder={t('parentSurvey.section2B.supportTeachersParents.placeholder')}
                value={values.aiSupportTeachersParents}
                onChange={(e) => handleChange('aiSupportTeachersParents', e.target.value)}
              />

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
            <h3 className="font-semibold mb-4">{t('parentSurvey.section3.title')}</h3>
            <div className="space-y-6">
              <Textarea
                name="perceivedBenefits"
                label={t('parentSurvey.section3.perceivedBenefits.label')}
                value={values.perceivedBenefits}
                onChange={(e) => handleChange('perceivedBenefits', e.target.value)}
              />

              <Textarea
                name="perceivedConcerns"
                label={t('parentSurvey.section3.perceivedConcerns.label')}
                value={values.perceivedConcerns}
                onChange={(e) => handleChange('perceivedConcerns', e.target.value)}
              />

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
            <h3 className="font-semibold mb-4">{t('parentSurvey.section4.title')}</h3>
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

          {/* Section 5: Understanding SparkOS */}
          {currentSection.id === 'section5' && (
          <div>
            <h3 className="font-semibold mb-4">{t('parentSurvey.section5.title')}</h3>
            <div className="space-y-6">
              <Radio.Group
                name="heardOfSparkOS"
                label={t('parentSurvey.section5.heard.label')}
                value={values.heardOfSparkOS}
                onChange={(e) => handleChange('heardOfSparkOS', e.target.value)}
                options={[
                  { value: 'yes', label: t('parentSurvey.section5.heard.options.yes') },
                  { value: 'no', label: t('parentSurvey.section5.heard.options.no') }
                ]}
              />

              <Checkbox.Group
                name="sparkosDistinctiveness"
                label={t('parentSurvey.section5.distinctiveness.label')}
                values={values.sparkosDistinctiveness}
                onChange={(newValues) => handleChange('sparkosDistinctiveness', newValues)}
                otherOption={true}
                otherValue={values.sparkosDistinctivenessOther}
                onOtherChange={(val) => handleChange('sparkosDistinctivenessOther', val)}
                otherPlaceholder={t('parentSurvey.section5.distinctiveness.otherPlaceholder')}
                options={[
                  { value: 'emotionalBehaviorUnderstanding', label: t('parentSurvey.section5.distinctiveness.options.emotionalBehaviorUnderstanding') },
                  { value: 'inclusiveDesign', label: t('parentSurvey.section5.distinctiveness.options.inclusiveDesign') },
                  { value: 'safeGuided', label: t('parentSurvey.section5.distinctiveness.options.safeGuided') },
                  { value: 'analytics', label: t('parentSurvey.section5.distinctiveness.options.analytics') },
                  { value: 'selfDirected', label: t('parentSurvey.section5.distinctiveness.options.selfDirected') },
                  { value: 'other', label: t('parentSurvey.section5.distinctiveness.options.other') }
                ]}
              />

              <Radio.Group
                name="importanceTrackingFocusEmotion"
                label={t('parentSurvey.section5.trackingImportance.label')}
                value={values.importanceTrackingFocusEmotion}
                onChange={(e) => handleChange('importanceTrackingFocusEmotion', e.target.value)}
                options={[
                  { value: 'extremely', label: t('parentSurvey.section5.trackingImportance.options.extremely') },
                  { value: 'moderately', label: t('parentSurvey.section5.trackingImportance.options.moderately') },
                  { value: 'neutral', label: t('parentSurvey.section5.trackingImportance.options.neutral') },
                  { value: 'notImportant', label: t('parentSurvey.section5.trackingImportance.options.notImportant') }
                ]}
              />

              <Radio.Group
                name="comfortableBehaviorAnalysis"
                label={t('parentSurvey.section5.behaviorAnalysis.label')}
                value={values.comfortableBehaviorAnalysis}
                onChange={(e) => handleChange('comfortableBehaviorAnalysis', e.target.value)}
                options={[
                  { value: 'yes', label: t('parentSurvey.section5.behaviorAnalysis.options.yes') },
                  { value: 'maybe', label: t('parentSurvey.section5.behaviorAnalysis.options.maybe') },
                  { value: 'no', label: t('parentSurvey.section5.behaviorAnalysis.options.no') }
                ]}
              />

              <Checkbox.Group
                name="trustFeatures"
                label={t('parentSurvey.section5.trustFeatures.label')}
                values={values.trustFeatures}
                onChange={(newValues) => handleChange('trustFeatures', newValues)}
                otherOption={true}
                otherValue={values.trustFeaturesOther}
                onOtherChange={(val) => handleChange('trustFeaturesOther', val)}
                otherPlaceholder={t('parentSurvey.section5.trustFeatures.otherPlaceholder')}
                options={[
                  { value: 'transparentPolicies', label: t('parentSurvey.section5.trustFeatures.options.transparentPolicies') },
                  { value: 'parentalDashboards', label: t('parentSurvey.section5.trustFeatures.options.parentalDashboards') },
                  { value: 'childSafeModes', label: t('parentSurvey.section5.trustFeatures.options.childSafeModes') },
                  { value: 'offlineModes', label: t('parentSurvey.section5.trustFeatures.options.offlineModes') },
                  { value: 'certifiedEducators', label: t('parentSurvey.section5.trustFeatures.options.certifiedEducators') },
                  { value: 'educatorOversight', label: t('parentSurvey.section5.trustFeatures.options.educatorOversight') },
                  { value: 'dataMinimization', label: t('parentSurvey.section5.trustFeatures.options.dataMinimization') },
                  { value: 'optInConsent', label: t('parentSurvey.section5.trustFeatures.options.optInConsent') },
                  { value: 'other', label: t('parentSurvey.section5.trustFeatures.options.other') }
                ]}
              />

              <Checkbox.Group
                name="expectedOutcomes"
                label={t('parentSurvey.section5.expectedOutcomes.label')}
                values={values.expectedOutcomes}
                onChange={(newValues) => handleChange('expectedOutcomes', newValues)}
                maxSelection={3}
                options={[
                  { value: 'betterFocusHabits', label: t('parentSurvey.section5.expectedOutcomes.options.betterFocusHabits') },
                  { value: 'improvedGradesSkills', label: t('parentSurvey.section5.expectedOutcomes.options.improvedGradesSkills') },
                  { value: 'greaterMotivation', label: t('parentSurvey.section5.expectedOutcomes.options.greaterMotivation') },
                  { value: 'earlyFlags', label: t('parentSurvey.section5.expectedOutcomes.options.earlyFlags') },
                  { value: 'moreIndependence', label: t('parentSurvey.section5.expectedOutcomes.options.moreIndependence') },
                  { value: 'betterVisibility', label: t('parentSurvey.section5.expectedOutcomes.options.betterVisibility') }
                ]}
              />

              <Input
                type="number"
                name="likelihoodTrySparkOS"
                label={t('parentSurvey.section5.likelihoodTry.label')}
                value={values.likelihoodTrySparkOS}
                min={0}
                max={10}
                onChange={(e) => handleChange('likelihoodTrySparkOS', Number(e.target.value))}
                className="max-w-[120px]"
              />
            </div>
          </div>
          )}

          {/* Section 6: Looking Ahead */}
          {currentSection.id === 'section6' && (
          <div>
            <h3 className="font-semibold mb-4">{t('parentSurvey.section6.title')}</h3>
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
                label={t('parentSurvey.section6.considerSparkOS.label')}
                value={values.considerSparkOSFuture}
                onChange={(e) => handleChange('considerSparkOSFuture', e.target.value)}
                options={[
                  { value: 'definitelyYes', label: t('parentSurvey.section6.considerSparkOS.options.definitelyYes') },
                  { value: 'maybe', label: t('parentSurvey.section6.considerSparkOS.options.maybe') },
                  { value: 'notSure', label: t('parentSurvey.section6.considerSparkOS.options.notSure') },
                  { value: 'no', label: t('parentSurvey.section6.considerSparkOS.options.no') }
                ]}
              />

              <Textarea
                name="additionalThoughts"
                label={t('parentSurvey.section6.additionalThoughts.label')}
                value={values.additionalThoughts}
                onChange={(e) => handleChange('additionalThoughts', e.target.value)}
              />

              <Input
                type="email"
                name="contactEmail"
                label={t('parentSurvey.section6.contactEmail.label')}
                placeholder={t('parentSurvey.section6.contactEmail.placeholder')}
                value={values.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
              />
            </div>
          </div>
          )}

          {/* Optional Feedback */}
          {currentSection.id === 'optional' && (
          <div>
            <h3 className="font-semibold mb-4">{t('parentSurvey.optional.title')}</h3>
            <div className="space-y-6">
              <Textarea
                name="supportTrainingNeeds"
                label={t('parentSurvey.optional.supportTrainingNeeds.label')}
                value={values.supportTrainingNeeds}
                onChange={(e) => handleChange('supportTrainingNeeds', e.target.value)}
              />

              <Textarea
                name="empathyFocusOpinion"
                label={t('parentSurvey.optional.empathyFocusOpinion.label')}
                value={values.empathyFocusOpinion}
                onChange={(e) => handleChange('empathyFocusOpinion', e.target.value)}
              />

              <Input
                name="idealAiCompanion"
                label={t('parentSurvey.optional.idealAiCompanion.label')}
                value={values.idealAiCompanion}
                onChange={(e) => handleChange('idealAiCompanion', e.target.value)}
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
          {submitSuccess && <p className="text-green-600 mt-2">{t('common.success')}</p>}
        </form>
      </Card.Body>
    </Card>
  );
};

export default ParentSurveyForm;



