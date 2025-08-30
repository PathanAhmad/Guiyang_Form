import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../../utils/assets';
import LanguageToggle from './LanguageToggle';
 

const Layout = ({ children, showNavigation = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const logoSrc = assetUrl(i18n.language === 'zh' ? '/Images/SparkOSFullLogoChinese.svg' : '/Images/SparkOSFullLogo.svg');

  // Simplified navigation - only show when explicitly needed (for queue dashboard)
  const navigation = [
    { name: t('navigation.home'), action: 'home' },
    { name: t('navigation.queueDashboard'), action: 'queue' },
  ];

  // Remove router-based navigation logic since we're using state-based navigation now

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Simplified Navigation - Only show when needed */}
      {showNavigation && (
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <img
                  src={logoSrc}
                  alt={t('misc.companyName')}
                  className="h-8 w-auto"
                />
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
      <main className="w-full">
        {children}
      </main>


    </div>
  );
};

export default Layout;
