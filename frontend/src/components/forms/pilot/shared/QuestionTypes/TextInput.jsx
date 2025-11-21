import React from 'react';

const TextInput = ({ label, value, onChange, placeholder, required, error, fieldName, containerClassName }) => {
  console.log(`TextInput ${fieldName} - error:`, error);
  
  return (
    <div 
      className={`relative space-y-2 p-4 rounded-lg transition-all duration-300 ${
        error ? '!bg-red-50/50' : 'border-2 border-transparent'
      } ${containerClassName || ''}`}
      data-field-name={fieldName}
    >
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
          error ? '!border-red-400 !bg-white !ring-1 !ring-red-200' : 'border-gray-300'
        }`}
      />
      {error && (
        <div className="flex items-center gap-1 mt-1 p-1">
          <span className="text-red-600 text-sm">⚠️</span>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TextInput;
