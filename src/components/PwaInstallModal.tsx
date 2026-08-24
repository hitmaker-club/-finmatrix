import React from 'react';
import {
  X,
  Download,
  Share,
  PlusSquare,
  Monitor,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useI18n } from '../i18n/context.js';
import { usePwaInstall } from '../hooks/usePwaInstall.js';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const { isInstalled, hasNativePrompt, isIos, promptInstall } = usePwaInstall();
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setIsProcessing(true);
    try {
      const result = await promptInstall();
      if (result === 'accepted') {
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="pwa-install-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Header with Close */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            {/* Fin Matrix Icon Preview */}
            <div className="relative group">
              <img
                src="/icon-192.png"
                alt="Fin Matrix Icon"
                className="w-16 h-16 rounded-2xl shadow-xl shadow-cyan-950/40 border border-cyan-500/30 object-cover"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Fin Matrix
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PWA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.pwa?.desktopApp || 'Приложение для ПК и смартфона'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
            <div className="text-xs">
              <p className="font-bold">{t.pwa?.installedBadge || 'Fin Matrix установлен'}</p>
              <p className="text-emerald-400/80 mt-0.5">
                {t.pwa?.alreadyInstalled || 'Приложение Fin Matrix уже установлено на вашем устройстве.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.pwa?.benefitsTitle || 'Преимущества PWA-версии:'}</span>
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.pwa?.benefit1 || 'Быстрый запуск с рабочего стола или главного экрана'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.pwa?.benefit2 || 'Полноэкранный режим без адресной строки браузера'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.pwa?.benefit3 || 'Оффлайн-доступ к сохранённым профилям и истории'}</span>
                </li>
              </ul>
            </div>

            {/* Platform Instructions */}
            {isIos ? (
              /* iOS Safari Instructions */
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
                <p className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>{t.pwa?.iosInstructionsTitle || 'Установка на iPhone / iPad (iOS)'}</span>
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-snug">
                      {t.pwa?.iosStep1 || 'Нажмите кнопку «Поделиться» (⎙ / ⎋) в панели браузера Safari.'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-snug">
                      {t.pwa?.iosStep2 || 'Прокрутите меню вниз и выберите «На экран «Домой»» (⊞).'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="leading-snug">
                      {t.pwa?.iosStep3 || 'Подтвердите название «Fin Matrix» и нажмите «Добавить» в правом верхнем углу.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : hasNativePrompt ? (
              /* Direct 1-Click Install Button */
              <div className="pt-2">
                <button
                  id="pwa-native-install-btn"
                  onClick={handleInstallClick}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  <span>{t.pwa?.installButton || 'Установить Fin Matrix'}</span>
                </button>
              </div>
            ) : (
              /* Desktop Manual / Browser Instructions */
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                <p className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span>{t.pwa?.desktopInstructionsTitle || 'Установка на рабочий стол компьютера'}</span>
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.pwa?.desktopInstructionsDesc ||
                    'В Google Chrome, Microsoft Edge или Яндекс.Браузере нажмите на иконку «Установить Fin Matrix» в правой части адресной строки браузера.'}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.pwa?.desktopInstructionsNote || 'After installation, the app runs offline and saves calculations locally.'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {t.pwa?.close || 'Закрыть'}
          </button>
        </div>
      </div>
    </div>
  );
};
