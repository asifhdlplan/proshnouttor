// =============================================================
//  ThemeSwitcher.tsx
//  Dropdown to pick between Blue / Purple / Green / Dark themes
//  Uses the themeStore's changeTheme() for instant switching
// =============================================================

import { useState, useRef, useEffect } from 'react';
import { Palette, Check, Monitor, Sparkles } from 'lucide-react';
import { useThemeStore, THEME_OPTIONS, type ThemeName } from '../lib/themeStore';

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, changeTheme } = useThemeStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 ${
          open
            ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400'
        }`}
        title="Change theme"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="text-sm font-bold text-primary-900 dark:text-primary-300">
              Choose Theme
            </h3>
          </div>

          {/* Theme list */}
          <div className="p-2 flex flex-col gap-1">
            {THEME_OPTIONS.map((opt) => {
              const isActive = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    changeTheme(opt.id as ThemeName);
                    setOpen(false);
                  }}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/30 ring-1 ring-primary-200 dark:ring-primary-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {/* Color preview circles */}
                  <div className="relative flex-shrink-0 flex items-center gap-0.5">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                      style={{ backgroundColor: opt.preview.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-700 shadow-sm -ml-2"
                      style={{ backgroundColor: opt.preview.accent }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {opt.icon} {opt.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {opt.description}
                    </p>
                  </div>

                  {/* Active checkmark */}
                  {isActive && (
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center animate-in zoom-in-95 duration-200">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
              <Monitor className="w-3 h-3" />
              <span>Theme saved automatically</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
