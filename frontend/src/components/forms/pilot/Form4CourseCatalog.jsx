import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from './shared/QuestionTypes/TextInput';
import TextArea from './shared/QuestionTypes/TextArea';
import RadioGroup from './shared/QuestionTypes/RadioGroup';
import CheckboxGroup from './shared/QuestionTypes/CheckboxGroup';

const Form4CourseCatalog = ({
  currentSection,
  formData,
  onFieldChange,
  Progress,
  Navigation,
  Section,
  onNext,
  onPrevious,
  onSaveDraft,
  onSubmit,
  saving,
  submitting,
  completedSections,
  validationErrors = {},
}) => {
  const { t } = useTranslation();
  const totalSections = 7;

  // Helper to update nested topic data
  const updateTopicField = (topicIndex, field, value) => {
    const topics = formData.newTopics || [{}, {}, {}];
    topics[topicIndex] = {
      ...topics[topicIndex],
      [field]: value,
    };
    onFieldChange('newTopics', topics);
  };

  // Section 0: Introduction and Consent
  const renderSection0 = () => (
    <Section title="">
      <div className="space-y-6">
        <div className="bg-[#7c59b2]/5 border border-[#7c59b2]/100 rounded-3xl p-6">
          <p className="text-gray-700 mb-4">
            {t('form4:intro.purpose')}
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>{t('form4:intro.bullet1')}</li>
            <li>{t('form4:intro.bullet2')}</li>
            <li>{t('form4:intro.bullet3')}</li>
            <li>{t('form4:intro.bullet4')}</li>
          </ul>
          <p className="text-gray-600 mt-4 italic">
            {t('form4:intro.confidential')}
          </p>
        </div>
        <div className='mt-'>
        <CheckboxGroup
          label=""
          values={formData.consent ? ['consent'] : []}
          onChange={(val) => onFieldChange('consent', val.includes('consent'))}
          options={[
            { value: 'consent', label: t('form4:consent.text') }
          ]}
          unstyled
          error={validationErrors.consent ? t('pilotSurveys:form.requiredField') : null}
          fieldName="consent"
        />
        </div>
      </div>
    </Section>
  );

  // Section 1: Your Profile
  const renderSection1 = () => (
    <Section title={t('form4:section1.title')} paddingClass="py-4">
      <div className="pb-0">
        <TextInput
          label={t('form4:section1.name.label')}
          value={formData.name}
          onChange={(val) => onFieldChange('name', val)}
          placeholder={t('form4:section1.name.placeholder')}
          required
          error={validationErrors.name ? t('pilotSurveys:form.requiredField') : null}
          fieldName="name"
        />
        
        <RadioGroup
          label={t('form4:section1.role.label')}
          value={formData.role}
          onChange={(val) => onFieldChange('role', val)}
          options={[
            { value: 'facilitator', label: t('form4:section1.role.facilitator') },
            { value: 'specialist', label: t('form4:section1.role.specialist') },
            { value: 'coordinator', label: t('form4:section1.role.coordinator') },
            { value: 'designer', label: t('form4:section1.role.designer') },
            { value: 'other', label: t('form4:section1.role.other') },
          ]}
          required
          error={validationErrors.role ? t('pilotSurveys:form.requiredField') : null}
          fieldName="role"
          renderInline={(value) => {
            if (value === 'other') {
              return (
                <TextInput
                  label={null}
                  value={formData.roleOther}
                  onChange={(val) => onFieldChange('roleOther', val)}
                  placeholder={t('form4:section1.role.otherPlaceholder')}
                  containerClassName="!p-0 !border-0 -mt-2"
                />
              );
            }
          }}
        />
        
        <RadioGroup
          label={t('form4:section1.years.label')}
          value={formData.years}
          onChange={(val) => onFieldChange('years', val)}
          options={[
            { value: 'less1', label: t('form4:section1.years.less1') },
            { value: '1to3', label: t('form4:section1.years.1to3') },
            { value: '3to5', label: t('form4:section1.years.3to5') },
            { value: '5plus', label: t('form4:section1.years.5plus') },
          ]}
          required
          error={validationErrors.years ? t('pilotSurveys:form.requiredField') : null}
          fieldName="years"
        />
      </div>
    </Section>
  );

  // Section 2: Course Inventory
  const renderSection2 = () => (
    <Section title={t('form4:section2.title')}>
      <CheckboxGroup
        label={t('form4:section2.methodologies.label')}
        values={formData.methodologies || []}
        onChange={(val) => onFieldChange('methodologies', val)}
        options={[
          { value: 'traditional', label: t('form4:section2.methodologies.traditional') },
          { value: 'project', label: t('form4:section2.methodologies.project') },
          { value: 'inquiry', label: t('form4:section2.methodologies.inquiry') },
          { value: 'selfDirected', label: t('form4:section2.methodologies.selfDirected') },
          { value: 'flipped', label: t('form4:section2.methodologies.flipped') },
          { value: 'blended', label: t('form4:section2.methodologies.blended') },
          { value: 'experiential', label: t('form4:section2.methodologies.experiential') },
          { value: 'socratic', label: t('form4:section2.methodologies.socratic') },
          { value: 'other', label: t('form4:section2.methodologies.other') },
        ]}
        required
        error={validationErrors.methodologies ? t('pilotSurveys:form.requiredField') : null}
        fieldName="methodologies"
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.methodologiesOther}
                onChange={(val) => onFieldChange('methodologiesOther', val)}
                placeholder={t('form4:section2.methodologies.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
              />
            );
          }
        }}
      />
      
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          {t('form4:section2.curriculumNote.title')}
        </h3>
        <p className="text-sm text-blue-800 mb-3">
          {t('form4:section2.curriculumNote.instruction')}
        </p>
        <p className="text-sm text-blue-800 mb-3 font-medium">
          {t('form4:section2.curriculumNote.format')}
        </p>
        <p className="text-sm text-blue-800 mb-3">
          {t('form4:section2.curriculumNote.includes')}
        </p>
        <p className="text-sm text-blue-800 mb-2">
          <strong>{t('form4:section2.curriculumNote.filename')}</strong>
        </p>
        <p className="text-sm text-blue-800 italic">
          {t('form4:section2.curriculumNote.upload')}
        </p>
      </div>
    </Section>
  );

  // Section 3: Course Effectiveness
  const renderSection3 = () => (
    <Section title={t('form4:section3.title')}>
      <RadioGroup
        label={t('form4:section3.effectiveness.label')}
        value={formData.effectiveness}
        onChange={(val) => onFieldChange('effectiveness', val)}
        options={[
          { value: 'very', label: t('form4:section3.effectiveness.very') },
          { value: 'effective', label: t('form4:section3.effectiveness.effective') },
          { value: 'neutral', label: t('form4:section3.effectiveness.neutral') },
          { value: 'partial', label: t('form4:section3.effectiveness.partial') },
          { value: 'ineffective', label: t('form4:section3.effectiveness.ineffective') },
        ]}
        required
        error={validationErrors.effectiveness ? t('pilotSurveys:form.requiredField') : null}
        fieldName="effectiveness"
      />
      
      <CheckboxGroup
        label={t('form4:section3.whatWorks.label')}
        values={formData.whatWorks || []}
        onChange={(val) => onFieldChange('whatWorks', val)}
        options={[
          { value: 'handson', label: t('form4:section3.whatWorks.handson') },
          { value: 'clear', label: t('form4:section3.whatWorks.clear') },
          { value: 'realWorld', label: t('form4:section3.whatWorks.realWorld') },
          { value: 'collaborative', label: t('form4:section3.whatWorks.collaborative') },
          { value: 'creative', label: t('form4:section3.whatWorks.creative') },
          { value: 'other', label: t('form4:section3.whatWorks.other') },
        ]}
        required
        error={validationErrors.whatWorks ? t('pilotSurveys:form.requiredField') : null}
        fieldName="whatWorks"
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.whatWorksOther}
                onChange={(val) => onFieldChange('whatWorksOther', val)}
                placeholder={t('form4:section3.whatWorks.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
              />
            );
          }
        }}
      />
      
      <CheckboxGroup
        label={t('form4:section3.barriers.label')}
        values={formData.barriers || []}
        onChange={(val) => onFieldChange('barriers', val)}
        options={[
          { value: 'difficulty', label: t('form4:section3.barriers.difficulty') },
          { value: 'varied', label: t('form4:section3.barriers.varied') },
          { value: 'supports', label: t('form4:section3.barriers.supports') },
          { value: 'cultural', label: t('form4:section3.barriers.cultural') },
          { value: 'ell', label: t('form4:section3.barriers.ell') },
          { value: 'pacing', label: t('form4:section3.barriers.pacing') },
          { value: 'tech', label: t('form4:section3.barriers.tech') },
          { value: 'assessment', label: t('form4:section3.barriers.assessment') },
          { value: 'other', label: t('form4:section3.barriers.other') },
        ]}
        required
        error={validationErrors.barriers ? t('pilotSurveys:form.requiredField') : null}
        fieldName="barriers"
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.barriersOther}
                onChange={(val) => onFieldChange('barriersOther', val)}
                placeholder={t('form4:section3.barriers.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
              />
            );
          }
        }}
      />
      
      <div className="mb-6 pt-6">
        <label className="block text-base font-semibold text-gray-900 mb-1">
          {t('form4:section3.assessmentMethods.label')}
        </label>
        <div className="flex flex-col gap-0">
          <CheckboxGroup
            label={
              <>
                {t('form4:section3.assessmentMethods.formats')}
                <span className="text-red-500 ml-1">*</span>
              </>
            }
            values={formData.assessmentFormats || []}
            onChange={(val) => onFieldChange('assessmentFormats', val)}
            options={[
              { value: 'quizzes', label: t('form4:section3.assessmentMethods.quizzes') },
              { value: 'project', label: t('form4:section3.assessmentMethods.project') },
              { value: 'peer', label: t('form4:section3.assessmentMethods.peer') },
              { value: 'reflection', label: t('form4:section3.assessmentMethods.reflection') },
              { value: 'presentations', label: t('form4:section3.assessmentMethods.presentations') },
            ]}
            error={validationErrors.assessmentFormats ? t('pilotSurveys:form.requiredField') : null}
            fieldName="assessmentFormats"
          />
          <CheckboxGroup
            label={
              <>
                {t('form4:section3.assessmentMethods.metrics')}
                <span className="text-red-500 ml-1">*</span>
              </>
            }
            values={formData.assessmentMetrics || []}
            onChange={(val) => onFieldChange('assessmentMetrics', val)}
            options={[
              { value: 'attendance', label: t('form4:section3.assessmentMethods.attendance') },
              { value: 'feedback', label: t('form4:section3.assessmentMethods.feedback') },
              { value: 'performance', label: t('form4:section3.assessmentMethods.performance') },
              { value: 'portfolios', label: t('form4:section3.assessmentMethods.portfolios') },
              { value: 'other', label: t('form4:section3.assessmentMethods.other') },
            ]}
            error={validationErrors.assessmentMetrics ? t('pilotSurveys:form.requiredField') : null}
            fieldName="assessmentMetrics"
            renderInline={(value) => {
              if (value === 'other') {
                return (
                  <TextInput
                    label={null}
                    value={formData.assessmentMetricsOther}
                    onChange={(val) => onFieldChange('assessmentMetricsOther', val)}
                    placeholder={t('form4:section3.assessmentMethods.otherPlaceholder')}
                    containerClassName="!p-0 !border-0 -mt-2"
                  />
                );
              }
            }}
          />
        </div>
        </div>
      
      <RadioGroup
        label={t('form4:section3.midFeedback.label')}
        value={formData.midFeedback}
        onChange={(val) => onFieldChange('midFeedback', val)}
        options={[
          { value: 'weekly', label: t('form4:section3.midFeedback.weekly') },
          { value: 'monthly', label: t('form4:section3.midFeedback.monthly') },
          { value: 'endOnly', label: t('form4:section3.midFeedback.endOnly') },
          { value: 'notDone', label: t('form4:section3.midFeedback.notDone') },
        ]}
        required
        error={validationErrors.midFeedback ? t('pilotSurveys:form.requiredField') : null}
        fieldName="midFeedback"
      />
      
      <CheckboxGroup
        label={t('form4:section3.effectiveFormats.label')}
        values={formData.effectiveFormats || []}
        onChange={(val) => onFieldChange('effectiveFormats', val)}
        options={[
          { value: 'quizzes', label: t('form4:section3.effectiveFormats.quizzes') },
          { value: 'project', label: t('form4:section3.effectiveFormats.project') },
          { value: 'peer', label: t('form4:section3.effectiveFormats.peer') },
          { value: 'reflection', label: t('form4:section3.effectiveFormats.reflection') },
          { value: 'oral', label: t('form4:section3.effectiveFormats.oral') },
          { value: 'other', label: t('form4:section3.effectiveFormats.other') },
        ]}
        required
        error={validationErrors.effectiveFormats ? t('pilotSurveys:form.requiredField') : null}
        fieldName="effectiveFormats"
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.effectiveFormatsOther}
                onChange={(val) => onFieldChange('effectiveFormatsOther', val)}
                placeholder={t('form4:section3.effectiveFormats.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
              />
            );
          }
        }}
      />
      
      <RadioGroup
        label={t('form4:section3.skillTransfer.label')}
        value={formData.skillTransfer}
        onChange={(val) => onFieldChange('skillTransfer', val)}
        options={[
          { value: 'very', label: t('form4:section3.skillTransfer.very') },
          { value: 'somewhat', label: t('form4:section3.skillTransfer.somewhat') },
          { value: 'not', label: t('form4:section3.skillTransfer.not') },
          { value: 'unsure', label: t('form4:section3.skillTransfer.unsure') },
        ]}
        required
        error={validationErrors.skillTransfer ? t('pilotSurveys:form.requiredField') : null}
        fieldName="skillTransfer"
      />
    </Section>
  );

  // Section 4: Digitalization Interest
  const renderSection4 = () => (
    <Section title={t('form4:section4.title')}>
      <TextArea
        label={t('form4:section4.onlineCourses.label')}
        value={formData.onlineCourses}
        onChange={(val) => onFieldChange('onlineCourses', val)}
        placeholder={t('form4:section4.onlineCourses.placeholder')}
        rows={3}
        required
        error={validationErrors.onlineCourses ? t('pilotSurveys:form.requiredField') : null}
        fieldName="onlineCourses"
      />
      
      <CheckboxGroup
        label={t('form4:section4.digitalFeatures.label')}
        values={formData.digitalFeatures || []}
        onChange={(val) => onFieldChange('digitalFeatures', val)}
        options={[
          { value: 'video', label: t('form4:section4.digitalFeatures.video') },
          { value: 'quizzes', label: t('form4:section4.digitalFeatures.quizzes') },
          { value: 'resources', label: t('form4:section4.digitalFeatures.resources') },
          { value: 'webinars', label: t('form4:section4.digitalFeatures.webinars') },
          { value: 'forums', label: t('form4:section4.digitalFeatures.forums') },
          { value: 'tracking', label: t('form4:section4.digitalFeatures.tracking') },
          { value: 'other', label: t('form4:section4.digitalFeatures.other') },
        ]}
        required
        error={validationErrors.digitalFeatures ? t('pilotSurveys:form.requiredField') : null}
        fieldName="digitalFeatures"
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.digitalFeaturesOther}
                onChange={(val) => onFieldChange('digitalFeaturesOther', val)}
                placeholder={t('form4:section4.digitalFeatures.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
              />
            );
          }
        }}
      />
      
      <CheckboxGroup
        label={t('form4:section4.challenges.label')}
        values={formData.digitalChallenges || []}
        onChange={(val) => onFieldChange('digitalChallenges', val)}
        options={[
          { value: 'training', label: t('form4:section4.challenges.training') },
          { value: 'access', label: t('form4:section4.challenges.access') },
          { value: 'redesign', label: t('form4:section4.challenges.redesign') },
          { value: 'engagement', label: t('form4:section4.challenges.engagement') },
          { value: 'platform', label: t('form4:section4.challenges.platform') },
          { value: 'other', label: t('form4:section4.challenges.other') },
        ]}
        required
        error={validationErrors.digitalChallenges ? t('pilotSurveys:form.requiredField') : null}
        fieldName="digitalChallenges"
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.digitalChallengesOther}
                onChange={(val) => onFieldChange('digitalChallengesOther', val)}
                placeholder={t('form4:section4.challenges.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
              />
            );
          }
        }}
      />
      
      <RadioGroup
        label={t('form4:section4.readiness.label')}
        value={formData.readiness}
        onChange={(val) => onFieldChange('readiness', val)}
        options={[
          { value: 'fully', label: t('form4:section4.readiness.fully') },
          { value: 'partially', label: t('form4:section4.readiness.partially') },
          { value: 'not', label: t('form4:section4.readiness.not') },
          { value: 'unsure', label: t('form4:section4.readiness.unsure') },
        ]}
        required
        error={validationErrors.readiness ? t('pilotSurveys:form.requiredField') : null}
        fieldName="readiness"
      />
      
      <TextArea
        label={t('form4:section4.platforms.label')}
        value={formData.platforms}
        onChange={(val) => onFieldChange('platforms', val)}
        placeholder={t('form4:section4.platforms.placeholder')}
        rows={3}
        required
        error={validationErrors.platforms ? t('pilotSurveys:form.requiredField') : null}
        fieldName="platforms"
      />
      
      <CheckboxGroup
        label={t('form4:section4.supportNeeded.label')}
        values={formData.supportNeeded || []}
        onChange={(val) => onFieldChange('supportNeeded', val)}
        options={[
          { value: 'instructional', label: t('form4:section4.supportNeeded.instructional') },
          { value: 'video', label: t('form4:section4.supportNeeded.video') },
          { value: 'administration', label: t('form4:section4.supportNeeded.administration') },
          { value: 'accessibility', label: t('form4:section4.supportNeeded.accessibility') },
          { value: 'privacy', label: t('form4:section4.supportNeeded.privacy') },
          { value: 'other', label: t('form4:section4.supportNeeded.other') },
        ]}
        required
        error={validationErrors.supportNeeded ? t('pilotSurveys:form.requiredField') : null}
        fieldName="supportNeeded"
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.supportNeededOther}
                onChange={(val) => onFieldChange('supportNeededOther', val)}
                placeholder={t('form4:section4.supportNeeded.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
              />
            );
          }
        }}
      />
      
      <TextArea
        label={t('form4:section4.privacyConcerns.label')}
        value={formData.privacyConcerns}
        onChange={(val) => onFieldChange('privacyConcerns', val)}
        placeholder={t('form4:section4.privacyConcerns.placeholder')}
        rows={4}
        required
        error={validationErrors.privacyConcerns ? t('pilotSurveys:form.requiredField') : null}
        fieldName="privacyConcerns"
      />
    </Section>
  );

  // Section 5: Future Course Strategy
  const renderSection5 = () => {
    const topics = formData.newTopics || [{}, {}, {}];
    
    return (
      <Section title={t('form4:section5.title')}>
        <div className="mb-6" data-field-name="newTopics">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {t('form4:section5.newTopics.label')}
            <span className="text-red-600 ml-1 text-xl font-bold">*</span>
          </label>
          {validationErrors.newTopics && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 rounded-lg">
              <p className="text-red-600 font-bold">
                <span className="text-2xl mr-2">⚠️</span>
                {t('pilotSurveys:form.requiredField')}
              </p>
            </div>
          )}
          
          {[0, 1, 2].map((index) => (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                {t(`form4:section5.newTopics.topic${index + 1}`)}
              </h4>
              
              <TextInput
                label={t('form4:section5.newTopics.topicPlaceholder')}
                value={topics[index]?.name || ''}
                onChange={(val) => updateTopicField(index, 'name', val)}
                placeholder={t('form4:section5.newTopics.topicPlaceholder')}
              />
              
              <RadioGroup
                label={t('form4:section5.newTopics.digital')}
                value={topics[index]?.digital || ''}
                onChange={(val) => updateTopicField(index, 'digital', val)}
                options={[
                  { value: 'yes', label: t('form4:section5.newTopics.yes') },
                  { value: 'no', label: t('form4:section5.newTopics.no') },
                ]}
              />
              
              <TextInput
                label={t('form4:section5.newTopics.rationale')}
                value={topics[index]?.rationale || ''}
                onChange={(val) => updateTopicField(index, 'rationale', val)}
                placeholder={t('form4:section5.newTopics.rationalePlaceholder')}
              />
            </div>
          ))}
        </div>
        
        <CheckboxGroup
          label={t('form4:section5.approaches.label')}
          values={formData.approaches || []}
          onChange={(val) => onFieldChange('approaches', val)}
          options={[
            { value: 'experiential', label: t('form4:section5.approaches.experiential') },
            { value: 'collaborative', label: t('form4:section5.approaches.collaborative') },
            { value: 'selfDirected', label: t('form4:section5.approaches.selfDirected') },
            { value: 'adaptive', label: t('form4:section5.approaches.adaptive') },
            { value: 'blended', label: t('form4:section5.approaches.blended') },
            { value: 'other', label: t('form4:section5.approaches.other') },
          ]}
          required
          error={validationErrors.approaches ? t('pilotSurveys:form.requiredField') : null}
          fieldName="approaches"
        />
        
        {formData.approaches?.includes('other') && (
          <TextInput
            label={t('form4:section5.approaches.otherPlaceholder')}
            value={formData.approachesOther}
            onChange={(val) => onFieldChange('approachesOther', val)}
            placeholder={t('form4:section5.approaches.otherPlaceholder')}
          />
        )}
        
        <CheckboxGroup
          label={t('form4:section5.additionalSupport.label')}
          values={formData.additionalSupport || []}
          onChange={(val) => onFieldChange('additionalSupport', val)}
          options={[
            { value: 'training', label: t('form4:section5.additionalSupport.training') },
            { value: 'technical', label: t('form4:section5.additionalSupport.technical') },
            { value: 'other', label: t('form4:section5.additionalSupport.other') },
          ]}
          required
          error={validationErrors.additionalSupport ? t('pilotSurveys:form.requiredField') : null}
          fieldName="additionalSupport"
        />
        
        {formData.additionalSupport?.includes('other') && (
          <TextInput
            label={t('form4:section5.additionalSupport.otherPlaceholder')}
            value={formData.additionalSupportOther}
            onChange={(val) => onFieldChange('additionalSupportOther', val)}
            placeholder={t('form4:section5.additionalSupport.otherPlaceholder')}
          />
        )}
        
        <RadioGroup
          label={t('form4:section5.timeline.label')}
          value={formData.timeline}
          onChange={(val) => onFieldChange('timeline', val)}
          options={[
            { value: '0to2', label: t('form4:section5.timeline.0to2') },
            { value: '2to3', label: t('form4:section5.timeline.2to3') },
            { value: '3to6', label: t('form4:section5.timeline.3to6') },
            { value: '6to12', label: t('form4:section5.timeline.6to12') },
            { value: '12plus', label: t('form4:section5.timeline.12plus') },
          ]}
          required
          error={validationErrors.timeline ? t('pilotSurveys:form.requiredField') : null}
          fieldName="timeline"
        />
        
        <RadioGroup
          label={t('form4:section5.integration.label')}
          value={formData.integration}
          onChange={(val) => onFieldChange('integration', val)}
          options={[
            { value: 'electives', label: t('form4:section5.integration.electives') },
            { value: 'core', label: t('form4:section5.integration.core') },
            { value: 'credit', label: t('form4:section5.integration.credit') },
            { value: 'unsure', label: t('form4:section5.integration.unsure') },
          ]}
          required
          error={validationErrors.integration ? t('pilotSurveys:form.requiredField') : null}
          fieldName="integration"
        />
        
        <TextArea
        label={t('form4:section5.partnerships.label')}
          value={formData.partnerships}
          onChange={(val) => onFieldChange('partnerships', val)}
        placeholder={t('form4:section5.partnerships.placeholder')}
          rows={4}
          required
          error={validationErrors.partnerships ? t('pilotSurveys:form.requiredField') : null}
          fieldName="partnerships"
        />
      </Section>
    );
  };

  // Section 6: Additional Insights
  const renderSection6 = () => (
    <Section title={t('form4:section6.title')}>
      <CheckboxGroup
        label={t('form4:section6.successMetrics.label')}
        values={formData.successMetrics || []}
        onChange={(val) => {
          // Limit to 2 selections
          if (val.length <= 2) {
            onFieldChange('successMetrics', val);
          }
        }}
        options={[
          { value: 'completion', label: t('form4:section6.successMetrics.completion') },
          { value: 'engagement', label: t('form4:section6.successMetrics.engagement') },
          { value: 'satisfaction', label: t('form4:section6.successMetrics.satisfaction') },
          { value: 'outcomes', label: t('form4:section6.successMetrics.outcomes') },
          { value: 'dropout', label: t('form4:section6.successMetrics.dropout') },
          { value: 'other', label: t('form4:section6.successMetrics.other') },
        ]}
        required
        error={validationErrors.successMetrics ? t('pilotSurveys:form.requiredField') : null}
        fieldName="successMetrics"
      />
      {formData.successMetrics && formData.successMetrics.length === 2 && (
        <p className="text-sm text-blue-600 -mt-4 mb-4">{t('pilotSurveys:form.maxSelections', { count: 2 })}</p>
      )}
      
      {formData.successMetrics?.includes('other') && (
        <TextInput
          label={t('form4:section6.successMetrics.otherPlaceholder')}
          value={formData.successMetricsOther}
          onChange={(val) => onFieldChange('successMetricsOther', val)}
          placeholder={t('form4:section6.successMetrics.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('form4:section6.singleChange.label')}
        value={formData.singleChange}
        onChange={(val) => onFieldChange('singleChange', val)}
        placeholder={t('form4:section6.singleChange.placeholder')}
        rows={4}
        required
        error={validationErrors.singleChange ? t('pilotSurveys:form.requiredField') : null}
        fieldName="singleChange"
      />
      
      <TextArea
        label={t('form4:section6.additionalComments.label')}
        value={formData.additionalComments}
        onChange={(val) => onFieldChange('additionalComments', val)}
        placeholder={t('form4:section6.additionalComments.placeholder')}
        rows={5}
        required
        error={validationErrors.additionalComments ? t('pilotSurveys:form.requiredField') : null}
        fieldName="additionalComments"
      />
    </Section>
  );

  const sections = [
    renderSection0,
    renderSection1,
    renderSection2,
    renderSection3,
    renderSection4,
    renderSection5,
    renderSection6,
  ];

  return (
    <>
      <Progress
        currentSection={currentSection}
        totalSections={totalSections}
        completedSections={completedSections}
      />
      <div>
        {sections[currentSection - 1]()}
      </div>
      <Navigation
        currentSection={currentSection}
        totalSections={totalSections}
        onPrevious={onPrevious}
        onNext={onNext}
        onSaveDraft={onSaveDraft}
        onSubmit={onSubmit}
        saving={saving}
        submitting={submitting}
        canGoNext={true}
        canGoPrevious={true}
        isTransparent={currentSection === 1}
      />
    </>
  );
};

export default Form4CourseCatalog;
