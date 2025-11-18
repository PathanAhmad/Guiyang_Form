import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../../utils/assets';

const DeploymentPortalHome = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const roles = [
    {
      id: 'school',
      title: 'School Management',
      description:
        'Manage pilot deployment, oversee educator onboarding, and track school-level performance metrics.',
      icon: '/School.png',
      bgColor: 'bg-gradient-to-br from-yellow-200 to-orange-300',
      panelBgColor: 'bg-gradient-to-tl from-yellow-100/50 to-white to-[70%]',
    },
    {
      id: 'educator',
      title: 'Educators',
      description:
        'Submit digital course materials, complete all surveys and feedback, and adhere to classroom setup guidelines.',
      icon: '/teacher.png',
      bgColor: 'bg-gradient-to-br from-sky-200 to-blue-300',
      panelBgColor: 'bg-gradient-to-tl from-sky-100/50 to-white to-[70%]',
    },
    {
      id: 'learner',
      title: 'Learners',
      description: 'Complete surveys and provide feedback.',
      icon: '/Student.png',
      bgColor: 'bg-gradient-to-br from-purple-200 to-indigo-300',
      panelBgColor: 'bg-gradient-to-tl from-purple-100/50 to-white to-[70%]',
    },
    {
      id: 'special',
      title: 'Special Learners',
      description: 'Complete surveys and provide feedback.',
      icon: '/Special.png',
      bgColor: 'bg-gradient-to-br from-red-200 to-rose-300',
      panelBgColor: 'bg-gradient-to-tl from-red-100/50 to-white to-[70%]',
    },
  ];

  const handleRoleClick = (roleId) => {
    navigate(`/deployment_portal/${roleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-200">
      {/* Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-sm shadow-sm border-b border-gray-200'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/SparkOS-Logo.svg"
                alt="SparkOS Logo"
                className="h-16 w-auto"
              />
            </div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-black text-white hover:bg-gray-800"
            >
              <span>Home</span>
              <svg className="w-4 h-4 ml-2 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4">
            <span className="block pb-2 text-2xl md:text-4xl font-regular">Welcome to the</span>
            <span className="block text-4xl md:text-7xl font-extrabold pb-3 bg-gradient-to-r from-[#ff4848] to-[#c62222] bg-clip-text text-transparent">
              Deployment Portal
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your role to access the appropriate deployment resources and tools.
            A valid access key is required to proceed.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto md:grid-rows-fr">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className={`group relative ${role.panelBgColor} rounded-[2.2rem] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 overflow-hidden text-left flex p-3 gap-3`}
            >
              <div
                className={`flex-shrink-0 ${role.bgColor} flex items-center justify-center p-4 rounded-[2rem] ${
                  role.id === 'school' || role.id === 'educator'
                    ? 'w-50'
                    : role.id === 'learner' || role.id === 'special'
                    ? 'w-48'
                    : 'w-40'
                }`}
              >
                <img
                  src={role.icon}
                  alt={`${role.title} icon`}
                  className={`h-full w-auto object-contain ${
                    role.id === 'learner' ? 'transform -scale-x-100' : ''
                  }`}
                />
              </div>
              <div className="flex flex-col flex-grow p-6 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary-600">{role.title}</h3>
                  <p className="text-gray-500 leading-relaxed mt-2 font-medium">
                    {role.description}
                  </p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center justify-center px-4 py-2 font-semibold text-white bg-[#ff4848] rounded-full shadow-sm group-hover:bg-[#e04040] transition-colors duration-200">
                    <span>Access Portal</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-md">
            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Each role requires a unique access key provided by SparkOS to your school administration. If you do not have an access key, please contact your school administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentPortalHome;

