import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, hint, required = false, className = '', options = [], ...props }, ref) => {
  const inputId = props.id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;


