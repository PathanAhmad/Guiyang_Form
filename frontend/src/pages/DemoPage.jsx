import { useTranslation } from 'react-i18next';
import DemoForm from '../components/forms/DemoForm';

const DemoPage = () => {
  const { t } = useTranslation();
  
  const handleSuccess = (data) => {
    console.log('Demo form submitted successfully:', data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('pages.demo.title')}
        </h1>
        <p className="text-gray-600">
          {t('pages.demo.description')}
        </p>
      </div>
      
      <DemoForm onSuccess={handleSuccess} />
    </div>
  );
};

export default DemoPage;
