import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ShieldAlert, Cpu } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { useNavigate } from 'react-router-dom';

const EvidenceUploader = ({ defaultCaseId }) => {
  const { cases, addEvidence, showToast } = useCase();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedCaseId, setSelectedCaseId] = useState(defaultCaseId || (cases[0]?.id || 'CV-2026-001'));
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const fileList = Array.from(files);
    const newItems = fileList.map((file, idx) => ({
      id: `item_${Date.now()}_${idx}`,
      file,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: getFileTypeFromExt(file.name),
      mimeType: file.type,
      progress: 0,
      status: 'Queued',
      error: null
    }));

    setUploadQueue(prev => [...prev, ...newItems]);
    // Process queue items automatically
    newItems.forEach(item => processUpload(item));
  };

  const getFileTypeFromExt = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'Images';
    if (['eml', 'msg'].includes(ext)) return 'Emails';
    if (['pdf'].includes(ext)) return 'Transactions';
    return 'Chats';
  };

  const processUpload = async (item) => {
    try {
      const result = await addEvidence(
        {
          caseId: selectedCaseId,
          fileName: item.fileName,
          fileType: item.fileType,
          fileSize: item.fileSize,
          mimeType: item.mimeType
        },
        ({ status, percent }) => {
          setUploadQueue(prev =>
            prev.map(q => q.id === item.id ? { ...q, status, progress: percent } : q)
          );
        }
      );
      setUploadQueue(prev =>
        prev.map(q => q.id === item.id ? { ...q, status: 'Completed', resultId: result.id } : q)
      );
    } catch (err) {
      setUploadQueue(prev =>
        prev.map(q => q.id === item.id ? { ...q, status: 'Failed', error: err.message } : q)
      );
    }
  };

  const removeQueueItem = (id) => {
    setUploadQueue(prev => prev.filter(q => q.id !== id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Case Selector */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Target Investigation Case
          </label>
          <p className="text-xs text-slate-400">Select which open investigation this evidence belongs to.</p>
        </div>
        <select
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 font-mono text-xs focus:outline-none focus:border-cyan-500"
        >
          {cases.map(c => (
            <option key={c.id} value={c.id}>
              {c.id} — {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Main Drag-and-Drop Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`glass-panel p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-4 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
            : 'border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.txt,.csv,.json,.eml,.msg"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-cyan-glow">
          <Upload className="w-10 h-10 animate-pulse-subtle" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight">
            Upload Digital Evidence Files
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Drag & drop screenshots, chats, emails, PDFs, transaction receipts, or click to browse
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {['PNG', 'JPG', 'PDF', 'TXT', 'CSV', 'JSON', 'EML'].map(type => (
            <span key={type} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
              .{type}
            </span>
          ))}
          <span className="text-[11px] font-mono text-cyan-400 ml-2">Max file size: 50 MB</span>
        </div>
      </div>

      {/* Upload Queue Section */}
      {uploadQueue.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Evidence Processing Queue ({uploadQueue.length})
            </h4>
          </div>

          <div className="space-y-3">
            {uploadQueue.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 font-mono">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-slate-200">{item.fileName}</span>
                    <span className="text-slate-500">({item.fileSize})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded border ${
                      item.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                        : item.status === 'Failed'
                        ? 'bg-rose-950 text-rose-400 border-rose-500/40'
                        : 'bg-cyan-950 text-cyan-400 border-cyan-500/40 animate-pulse'
                    }`}>
                      {item.status}
                    </span>

                    {item.status === 'Completed' && (
                      <button
                        onClick={() => navigate(`/evidence/${item.resultId}`)}
                        className="text-xs font-mono text-cyan-400 hover:underline"
                      >
                        Inspect Result →
                      </button>
                    )}

                    <button
                      onClick={() => removeQueueItem(item.id)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {item.status !== 'Completed' && item.status !== 'Failed' && (
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceUploader;
