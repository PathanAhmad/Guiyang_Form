import { useTranslation } from 'react-i18next';
import Button from './Button';
import Card from './Card';
import LanguageToggle from './LanguageToggle';

const TokenDisplay = ({ submissionData, formType, onBackToHome }) => {
  const { t } = useTranslation();

  const getSuccessTitle = () => t(`forms.${formType}.successTitle`);
  const getSuccessMessage = () => t(`forms.${formType}.successMessage`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 relative">
      {/* Language Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageToggle />
      </div>
      
      <div className="max-w-2xl mx-auto px-4">
        <Card className="animate-fade-in shadow-2xl border-2 border-green-200">
          <Card.Body className="text-center py-12 px-8">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Title */}
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{getSuccessTitle()}</h3>
            <p className="text-lg text-gray-600 mb-8">
              {getSuccessMessage()}
            </p>

            {/* Token Display */}
            {submissionData?.token && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 mb-8">
                <p className="text-sm text-gray-600 mb-2">
                  {t('misc.referenceToken')}:
                </p>
                <div className="text-4xl font-bold font-mono text-blue-600 bg-white rounded-lg py-4 px-6 border-2 border-blue-300 mb-6 tracking-wider shadow-inner">
                  {submissionData.token}
                </div>
                
                {/* Important Instructions */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.334 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h4 className="text-lg font-bold text-red-800">{t('misc.importantNotice')}</h4>
                  </div>
                  <p className="text-red-700 font-semibold text-lg mb-2">
                    {t('misc.tokenInstructions')}
                  </p>
                  <p className="text-red-600 text-base">
                    {t('misc.screenshotReminder')}
                  </p>
                </div>

                {/* Screenshot Button Simulation */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-600 mb-3">
                    📱 Take a screenshot now by pressing:
                  </p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><strong>iOS:</strong> Home + Power Button</div>
                    <div><strong>Android:</strong> Volume Down + Power Button</div>
                    <div><strong>Desktop:</strong> Print Screen Key or Snipping Tool</div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            {submissionData?.submittedAt && (
              <div className="text-sm text-gray-500 mb-8">
                <p>Submitted: {new Date(submissionData.submittedAt).toLocaleString()}</p>
                <p>Form Type: {formType.charAt(0).toUpperCase() + formType.slice(1)}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onBackToHome} 
                variant="primary"
                size="lg"
                className="text-lg py-4 px-8"
              >
                {t('common.backToHome')}
              </Button>
              <Button 
                onClick={() => window.print()} 
                variant="secondary"
                size="lg"
                className="text-lg py-4 px-8"
              >
                {t('common.printToken')}
              </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Keep this token safe and accessible. You will need to show it for verification.
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TokenDisplay;
