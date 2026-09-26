import React from 'react';
import { ThemeMode } from '../types';
import { 
  Keyboard, 
  HelpCircle, 
  X, 
  Download, 
  Play, 
  Sparkles, 
  Layers, 
  Code2
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? 'Cmd' : 'Ctrl';

  const shortcuts = [
    { key: `${modKey} + K`, action: 'Command Palette (Search all actions)' },
    { key: 'Shift + Alt + F', action: 'Format Code (Prettier Beautifier)' },
    { key: `${modKey} + Enter`, action: 'Run Code / Refresh Preview' },
    { key: `${modKey} + S`, action: 'Save Project to Browser' },
    { key: `${modKey} + Z`, action: 'Undo last edit' },
    { key: `${modKey} + Shift + Z`, action: 'Redo last edit' },
    { key: `${modKey} + F`, action: 'Search / Find in current editor' },
    { key: `${modKey} + H`, action: 'Find & Replace' },
    { key: 'Tab', action: 'Next snippet stop / Indent code' },
    { key: 'Shift + Tab', action: 'Prev snippet stop / Outdent code' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard Shortcuts & Help"
        className={`w-full max-w-xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[85vh] ${
          theme === 'dark' ? 'bg-[#0f172a] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-semibold">Help & Shortcuts</h2>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Shortcuts Grid */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-blue-500" />
              <span>Keyboard Shortcuts</span>
            </h3>
            <div className="grid gap-2">
              {shortcuts.map((sc) => (
                <div
                  key={sc.key}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60"
                >
                  <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                    {sc.action}
                  </span>
                  <kbd className="px-2 py-1 text-[11px] font-mono font-semibold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded border border-neutral-300 dark:border-neutral-700 shadow-2xs">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guidance */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-blue-500" />
              <span>Editor Features & Tips</span>
            </h3>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs space-y-2 leading-relaxed text-neutral-600 dark:text-neutral-300">
              <p>
                <strong>⚡ Instant Automatic Connection:</strong> HTML, CSS, and JS are linked internally inside the preview. No <code>&lt;link&gt;</code> or <code>&lt;script&gt;</code> tags required!
              </p>
              <p>
                <strong>📦 Standalone Export:</strong> Clicking <em>Export Project</em> produces a portable ZIP file with complete <code>index.html</code>, <code>style.css</code>, and <code>script.js</code> files that open instantly in any browser.
              </p>
              <p>
                <strong>🎨 SUI-FRAMEWORK.CSS:</strong> Integrated out of the box. Use SUI buttons, alerts, cards, and grid utilities to quickly prototype elegant web apps.
              </p>
              <p>
                <strong>🐛 Console Logs & Traps:</strong> View <code>console.log()</code>, warnings, and errors in the built-in developer console drawer without opening browser dev tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
