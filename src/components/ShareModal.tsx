import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { Share2, Copy, Check, X, AlertTriangle, Link } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  onCopySuccess: (msg: string) => void;
  theme: ThemeMode;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  onCopySuccess,
  theme
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isUrlLarge = shareUrl.length > 2500;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onCopySuccess('Shareable project link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Share Project"
        className={`w-full max-w-lg rounded-xl shadow-2xl border overflow-hidden flex flex-col ${
          theme === 'dark' ? 'bg-[#0f172a] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-semibold">Share Your Code</h2>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Your project code is safely compressed directly into this unique client-side URL. Anyone opening this link will load your exact HTML, CSS, and JavaScript. No backend or database account required!
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 select-all outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {isUrlLarge && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> Your project has {shareUrl.length} characters in the URL. For very large codebases, consider using the <strong>Download Project (ZIP)</strong> feature instead.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
