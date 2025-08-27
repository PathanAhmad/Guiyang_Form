import DemoForm from '../components/forms/DemoForm';

const DemoPage = () => {
  const handleSuccess = (data) => {
    console.log('Demo form submitted successfully:', data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Request Sparkie Demo
        </h1>
        <p className="text-gray-600">
          Fill out the form below to request a personalized demo of our Sparkie system.
          Our team will contact you to schedule a convenient time for your demonstration.
        </p>
      </div>
      
      <DemoForm onSuccess={handleSuccess} />
    </div>
  );
};

export default DemoPage;
