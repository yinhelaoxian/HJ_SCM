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
    // 关闭下拉菜单的全局点击事件
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };
    window.addEventListener('localeChange', handleChange as EventListener);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('localeChange', handleChange as EventListener);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const handleToggle = () => {
    const newLocale = toggleLocale();
    setLocalState(newLocale);
  };

  return (
    <div className="relative" style={{ zIndex: 100 }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
        className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors hover:bg-[#1E2D45] cursor-pointer"
        style={{ color: '#7A8BA8', cursor: 'pointer' }}
      >
        <Globe className="w-4 h-4" />
        <span>{LOCALE_FLAGS[locale]}</span>
        <span>{LOCALE_NAMES[locale]}</span>
      </button>

      {showDropdown && (
        <div 
          className="absolute top-full left-0 mt-1 py-1 rounded shadow-lg min-w-[120px]"
          style={{ background: '#0B0F17', border: '1px solid #1E2D45', zIndex: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          {(Object.keys(LOCALE_NAMES) as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={(e) => {
                e.stopPropagation();
                setLocale(loc);
                setLocalState(loc);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#1E2D45] cursor-pointer"
              style={{ 
                color: loc === locale ? '#3D9BE9' : '#7A8BA8',
                cursor: 'pointer',
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
