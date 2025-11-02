import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { surveyAccessAPI } from '../services/api';

const SurveyAccessPage = ({ surveyType: propSurveyType }) => {
  const { t } = useTranslation();
  const params = useParams();
  const derivedSurveyType = propSurveyType || params.surveyType;
  const navigate = useNavigate();

  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  const [schoolName, setSchoolName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!accessKey) {
      setError(t('surveyAccess.error') || 'Access key is required');
      return;
    }
    setLoading(true);
    try {
      const res = await surveyAccessAPI.validateAccessKey(accessKey, derivedSurveyType);
      const data = res.data || {};
      if (data?.valid) {
        setValidated(true);
        setSchoolName(data.schoolName || '');
      } else {
        setError(data?.error || (t('surveyAccess.error') || 'Invalid access key'));
      }
    } catch (err) {
      setError(err?.message || (t('surveyAccess.error') || 'Validation failed'));
    } finally {
      setLoading(false);
    }
  };

  if (validated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {/* Close (X) */}
        <button
          aria-label={t('common.close') || 'Close'}
          onClick={() => navigate('/')}
          className="fixed top-6 right-6 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        >
          ×
        </button>
        <div className="max-w-xl w-full bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">{t('surveyAccess.title') || 'Survey Access'}</h1>
          {schoolName && (
            <p className="text-gray-600 mb-4">{schoolName}</p>
          )}
          <div className="text-gray-700">{t('surveyAccess.loading') || 'Loading survey...'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Close (X) */}
      <button
        aria-label={t('common.close') || 'Close'}
        onClick={() => navigate('/')}
        className="fixed top-6 right-6 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
      >
        ×
      </button>
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold mb-6">{t('surveyAccess.title') || 'Survey Access'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">{t('surveyAccess.enterKey') || 'Enter your Access Key:'}</span>
            <input
              type="text"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder={t('surveyAccess.enterKey') || 'Enter your Access Key:'}
              disabled={loading}
            />
          </label>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (t('surveyAccess.loading') || 'Validating...') : (t('surveyAccess.submit') || 'Submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyAccessPage;


