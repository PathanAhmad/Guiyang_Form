import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  hint,
  required = false,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const textareaId = props.id || props.name;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`input-field resize-y ${error ? 'input-error' : ''} ${className}`}
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

Textarea.displayName = 'Textarea';

export default Textarea;
