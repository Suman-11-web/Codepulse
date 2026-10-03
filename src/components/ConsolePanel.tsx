import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ConsoleMessage, ThemeMode } from '../types';
import { 
  Terminal, 
  Trash2, 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  ChevronRight,
  ChevronDown,
  CornerDownLeft,
  Search,
  Copy,
  Check,
  Table as TableIcon
} from 'lucide-react';

/* --------------------------------------------------------------------------
   Expandable Object / Array Tree Viewer (Like Chrome DevTools)
   -------------------------------------------------------------------------- */
interface ObjectInspectorProps {
  data: any;
  depth?: number;
  maxInitialDepth?: number;
  theme: ThemeMode;
}

const ObjectInspector: React.FC<ObjectInspectorProps> = ({ 
  data, 
  depth = 0, 
  maxInitialDepth = 1,
  theme 
}) => {
  const isArray = Array.isArray(data);
  const isObject = typeof data === 'object' && data !== null;
  const [isOpen, setIsOpen] = useState(depth < maxInitialDepth);

  if (!isObject) {
    if (data === null) return <span className="text-neutral-400 italic">null</span>;
    if (data === undefined) return <span className="text-neutral-400 italic">undefined</span>;
    if (typeof data === 'number') return <span className="text-sky-500 dark:text-sky-400">{data}</span>;
    if (typeof data === 'boolean') return <span className="text-purple-600 dark:text-purple-400 font-semibold">{String(data)}</span>;
    if (typeof data === 'string') {
      if (data.startsWith('<') && data.endsWith('>')) {
        return <span className="text-pink-600 dark:text-pink-400 font-bold">{data}</span>;
      }
      return <span className="text-emerald-600 dark:text-emerald-400">"{data}"</span>;
    }
    return <span>{String(data)}</span>;
  }

  const keys = Object.keys(data);
  const entriesCount = keys.length;

  if (entriesCount === 0) {
    return <span className="text-neutral-400">{isArray ? '[]' : '{}'}</span>;
  }

  // Summary preview for collapsed state
  const renderPreview = () => {
    if (isArray) {
      const items = data.slice(0, 3).map((v: any) => {
        if (typeof v === 'object' && v !== null) return Array.isArray(v) ? '[...]' : '{...}';
        if (typeof v === 'string') return `"${v.slice(0, 20)}"`;
        return String(v);
      });
      if (data.length > 3) items.push(`... ${data.length - 3} more`);
      return `[${items.join(', ')}]`;
    }

    const previewKeys = keys.slice(0, 3).map(k => {
      const val = data[k];
      let valStr = typeof val === 'object' && val !== null ? (Array.isArray(val) ? '[...]' : '{...}') : String(val);
      if (typeof val === 'string') valStr = `"${val.slice(0, 15)}"`;
      return `${k}: ${valStr}`;
    });
    if (keys.length > 3) previewKeys.push(`...`);
    return `{ ${previewKeys.join(', ')} }`;
  };

  return (
    <div className="font-mono text-xs my-0.5 inline-block">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer inline-flex items-center gap-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 px-1 py-0.5 rounded transition-colors select-none"
      >
        <span className="text-neutral-400">
          {isOpen ? <ChevronDown className="w-3 h-3 inline" /> : <ChevronRight className="w-3 h-3 inline" />}
        </span>
        <span className="text-neutral-500 font-semibold">
          {isArray ? `Array(${data.length})` : 'Object'}
        </span>
        {!isOpen && (
          <span className="text-neutral-400 opacity-80 ml-1 text-[11px] truncate max-w-md">
            {renderPreview()}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="pl-4 border-l border-neutral-300 dark:border-neutral-700/80 my-1 space-y-0.5">
          {keys.map(key => (
            <div key={key} className="flex items-start gap-1 py-0.5">
              <span className="text-purple-600 dark:text-purple-300 shrink-0 font-medium">{key}:</span>
              <div className="flex-1">
                <ObjectInspector 
                  data={data[key]} 
                  depth={depth + 1} 
                  maxInitialDepth={maxInitialDepth} 
                  theme={theme} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* --------------------------------------------------------------------------
   Table Viewer Component (console.table)
   -------------------------------------------------------------------------- */
interface ConsoleTableViewProps {
  tableData: any[];
  theme: ThemeMode;
}

const ConsoleTableView: React.FC<ConsoleTableViewProps> = ({ tableData, theme }) => {
  if (!tableData || tableData.length === 0) return null;

  // Extract all unique columns
  const allColumns = Array.from(
    new Set(tableData.flatMap(row => Object.keys(row || {})))
  );

  return (
    <div className="overflow-x-auto my-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs">
      <table className="w-full text-left border-collapse">
        <thead className={theme === 'dark' ? 'bg-neutral-800/80 text-neutral-300' : 'bg-neutral-100 text-neutral-700'}>
          <tr>
            {allColumns.map(col => (
              <th key={col} className="py-1 px-2.5 font-semibold border-b border-neutral-200 dark:border-neutral-700 select-none">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {tableData.map((row, idx) => (
            <tr 
              key={idx} 
              className={`hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors ${
                idx % 2 === 0 ? (theme === 'dark' ? 'bg-neutral-900/30' : 'bg-white') : (theme === 'dark' ? 'bg-neutral-800/20' : 'bg-neutral-50/60')
              }`}
            >
              {allColumns.map(col => {
                const val = row[col];
                let renderedVal = String(val ?? '');
                if (typeof val === 'object' && val !== null) {
                  try { renderedVal = JSON.stringify(val); } catch(e) { renderedVal = '[Object]'; }
                }
                return (
                  <td key={col} className="py-1 px-2.5 font-mono text-[11px] whitespace-nowrap">
                    {renderedVal}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* --------------------------------------------------------------------------
   Main ConsolePanel Component
   -------------------------------------------------------------------------- */
interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onClear: () => void;
  onClose: () => void;
  onExecuteCommand?: (code: string) => void;
  preserveLog?: boolean;
  onTogglePreserveLog?: () => void;
  theme: ThemeMode;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  messages,
  onClear,
  onClose,
  onExecuteCommand,
  preserveLog = false,
  onTogglePreserveLog,
  theme
}) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'log' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Aggregate consecutive identical messages (like Chrome DevTools)
  const aggregatedMessages = useMemo(() => {
    const result: (ConsoleMessage & { repeatCount: number })[] = [];
    for (const msg of messages) {
      const prev = result[result.length - 1];
      if (
        prev &&
        prev.type === msg.type &&
        prev.content.join(' ') === msg.content.join(' ') &&
        !msg.tableData
      ) {
        prev.repeatCount += 1;
        prev.timestamp = msg.timestamp; // update to latest timestamp
      } else {
        result.push({ ...msg, repeatCount: 1 });
      }
    }
    return result;
  }, [messages]);

  const errorCount = messages.filter(m => m.type === 'error').length;
  const warnCount = messages.filter(m => m.type === 'warn').length;
  const infoCount = messages.filter(m => m.type === 'info').length;
  const logCount = messages.filter(m => m.type === 'log' || m.type === 'result' || m.type === 'table').length;

  const filteredMessages = aggregatedMessages.filter(m => {
    if (filter === 'error' && m.type !== 'error') return false;
    if (filter === 'warn' && m.type !== 'warn') return false;
    if (filter === 'log' && m.type !== 'log' && m.type !== 'result' && m.type !== 'table') return false;
    if (filter === 'info' && m.type !== 'info') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.content.some(text => String(text).toLowerCase().includes(q));
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputCode.trim();
    if (!trimmed) return;

    if (onExecuteCommand) {
      onExecuteCommand(trimmed);
    }

    setHistory(prev => [trimmed, ...prev.filter(item => item !== trimmed)]);
    setHistoryIndex(-1);
    setInputCode('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      setInputCode(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputCode(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputCode('');
      }
    } else if (e.key === 'Escape') {
      setInputCode('');
      setHistoryIndex(-1);
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onClear();
    }
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  /**
   * Smart renderer: inspects JSON objects, HTML elements, primitive types
   */
  const renderMessageContent = (content: string, resultType?: string, tableData?: any, rawData?: any) => {
    if (tableData && Array.isArray(tableData)) {
      return <ConsoleTableView tableData={tableData} theme={theme} />;
    }

    if (rawData && typeof rawData === 'object') {
      return <ObjectInspector data={rawData} theme={theme} />;
    }

    // Try parsing as JSON object or array
    const trimmed = content.trim();
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        return <ObjectInspector data={parsed} theme={theme} />;
      } catch(e) {}
    }

    if (content === 'undefined' || content === 'null') {
      return <span className="text-neutral-400 italic font-mono">{content}</span>;
    }
    if (resultType === 'number' || (!isNaN(Number(content)) && content.trim() !== '')) {
      return <span className="text-sky-500 dark:text-sky-400 font-mono font-medium">{content}</span>;
    }
    if (resultType === 'boolean' || content === 'true' || content === 'false') {
      return <span className="text-purple-600 dark:text-purple-400 font-mono font-semibold">{content}</span>;
    }
    if (content.startsWith('ƒ') || resultType === 'function') {
      return <span className="text-fuchsia-600 dark:text-fuchsia-400 font-mono italic">{content}</span>;
    }
    if (content.startsWith('<') && content.endsWith('>')) {
      return <span className="text-pink-600 dark:text-pink-400 font-mono font-bold">{content}</span>;
    }

    return <span className="font-mono whitespace-pre-wrap break-all">{content}</span>;
  };

  return (
    <div className={`flex flex-col h-full border-t border-neutral-200 dark:border-neutral-800 ${
      theme === 'dark' ? 'bg-[#090d16] text-neutral-100' : 'bg-white text-neutral-900'
    }`}>
      {/* Console Header Bar */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 select-none text-xs shrink-0 ${
        theme === 'dark' ? 'bg-[#0d1117]' : 'bg-neutral-100/95 shadow-xs'
      }`}>
        {/* Left: Title & Filter Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            <span>DevTools Console</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800/80 p-0.5 rounded-lg text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                filter === 'error' 
                  ? 'bg-red-500 text-white shadow-xs' 
                  : 'text-neutral-500 hover:text-red-500'
              }`}
            >
              <span>Errors</span>
              {errorCount > 0 && (
                <span className="px-1 py-0.2 text-[9px] font-bold rounded-full bg-red-600 text-white">
                  {errorCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('warn')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                filter === 'warn' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-neutral-500 hover:text-amber-500'
              }`}
            >
              <span>Warnings</span>
              {warnCount > 0 && (
                <span className="px-1 py-0.2 text-[9px] font-bold rounded-full bg-amber-600 text-white">
                  {warnCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                filter === 'info' 
                  ? 'bg-sky-500 text-white shadow-xs' 
                  : 'text-neutral-500 hover:text-sky-500'
              }`}
            >
              <span>Info</span>
              {infoCount > 0 && (
                <span className="px-1 py-0.2 text-[9px] font-bold rounded-full bg-sky-600 text-white">
                  {infoCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('log')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                filter === 'log' 
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              <span>Logs</span>
              {logCount > 0 && (
                <span className="px-1 py-0.2 text-[9px] font-bold rounded-full bg-neutral-400/80 dark:bg-neutral-600 text-white">
                  {logCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-3 h-3 absolute left-2 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-6 pr-2 py-0.5 text-[11px] rounded-md border outline-none transition ${
                theme === 'dark' 
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-200 placeholder-neutral-500 focus:border-blue-500' 
                  : 'bg-white border-neutral-300 text-neutral-800 placeholder-neutral-400 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {onTogglePreserveLog && (
            <label className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 cursor-pointer mr-2 select-none">
              <input 
                type="checkbox" 
                checked={preserveLog} 
                onChange={onTogglePreserveLog} 
                className="rounded text-blue-600 cursor-pointer"
              />
              <span>Preserve Log</span>
            </label>
          )}

          <button
            onClick={onClear}
            title="Clear Console (Ctrl+L)"
            className="flex items-center gap-1 px-2 py-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={onClose}
            title="Close Console"
            className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Output Area */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1 divide-y divide-neutral-100 dark:divide-neutral-800/60 select-text">
        {filteredMessages.length === 0 ? (
          <div className="h-full min-h-[90px] flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 py-6 text-center select-none">
            <Terminal className="w-6 h-6 mb-1 opacity-40 text-blue-500" />
            <p className="text-xs font-semibold">Console Ready</p>
            <p className="text-[11px] opacity-70 mt-0.5">
              Type expressions like <code className="bg-neutral-200/60 dark:bg-neutral-800 px-1 py-0.5 rounded">document.title</code> or <code className="bg-neutral-200/60 dark:bg-neutral-800 px-1 py-0.5 rounded">$('h1')</code> below
            </p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const isInput = msg.type === 'input';
            const isResult = msg.type === 'result';
            const isError = msg.type === 'error';
            const isWarn = msg.type === 'warn';
            const isInfo = msg.type === 'info';
            const isTable = msg.type === 'table';

            const rawText = msg.content.join(' ');

            return (
              <div 
                key={msg.id || index}
                className={`py-1 px-2 flex items-start justify-between gap-2 group transition-colors rounded ${
                  isError 
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-l-2 border-red-500' 
                    : isWarn 
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-l-2 border-amber-500'
                      : isInfo 
                        ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-l-2 border-sky-500'
                        : isInput 
                          ? 'bg-blue-500/5 text-blue-600 dark:text-blue-400 font-semibold'
                          : isResult
                            ? 'bg-emerald-500/5 text-neutral-800 dark:text-neutral-200 pl-4 border-l border-emerald-500/50'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  {/* Prompt icon / type icon */}
                  {isInput ? (
                    <span className="text-blue-500 font-bold select-none text-sm">&gt;</span>
                  ) : isResult ? (
                    <span className="text-emerald-500 font-bold select-none text-sm">&lt;</span>
                  ) : isError ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  ) : isInfo ? (
                    <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                  ) : isTable ? (
                    <TableIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
                  )}

                  {/* Message content */}
                  <div className="flex-1 min-w-0">
                    {msg.content.map((item, i) => (
                      <div key={i} className="inline-block mr-2 align-top max-w-full">
                        {renderMessageContent(String(item), msg.resultType, msg.tableData, msg.rawData)}
                      </div>
                    ))}
                  </div>

                  {/* Repeat Badge (if repeated multiple times) */}
                  {msg.repeatCount > 1 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-500 text-white shrink-0 self-center">
                      {msg.repeatCount}
                    </span>
                  )}
                </div>

                {/* Right: Timestamp & Copy Button */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 select-none">
                  {msg.timestamp && (
                    <span className="text-[10px] text-neutral-400 font-sans hidden sm:inline">
                      {msg.timestamp}
                    </span>
                  )}
                  <button
                    onClick={() => copyMessage(rawText, index)}
                    title="Copy message"
                    className="p-1 rounded text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive REPL Prompt Bar */}
      <form 
        onSubmit={handleSubmit}
        className={`flex items-center px-3 py-1.5 border-t border-neutral-200 dark:border-neutral-800 shrink-0 ${
          theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-neutral-50'
        }`}
      >
        <span className="text-blue-500 font-bold font-mono mr-2 select-none text-sm">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Evaluate JavaScript expression... (e.g. document.title, 2 + 2, $('h1'), window.innerWidth)"
          className={`w-full bg-transparent font-mono text-xs outline-none py-1 ${
            theme === 'dark' ? 'text-white placeholder-neutral-500' : 'text-neutral-900 placeholder-neutral-400'
          }`}
        />
        <button
          type="submit"
          disabled={!inputCode.trim()}
          title="Run in Live Preview (Enter)"
          className={`p-1.5 rounded-lg text-xs transition shrink-0 ${
            inputCode.trim() 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs' 
              : 'text-neutral-400 opacity-40 cursor-not-allowed'
          }`}
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
