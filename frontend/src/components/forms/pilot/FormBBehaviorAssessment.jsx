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
  canGoNext,
}) => {
  const { t } = useTranslation();
  const totalSections = 9;

  // Section 0: Introduction and Consent
  const renderSection0 = () => (
    <Section>
      <div className="space-y-6 pb-30">
        <div className="bg-gradient-to-br from-[#7c59b2]/20 to-[#7c59b2]/40 rounded-[2rem] p-6">
          <h3 className="text-lg font-normal text-gray-900 mb-3">
            {t('formB:intro.purpose')}
          </h3>
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

        <div className="pt-6">
          <CheckboxGroup
            label=""
            values={formData.consent ? ['consent'] : []}
            onChange={(val) => onFieldChange('consent', val.includes('consent'))}
            options={[
              { value: 'consent', label: <>{t('formB:consent.text')}<span className="text-red-500 ml-1">*</span></> }
            ]}
            error={validationErrors.consent ? t('pilotSurveys:form.requiredField') : null}
            fieldName="consent"
            unstyled={true}
          />
        </div>
      </div>
    </Section>
  );

  // Section 1: Student Identification
  const renderSection1 = () => (
    <Section title={t('formB:section1.title')} paddingClass="pt-8">
      <TextInput
        label={t('formB:section1.studentName.label')}
        value={formData.studentName}
        onChange={(val) => onFieldChange('studentName', val)}
        placeholder={t('formB:section1.studentName.placeholder')}
        required
        error={validationErrors.studentName ? t('pilotSurveys:form.requiredField') : null}
        fieldName="studentName"
      />
      
      <TextInput
        label={t('formB:section1.studentId.label')}
        value={formData.studentId}
        onChange={(val) => onFieldChange('studentId', val)}
        placeholder={t('formB:section1.studentId.placeholder')}
        required
        error={validationErrors.studentId ? t('pilotSurveys:form.requiredField') : null}
        fieldName="studentId"
      />
      
      <TextInput
        label={t('formB:section1.assessorName.label')}
        value={formData.assessorName}
        onChange={(val) => onFieldChange('assessorName', val)}
        placeholder={t('formB:section1.assessorName.placeholder')}
        required
        error={validationErrors.assessorName ? t('pilotSurveys:form.requiredField') : null}
        fieldName="assessorName"
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
        fieldName="assessorRole"
      />
      
      {formData.assessorRole === 'other' && (
        <TextInput
          label={t('formB:section1.assessorRole.otherPlaceholder')}
          value={formData.assessorRoleOther}
          onChange={(val) => onFieldChange('assessorRoleOther', val)}
          placeholder={t('formB:section1.assessorRole.otherPlaceholder')}
          fieldName="assessorRoleOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
    </Section>
  );

  // Section 2: Student Profile
  const renderSection2 = () => (
    <Section title={t('formB:section2.title')}>
      <DateInput
        label={t('formB:section2.dateOfBirth.label')}
        value={formData.studentDOB}
        onChange={(val) => onFieldChange('studentDOB', val)}
        placeholder={t('formB:section2.dateOfBirth.placeholder')}
        required
        error={validationErrors.studentDOB ? t('pilotSurveys:form.requiredField') : null}
        fieldName="studentDOB"
      />
      
      <TextInput
        label={t('formB:section2.gradeLevel.label')}
        value={formData.gradeLevel}
        onChange={(val) => onFieldChange('gradeLevel', val)}
        placeholder={t('formB:section2.gradeLevel.placeholder')}
        required
        error={validationErrors.gradeLevel ? t('pilotSurveys:form.requiredField') : null}
        fieldName="gradeLevel"
      />
      
      <CheckboxGroup
        label={t('formB:section2.livingSituation.label')}
        values={formData.livingSituation || []}
        onChange={(val) => onFieldChange('livingSituation', val)}
        options={[
          { value: 'bothParents', label: t('formB:section2.livingSituation.bothParents') },
          { value: 'oneParent', label: t('formB:section2.livingSituation.oneParent') },
          { value: 'extendedFamily', label: t('formB:section2.livingSituation.extendedFamily') },
          { value: 'foster', label: t('formB:section2.livingSituation.foster') },
          { value: 'boarding', label: t('formB:section2.livingSituation.boarding') },
          { value: 'independent', label: t('formB:section2.livingSituation.independent') },
          { value: 'unknown', label: t('formB:section2.livingSituation.unknown') },
          { value: 'other', label: t('formB:section2.livingSituation.other') },
        ]}
        required
        error={validationErrors.livingSituation ? t('pilotSurveys:form.requiredField') : null}
        fieldName="livingSituation"
      />
      
      {formData.livingSituation?.includes('other') && (
        <TextInput
          label={t('formB:section2.livingSituation.otherPlaceholder')}
          value={formData.livingSituationOther}
          onChange={(val) => onFieldChange('livingSituationOther', val)}
          placeholder={t('formB:section2.livingSituation.otherPlaceholder')}
          fieldName="livingSituationOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section2.educationHistory.label')}
        values={formData.educationHistory || []}
        onChange={(val) => onFieldChange('educationHistory', val)}
        options={[
          { value: 'public', label: t('formB:section2.educationHistory.public') },
          { value: 'private', label: t('formB:section2.educationHistory.private') },
          { value: 'special', label: t('formB:section2.educationHistory.special') },
          { value: 'homeschool', label: t('formB:section2.educationHistory.homeschool') },
          { value: 'disrupted', label: t('formB:section2.educationHistory.disrupted') },
          { value: 'migrated', label: t('formB:section2.educationHistory.migrated') },
          { value: 'other', label: t('formB:section2.educationHistory.other') },
        ]}
        required
        error={validationErrors.educationHistory ? t('pilotSurveys:form.requiredField') : null}
        fieldName="educationHistory"
      />
      
      {formData.educationHistory?.includes('other') && (
        <TextInput
          label={t('formB:section2.educationHistory.otherPlaceholder')}
          value={formData.educationHistoryOther}
          onChange={(val) => onFieldChange('educationHistoryOther', val)}
          placeholder={t('formB:section2.educationHistory.otherPlaceholder')}
          fieldName="educationHistoryOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section2.supportFlags.label')}
        values={formData.supportFlags || []}
        onChange={(val) => onFieldChange('supportFlags', val)}
        options={[
          { value: 'autistic', label: t('formB:section2.supportFlags.autistic') },
          { value: 'adhd', label: t('formB:section2.supportFlags.adhd') },
          { value: 'anxiety', label: t('formB:section2.supportFlags.anxiety') },
          { value: 'signLanguage', label: t('formB:section2.supportFlags.signLanguage') },
          { value: 'sensory', label: t('formB:section2.supportFlags.sensory') },
          { value: 'physical', label: t('formB:section2.supportFlags.physical') },
          { value: 'cultural', label: t('formB:section2.supportFlags.cultural') },
          { value: 'notDisclosed', label: t('formB:section2.supportFlags.notDisclosed') },
          { value: 'other', label: t('formB:section2.supportFlags.other') },
        ]}
        required
        error={validationErrors.supportFlags ? t('pilotSurveys:form.requiredField') : null}
        fieldName="supportFlags"
      />
      
      {formData.supportFlags?.includes('other') && (
        <TextInput
          label={t('formB:section2.supportFlags.otherPlaceholder')}
          value={formData.supportFlagsOther}
          onChange={(val) => onFieldChange('supportFlagsOther', val)}
          placeholder={t('formB:section2.supportFlags.otherPlaceholder')}
          fieldName="supportFlagsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section2.supportNetwork.label')}
        values={formData.supportNetwork || []}
        onChange={(val) => onFieldChange('supportNetwork', val)}
        options={[
          { value: 'parents', label: t('formB:section2.supportNetwork.parents') },
          { value: 'siblings', label: t('formB:section2.supportNetwork.siblings') },
          { value: 'counseling', label: t('formB:section2.supportNetwork.counseling') },
          { value: 'family', label: t('formB:section2.supportNetwork.family') },
          { value: 'none', label: t('formB:section2.supportNetwork.none') },
          { value: 'other', label: t('formB:section2.supportNetwork.other') },
        ]}
        required
        error={validationErrors.supportNetwork ? t('pilotSurveys:form.requiredField') : null}
        fieldName="supportNetwork"
      />
      
      {formData.supportNetwork?.includes('other') && (
        <TextInput
          label={t('formB:section2.supportNetwork.otherPlaceholder')}
          value={formData.supportNetworkOther}
          onChange={(val) => onFieldChange('supportNetworkOther', val)}
          placeholder={t('formB:section2.supportNetwork.otherPlaceholder')}
          fieldName="supportNetworkOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section2.homeResources.label')}
        values={formData.homeResources || []}
        onChange={(val) => onFieldChange('homeResources', val)}
        options={[
          { value: 'personal', label: t('formB:section2.homeResources.personal') },
          { value: 'shared', label: t('formB:section2.homeResources.shared') },
          { value: 'smartphone', label: t('formB:section2.homeResources.smartphone') },
          { value: 'internet', label: t('formB:section2.homeResources.internet') },
          { value: 'books', label: t('formB:section2.homeResources.books') },
          { value: 'space', label: t('formB:section2.homeResources.space') },
          { value: 'minimal', label: t('formB:section2.homeResources.minimal') },
        ]}
        required
        error={validationErrors.homeResources ? t('pilotSurveys:form.requiredField') : null}
        fieldName="homeResources"
      />
      
      <CheckboxGroup
        label={t('formB:section2.emotionalSupport.label')}
        values={formData.emotionalSupport || []}
        onChange={(val) => onFieldChange('emotionalSupport', val)}
        options={[
          { value: 'checkins', label: t('formB:section2.emotionalSupport.checkins') },
          { value: 'peer', label: t('formB:section2.emotionalSupport.peer') },
          { value: 'counseling', label: t('formB:section2.emotionalSupport.counseling') },
          { value: 'family', label: t('formB:section2.emotionalSupport.family') },
          { value: 'none', label: t('formB:section2.emotionalSupport.none') },
          { value: 'other', label: t('formB:section2.emotionalSupport.other') },
        ]}
        required
        error={validationErrors.emotionalSupport ? t('pilotSurveys:form.requiredField') : null}
        fieldName="emotionalSupport"
      />
      
      {formData.emotionalSupport?.includes('other') && (
        <TextInput
          label={t('formB:section2.emotionalSupport.otherPlaceholder')}
          value={formData.emotionalSupportOther}
          onChange={(val) => onFieldChange('emotionalSupportOther', val)}
          placeholder={t('formB:section2.emotionalSupport.otherPlaceholder')}
          fieldName="emotionalSupportOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <RadioGroup
        label={t('formB:section2.pastStress.label')}
        value={formData.pastStress}
        onChange={(val) => onFieldChange('pastStress', val)}
        options={[
          { value: 'yes', label: t('formB:section2.pastStress.yes') },
          { value: 'occasionally', label: t('formB:section2.pastStress.occasionally') },
          { value: 'not', label: t('formB:section2.pastStress.not') },
          { value: 'unknown', label: t('formB:section2.pastStress.unknown') },
        ]}
        required
        error={validationErrors.pastStress ? t('pilotSurveys:form.requiredField') : null}
        fieldName="pastStress"
      />
      
      <RadioGroup
        label={t('formB:section2.trustedAdult.label')}
        value={formData.trustedAdult}
        onChange={(val) => onFieldChange('trustedAdult', val)}
        options={[
          { value: 'yes', label: t('formB:section2.trustedAdult.yes') },
          { value: 'somewhat', label: t('formB:section2.trustedAdult.somewhat') },
          { value: 'no', label: t('formB:section2.trustedAdult.no') },
          { value: 'benefit', label: t('formB:section2.trustedAdult.benefit') },
        ]}
        required
        error={validationErrors.trustedAdult ? t('pilotSurveys:form.requiredField') : null}
        fieldName="trustedAdult"
      />
      
      <RadioGroup
        label={t('formB:section2.identityStress.label')}
        value={formData.identityStress}
        onChange={(val) => onFieldChange('identityStress', val)}
        options={[
          { value: 'yes', label: t('formB:section2.identityStress.yes') },
          { value: 'sometimes', label: t('formB:section2.identityStress.sometimes') },
          { value: 'no', label: t('formB:section2.identityStress.no') },
          { value: 'unsure', label: t('formB:section2.identityStress.unsure') },
        ]}
        required
        error={validationErrors.identityStress ? t('pilotSurveys:form.requiredField') : null}
        fieldName="identityStress"
      />
    </Section>
  );

  // Section 3: Academic Progress & Learning Profile
  const renderSection3 = () => (
    <Section title={t('formB:section3.title')}>
      <RadioGroup
        label={t('formB:section3.overallProgress.label')}
        value={formData.overallProgress}
        onChange={(val) => onFieldChange('overallProgress', val)}
        options={[
          { value: 'exceeds', label: t('formB:section3.overallProgress.exceeds') },
          { value: 'expected', label: t('formB:section3.overallProgress.expected') },
          { value: 'progressing', label: t('formB:section3.overallProgress.progressing') },
          { value: 'requires', label: t('formB:section3.overallProgress.requires') },
        ]}
        required
        error={validationErrors.overallProgress ? t('pilotSurveys:form.requiredField') : null}
        fieldName="overallProgress"
      />
      
      <CheckboxGroup
        label={t('formB:section3.strengths.label')}
        values={formData.strengths || []}
        onChange={(val) => onFieldChange('strengths', val)}
        options={[
          { value: 'oral', label: t('formB:section3.strengths.oral') },
          { value: 'reading', label: t('formB:section3.strengths.reading') },
          { value: 'writing', label: t('formB:section3.strengths.writing') },
          { value: 'numeracy', label: t('formB:section3.strengths.numeracy') },
          { value: 'scientific', label: t('formB:section3.strengths.scientific') },
          { value: 'artistic', label: t('formB:section3.strengths.artistic') },
          { value: 'physical', label: t('formB:section3.strengths.physical') },
          { value: 'leadership', label: t('formB:section3.strengths.leadership') },
          { value: 'technology', label: t('formB:section3.strengths.technology') },
          { value: 'other', label: t('formB:section3.strengths.other') },
        ]}
        required
        error={validationErrors.strengths ? t('pilotSurveys:form.requiredField') : null}
        fieldName="strengths"
      />
      
      {formData.strengths?.includes('other') && (
        <TextInput
          label={t('formB:section3.strengths.otherPlaceholder')}
          value={formData.strengthsOther}
          onChange={(val) => onFieldChange('strengthsOther', val)}
          placeholder={t('formB:section3.strengths.otherPlaceholder')}
          fieldName="strengthsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section3.supportAreas.label')}
        values={formData.supportAreas || []}
        onChange={(val) => onFieldChange('supportAreas', val)}
        options={[
          { value: 'language', label: t('formB:section3.supportAreas.language') },
          { value: 'numeracy', label: t('formB:section3.supportAreas.numeracy') },
          { value: 'scientific', label: t('formB:section3.supportAreas.scientific') },
          { value: 'attention', label: t('formB:section3.supportAreas.attention') },
          { value: 'taskCompletion', label: t('formB:section3.supportAreas.taskCompletion') },
          { value: 'social', label: t('formB:section3.supportAreas.social') },
          { value: 'instructions', label: t('formB:section3.supportAreas.instructions') },
          { value: 'other', label: t('formB:section3.supportAreas.other') },
        ]}
        required
        error={validationErrors.supportAreas ? t('pilotSurveys:form.requiredField') : null}
        fieldName="supportAreas"
      />
      
      {formData.supportAreas?.includes('other') && (
        <TextInput
          label={t('formB:section3.supportAreas.otherPlaceholder')}
          value={formData.supportAreasOther}
          onChange={(val) => onFieldChange('supportAreasOther', val)}
          placeholder={t('formB:section3.supportAreas.otherPlaceholder')}
          fieldName="supportAreasOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section3.learningStyle.label')}
        values={formData.learningStyle || []}
        onChange={(val) => onFieldChange('learningStyle', val)}
        options={[
          { value: 'visual', label: t('formB:section3.learningStyle.visual') },
          { value: 'kinesthetic', label: t('formB:section3.learningStyle.kinesthetic') },
          { value: 'auditory', label: t('formB:section3.learningStyle.auditory') },
          { value: 'smallGroup', label: t('formB:section3.learningStyle.smallGroup') },
          { value: 'structured', label: t('formB:section3.learningStyle.structured') },
          { value: 'creative', label: t('formB:section3.learningStyle.creative') },
          { value: 'other', label: t('formB:section3.learningStyle.other') },
        ]}
        required
        error={validationErrors.learningStyle ? t('pilotSurveys:form.requiredField') : null}
        fieldName="learningStyle"
      />
      
      {formData.learningStyle?.includes('other') && (
        <TextInput
          label={t('formB:section3.learningStyle.otherPlaceholder')}
          value={formData.learningStyleOther}
          onChange={(val) => onFieldChange('learningStyleOther', val)}
          placeholder={t('formB:section3.learningStyle.otherPlaceholder')}
          fieldName="learningStyleOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section3.taskApproach.label')}
        values={formData.taskApproach || []}
        onChange={(val) => onFieldChange('taskApproach', val)}
        options={[
          { value: 'independent', label: t('formB:section3.taskApproach.independent') },
          { value: 'participates', label: t('formB:section3.taskApproach.participates') },
          { value: 'needs', label: t('formB:section3.taskApproach.needs') },
          { value: 'avoids', label: t('formB:section3.taskApproach.avoids') },
        ]}
        required
        error={validationErrors.taskApproach ? t('pilotSurveys:form.requiredField') : null}
        fieldName="taskApproach"
      />
      
      <CheckboxGroup
        label={t('formB:section3.executiveFunction.label')}
        values={formData.executiveFunction || []}
        onChange={(val) => onFieldChange('executiveFunction', val)}
        options={[
          { value: 'initiation', label: t('formB:section3.executiveFunction.initiation') },
          { value: 'switching', label: t('formB:section3.executiveFunction.switching') },
          { value: 'time', label: t('formB:section3.executiveFunction.time') },
          { value: 'memory', label: t('formB:section3.executiveFunction.memory') },
          { value: 'organization', label: t('formB:section3.executiveFunction.organization') },
          { value: 'monitoring', label: t('formB:section3.executiveFunction.monitoring') },
        ]}
        required
        error={validationErrors.executiveFunction ? t('pilotSurveys:form.requiredField') : null}
        fieldName="executiveFunction"
      />
      
      <RadioGroup
        label={t('formB:section3.progressOverTime.label')}
        value={formData.progressOverTime}
        onChange={(val) => onFieldChange('progressOverTime', val)}
        options={[
          { value: 'noticeable', label: t('formB:section3.progressOverTime.noticeable') },
          { value: 'slow', label: t('formB:section3.progressOverTime.slow') },
          { value: 'noChange', label: t('formB:section3.progressOverTime.noChange') },
          { value: 'regressive', label: t('formB:section3.progressOverTime.regressive') },
        ]}
        required
        error={validationErrors.progressOverTime ? t('pilotSurveys:form.requiredField') : null}
        fieldName="progressOverTime"
      />
      
      <RadioGroup
        label={t('formB:section3.gaps.label')}
        value={formData.gaps}
        onChange={(val) => onFieldChange('gaps', val)}
        options={[
          { value: 'major', label: t('formB:section3.gaps.major') },
          { value: 'short', label: t('formB:section3.gaps.short') },
          { value: 'no', label: t('formB:section3.gaps.no') },
          { value: 'unknown', label: t('formB:section3.gaps.unknown') },
        ]}
        required
        error={validationErrors.gaps ? t('pilotSurveys:form.requiredField') : null}
        fieldName="gaps"
      />
      
      <RadioGroup
        label={t('formB:section3.extendedTasks.label')}
        value={formData.extendedTasks}
        onChange={(val) => onFieldChange('extendedTasks', val)}
        options={[
          { value: 'breaks', label: t('formB:section3.extendedTasks.breaks') },
          { value: 'needs', label: t('formB:section3.extendedTasks.needs') },
          { value: 'overwhelmed', label: t('formB:section3.extendedTasks.overwhelmed') },
          { value: 'unsure', label: t('formB:section3.extendedTasks.unsure') },
        ]}
        required
        error={validationErrors.extendedTasks ? t('pilotSurveys:form.requiredField') : null}
        fieldName="extendedTasks"
      />
      
      <RadioGroup
        label={t('formB:section3.metacognitive.label')}
        value={formData.metacognitive}
        onChange={(val) => onFieldChange('metacognitive', val)}
        options={[
          { value: 'yes', label: t('formB:section3.metacognitive.yes') },
          { value: 'sometimes', label: t('formB:section3.metacognitive.sometimes') },
          { value: 'rarely', label: t('formB:section3.metacognitive.rarely') },
          { value: 'unsure', label: t('formB:section3.metacognitive.unsure') },
        ]}
        required
        error={validationErrors.metacognitive ? t('pilotSurveys:form.requiredField') : null}
        fieldName="metacognitive"
      />
    </Section>
  );

  // Section 4: Student Motivation & Future Orientation
  const renderSection4 = () => (
    <Section title={t('formB:section4.title')}>
      <CheckboxGroup
        label={t('formB:section4.enrollmentReasons.label')}
        values={formData.enrollmentReasons || []}
        onChange={(val) => onFieldChange('enrollmentReasons', val)}
        options={[
          { value: 'flexible', label: t('formB:section4.enrollmentReasons.flexible') },
          { value: 'difficulty', label: t('formB:section4.enrollmentReasons.difficulty') },
          { value: 'targeted', label: t('formB:section4.enrollmentReasons.targeted') },
          { value: 'handson', label: t('formB:section4.enrollmentReasons.handson') },
          { value: 'safer', label: t('formB:section4.enrollmentReasons.safer') },
          { value: 'other', label: t('formB:section4.enrollmentReasons.other') },
        ]}
        required
        error={validationErrors.enrollmentReasons ? t('pilotSurveys:form.requiredField') : null}
        fieldName="enrollmentReasons"
      />
      
      {formData.enrollmentReasons?.includes('other') && (
        <TextInput
          label={t('formB:section4.enrollmentReasons.otherPlaceholder')}
          value={formData.enrollmentReasonsOther}
          onChange={(val) => onFieldChange('enrollmentReasonsOther', val)}
          placeholder={t('formB:section4.enrollmentReasons.otherPlaceholder')}
          fieldName="enrollmentReasonsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section4.goals.label')}
        values={formData.goals || []}
        onChange={(val) => onFieldChange('goals', val)}
        options={[
          { value: 'university', label: t('formB:section4.goals.university') },
          { value: 'career', label: t('formB:section4.goals.career') },
          { value: 'creative', label: t('formB:section4.goals.creative') },
          { value: 'life', label: t('formB:section4.goals.life') },
          { value: 'exploring', label: t('formB:section4.goals.exploring') },
          { value: 'other', label: t('formB:section4.goals.other') },
        ]}
        required
        error={validationErrors.goals ? t('pilotSurveys:form.requiredField') : null}
        fieldName="goals"
      />
      
      {formData.goals?.includes('other') && (
        <TextInput
          label={t('formB:section4.goals.otherPlaceholder')}
          value={formData.goalsOther}
          onChange={(val) => onFieldChange('goalsOther', val)}
          placeholder={t('formB:section4.goals.otherPlaceholder')}
          fieldName="goalsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <TextArea
        label={t('formB:section4.passion.label')}
        value={formData.passion}
        onChange={(val) => onFieldChange('passion', val)}
        placeholder={t('formB:section4.passion.placeholder')}
        rows={3}
        required
        error={validationErrors.passion ? t('pilotSurveys:form.requiredField') : null}
        fieldName="passion"
      />
      
      <RadioGroup
        label={t('formB:section4.futureReaction.label')}
        value={formData.futureReaction}
        onChange={(val) => onFieldChange('futureReaction', val)}
        options={[
          { value: 'engaged', label: t('formB:section4.futureReaction.engaged') },
          { value: 'curious', label: t('formB:section4.futureReaction.curious') },
          { value: 'avoidant', label: t('formB:section4.futureReaction.avoidant') },
          { value: 'anxious', label: t('formB:section4.futureReaction.anxious') },
        ]}
        required
        error={validationErrors.futureReaction ? t('pilotSurveys:form.requiredField') : null}
        fieldName="futureReaction"
      />
      
      <RadioGroup
        label={t('formB:section4.selfDoubt.label')}
        value={formData.selfDoubt}
        onChange={(val) => onFieldChange('selfDoubt', val)}
        options={[
          { value: 'frequently', label: t('formB:section4.selfDoubt.frequently') },
          { value: 'occasionally', label: t('formB:section4.selfDoubt.occasionally') },
          { value: 'rarely', label: t('formB:section4.selfDoubt.rarely') },
          { value: 'not', label: t('formB:section4.selfDoubt.not') },
        ]}
        required
        error={validationErrors.selfDoubt ? t('pilotSurveys:form.requiredField') : null}
        fieldName="selfDoubt"
      />
      
      <CheckboxGroup
        label={t('formB:section4.barriers.label')}
        values={formData.barriers || []}
        onChange={(val) => onFieldChange('barriers', val)}
        options={[
          { value: 'confidence', label: t('formB:section4.barriers.confidence') },
          { value: 'emotional', label: t('formB:section4.barriers.emotional') },
          { value: 'external', label: t('formB:section4.barriers.external') },
          { value: 'peer', label: t('formB:section4.barriers.peer') },
          { value: 'structure', label: t('formB:section4.barriers.structure') },
          { value: 'none', label: t('formB:section4.barriers.none') },
        ]}
        required
        error={validationErrors.barriers ? t('pilotSurveys:form.requiredField') : null}
        fieldName="barriers"
      />
    </Section>
  );

  // Section 5: Social & Emotional Development
  const renderSection5 = () => (
    <Section title={t('formB:section5.title')}>
      <RadioGroup
        label={t('formB:section5.interaction.label')}
        value={formData.interaction}
        onChange={(val) => onFieldChange('interaction', val)}
        options={[
          { value: 'highly', label: t('formB:section5.interaction.highly') },
          { value: 'capable', label: t('formB:section5.interaction.capable') },
          { value: 'difficulty', label: t('formB:section5.interaction.difficulty') },
          { value: 'withdrawn', label: t('formB:section5.interaction.withdrawn') },
        ]}
        required
        error={validationErrors.interaction ? t('pilotSurveys:form.requiredField') : null}
        fieldName="interaction"
      />
      
      <RadioGroup
        label={t('formB:section5.feedback.label')}
        value={formData.feedbackResponse}
        onChange={(val) => onFieldChange('feedbackResponse', val)}
        options={[
          { value: 'accepts', label: t('formB:section5.feedback.accepts') },
          { value: 'resistant', label: t('formB:section5.feedback.resistant') },
          { value: 'frustrated', label: t('formB:section5.feedback.frustrated') },
          { value: 'avoids', label: t('formB:section5.feedback.avoids') },
        ]}
        required
        error={validationErrors.feedbackResponse ? t('pilotSurveys:form.requiredField') : null}
        fieldName="feedbackResponse"
      />
      
      <CheckboxGroup
        label={t('formB:section5.emotionalRegulation.label')}
        values={formData.emotionalRegulation || []}
        onChange={(val) => onFieldChange('emotionalRegulation', val)}
        options={[
          { value: 'manages', label: t('formB:section5.emotionalRegulation.manages') },
          { value: 'most', label: t('formB:section5.emotionalRegulation.most') },
          { value: 'often', label: t('formB:section5.emotionalRegulation.often') },
          { value: 'difficulty', label: t('formB:section5.emotionalRegulation.difficulty') },
        ]}
        required
        error={validationErrors.emotionalRegulation ? t('pilotSurveys:form.requiredField') : null}
        fieldName="emotionalRegulation"
      />
      
      <CheckboxGroup
        label={t('formB:section5.behavioral.label')}
        values={formData.behavioral || []}
        onChange={(val) => onFieldChange('behavioral', val)}
        options={[
          { value: 'cooperative', label: t('formB:section5.behavioral.cooperative') },
          { value: 'distracted', label: t('formB:section5.behavioral.distracted') },
          { value: 'defiance', label: t('formB:section5.behavioral.defiance') },
          { value: 'withdrawn', label: t('formB:section5.behavioral.withdrawn') },
          { value: 'aggressive', label: t('formB:section5.behavioral.aggressive') },
          { value: 'none', label: t('formB:section5.behavioral.none') },
          { value: 'other', label: t('formB:section5.behavioral.other') },
        ]}
        required
        error={validationErrors.behavioral ? t('pilotSurveys:form.requiredField') : null}
        fieldName="behavioral"
      />
      
      {formData.behavioral?.includes('other') && (
        <TextInput
          label={t('formB:section5.behavioral.otherPlaceholder')}
          value={formData.behavioralOther}
          onChange={(val) => onFieldChange('behavioralOther', val)}
          placeholder={t('formB:section5.behavioral.otherPlaceholder')}
          fieldName="behavioralOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section5.selfRegulate.label')}
        values={formData.selfRegulate || []}
        onChange={(val) => onFieldChange('selfRegulate', val)}
        options={[
          { value: 'breathing', label: t('formB:section5.selfRegulate.breathing') },
          { value: 'leaving', label: t('formB:section5.selfRegulate.leaving') },
          { value: 'sensory', label: t('formB:section5.selfRegulate.sensory') },
          { value: 'talking', label: t('formB:section5.selfRegulate.talking') },
          { value: 'drawing', label: t('formB:section5.selfRegulate.drawing') },
          { value: 'none', label: t('formB:section5.selfRegulate.none') },
          { value: 'other', label: t('formB:section5.selfRegulate.other') },
        ]}
        required
        error={validationErrors.selfRegulate ? t('pilotSurveys:form.requiredField') : null}
        fieldName="selfRegulate"
      />
      
      {formData.selfRegulate?.includes('other') && (
        <TextInput
          label={t('formB:section5.selfRegulate.otherPlaceholder')}
          value={formData.selfRegulateOther}
          onChange={(val) => onFieldChange('selfRegulateOther', val)}
          placeholder={t('formB:section5.selfRegulate.otherPlaceholder')}
          fieldName="selfRegulateOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section5.triggers.label')}
        values={formData.triggers || []}
        onChange={(val) => onFieldChange('triggers', val)}
        options={[
          { value: 'loud', label: t('formB:section5.triggers.loud') },
          { value: 'peer', label: t('formB:section5.triggers.peer') },
          { value: 'transitions', label: t('formB:section5.triggers.transitions') },
          { value: 'corrected', label: t('formB:section5.triggers.corrected') },
          { value: 'academic', label: t('formB:section5.triggers.academic') },
          { value: 'unclear', label: t('formB:section5.triggers.unclear') },
          { value: 'none', label: t('formB:section5.triggers.none') },
        ]}
        required
        error={validationErrors.triggers ? t('pilotSurveys:form.requiredField') : null}
        fieldName="triggers"
      />
      
      <RadioGroup
        label={t('formB:section5.empathy.label')}
        value={formData.empathy}
        onChange={(val) => onFieldChange('empathy', val)}
        options={[
          { value: 'yes', label: t('formB:section5.empathy.yes') },
          { value: 'occasionally', label: t('formB:section5.empathy.occasionally') },
          { value: 'rarely', label: t('formB:section5.empathy.rarely') },
          { value: 'not', label: t('formB:section5.empathy.not') },
        ]}
        required
        error={validationErrors.empathy ? t('pilotSurveys:form.requiredField') : null}
        fieldName="empathy"
      />
    </Section>
  );

  // Section 6: Support Needs & Recommendations
  const renderSection6 = () => (
    <Section title={t('formB:section6.title')}>
      <CheckboxGroup
        label={t('formB:section6.currentSupport.label')}
        values={formData.currentSupport || []}
        onChange={(val) => onFieldChange('currentSupport', val)}
        options={[
          { value: 'individual', label: t('formB:section6.currentSupport.individual') },
          { value: 'oneOnOne', label: t('formB:section6.currentSupport.oneOnOne') },
          { value: 'emotional', label: t('formB:section6.currentSupport.emotional') },
          { value: 'behavior', label: t('formB:section6.currentSupport.behavior') },
          { value: 'peer', label: t('formB:section6.currentSupport.peer') },
          { value: 'none', label: t('formB:section6.currentSupport.none') },
          { value: 'other', label: t('formB:section6.currentSupport.other') },
        ]}
        required
        error={validationErrors.currentSupport ? t('pilotSurveys:form.requiredField') : null}
        fieldName="currentSupport"
      />
      
      {formData.currentSupport?.includes('other') && (
        <TextInput
          label={t('formB:section6.currentSupport.otherPlaceholder')}
          value={formData.currentSupportOther}
          onChange={(val) => onFieldChange('currentSupportOther', val)}
          placeholder={t('formB:section6.currentSupport.otherPlaceholder')}
          fieldName="currentSupportOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section6.effectiveMethods.label')}
        values={formData.effectiveMethods || []}
        onChange={(val) => onFieldChange('effectiveMethods', val)}
        options={[
          { value: 'clear', label: t('formB:section6.effectiveMethods.clear') },
          { value: 'personalized', label: t('formB:section6.effectiveMethods.personalized') },
          { value: 'handson', label: t('formB:section6.effectiveMethods.handson') },
          { value: 'breaks', label: t('formB:section6.effectiveMethods.breaks') },
          { value: 'positive', label: t('formB:section6.effectiveMethods.positive') },
          { value: 'visual', label: t('formB:section6.effectiveMethods.visual') },
          { value: 'collaboration', label: t('formB:section6.effectiveMethods.collaboration') },
          { value: 'other', label: t('formB:section6.effectiveMethods.other') },
        ]}
        required
        error={validationErrors.effectiveMethods ? t('pilotSurveys:form.requiredField') : null}
        fieldName="effectiveMethods"
      />
      
      {formData.effectiveMethods?.includes('other') && (
        <TextInput
          label={t('formB:section6.effectiveMethods.otherPlaceholder')}
          value={formData.effectiveMethodsOther}
          onChange={(val) => onFieldChange('effectiveMethodsOther', val)}
          placeholder={t('formB:section6.effectiveMethods.otherPlaceholder')}
          fieldName="effectiveMethodsOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <CheckboxGroup
        label={t('formB:section6.additionalSupport.label')}
        values={formData.additionalSupport || []}
        onChange={(val) => onFieldChange('additionalSupport', val)}
        options={[
          { value: 'academic', label: t('formB:section6.additionalSupport.academic') },
          { value: 'socialEmotional', label: t('formB:section6.additionalSupport.socialEmotional') },
          { value: 'mentorship', label: t('formB:section6.additionalSupport.mentorship') },
          { value: 'counseling', label: t('formB:section6.additionalSupport.counseling') },
          { value: 'peerLed', label: t('formB:section6.additionalSupport.peerLed') },
          { value: 'other', label: t('formB:section6.additionalSupport.other') },
        ]}
        required
        error={validationErrors.additionalSupport ? t('pilotSurveys:form.requiredField') : null}
        fieldName="additionalSupport"
      />
      
      {formData.additionalSupport?.includes('other') && (
        <TextInput
          label={t('formB:section6.additionalSupport.otherPlaceholder')}
          value={formData.additionalSupportOther}
          onChange={(val) => onFieldChange('additionalSupportOther', val)}
          placeholder={t('formB:section6.additionalSupport.otherPlaceholder')}
          fieldName="additionalSupportOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <TextArea
        label={t('formB:section6.goals.label')}
        value={formData.recommendedGoals}
        onChange={(val) => onFieldChange('recommendedGoals', val)}
        placeholder={t('formB:section6.goals.placeholder')}
        rows={4}
        required
        error={validationErrors.recommendedGoals ? t('pilotSurveys:form.requiredField') : null}
        fieldName="recommendedGoals"
      />
      
      <RadioGroup
        label={t('formB:section6.timeOfDay.label')}
        value={formData.timeOfDay}
        onChange={(val) => onFieldChange('timeOfDay', val)}
        options={[
          { value: 'morning', label: t('formB:section6.timeOfDay.morning') },
          { value: 'midday', label: t('formB:section6.timeOfDay.midday') },
          { value: 'afternoon', label: t('formB:section6.timeOfDay.afternoon') },
          { value: 'varies', label: t('formB:section6.timeOfDay.varies') },
        ]}
        required
        error={validationErrors.timeOfDay ? t('pilotSurveys:form.requiredField') : null}
        fieldName="timeOfDay"
      />
      
      <RadioGroup
        label={t('formB:section6.visualAids.label')}
        value={formData.visualAids}
        onChange={(val) => onFieldChange('visualAids', val)}
        options={[
          { value: 'consistently', label: t('formB:section6.visualAids.consistently') },
          { value: 'reminders', label: t('formB:section6.visualAids.reminders') },
          { value: 'resists', label: t('formB:section6.visualAids.resists') },
          { value: 'notYet', label: t('formB:section6.visualAids.notYet') },
        ]}
        required
        error={validationErrors.visualAids ? t('pilotSurveys:form.requiredField') : null}
        fieldName="visualAids"
      />
      
      <RadioGroup
        label={t('formB:section6.familyResponsive.label')}
        value={formData.familyResponsive}
        onChange={(val) => onFieldChange('familyResponsive', val)}
        options={[
          { value: 'highly', label: t('formB:section6.familyResponsive.highly') },
          { value: 'somewhat', label: t('formB:section6.familyResponsive.somewhat') },
          { value: 'rarely', label: t('formB:section6.familyResponsive.rarely') },
          { value: 'barrier', label: t('formB:section6.familyResponsive.barrier') },
          { value: 'unknown', label: t('formB:section6.familyResponsive.unknown') },
        ]}
        required
        error={validationErrors.familyResponsive ? t('pilotSurveys:form.requiredField') : null}
        fieldName="familyResponsive"
      />
      
      <TextArea
        label={t('formB:section6.environmentalChanges.label')}
        value={formData.environmentalChanges}
        onChange={(val) => onFieldChange('environmentalChanges', val)}
        placeholder={t('formB:section6.environmentalChanges.placeholder')}
        rows={4}
        required
        error={validationErrors.environmentalChanges ? t('pilotSurveys:form.requiredField') : null}
        fieldName="environmentalChanges"
      />
    </Section>
  );

  // Section 7: AI Usage
  const renderSection7 = () => (
    <Section title={t('formB:section7.title')}>
      <RadioGroup
        label={t('formB:section7.studentAiUsage.label')}
        value={formData.studentAiUsage}
        onChange={(val) => onFieldChange('studentAiUsage', val)}
        options={[
          { value: 'never', label: t('formB:section7.studentAiUsage.never') },
          { value: 'rarely', label: t('formB:section7.studentAiUsage.rarely') },
          { value: 'occasionally', label: t('formB:section7.studentAiUsage.occasionally') },
          { value: 'frequently', label: t('formB:section7.studentAiUsage.frequently') },
          { value: 'dontKnow', label: t('formB:section7.studentAiUsage.dontKnow') },
        ]}
        required
        error={validationErrors.studentAiUsage ? t('pilotSurveys:form.requiredField') : null}
        fieldName="studentAiUsage"
      />
      
      <CheckboxGroup
        label={t('formB:section7.studentAiActivities.label')}
        values={formData.studentAiActivities || []}
        onChange={(val) => onFieldChange('studentAiActivities', val)}
        options={[
          { value: 'brainstorming', label: t('formB:section7.studentAiActivities.brainstorming') },
          { value: 'drafting', label: t('formB:section7.studentAiActivities.drafting') },
          { value: 'solving', label: t('formB:section7.studentAiActivities.solving') },
          { value: 'language', label: t('formB:section7.studentAiActivities.language') },
          { value: 'notes', label: t('formB:section7.studentAiActivities.notes') },
          { value: 'other', label: t('formB:section7.studentAiActivities.other') },
        ]}
        required
        error={validationErrors.studentAiActivities ? t('pilotSurveys:form.requiredField') : null}
        fieldName="studentAiActivities"
      />
      
      {formData.studentAiActivities?.includes('other') && (
        <TextInput
          label={t('formB:section7.studentAiActivities.otherPlaceholder')}
          value={formData.studentAiActivitiesOther}
          onChange={(val) => onFieldChange('studentAiActivitiesOther', val)}
          placeholder={t('formB:section7.studentAiActivities.otherPlaceholder')}
          fieldName="studentAiActivitiesOther"
          containerClassName="!p-0 !pl-4 !pr-4 !-mt-4"
        />
      )}
      
      <TextArea
        label={t('formB:section7.futureAiSupport.label')}
        value={formData.futureAiSupport}
        onChange={(val) => onFieldChange('futureAiSupport', val)}
        placeholder={t('formB:section7.futureAiSupport.placeholder')}
        rows={4}
        required
        error={validationErrors.futureAiSupport ? t('pilotSurveys:form.requiredField') : null}
        fieldName="futureAiSupport"
      />
    </Section>
  );

  // Section 8: Additional Comments
  const renderSection8 = () => (
    <Section title={t('formB:section8.title')}>
      <TextArea
        label={t('formB:section8.observations.label')}
        value={formData.additionalObservations}
        onChange={(val) => onFieldChange('additionalObservations', val)}
        placeholder={t('formB:section8.observations.placeholder')}
        rows={5}
        required
        error={validationErrors.additionalObservations ? t('pilotSurveys:form.requiredField') : null}
        fieldName="additionalObservations"
      />
      
      <TextArea
        label={t('formB:section8.suggestions.label')}
        value={formData.suggestions}
        onChange={(val) => onFieldChange('suggestions', val)}
        placeholder={t('formB:section8.suggestions.placeholder')}
        rows={5}
        required
        error={validationErrors.suggestions ? t('pilotSurveys:form.requiredField') : null}
        fieldName="suggestions"
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
    renderSection7,
    renderSection8,
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

export default FormBBehaviorAssessment;
