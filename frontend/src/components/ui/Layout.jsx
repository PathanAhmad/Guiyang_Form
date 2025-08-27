import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

const Layout = ({ children, showNavigation = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Simplified navigation - only show when explicitly needed (for queue dashboard)
  const navigation = [
    { name: t('navigation.home'), action: 'home' },
    { name: t('navigation.queueDashboard'), action: 'queue' },
  ];

  // Remove router-based navigation logic since we're using state-based navigation now

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Navigation - Only show when needed */}
      {showNavigation && (
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div className="ml-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('misc.companyName')}
                  </span>
                </div>
              </div>

              {/* Language Toggle */}
              <div className="flex items-center">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>


    </div>
  );
};

export default Layout;
