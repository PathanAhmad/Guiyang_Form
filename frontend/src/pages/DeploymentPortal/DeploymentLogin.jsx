import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deploymentAccessAPI } from '../../services/api';
import { useDeploymentAuth } from '../../contexts/DeploymentAuthContext';
import SchoolIcon from '../../Images/School.png';
import TeacherIcon from '../../Images/teacher.png';
import StudentIcon from '../../Images/Student.png';
import SpecialIcon from '../../Images/Special.png';
import SparkOSTypo from '../../Images/SparkOStypo.svg';
import DeploymentPortalHeader from './DeploymentPortalHeader';

const DeploymentLogin = () => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const { login, isAuthenticated, roleType: currentRole } = useDeploymentAuth();
  
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation('deploymentLogin');

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
      icon: SchoolIcon,
      bgColor: 'bg-gradient-to-br from-yellow-200 to-orange-300',
    },
    educator: {
      icon: TeacherIcon,
      bgColor: 'bg-gradient-to-br from-sky-200 to-blue-300',
    },
    learner: {
      icon: StudentIcon,
      bgColor: 'bg-gradient-to-br from-purple-200 to-indigo-300',
    },
    special: {
      icon: SpecialIcon,
      bgColor: 'bg-gradient-to-br from-red-200 to-rose-300',
    },
  };

  const config = roleConfig[roleType] || roleConfig.school;

  // Redirect if already authenticated with correct role
  useEffect(() => {
    if (isAuthenticated && currentRole === roleType) {
      navigate(`/deployment_portal/${roleType}/dashboard`);
    }
  }, [isAuthenticated, currentRole, roleType, navigate]);

  const mapServerErrorToLocalizedMessage = (rawError) => {
    if (!rawError) return '';

    if (rawError === 'Invalid access key for this role') {
      return t('errorMessages.invalidKeyForRole');
    }

    if (rawError === 'Access key is required') {
      return t('errorMessages.enterKey');
    }

    return rawError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!accessKey.trim()) {
      setError(t('errorMessages.enterKey'));
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
        setError(data.error ? mapServerErrorToLocalizedMessage(data.error) : t('errorMessages.invalidKey'));
      }
    } catch (err) {
      console.error('Access key validation error:', err);
      const serverError = err.response?.data?.error || err.message;
      setError(serverError ? mapServerErrorToLocalizedMessage(serverError) : t('errorMessages.validationFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Use a single primary color system to match the main survey site's minimalist theme
  const getColorClasses = () => ({
    gradient: 'from-primary-500 to-primary-600',
    button: 'bg-[#7c59b2] hover:bg-[#62458f] focus:ring-[#7c59b2]',
    text: 'text-primary-600',
    border: 'border-primary-200',
    bg: 'bg-primary-50',
  });

  const colorClasses = getColorClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-300/10 to-primary-400/10 flex items-center justify-center px-4 py-12">
      <DeploymentPortalHeader />
      <div className="max-w-4xl w-full">
        {/* Login Card */}
        <div className="bg-white rounded-[2.2rem] shadow-lg overflow-hidden flex p-3 gap-3">
          {/* Left Column: Icon */}
          <div className={`relative w-2/5 ${config.bgColor} flex items-center justify-center p-8 rounded-[2rem]`}>
            {/* Close Button */}
            <button
              onClick={() => navigate('/deployment_portal')}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/30 hover:bg-white/40 flex items-center justify-center transition-all duration-200 transform hover:scale-110 cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={config.icon}
              alt={t(`roles.${roleType}.title`)}
              className="max-w-full h-auto object-contain"
            />
          </div>

          {/* Right Column: Content */}
          <div className="w-3/5 p-5">
            <h1 className="text-2xl font-extrabold text-[#7c59b2]">{t(`roles.${roleType}.title`)}</h1>
            <p className="text-sm text-gray-600 mt-0 mb-6">{t(`roles.${roleType}.description`)}</p>
          
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="accessKey" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('accessKeyLabel')}
                </label>
                <input
                  type="text"
                  id="accessKey"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder={t('accessKeyPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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
                className={`w-full ${colorClasses.button} text-white font-medium py-3 px-4 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('validatingButton')}
                  </>
                ) : (
                  t('accessPortalButton')
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className={`mt-6 p-4 bg-gray-100 rounded-[1.8rem]`}>
              <div className="flex items-center">
                <svg className={`w-6 h-6 text-gray-500 mr-3 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-800">
                  {roleType === 'school'
                    ? t('infoBox.school')
                    : t('infoBox.default')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Footer */}
        <div className="mt-8 text-center">
          <img
            src={SparkOSTypo}
            alt="SparkOS Logo"
            className="h-8 w-auto mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default DeploymentLogin;

