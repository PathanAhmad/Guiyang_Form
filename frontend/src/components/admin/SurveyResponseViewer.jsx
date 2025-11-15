import React from 'react';

const SurveyResponseViewer = ({ response, formId }) => {
  if (!response || !response.responses) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No response data available</p>
      </div>
    );
  }

  const responses = response.responses;

  // Helper function to format field names
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Helper function to format values
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Not answered</span>;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-400 italic">None selected</span>;
      }
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, idx) => (
            <li key={idx}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
          ))}
        </ul>
      );
    }
    
    if (typeof value === 'object') {
      return (
        <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    
    // Handle long text
    if (typeof value === 'string' && value.length > 100) {
      return <p className="whitespace-pre-wrap break-words">{value}</p>;
    }
    
    return <span>{String(value)}</span>;
  };

  // Group responses by section (if they have section prefixes like "section1_", "section2_", etc.)
  const groupedResponses = {};
  const ungroupedResponses = {};
  
  Object.entries(responses).forEach(([key, value]) => {
    const sectionMatch = key.match(/^section(\d+)_(.+)/);
    if (sectionMatch) {
      const sectionNum = sectionMatch[1];
      const fieldName = sectionMatch[2];
      if (!groupedResponses[sectionNum]) {
        groupedResponses[sectionNum] = {};
      }
      groupedResponses[sectionNum][fieldName] = value;
    } else {
      ungroupedResponses[key] = value;
    }
  });

  const sections = Object.keys(groupedResponses).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="space-y-6">
      {/* Metadata */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block mb-1">Form ID</span>
            <span className="font-medium text-gray-900">{response.formId}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Form Type</span>
            <span className="font-medium text-gray-900">{response.formType.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Status</span>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              response.status === 'submitted' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {response.status.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Language</span>
            <span className="font-medium text-gray-900">{response.language === 'en' ? 'English' : 'Chinese'}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Created At</span>
            <span className="font-medium text-gray-900">
              {new Date(response.createdAt).toLocaleString()}
            </span>
          </div>
          {response.submittedAt && (
            <div>
              <span className="text-gray-500 block mb-1">Submitted At</span>
              <span className="font-medium text-gray-900">
                {new Date(response.submittedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        {response.completedSections && response.completedSections.length > 0 && (
          <div className="mt-4">
            <span className="text-gray-500 block mb-2">Completed Sections</span>
            <div className="flex flex-wrap gap-2">
              {response.completedSections.map((section, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  {section}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sectioned Responses */}
      {sections.length > 0 && (
        <div className="space-y-4">
          {sections.map((sectionNum) => (
            <div key={sectionNum} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h4 className="text-md font-semibold text-gray-900">Section {sectionNum}</h4>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(groupedResponses[sectionNum]).map(([fieldName, value]) => (
                    <div key={fieldName} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {formatFieldName(fieldName)}
                      </div>
                      <div className="text-sm text-gray-900">
                        {formatValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ungrouped Responses */}
      {Object.keys(ungroupedResponses).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h4 className="text-md font-semibold text-gray-900">Other Responses</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(ungroupedResponses).map(([fieldName, value]) => (
                <div key={fieldName} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {formatFieldName(fieldName)}
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatValue(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sections.length === 0 && Object.keys(ungroupedResponses).length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No survey responses found</p>
        </div>
      )}
    </div>
  );
};

export default SurveyResponseViewer;

