import React, { useState } from 'react';
import { X, Layers, Copy, Check, ArrowRight, Palette, Sliders } from 'lucide-react';
import { ThemeMode } from '../types';

interface GlassMeshStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectCss: (cssSnippet: string) => void;
  theme: ThemeMode;
}

export const GlassMeshStudioModal: React.FC<GlassMeshStudioModalProps> = ({
  isOpen,
  onClose,
  onInjectCss,
  theme
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'glass' | 'mesh'>('glass');
  const [copied, setCopied] = useState(false);

  // Glassmorphism state
  const [blur, setBlur] = useState(16);
  const [bgOpacity, setBgOpacity] = useState(25);
  const [borderOpacity, setBorderOpacity] = useState(30);
  const [borderRadius, setBorderRadius] = useState(20);
  const [shadowBlur, setShadowBlur] = useState(32);
  const [tintColor, setTintColor] = useState('#ffffff');
  const [saturation, setSaturation] = useState(180);

  // Mesh Gradient state
  const [c1, setC1] = useState('#4f46e5');
  const [c2, setC2] = useState('#ec4899');
  const [c3, setC3] = useState('#06b6d4');
  const [c4, setC4] = useState('#8b5cf6');
  const [gradientAngle, setGradientAngle] = useState(135);

  const presets = [
    { name: 'Aurora Borealis', c1: '#059669', c2: '#0284c7', c3: '#7c3aed', c4: '#ec4899' },
    { name: 'Sunset Glow', c1: '#f43f5e', c2: '#fb923c', c3: '#ec4899', c4: '#6366f1' },
    { name: 'Cyberpunk Neon', c1: '#3b82f6', c2: '#8b5cf6', c3: '#d946ef', c4: '#06b6d4' },
    { name: 'Midnight Obsidian', c1: '#0f172a', c2: '#1e1b4b', c3: '#312e81', c4: '#0284c7' }
  ];

  // Helper to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgb = hexToRgb(tintColor);
  const bgRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity / 100})`;
  const borderRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity / 100})`;

  const generatedGlassCss = `/* Glassmorphic Card by SUI CodePulse */
.glass-card {
  background: ${bgRgba};
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  border: 1px solid ${borderRgba};
  border-radius: ${borderRadius}px;
  box-shadow: 0 8px ${shadowBlur}px 0 rgba(0, 0, 0, 0.2);
}`;

  const generatedMeshCss = `/* Radiant Mesh Gradient by SUI CodePulse */
.mesh-gradient-bg {
  background-color: ${c1};
  background-image: 
    radial-gradient(at 10% 20%, ${c1} 0px, transparent 50%),
    radial-gradient(at 80% 15%, ${c2} 0px, transparent 50%),
    radial-gradient(at 20% 85%, ${c3} 0px, transparent 50%),
    radial-gradient(at 85% 80%, ${c4} 0px, transparent 50%),
    linear-gradient(${gradientAngle}deg, ${c1}, ${c4});
}`;

  const activeCss = activeTab === 'glass' ? generatedGlassCss : generatedMeshCss;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleInject = () => {
    onInjectCss('\n\n' + activeCss);
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
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Mesh Gradient & Glassmorphism Studio</h2>
              <p className="text-xs text-slate-400">Craft modern frosted glass and multi-point chromatic gradients</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className={`flex items-center p-1 rounded-xl border text-xs ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('glass')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'glass' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Glassmorphism
              </button>
              <button
                onClick={() => setActiveTab('mesh')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'mesh' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mesh Gradient
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Preview Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative h-72 rounded-2xl border overflow-hidden flex items-center justify-center p-6 shadow-inner" style={{
              backgroundColor: '#090d16',
              backgroundImage: `
                radial-gradient(at 10% 20%, ${c1} 0px, transparent 50%),
                radial-gradient(at 80% 15%, ${c2} 0px, transparent 50%),
                radial-gradient(at 20% 85%, ${c3} 0px, transparent 50%),
                radial-gradient(at 85% 80%, ${c4} 0px, transparent 50%),
                linear-gradient(${gradientAngle}deg, ${c1}, ${c4})
              `
            }}>
              {/* If Glass tab: show the floating frosted glass card */}
              {activeTab === 'glass' && (
                <div
                  className="w-72 p-5 text-white shadow-2xl transition-all"
                  style={{
                    backgroundColor: bgRgba,
                    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                    border: `1px solid ${borderRgba}`,
                    borderRadius: `${borderRadius}px`,
                    boxShadow: `0 8px ${shadowBlur}px 0 rgba(0, 0, 0, 0.3)`
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                      💎
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Glassmorphic Card</h4>
                      <p className="text-[11px] opacity-70">Frosted Glass UI</p>
                    </div>
                  </div>
                  <p className="text-xs opacity-85 leading-relaxed mb-4">
                    Ultra-smooth modern backdrop blur with custom border radiance and high-saturation optics.
                  </p>
                  <button className="w-full py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold backdrop-blur-sm transition-colors">
                    Interactive Button
                  </button>
                </div>
              )}

              {/* If Mesh tab: show a badge in the center */}
              {activeTab === 'mesh' && (
                <div className="px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-md text-white text-center border border-white/20">
                  <h4 className="text-sm font-semibold tracking-wide">Multi-Point Mesh Canvas</h4>
                  <p className="text-xs text-white/70">4 chromatic radial gradients blended in harmony</p>
                </div>
              )}
            </div>

            {/* Presets Grid */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Color Palettes & Presets</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setC1(p.c1);
                      setC2(p.c2);
                      setC3(p.c3);
                      setC4(p.c4);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
                      isDark ? 'border-slate-700 hover:border-purple-500 bg-slate-900/60' : 'border-slate-200 hover:border-purple-400 bg-white'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }} />
                    <span className="truncate text-slate-300 font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Controls (5 cols) */}
          <div className={`lg:col-span-5 p-5 rounded-xl border flex flex-col gap-4 text-xs ${
            isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            {activeTab === 'glass' ? (
              <>
                <h3 className="font-semibold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-700/50">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  Glassmorphism Tuning
                </h3>

                {/* Blur */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Backdrop Blur</span>
                    <span className="font-mono">{blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={blur}
                    onChange={(e) => setBlur(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Background Opacity */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Background Alpha</span>
                    <span className="font-mono">{bgOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Border Opacity */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Border Radiance</span>
                    <span className="font-mono">{borderOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={borderOpacity}
                    onChange={(e) => setBorderOpacity(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Border Radius */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Border Radius</span>
                    <span className="font-mono">{borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Saturation Boost</span>
                    <span className="font-mono">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="240"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Tint Color */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Glass Tint Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tintColor}
                      onChange={(e) => setTintColor(e.target.value)}
                      className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                    />
                    <span className="font-mono text-slate-300">{tintColor}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-700/50">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  Mesh Coordinate Colors
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Top Left Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c1}
                        onChange={(e) => setC1(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-300">{c1}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Top Right Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c2}
                        onChange={(e) => setC2(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-300">{c2}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Bottom Left Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c3}
                        onChange={(e) => setC3(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-300">{c3}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Bottom Right Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c4}
                        onChange={(e) => setC4(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-300">{c4}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Base Gradient Angle</span>
                    <span className="font-mono">{gradientAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <span className="text-xs text-slate-400">
            {activeTab === 'glass' ? 'Ready to inject .glass-card class' : 'Ready to inject .mesh-gradient-bg class'}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy CSS'}</span>
            </button>
            <button
              onClick={handleInject}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 transition-all"
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
