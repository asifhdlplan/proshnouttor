// =============================================================
//  MainContent.tsx
//  Displays paginated questions sourced from mockData
//  Uses primary-*/accent-* theme-aware color classes.
// =============================================================

import { useState, useEffect } from 'react';
import {
  MessageCircle,
  ThumbsUp,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Clock,
  Tag as TagIcon,
  X,
} from 'lucide-react';
import { MOCK_QUESTIONS, MOCK_STATS } from '../lib/mockData';
import type { Question, SortOrder } from '../lib/types';
import { useAuthStore } from '../lib/authStore';

// ── Helpers ───────────────────────────────────────────────────
function timeAgo(dateStr: string | Date): string {
  const date = new Date(dateStr as string);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60)   return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function tagColorClass(color: string): string {
  const map: Record<string, string> = {
    '#f7df1e': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    '#61dafb': 'bg-sky-50 text-sky-700 border-sky-100',
    '#3178c6': 'bg-blue-50 text-blue-700 border-blue-100',
    '#339933': 'bg-lime-50 text-lime-700 border-lime-100',
    '#336791': 'bg-blue-50 text-blue-800 border-blue-100',
    '#2d3748': 'bg-slate-100 text-slate-700 border-slate-200',
    '#38bdf8': 'bg-cyan-50 text-cyan-700 border-cyan-100',
    '#6366f1': 'bg-primary-50 text-primary-700 border-primary-200',
    '#264de4': 'bg-primary-50 text-primary-700 border-primary-100',
    '#3572A5': 'bg-blue-50 text-blue-700 border-blue-100',
  };
  return map[color] ?? 'bg-slate-50 text-slate-600 border-slate-200';
}

// ── Sort logic ────────────────────────────────────────────────
function sortQuestions(questions: Question[], sort: SortOrder): Question[] {
  const q = [...questions];
  switch (sort) {
    case 'hot':    return q.sort((a, b) => b.votes  - a.votes);
    case 'active': return q.sort((a, b) => new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime());
    case 'week':
    case 'month':
    case 'newest':
    default:       return q.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
  }
}

// ── Filter tabs ───────────────────────────────────────────────
const filterTabs: { id: SortOrder; label: string }[] = [
  { id: 'newest', label: 'Newest'     },
  { id: 'active', label: 'Active'     },
  { id: 'hot',    label: '🔥 Hot'     },
  { id: 'week',   label: 'This Week'  },
  { id: 'month',  label: 'This Month' },
];

// ─────────────────────────────────────────────────────────────
//  Ask Question Modal
// ─────────────────────────────────────────────────────────────
interface AskQuestionModalProps {
  onClose: () => void;
  onSubmit: (q: Question) => void;
}

function AskQuestionModal({ onClose, onSubmit }: AskQuestionModalProps) {
  const [title, setTitle]   = useState('');
  const [body,  setBody]    = useState('');
  const [tags,  setTags]    = useState('');
  const [error, setError]   = useState('');
  const { user }            = useAuthStore();

  function handleSubmit() {
    if (!title.trim()) { setError('Please enter a question title.'); return; }
    if (!body.trim())  { setError('Please describe your question.'); return; }
    setError('');

    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    const authorId   = user?.id   ?? 'guest';
    const authorName = user?.name ?? 'Guest User';
    const authorEmail = user?.email ?? '';
    const authorRep  = user?.reputation ?? 1;

    const newQ: Question = {
      id:          `q_new_${Date.now()}`,
      title:       title.trim(),
      description: body.trim(),
      userId:      authorId,
      votes:       0,
      views:       0,
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
      user: {
        id: authorId,
        name: authorName,
        email: authorEmail,
        image: user?.image ?? null,
        reputation: authorRep,
        createdAt: user?.createdAt ?? '',
        updatedAt: '',
      },
      tags: tagList.map((name, i) => ({
        tag: { id: `tag_new_${i}`, name, color: '#6366f1', createdAt: '' },
      })),
      answers: [],
      _count: { answers: 0 },
    };
    onSubmit(newQ);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Ask a Question</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-medium px-4 py-2.5 rounded-xl">
              <X className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Question Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How do I center a div in CSS?"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 focus:border-primary-400 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">Be specific and imagine you're asking another developer.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Describe your problem in detail. Include what you've already tried, error messages, relevant code snippets..."
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 focus:border-primary-400 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              <TagIcon className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. javascript, react, css (comma-separated)"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 focus:border-primary-400 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">Add up to 5 tags to describe what your question is about.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 theme-gradient text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            Post Question
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Question Card
// ─────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  onClick,
}: {
  question: Question;
  onClick: () => void;
}) {
  const hasAccepted = question.answers?.some((a) => a.isAccepted);
  
  return (
    <div
      onClick={onClick}
      className="group flex gap-4 p-5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 theme-transition cursor-pointer"
    >
      {/* ── Stats column ── */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2.5 w-14 pt-0.5">
        {/* Votes */}
        <div className="flex flex-col items-center">
          <div className={`text-base font-bold leading-none ${
            question.votes > 0
              ? 'text-primary-600 dark:text-primary-400'
              : question.votes < 0
              ? 'text-red-500'
              : 'text-slate-400 dark:text-slate-500'
          }`}>
            {question.votes}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">votes</div>
        </div>

        {/* Answers */}
        <div className={`flex flex-col items-center px-2 py-1 rounded-xl ${
          hasAccepted
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50'
            : (question._count?.answers ?? 0) > 0
            ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700'
            : 'border border-dashed border-slate-200 dark:border-slate-700'
        }`}>
          {hasAccepted
            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mb-0.5" />
            : <MessageCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mb-0.5" />
          }
          <div className={`text-sm font-bold leading-none ${
            hasAccepted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'
          }`}>
            {question._count?.answers ?? question.answers?.length ?? 0}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500">ans</div>
        </div>

        {/* Views */}
        <div className="flex flex-col items-center">
          <Eye className="w-3 h-3 text-slate-300 dark:text-slate-600 mb-0.5" />
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {question.views >= 1000
              ? `${(question.views / 1000).toFixed(1)}k`
              : question.views}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500">views</div>
        </div>
      </div>

      {/* ── Content column ── */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 theme-transition line-clamp-2 mb-1.5">
          {question.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {question.description}
        </p>

        {/* Tags + meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {question.tags?.map(({ tag }) => (
              <span
                key={tag.id}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] font-medium theme-transition ${tagColorClass(tag.color)} dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Author + time */}
          <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            {question.user?.image ? (
              <img
                src={question.user.image}
                alt={question.user.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950/40 flex items-center justify-center text-[10px] font-bold text-primary-600 dark:text-primary-400">
                {question.user?.name?.[0] ?? '?'}
              </div>
            )}
            <span className="text-[11px] text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer">
              {question.user?.name ?? 'Unknown'}
            </span>
            <span className="text-[11px] text-slate-300 dark:text-slate-700">·</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {timeAgo(question.createdAt as string)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Voting legend / empty state
// ─────────────────────────────────────────────────────────────
function VoteLegend() {
  return (
    <div className="flex items-center gap-6 py-3 px-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
      <div className="flex items-center gap-1.5">
        <ArrowUp className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
        <span>Votes = community score</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>Green badge = accepted answer</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span>Views = impressions</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Platform Stats Bar
// ─────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {[
        { label: 'Questions', value: MOCK_STATS.questions.toLocaleString(), icon: MessageCircle, color: 'text-primary-500 dark:text-primary-400' },
        { label: 'Answers',   value: MOCK_STATS.answers.toLocaleString(),   icon: CheckCircle2,  color: 'text-emerald-500' },
        { label: 'Votes',     value: '8,420',                               icon: ThumbsUp,      color: 'text-amber-500'   },
        { label: 'Views',     value: '142k',                                icon: Eye,           color: 'text-accent-500'  },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm theme-transition hover:shadow-md">
          <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
          <div>
            <div className="text-base font-bold text-slate-800 dark:text-slate-100 leading-none">{value}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Pagination
// ─────────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowUp className="w-3 h-3 rotate-[-90deg]" /> Prev
        </button>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MainContent
// ─────────────────────────────────────────────────────────────
const PAGE_SIZE = 5;

interface MainContentProps {
  showModal:    boolean;
  onCloseModal: () => void;
  onAskQuestion: () => void;
  searchQuery?: string;
  onSelectQuestion: (id: string) => void;
}

export default function MainContent({
  showModal,
  onCloseModal,
  onAskQuestion,
  searchQuery = '',
  onSelectQuestion,
}: MainContentProps) {
  const [activeFilter, setActiveFilter] = useState<SortOrder>('newest');
  const [page, setPage]                 = useState(1);
  const [questions, setQuestions]       = useState<Question[]>(MOCK_QUESTIONS);
  const [isLoading, setIsLoading]       = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery, page]);

  // Filter by search
  const filtered = questions.filter(q => {
    if (!searchQuery.trim()) return true;
    const s = searchQuery.toLowerCase();
    return (
      q.title.toLowerCase().includes(s) ||
      q.description.toLowerCase().includes(s) ||
      q.tags?.some(({ tag }) => tag.name.toLowerCase().includes(s))
    );
  });

  // Sort
  const sorted = sortQuestions(filtered, activeFilter);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleNewQuestion(q: Question) {
    setQuestions(prev => [q, ...prev]);
    setPage(1);
    setActiveFilter('newest');
  }

  function handleFilterChange(f: SortOrder) {
    setActiveFilter(f);
    setPage(1);
  }

  return (
    <>
      {/* Ask Question Modal */}
      {showModal && (
        <AskQuestionModal onClose={onCloseModal} onSubmit={handleNewQuestion} />
      )}

      <main className="flex-1 min-w-0 pt-2">

        {/* ── Stats bar ── */}
        <StatsBar />

        {/* ── Section header ── */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">All Questions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filtered.length.toLocaleString()}
              </span>{' '}
              question{filtered.length !== 1 ? 's' : ''} found
              {searchQuery && (
                <span className="ml-1 text-primary-500 font-medium">for &ldquo;{searchQuery}&rdquo;</span>
              )}
            </p>
          </div>
          <button
            onClick={onAskQuestion}
            className="flex items-center gap-2 theme-gradient text-white text-sm font-semibold px-4 py-2.5 rounded-xl theme-transition theme-shadow hover:shadow-lg transform hover:-translate-y-0.5 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Ask Question
          </button>
        </div>

        {/* ── Filter bar ── */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {filterTabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleFilterChange(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold theme-transition ${
                  activeFilter === id
                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-sm border border-slate-200/50 dark:border-slate-600'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs font-medium px-3 py-2 rounded-xl theme-transition">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* ── Vote legend ── */}
        <VoteLegend />

        {/* ── Questions list ── */}
        <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm overflow-hidden theme-transition">
          {isLoading ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 flex gap-4 animate-pulse bg-white dark:bg-slate-900/20">
                  <div className="flex flex-col items-center gap-2.5 w-14 pt-0.5">
                    <div className="h-4 w-6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 border-dashed rounded-lg"></div>
                    <div className="h-3 w-5 bg-slate-50 dark:bg-slate-800 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
                    <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded mb-1.5"></div>
                    <div className="h-3 w-5/6 bg-slate-50 dark:bg-slate-800 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="h-5 w-14 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                        <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                      </div>
                      <div className="h-5 w-24 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-primary-400 dark:text-primary-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">No questions found</h2>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mb-5 leading-relaxed">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term or filter.`
                  : 'Be the first to ask a question in this community!'}
              </p>
              <button
                onClick={onAskQuestion}
                className="flex items-center gap-2 theme-gradient text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md theme-transition hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Ask a Question
              </button>
            </div>
          ) : (
            paginated.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onClick={() => onSelectQuestion(q.id)}
              />
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => Math.min(totalPages, p + 1))}
          />
        )}
      </main>
    </>
  );
}
