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
}) => {
  const { t } = useTranslation();
  const totalSections = 8;

  // Section 1: Assessor Information
  const renderSection1 = () => (
    <Section title={t('form2:section1.title')}>
      <TextInput
        label={t('form2:section1.assessorName.label')}
        value={formData.assessorName}
        onChange={(val) => onFieldChange('assessorName', val)}
        placeholder={t('form2:section1.assessorName.placeholder')}
        required
      />
      
      <RadioGroup
        label={t('form2:section1.assessorRole.label')}
        value={formData.assessorRole}
        onChange={(val) => onFieldChange('assessorRole', val)}
        options={[
          { value: 'educator', label: t('form2:section1.assessorRole.educator') },
          { value: 'specialist', label: t('form2:section1.assessorRole.specialist') },
          { value: 'coordinator', label: t('form2:section1.assessorRole.coordinator') },
          { value: 'other', label: t('form2:section1.assessorRole.other') },
        ]}
        required
      />
      
      {formData.assessorRole === 'other' && (
        <TextInput
          label={t('form2:section1.assessorRole.otherPlaceholder')}
          value={formData.assessorRoleOther}
          onChange={(val) => onFieldChange('assessorRoleOther', val)}
          placeholder={t('form2:section1.assessorRole.otherPlaceholder')}
        />
      )}
      
      <RadioGroup
        label={t('form2:section1.frequency.label')}
        value={formData.frequency}
        onChange={(val) => onFieldChange('frequency', val)}
        options={[
          { value: 'daily', label: t('form2:section1.frequency.daily') },
          { value: 'severalWeekly', label: t('form2:section1.frequency.severalWeekly') },
          { value: 'weekly', label: t('form2:section1.frequency.weekly') },
          { value: 'occasionally', label: t('form2:section1.frequency.occasionally') },
        ]}
        required
      />
      
      <div className="mt-8 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('form2:section1.aiUsageLabel')}</h3>
        <p className="text-sm text-gray-600 italic">{t('form2:section1.aiUsageNote')}</p>
      </div>
      
      <RadioGroup
        label={t('form2:section1.aiFrequency.label')}
        value={formData.assessorAiFrequency}
        onChange={(val) => onFieldChange('assessorAiFrequency', val)}
        options={[
          { value: 'never', label: t('form2:section1.aiFrequency.never') },
          { value: 'rarely', label: t('form2:section1.aiFrequency.rarely') },
          { value: 'sometimes', label: t('form2:section1.aiFrequency.sometimes') },
          { value: 'often', label: t('form2:section1.aiFrequency.often') },
          { value: 'daily', label: t('form2:section1.aiFrequency.daily') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form2:section1.aiTasks.label')}
        values={formData.assessorAiTasks || []}
        onChange={(val) => onFieldChange('assessorAiTasks', val)}
        options={[
          { value: 'lesson', label: t('form2:section1.aiTasks.lesson') },
          { value: 'assessments', label: t('form2:section1.aiTasks.assessments') },
          { value: 'materials', label: t('form2:section1.aiTasks.materials') },
          { value: 'grading', label: t('form2:section1.aiTasks.grading') },
          { value: 'communication', label: t('form2:section1.aiTasks.communication') },
          { value: 'research', label: t('form2:section1.aiTasks.research') },
          { value: 'other', label: t('form2:section1.aiTasks.other') },
        ]}
      />
      
      {formData.assessorAiTasks?.includes('other') && (
        <TextInput
          label={t('form2:section1.aiTasks.otherPlaceholder')}
          value={formData.assessorAiTasksOther}
          onChange={(val) => onFieldChange('assessorAiTasksOther', val)}
          placeholder={t('form2:section1.aiTasks.otherPlaceholder')}
        />
      )}
    </Section>
  );

  // Section 2: Student Profile
  const renderSection2 = () => (
    <Section title={t('form2:section2.title')}>
      <TextInput
        label={t('form2:section2.studentName.label')}
        value={formData.studentName}
        onChange={(val) => onFieldChange('studentName', val)}
        placeholder={t('form2:section2.studentName.placeholder')}
        required
      />
      
      <TextInput
        label={t('form2:section2.studentId.label')}
        value={formData.studentId}
        onChange={(val) => onFieldChange('studentId', val)}
        placeholder={t('form2:section2.studentId.placeholder')}
      />
      
      <DateInput
        label={t('form2:section2.dateOfBirth.label')}
        value={formData.studentDOB}
        onChange={(val) => onFieldChange('studentDOB', val)}
        placeholder={t('form2:section2.dateOfBirth.placeholder')}
      />
      
      <TextInput
        label={t('form2:section2.gradeLevel.label')}
        value={formData.gradeLevel}
        onChange={(val) => onFieldChange('gradeLevel', val)}
        placeholder={t('form2:section2.gradeLevel.placeholder')}
      />
      
      <CheckboxGroup
        label={t('form2:section2.livingSituation.label')}
        values={formData.livingSituation || []}
        onChange={(val) => onFieldChange('livingSituation', val)}
        options={[
          { value: 'bothParents', label: t('form2:section2.livingSituation.bothParents') },
          { value: 'oneParent', label: t('form2:section2.livingSituation.oneParent') },
          { value: 'extendedFamily', label: t('form2:section2.livingSituation.extendedFamily') },
          { value: 'foster', label: t('form2:section2.livingSituation.foster') },
          { value: 'boarding', label: t('form2:section2.livingSituation.boarding') },
          { value: 'independent', label: t('form2:section2.livingSituation.independent') },
          { value: 'unknown', label: t('form2:section2.livingSituation.unknown') },
          { value: 'other', label: t('form2:section2.livingSituation.other') },
        ]}
      />
      
      {formData.livingSituation?.includes('other') && (
        <TextInput
          label={t('form2:section2.livingSituation.otherPlaceholder')}
          value={formData.livingSituationOther}
          onChange={(val) => onFieldChange('livingSituationOther', val)}
          placeholder={t('form2:section2.livingSituation.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section2.educationHistory.label')}
        values={formData.educationHistory || []}
        onChange={(val) => onFieldChange('educationHistory', val)}
        options={[
          { value: 'public', label: t('form2:section2.educationHistory.public') },
          { value: 'private', label: t('form2:section2.educationHistory.private') },
          { value: 'special', label: t('form2:section2.educationHistory.special') },
          { value: 'homeschool', label: t('form2:section2.educationHistory.homeschool') },
          { value: 'disrupted', label: t('form2:section2.educationHistory.disrupted') },
          { value: 'migrated', label: t('form2:section2.educationHistory.migrated') },
          { value: 'other', label: t('form2:section2.educationHistory.other') },
        ]}
      />
      
      {formData.educationHistory?.includes('other') && (
        <TextInput
          label={t('form2:section2.educationHistory.otherPlaceholder')}
          value={formData.educationHistoryOther}
          onChange={(val) => onFieldChange('educationHistoryOther', val)}
          placeholder={t('form2:section2.educationHistory.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section2.supportFlags.label')}
        values={formData.supportFlags || []}
        onChange={(val) => onFieldChange('supportFlags', val)}
        options={[
          { value: 'autistic', label: t('form2:section2.supportFlags.autistic') },
          { value: 'adhd', label: t('form2:section2.supportFlags.adhd') },
          { value: 'anxiety', label: t('form2:section2.supportFlags.anxiety') },
          { value: 'signLanguage', label: t('form2:section2.supportFlags.signLanguage') },
          { value: 'sensory', label: t('form2:section2.supportFlags.sensory') },
          { value: 'physical', label: t('form2:section2.supportFlags.physical') },
          { value: 'cultural', label: t('form2:section2.supportFlags.cultural') },
          { value: 'notDisclosed', label: t('form2:section2.supportFlags.notDisclosed') },
          { value: 'other', label: t('form2:section2.supportFlags.other') },
        ]}
      />
      
      {formData.supportFlags?.includes('other') && (
        <TextInput
          label={t('form2:section2.supportFlags.otherPlaceholder')}
          value={formData.supportFlagsOther}
          onChange={(val) => onFieldChange('supportFlagsOther', val)}
          placeholder={t('form2:section2.supportFlags.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section2.supportNetwork.label')}
        values={formData.supportNetwork || []}
        onChange={(val) => onFieldChange('supportNetwork', val)}
        options={[
          { value: 'parents', label: t('form2:section2.supportNetwork.parents') },
          { value: 'siblings', label: t('form2:section2.supportNetwork.siblings') },
          { value: 'counseling', label: t('form2:section2.supportNetwork.counseling') },
          { value: 'family', label: t('form2:section2.supportNetwork.family') },
          { value: 'none', label: t('form2:section2.supportNetwork.none') },
          { value: 'other', label: t('form2:section2.supportNetwork.other') },
        ]}
      />
      
      {formData.supportNetwork?.includes('other') && (
        <TextInput
          label={t('form2:section2.supportNetwork.otherPlaceholder')}
          value={formData.supportNetworkOther}
          onChange={(val) => onFieldChange('supportNetworkOther', val)}
          placeholder={t('form2:section2.supportNetwork.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section2.homeResources.label')}
        values={formData.homeResources || []}
        onChange={(val) => onFieldChange('homeResources', val)}
        options={[
          { value: 'personal', label: t('form2:section2.homeResources.personal') },
          { value: 'shared', label: t('form2:section2.homeResources.shared') },
          { value: 'smartphone', label: t('form2:section2.homeResources.smartphone') },
          { value: 'internet', label: t('form2:section2.homeResources.internet') },
          { value: 'books', label: t('form2:section2.homeResources.books') },
          { value: 'space', label: t('form2:section2.homeResources.space') },
          { value: 'minimal', label: t('form2:section2.homeResources.minimal') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form2:section2.emotionalSupport.label')}
        values={formData.emotionalSupport || []}
        onChange={(val) => onFieldChange('emotionalSupport', val)}
        options={[
          { value: 'checkins', label: t('form2:section2.emotionalSupport.checkins') },
          { value: 'peer', label: t('form2:section2.emotionalSupport.peer') },
          { value: 'counseling', label: t('form2:section2.emotionalSupport.counseling') },
          { value: 'family', label: t('form2:section2.emotionalSupport.family') },
          { value: 'none', label: t('form2:section2.emotionalSupport.none') },
          { value: 'other', label: t('form2:section2.emotionalSupport.other') },
        ]}
      />
      
      {formData.emotionalSupport?.includes('other') && (
        <TextInput
          label={t('form2:section2.emotionalSupport.otherPlaceholder')}
          value={formData.emotionalSupportOther}
          onChange={(val) => onFieldChange('emotionalSupportOther', val)}
          placeholder={t('form2:section2.emotionalSupport.otherPlaceholder')}
        />
      )}
      
      <RadioGroup
        label={t('form2:section2.pastStress.label')}
        value={formData.pastStress}
        onChange={(val) => onFieldChange('pastStress', val)}
        options={[
          { value: 'yes', label: t('form2:section2.pastStress.yes') },
          { value: 'occasionally', label: t('form2:section2.pastStress.occasionally') },
          { value: 'not', label: t('form2:section2.pastStress.not') },
          { value: 'unknown', label: t('form2:section2.pastStress.unknown') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section2.trustedAdult.label')}
        value={formData.trustedAdult}
        onChange={(val) => onFieldChange('trustedAdult', val)}
        options={[
          { value: 'yes', label: t('form2:section2.trustedAdult.yes') },
          { value: 'somewhat', label: t('form2:section2.trustedAdult.somewhat') },
          { value: 'no', label: t('form2:section2.trustedAdult.no') },
          { value: 'benefit', label: t('form2:section2.trustedAdult.benefit') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section2.identityStress.label')}
        value={formData.identityStress}
        onChange={(val) => onFieldChange('identityStress', val)}
        options={[
          { value: 'yes', label: t('form2:section2.identityStress.yes') },
          { value: 'sometimes', label: t('form2:section2.identityStress.sometimes') },
          { value: 'no', label: t('form2:section2.identityStress.no') },
          { value: 'unsure', label: t('form2:section2.identityStress.unsure') },
        ]}
      />
    </Section>
  );

  // Section 3: Academic Progress
  const renderSection3 = () => (
    <Section title={t('form2:section3.title')}>
      <RadioGroup
        label={t('form2:section3.overallProgress.label')}
        value={formData.overallProgress}
        onChange={(val) => onFieldChange('overallProgress', val)}
        options={[
          { value: 'exceeds', label: t('form2:section3.overallProgress.exceeds') },
          { value: 'expected', label: t('form2:section3.overallProgress.expected') },
          { value: 'progressing', label: t('form2:section3.overallProgress.progressing') },
          { value: 'requires', label: t('form2:section3.overallProgress.requires') },
        ]}
        required
      />
      
      <CheckboxGroup
        label={t('form2:section3.strengths.label')}
        values={formData.strengths || []}
        onChange={(val) => onFieldChange('strengths', val)}
        options={[
          { value: 'oral', label: t('form2:section3.strengths.oral') },
          { value: 'reading', label: t('form2:section3.strengths.reading') },
          { value: 'writing', label: t('form2:section3.strengths.writing') },
          { value: 'numeracy', label: t('form2:section3.strengths.numeracy') },
          { value: 'scientific', label: t('form2:section3.strengths.scientific') },
          { value: 'artistic', label: t('form2:section3.strengths.artistic') },
          { value: 'physical', label: t('form2:section3.strengths.physical') },
          { value: 'leadership', label: t('form2:section3.strengths.leadership') },
          { value: 'technology', label: t('form2:section3.strengths.technology') },
          { value: 'other', label: t('form2:section3.strengths.other') },
        ]}
      />
      
      {formData.strengths?.includes('other') && (
        <TextInput
          label={t('form2:section3.strengths.otherPlaceholder')}
          value={formData.strengthsOther}
          onChange={(val) => onFieldChange('strengthsOther', val)}
          placeholder={t('form2:section3.strengths.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section3.supportAreas.label')}
        values={formData.supportAreas || []}
        onChange={(val) => onFieldChange('supportAreas', val)}
        options={[
          { value: 'language', label: t('form2:section3.supportAreas.language') },
          { value: 'numeracy', label: t('form2:section3.supportAreas.numeracy') },
          { value: 'scientific', label: t('form2:section3.supportAreas.scientific') },
          { value: 'attention', label: t('form2:section3.supportAreas.attention') },
          { value: 'taskCompletion', label: t('form2:section3.supportAreas.taskCompletion') },
          { value: 'social', label: t('form2:section3.supportAreas.social') },
          { value: 'instructions', label: t('form2:section3.supportAreas.instructions') },
          { value: 'other', label: t('form2:section3.supportAreas.other') },
        ]}
      />
      
      {formData.supportAreas?.includes('other') && (
        <TextInput
          label={t('form2:section3.supportAreas.otherPlaceholder')}
          value={formData.supportAreasOther}
          onChange={(val) => onFieldChange('supportAreasOther', val)}
          placeholder={t('form2:section3.supportAreas.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section3.learningStyle.label')}
        values={formData.learningStyle || []}
        onChange={(val) => onFieldChange('learningStyle', val)}
        options={[
          { value: 'visual', label: t('form2:section3.learningStyle.visual') },
          { value: 'kinesthetic', label: t('form2:section3.learningStyle.kinesthetic') },
          { value: 'auditory', label: t('form2:section3.learningStyle.auditory') },
          { value: 'smallGroup', label: t('form2:section3.learningStyle.smallGroup') },
          { value: 'structured', label: t('form2:section3.learningStyle.structured') },
          { value: 'creative', label: t('form2:section3.learningStyle.creative') },
          { value: 'other', label: t('form2:section3.learningStyle.other') },
        ]}
      />
      
      {formData.learningStyle?.includes('other') && (
        <TextInput
          label={t('form2:section3.learningStyle.otherPlaceholder')}
          value={formData.learningStyleOther}
          onChange={(val) => onFieldChange('learningStyleOther', val)}
          placeholder={t('form2:section3.learningStyle.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section3.taskApproach.label')}
        values={formData.taskApproach || []}
        onChange={(val) => onFieldChange('taskApproach', val)}
        options={[
          { value: 'independent', label: t('form2:section3.taskApproach.independent') },
          { value: 'participates', label: t('form2:section3.taskApproach.participates') },
          { value: 'needs', label: t('form2:section3.taskApproach.needs') },
          { value: 'avoids', label: t('form2:section3.taskApproach.avoids') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form2:section3.executiveFunction.label')}
        values={formData.executiveFunction || []}
        onChange={(val) => onFieldChange('executiveFunction', val)}
        options={[
          { value: 'initiation', label: t('form2:section3.executiveFunction.initiation') },
          { value: 'switching', label: t('form2:section3.executiveFunction.switching') },
          { value: 'time', label: t('form2:section3.executiveFunction.time') },
          { value: 'memory', label: t('form2:section3.executiveFunction.memory') },
          { value: 'organization', label: t('form2:section3.executiveFunction.organization') },
          { value: 'monitoring', label: t('form2:section3.executiveFunction.monitoring') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section3.progressOverTime.label')}
        value={formData.progressOverTime}
        onChange={(val) => onFieldChange('progressOverTime', val)}
        options={[
          { value: 'noticeable', label: t('form2:section3.progressOverTime.noticeable') },
          { value: 'slow', label: t('form2:section3.progressOverTime.slow') },
          { value: 'noChange', label: t('form2:section3.progressOverTime.noChange') },
          { value: 'regressive', label: t('form2:section3.progressOverTime.regressive') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section3.gaps.label')}
        value={formData.gaps}
        onChange={(val) => onFieldChange('gaps', val)}
        options={[
          { value: 'major', label: t('form2:section3.gaps.major') },
          { value: 'short', label: t('form2:section3.gaps.short') },
          { value: 'no', label: t('form2:section3.gaps.no') },
          { value: 'unknown', label: t('form2:section3.gaps.unknown') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section3.extendedTasks.label')}
        value={formData.extendedTasks}
        onChange={(val) => onFieldChange('extendedTasks', val)}
        options={[
          { value: 'breaks', label: t('form2:section3.extendedTasks.breaks') },
          { value: 'needs', label: t('form2:section3.extendedTasks.needs') },
          { value: 'overwhelmed', label: t('form2:section3.extendedTasks.overwhelmed') },
          { value: 'unsure', label: t('form2:section3.extendedTasks.unsure') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section3.metacognitive.label')}
        value={formData.metacognitive}
        onChange={(val) => onFieldChange('metacognitive', val)}
        options={[
          { value: 'yes', label: t('form2:section3.metacognitive.yes') },
          { value: 'sometimes', label: t('form2:section3.metacognitive.sometimes') },
          { value: 'rarely', label: t('form2:section3.metacognitive.rarely') },
          { value: 'unsure', label: t('form2:section3.metacognitive.unsure') },
        ]}
      />
    </Section>
  );

  // Section 4: Student Motivation
  const renderSection4 = () => (
    <Section title={t('form2:section4.title')}>
      <CheckboxGroup
        label={t('form2:section4.enrollmentReasons.label')}
        values={formData.enrollmentReasons || []}
        onChange={(val) => onFieldChange('enrollmentReasons', val)}
        options={[
          { value: 'flexible', label: t('form2:section4.enrollmentReasons.flexible') },
          { value: 'difficulty', label: t('form2:section4.enrollmentReasons.difficulty') },
          { value: 'targeted', label: t('form2:section4.enrollmentReasons.targeted') },
          { value: 'handson', label: t('form2:section4.enrollmentReasons.handson') },
          { value: 'safer', label: t('form2:section4.enrollmentReasons.safer') },
          { value: 'other', label: t('form2:section4.enrollmentReasons.other') },
        ]}
      />
      
      {formData.enrollmentReasons?.includes('other') && (
        <TextInput
          label={t('form2:section4.enrollmentReasons.otherPlaceholder')}
          value={formData.enrollmentReasonsOther}
          onChange={(val) => onFieldChange('enrollmentReasonsOther', val)}
          placeholder={t('form2:section4.enrollmentReasons.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section4.goals.label')}
        values={formData.goals || []}
        onChange={(val) => onFieldChange('goals', val)}
        options={[
          { value: 'university', label: t('form2:section4.goals.university') },
          { value: 'career', label: t('form2:section4.goals.career') },
          { value: 'creative', label: t('form2:section4.goals.creative') },
          { value: 'life', label: t('form2:section4.goals.life') },
          { value: 'exploring', label: t('form2:section4.goals.exploring') },
          { value: 'other', label: t('form2:section4.goals.other') },
        ]}
      />
      
      {formData.goals?.includes('other') && (
        <TextInput
          label={t('form2:section4.goals.otherPlaceholder')}
          value={formData.goalsOther}
          onChange={(val) => onFieldChange('goalsOther', val)}
          placeholder={t('form2:section4.goals.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('form2:section4.passion.label')}
        value={formData.passion}
        onChange={(val) => onFieldChange('passion', val)}
        placeholder={t('form2:section4.passion.placeholder')}
        rows={3}
      />
      
      <RadioGroup
        label={t('form2:section4.futureReaction.label')}
        value={formData.futureReaction}
        onChange={(val) => onFieldChange('futureReaction', val)}
        options={[
          { value: 'engaged', label: t('form2:section4.futureReaction.engaged') },
          { value: 'curious', label: t('form2:section4.futureReaction.curious') },
          { value: 'avoidant', label: t('form2:section4.futureReaction.avoidant') },
          { value: 'anxious', label: t('form2:section4.futureReaction.anxious') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section4.selfDoubt.label')}
        value={formData.selfDoubt}
        onChange={(val) => onFieldChange('selfDoubt', val)}
        options={[
          { value: 'frequently', label: t('form2:section4.selfDoubt.frequently') },
          { value: 'occasionally', label: t('form2:section4.selfDoubt.occasionally') },
          { value: 'rarely', label: t('form2:section4.selfDoubt.rarely') },
          { value: 'not', label: t('form2:section4.selfDoubt.not') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form2:section4.barriers.label')}
        values={formData.barriers || []}
        onChange={(val) => onFieldChange('barriers', val)}
        options={[
          { value: 'confidence', label: t('form2:section4.barriers.confidence') },
          { value: 'emotional', label: t('form2:section4.barriers.emotional') },
          { value: 'external', label: t('form2:section4.barriers.external') },
          { value: 'peer', label: t('form2:section4.barriers.peer') },
          { value: 'structure', label: t('form2:section4.barriers.structure') },
          { value: 'none', label: t('form2:section4.barriers.none') },
        ]}
      />
    </Section>
  );

  // Section 5: Social & Emotional Development
  const renderSection5 = () => (
    <Section title={t('form2:section5.title')}>
      <RadioGroup
        label={t('form2:section5.interaction.label')}
        value={formData.interaction}
        onChange={(val) => onFieldChange('interaction', val)}
        options={[
          { value: 'highly', label: t('form2:section5.interaction.highly') },
          { value: 'capable', label: t('form2:section5.interaction.capable') },
          { value: 'difficulty', label: t('form2:section5.interaction.difficulty') },
          { value: 'withdrawn', label: t('form2:section5.interaction.withdrawn') },
        ]}
        required
      />
      
      <RadioGroup
        label={t('form2:section5.feedback.label')}
        value={formData.feedbackResponse}
        onChange={(val) => onFieldChange('feedbackResponse', val)}
        options={[
          { value: 'accepts', label: t('form2:section5.feedback.accepts') },
          { value: 'resistant', label: t('form2:section5.feedback.resistant') },
          { value: 'frustrated', label: t('form2:section5.feedback.frustrated') },
          { value: 'avoids', label: t('form2:section5.feedback.avoids') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form2:section5.emotionalRegulation.label')}
        values={formData.emotionalRegulation || []}
        onChange={(val) => onFieldChange('emotionalRegulation', val)}
        options={[
          { value: 'manages', label: t('form2:section5.emotionalRegulation.manages') },
          { value: 'most', label: t('form2:section5.emotionalRegulation.most') },
          { value: 'often', label: t('form2:section5.emotionalRegulation.often') },
          { value: 'difficulty', label: t('form2:section5.emotionalRegulation.difficulty') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form2:section5.behavioral.label')}
        values={formData.behavioral || []}
        onChange={(val) => onFieldChange('behavioral', val)}
        options={[
          { value: 'cooperative', label: t('form2:section5.behavioral.cooperative') },
          { value: 'distracted', label: t('form2:section5.behavioral.distracted') },
          { value: 'defiance', label: t('form2:section5.behavioral.defiance') },
          { value: 'withdrawn', label: t('form2:section5.behavioral.withdrawn') },
          { value: 'aggressive', label: t('form2:section5.behavioral.aggressive') },
          { value: 'none', label: t('form2:section5.behavioral.none') },
          { value: 'other', label: t('form2:section5.behavioral.other') },
        ]}
      />
      
      {formData.behavioral?.includes('other') && (
        <TextInput
          label={t('form2:section5.behavioral.otherPlaceholder')}
          value={formData.behavioralOther}
          onChange={(val) => onFieldChange('behavioralOther', val)}
          placeholder={t('form2:section5.behavioral.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section5.selfRegulate.label')}
        values={formData.selfRegulate || []}
        onChange={(val) => onFieldChange('selfRegulate', val)}
        options={[
          { value: 'breathing', label: t('form2:section5.selfRegulate.breathing') },
          { value: 'leaving', label: t('form2:section5.selfRegulate.leaving') },
          { value: 'sensory', label: t('form2:section5.selfRegulate.sensory') },
          { value: 'talking', label: t('form2:section5.selfRegulate.talking') },
          { value: 'drawing', label: t('form2:section5.selfRegulate.drawing') },
          { value: 'none', label: t('form2:section5.selfRegulate.none') },
          { value: 'other', label: t('form2:section5.selfRegulate.other') },
        ]}
      />
      
      {formData.selfRegulate?.includes('other') && (
        <TextInput
          label={t('form2:section5.selfRegulate.otherPlaceholder')}
          value={formData.selfRegulateOther}
          onChange={(val) => onFieldChange('selfRegulateOther', val)}
          placeholder={t('form2:section5.selfRegulate.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section5.triggers.label')}
        values={formData.triggers || []}
        onChange={(val) => onFieldChange('triggers', val)}
        options={[
          { value: 'loud', label: t('form2:section5.triggers.loud') },
          { value: 'peer', label: t('form2:section5.triggers.peer') },
          { value: 'transitions', label: t('form2:section5.triggers.transitions') },
          { value: 'corrected', label: t('form2:section5.triggers.corrected') },
          { value: 'academic', label: t('form2:section5.triggers.academic') },
          { value: 'unclear', label: t('form2:section5.triggers.unclear') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section5.empathy.label')}
        value={formData.empathy}
        onChange={(val) => onFieldChange('empathy', val)}
        options={[
          { value: 'yes', label: t('form2:section5.empathy.yes') },
          { value: 'occasionally', label: t('form2:section5.empathy.occasionally') },
          { value: 'rarely', label: t('form2:section5.empathy.rarely') },
          { value: 'not', label: t('form2:section5.empathy.not') },
        ]}
      />
    </Section>
  );

  // Section 6: Support Needs
  const renderSection6 = () => (
    <Section title={t('form2:section6.title')}>
      <CheckboxGroup
        label={t('form2:section6.currentSupport.label')}
        values={formData.currentSupport || []}
        onChange={(val) => onFieldChange('currentSupport', val)}
        options={[
          { value: 'individual', label: t('form2:section6.currentSupport.individual') },
          { value: 'oneOnOne', label: t('form2:section6.currentSupport.oneOnOne') },
          { value: 'emotional', label: t('form2:section6.currentSupport.emotional') },
          { value: 'behavior', label: t('form2:section6.currentSupport.behavior') },
          { value: 'peer', label: t('form2:section6.currentSupport.peer') },
          { value: 'none', label: t('form2:section6.currentSupport.none') },
          { value: 'other', label: t('form2:section6.currentSupport.other') },
        ]}
      />
      
      {formData.currentSupport?.includes('other') && (
        <TextInput
          label={t('form2:section6.currentSupport.otherPlaceholder')}
          value={formData.currentSupportOther}
          onChange={(val) => onFieldChange('currentSupportOther', val)}
          placeholder={t('form2:section6.currentSupport.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section6.effectiveMethods.label')}
        values={formData.effectiveMethods || []}
        onChange={(val) => onFieldChange('effectiveMethods', val)}
        options={[
          { value: 'clear', label: t('form2:section6.effectiveMethods.clear') },
          { value: 'personalized', label: t('form2:section6.effectiveMethods.personalized') },
          { value: 'handson', label: t('form2:section6.effectiveMethods.handson') },
          { value: 'breaks', label: t('form2:section6.effectiveMethods.breaks') },
          { value: 'positive', label: t('form2:section6.effectiveMethods.positive') },
          { value: 'visual', label: t('form2:section6.effectiveMethods.visual') },
          { value: 'collaboration', label: t('form2:section6.effectiveMethods.collaboration') },
          { value: 'other', label: t('form2:section6.effectiveMethods.other') },
        ]}
      />
      
      {formData.effectiveMethods?.includes('other') && (
        <TextInput
          label={t('form2:section6.effectiveMethods.otherPlaceholder')}
          value={formData.effectiveMethodsOther}
          onChange={(val) => onFieldChange('effectiveMethodsOther', val)}
          placeholder={t('form2:section6.effectiveMethods.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('form2:section6.additionalSupport.label')}
        values={formData.additionalSupport || []}
        onChange={(val) => onFieldChange('additionalSupport', val)}
        options={[
          { value: 'academic', label: t('form2:section6.additionalSupport.academic') },
          { value: 'socialEmotional', label: t('form2:section6.additionalSupport.socialEmotional') },
          { value: 'mentorship', label: t('form2:section6.additionalSupport.mentorship') },
          { value: 'counseling', label: t('form2:section6.additionalSupport.counseling') },
          { value: 'peerLed', label: t('form2:section6.additionalSupport.peerLed') },
          { value: 'other', label: t('form2:section6.additionalSupport.other') },
        ]}
      />
      
      {formData.additionalSupport?.includes('other') && (
        <TextInput
          label={t('form2:section6.additionalSupport.otherPlaceholder')}
          value={formData.additionalSupportOther}
          onChange={(val) => onFieldChange('additionalSupportOther', val)}
          placeholder={t('form2:section6.additionalSupport.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('form2:section6.goals.label')}
        value={formData.recommendedGoals}
        onChange={(val) => onFieldChange('recommendedGoals', val)}
        placeholder={t('form2:section6.goals.placeholder')}
        rows={4}
      />
      
      <RadioGroup
        label={t('form2:section6.timeOfDay.label')}
        value={formData.timeOfDay}
        onChange={(val) => onFieldChange('timeOfDay', val)}
        options={[
          { value: 'morning', label: t('form2:section6.timeOfDay.morning') },
          { value: 'midday', label: t('form2:section6.timeOfDay.midday') },
          { value: 'afternoon', label: t('form2:section6.timeOfDay.afternoon') },
          { value: 'varies', label: t('form2:section6.timeOfDay.varies') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section6.visualAids.label')}
        value={formData.visualAids}
        onChange={(val) => onFieldChange('visualAids', val)}
        options={[
          { value: 'consistently', label: t('form2:section6.visualAids.consistently') },
          { value: 'reminders', label: t('form2:section6.visualAids.reminders') },
          { value: 'resists', label: t('form2:section6.visualAids.resists') },
          { value: 'notYet', label: t('form2:section6.visualAids.notYet') },
        ]}
      />
      
      <RadioGroup
        label={t('form2:section6.familyResponsive.label')}
        value={formData.familyResponsive}
        onChange={(val) => onFieldChange('familyResponsive', val)}
        options={[
          { value: 'highly', label: t('form2:section6.familyResponsive.highly') },
          { value: 'somewhat', label: t('form2:section6.familyResponsive.somewhat') },
          { value: 'rarely', label: t('form2:section6.familyResponsive.rarely') },
          { value: 'barrier', label: t('form2:section6.familyResponsive.barrier') },
          { value: 'unknown', label: t('form2:section6.familyResponsive.unknown') },
        ]}
      />
      
      <TextArea
        label={t('form2:section6.environmentalChanges.label')}
        value={formData.environmentalChanges}
        onChange={(val) => onFieldChange('environmentalChanges', val)}
        placeholder={t('form2:section6.environmentalChanges.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 7: AI Usage
  const renderSection7 = () => (
    <Section title={t('form2:section7.title')}>
      <RadioGroup
        label={t('form2:section7.studentAiUsage.label')}
        value={formData.studentAiUsage}
        onChange={(val) => onFieldChange('studentAiUsage', val)}
        options={[
          { value: 'never', label: t('form2:section7.studentAiUsage.never') },
          { value: 'rarely', label: t('form2:section7.studentAiUsage.rarely') },
          { value: 'occasionally', label: t('form2:section7.studentAiUsage.occasionally') },
          { value: 'frequently', label: t('form2:section7.studentAiUsage.frequently') },
          { value: 'dontKnow', label: t('form2:section7.studentAiUsage.dontKnow') },
        ]}
      />
      
      <CheckboxGroup
        label={t('form2:section7.studentAiActivities.label')}
        values={formData.studentAiActivities || []}
        onChange={(val) => onFieldChange('studentAiActivities', val)}
        options={[
          { value: 'brainstorming', label: t('form2:section7.studentAiActivities.brainstorming') },
          { value: 'drafting', label: t('form2:section7.studentAiActivities.drafting') },
          { value: 'solving', label: t('form2:section7.studentAiActivities.solving') },
          { value: 'language', label: t('form2:section7.studentAiActivities.language') },
          { value: 'notes', label: t('form2:section7.studentAiActivities.notes') },
          { value: 'other', label: t('form2:section7.studentAiActivities.other') },
        ]}
      />
      
      {formData.studentAiActivities?.includes('other') && (
        <TextInput
          label={t('form2:section7.studentAiActivities.otherPlaceholder')}
          value={formData.studentAiActivitiesOther}
          onChange={(val) => onFieldChange('studentAiActivitiesOther', val)}
          placeholder={t('form2:section7.studentAiActivities.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('form2:section7.futureAiSupport.label')}
        value={formData.futureAiSupport}
        onChange={(val) => onFieldChange('futureAiSupport', val)}
        placeholder={t('form2:section7.futureAiSupport.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 8: Additional Comments
  const renderSection8 = () => (
    <Section title={t('form2:section8.title')}>
      <TextArea
        label={t('form2:section8.observations.label')}
        value={formData.additionalObservations}
        onChange={(val) => onFieldChange('additionalObservations', val)}
        placeholder={t('form2:section8.observations.placeholder')}
        rows={5}
      />
      
      <TextArea
        label={t('form2:section8.suggestions.label')}
        value={formData.suggestions}
        onChange={(val) => onFieldChange('suggestions', val)}
        placeholder={t('form2:section8.suggestions.placeholder')}
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
    renderSection8,
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

export default Form2TeacherAssessment;
