/**
 * 4-Layer Integrative Behavioral Analysis View
 * Role: Senior Integrative Behavioral Analyst & Personal Potential Architect
 * Synthesizes:
 * 1. Socionics Profile (Sociotype, Quadra, Result/Process)
 * 2. Financial Matrix (V1-V4 Vectors)
 * 3. Behavioral Analysis (Layer 2)
 * 4. Birthday Archetype (Day marker of pattern & themes)
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Users,
  Compass,
  Zap,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldAlert,
  Coins,
  Briefcase,
  Target,
} from 'lucide-react';
import { useI18n } from '../i18n/context.js';
import { FullIntegrativeAnalysisRecord } from '../types/socionics.js';

interface IntegrativeAnalysisViewProps {
  record: FullIntegrativeAnalysisRecord;
  onRunNew?: () => void;
}

export const IntegrativeAnalysisView: React.FC<IntegrativeAnalysisViewProps> = ({
  record,
  onRunNew,
}) => {
  const { t, language } = useI18n();
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'report' | 'raw_layers'>('report');

  const report = record.integrativeReport;
  const soc = record.socionicsResult;
  const l1 = record.layer1Matrix;

  const v1 = l1?.vectors?.v1_life_scenario?.value ?? '-';
  const v2 = l1?.vectors?.v2_work_model?.value ?? '-';
  const v3 = l1?.vectors?.v3_emotional_background?.value ?? '-';
  const v4 = l1?.vectors?.v4_resource_management?.value ?? '-';
  const v1Label = l1?.vectors?.v1_life_scenario?.label || 'Базовый вектор V1';

  const synergyPoints = report?.synergyPoints || [];
  const conflicts = report?.conflicts || [];
  const actionableDirections = report?.mainLever?.actionableDirections || [];
  const socialRoles = report?.socialRoles || [];

  const handleCopyReport = () => {
    const text = `
=== КОМПЛЕКСНЫЙ 4-СЛОЙНЫЙ АНАЛИЗ ПОТЕНЦИАЛА ===
Субъект: ${record.profileName} (Дата рождения: ${report.birthDate}, День ${report.dayNumber})
Архетип дня: ${report.dayArchetypeTheme}
Социотип: ${soc?.sociotype?.primary || 'Н/Д'} (${soc?.sociotype?.nameRu || ''}) | Квадра: ${soc?.quadra?.classic || 'Н/Д'}
Матрица V1-V4: V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}

1. ЦЕНТРАЛЬНЫЙ МЕХАНИЗМ СИСТЕМЫ:
${report?.centralMechanism || ''}

2. ТОЧКИ СИНЕРГИИ:
${synergyPoints.map((s, i) => `${i + 1}. ${s.title}\n- Архетип: ${s.archetype}\n- Соционика: ${s.socionics}\n- Матрица: ${s.matrix}\n- Финансовое проявление: ${s.financialManifestation}`).join('\n\n')}

3. ТОЧКИ ТРЕНИЯ И КОНФЛИКТОВ:
${conflicts.map((c, i) => `${i + 1}. ${c.title}\n- Архетип требует: ${c.archetypeWant}\n- Матрица/Социотип диктует: ${c.socionicsMatrixDemand}\n- Финансовое последствие: ${c.financialConsequence}`).join('\n\n')}

4. СЕМЕЙНЫЙ СЛОЙ:
${report?.familyLayer || ''}

5. ГЛАВНЫЙ ВНУТРЕННИЙ КОНФЛИКТ:
${report?.mainInternalConflict || ''}

6. ГЛАВНЫЙ РЫЧАГ ИЗМЕНЕНИЙ:
${report?.mainLever?.title || ''}
Изменение поведения: ${report?.mainLever?.behaviorChange || ''}
Шаги:
${actionableDirections.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}

7. РЕКОМЕНДУЕМЫЕ СОЦИАЛЬНЫЕ РОЛИ:
${socialRoles.map((r, i) => `${i + 1}. ${r.title}\n- Суть: ${r.essence}\n- Соответствие: ${r.whyFits}\n- Монетизация: ${r.monetization}`).join('\n\n')}

8. КРАТКИЙ ИТОГ:
- Сильнейший потенциал: ${report?.quickSummary?.strongestPotential || ''}
- Что мешает: ${report?.quickSummary?.bottleneck || ''}
- Направление роста капитала: ${report?.quickSummary?.growthDirection || ''}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-8 space-y-8 print:p-0 print:m-0">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.integrative?.fourLayersBadge || '4-СЛОЙНЫЙ СИНТЕЗ ПОТЕНЦИАЛА'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.integrative?.title || 'Комплексный 4-слойный поведенческий анализ'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.integrative?.subtitle ||
                'Синтез Социотипа, Финансовой матрицы (V1-V4), Поведенческого отчета и Архетипа дня рождения от Senior Integrative Behavioral Analyst.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
            <button
              type="button"
              onClick={handleCopyReport}
              className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (t.integrative?.reportCopied || 'Скопировано') : (t.integrative?.copyReport || 'Копировать')}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.integrative?.printReport || 'Печать'}</span>
            </button>
            {onRunNew && (
              <button
                type="button"
                onClick={onRunNew}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {t.integrative?.runNewIntegration || 'Новый расчет'}
              </button>
            )}
          </div>
        </div>

        {/* 4 Connected Layers Baseline Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-500/20">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30">
            <span className="text-[11px] font-bold text-purple-400 block mb-1">
              {t.integrative?.layer1Socionics || 'Слой 1: Соционика'}
            </span>
            <span className="text-sm font-extrabold text-white block">
              {soc?.sociotype?.primary || 'ЛИЭ'} ({soc?.sociotype?.nameRu || ''})
            </span>
            <span className="text-[10px] text-slate-400">
              {soc?.quadra?.classic || 'Гамма'} Квадра • {soc?.result_process?.type === 'result' ? 'Результатник' : 'Процессник'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30">
            <span className="text-[11px] font-bold text-indigo-400 block mb-1">
              {t.integrative?.layer2Matrix || 'Слой 2: Векторы V1-V4'}
            </span>
            <span className="text-sm font-extrabold text-white block">
              V1={v1} • V2={v2} • V3={v3} • V4={v4}
            </span>
            <span className="text-[10px] text-slate-400">
              {v1Label}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
            <span className="text-[11px] font-bold text-cyan-400 block mb-1">
              {t.integrative?.layer3Analysis || 'Слой 3: Анализ матрицы'}
            </span>
            <span className="text-sm font-extrabold text-white block truncate">
              {record.layer2Matrix?.analyticalPsychology?.primaryArchetype || v1Label}
            </span>
            <span className="text-[10px] text-slate-400 truncate block">
              {record.layer2Matrix?.mainInternalConflict || record.layer2Matrix?.hookSummary || 'Поведенческий паттерн'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30">
            <span className="text-[11px] font-bold text-amber-400 block mb-1">
              {t.integrative?.layer4Archetype || 'Слой 4: Архетип дня'}
            </span>
            <span className="text-sm font-extrabold text-white block">
              День {report?.dayNumber || 1}
            </span>
            <span className="text-[10px] text-slate-400 truncate block">
              {report?.dayArchetypeTheme || ''}
            </span>
          </div>
        </div>
      </div>

      {/* GATEKEEPER PSYCHOPHYSIOLOGICAL LAYER & RECOVERY PROTOCOL */}
      {(report.energy_diagnostics || soc?.energy_diagnostics) && (
        (() => {
          const energy = report.energy_diagnostics || soc?.energy_diagnostics;
          if (!energy) return null;
          const isDeficit = energy.kpd < 1.0;
          return (
            <section
              className={`rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all ${
                isDeficit
                  ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-rose-950/80 border-amber-500/50'
                  : 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                      isDeficit ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    ⚡
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                      Психофизиологический слой (Gatekeeper)
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      КПД энергосистемы: {energy.kpd.toFixed(2)}{' '}
                      <span className={isDeficit ? 'text-amber-400' : 'text-emerald-400'}>
                        ({isDeficit ? 'Режим истощения / Дефицит' : 'Профицит / Базовый ресурс в норме'})
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-xl bg-slate-800/90 text-slate-300 font-bold border border-slate-700">
                    Вход: {energy.energyIn.toFixed(1)}/20
                  </span>
                  <span className="text-xs px-3 py-1 rounded-xl bg-slate-800/90 text-slate-300 font-bold border border-slate-700">
                    Расход: {energy.energyOut.toFixed(1)}/20
                  </span>
                </div>
              </div>

              {isDeficit ? (
                <div className="mt-5 space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                    <strong>ВНИМАНИЕ:</strong> Так как КПД системы ниже 1.0 (входящая витальность меньше операционных утечек), соционический тип личности и финансовые решения функционируют в режиме компенсации. Перед принятием высокорисковых решений и масштабированием капитала обязательна стабилизация физиологии.
                  </div>

                  {energy.protocol && (
                    <div className="p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-extrabold uppercase text-amber-400">
                          Первоочередной протокол: {energy.protocol.title}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          Автор: {energy.protocol.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-3">
                        <strong>Мишень:</strong> {energy.protocol.scientificBasis} (Кластер {energy.dominantCluster}: {energy.clusterNameRu})
                      </p>
                      <div className="space-y-1.5">
                        {energy.protocol.actionSteps.map((step, sIdx) => (
                          <div key={sIdx} className="text-xs text-slate-200 flex items-start gap-2">
                            <span className="text-amber-400 font-black">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-xs text-emerald-300/90 leading-relaxed">
                  Физиологический контур находится в ресурсном состоянии. Соционический инструментарий и векторы капитала могут быть задействованы на полную мощность без риска срыва адаптации.
                </p>
              )}
            </section>
          );
        })()
      )}

      {/* 8 Comprehensive Sections */}

      {/* 1. CENTRAL MECHANISM */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-indigo-400">
          <Brain className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t.integrative?.centralMechanism || '1. Центральный механизм системы'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line font-medium">
          {report.centralMechanism}
        </p>
      </section>

      {/* 2. SYNERGY POINTS */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6 text-emerald-400">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t.integrative?.synergyTitle || '2. Точки синергии (где 4 слоя усиливают друг друга)'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {synergyPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/60 border border-emerald-500/30 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-black uppercase text-emerald-400 block mb-2">
                  #{idx + 1} {item?.title}
                </span>
                <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong className="text-amber-300">{t.integrative?.archetypeAspect || 'Архетип дня:'}</strong>{' '}
                    {item?.archetype}
                  </p>
                  <p>
                    <strong className="text-purple-300">{t.integrative?.socionicsAspect || 'Соционика:'}</strong>{' '}
                    {item?.socionics}
                  </p>
                  <p>
                    <strong className="text-indigo-300">{t.integrative?.matrixAspect || 'Матрица:'}</strong>{' '}
                    {item?.matrix}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 bg-emerald-950/40 p-3 rounded-xl">
                <span className="text-[11px] font-bold text-emerald-300 block mb-1">
                  💰 {t.integrative?.financialManifestation || 'Финансовое проявление:'}
                </span>
                <span className="text-xs text-slate-200 font-medium">{item?.financialManifestation}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CONFLICT POINTS */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t.integrative?.conflictTitle || '3. Точки трения и внутренних противоречий'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conflicts.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/60 border border-rose-500/30 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-black uppercase text-rose-400 block mb-2">
                  #{idx + 1} {item?.title}
                </span>
                <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong className="text-amber-300">{t.integrative?.archetypeWant || 'Чего требует архетип:'}</strong>{' '}
                    {item?.archetypeWant}
                  </p>
                  <p>
                    <strong className="text-purple-300">{t.integrative?.matrixDemand || 'Что диктует матрица/социотип:'}</strong>{' '}
                    {item?.socionicsMatrixDemand}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 bg-rose-950/40 p-3 rounded-xl">
                <span className="text-[11px] font-bold text-rose-300 block mb-1">
                  ⚠️ {t.integrative?.financialConsequence || 'Финансовое последствие:'}
                </span>
                <span className="text-xs text-slate-200 font-medium">{item?.financialConsequence}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAMILY LAYER */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-cyan-400">
          <Users className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t.integrative?.familyLayerTitle || '4. Семейный слой и родительские влияния'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
          {report?.familyLayer || ''}
        </p>
      </section>

      {/* 5. MAIN INTERNAL CONFLICT */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-amber-400">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t.integrative?.mainConflictTitle || '5. Главный внутренний конфликт'}
          </h2>
        </div>
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40">
          <p className="text-sm sm:text-base text-amber-200 leading-relaxed font-semibold italic">
            {report?.mainInternalConflict || ''}
          </p>
        </div>
      </section>

      {/* 6. MAIN LEVER OF CHANGE */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6 text-purple-400">
          <Zap className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t.integrative?.mainLeverTitle || '6. Главный рычаг изменений'}
          </h2>
        </div>

        <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 mb-6">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">
            Ключевая трансформация
          </span>
          <h3 className="text-base font-extrabold text-white mb-2">{report?.mainLever?.title}</h3>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
            {report?.mainLever?.behaviorChange}
          </p>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            {t.integrative?.actionSteps || 'Практические шаги внедрения:'}
          </span>
          <div className="space-y-2.5">
            {actionableDirections.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RECOMMENDED SOCIAL ROLES & MONETIZATION */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6 text-teal-400">
          <Briefcase className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t.integrative?.socialRolesTitle || '7. Рекомендуемые социальные роли и монетизация'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialRoles.map((role, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/70 border border-teal-500/30 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-black uppercase text-teal-300 block mb-1">
                  Роль #{idx + 1}
                </span>
                <h3 className="text-base font-extrabold text-white mb-3">{role?.title}</h3>
                <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong className="text-slate-200">{t.integrative?.roleEssence || 'Суть роли:'}</strong>{' '}
                    {role?.essence}
                  </p>
                  <p>
                    <strong className="text-teal-300">{t.integrative?.whyFits || 'Соответствие:'}</strong>{' '}
                    {role?.whyFits}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 bg-teal-950/40 p-3 rounded-xl">
                <span className="text-[11px] font-bold text-teal-300 block mb-1">
                  💳 {t.integrative?.monetization || 'Способ монетизации:'}
                </span>
                <span className="text-xs text-slate-200 font-medium">{role?.monetization}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. QUICK EXECUTIVE SUMMARY */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-6 text-indigo-400">
          <Target className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t.integrative?.quickSummaryTitle || '8. Краткий итог'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/40">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              {t.integrative?.strongestPotential || 'Сильнейший потенциал:'}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {report?.quickSummary?.strongestPotential || ''}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-rose-500/40">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
              {t.integrative?.bottleneck || 'Что мешает:'}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {report?.quickSummary?.bottleneck || ''}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-cyan-500/40">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              {t.integrative?.growthDirection || 'Рост капитала:'}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {report?.quickSummary?.growthDirection || ''}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
