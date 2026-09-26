import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ThemeMode } from '../types';
import { 
  X, 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface MobileQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  projectName: string;
  theme: ThemeMode;
}

export const MobileQrModal: React.FC<MobileQrModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  projectName,
  theme
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !shareUrl) return;

    QRCode.toDataURL(shareUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWindow = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-qr-title"
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden flex flex-col ${
          theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 id="mobile-qr-title" className="text-base font-bold">
                Test on Physical Mobile Device
              </h2>
              <p className="text-xs text-neutral-500">
                Scan with your phone's camera to run live
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 relative group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Mobile Preview QR Code"
                className="w-56 h-56 rounded-xl object-contain"
              />
            ) : (
              <div className="w-56 h-56 rounded-xl flex items-center justify-center text-neutral-400 animate-pulse text-xs">
                Generating QR code...
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-xs">
                SUI
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <Smartphone className="w-4 h-4 text-blue-500" />
            <span>Project: "{projectName}"</span>
          </div>

          <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
            Point your smartphone camera (iOS or Android) at the screen to immediately launch the app on your mobile browser.
          </p>

          {/* Quick Actions */}
          <div className="w-full mt-5 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className={`flex-1 px-3 py-2 text-xs font-mono rounded-xl border truncate ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-700'
                }`}
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={handleOpenWindow}
              className="w-full py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Browser Window</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t text-xs flex items-center justify-between ${
          theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <span className="text-neutral-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero install, 100% web responsive</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
