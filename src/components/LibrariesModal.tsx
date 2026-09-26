import React, { useState } from 'react';
import { ExternalLibrary, ThemeMode } from '../types';
import { POPULAR_LIBRARIES } from '../data/libraries';
import { X, Search, Plus, Check, ExternalLink, Trash2, PackageCheck, Layers } from 'lucide-react';

interface LibrariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLibraries: ExternalLibrary[];
  onToggleLibrary: (library: ExternalLibrary) => void;
  onAddCustomLibrary: (lib: ExternalLibrary) => void;
  onRemoveCustomLibrary: (id: string) => void;
  theme: ThemeMode;
}

export const LibrariesModal: React.FC<LibrariesModalProps> = ({
  isOpen,
  onClose,
  activeLibraries,
  onToggleLibrary,
  onAddCustomLibrary,
  onRemoveCustomLibrary,
  theme
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'css' | 'js' | 'font'>('all');
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState<'css' | 'js'>('css');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const isLibraryActive = (id: string) => {
    return activeLibraries.some(lib => lib.id === id && lib.enabled);
  };

  const filteredLibraries = POPULAR_LIBRARIES.filter(lib => {
    const matchesSearch = lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lib.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || lib.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customUrl.trim()) return;

    const newLib: ExternalLibrary = {
      id: 'custom-' + Date.now(),
      name: customName.trim(),
      category: customType,
      description: `Custom ${customType.toUpperCase()} CDN link`,
      enabled: true,
      badge: 'Custom',
      ...(customType === 'css' ? { cssUrl: customUrl.trim() } : { jsUrl: customUrl.trim() })
    };

    onAddCustomLibrary(newLib);
    setCustomName('');
    setCustomUrl('');
    setShowAddForm(false);
  };

  const customLibs = activeLibraries.filter(lib => lib.id.startsWith('custom-'));
  const activeCount = activeLibraries.filter(l => l.enabled).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          theme === 'dark' 
            ? 'bg-[#161b22] border-neutral-800 text-neutral-100' 
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          theme === 'dark' ? 'border-neutral-800 bg-[#0d1117]' : 'border-neutral-100 bg-neutral-50/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">External Libraries & CDNs</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Instantly inject CSS stylesheets, icons, & JavaScript packages into your preview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {activeCount} Active
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className={`p-4 border-b space-y-3 ${
          theme === 'dark' ? 'border-neutral-800/80 bg-[#161b22]' : 'border-neutral-100 bg-white'
        }`}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search packages (e.g. Tailwind, Bootstrap, Three.js, GSAP, Icons)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition ${
                theme === 'dark'
                  ? 'bg-neutral-900/80 border-neutral-700/80 focus:border-blue-500 text-white placeholder-neutral-500'
                  : 'bg-neutral-50 border-neutral-200 focus:border-blue-500 text-neutral-900 placeholder-neutral-400'
              }`}
            />
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {(['all', 'css', 'js', 'font'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : theme === 'dark'
                        ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab === 'all' ? 'All Libraries' : tab.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 border border-blue-500/20 transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom CDN
            </button>
          </div>
        </div>

        {/* Custom CDN Form */}
        {showAddForm && (
          <form onSubmit={handleCreateCustom} className={`p-4 border-b space-y-3 ${
            theme === 'dark' ? 'border-neutral-800 bg-[#0d1117]/80' : 'border-neutral-200 bg-neutral-50'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Add Custom CDN URL
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Library Name (e.g. Swiper)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                className={`text-xs px-3 py-2 rounded-lg border outline-none ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                }`}
              />
              <input
                type="url"
                placeholder="https://cdn.example.com/library.min.js"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                required
                className={`sm:col-span-2 text-xs px-3 py-2 rounded-lg border outline-none ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                }`}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="customType"
                    checked={customType === 'css'}
                    onChange={() => setCustomType('css')}
                  />
                  <span>CSS Stylesheet</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="customType"
                    checked={customType === 'js'}
                    onChange={() => setCustomType('js')}
                  />
                  <span>JavaScript File</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs rounded-lg text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Library
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Libraries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {/* Custom Libraries if any */}
          {customLibs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Custom Added CDNs</h4>
              <div className="space-y-2">
                {customLibs.map(lib => (
                  <div
                    key={lib.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      theme === 'dark' ? 'bg-[#0d1117] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{lib.name}</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-blue-500/10 text-blue-500">
                          {lib.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate max-w-md mt-0.5">
                        {lib.cssUrl || lib.jsUrl}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleLibrary(lib)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                          lib.enabled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {lib.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => onRemoveCustomLibrary(lib.id)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                        title="Delete custom library"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Curated Libraries */}
          {filteredLibraries.map(lib => {
            const active = isLibraryActive(lib.id);
            return (
              <div
                key={lib.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  active
                    ? theme === 'dark'
                      ? 'bg-blue-950/20 border-blue-500/40 shadow-sm'
                      : 'bg-blue-50/60 border-blue-200 shadow-sm'
                    : theme === 'dark'
                      ? 'bg-[#0d1117]/60 border-neutral-800/80 hover:border-neutral-700'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                }`}
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">
                      {lib.name}
                    </span>
                    {lib.version && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        {lib.version}
                      </span>
                    )}
                    {lib.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        lib.badge === 'Recommended'
                          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      }`}>
                        {lib.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {lib.description}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => onToggleLibrary(lib)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition shadow-sm ${
                      active
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : theme === 'dark'
                          ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {active ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Active
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-6 py-3.5 border-t ${
          theme === 'dark' ? 'border-neutral-800 bg-[#0d1117]' : 'border-neutral-100 bg-neutral-50/80'
        }`}>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <PackageCheck className="w-4 h-4 text-emerald-500" />
            <span>Active libraries are bundled in preview & ZIP exports automatically</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
