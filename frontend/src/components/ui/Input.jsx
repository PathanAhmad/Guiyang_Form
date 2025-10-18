import { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  hint,
  required = false,
  className = '',
  ...props
}, ref) => {
  const inputId = props.id || props.name;
  
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
      
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      
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
