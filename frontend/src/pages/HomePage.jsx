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
          Welcome to Guiyang Forms
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

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Why Choose Our Form System?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600">Quick form submission and instant confirmation</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Reliable</h3>
            <p className="text-sm text-gray-600">99.9% uptime with automatic Discord notifications</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-sm text-gray-600">Enterprise-grade security for your data</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M12 12h.01M12 12h.01" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Trackable</h3>
            <p className="text-sm text-gray-600">Get unique tokens to track your submissions</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center py-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-gray-600">
          If you have any questions or need assistance, feel free to reach out to us.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
