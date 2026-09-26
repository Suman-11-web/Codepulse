import React, { useState, useMemo } from 'react';
import { InspectedElement, DomTreeNode, ThemeMode } from '../types';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Copy, 
  Check, 
  Crosshair, 
  Layers, 
  Box, 
  Sliders,
  Code2
} from 'lucide-react';

interface ElementsInspectorProps {
  inspectedElement: InspectedElement | null;
  domTree: DomTreeNode | null;
  onSelectNode: (path: string) => void;
  isInspectActive: boolean;
  onToggleInspect: () => void;
  theme: ThemeMode;
}

export const ElementsInspector: React.FC<ElementsInspectorProps> = ({
  inspectedElement,
  domTree,
  onSelectNode,
  isInspectActive,
  onToggleInspect,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'styles' | 'boxmodel'>('boxmodel');
  const [styleFilter, setStyleFilter] = useState('');
  const [treeSearch, setTreeSearch] = useState('');
  const [copiedSelector, setCopiedSelector] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'body': true,
    'body-0': true,
    'body-1': true
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySelector = () => {
    if (!inspectedElement?.selectorPath) return;
    navigator.clipboard.writeText(inspectedElement.selectorPath);
    setCopiedSelector(true);
    setTimeout(() => setCopiedSelector(false), 2000);
  };

  // Filter computed styles
  const filteredStyles = useMemo(() => {
    if (!inspectedElement?.computedStyles) return [];
    const entries = Object.entries(inspectedElement.computedStyles);
    if (!styleFilter.trim()) return entries;
    const query = styleFilter.toLowerCase();
    return entries.filter(([k, v]) => k.toLowerCase().includes(query) || v.toLowerCase().includes(query));
  }, [inspectedElement, styleFilter]);

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: DomTreeNode, depth: number = 0) => {
    const isExpanded = expandedNodes[node.id] ?? (depth < 2);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = inspectedElement && (
      (node.idAttr && inspectedElement.id === node.idAttr) ||
      (node.classNames && inspectedElement.className === node.classNames) ||
      inspectedElement.tagName === node.tagName
    );

    const matchesSearch = treeSearch.trim()
      ? node.tagName.toLowerCase().includes(treeSearch.toLowerCase()) ||
        (node.classNames && node.classNames.toLowerCase().includes(treeSearch.toLowerCase())) ||
        (node.idAttr && node.idAttr.toLowerCase().includes(treeSearch.toLowerCase()))
      : true;

    return (
      <div key={node.id} className="text-xs font-mono select-none">
        <div
          onClick={() => onSelectNode(node.id)}
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
          className={`flex items-center py-0.5 px-1 rounded cursor-pointer transition-colors group ${
            isSelected
              ? 'bg-blue-600/20 text-blue-400 font-semibold'
              : 'hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 text-neutral-400 dark:text-neutral-300'
          } ${!matchesSearch && treeSearch ? 'opacity-30' : ''}`}
        >
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-0.5 mr-0.5 text-neutral-400 hover:text-white"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-4 mr-0.5" />
          )}

          {/* Opening Tag */}
          <span className="text-purple-400">&lt;</span>
          <span className="text-red-400 font-semibold">{node.tagName}</span>

          {/* ID Attribute */}
          {node.idAttr && (
            <span className="ml-1 text-emerald-400">
              id=<span className="text-amber-300">"{node.idAttr}"</span>
            </span>
          )}

          {/* Class Attribute */}
          {node.classNames && (
            <span className="ml-1 text-sky-400">
              class=<span className="text-amber-300">"{node.classNames}"</span>
            </span>
          )}

          {/* Other Attributes Preview */}
          {Object.entries(node.attributes || {})
            .filter(([k]) => k !== 'id' && k !== 'class')
            .slice(0, 2)
            .map(([k, v]) => (
              <span key={k} className="ml-1 text-neutral-400 hidden sm:inline">
                {k}=<span className="text-amber-300">"{v}"</span>
              </span>
            ))}

          <span className="text-purple-400">&gt;</span>

          {/* Inline Text Content Preview */}
          {!hasChildren && node.textPreview && (
            <span className="ml-1 text-neutral-300 dark:text-neutral-400 truncate max-w-[140px] text-[11px]">
              {node.textPreview}
            </span>
          )}

          {/* Closing Tag for self-contained nodes */}
          {!hasChildren && !node.isVoid && (
            <span className="text-purple-400">&lt;/{node.tagName}&gt;</span>
          )}
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderTreeNode(child, depth + 1))}
            {/* Closing Tag */}
            <div
              style={{ paddingLeft: `${depth * 14 + 6}px` }}
              className="py-0.2 text-purple-400 font-mono text-xs opacity-75"
            >
              <span className="w-4 inline-block" />
              &lt;/{node.tagName}&gt;
            </div>
          </div>
        )}
      </div>
    );
  };

  const bm = inspectedElement?.boxModel || {
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    border: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    content: { width: 0, height: 0 }
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden select-none border-t ${
      theme === 'dark' ? 'bg-[#090d16] border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
    }`}>
      {/* Inspector Toolbar */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-b text-xs ${
        theme === 'dark' ? 'bg-[#0d1117] border-neutral-800' : 'bg-neutral-100 border-neutral-200'
      }`}>
        <div className="flex items-center gap-2">
          {/* Inspect Picker Toggle */}
          <button
            onClick={onToggleInspect}
            title={isInspectActive ? "Stop Inspecting" : "Click to select an element in the preview"}
            className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
              isInspectActive
                ? 'bg-blue-600 text-white shadow-xs animate-pulse'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-300 dark:border-neutral-700'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isInspectActive ? 'Inspecting...' : 'Pick Element'}</span>
          </button>

          {/* Quick Breadcrumbs */}
          {inspectedElement && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-neutral-400">
              <span className="text-purple-400 font-bold">&lt;{inspectedElement.tagName}&gt;</span>
              {inspectedElement.id && <span className="text-emerald-400 font-semibold">#{inspectedElement.id}</span>}
              {inspectedElement.className && (
                <span className="text-sky-400 font-semibold truncate max-w-[120px]">
                  .{inspectedElement.className.split(' ').join('.')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Copy Selector & Right Tab Toggles */}
        <div className="flex items-center gap-2">
          {inspectedElement?.selectorPath && (
            <button
              onClick={handleCopySelector}
              className="text-[11px] font-mono text-neutral-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
              title="Copy CSS Selector"
            >
              {copiedSelector ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="hidden md:inline">{copiedSelector ? 'Copied' : 'Selector'}</span>
            </button>
          )}

          <div className="flex items-center bg-neutral-200/60 dark:bg-neutral-800/80 rounded-md p-0.5">
            <button
              onClick={() => setActiveTab('boxmodel')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                activeTab === 'boxmodel'
                  ? 'bg-white dark:bg-neutral-700 text-blue-500 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Box Model
            </button>
            <button
              onClick={() => setActiveTab('styles')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                activeTab === 'styles'
                  ? 'bg-white dark:bg-neutral-700 text-blue-500 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Computed Styles
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: DOM Tree (Left) and Styles / Box Model (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: DOM TREE VIEWER */}
        <div className="flex-1 flex flex-col border-r border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
          {/* Tree Search */}
          <div className="p-1.5 border-b border-neutral-200/60 dark:border-neutral-800/60">
            <div className="relative">
              <Search className="w-3 h-3 text-neutral-400 absolute left-2 top-2" />
              <input
                type="text"
                placeholder="Filter DOM nodes (e.g. div, .btn, #hero)..."
                value={treeSearch}
                onChange={(e) => setTreeSearch(e.target.value)}
                className={`w-full pl-6 pr-2 py-1 text-xs font-mono rounded border ${
                  theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-200' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              />
            </div>
          </div>

          {/* Tree Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {domTree ? (
              renderTreeNode(domTree)
            ) : (
              <div className="p-4 text-center text-xs text-neutral-500">
                Click <strong>"Pick Element"</strong> above or interact with the preview to inspect DOM nodes.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BOX MODEL OR COMPUTED STYLES */}
        <div className="w-72 sm:w-80 md:w-96 flex flex-col overflow-hidden shrink-0">
          {activeTab === 'boxmodel' ? (
            /* BOX MODEL DIAGRAM */
            <div className="flex-1 overflow-y-auto p-3 flex flex-col items-center justify-center">
              <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-2">
                Box Dimensions ({Math.round(inspectedElement?.rect.width || 0)} × {Math.round(inspectedElement?.rect.height || 0)} px)
              </div>

              {/* MARGIN LAYER */}
              <div className="w-full max-w-[280px] p-2 bg-amber-500/15 border border-dashed border-amber-500/50 rounded-lg text-amber-500 text-[10px] font-mono flex flex-col items-center relative">
                <span className="absolute left-1 top-0.5 text-[9px] font-bold">margin</span>
                <span className="font-bold">{bm.margin.top}</span>

                <div className="w-full flex items-center justify-between">
                  <span className="font-bold">{bm.margin.left}</span>

                  {/* BORDER LAYER */}
                  <div className="flex-1 p-2 mx-1.5 my-1 bg-yellow-500/15 border border-yellow-500/50 rounded text-yellow-500 text-[10px] font-mono flex flex-col items-center relative">
                    <span className="absolute left-1 top-0.5 text-[9px] font-bold">border</span>
                    <span className="font-bold">{bm.border.top}</span>

                    <div className="w-full flex items-center justify-between">
                      <span className="font-bold">{bm.border.left}</span>

                      {/* PADDING LAYER */}
                      <div className="flex-1 p-2 mx-1.5 my-1 bg-emerald-500/15 border border-emerald-500/50 rounded text-emerald-500 text-[10px] font-mono flex flex-col items-center relative">
                        <span className="absolute left-1 top-0.5 text-[9px] font-bold">padding</span>
                        <span className="font-bold">{bm.padding.top}</span>

                        <div className="w-full flex items-center justify-between">
                          <span className="font-bold">{bm.padding.left}</span>

                          {/* CONTENT BOX */}
                          <div className="px-3 py-2 bg-blue-500/20 border border-blue-500/60 rounded text-blue-400 font-bold text-[11px] text-center shrink-0">
                            {Math.round(bm.content.width)} × {Math.round(bm.content.height)}
                          </div>

                          <span className="font-bold">{bm.padding.right}</span>
                        </div>

                        <span className="font-bold">{bm.padding.bottom}</span>
                      </div>

                      <span className="font-bold">{bm.border.right}</span>
                    </div>

                    <span className="font-bold">{bm.border.bottom}</span>
                  </div>

                  <span className="font-bold">{bm.margin.right}</span>
                </div>

                <span className="font-bold">{bm.margin.bottom}</span>
              </div>

              {/* Element Specs Summary */}
              {inspectedElement && (
                <div className="w-full max-w-[280px] mt-3 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">display:</span>
                    <span className="font-semibold text-blue-400">{inspectedElement.computedStyles.display || 'block'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">position:</span>
                    <span className="font-semibold text-neutral-300">{inspectedElement.computedStyles.position || 'static'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">color:</span>
                    <span className="font-semibold text-neutral-300 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: inspectedElement.computedStyles.color }} />
                      {inspectedElement.computedStyles.color}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* COMPUTED STYLES LIST */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-1.5 border-b border-neutral-200/60 dark:border-neutral-800/60">
                <input
                  type="text"
                  placeholder="Filter styles (e.g. font, flex)..."
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className={`w-full px-2 py-1 text-xs font-mono rounded border ${
                    theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-200' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs font-mono">
                {filteredStyles.length > 0 ? (
                  filteredStyles.map(([prop, val]) => (
                    <div
                      key={prop}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 group"
                    >
                      <span className="text-neutral-500 group-hover:text-blue-400 transition-colors">
                        {prop}:
                      </span>
                      <span className="text-neutral-300 font-semibold truncate max-w-[150px] text-right">
                        {val};
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    No matching computed styles found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
