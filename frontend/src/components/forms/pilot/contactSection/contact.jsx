import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeploymentAuth } from '../../../../contexts/DeploymentAuthContext';
import { countries } from '../../../../utils/countries';
import SparkOSTypoLogo from '../../../../Images/SparkOStypo.svg';
import Button from '../../../ui/Button';

const ContactSection = () => {
  const navigate = useNavigate();
  const { roleType } = useParams();
  const { i18n, t: t_dashboard } = useTranslation('deploymentDashboard');
  const { t } = useTranslation('contactSection');
  const { isAuthenticated, keyName, logout } = useDeploymentAuth();
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    category: '',
    countryCode: '+86',
    phone: '',
    message: ''
  });

  const handleBack = () => {
    navigate(`/deployment_portal/${roleType}/dashboard`);
  };

  const handleLogout = () => {
    logout();
    navigate('/deployment_portal');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    console.log('Submitting inquiry:', inquiryForm);
    // Add submission logic here
  };

  // Role configuration (same as Dashboard)
  const roleConfig = {
    school: {
      title: t('dashboardTitles.school'),
      icon: '🏫',
    },
    educator: {
      title: t('dashboardTitles.educator'),
      icon: '👨‍🏫',
    },
    learner: {
      title: t('dashboardTitles.learner'),
      icon: '🎓',
    },
    special: {
      title: t('dashboardTitles.special'),
      icon: '✨',
    },
  };

  const config = roleConfig[roleType] || roleConfig.school;

  const countryCodeQuery = (inquiryForm.countryCode || '').replace(/^\+/, '').trim();
  const filteredCountryList = countryCodeQuery
    ? countries.filter((c) =>
        c.dialCode.startsWith(countryCodeQuery) ||
        c.name.toLowerCase().includes(countryCodeQuery.toLowerCase())
      )
    : countries;

  return (
    <div className="h-screen bg-transparent flex flex-col overflow-hidden">
      {/* Header - Matches DeploymentDashboard */}
      <div className="bg-transparent flex-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <img
                src={SparkOSTypoLogo}
                alt="SparkOS Logo"
                className="h-8 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
                    {keyName && (
                      <p className="text-xs text-gray-500">{t_dashboard('accessWithName', { keyName })}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                <span>{i18n.language === 'en' ? '中文' : 'EN'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t_dashboard('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-white to-neutral-100 min-h-0">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-4 h-full max-h-[750px]">
          
          {/* Left Panel - Grey - Send Us a Message Form */}
          <div className="w-full lg:w-8/12 bg-0 rounded-[2.2rem] p-8 lg:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="max-w-2xl mx-auto lg:mx-0 h-full flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-[#7c59b2] mb-2">{t('sendUsMessage')}</h2>
              <p className="text-gray-600 mb-6">
                {t('supportTeamMessage')}
              </p>
              
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">{t('fullNameLabel')} <span className="text-red-500">{t('requiredField')}</span></label>
                    <input
                      name="fullName"
                      value={inquiryForm.fullName}
                      onChange={handleInquiryChange}
                      placeholder={t('fullNamePlaceholder')}
                      className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-[#7c59b2] focus:border-transparent transition-all outline-none text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">{t('emailLabel')} <span className="text-red-500">{t('requiredField')}</span></label>
                    <input
                      name="email"
                      type="email"
                      value={inquiryForm.email}
                      onChange={handleInquiryChange}
                      placeholder={t('emailPlaceholder')}
                      className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-[#7c59b2] focus:border-transparent transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">{t('categoryLabel')}</label>
                    <select
                      name="category"
                      value={inquiryForm.category}
                      onChange={handleInquiryChange}
                      className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-[#7c59b2] focus:border-transparent transition-all outline-none text-sm appearance-none"
                    >
                      <option value="">{t('categoryPlaceholder')}</option>
                      <option value="general">{t('categoryOptions.general')}</option>
                      <option value="support">{t('categoryOptions.support')}</option>
                      <option value="feedback">{t('categoryOptions.feedback')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">{t('phoneNumberLabel')}</label>
                    <div className="relative">
                      <div className="flex items-center w-full rounded-full border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-[#7c59b2] focus-within:border-transparent transition-all px-5 py-3">
                        <div className="relative flex items-center">
                          <input
                            name="countryCode"
                            value={inquiryForm.countryCode}
                            onChange={handleInquiryChange}
                            onFocus={() => setIsCountryDropdownOpen(true)}
                            className="w-[50px] bg-transparent outline-none text-sm font-medium text-gray-900 text-center"
                          />
                          <button
                            type="button"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <div className="h-6 w-px bg-gray-200 mx-2" />
                        <input
                          name="phone"
                          value={inquiryForm.phone}
                          onChange={handleInquiryChange}
                          placeholder={t('phonePlaceholder')}
                          className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                        />
                      </div>

                      {isCountryDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsCountryDropdownOpen(false)} />
                          <div className="absolute top-full left-0 mt-2 w-[320px] max-h-[240px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-20 -translate-x-10">
                            {countryCodeQuery && (
                              <button
                                type="button"
                                onClick={() => {
                                  setInquiryForm(prev => ({ ...prev, countryCode: `+${countryCodeQuery}` }));
                                  setIsCountryDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between"
                              >
                                <span className="text-gray-700">Use code</span>
                                <span className="text-gray-900 font-semibold">+{countryCodeQuery}</span>
                              </button>
                            )}
                            {filteredCountryList.map((c) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => {
                                  setInquiryForm(prev => ({ ...prev, countryCode: `+${c.dialCode}` }));
                                  setIsCountryDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center justify-between group"
                              >
                                <span className="text-gray-900">{c.name}</span>
                                <span className="text-gray-500 group-hover:text-[#7c59b2] font-medium">+{c.dialCode}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{t('messageLabel')} <span className="text-red-500">{t('requiredField')}</span></label>
                  <textarea
                    name="message"
                    value={inquiryForm.message}
                    onChange={handleInquiryChange}
                    placeholder={t('messagePlaceholder')}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#7c59b2] focus:border-transparent transition-all outline-none resize-none text-sm"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#7c59b2] hover:bg-[#694a9e] text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {t('sendMessageButton')}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel - Purple - Contact Info */}
          <div className="w-full lg:w-4/12 bg-[#7c59b2] rounded-[2.2rem] p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 rounded-full bg-white opacity-10"></div>

            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-8 leading-tight">{t('alwaysHereToHelp')}</h2>
                
                <div className="space-y-6">
                  {/* Office Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-lg font-medium text-white/90">{t('officeHoursDays')}</div>
                      <div className="text-xl font-semibold opacity-90">{t('officeHoursTime')}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <a 
                    href="mailto:contact@spark-os.com"
                    className="flex items-start space-x-4 group cursor-pointer"
                  >
                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-lg font-medium text-white/90">{t('emailUs')}</div>
                      <div className="text-xl font-semibold group-hover:underline decoration-2 underline-offset-4">contact@spark-os.com</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Critical Assistance Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">{t('criticalIssueTitle')}</h3>
                </div>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  {t('criticalIssueDescription')}
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-[#7c59b2] border-none hover:bg-gray-100 font-bold shadow-lg"
                >
                  {t('raiseCriticalTicketButton')}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactSection;
