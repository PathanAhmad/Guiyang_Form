import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage = ({ onCardSelect }) => {
  const { t } = useTranslation();
  
  const formTypes = [
    {
      id: 'demo',
      title: t('homepage.forms.demo.title'),
      description: t('homepage.forms.demo.description'),
      icon: '🎯',
      href: '/demo',
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'primary'
    },
    {
      id: 'showcase',
      title: t('homepage.forms.showcase.title'),
      description: t('homepage.forms.showcase.description'),
      icon: '🌟',
      href: '/showcase',
      color: 'bg-purple-50 border-purple-200',
      buttonColor: 'primary'
    },
    {
      id: 'fasttrack',
      title: t('homepage.forms.fasttrack.title'),
      description: t('homepage.forms.fasttrack.description'),
      icon: '⚡',
      href: '/fasttrack',
      color: 'bg-green-50 border-green-200',
      buttonColor: 'primary'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header with Logo */}
      <div className="text-center py-16">
        {/* SparkOS Logo */}
        <div className="flex justify-center items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3">
            <span className="text-white font-bold text-3xl transform -rotate-3">S</span>
          </div>
          <div className="ml-4">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Spark-OS
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-wider">
          {t('homepage.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
          {t('homepage.subtitle')}
        </p>
      </div>

      {/* Service Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {formTypes.map((form) => (
            <Card key={form.id} className={`hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer ${form.color} border-2`}>
              <Card.Body className="text-center p-8" onClick={() => onCardSelect(form.id)}>
                <div className="text-6xl mb-6">{form.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {form.title}
                </h3>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  {form.description}
                </p>
                <Button variant={form.buttonColor} className="w-full text-lg py-3">
                  {t('common.getStarted')}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
