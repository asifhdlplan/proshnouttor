import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60 mt-auto py-8 theme-transition">
      <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-700 dark:text-slate-200 tracking-tight">Proshnouttor<span className="text-primary-500 dark:text-primary-400 font-bold">.com</span></span>
          <span className="text-slate-300 dark:text-slate-700 mx-2">|</span>
          <span className="flex items-center gap-1 text-slate-400 dark:text-slate-600 text-xs">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 font-display">
          <a
            href="#/admin"
            className="flex items-center gap-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 theme-transition text-xs font-medium opacity-60 hover:opacity-100 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin
          </a>
          <span className="text-slate-200 dark:text-slate-800">|</span>
          <span className="font-medium text-slate-400 dark:text-slate-500 select-none text-xs">Created by Asif:</span>
          
          <a
            href="https://facebook.com/asif.j30"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 theme-transition bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            <svg className="w-4 h-4 fill-current text-blue-600" viewBox="0 0 24 24">
              <path d="M9 8H7v4h2v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
            </svg>
            <span>asif.j30</span>
          </a>

          <a
            href="https://instagram.com/resetasif"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 theme-transition bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>resetasif</span>
          </a>

          <a
            href="https://github.com/asifonwork"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white theme-transition bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            <svg className="w-4 h-4 fill-current text-slate-800 dark:text-slate-200" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.647.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
            </svg>
            <span>asifonwork</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
