import { useTranslation } from 'react-i18next';
import FastTrackForm from '../components/forms/FastTrackForm';

const FastTrackPage = () => {
  const { t } = useTranslation();
  
  const handleSuccess = (data) => {
    console.log('Fast-track form submitted successfully:', data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('pages.fasttrack.title')}
        </h1>
        <p className="text-gray-600">
          {t('pages.fasttrack.description')}
        </p>
      </div>
      
      <FastTrackForm onSuccess={handleSuccess} />
    </div>
  );
};

export default FastTrackPage;
