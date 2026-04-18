// =============================================================
//  Header.tsx
//  Fixed top nav with: Logo | Search | Ask Question | Theme |
//  Bell | Login (unauthenticated) OR UserMenu (authenticated)
// =============================================================

import { useState, useEffect, useRef } from 'react';
import { Search, PenLine, Sparkles, Bell, LogIn, MessageSquare, Check } from 'lucide-react';
import { useAuthStore } from '../lib/authStore';
import { useNotificationStore } from '../lib/notificationStore';
import { useThemeStore } from '../lib/themeStore';
import UserMenu from './auth/UserMenu';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  onAskQuestion: () => void;
  onSearch?: (query: string) => void;
  onOpenAuth: () => void;
}

export default function Header({ onAskQuestion, onSearch, onOpenAuth }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery]                 = useState('');
  const { user }                          = useAuthStore();
  useThemeStore();
  const [showNotifs, setShowNotifs]       = useState(false);
  const notifRef                          = useRef<HTMLDivElement>(null);

  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  
  const userNotifs = notifications.filter((n) => n.userId === user?.id);
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch?.(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  function handleQueryChange(val: string) {
    setQuery(val);
  }

  return (
    <header className="relative left-0 right-0 z-50 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm theme-transition">
      <div className="flex items-center h-full px-4 gap-4">

        {/* ── Logo ── */}
        <a href="/" className="flex-shrink-0 flex items-center gap-2 min-w-[200px]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
            Proshnouttor
            <span className="text-primary-500 dark:text-primary-400 font-bold text-sm">.com</span>
          </span>
        </a>

        {/* ── Search bar ── */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div
            className={`flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border rounded-xl px-4 py-2.5 theme-transition ${
              searchFocused
                ? 'border-primary-400 ring-2 ring-primary-100 dark:ring-primary-950 bg-white dark:bg-slate-800 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Search
              className={`w-4 h-4 flex-shrink-0 theme-transition ${
                searchFocused ? 'text-primary-500 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search questions, tags, users…"
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-medium px-1"
              >
                ✕
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] text-slate-400 dark:text-slate-400 font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Ask Question */}
          <button
            onClick={() => {
              if (!user) { onOpenAuth(); return; }
              onAskQuestion();
            }}
            className="flex items-center gap-2 theme-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 theme-shadow hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <PenLine className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Question</span>
          </button>

          {/* Notification bell — only when authenticated */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                  </span>
                )}
              </button>

              {/* Dropdown menu */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead(user.id)}
                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                    {userNotifs.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifs.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            setShowNotifs(false);
                          }}
                          className={`px-4 py-3 flex flex-col gap-1 cursor-pointer theme-transition ${
                            !n.read 
                              ? 'bg-primary-50/40 dark:bg-primary-950/20 hover:bg-primary-50 dark:hover:bg-primary-950/30' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                          }`}
                        >
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{n.senderName}</span> answered your question:{" "}
                            <span className="italic font-medium text-slate-700 dark:text-slate-200">"{n.questionTitle}"</span>
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Login button (unauthenticated) OR UserMenu (authenticated) */}
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 text-slate-600 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 text-sm font-medium px-4 py-2 rounded-xl theme-transition"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          ) : (
            <UserMenu onOpenAuth={onOpenAuth} />
          )}

        </div>
      </div>
    </header>
  );
}
