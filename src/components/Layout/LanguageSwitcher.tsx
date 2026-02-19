import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { t, getLocale, setLocale, toggleLocale, LOCALE_NAMES, LOCALE_FLAGS, Locale } from '../../core/config/i18n';
import APP_VERSION from '../../core/config/version';

/**
 * 语言切换组件
 */
const LanguageSwitcher: React.FC = () => {
  const [locale, setLocalState] = useState<Locale>(getLocale());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleChange = (e: CustomEvent) => {
      setLocalState(e.detail.locale);
    };
    window.addEventListener('localeChange', handleChange as EventListener);
    return () => window.removeEventListener('localeChange', handleChange as EventListener);
  }, []);

  const handleToggle = () => {
    const newLocale = toggleLocale();
    setLocalState(newLocale);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors hover:bg-[#1E2D45]"
        style={{ color: '#7A8BA8' }}
      >
        <Globe className="w-4 h-4" />
        <span>{LOCALE_FLAGS[locale]}</span>
        <span>{LOCALE_NAMES[locale]}</span>
      </button>

      {showDropdown && (
        <div 
          className="absolute bottom-full left-0 mb-2 py-1 rounded shadow-lg min-w-[120px]"
          style={{ background: '#0B0F17', border: '1px solid #1E2D45' }}
        >
          {(Object.keys(LOCALE_NAMES) as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                setLocalState(loc);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#1E2D45]"
              style={{ 
                color: loc === locale ? '#3D9BE9' : '#7A8BA8',
              }}
            >
              <span>{LOCALE_FLAGS[loc]}</span>
              <span>{LOCALE_NAMES[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
