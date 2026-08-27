import React from 'react';
import { FinancialMatrixLayer1Output } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';

interface Layer1MatrixViewProps {
  layer1: FinancialMatrixLayer1Output;
  onTriggerLayer2?: () => void;
  isAnalyzing?: boolean;
}

export const Layer1MatrixView: React.FC<Layer1MatrixViewProps> = ({
  layer1,
}) => {
  const { t } = useI18n();

  const { v1_life_scenario, v2_work_model, v3_emotional_background, v4_resource_management } =
    layer1.vectors;

  const vectorCards = [
    {
      id: 'v1',
      code: 'V1',
      name: t.matrix.v1Name,
      value: v1_life_scenario.value,
      formula: v1_life_scenario.formula,
      desc: t.matrix.v1Desc,
      gradient: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      fillColor: '#06b6d4',
    },
    {
      id: 'v2',
      code: 'V2',
      name: t.matrix.v2Name,
      value: v2_work_model.value,
      formula: v2_work_model.formula,
      desc: t.matrix.v2Desc,
      gradient: 'from-indigo-500/20 to-violet-600/20 border-indigo-500/40 text-indigo-300',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      fillColor: '#6366f1',
    },
    {
      id: 'v3',
      code: 'V3',
      name: t.matrix.v3Name,
      value: v3_emotional_background.value,
      formula: v3_emotional_background.formula,
      desc: t.matrix.v3Desc,
      gradient: 'from-pink-500/20 to-rose-600/20 border-pink-500/40 text-pink-300',
      badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      fillColor: '#ec4899',
    },
    {
      id: 'v4',
      code: 'V4',
      name: t.matrix.v4Name,
      value: v4_resource_management.value,
      formula: v4_resource_management.formula,
      desc: t.matrix.v4Desc,
      gradient: 'from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-300',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      fillColor: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Vector Matrix Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-100">
              {t.matrix.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {t.matrix.subtitle}
            </p>
          </div>
        </div>

        {/* 4 Vector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {vectorCards.map((card) => (
            <div
              key={card.id}
              id={`vector-card-${card.id}`}
              className={`p-5 rounded-2xl bg-gradient-to-b ${card.gradient} border backdrop-blur-sm relative overflow-hidden flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border ${card.badgeBg}`}>
                    {card.code}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl font-black tracking-tight text-white font-mono">
                    {card.value}
                  </span>
                  <span className="text-[11px] font-medium text-slate-300 leading-tight">
                    {card.name}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300/80 mt-3 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Coordinate Systems Breakdown (Subject, Mother, Father) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Subject Coords */}
        <div
          id="coords-subject"
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">{t.matrix.subjectCoords}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {layer1.user.birthDate}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t.matrix.day} ({layer1.user.day}):</span>
              <span className="text-slate-200 font-bold">{layer1.user.dayReduced}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t.matrix.month} ({layer1.user.month}):</span>
              <span className="text-slate-200 font-bold">{layer1.user.monthReduced}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t.matrix.yearSum} ({layer1.user.yearDigitsSum}):</span>
              <span className="text-slate-200 font-bold">{layer1.user.yearReduced}</span>
            </div>
            <div className="flex justify-between py-1 text-cyan-300 font-bold">
              <span>{t.matrix.totalReduced}:</span>
              <span className="text-sm bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                {layer1.user.totalReduced}
              </span>
            </div>
          </div>
        </div>

        {/* Mother Coords */}
        <div
          id="coords-mother"
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">{t.matrix.motherCoords}</span>
            {layer1.mother ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {layer1.mother.birthDate}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">{t.matrix.notProvided}</span>
            )}
          </div>

          {layer1.mother ? (
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t.matrix.day} ({layer1.mother.day}):</span>
                <span className="text-slate-200 font-bold">{layer1.mother.dayReduced}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t.matrix.month} ({layer1.mother.month}):</span>
                <span className="text-slate-200 font-bold">{layer1.mother.monthReduced}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t.matrix.yearSum} ({layer1.mother.yearDigitsSum}):</span>
                <span className="text-slate-200 font-bold">{layer1.mother.yearReduced}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-300 font-bold">
                <span>{t.matrix.totalReduced}:</span>
                <span className="text-sm bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                  {layer1.mother.totalReduced}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-6 text-center italic">
              {t.matrix.notProvidedDesc}
            </p>
          )}
        </div>

        {/* Father Coords */}
        <div
          id="coords-father"
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">{t.matrix.fatherCoords}</span>
            {layer1.father ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {layer1.father.birthDate}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">{t.matrix.notProvided}</span>
            )}
          </div>

          {layer1.father ? (
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t.matrix.day} ({layer1.father.day}):</span>
                <span className="text-slate-200 font-bold">{layer1.father.dayReduced}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t.matrix.month} ({layer1.father.month}):</span>
                <span className="text-slate-200 font-bold">{layer1.father.monthReduced}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t.matrix.yearSum} ({layer1.father.yearDigitsSum}):</span>
                <span className="text-slate-200 font-bold">{layer1.father.yearReduced}</span>
              </div>
              <div className="flex justify-between py-1 text-blue-300 font-bold">
                <span>{t.matrix.totalReduced}:</span>
                <span className="text-sm bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                  {layer1.father.totalReduced}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-6 text-center italic">
              {t.matrix.notProvidedDesc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
