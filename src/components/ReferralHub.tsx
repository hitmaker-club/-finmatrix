import React, { useState } from 'react';
import {
  Share2,
  Gift,
  Users,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { ReferralStats } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';

interface ReferralHubProps {
  stats: ReferralStats | null;
  onSimulateConversion: () => Promise<void>;
  isSimulating: boolean;
}

export const ReferralHub: React.FC<ReferralHubProps> = ({
  stats,
  onSimulateConversion,
  isSimulating,
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const referralLink = stats?.referralLink || `${window.location.origin}/invite/usr-diag-live`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1.5 mb-3">
            <Gift className="w-3.5 h-3.5 text-cyan-400" />
            {t.referrals.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            {t.referrals.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {t.referrals.bannerDesc}
          </p>

          {/* Referral Link Copy Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 font-mono text-xs text-indigo-300 truncate select-all">
              {referralLink}
            </div>
            <button
              id="btn-copy-ref-link"
              onClick={handleCopyLink}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.referrals.linkCopied : t.referrals.copyLink}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">{t.referrals.totalInvites}</span>
            <div className="text-2xl font-black text-slate-100 font-mono mt-1">
              {stats?.totalInvited || 0}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{t.referrals.totalInvitesDesc}</span>
          </div>
          <Users className="w-8 h-8 text-indigo-400/40" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">{t.referrals.convertedColleagues}</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {stats?.totalConverted || 0}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{t.referrals.convertedColleaguesDesc}</span>
          </div>
          <Zap className="w-8 h-8 text-emerald-400/40" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">{t.referrals.rewardMonths}</span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
              {stats?.rewardMonthsEarned || 0} Mo.
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{t.referrals.rewardMonthsDesc}</span>
          </div>
          <Gift className="w-8 h-8 text-cyan-400/40" />
        </div>
      </div>

      {/* Conversion Progress & Simulation trigger */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200">{t.referrals.progressTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.referrals.progressDesc}
            </p>
          </div>

          <button
            id="btn-simulate-referral"
            onClick={onSimulateConversion}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-400 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? t.referrals.btnSimulateLoading : t.referrals.btnSimulate}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">{stats?.totalConverted || 0} / 3</span>
            <span className="text-indigo-400 font-bold">
              {Math.min(100, Math.round(((stats?.totalConverted || 0) % 3) * 33.33))}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (((stats?.totalConverted || 0) % 3) / 3) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-200 mb-4">{t.referrals.logTitle}</h3>
        {(!stats?.history || stats.history.length === 0) ? (
          <p className="text-xs text-slate-400 text-center py-6">{t.referrals.noReferrals}</p>
        ) : (
          <div className="divide-y divide-slate-800">
            {stats.history.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block">{item.invitedEmail}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(item.invitedAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.status === 'CONVERTED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {item.status === 'CONVERTED' ? t.referrals.converted : t.referrals.pending}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
