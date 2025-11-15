import React, { useState, useEffect } from 'react';
import { deploymentAccessAPI } from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/format';

const DeploymentKeysSection = () => {
  const { showToast } = useToast();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    keyName: '',
    roleType: 'school',
    duration: '1month',
    maxUses: '100',
  });

  const roleTypes = [
    { value: 'school', label: 'School Management', icon: '🏫' },
    { value: 'educator', label: 'Educators', icon: '👨‍🏫' },
    { value: 'learner', label: 'Learners', icon: '🎓' },
    { value: 'special', label: 'Special Learners', icon: '✨' },
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

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      const response = await deploymentAccessAPI.listKeys();
      setKeys(response.data.data || []);
    } catch (error) {
      console.error('Failed to load deployment keys:', error);
      showToast('Failed to load deployment keys', 'error');
    } finally {
      if (showLoadingSpinner) {
        setLoading(false);
      }
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    
    if (!formData.keyName.trim()) {
      showToast('Please enter a key name', 'error');
      return;
    }

    try {
      setCreating(true);
      const response = await deploymentAccessAPI.createKey(formData);
      
      if (response.data.success) {
        showToast('Access key created successfully!', 'success');
        setFormData({
          keyName: '',
          roleType: 'school',
          duration: '1month',
          maxUses: '100',
        });
        loadKeys(false);
      }
    } catch (error) {
      console.error('Failed to create key:', error);
      showToast(error.response?.data?.error || 'Failed to create key', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyKey = (accessKey) => {
    navigator.clipboard.writeText(accessKey);
    showToast('Access key copied to clipboard!', 'success');
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this access key?')) {
      return;
    }

    try {
      const response = await deploymentAccessAPI.deactivateKey(id);
      if (response.data.success) {
        showToast('Access key deactivated', 'success');
        loadKeys(false);
      }
    } catch (error) {
      console.error('Failed to deactivate key:', error);
      showToast('Failed to deactivate key', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this access key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await deploymentAccessAPI.deleteKey(id);
      if (response.data.success) {
        showToast('Access key deleted', 'success');
        loadKeys(false);
      }
    } catch (error) {
      console.error('Failed to delete key:', error);
      showToast('Failed to delete key', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      deactivated: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
      'maxed-out': 'bg-yellow-100 text-yellow-800',
    };
    return badges[status] || badges.active;
  };

  const getRoleIcon = (roleType) => {
    const role = roleTypes.find(r => r.value === roleType);
    return role ? role.icon : '📋';
  };

  return (
    <div className="space-y-6">
      {/* Create New Key Form */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Create New Access Key</h3>
          <p className="mt-1 text-sm text-gray-500">Generate a new access key for deployment portal access</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name / Description
                </label>
                <input
                  type="text"
                  id="keyName"
                  value={formData.keyName}
                  onChange={(e) => setFormData({ ...formData, keyName: e.target.value })}
                  placeholder="e.g., School ABC Main Access"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                />
              </div>

              <div>
                <label htmlFor="roleType" className="block text-sm font-medium text-gray-700 mb-1">
                  Role Type
                </label>
                <select
                  id="roleType"
                  value={formData.roleType}
                  onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                >
                  {roleTypes.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.icon} {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                >
                  {durations.map(duration => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Uses
                </label>
                <select
                  id="maxUses"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                >
                  {maxUsesOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={creating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {creating ? 'Generating...' : 'Generate Access Key'}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Access Keys List */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Access Keys</h3>
              <p className="mt-1 text-sm text-gray-500">{keys.length} total keys</p>
            </div>
            <Button
              onClick={loadKeys}
              variant="outline"
              className="bg-white"
            >
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading keys...</p>
          </div>
        ) : keys.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No access keys created yet. Create your first key above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
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
                {keys.map((key) => (
                  <tr key={key._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{key.keyName}</div>
                      <div className="text-xs text-gray-500">
                        Created {formatDate(key.createdAt)}
                      </div>
                      {key.expiresAt && (
                        <div className="text-xs text-gray-500">
                          Expires {formatDate(key.expiresAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{getRoleIcon(key.roleType)}</span>
                        <span className="text-sm text-gray-900 capitalize">{key.roleType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                          {key.accessKey}
                        </code>
                        <button
                          onClick={() => handleCopyKey(key.accessKey)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {key.usageCount} / {key.maxUses || '∞'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(key.status)}`}>
                        {key.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {key.isActive && (
                        <button
                          onClick={() => handleDeactivate(key._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Deactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(key._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DeploymentKeysSection;

