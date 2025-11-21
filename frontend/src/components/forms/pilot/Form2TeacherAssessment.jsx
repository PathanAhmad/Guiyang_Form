import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from './shared/QuestionTypes/TextInput';
import TextArea from './shared/QuestionTypes/TextArea';
import RadioGroup from './shared/QuestionTypes/RadioGroup';
import CheckboxGroup from './shared/QuestionTypes/CheckboxGroup';
import DateInput from './shared/QuestionTypes/DateInput';

const Form2TeacherAssessment = ({
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
  canGoNext,
}) => {
  const { t } = useTranslation();
  const totalSections = 6;

  // Section 0: Introduction and Consent
  const renderSection0 = () => (
    <Section>
      <div className="space-y-6 pb-30">
        <div className="bg-gradient-to-br from-[#7c59b2]/20 to-[#7c59b2]/40 rounded-[2rem] p-6">
          <h3 className="text-lg font-normal text-gray-900 mb-3">
            {t('form2:intro.welcome')}
          </h3>
          <p className="text-gray-700 font-semibold mb-2">
            {t('form2:intro.helps')}
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>{t('form2:intro.bullet1')}</li>
            <li>{t('form2:intro.bullet2')}</li>
            <li>{t('form2:intro.bullet3')}</li>
          </ul>
          <p className="text-gray-600 mt-4 italic">
            {t('form2:intro.confidential')}
          </p>
        </div>

        <div className="pt-6">
          <CheckboxGroup
            label=""
            values={formData.consent ? ['consent'] : []}
            onChange={(val) => onFieldChange('consent', val.includes('consent'))}
            options={[
              { value: 'consent', label: <>{t('form2:consent.text')}<span className="text-red-500 ml-1">*</span></> }
            ]}
            error={validationErrors.consent ? t('pilotSurveys:form.requiredField') : null}
            fieldName="consent"
            unstyled={true}
          />
        </div>
      </div>
    </Section>
  );

  // Section 1: Personal Information
  const renderSection1 = () => (
    <Section title={t('form2:section1.title')} paddingClass="pt-8">
      <TextInput
        label={t('form2:section1.fullName.label')}
        value={formData.fullName}
        onChange={(val) => onFieldChange('fullName', val)}
        placeholder={t('form2:section1.fullName.placeholder')}
        required
        error={validationErrors.fullName ? t('pilotSurveys:form.requiredField') : null}
        fieldName="fullName"
      />
      
      <DateInput
        label={t('form2:section1.dateOfBirth.label')}
        value={formData.dateOfBirth}
        onChange={(val) => onFieldChange('dateOfBirth', val)}
        placeholder={t('form2:section1.dateOfBirth.placeholder')}
        required
        error={validationErrors.dateOfBirth ? t('pilotSurveys:form.requiredField') : null}
        fieldName="dateOfBirth"
      />
      
      <TextInput
        label={t('form2:section1.email.label')}
        value={formData.email}
        onChange={(val) => onFieldChange('email', val)}
        placeholder={t('form2:section1.email.placeholder')}
        required
        error={validationErrors.email ? t('pilotSurveys:form.requiredField') : null}
        fieldName="email"
      />
      
      <TextInput
        label={t('form2:section1.phone.label')}
        value={formData.phone}
        onChange={(val) => onFieldChange('phone', val)}
        placeholder={t('form2:section1.phone.placeholder')}
        required
        error={validationErrors.phone ? t('pilotSurveys:form.requiredField') : null}
        fieldName="phone"
      />
    </Section>
  );

  // Section 2: Professional Information
  const renderSection2 = () => (
    <Section title={t('form2:section2.title')}>
      <CheckboxGroup
        label={t('form2:section2.role.label')}
        values={formData.role || []}
        onChange={(val) => onFieldChange('role', val)}
        options={[
          { value: 'educator', label: t('form2:section2.role.educator') },
          { value: 'specialist', label: t('form2:section2.role.specialist') },
          { value: 'coordinator', label: t('form2:section2.role.coordinator') },
          { value: 'counselor', label: t('form2:section2.role.counselor') },
          { value: 'other', label: t('form2:section2.role.other') },
        ]}
        required
        error={validationErrors.role ? t('pilotSurveys:form.requiredField') : null}
        fieldName="role"
      />
      
      {formData.role?.includes('other') && (
        <TextInput
          label={t('form2:section2.role.otherPlaceholder')}
          value={formData.roleOther}
          onChange={(val) => onFieldChange('roleOther', val)}
          placeholder={t('form2:section2.role.otherPlaceholder')}
          fieldName="roleOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <RadioGroup
        label={t('form2:section2.experience.label')}
        value={formData.experience}
        onChange={(val) => onFieldChange('experience', val)}
        options={[
          { value: 'lessThan1', label: t('form2:section2.experience.lessThan1') },
          { value: 'oneToThree', label: t('form2:section2.experience.oneToThree') },
          { value: 'fourToSix', label: t('form2:section2.experience.fourToSix') },
          { value: 'sevenToTen', label: t('form2:section2.experience.sevenToTen') },
          { value: 'moreThan10', label: t('form2:section2.experience.moreThan10') },
        ]}
        required
        error={validationErrors.experience ? t('pilotSurveys:form.requiredField') : null}
        fieldName="experience"
      />
      
      <RadioGroup
        label={t('form2:section2.frequency.label')}
        value={formData.frequency}
        onChange={(val) => onFieldChange('frequency', val)}
        options={[
          { value: 'daily', label: t('form2:section2.frequency.daily') },
          { value: 'severalWeekly', label: t('form2:section2.frequency.severalWeekly') },
          { value: 'weekly', label: t('form2:section2.frequency.weekly') },
          { value: 'occasionally', label: t('form2:section2.frequency.occasionally') },
        ]}
        required
        error={validationErrors.frequency ? t('pilotSurveys:form.requiredField') : null}
        fieldName="frequency"
      />
      
      <CheckboxGroup
        label={t('form2:section2.ageGroups.label')}
        values={formData.ageGroups || []}
        onChange={(val) => onFieldChange('ageGroups', val)}
        options={[
          { value: 'earlyChildhood', label: t('form2:section2.ageGroups.earlyChildhood') },
          { value: 'primary', label: t('form2:section2.ageGroups.primary') },
          { value: 'middleSchool', label: t('form2:section2.ageGroups.middleSchool') },
          { value: 'highSchool', label: t('form2:section2.ageGroups.highSchool') },
          { value: 'adult', label: t('form2:section2.ageGroups.adult') },
          { value: 'other', label: t('form2:section2.ageGroups.other') },
        ]}
        required
        error={validationErrors.ageGroups ? t('pilotSurveys:form.requiredField') : null}
        fieldName="ageGroups"
      />
      
      {formData.ageGroups?.includes('other') && (
        <TextInput
          label={t('form2:section2.ageGroups.otherPlaceholder')}
          value={formData.ageGroupsOther}
          onChange={(val) => onFieldChange('ageGroupsOther', val)}
          placeholder={t('form2:section2.ageGroups.otherPlaceholder')}
          fieldName="ageGroupsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section2.schedule.label')}
        values={formData.schedule || []}
        onChange={(val) => onFieldChange('schedule', val)}
        options={[
          { value: 'fullTime', label: t('form2:section2.schedule.fullTime') },
          { value: 'partTime', label: t('form2:section2.schedule.partTime') },
          { value: 'rotational', label: t('form2:section2.schedule.rotational') },
          { value: 'other', label: t('form2:section2.schedule.other') },
        ]}
        required
        error={validationErrors.schedule ? t('pilotSurveys:form.requiredField') : null}
        fieldName="schedule"
      />
      
      {formData.schedule?.includes('other') && (
        <TextInput
          label={t('form2:section2.schedule.otherPlaceholder')}
          value={formData.scheduleOther}
          onChange={(val) => onFieldChange('scheduleOther', val)}
          placeholder={t('form2:section2.schedule.otherPlaceholder')}
          fieldName="scheduleOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
    </Section>
  );

  // Section 3: Educational Background & Qualifications
  const renderSection3 = () => (
    <Section title={t('form2:section3.title')}>
      <RadioGroup
        label={t('form2:section3.education.label')}
        value={formData.education}
        onChange={(val) => onFieldChange('education', val)}
        options={[
          { value: 'highSchool', label: t('form2:section3.education.highSchool') },
          { value: 'associate', label: t('form2:section3.education.associate') },
          { value: 'bachelor', label: t('form2:section3.education.bachelor') },
          { value: 'master', label: t('form2:section3.education.master') },
          { value: 'doctorate', label: t('form2:section3.education.doctorate') },
          { value: 'other', label: t('form2:section3.education.other') },
        ]}
        required
        error={validationErrors.education ? t('pilotSurveys:form.requiredField') : null}
        fieldName="education"
      />
      
      {formData.education === 'other' && (
        <TextInput
          label={t('form2:section3.education.otherPlaceholder')}
          value={formData.educationOther}
          onChange={(val) => onFieldChange('educationOther', val)}
          placeholder={t('form2:section3.education.otherPlaceholder')}
          fieldName="educationOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <TextArea
        label={t('form2:section3.specialization.label')}
        value={formData.specialization}
        onChange={(val) => onFieldChange('specialization', val)}
        placeholder={t('form2:section3.specialization.placeholder')}
        rows={2}
        required
        error={validationErrors.specialization ? t('pilotSurveys:form.requiredField') : null}
        fieldName="specialization"
      />
      
      <CheckboxGroup
        label={t('form2:section3.certifications.label')}
        values={formData.certifications || []}
        onChange={(val) => onFieldChange('certifications', val)}
        options={[
          { value: 'teaching', label: t('form2:section3.certifications.teaching') },
          { value: 'specialEd', label: t('form2:section3.certifications.specialEd') },
          { value: 'edtech', label: t('form2:section3.certifications.edtech') },
          { value: 'leadership', label: t('form2:section3.certifications.leadership') },
          { value: 'counseling', label: t('form2:section3.certifications.counseling') },
          { value: 'other', label: t('form2:section3.certifications.other') },
        ]}
        required
        error={validationErrors.certifications ? t('pilotSurveys:form.requiredField') : null}
        fieldName="certifications"
      />
      
      {formData.certifications?.includes('other') && (
        <TextInput
          label={t('form2:section3.certifications.otherPlaceholder')}
          value={formData.certificationsOther}
          onChange={(val) => onFieldChange('certificationsOther', val)}
          placeholder={t('form2:section3.certifications.otherPlaceholder')}
          fieldName="certificationsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <TextArea
        label={t('form2:section3.training.label')}
        value={formData.training}
        onChange={(val) => onFieldChange('training', val)}
        placeholder={t('form2:section3.training.placeholder')}
        rows={3}
        fieldName="training"
      />
    </Section>
  );

  // Section 4: Teaching & Professional Practice
  const renderSection4 = () => (
    <Section title={t('form2:section4.title')}>
      <CheckboxGroup
        label={t('form2:section4.subjects.label')}
        values={formData.subjects || []}
        onChange={(val) => onFieldChange('subjects', val)}
        options={[
          { value: 'language', label: t('form2:section4.subjects.language') },
          { value: 'math', label: t('form2:section4.subjects.math') },
          { value: 'science', label: t('form2:section4.subjects.science') },
          { value: 'socialStudies', label: t('form2:section4.subjects.socialStudies') },
          { value: 'arts', label: t('form2:section4.subjects.arts') },
          { value: 'socialEmotional', label: t('form2:section4.subjects.socialEmotional') },
          { value: 'physicalEd', label: t('form2:section4.subjects.physicalEd') },
          { value: 'other', label: t('form2:section4.subjects.other') },
        ]}
        required
        error={validationErrors.subjects ? t('pilotSurveys:form.requiredField') : null}
        fieldName="subjects"
      />
      
      {formData.subjects?.includes('other') && (
        <TextInput
          label={t('form2:section4.subjects.otherPlaceholder')}
          value={formData.subjectsOther}
          onChange={(val) => onFieldChange('subjectsOther', val)}
          placeholder={t('form2:section4.subjects.otherPlaceholder')}
          fieldName="subjectsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <RadioGroup
        label={t('form2:section4.classSize.label')}
        value={formData.classSize}
        onChange={(val) => onFieldChange('classSize', val)}
        options={[
          { value: 'oneTo5', label: t('form2:section4.classSize.oneTo5') },
          { value: 'sixTo10', label: t('form2:section4.classSize.sixTo10') },
          { value: 'elevenTo20', label: t('form2:section4.classSize.elevenTo20') },
          { value: 'twentyOneTo30', label: t('form2:section4.classSize.twentyOneTo30') },
          { value: 'thirtyOneTo50', label: t('form2:section4.classSize.thirtyOneTo50') },
          { value: 'fiftyOnePlus', label: t('form2:section4.classSize.fiftyOnePlus') },
        ]}
        required
        error={validationErrors.classSize ? t('pilotSurveys:form.requiredField') : null}
        fieldName="classSize"
      />
      
      <RadioGroup
        label={t('form2:section4.collaboration.label')}
        value={formData.collaboration}
        onChange={(val) => onFieldChange('collaboration', val)}
        options={[
          { value: 'daily', label: t('form2:section4.collaboration.daily') },
          { value: 'weekly', label: t('form2:section4.collaboration.weekly') },
          { value: 'monthly', label: t('form2:section4.collaboration.monthly') },
          { value: 'rarely', label: t('form2:section4.collaboration.rarely') },
          { value: 'never', label: t('form2:section4.collaboration.never') },
        ]}
        required
        error={validationErrors.collaboration ? t('pilotSurveys:form.requiredField') : null}
        fieldName="collaboration"
      />
      
      <CheckboxGroup
        label={t('form2:section4.approach.label')}
        values={formData.approach || []}
        onChange={(val) => onFieldChange('approach', val)}
        options={[
          { value: 'studentCentered', label: t('form2:section4.approach.studentCentered') },
          { value: 'projectBased', label: t('form2:section4.approach.projectBased') },
          { value: 'dataDriven', label: t('form2:section4.approach.dataDriven') },
          { value: 'collaborative', label: t('form2:section4.approach.collaborative') },
          { value: 'inquiryBased', label: t('form2:section4.approach.inquiryBased') },
          { value: 'experiential', label: t('form2:section4.approach.experiential') },
          { value: 'other', label: t('form2:section4.approach.other') },
        ]}
        required
        error={validationErrors.approach ? t('pilotSurveys:form.requiredField') : null}
        fieldName="approach"
      />
      
      {formData.approach?.includes('other') && (
        <TextInput
          label={t('form2:section4.approach.otherPlaceholder')}
          value={formData.approachOther}
          onChange={(val) => onFieldChange('approachOther', val)}
          placeholder={t('form2:section4.approach.otherPlaceholder')}
          fieldName="approachOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section4.assessment.label')}
        values={formData.assessment || []}
        onChange={(val) => onFieldChange('assessment', val)}
        options={[
          { value: 'formative', label: t('form2:section4.assessment.formative') },
          { value: 'summative', label: t('form2:section4.assessment.summative') },
          { value: 'observational', label: t('form2:section4.assessment.observational') },
          { value: 'peerSelf', label: t('form2:section4.assessment.peerSelf') },
          { value: 'portfolios', label: t('form2:section4.assessment.portfolios') },
          { value: 'standardized', label: t('form2:section4.assessment.standardized') },
          { value: 'other', label: t('form2:section4.assessment.other') },
        ]}
        required
        error={validationErrors.assessment ? t('pilotSurveys:form.requiredField') : null}
        fieldName="assessment"
      />
      
      {formData.assessment?.includes('other') && (
        <TextInput
          label={t('form2:section4.assessment.otherPlaceholder')}
          value={formData.assessmentOther}
          onChange={(val) => onFieldChange('assessmentOther', val)}
          placeholder={t('form2:section4.assessment.otherPlaceholder')}
          fieldName="assessmentOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section4.strategies.label')}
        values={formData.strategies || []}
        onChange={(val) => onFieldChange('strategies', val)}
        options={[
          { value: 'differentiated', label: t('form2:section4.strategies.differentiated') },
          { value: 'individualized', label: t('form2:section4.strategies.individualized') },
          { value: 'inclusive', label: t('form2:section4.strategies.inclusive') },
          { value: 'smallGroup', label: t('form2:section4.strategies.smallGroup') },
          { value: 'cultural', label: t('form2:section4.strategies.cultural') },
          { value: 'other', label: t('form2:section4.strategies.other') },
        ]}
        required
        error={validationErrors.strategies ? t('pilotSurveys:form.requiredField') : null}
        fieldName="strategies"
      />
      
      {formData.strategies?.includes('other') && (
        <TextInput
          label={t('form2:section4.strategies.otherPlaceholder')}
          value={formData.strategiesOther}
          onChange={(val) => onFieldChange('strategiesOther', val)}
          placeholder={t('form2:section4.strategies.otherPlaceholder')}
          fieldName="strategiesOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
    </Section>
  );

  // Section 5: Technology & AI Use
  const renderSection5 = () => (
    <Section title={t('form2:section5.title')}>
      <RadioGroup
        label={t('form2:section5.frequency.label')}
        value={formData.aiFrequency}
        onChange={(val) => onFieldChange('aiFrequency', val)}
        options={[
          { value: 'never', label: t('form2:section5.frequency.never') },
          { value: 'rarely', label: t('form2:section5.frequency.rarely') },
          { value: 'sometimes', label: t('form2:section5.frequency.sometimes') },
          { value: 'often', label: t('form2:section5.frequency.often') },
          { value: 'daily', label: t('form2:section5.frequency.daily') },
        ]}
        required
        error={validationErrors.aiFrequency ? t('pilotSurveys:form.requiredField') : null}
        fieldName="aiFrequency"
      />
      
      <CheckboxGroup
        label={t('form2:section5.tasks.label')}
        values={formData.aiTasks || []}
        onChange={(val) => onFieldChange('aiTasks', val)}
        options={[
          { value: 'lessonPlanning', label: t('form2:section5.tasks.lessonPlanning') },
          { value: 'assessments', label: t('form2:section5.tasks.assessments') },
          { value: 'materials', label: t('form2:section5.tasks.materials') },
          { value: 'grading', label: t('form2:section5.tasks.grading') },
          { value: 'communication', label: t('form2:section5.tasks.communication') },
          { value: 'research', label: t('form2:section5.tasks.research') },
          { value: 'monitoring', label: t('form2:section5.tasks.monitoring') },
          { value: 'personalized', label: t('form2:section5.tasks.personalized') },
          { value: 'other', label: t('form2:section5.tasks.other') },
        ]}
        required
        error={validationErrors.aiTasks ? t('pilotSurveys:form.requiredField') : null}
        fieldName="aiTasks"
      />
      
      {formData.aiTasks?.includes('other') && (
        <TextInput
          label={t('form2:section5.tasks.otherPlaceholder')}
          value={formData.aiTasksOther}
          onChange={(val) => onFieldChange('aiTasksOther', val)}
          placeholder={t('form2:section5.tasks.otherPlaceholder')}
          fieldName="aiTasksOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <RadioGroup
        label={t('form2:section5.confidence.label')}
        value={formData.aiConfidence}
        onChange={(val) => onFieldChange('aiConfidence', val)}
        options={[
          { value: 'notConfident', label: t('form2:section5.confidence.notConfident') },
          { value: 'somewhatConfident', label: t('form2:section5.confidence.somewhatConfident') },
          { value: 'confident', label: t('form2:section5.confidence.confident') },
          { value: 'veryConfident', label: t('form2:section5.confidence.veryConfident') },
        ]}
        required
        error={validationErrors.aiConfidence ? t('pilotSurveys:form.requiredField') : null}
        fieldName="aiConfidence"
      />
      
      <CheckboxGroup
        label={t('form2:section5.challenges.label')}
        values={formData.aiChallenges || []}
        onChange={(val) => onFieldChange('aiChallenges', val)}
        options={[
          { value: 'training', label: t('form2:section5.challenges.training') },
          { value: 'access', label: t('form2:section5.challenges.access') },
          { value: 'privacy', label: t('form2:section5.challenges.privacy') },
          { value: 'time', label: t('form2:section5.challenges.time') },
          { value: 'adapting', label: t('form2:section5.challenges.adapting') },
          { value: 'other', label: t('form2:section5.challenges.other') },
        ]}
        required
        error={validationErrors.aiChallenges ? t('pilotSurveys:form.requiredField') : null}
        fieldName="aiChallenges"
      />
      
      {formData.aiChallenges?.includes('other') && (
        <TextInput
          label={t('form2:section5.challenges.otherPlaceholder')}
          value={formData.aiChallengesOther}
          onChange={(val) => onFieldChange('aiChallengesOther', val)}
          placeholder={t('form2:section5.challenges.otherPlaceholder')}
          fieldName="aiChallengesOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section5.digitalTools.label')}
        values={formData.digitalTools || []}
        onChange={(val) => onFieldChange('digitalTools', val)}
        options={[
          { value: 'lms', label: t('form2:section5.digitalTools.lms') },
          { value: 'apps', label: t('form2:section5.digitalTools.apps') },
          { value: 'whiteboards', label: t('form2:section5.digitalTools.whiteboards') },
          { value: 'assessmentTools', label: t('form2:section5.digitalTools.assessmentTools') },
          { value: 'communication', label: t('form2:section5.digitalTools.communication') },
          { value: 'other', label: t('form2:section5.digitalTools.other') },
        ]}
        required
        error={validationErrors.digitalTools ? t('pilotSurveys:form.requiredField') : null}
        fieldName="digitalTools"
      />
      
      {formData.digitalTools?.includes('other') && (
        <TextInput
          label={t('form2:section5.digitalTools.otherPlaceholder')}
          value={formData.digitalToolsOther}
          onChange={(val) => onFieldChange('digitalToolsOther', val)}
          placeholder={t('form2:section5.digitalTools.otherPlaceholder')}
          fieldName="digitalToolsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <RadioGroup
        label={t('form2:section5.helpfulness.label')}
        value={formData.aiHelpfulness}
        onChange={(val) => onFieldChange('aiHelpfulness', val)}
        options={[
          { value: 'notHelpful', label: t('form2:section5.helpfulness.notHelpful') },
          { value: 'slightlyHelpful', label: t('form2:section5.helpfulness.slightlyHelpful') },
          { value: 'moderatelyHelpful', label: t('form2:section5.helpfulness.moderatelyHelpful') },
          { value: 'veryHelpful', label: t('form2:section5.helpfulness.veryHelpful') },
          { value: 'extremelyHelpful', label: t('form2:section5.helpfulness.extremelyHelpful') },
        ]}
        required
        error={validationErrors.aiHelpfulness ? t('pilotSurveys:form.requiredField') : null}
        fieldName="aiHelpfulness"
      />
      
      <TextArea
        label={t('form2:section5.comments.label')}
        value={formData.aiComments}
        onChange={(val) => onFieldChange('aiComments', val)}
        placeholder={t('form2:section5.comments.placeholder')}
        rows={4}
        fieldName="aiComments"
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
  ];

  return (
    <div className="flex flex-col h-full">
      <Progress
        currentSection={currentSection}
        totalSections={totalSections}
        completedSections={completedSections}
      />
      <div className="pb-0 flex-grow">
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
        canGoNext={canGoNext}
        canGoPrevious={true}
      />
    </div>
  );
};

export default Form2TeacherAssessment;
