import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../../utils/assets';

const DeploymentPortalHome = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'school',
      title: 'School Management',
      description:
        'Manage pilot deployment, oversee educator onboarding, and track school-level performance metrics.',
      icon: '🏫',
    },
    {
      id: 'educator',
      title: 'Educators',
      description:
        'Submit teaching resources for initial course digitalization, survey, feedback forms, and classroom deployment guidelines.',
      icon: '👨‍🏫',
    },
    {
      id: 'learner',
      title: 'Learners',
      description: 'Survey filling, and share feedback.',
      icon: '🎓',
    },
    {
      id: 'special',
      title: 'Special Learners',
      description: 'Survey filling, and share feedback.',
      icon: '✨',
    },
  ];

  const handleRoleClick = (roleId) => {
    navigate(`/deployment_portal/${roleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-300/10 to-primary-400/10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={assetUrl('/Images/SparkOSFullLogo.svg')}
                alt="SparkOS Logo"
                className="h-10 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Deployment Portal</h1>
                <p className="text-sm text-gray-600">Pilot Deployment Management System</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Main Site
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to the Deployment Portal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your role to access the appropriate deployment resources and tools.
            You will need a valid access key to proceed.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-primary-100 hover:border-primary-200 transform hover:-translate-y-0.5 overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-primary-50/60">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{role.icon}</div>
                  <h3 className="text-xl font-semibold text-primary-600">{role.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  {role.description}
                </p>
                <div className="mt-6 flex items-center justify-end text-primary-600 font-medium group-hover:text-primary-700">
                  <span>Access Portal</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-primary-50 border border-primary-200 rounded-lg">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-primary-900">
              <strong>Note:</strong> Each role requires a unique access key. Please contact your administrator if you need access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentPortalHome;

