import React, { useState } from 'react';
import { User, Shield, Lock, Bell, Server, Cpu, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCase } from '../context/CaseContext';

const tabs = [
  { id: 'profile', label: 'Investigator Profile', icon: User },
  { id: 'security', label: 'Security & 2FA', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Bell },
  { id: 'system', label: 'System & API Status', icon: Server }
];

const SettingsPage = () => {
  const { user } = useAuth();
  const { showToast } = useCase();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Inspector Vikram Singh',
    email: user?.email || 'v.singh@cybercrime.gov.in',
    organization: user?.organization || 'State Cyber Crime Directorate',
    department: user?.department || 'Financial Fraud & Digital Forensics Unit',
    role: user?.role || 'Senior Cyber Crime Investigator'
  });

  const [tfaEnabled, setTfaEnabled] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Investigator System Settings</h1>
          <p className="text-xs text-slate-400">Configure profile, security 2FA, notifications, and inspect service status</p>
        </div>
      </div>

      {/* Main Settings Tabs & Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="md:col-span-3 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs text-left transition-all ${
                  activeTab === t.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-cyan-glow'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-9 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <h3 className="text-sm font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
                Investigator Identity & Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 uppercase block mb-1">Full Official Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase block mb-1">Organization</label>
                  <input
                    type="text"
                    value={profileData.organization}
                    onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase block mb-1">Investigator Role</label>
                  <input
                    type="text"
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 text-xs font-mono">
              <h3 className="text-sm font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
                Authentication Security & Active Sessions
              </h3>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">Hardware 2FA / TOTP Security Token</h4>
                  <p className="text-slate-400 text-[11px]">Require YubiKey or authenticator app code for login</p>
                </div>
                <button
                  onClick={() => setTfaEnabled(!tfaEnabled)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs border ${
                    tfaEnabled ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tfaEnabled ? '2FA ENABLED' : 'ENABLE 2FA'}
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 uppercase">Active Authorized Sessions</h4>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="text-slate-200 font-bold">Chrome (Windows 11) • Current Session</p>
                    <p className="text-slate-400 text-[10px]">IP 49.37.192.12 • Delhi Directorate Workstation</p>
                  </div>
                  <span className="text-emerald-400 text-[10px]">ACTIVE NOW</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4 text-xs font-mono">
              <h3 className="text-sm font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
                UI & Notification Preferences
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span>Enable Dark Cybersecurity Theme (Default)</span>
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 text-cyan-500" />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span>High-Risk Fraud Alerts Desktop Popups</span>
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 text-cyan-500" />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span>Automated Evidence OCR Completion Digest</span>
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 text-cyan-500" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
                System Microservices Health Monitor
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">FastAPI REST Backend</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 text-[10px]">
                      ONLINE (12ms)
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Endpoint: /api/v1/evidence & /api/v1/cases</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">CrimeVision AI Inference Engine</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 text-[10px]">
                      OPERATIONAL
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Model: Gemini 3.6 Flash / PyTorch GPU Pipeline</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">OCR & Document Parser Engine</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 text-[10px]">
                      READY
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Engine: Tesseract 5.3 + Multi-Lingual Indian Script Parser</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">PostgreSQL Evidence DB</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 text-[10px]">
                      CONNECTED
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Database: pg_crypto & Vector Embeddings Enabled</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
