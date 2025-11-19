import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SurveyProgress = ({ currentSection, totalSections, completedSections = [] }) => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const progress = (completedSections.length / totalSections) * 100;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on initial render

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`px-6 py-4 sticky top-0 z-10 transition-all duration-200 ${isScrolled ? 'backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t('pilotSurveys:form.progress', { current: currentSection, total: totalSections })}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% {t('pilotSurveys:surveyList.progress').replace(/{{percent}}%/, '')}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SurveyProgress;


