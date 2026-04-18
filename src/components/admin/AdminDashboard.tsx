// =============================================================
//  AdminDashboard.tsx — Full Admin Panel with Content Management
//  Route: /admin/dashboard
//  Sections: Dashboard, Questions, Answers, Users, Themes, Announcements
//  Features: Delete with confirmation, bulk actions, reactive state
// =============================================================

import { useState } from 'react';
import { useAdminStore } from '../../lib/adminStore';
import { useThemeStore, THEME_OPTIONS } from '../../lib/themeStore';
import { MOCK_USERS, MOCK_STATS } from '../../lib/mockData';
import { useAdminDataStore } from '../../lib/adminDataStore';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import toast from 'react-hot-toast';
import {
  LogOut, Shield, Users, MessageSquare, Eye,
  TrendingUp, Clock, ChevronRight, Search,
  FileText, Tag, ArrowUpRight, Activity, Trash2, Ban,
  CheckCircle2, AlertTriangle, Crown, Home, Sparkles,
  RefreshCw, LayoutDashboard, Palette,
  Megaphone, X, Plus, Send, Edit3,
  ThumbsUp, Filter,
  Monitor, Zap, Lock,
  ArrowLeft, Menu, BarChart2,
  AlertCircle, Info
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onGoHome: () => void;
}

type SectionId = 'dashboard' | 'questions' | 'answers' | 'users' | 'themes' | 'announcements';

// ── Sidebar nav items ──
const NAV_ITEMS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',     label: 'Dashboard',         icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
  { id: 'questions',     label: 'Manage Questions',   icon: <FileText className="w-[18px] h-[18px]" /> },
  { id: 'answers',       label: 'Manage Answers',     icon: <MessageSquare className="w-[18px] h-[18px]" /> },
  { id: 'users',         label: 'Users',              icon: <Users className="w-[18px] h-[18px]" /> },
  { id: 'themes',        label: 'Theme Settings',     icon: <Palette className="w-[18px] h-[18px]" /> },
  { id: 'announcements', label: 'Announcements',      icon: <Megaphone className="w-[18px] h-[18px]" /> },
];

export default function AdminDashboard({ onLogout, onGoHome }: AdminDashboardProps) {
  const { loginTime } = useAdminStore();
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const formatTime = (iso: string | Date) => {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const sectionLabel = NAV_ITEMS.find(n => n.id === activeSection)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">

      {/* ═══════════════ DESKTOP SIDEBAR ═══════════════ */}
      <aside className={`hidden lg:flex flex-col border-r border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 transition-all duration-300 ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
        {/* Sidebar header */}
        <div className={`h-16 flex items-center border-b border-slate-200/60 dark:border-slate-700/60 px-4 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))' }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Proshnouttor</p>
                <p className="text-[10px] text-slate-400 font-medium">Admin Panel</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  active
                    ? 'text-white shadow-lg shadow-primary-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                style={active ? { background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--p-600, #4f46e5))' } : {}}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {active && !sidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <button onClick={onGoHome}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
            </button>
            <button onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* ═══════════════ MOBILE SIDEBAR OVERLAY ═══════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-in">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))' }}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Admin Panel</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    style={active ? { background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--p-600, #4f46e5))' } : {}}
                  >
                    {item.icon} <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <button onClick={onGoHome} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
              </button>
              <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* ── Top bar ── */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">{sectionLabel}</h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Session started {loginTime ? formatTime(loginTime) : 'recently'} · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))' }}>
              <Shield className="w-3 h-3" /> Admin
            </span>
            <button onClick={onGoHome} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Home className="w-3.5 h-3.5" /> Site
            </button>
          </div>
        </header>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-[1400px]">

            {/* ══════════════════════════════════════════════
                 SECTION: DASHBOARD
            ══════════════════════════════════════════════ */}
            {activeSection === 'dashboard' && <DashboardOverview formatTime={formatTime} onNav={setActiveSection} />}

            {/* ══════════════════════════════════════════════
                 SECTION: MANAGE QUESTIONS
            ══════════════════════════════════════════════ */}
            {activeSection === 'questions' && (
              <ManageQuestions searchFilter={searchFilter} setSearchFilter={setSearchFilter} formatTime={formatTime} />
            )}

            {/* ══════════════════════════════════════════════
                 SECTION: MANAGE ANSWERS
            ══════════════════════════════════════════════ */}
            {activeSection === 'answers' && (
              <ManageAnswers searchFilter={searchFilter} setSearchFilter={setSearchFilter} formatTime={formatTime} />
            )}

            {/* ══════════════════════════════════════════════
                 SECTION: USERS
            ══════════════════════════════════════════════ */}
            {activeSection === 'users' && (
              <ManageUsers searchFilter={searchFilter} setSearchFilter={setSearchFilter} />
            )}

            {/* ══════════════════════════════════════════════
                 SECTION: THEME SETTINGS
            ══════════════════════════════════════════════ */}
            {activeSection === 'themes' && <ThemeSettings />}

            {/* ══════════════════════════════════════════════
                 SECTION: ANNOUNCEMENTS
            ══════════════════════════════════════════════ */}
            {activeSection === 'announcements' && <AnnouncementsSection />}

          </div>
        </div>
      </main>
    </div>
  );
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

// ── Dashboard Overview ──
function DashboardOverview({ formatTime, onNav }: { formatTime: (d: string | Date) => string; onNav: (s: SectionId) => void }) {
  const { questions, answers } = useAdminDataStore();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, var(--p-600, #4f46e5), var(--a-600, #0891b2))' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium text-white/80">Welcome back, Admin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Proshnouttor Dashboard</h2>
          <p className="text-white/70 text-sm">
            Here's an overview of your platform today ·{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/5 translate-y-1/3" />
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Users',
            value: MOCK_STATS.users.toLocaleString(),
            icon: <Users className="w-6 h-6" />,
            change: '+23%',
            bg: 'var(--p-500, #6366f1)',
            light: 'var(--p-50, #eef2ff)',
          },
          {
            label: 'Total Questions',
            value: questions.length.toLocaleString(),
            icon: <FileText className="w-6 h-6" />,
            change: '+12%',
            bg: 'var(--a-500, #06b6d4)',
            light: 'var(--a-50, #ecfeff)',
          },
          {
            label: 'Total Answers',
            value: answers.length.toLocaleString(),
            icon: <MessageSquare className="w-6 h-6" />,
            change: '+8%',
            bg: '#10b981',
            light: '#ecfdf5',
          },
          {
            label: 'Total Tags',
            value: MOCK_STATS.tags.toLocaleString(),
            icon: <Tag className="w-6 h-6" />,
            change: '+5%',
            bg: '#f59e0b',
            light: '#fffbeb',
          },
        ].map((stat, i) => (
          <div key={i}
               className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                   style={{ backgroundColor: stat.light, color: stat.bg }}>
                {stat.icon}
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> {stat.change}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Recent Questions */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4" style={{ color: 'var(--p-500, #6366f1)' }} />
              Recent Questions
            </h3>
            <button onClick={() => onNav('questions')}
                    className="text-xs font-semibold flex items-center gap-1 hover:underline"
                    style={{ color: 'var(--p-500, #6366f1)' }}>
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {questions.slice(0, 5).map((q) => (
              <div key={q.id} className="px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{q.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {q._count?.answers ?? 0}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> {q.votes} votes
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {q.views}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatTime(q.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Questions', icon: <FileText className="w-4 h-4" />, section: 'questions' as SectionId },
                { label: 'Answers', icon: <MessageSquare className="w-4 h-4" />, section: 'answers' as SectionId },
                { label: 'Users', icon: <Users className="w-4 h-4" />, section: 'users' as SectionId },
                { label: 'Themes', icon: <Palette className="w-4 h-4" />, section: 'themes' as SectionId },
              ].map((action) => (
                <button key={action.label} onClick={() => onNav(action.section)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  style={{ color: 'var(--p-500, #6366f1)' }}>
                  <span className="group-hover:scale-110 transition-transform">{action.icon}</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Top Users
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {MOCK_USERS.slice(0, 4).map((u, i) => (
                <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-5 text-center">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <img src={u.image ?? ''} alt={u.name} className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.reputation.toLocaleString()} rep</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System health */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-emerald-500" />
          System Health
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'API Status', status: 'Operational', ok: true },
            { label: 'Database', status: 'Connected', ok: true },
            { label: 'Cache', status: 'Hit Rate 94%', ok: true },
            { label: 'CDN', status: 'Latency 12ms', ok: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.ok ? 'text-emerald-500' : 'text-red-500'}`} />
              <div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{item.label}</p>
                <p className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-600'}`}>{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Manage Questions ──
function ManageQuestions({ searchFilter, setSearchFilter, formatTime }: {
  searchFilter: string;
  setSearchFilter: (v: string) => void;
  formatTime: (d: string | Date) => string;
}) {
  const { questions, deleteQuestion } = useAdminDataStore();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = questions.filter((q) =>
    q.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (q.user?.name ?? '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const targetQuestion = deleteTarget
    ? questions.find((q) => q.id === deleteTarget)
    : null;

  // Count answers that will cascade-delete with this question
  const cascadeAnswerCount = deleteTarget
    ? questions.find((q) => q.id === deleteTarget)?._count?.answers ?? 0
    : 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((q) => q.id)));
    }
  };

  const handleBulkDelete = () => {
    let deleted = 0;
    selectedIds.forEach((id) => {
      if (deleteQuestion(id)) deleted++;
    });
    setSelectedIds(new Set());
    toast.success(`${deleted} question${deleted !== 1 ? 's' : ''} deleted permanently`);
  };

  const handleSingleDelete = () => {
    if (!deleteTarget) return;
    const ok = deleteQuestion(deleteTarget);
    if (ok) toast.success('Question deleted permanently');
    else toast.error('Question not found');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            All Questions
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--p-50, #eef2ff)', color: 'var(--p-700, #4338ca)' }}>
              {questions.length}
            </span>
          </h2>
          <p className="text-sm text-slate-500">{questions.length} questions in database</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--p-500, #6366f1)' } as React.CSSProperties} />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))' }}>
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 animate-slide-up">
          <span className="text-sm font-semibold text-red-700 dark:text-red-400">
            {selectedIds.size} selected
          </span>
          <button onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">
            <Trash2 className="w-3.5 h-3.5" /> Delete Selected
          </button>
          <button onClick={() => setSelectedIds(new Set())}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/60"
                  style={{ background: 'linear-gradient(135deg, var(--p-50, #eef2ff), var(--a-50, #ecfeff))' }}>
                <th className="px-3 py-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 accent-red-500 cursor-pointer"
                  />
                </th>
                <th className="text-left px-3 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Question</th>
                <th className="text-center px-3 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">Votes</th>
                <th className="text-center px-3 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">Answers</th>
                <th className="text-center px-3 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">Views</th>
                <th className="text-center px-3 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="text-center px-3 py-3.5 font-semibold text-slate-700 dark:text-slate-300 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map((q) => (
                <tr key={q.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedIds.has(q.id) ? 'bg-red-50/50 dark:bg-red-900/5' : ''}`}>
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(q.id)}
                      onChange={() => toggleSelect(q.id)}
                      className="w-4 h-4 rounded border-slate-300 accent-red-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{q.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <img src={q.user?.image ?? ''} alt="" className="w-4 h-4 rounded-full bg-slate-200" />
                      <span className="text-xs text-slate-500">{q.user?.name}</span>
                      <span className="text-xs text-slate-400">· {formatTime(q.createdAt)}</span>
                    </div>
                    {q.tags && q.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {q.tags.slice(0, 3).map((t: { tag: { color: string; name: string } }, i: number) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${t.tag.color}18`, color: t.tag.color }}>
                            {t.tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="text-center px-3 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                      <ThumbsUp className="w-3 h-3" /> {q.votes}
                    </span>
                  </td>
                  <td className="text-center px-3 py-4 hidden md:table-cell">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      {q._count?.answers ?? 0}
                    </span>
                  </td>
                  <td className="text-center px-3 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{q.views.toLocaleString()}</span>
                  </td>
                  <td className="text-center px-3 py-4">
                    {(q._count?.answers ?? 0) > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">Answered</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600">Open</span>
                    )}
                  </td>
                  <td className="text-center px-3 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(q.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all hover:scale-110" title="Delete permanently">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No questions found</p>
            <p className="text-xs text-slate-400 mt-1">
              {searchFilter ? 'Try adjusting your search query' : 'Questions will appear here when users post them'}
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleSingleDelete}
        targetType="question"
        targetPreview={targetQuestion?.title ?? ''}
        targetMeta={`by ${targetQuestion?.user?.name ?? 'Unknown'} · ${targetQuestion?.votes ?? 0} votes · ${targetQuestion?.views ?? 0} views`}
        cascadeCount={cascadeAnswerCount}
      />
    </div>
  );
}

// ── Manage Answers ──
function ManageAnswers({ searchFilter, setSearchFilter, formatTime }: {
  searchFilter: string;
  setSearchFilter: (v: string) => void;
  formatTime: (d: string | Date) => string;
}) {
  const { answers, deleteAnswer, questions } = useAdminDataStore();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = answers.filter((a) =>
    a.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (a.user?.name ?? '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const targetAnswer = deleteTarget
    ? answers.find((a) => a.id === deleteTarget)
    : null;

  const linkedQuestion = targetAnswer
    ? questions.find((q) => q.id === targetAnswer.questionId)
    : null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const handleBulkDelete = () => {
    let deleted = 0;
    selectedIds.forEach((id) => {
      if (deleteAnswer(id)) deleted++;
    });
    setSelectedIds(new Set());
    toast.success(`${deleted} answer${deleted !== 1 ? 's' : ''} deleted permanently`);
  };

  const handleSingleDelete = () => {
    if (!deleteTarget) return;
    const ok = deleteAnswer(deleteTarget);
    if (ok) toast.success('Answer deleted permanently');
    else toast.error('Answer not found');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            All Answers
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--a-50, #ecfeff)', color: 'var(--a-700, #0e7490)' }}>
              {answers.length}
            </span>
          </h2>
          <p className="text-sm text-slate-500">{answers.length} answers in database</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search answers or authors..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--p-500, #6366f1)' } as React.CSSProperties} />
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 animate-slide-up">
          <span className="text-sm font-semibold text-red-700 dark:text-red-400">
            {selectedIds.size} selected
          </span>
          <button onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">
            <Trash2 className="w-3.5 h-3.5" /> Delete Selected
          </button>
          <button onClick={() => setSelectedIds(new Set())}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Clear selection
          </button>
        </div>
      )}

      {/* Answer cards */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const parentQuestion = questions.find((q) => q.id === a.questionId);
          return (
            <div key={a.id}
                 className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5 hover:shadow-lg transition-all ${selectedIds.has(a.id) ? 'ring-2 ring-red-200 dark:ring-red-800/50 bg-red-50/30 dark:bg-red-900/5' : ''}`}>
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(a.id)}
                    onChange={() => toggleSelect(a.id)}
                    className="w-4 h-4 rounded border-slate-300 accent-red-500 cursor-pointer"
                  />
                </div>

                {/* Author avatar */}
                <div className="relative shrink-0">
                  <img src={a.user?.image ?? ''} alt={a.user?.name} className="w-10 h-10 rounded-xl bg-slate-200" />
                  {a.isAccepted && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white dark:border-slate-900">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{a.user?.name}</span>
                    {a.isAccepted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Accepted
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTime(a.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">{a.content}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <ThumbsUp className="w-3.5 h-3.5" /> {a.votes} upvotes
                    </span>
                    {parentQuestion && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Question: <span className="text-slate-500 truncate max-w-[200px] inline-block align-bottom">{parentQuestion.title.slice(0, 50)}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors" title="Edit">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget(a.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all hover:scale-110" title="Delete permanently">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No answers found</p>
            <p className="text-xs text-slate-400 mt-1">
              {searchFilter ? 'Try adjusting your search query' : 'Answers will appear here when users respond to questions'}
            </p>
          </div>
        )}
      </div>

      {/* Select all bar */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filtered.length > 0 && selectedIds.size === filtered.length}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 accent-red-500 cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-500">
              Select all {filtered.length} answer{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Showing {filtered.length} of {answers.length}
          </span>
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleSingleDelete}
        targetType="answer"
        targetPreview={targetAnswer?.content?.slice(0, 120) ?? ''}
        targetMeta={`by ${targetAnswer?.user?.name ?? 'Unknown'} · ${targetAnswer?.votes ?? 0} votes${targetAnswer?.isAccepted ? ' · ✅ Accepted' : ''}${linkedQuestion ? ` · On: "${linkedQuestion.title.slice(0, 40)}"` : ''}`}
      />
    </div>
  );
}

// ── Manage Users ──
function ManageUsers({ searchFilter, setSearchFilter }: {
  searchFilter: string;
  setSearchFilter: (v: string) => void;
}) {
  const { users, questions, answers, deleteUser, banUser, unbanUser, deleteMultipleUsers, banMultipleUsers, unbanMultipleUsers } = useAdminDataStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; userId: string; userName: string; questionCount: number }>({ open: false, userId: '', userName: '', questionCount: 0 });
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const activeUsers = users.filter((u) => !u.banned).length;
  const bannedUsers = users.filter((u) => u.banned).length;
  const avgReputation = users.length > 0 ? Math.round(users.reduce((s, u) => s + u.reputation, 0) / users.length) : 0;
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((u) => u.id)));
    }
  };

  const handleDeleteUser = (id: string) => {
    const user = users.find((u) => u.id === id);
    const qCount = questions.filter((q) => q.userId === id).length;
    setDeleteModal({ open: true, userId: id, userName: user?.name ?? 'User', questionCount: qCount });
  };

  const confirmDeleteUser = () => {
    deleteUser(deleteModal.userId);
    setDeleteModal({ open: false, userId: '', userName: '', questionCount: 0 });
    selectedIds.delete(deleteModal.userId);
    setSelectedIds(new Set(selectedIds));
    toast.success(`User "${deleteModal.userName}" deleted permanently`);
  };

  const handleBanToggle = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    if (user.banned) {
      unbanUser(id);
      toast.success(`"${user.name}" has been unbanned`);
    } else {
      banUser(id);
      toast.success(`"${user.name}" has been banned`);
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteModal(true);
  };

  const confirmBulkDelete = () => {
    const ids = Array.from(selectedIds);
    deleteMultipleUsers(ids);
    setSelectedIds(new Set());
    setBulkDeleteModal(false);
    toast.success(`${ids.length} user(s) deleted permanently`);
  };

  const handleBulkBan = () => {
    const ids = Array.from(selectedIds).filter((id) => {
      const u = users.find((x) => x.id === id);
      return u && !u.banned;
    });
    banMultipleUsers(ids);
    toast.success(`${ids.length} user(s) banned`);
  };

  const handleBulkUnban = () => {
    const ids = Array.from(selectedIds).filter((id) => {
      const u = users.find((x) => x.id === id);
      return u && u.banned;
    });
    unbanMultipleUsers(ids);
    toast.success(`${ids.length} user(s) unbanned`);
  };

  const getReputationBadge = (rep: number) => {
    if (rep >= 5000) return { label: 'Expert', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' };
    if (rep >= 2000) return { label: 'Advanced', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' };
    if (rep >= 1000) return { label: 'Member', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' };
    return { label: 'Newcomer', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' };
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: 'var(--p-500, #6366f1)' }} />
            User Management
          </h2>
          <p className="text-sm text-slate-500">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--p-500, #6366f1)' } as React.CSSProperties} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: users.length, icon: <Users className="w-4 h-4" />, color: 'var(--p-500, #6366f1)' },
          { label: 'Active', value: activeUsers, icon: <Activity className="w-4 h-4" />, color: '#10b981' },
          { label: 'Banned', value: bannedUsers, icon: <Ban className="w-4 h-4" />, color: '#ef4444' },
          { label: 'Avg Reputation', value: avgReputation.toLocaleString(), icon: <Crown className="w-4 h-4" />, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
              {s.icon}
              <span className="text-xs font-medium text-slate-500">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg"
             style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--p-500, #6366f1)' }}>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {selectedIds.size} selected
          </span>
          <div className="flex-1" />
          <button onClick={handleBulkBan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:hover:bg-amber-900/60 transition-colors">
            <Ban className="w-3.5 h-3.5" /> Ban
          </button>
          <button onClick={handleBulkUnban}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5" /> Unban
          </button>
          <button onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-[44px_2fr_1.5fr_100px_100px_130px_80px] items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="flex justify-center">
            <input type="checkbox"
              checked={selectedIds.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-[var(--p-500,#6366f1)] cursor-pointer" />
          </div>
          <span>User</span>
          <span>Email</span>
          <span className="text-center">Reputation</span>
          <span className="text-center">Questions</span>
          <span className="text-center">Status</span>
          <span className="text-center">Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No users found</p>
            <p className="text-sm text-slate-400 mt-1">
              {searchFilter ? 'Try adjusting your search' : 'No users registered yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((u) => {
              const isSelected = selectedIds.has(u.id);
              const userQuestions = questions.filter((q) => q.userId === u.id).length;
              const userAnswers = answers.filter((a) => a.userId === u.id).length;
              const badge = getReputationBadge(u.reputation);
              return (
                <div key={u.id}
                  className={`grid grid-cols-1 md:grid-cols-[44px_2fr_1.5fr_100px_100px_130px_80px] items-center gap-2 px-5 py-4 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 ${isSelected ? 'bg-red-50/60 dark:bg-red-900/10' : ''}`}>

                  {/* Checkbox */}
                  <div className="hidden md:flex justify-center">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(u.id)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-[var(--p-500,#6366f1)] cursor-pointer" />
                  </div>

                  {/* User info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img src={u.image ?? ''} alt={u.name}
                        className={`w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 shadow-sm ${u.banned ? 'opacity-50 grayscale' : ''}`} />
                      {!u.banned && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      )}
                      {u.banned && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                          <Ban className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm truncate ${u.banned ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                        {u.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{userAnswers} answers</span>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="hidden md:flex items-center min-w-0">
                    <span className="text-sm text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                      <Lock className="w-3 h-3 shrink-0" />
                      {u.email}
                    </span>
                  </div>

                  {/* Reputation */}
                  <div className="hidden md:flex justify-center">
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{u.reputation.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">rep</p>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="hidden md:flex justify-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold"
                      style={{ backgroundColor: 'var(--p-50, #eef2ff)', color: 'var(--p-600, #4f46e5)' }}>
                      {userQuestions}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="hidden md:flex justify-center">
                    {u.banned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                        <Ban className="w-3 h-3" /> Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="hidden md:flex justify-center items-center gap-1">
                    <button onClick={() => handleBanToggle(u.id)} title={u.banned ? 'Unban user' : 'Ban user'}
                      className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${u.banned ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}>
                      {u.banned ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} title="Delete user permanently"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile card view */}
                  <div className="md:hidden col-span-full flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> {u.email}</span>
                      <span>🏆 {u.reputation}</span>
                      <span>📝 {userQuestions}Q</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(u.id)}
                        className="w-3.5 h-3.5 rounded border-slate-300 accent-[var(--p-500,#6366f1)] cursor-pointer" />
                      <button onClick={() => handleBanToggle(u.id)}
                        className={`p-1.5 rounded-lg ${u.banned ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {u.banned ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing {filtered.length} of {users.length} users
            </span>
            <span className="text-xs text-slate-400">
              Joined between {new Date(Math.min(...users.map(u => new Date(u.createdAt).getTime()))).toLocaleDateString()} — {new Date(Math.max(...users.map(u => new Date(u.createdAt).getTime()))).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Delete single user confirmation */}
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, userId: '', userName: '', questionCount: 0 })}
        onConfirm={confirmDeleteUser}
        targetType="user"
        targetPreview={deleteModal.userName}
        targetMeta={`${deleteModal.questionCount} questions will also be deleted`}
        cascadeCount={deleteModal.questionCount}
      />

      {/* Bulk delete confirmation */}
      <ConfirmDeleteModal
        open={bulkDeleteModal}
        onClose={() => setBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        targetType="user"
        targetPreview={`${selectedIds.size} selected users`}
        targetMeta="All their questions and answers will also be permanently deleted"
        cascadeCount={-1}
      />
    </div>
  );
}

// ── Theme Settings ──
function ThemeSettings() {
  const { theme, changeTheme } = useThemeStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Theme Settings</h2>
        <p className="text-sm text-slate-500">Customize the look and feel of your platform</p>
      </div>

      {/* Current theme */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Palette className="w-4 h-4" style={{ color: 'var(--p-500, #6366f1)' }} />
          Active Theme
        </h3>
        <p className="text-sm text-slate-500 mb-4">Current: <span className="font-semibold" style={{ color: 'var(--p-500, #6366f1)' }}>{THEME_OPTIONS.find(t => t.id === theme)?.label}</span></p>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {THEME_OPTIONS.map((opt) => {
            const active = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => { changeTheme(opt.id); toast.success(`Theme changed to ${opt.label}`); }}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
                  active
                    ? 'border-current shadow-lg scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
                }`}
                style={active ? { borderColor: opt.preview.primary } : {}}
              >
                {active && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white"
                       style={{ backgroundColor: opt.preview.primary }}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</p>
                    <p className="text-[11px] text-slate-500">{opt.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-xl shadow-inner" style={{ backgroundColor: opt.preview.primary }} />
                  <div className="w-10 h-10 rounded-xl shadow-inner" style={{ backgroundColor: opt.preview.accent }} />
                  <div className="w-10 h-10 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700" style={{ backgroundColor: opt.preview.bg }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color palette preview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4" style={{ color: 'var(--a-500, #06b6d4)' }} />
          Color Palette Preview
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="text-center">
              <div className="w-full aspect-square rounded-xl mb-1.5 border border-slate-100 dark:border-slate-700"
                   style={{ backgroundColor: `var(--p-${shade}, #6366f1)` }} />
              <span className="text-[10px] text-slate-500 font-mono">{shade}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">Primary color scale — applied across all UI components</p>
      </div>

      {/* Preview buttons */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Monitor className="w-4 h-4" style={{ color: 'var(--p-500, #6366f1)' }} />
          Component Preview
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))' }}>
            Gradient Button
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors"
                  style={{ borderColor: 'var(--p-500, #6366f1)', color: 'var(--p-500, #6366f1)' }}>
            Outline Button
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: 'var(--p-500, #6366f1)' }}>
            Solid Button
          </button>
          <span className="px-4 py-2 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'var(--p-50, #eef2ff)', color: 'var(--p-700, #4338ca)' }}>
            Tag Badge
          </span>
          <span className="px-4 py-2 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'var(--a-50, #ecfeff)', color: 'var(--a-700, #0e7490)' }}>
            Info Badge
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Announcements ──
function AnnouncementsSection() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success' | 'urgent'>('info');
  type AnnType = 'info' | 'warning' | 'success' | 'urgent';
  interface Ann { id: string; title: string; body: string; type: AnnType; date: string; active: boolean }

  const [announcements, setAnnouncements] = useState<Ann[]>([
    {
      id: 'ann_1',
      title: 'Welcome to Proshnouttor!',
      body: 'We are excited to launch our new Q&A platform. Start asking and answering questions today.',
      type: 'success',
      date: '2024-01-01T00:00:00Z',
      active: true,
    },
    {
      id: 'ann_2',
      title: 'Scheduled Maintenance',
      body: 'The platform will undergo maintenance on Jan 15th from 2-4 AM UTC. Expect brief downtime.',
      type: 'warning',
      date: '2024-01-10T00:00:00Z',
      active: true,
    },
    {
      id: 'ann_3',
      title: 'New Feature: Dark Mode',
      body: 'You can now switch between multiple themes including dark mode. Visit Theme Settings to customize.',
      type: 'info',
      date: '2024-01-12T00:00:00Z',
      active: false,
    },
  ]);

  const typeConfig = {
    info:    { label: 'Info',    color: 'var(--a-500, #06b6d4)', bg: 'var(--a-50, #ecfeff)',  icon: <Info className="w-4 h-4" /> },
    warning: { label: 'Warning', color: '#f59e0b',               bg: '#fffbeb',               icon: <AlertTriangle className="w-4 h-4" /> },
    success: { label: 'Success', color: '#10b981',               bg: '#ecfdf5',               icon: <CheckCircle2 className="w-4 h-4" /> },
    urgent:  { label: 'Urgent',  color: '#ef4444',               bg: '#fef2f2',               icon: <AlertCircle className="w-4 h-4" /> },
  };

  const handlePost = () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in title and body');
      return;
    }
    const newAnn = {
      id: `ann_${Date.now()}`,
      title,
      body,
      type,
      date: new Date().toISOString(),
      active: true,
    };
    setAnnouncements([newAnn, ...announcements]);
    setTitle('');
    setBody('');
    setType('info');
    toast.success('Announcement posted!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Announcements</h2>
        <p className="text-sm text-slate-500">Manage platform-wide announcements</p>
      </div>

      {/* Compose */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" style={{ color: 'var(--p-500, #6366f1)' }} />
          New Announcement
        </h3>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': 'var(--p-500, #6366f1)' } as React.CSSProperties} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="Write your announcement..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 resize-none"
            style={{ '--tw-ring-color': 'var(--p-500, #6366f1)' } as React.CSSProperties} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Type:</span>
              {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map((t) => {
                const cfg = typeConfig[t];
                const active = type === t;
                return (
                  <button key={t} onClick={() => setType(t)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active ? 'ring-2 scale-105' : 'opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: cfg.bg, color: cfg.color, ...(active ? { '--tw-ring-color': cfg.color } as React.CSSProperties : {}) }}>
                    {cfg.icon} {cfg.label}
                  </button>
                );
              })}
            </div>
            <button onClick={handlePost}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))' }}>
              <Send className="w-4 h-4" /> Post Announcement
            </button>
          </div>
        </div>
      </div>

      {/* Existing announcements */}
      <div className="space-y-3">
        {announcements.map((ann) => {
          const cfg = typeConfig[ann.type];
          return (
            <div key={ann.id}
                 className={`rounded-2xl border p-5 transition-all ${ann.active ? 'opacity-100' : 'opacity-50'}`}
                 style={{ borderColor: `${cfg.color}30`, backgroundColor: cfg.bg }}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0" style={{ color: cfg.color }}>{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}>
                      {ann.type}
                    </span>
                    {!ann.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{ann.body}</p>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, active: !a.active } : a))}
                    className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 transition-colors"
                    title={ann.active ? 'Deactivate' : 'Activate'}>
                    {ann.active ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => setAnnouncements(announcements.filter(a => a.id !== ann.id))}
                    className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
