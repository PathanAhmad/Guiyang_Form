import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SparkOSLogo from '../../Images/SparkOS-Logo.svg';
import { useDeploymentAuth } from '../../contexts/DeploymentAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const DeploymentPortalHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { i18n, t } = useTranslation('common');
  const { isAuthenticated, logout } = useDeploymentAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/deployment_portal');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showLogout = isAuthenticated && location.pathname.includes('/dashboard');

  return (
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
              src={SparkOSLogo}
              alt="SparkOS Logo"
              className="h-16 w-auto"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              <span>{i18n.language === 'en' ? '中文' : 'EN'}</span>
            </button>
            {showLogout && (
               <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentPortalHeader;
