import React from 'react';
import { ThemeMode } from '../types';
import { 
  Info, 
  X, 
  ExternalLink, 
  Instagram, 
  Sparkles, 
  CheckCircle, 
  Heart,
  Code2,
  ShieldCheck
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  if (!isOpen) return null;

  const features = [
    'Three-Panel In-Browser Editor (HTML, CSS, JS)',
    'Live Sandboxed Iframe Preview with Automatic Wiring',
    'Real-time Auto Run with debounced execution',
    'Developer Console capturing logs, warns, and runtime errors',
    'Project Import & Export (Full ZIP, HTML, CSS, JS)',
    'Full SUI-FRAMEWORK.CSS v2.0.0 integration',
    'Multi-device responsive preview (Desktop, Tablet, Mobile)',
    'Undo / Redo, Search & Replace, Bracket matching',
    'Auto Save to LocalStorage & URL State Sharing',
    'Curated starter templates for rapid experimentation'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="About SUI CodePulse Studio"
        className={`w-full max-w-lg rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[85vh] ${
          theme === 'dark' ? 'bg-[#0f172a] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">SUI CodePulse Studio</h2>
              <span className="text-xs text-neutral-500 font-mono">Version 1.0.0</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SUI.css Spotlight */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-blue-300">Powered by SUI-FRAMEWORK.CSS</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              This editor proudly integrates and promotes <strong>SUI-FRAMEWORK.CSS</strong>, a lightweight, ultra-modern CSS library designed for building clean web applications effortlessly.
            </p>
            <a
              href="https://suman-11-web.github.io/SUI-FRAMEWORK.CSS/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline"
            >
              <span>Explore SUI-FRAMEWORK.CSS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Developer Card */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                SM
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
                  Lead Developer & Designer
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Suman M
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href="https://www.instagram.com/__suman._.007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-pink-500 hover:text-pink-400 font-medium flex items-center gap-1 hover:underline"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@__suman._.007</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
              Core Capabilities
            </h3>
            <div className="grid gap-2">
              {features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500 flex items-center justify-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>by Suman M for developers worldwide.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
