// =============================================================
//  RightSidebar.tsx
//  Trending Tags + Top Contributors sourced from mockData
//  Uses primary-*/accent-* theme-aware color classes.
// =============================================================

import { TrendingUp, Award, ExternalLink, BarChart2, Database, CheckCircle2 } from 'lucide-react';
import { MOCK_TAGS, MOCK_USERS, MOCK_STATS } from '../lib/mockData';

// ── Colour helper (hex → Tailwind classes) ────────────────────
function tagPillClass(color: string): string {
  const map: Record<string, string> = {
    '#f7df1e': 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    '#61dafb': 'bg-sky-50    text-sky-700    border-sky-200    hover:bg-sky-100',
    '#3178c6': 'bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100',
    '#339933': 'bg-lime-50   text-lime-700   border-lime-200   hover:bg-lime-100',
    '#336791': 'bg-blue-50   text-blue-800   border-blue-200   hover:bg-blue-100',
    '#2d3748': 'bg-slate-100 text-slate-700  border-slate-200  hover:bg-slate-200',
    '#38bdf8': 'bg-cyan-50   text-cyan-700   border-cyan-200   hover:bg-cyan-100',
    '#6366f1': 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100',
    '#264de4': 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100',
    '#3572A5': 'bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100',
  };
  return map[color] ?? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
}

// Rep badge gradients per rank
const rankGradients = [
  'from-primary-500 to-primary-600',
  'from-sky-400    to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-rose-400   to-pink-600',
  'from-amber-400  to-orange-500',
];
const rankBadges = ['🥇', '🥈', '🥉', '', ''];

// ─────────────────────────────────────────────────────────────
export default function RightSidebar() {
  const topTags  = MOCK_TAGS.slice(0, 8);
  const topUsers = MOCK_USERS.slice(0, 5);

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-5 pt-2">

      {/* ── Platform Stats ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm overflow-hidden theme-transition">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
          <BarChart2 className="w-4 h-4 text-primary-500 dark:text-primary-400" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Platform Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800">
          {[
            { label: 'Questions', value: MOCK_STATS.questions.toLocaleString(), color: 'text-primary-600 dark:text-primary-400' },
            { label: 'Answers',   value: MOCK_STATS.answers.toLocaleString(),   color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Users',     value: MOCK_STATS.users.toLocaleString(),      color: 'text-blue-600 dark:text-blue-400'    },
            { label: 'Tags',      value: MOCK_STATS.tags.toLocaleString(),       color: 'text-amber-600 dark:text-amber-400'   },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-slate-800/80 px-4 py-3 flex flex-col items-center">
              <span className={`text-lg font-extrabold ${color}`}>{value}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trending Tags ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm overflow-hidden theme-transition">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
          <TrendingUp className="w-4 h-4 text-primary-500 dark:text-primary-400" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Trending Tags</h3>
        </div>

        <div className="p-3 flex flex-wrap gap-2">
          {topTags.map(({ name, color, _count }) => (
            <a
              key={name}
              href="#"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium transition-all hover:scale-105 hover:shadow-md ${tagPillClass(color)} dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100`}
            >
              <Database className="w-2.5 h-2.5 opacity-60" />
              <span>{name}</span>
              <span className="opacity-50 text-[10px]">×{_count.questions}</span>
            </a>
          ))}
        </div>

        <div className="px-4 pb-3">
          <a
            href="#"
            className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium theme-transition"
          >
            <span>View all tags</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── Top Contributors ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm overflow-hidden theme-transition">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Top Contributors</h3>
        </div>

        <div className="p-2 flex flex-col gap-0.5">
          {topUsers.map((user, i) => (
            <a
              key={user.id}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 theme-transition group"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankGradients[i]} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
                  >
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {rankBadges[i] && (
                  <span className="absolute -top-1 -right-1 text-[10px] leading-none">
                    {rankBadges[i]}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 theme-transition truncate">
                  {user.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />
                  <span className="text-[10px] text-amber-600 font-bold">
                    {user.reputation.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">rep</span>
                </div>
              </div>

              {/* Rank number */}
              <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 flex-shrink-0">
                #{i + 1}
              </span>
            </a>
          ))}
        </div>

        <div className="px-4 pb-3 pt-1">
          <a
            href="#"
            className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium theme-transition"
          >
            <span>View all users</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── Schema badge ── */}
      <div className="rounded-2xl border border-dashed border-primary-200 dark:border-slate-700 bg-primary-50/40 dark:bg-primary-950/20 px-4 py-4 theme-transition">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold text-primary-700 dark:text-primary-400">DB Schema Active</span>
        </div>
        <p className="text-[11px] text-primary-600 dark:text-primary-500 leading-relaxed">
          PostgreSQL + Prisma ORM connected. Run{' '}
          <code className="bg-primary-100 dark:bg-primary-950 px-1 rounded font-mono text-[10px]">
            npx prisma migrate dev
          </code>{' '}
          to apply migrations locally.
        </p>
      </div>

    </aside>
  );
}
