import { useTranslation } from 'react-i18next';
import ShowcaseForm from '../components/forms/ShowcaseForm';

const ShowcasePage = () => {
  const { t } = useTranslation();
  
  const handleSuccess = (data) => {
    console.log('Showcase form submitted successfully:', data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('pages.showcase.title')}
        </h1>
        <p className="text-gray-600">
          {t('pages.showcase.description')}
        </p>
      </div>
      
      <ShowcaseForm onSuccess={handleSuccess} />
    </div>
  );
};

export default ShowcasePage;
