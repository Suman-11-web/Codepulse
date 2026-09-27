import React from 'react';
import { ThemeMode, EditorCursorInfo } from '../types';
import { Check, ShieldCheck, Zap, Save, WrapText, Sparkles, Sliders, Terminal } from 'lucide-react';

interface StatusBarProps {
  cursorInfo: EditorCursorInfo;
  activeLanguage: string;
  totalLines: number;
  totalChars: number;
  autoSaveStatus: 'saved' | 'saving';
  autoRun: boolean;
  onToggleAutoRun: () => void;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
  suggestions: boolean;
  onToggleSuggestions: () => void;
  fontSize: number;
  onChangeFontSize: (delta: number) => void;
  healthScore?: number;
  onOpenCodeHealth?: () => void;
  onOpenCssStudio?: () => void;
  theme: ThemeMode;
  consoleCount?: { error: number; total: number };
  isConsoleOpen?: boolean;
  onToggleConsole?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  cursorInfo,
  activeLanguage,
  totalLines,
  totalChars,
  autoSaveStatus,
  autoRun,
  onToggleAutoRun,
  wordWrap,
  onToggleWordWrap,
  suggestions,
  onToggleSuggestions,
  fontSize,
  onChangeFontSize,
  healthScore = 100,
  onOpenCodeHealth,
  onOpenCssStudio,
  theme,
  consoleCount,
  isConsoleOpen,
  onToggleConsole
}) => {
  const getHealthBadgeStyle = (score: number) => {
    if (score >= 90) return 'text-emerald-500 hover:bg-emerald-500/10';
    if (score >= 70) return 'text-amber-500 hover:bg-amber-500/10';
    return 'text-red-500 hover:bg-red-500/10';
  };

  return (
    <footer 
      role="status"
      className={`h-7 px-3 border-t text-[11px] font-mono flex items-center justify-between select-none z-10 shrink-0 ${
        theme === 'dark'
          ? 'bg-[#090d16] border-neutral-800 text-neutral-400'
          : 'bg-neutral-100 border-neutral-200 text-neutral-600'
      }`}
    >
      {/* Left side: Readiness states, Code Health & Cursor */}
      <div className="flex items-center gap-3">
        {/* Code Health Auditor Badge */}
        {onOpenCodeHealth && (
          <button
            onClick={onOpenCodeHealth}
            title={`Code Health & Accessibility Score: ${healthScore}% — Click to view diagnostic report`}
            className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded font-bold transition-all ${getHealthBadgeStyle(healthScore)}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Health: {healthScore}%</span>
          </button>
        )}

        <span className="text-neutral-500 hidden sm:inline">|</span>

        {/* Visual CSS Studio Quick Button */}
        {onOpenCssStudio && (
          <button
            onClick={onOpenCssStudio}
            title="Open Visual CSS Studio (Gradients, Shadows, Glassmorphism)"
            className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-purple-500 hover:bg-purple-500/10 font-bold transition-all"
          >
            <Sliders className="w-3 h-3" />
            <span>CSS Studio</span>
          </button>
        )}

        {/* Developer Console Toggle in Status Bar */}
        {onToggleConsole && (
          <>
            <span className="text-neutral-500 hidden sm:inline">|</span>
            <button
              onClick={onToggleConsole}
              title={`Toggle Developer Console (${consoleCount?.total || 0} logs${consoleCount?.error ? `, ${consoleCount.error} errors` : ''})`}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded font-bold transition-all ${
                isConsoleOpen
                  ? 'bg-blue-600 text-white shadow-xs'
                  : (consoleCount?.error || 0) > 0
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Console</span>
              {(consoleCount?.error || 0) > 0 ? (
                <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-red-600 text-white font-bold animate-pulse">
                  {consoleCount?.error}
                </span>
              ) : (consoleCount?.total || 0) > 0 ? (
                <span className="text-[10px] opacity-75">({consoleCount?.total})</span>
              ) : null}
            </button>
          </>
        )}

        <span className="text-neutral-500 hidden md:inline">|</span>

        {/* Languages readiness */}
        <div className="hidden md:flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>HTML: Ready</span>
          </span>
          <span className="text-neutral-500 hidden lg:inline">·</span>
          <span className="hidden lg:flex items-center gap-1 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>CSS: Ready</span>
          </span>
          <span className="text-neutral-500 hidden xl:inline">·</span>
          <span className="hidden xl:flex items-center gap-1 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>JS: Ready</span>
          </span>
        </div>

        <span className="text-neutral-400 hidden lg:inline">|</span>

        {/* Cursor position */}
        <div className="hidden lg:flex items-center gap-2 tabular-nums">
          <span className="uppercase text-neutral-400 font-semibold">{activeLanguage}</span>
          <span>Ln {cursorInfo.line}, Col {cursorInfo.col}</span>
        </div>
      </div>

      {/* Right side: Stats, Auto Save, Auto Run, Suggestions, Font Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Document Stats */}
        <div className="hidden sm:flex items-center gap-2 tabular-nums text-neutral-500 dark:text-neutral-400">
          <span>Lines: {totalLines}</span>
          <span>·</span>
          <span>Chars: {totalChars}</span>
        </div>

        <span className="text-neutral-400 hidden sm:inline">|</span>

        {/* Suggestions Toggle (Requested by user) */}
        <button
          onClick={onToggleSuggestions}
          title={`Typing Suggestions / Autocomplete: ${suggestions ? 'ON' : 'OFF'}`}
          className={`flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded ${
            suggestions 
              ? 'text-blue-500 bg-blue-500/10 font-semibold' 
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          <Sparkles className={`w-3 h-3 ${suggestions ? 'text-blue-500 fill-blue-500/30' : ''}`} />
          <span className="hidden md:inline">Suggestions:</span>
          <span>{suggestions ? 'ON' : 'OFF'}</span>
        </button>

        <span className="text-neutral-400 hidden md:inline">|</span>

        {/* Auto Save Indicator */}
        <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
          <Save className="w-3 h-3 text-blue-500" />
          <span className="hidden md:inline">Auto Save:</span>
          <span className="font-semibold text-emerald-500">
            {autoSaveStatus === 'saving' ? 'Saving...' : 'ON'}
          </span>
        </div>

        <span className="text-neutral-400 hidden md:inline">|</span>

        {/* Auto Run Toggle */}
        <button
          onClick={onToggleAutoRun}
          title="Toggle live execution on typing"
          className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
        >
          <Zap className={`w-3 h-3 ${autoRun ? 'text-amber-500 fill-amber-500' : 'text-neutral-500'}`} />
          <span className="hidden md:inline">Auto Run:</span>
          <span className={`font-semibold ${autoRun ? 'text-emerald-500' : 'text-neutral-500'}`}>
            {autoRun ? 'ON' : 'OFF'}
          </span>
        </button>

        <span className="text-neutral-400 hidden sm:inline">|</span>

        {/* Word Wrap Toggle */}
        <button
          onClick={onToggleWordWrap}
          title="Toggle Word Wrap"
          className={`flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors ${
            wordWrap ? 'text-blue-500 font-semibold' : 'text-neutral-500'
          }`}
        >
          <WrapText className="w-3 h-3" />
          <span className="hidden sm:inline">Wrap</span>
        </button>

        {/* Font Size Stepper */}
        <div className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800/80 px-1 py-0.5 rounded text-[10px]">
          <button
            onClick={() => onChangeFontSize(-1)}
            title="Decrease font size"
            className="px-1 hover:text-blue-500 transition-colors font-bold"
          >
            A−
          </button>
          <span className="px-1 tabular-nums">{fontSize}px</span>
          <button
            onClick={() => onChangeFontSize(1)}
            title="Increase font size"
            className="px-1 hover:text-blue-500 transition-colors font-bold"
          >
            A+
          </button>
        </div>
      </div>
    </footer>
  );
};
