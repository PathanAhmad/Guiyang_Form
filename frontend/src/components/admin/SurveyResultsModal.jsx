import React, { useState } from 'react';
import SurveyResponseViewer from './SurveyResponseViewer';
import Button from '../ui/Button';
import { formatDate } from '../../utils/format';

const SurveyResultsModal = ({ isOpen, onClose, accessKeyData }) => {
  const [selectedResponse, setSelectedResponse] = useState(null);

  if (!isOpen || !accessKeyData) return null;

  const handleResponseClick = (response) => {
    setSelectedResponse(response);
  };

  const handleBack = () => {
    setSelectedResponse(null);
  };

  const handleClose = () => {
    setSelectedResponse(null);
    onClose();
  };

  // Handle ESC key to close
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (selectedResponse) {
          handleBack();
        } else {
          handleClose();
        }
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, selectedResponse]);

  const getFormTitle = (formId) => {
    const titles = {
      form1: 'Student Survey',
      form2: 'Teacher Assessment',
      form3: 'Equity & Inclusion',
      form4: 'Course Catalog',
    };
    return titles[formId] || formId;
  };

  const getRoleIcon = (roleType) => {
    const icons = {
      school: '🏫',
      educator: '👨‍🏫',
      learner: '🎓',
      special: '✨',
    };
    return icons[roleType] || '📋';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-full max-h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between border-b border-blue-700">
          <div className="flex items-center space-x-4">
            {selectedResponse && (
              <button
                onClick={handleBack}
                className="text-white hover:text-blue-100 transition-colors duration-200"
                aria-label="Go back"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedResponse ? getFormTitle(selectedResponse.formId) : 'Survey Results'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {selectedResponse ? (
                  <>Response Details</>
                ) : (
                  <>
                    {getRoleIcon(accessKeyData.roleType)} {accessKeyData.keyName}
                  </>
                )}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="text-white hover:text-blue-100 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {selectedResponse ? (
            /* Detailed Response View */
            <div className="max-w-5xl mx-auto">
              <SurveyResponseViewer response={selectedResponse} formId={selectedResponse.formId} />
            </div>
          ) : (
            /* Forms List View */
            <div className="max-w-6xl mx-auto">
              {/* Access Key Info Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Key Name</span>
                    <span className="font-medium text-gray-900">{accessKeyData.keyName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Role Type</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {getRoleIcon(accessKeyData.roleType)} {accessKeyData.roleType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Total Responses</span>
                    <span className="font-medium text-gray-900">{accessKeyData.totalResponses}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Submitted</span>
                    <span className="font-medium text-gray-900">{accessKeyData.submittedCount}</span>
                  </div>
                </div>
              </div>

              {/* Responses List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Submitted Forms</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {accessKeyData.responses.length} form{accessKeyData.responses.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {accessKeyData.responses.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Responses Yet</h4>
                    <p className="text-gray-500">This access key has not been used to submit any forms.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {accessKeyData.responses.map((response) => (
                      <div
                        key={response._id}
                        className="p-6 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {getFormTitle(response.formId)}
                              </h4>
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                response.status === 'submitted' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {response.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                              <div>
                                <span className="text-gray-500">Form Type:</span>{' '}
                                <span className="font-medium">{response.formType.replace(/_/g, ' ')}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Language:</span>{' '}
                                <span className="font-medium">{response.language === 'en' ? 'English' : 'Chinese'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Last Updated:</span>{' '}
                                <span className="font-medium">{formatDate(response.updatedAt)}</span>
                              </div>
                              {response.submittedAt && (
                                <div>
                                  <span className="text-gray-500">Submitted:</span>{' '}
                                  <span className="font-medium">{formatDate(response.submittedAt)}</span>
                                </div>
                              )}
                              {response.completedSections && response.completedSections.length > 0 && (
                                <div className="md:col-span-2">
                                  <span className="text-gray-500">Progress:</span>{' '}
                                  <span className="font-medium">
                                    {response.completedSections.length} section{response.completedSections.length !== 1 ? 's' : ''} completed
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <Button
                              onClick={() => handleResponseClick(response)}
                              variant="primary"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
          <Button onClick={handleClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyResultsModal;

