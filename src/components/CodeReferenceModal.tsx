import React, { useState, useMemo } from 'react';
import { ThemeMode } from '../types';
import { CODE_REFERENCE } from '../data/codeReference';
import { 
  X, 
  Search, 
  Copy, 
  Check, 
  Code2, 
  Plus, 
  BookOpen, 
  Layers, 
  Hash, 
  AtSign, 
  Tag, 
  FileCode,
  Sparkles
} from 'lucide-react';

interface CodeReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onInsertHtml?: (code: string) => void;
  onInsertCss?: (code: string) => void;
  onCopyNotice?: (msg: string) => void;
}

type TabType = 'tags' | 'attributes' | 'css-properties' | 'selectors' | 'at-rules' | 'values';

export const CodeReferenceModal: React.FC<CodeReferenceModalProps> = ({
  isOpen,
  onClose,
  theme,
  onInsertHtml,
  onInsertCss,
  onCopyNotice
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('tags');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagCategoryFilter, setTagCategoryFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    if (onCopyNotice) {
      onCopyNotice(`Copied to clipboard!`);
    }
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleInsertHtmlCode = (code: string) => {
    if (onInsertHtml) {
      onInsertHtml('\n' + code + '\n');
    } else {
      handleCopy(code, 'insert');
    }
  };

  const handleInsertCssCode = (code: string) => {
    if (onInsertCss) {
      onInsertCss('\n' + code + '\n');
    } else {
      handleCopy(code, 'insert');
    }
  };

  // 1. Flatten HTML Tags
  const allHtmlTags = useMemo(() => {
    const list: { tag: string; category: string; code: string }[] = [];
    for (const [cat, tags] of Object.entries(CODE_REFERENCE.htmlTags)) {
      for (const [tag, code] of Object.entries(tags)) {
        list.push({ tag, category: cat, code });
      }
    }
    return list;
  }, []);

  const filteredHtmlTags = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allHtmlTags.filter(item => {
      const matchesCat = tagCategoryFilter === 'all' || item.category === tagCategoryFilter;
      const matchesSearch = !q || item.tag.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.code.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allHtmlTags, tagCategoryFilter, searchQuery]);

  // 2. Flatten HTML Attributes
  const allAttributes = useMemo(() => {
    return Object.entries(CODE_REFERENCE.htmlAttributes).map(([attr, example]) => ({
      attr,
      example
    }));
  }, []);

  const filteredAttributes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allAttributes.filter(item => {
      return !q || item.attr.toLowerCase().includes(q) || item.example.toLowerCase().includes(q);
    });
  }, [allAttributes, searchQuery]);

  // 3. Flatten CSS Properties
  const allCssProperties = useMemo(() => {
    return Object.entries(CODE_REFERENCE.cssProperties).map(([key, rule]) => {
      const propName = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
      return {
        key,
        propName,
        rule
      };
    });
  }, []);

  const filteredCssProperties = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allCssProperties.filter(item => {
      return !q || item.propName.toLowerCase().includes(q) || item.rule.toLowerCase().includes(q);
    });
  }, [allCssProperties, searchQuery]);

  // 4. Flatten CSS Selectors
  const allSelectors = useMemo(() => {
    return Object.entries(CODE_REFERENCE.cssSelectors).map(([name, selector]) => ({
      name,
      selector
    }));
  }, []);

  const filteredSelectors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allSelectors.filter(item => {
      return !q || item.name.toLowerCase().includes(q) || item.selector.toLowerCase().includes(q);
    });
  }, [allSelectors, searchQuery]);

  // 5. Flatten CSS At-Rules
  const allAtRules = useMemo(() => {
    return Object.entries(CODE_REFERENCE.cssAtRules).map(([name, rule]) => ({
      name,
      rule
    }));
  }, []);

  const filteredAtRules = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allAtRules.filter(item => {
      return !q || item.name.toLowerCase().includes(q) || item.rule.toLowerCase().includes(q);
    });
  }, [allAtRules, searchQuery]);

  // 6. CSS Values
  const allValues = useMemo(() => {
    return Object.entries(CODE_REFERENCE.cssValues);
  }, []);

  const tagCategories = ['all', 'document', 'semantic', 'text', 'lists', 'media', 'tables', 'forms', 'interactive', 'scripting', 'webComponents'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  HTML & CSS Reference Catalog
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  IntelliSense Active
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                110 HTML tags, 69 attributes, 246 CSS properties, selectors & at-rules with instant typing suggestions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Navigation Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-neutral-50/30 dark:bg-neutral-950/30">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab.replace('-', ' ')}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800/80 rounded-xl overflow-x-auto">
            <button
              onClick={() => { setActiveTab('tags'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'tags'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML Tags ({allHtmlTags.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('attributes'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'attributes'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Attributes ({allAttributes.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('css-properties'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'css-properties'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>CSS Props ({allCssProperties.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('selectors'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'selectors'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <span>Selectors ({allSelectors.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('at-rules'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'at-rules'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <AtSign className="w-3.5 h-3.5" />
              <span>At-Rules ({allAtRules.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('values'); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'values'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Values ({allValues.length})</span>
            </button>
          </div>
        </div>

        {/* Category Pills (for HTML tags) */}
        {activeTab === 'tags' && (
          <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto bg-neutral-50/40 dark:bg-neutral-950/20">
            {tagCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setTagCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize whitespace-nowrap transition-all ${
                  tagCategoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-neutral-200/50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: HTML TAGS */}
          {activeTab === 'tags' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredHtmlTags.map(item => (
                <div 
                  key={`${item.category}-${item.tag}`}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                        &lt;{item.tag}&gt;
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md uppercase bg-neutral-100 dark:bg-neutral-700/60 text-neutral-500 dark:text-neutral-400">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/80 font-mono text-xs text-neutral-800 dark:text-neutral-200 overflow-x-auto whitespace-pre">
                      {item.code}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    <button
                      onClick={() => handleCopy(item.code, `tag-${item.tag}`)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === `tag-${item.tag}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `tag-${item.tag}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    {onInsertHtml && (
                      <button
                        onClick={() => handleInsertHtmlCode(item.code)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert HTML</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredHtmlTags.length === 0 && (
                <div className="col-span-2 text-center py-12 text-neutral-400">
                  No HTML tags match "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ATTRIBUTES */}
          {activeTab === 'attributes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAttributes.map(item => (
                <div 
                  key={item.attr}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                        {item.attr}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 overflow-x-auto whitespace-pre">
                      {item.example}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    <button
                      onClick={() => handleCopy(item.example, `attr-${item.attr}`)}
                      className="px-2 py-0.5 text-[11px] font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
                    >
                      {copiedKey === `attr-${item.attr}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `attr-${item.attr}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    {onInsertHtml && (
                      <button
                        onClick={() => handleInsertHtmlCode(item.example)}
                        className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CSS PROPERTIES */}
          {activeTab === 'css-properties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCssProperties.map(item => (
                <div 
                  key={item.key}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                        {item.propName}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 overflow-x-auto whitespace-pre">
                      {item.rule}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    <button
                      onClick={() => handleCopy(item.rule, `css-${item.key}`)}
                      className="px-2 py-0.5 text-[11px] font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
                    >
                      {copiedKey === `css-${item.key}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `css-${item.key}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    {onInsertCss && (
                      <button
                        onClick={() => handleInsertCssCode(item.rule)}
                        className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert CSS</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SELECTORS */}
          {activeTab === 'selectors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSelectors.map(item => (
                <div 
                  key={item.name}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {item.selector}
                    </span>
                    <p className="text-[11px] text-neutral-500 capitalize mt-0.5">
                      {item.name.replace(/([A-Z])/g, ' $1')}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    <button
                      onClick={() => handleCopy(item.selector, `sel-${item.name}`)}
                      className="px-2 py-0.5 text-[11px] font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
                    >
                      {copiedKey === `sel-${item.name}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `sel-${item.name}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    {onInsertCss && (
                      <button
                        onClick={() => handleInsertCssCode(`${item.selector} {\n  \n}`)}
                        className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert Rule</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: AT-RULES */}
          {activeTab === 'at-rules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAtRules.map(item => (
                <div 
                  key={item.name}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 hover:border-pink-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400 capitalize">
                      {item.name}
                    </span>
                    <div className="mt-1.5 p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-950/60 font-mono text-xs text-neutral-800 dark:text-neutral-200 overflow-x-auto whitespace-pre">
                      {item.rule}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    <button
                      onClick={() => handleCopy(item.rule, `at-${item.name}`)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
                    >
                      {copiedKey === `at-${item.name}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `at-${item.name}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    {onInsertCss && (
                      <button
                        onClick={() => handleInsertCssCode(item.rule)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-pink-600 hover:bg-pink-500 text-white flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-4">
              {allValues.map(([category, values]) => (
                <div 
                  key={category}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40"
                >
                  <h3 className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                    {category} Values
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {values.map(val => (
                      <button
                        key={val}
                        onClick={() => handleCopy(val, `val-${category}-${val}`)}
                        className="px-2 py-1 text-xs font-mono rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 text-neutral-800 dark:text-neutral-200 flex items-center gap-1 transition-all"
                      >
                        <span>{val}</span>
                        {copiedKey === `val-${category}-${val}` && (
                          <Check className="w-3 h-3 text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>All properties and elements are pre-configured into CodePulse IntelliSense typing autocomplete</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
