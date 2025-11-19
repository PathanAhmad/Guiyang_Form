import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from './shared/QuestionTypes/TextInput';
import TextArea from './shared/QuestionTypes/TextArea';
import RadioGroup from './shared/QuestionTypes/RadioGroup';
import CheckboxGroup from './shared/QuestionTypes/CheckboxGroup';
import DateInput from './shared/QuestionTypes/DateInput';

const FormBBehaviorAssessment = ({
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
  const totalSections = 10; // 0 (intro) + 9 sections

  // Section 0: Introduction and Consent
  const renderSection0 = () => (
    <Section title={t('formB:title')}>
      <div className="space-y-6">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            {t('formB:intro.purpose')}
          </p>
          <p className="text-gray-700 font-semibold mb-2">
            {t('formB:intro.helps')}
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>{t('formB:intro.bullet1')}</li>
            <li>{t('formB:intro.bullet2')}</li>
            <li>{t('formB:intro.bullet3')}</li>
          </ul>
          <p className="text-gray-600 mt-4 italic">
            {t('formB:intro.confidential')}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <CheckboxGroup
            label=""
            values={formData.consent ? ['consent'] : []}
            onChange={(val) => onFieldChange('consent', val.includes('consent'))}
            options={[
              { value: 'consent', label: t('formB:consent.text') }
            ]}
            required
            error={validationErrors.consent ? t('pilotSurveys:form.requiredField') : null}
            fieldName="consent"
          />
        </div>
      </div>
    </Section>
  );

  // Section 1: Student Identification
  const renderSection1 = () => (
    <Section title={t('formB:section1.title')}>
      <TextInput
        label={t('formB:section1.studentName.label')}
        value={formData.studentName}
        onChange={(val) => onFieldChange('studentName', val)}
        placeholder={t('formB:section1.studentName.placeholder')}
        required
        error={validationErrors.studentName ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <TextInput
        label={t('formB:section1.studentId.label')}
        value={formData.studentId}
        onChange={(val) => onFieldChange('studentId', val)}
        placeholder={t('formB:section1.studentId.placeholder')}
        required
        error={validationErrors.studentId ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <DateInput
        label={t('formB:section1.assessmentDate.label')}
        value={formData.assessmentDate}
        onChange={(val) => onFieldChange('assessmentDate', val)}
        placeholder={t('formB:section1.assessmentDate.placeholder')}
        required
        error={validationErrors.assessmentDate ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <TextInput
        label={t('formB:section1.assessorName.label')}
        value={formData.assessorName}
        onChange={(val) => onFieldChange('assessorName', val)}
        placeholder={t('formB:section1.assessorName.placeholder')}
        required
        error={validationErrors.assessorName ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <RadioGroup
        label={t('formB:section1.assessorRole.label')}
        value={formData.assessorRole}
        onChange={(val) => onFieldChange('assessorRole', val)}
        options={[
          { value: 'educator', label: t('formB:section1.assessorRole.educator') },
          { value: 'specialist', label: t('formB:section1.assessorRole.specialist') },
          { value: 'coordinator', label: t('formB:section1.assessorRole.coordinator') },
          { value: 'other', label: t('formB:section1.assessorRole.other') },
        ]}
        required
        error={validationErrors.assessorRole ? t('pilotSurveys:form.requiredField') : null}
      />
      
      {formData.assessorRole === 'other' && (
        <TextInput
          label={t('formB:section1.assessorRole.otherPlaceholder')}
          value={formData.assessorRoleOther}
          onChange={(val) => onFieldChange('assessorRoleOther', val)}
          placeholder={t('formB:section1.assessorRole.otherPlaceholder')}
        />
      )}
    </Section>
  );

  // Section 2: Academic Performance
  const renderSection2 = () => (
    <Section title={t('formB:section2.title')}>
      <RadioGroup
        label={t('formB:section2.academicEngagement.label')}
        value={formData.academicEngagement}
        onChange={(val) => onFieldChange('academicEngagement', val)}
        options={[
          { value: 'excellent', label: t('formB:section2.academicEngagement.excellent') },
          { value: 'good', label: t('formB:section2.academicEngagement.good') },
          { value: 'fair', label: t('formB:section2.academicEngagement.fair') },
          { value: 'poor', label: t('formB:section2.academicEngagement.poor') },
        ]}
        required
        error={validationErrors.academicEngagement ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <RadioGroup
        label={t('formB:section2.taskCompletion.label')}
        value={formData.taskCompletion}
        onChange={(val) => onFieldChange('taskCompletion', val)}
        options={[
          { value: 'always', label: t('formB:section2.taskCompletion.always') },
          { value: 'usually', label: t('formB:section2.taskCompletion.usually') },
          { value: 'sometimes', label: t('formB:section2.taskCompletion.sometimes') },
          { value: 'rarely', label: t('formB:section2.taskCompletion.rarely') },
        ]}
        required
        error={validationErrors.taskCompletion ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <RadioGroup
        label={t('formB:section2.learningPace.label')}
        value={formData.learningPace}
        onChange={(val) => onFieldChange('learningPace', val)}
        options={[
          { value: 'advanced', label: t('formB:section2.learningPace.advanced') },
          { value: 'onTrack', label: t('formB:section2.learningPace.onTrack') },
          { value: 'needsSupport', label: t('formB:section2.learningPace.needsSupport') },
          { value: 'significant', label: t('formB:section2.learningPace.significant') },
        ]}
        required
        error={validationErrors.learningPace ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <CheckboxGroup
        label={t('formB:section2.strengths.label')}
        values={formData.academicStrengths || []}
        onChange={(val) => onFieldChange('academicStrengths', val)}
        options={[
          { value: 'reading', label: t('formB:section2.strengths.reading') },
          { value: 'writing', label: t('formB:section2.strengths.writing') },
          { value: 'math', label: t('formB:section2.strengths.math') },
          { value: 'science', label: t('formB:section2.strengths.science') },
          { value: 'arts', label: t('formB:section2.strengths.arts') },
          { value: 'technology', label: t('formB:section2.strengths.technology') },
          { value: 'other', label: t('formB:section2.strengths.other') },
        ]}
      />
      
      {formData.academicStrengths?.includes('other') && (
        <TextInput
          label={t('formB:section2.strengths.otherPlaceholder')}
          value={formData.academicStrengthsOther}
          onChange={(val) => onFieldChange('academicStrengthsOther', val)}
          placeholder={t('formB:section2.strengths.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section2.challenges.label')}
        values={formData.academicChallenges || []}
        onChange={(val) => onFieldChange('academicChallenges', val)}
        options={[
          { value: 'attention', label: t('formB:section2.challenges.attention') },
          { value: 'comprehension', label: t('formB:section2.challenges.comprehension') },
          { value: 'expression', label: t('formB:section2.challenges.expression') },
          { value: 'math', label: t('formB:section2.challenges.math') },
          { value: 'organization', label: t('formB:section2.challenges.organization') },
          { value: 'timeManagement', label: t('formB:section2.challenges.timeManagement') },
          { value: 'other', label: t('formB:section2.challenges.other') },
        ]}
      />
      
      {formData.academicChallenges?.includes('other') && (
        <TextInput
          label={t('formB:section2.challenges.otherPlaceholder')}
          value={formData.academicChallengesOther}
          onChange={(val) => onFieldChange('academicChallengesOther', val)}
          placeholder={t('formB:section2.challenges.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('formB:section2.notes.label')}
        value={formData.academicNotes}
        onChange={(val) => onFieldChange('academicNotes', val)}
        placeholder={t('formB:section2.notes.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 3: Social-Emotional Behavior
  const renderSection3 = () => (
    <Section title={t('formB:section3.title')}>
      <RadioGroup
        label={t('formB:section3.peerInteraction.label')}
        value={formData.peerInteraction}
        onChange={(val) => onFieldChange('peerInteraction', val)}
        options={[
          { value: 'positive', label: t('formB:section3.peerInteraction.positive') },
          { value: 'adequate', label: t('formB:section3.peerInteraction.adequate') },
          { value: 'limited', label: t('formB:section3.peerInteraction.limited') },
          { value: 'conflict', label: t('formB:section3.peerInteraction.conflict') },
        ]}
        required
        error={validationErrors.peerInteraction ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <RadioGroup
        label={t('formB:section3.emotionalRegulation.label')}
        value={formData.emotionalRegulation}
        onChange={(val) => onFieldChange('emotionalRegulation', val)}
        options={[
          { value: 'excellent', label: t('formB:section3.emotionalRegulation.excellent') },
          { value: 'good', label: t('formB:section3.emotionalRegulation.good') },
          { value: 'developing', label: t('formB:section3.emotionalRegulation.developing') },
          { value: 'challenged', label: t('formB:section3.emotionalRegulation.challenged') },
        ]}
        required
        error={validationErrors.emotionalRegulation ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <CheckboxGroup
        label={t('formB:section3.behaviorConcerns.label')}
        values={formData.behaviorConcerns || []}
        onChange={(val) => onFieldChange('behaviorConcerns', val)}
        options={[
          { value: 'none', label: t('formB:section3.behaviorConcerns.none') },
          { value: 'aggression', label: t('formB:section3.behaviorConcerns.aggression') },
          { value: 'withdrawal', label: t('formB:section3.behaviorConcerns.withdrawal') },
          { value: 'anxiety', label: t('formB:section3.behaviorConcerns.anxiety') },
          { value: 'defiance', label: t('formB:section3.behaviorConcerns.defiance') },
          { value: 'impulsivity', label: t('formB:section3.behaviorConcerns.impulsivity') },
          { value: 'attention', label: t('formB:section3.behaviorConcerns.attention') },
          { value: 'other', label: t('formB:section3.behaviorConcerns.other') },
        ]}
      />
      
      {formData.behaviorConcerns?.includes('other') && (
        <TextInput
          label={t('formB:section3.behaviorConcerns.otherPlaceholder')}
          value={formData.behaviorConcernsOther}
          onChange={(val) => onFieldChange('behaviorConcernsOther', val)}
          placeholder={t('formB:section3.behaviorConcerns.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section3.positiveTraits.label')}
        values={formData.positiveTraits || []}
        onChange={(val) => onFieldChange('positiveTraits', val)}
        options={[
          { value: 'empathy', label: t('formB:section3.positiveTraits.empathy') },
          { value: 'cooperation', label: t('formB:section3.positiveTraits.cooperation') },
          { value: 'leadership', label: t('formB:section3.positiveTraits.leadership') },
          { value: 'resilience', label: t('formB:section3.positiveTraits.resilience') },
          { value: 'respect', label: t('formB:section3.positiveTraits.respect') },
          { value: 'kindness', label: t('formB:section3.positiveTraits.kindness') },
          { value: 'other', label: t('formB:section3.positiveTraits.other') },
        ]}
      />
      
      {formData.positiveTraits?.includes('other') && (
        <TextInput
          label={t('formB:section3.positiveTraits.otherPlaceholder')}
          value={formData.positiveTraitsOther}
          onChange={(val) => onFieldChange('positiveTraitsOther', val)}
          placeholder={t('formB:section3.positiveTraits.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('formB:section3.notes.label')}
        value={formData.socialEmotionalNotes}
        onChange={(val) => onFieldChange('socialEmotionalNotes', val)}
        placeholder={t('formB:section3.notes.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 4: Participation & Engagement
  const renderSection4 = () => (
    <Section title={t('formB:section4.title')}>
      <RadioGroup
        label={t('formB:section4.classParticipation.label')}
        value={formData.classParticipation}
        onChange={(val) => onFieldChange('classParticipation', val)}
        options={[
          { value: 'veryActive', label: t('formB:section4.classParticipation.veryActive') },
          { value: 'moderate', label: t('formB:section4.classParticipation.moderate') },
          { value: 'limited', label: t('formB:section4.classParticipation.limited') },
          { value: 'minimal', label: t('formB:section4.classParticipation.minimal') },
        ]}
        required
        error={validationErrors.classParticipation ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <RadioGroup
        label={t('formB:section4.groupWork.label')}
        value={formData.groupWork}
        onChange={(val) => onFieldChange('groupWork', val)}
        options={[
          { value: 'leader', label: t('formB:section4.groupWork.leader') },
          { value: 'contributor', label: t('formB:section4.groupWork.contributor') },
          { value: 'follower', label: t('formB:section4.groupWork.follower') },
          { value: 'reluctant', label: t('formB:section4.groupWork.reluctant') },
        ]}
        required
        error={validationErrors.groupWork ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <CheckboxGroup
        label={t('formB:section4.motivation.label')}
        values={formData.motivation || []}
        onChange={(val) => onFieldChange('motivation', val)}
        options={[
          { value: 'intrinsic', label: t('formB:section4.motivation.intrinsic') },
          { value: 'praise', label: t('formB:section4.motivation.praise') },
          { value: 'grades', label: t('formB:section4.motivation.grades') },
          { value: 'peer', label: t('formB:section4.motivation.peer') },
          { value: 'rewards', label: t('formB:section4.motivation.rewards') },
          { value: 'avoidance', label: t('formB:section4.motivation.avoidance') },
          { value: 'unclear', label: t('formB:section4.motivation.unclear') },
          { value: 'other', label: t('formB:section4.motivation.other') },
        ]}
      />
      
      {formData.motivation?.includes('other') && (
        <TextInput
          label={t('formB:section4.motivation.otherPlaceholder')}
          value={formData.motivationOther}
          onChange={(val) => onFieldChange('motivationOther', val)}
          placeholder={t('formB:section4.motivation.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('formB:section4.notes.label')}
        value={formData.participationNotes}
        onChange={(val) => onFieldChange('participationNotes', val)}
        placeholder={t('formB:section4.notes.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 5: Support Needs
  const renderSection5 = () => (
    <Section title={t('formB:section5.title')}>
      <CheckboxGroup
        label={t('formB:section5.currentSupport.label')}
        values={formData.currentSupport || []}
        onChange={(val) => onFieldChange('currentSupport', val)}
        options={[
          { value: 'none', label: t('formB:section5.currentSupport.none') },
          { value: 'individualized', label: t('formB:section5.currentSupport.individualized') },
          { value: 'smallGroup', label: t('formB:section5.currentSupport.smallGroup') },
          { value: 'behavioral', label: t('formB:section5.currentSupport.behavioral') },
          { value: 'academic', label: t('formB:section5.currentSupport.academic') },
          { value: 'counseling', label: t('formB:section5.currentSupport.counseling') },
          { value: 'accommodations', label: t('formB:section5.currentSupport.accommodations') },
          { value: 'other', label: t('formB:section5.currentSupport.other') },
        ]}
      />
      
      {formData.currentSupport?.includes('other') && (
        <TextInput
          label={t('formB:section5.currentSupport.otherPlaceholder')}
          value={formData.currentSupportOther}
          onChange={(val) => onFieldChange('currentSupportOther', val)}
          placeholder={t('formB:section5.currentSupport.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section5.recommendedSupport.label')}
        values={formData.recommendedSupport || []}
        onChange={(val) => onFieldChange('recommendedSupport', val)}
        options={[
          { value: 'none', label: t('formB:section5.recommendedSupport.none') },
          { value: 'academic', label: t('formB:section5.recommendedSupport.academic') },
          { value: 'behavioral', label: t('formB:section5.recommendedSupport.behavioral') },
          { value: 'socialSkills', label: t('formB:section5.recommendedSupport.socialSkills') },
          { value: 'counseling', label: t('formB:section5.recommendedSupport.counseling') },
          { value: 'parentEngagement', label: t('formB:section5.recommendedSupport.parentEngagement') },
          { value: 'peerSupport', label: t('formB:section5.recommendedSupport.peerSupport') },
          { value: 'accommodations', label: t('formB:section5.recommendedSupport.accommodations') },
          { value: 'other', label: t('formB:section5.recommendedSupport.other') },
        ]}
      />
      
      {formData.recommendedSupport?.includes('other') && (
        <TextInput
          label={t('formB:section5.recommendedSupport.otherPlaceholder')}
          value={formData.recommendedSupportOther}
          onChange={(val) => onFieldChange('recommendedSupportOther', val)}
          placeholder={t('formB:section5.recommendedSupport.otherPlaceholder')}
        />
      )}
      
      <RadioGroup
        label={t('formB:section5.urgency.label')}
        value={formData.supportUrgency}
        onChange={(val) => onFieldChange('supportUrgency', val)}
        options={[
          { value: 'notUrgent', label: t('formB:section5.urgency.notUrgent') },
          { value: 'moderate', label: t('formB:section5.urgency.moderate') },
          { value: 'urgent', label: t('formB:section5.urgency.urgent') },
          { value: 'immediate', label: t('formB:section5.urgency.immediate') },
        ]}
        required
        error={validationErrors.supportUrgency ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <TextArea
        label={t('formB:section5.notes.label')}
        value={formData.supportNotes}
        onChange={(val) => onFieldChange('supportNotes', val)}
        placeholder={t('formB:section5.notes.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 6: Communication & Relationships
  const renderSection6 = () => (
    <Section title={t('formB:section6.title')}>
      <RadioGroup
        label={t('formB:section6.adultRelationships.label')}
        value={formData.adultRelationships}
        onChange={(val) => onFieldChange('adultRelationships', val)}
        options={[
          { value: 'positive', label: t('formB:section6.adultRelationships.positive') },
          { value: 'respectful', label: t('formB:section6.adultRelationships.respectful') },
          { value: 'cautious', label: t('formB:section6.adultRelationships.cautious') },
          { value: 'challenging', label: t('formB:section6.adultRelationships.challenging') },
        ]}
        required
        error={validationErrors.adultRelationships ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <CheckboxGroup
        label={t('formB:section6.communication.label')}
        values={formData.communication || []}
        onChange={(val) => onFieldChange('communication', val)}
        options={[
          { value: 'verbal', label: t('formB:section6.communication.verbal') },
          { value: 'nonverbal', label: t('formB:section6.communication.nonverbal') },
          { value: 'written', label: t('formB:section6.communication.written') },
          { value: 'digital', label: t('formB:section6.communication.digital') },
          { value: 'limited', label: t('formB:section6.communication.limited') },
          { value: 'other', label: t('formB:section6.communication.other') },
        ]}
      />
      
      {formData.communication?.includes('other') && (
        <TextInput
          label={t('formB:section6.communication.otherPlaceholder')}
          value={formData.communicationOther}
          onChange={(val) => onFieldChange('communicationOther', val)}
          placeholder={t('formB:section6.communication.otherPlaceholder')}
        />
      )}
      
      <RadioGroup
        label={t('formB:section6.expressesNeeds.label')}
        value={formData.expressesNeeds}
        onChange={(val) => onFieldChange('expressesNeeds', val)}
        options={[
          { value: 'consistently', label: t('formB:section6.expressesNeeds.consistently') },
          { value: 'usually', label: t('formB:section6.expressesNeeds.usually') },
          { value: 'sometimes', label: t('formB:section6.expressesNeeds.sometimes') },
          { value: 'rarely', label: t('formB:section6.expressesNeeds.rarely') },
        ]}
        required
        error={validationErrors.expressesNeeds ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <TextArea
        label={t('formB:section6.notes.label')}
        value={formData.communicationNotes}
        onChange={(val) => onFieldChange('communicationNotes', val)}
        placeholder={t('formB:section6.notes.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 7: Progress & Growth
  const renderSection7 = () => (
    <Section title={t('formB:section7.title')}>
      <RadioGroup
        label={t('formB:section7.overallProgress.label')}
        value={formData.overallProgress}
        onChange={(val) => onFieldChange('overallProgress', val)}
        options={[
          { value: 'excellent', label: t('formB:section7.overallProgress.excellent') },
          { value: 'good', label: t('formB:section7.overallProgress.good') },
          { value: 'fair', label: t('formB:section7.overallProgress.fair') },
          { value: 'concern', label: t('formB:section7.overallProgress.concern') },
        ]}
        required
        error={validationErrors.overallProgress ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <CheckboxGroup
        label={t('formB:section7.areasOfGrowth.label')}
        values={formData.areasOfGrowth || []}
        onChange={(val) => onFieldChange('areasOfGrowth', val)}
        options={[
          { value: 'academic', label: t('formB:section7.areasOfGrowth.academic') },
          { value: 'social', label: t('formB:section7.areasOfGrowth.social') },
          { value: 'emotional', label: t('formB:section7.areasOfGrowth.emotional') },
          { value: 'behavior', label: t('formB:section7.areasOfGrowth.behavior') },
          { value: 'confidence', label: t('formB:section7.areasOfGrowth.confidence') },
          { value: 'independence', label: t('formB:section7.areasOfGrowth.independence') },
          { value: 'participation', label: t('formB:section7.areasOfGrowth.participation') },
          { value: 'other', label: t('formB:section7.areasOfGrowth.other') },
        ]}
      />
      
      {formData.areasOfGrowth?.includes('other') && (
        <TextInput
          label={t('formB:section7.areasOfGrowth.otherPlaceholder')}
          value={formData.areasOfGrowthOther}
          onChange={(val) => onFieldChange('areasOfGrowthOther', val)}
          placeholder={t('formB:section7.areasOfGrowth.otherPlaceholder')}
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section7.priorityAreas.label')}
        values={formData.priorityAreas || []}
        onChange={(val) => onFieldChange('priorityAreas', val)}
        options={[
          { value: 'academic', label: t('formB:section7.priorityAreas.academic') },
          { value: 'social', label: t('formB:section7.priorityAreas.social') },
          { value: 'emotional', label: t('formB:section7.priorityAreas.emotional') },
          { value: 'behavior', label: t('formB:section7.priorityAreas.behavior') },
          { value: 'communication', label: t('formB:section7.priorityAreas.communication') },
          { value: 'organization', label: t('formB:section7.priorityAreas.organization') },
          { value: 'selfAdvocacy', label: t('formB:section7.priorityAreas.selfAdvocacy') },
          { value: 'other', label: t('formB:section7.priorityAreas.other') },
        ]}
      />
      
      {formData.priorityAreas?.includes('other') && (
        <TextInput
          label={t('formB:section7.priorityAreas.otherPlaceholder')}
          value={formData.priorityAreasOther}
          onChange={(val) => onFieldChange('priorityAreasOther', val)}
          placeholder={t('formB:section7.priorityAreas.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('formB:section7.notes.label')}
        value={formData.progressNotes}
        onChange={(val) => onFieldChange('progressNotes', val)}
        placeholder={t('formB:section7.notes.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 8: Strengths & Interests
  const renderSection8 = () => (
    <Section title={t('formB:section8.title')}>
      <CheckboxGroup
        label={t('formB:section8.personalStrengths.label')}
        values={formData.personalStrengths || []}
        onChange={(val) => onFieldChange('personalStrengths', val)}
        options={[
          { value: 'creative', label: t('formB:section8.personalStrengths.creative') },
          { value: 'analytical', label: t('formB:section8.personalStrengths.analytical') },
          { value: 'practical', label: t('formB:section8.personalStrengths.practical') },
          { value: 'artistic', label: t('formB:section8.personalStrengths.artistic') },
          { value: 'athletic', label: t('formB:section8.personalStrengths.athletic') },
          { value: 'technical', label: t('formB:section8.personalStrengths.technical') },
          { value: 'interpersonal', label: t('formB:section8.personalStrengths.interpersonal') },
          { value: 'leadership', label: t('formB:section8.personalStrengths.leadership') },
          { value: 'perseverance', label: t('formB:section8.personalStrengths.perseverance') },
          { value: 'empathy', label: t('formB:section8.personalStrengths.empathy') },
          { value: 'other', label: t('formB:section8.personalStrengths.other') },
        ]}
      />
      
      {formData.personalStrengths?.includes('other') && (
        <TextInput
          label={t('formB:section8.personalStrengths.otherPlaceholder')}
          value={formData.personalStrengthsOther}
          onChange={(val) => onFieldChange('personalStrengthsOther', val)}
          placeholder={t('formB:section8.personalStrengths.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('formB:section8.interests.label')}
        value={formData.interests}
        onChange={(val) => onFieldChange('interests', val)}
        placeholder={t('formB:section8.interests.placeholder')}
        rows={4}
      />
      
      <CheckboxGroup
        label={t('formB:section8.learningStyle.label')}
        values={formData.learningStyle || []}
        onChange={(val) => onFieldChange('learningStyle', val)}
        options={[
          { value: 'visual', label: t('formB:section8.learningStyle.visual') },
          { value: 'auditory', label: t('formB:section8.learningStyle.auditory') },
          { value: 'kinesthetic', label: t('formB:section8.learningStyle.kinesthetic') },
          { value: 'reading', label: t('formB:section8.learningStyle.reading') },
          { value: 'social', label: t('formB:section8.learningStyle.social') },
          { value: 'independent', label: t('formB:section8.learningStyle.independent') },
          { value: 'other', label: t('formB:section8.learningStyle.other') },
        ]}
      />
      
      {formData.learningStyle?.includes('other') && (
        <TextInput
          label={t('formB:section8.learningStyle.otherPlaceholder')}
          value={formData.learningStyleOther}
          onChange={(val) => onFieldChange('learningStyleOther', val)}
          placeholder={t('formB:section8.learningStyle.otherPlaceholder')}
        />
      )}
      
      <TextArea
        label={t('formB:section8.notes.label')}
        value={formData.strengthsInterestsNotes}
        onChange={(val) => onFieldChange('strengthsInterestsNotes', val)}
        placeholder={t('formB:section8.notes.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Section 9: Overall Assessment Summary
  const renderSection9 = () => (
    <Section title={t('formB:section9.title')}>
      <TextArea
        label={t('formB:section9.summary.label')}
        value={formData.overallSummary}
        onChange={(val) => onFieldChange('overallSummary', val)}
        placeholder={t('formB:section9.summary.placeholder')}
        rows={6}
        required
        error={validationErrors.overallSummary ? t('pilotSurveys:form.requiredField') : null}
      />
      
      <TextArea
        label={t('formB:section9.followUp.label')}
        value={formData.followUpActions}
        onChange={(val) => onFieldChange('followUpActions', val)}
        placeholder={t('formB:section9.followUp.placeholder')}
        rows={4}
      />
      
      <TextArea
        label={t('formB:section9.additionalComments.label')}
        value={formData.additionalComments}
        onChange={(val) => onFieldChange('additionalComments', val)}
        placeholder={t('formB:section9.additionalComments.placeholder')}
        rows={4}
      />
    </Section>
  );

  // Main render logic for current section
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderSection0();
      case 1:
        return renderSection1();
      case 2:
        return renderSection2();
      case 3:
        return renderSection3();
      case 4:
        return renderSection4();
      case 5:
        return renderSection5();
      case 6:
        return renderSection6();
      case 7:
        return renderSection7();
      case 8:
        return renderSection8();
      case 9:
        return renderSection9();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <Progress current={currentSection + 1} total={totalSections} />

      {/* Current Section Content */}
      <div className="mt-8">
        {renderCurrentSection()}
      </div>

      {/* Navigation */}
      <Navigation
        onPrevious={onPrevious}
        onNext={onNext}
        onSaveDraft={onSaveDraft}
        onSubmit={onSubmit}
        isFirstSection={currentSection === 0}
        isLastSection={currentSection === totalSections - 1}
        saving={saving}
        submitting={submitting}
      />
    </div>
  );
};

export default FormBBehaviorAssessment;

