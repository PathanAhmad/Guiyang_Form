import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeploymentAuth } from '../../contexts/DeploymentAuthContext';
import { getFormSubmissions } from '../../services/pilotSurveyApi';
import { assetUrl } from '../../utils/assets';

const BehaviorAssessmentList = () => {
  const { roleType, formId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, roleType: currentRole, keyName, logout } = useDeploymentAuth();
  
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || currentRole !== roleType) {
      navigate(`/deployment_portal/${roleType}`);
      return;
    }

    loadSubmissions();
  }, [isAuthenticated, currentRole, roleType, navigate]);

  useEffect(() => {
    // Filter submissions based on search term
    if (searchTerm.trim() === '') {
      setFilteredSubmissions(submissions);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = submissions.filter(submission => {
        const studentName = submission.responses?.studentName?.toLowerCase() || '';
        const studentId = submission.responses?.studentId?.toLowerCase() || '';
        return studentName.includes(term) || studentId.includes(term);
      });
      setFilteredSubmissions(filtered);
    }
  }, [searchTerm, submissions]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFormSubmissions(formId);
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError(err.message || t('pilotSurveys:behaviorAssessmentList.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate(`/deployment_portal/${roleType}/surveys/${formId}/new`);
  };

  const handleViewSubmission = (submissionId) => {
    navigate(`/deployment_portal/${roleType}/surveys/${formId}/${submissionId}`);
  };

  const handleBack = () => {
    navigate(`/deployment_portal/${roleType}/surveys`);
  };

  const handleLogout = () => {
    logout();
    navigate('/deployment_portal');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        label: t('pilotSurveys:surveyList.status.inProgress'),
      },
      submitted: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: t('pilotSurveys:surveyList.status.completed'),
      },
    };

    const badge = badges[status] || badges.draft;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (!isAuthenticated || currentRole !== roleType) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-300/10 to-primary-400/10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={assetUrl('/Images/SparkOSFullLogo.svg')}
                alt="SparkOS Logo"
                className="h-8 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {t('pilotSurveys:behaviorAssessmentList.title')}
                    </h1>
                    {keyName && (
                      <p className="text-xs text-gray-500">{t('pilotSurveys:accessWithName', { keyName })}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {i18n.language === 'en' ? '中文' : 'English'}
              </button>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('common:common.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subtitle and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <p className="text-gray-600">
            {t('pilotSurveys:behaviorAssessmentList.subtitle')}
          </p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            {t('pilotSurveys:behaviorAssessmentList.createNew')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('pilotSurveys:behaviorAssessmentList.searchPlaceholder')}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-lg font-semibold text-red-900 mb-1">Error</h4>
                <p className="text-red-800">{error}</p>
                <button
                  onClick={loadSubmissions}
                  className="mt-3 text-red-600 hover:text-red-800 font-medium"
                >
                  {t('pilotSurveys:behaviorAssessmentList.tryAgain')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredSubmissions.length === 0 && submissions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-gray-600 font-medium">{t('pilotSurveys:behaviorAssessmentList.noAssessments')}</p>
            <p className="text-gray-500 text-sm">{t('pilotSurveys:behaviorAssessmentList.noAssessmentsDesc')}</p>
            <button
              onClick={handleCreateNew}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              {t('pilotSurveys:behaviorAssessmentList.createNew')}
            </button>
          </div>
        )}

        {/* No Search Results */}
        {!loading && !error && filteredSubmissions.length === 0 && submissions.length > 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="mt-4 text-gray-600 font-medium">{t('pilotSurveys:behaviorAssessmentList.noAssessments')}</p>
            <p className="text-gray-500 text-sm">Try adjusting your search</p>
          </div>
        )}

        {/* Submissions Table */}
        {!loading && !error && filteredSubmissions.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('pilotSurveys:behaviorAssessmentList.studentName')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('pilotSurveys:behaviorAssessmentList.studentId')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('pilotSurveys:behaviorAssessmentList.assessmentDate')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('pilotSurveys:behaviorAssessmentList.submittedDate')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('pilotSurveys:behaviorAssessmentList.status')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('pilotSurveys:behaviorAssessmentList.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.responses?.studentName || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {submission.responses?.studentId || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(submission.responses?.assessmentDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(submission.submittedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewSubmission(submission._id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {submission.status === 'submitted' 
                            ? t('pilotSurveys:behaviorAssessmentList.view')
                            : t('pilotSurveys:behaviorAssessmentList.edit')
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && submissions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Total Assessments</div>
              <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Submitted</div>
              <div className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.status === 'submitted').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Drafts</div>
              <div className="text-2xl font-bold text-yellow-600">
                {submissions.filter(s => s.status === 'draft').length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorAssessmentList;

