import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  Users,
  FileText,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  Sliders,
  Database,
  BarChart3,
  Layers,
  Calendar,
  AlertTriangle,
  Clock,
  Eye,
  Settings2,
  Sparkles,
  Gift,
  Zap,
  GitCommit,
  Hash,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../services/api.js';
import {
  LogEntry,
  AdminAuditLog,
  LogCategory,
  DiagnosticModuleMeta,
  FormFieldConfig,
  ContentSectionConfig,
  Account,
  PersonProfile,
  DiagnosticAnalysisRecord,
  ReferralStats,
} from '../types/domain.js';
import { useI18n } from '../i18n/context.js';
import { AutomatedTestRunner } from './AutomatedTestRunner.js';
import { ReferralHub } from './ReferralHub.js';

export const AdminConsole: React.FC = () => {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [modules, setModules] = useState<DiagnosticModuleMeta[]>([]);
  const [fieldConfigs, setFieldConfigs] = useState<FormFieldConfig[]>([]);
  const [contentConfig, setContentConfig] = useState<ContentSectionConfig>({
    invariantNotice: '',
    methodologyDisclaimer: '',
    referralTerms: '',
    supportEmail: '',
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [isSimulatingReferral, setIsSimulatingReferral] = useState(false);
  
  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [accountSearch, setAccountSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'accounts' | 'cms' | 'fields' | 'tests' | 'referrals' | 'logs' | 'audit'>('metrics');
  
  // Feedback
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Selected User for Detail View/Edit
  const [selectedUserDetail, setSelectedUserDetail] = useState<{
    account: Account;
    subscription?: any;
    profiles: PersonProfile[];
    analyses: DiagnosticAnalysisRecord[];
    referrals: any[];
  } | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<string | null>(null);
  const [userEditForm, setUserEditForm] = useState<{
    role: 'USER' | 'ADMIN';
    subscriptionTier: string;
    name: string;
  }>({ role: 'USER', subscriptionTier: 'FREE_TRIAL', name: '' });

  // Selected Module for Edit
  const [editingModule, setEditingModule] = useState<DiagnosticModuleMeta | null>(null);
  const [isNewModule, setIsNewModule] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const [mRes, aRes, modRes, cfgRes, lRes, audRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminAccounts(),
        api.getAdminModules().catch(() => ({ modules: [] })),
        api.getAdminContentConfig().catch(() => ({
          content: {
            invariantNotice: 'Строгий инвариант: все значения сводятся к 1-9. Никакой эзотерики/таро.',
            methodologyDisclaimer: 'Методология объединяет детерминированный матричный расчёт (Уровень 1) и трансгенерационный поведенческий синтез ИИ (Уровень 2).',
            referralTerms: 'Приглашайте коллег и получайте +1 месяц Pro за каждые 5 активных конверсий.',
            supportEmail: 'support@diagnostic.io',
          },
          fields: [],
        })),
        api.getAdminLogs({ category: selectedCategory, level: selectedLevel, search: searchQuery }),
        api.getAdminAuditLogs(),
      ]);

      setMetrics(mRes.metrics);
      setAccounts(aRes.accounts);
      setModules(modRes.modules || []);
      setFieldConfigs(cfgRes.fields || []);
      setContentConfig(cfgRes.content);
      setLogs(lRes.logs);
      setAuditLogs(audRes.auditLogs);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setActionError(err.message || 'Ошибка загрузки данных админ-панели');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedLevel]);

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setActionSuccess(null);
    } else {
      setActionSuccess(msg);
      setActionError(null);
    }
    setTimeout(() => {
      setActionSuccess(null);
      setActionError(null);
    }, 4000);
  };

  // Quick Change User Role (Admin <-> User)
  const handleQuickChangeRole = async (userId: string, userName: string, newRole: 'USER' | 'ADMIN') => {
    try {
      setLoading(true);
      await api.updateAdminUserRole(userId, newRole);
      setAccounts(prev => prev.map(a => a.id === userId ? { ...a, role: newRole } : a));
      showNotification(
        newRole === 'ADMIN'
          ? `Пользователю "${userName}" выданы права ADMIN и доступ к Админ-панели.`
          : `Пользователь "${userName}" переведён в статус USER (доступ в Админ-панель отозван).`
      );
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Ошибка обновления роли', true);
    } finally {
      setLoading(false);
    }
  };

  // Inspect User Details
  const handleInspectUser = async (userId: string) => {
    try {
      setLoading(true);
      const res = await api.getAdminAccountDetails(userId);
      setSelectedUserDetail(res);
      setUserEditForm({
        role: res.account.role as any,
        subscriptionTier: res.subscription?.tier || res.account.subscriptionTier,
        name: res.account.name,
      });
      setIsEditingUser(true);
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Save User Edit
  const handleSaveUserEdit = async () => {
    if (!selectedUserDetail) return;
    try {
      setLoading(true);
      await api.updateAdminAccount(selectedUserDetail.account.id, {
        role: userEditForm.role,
        subscriptionTier: userEditForm.subscriptionTier as any,
        name: userEditForm.name,
      });
      showNotification(`Пользователь ${userEditForm.name} успешно обновлён.`);
      setIsEditingUser(false);
      setSelectedUserDetail(null);
      loadData();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Вы действительно хотите удалить аккаунт ${email}? Все связанные профили и история будут удалены.`)) {
      return;
    }
    try {
      setLoading(true);
      await api.deleteAdminAccount(userId);
      showNotification(`Аккаунт ${email} успешно удалён.`);
      if (selectedUserDetail?.account.id === userId) {
        setIsEditingUser(false);
        setSelectedUserDetail(null);
      }
      loadData();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Save Form Field Config
  const handleUpdateField = async (key: string, updates: Partial<FormFieldConfig>) => {
    try {
      const res = await api.updateAdminField(key, updates);
      setFieldConfigs(prev => prev.map(f => f.key === key ? res.field : f));
      showNotification(`Поле "${res.field.label}" обновлено.`);
    } catch (err: any) {
      showNotification(err.message, true);
    }
  };

  // Save Content Config
  const handleSaveContentConfig = async () => {
    try {
      setLoading(true);
      const res = await api.updateAdminContentConfig(contentConfig);
      setContentConfig(res.content);
      showNotification('Текстовый контент и настройки успешно сохранены.');
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Save Module
  const handleSaveModule = async () => {
    if (!editingModule) return;
    try {
      setLoading(true);
      if (isNewModule) {
        await api.createAdminModule(editingModule);
        showNotification(`Модуль "${editingModule.title}" успешно создан.`);
      } else {
        await api.updateAdminModule(editingModule.id, editingModule);
        showNotification(`Модуль "${editingModule.title}" успешно обновлён.`);
      }
      setEditingModule(null);
      setIsNewModule(false);
      loadData();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const categories: LogCategory[] = [
    'Application',
    'Error',
    'AI',
    'Diagnostic',
    'Subscription',
    'Referral',
    'AdminAudit',
    'Security',
  ];

  const filteredAccounts = accounts.filter(acc => {
    if (!accountSearch) return true;
    const q = accountSearch.toLowerCase();
    return (
      acc.name?.toLowerCase().includes(q) ||
      acc.email?.toLowerCase().includes(q) ||
      acc.role?.toLowerCase().includes(q) ||
      acc.subscriptionTier?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.admin.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono font-semibold">{t.admin.roleBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-2">
            {t.admin.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {t.admin.subtitle}
          </p>
        </div>

        <button
          id="admin-refresh-data-btn"
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{t.admin.btnRefresh}</span>
        </button>
      </div>

      {/* Global Notifications */}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto shadow-inner">
        <button
          id="admin-subtab-metrics"
          onClick={() => setActiveSubTab('metrics')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'metrics' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t.admin.tabMetrics}</span>
        </button>

        <button
          id="admin-subtab-accounts"
          onClick={() => setActiveSubTab('accounts')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'accounts' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.admin.tabAccounts} ({accounts.length})</span>
        </button>

        <button
          id="admin-subtab-cms"
          onClick={() => setActiveSubTab('cms')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'cms' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.admin.tabContentCMS}</span>
        </button>

        <button
          id="admin-subtab-fields"
          onClick={() => setActiveSubTab('fields')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'fields' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t.admin.tabFieldSettings}</span>
        </button>

        <button
          id="admin-subtab-tests"
          onClick={() => setActiveSubTab('tests')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'tests' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.admin.tabTests || 'Тесты инвариантов'}</span>
        </button>

        <button
          id="admin-subtab-referrals"
          onClick={() => setActiveSubTab('referrals')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'referrals' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-pink-400" />
          <span>{t.admin.tabReferrals || 'Рефералы и партнёры'}</span>
        </button>

        <button
          id="admin-subtab-logs"
          onClick={() => setActiveSubTab('logs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'logs' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t.admin.tabLogs} ({logs.length})</span>
        </button>

        <button
          id="admin-subtab-audit"
          onClick={() => setActiveSubTab('audit')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'audit' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t.admin.tabAudit} ({auditLogs.length})</span>
        </button>
      </div>

      {/* 1. METRICS & STATISTICS TAB */}
      {activeSubTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">{t.admin.totalAccounts}</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100">
                {metrics?.totalAccounts ?? accounts.length}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">● Активны в базе</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">{t.admin.totalAnalyses}</span>
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100">
                {metrics?.totalAnalyses ?? 0}
              </div>
              <span className="text-[10px] text-cyan-400 font-semibold mt-1 inline-block">● L1/L2 Синтезы</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">{t.admin.memoryUsage}</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100">
                {metrics?.memoryUsageMB ?? 42} MB
              </div>
              <span className="text-[10px] text-purple-400 font-semibold mt-1 inline-block">Heap Allocation</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">{t.admin.uptime}</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100">
                {metrics?.systemUptimeSeconds ? `${Math.floor(metrics.systemUptimeSeconds / 60)} мин` : '100%'}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">● Сервер в норме</span>
            </div>
          </div>

          {/* Breakdown Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Распределение тарифов пользователей</span>
              </h3>
              <div className="space-y-3">
                {['FREE_TRIAL', 'PRO_MONTHLY', 'ENTERPRISE'].map(tier => {
                  const count = accounts.filter(a => a.subscriptionTier === tier).length;
                  const pct = accounts.length ? Math.round((count / accounts.length) * 100) : 0;
                  return (
                    <div key={tier}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">{tier}</span>
                        <span className="text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all ${
                            tier === 'ENTERPRISE' ? 'bg-rose-500' : tier === 'PRO_MONTHLY' ? 'bg-indigo-500' : 'bg-slate-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Статус модулей платформы</span>
              </h3>
              <div className="space-y-2.5">
                {modules.map(m => (
                  <div key={m.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{m.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">v{m.version}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      m.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USER & DATA MANAGEMENT TAB */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-account-search-input"
                type="text"
                value={accountSearch}
                onChange={e => setAccountSearch(e.target.value)}
                placeholder="Поиск по имени, email или роли..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              Показано пользователей: {filteredAccounts.length} из {accounts.length}
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Пользователь</th>
                    <th className="p-4">Роль</th>
                    <th className="p-4">Тариф</th>
                    <th className="p-4">Профили</th>
                    <th className="p-4">Анализы</th>
                    <th className="p-4">Дата регистрации</th>
                    <th className="p-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAccounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-100">{acc.name}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{acc.email}</div>
                      </td>
                      <td className="p-4">
                        <select
                          id={`user-role-select-${acc.id}`}
                          value={acc.role}
                          onChange={(e) => handleQuickChangeRole(acc.id, acc.name || acc.email, e.target.value as 'USER' | 'ADMIN')}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer outline-none ${
                            acc.role === 'ADMIN'
                              ? 'bg-rose-950/70 text-rose-300 border-rose-600/50 hover:border-rose-400'
                              : 'bg-indigo-950/70 text-indigo-300 border-indigo-600/50 hover:border-indigo-400'
                          }`}
                        >
                          <option value="USER" className="bg-slate-900 text-slate-200">USER (Пользователь)</option>
                          <option value="ADMIN" className="bg-slate-900 text-rose-300 font-bold">ADMIN (Администратор)</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-300">{acc.subscriptionTier}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-300">{acc.profileCount ?? 1}</td>
                      <td className="p-4 font-semibold text-slate-300">{acc.analysisCount ?? 0}</td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {new Date(acc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleInspectUser(acc.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>Детали / Правка</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(acc.id, acc.email)}
                          className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-[11px] font-semibold cursor-pointer inline-flex items-center"
                          title="Удалить аккаунт"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Details & Edit Modal */}
          {isEditingUser && selectedUserDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-100">
                      Управление пользователем: {selectedUserDetail.account.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedUserDetail.account.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingUser(false);
                      setSelectedUserDetail(null);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Имя пользователя</label>
                    <input
                      type="text"
                      value={userEditForm.name}
                      onChange={e => setUserEditForm({ ...userEditForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Роль доступа (RBAC)</label>
                    <select
                      value={userEditForm.role}
                      onChange={e => setUserEditForm({ ...userEditForm, role: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option value="USER">USER (Стандартный пользователь)</option>
                      <option value="ADMIN">ADMIN (Администратор системы)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Тарифный план</label>
                    <select
                      value={userEditForm.subscriptionTier}
                      onChange={e => setUserEditForm({ ...userEditForm, subscriptionTier: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option value="FREE_TRIAL">FREE_TRIAL (Пробный 14 дней)</option>
                      <option value="PRO_MONTHLY">PRO_MONTHLY (Профессиональный)</option>
                      <option value="ENTERPRISE">ENTERPRISE (Корпоративный / Полный доступ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Реферальный код</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedUserDetail.account.referralCode}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono"
                    />
                  </div>
                </div>

                {/* Profiles & History Overview */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Созданные профили ({selectedUserDetail.profiles.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {selectedUserDetail.profiles.map(p => (
                      <div key={p.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                        <span className="font-bold text-slate-200">{p.firstName} {p.lastName}</span>
                        <span className="text-slate-400 block text-[11px]">ДР: {p.birthDate} ({p.relationType})</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pt-2">
                    История анализов ({selectedUserDetail.analyses.length}):
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {selectedUserDetail.analyses.map(a => {
                      const isExp = expandedAnalysisId === a.id;
                      const l1 = a.layer1;
                      return (
                        <div key={a.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-slate-200 font-bold">{a.profileName}</span>
                              <span className="text-slate-400 text-[11px] font-mono ml-2">
                                {new Date(a.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {l1 && (
                              <button
                                type="button"
                                onClick={() => setExpandedAnalysisId(isExp ? null : a.id)}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                              >
                                <Hash className="w-3 h-3 text-cyan-400" />
                                <span>Инварианты</span>
                                {isExp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            )}
                          </div>

                          {isExp && l1 && (
                            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2 animate-in fade-in">
                              <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-slate-800 pb-1">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Проверка инварианта: V1={l1.vectors.v1_life_scenario.value}, V2={l1.vectors.v2_work_model.value}, V3={l1.vectors.v3_emotional_background.value}, V4={l1.vectors.v4_resource_management.value}
                                </span>
                              </div>
                              <p className="text-slate-400 text-[10px] flex items-center gap-1">
                                <GitCommit className="w-3 h-3 text-cyan-400" />
                                Субъект: {l1.user.stepTrace.join(' → ')}
                              </p>
                              {l1.mother && (
                                <p className="text-slate-400 text-[10px] flex items-center gap-1">
                                  <GitCommit className="w-3 h-3 text-rose-400" />
                                  Мать: {l1.mother.stepTrace.join(' → ')}
                                </p>
                              )}
                              {l1.father && (
                                <p className="text-slate-400 text-[10px] flex items-center gap-1">
                                  <GitCommit className="w-3 h-3 text-blue-400" />
                                  Отец: {l1.father.stepTrace.join(' → ')}
                                </p>
                              )}
                              <div className="pt-1 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                                <span>Хэш: {l1.mathematicalIntegrity.reproducibilityHash.substring(0, 16)}...</span>
                                <span className="text-emerald-400">Zero-Exclusion OK</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {selectedUserDetail.analyses.length === 0 && (
                      <p className="text-xs text-slate-500 italic">Нет сохраненных анализов.</p>
                    )}
                  </div>
                </div>

                {/* Save / Cancel buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingUser(false);
                      setSelectedUserDetail(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveUserEdit}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Сохранить изменения</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CONTENT & MODULE CMS TAB */}
      {activeSubTab === 'cms' && (
        <div className="space-y-6">
          {/* Modules CMS Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>{t.admin.manageModules}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Управление статусом, описанием, версиями и теоретическими фреймворками модулей.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingModule({
                    id: 'new_module_' + Date.now().toString(36),
                    title: 'Новый диагностический модуль',
                    status: 'PLANNED',
                    version: '0.1.0',
                    description: '',
                    theoreticalFrameworks: [],
                  });
                  setIsNewModule(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.admin.addModule}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {modules.map(mod => (
                <div key={mod.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{mod.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 rounded text-slate-300">v{mod.version}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        mod.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {mod.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{mod.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mod.theoreticalFrameworks.map((tf, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {tf}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingModule({ ...mod });
                      setIsNewModule(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start md:self-center"
                  >
                    <Edit className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.admin.editModule}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Module Edit Modal */}
          {editingModule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
                <h3 className="text-base font-black text-slate-100">
                  {isNewModule ? t.admin.addModule : t.admin.editModule}
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Название модуля</label>
                  <input
                    type="text"
                    value={editingModule.title}
                    onChange={e => setEditingModule({ ...editingModule, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Статус</label>
                    <select
                      value={editingModule.status}
                      onChange={e => setEditingModule({ ...editingModule, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option value="ACTIVE">ACTIVE (Активен)</option>
                      <option value="PLANNED">PLANNED (Запланирован)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Версия</label>
                    <input
                      type="text"
                      value={editingModule.version}
                      onChange={e => setEditingModule({ ...editingModule, version: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Описание</label>
                  <textarea
                    rows={3}
                    value={editingModule.description}
                    onChange={e => setEditingModule({ ...editingModule, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingModule(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModule}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Сохранить модуль</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* System Text Content & Disclaimer CMS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings2 className="w-4 h-4 text-indigo-400" />
              <span>{t.admin.manageContent}</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Уведомление о математическом инварианте (Баннер формы)
                </label>
                <textarea
                  rows={2}
                  value={contentConfig.invariantNotice}
                  onChange={e => setContentConfig({ ...contentConfig, invariantNotice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Методологический дисклеймер и описание синтеза
                </label>
                <textarea
                  rows={2}
                  value={contentConfig.methodologyDisclaimer}
                  onChange={e => setContentConfig({ ...contentConfig, methodologyDisclaimer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Условия и вознаграждения реферальной программы
                </label>
                <textarea
                  rows={2}
                  value={contentConfig.referralTerms}
                  onChange={e => setContentConfig({ ...contentConfig, referralTerms: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveContentConfig}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить текстовый контент</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FORM FIELD CONFIGURATION TAB */}
      {activeSubTab === 'fields' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>{t.admin.manageFields}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Настройка обязательности, видимости, названий и подсказок для полей формы ввода данных матрицы.
            </p>
          </div>

          <div className="space-y-4">
            {fieldConfigs.map(field => (
              <div key={field.key} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                  <div className="font-mono text-xs font-bold text-indigo-400">
                    Ключ поля: <span className="text-slate-200">{field.key}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.enabled}
                        onChange={e => handleUpdateField(field.key, { enabled: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                      />
                      <span>{t.admin.fieldEnabled}</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => handleUpdateField(field.key, { required: e.target.checked })}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700"
                      />
                      <span>{t.admin.fieldRequired}</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t.admin.fieldLabel}</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={e => {
                        const val = e.target.value;
                        setFieldConfigs(prev => prev.map(f => f.key === field.key ? { ...f, label: val } : f));
                      }}
                      onBlur={e => handleUpdateField(field.key, { label: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t.admin.fieldDescription}</label>
                    <input
                      type="text"
                      value={field.description || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setFieldConfigs(prev => prev.map(f => f.key === field.key ? { ...f, description: val } : f));
                      }}
                      onBlur={e => handleUpdateField(field.key, { description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t.admin.fieldPlaceholder}</label>
                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setFieldConfigs(prev => prev.map(f => f.key === field.key ? { ...f, placeholder: val } : f));
                      }}
                      onBlur={e => handleUpdateField(field.key, { placeholder: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INVARIANT TEST SUITE (ADMIN ONLY) */}
      {activeSubTab === 'tests' && (
        <div className="space-y-4">
          <AutomatedTestRunner />
        </div>
      )}

      {/* 6. REFERRALS & PARTNERS NETWORK (ADMIN ONLY) */}
      {activeSubTab === 'referrals' && (
        <div className="space-y-4">
          <ReferralHub
            stats={referralStats}
            onSimulateConversion={async () => {
              try {
                setIsSimulatingReferral(true);
                await api.simulateReferralConversion();
                const res = await api.getReferralStats();
                setReferralStats(res.stats);
                showNotification('Тестовая реферальная конверсия успешно эмулирована');
              } catch (err: any) {
                showNotification(err.message, true);
              } finally {
                setIsSimulatingReferral(false);
              }
            }}
            isSimulating={isSimulatingReferral}
          />
        </div>
      )}

      {/* 7. SYSTEM LOGS TAB */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.admin.searchPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 w-full sm:w-auto"
            >
              <option value="">{t.admin.allCategories}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 w-full sm:w-auto"
            >
              <option value="">{t.admin.allLevels}</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
              <option value="DEBUG">DEBUG</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl font-mono text-[11px] max-h-[500px] overflow-y-auto space-y-2">
            {logs.map(log => (
              <div key={log.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      log.level === 'ERROR' ? 'bg-rose-500/20 text-rose-300' : log.level === 'WARN' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-slate-400 font-semibold">{log.category}</span>
                    <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs">{log.message}</p>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">{t.admin.noLogs}</p>
            )}
          </div>
        </div>
      )}

      {/* 6. AUDIT TRAIL TAB */}
      {activeSubTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>{t.admin.auditTitle}</span>
          </h3>

          <div className="space-y-2.5">
            {auditLogs.map(audit => (
              <div key={audit.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400">{audit.action}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{new Date(audit.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Администратор: <span className="font-semibold text-slate-100">{audit.adminEmail}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Цель: <span className="font-mono text-indigo-300">{audit.targetEntity}:{audit.targetId || 'N/A'}</span>
                </div>
                {audit.details && typeof audit.details === 'object' && Object.keys(audit.details || {}).length > 0 && (
                  <pre className="mt-2 p-2 rounded-xl bg-slate-900 text-[10px] text-slate-400 overflow-x-auto">
                    {JSON.stringify(audit.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
