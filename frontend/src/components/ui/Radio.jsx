import React from 'react';
import { useId } from 'react';

const Radio = ({ 
  name, 
  value, 
  checked, 
  onChange, 
  label, 
  disabled = false,
  className = '',
  onBlur,
  onFocus
}) => {
  const id = useId();
  const radioId = `${id}-${value}`;

  return (
    <div className={`${className}`}>
      <div className="flex items-center">
        <input
          id={radioId}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2
            border-gray-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <label 
          htmlFor={radioId}
          className={`
            ml-3 text-sm font-medium text-gray-700 cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

// Radio Group Component for easier management
const RadioGroup = ({ 
  name, 
  value, 
  onChange, 
  options = [], 
  label, 
  error, 
  disabled = false,
  required = false,
  className = '',
  onBlur,
  onFocus
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Radio.Group = RadioGroup;

export default Radio;
