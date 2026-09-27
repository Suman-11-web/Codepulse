import React, { useState, useRef } from 'react';
import { X, Download, Copy, Check, Sparkles, Sliders, Image as ImageIcon } from 'lucide-react';
import { ThemeMode, EditorLanguage } from '../types';

interface CodeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  css: string;
  js: string;
  activeLanguage: EditorLanguage;
  theme: ThemeMode;
}

export const CodeCardModal: React.FC<CodeCardModalProps> = ({
  isOpen,
  onClose,
  html,
  css,
  js,
  activeLanguage,
  theme
}) => {
  if (!isOpen) return null;

  const [selectedLang, setSelectedLang] = useState<EditorLanguage>(activeLanguage);
  const [windowTitle, setWindowTitle] = useState(
    selectedLang === 'html' ? 'index.html' : selectedLang === 'css' ? 'style.css' : 'app.js'
  );
  const [cardTheme, setCardTheme] = useState<'midnight' | 'cyberpunk' | 'sunset' | 'emerald' | 'minimal'>('midnight');
  const [padding, setPadding] = useState(32);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  // Get active code
  const codeContent = selectedLang === 'html' ? html : selectedLang === 'css' ? css : js;
  const lines = codeContent.split('\n').slice(0, 35); // Max 35 lines for card elegance

  const themes = {
    midnight: {
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
      editorBg: '#090d16',
      editorText: '#e2e8f0',
      border: '#334155'
    },
    cyberpunk: {
      bg: 'linear-gradient(135deg, #701a75 0%, #4c1d95 50%, #1e1b4b 100%)',
      editorBg: '#120b24',
      editorText: '#f3e8ff',
      border: '#86198f'
    },
    sunset: {
      bg: 'linear-gradient(135deg, #991b1b 0%, #c2410c 50%, #ca8a04 100%)',
      editorBg: '#1c1917',
      editorText: '#fed7aa',
      border: '#78350f'
    },
    emerald: {
      bg: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0284c7 100%)',
      editorBg: '#022c22',
      editorText: '#a7f3d0',
      border: '#047857'
    },
    minimal: {
      bg: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
      editorBg: '#ffffff',
      editorText: '#0f172a',
      border: '#e2e8f0'
    }
  };

  const currentStyle = themes[cardTheme];

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const cardElement = cardRef.current;
      if (!cardElement) return;

      // Draw cleanly to canvas using HTML5 Canvas
      const width = cardElement.offsetWidth * 2;
      const height = cardElement.offsetHeight * 2;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(2, 2);

      // Create an SVG foreignObject payload for crisp rasterization
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${cardElement.offsetWidth}" height="${cardElement.offsetHeight}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${cardElement.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `;

      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const a = document.createElement('a');
        a.download = `codepulse-${windowTitle.replace('.', '-')}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        setDownloading(false);
      };

      img.onerror = () => {
        // Fallback: direct svg download
        const a = document.createElement('a');
        a.download = `codepulse-${windowTitle.replace('.', '-')}.svg`;
        a.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        a.click();
        setDownloading(false);
      };

      img.src = url;
    } catch (err) {
      setDownloading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Export Shareable Code Card (Ray.so / Carbon)</h2>
              <p className="text-xs text-slate-400">Generate high-res aesthetic code snapshots for Twitter, LinkedIn, & GitHub</p>
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
          {/* Left Column: Preview Stage (8 cols) */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center overflow-x-auto p-2">
            <div
              ref={cardRef}
              className="rounded-2xl shadow-2xl transition-all max-w-full"
              style={{
                background: currentStyle.bg,
                padding: `${padding}px`
              }}
            >
              {/* Window Frame */}
              <div
                className="rounded-xl shadow-2xl overflow-hidden border min-w-[340px] max-w-[560px]"
                style={{
                  backgroundColor: currentStyle.editorBg,
                  borderColor: currentStyle.border,
                  color: currentStyle.editorText
                }}
              >
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 select-none">
                  {/* Traffic Light Dots */}
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>

                  {/* Title */}
                  <span className="text-xs font-mono opacity-80">{windowTitle}</span>

                  {/* Language Badge */}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 uppercase tracking-wider opacity-70">
                    {selectedLang}
                  </span>
                </div>

                {/* Code Body */}
                <div className="p-4 font-mono text-[12px] leading-relaxed overflow-x-auto select-all">
                  {lines.map((line, idx) => (
                    <div key={idx} className="flex gap-4">
                      {showLineNumbers && (
                        <span className="opacity-30 select-none w-5 text-right font-mono text-[11px]">
                          {idx + 1}
                        </span>
                      )}
                      <span className="whitespace-pre">{line || ' '}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls (4 cols) */}
          <div className={`lg:col-span-4 p-5 rounded-xl border flex flex-col gap-4 text-xs ${
            isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className="font-semibold text-slate-200 pb-2 border-b border-slate-700/50 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Card Settings
            </h3>

            {/* Language Selector */}
            <div>
              <label className="block text-slate-400 mb-1">Source Panel</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['html', 'css', 'javascript'] as EditorLanguage[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setSelectedLang(l);
                      setWindowTitle(l === 'html' ? 'index.html' : l === 'css' ? 'style.css' : 'app.js');
                    }}
                    className={`py-1.5 rounded-lg border font-medium uppercase text-[11px] transition-all ${
                      selectedLang === l
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    {l === 'javascript' ? 'JS' : l}
                  </button>
                ))}
              </div>
            </div>

            {/* Window Title */}
            <div>
              <label className="block text-slate-400 mb-1">Window Filename</label>
              <input
                type="text"
                value={windowTitle}
                onChange={(e) => setWindowTitle(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-800'
                }`}
              />
            </div>

            {/* Theme Preset */}
            <div>
              <label className="block text-slate-400 mb-1">Background Gradient</label>
              <div className="grid grid-cols-2 gap-2">
                {(['midnight', 'cyberpunk', 'sunset', 'emerald', 'minimal'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCardTheme(t)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      cardTheme === t
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : isDark
                        ? 'border-slate-700 text-slate-400 hover:bg-slate-700/40'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: themes[t].bg }} />
                    <span className="capitalize font-medium text-[11px]">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Padding Slider */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Card Padding</span>
                <span className="font-mono">{padding}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                step="8"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Toggle Line Numbers */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <span className="text-slate-300">Line Numbers</span>
              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  showLineNumbers ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  showLineNumbers ? 'left-5' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <span className="text-xs text-slate-400">High-DPI Retina Code Render</span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Generating...' : 'Download Code Card (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
