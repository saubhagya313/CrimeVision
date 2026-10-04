import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Upload,
  FileImage,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Phone,
  CreditCard,
  Globe,
  DollarSign,
  Building,
  Calendar,
  Key,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Plus,
  Trash2,
  Clock,
  Info,
  ThumbsUp,
  ThumbsDown,
  Eye,
  X,
  FileSearch,
} from 'lucide-react';
import { analysisApi } from '../services/api';
import AnalysisReportModal from '../components/common/AnalysisReportModal';
import {
  processLocalOCR,
  validateEvidenceFile,
  calculateFileHash,
  inspectImageQuality,
} from '../services/ocrService';

const SAMPLE_TEMPLATES = {
  upi: `WhatsApp Chat with +91 99000 11223:
[10 Sep, 10:30 AM] +91 99000 11223: Congratulations! You won ₹25,000 Diwali cashback from GPay reward portal.
[10 Sep, 10:32 AM] +91 99000 11223: Scan this QR code and enter your UPI PIN to receive money directly into your SBI bank account.
[10 Sep, 10:35 AM] +91 99000 11223: Payment request sent to cyber-mule@okaxis.
[10 Sep, 10:36 AM] Bank Alert: Rs 25,000 debited from A/C XX4921 via UPI Ref UTR 429184719284.`,
  kyc: `Dear Customer, Your BSES Electricity power supply will be disconnected tonight at 9:30 PM because previous month bill was not updated. Please immediately update and pay Rs 4,500 by calling our officer at +91 91238 47291 or visit http://bses-bill-quickpay.cc to avoid disconnect.`,
  job: `Dear Candidate, Your resume has been shortlisted for Online Part-time Assistant on Telegram. Earn Rs 3,000 - Rs 8,000 daily by liking YouTube videos. Contact HR manager on WhatsApp at +91 98112 34567 or join https://t.me/earn-daily-bonus-india.`,
  investment: `VIP Crypto Arbitrage Group: Guaranteed 200% ROI in 48 hours! Deposit min 500 USDT to wallet 0x71C8366420A800c1d28362D8a92440b8A4f8F6eB. Limited slots available. Join now.`,
  bank_clean: `Dear SBI Customer, your account XX4921 has been credited with INR 5,000.00 on 04-Oct-2026 via NEFT from ABC Corp. Available balance is INR 42,500.00. For queries call 1800112211.`,
  delivery_clean: `Your Amazon package with tracking ID AMZN918234812 will be delivered today by 4:00 PM. Please keep exact cash ready or pay via Amazon Pay. No OTP needed.`,
};

const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Tab state: 'image' | 'pdf' | 'text'
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'image');

  // Input & File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [imageQuality, setImageQuality] = useState(null);
  const [rawText, setRawText] = useState('');
  const [ocrProgress, setOcrProgress] = useState(null);
  const [ocrEngineUsed, setOcrEngineUsed] = useState('');

  // Duplicate Banner State
  const [duplicateBanner, setDuplicateBanner] = useState(null);

  // Execution & Output State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedValue, setCopiedValue] = useState(null);

  // User Feedback State
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackFeedbackType, setFeedbackType] = useState(null); // 'correct' | 'incorrect'
  const [incorrectCorrection, setIncorrectCorrection] = useState('Legitimate');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Evidence Source Preview Modal
  const [evidencePreviewModal, setEvidencePreviewModal] = useState(null);

  // Technical Analysis Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);

  // Editable Timeline state
  const [editableTimeline, setEditableTimeline] = useState([]);
  const [newTimelineDate, setNewTimelineDate] = useState('');
  const [newTimelineEvent, setNewTimelineEvent] = useState('');

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setDuplicateBanner(null);
  };

  // Handle File Selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. File Validation
    const validation = validateEvidenceFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error);
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    setErrorMessage('');
    setDuplicateBanner(null);
    setSelectedFile(file);

    // 2. Calculate SHA-256 Hash
    const hash = await calculateFileHash(file);
    setFileHash(hash);

    // 3. Evidence Quality Inspection (blur / resolution check)
    const quality = await inspectImageQuality(file);
    setImageQuality(quality);

    // 4. Setup preview for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Trigger Local OCR
      setOcrProgress({ status: 'Inspecting evidence quality & starting OCR...', progress: 15 });
      try {
        const ocrResult = await processLocalOCR(file, (p) => setOcrProgress(p));
        if (ocrResult.success && ocrResult.text) {
          setRawText(ocrResult.text);
          setOcrEngineUsed(ocrResult.engine || 'Local Tesseract.js OCR Engine');
        } else {
          setOcrEngineUsed('Ready for manual verification');
        }
      } catch (err) {
        console.warn('OCR error:', err);
      } finally {
        setTimeout(() => setOcrProgress(null), 800);
      }
    } else if (file.type === 'application/pdf') {
      setPreviewUrl('');
      setOcrProgress({ status: 'Parsing PDF document textual structure...', progress: 50 });
      setTimeout(() => {
        setOcrProgress(null);
        setOcrEngineUsed('PDF Document Parser');
      }, 600);
    }
  };

  // Run AI Analysis
  const handleRunAnalysis = async (forceReScan = false) => {
    const textToScan = rawText.trim();
    if (!textToScan) {
      setErrorMessage('Please provide text or upload an evidence file with readable text content.');
      return;
    }

    setAnalyzing(true);
    setErrorMessage('');
    setDuplicateBanner(null);
    setFeedbackSubmitted(false);
    setFeedbackType(null);

    let sourceType = 'Suspicious Text';
    if (activeTab === 'image') sourceType = 'Screenshot / Image';
    else if (activeTab === 'pdf') sourceType = 'PDF Document';

    try {
      const response = await analysisApi.scanEvidence({
        text: textToScan,
        sourceType,
        fileName: selectedFile?.name || '',
        fileHash,
        imageQuality,
        forceReScan,
      });

      if (response.isDuplicate) {
        setDuplicateBanner(response.data);
        setAnalysisResult(response.data);
        setEditableTimeline(response.data.timeline || []);
      } else {
        const result = response.data;
        setAnalysisResult(result);
        setEditableTimeline(result.timeline || []);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete threat analysis. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Timeline item add/remove
  const handleAddTimelineItem = () => {
    if (!newTimelineEvent.trim()) return;
    const newItem = {
      date: newTimelineDate.trim() || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      time: 'Manual Entry',
      event: newTimelineEvent.trim(),
      source: selectedFile?.name || 'User Evidence Document',
    };
    setEditableTimeline([...editableTimeline, newItem]);
    setNewTimelineDate('');
    setNewTimelineEvent('');
  };

  const handleRemoveTimelineItem = (idx) => {
    setEditableTimeline(editableTimeline.filter((_, i) => i !== idx));
  };

  // Submit Feedback
  const handleFeedbackSubmit = async () => {
    if (!analysisResult) return;
    setSubmittingFeedback(true);
    try {
      const isCorrect = feedbackFeedbackType === 'correct';
      await analysisApi.submitFeedback(analysisResult.analysisId || analysisResult._id, {
        isCorrect,
        userLabeledCategory: isCorrect ? analysisResult.predictedCategory : incorrectCorrection,
        comment: feedbackComment,
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      alert(`Feedback submission failed: ${err.message}`);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Copy helper
  const handleCopy = (val) => {
    navigator.clipboard.writeText(val);
    setCopiedValue(val);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  // Load sample template into text box
  const loadTemplate = (key) => {
    setRawText(SAMPLE_TEMPLATES[key]);
    setErrorMessage('');
    setAnalysisResult(null);
    setDuplicateBanner(null);
    setFileHash('');
    setImageQuality(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quality Check • SHA-256 Hashing • Local OCR • NLP Entity Extraction • ML Classification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Digital Evidence Analysis Hub
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Upload screenshots, PDFs, or paste suspicious chats to identify cyber fraud, extract suspect coordinates, and build an investigation timeline.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="p-5 sm:p-7 rounded-2xl glass-panel border border-slate-800 space-y-6">
        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 pb-4 gap-2">
          <button
            onClick={() => handleTabChange('image')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileImage className="w-4 h-4" />
            <span>Screenshot / Image</span>
          </button>

          <button
            onClick={() => handleTabChange('pdf')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pdf'
                ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PDF Document</span>
          </button>

          <button
            onClick={() => handleTabChange('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Suspicious Text / Chat</span>
          </button>
        </div>

        {/* Upload Zone for Image & PDF */}
        {(activeTab === 'image' || activeTab === 'pdf') && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-cyan-500/70 rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-cyan-950/10 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={activeTab === 'image' ? 'image/png,image/jpeg,image/jpg,image/webp' : 'application/pdf'}
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <p className="text-sm font-bold text-slate-200">
                {selectedFile ? selectedFile.name : `Click or drag ${activeTab === 'image' ? 'screenshot / image (PNG, JPG)' : 'PDF document'} here`}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supported formats: PNG, JPG, JPEG, PDF (Maximum file size: 15 MB)
              </p>
            </div>

            {/* Quality Warning Alert */}
            {imageQuality?.qualityWarning && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-400">Evidence Quality Warning ({imageQuality.resolution}):</p>
                  <p className="text-slate-300 mt-0.5">{imageQuality.qualityWarning}</p>
                </div>
              </div>
            )}

            {/* OCR Progress Bar */}
            {ocrProgress && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {ocrProgress.status}
                  </span>
                  <span className="font-mono text-slate-400 font-bold">{ocrProgress.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${ocrProgress.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Image Preview & SHA-256 Hash */}
            {previewUrl && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={previewUrl}
                    alt="Evidence Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-700 cursor-pointer"
                    onClick={() => setEvidencePreviewModal({ url: previewUrl, title: selectedFile?.name })}
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-200">{selectedFile?.name}</p>
                    <p className="text-slate-400 font-mono text-[11px]">
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {imageQuality?.resolution || 'Image'}
                    </p>
                    {fileHash && (
                      <p className="text-[10px] font-mono text-slate-400 truncate max-w-sm">
                        SHA-256: {fileHash.slice(0, 16)}...{fileHash.slice(-8)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEvidencePreviewModal({ url: previewUrl, title: selectedFile?.name })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enlarge</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text Area (OCR Extracted Text Review & Editable Box) */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <span>
                {activeTab === 'image'
                  ? 'OCR-Extracted Text (Verify & Edit Before AI Scan)'
                  : activeTab === 'pdf'
                  ? 'Document Text Content'
                  : 'Suspicious Chat / Text Message / Email Body'}
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 hidden sm:inline">Try preset sample:</span>
              <button
                type="button"
                onClick={() => loadTemplate('upi')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700"
              >
                UPI QR Scam
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('kyc')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700"
              >
                KYC Phishing
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('job')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700"
              >
                Job Scam
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('investment')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700"
              >
                Crypto Ponzi
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('bank_clean')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700"
              >
                Clean Bank
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('delivery_clean')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700"
              >
                Clean Delivery
              </button>
            </div>
          </div>

          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste suspicious text, WhatsApp chats, transaction details, or review text extracted from uploaded evidence. You can edit any missed words before running analysis..."
            className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors resize-y leading-relaxed"
          />
        </div>

        {/* Duplicate Evidence Alert Banner */}
        {duplicateBanner && (
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Duplicate Evidence Detected (SHA-256 Match)</span>
              </div>
              <span className="font-mono text-cyan-400 text-[11px] font-bold">
                Ref: {duplicateBanner.analysisId}
              </span>
            </div>
            <p className="text-slate-300">
              This exact file was already analyzed on{' '}
              {new Date(duplicateBanner.createdAt).toLocaleDateString('en-GB')}. Showing previous analysis below.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRunAnalysis(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              >
                Force Re-Scan Anyway
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => handleRunAnalysis(false)}
            disabled={analyzing || !rawText.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running AI Threat Scan...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run AI Threat Classification</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ANALYSIS RESULT SECTION */}
      {/* ========================================================================= */}
      {analysisResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* HIGH RISK VS LOW RISK RESULT BANNER */}
          {analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical' ? (
            /* ⚠️ HIGH-RISK RESULT */
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border-2 border-rose-500/50 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                        ⚠️ Potential Cyber Fraud Detected
                      </span>
                      <span className="text-[11px] font-mono font-bold text-cyan-400">
                        Ref: {analysisResult.analysisId}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
                      {analysisResult.predictedCategory}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Risk Rating</p>
                    <p className="text-lg font-black font-mono text-rose-400">
                      {analysisResult.riskLevel.toUpperCase()} ({analysisResult.riskScore}/100)
                    </p>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-left">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Confidence</p>
                    <p className="text-lg font-black font-mono text-cyan-400">
                      {analysisResult.confidence}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Immediate Safety Guidance */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Immediate Safety Guidance</span>
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Do NOT send additional money</strong> or enter your UPI PIN on payment prompts.</li>
                  <li><strong>Do NOT share OTPs</strong>, passwords, or bank credentials with callers.</li>
                  <li><strong>Do NOT click suspicious links</strong> or download external APK files.</li>
                  <li>Preserve all chat screenshots, bank SMS alerts, and transaction UTR numbers.</li>
                  <li>Call national cybercrime helpline <strong>1930</strong> immediately or report on <strong>cybercrime.gov.in</strong>.</li>
                </ul>
              </div>

              {/* AI Disclaimer */}
              <div className="text-[11px] text-slate-400 flex items-start gap-1.5 font-mono">
                <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  CrimeVision AI Assessment: This is an automated machine learning threat assessment and does not constitute legal proof that a crime occurred.
                </span>
              </div>
            </div>
          ) : (
            /* 🟢 LOW-RISK RESULT (NEVER SAYS 100% SAFE) */
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                        🟢 No Significant Suspicious Indicators Detected
                      </span>
                      <span className="text-[11px] font-mono font-bold text-cyan-400">
                        Ref: {analysisResult.analysisId}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 mt-1">
                      {analysisResult.predictedCategory}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Risk Level</p>
                    <p className="text-lg font-black font-mono text-emerald-400">LOW ({analysisResult.riskScore}%)</p>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-left">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Confidence</p>
                    <p className="text-lg font-black font-mono text-cyan-400">{analysisResult.confidence}%</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-1.5 text-xs text-slate-300">
                <p>
                  The current analysis did not identify significant indicators associated with the fraud patterns supported by CrimeVision.
                </p>
                <p className="text-slate-400">
                  General safety recommendations: Always verify official bank domains and never enter your UPI PIN to receive money.
                </p>
              </div>

              <div className="text-[11px] text-slate-400 flex items-start gap-1.5 font-mono">
                <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  Disclaimer: This analysis evaluates patterns against known threat signatures. Always exercise personal vigilance.
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DETECTED INFORMATION (NLP ENTITY EXTRACTION) */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>Detected Information</span>
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {analysisResult.entities?.length || 0} entities
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Extracted forensic coordinates (Never invented)
                </p>
              </div>
            </div>

            {!analysisResult.entities || analysisResult.entities.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific entity handles (phone numbers, UPI IDs, or URLs) detected in this text.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysisResult.entities.map((ent, idx) => {
                  let Icon = Key;
                  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

                  if (ent.type === 'Phone') {
                    Icon = Phone;
                    colorClasses = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
                  } else if (ent.type === 'UPI_ID') {
                    Icon = CreditCard;
                    colorClasses = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
                  } else if (ent.type === 'URL') {
                    Icon = Globe;
                    colorClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                  } else if (ent.type === 'Amount') {
                    Icon = DollarSign;
                    colorClasses = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
                  } else if (ent.type === 'Transaction_ID') {
                    Icon = Key;
                    colorClasses = 'bg-purple-500/10 text-purple-300 border-purple-500/30';
                  } else if (ent.type === 'Bank_Name') {
                    Icon = Building;
                    colorClasses = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
                  } else if (ent.type === 'Date') {
                    Icon = Calendar;
                    colorClasses = 'bg-blue-500/10 text-blue-300 border-blue-500/30';
                  }

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border ${colorClasses} flex items-start justify-between gap-2`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            {ent.label || ent.type}
                          </p>
                          <p className="text-xs font-bold font-mono text-slate-100 truncate mt-0.5">
                            {ent.value}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(ent.value)}
                        title="Copy to clipboard"
                        className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {copiedValue === ent.value ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* EXPLAINABLE AI ("WHY WAS THIS FLAGGED?") */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Explainable AI: Why was this flagged?</span>
              </h3>
              <p className="text-xs text-slate-400">
                Transparent breakdown of suspicious indicators identified by the ML and NLP model
              </p>
            </div>

            {!analysisResult.indicators || analysisResult.indicators.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No suspicious keywords or threat vectors were triggered by this text sample.</p>
            ) : (
              <div className="space-y-2.5">
                {analysisResult.indicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-1 rounded bg-rose-500/20 text-rose-400 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-200">{ind.name}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{ind.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* INVESTIGATION TIMELINE WITH EVIDENCE SOURCE LINKING */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Investigation Timeline (Linked to Evidence Artifacts)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Every event links back to its verified source artifact. You can edit or add events before generating a complaint.
                </p>
              </div>
            </div>

            {/* Timeline Items List */}
            <div className="space-y-3">
              {editableTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700 flex-shrink-0">
                      {item.date}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs text-slate-200">{item.event}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <FileSearch className="w-3 h-3 text-cyan-400" />
                          Source: <strong className="text-slate-300">{item.source || selectedFile?.name || 'Evidence Text'}</strong>
                        </span>
                        {previewUrl && (
                          <button
                            type="button"
                            onClick={() => setEvidencePreviewModal({ url: previewUrl, title: item.source || selectedFile?.name })}
                            className="text-[10px] text-cyan-400 hover:underline font-mono"
                          >
                            [View Source]
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveTimelineItem(idx)}
                    title="Remove event"
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Timeline Event Input */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Date (e.g. 10 Sep 2026)"
                value={newTimelineDate}
                onChange={(e) => setNewTimelineDate(e.target.value)}
                className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Event description (e.g. Payment transferred)"
                value={newTimelineEvent}
                onChange={(e) => setNewTimelineEvent(e.target.value)}
                className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 sm:col-span-1"
              />
              <button
                type="button"
                onClick={handleAddTimelineItem}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* USER FEEDBACK MODULE */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>Help Evaluate CrimeVision: Was this prediction accurate?</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Your feedback helps continuously evaluate ML model accuracy and false positive rates.
                </p>
              </div>

              {feedbackSubmitted && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Feedback Recorded</span>
                </span>
              )}
            </div>

            {!feedbackSubmitted ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('correct')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      feedbackFeedbackType === 'correct'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:text-emerald-400 border border-slate-800'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Correct Prediction</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('incorrect')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      feedbackFeedbackType === 'incorrect'
                        ? 'bg-rose-500 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:text-rose-400 border border-slate-800'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Incorrect Prediction</span>
                  </button>
                </div>

                {feedbackFeedbackType === 'incorrect' && (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <p className="text-xs font-bold text-slate-300">
                      What was the actual nature of this message?
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {['Fraud', 'Legitimate', 'Unsure'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setIncorrectCorrection(label)}
                          className={`px-3 py-1 rounded-lg font-mono ${
                            incorrectCorrection === label
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Optional comment explaining the discrepancy..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
                    />
                  </div>
                )}

                {feedbackFeedbackType && (
                  <button
                    type="button"
                    onClick={handleFeedbackSubmit}
                    disabled={submittingFeedback}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    {submittingFeedback ? 'Saving...' : 'Submit Evaluation Feedback'}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-mono">
                ✔ Thank you! Your evaluation data has been logged to the system audit repository.
              </p>
            )}
          </div>

          {/* ========================================================================= */}
          {/* COMPLAINT DRAFT GENERATION & ANALYSIS REPORT CTA */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Analysis Report & Formal Complaint Draft</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                View the complete technical detection summary, export as PDF, or generate an editable police complaint draft containing all extracted suspect phone numbers, UPI IDs, amounts, and linked timeline events.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Technical Report</span>
              </button>

              <button
                onClick={() =>
                  navigate('/complaint-generator', {
                    state: {
                      analysis: {
                        ...analysisResult,
                        timeline: editableTimeline,
                      },
                    },
                  })
                }
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Draft Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technical Analysis Report Modal */}
      {showReportModal && analysisResult && (
        <AnalysisReportModal
          analysis={{
            ...analysisResult,
            timeline: editableTimeline,
          }}
          onClose={() => setShowReportModal(false)}
          onGenerateComplaint={(anl) =>
            navigate('/complaint-generator', {
              state: {
                analysis: anl,
              },
            })
          }
        />
      )}

      {/* Evidence Enlarge Modal */}
      {evidencePreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 truncate">
                {evidencePreviewModal.title || 'Source Evidence Preview'}
              </h3>
              <button
                onClick={() => setEvidencePreviewModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-950 rounded-xl p-2">
              <img
                src={evidencePreviewModal.url}
                alt="Source Evidence"
                className="max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
