import React, { useState, useEffect } from 'react';
import { schoolAPI } from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ConfirmModal from '../ui/ConfirmModal';
import SchoolFormModal from './SchoolFormModal';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/format';

const SchoolManagementSection = () => {
  const { showToast } = useToast();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [confirmReactivate, setConfirmReactivate] = useState(null);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      const response = await schoolAPI.list();
      setSchools(response.data.data || []);
    } catch (error) {
      console.error('Failed to load schools:', error);
      showToast('Failed to load schools', 'error');
    } finally {
      if (showLoadingSpinner) {
        setLoading(false);
      }
    }
  };

  const handleCreateSchool = () => {
    setSelectedSchool(null);
    setFormModalOpen(true);
  };

  const handleEditSchool = (school) => {
    setSelectedSchool(school);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (selectedSchool) {
        // Update existing school
        const response = await schoolAPI.update(selectedSchool._id, formData);
        if (response.data.success) {
          showToast('School updated successfully!', 'success');
          setFormModalOpen(false);
          loadSchools(false);
        }
      } else {
        // Create new school
        const response = await schoolAPI.create(formData);
        if (response.data.success) {
          showToast('School created successfully!', 'success');
          setFormModalOpen(false);
          loadSchools(false);
        }
      }
    } catch (error) {
      console.error('Failed to save school:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save school';
      showToast(errorMessage, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSchool = (school) => {
    setConfirmDelete(school);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    try {
      const response = await schoolAPI.delete(confirmDelete._id);
      if (response.data.success) {
        const keysDeleted = response.data.keysDeleted || 0;
        showToast(
          keysDeleted > 0 
            ? `School deleted successfully (${keysDeleted} key${keysDeleted !== 1 ? 's' : ''} also deleted)`
            : 'School deleted successfully',
          'success'
        );
        loadSchools(false);
      }
    } catch (error) {
      console.error('Failed to delete school:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete school';
      showToast(errorMessage, 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleDeactivateSchool = (school) => {
    setConfirmDeactivate(school);
  };

  const handleConfirmDeactivate = async () => {
    if (!confirmDeactivate) return;

    try {
      const response = await schoolAPI.deactivate(confirmDeactivate._id);
      if (response.data.success) {
        const keysCount = response.data.keysDeactivated || 0;
        showToast(
          `School deactivated successfully (${keysCount} key${keysCount !== 1 ? 's' : ''} also deactivated)`,
          'success'
        );
        loadSchools(false);
      }
    } catch (error) {
      console.error('Failed to deactivate school:', error);
      const errorMessage = error.response?.data?.error || 'Failed to deactivate school';
      showToast(errorMessage, 'error');
    } finally {
      setConfirmDeactivate(null);
    }
  };

  const handleReactivateSchool = (school) => {
    setConfirmReactivate(school);
  };

  const handleConfirmReactivate = async () => {
    if (!confirmReactivate) return;

    try {
      const response = await schoolAPI.reactivate(confirmReactivate._id);
      if (response.data.success) {
        const keysCount = response.data.keysReactivated || 0;
        showToast(
          `School reactivated successfully (${keysCount} key${keysCount !== 1 ? 's' : ''} also reactivated)`,
          'success'
        );
        loadSchools(false);
      }
    } catch (error) {
      console.error('Failed to reactivate school:', error);
      const errorMessage = error.response?.data?.error || 'Failed to reactivate school';
      showToast(errorMessage, 'error');
    } finally {
      setConfirmReactivate(null);
    }
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
    <>
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Schools</h3>
              <p className="mt-1 text-sm text-gray-500">{schools.length} total school{schools.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => loadSchools(false)}
                variant="outline"
                className="bg-white"
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                onClick={handleCreateSchool}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create School
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading schools...</p>
          </div>
        ) : schools.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Schools Yet</h4>
            <p className="text-gray-500 mb-4">
              Create your first school to start managing access keys.
            </p>
            <Button
              onClick={handleCreateSchool}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create First School
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {schools.map((school) => (
              <div
                key={school._id}
                className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                {/* School Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 truncate">
                      {school.schoolName}
                    </h4>
                    {school.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {school.description}
                      </p>
                    )}
                  </div>
                  <span className={`ml-2 flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    school.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {school.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Key Counts */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Total Keys:</span>
                    <span className="text-gray-900 font-semibold">
                      {school.keyCounts?.total || 0}
                    </span>
                  </div>
                  {school.keyCounts?.byRole && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{getRoleIcon('school')} Management:</span>
                        <span className="text-gray-700 font-medium">{school.keyCounts.byRole.school || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{getRoleIcon('educator')} Educators:</span>
                        <span className="text-gray-700 font-medium">{school.keyCounts.byRole.educator || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{getRoleIcon('learner')} Learners:</span>
                        <span className="text-gray-700 font-medium">{school.keyCounts.byRole.learner || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{getRoleIcon('special')} Special:</span>
                        <span className="text-gray-700 font-medium">{school.keyCounts.byRole.special || 0}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="text-xs text-gray-400 mb-3 pt-3 border-t border-gray-100">
                  Created {formatDate(school.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEditSchool(school)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-300 hover:border-blue-400"
                  >
                    Edit
                  </Button>
                  {school.isActive ? (
                    <Button
                      onClick={() => handleDeactivateSchool(school)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-300 hover:border-yellow-400"
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleReactivateSchool(school)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300 hover:border-green-400"
                    >
                      Reactivate
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteSchool(school)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400"
                    title="Delete school and all its keys"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* School Form Modal */}
      <SchoolFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedSchool(null);
        }}
        onSubmit={handleFormSubmit}
        school={selectedSchool}
        loading={formLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete School"
        message={
          confirmDelete
            ? `Are you sure you want to delete "${confirmDelete.schoolName}"?\n\nAll ${confirmDelete.keyCounts?.total || 0} access key(s) will also be permanently deleted.\n\nThis action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Deactivate Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDeactivate}
        onClose={() => setConfirmDeactivate(null)}
        onConfirm={handleConfirmDeactivate}
        title="Deactivate School"
        message={
          confirmDeactivate
            ? `Are you sure you want to deactivate "${confirmDeactivate.schoolName}"?\n\nAll ${confirmDeactivate.keyCounts?.total || 0} access key(s) will also be deactivated.\n\nYou can reactivate it later.`
            : ''
        }
        confirmText="Deactivate"
        cancelText="Cancel"
        variant="warning"
      />

      {/* Reactivate Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmReactivate}
        onClose={() => setConfirmReactivate(null)}
        onConfirm={handleConfirmReactivate}
        title="Reactivate School"
        message={
          confirmReactivate
            ? `Are you sure you want to reactivate "${confirmReactivate.schoolName}"?\n\nAll ${confirmReactivate.keyCounts?.total || 0} access key(s) will also be reactivated.`
            : ''
        }
        confirmText="Reactivate"
        cancelText="Cancel"
        variant="success"
      />
    </>
  );
};

export default SchoolManagementSection;




