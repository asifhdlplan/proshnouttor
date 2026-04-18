// =============================================================
//  ConfirmDeleteModal.tsx — Reusable delete confirmation dialog
//  Used before permanently deleting questions or answers.
// =============================================================

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  Trash2,
  X,
  FileText,
  MessageSquare,
  Shield,
} from 'lucide-react';

type DeleteTarget = 'question' | 'answer' | 'user';

interface ConfirmDeleteModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Close without deleting */
  onClose: () => void;
  /** Called when user confirms deletion */
  onConfirm: () => void;
  /** What type of entity is being deleted */
  targetType: DeleteTarget;
  /** A preview string — e.g. question title or answer excerpt */
  targetPreview: string;
  /** Optional secondary info — e.g. author name */
  targetMeta?: string;
  /** Number of related items that will also be deleted */
  cascadeCount?: number;
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  targetType,
  targetPreview,
  targetMeta,
  cascadeCount = 0,
}: ConfirmDeleteModalProps) {
  const [phase, setPhase] = useState<'confirm' | 'deleting' | 'done'>('confirm');
  const [typed, setTyped] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setPhase('confirm');
      setTyped('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const typeLabel = targetType === 'question' ? 'Question' : targetType === 'answer' ? 'Answer' : 'User';
  const TypeIcon = targetType === 'question' ? FileText : targetType === 'answer' ? MessageSquare : Shield;

  const handleConfirm = () => {
    setPhase('deleting');
    // Simulate a small network delay
    setTimeout(() => {
      onConfirm();
      setPhase('done');
      setTimeout(() => onClose(), 600);
    }, 800);
  };

  const confirmEnabled = typed.toLowerCase() === 'delete';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={phase === 'deleting' ? undefined : onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/60 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete {typeLabel}
              </h3>
              <p className="text-xs text-slate-500">
                This action cannot be undone
              </p>
            </div>
          </div>
          {phase !== 'deleting' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Preview of what's being deleted */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-start gap-3">
              <TypeIcon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                  {targetPreview}
                </p>
                {targetMeta && (
                  <p className="text-xs text-slate-400 mt-1">{targetMeta}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cascade warning */}
          {cascadeCount > 0 && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {cascadeCount} linked {cascadeCount === 1 ? 'answer' : 'answers'} will also be permanently deleted
                </p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/60 mt-0.5">
                  These answers belong to the question and cannot be recovered
                </p>
              </div>
            </div>
          )}

          {/* Confirmation input */}
          {phase === 'confirm' && (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Type <span className="font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">delete</span> to confirm:
              </p>
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type 'delete' to confirm..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 placeholder-slate-400 font-mono"
              />
            </div>
          )}

          {/* Deleting state */}
          {phase === 'deleting' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Deleting {typeLabel.toLowerCase()} permanently...
              </p>
            </div>
          )}

          {/* Done state */}
          {phase === 'done' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
              <Trash2 className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {typeLabel} deleted successfully!
              </p>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-800/30">
          <button
            onClick={onClose}
            disabled={phase === 'deleting'}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {phase === 'confirm' && (
            <button
              onClick={handleConfirm}
              disabled={!confirmEnabled}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete Permanently
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
