import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SchoolIcon from '../../Images/School.png';
import TeacherIcon from '../../Images/teacher.png';
import StudentIcon from '../../Images/Student.png';
import SpecialIcon from '../../Images/Special.png';
import DeploymentPortalHeader from './DeploymentPortalHeader';

const DeploymentPortalHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('deploymentHome');

  const roles = [
    {
      id: 'school',
      icon: SchoolIcon,
      bgColor: 'bg-gradient-to-br from-yellow-200 to-orange-300',
      panelBgColor: 'bg-gradient-to-tl from-yellow-100/50 to-white to-[70%]',
    },
    {
      id: 'educator',
      icon: TeacherIcon,
      bgColor: 'bg-gradient-to-br from-sky-200 to-blue-300',
      panelBgColor: 'bg-gradient-to-tl from-sky-100/50 to-white to-[70%]',
    },
    {
      id: 'learner',
      icon: StudentIcon,
      bgColor: 'bg-gradient-to-br from-purple-200 to-indigo-300',
      panelBgColor: 'bg-gradient-to-tl from-purple-100/50 to-white to-[70%]',
    },
    {
      id: 'special',
      icon: SpecialIcon,
      bgColor: 'bg-gradient-to-br from-red-200 to-rose-300',
      panelBgColor: 'bg-gradient-to-tl from-red-100/50 to-white to-[70%]',
    },
  ];

  const handleRoleClick = (roleId) => {
    navigate(`/deployment_portal/${roleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-200">
      <DeploymentPortalHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4">
            <span className="block pb-2 text-2xl md:text-4xl font-regular">
              {t('welcome')} <span className="font-extrabold">SparkOS</span>
            </span>
            <span className="block text-4xl md:text-7xl font-extrabold pb-3 bg-gradient-to-r from-[#7c59b2] to-[#62458f] bg-clip-text text-transparent">
              {t('portalName')}
            </span>
          </h2>
          <div className="text-lg text-gray-600 max-w-2xl mx-auto">
            <p>{t('description1')}</p>
            <p>{t('description2')}</p>
          </div>
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
                  alt={t(`roles.${role.id}.title`)}
                  className={`h-full w-auto object-contain ${
                    role.id === 'learner' ? 'transform -scale-x-100' : ''
                  }`}
                />
              </div>
              <div className="flex flex-col flex-grow p-6 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary-600">{t(`roles.${role.id}.title`)}</h3>
                  <p className="text-gray-500 leading-relaxed mt-2 font-medium">
                    {t(`roles.${role.id}.description`)}
                  </p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center justify-center px-4 py-2 font-semibold text-white bg-[#7c59b2] rounded-full shadow-sm group-hover:bg-[#62458f] transition-colors duration-200">
                    <span>{t('accessPortal')}</span>
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
              <strong>{t('note')}</strong> {t('noteText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentPortalHome;

