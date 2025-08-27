import React, { useState, useEffect } from 'react';
import { formsAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

const QueueDashboard = ({ onBack }) => {
  const [queueStatus, setQueueStatus] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [selectedFormType, setSelectedFormType] = useState('demo');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  
  const { showToast } = useToast();

  const formTypes = [
    { key: 'demo', label: 'Sparkie Demo', emoji: '🎯' },
    { key: 'showcase', label: 'System Showcase', emoji: '🚀' },
    { key: 'fasttrack', label: 'Fast-Track', emoji: '⚡' }
  ];

  const statusOptions = [
    { key: 'waiting', label: 'Waiting', emoji: '⏳', color: 'text-yellow-600' },
    { key: 'contacted', label: 'Contacted', emoji: '📞', color: 'text-blue-600' },
    { key: 'completed', label: 'Completed', emoji: '✅', color: 'text-green-600' },
    { key: 'cancelled', label: 'Cancelled', emoji: '❌', color: 'text-red-600' }
  ];

  useEffect(() => {
    loadQueueStatus();
    loadSubmissions();
  }, [selectedFormType]);

  const loadQueueStatus = async () => {
    try {
      const response = await formsAPI.getQueueStatus();
      setQueueStatus(response.data.data);
    } catch (error) {
      console.error('Failed to load queue status:', error);
      showToast('Failed to load queue status', 'error');
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await formsAPI.getSubmissions(selectedFormType, 1, 50);
      setSubmissions(response.data.data.submissions);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      showToast('Failed to load submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (token, newStatus) => {
    try {
      setUpdating(token);
      const response = await formsAPI.updateStatus(token, newStatus);
      
      if (response.data.success) {
        showToast(`Token ${token} updated to ${newStatus}`, 'success');
        
        // Show next in queue notification if available
        if (response.data.data.nextInQueue) {
          const next = response.data.data.nextInQueue;
          showToast(`Next in queue: ${next.token} (${next.name})`, 'info', 5000);
        }
        
        // Reload data
        await Promise.all([loadQueueStatus(), loadSubmissions()]);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusDisplay = (status) => {
    const statusInfo = statusOptions.find(s => s.key === status) || statusOptions[0];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} bg-gray-100`}>
        {statusInfo.emoji} {statusInfo.label}
      </span>
    );
  };

  const formatWaitingTime = (submittedAt) => {
    const now = new Date();
    const submitted = new Date(submittedAt);
    const diffMs = now - submitted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m`;
    } else {
      return `${diffMins}m`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Queue Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage form submissions and queue processing</p>
        </div>

        {/* Queue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {formTypes.map((formType) => {
            const status = queueStatus[formType.key] || {};
            const nextInQueue = status.nextInQueue;
            
            return (
              <Card key={formType.key} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {formType.emoji} {formType.label}
                  </h3>
                  <span className="text-2xl font-bold text-blue-600">
                    {status.waitingCount || 0}
                  </span>
                </div>
                
                {nextInQueue ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Next in queue:</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium text-blue-900">{nextInQueue.token}</p>
                      <p className="text-sm text-blue-700">{nextInQueue.name}</p>
                      <p className="text-xs text-blue-600">
                        Waiting: {nextInQueue.waitingTime}
                      </p>
                    </div>
                    <Button
                      onClick={() => updateSubmissionStatus(nextInQueue.token, 'contacted')}
                      variant="primary"
                      size="sm"
                      disabled={updating === nextInQueue.token}
                      className="w-full"
                    >
                      {updating === nextInQueue.token ? '⏳' : '📞'} Mark as Contacted
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tokens waiting</p>
                )}
              </Card>
            );
          })}
        </div>

        {/* Form Type Selector */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {formTypes.map((formType) => (
                <button
                  key={formType.key}
                  onClick={() => setSelectedFormType(formType.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedFormType === formType.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {formType.emoji} {formType.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Submissions Table */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {formTypes.find(f => f.key === selectedFormType)?.emoji} {' '}
              {formTypes.find(f => f.key === selectedFormType)?.label} Submissions
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No submissions found for {formTypes.find(f => f.key === selectedFormType)?.label}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waiting Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.token} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{submission.token}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                        {submission.phone && (
                          <div className="text-sm text-gray-500">{submission.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusDisplay(submission.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatWaitingTime(submission.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {submission.status === 'waiting' && (
                          <>
                            <Button
                              onClick={() => updateSubmissionStatus(submission.token, 'contacted')}
                              variant="primary"
                              size="sm"
                              disabled={updating === submission.token}
                            >
                              {updating === submission.token ? '⏳' : '📞'} Contact
                            </Button>
                            <Button
                              onClick={() => updateSubmissionStatus(submission.token, 'cancelled')}
                              variant="outline"
                              size="sm"
                              disabled={updating === submission.token}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              ❌ Cancel
                            </Button>
                          </>
                        )}
                        {submission.status === 'contacted' && (
                          <>
                            <Button
                              onClick={() => updateSubmissionStatus(submission.token, 'completed')}
                              variant="primary"
                              size="sm"
                              disabled={updating === submission.token}
                            >
                              {updating === submission.token ? '⏳' : '✅'} Complete
                            </Button>
                            <Button
                              onClick={() => updateSubmissionStatus(submission.token, 'cancelled')}
                              variant="outline"
                              size="sm"
                              disabled={updating === submission.token}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              ❌ Cancel
                            </Button>
                          </>
                        )}
                        {(submission.status === 'completed' || submission.status === 'cancelled') && (
                          <span className="text-gray-400">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QueueDashboard;
