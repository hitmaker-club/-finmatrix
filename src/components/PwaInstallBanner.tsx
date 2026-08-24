import React, { useState, useEffect } from 'react';
import { Download, X, Monitor, Smartphone, Check } from 'lucide-react';
import { useI18n } from '../i18n/context.js';
import { usePwaInstall } from '../hooks/usePwaInstall.js';

interface PwaInstallBannerProps {
  onOpenModal: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ onOpenModal }) => {
  const { t } = useI18n();
  const { isInstalled, hasNativePrompt, promptInstall } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('finmatrix_pwa_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (isInstalled || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('finmatrix_pwa_banner_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (hasNativePrompt) {
      const outcome = await promptInstall();
      if (outcome === 'manual_guide') {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  return (
    <div
      id="pwa-install-banner"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100%-2rem)] bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/40 text-slate-100 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-3">
        {/* App Icon */}
        <div className="relative shrink-0">
          <img
            src="/icon-192.png"
            alt="Fin Matrix"
            className="w-11 h-11 rounded-xl border border-cyan-500/40 shadow-md object-cover"
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-white truncate">
              Fin Matrix
            </h4>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {t.pwa?.installBannerTitle || 'Установите приложение на рабочий стол'}
          </p>
        </div>

        {/* Dismiss X */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title={t.common?.close || 'Hide'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-2.5 flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.pwa?.installButton || 'Install'}</span>
        </button>
        <button
          onClick={onOpenModal}
          className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
        >
          {t.common?.info || 'Info'}
        </button>
      </div>
    </div>
  );
};
