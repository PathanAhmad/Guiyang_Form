import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LogoEn from '@/Images/SparkOSFullLogo.svg';
import LogoZh from '@/Images/SparkOSFullLogoChinese.svg';

const Footer = () => {
  const { i18n, t } = useTranslation();
  const logoSrc = i18n.language === 'zh' ? LogoZh : LogoEn;

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start">
            <img src={logoSrc} alt="Spark-OS" className="h-12 w-auto" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('footer.survey')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/survey/management" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.links.management')}</Link>
              </li>
              <li>
                <Link to="/survey/educators" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.links.educators')}</Link>
              </li>
              <li>
                <Link to="/survey/learners" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.links.learners')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <span className="text-gray-900 font-medium">Aletheia:</span>{' '}
                <a href="https://aletheia.sg" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">aletheia.sg</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('footer.product')}</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <span className="text-gray-900 font-medium">SparkOS:</span>{' '}
                <a href="https://spark-os.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">spark-os.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


