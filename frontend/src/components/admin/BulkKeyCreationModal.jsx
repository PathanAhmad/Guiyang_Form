import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const BulkKeyCreationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  schools = [],
  loading = false 
}) => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [duration, setDuration] = useState('1month');
  const [maxUses, setMaxUses] = useState('100');
  const [keys, setKeys] = useState([
    { id: 1, keyName: '', roleType: 'learner' }
  ]);
  const [errors, setErrors] = useState({});

  const roleTypes = [
    { value: 'school', label: 'School Management' },
    { value: 'educator', label: 'Educators' },
    { value: 'learner', label: 'Learners' },
    { value: 'special', label: 'Parents' },
  ];

  const durations = [
    { value: '1day', label: '1 Day' },
    { value: '1week', label: '1 Week' },
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: 'never', label: 'Never Expires' },
  ];

  const maxUsesOptions = [
    { value: '1', label: '1 time' },
    { value: '5', label: '5 times' },
    { value: '10', label: '10 times' },
    { value: '25', label: '25 times' },
    { value: '50', label: '50 times' },
    { value: '100', label: '100 times' },
    { value: 'unlimited', label: 'Unlimited' },
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSchool(schools.length > 0 ? schools[0]._id : '');
      setDuration('1month');
      setMaxUses('100');
      setKeys([{ id: 1, keyName: '', roleType: 'learner' }]);
      setErrors({});
    }
  }, [isOpen, schools]);

  const addKeyRow = () => {
    const newId = Math.max(...keys.map(k => k.id), 0) + 1;
    setKeys([...keys, { id: newId, keyName: '', roleType: 'learner' }]);
  };

  const removeKeyRow = (id) => {
    if (keys.length > 1) {
      setKeys(keys.filter(k => k.id !== id));
      // Clear errors for this row
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`key_${id}`];
        return newErrors;
      });
    }
  };

  const updateKey = (id, field, value) => {
    setKeys(keys.map(k => 
      k.id === id ? { ...k, [field]: value } : k
    ));
    // Clear error for this field
    if (errors[`key_${id}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`key_${id}`];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedSchool) {
      newErrors.school = 'Please select a school';
    }

    keys.forEach(key => {
      if (!key.keyName.trim()) {
        newErrors[`key_${key.id}`] = 'Key name is required';
      } else if (key.keyName.trim().length < 2) {
        newErrors[`key_${key.id}`] = 'Key name must be at least 2 characters';
      }
    });

    // Check for duplicate key names
    const keyNames = keys.map(k => k.keyName.trim().toLowerCase()).filter(Boolean);
    const duplicates = keyNames.filter((name, index) => keyNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      newErrors.duplicate = 'Duplicate key names are not allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const formattedKeys = keys.map(k => ({
      keyName: k.keyName.trim(),
      roleType: k.roleType,
    }));

    onSubmit({
      schoolId: selectedSchool,
      duration,
      maxUses,
      keys: formattedKeys,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Create Multiple Access Keys
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* School Selection */}
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                  School <span className="text-red-500">*</span>
                </label>
                <select
                  id="school"
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    if (errors.school) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.school;
                        return newErrors;
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.school ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading || schools.length === 0}
                >
                  {schools.length === 0 ? (
                    <option value="">No schools available</option>
                  ) : (
                    schools.map(school => (
                      <option key={school._id} value={school._id}>
                        {school.schoolName}
                      </option>
                    ))
                  )}
                </select>
                {errors.school && (
                  <p className="mt-1 text-sm text-red-500">{errors.school}</p>
                )}
                {schools.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600">
                    Please create a school first before creating access keys.
                  </p>
                )}
              </div>

              {/* Global Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (applies to all)
                  </label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    {durations.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Uses (applies to all)
                  </label>
                  <select
                    id="maxUses"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    {maxUsesOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keys Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Access Keys <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500">
                    {keys.length} key{keys.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {errors.duplicate && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    {errors.duplicate}
                  </div>
                )}

                <div className="space-y-2">
                  {keys.map((key, index) => (
                    <div key={key.id} className="flex items-start space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={key.keyName}
                          onChange={(e) => updateKey(key.id, 'keyName', e.target.value)}
                          placeholder={`e.g., Student ${index + 1} - John Doe`}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`key_${key.id}`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={loading}
                        />
                        {errors[`key_${key.id}`] && (
                          <p className="mt-1 text-xs text-red-500">{errors[`key_${key.id}`]}</p>
                        )}
                      </div>
                      <select
                        value={key.roleType}
                        onChange={(e) => updateKey(key.id, 'roleType', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        {roleTypes.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeKeyRow(key.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={keys.length === 1 || loading}
                        title="Remove key"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={addKeyRow}
                  variant="outline"
                  className="mt-3 w-full bg-white"
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Another Key
                </Button>
              </div>

              {/* Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Preview</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Creating <strong>{keys.length}</strong> access key{keys.length !== 1 ? 's' : ''}</p>
                  <p>• Duration: <strong>{durations.find(d => d.value === duration)?.label}</strong></p>
                  <p>• Max Uses: <strong>{maxUsesOptions.find(o => o.value === maxUses)?.label}</strong></p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={loading}
                className="bg-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || schools.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  `Create ${keys.length} Key${keys.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkKeyCreationModal;




