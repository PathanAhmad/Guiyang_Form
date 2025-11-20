import React from 'react';

// Format any incoming value for display as DD/MM/YYYY (if we get ISO, normalize it)
const getDisplayValue = (value) => {
  if (!value) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  return value;
};

// Simple numeric mask: user types digits, we auto-insert slashes as DD/MM/YYYY
const maskToDdMmYyyy = (raw) => {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 8); // max 8 digits

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const DateInput = ({ label, value, onChange, placeholder, required, error, fieldName }) => {
  console.log(`DateInput ${fieldName} - error:`, error);

  const displayValue = getDisplayValue(value);

  const handleChange = (e) => {
    const masked = maskToDdMmYyyy(e.target.value);
    onChange(masked);
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
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
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

export default DateInput;


