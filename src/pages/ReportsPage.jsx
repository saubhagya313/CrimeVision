import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, Plus } from 'lucide-react';
import ReportCard from '../components/reports/ReportCard';
import EmptyState from '../components/common/EmptyState';
import { reportsApi } from '../services/api';

const ReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const r = await reportsApi.getReports();
        setReports(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-100">Forensic Investigation Reports</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, review, and export official law enforcement crime dossier documents
          </p>
        </div>

        <button
          onClick={() => navigate('/reports/new')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Generate New Report</span>
        </button>
      </div>

      {/* Reports Grid */}
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((rep) => (
            <ReportCard key={rep.id} report={rep} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Reports Generated Yet"
          description="No official investigation report dossiers have been compiled for active cases."
          actionText="Generate Your First Report"
          onAction={() => navigate('/reports/new')}
        />
      )}
    </div>
  );
};

export default ReportsPage;
