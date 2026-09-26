import React, { useState } from 'react';
import { AuditReport, ThemeMode } from '../types';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Wand2, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

interface CodeHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  onApplyAutoFix: () => void;
  theme: ThemeMode;
}

export const CodeHealthModal: React.FC<CodeHealthModalProps> = ({
  isOpen,
  onClose,
  report,
  onApplyAutoFix,
  theme
}) => {
  const [filterType, setFilterType] = useState<'all' | 'a11y' | 'html' | 'css'>('all');

  if (!isOpen) return null;

  const filteredIssues = report.issues.filter(issue => {
    if (filterType === 'all') return true;
    return issue.type === filterType;
  });

  const fixableCount = report.issues.filter(i => i.canAutoFix).length;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500';
    if (score >= 70) return 'text-amber-500 border-amber-500';
    return 'text-red-500 border-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 text-emerald-500';
    if (score >= 70) return 'bg-amber-500/10 text-amber-500';
    return 'bg-red-500/10 text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-modal-title"
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
          theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="audit-modal-title" className="text-base font-bold">
                  Code Health & Accessibility Auditor
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${getScoreBg(report.score)}`}>
                  Grade {report.grade}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Live automated WCAG accessibility, HTML5 semantics, and CSS quality inspector
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close auditor"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Overview Bar */}
        <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
          theme === 'dark' ? 'bg-neutral-900/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
        }`}>
          {/* Circular Score Gauge */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center font-black ${getScoreColor(report.score)}`}>
              <span className="text-xl leading-none">{report.score}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-80">/ 100</span>
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                {report.score >= 90 ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Excellent Code Standards
                  </span>
                ) : report.score >= 70 ? (
                  <span className="text-amber-500 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Good, Few Improvements Needed
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Critical Accessibility Fixes Required
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                <span>{report.issues.length} Total Findings</span>
                <span>•</span>
                <span>{report.stats.totalTags} HTML tags</span>
                <span>•</span>
                <span>{report.stats.cssRulesCount} CSS rules</span>
              </div>
            </div>
          </div>

          {/* 1-Click Auto-Fix Action */}
          {fixableCount > 0 && (
            <button
              onClick={() => {
                onApplyAutoFix();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wand2 className="w-4 h-4" />
              <span>1-Click Auto-Fix ({fixableCount})</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-2.5 flex items-center gap-2 border-b border-neutral-200/80 dark:border-neutral-800/80 text-xs overflow-x-auto">
          <span className="text-neutral-500 font-semibold shrink-0">Filter:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            All Issues ({report.issues.length})
          </button>
          <button
            onClick={() => setFilterType('a11y')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterType === 'a11y'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Accessibility ({report.issues.filter(i => i.type === 'a11y').length})
          </button>
          <button
            onClick={() => setFilterType('html')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterType === 'html'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            HTML Semantics ({report.issues.filter(i => i.type === 'html').length})
          </button>
          <button
            onClick={() => setFilterType('css')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterType === 'css'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            CSS Quality ({report.issues.filter(i => i.type === 'css').length})
          </button>
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold">No issues found in this category!</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Your code conforms cleanly to modern accessibility guidelines and best practices.
              </p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border transition-all ${
                  issue.severity === 'error'
                    ? 'border-red-500/30 bg-red-500/5'
                    : issue.severity === 'warning'
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-blue-500/30 bg-blue-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {issue.severity === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    ) : issue.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{issue.title}</span>
                        <span className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded font-bold ${
                          issue.severity === 'error' ? 'bg-red-500/20 text-red-500' :
                          issue.severity === 'warning' ? 'bg-amber-500/20 text-amber-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {issue.type}
                        </span>
                        {issue.canAutoFix && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-500 font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Auto-fixable
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                        {issue.description}
                      </p>
                      {issue.codeSnippet && (
                        <div className="mt-2 font-mono text-[11px] p-2 rounded-lg bg-black/20 dark:bg-black/40 border border-neutral-700/40 text-neutral-300 overflow-x-auto">
                          <code>{issue.codeSnippet}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t text-xs flex items-center justify-between ${
          theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <span className="text-neutral-500">
            Based on WCAG 2.1 AA Accessibility Guidelines
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
