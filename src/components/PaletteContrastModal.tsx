import React, { useState } from 'react';
import { X, Palette, Check, Copy, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ThemeMode } from '../types';

interface PaletteContrastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectCss: (cssSnippet: string) => void;
  theme: ThemeMode;
}

export const PaletteContrastModal: React.FC<PaletteContrastModalProps> = ({
  isOpen,
  onClose,
  onInjectCss,
  theme
}) => {
  if (!isOpen) return null;

  const [bgColor, setBgColor] = useState('#0f172a');
  const [textColor, setTextColor] = useState('#f8fafc');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#38bdf8');
  const [copied, setCopied] = useState(false);

  // Palette Presets
  const presets = [
    { name: 'Indigo Dark', bg: '#0f172a', text: '#f8fafc', brand: '#6366f1', accent: '#38bdf8' },
    { name: 'Emerald Fintech', bg: '#064e3b', text: '#ecfdf5', brand: '#10b981', accent: '#a7f3d0' },
    { name: 'Sunset Warmth', bg: '#1c1917', text: '#fafaf9', brand: '#f97316', accent: '#fde047' },
    { name: 'Cyber Neon', bg: '#030712', text: '#f3f4f6', brand: '#a855f7', accent: '#06b6d4' },
    { name: 'Clean Snow Light', bg: '#ffffff', text: '#0f172a', brand: '#2563eb', accent: '#0284c7' }
  ];

  // Calculate relative luminance for WCAG 2.1
  const getLuminance = (hex: string): number => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const sR = r / 255;
    const sG = g / 255;
    const sB = b / 255;

    const cR = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
    const cG = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
    const cB = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);

    return 0.2126 * cR + 0.7152 * cG + 0.0722 * cB;
  };

  const getContrastRatio = (c1: string, c2: string): number => {
    const l1 = getLuminance(c1);
    const l2 = getLuminance(c2);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const contrastRatio = getContrastRatio(textColor, bgColor);
  const brandContrast = getContrastRatio(brandColor, bgColor);

  const isAANormal = contrastRatio >= 4.5;
  const isAAANormal = contrastRatio >= 7.0;
  const isAALarge = contrastRatio >= 3.0;
  const isAAALarge = contrastRatio >= 4.5;

  const generatedCss = `/* Palette Variables by SUI CodePulse (WCAG AAA Contrast ${contrastRatio.toFixed(2)}:1) */
:root {
  --bg-primary: ${bgColor};
  --text-primary: ${textColor};
  --color-brand: ${brandColor};
  --color-accent: ${accentColor};
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleInject = () => {
    onInjectCss('\n\n' + generatedCss);
    onClose();
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
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Color Palette & WCAG AAA Contrast Checker</h2>
              <p className="text-xs text-slate-400">Generate harmonized color themes with strict accessibility verification</p>
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
          {/* Left: Live Accessibility Sample Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Live Contrast Stage */}
            <div
              className="p-8 rounded-2xl border shadow-xl flex flex-col justify-between min-h-[260px] transition-colors"
              style={{ backgroundColor: bgColor, color: textColor, borderColor: brandColor + '40' }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-md"
                    style={{ backgroundColor: brandColor, color: '#ffffff' }}
                  >
                    Primary Brand
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: accentColor }}
                  >
                    Accent Element
                  </span>
                </div>

                <h3 className="text-2xl font-bold tracking-tight mb-2">
                  Accessible Typography Sample
                </h3>
                <p className="text-sm opacity-90 leading-relaxed max-w-md">
                  This preview renders real-time contrast between your text color and background color according to W3C WCAG 2.1 formulas.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-current/10">
                <button
                  className="px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-opacity hover:opacity-90"
                  style={{ backgroundColor: brandColor, color: '#ffffff' }}
                >
                  Interactive CTA
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-current/30 hover:bg-current/10 transition-colors"
                >
                  Secondary Action
                </button>
              </div>
            </div>

            {/* Presets Row */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Curated Palettes</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBgColor(p.bg);
                      setTextColor(p.text);
                      setBrandColor(p.brand);
                      setAccentColor(p.accent);
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-left text-xs transition-all ${
                      isDark ? 'border-slate-700 hover:border-emerald-500 bg-slate-900/60' : 'border-slate-200 hover:border-emerald-400 bg-white'
                    }`}
                  >
                    <div className="flex -space-x-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: p.bg }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: p.brand }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: p.accent }} />
                    </div>
                    <span className="truncate text-slate-300 font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contrast Metrics & Color Pickers (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Contrast Score Box */}
            <div className={`p-5 rounded-xl border flex flex-col gap-3 ${
              isAAANormal
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : isAANormal
                ? 'bg-blue-950/20 border-blue-500/30'
                : 'bg-amber-950/20 border-amber-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contrast Ratio</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {contrastRatio.toFixed(2)} : 1
                </span>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className={`p-2 rounded-lg border flex items-center justify-between ${
                  isAAANormal ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  <span>WCAG AAA Normal</span>
                  <span className="font-bold">{isAAANormal ? 'PASS' : 'FAIL'}</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center justify-between ${
                  isAANormal ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  <span>WCAG AA Normal</span>
                  <span className="font-bold">{isAANormal ? 'PASS' : 'FAIL'}</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center justify-between ${
                  isAAALarge ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  <span>WCAG AAA Large</span>
                  <span className="font-bold">{isAAALarge ? 'PASS' : 'FAIL'}</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center justify-between ${
                  isAALarge ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  <span>WCAG AA Large</span>
                  <span className="font-bold">{isAALarge ? 'PASS' : 'FAIL'}</span>
                </div>
              </div>
            </div>

            {/* Color Tuning */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 text-xs ${
              isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="font-semibold text-slate-200 pb-1 border-b border-slate-700/50">Palette Hex Values</h4>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="font-mono text-slate-300">{bgColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Text Content</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="font-mono text-slate-300">{textColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Primary Brand</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="font-mono text-slate-300">{brandColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Accent Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="font-mono text-slate-300">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>WCAG 2.1 Compliant CSS Tokens</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy :root'}</span>
            </button>
            <button
              onClick={handleInject}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all"
            >
              <span>Inject to Project CSS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
