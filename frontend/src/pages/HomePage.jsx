import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage = () => {
  const formTypes = [
    {
      id: 'demo',
      title: 'Sparkie Demo',
      description: 'Get a personalized demo of our Sparkie system and see how it can benefit your business.',
      icon: '🎯',
      href: '/demo',
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'primary'
    },
    {
      id: 'showcase',
      title: 'System Showcase',
      description: 'Explore our system capabilities through an interactive showcase and discover what we can do for you.',
      icon: '🌟',
      href: '/showcase',
      color: 'bg-purple-50 border-purple-200',
      buttonColor: 'primary'
    },
    {
      id: 'fasttrack',
      title: 'Fast-Track Application',
      description: 'Express your interest for priority access and consultation. Get expedited support and personalized attention.',
      icon: '⚡',
      href: '/fasttrack',
      color: 'bg-green-50 border-green-200',
      buttonColor: 'primary'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Spark-OS Waiting Form
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Submit your requests and applications through our streamlined form system. 
          Choose from our available services below to get started.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">24/7</div>
            <div className="text-sm text-gray-600">Submission Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">Fast</div>
            <div className="text-sm text-gray-600">Response Times</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">Secure</div>
            <div className="text-sm text-gray-600">Data Handling</div>
          </div>
        </div>
      </div>

      {/* Form Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formTypes.map((form) => (
          <Card key={form.id} className={`hover:shadow-lg transition-shadow duration-200 ${form.color}`}>
            <Card.Body className="text-center p-6">
              <div className="text-4xl mb-4">{form.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {form.title}
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {form.description}
              </p>
              <Link to={form.href}>
                <Button variant={form.buttonColor} className="w-full">
                  Get Started
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </div>


    </div>
  );
};

export default HomePage;
