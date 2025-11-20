import React from 'react';

const TextInput = ({ label, value, onChange, placeholder, required, error, fieldName }) => {
  console.log(`TextInput ${fieldName} - error:`, error);
  
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
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
          error ? '!border-red-600 !bg-white !ring-2 !ring-red-300' : 'border-gray-300'
        }`}
      />
      {error && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 rounded">
          <span className="text-red-600 text-2xl">⚠️</span>
          <p className="text-base text-red-700 font-bold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TextInput;


