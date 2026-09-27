import React, { useState, useEffect } from 'react';
import { X, History, Plus, RotateCcw, Trash2, Check, FileCode, Clock, ArrowRight } from 'lucide-react';
import { CodeCheckpoint, ThemeMode } from '../types';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentHtml: string;
  currentCss: string;
  currentJs: string;
  onRestoreCheckpoint: (cp: CodeCheckpoint) => void;
  theme: ThemeMode;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  projectId,
  currentHtml,
  currentCss,
  currentJs,
  onRestoreCheckpoint,
  theme
}) => {
  if (!isOpen) return null;

  const storageKey = `codepulse_checkpoints_${projectId || 'default'}`;

  const [checkpoints, setCheckpoints] = useState<CodeCheckpoint[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [newLabel, setNewLabel] = useState('');
  const [selectedCp, setSelectedCp] = useState<CodeCheckpoint | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkpoints));
    } catch (e) {}
  }, [checkpoints, storageKey]);

  const handleCreateCheckpoint = () => {
    const label = newLabel.trim() || `Milestone ${checkpoints.length + 1}`;
    const newCp: CodeCheckpoint = {
      id: 'cp-' + Date.now(),
      name: label,
      timestamp: Date.now(),
      html: currentHtml,
      css: currentCss,
      js: currentJs
    };

    setCheckpoints([newCp, ...checkpoints]);
    setNewLabel('');
    setSelectedCp(newCp);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckpoints(prev => prev.filter(c => c.id !== id));
    if (selectedCp?.id === id) {
      setSelectedCp(null);
    }
  };

  const handleConfirmRestore = (cp: CodeCheckpoint) => {
    onRestoreCheckpoint(cp);
    onClose();
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Version History & Local Checkpoints</h2>
              <p className="text-xs text-slate-400">Save checkpoints, track revisions, and rollback anytime</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Checkpoint List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Create Checkpoint Input */}
            <div className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-xs font-semibold text-slate-300">Create New Milestone</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Before nav redesign..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateCheckpoint()}
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
                <button
                  onClick={handleCreateCheckpoint}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>

            {/* Checkpoints Scrollable List */}
            <div className="flex-1 overflow-y-auto max-h-[380px] flex flex-col gap-2 pr-1">
              {checkpoints.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No saved checkpoints yet.<br />Save a milestone above to start tracking versions.
                </div>
              ) : (
                checkpoints.map((cp) => (
                  <div
                    key={cp.id}
                    onClick={() => setSelectedCp(cp)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedCp?.id === cp.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : isDark
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 mb-0.5">{cp.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{formatTime(cp.timestamp)}</span>
                        <span>·</span>
                        <span>{cp.html.split('\n').length}L HTML</span>
                        <span>·</span>
                        <span>{cp.css.split('\n').length}L CSS</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleDelete(cp.id, e)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-md transition-colors"
                        title="Delete checkpoint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Checkpoint Details & Restore Preview (7 cols) */}
          <div className={`lg:col-span-7 p-5 rounded-xl border flex flex-col justify-between ${
            isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            {selectedCp ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">{selectedCp.name}</h3>
                    <p className="text-xs text-slate-400">Saved on {new Date(selectedCp.timestamp).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => setConfirmRestoreId(selectedCp.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rollback to this</span>
                  </button>
                </div>

                {/* Code snapshot preview boxes */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-mono">
                  <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] uppercase text-orange-400 font-bold block mb-1">HTML</span>
                    <span className="text-slate-300">{selectedCp.html.split('\n').length} lines</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] uppercase text-blue-400 font-bold block mb-1">CSS</span>
                    <span className="text-slate-300">{selectedCp.css.split('\n').length} lines</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] uppercase text-yellow-400 font-bold block mb-1">JavaScript</span>
                    <span className="text-slate-300">{selectedCp.js.split('\n').length} lines</span>
                  </div>
                </div>

                {/* Code Preview Previewer */}
                <div className="flex-1 overflow-y-auto max-h-[220px] rounded-lg border p-3 font-mono text-[11px] leading-relaxed select-all" style={{
                  backgroundColor: isDark ? '#0b0f19' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                  color: isDark ? '#94a3b8' : '#475569'
                }}>
                  <div className="text-orange-400 font-semibold mb-1">/* --- HTML Preview --- */</div>
                  <pre className="whitespace-pre-wrap mb-4">{selectedCp.html.slice(0, 300) || '(empty)'}</pre>
                  <div className="text-blue-400 font-semibold mb-1">/* --- CSS Preview --- */</div>
                  <pre className="whitespace-pre-wrap mb-4">{selectedCp.css.slice(0, 300) || '(empty)'}</pre>
                  <div className="text-yellow-400 font-semibold mb-1">/* --- JS Preview --- */</div>
                  <pre className="whitespace-pre-wrap">{selectedCp.js.slice(0, 300) || '(empty)'}</pre>
                </div>

                {/* Confirm Dialog Overlay */}
                {confirmRestoreId === selectedCp.id && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-between text-xs">
                    <span className="text-amber-200 font-medium">
                      Replace current code with milestone "{selectedCp.name}"?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConfirmRestoreId(null)}
                        className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmRestore(selectedCp)}
                        className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                      >
                        Yes, Rollback
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-500 text-xs">
                <FileCode className="w-10 h-10 mb-2 opacity-30" />
                Select a checkpoint on the left to inspect its code snapshot and rollback.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
