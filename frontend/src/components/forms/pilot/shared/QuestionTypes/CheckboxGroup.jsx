import React from 'react';

const CheckboxGroup = ({ label, values, onChange, options, required, error, fieldName, inline, unstyled, renderInline, alignStart }) => {
  console.log(`CheckboxGroup ${fieldName} - error:`, error);
  
  const handleChange = (optionValue) => {
    const newValues = values.includes(optionValue)
      ? values.filter(v => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  };

  return (
    <div 
      className={`relative space-y-2 rounded-lg transition-all duration-300 ${
        unstyled ? '' : 'p-4'
      } ${
        error ? '!bg-red-50/50' : 'border-2 border-transparent'
      }`}
      data-field-name={fieldName}
    >
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={inline ? 'flex flex-wrap gap-x-6 gap-y-2' : 'space-y-2'}>
        {options.map((option) => (
          <div key={option.value}>
            <label
              className={`flex ${alignStart ? 'items-start' : 'items-center'} cursor-pointer transition-colors duration-200 ${
                unstyled ? '' : `p-3 border rounded-lg hover:bg-gray-50 ${error ? '!border-red-400 bg-white' : 'border-gray-300'}`
              }`}
            >
              <input
                type="checkbox"
                value={option.value}
                checked={values.includes(option.value)}
                onChange={() => handleChange(option.value)}
                className={`w-4 h-4 text-primary-500 rounded focus:ring-primary-500 ${alignStart ? 'mt-1' : ''}`}
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
            {renderInline && values.includes(option.value) && (
              <div className="pl-0 pt-2">
                {renderInline(option.value)}
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

export default CheckboxGroup;
