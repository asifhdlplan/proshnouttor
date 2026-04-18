// =============================================================
//  AuthModal.tsx
//  Full-featured auth modal: Google login + Email sign-in/sign-up
//  Simulates NextAuth's signIn() API surface.
//  Uses primary-*/accent-* theme-aware color classes.
// =============================================================

import { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../../lib/authStore';
import toast from 'react-hot-toast';

// ── Google icon SVG ────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// ── Password strength ──────────────────────────────────────────
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Weak',   color: 'bg-red-400'    },
    { label: 'Fair',   color: 'bg-amber-400'  },
    { label: 'Good',   color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-emerald-500'},
  ];
  const idx = Math.min(score - 1, 3);
  return { score, ...(score > 0 ? levels[idx] : { label: '', color: '' }) };
}

// ── Props ──────────────────────────────────────────────────────
interface AuthModalProps {
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

// ── Component ──────────────────────────────────────────────────
export default function AuthModal({ onClose, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab]               = useState<'login' | 'register'>(defaultTab);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading]   = useState(false);
  const [success, setSuccess]       = useState('');

  const { signInWithGoogle, signInWithEmail, signUp } = useAuthStore();
  const pwStrength = getPasswordStrength(password);

  // ── Google OAuth ─────────────────────────────────────────────
  async function handleGoogleSignIn() {
    setError('');
    setGoogleLoading(true);
    await signInWithGoogle();
    setGoogleLoading(false);
    toast.success('Signed in with Google! Welcome back 👋', {
      style: { borderRadius: '12px', background: '#1e1b4b', color: '#fff' },
    });
    onClose();
  }

  // ── Email sign-in ────────────────────────────────────────────
  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setEmailLoading(true);
    const result = await signInWithEmail(email, password);
    setEmailLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      toast.success('Welcome back! 🎉', {
        style: { borderRadius: '12px', background: '#1e1b4b', color: '#fff' },
      });
      onClose();
    }
  }

  // ── Email register ───────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setEmailLoading(true);
    const result = await signUp(name, email, password);
    setEmailLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Account created! Welcome to Proshnouttor 🎉');
      setTimeout(() => {
        toast.success('Account created! Welcome 🚀', {
          style: { borderRadius: '12px', background: '#1e1b4b', color: '#fff' },
        });
        onClose();
      }, 800);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* ── Header ── */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 px-6 pt-8 pb-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-2 ring-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {tab === 'login' ? 'Welcome back' : 'Join Proshnouttor'}
          </h2>
          <p className="text-primary-200 text-sm mt-1">
            {tab === 'login'
              ? 'Sign in to ask questions, vote, and contribute.'
              : 'Create your free account to get started.'}
          </p>

          {/* Tab switcher */}
          <div className="flex mt-5 bg-white/10 rounded-xl p-1 gap-1">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  tab === t
                    ? 'bg-white text-primary-700 shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-6 flex flex-col gap-4">

          {/* Success state */}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Google OAuth button ── */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || emailLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-xl theme-transition shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? 'Connecting to Google…' : 'Continue with Google'}
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
          </div>

          {/* ── Email form ── */}
          <form
            onSubmit={tab === 'login' ? handleEmailSignIn : handleRegister}
            className="flex flex-col gap-3"
          >
            {/* Name — register only */}
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 focus:border-primary-400 transition"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 focus:border-primary-400 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'register' ? 'Min. 6 characters' : 'Your password'}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 focus:border-primary-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength (register only) */}
              {tab === 'register' && password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          pwStrength.score >= s ? pwStrength.color : 'bg-slate-100 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Password strength:{' '}
                    <span className={`font-semibold ${
                      pwStrength.score <= 1 ? 'text-red-500'
                      : pwStrength.score === 2 ? 'text-amber-500'
                      : pwStrength.score === 3 ? 'text-yellow-600'
                      : 'text-emerald-600'
                    }`}>
                      {pwStrength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Forgot password (login only) */}
            {tab === 'login' && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium theme-transition"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={emailLoading || googleLoading || !!success}
              className="w-full flex items-center justify-center gap-2 theme-gradient text-white font-semibold py-3 rounded-xl theme-transition theme-shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {emailLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                <>
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom switch */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {tab === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setTab('register'); setError(''); }}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-semibold theme-transition"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setTab('login'); setError(''); }}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-semibold theme-transition"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Terms */}
          {tab === 'register' && (
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed -mt-1">
              By creating an account you agree to our{' '}
              <span className="text-primary-500 cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary-500 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
