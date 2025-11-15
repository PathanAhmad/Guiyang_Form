import React from 'react';

const SurveySection = ({ title, subtitle, children }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default SurveySection;


