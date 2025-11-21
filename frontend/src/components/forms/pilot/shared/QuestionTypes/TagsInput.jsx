import React, { useState } from 'react';

const TagsInput = ({ label, value, onChange, placeholder, required, error, fieldName }) => {
  const [inputValue, setInputValue] = useState('');
  const tags = Array.isArray(value) ? value : (value ? String(value).split(',').filter(tag => tag.trim() !== '') : []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        onChange(newTags);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  return (
    <div className="p-4">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 pb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="w-full px-4 py-2 border rounded-lg flex flex-wrap items-center gap-2 border-gray-300">
        {tags.map((tag, index) => (
          <div key={index} className="bg-[#7c59b2]/100 text-white rounded-full px-2.5 py-1 text-sm flex items-center">
            <span>{tag}</span>
            <button
              type="button"
              className="ml-2 text-white hover:text-gray-300"
              onClick={() => removeTag(tag)}
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          id={fieldName}
          name={fieldName}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="flex-grow bg-transparent outline-none"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TagsInput;
