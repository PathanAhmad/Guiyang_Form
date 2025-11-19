import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeploymentAuth } from '../../contexts/DeploymentAuthContext';
import { assetUrl } from '../../utils/assets';
import DeploymentPortalHeader from './DeploymentPortalHeader';

const DeploymentDashboard = () => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, roleType: currentRole, keyName, logout } = useDeploymentAuth();
  const { t } = useTranslation('deploymentDashboard');

  // Valid role types
  const validRoles = ['school', 'educator', 'learner', 'special'];

  // Redirect if invalid role type
  useEffect(() => {
    if (!validRoles.includes(roleType)) {
      navigate('/deployment_portal');
      return;
    }
  }, [roleType, navigate]);

  // Redirect if not authenticated or wrong role
  useEffect(() => {
    if (!isAuthenticated || currentRole !== roleType) {
      navigate(`/deployment_portal/${roleType}`);
    }
  }, [isAuthenticated, currentRole, roleType, navigate]);

  const config = {
    icon: {
      school: '🏫',
      educator: '👨‍🏫',
      learner: '🎓',
      special: '✨',
    },
  };
  const currentSections = t(`sections.${roleType}`, { returnObjects: true }) || t('sections.school', { returnObjects: true });

  // Use a single primary color system to match the main survey site's minimalist theme
  const getColorClasses = () => ({
    gradient: 'from-primary-500 to-primary-600',
    text: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    badge: 'bg-primary-100 text-primary-800',
  });

  const colorClasses = getColorClasses();

  if (!isAuthenticated || currentRole !== roleType) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-300/10 to-primary-400/10">
      <DeploymentPortalHeader />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{config.icon[roleType]}</span>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t(`dashboardTitles.${roleType}`)}</h1>
                    {keyName && (
                      <p className="text-sm text-gray-500">{t('access')}: {keyName}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
        </div>
        {/* Welcome Banner */}
        <div className={`bg-gradient-to-r ${colorClasses.gradient} rounded-xl shadow-lg p-8 mb-8 text-white`}>
          <h2 className="text-3xl font-bold mb-2">{t('welcome')}</h2>
          <p className="text-blue-100 text-lg">
            {t('welcomeSub')}
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentSections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className={`${colorClasses.bg} border-b ${colorClasses.border} px-6 py-4`}>
                <h3 className={`text-xl font-bold ${colorClasses.text}`}>
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{section.description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <svg
                        className={`w-5 h-5 ${colorClasses.text} mr-3 flex-shrink-0 mt-0.5`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(`/deployment_portal/${roleType}/surveys`)}
                  className={`mt-6 w-full px-4 py-2 bg-gradient-to-r ${colorClasses.gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
                >
                  {t('access')} {section.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeploymentDashboard;

