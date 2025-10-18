import React, { useState } from 'react';
import { useId } from 'react';
import Input from './Input';

const Checkbox = ({ 
  name, 
  value, 
  checked, 
  onChange, 
  label, 
  error, 
  disabled = false,
  className = '',
  required = false,
  onBlur,
  onFocus
}) => {
  const id = useId();
  const checkboxId = `${id}-${value}`;

  return (
    <div className={`${className}`}>
      <div className="flex items-center">
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <label 
          htmlFor={checkboxId}
          className={`
            ml-3 text-sm font-medium text-gray-700 cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {label}
          {required && (
            <span className={`${error ? 'text-red-500' : 'text-gray-400'} ml-1`}>*</span>
          )}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Checkbox Group Component for easier management
const CheckboxGroup = ({ 
  name, 
  values = [], 
  onChange, 
  options = [], 
  label, 
  error, 
  disabled = false,
  required = false,
  maxSelection = null,
  className = '',
  otherOption = false,
  otherValue = '',
  onOtherChange = () => {},
  otherPlaceholder = 'Please specify',
  onBlur,
  onFocus
}) => {
  const [showOtherInput, setShowOtherInput] = useState(
    otherOption && values.includes('other')
  );

  const handleCheckboxChange = (optionValue, checked) => {
    let newValues;
    if (checked) {
      // Check max selection limit
      if (maxSelection && values.length >= maxSelection) {
        return; // Don't allow more selections
      }
      newValues = [...values, optionValue];
    } else {
      newValues = values.filter(v => v !== optionValue);
    }

    // Handle "other" option visibility
    if (optionValue === 'other') {
      setShowOtherInput(checked);
      if (!checked) {
        onOtherChange(''); // Clear other input when unchecked
      }
    }

    onChange(newValues);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {required && (
            <span className={`${error ? 'text-red-500' : 'text-gray-400'} ml-1`}>*</span>
          )}
          {maxSelection && (
            <span className="text-sm text-gray-500 ml-2">
              (Select up to {maxSelection})
            </span>
          )}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = values.includes(option.value);
          const isDisabled = disabled || (
            maxSelection && 
            !isChecked && 
            values.length >= maxSelection
          );

          return (
            <div key={option.value}>
              <Checkbox
                name={name}
                value={option.value}
                label={option.label}
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                disabled={isDisabled}
                onBlur={onBlur}
                onFocus={onFocus}
                required={required}
                error={error}
              />
              {/* Show other input if this is the "other" option and it's checked */}
              {option.value === 'other' && showOtherInput && (
                <div className="ml-7 mt-2">
                  <Input
                    name={`${name}_other`}
                    value={otherValue}
                    onChange={(e) => onOtherChange(e.target.value)}
                    placeholder={otherPlaceholder}
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {maxSelection && values.length >= maxSelection && (
        <p className="mt-2 text-sm text-amber-600">
          Maximum of {maxSelection} selections reached
        </p>
      )}
    </div>
  );
};

Checkbox.Group = CheckboxGroup;

export default Checkbox;
