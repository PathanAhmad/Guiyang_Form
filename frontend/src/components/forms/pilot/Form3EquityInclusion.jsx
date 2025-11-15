import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from './shared/QuestionTypes/TextInput';
import TextArea from './shared/QuestionTypes/TextArea';
import RadioGroup from './shared/QuestionTypes/RadioGroup';
import CheckboxGroup from './shared/QuestionTypes/CheckboxGroup';
import TableInput from './shared/QuestionTypes/TableInput';

const Form3EquityInclusion = ({
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
}) => {
  const { t } = useTranslation();
  const totalSections = 7;

  // Section 1: Your Information
  const renderSection1 = () => (
    <Section title={t('form3.section1.title')}>
      <TextInput
        label={t('form3.section1.fullName.label')}
        value={formData.fullName}
        onChange={(val) => onFieldChange('fullName', val)}
        placeholder={t('form3.section1.fullName.placeholder')}
        required
      />
      
      <RadioGroup
        label={t('form3.section1.role.label')}
        value={formData.role}
        onChange={(val) => onFieldChange('role', val)}
        options={[
          { value: 'educator', label: t('form3.section1.role.educator') },
          { value: 'support', label: t('form3.section1.role.support') },
          { value: 'coordinator', label: t('form3.section1.role.coordinator') },
          { value: 'admin', label: t('form3.section1.role.admin') },
          { value: 'other', label: t('form3.section1.role.other') },
        ]}
        required
      />
      
      {formData.role === 'other' && (
        <TextInput
          label={t('form3.section1.role.otherPlaceholder')}
          value={formData.roleOther}
          onChange={(val) => onFieldChange('roleOther', val)}
          placeholder={t('form3.section1.role.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form3.section1.campusLevels.label')}
        values={formData.campusLevels || []}
        onChange={(val) => onFieldChange('campusLevels', val)}
        options={[
          { value: 'lowerPrimary', label: t('form3.section1.campusLevels.lowerPrimary') },
          { value: 'upperPrimary', label: t('form3.section1.campusLevels.upperPrimary') },
          { value: 'middle', label: t('form3.section1.campusLevels.middle') },
          { value: 'secondary', label: t('form3.section1.campusLevels.secondary') },
          { value: 'vocational', label: t('form3.section1.campusLevels.vocational') },
          { value: 'alternative', label: t('form3.section1.campusLevels.alternative') },
        ]}
      />
      
      <RadioGroup
        label={t('form3.section1.tenure.label')}
        value={formData.tenure}
        onChange={(val) => onFieldChange('tenure', val)}
        options={[
          { value: 'less6', label: t('form3.section1.tenure.less6') },
          { value: '6to12', label: t('form3.section1.tenure.6to12') },
          { value: '1to2', label: t('form3.section1.tenure.1to2') },
          { value: '2to5', label: t('form3.section1.tenure.2to5') },
          { value: '5plus', label: t('form3.section1.tenure.5plus') },
        ]}
        required
      />
    </Section>
  );

  // Section 2: Demographic Trends
  const renderSection2 = () => (
    <Section title={t('form3.section2.title')}>
      <RadioGroup
        label={t('form3.section2.enrollment.label')}
        value={formData.enrollment}
        onChange={(val) => onFieldChange('enrollment', val)}
        options={[
          { value: 'less50', label: t('form3.section2.enrollment.less50') },
          { value: '50to100', label: t('form3.section2.enrollment.50to100') },
          { value: '101to200', label: t('form3.section2.enrollment.101to200') },
          { value: '201to500', label: t('form3.section2.enrollment.201to500') },
          { value: '500plus', label: t('form3.section2.enrollment.500plus') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form3.section2.identities.label')}
        values={formData.identities || []}
        onChange={(val) => onFieldChange('identities', val)}
        options={[
          { value: 'mandarin', label: t('form3.section2.identities.mandarin') },
          { value: 'dialect', label: t('form3.section2.identities.dialect') },
          { value: 'ethnic', label: t('form3.section2.identities.ethnic') },
          { value: 'migrant', label: t('form3.section2.identities.migrant') },
          { value: 'international', label: t('form3.section2.identities.international') },
          { value: 'refugee', label: t('form3.section2.identities.refugee') },
          { value: 'other', label: t('form3.section2.identities.other') },
        ]}
      />
      
      {formData.identities?.includes('other') && (
        <TextInput
          label={t('form3.section2.identities.otherPlaceholder')}
          value={formData.identitiesOther}
          onChange={(val) => onFieldChange('identitiesOther', val)}
          placeholder={t('form3.section2.identities.otherPlaceholder')}
        />
      )}
      
      <TableInput
        label={t('form3.section2.challenges.label')}
        value={formData.challengesTable || {}}
        onChange={(val) => onFieldChange('challengesTable', val)}
        rows={[
          { key: 'tech', label: t('form3.section2.challenges.tech') },
          { key: 'irregular', label: t('form3.section2.challenges.irregular') },
          { key: 'noSupport', label: t('form3.section2.challenges.noSupport') },
          { key: 'food', label: t('form3.section2.challenges.food') },
          { key: 'commutes', label: t('form3.section2.challenges.commutes') },
          { key: 'digitalLiteracy', label: t('form3.section2.challenges.digitalLiteracy') },
        ]}
        columns={[
          { value: 'none', label: t('form3.section2.challenges.none') },
          { value: 'few', label: t('form3.section2.challenges.few') },
          { value: 'some', label: t('form3.section2.challenges.some') },
          { value: 'many', label: t('form3.section2.challenges.many') },
          { value: 'unknown', label: t('form3.section2.challenges.unknown') },
        ]}
      />
      
      <TextArea
        label={t('form3.section2.otherChallenges.label')}
        value={formData.otherChallenges}
        onChange={(val) => onFieldChange('otherChallenges', val)}
        placeholder={t('form3.section2.otherChallenges.placeholder')}
        rows={3}
      />
      
      <CheckboxGroup
        label={t('form3.section2.gapsDynamics.label')}
        values={formData.gapsDynamics || []}
        onChange={(val) => onFieldChange('gapsDynamics', val)}
        options={[
          { value: 'shame', label: t('form3.section2.gapsDynamics.shame') },
          { value: 'mistrust', label: t('form3.section2.gapsDynamics.mistrust') },
          { value: 'fear', label: t('form3.section2.gapsDynamics.fear') },
          { value: 'homeEnvironment', label: t('form3.section2.gapsDynamics.homeEnvironment') },
          { value: 'cultural', label: t('form3.section2.gapsDynamics.cultural') },
          { value: 'language', label: t('form3.section2.gapsDynamics.language') },
          { value: 'none', label: t('form3.section2.gapsDynamics.none') },
          { value: 'other', label: t('form3.section2.gapsDynamics.other') },
        ]}
      />
      
      {formData.gapsDynamics?.includes('other') && (
        <TextInput
          label={t('form3.section2.gapsDynamics.otherPlaceholder')}
          value={formData.gapsDynamicsOther}
          onChange={(val) => onFieldChange('gapsDynamicsOther', val)}
          placeholder={t('form3.section2.gapsDynamics.otherPlaceholder')}
        />
      )}
    </Section>
  );

  // Section 3: System Gaps & Equity Access
  const renderSection3 = () => (
    <Section title={t('form3.section3.title')}>
      <RadioGroup
        label={t('form3.section3.unmetNeeds.label')}
        value={formData.unmetNeeds}
        onChange={(val) => onFieldChange('unmetNeeds', val)}
        options={[
          { value: 'none', label: t('form3.section3.unmetNeeds.none') },
          { value: 'few', label: t('form3.section3.unmetNeeds.few') },
          { value: 'several', label: t('form3.section3.unmetNeeds.several') },
          { value: 'many', label: t('form3.section3.unmetNeeds.many') },
          { value: 'unsure', label: t('form3.section3.unmetNeeds.unsure') },
        ]}
      />
      
      <RadioGroup
        label={t('form3.section3.curriculum.label')}
        value={formData.curriculum}
        onChange={(val) => onFieldChange('curriculum', val)}
        options={[
          { value: 'yes', label: t('form3.section3.curriculum.yes') },
          { value: 'somewhat', label: t('form3.section3.curriculum.somewhat') },
          { value: 'not', label: t('form3.section3.curriculum.not') },
          { value: 'unsure', label: t('form3.section3.curriculum.unsure') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form3.section3.accessibility.label')}
        values={formData.accessibility || []}
        onChange={(val) => onFieldChange('accessibility', val)}
        options={[
          { value: 'wheelchair', label: t('form3.section3.accessibility.wheelchair') },
          { value: 'quiet', label: t('form3.section3.accessibility.quiet') },
          { value: 'assistive', label: t('form3.section3.accessibility.assistive') },
          { value: 'multilingual', label: t('form3.section3.accessibility.multilingual') },
          { value: 'barriers', label: t('form3.section3.accessibility.barriers') },
          { value: 'notApplicable', label: t('form3.section3.accessibility.notApplicable') },
        ]}
      />
      
      <RadioGroup
        label={t('form3.section3.assessments.label')}
        value={formData.assessments}
        onChange={(val) => onFieldChange('assessments', val)}
        options={[
          { value: 'yes', label: t('form3.section3.assessments.yes') },
          { value: 'somewhat', label: t('form3.section3.assessments.somewhat') },
          { value: 'not', label: t('form3.section3.assessments.not') },
          { value: 'unsure', label: t('form3.section3.assessments.unsure') },
        ]}
      />
      
      <RadioGroup
        label={t('form3.section3.followUp.label')}
        value={formData.followUp}
        onChange={(val) => onFieldChange('followUp', val)}
        options={[
          { value: 'yes', label: t('form3.section3.followUp.yes') },
          { value: 'sometimes', label: t('form3.section3.followUp.sometimes') },
          { value: 'rarely', label: t('form3.section3.followUp.rarely') },
          { value: 'unsure', label: t('form3.section3.followUp.unsure') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form3.section3.leastSupported.label')}
        values={formData.leastSupported || []}
        onChange={(val) => {
          // Limit to 3 selections
          if (val.length <= 3) {
            onFieldChange('leastSupported', val);
          }
        }}
        options={[
          { value: 'undiagnosed', label: t('form3.section3.leastSupported.undiagnosed') },
          { value: 'lowIncome', label: t('form3.section3.leastSupported.lowIncome') },
          { value: 'migrant', label: t('form3.section3.leastSupported.migrant') },
          { value: 'nonMandarin', label: t('form3.section3.leastSupported.nonMandarin') },
          { value: 'neurodivergent', label: t('form3.section3.leastSupported.neurodivergent') },
          { value: 'trauma', label: t('form3.section3.leastSupported.trauma') },
          { value: 'irregular', label: t('form3.section3.leastSupported.irregular') },
          { value: 'ethnic', label: t('form3.section3.leastSupported.ethnic') },
          { value: 'physical', label: t('form3.section3.leastSupported.physical') },
          { value: 'other', label: t('form3.section3.leastSupported.other') },
        ]}
      />
      {formData.leastSupported && formData.leastSupported.length === 3 && (
        <p className="text-sm text-blue-600 -mt-4 mb-4">Maximum 3 selections reached</p>
      )}
      
      {formData.leastSupported?.includes('other') && (
        <TextInput
          label={t('form3.section3.leastSupported.otherPlaceholder')}
          value={formData.leastSupportedOther}
          onChange={(val) => onFieldChange('leastSupportedOther', val)}
          placeholder={t('form3.section3.leastSupported.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form3.section3.schoolSystems.label')}
        values={formData.schoolSystems || []}
        onChange={(val) => onFieldChange('schoolSystems', val)}
        options={[
          { value: 'translation', label: t('form3.section3.schoolSystems.translation') },
          { value: 'referral', label: t('form3.section3.schoolSystems.referral') },
          { value: 'training', label: t('form3.section3.schoolSystems.training') },
          { value: 'food', label: t('form3.section3.schoolSystems.food') },
          { value: 'mentorship', label: t('form3.section3.schoolSystems.mentorship') },
          { value: 'sensory', label: t('form3.section3.schoolSystems.sensory') },
          { value: 'cultural', label: t('form3.section3.schoolSystems.cultural') },
          { value: 'none', label: t('form3.section3.schoolSystems.none') },
          { value: 'other', label: t('form3.section3.schoolSystems.other') },
        ]}
      />
      
      {formData.schoolSystems?.includes('other') && (
        <TextInput
          label={t('form3.section3.schoolSystems.otherPlaceholder')}
          value={formData.schoolSystemsOther}
          onChange={(val) => onFieldChange('schoolSystemsOther', val)}
          placeholder={t('form3.section3.schoolSystems.otherPlaceholder')}
        />
      )}
    </Section>
  );

  // Section 4: Educator & System Feedback
  const renderSection4 = () => (
    <Section title={t('form3.section4.title')}>
      <RadioGroup
        label={t('form3.section4.equipped.label')}
        value={formData.equipped}
        onChange={(val) => onFieldChange('equipped', val)}
        options={[
          { value: 'yes', label: t('form3.section4.equipped.yes') },
          { value: 'somewhat', label: t('form3.section4.equipped.somewhat') },
          { value: 'no', label: t('form3.section4.equipped.no') },
          { value: 'unsure', label: t('form3.section4.equipped.unsure') },
        ]}
      />
      
      <RadioGroup
        label={t('form3.section4.workload.label')}
        value={formData.workload}
        onChange={(val) => onFieldChange('workload', val)}
        options={[
          { value: 'manageable', label: t('form3.section4.workload.manageable') },
          { value: 'occasionally', label: t('form3.section4.workload.occasionally') },
          { value: 'frequently', label: t('form3.section4.workload.frequently') },
          { value: 'unsure', label: t('form3.section4.workload.unsure') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form3.section4.limits.label')}
        values={formData.limits || []}
        onChange={(val) => onFieldChange('limits', val)}
        options={[
          { value: 'time', label: t('form3.section4.limits.time') },
          { value: 'training', label: t('form3.section4.limits.training') },
          { value: 'fatigue', label: t('form3.section4.limits.fatigue') },
          { value: 'systems', label: t('form3.section4.limits.systems') },
          { value: 'language', label: t('form3.section4.limits.language') },
          { value: 'other', label: t('form3.section4.limits.other') },
        ]}
      />
      
      {formData.limits?.includes('other') && (
        <TextInput
          label={t('form3.section4.limits.otherPlaceholder')}
          value={formData.limitsOther}
          onChange={(val) => onFieldChange('limitsOther', val)}
          placeholder={t('form3.section4.limits.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form3.section4.pdNeeds.label')}
        values={formData.pdNeeds || []}
        onChange={(val) => onFieldChange('pdNeeds', val)}
        options={[
          { value: 'neurodiversity', label: t('form3.section4.pdNeeds.neurodiversity') },
          { value: 'adhdAutism', label: t('form3.section4.pdNeeds.adhdAutism') },
          { value: 'trauma', label: t('form3.section4.pdNeeds.trauma') },
          { value: 'conflict', label: t('form3.section4.pdNeeds.conflict') },
          { value: 'intercultural', label: t('form3.section4.pdNeeds.intercultural') },
          { value: 'mixedAbility', label: t('form3.section4.pdNeeds.mixedAbility') },
          { value: 'family', label: t('form3.section4.pdNeeds.family') },
          { value: 'stress', label: t('form3.section4.pdNeeds.stress') },
          { value: 'other', label: t('form3.section4.pdNeeds.other') },
        ]}
      />
      
      {formData.pdNeeds?.includes('other') && (
        <TextInput
          label={t('form3.section4.pdNeeds.otherPlaceholder')}
          value={formData.pdNeedsOther}
          onChange={(val) => onFieldChange('pdNeedsOther', val)}
          placeholder={t('form3.section4.pdNeeds.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('form3.section4.urgentGaps.label')}
        value={formData.urgentGaps}
        onChange={(val) => onFieldChange('urgentGaps', val)}
        placeholder={t('form3.section4.urgentGaps.placeholder')}
        rows={4}
      />
      
      <CheckboxGroup
        label={t('form3.section4.feedbackLoops.label')}
        values={formData.feedbackLoops || []}
        onChange={(val) => onFieldChange('feedbackLoops', val)}
        options={[
          { value: 'surveys', label: t('form3.section4.feedbackLoops.surveys') },
          { value: 'councils', label: t('form3.section4.feedbackLoops.councils') },
          { value: 'boxes', label: t('form3.section4.feedbackLoops.boxes') },
          { value: 'checkins', label: t('form3.section4.feedbackLoops.checkins') },
          { value: 'none', label: t('form3.section4.feedbackLoops.none') },
          { value: 'other', label: t('form3.section4.feedbackLoops.other') },
        ]}
      />
      
      {formData.feedbackLoops?.includes('other') && (
        <TextInput
          label={t('form3.section4.feedbackLoops.otherPlaceholder')}
          value={formData.feedbackLoopsOther}
          onChange={(val) => onFieldChange('feedbackLoopsOther', val)}
          placeholder={t('form3.section4.feedbackLoops.otherPlaceholder')}
        />
      )}
      
      <RadioGroup
        label={t('form3.section4.confidence.label')}
        value={formData.confidence}
        onChange={(val) => onFieldChange('confidence', val)}
        options={[
          { value: 'very', label: t('form3.section4.confidence.very') },
          { value: 'somewhat', label: t('form3.section4.confidence.somewhat') },
          { value: 'not', label: t('form3.section4.confidence.not') },
          { value: 'unsure', label: t('form3.section4.confidence.unsure') },
        ]}
      />
    </Section>
  );

  // Section 5: AI Adoption
  const renderSection5 = () => (
    <Section title={t('form3.section5.title')}>
      <RadioGroup
        label={t('form3.section5.staffUsage.label')}
        value={formData.staffUsage}
        onChange={(val) => onFieldChange('staffUsage', val)}
        options={[
          { value: 'almostNever', label: t('form3.section5.staffUsage.almostNever') },
          { value: 'some', label: t('form3.section5.staffUsage.some') },
          { value: 'many', label: t('form3.section5.staffUsage.many') },
          { value: 'unsure', label: t('form3.section5.staffUsage.unsure') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form3.section5.educatorTasks.label')}
        values={formData.educatorTasks || []}
        onChange={(val) => onFieldChange('educatorTasks', val)}
        options={[
          { value: 'lesson', label: t('form3.section5.educatorTasks.lesson') },
          { value: 'assessments', label: t('form3.section5.educatorTasks.assessments') },
          { value: 'materials', label: t('form3.section5.educatorTasks.materials') },
          { value: 'feedback', label: t('form3.section5.educatorTasks.feedback') },
          { value: 'communication', label: t('form3.section5.educatorTasks.communication') },
          { value: 'professional', label: t('form3.section5.educatorTasks.professional') },
          { value: 'other', label: t('form3.section5.educatorTasks.other') },
        ]}
      />
      
      {formData.educatorTasks?.includes('other') && (
        <TextInput
          label={t('form3.section5.educatorTasks.otherPlaceholder')}
          value={formData.educatorTasksOther}
          onChange={(val) => onFieldChange('educatorTasksOther', val)}
          placeholder={t('form3.section5.educatorTasks.otherPlaceholder')}
        />
      )}
      
      <RadioGroup
        label={t('form3.section5.studentPercentage.label')}
        value={formData.studentPercentage}
        onChange={(val) => onFieldChange('studentPercentage', val)}
        options={[
          { value: '0', label: t('form3.section5.studentPercentage.0') },
          { value: '1to25', label: t('form3.section5.studentPercentage.1to25') },
          { value: '26to50', label: t('form3.section5.studentPercentage.26to50') },
          { value: '51to75', label: t('form3.section5.studentPercentage.51to75') },
          { value: '76to100', label: t('form3.section5.studentPercentage.76to100') },
          { value: 'unsure', label: t('form3.section5.studentPercentage.unsure') },
        ]}
      />
      
      <TextArea
        label={t('form3.section5.benefitsRisks.label')}
        value={formData.benefitsRisks}
        onChange={(val) => onFieldChange('benefitsRisks', val)}
        placeholder={t('form3.section5.benefitsRisks.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 6: Community Partnerships
  const renderSection6 = () => (
    <Section title={t('form3.section6.title')}>
      <TextArea
        label={t('form3.section6.strengths.label')}
        value={formData.relationshipStrengths}
        onChange={(val) => onFieldChange('relationshipStrengths', val)}
        placeholder={t('form3.section6.strengths.placeholder')}
        rows={4}
      />
      
      <CheckboxGroup
        label={t('form3.section6.barriers.label')}
        values={formData.barriers || []}
        onChange={(val) => onFieldChange('barriers', val)}
        options={[
          { value: 'language', label: t('form3.section6.barriers.language') },
          { value: 'work', label: t('form3.section6.barriers.work') },
          { value: 'trust', label: t('form3.section6.barriers.trust') },
          { value: 'digital', label: t('form3.section6.barriers.digital') },
          { value: 'cultural', label: t('form3.section6.barriers.cultural') },
          { value: 'priorities', label: t('form3.section6.barriers.priorities') },
          { value: 'limited', label: t('form3.section6.barriers.limited') },
          { value: 'none', label: t('form3.section6.barriers.none') },
          { value: 'other', label: t('form3.section6.barriers.other') },
        ]}
      />
      
      {formData.barriers?.includes('other') && (
        <TextInput
          label={t('form3.section6.barriers.otherPlaceholder')}
          value={formData.barriersOther}
          onChange={(val) => onFieldChange('barriersOther', val)}
          placeholder={t('form3.section6.barriers.otherPlaceholder')}
        />
      )}
      
      <RadioGroup
        label={t('form3.section6.restorative.label')}
        value={formData.restorative}
        onChange={(val) => onFieldChange('restorative', val)}
        options={[
          { value: 'yes', label: t('form3.section6.restorative.yes') },
          { value: 'some', label: t('form3.section6.restorative.some') },
          { value: 'traditional', label: t('form3.section6.restorative.traditional') },
          { value: 'unsure', label: t('form3.section6.restorative.unsure') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form3.section6.events.label')}
        values={formData.events || []}
        onChange={(val) => onFieldChange('events', val)}
        options={[
          { value: 'cultural', label: t('form3.section6.events.cultural') },
          { value: 'mental', label: t('form3.section6.events.mental') },
          { value: 'studentLed', label: t('form3.section6.events.studentLed') },
          { value: 'none', label: t('form3.section6.events.none') },
          { value: 'other', label: t('form3.section6.events.other') },
        ]}
      />
      
      {formData.events?.includes('other') && (
        <TextInput
          label={t('form3.section6.events.otherPlaceholder')}
          value={formData.eventsOther}
          onChange={(val) => onFieldChange('eventsOther', val)}
          placeholder={t('form3.section6.events.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form3.section6.partnerships.label')}
        values={formData.partnerships || []}
        onChange={(val) => onFieldChange('partnerships', val)}
        options={[
          { value: 'mental', label: t('form3.section6.partnerships.mental') },
          { value: 'ngos', label: t('form3.section6.partnerships.ngos') },
          { value: 'artists', label: t('form3.section6.partnerships.artists') },
          { value: 'arts', label: t('form3.section6.partnerships.arts') },
          { value: 'other', label: t('form3.section6.partnerships.other') },
        ]}
      />
      
      {formData.partnerships?.includes('other') && (
        <TextInput
          label={t('form3.section6.partnerships.otherPlaceholder')}
          value={formData.partnershipsOther}
          onChange={(val) => onFieldChange('partnershipsOther', val)}
          placeholder={t('form3.section6.partnerships.otherPlaceholder')}
        />
      )}
    </Section>
  );

  // Section 7: Final Reflections
  const renderSection7 = () => (
    <Section title={t('form3.section7.title')}>
      <TextArea
        label={t('form3.section7.overlooked.label')}
        value={formData.overlooked}
        onChange={(val) => onFieldChange('overlooked', val)}
        placeholder={t('form3.section7.overlooked.placeholder')}
        rows={4}
      />
      
      <TextArea
        label={t('form3.section7.suggestions.label')}
        value={formData.suggestions}
        onChange={(val) => onFieldChange('suggestions', val)}
        placeholder={t('form3.section7.suggestions.placeholder')}
        rows={4}
      />
      
      <RadioGroup
        label={t('form3.section7.exclusion.label')}
        value={formData.exclusion}
        onChange={(val) => onFieldChange('exclusion', val)}
        options={[
          { value: 'frequently', label: t('form3.section7.exclusion.frequently') },
          { value: 'occasionally', label: t('form3.section7.exclusion.occasionally') },
          { value: 'rarely', label: t('form3.section7.exclusion.rarely') },
          { value: 'never', label: t('form3.section7.exclusion.never') },
        ]}
      />
      
      {formData.exclusion && formData.exclusion !== 'never' && (
        <TextArea
          label={t('form3.section7.situations.label')}
          value={formData.situations}
          onChange={(val) => onFieldChange('situations', val)}
          placeholder={t('form3.section7.situations.placeholder')}
          rows={3}
        />
      )}
      
      <TextArea
        label={t('form3.section7.inclusive.label')}
        value={formData.inclusive}
        onChange={(val) => onFieldChange('inclusive', val)}
        placeholder={t('form3.section7.inclusive.placeholder')}
        rows={5}
      />
    </Section>
  );

  const sections = [
    renderSection1,
    renderSection2,
    renderSection3,
    renderSection4,
    renderSection5,
    renderSection6,
    renderSection7,
  ];

  return (
    <>
      <Progress
        currentSection={currentSection}
        totalSections={totalSections}
        completedSections={completedSections}
      />
      <div className="pb-20">
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
      />
    </>
  );
};

export default Form3EquityInclusion;
