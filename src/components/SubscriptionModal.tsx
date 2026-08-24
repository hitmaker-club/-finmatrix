import React from 'react';
import {
  Check,
  Zap,
  Crown,
  Shield,
  Layers,
} from 'lucide-react';
import { Subscription } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';

interface SubscriptionModalProps {
  subscription: Subscription | null;
  onUpgrade: (tier: 'PRO_MONTHLY' | 'ENTERPRISE') => Promise<void>;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  subscription,
  onUpgrade,
  onClose,
}) => {
  const { t } = useI18n();
  const currentTier = subscription?.tier || 'FREE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1 mb-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              {t.subscriptionModal.badge}
            </span>
            <h2 className="text-2xl font-black text-slate-100">{t.subscriptionModal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-lg font-bold p-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Current Active Plan Status */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 font-medium">{t.subscriptionModal.currentPlan}: </span>
            <span className="font-bold text-indigo-400 font-mono">{currentTier}</span>
            <span className="text-slate-400 ml-3">
              {t.subscriptionModal.status}: <span className="text-emerald-400 font-semibold">{subscription?.status || 'ACTIVE'}</span>
            </span>
          </div>
          {subscription?.expiresAt && (
            <span className="text-slate-400 font-mono">
              {t.subscriptionModal.renewsOn}: {new Date(subscription.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Plan Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* FREE PLAN */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-200">{t.subscriptionModal.freeTitle}</h3>
              <div className="mt-2 text-2xl font-extrabold text-slate-100">$0</div>
              <p className="text-xs text-slate-400 mt-2">{t.subscriptionModal.freeDesc}</p>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.freeFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.freeFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.freeFeature3}</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
            >
              {currentTier === 'FREE' ? t.subscriptionModal.activeTier : t.subscriptionModal.freeTitle}
            </button>
          </div>

          {/* PRO MONTHLY PLAN */}
          <div className="bg-gradient-to-b from-indigo-950/40 via-slate-950/80 to-slate-950/60 border-2 border-indigo-500 rounded-2xl p-6 flex flex-col justify-between space-y-4 relative shadow-xl shadow-indigo-950/50">
            <div className="absolute -top-3 right-6 bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              {t.subscriptionModal.recommended}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">{t.subscriptionModal.proTitle}</h3>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-white">
                $49 <span className="text-xs font-normal text-slate-400">/ {t.subscriptionModal.month}</span>
              </div>
              <p className="text-xs text-indigo-200 mt-2">{t.subscriptionModal.proDesc}</p>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.proFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.proFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.proFeature3}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.proFeature4}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onUpgrade('PRO_MONTHLY')}
              disabled={currentTier === 'PRO_MONTHLY'}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:cursor-default"
            >
              {currentTier === 'PRO_MONTHLY' ? t.subscriptionModal.activeTier : t.subscriptionModal.upgradeToPro}
            </button>
          </div>

          {/* ENTERPRISE PLAN */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h3 className="text-lg font-bold text-slate-200">{t.subscriptionModal.enterpriseTitle}</h3>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-white">
                $199 <span className="text-xs font-normal text-slate-400">/ {t.subscriptionModal.month}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{t.subscriptionModal.enterpriseDesc}</p>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.enterpriseFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.enterpriseFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{t.subscriptionModal.enterpriseFeature3}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onUpgrade('ENTERPRISE')}
              disabled={currentTier === 'ENTERPRISE'}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-400 text-white text-xs font-bold shadow-lg shadow-amber-600/20 transition-all cursor-pointer disabled:cursor-default"
            >
              {currentTier === 'ENTERPRISE' ? t.subscriptionModal.activeTier : t.subscriptionModal.upgradeToEnterprise}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
