import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from '../locales/en/common.json';
import enPilotSurveys from '../locales/en/pilotSurveys.json';
import enForm1 from '../locales/en/form1.json';
import enForm2 from '../locales/en/form2.json';
import enForm3 from '../locales/en/form3.json';
import enForm4 from '../locales/en/form4.json';
import enDeploymentHome from '../locales/en/deploymentHome.json';
import enDeploymentLogin from '../locales/en/deploymentLogin.json';
import enDeploymentDashboard from '../locales/en/deploymentDashboard.json';

// Import legacy translations (for backward compatibility)
import enLegacy from '../locales/en.json';
import zhLegacy from '../locales/zh.json';

// Import Chinese translations
import zhCommon from '../locales/zh/common.json';
import zhPilotSurveys from '../locales/zh/pilotSurveys.json';
import zhForm1 from '../locales/zh/form1.json';
import zhForm2 from '../locales/zh/form2.json';
import zhForm3 from '../locales/zh/form3.json';
import zhForm4 from '../locales/zh/form4.json';
import zhDeploymentHome from '../locales/zh/deploymentHome.json';
import zhDeploymentLogin from '../locales/zh/deploymentLogin.json';
import zhDeploymentDashboard from '../locales/zh/deploymentDashboard.json';

const resources = {
  en: {
    translation: enLegacy, // Keep legacy translations for backward compatibility
    common: enCommon,
    pilotSurveys: enPilotSurveys,
    form1: enForm1,
    form2: enForm2,
    form3: enForm3,
    form4: enForm4,
    deploymentHome: enDeploymentHome,
    deploymentLogin: enDeploymentLogin,
    deploymentDashboard: enDeploymentDashboard,
  },
  zh: {
    translation: zhLegacy, // Keep legacy translations for backward compatibility
    common: zhCommon,
    pilotSurveys: zhPilotSurveys,
    form1: zhForm1,
    form2: zhForm2,
    form3: zhForm3,
    form4: zhForm4,
    deploymentHome: zhDeploymentHome,
    deploymentLogin: zhDeploymentLogin,
    deploymentDashboard: zhDeploymentDashboard,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    ns: ['translation', 'common', 'pilotSurveys', 'form1', 'form2', 'form3', 'form4', 'deploymentHome', 'deploymentLogin', 'deploymentDashboard'], // Declare namespaces
    defaultNS: 'translation', // Default namespace for backward compatibility
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
