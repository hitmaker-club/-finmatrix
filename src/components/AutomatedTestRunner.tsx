import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Play,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { api } from '../services/api.js';
import { TestSuiteResult } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';

export const AutomatedTestRunner: React.FC = () => {
  const { t } = useI18n();
  const [testResult, setTestResult] = useState<TestSuiteResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAllTests = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await api.runTests();
      setTestResult(res.suite);
    } catch (err: any) {
      setError(err.message || 'Failed to execute test suite');
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              {t.tests.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Validation</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-2">
            {t.tests.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t.tests.subtitle}
          </p>
        </div>

        <button
          id="btn-run-tests"
          onClick={runAllTests}
          disabled={running}
          className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
        >
          <Play className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          <span>{running ? t.tests.btnRunLoading : t.tests.btnRun}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Summary Scorecard */}
      {testResult && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">{t.tests.suiteStatus}</span>
              <div className="text-xl font-extrabold mt-1 flex items-center gap-2">
                {(testResult.summary?.failed ?? 0) === 0 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400">{t.tests.passing}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span className="text-rose-400">{testResult.summary?.failed ?? 0} {t.tests.failed}</span>
                  </>
                )}
              </div>
            </div>
            <ShieldCheck className="w-8 h-8 text-slate-700" />
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">{t.tests.totalChecks}</span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {testResult.summary?.passed ?? 0} / {testResult.summary?.total ?? (testResult.tests?.length || 0)}
              </div>
            </div>
            <Zap className="w-8 h-8 text-cyan-500/20" />
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">{t.tests.duration}</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {testResult.summary?.durationMs ?? 0} ms
              </div>
            </div>
            <Clock className="w-8 h-8 text-slate-700" />
          </div>
        </div>
      )}

      {/* Test List */}
      {testResult && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">{t.tests.resultsLog}</h3>
            <span className="text-xs font-mono text-slate-500">
              {t.tests.timestamp}: {testResult.timestamp ? new Date(testResult.timestamp).toLocaleTimeString() : 'N/A'}
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {(testResult.tests || []).map((testItem, idx) => (
              <div
                key={idx}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {testItem.status === 'PASSED' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-mono text-xs font-bold text-slate-100">{testItem.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{testItem.message}</p>
                    {testItem.details && (
                      <div className="mt-2 text-[11px] font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                        {JSON.stringify(testItem.details)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-slate-500 self-end sm:self-center">
                  <span>{testItem.durationMs}ms</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      testItem.status === 'PASSED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {testItem.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
