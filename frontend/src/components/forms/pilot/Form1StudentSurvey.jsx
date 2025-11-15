import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from './shared/QuestionTypes/TextInput';
import TextArea from './shared/QuestionTypes/TextArea';
import RadioGroup from './shared/QuestionTypes/RadioGroup';
import CheckboxGroup from './shared/QuestionTypes/CheckboxGroup';
import DateInput from './shared/QuestionTypes/DateInput';

const Form1StudentSurvey = ({
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

  const renderSection1 = () => (
    <Section title={t('form1:section1.title')}>
      <TextInput
        label={t('form1:section1.fullName.label')}
        value={formData.fullName}
        onChange={(val) => onFieldChange('fullName', val)}
        placeholder={t('form1:section1.fullName.placeholder')}
        required
      />
      <DateInput
        label={t('form1:section1.dateOfBirth.label')}
        value={formData.dateOfBirth}
        onChange={(val) => onFieldChange('dateOfBirth', val)}
        placeholder={t('form1:section1.dateOfBirth.placeholder')}
        required
      />
      <RadioGroup
        label={t('form1:section1.gender.label')}
        value={formData.gender}
        onChange={(val) => onFieldChange('gender', val)}
        options={[
          { value: 'male', label: t('form1:section1.gender.male') },
          { value: 'female', label: t('form1:section1.gender.female') },
        ]}
        required
      />
      <CheckboxGroup
        label={t('form1:section1.languages.label')}
        values={formData.languages || []}
        onChange={(val) => onFieldChange('languages', val)}
        options={[
          { value: 'english', label: t('form1:section1.languages.english') },
          { value: 'chinese', label: t('form1:section1.languages.chinese') },
          { value: 'other', label: t('form1:section1.languages.other') },
        ]}
      />
      <TextInput
        label={t('form1:section1.location.label')}
        value={formData.location}
        onChange={(val) => onFieldChange('location', val)}
        placeholder={t('form1:section1.location.placeholder')}
      />
      <TextInput
        label={t('form1:section1.dialects.label')}
        value={formData.dialects}
        onChange={(val) => onFieldChange('dialects', val)}
        placeholder={t('form1:section1.dialects.placeholder')}
      />
      <TextArea
        label={t('form1:section1.identity.label')}
        value={formData.identity}
        onChange={(val) => onFieldChange('identity', val)}
        placeholder={t('form1:section1.identity.placeholder')}
      />
    </Section>
  );

  const renderSection2 = () => (
    <Section title={t('form1:section2.title')}>
      <CheckboxGroup
        label={t('form1:section2.enjoyedSubjects.label')}
        values={formData.enjoyedSubjects || []}
        onChange={(val) => onFieldChange('enjoyedSubjects', val)}
        options={[
          { value: 'science', label: t('form1:section2.enjoyedSubjects.science') },
          { value: 'math', label: t('form1:section2.enjoyedSubjects.math') },
          { value: 'computers', label: t('form1:section2.enjoyedSubjects.computers') },
          { value: 'reading', label: t('form1:section2.enjoyedSubjects.reading') },
          { value: 'art', label: t('form1:section2.enjoyedSubjects.art') },
          { value: 'design', label: t('form1:section2.enjoyedSubjects.design') },
          { value: 'sports', label: t('form1:section2.enjoyedSubjects.sports') },
          { value: 'history', label: t('form1:section2.enjoyedSubjects.history') },
          { value: 'nature', label: t('form1:section2.enjoyedSubjects.nature') },
          { value: 'building', label: t('form1:section2.enjoyedSubjects.building') },
          { value: 'gaming', label: t('form1:section2.enjoyedSubjects.gaming') },
          { value: 'videos', label: t('form1:section2.enjoyedSubjects.videos') },
        ]}
      />
      <TextArea
        label={t('form1:section2.strengths.label')}
        value={formData.strengths}
        onChange={(val) => onFieldChange('strengths', val)}
        placeholder={t('form1:section2.strengths.placeholder')}
      />
      <CheckboxGroup
        label={t('form1:section2.pride.label')}
        values={formData.pride || []}
        onChange={(val) => onFieldChange('pride', val)}
        options={[
          { value: 'finishing', label: t('form1:section2.pride.finishing') },
          { value: 'helping', label: t('form1:section2.pride.helping') },
          { value: 'learning', label: t('form1:section2.pride.learning') },
          { value: 'feedback', label: t('form1:section2.pride.feedback') },
          { value: 'trying', label: t('form1:section2.pride.trying') },
        ]}
      />
      <TextArea
        label={t('form1:section2.difficult.label')}
        value={formData.difficult}
        onChange={(val) => onFieldChange('difficult', val)}
        placeholder={t('form1:section2.difficult.placeholder')}
      />
      <CheckboxGroup
        label={t('form1:section2.future.label')}
        values={formData.future || []}
        onChange={(val) => onFieldChange('future', val)}
        options={[
          { value: 'university', label: t('form1:section2.future.university') },
          { value: 'business', label: t('form1:section2.future.business') },
          { value: 'talent', label: t('form1:section2.future.talent') },
          { value: 'job', label: t('form1:section2.future.job') },
          { value: 'help', label: t('form1:section2.future.help') },
          { value: 'travel', label: t('form1:section2.future.travel') },
          { value: 'unsure', label: t('form1:section2.future.unsure') },
        ]}
      />
      <TextArea
        label={t('form1:section2.inspiration.label')}
        value={formData.inspiration}
        onChange={(val) => onFieldChange('inspiration', val)}
        placeholder={t('form1:section2.inspiration.placeholder')}
      />
      <TextArea
        label={t('form1:section2.learnNew.label')}
        value={formData.learnNew}
        onChange={(val) => onFieldChange('learnNew', val)}
        placeholder={t('form1:section2.learnNew.placeholder')}
      />
    </Section>
  );

  const renderSection3 = () => (
    <Section title={t('form1:section3.title')}>
      <CheckboxGroup
        label={t('form1:section3.learnBest.label')}
        values={formData.learnBest || []}
        onChange={(val) => onFieldChange('learnBest', val)}
        options={[
          { value: 'listening', label: t('form1:section3.learnBest.listening') },
          { value: 'reading', label: t('form1:section3.learnBest.reading') },
          { value: 'videos', label: t('form1:section3.learnBest.videos') },
          { value: 'handson', label: t('form1:section3.learnBest.handson') },
          { value: 'discussions', label: t('form1:section3.learnBest.discussions') },
          { value: 'games', label: t('form1:section3.learnBest.games') },
          { value: 'drawing', label: t('form1:section3.learnBest.drawing') },
          { value: 'independent', label: t('form1:section3.learnBest.independent') },
          { value: 'checklists', label: t('form1:section3.learnBest.checklists') },
        ]}
      />
      <RadioGroup
        label={t('form1:section3.tests.label')}
        value={formData.tests}
        onChange={(val) => onFieldChange('tests', val)}
        options={[
          { value: 'doWell', label: t('form1:section3.tests.doWell') },
          { value: 'nervous', label: t('form1:section3.tests.nervous') },
          { value: 'prefer', label: t('form1:section3.tests.prefer') },
          { value: 'openBook', label: t('form1:section3.tests.openBook') },
        ]}
      />
      <RadioGroup
        label={t('form1:section3.working.label')}
        value={formData.working}
        onChange={(val) => onFieldChange('working', val)}
        options={[
          { value: 'alone', label: t('form1:section3.working.alone') },
          { value: 'groups', label: t('form1:section3.working.groups') },
          { value: 'partner', label: t('form1:section3.working.partner') },
          { value: 'mix', label: t('form1:section3.working.mix') },
        ]}
      />
      <RadioGroup
        label={t('form1:section3.schedule.label')}
        value={formData.schedule}
        onChange={(val) => onFieldChange('schedule', val)}
        options={[
          { value: 'structure', label: t('form1:section3.schedule.structure') },
          { value: 'flexibility', label: t('form1:section3.schedule.flexibility') },
          { value: 'both', label: t('form1:section3.schedule.both') },
        ]}
      />
      <CheckboxGroup
        label={t('form1:section3.focus.label')}
        values={formData.focus || []}
        onChange={(val) => onFieldChange('focus', val)}
        options={[
          { value: 'instructions', label: t('form1:section3.focus.instructions') },
          { value: 'visual', label: t('form1:section3.focus.visual') },
          { value: 'breaks', label: t('form1:section3.focus.breaks') },
          { value: 'moving', label: t('form1:section3.focus.moving') },
          { value: 'quiet', label: t('form1:section3.focus.quiet') },
          { value: 'music', label: t('form1:section3.focus.music') },
          { value: 'fidget', label: t('form1:section3.focus.fidget') },
          { value: 'routines', label: t('form1:section3.focus.routines') },
          { value: 'support', label: t('form1:section3.focus.support') },
        ]}
      />
      <RadioGroup
        label={t('form1:section3.taskPreference.label')}
        value={formData.taskPreference}
        onChange={(val) => onFieldChange('taskPreference', val)}
        options={[
          { value: 'oneThing', label: t('form1:section3.taskPreference.oneThing') },
          { value: 'switching', label: t('form1:section3.taskPreference.switching') },
          { value: 'depends', label: t('form1:section3.taskPreference.depends') },
        ]}
      />
      <CheckboxGroup
        label={t('form1:section3.challenges.label')}
        values={formData.challenges || []}
        onChange={(val) => onFieldChange('challenges', val)}
        options={[
          { value: 'focused', label: t('form1:section3.challenges.focused') },
          { value: 'starting', label: t('form1:section3.challenges.starting') },
          { value: 'finishing', label: t('form1:section3.challenges.finishing') },
          { value: 'understanding', label: t('form1:section3.challenges.understanding') },
          { value: 'reading', label: t('form1:section3.challenges.reading') },
          { value: 'organizing', label: t('form1:section3.challenges.organizing') },
          { value: 'speaking', label: t('form1:section3.challenges.speaking') },
          { value: 'frustration', label: t('form1:section3.challenges.frustration') },
          { value: 'time', label: t('form1:section3.challenges.time') },
        ]}
      />
      <TextArea
        label={t('form1:section3.dislike.label')}
        value={formData.dislike}
        onChange={(val) => onFieldChange('dislike', val)}
        placeholder={t('form1:section3.dislike.placeholder')}
      />
      <CheckboxGroup
        label={t('form1:section3.tools.label')}
        values={formData.tools || []}
        onChange={(val) => onFieldChange('tools', val)}
        options={[
          { value: 'todo', label: t('form1:section3.tools.todo') },
          { value: 'schedules', label: t('form1:section3.tools.schedules') },
          { value: 'timers', label: t('form1:section3.tools.timers') },
          { value: 'steps', label: t('form1:section3.tools.steps') },
          { value: 'workspace', label: t('form1:section3.tools.workspace') },
          { value: 'starting', label: t('form1:section3.tools.starting') },
        ]}
      />
      <TextArea
        label={t('form1:section3.perfectLesson.label')}
        value={formData.perfectLesson}
        onChange={(val) => onFieldChange('perfectLesson', val)}
        placeholder={t('form1:section3.perfectLesson.placeholder')}
      />
    </Section>
  );

  const renderSection4 = () => (
    <Section title={t('form1:section4.title')}>
      <RadioGroup
        label={t('form1:section4.technology.label')}
        value={formData.technology}
        onChange={(val) => onFieldChange('technology', val)}
        options={[
          { value: 'yes', label: t('form1:section4.technology.yes') },
          { value: 'sometimes', label: t('form1:section4.technology.sometimes') },
          { value: 'notReally', label: t('form1:section4.technology.notReally') },
        ]}
      />
      <CheckboxGroup
        label={t('form1:section4.learningTools.label')}
        values={formData.learningTools || []}
        onChange={(val) => onFieldChange('learningTools', val)}
        options={[
          { value: 'laptops', label: t('form1:section4.learningTools.laptops') },
          { value: 'headphones', label: t('form1:section4.learningTools.headphones') },
          { value: 'apps', label: t('form1:section4.learningTools.apps') },
          { value: 'paper', label: t('form1:section4.learningTools.paper') },
          { value: 'kits', label: t('form1:section4.learningTools.kits') },
          { value: 'visual', label: t('form1:section4.learningTools.visual') },
        ]}
      />
      <RadioGroup
        label={t('form1:section4.noisyClassroom.label')}
        value={formData.noisyClassroom}
        onChange={(val) => onFieldChange('noisyClassroom', val)}
        options={[
          { value: 'enjoy', label: t('form1:section4.noisyClassroom.enjoy') },
          { value: 'okay', label: t('form1:section4.noisyClassroom.okay') },
          { value: 'quiet', label: t('form1:section4.noisyClassroom.quiet') },
          { value: 'stressed', label: t('form1:section4.noisyClassroom.stressed') },
        ]}
      />
      <RadioGroup
        label={t('form1:section4.changes.label')}
        value={formData.changes}
        onChange={(val) => onFieldChange('changes', val)}
        options={[
          { value: 'okayChange', label: t('form1:section4.changes.okayChange') },
          { value: 'timeAdjust', label: t('form1:section4.changes.timeAdjust') },
          { value: 'advance', label: t('form1:section4.changes.advance') },
          { value: 'anxious', label: t('form1:section4.changes.anxious') },
        ]}
      />
      <CheckboxGroup
        label={t('form1:section4.bothers.label')}
        values={formData.bothers || []}
        onChange={(val) => onFieldChange('bothers', val)}
        options={[
          { value: 'loud', label: t('form1:section4.bothers.loud') },
          { value: 'background', label: t('form1:section4.bothers.background') },
          { value: 'bright', label: t('form1:section4.bothers.bright') },
          { value: 'smells', label: t('form1:section4.bothers.smells') },
          { value: 'textures', label: t('form1:section4.bothers.textures') },
          { value: 'crowds', label: t('form1:section4.bothers.crowds') },
        ]}
      />
      <TextArea
        label={t('form1:section4.calm.label')}
        value={formData.calm}
        onChange={(val) => onFieldChange('calm', val)}
        placeholder={t('form1:section4.calm.placeholder')}
      />
    </Section>
  );

  const renderSection5 = () => (
    <Section title={t('form1:section5.title')}>
      <RadioGroup
        label={t('form1:section5.frequency.label')}
        value={formData.aiFrequency}
        onChange={(val) => onFieldChange('aiFrequency', val)}
        options={[
          { value: 'never', label: t('form1:section5.frequency.never') },
          { value: 'rarely', label: t('form1:section5.frequency.rarely') },
          { value: 'sometimes', label: t('form1:section5.frequency.sometimes') },
          { value: 'often', label: t('form1:section5.frequency.often') },
          { value: 'daily', label: t('form1:section5.frequency.daily') },
        ]}
      />
      <CheckboxGroup
        label={t('form1:section5.activities.label')}
        values={formData.aiActivities || []}
        onChange={(val) => onFieldChange('aiActivities', val)}
        options={[
          { value: 'schoolwork', label: t('form1:section5.activities.schoolwork') },
          { value: 'writing', label: t('form1:section5.activities.writing') },
          { value: 'art', label: t('form1:section5.activities.art') },
          { value: 'music', label: t('form1:section5.activities.music') },
          { value: 'learning', label: t('form1:section5.activities.learning') },
          { value: 'translation', label: t('form1:section5.activities.translation') },
          { value: 'planning', label: t('form1:section5.activities.planning') },
          { value: 'entertainment', label: t('form1:section5.activities.entertainment') },
          { value: 'social', label: t('form1:section5.activities.social') },
        ]}
      />
      <TextArea
        label={t('form1:section5.enjoyMost.label')}
        value={formData.aiEnjoyMost}
        onChange={(val) => onFieldChange('aiEnjoyMost', val)}
        placeholder={t('form1:section5.enjoyMost.placeholder')}
      />
      <TextArea
        label={t('form1:section5.concerns.label')}
        value={formData.aiConcerns}
        onChange={(val) => onFieldChange('aiConcerns', val)}
        placeholder={t('form1:section5.concerns.placeholder')}
      />
      <TextArea
        label={t('form1:section5.futureSupport.label')}
        value={formData.aiFutureSupport}
        onChange={(val) => onFieldChange('aiFutureSupport', val)}
        placeholder={t('form1:section5.futureSupport.placeholder')}
      />
    </Section>
  );

  const renderSection6 = () => (
    <Section title={t('form1:section6.title')}>
      <CheckboxGroup
        label={t('form1:section6.communicate.label')}
        values={formData.communicate || []}
        onChange={(val) => onFieldChange('communicate', val)}
        options={[
          { value: 'talking', label: t('form1:section6.communicate.talking') },
          { value: 'writing', label: t('form1:section6.communicate.writing') },
          { value: 'pictures', label: t('form1:section6.communicate.pictures') },
          { value: 'gestures', label: t('form1:section6.communicate.gestures') },
          { value: 'time', label: t('form1:section6.communicate.time') },
        ]}
      />
      <RadioGroup
        label={t('form1:section6.workingWith.label')}
        value={formData.workingWith}
        onChange={(val) => onFieldChange('workingWith', val)}
        options={[
          { value: 'groups', label: t('form1:section6.workingWith.groups') },
          { value: 'small', label: t('form1:section6.workingWith.small') },
          { value: 'alone', label: t('form1:section6.workingWith.alone') },
          { value: 'depends', label: t('form1:section6.workingWith.depends') },
        ]}
      />
      <RadioGroup
        label={t('form1:section6.sharing.label')}
        value={formData.sharing}
        onChange={(val) => onFieldChange('sharing', val)}
        options={[
          { value: 'like', label: t('form1:section6.sharing.like') },
          { value: 'nervous', label: t('form1:section6.sharing.nervous') },
          { value: 'writing', label: t('form1:section6.sharing.writing') },
          { value: 'rather', label: t('form1:section6.sharing.rather') },
        ]}
      />
      <CheckboxGroup
        label={t('form1:section6.feelSchool.label')}
        values={formData.feelSchool || []}
        onChange={(val) => onFieldChange('feelSchool', val)}
        options={[
          { value: 'calm', label: t('form1:section6.feelSchool.calm') },
          { value: 'anxious', label: t('form1:section6.feelSchool.anxious') },
          { value: 'curious', label: t('form1:section6.feelSchool.curious') },
          { value: 'bored', label: t('form1:section6.feelSchool.bored') },
          { value: 'overwhelmed', label: t('form1:section6.feelSchool.overwhelmed') },
          { value: 'excited', label: t('form1:section6.feelSchool.excited') },
        ]}
      />
      <RadioGroup
        label={t('form1:section6.sleep.label')}
        value={formData.sleep}
        onChange={(val) => onFieldChange('sleep', val)}
        options={[
          { value: 'less6', label: t('form1:section6.sleep.less6') },
          { value: '6to7', label: t('form1:section6.sleep.6to7') },
          { value: '7to8', label: t('form1:section6.sleep.7to8') },
          { value: '8plus', label: t('form1:section6.sleep.8plus') },
        ]}
      />
      <RadioGroup
        label={t('form1:section6.energy.label')}
        value={formData.energy}
        onChange={(val) => onFieldChange('energy', val)}
        options={[
          { value: 'high', label: t('form1:section6.energy.high') },
          { value: 'upDown', label: t('form1:section6.energy.upDown') },
          { value: 'low', label: t('form1:section6.energy.low') },
        ]}
      />
      <CheckboxGroup
        label={t('form1:section6.upset.label')}
        values={formData.upset || []}
        onChange={(val) => onFieldChange('upset', val)}
        options={[
          { value: 'break', label: t('form1:section6.upset.break') },
          { value: 'talking', label: t('form1:section6.upset.talking') },
          { value: 'stepHelp', label: t('form1:section6.upset.stepHelp') },
          { value: 'later', label: t('form1:section6.upset.later') },
          { value: 'quiet', label: t('form1:section6.upset.quiet') },
        ]}
      />
      <RadioGroup
        label={t('form1:section6.askHelp.label')}
        value={formData.askHelp}
        onChange={(val) => onFieldChange('askHelp', val)}
        options={[
          { value: 'yes', label: t('form1:section6.askHelp.yes') },
          { value: 'sometimes', label: t('form1:section6.askHelp.sometimes') },
          { value: 'no', label: t('form1:section6.askHelp.no') },
        ]}
      />
      <TextArea
        label={t('form1:section6.wishTeachers.label')}
        value={formData.wishTeachers}
        onChange={(val) => onFieldChange('wishTeachers', val)}
        placeholder={t('form1:section6.wishTeachers.placeholder')}
      />
    </Section>
  );

  const renderSection7 = () => (
    <Section title={t('form1:section7.title')}>
      <TextArea
        label={t('form1:section7.funLearning.label')}
        value={formData.funLearning}
        onChange={(val) => onFieldChange('funLearning', val)}
        placeholder={t('form1:section7.funLearning.placeholder')}
      />
      <TextArea
        label={t('form1:section7.perfectDay.label')}
        value={formData.perfectDay}
        onChange={(val) => onFieldChange('perfectDay', val)}
        placeholder={t('form1:section7.perfectDay.placeholder')}
      />
      <TextArea
        label={t('form1:section7.learnBest.label')}
        value={formData.section7LearnBest}
        onChange={(val) => onFieldChange('section7LearnBest', val)}
        placeholder={t('form1:section7.learnBest.placeholder')}
      />
      <TextArea
        label={t('form1:section7.share.label')}
        value={formData.share}
        onChange={(val) => onFieldChange('share', val)}
        placeholder={t('form1:section7.share.placeholder')}
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

export default Form1StudentSurvey;


