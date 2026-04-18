// =============================================================
//  UserMenu.tsx
//  Dropdown shown when the user is authenticated.
//  Shows: profile image, name, email, reputation, nav links,
//  and a Logout button. Uses primary-*/accent-* theme classes.
// =============================================================

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  LogOut,
  User,
  Settings,
  BookMarked,
  Star,
  Trophy,
  Mail,
  Shield,
} from 'lucide-react';
import { useAuthStore, type AuthUser } from '../../lib/authStore';
import toast from 'react-hot-toast';

// ── Avatar component ───────────────────────────────────────────
function Avatar({ user, size = 'md' }: { user: AuthUser; size?: 'sm' | 'md' | 'lg' }) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (user.image && !imgError) {
    return (
      <img
        src={user.image}
        alt={user.name}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-xl object-cover border-2 border-primary-100`}
      />
    );
  }

  // Fallback: gradient initials
  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold border-2 border-primary-100`}
    >
      {initials}
    </div>
  );
}

// ── Provider badge ─────────────────────────────────────────────
function ProviderBadge({ provider }: { provider: AuthUser['provider'] }) {
  const config = {
    google: { label: 'Google', bg: 'bg-blue-50 text-blue-600 border-blue-100' },
    email:  { label: 'Email',  bg: 'bg-slate-100 text-slate-600 border-slate-200' },
    github: { label: 'GitHub', bg: 'bg-gray-100 text-gray-700 border-gray-200' },
  };
  const { label, bg } = config[provider];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${bg}`}>
      <Shield className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}

// ── Reputation level ───────────────────────────────────────────
function repLevel(rep: number): { label: string; color: string } {
  if (rep >= 5000) return { label: 'Expert',      color: 'text-primary-600' };
  if (rep >= 2000) return { label: 'Advanced',    color: 'text-blue-600'   };
  if (rep >= 500)  return { label: 'Contributor', color: 'text-emerald-600'};
  if (rep >= 100)  return { label: 'Member',      color: 'text-amber-600'  };
  return              { label: 'Newcomer',     color: 'text-slate-500'  };
}

// ── Menu items ─────────────────────────────────────────────────
const menuItems = [
  { icon: User,       label: 'Your Profile',      href: '#' },
  { icon: BookMarked, label: 'Saved Questions',   href: '#' },
  { icon: Star,       label: 'Your Answers',      href: '#' },
  { icon: Trophy,     label: 'Achievements',      href: '#' },
  { icon: Settings,   label: 'Account Settings',  href: '#' },
];

// ── Main component ─────────────────────────────────────────────
interface UserMenuProps {
  onOpenAuth: () => void;
}

export default function UserMenu({ onOpenAuth }: UserMenuProps) {
  const { user, signOut } = useAuthStore();
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Unauthenticated state → show Login button ──────────────
  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 text-slate-600 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 text-sm font-medium px-4 py-2 rounded-xl theme-transition"
      >
        <Mail className="w-4 h-4" />
        <span className="hidden sm:inline">Login</span>
      </button>
    );
  }

  // ── Authenticated state ────────────────────────────────────
  const level = repLevel(user.reputation);

  function handleSignOut() {
    setOpen(false);
    signOut();
    toast.success('Signed out successfully. See you soon! 👋', {
      style: { borderRadius: '12px', background: '#1e1b4b', color: '#fff' },
    });
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-xl p-1.5 theme-transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
          open ? 'bg-slate-100 dark:bg-slate-800 ring-2 ring-primary-200 dark:ring-primary-800' : ''
        }`}
      >
        <Avatar user={user} size="sm" />
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none truncate max-w-[90px]">
            {user.name.split(' ')[0]}
          </p>
          <p className={`text-[10px] font-medium ${level.color} leading-none mt-0.5`}>
            {user.reputation.toLocaleString()} rep
          </p>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 theme-transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">

          {/* Profile header */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950 px-4 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Avatar user={user} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{user.name}</p>
                  <ProviderBadge provider={user.provider} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-500" />
                    <span className="text-[11px] font-bold text-amber-600">
                      {user.reputation.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400">reputation</span>
                  </div>
                  <span className="text-slate-200 dark:text-slate-600">•</span>
                  <span className={`text-[11px] font-semibold ${level.color}`}>
                    {level.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <div className="py-2">
            {menuItems.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-700 dark:hover:text-primary-400 theme-transition"
              >
                <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {label}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-700" />

          {/* Sign out */}
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl theme-transition font-medium"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Export Avatar for reuse ────────────────────────────────────
export { Avatar };
