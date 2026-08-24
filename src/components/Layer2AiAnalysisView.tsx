import React, { useState } from 'react';
import {
  Sparkles,
  GitPullRequest,
  Brain,
  TrendingUp,
  Shield,
  CheckSquare,
  Printer,
  Copy,
  Check,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  Compass,
  AlertTriangle,
  Flame,
  Key,
  Target,
  Coins,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { DiagnosticAnalysisRecord, FinancialMatrixLayer1Output } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';
import { Layer1MatrixView } from './Layer1MatrixView.js';

interface Layer2AiAnalysisViewProps {
  analysis: DiagnosticAnalysisRecord;
  layer1?: FinancialMatrixLayer1Output | null;
}

export const Layer2AiAnalysisView: React.FC<Layer2AiAnalysisViewProps> = ({ analysis, layer1 }) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showDetailedSystems, setShowDetailedSystems] = useState(false); // DEFAULT: HIDDEN as requested
  const [activeTab, setActiveTab] = useState<'all' | 'systems' | 'behavioral' | 'psychology' | 'strategy'>('all');

  const layer2 = analysis.layer2;
  const l1Data = layer1 || analysis.layer1;

  if (!layer2) return null;

  const handleCopy = () => {
    const sections: string[] = [
      `${t.common.appName} - ${t.form.primaryReportTitle}`,
      `${t.common?.subject || 'Subject'}: ${analysis.profileName}`,
      `${t.ai?.analysisDate || 'Analysis Date'}: ${new Date(analysis.createdAt).toLocaleDateString()}`,
      `${t.ai?.reliability || 'Reliability'}: ${Math.round(layer2.confidenceScore * 100)}%`,
      '',
    ];

    if (layer2.hookSummary) {
      sections.push(`=== ${t.ai?.introSummaryAndParadox || 'EXECUTIVE SUMMARY'} ===`, layer2.hookSummary, '');
    }

    if (layer2.matrixOverview) {
      sections.push(`=== ${t.ai?.matrixOverviewAndSystemArchitecture || 'MATRIX OVERVIEW'} ===`, layer2.matrixOverview, '');
    }

    if (layer2.financialPotential) {
      sections.push(`=== ${t.ai?.financialPotentialAndValueCreation || 'FINANCIAL POTENTIAL'} ===`, layer2.financialPotential, '');
    }

    if (layer2.strengths && layer2.strengths.length > 0) {
      sections.push(`=== ${t.ai?.keyStrengths || 'KEY STRENGTHS'} ===`);
      layer2.strengths.forEach((s) => {
        sections.push(
          `• ${s.name}:`,
          `  - ${t.ai?.structuralBasis || 'Structural Basis'}: ${s.structuralBasis}`,
          `  - ${t.ai?.behaviorLabel || 'Behavior'}: ${s.behavior}`,
          `  - ${t.ai?.financialEffect || 'Financial Effect'}: ${s.financialEffect}`
        );
      });
      sections.push('');
    }

    if (layer2.limitations && layer2.limitations.length > 0) {
      sections.push(`=== ${t.ai?.limitationsAndShadows || 'LIMITATIONS & SHADOWS'} ===`);
      layer2.limitations.forEach((l) => {
        sections.push(
          `• ${l.name}:`,
          `  - ${t.ai?.shadowMechanism || 'Mechanism of Shadow'}: ${l.mechanismOfShadow}`,
          `  - ${t.ai?.financialRisk || 'Financial Risk'}: ${l.financialRisk}`
        );
      });
      sections.push('');
    }

    if (layer2.moneyManifestations && layer2.moneyManifestations.length > 0) {
      sections.push(`=== ${t.ai?.moneyManifestations || 'HOW THIS MANIFESTS IN MONEY'} ===`);
      layer2.moneyManifestations.forEach((m) => {
        sections.push(`• [${m.domain}]: ${m.description}`);
      });
      sections.push('');
    }

    if (layer2.mainInternalConflict) {
      sections.push(`=== ${t.ai?.mainInternalConflict || 'MAIN INTERNAL CONFLICT'} ===`, layer2.mainInternalConflict, '');
    }

    if (layer2.mainLever) {
      sections.push(
        `=== ${t.ai?.mainLever || 'MAIN LEVER'} ===`,
        `${t.ai?.coreAdjustment || 'Key Shift'}: ${layer2.mainLever.coreAdjustment}`,
        `${t.ai?.actionableDirections || 'Actionable Directions'}:`,
        ...layer2.mainLever.actionableDirections.map((dir) => `  ✓ ${dir}`),
        ''
      );
    }

    if (layer2.quickSummary) {
      sections.push(
        `=== ${t.ai?.quickSummaryTitle || 'QUICK SUMMARY'} ===`,
        `${t.ai?.strongestPotential || '1. Strongest Potential'}: ${layer2.quickSummary.strongestPotential}`,
        `${t.ai?.bottleneck || '2. Main Bottleneck'}: ${layer2.quickSummary.bottleneck}`,
        `${t.ai?.growthDirection || '3. Growth Direction'}: ${layer2.quickSummary.growthDirection}`,
        ''
      );
    }

    // Include fallback/legacy strategy
    if (layer2.actionableStrategy) {
      sections.push(
        `=== ${t.ai?.personalMoneyRule || t.ai?.resourceRuleCardTitle || 'RESOURCE ALLOCATION RULE'} ===`,
        `${t.ai?.prescribedFormula || 'Formula'}: ${layer2.actionableStrategy.resourceAllocationRule}`,
        '',
        `=== ${t.ai?.decisionChecklist || 'DECISION CHECKLIST'} ===`,
        ...layer2.actionableStrategy.decisionMakingChecklist.map((c) => `✓ ${c}`)
      );
    }

    navigator.clipboard.writeText(sections.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="diagnostic-report-container" className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. PRIMARY REPORT CARD (MAIN OUTPUT - COMPREHENSIVE BEHAVIORAL & FINANCIAL SYNTHESIS) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Background radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {t.form.primaryReportBadge}
              </span>
              <span className="text-xs font-semibold text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
                {t.common?.subject || 'Subject'}: <strong className="text-white">{analysis.profileName}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-2 tracking-tight">
              {t.form.primaryReportTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {t.ai?.detailedSystemsSubtitle || 'Deterministic matrix calculation & Level 2 AI systemic diagnostic.'}
            </p>
          </div>

          {/* Action Controls & Confidence Score */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Confidence Score Pill */}
            <div className="bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.ai?.reliability || 'Reliability'}</div>
                <div className="text-xs font-mono font-bold text-slate-200">
                  {Math.round(layer2.confidenceScore * 100)}% {t.ai.confidence}
                </div>
              </div>
            </div>

            {/* Copy Report */}
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title={t.common.copy}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? t.common.copied : t.common.copy}</span>
            </button>

            {/* Print/Export PDF */}
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title={t.common.printPdf}
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">{t.common.printPdf}</span>
            </button>
          </div>
        </div>

        {/* 1. Hook Summary (Engaging intro / The Core Paradox) */}
        {layer2.hookSummary ? (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950 border border-indigo-500/40 space-y-3 relative">
            <div className="flex items-center gap-2 text-indigo-300">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                {t.ai?.introSummaryAndParadox || 'Intro Summary & Core Paradox'}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              {layer2.hookSummary}
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 border border-indigo-500/30 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>{t.ai?.executiveSummary || 'Executive Summary'}</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              {layer2.executiveSummary}
            </p>
          </div>
        )}

        {/* 2. Matrix Overview & System Architecture */}
        {layer2.matrixOverview && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Compass className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {t.ai?.matrixOverviewAndSystemArchitecture || 'Matrix Overview & System Architecture'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {layer2.matrixOverview}
            </p>
          </div>
        )}

        {/* 3. Financial Potential (Natural Value Creation Mechanism) */}
        {layer2.financialPotential && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {t.ai?.financialPotentialAndValueCreation || 'Financial Potential & Value Creation'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {layer2.financialPotential}
            </p>
          </div>
        )}

        {/* 4. Strengths & 5. Limitations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Award className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {t.ai?.keyStrengths || 'Key Strengths'}
              </h3>
            </div>
            
            {layer2.strengths && layer2.strengths.length > 0 ? (
              <div className="space-y-3">
                {layer2.strengths.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-emerald-300">
                        {idx + 1}. {st.name}
                      </span>
                    </div>
                    {st.structuralBasis && (
                      <div className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">{t.ai?.structuralBasis || 'Structural Basis'}:</strong> {st.structuralBasis}
                      </div>
                    )}
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {st.behavior}
                    </p>
                    {st.financialEffect && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                        <strong className="text-emerald-300">{t.ai?.financialEffect || 'Financial Effect'}:</strong> {st.financialEffect}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                {layer2.actionableStrategy?.resourceAllocationRule || 'Structural basis'}
              </div>
            )}
          </div>

          {/* Limitations & Shadow Dynamics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {t.ai?.limitationsAndShadows || 'Limitations & Shadows'}
              </h3>
            </div>

            {layer2.limitations && layer2.limitations.length > 0 ? (
              <div className="space-y-3">
                {layer2.limitations.map((lim, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-rose-300">
                        {idx + 1}. {lim.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      <strong className="text-slate-400 font-medium">{t.ai?.shadowMechanism || 'Mechanism of Shadow'}:</strong> {lim.mechanismOfShadow}
                    </p>
                    {lim.financialRisk && (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
                        <strong className="text-rose-300">{t.ai?.financialRisk || 'Financial Risk'}:</strong> {lim.financialRisk}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                {layer2.analyticalPsychology?.shadowFinancialPattern || 'Risk Control'}
              </div>
            )}
          </div>
        </div>

        {/* 6. Money Manifestations (How it manifests across financial domains) */}
        {layer2.moneyManifestations && layer2.moneyManifestations.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Coins className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {t.ai?.moneyManifestations || 'How This Manifests in Money'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {layer2.moneyManifestations.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.domain}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Main Internal Conflict (The Tension / Gas vs Brake) */}
        {layer2.mainInternalConflict && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {t.ai?.mainInternalConflict || 'Main Internal Conflict'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {layer2.mainInternalConflict}
            </p>
          </div>
        )}

        {/* 8. Main Growth Lever (Core Adjustment + Directions) */}
        {layer2.mainLever && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 border border-cyan-500/40 space-y-5">
            <div className="flex items-center gap-2 text-cyan-400">
              <Key className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
                {t.ai?.mainLever || 'Main Growth Lever'}
              </h3>
            </div>

            {/* Core Mindset/Process Shift */}
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-1.5">
              <span className="text-[11px] uppercase font-bold text-cyan-300 block">
                {t.ai?.coreAdjustment || 'Key Shift'}:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                {layer2.mainLever.coreAdjustment}
              </p>
            </div>

            {/* 3 Actionable Directions */}
            {layer2.mainLever.actionableDirections && layer2.mainLever.actionableDirections.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.ai?.actionableDirections || '3 Actionable Directions'}:</span>
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {layer2.mainLever.actionableDirections.map((dir, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-200 space-y-1">
                      <span className="font-bold text-cyan-400 block">{t.ai?.step || 'Step'} {idx + 1}</span>
                      <p className="leading-relaxed text-slate-300">{dir}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. Quick 3-Point Summary */}
        {layer2.quickSummary && (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {t.ai?.quickSummaryTitle || 'Quick Summary'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <span className="font-bold text-emerald-300 block">{t.ai?.strongestPotential || '1. Strongest Potential'}</span>
                <p className="text-slate-200 leading-relaxed">{layer2.quickSummary.strongestPotential}</p>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                <span className="font-bold text-rose-300 block">{t.ai?.bottleneck || '2. Main Bottleneck'}</span>
                <p className="text-slate-200 leading-relaxed">{layer2.quickSummary.bottleneck}</p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
                <span className="font-bold text-cyan-300 block">{t.ai?.growthDirection || '3. Growth Direction'}</span>
                <p className="text-slate-200 leading-relaxed">{layer2.quickSummary.growthDirection}</p>
              </div>
            </div>
          </div>
        )}

        {/* Fallback legacy components if new fields are sparse */}
        {(!layer2.strengths || layer2.strengths.length === 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/90 space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Award className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {t.ai?.moneyArchetype || 'Money Archetype'}
                </h4>
              </div>
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <span className="text-xs text-purple-300 font-bold block">
                  {layer2.analyticalPsychology?.primaryArchetype}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {layer2.analyticalPsychology?.shadowFinancialPattern}
              </p>
            </div>

            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/90 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {t.ai?.personalMoneyRule || 'Personal Money Rule'}
                </h4>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="text-xs text-emerald-300 font-bold block">
                  {layer2.actionableStrategy?.resourceAllocationRule}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {layer2.behavioralEconomics?.mentalAccountingTendency}
              </p>
            </div>
          </div>
        )}
      </div>


      {/* 2. COLLAPSIBLE DETAILED REPORTS BY SYSTEM (HIDDEN BY DEFAULT AS REQUESTED) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Toggle Expand / Collapse Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {t.ai?.detailedSystemsTitle || 'Detailed Theoretical Reports by System'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.ai?.detailedSystemsSubtitle || '4-vector matrix, systems theory, behavioral economics & analytical psychology.'}
              </p>
            </div>
          </div>

          <button
            id="btn-toggle-detailed-systems"
            onClick={() => setShowDetailedSystems((prev) => !prev)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer shadow-md"
          >
            <span>{showDetailedSystems ? t.form.hideDetailedSystemsReports : t.form.showDetailedSystemsReports}</span>
            {showDetailedSystems ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

        {/* Collapsed notice if hidden */}
        {!showDetailedSystems && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>{t.form.detailedReportsNotice}</span>
          </div>
        )}

        {/* Expanded Content: 4-Vector Matrix + 4 System Frameworks */}
        {showDetailedSystems && (
          <div className="space-y-6 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
            
            {/* Mathematical Matrix Layer 1 View */}
            {l1Data && (
              <div className="space-y-3">
                <Layer1MatrixView
                  layer1={l1Data}
                />
              </div>
            )}

            {/* Filter Tabs for Scientific Frameworks */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.ai.tabAll}
              </button>
              <button
                onClick={() => setActiveTab('systems')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'systems' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.ai.tabSystems}</span>
              </button>
              <button
                onClick={() => setActiveTab('behavioral')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'behavioral' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.ai.tabBehavioral}</span>
              </button>
              <button
                onClick={() => setActiveTab('psychology')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'psychology' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.ai.tabPsychology}</span>
              </button>
              <button
                onClick={() => setActiveTab('strategy')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'strategy' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.ai.tabStrategy}</span>
              </button>
            </div>

            {/* Individual System Framework Cards */}
            <div className="space-y-6">
              
              {/* 1. General Systems Theory */}
              {(activeTab === 'all' || activeTab === 'systems') && layer2.systemicDynamics && (
                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                      <GitPullRequest className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">
                        {t.ai.systemsTitle}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {t.ai.systemsFramework}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-cyan-300 block">{t.ai.intergenerationalPatterns}</span>
                      <p className="text-slate-300 leading-relaxed">
                        {layer2.systemicDynamics.intergenerationalPatterns}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-indigo-300 block">{t.ai.familyResourceFlow}</span>
                      <p className="text-slate-300 leading-relaxed">
                        {layer2.systemicDynamics.familyResourceFlowFeedback}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-emerald-300 block">{t.ai.systemEquilibrium}</span>
                      <p className="text-slate-300 leading-relaxed">
                        {layer2.systemicDynamics.systemEquilibriumHypothesis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Behavioral Economics */}
              {(activeTab === 'all' || activeTab === 'behavioral') && layer2.behavioralEconomics && (
                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">
                        {t.ai.behavioralTitle}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {t.ai.behavioralFramework}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-emerald-300 block">{t.ai.mentalAccounting}</span>
                      <p className="text-slate-300 leading-relaxed">
                        {layer2.behavioralEconomics.mentalAccountingTendency}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-rose-300 block">{t.ai.lossAversion}</span>
                      <p className="text-slate-300 leading-relaxed">
                        {layer2.behavioralEconomics.lossAversionSensitivity}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-amber-300 block">{t.ai.temporalDiscounting}</span>
                      <p className="text-slate-300 leading-relaxed">
                        {layer2.behavioralEconomics.temporalDiscountingProfile}
                      </p>
                    </div>
                  </div>

                  {/* Cognitive Biases Chips */}
                  {layer2.behavioralEconomics.cognitiveBiasesIdentified && layer2.behavioralEconomics.cognitiveBiasesIdentified.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-slate-400 block mb-2">{t.ai.cognitiveBiases}:</span>
                      <div className="flex flex-wrap gap-2">
                        {layer2.behavioralEconomics.cognitiveBiasesIdentified.map((bias, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                          >
                            • {bias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Analytical Psychology */}
              {(activeTab === 'all' || activeTab === 'psychology') && layer2.analyticalPsychology && (
                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">
                        {t.ai.psychologyTitle}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {t.ai.psychologyFramework}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-purple-300 block">{t.ai.primaryArchetype}</span>
                      <p className="text-slate-200 font-semibold text-sm">
                        {layer2.analyticalPsychology.primaryArchetype}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-pink-300 block">{t.ai.shadowFinancial}</span>
                      <p className="text-slate-300 leading-relaxed">
                        {layer2.analyticalPsychology.shadowFinancialPattern}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <span className="font-bold text-indigo-300 block">{t.ai.individuation}</span>
                      <p className="text-slate-300 leading-relaxed">
                        {layer2.analyticalPsychology.individuationChallenges}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Actionable Strategy */}
              {(activeTab === 'all' || activeTab === 'strategy') && layer2.actionableStrategy && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 border border-indigo-500/30 space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <Shield className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">
                        {t.ai.strategyTitle}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {t.ai.strategySubtitle}
                      </span>
                    </div>
                  </div>

                  {/* Allocation Formula Badge */}
                  {layer2.actionableStrategy.resourceAllocationRule && (
                    <div className="p-4 rounded-xl bg-indigo-600/15 border border-indigo-500/40">
                      <span className="text-[11px] uppercase font-bold text-indigo-300 block mb-1">
                        {t.ai.prescribedFormula}:
                      </span>
                      <p className="text-sm font-semibold text-white">
                        {layer2.actionableStrategy.resourceAllocationRule}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Tactical Adjustments */}
                    {layer2.actionableStrategy.tacticalAdjustments && layer2.actionableStrategy.tacticalAdjustments.length > 0 && (
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
                        <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                          {t.ai.tacticalAdjustments}:
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {layer2.actionableStrategy.tacticalAdjustments.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-400 font-bold">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pre-Commitment Decision Checklist */}
                    {layer2.actionableStrategy.decisionMakingChecklist && layer2.actionableStrategy.decisionMakingChecklist.length > 0 && (
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-amber-400" />
                          {t.ai.decisionChecklist}:
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {layer2.actionableStrategy.decisionMakingChecklist.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-400 font-bold">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
