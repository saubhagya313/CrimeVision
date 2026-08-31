import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCheck } from 'lucide-react';
import ReportPreview from '../components/reports/ReportPreview';
import { reportsApi, casesApi, evidenceApi, timelineApi } from '../services/api';

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [targetCase, setTargetCase] = useState(null);
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rep = await reportsApi.getReportById(reportId || 'REP-2026-089');
        setReport(rep);
        if (rep?.caseId) {
          const [c, ev, tl] = await Promise.all([
            casesApi.getCaseById(rep.caseId),
            evidenceApi.getEvidence({ caseId: rep.caseId }),
            timelineApi.getTimeline(rep.caseId)
          ]);
          setTargetCase(c);
          setEvidenceItems(ev);
          setTimelineEvents(tl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reportId]);

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-cyan-400 animate-pulse">
        Formatting Law Enforcement Dossier Document for {reportId}...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <button
        onClick={() => navigate('/reports')}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors print:hidden"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Reports Directory
      </button>

      <ReportPreview
        report={report}
        targetCase={targetCase}
        evidenceItems={evidenceItems}
        timelineEvents={timelineEvents}
      />
    </div>
  );
};

export default ReportDetailPage;
