import React, { useState, useEffect } from 'react';
import { pilotSurveyAdminAPI } from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ConfirmModal from '../ui/ConfirmModal';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/format';
import SurveyResultsModal from './SurveyResultsModal';

const PilotSurveyResultsSection = () => {
  const { showToast } = useToast();
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccessKey, setSelectedAccessKey] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedSchools, setExpandedSchools] = useState({});

  useEffect(() => {
    loadSurveyResults();
  }, []);

  const loadSurveyResults = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      const response = await pilotSurveyAdminAPI.getAllResponses();
      setGroupedData(response.data.data || []);
    } catch (error) {
      console.error('Failed to load survey results:', error);
      showToast('Failed to load survey results', 'error');
    } finally {
      if (showLoadingSpinner) {
        setLoading(false);
      }
    }
  };

  const toggleSchool = (schoolId) => {
    setExpandedSchools(prev => ({
      ...prev,
      [schoolId]: !prev[schoolId]
    }));
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await pilotSurveyAdminAPI.exportResponses();
      
      // Response is now a ZIP file containing 4 CSVs (one per form)
      const contentType = response.headers['content-type'] || '';
      const isZip = contentType.includes('application/zip');
      
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'] || '';
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      let filename = filenameMatch && filenameMatch[1] ? filenameMatch[1].replace(/['"]/g, '') : null;
      
      // Fallback filename if not in header
      if (!filename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = isZip ? 'zip' : 'csv';
        filename = `pilot-survey-all-forms-${timestamp}.${extension}`;
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
      
      showToast('Exported 4 CSV files (one per form)', 'success');
    } catch (error) {
      console.error('Failed to export survey results:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to export survey results';
      showToast(msg, 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleViewResults = (accessKeyData) => {
    setSelectedAccessKey(accessKeyData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAccessKey(null);
  };

  const handleDeleteAll = (accessKeyData) => {
    setConfirmDelete(accessKeyData);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    try {
      const response = await pilotSurveyAdminAPI.deleteResponsesByAccessKey(confirmDelete.accessKey);
      if (response.data.success) {
        showToast(`Successfully deleted ${response.data.deletedCount} response${response.data.deletedCount !== 1 ? 's' : ''}`, 'success');
        loadSurveyResults(false);
      }
    } catch (error) {
      console.error('Failed to delete survey responses:', error);
      showToast('Failed to delete survey responses', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
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

  const getRoleLabel = (roleType) => {
    const labels = {
      school: 'School Management',
      educator: 'Educators',
      learner: 'Learners',
      special: 'Parents',
    };
    return labels[roleType] || roleType;
  };

  // Group data by school
  const bySchool = {};
  groupedData.forEach(item => {
    const schoolId = item.school?.id || 'unassigned';
    const schoolName = item.school?.schoolName || 'Unassigned';
    
    if (!bySchool[schoolId]) {
      bySchool[schoolId] = {
        schoolId,
        schoolName,
        isActive: item.school?.isActive ?? false,
        accessKeys: []
      };
    }
    bySchool[schoolId].accessKeys.push(item);
  });

  const schoolGroups = Object.values(bySchool);

  return (
    <>
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Pilot Survey Results by School</h3>
              <p className="mt-1 text-sm text-gray-500">
                {groupedData.length} access key{groupedData.length !== 1 ? 's' : ''} with survey responses across {schoolGroups.length} school{schoolGroups.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => loadSurveyResults(false)}
                variant="outline"
                className="bg-white"
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                onClick={handleExport}
                variant="primary"
                disabled={exporting || groupedData.length === 0}
              >
                {exporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading survey results...</p>
          </div>
        ) : groupedData.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Survey Responses Yet</h4>
            <p className="text-gray-500">
              Survey responses will appear here once users start submitting pilot surveys.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {schoolGroups.map(({ schoolId, schoolName, isActive, accessKeys }) => (
              <div key={schoolId} className="bg-white">
                {/* School Header */}
                <button
                  onClick={() => toggleSchool(schoolId)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedSchools[schoolId] ? 'transform rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="text-left">
                      <h4 className="text-base font-medium text-gray-900">{schoolName}</h4>
                      <p className="text-sm text-gray-500">
                        {accessKeys.length} key{accessKeys.length !== 1 ? 's' : ''} with responses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {accessKeys.reduce((sum, k) => sum + k.totalResponses, 0)} total responses
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </button>

                {/* Access Keys Table */}
                {expandedSchools[schoolId] && (
                  <div className="bg-gray-50">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Key Info
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Forms Submitted
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Responses
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Submission
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {accessKeys.map((item) => (
                            <tr key={item.accessKey} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <div className="font-medium text-gray-900">{item.keyName}</div>
                                  <div className="text-sm text-gray-500 font-mono">{item.accessKey}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{getRoleIcon(item.roleType)}</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {getRoleLabel(item.roleType)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="text-2xl font-bold text-blue-600">
                                    {item.submittedCount}
                                  </span>
                                  <span className="text-xs text-gray-500">submitted</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="text-lg font-semibold text-gray-900">
                                    {item.totalResponses}
                                  </span>
                                  <span className="text-xs text-gray-500">total</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.lastSubmissionDate ? (
                                  <div className="flex flex-col">
                                    <span>{formatDate(item.lastSubmissionDate)}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic">No submissions</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  item.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => handleViewResults(item)}
                                    variant="primary"
                                    size="sm"
                                    disabled={item.totalResponses === 0}
                                  >
                                    View Results
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteAll(item)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400"
                                    disabled={item.totalResponses === 0}
                                  >
                                    Delete All
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Survey Results Modal */}
      <SurveyResultsModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        accessKeyData={selectedAccessKey}
        onDataChanged={() => loadSurveyResults(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete All Survey Responses"
        message={
          confirmDelete
            ? `Are you sure you want to delete ALL survey responses for "${confirmDelete.keyName}" (${confirmDelete.accessKey})?\n\nThis will permanently delete ${confirmDelete.totalResponses} response${confirmDelete.totalResponses !== 1 ? 's' : ''} and cannot be undone.`
            : ''
        }
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default PilotSurveyResultsSection;

