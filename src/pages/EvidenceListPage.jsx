import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, Search, Upload, Filter } from 'lucide-react';
import EvidenceCard from '../components/evidence/EvidenceCard';
import EmptyState from '../components/common/EmptyState';
import { useCase } from '../context/CaseContext';

const fileTypeTabs = ['All', 'Images', 'Chats', 'Emails', 'Transactions'];

const EvidenceListPage = () => {
  const { evidenceList } = useCase();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidence = evidenceList.filter(e => {
    if (activeTab !== 'All' && e.fileType.toLowerCase() !== activeTab.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.fileName.toLowerCase().includes(q) ||
        e.caseId.toLowerCase().includes(q) ||
        e.ocrText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-100">Digital Evidence Directory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Directory of extracted chat screenshots, emails, transaction receipts, and digital artifacts
          </p>
        </div>

        <button
          onClick={() => navigate('/evidence/upload')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-cyan-400 flex-shrink-0 mr-1" />
          {fileTypeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-cyan-glow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filename, case, OCR text..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      {filteredEvidence.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredEvidence.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Digital Evidence Found"
          description="No evidence files match your search filter."
          actionText="Upload Evidence File"
          onAction={() => navigate('/evidence/upload')}
        />
      )}
    </div>
  );
};

export default EvidenceListPage;
