// =============================================================
//  AdminLogin.tsx — Password-only admin login page
//  Route: /admin
// =============================================================

import { useState, useRef, useEffect } from 'react';
import { useAdminStore } from '../../lib/adminStore';
import { Shield, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck, Fingerprint } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { login } = useAdminStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shakeAnim, setShakeAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter the admin password.');
      setShakeAnim(true);
      setTimeout(() => setShakeAnim(false), 600);
      return;
    }

    setIsLoading(true);

    // Simulate network delay for realistic feel
    await new Promise((r) => setTimeout(r, 800));

    const result = login(password);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Access denied.');
      setShakeAnim(true);
      setTimeout(() => setShakeAnim(false), 600);
      setPassword('');
      inputRef.current?.focus();
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* ── Floating background orbs ── */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
               style={{ backgroundColor: 'var(--p-500, #6366f1)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl"
               style={{ backgroundColor: 'var(--a-500, #06b6d4)' }} />
        </div>

        {/* ── Logo / Branding ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 relative"
               style={{
                 background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))',
                 boxShadow: '0 20px 40px -10px rgba(99,102,241,0.3)',
               }}>
            <Shield className="w-10 h-10 text-white" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-lg">
              <Lock className="w-3.5 h-3.5 text-slate-700" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Admin Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Proshnouttor.com Administration</p>
        </div>

        {/* ── Login Card ── */}
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-transform ${shakeAnim ? 'animate-shake' : ''}`}
             style={shakeAnim ? { animation: 'shake 0.5s ease-in-out' } : {}}>

          {/* Header bar */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3"
               style={{ background: 'linear-gradient(135deg, var(--p-50, #eef2ff), var(--a-50, #ecfeff))' }}>
            <Fingerprint className="w-5 h-5" style={{ color: 'var(--p-600, #4f46e5)' }} />
            <div>
              <p className="text-sm font-semibold text-slate-800">Authentication Required</p>
              <p className="text-xs text-slate-500">Enter the admin password to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Password field */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  ref={inputRef}
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  autoComplete="off"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm"
                  style={{ '--tw-ring-color': 'var(--p-500, #6366f1)' } as React.CSSProperties}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-400 text-center">
              🔒 This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>

        {/* ── Bottom hint ── */}
        <p className="text-center text-xs text-slate-400 mt-6">
          <a href="/" className="hover:underline" style={{ color: 'var(--p-500, #6366f1)' }}>
            ← Back to Proshnouttor.com
          </a>
        </p>
      </div>

      {/* Shake animation keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
