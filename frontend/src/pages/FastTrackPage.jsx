import FastTrackForm from '../components/forms/FastTrackForm';

const FastTrackPage = () => {
  const handleSuccess = (data) => {
    console.log('Fast-track form submitted successfully:', data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Fast-Track Application
        </h1>
        <p className="text-gray-600">
          Apply for priority access and expedited support. Our fast-track program 
          provides personalized consultation and priority handling for qualified applicants.
        </p>
      </div>
      
      <FastTrackForm onSuccess={handleSuccess} />
    </div>
  );
};

export default FastTrackPage;
