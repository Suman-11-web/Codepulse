import React, { useState, useEffect, useRef } from 'react';
import { ThemeMode } from '../types';
import { 
  Play, 
  Sparkles, 
  Layers, 
  FolderOpen, 
  Download, 
  Sun, 
  Moon, 
  Maximize2, 
  Trash2, 
  WrapText, 
  ZoomIn, 
  ZoomOut, 
  Search, 
  Code2, 
  FileCode, 
  HelpCircle,
  X
} from 'lucide-react';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Editor' | 'Project' | 'Theme' | 'View' | 'Tools' | 'Audit' | 'Layout' | 'Studio' | 'Export' | 'Reference';
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
  theme: ThemeMode;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  commands,
  theme
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredCommands = commands.filter(cmd => {
    return cmd.title.toLowerCase().includes(query.toLowerCase()) ||
           cmd.category.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden transition-all duration-150 ${
          theme === 'dark' 
            ? 'bg-[#161b22] border-neutral-700/80 text-white' 
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={`flex items-center px-4 py-3.5 border-b ${
          theme === 'dark' ? 'border-neutral-800 bg-[#0d1117]' : 'border-neutral-200 bg-neutral-50'
        }`}>
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent text-sm outline-none font-medium ${
              theme === 'dark' ? 'text-white placeholder-neutral-500' : 'text-neutral-900 placeholder-neutral-400'
            }`}
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              ESC
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-400">
              No matching commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : theme === 'dark'
                        ? 'hover:bg-neutral-800/80 text-neutral-200'
                        : 'hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : theme === 'dark'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {cmd.icon}
                    </span>
                    <span className="font-medium truncate">{cmd.title}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : theme === 'dark'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-neutral-200/70 text-neutral-600'
                    }`}>
                      {cmd.category}
                    </span>
                  </div>

                  {cmd.shortcut && (
                    <span className={`font-mono text-xs ml-3 px-2 py-0.5 rounded shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : theme === 'dark'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {cmd.shortcut}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className={`px-4 py-2.5 border-t text-[11px] flex items-center justify-between text-neutral-500 dark:text-neutral-400 ${
          theme === 'dark' ? 'border-neutral-800 bg-[#0d1117]' : 'border-neutral-100 bg-neutral-50'
        }`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">↑</kbd>
              <kbd className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">↵</kbd>
              to select
            </span>
          </div>
          <span className="text-blue-500 font-medium">Pro Command Palette</span>
        </div>
      </div>
    </div>
  );
};
