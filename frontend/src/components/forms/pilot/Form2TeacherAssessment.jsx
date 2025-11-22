import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from './shared/QuestionTypes/TextInput';
import TextArea from './shared/QuestionTypes/TextArea';
import RadioGroup from './shared/QuestionTypes/RadioGroup';
import CheckboxGroup from './shared/QuestionTypes/CheckboxGroup';
import DateInput from './shared/QuestionTypes/DateInput';
import { countries } from '../../../utils/countries';

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
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countryCodeQuery = (formData.countryCode || '').replace(/^\+/, '').trim();
  const filteredCountryList = countryCodeQuery
    ? countries.filter((c) =>
        c.dialCode.startsWith(countryCodeQuery) ||
        c.name.toLowerCase().includes(countryCodeQuery.toLowerCase())
      )
    : countries;

  // Section 0: Introduction and Consent
  const renderSection0 = () => (
    <Section title="">
      <div className="space-y-6">
        <div className="bg-[#7c59b2]/5 border border-[#7c59b2]/100 rounded-3xl p-6">
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

        <div className="mt-6">
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
            alignStart={true}
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
      
      <div className={`space-y-1 p-4 rounded-lg transition-all duration-300 ${validationErrors.phone ? '!bg-red-50/50' : 'border-2 border-transparent'}`}>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {t('form2:section1.phone.label')}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <div className={`flex items-center w-full rounded-lg border bg-transparent px-3 py-3 text-sm ${validationErrors.phone ? '!border-red-400 !bg-white !ring-1 !ring-red-200' : 'border-gray-300'}`}>
            <div className="relative flex items-center">
              <input
                name="countryCode"
                value={formData.countryCode || '+86'}
                onChange={(e) => onFieldChange('countryCode', e.target.value)}
                onFocus={() => setIsCountryDropdownOpen(true)}
                className="w-[50px] bg-transparent outline-none font-medium text-gray-900 text-center"
              />
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="h-5 w-px bg-gray-200 mx-2" />
            <input
              name="phone"
              value={formData.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder={t('form2:section1.phone.placeholder')}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            />
          </div>

          {isCountryDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsCountryDropdownOpen(false)} />
              <div className="absolute bottom-full left-0 mb-2 w-[320px] max-h-[240px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-20">
                {filteredCountryList.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      onFieldChange('countryCode', `+${c.dialCode}`);
                      setIsCountryDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between group"
                  >
                    <span className="text-gray-900">{c.name}</span>
                    <span className="text-gray-500 group-hover:text-[#7c59b2] font-medium">+{c.dialCode}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {validationErrors.phone && (
          <div className="flex items-center gap-1 mt-1 p-1">
            <span className="text-red-600 text-sm">⚠️</span>
            <p className="text-sm text-red-600 font-medium">{t('pilotSurveys:form.requiredField')}</p>
          </div>
        )}
      </div>
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.roleOther}
                onChange={(val) => onFieldChange('roleOther', val)}
                placeholder={t('form2:section2.role.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.roleOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
        label={t('form2:section2.ageGroups.label').replace(' (Specify)', '')}
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.ageGroupsOther}
                onChange={(val) => onFieldChange('ageGroupsOther', val)}
                placeholder={t('form2:section2.ageGroups.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.ageGroupsOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
      <CheckboxGroup
        label={t('form2:section2.schedule.label').replace(' (Specify)', '')}
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.scheduleOther}
                onChange={(val) => onFieldChange('scheduleOther', val)}
                placeholder={t('form2:section2.schedule.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.scheduleOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.educationOther}
                onChange={(val) => onFieldChange('educationOther', val)}
                placeholder={t('form2:section3.education.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.educationOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.certificationsOther}
                onChange={(val) => onFieldChange('certificationsOther', val)}
                placeholder={t('form2:section3.certifications.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.certificationsOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.subjectsOther}
                onChange={(val) => onFieldChange('subjectsOther', val)}
                placeholder={t('form2:section4.subjects.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.subjectsOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.approachOther}
                onChange={(val) => onFieldChange('approachOther', val)}
                placeholder={t('form2:section4.approach.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.approachOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.assessmentOther}
                onChange={(val) => onFieldChange('assessmentOther', val)}
                placeholder={t('form2:section4.assessment.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.assessmentOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.strategiesOther}
                onChange={(val) => onFieldChange('strategiesOther', val)}
                placeholder={t('form2:section4.strategies.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.strategiesOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.aiTasksOther}
                onChange={(val) => onFieldChange('aiTasksOther', val)}
                placeholder={t('form2:section5.tasks.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.aiTasksOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.aiChallengesOther}
                onChange={(val) => onFieldChange('aiChallengesOther', val)}
                placeholder={t('form2:section5.challenges.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.aiChallengesOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
        renderInline={(value) => {
          if (value === 'other') {
            return (
              <TextInput
                label={null}
                value={formData.digitalToolsOther}
                onChange={(val) => onFieldChange('digitalToolsOther', val)}
                placeholder={t('form2:section5.digitalTools.otherPlaceholder')}
                containerClassName="!p-0 !border-0 -mt-2"
                required
                error={validationErrors.digitalToolsOther ? t('pilotSurveys:form.requiredField') : null}
              />
            );
          }
        }}
      />
      
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
    <>
      <Progress
        currentSection={currentSection}
        totalSections={totalSections}
        completedSections={completedSections}
      />
      <div className="pb-5 flex-grow">
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
        isTransparent={currentSection === 1 || currentSection === 2}
      />
    </>
  );
};

export default Form2TeacherAssessment;
