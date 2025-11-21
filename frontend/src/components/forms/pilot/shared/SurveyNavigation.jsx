import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../../../ui/ConfirmModal';

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
  isTransparent = false,
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

  const wrapperClass = isTransparent
    ? 'px-6 py-4 sticky bottom-0 z-10'
    : 'backdrop-blur-sm px-6 py-4 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.06)]';

  return (
    <>
      <div className={wrapperClass}>
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center ${isFirstSection ? 'justify-center' : 'justify-between'}`}>
            {/* Previous Button */}
            {!isFirstSection && (
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious || saving || submitting}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  !canGoPrevious || saving || submitting
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
            )}

            {/* Save Draft Button */}
            {!isFirstSection && (
              <button
                onClick={onSaveDraft}
                disabled={saving || submitting}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  saving || submitting
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {saving ? t('pilotSurveys:form.savingDraft') : t('common:common.saveDraft')}
              </button>
            )}

            {/* Next/Submit Button */}
            {isLastSection ? (
              <button
                onClick={handleSubmitClick}
                disabled={!canGoNext || saving || submitting}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
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
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  !canGoNext || saving || submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#7c59b2] text-white hover:bg-[#62458f] hover:shadow-lg'
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
      <ConfirmModal
        isOpen={showSubmitConfirm}
        onClose={handleCancelSubmit}
        onConfirm={handleConfirmSubmit}
        title={t('common:common.confirm')}
        message={t('pilotSurveys:form.confirmSubmit')}
        confirmText={t('common:common.submit')}
        cancelText={t('common:common.cancel')}
        variant="info"
      />
    </>
  );
};

export default SurveyNavigation;


