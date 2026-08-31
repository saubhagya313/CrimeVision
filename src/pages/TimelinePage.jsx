import React, { useState, useEffect } from 'react';
import { Clock, Filter, Folder } from 'lucide-react';
import Timeline from '../components/timeline/Timeline';
import { timelineApi } from '../services/api';
import { useCase } from '../context/CaseContext';

const TimelinePage = () => {
  const { cases } = useCase();
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'CV-2026-001');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const ev = await timelineApi.getTimeline(selectedCaseId);
        setEvents(ev);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [selectedCaseId]);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-100">Investigation Timeline Reconstruction</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Reconstruct the chronological sequence of events from WhatsApp chats, bank advice PDFs, and emails
          </p>
        </div>

        {/* Case Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400">Case:</label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-cyan-500"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Render Container */}
      {loading ? (
        <div className="p-12 text-center font-mono text-cyan-400 animate-pulse">
          Reconstructing incident timestamps & entity relationships...
        </div>
      ) : (
        <Timeline events={events} />
      )}
    </div>
  );
};

export default TimelinePage;
