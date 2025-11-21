import React from 'react';

const RadioGroup = ({ label, value, onChange, options, required, error, fieldName, renderInline }) => {
  console.log(`RadioGroup ${fieldName} - error:`, error);
  
  return (
    <div 
      className={`relative space-y-3 p-4 rounded-lg transition-all duration-300 ${
        error ? '!bg-red-100 !border-4 !border-red-600' : 'border-2 border-transparent'
      }`}
      data-field-name={fieldName}
      style={error ? {
        borderColor: '#DC2626',
        borderWidth: '4px',
        borderStyle: 'solid',
        backgroundColor: '#FEE2E2'
      } : {}}
    >
      {error && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
      )}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value}>
            <label
              className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                error ? '!border-red-400 bg-white' : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
            {renderInline && value === option.value && (
              <div className="pl-0 pt-2">
                {renderInline(option.value)}
              </div>
            )}
          </div>
        ))}
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 rounded">
          <span className="text-red-600 text-2xl">⚠️</span>
          <p className="text-base text-red-700 font-bold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default RadioGroup;


