import React from 'react';

const CheckboxGroup = ({ label, values, onChange, options, required, error, fieldName, inline, unstyled }) => {
  console.log(`CheckboxGroup ${fieldName} - error:`, error);
  
  const handleChange = (optionValue) => {
    const newValues = values.includes(optionValue)
      ? values.filter(v => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  };

  return (
    <div 
      className={`relative space-y-2 p-4 rounded-lg transition-all duration-300 ${
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
      </label>
      <div className={inline ? 'flex flex-wrap gap-x-6 gap-y-2' : 'space-y-2'}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center cursor-pointer transition-colors duration-200 ${
              unstyled ? '' : `p-3 border rounded-lg hover:bg-gray-50 ${error ? '!border-red-400 bg-white' : 'border-gray-300'}`
            }`}
          >
            <input
              type="checkbox"
              value={option.value}
              checked={values.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="ml-3 text-gray-700">{option.label}</span>
          </label>
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

export default CheckboxGroup;


