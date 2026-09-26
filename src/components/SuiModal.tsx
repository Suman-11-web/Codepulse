import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { SUI_CSS_CDN, SUI_JS_CDN } from '../utils/fileUtils';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  X, 
  Layers, 
  Instagram, 
  BookOpen,
  Code
} from 'lucide-react';

interface SuiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet: (code: string) => void;
  onCopyNotice: (msg: string) => void;
  theme: ThemeMode;
}

interface ComponentSnippet {
  name: string;
  category: string;
  description: string;
  html: string;
}

const SUI_SNIPPETS: ComponentSnippet[] = [
  {
    name: 'SUI Buttons Set',
    category: 'Buttons',
    description: 'Collection of primary, success, warning, and outline SUI buttons.',
    html: `<div style="display: flex; gap: 8px; flex-wrap: wrap;">
  <button class="sui-btn sui-btn-primary">Primary Button</button>
  <button class="sui-btn sui-btn-success">Success</button>
  <button class="sui-btn sui-btn-warning">Warning</button>
  <button class="sui-btn sui-btn-outline">Outline</button>
</div>`
  },
  {
    name: 'SUI Card Component',
    category: 'Cards',
    description: 'Elevated content card with header, badge, body, and action footer.',
    html: `<div class="sui-card" style="max-width: 360px;">
  <div class="sui-card-header">
    <span class="sui-badge sui-badge-primary">Featured</span>
    <h3 style="margin-top: 8px;">Modern Card Title</h3>
  </div>
  <div class="sui-card-body">
    <p style="color: #64748b;">Effortlessly styled using SUI-FRAMEWORK.CSS utility classes.</p>
  </div>
  <div class="sui-card-footer" style="margin-top: 16px;">
    <button class="sui-btn sui-btn-primary" style="width: 100%;">Explore More</button>
  </div>
</div>`
  },
  {
    name: 'SUI Alert Banners',
    category: 'Feedback',
    description: 'Informational and success message banners.',
    html: `<div class="sui-alert sui-alert-info" style="margin-bottom: 12px;">
  <strong>Notice:</strong> This is a clean SUI information alert.
</div>
<div class="sui-alert sui-alert-success">
  <strong>Well done!</strong> Action was completed successfully.
</div>`
  },
  {
    name: 'SUI Badges',
    category: 'Badges',
    description: 'Compact status and category chips.',
    html: `<div style="display: flex; gap: 8px; align-items: center;">
  <span class="sui-badge sui-badge-primary">Active</span>
  <span class="sui-badge sui-badge-success">Verified</span>
  <span class="sui-badge" style="background: #f1f5f9; color: #475569;">Draft</span>
</div>`
  },
  {
    name: 'SUI Responsive Grid',
    category: 'Layout',
    description: 'Fluid auto-fitting columns for dashboards and galleries.',
    html: `<div class="sui-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
  <div class="sui-card">Column 1</div>
  <div class="sui-card">Column 2</div>
  <div class="sui-card">Column 3</div>
</div>`
  }
];

export const SuiModal: React.FC<SuiModalProps> = ({
  isOpen,
  onClose,
  onInsertSnippet,
  onCopyNotice,
  theme
}) => {
  const [copiedCdn, setCopiedCdn] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const suiTags = `<!-- SUI.css -->
<link rel="stylesheet"
      href="${SUI_CSS_CDN}">

<!-- SUI.js -->
<script src="${SUI_JS_CDN}"></script>`;

  const handleCopyCdn = async () => {
    try {
      await navigator.clipboard.writeText(suiTags);
      setCopiedCdn(true);
      onCopyNotice('SUI.css & SUI.js CDN tags copied!');
      setTimeout(() => setCopiedCdn(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopySnippet = async (name: string, html: string) => {
    try {
      await navigator.clipboard.writeText(html);
      setCopiedSnippet(name);
      onCopyNotice(`Snippet "${name}" copied to clipboard!`);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="SUI-FRAMEWORK.CSS Documentation"
        className={`w-full max-w-2xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[85vh] ${
          theme === 'dark' ? 'bg-[#0f172a] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-blue-600/10 via-transparent to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>SUI-FRAMEWORK.CSS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                  v2.0.0
                </span>
              </h2>
              <p className="text-xs text-neutral-500">
                Created by <strong>Suman M</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hero Banner & Official Link */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-blue-950 dark:text-blue-100 mb-1">
                Official SUI.css Documentation & Showcase
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed max-w-md">
                Explore the official documentation, complete component list, and interactive examples.
              </p>
            </div>
            <a
              href="https://suman-11-web.github.io/SUI-FRAMEWORK.CSS/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>Visit Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* CDN Link Box */}
          <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                CDN Quick Link
              </span>
              <button
                onClick={handleCopyCdn}
                className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
              >
                {copiedCdn ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCdn ? 'Copied Link' : 'Copy CDN Tag'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap select-all leading-relaxed">
              {suiTags}
            </div>
            <p className="text-[11px] text-neutral-500 mt-2">
              ✓ Pre-connected inside live preview. Downloaded projects automatically include both SUI.css and SUI.js.
            </p>
          </div>

          {/* Quick Insert Snippets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Ready-to-use SUI Components
              </h3>
              <span className="text-[11px] text-neutral-400">Click "Insert" to add directly into HTML</span>
            </div>

            <div className="space-y-3">
              {SUI_SNIPPETS.map((snippet) => (
                <div
                  key={snippet.name}
                  className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm">{snippet.name}</span>
                      <span className="text-xs text-neutral-500 ml-2">({snippet.category})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopySnippet(snippet.name, snippet.html)}
                        title="Copy Code"
                        className="px-2.5 py-1 text-xs font-medium rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1 transition-colors"
                      >
                        {copiedSnippet === snippet.name ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedSnippet === snippet.name ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => {
                          onInsertSnippet(snippet.html);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert in HTML</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mb-2">{snippet.description}</p>
                  <pre className="p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto max-h-24">
                    {snippet.html}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Developer Attribution Card */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                SM
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Developer</h4>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Suman M</p>
                <a
                  href="https://www.instagram.com/__suman._.007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Instagram className="w-3 h-3" />
                  <span>@__suman._.007</span>
                </a>
              </div>
            </div>

            <a
              href="https://suman-11-web.github.io/SUI-FRAMEWORK.CSS/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>SUI Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
