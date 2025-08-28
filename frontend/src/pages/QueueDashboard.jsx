import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formsAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/format';

const QueueDashboard = ({ onBack }) => {
  const { t } = useTranslation();
  const [queueStatus, setQueueStatus] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [selectedFormType, setSelectedFormType] = useState('demo');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  
  const { showToast } = useToast();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      showToast(t('common.logoutSuccess'), 'success');
      // Redirect to main site after logout
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
      showToast(t('common.logoutFailed'), 'error');
    }
  };

  const formTypes = [
    { key: 'demo', label: t('homepage.forms.demo.title') },
    { key: 'showcase', label: t('homepage.forms.showcase.title') },
    { key: 'fasttrack', label: t('homepage.forms.fasttrack.title') }
  ];

  const statusOptions = [
    { key: 'waiting', label: t('queue.statuses.waiting'), color: 'text-primary-200' },
    { key: 'contacted', label: t('queue.statuses.contacted'), color: 'text-primary-400' },
    { key: 'completed', label: t('queue.statuses.completed'), color: 'text-green-600' },
    { key: 'cancelled', label: t('queue.statuses.cancelled'), color: 'text-red-600' }
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
      showToast(t('queue.error'), 'error');
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await formsAPI.getSubmissions(selectedFormType, 1, 50);
      setSubmissions(response.data.data.submissions);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      showToast(t('queue.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (token, newStatus) => {
    try {
      setUpdating(token);
      const response = await formsAPI.updateStatus(token, newStatus);
      
      if (response.data.success) {
        showToast(`${t('queue.columns.token')} ${token} ${t('common.updated')} ${t('queue.statuses.' + newStatus)}`, 'success');
        
        // Show next in queue notification if available
        if (response.data.data.nextInQueue) {
          const next = response.data.data.nextInQueue;
          showToast(`${t('common.nextInQueue')}: ${next.token} (${next.name})`, 'info', 5000);
        }
        
        // Reload data
        await Promise.all([loadQueueStatus(), loadSubmissions()]);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast(t('queue.error'), 'error');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusDisplay = (status) => {
    const statusInfo = statusOptions.find(s => s.key === status) || statusOptions[0];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} bg-gray-100`}>
        {statusInfo.label}
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
    <div className="min-h-screen bg-primary-50/40 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('common.adminDashboard')}</h1>
              <p className="mt-2 text-gray-600">{t('common.queueManagement')}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.userid}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role} {t('common.access')}
                </p>
              </div>
              
              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white hover:bg-red-50 border-gray-300 text-gray-700 hover:text-red-700 hover:border-red-300 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              >
                {t('common.logout')}
              </Button>
              
              {/* Back to Site */}
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              >
                {t('common.mainSite')}
              </Button>
            </div>
          </div>
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
                    {formType.label}
                  </h3>
                  <span className="text-2xl font-bold text-primary-400">
                    {status.waitingCount || 0}
                  </span>
                </div>
                
                {nextInQueue ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">{t('common.nextInQueue')}:</p>
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <p className="font-medium text-primary-500">{nextInQueue.token}</p>
                      <p className="text-sm text-primary-400">{nextInQueue.name}</p>
                      <p className="text-xs text-primary-400">
                        {t('queue.columns.waitingTime')}: {nextInQueue.waitingTime}
                      </p>
                    </div>
                    <Button
                      onClick={() => updateSubmissionStatus(nextInQueue.token, 'contacted')}
                      variant="primary"
                      size="sm"
                      disabled={updating === nextInQueue.token}
                      className="w-full"
                    >
                      {updating === nextInQueue.token ? t('common.updating') : t('queue.actions.markContacted')}
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">{t('queue.noTokensWaiting')}</p>
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
                  {formType.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Submissions Table */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {formTypes.find(f => f.key === selectedFormType)?.label} {t('queue.submissions')}
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">{t('queue.loadingSubmissions')}</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {t('queue.noSubmissionsFound')} {formTypes.find(f => f.key === selectedFormType)?.label}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('queue.columns.token')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('queue.columns.contactInfo')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('queue.columns.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('queue.columns.waitingTime')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('queue.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.token} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{submission.token}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(submission.submittedAt)}
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
                              {updating === submission.token ? t('common.updating') : t('queue.actions.contact')}
                            </Button>
                            <Button
                              onClick={() => updateSubmissionStatus(submission.token, 'cancelled')}
                              variant="outline"
                              size="sm"
                              disabled={updating === submission.token}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              {t('queue.actions.cancel')}
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
                              {updating === submission.token ? t('common.updating') : t('queue.actions.complete')}
                            </Button>
                            <Button
                              onClick={() => updateSubmissionStatus(submission.token, 'cancelled')}
                              variant="outline"
                              size="sm"
                              disabled={updating === submission.token}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              {t('queue.actions.cancel')}
                            </Button>
                          </>
                        )}
                        {(submission.status === 'completed' || submission.status === 'cancelled') && (
                          <span className="text-gray-400">{t('queue.noActionsAvailable')}</span>
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
