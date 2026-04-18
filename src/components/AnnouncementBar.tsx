// =============================================================
//  AnnouncementBar.tsx
//  Sticky top bar showing active announcements.
//  - Shows one announcement at a time with navigation dots
//  - Closable (dismisses to localStorage)
//  - Color-coded by type (info/warning/success/urgent)
//  - Auto-rotates through active announcements
// =============================================================

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAnnouncementStore } from '../lib/announcementStore';
import type { AnnouncementType } from '../lib/types';

const TYPE_CONFIG: Record<AnnouncementType, {
  icon: React.ReactNode;
  bg: string;
  bgDark: string;
  border: string;
  text: string;
  textStrong: string;
  dot: string;
}> = {
  info: {
    icon: <Info className="w-4 h-4 shrink-0" />,
    bg: 'var(--a-50, #ecfeff)',
    bgDark: '#0c2d3e',
    border: 'var(--a-300, #67e8f9)',
    text: 'var(--a-700, #0e7490)',
    textStrong: 'var(--a-800, #155e75)',
    dot: 'var(--a-400, #22d3ee)',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
    bg: '#fffbeb',
    bgDark: '#3b2a06',
    border: '#fcd34d',
    text: '#92400e',
    textStrong: '#78350f',
    dot: '#fbbf24',
  },
  success: {
    icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
    bg: '#ecfdf5',
    bgDark: '#053b28',
    border: '#6ee7b7',
    text: '#065f46',
    textStrong: '#064e3b',
    dot: '#34d399',
  },
  urgent: {
    icon: <AlertCircle className="w-4 h-4 shrink-0" />,
    bg: '#fef2f2',
    bgDark: '#3b1010',
    border: '#fca5a5',
    text: '#991b1b',
    textStrong: '#7f1d1d',
    dot: '#f87171',
  },
};

export default function AnnouncementBar() {
  const { getActiveAnnouncements, dismissAnnouncement, dismissAllActive } = useAnnouncementStore();
  const activeAnnouncements = getActiveAnnouncements();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Reset index when announcements change
  useEffect(() => {
    if (currentIndex >= activeAnnouncements.length) {
      setCurrentIndex(0);
    }
  }, [activeAnnouncements.length, currentIndex]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeAnnouncements.length]);

  const currentAnn = activeAnnouncements[currentIndex] || activeAnnouncements[0];

  const handleDismiss = useCallback(() => {
    if (!currentAnn) return;
    setIsAnimatingOut(true);
    setTimeout(() => {
      dismissAnnouncement(currentAnn.id);
      setIsAnimatingOut(false);
      setCurrentIndex(0);
    }, 300);
  }, [currentAnn, dismissAnnouncement]);

  const handleDismissAll = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      dismissAllActive();
      setIsAnimatingOut(false);
      setIsVisible(false);
    }, 300);
  }, [dismissAllActive]);

  // Don't render if no active announcements
  if (activeAnnouncements.length === 0 || !isVisible || !currentAnn) {
    return null;
  }

  const cfg = TYPE_CONFIG[currentAnn.type] || TYPE_CONFIG.info;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <div
      className={`relative w-full theme-transition ${isAnimatingOut ? 'animate-fade-out-up' : 'animate-slide-down'}`}
      style={{
        backgroundColor: isDark ? cfg.bgDark : cfg.bg,
        borderBottom: `2px solid ${cfg.border}`,
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex items-center gap-3 py-2.5">

          {/* Icon */}
          <div className="shrink-0" style={{ color: isDark ? cfg.dot : cfg.textStrong }}>
            {cfg.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-sm font-bold truncate"
                  style={{ color: isDark ? cfg.dot : cfg.textStrong }}
                >
                  {currentAnn.title}
                </span>
                {activeAnnouncements.length > 1 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: `${isDark ? cfg.dot : cfg.text}20`,
                      color: isDark ? cfg.dot : cfg.text,
                    }}
                  >
                    {currentIndex + 1}/{activeAnnouncements.length}
                  </span>
                )}
              </div>
              <p
                className="text-xs mt-0.5 line-clamp-1"
                style={{ color: isDark ? `${cfg.dot}cc` : cfg.text }}
              >
                {currentAnn.body}
              </p>
            </div>

            {/* Navigation dots */}
            {activeAnnouncements.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setCurrentIndex((currentIndex - 1 + activeAnnouncements.length) % activeAnnouncements.length)}
                  className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ color: isDark ? cfg.dot : cfg.text }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1">
                  {activeAnnouncements.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === currentIndex ? '16px' : '6px',
                        height: '6px',
                        backgroundColor: i === currentIndex
                          ? (isDark ? cfg.dot : cfg.textStrong)
                          : `${isDark ? cfg.dot : cfg.text}40`,
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentIndex((currentIndex + 1) % activeAnnouncements.length)}
                  className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ color: isDark ? cfg.dot : cfg.text }}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Dismiss buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {activeAnnouncements.length > 1 && (
              <button
                onClick={handleDismissAll}
                className="hidden sm:inline-flex text-[10px] font-medium px-2 py-1 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: isDark ? cfg.dot : cfg.text }}
                title="Dismiss all"
              >
                Dismiss all
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
              style={{ color: isDark ? cfg.dot : cfg.text }}
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
