import React from 'react';

const CheckboxGroup = ({ label, values = [], onChange, options, required, error }) => {
  const handleChange = (optionValue) => {
    const newValues = values.includes(optionValue)
      ? values.filter(v => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
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
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CheckboxGroup;


