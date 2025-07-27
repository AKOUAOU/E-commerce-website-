import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

const LanguageContext = createContext();

const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    flag: '🇫🇷'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇲🇦'
  }
];

const COOKIE_NAME = 'ecommerce-language';
const COOKIE_EXPIRES = 365; // days

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from various sources
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Priority order: URL param > Cookie > Browser > Default
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const cookieLang = Cookies.get(COOKIE_NAME);
        const browserLang = navigator.language.split('-')[0];
        
        let selectedLang = 'en'; // default
        
        if (urlLang && LANGUAGES.find(l => l.code === urlLang)) {
          selectedLang = urlLang;
        } else if (cookieLang && LANGUAGES.find(l => l.code === cookieLang)) {
          selectedLang = cookieLang;
        } else if (browserLang && LANGUAGES.find(l => l.code === browserLang)) {
          selectedLang = browserLang;
        }

        await changeLanguage(selectedLang);
      } catch (error) {
        console.error('Error initializing language:', error);
        await changeLanguage('en'); // fallback
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  const changeLanguage = async (langCode) => {
    try {
      const selectedLanguage = LANGUAGES.find(lang => lang.code === langCode);
      
      if (!selectedLanguage) {
        throw new Error(`Language ${langCode} not supported`);
      }

      // Change i18n language
      await i18n.changeLanguage(langCode);
      
      // Update state
      setLanguage(langCode);
      setDirection(selectedLanguage.direction);
      
      // Save to cookie
      Cookies.set(COOKIE_NAME, langCode, { 
        expires: COOKIE_EXPIRES,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      // Update document attributes
      document.documentElement.lang = langCode;
      document.documentElement.dir = selectedLanguage.direction;
      
      // Update page title direction class
      if (selectedLanguage.direction === 'rtl') {
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
      } else {
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
      }

      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: langCode, direction: selectedLanguage.direction }
      }));

    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  };

  const getLanguageInfo = (langCode = language) => {
    return LANGUAGES.find(lang => lang.code === langCode) || LANGUAGES[0];
  };

  const getCurrentLanguageData = () => {
    return getLanguageInfo(language);
  };

  const getAvailableLanguages = () => {
    return LANGUAGES;
  };

  const isRTL = () => {
    return direction === 'rtl';
  };

  const getLocalizedContent = (content, fallbackLang = 'en') => {
    if (!content || typeof content !== 'object') {
      return content;
    }

    return content[language] || content[fallbackLang] || content.en || '';
  };

  const formatPrice = (price, currency = 'MAD') => {
    try {
      const locale = language === 'ar' ? 'ar-MA' : 
                    language === 'fr' ? 'fr-MA' : 'en-US';
      
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${price} ${currency}`;
    }
  };

  const formatDate = (date, options = {}) => {
    try {
      const locale = language === 'ar' ? 'ar-MA' : 
                    language === 'fr' ? 'fr-MA' : 'en-US';
      
      const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
      };
      
      return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date(date).toLocaleDateString();
    }
  };

  const formatNumber = (number, options = {}) => {
    try {
      const locale = language === 'ar' ? 'ar-MA' : 
                    language === 'fr' ? 'fr-MA' : 'en-US';
      
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (error) {
      console.error('Error formatting number:', error);
      return number.toString();
    }
  };

  const value = {
    // State
    language,
    direction,
    isLoading,
    
    // Methods
    changeLanguage,
    getLanguageInfo,
    getCurrentLanguageData,
    getAvailableLanguages,
    isRTL,
    getLocalizedContent,
    
    // Formatting utilities
    formatPrice,
    formatDate,
    formatNumber,
    
    // Constants
    LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

export default LanguageContext;