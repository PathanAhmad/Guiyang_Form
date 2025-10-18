import { forwardRef } from 'react';

const commonDialCodes = [
  { value: '+86', label: '+86' }, // China
  { value: '+1', label: '+1' }, // US/Canada
  { value: '+44', label: '+44' }, // UK
  { value: '+91', label: '+91' }, // India
  { value: '+61', label: '+61' }, // Australia
  { value: '+65', label: '+65' }, // Singapore
  { value: '+81', label: '+81' }, // Japan
  { value: '+49', label: '+49' }, // Germany
  { value: '+33', label: '+33' }, // France
  { value: '+852', label: '+852' }, // Hong Kong
  { value: '+886', label: '+886' } // Taiwan
];

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  hint,
  required = false,
  className = '',
  showCountryCode = false,
  countryCodeOptions = commonDialCodes,
  defaultDialCode = '+86',
  ...props
}, ref) => {
  const inputId = props.id || props.name;
  const valueStr = typeof props.value === 'string' ? props.value : (props.value ?? '').toString();

  // Parse combined value into dial code and number when showCountryCode is enabled
  let parsedDialCode = defaultDialCode;
  let parsedNumber = valueStr;
  if (showCountryCode) {
    const match = valueStr.match(/^\+(\d{1,4})\s?(.*)$/);
    if (match) {
      parsedDialCode = `+${match[1]}`;
      parsedNumber = match[2] || '';
    } else {
      parsedNumber = valueStr || '';
    }
  }
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && (
            <span className={`${error ? 'text-red-500' : 'text-gray-400'} ml-1`}>*</span>
          )}
        </label>
      )}

      {!showCountryCode && (
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
      )}

      {showCountryCode && (
        <div className={`flex items-stretch gap-2 ${className}`}>
          <select
            aria-label="Country code"
            className={`input-field w-28`}
            value={parsedDialCode}
            onChange={(e) => {
              const newCode = e.target.value;
              const combined = `${newCode} ${parsedNumber}`.trim();
              if (props.onChange) {
                props.onChange({ target: { value: combined, name: props.name } });
              }
            }}
          >
            {countryCodeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={`input-field flex-1 ${error ? 'input-error' : ''}`}
            value={parsedNumber}
            onChange={(e) => {
              const combined = `${parsedDialCode} ${e.target.value}`.trim();
              if (props.onChange) {
                props.onChange({ target: { value: combined, name: props.name } });
              }
            }}
            name={props.name}
            placeholder={props.placeholder}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
          />
        </div>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
