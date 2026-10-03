import React from 'react';
import { ThemeMode } from '../types';
import { 
  Plus, 
  Sparkles, 
  Link as LinkIcon, 
  Play, 
  MousePointerClick, 
  Globe, 
  Layers, 
  FileCode2,
  ChevronRight
} from 'lucide-react';

interface QuickInsertBarProps {
  onInsertSnippet: (code: string, name: string) => void;
  onOpenModal: () => void;
  theme: ThemeMode;
}

export const QuickInsertBar: React.FC<QuickInsertBarProps> = ({
  onInsertSnippet,
  onOpenModal,
  theme
}) => {
  const quickChips = [
    {
      name: 'link:css',
      code: '<link rel="stylesheet" href="style.css">',
      label: 'link:css',
      icon: LinkIcon,
      color: 'text-sky-500 border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10'
    },
    {
      name: 'link:suicss',
      code: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Suman-11-web/SUI-FRAMEWORK.CSS@v2.0.0/dist/sui.min.css">',
      label: 'link:suicss',
      icon: Sparkles,
      color: 'text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
    },
    {
      name: 'script:src',
      code: '<script src="script.js"></script>',
      label: 'script:src',
      icon: Play,
      color: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10'
    },
    {
      name: 'script:suijs',
      code: '<script src="https://cdn.jsdelivr.net/gh/Suman-11-web/SUI-FRAMEWORK.CSS@v2.0.0/dist/sui.min.js"></script>',
      label: 'script:suijs',
      icon: Sparkles,
      color: 'text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
    },
    {
      name: '<a href>',
      code: '<a href="#" class="inline-link">Click here</a>',
      label: '<a href>',
      icon: Globe,
      color: 'text-blue-500 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10'
    },
    {
      name: 'a:blank',
      code: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">External Link</a>',
      label: 'a:blank',
      icon: Globe,
      color: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10'
    },
    {
      name: '<button>',
      code: '<button type="button">Click Me</button>',
      label: '<button>',
      icon: MousePointerClick,
      color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
    },
    {
      name: '<select>',
      code: '<select id="mySelect">\n  <option value="1">Option 1</option>\n  <option value="2">Option 2</option>\n</select>',
      label: '<select>',
      icon: Layers,
      color: 'text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
    },
    {
      name: '<dialog>',
      code: '<dialog open>\n  <h3>Dialog Title</h3>\n  <p>Dialog content</p>\n</dialog>',
      label: '<dialog>',
      icon: Sparkles,
      color: 'text-purple-500 border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10'
    },
    {
      name: '<details>',
      code: '<details>\n  <summary>More information</summary>\n  <p>Expandable details content</p>\n</details>',
      label: '<details>',
      icon: FileCode2,
      color: 'text-sky-500 border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10'
    },
    {
      name: '<search>',
      code: '<search>\n  <form action="/search">\n    <input type="search" name="q" placeholder="Search..." />\n  </form>\n</search>',
      label: '<search>',
      icon: Globe,
      color: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10'
    },
    {
      name: 'form:post',
      code: '<form action="/submit" method="post">\n  <input type="text" name="name" placeholder="Name" />\n  <button type="submit">Submit</button>\n</form>',
      label: 'form:post',
      icon: FileCode2,
      color: 'text-pink-500 border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10'
    },
    {
      name: 'img',
      code: '<img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600" alt="Banner visual" loading="lazy" />',
      label: '<img src alt>',
      icon: Sparkles,
      color: 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10'
    }
  ];

  return (
    <div className={`px-2 py-1.5 border-b flex items-center justify-between gap-2 overflow-x-auto select-none text-xs shrink-0 ${
      theme === 'dark' 
        ? 'bg-[#0a0d16] border-neutral-800/80 text-neutral-300' 
        : 'bg-neutral-50/90 border-neutral-200 text-neutral-700'
    }`}>
      {/* Quick Snippet Chips List */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1 shrink-0 flex items-center gap-1">
          <Plus className="w-3 h-3 text-blue-500" />
          Quick Links &amp; Tags:
        </span>

        {quickChips.map(chip => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.name}
              onClick={() => onInsertSnippet(chip.code, chip.name)}
              title={`Click to insert ${chip.name} at cursor`}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-mono transition whitespace-nowrap active:scale-95 ${chip.color}`}
            >
              <Icon className="w-3 h-3" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* More / Browse Library Button */}
      <button
        onClick={onOpenModal}
        title="Open full catalog of links, stylesheets, scripts, buttons & components"
        className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] shrink-0 transition shadow-xs active:scale-95 ml-2"
      >
        <Layers className="w-3 h-3" />
        <span>All Links &amp; Tags</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};
