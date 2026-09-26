import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Sliders, 
  Palette, 
  RotateCw, 
  Plus,
  Box
} from 'lucide-react';

interface CssStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertCss: (cssSnippet: string) => void;
  theme: ThemeMode;
}

export const CssStudioModal: React.FC<CssStudioModalProps> = ({
  isOpen,
  onClose,
  onInsertCss,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'shadow' | 'gradient' | 'glass'>('shadow');
  const [copied, setCopied] = useState(false);

  // Box Shadow States
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(12);
  const [shadowBlur, setShadowBlur] = useState(24);
  const [shadowSpread, setShadowSpread] = useState(-4);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(25);
  const [isInset, setIsInset] = useState(false);

  // Gradient States
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [colorStop1, setColorStop1] = useState('#6366f1');
  const [colorStop2, setColorStop2] = useState('#ec4899');
  const [colorStop1Pos, setColorStop1Pos] = useState(0);
  const [colorStop2Pos, setColorStop2Pos] = useState(100);

  // Glassmorphism States
  const [glassBlur, setGlassBlur] = useState(16);
  const [glassBgOpacity, setGlassBgOpacity] = useState(15);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(25);
  const [glassRadius, setGlassRadius] = useState(16);

  if (!isOpen) return null;

  // Convert Hex to RGBA
  const hexToRgba = (hex: string, alphaPercent: number) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2) || '0', 16);
    const g = parseInt(cleanHex.substring(2, 4) || '0', 16);
    const b = parseInt(cleanHex.substring(4, 6) || '0', 16);
    const a = (alphaPercent / 100).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Compute CSS strings
  const computedShadowCss = `box-shadow: ${isInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${hexToRgba(shadowColor, shadowOpacity)};`;

  const computedGradientCss = gradientType === 'linear'
    ? `background: linear-gradient(${gradientAngle}deg, ${colorStop1} ${colorStop1Pos}%, ${colorStop2} ${colorStop2Pos}%);`
    : `background: radial-gradient(circle at center, ${colorStop1} ${colorStop1Pos}%, ${colorStop2} ${colorStop2Pos}%);`;

  const computedGlassCss = `background: rgba(255, 255, 255, ${(glassBgOpacity / 100).toFixed(2)});\nbackdrop-filter: blur(${glassBlur}px);\n-webkit-backdrop-filter: blur(${glassBlur}px);\nborder: 1px solid rgba(255, 255, 255, ${(glassBorderOpacity / 100).toFixed(2)});\nborder-radius: ${glassRadius}px;\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);`;

  const currentCssSnippet = activeTab === 'shadow' 
    ? computedShadowCss 
    : activeTab === 'gradient' 
      ? computedGradientCss 
      : computedGlassCss;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCssSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsertCss('\n' + currentCssSnippet + '\n');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="css-studio-title"
        className={`w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] ${
          theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="css-studio-title" className="text-base font-bold">
                Visual CSS Studio & Generator
              </h2>
              <p className="text-xs text-neutral-500">
                Craft shadows, gradients & glassmorphism visually and insert directly into CSS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close studio"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-200/80 dark:border-neutral-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('shadow')}
            className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'shadow'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Box Shadow Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('gradient')}
            className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'gradient'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Gradient Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('glass')}
            className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'glass'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Glassmorphism Studio</span>
          </button>
        </div>

        {/* Body (Two Column: Controls on Left, Live Canvas on Right) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: CONTROLS */}
          <div className="space-y-4">
            {activeTab === 'shadow' && (
              <>
                {/* Shadow Presets */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setShadowX(0); setShadowY(4); setShadowBlur(12); setShadowSpread(-2); setShadowOpacity(15); setIsInset(false); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 transition-colors text-center"
                    >
                      Subtle
                    </button>
                    <button
                      onClick={() => { setShadowX(0); setShadowY(12); setShadowBlur(24); setShadowSpread(-4); setShadowOpacity(25); setIsInset(false); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 transition-colors text-center"
                    >
                      Elevated
                    </button>
                    <button
                      onClick={() => { setShadowX(0); setShadowY(25); setShadowBlur(50); setShadowSpread(-12); setShadowOpacity(35); setIsInset(false); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 transition-colors text-center"
                    >
                      Floating
                    </button>
                    <button
                      onClick={() => { setShadowX(0); setShadowY(0); setShadowBlur(25); setShadowSpread(4); setShadowColor('#6366f1'); setShadowOpacity(50); setIsInset(false); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 transition-colors text-center"
                    >
                      Indigo Glow
                    </button>
                    <button
                      onClick={() => { setShadowX(0); setShadowY(0); setShadowBlur(25); setShadowSpread(4); setShadowColor('#06b6d4'); setShadowOpacity(60); setIsInset(false); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 transition-colors text-center"
                    >
                      Cyan Neon
                    </button>
                    <button
                      onClick={() => { setShadowX(0); setShadowY(4); setShadowBlur(8); setShadowSpread(0); setShadowOpacity(25); setIsInset(true); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 transition-colors text-center"
                    >
                      Inner Shadow
                    </button>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Horizontal Offset (X)</span>
                      <span className="font-mono text-neutral-500">{shadowX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadowX}
                      onChange={(e) => setShadowX(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Vertical Offset (Y)</span>
                      <span className="font-mono text-neutral-500">{shadowY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadowY}
                      onChange={(e) => setShadowY(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Blur Radius</span>
                      <span className="font-mono text-neutral-500">{shadowBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadowBlur}
                      onChange={(e) => setShadowBlur(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Spread Radius</span>
                      <span className="font-mono text-neutral-500">{shadowSpread}px</span>
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="50"
                      value={shadowSpread}
                      onChange={(e) => setShadowSpread(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Shadow Opacity</span>
                      <span className="font-mono text-neutral-500">{shadowOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadowOpacity}
                      onChange={(e) => setShadowOpacity(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">Shadow Color:</span>
                      <input
                        type="color"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="w-7 h-7 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer p-0"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInset}
                        onChange={(e) => setIsInset(e.target.checked)}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Inset Shadow</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'gradient' && (
              <>
                {/* Presets */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                    Gradient Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setColorStop1('#6366f1'); setColorStop2('#ec4899'); setGradientAngle(135); }}
                      className="h-8 rounded-lg border text-[11px] font-bold text-white shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
                    >
                      SUI Sunset
                    </button>
                    <button
                      onClick={() => { setColorStop1('#06b6d4'); setColorStop2('#3b82f6'); setGradientAngle(135); }}
                      className="h-8 rounded-lg border text-[11px] font-bold text-white shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                    >
                      Cyberpunk
                    </button>
                    <button
                      onClick={() => { setColorStop1('#10b981'); setColorStop2('#059669'); setGradientAngle(135); }}
                      className="h-8 rounded-lg border text-[11px] font-bold text-white shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    >
                      Emerald
                    </button>
                    <button
                      onClick={() => { setColorStop1('#f59e0b'); setColorStop2('#ef4444'); setGradientAngle(135); }}
                      className="h-8 rounded-lg border text-[11px] font-bold text-white shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
                    >
                      Flame
                    </button>
                    <button
                      onClick={() => { setColorStop1('#8b5cf6'); setColorStop2('#d946ef'); setGradientAngle(135); }}
                      className="h-8 rounded-lg border text-[11px] font-bold text-white shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)' }}
                    >
                      Royal
                    </button>
                    <button
                      onClick={() => { setColorStop1('#1e293b'); setColorStop2('#0f172a'); setGradientAngle(135); }}
                      className="h-8 rounded-lg border text-[11px] font-bold text-white shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}
                    >
                      Midnight
                    </button>
                  </div>
                </div>

                {/* Gradient Controls */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold">Type:</span>
                    <button
                      onClick={() => setGradientType('linear')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        gradientType === 'linear' ? 'bg-blue-600 text-white' : 'border text-neutral-500'
                      }`}
                    >
                      Linear
                    </button>
                    <button
                      onClick={() => setGradientType('radial')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        gradientType === 'radial' ? 'bg-blue-600 text-white' : 'border text-neutral-500'
                      }`}
                    >
                      Radial
                    </button>
                  </div>

                  {gradientType === 'linear' && (
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Gradient Angle</span>
                        <span className="font-mono text-neutral-500">{gradientAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradientAngle}
                        onChange={(e) => setGradientAngle(Number(e.target.value))}
                        className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Color Stop 1</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorStop1}
                          onChange={(e) => setColorStop1(e.target.value)}
                          className="w-8 h-8 rounded border cursor-pointer p-0"
                        />
                        <span className="font-mono text-xs text-neutral-500">{colorStop1}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Color Stop 2</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorStop2}
                          onChange={(e) => setColorStop2(e.target.value)}
                          className="w-8 h-8 rounded border cursor-pointer p-0"
                        />
                        <span className="font-mono text-xs text-neutral-500">{colorStop2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'glass' && (
              <>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                    Glass Presets
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setGlassBlur(12); setGlassBgOpacity(12); setGlassBorderOpacity(20); setGlassRadius(16); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 text-center"
                    >
                      Frosted Minimal
                    </button>
                    <button
                      onClick={() => { setGlassBlur(24); setGlassBgOpacity(25); setGlassBorderOpacity(35); setGlassRadius(20); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 text-center"
                    >
                      Deep Ice
                    </button>
                    <button
                      onClick={() => { setGlassBlur(16); setGlassBgOpacity(8); setGlassBorderOpacity(15); setGlassRadius(12); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 text-center"
                    >
                      Ultra Glass
                    </button>
                    <button
                      onClick={() => { setGlassBlur(20); setGlassBgOpacity(18); setGlassBorderOpacity(28); setGlassRadius(24); }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-semibold hover:border-blue-500 text-center"
                    >
                      SUI Acrylic
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Backdrop Blur</span>
                      <span className="font-mono text-neutral-500">{glassBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={glassBlur}
                      onChange={(e) => setGlassBlur(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Background Opacity</span>
                      <span className="font-mono text-neutral-500">{glassBgOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={glassBgOpacity}
                      onChange={(e) => setGlassBgOpacity(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Border Opacity</span>
                      <span className="font-mono text-neutral-500">{glassBorderOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="70"
                      value={glassBorderOpacity}
                      onChange={(e) => setGlassBorderOpacity(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Border Radius</span>
                      <span className="font-mono text-neutral-500">{glassRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={glassRadius}
                      onChange={(e) => setGlassRadius(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: INTERACTIVE PREVIEW & OUTPUT */}
          <div className="flex flex-col gap-4">
            {/* Live Interactive Preview Box */}
            <div className={`flex-1 min-h-[220px] rounded-2xl flex items-center justify-center p-6 border relative overflow-hidden ${
              activeTab === 'glass'
                ? 'bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600'
                : theme === 'dark' ? 'bg-[#090d16] border-neutral-800' : 'bg-neutral-100 border-neutral-200'
            }`}>
              {activeTab === 'shadow' && (
                <div
                  style={{
                    boxShadow: `${isInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${hexToRgba(shadowColor, shadowOpacity)}`
                  }}
                  className={`w-36 h-36 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-150 ${
                    theme === 'dark' ? 'bg-[#1e293b] text-white' : 'bg-white text-neutral-800'
                  }`}
                >
                  Shadow Box
                </div>
              )}

              {activeTab === 'gradient' && (
                <div
                  style={{
                    background: gradientType === 'linear'
                      ? `linear-gradient(${gradientAngle}deg, ${colorStop1} ${colorStop1Pos}%, ${colorStop2} ${colorStop2Pos}%)`
                      : `radial-gradient(circle at center, ${colorStop1} ${colorStop1Pos}%, ${colorStop2} ${colorStop2Pos}%)`
                  }}
                  className="w-full h-40 rounded-2xl shadow-xl flex items-center justify-center text-white font-extrabold text-sm tracking-wide"
                >
                  Gradient Canvas
                </div>
              )}

              {activeTab === 'glass' && (
                <div
                  style={{
                    background: `rgba(255, 255, 255, ${(glassBgOpacity / 100).toFixed(2)})`,
                    backdropFilter: `blur(${glassBlur}px)`,
                    WebkitBackdropFilter: `blur(${glassBlur}px)`,
                    border: `1px solid rgba(255, 255, 255, ${(glassBorderOpacity / 100).toFixed(2)})`,
                    borderRadius: `${glassRadius}px`,
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)'
                  }}
                  className="w-48 h-36 p-4 flex flex-col justify-center text-white"
                >
                  <span className="text-xs font-bold">Frosted Card</span>
                  <span className="text-[10px] text-white/80 mt-1">SUI Acrylic Material</span>
                </div>
              )}
            </div>

            {/* Generated CSS Code Card */}
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  Generated CSS
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                {currentCssSnippet}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t text-xs flex items-center justify-between ${
          theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <span className="text-neutral-500">
            Works across all modern browsers and SUI.css
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy CSS</span>
            </button>
            <button
              onClick={handleInsert}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert into CSS Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
