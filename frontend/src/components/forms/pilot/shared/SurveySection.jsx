import React from 'react';

const SurveySection = ({ title, subtitle, children, paddingClass = 'py-8' }) => {
  return (
    <div className={`max-w-4xl mx-auto ${paddingClass}`}>
      <div className="mb-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
};

export default SurveySection;





