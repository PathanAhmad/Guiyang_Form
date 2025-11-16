import React, { useState } from 'react';
import SurveyResponseViewer from './SurveyResponseViewer';
import Button from '../ui/Button';
import { formatDate } from '../../utils/format';
import { pilotSurveyAdminAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const SurveyResultsModal = ({ isOpen, onClose, accessKeyData, onDataChanged }) => {
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [localResponses, setLocalResponses] = useState([]);
  const { showToast } = useToast();

  // Update local responses when accessKeyData changes
  React.useEffect(() => {
    if (accessKeyData?.responses) {
      setLocalResponses(accessKeyData.responses);
    }
  }, [accessKeyData]);

  // Handle ESC key to close
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (selectedResponse) {
          setSelectedResponse(null);
        } else {
          setSelectedResponse(null);
          onClose();
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
  }, [isOpen, selectedResponse, onClose]);

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

  const handleExportCSV = async () => {
    try {
      if (!accessKeyData || !accessKeyData.accessKey) return;
      setExporting(true);
      const response = await pilotSurveyAdminAPI.exportResponsesByAccessKey(accessKeyData.accessKey);
      
      // Detect content type from response headers
      const contentType = response.headers['content-type'] || '';
      const isZip = contentType.includes('application/zip');
      
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'] || '';
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      let filename = filenameMatch && filenameMatch[1] ? filenameMatch[1].replace(/['"]/g, '') : null;
      
      // Fallback filename if not in header
      if (!filename) {
        const sanitize = (str) => (str || '').toString()
          .replace(/[^a-zA-Z0-9-_]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileKeyName = sanitize(accessKeyData.keyName);
        const fileAccessKey = sanitize(accessKeyData.accessKey);
        const extension = isZip ? 'zip' : 'csv';
        filename = `pilot-survey-responses-${fileKeyName}-${fileAccessKey}-${timestamp}.${extension}`;
      }
      
      // Create blob with appropriate type
      const blobType = isZip ? 'application/zip' : 'text/csv;charset=utf-8;';
      const blob = new Blob([response.data], { type: blobType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Count forms from accessKeyData
      const formCount = accessKeyData?.responses?.length || 1;
      const message = formCount > 1 
        ? `Exported ${formCount} forms successfully!`
        : 'Survey results exported successfully!';
      showToast && showToast(message, 'success');
    } catch (error) {
      console.error('Failed to export survey results:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to export survey results';
      showToast && showToast(msg, 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleBackdropClick = () => {
    if (selectedResponse) {
      handleBack();
    } else {
      handleClose();
    }
  };

  const handleDeleteAllResponses = async () => {
    if (!accessKeyData) return;
    
    const confirmMessage = `Are you sure you want to delete ALL survey responses for "${accessKeyData.keyName}" (${accessKeyData.accessKey})?\n\nThis will permanently delete ${localResponses.length} response${localResponses.length !== 1 ? 's' : ''} and cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(true);
      const response = await pilotSurveyAdminAPI.deleteResponsesByAccessKey(accessKeyData.accessKey);
      if (response.data.success) {
        showToast && showToast(`Successfully deleted ${response.data.deletedCount} response${response.data.deletedCount !== 1 ? 's' : ''}`, 'success');
        onClose();
        onDataChanged && onDataChanged();
      }
    } catch (error) {
      console.error('Failed to delete survey responses:', error);
      const msg = error?.message || 'Failed to delete survey responses';
      showToast && showToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteResponse = async (response) => {
    const confirmMessage = `Are you sure you want to delete this response?\n\nForm: ${getFormTitle(response.formId)}\nStatus: ${response.status}\n\nThis action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(true);
      const deleteResponse = await pilotSurveyAdminAPI.deleteResponse(response._id);
      if (deleteResponse.data.success) {
        showToast && showToast('Response deleted successfully', 'success');
        
        // Remove from local list
        const updatedResponses = localResponses.filter(r => r._id !== response._id);
        setLocalResponses(updatedResponses);
        
        // If no responses left, close modal
        if (updatedResponses.length === 0) {
          onClose();
        }
        
        // Notify parent to refresh
        onDataChanged && onDataChanged();
      }
    } catch (error) {
      console.error('Failed to delete response:', error);
      const msg = error?.message || 'Failed to delete response';
      showToast && showToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back and Export buttons */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={selectedResponse ? handleBack : handleClose}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          <div className="flex space-x-2">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              disabled={exporting || deleting || (localResponses.length === 0)}
            >
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Button
              onClick={handleDeleteAllResponses}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400"
              disabled={deleting || exporting || (localResponses.length === 0)}
            >
              {deleting ? 'Deleting...' : 'Delete All'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50 max-h-[70vh] overflow-y-auto">
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
                    {localResponses.length} form{localResponses.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {localResponses.length === 0 ? (
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
                    {localResponses.map((response) => (
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
                          
                          <div className="ml-4 flex space-x-2">
                            <Button
                              onClick={() => handleResponseClick(response)}
                              variant="primary"
                              size="sm"
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => handleDeleteResponse(response)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400"
                              disabled={deleting}
                            >
                              Delete
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
      </div>
    </div>
  );
};

export default SurveyResultsModal;

