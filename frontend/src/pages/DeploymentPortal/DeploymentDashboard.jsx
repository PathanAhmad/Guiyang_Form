import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeploymentAuth } from '../../contexts/DeploymentAuthContext';
import SparkOSTypoLogo from '../../Images/SparkOStypo.svg';

const DeploymentDashboard = () => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, roleType: currentRole, keyName, logout } = useDeploymentAuth();
  const { i18n, t } = useTranslation('deploymentDashboard');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

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

  const handleLogout = () => {
    logout();
    navigate('/deployment_portal');
  };

  // Role configuration (content only; visual styling is unified for a minimalist look)
  const roleConfig = {
    school: {
      title: t('dashboardTitles.school'),
      icon: '🏫',
      sections: [
        {
          id: 'surveyForms', route: 'surveys', available: true,
        },
        {
          id: 'protocolOverview', available: false,
        },
        {
          id: 'resourceHub', available: false,
        },
        {
          id: 'contact', available: false,
        },
      ],
    },
    educator: {
      title: t('dashboardTitles.educator'),
      icon: '👨‍🏫',
      sections: [
        {
          id: 'surveyForms', route: 'surveys', available: true,
        },
        {
          id: 'protocolOverview', available: false,
        },
        {
          id: 'resourceHub', available: false,
        },
        {
          id: 'contact', available: false,
        },
      ],
    },
    learner: {
      title: t('dashboardTitles.learner'),
      icon: '🎓',
      sections: [
        {
          id: 'surveyForms', route: 'surveys', available: true,
        },
        {
          id: 'protocolOverview', available: false,
        },
        {
          id: 'resourceHub', available: false,
        },
        {
          id: 'contact', available: false,
        },
      ],
    },
    special: {
      title: t('dashboardTitles.special'),
      icon: '✨',
      sections: [
        {
          id: 'surveyForms', route: 'surveys', available: true,
        },
        {
          id: 'protocolOverview', available: false,
        },
        {
          id: 'resourceHub', available: false,
        },
        {
          id: 'contact', available: false,
        },
      ],
    },
  };

  const config = roleConfig[roleType] || roleConfig.school;

  // Use a single primary color system to match the main survey site's minimalist theme
  const getColorClasses = () => ({
    gradient: 'from-[#7c59b2] to-[#62458f]',
    text: 'text-[#7c59b2]',
    bg: 'bg-[#7c59b2]/10',
    border: 'border-[#7c59b2]/20',
    badge: 'bg-[#7c59b2]/20 text-[#7c59b2]',
  });

  const colorClasses = getColorClasses();

  if (!isAuthenticated || currentRole !== roleType) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={SparkOSTypoLogo}
                alt="SparkOS Logo"
                className="h-8 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
                    {keyName && (
                      <p className="text-xs text-gray-500">{t('accessWithName', { keyName })}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                <span>{i18n.language === 'en' ? '中文' : 'EN'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className={`bg-gradient-to-r ${colorClasses.gradient} rounded-[2rem] shadow-lg p-8 mb-8 text-white`}>
          <h2 className="text-3xl font-bold mb-2">{t('welcome')}</h2>
          <p className="text-blue-100 text-lg">
            {t('welcomeSub')}
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {config.sections.map((section, index) => {
            const sectionKey = `sections.${roleType}.${section.id}`;
            const title = t(`${sectionKey}.title`);
            const description = t(`${sectionKey}.description`);
            const items = t(`${sectionKey}.items`, { returnObjects: true }) || [];

            return (
              <div
                key={index}
                className="bg-white rounded-[2rem] shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className={`${colorClasses.bg} border-b ${colorClasses.border} px-6 py-4`}>
                  <h3 className="text-xl font-bold text-gray-900">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-gray-900 mr-3 flex-shrink-0 mt-0.5"
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
                  {section.available ? (
                    <button
                      onClick={() => navigate(`/deployment_portal/${roleType}/${section.route}`)}
                      className="mt-6 w-full px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 hover:shadow-lg transition-all duration-200"
                    >
                      {t('accessButton', { title })}
                    </button>
                  ) : (
                    <div className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-full font-medium text-center">
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        {t('locked')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeploymentDashboard;

