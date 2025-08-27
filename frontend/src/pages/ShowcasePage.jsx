import ShowcaseForm from '../components/forms/ShowcaseForm';

const ShowcasePage = () => {
  const handleSuccess = (data) => {
    console.log('Showcase form submitted successfully:', data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Request System Showcase
        </h1>
        <p className="text-gray-600">
          Get access to our interactive system showcase and explore all the capabilities 
          and features we offer. Perfect for evaluating our solution.
        </p>
      </div>
      
      <ShowcaseForm onSuccess={handleSuccess} />
    </div>
  );
};

export default ShowcasePage;
