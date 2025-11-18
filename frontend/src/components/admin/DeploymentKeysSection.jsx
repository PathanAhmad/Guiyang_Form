import React, { useState, useEffect } from 'react';
import { deploymentAccessAPI, schoolAPI } from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ConfirmModal from '../ui/ConfirmModal';
import BulkKeyCreationModal from './BulkKeyCreationModal';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/format';

const DeploymentKeysSection = () => {
  const { showToast } = useToast();
  const [keys, setKeys] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [expandedSchools, setExpandedSchools] = useState({});
  const [formData, setFormData] = useState({
    keyName: '',
    roleType: 'school',
    duration: '1month',
    maxUses: '100',
    schoolId: '',
  });
  
  // Confirmation modal state
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmSchoolAction, setConfirmSchoolAction] = useState(null);

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
    loadData();
  }, []);

  const loadData = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      const [keysResponse, schoolsResponse] = await Promise.all([
        deploymentAccessAPI.listKeys(),
        schoolAPI.list()
      ]);
      setKeys(keysResponse.data.data || []);
      setSchools(schoolsResponse.data.data || []);
      
      // Set default school if not set
      if (schoolsResponse.data.data.length > 0 && !formData.schoolId) {
        setFormData(prev => ({ ...prev, schoolId: schoolsResponse.data.data[0]._id }));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data', 'error');
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

    if (!formData.schoolId) {
      showToast('Please select a school', 'error');
      return;
    }

    try {
      setCreating(true);
      const response = await deploymentAccessAPI.createKey(formData);
      
      if (response.data.success) {
        showToast('Access key created successfully!', 'success');
        setFormData(prev => ({
          ...prev,
          keyName: '',
          roleType: 'school',
          duration: '1month',
          maxUses: '100',
        }));
        loadData(false);
      }
    } catch (error) {
      console.error('Failed to create key:', error);
      showToast(error.response?.data?.error || 'Failed to create key', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreate = async (bulkData) => {
    try {
      const response = await deploymentAccessAPI.createBulkKeys(bulkData);
      
      if (response.data.success) {
        const { totalCreated, totalFailed } = response.data.data;
        if (totalFailed > 0) {
          showToast(
            `Created ${totalCreated} key(s), ${totalFailed} failed`,
            'warning'
          );
        } else {
          showToast(`Successfully created ${totalCreated} access key(s)!`, 'success');
        }
        setBulkModalOpen(false);
        loadData(false);
      }
    } catch (error) {
      console.error('Failed to create bulk keys:', error);
      showToast(error.response?.data?.error || 'Failed to create keys', 'error');
    }
  };

  const handleCopyKey = (accessKey) => {
    navigator.clipboard.writeText(accessKey);
    showToast('Access key copied to clipboard!', 'success');
  };

  const handleDeactivate = (key) => {
    setConfirmAction({ type: 'deactivate', key });
  };

  const handleReactivate = (key) => {
    setConfirmAction({ type: 'reactivate', key });
  };

  const handleDelete = (key) => {
    setConfirmAction({ type: 'delete', key });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const { type, key } = confirmAction;

    try {
      if (type === 'deactivate') {
        const response = await deploymentAccessAPI.deactivateKey(key._id);
        if (response.data.success) {
          showToast('Access key deactivated', 'success');
          loadData(false);
        }
      } else if (type === 'reactivate') {
        const response = await deploymentAccessAPI.reactivateKey(key._id);
        if (response.data.success) {
          showToast('Access key reactivated', 'success');
          loadData(false);
        }
      } else if (type === 'delete') {
        const response = await deploymentAccessAPI.deleteKey(key._id);
        if (response.data.success) {
          showToast('Access key deleted', 'success');
          loadData(false);
        }
      }
    } catch (error) {
      console.error(`Failed to ${type} key:`, error);
      showToast(`Failed to ${type} key`, 'error');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleCancelAction = () => {
    setConfirmAction(null);
  };

  // School action handlers
  const handleSchoolDeactivate = (school) => {
    setConfirmSchoolAction({ type: 'deactivate', school });
  };

  const handleSchoolReactivate = (school) => {
    setConfirmSchoolAction({ type: 'reactivate', school });
  };

  const handleSchoolDelete = (school) => {
    setConfirmSchoolAction({ type: 'delete', school });
  };

  const handleConfirmSchoolAction = async () => {
    if (!confirmSchoolAction) return;

    const { type, school } = confirmSchoolAction;

    try {
      if (type === 'deactivate') {
        const response = await schoolAPI.deactivate(school._id);
        if (response.data.success) {
          const keysCount = response.data.keysDeactivated || 0;
          showToast(
            `School deactivated (${keysCount} key${keysCount !== 1 ? 's' : ''} also deactivated)`,
            'success'
          );
          loadData(false);
        }
      } else if (type === 'reactivate') {
        const response = await schoolAPI.reactivate(school._id);
        if (response.data.success) {
          const keysCount = response.data.keysReactivated || 0;
          showToast(
            `School reactivated (${keysCount} key${keysCount !== 1 ? 's' : ''} also reactivated)`,
            'success'
          );
          loadData(false);
        }
      } else if (type === 'delete') {
        const response = await schoolAPI.delete(school._id);
        if (response.data.success) {
          const keysDeleted = response.data.keysDeleted || 0;
          showToast(
            keysDeleted > 0 
              ? `School deleted successfully (${keysDeleted} key${keysDeleted !== 1 ? 's' : ''} also deleted)`
              : 'School deleted successfully',
            'success'
          );
          loadData(false);
        }
      }
    } catch (error) {
      console.error(`Failed to ${type} school:`, error);
      const errorMessage = error.response?.data?.error || `Failed to ${type} school`;
      showToast(errorMessage, 'error');
    } finally {
      setConfirmSchoolAction(null);
    }
  };

  const handleCancelSchoolAction = () => {
    setConfirmSchoolAction(null);
  };

  const toggleSchool = (schoolId) => {
    setExpandedSchools(prev => ({
      ...prev,
      [schoolId]: !prev[schoolId]
    }));
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

  // Group keys by school
  const keysBySchool = schools.map(school => ({
    school,
    keys: keys.filter(key => key.school?.id === school._id)
  }));

  return (
    <div className="space-y-6">
      {/* Create New Key Form */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Create New Access Key</h3>
          <p className="mt-1 text-sm text-gray-500">Generate a new access key for a specific school</p>
        </div>
        <div className="p-6">
          {schools.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No schools available. Create a school first.</p>
              <p className="text-sm text-gray-400">Go to the Schools tab to create your first school.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
                    School
                  </label>
                  <select
                    id="schoolId"
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={creating}
                  >
                    {schools.map(school => (
                      <option key={school._id} value={school._id}>
                        {school.schoolName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name / Description
                  </label>
                  <input
                    type="text"
                    id="keyName"
                    value={formData.keyName}
                    onChange={(e) => setFormData({ ...formData, keyName: e.target.value })}
                    placeholder="e.g., Teacher - Jane Smith"
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

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => setBulkModalOpen(true)}
                  variant="outline"
                  disabled={creating || schools.length === 0}
                  className="bg-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Multiple Keys
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {creating ? 'Generating...' : 'Generate Access Key'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>

      {/* Access Keys List - Grouped by School */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Access Keys by School</h3>
              <p className="mt-1 text-sm text-gray-500">{keys.length} total keys across {schools.length} school{schools.length !== 1 ? 's' : ''}</p>
            </div>
            <Button
              onClick={() => loadData(false)}
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
        ) : schools.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No schools yet. Create a school first in the Schools tab.
          </div>
        ) : keys.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No access keys created yet. Create your first key above.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {keysBySchool.map(({ school, keys: schoolKeys }) => (
              <div key={school._id} className="bg-white">
                {/* School Header */}
                <button
                  onClick={() => toggleSchool(school._id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedSchools[school._id] ? 'transform rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="text-left">
                      <h4 className="text-base font-medium text-gray-900">{school.schoolName}</h4>
                      <p className="text-sm text-gray-500">
                        {schoolKeys.length} key{schoolKeys.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-500">
                      {schoolKeys.filter(k => k.isActive).length} active
                    </div>
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      {school.isActive ? (
                        <>
                          <button
                            onClick={() => handleSchoolDeactivate(school)}
                            className="px-2 py-1 text-xs font-medium text-yellow-700 hover:text-yellow-900 hover:bg-yellow-50 rounded transition-colors"
                            title="Deactivate school and all its keys"
                          >
                            Deactivate
                          </button>
                          <button
                            onClick={() => handleSchoolDelete(school)}
                            className="px-2 py-1 text-xs font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                            title="Delete school and all its keys"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSchoolReactivate(school)}
                            className="px-2 py-1 text-xs font-medium text-green-700 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                            title="Reactivate school and all its keys"
                          >
                            Reactivate
                          </button>
                          <button
                            onClick={() => handleSchoolDelete(school)}
                            className="px-2 py-1 text-xs font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                            title="Delete school and all its keys"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </button>

                {/* School Keys Table */}
                {expandedSchools[school._id] && schoolKeys.length > 0 && (
                  <div className="bg-gray-50">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
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
                          {schoolKeys.map((key) => (
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
                                {key.isActive ? (
                                  <button
                                    onClick={() => handleDeactivate(key)}
                                    className="text-yellow-600 hover:text-yellow-900"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleReactivate(key)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Reactivate
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(key)}
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
                  </div>
                )}

                {expandedSchools[school._id] && schoolKeys.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                    No keys created for this school yet.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Bulk Creation Modal */}
      <BulkKeyCreationModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onSubmit={handleBulkCreate}
        schools={schools}
        loading={creating}
      />

      {/* Key Action Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={
          confirmAction?.type === 'deactivate' 
            ? 'Deactivate Access Key' 
            : confirmAction?.type === 'reactivate'
            ? 'Reactivate Access Key'
            : 'Delete Access Key'
        }
        message={
          confirmAction?.type === 'deactivate'
            ? `Are you sure you want to deactivate the access key "${confirmAction?.key?.keyName}"?\n\nUsers will no longer be able to use this key to access the deployment portal.`
            : confirmAction?.type === 'reactivate'
            ? `Are you sure you want to reactivate the access key "${confirmAction?.key?.keyName}"?\n\nUsers will be able to use this key again to access the deployment portal.`
            : `Are you sure you want to delete the access key "${confirmAction?.key?.keyName}"?\n\nThis action cannot be undone.`
        }
        confirmText={
          confirmAction?.type === 'deactivate' 
            ? 'Deactivate' 
            : confirmAction?.type === 'reactivate'
            ? 'Reactivate'
            : 'Delete'
        }
        cancelText="Cancel"
        variant={
          confirmAction?.type === 'deactivate' 
            ? 'warning' 
            : confirmAction?.type === 'reactivate'
            ? 'success'
            : 'danger'
        }
      />

      {/* School Action Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmSchoolAction}
        onClose={handleCancelSchoolAction}
        onConfirm={handleConfirmSchoolAction}
        title={
          confirmSchoolAction?.type === 'deactivate' 
            ? 'Deactivate School' 
            : confirmSchoolAction?.type === 'reactivate'
            ? 'Reactivate School'
            : 'Delete School'
        }
        message={
          confirmSchoolAction?.type === 'deactivate'
            ? `Are you sure you want to deactivate "${confirmSchoolAction?.school?.schoolName}"?\n\nAll access keys for this school will also be deactivated.\n\nYou can reactivate it later.`
            : confirmSchoolAction?.type === 'reactivate'
            ? `Are you sure you want to reactivate "${confirmSchoolAction?.school?.schoolName}"?\n\nAll access keys for this school will also be reactivated.`
            : `Are you sure you want to delete "${confirmSchoolAction?.school?.schoolName}"?\n\nAll access keys for this school will also be permanently deleted.\n\nThis action cannot be undone.`
        }
        confirmText={
          confirmSchoolAction?.type === 'deactivate' 
            ? 'Deactivate' 
            : confirmSchoolAction?.type === 'reactivate'
            ? 'Reactivate'
            : 'Delete'
        }
        cancelText="Cancel"
        variant={
          confirmSchoolAction?.type === 'deactivate' 
            ? 'warning' 
            : confirmSchoolAction?.type === 'reactivate'
            ? 'success'
            : 'danger'
        }
      />
    </div>
  );
};

export default DeploymentKeysSection;
