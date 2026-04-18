// =============================================================
//  App.tsx — Root component
//  Hash-based routes: #/, #/question/:id, #/admin, #/admin/dashboard
//  Admin routes protected by adminStore.isAuthenticated
// =============================================================

import { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import Header        from './components/Header';
import LeftSidebar   from './components/LeftSidebar';
import MainContent   from './components/MainContent';
import RightSidebar  from './components/RightSidebar';
import AuthModal     from './components/auth/AuthModal';
import QuestionDetail from './components/QuestionDetail';
import Footer        from './components/Footer';
import AdminLogin    from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { useAdminStore } from './lib/adminStore';
import AnnouncementBar from './components/AnnouncementBar';

type Route =
  | { page: 'home' }
  | { page: 'question'; id: string }
  | { page: 'admin-login' }
  | { page: 'admin-dashboard' };

function parseRoute(): Route {
  // Hash-based routing: #/admin, #/admin/dashboard, #/question/123
  const hash = window.location.hash.replace(/^#/, '') || '/';
  if (hash === '/admin/dashboard') return { page: 'admin-dashboard' };
  if (hash === '/admin')           return { page: 'admin-login' };
  const qMatch = hash.match(/^\/question\/([^/]+)$/);
  if (qMatch) return { page: 'question', id: qMatch[1] };
  return { page: 'home' };
}

export default function App() {
  const { isAuthenticated, logout } = useAdminStore();

  // ── Route state ──
  const [route, setRoute] = useState<Route>(parseRoute);

  const navigate = useCallback((newRoute: Route) => {
    let hash = '/';
    if (newRoute.page === 'question')       hash = `/question/${newRoute.id}`;
    if (newRoute.page === 'admin-login')    hash = '/admin';
    if (newRoute.page === 'admin-dashboard') hash = '/admin/dashboard';
    window.location.hash = hash;
    setRoute(newRoute);
  }, []);

  // Listen for browser back/forward (hash changes)
  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // ── Protect admin/dashboard route ──
  useEffect(() => {
    if (route.page === 'admin-dashboard' && !isAuthenticated) {
      navigate({ page: 'admin-login' });
    }
  }, [route, isAuthenticated, navigate]);

  // ── UI state ──
  const [showAskModal,  setShowAskModal]  = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab,       setAuthTab]       = useState<'login' | 'register'>('login');
  const [searchQuery,   setSearchQuery]   = useState('');

  function openAuth(tab: 'login' | 'register' = 'login') {
    setAuthTab(tab);
    setShowAuthModal(true);
  }

  const navigateToQuestion = (id: string | null) => {
    if (id) {
      navigate({ page: 'question', id });
    } else {
      navigate({ page: 'home' });
    }
  };

  // ── Admin callbacks ──
  const handleAdminLogin = () => {
    navigate({ page: 'admin-dashboard' });
  };

  const handleAdminLogout = () => {
    logout();
    navigate({ page: 'admin-login' });
  };

  const handleGoHome = () => {
    navigate({ page: 'home' });
  };

  // ── Admin pages (no site header/footer) ──
  const isAdminRoute = route.page === 'admin-login' || route.page === 'admin-dashboard';

  if (isAdminRoute) {
    return (
      <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans theme-transition flex flex-col"
           style={{ backgroundColor: 'var(--theme-bg)' }}>
        <Toaster position="top-right" />

        {/* Simplified header for admin */}
        <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
          <button onClick={handleGoHome} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))' }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Proshnouttor<span style={{ color: 'var(--p-500, #6366f1)' }}>.com</span>
            </span>
          </button>

          {route.page === 'admin-dashboard' && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--p-500, #6366f1), var(--a-500, #06b6d4))' }}>
                🔒 Admin Mode
              </span>
              <button onClick={handleGoHome}
                className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:underline px-2 py-1">
                ← Site
              </button>
            </div>
          )}
        </header>

        {/* Admin content */}
        <div className="pt-16 min-h-screen flex flex-col">
          {route.page === 'admin-login' && (
            <AdminLogin onLoginSuccess={handleAdminLogin} />
          )}
          {route.page === 'admin-dashboard' && isAuthenticated && (
            <AdminDashboard onLogout={handleAdminLogout} onGoHome={handleGoHome} />
          )}
        </div>
      </div>
    );
  }

  // ── Public pages (normal header, sidebars, footer) ──
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans theme-transition flex flex-col"
         style={{ backgroundColor: 'var(--theme-bg)' }}>

      <Toaster position="top-right" />

      {/* ── Fixed top stack: AnnouncementBar + Header ── */}
      <div className="fixed top-0 inset-x-0 z-50 flex flex-col">
        <AnnouncementBar />
        <Header
          onAskQuestion={() => setShowAskModal(true)}
          onSearch={setSearchQuery}
          onOpenAuth={() => openAuth('login')}
        />
      </div>

      {showAuthModal && (
        <AuthModal
          defaultTab={authTab}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <div className="pt-16 min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-6 flex gap-6 items-start">

          <div className="hidden lg:block sticky top-20 self-start">
            <LeftSidebar onOpenAuth={() => openAuth('login')} />
          </div>

          {route.page === 'question' ? (
            <QuestionDetail
              questionId={route.id}
              onBack={() => navigateToQuestion(null)}
            />
          ) : (
            <MainContent
              showModal={showAskModal}
              onCloseModal={() => setShowAskModal(false)}
              onAskQuestion={() => setShowAskModal(true)}
              searchQuery={searchQuery}
              onSelectQuestion={(id) => navigateToQuestion(id)}
            />
          )}

          <div className="hidden xl:block sticky top-20 self-start">
            <RightSidebar />
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
}
