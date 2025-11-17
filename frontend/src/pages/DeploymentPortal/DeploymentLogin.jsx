import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deploymentAccessAPI } from '../../services/api';
import { useDeploymentAuth } from '../../contexts/DeploymentAuthContext';
import { assetUrl } from '../../utils/assets';

const DeploymentLogin = () => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const { login, isAuthenticated, roleType: currentRole } = useDeploymentAuth();
  
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Valid role types
  const validRoles = ['school', 'educator', 'learner', 'special'];

  // Redirect if invalid role type
  useEffect(() => {
    if (!validRoles.includes(roleType)) {
      navigate('/deployment_portal');
    }
  }, [roleType, navigate]);

  // Role configuration (content only; visual styling is unified for a minimalist look)
  const roleConfig = {
    school: {
      title: 'School Management',
      icon: '🏫',
      description: 'Access pilot deployment management tools',
    },
    educator: {
      title: 'Educators',
      icon: '👨‍🏫',
      description: 'Access teaching resources and guidelines',
    },
    learner: {
      title: 'Learners',
      icon: '🎓',
      description: 'Access surveys and feedback forms',
    },
    special: {
      title: 'Special Learners',
      icon: '✨',
      description: 'Access specialized surveys and feedback',
    },
  };

  const config = roleConfig[roleType] || roleConfig.school;

  // Redirect if already authenticated with correct role
  useEffect(() => {
    if (isAuthenticated && currentRole === roleType) {
      navigate(`/deployment_portal/${roleType}/dashboard`);
    }
  }, [isAuthenticated, currentRole, roleType, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!accessKey.trim()) {
      setError('Please enter an access key');
      return;
    }

    setLoading(true);

    try {
      const response = await deploymentAccessAPI.validate(accessKey.trim(), roleType);
      const data = response.data;

      if (data.success && data.valid) {
        // Store authentication
        login(roleType, data.data.keyName, accessKey.trim(), {
          usageCount: data.data.usageCount,
          maxUses: data.data.maxUses,
          expiresAt: data.data.expiresAt,
        });

        // Navigate to dashboard
        navigate(`/deployment_portal/${roleType}/dashboard`);
      } else {
        setError(data.error || 'Invalid access key');
      }
    } catch (err) {
      console.error('Access key validation error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to validate access key');
    } finally {
      setLoading(false);
    }
  };

  // Use a single primary color system to match the main survey site's minimalist theme
  const getColorClasses = () => ({
    gradient: 'from-primary-500 to-primary-600',
    button: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    text: 'text-primary-600',
    border: 'border-primary-200',
    bg: 'bg-primary-50',
  });

  const colorClasses = getColorClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-300/10 to-primary-400/10 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/deployment_portal')}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Portal
        </button>

        {/* Login Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100">
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-r ${colorClasses.gradient} p-6 text-white`}>
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{config.icon}</div>
              <div>
                <h1 className="text-2xl font-bold">{config.title}</h1>
                <p className="text-blue-100 text-sm mt-1">{config.description}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="accessKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Access Key
                </label>
                <input
                  type="text"
                  id="accessKey"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter your access key"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${colorClasses.button} text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating...
                  </>
                ) : (
                  'Access Portal'
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className={`mt-6 p-4 ${colorClasses.bg} border ${colorClasses.border} rounded-lg`}>
              <div className="flex items-start">
                <svg className={`w-5 h-5 ${colorClasses.text} mr-2 flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-700">
                  {roleType === 'school'
                    ? "School Management access requires a SparkOS-provided key. Please reach out to SparkOS if you haven't received yours"
                    : 'Access keys are provided by SparkOS to your school administration. If you do not have an access key, please contact your school administrator for assistance.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Footer */}
        <div className="mt-8 text-center">
          <img
            src={assetUrl('/Images/SparkOSFullLogo.svg')}
            alt="SparkOS Logo"
            className="h-8 w-auto mx-auto opacity-60"
          />
        </div>
      </div>
    </div>
  );
};

export default DeploymentLogin;

