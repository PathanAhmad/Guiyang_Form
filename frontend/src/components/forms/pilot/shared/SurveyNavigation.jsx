import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SurveyNavigation = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSaveDraft,
  onSubmit,
  saving,
  submitting,
  canGoNext = true,
  canGoPrevious = true,
}) => {
  const { t } = useTranslation();
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const isFirstSection = currentSection === 1;
  const isLastSection = currentSection === totalSections;

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirm(false);
    onSubmit();
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  return (
    <>
      <div className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={onPrevious}
              disabled={isFirstSection || !canGoPrevious || saving || submitting}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                isFirstSection || !canGoPrevious || saving || submitting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                {t('common:common.previous')}
              </div>
            </button>

            {/* Save Draft Button */}
            <button
              onClick={onSaveDraft}
              disabled={saving || submitting}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                saving
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {saving ? t('pilotSurveys:form.savingDraft') : t('common:common.saveDraft')}
            </button>

            {/* Next/Submit Button */}
            {isLastSection ? (
              <button
                onClick={handleSubmitClick}
                disabled={!canGoNext || saving || submitting}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !canGoNext || saving || submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                }`}
              >
                {submitting ? t('pilotSurveys:form.submitting') : t('common:common.submit')}
              </button>
            ) : (
              <button
                onClick={onNext}
                disabled={!canGoNext || saving || submitting}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !canGoNext || saving || submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg'
                }`}
              >
                <div className="flex items-center">
                  {t('common:common.next')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {t('common:common.confirm')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('pilotSurveys:form.confirmSubmit')}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleCancelSubmit}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                {t('common:common.cancel')}
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                {t('common:common.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SurveyNavigation;


