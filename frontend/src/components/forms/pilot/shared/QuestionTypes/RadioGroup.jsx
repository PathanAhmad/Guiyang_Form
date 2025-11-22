import React from 'react';

const RadioGroup = ({ label, value, onChange, options, required, error, fieldName, renderInline }) => {
  console.log(`RadioGroup ${fieldName} - error:`, error);
  
  return (
    <div 
      className={`relative space-y-3 p-4 rounded-lg transition-all duration-300 ${
        error ? '!bg-red-50/50' : 'border-2 border-transparent'
      }`}
      data-field-name={fieldName}
    >
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
                {renderInline(option.value, error)}
              </div>
            )}
          </div>
        ))}
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1 p-1">
          <span className="text-red-600 text-sm">⚠️</span>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default RadioGroup;
