// =============================================================
//  LeftSidebar.tsx
//  Navigation sidebar — auth-aware profile card at the bottom.
//  Uses primary-*/accent-* theme-aware color classes.
// =============================================================

import {
  Home,
  LayoutGrid,
  Tag,
  Flame,
  HelpCircle,
  Users,
  BookOpen,
  Settings,
  ChevronRight,
  Trophy,
  LogIn,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../lib/authStore';
import { Avatar } from './auth/UserMenu';

const navItems = [
  { icon: Home,        label: 'Home',          href: '#', active: true,  badge: undefined },
  { icon: LayoutGrid,  label: 'Categories',    href: '#', active: false, badge: undefined },
  { icon: Tag,         label: 'Tags',          href: '#', active: false, badge: undefined },
  { icon: Flame,       label: 'Top Questions', href: '#', active: false, badge: undefined },
  { icon: HelpCircle,  label: 'Unanswered',    href: '#', active: false, badge: '142'     },
];

const secondaryItems = [
  { icon: Users,    label: 'Community', href: '#' },
  { icon: BookOpen, label: 'Docs',      href: '#' },
  { icon: Settings, label: 'Settings',  href: '#' },
  { icon: Shield,   label: 'Admin',     href: '#/admin' },
];

interface LeftSidebarProps {
  onOpenAuth: () => void;
}

export default function LeftSidebar({ onOpenAuth }: LeftSidebarProps) {
  const { user, signOut } = useAuthStore();

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col gap-2 pt-2">

      {/* ── Main navigation ── */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ icon: Icon, label, href, active, badge }) => (
          <a
            key={label}
            href={href}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium theme-transition ${
              active
                ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/50'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${
                active ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              }`}
            />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            {active && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-slate-800 my-2" />

      {/* ── Secondary nav ── */}
      <nav className="flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1">
          More
        </p>
        {secondaryItems.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200 theme-transition"
          >
            <Icon className="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-400" />
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-slate-800 my-2" />

      {/* ── Profile card ── */}
      {user ? (
        /* Authenticated */
        <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-primary-50/50 to-accent-50/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-primary-100/50 dark:border-slate-700 shadow-sm theme-transition">
          <div className="flex items-center gap-2 mb-2">
            <Avatar user={user} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{user.name}</p>
              <div className="flex items-center gap-1">
                <Trophy className="w-2.5 h-2.5 text-amber-500" />
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                  {user.reputation.toLocaleString()} rep
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full text-xs font-semibold text-red-500 hover:text-red-700 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-lg py-1.5 theme-transition"
          >
            Sign Out
          </button>
        </div>
      ) : (
        /* Guest */
        <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-primary-50/50 to-accent-50/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-primary-100/50 dark:border-slate-700 shadow-sm theme-transition">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <LogIn className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">Guest User</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Not logged in</p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="w-full text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-white dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-slate-700/50 border border-primary-200 dark:border-slate-700 rounded-lg py-1.5 theme-transition"
          >
            Sign in / Register
          </button>
        </div>
      )}
    </aside>
  );
}
