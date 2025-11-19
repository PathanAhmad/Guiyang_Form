import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeploymentAuth } from '../../contexts/DeploymentAuthContext';
import { assetUrl } from '../../utils/assets';

const DeploymentDashboard = () => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, roleType: currentRole, keyName, logout } = useDeploymentAuth();

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
      title: 'School Management Dashboard',
      icon: '🏫',
      sections: [
        {
          title: 'Survey Forms',
          description: 'Complete surveys to help us understand and improve the pilot program',
          items: [
            'Equity & Inclusion Planning Survey',
            'Course Catalog & Digitalization Survey',
            'Track your survey progress',
            'View completed submissions',
          ],
          available: true,
          route: 'surveys',
        },
        {
          title: 'Pilot Protocol Overview',
          description: 'Visual summary of pilot objectives, setup steps, and timeline',
          items: [
            'View pilot objectives',
            'Setup steps and guidelines',
            'Timeline and milestones',
            'Program overview',
          ],
          available: false,
        },
        {
          title: 'Resource Hub',
          description: 'Guides, FAQs, and deployment checklists',
          items: [
            'Deployment guides',
            'Frequently asked questions',
            'Checklists and templates',
            'Best practices',
          ],
          available: false,
        },
        {
          title: 'Contact Section',
          description: 'Support team contact form or chat',
          items: [
            'Contact support team',
            'Submit inquiries',
            'Live chat support',
            'Request assistance',
          ],
          available: false,
        },
      ],
    },
    educator: {
      title: 'Educators Dashboard',
      icon: '👨‍🏫',
      sections: [
        {
          title: 'Survey Forms',
          description: 'Provide detailed insights about individual student assessment',
          items: [
            'Student Behavior Assessment',
            'Track assessment progress',
            'View completed assessments',
            'Submit multiple assessments',
          ],
          available: true,
          route: 'surveys',
        },
        {
          title: 'Pilot Protocol Overview',
          description: 'Visual summary of pilot objectives, setup steps, and timeline',
          items: [
            'View pilot objectives',
            'Setup steps and guidelines',
            'Timeline and milestones',
            'Program overview',
          ],
          available: false,
        },
        {
          title: 'Resource Hub',
          description: 'Guides, FAQs, and deployment checklists',
          items: [
            'Teaching resources',
            'Assessment templates',
            'Frequently asked questions',
            'Best practices',
          ],
          available: false,
        },
        {
          title: 'Contact Section',
          description: 'Support team contact form or chat',
          items: [
            'Contact support team',
            'Submit inquiries',
            'Request assistance',
            'Live chat support',
          ],
          available: false,
        },
      ],
    },
    learner: {
      title: 'Learners Dashboard',
      icon: '🎓',
      sections: [
        {
          title: 'Survey Forms',
          description: 'Complete surveys to help improve the learning experience',
          items: [
            'Learning Interest & Preferences Survey',
            'Track your progress',
            'View completed surveys',
            'Save draft and continue later',
          ],
          available: true,
          route: 'surveys',
        },
        {
          title: 'Pilot Protocol Overview',
          description: 'Visual summary of pilot objectives and participation',
          items: [
            'View pilot objectives',
            'Your participation role',
            'Program timeline',
            'What to expect',
          ],
          available: false,
        },
        {
          title: 'Resource Hub',
          description: 'Guides and FAQs for students',
          items: [
            'Student guides',
            'Frequently asked questions',
            'Tips and resources',
            'Getting help',
          ],
          available: false,
        },
        {
          title: 'Contact Section',
          description: 'Support team contact form or chat',
          items: [
            'Contact support team',
            'Ask questions',
            'Get help',
            'Live chat support',
          ],
          available: false,
        },
      ],
    },
    special: {
      title: 'Special Learners Dashboard',
      icon: '✨',
      sections: [
        {
          title: 'Survey Forms',
          description: 'Complete surveys designed for your learning needs',
          items: [
            'Learning Interest & Preferences Survey',
            'Accessible survey format',
            'Track your progress',
            'Save and continue later',
          ],
          available: true,
          route: 'surveys',
        },
        {
          title: 'Pilot Protocol Overview',
          description: 'Visual summary of pilot objectives and participation',
          items: [
            'View pilot objectives',
            'Your participation role',
            'Program timeline',
            'What to expect',
          ],
          available: false,
        },
        {
          title: 'Resource Hub',
          description: 'Accessible guides and FAQs',
          items: [
            'Accessible guides',
            'Frequently asked questions',
            'Support resources',
            'Getting help',
          ],
          available: false,
        },
        {
          title: 'Contact Section',
          description: 'Support team contact form or chat',
          items: [
            'Contact support team',
            'Request accommodations',
            'Get assistance',
            'Live chat support',
          ],
          available: false,
        },
      ],
    },
  };

  const config = roleConfig[roleType] || roleConfig.school;

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={assetUrl('/Images/SparkOSFullLogo.svg')}
                alt="SparkOS Logo"
                className="h-8 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
                    {keyName && (
                      <p className="text-xs text-gray-500">Access: {keyName}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className={`bg-gradient-to-r ${colorClasses.gradient} rounded-xl shadow-lg p-8 mb-8 text-white`}>
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Portal</h2>
          <p className="text-blue-100 text-lg">
            Access your resources, submit materials, and track your progress
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {config.sections.map((section, index) => (
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
                {section.available ? (
                  <button
                    onClick={() => navigate(`/deployment_portal/${roleType}/${section.route}`)}
                    className={`mt-6 w-full px-4 py-2 bg-gradient-to-r ${colorClasses.gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
                  >
                    Access {section.title}
                  </button>
                ) : (
                  <div className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg font-medium text-center">
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-lg font-semibold text-yellow-900 mb-2">
                Portal Under Development
              </h4>
              <p className="text-yellow-800">
                This deployment portal is currently under active development. Features shown above represent
                the planned functionality. Please check back regularly for updates, or contact your administrator
                for more information about availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentDashboard;

