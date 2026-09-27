import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor, RotateCw, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { ThemeMode } from '../types';

interface ResponsiveMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewSrcDoc: string;
  theme: ThemeMode;
}

export const ResponsiveMatrixModal: React.FC<ResponsiveMatrixModalProps> = ({
  isOpen,
  onClose,
  previewSrcDoc,
  theme
}) => {
  if (!isOpen) return null;

  const [zoom, setZoom] = useState(0.85);
  const [refreshKey, setRefreshKey] = useState(0);

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Multi-Device Responsive Matrix</h2>
            <p className="text-[11px] text-slate-400">Mobile (375px), Tablet (768px), and Desktop (1200px) side-by-side</p>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
            className="p-1 hover:text-blue-400 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] text-slate-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(1.2, prev + 0.1))}
            className="p-1 hover:text-blue-400 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-slate-700 mx-1" />
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reload All</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Multi-Device Scrolling Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-8 flex items-start justify-center gap-8 bg-slate-950">
        <div
          className="flex items-start gap-8 transition-transform origin-top-left"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Device 1: Mobile (375px) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Mobile · 375 × 667</span>
            </div>
            <div className="w-[375px] h-[667px] rounded-[36px] p-3 bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col relative">
              {/* Dynamic Island / Notch */}
              <div className="w-28 h-4 rounded-full bg-black mx-auto mb-2 flex-shrink-0" />
              <div className="flex-1 rounded-[24px] overflow-hidden bg-white">
                <iframe
                  key={`mobile-${refreshKey}`}
                  srcDoc={previewSrcDoc}
                  title="Mobile Viewport"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                />
              </div>
            </div>
          </div>

          {/* Device 2: Tablet (768px) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
              <Tablet className="w-4 h-4 text-blue-400" />
              <span>Tablet · 768 × 800</span>
            </div>
            <div className="w-[768px] h-[800px] rounded-[28px] p-3.5 bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
              <div className="flex-1 rounded-[18px] overflow-hidden bg-white">
                <iframe
                  key={`tablet-${refreshKey}`}
                  srcDoc={previewSrcDoc}
                  title="Tablet Viewport"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                />
              </div>
            </div>
          </div>

          {/* Device 3: Desktop (1080px) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
              <Monitor className="w-4 h-4 text-purple-400" />
              <span>Desktop · 1080 × 800</span>
            </div>
            <div className="w-[1080px] h-[800px] rounded-2xl p-2.5 bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
              {/* Window controls */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 rounded-t-lg select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[11px] font-mono text-slate-400 ml-4">https://preview.local</span>
              </div>
              <div className="flex-1 rounded-b-lg overflow-hidden bg-white">
                <iframe
                  key={`desktop-${refreshKey}`}
                  srcDoc={previewSrcDoc}
                  title="Desktop Viewport"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
