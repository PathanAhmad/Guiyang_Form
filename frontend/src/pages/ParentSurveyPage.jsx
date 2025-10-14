import { useTranslation } from 'react-i18next';
import ParentSurveyForm from '../components/forms/ParentSurveyForm';

const ParentSurveyPage = () => {
  const { t } = useTranslation();
  
  const handleSuccess = () => {};

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('parentSurvey.pageTitle')}
        </h1>
        <p className="text-gray-600">
          {t('parentSurvey.pageSubtitle')}
        </p>
      </div>
      <ParentSurveyForm onSuccess={handleSuccess} />
    </div>
  );
};

export default ParentSurveyPage;



