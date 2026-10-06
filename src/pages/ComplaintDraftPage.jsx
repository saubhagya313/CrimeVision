import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  Printer,
  Save,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Shield,
  ShieldCheck,
  Phone,
  CreditCard,
  Globe,
  Calendar,
  DollarSign,
  User,
  Building,
  ArrowLeft,
  Sparkles,
  Info,
  FileSearch,
  Check,
  Clock,
  Lock,
  Mail,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { complaintsApi } from '../services/api';

const ComplaintDraftPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const analysisData = location.state?.analysis || null;
  const existingDraft = location.state?.draft || null;

  // Form State with Standardized Reference ID: CV-CMP-YYYY-XXXX
  const [draftId] = useState(
    existingDraft?.draftId || `CV-CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );

  // 1. Complainant Details (Auto-populated from citizen registered address & contact coordinates)
  const [complainant, setComplainant] = useState({
    name: existingDraft?.complainantInfo?.name || user?.name || '',
    mobile: existingDraft?.complainantInfo?.mobile || user?.phone || '+91 ',
    email: existingDraft?.complainantInfo?.email || user?.email || '',
    address: existingDraft?.complainantInfo?.address || user?.address || 'Flat 402, Sunshine Heights, Sector 62',
    city: existingDraft?.complainantInfo?.city || user?.city || 'Noida',
    state: existingDraft?.complainantInfo?.state || user?.state || 'Uttar Pradesh',
    pincode: existingDraft?.complainantInfo?.pincode || user?.pincode || '201301',
  });

  // 2. Incident Details
  const [incident, setIncident] = useState({
    date: existingDraft?.incidentInfo?.incidentDate || new Date().toISOString().split('T')[0],
    time: existingDraft?.incidentInfo?.incidentTime || '10:30 AM',
    type: existingDraft?.incidentInfo?.incidentType || analysisData?.predictedCategory || 'UPI / Payment Fraud',
    lossAmount:
      existingDraft?.incidentInfo?.financialLoss != null
        ? String(existingDraft.incidentInfo.financialLoss)
        : analysisData?.entities?.find((e) => e.type === 'Amount')?.value
        ? String(analysisData.entities.find((e) => e.type === 'Amount').value).replace(/\D/g, '')
        : '25000',
    description:
      existingDraft?.incidentInfo?.description ||
      (analysisData?.extractedText
        ? `I received suspicious communication. Text content extracted from evidence:\n"${analysisData.extractedText}"\nThe perpetrator used deceptive payment lures, leading to an unauthorized financial transfer. Please investigate.`
        : `I received suspicious messages resulting in financial fraud. Please take necessary legal action.`),
  });

  // 3. Suspect Details
  const [suspect, setSuspect] = useState({
    phone:
      existingDraft?.suspectInfo?.phoneNumbers?.[0] ||
      analysisData?.entities?.find((e) => e.type === 'Phone')?.value ||
      '+91 99000 11223',
    upiId:
      existingDraft?.suspectInfo?.upiIds?.[0] ||
      analysisData?.entities?.find((e) => e.type === 'UPI_ID')?.value ||
      'cyber-mule@okaxis',
    url:
      existingDraft?.suspectInfo?.urls?.[0] ||
      analysisData?.entities?.find((e) => e.type === 'URL')?.value ||
      'N/A',
    txnId:
      existingDraft?.suspectInfo?.transactionIds?.[0] ||
      analysisData?.entities?.find((e) => e.type === 'Transaction_ID')?.value ||
      '429184719284',
    bankAccount: existingDraft?.suspectInfo?.bankAccounts?.[0] || 'Unknown Beneficiary Account',
  });

  // 4. Police Station
  const [policeStation, setPoliceStation] = useState({
    name: existingDraft?.policeStation?.name || 'Cyber Crime Police Station, Sector 108',
    address: existingDraft?.policeStation?.address || 'Police Commissionerate Complex, Sector 108, Noida',
    city: existingDraft?.policeStation?.city || 'Noida',
    contact: existingDraft?.policeStation?.contact || '0120-2560003 / 1930',
  });

  // 5. Timeline with linked sources
  const [timelineEvents, setTimelineEvents] = useState(
    existingDraft?.timeline ||
      analysisData?.timeline || [
        { date: '10 Sep 2026', event: 'Initial fraudulent message received via WhatsApp', source: 'whatsapp_chat.png' },
        { date: '10 Sep 2026', event: 'Payment requested to suspect UPI ID', source: 'payment_qr.png' },
        { date: '10 Sep 2026', event: 'Unauthorized debit occurred under UTR 429184719284', source: 'bank_sms.png' },
      ]
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save Draft to Backend
  const handleSaveDraft = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const draftPayload = {
        draftId,
        analysisId: analysisData?.analysisId || '',
        complainantInfo: complainant,
        incidentInfo: {
          incidentDate: incident.date,
          incidentTime: incident.time,
          incidentType: incident.type,
          description: incident.description,
          financialLoss: Number(incident.lossAmount) || 0,
          currency: 'INR (₹)',
        },
        suspectInfo: {
          phoneNumbers: suspect.phone ? [suspect.phone] : [],
          upiIds: suspect.upiId ? [suspect.upiId] : [],
          urls: suspect.url && suspect.url !== 'N/A' ? [suspect.url] : [],
          transactionIds: suspect.txnId ? [suspect.txnId] : [],
          bankAccounts: suspect.bankAccount && suspect.bankAccount !== 'Unknown' ? [suspect.bankAccount] : [],
        },
        evidence: {
          files: analysisData?.fileName ? [{ name: analysisData.fileName, type: 'Evidence File', hash: analysisData.fileHash }] : [],
          extractedTextSummary: analysisData?.extractedText || incident.description,
        },
        aiAnalysis: {
          fraudCategory: analysisData?.predictedCategory || incident.type,
          riskLevel: analysisData?.riskLevel || 'High',
          confidence: analysisData?.confidence || 94,
          indicators: analysisData?.indicators || [],
        },
        timeline: timelineEvents,
        policeStation,
      };

      await complaintsApi.createDraft(draftPayload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(`Error saving complaint draft: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const [emailing, setEmailing] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');

  // Dispatch formal Complaint PDF report to user's registered email
  const handleEmailDraft = async () => {
    setEmailing(true);
    setEmailSuccess('');
    try {
      const draftPayload = {
        draftId,
        complainantInfo: {
          name: complainant.name,
          email: complainant.email,
          phone: complainant.phone,
          address: complainant.address,
          city: complainant.city,
          state: complainant.state,
          pincode: complainant.pincode,
          idProofType: complainant.idProofType,
          idProofNumber: complainant.idProofNumber,
        },
        incidentInfo: {
          incidentType,
          incidentDate,
          financialLoss: Number(financialLoss) || 0,
          transactionRef,
          bankName,
          platformUsed,
          incidentDescription,
        },
        suspectInfo: {
          suspectName,
          suspectContact,
          suspectAccount,
          suspectUpiId,
          suspectProfileLink,
        },
        evidence: {
          hasEvidenceFile: !!evidenceAttached,
          evidenceFileName: evidenceAttached?.name || '',
          evidenceTextPreview: evidenceAttached?.text || '',
        },
        timeline: timelineEvents,
        policeStation,
      };

      await complaintsApi.createDraft(draftPayload).catch(() => {});

      const res = await complaintsApi.sendComplaintEmail(draftId);
      setEmailSuccess(
        res?.message ||
          `✔ Official Complaint PDF successfully emailed to ${complainant.email} (${complainant.address}, ${complainant.city})!`
      );
      setTimeout(() => setEmailSuccess(''), 7000);
    } catch (err) {
      alert(`Email dispatch error: ${err.message}`);
    } finally {
      setEmailing(false);
    }
  };

  // Trigger Print / PDF download
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Controls (Hidden on Print) */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analysis Hub</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              onClick={handleEmailDraft}
              disabled={emailing}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              title={`Email PDF copy to ${complainant.email}`}
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{emailing ? 'Sending Email...' : 'Email PDF to My Registered Email'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>

        {emailSuccess && (
          <div className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{emailSuccess}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Complaint draft saved successfully with ID {draftId}!</span>
          </div>
        )}

        {/* Prominent Mandatory Label */}
        <div className="p-4 rounded-xl bg-amber-950/30 border-2 border-amber-500/40 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-400 text-sm">
              AI-Assisted Complaint Draft — Verify All Information Before Submission
            </p>
            <p className="text-slate-300 leading-relaxed">
              This document is compiled from your digital evidence scan ({analysisData?.analysisId || 'Analysis'}). 
              CrimeVision does not automatically submit complaints to police authorities. 
              Please review and edit all fields below, print or save as PDF, and submit it at your local police station or on <strong>cybercrime.gov.in</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORMAL PRINTABLE COMPLAINT DOCUMENT */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-10 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl space-y-8 font-sans print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 print:border-black pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400 print:text-black" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-100 print:text-black uppercase">
                CrimeVision Cyber Assistance Platform
              </h1>
            </div>
            <p className="text-xs text-amber-400 print:text-black font-mono font-bold">
              AI-ASSISTED COMPLAINT DRAFT — VERIFY ALL INFORMATION BEFORE SUBMISSION
            </p>
          </div>

          <div className="text-right font-mono text-xs space-y-1">
            <p className="text-slate-400 print:text-gray-600">Complaint Reference ID:</p>
            <p className="text-sm font-bold text-cyan-400 print:text-black">{draftId}</p>
            {analysisData?.analysisId && (
              <p className="text-[10px] text-slate-400 print:text-gray-600">
                Evidence Scan Ref: {analysisData.analysisId}
              </p>
            )}
            <p className="text-[11px] text-slate-400 print:text-gray-600">
              Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Addressee & Station Info */}
        <div className="space-y-2">
          <p className="text-xs font-mono font-bold text-slate-400 print:text-gray-700 uppercase">To:</p>
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-200 print:text-black">The Station House Officer (SHO) / Officer In-Charge</p>
            <input
              type="text"
              value={policeStation.name}
              onChange={(e) => setPoliceStation({ ...policeStation, name: e.target.value })}
              className="w-full font-semibold bg-transparent border-b border-dashed border-slate-700 print:border-gray-400 text-slate-100 print:text-black focus:outline-none text-xs pb-1"
            />
            <input
              type="text"
              value={policeStation.address}
              onChange={(e) => setPoliceStation({ ...policeStation, address: e.target.value })}
              className="w-full bg-transparent border-b border-dashed border-slate-700 print:border-gray-400 text-slate-400 print:text-gray-700 focus:outline-none text-xs pb-1"
            />
          </div>
        </div>

        {/* Subject Line */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 print:bg-gray-100 border border-slate-800 print:border-gray-300 font-bold text-xs space-y-1">
          <p className="text-slate-200 print:text-black">
            SUBJECT: Formal Complaint Regarding Cyber Fraud / Online Financial Scam ({incident.type})
          </p>
          <p className="text-[11px] font-mono text-slate-400 print:text-gray-600 font-normal">
            Statutory Legal References: Bharatiya Nyaya Sanhita (BNS) 318(4) [Cheating] & Information Technology Act 2000 Section 66D / 43
          </p>
        </div>

        {/* 1. Complainant Details Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-2 border-b border-slate-800 print:border-gray-300 pb-1.5">
            <User className="w-3.5 h-3.5" />
            <span>1. Complainant (Victim) Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Full Name</label>
              <input
                type="text"
                value={complainant.name}
                onChange={(e) => setComplainant({ ...complainant, name: e.target.value })}
                className="w-full mt-0.5 px-3 py-2 bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg text-slate-200 print:text-black font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Mobile Number</label>
              <input
                type="text"
                value={complainant.mobile}
                onChange={(e) => setComplainant({ ...complainant, mobile: e.target.value })}
                className="w-full mt-0.5 px-3 py-2 bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg text-slate-200 print:text-black font-mono font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Email Address</label>
              <input
                type="text"
                value={complainant.email}
                onChange={(e) => setComplainant({ ...complainant, email: e.target.value })}
                className="w-full mt-0.5 px-3 py-2 bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg text-slate-200 print:text-black font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Residential Address</label>
              <input
                type="text"
                value={`${complainant.address}, ${complainant.city}, ${complainant.state} - ${complainant.pincode}`}
                onChange={(e) => setComplainant({ ...complainant, address: e.target.value })}
                className="w-full mt-0.5 px-3 py-2 bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg text-slate-200 print:text-black font-medium"
              />
            </div>
          </div>
        </div>

        {/* 2. Incident Information Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-2 border-b border-slate-800 print:border-gray-300 pb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>2. Incident Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Date of Incident</label>
              <input
                type="date"
                value={incident.date}
                onChange={(e) => setIncident({ ...incident, date: e.target.value })}
                className="w-full mt-0.5 px-3 py-2 bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg text-slate-200 print:text-black font-mono font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Fraud Category</label>
              <input
                type="text"
                value={incident.type}
                onChange={(e) => setIncident({ ...incident, type: e.target.value })}
                className="w-full mt-0.5 px-3 py-2 bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg text-slate-200 print:text-black font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Total Financial Loss (₹)</label>
              <input
                type="number"
                value={incident.lossAmount}
                onChange={(e) => setIncident({ ...incident, lossAmount: e.target.value })}
                className="w-full mt-0.5 px-3 py-2 bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg text-rose-400 print:text-black font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Incident Narrative & Modus Operandi</label>
            <textarea
              rows={4}
              value={incident.description}
              onChange={(e) => setIncident({ ...incident, description: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg text-slate-200 print:text-black text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* 3. Suspected Perpetrator Coordinates */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 print:text-black flex items-center gap-2 border-b border-slate-800 print:border-gray-300 pb-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>3. Suspect Information & Electronic Identifiers</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase flex items-center gap-1">
                <Phone className="w-3 h-3" /> Suspect Mobile
              </span>
              <input
                type="text"
                value={suspect.phone}
                onChange={(e) => setSuspect({ ...suspect, phone: e.target.value })}
                className="w-full bg-transparent font-mono font-bold text-slate-200 print:text-black text-xs focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Suspect UPI VPA
              </span>
              <input
                type="text"
                value={suspect.upiId}
                onChange={(e) => setSuspect({ ...suspect, upiId: e.target.value })}
                className="w-full bg-transparent font-mono font-bold text-slate-200 print:text-black text-xs focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Txn / UTR Reference
              </span>
              <input
                type="text"
                value={suspect.txnId}
                onChange={(e) => setSuspect({ ...suspect, txnId: e.target.value })}
                className="w-full bg-transparent font-mono font-bold text-slate-200 print:text-black text-xs focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase flex items-center gap-1">
                <Globe className="w-3 h-3" /> Phishing URL / Link
              </span>
              <input
                type="text"
                value={suspect.url}
                onChange={(e) => setSuspect({ ...suspect, url: e.target.value })}
                className="w-full bg-transparent font-mono font-bold text-slate-200 print:text-black text-xs focus:outline-none truncate"
              />
            </div>
          </div>
        </div>

        {/* 4. Investigation Timeline Summary with Source Evidence */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-2 border-b border-slate-800 print:border-gray-300 pb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>4. Reconstructed Sequence of Events (Timeline)</span>
          </h3>

          <div className="space-y-2">
            {timelineEvents.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-xs p-2 rounded bg-slate-900/60 print:bg-gray-50 border border-slate-800/80 print:border-gray-300"
              >
                <span className="font-mono font-bold text-cyan-400 print:text-black w-24 flex-shrink-0">
                  {evt.date}
                </span>
                <span className="text-slate-300 print:text-black flex-1">{evt.event}</span>
                {evt.source && (
                  <span className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                    [{evt.source}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. AI Forensic Assessment Findings */}
        <div className="p-4 rounded-xl bg-slate-900/60 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 print:text-black flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
              CrimeVision AI Diagnostic Summary
            </span>
            <span className="font-mono text-slate-400 print:text-gray-600">
              Assessed Risk: {analysisData?.riskLevel || 'High'} ({analysisData?.confidence || 94}% Confidence)
            </span>
          </div>
          <p className="text-slate-400 print:text-gray-700 leading-relaxed">
            Automated machine learning classification identified high correlation with {incident.type} patterns. 
            All identified suspect phone lines, UPI VPAs, and UTR transaction reference tokens are cataloged above for immediate Section 91 CrPC notice to beneficiary payment intermediaries.
          </p>
        </div>

        {/* 6. Section 65B / BSA 2023 Electronic Evidence Admissibility Declaration */}
        <div className="p-4 rounded-xl bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 print:text-black flex items-center gap-1.5 font-mono text-[11px] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 print:text-black" />
              Certificate under Section 65B Indian Evidence Act / Section 63 BSA 2023
            </span>
            <span className="text-[10px] font-mono text-slate-400 print:text-gray-600">
              Electronic Record Authenticity
            </span>
          </div>
          <p className="text-[11px] text-slate-400 print:text-gray-700 leading-relaxed font-mono">
            I certify that the electronic printouts/attachments of digital evidence presented with this complaint (including screenshots, chat records, and transaction receipts) are true reproductions of the computer outputs generated on my communication device during the regular course of activities without any unauthorized alteration or data tampering.
          </p>
        </div>

        {/* Declaration & Signature Block */}
        <div className="pt-6 border-t-2 border-slate-800 print:border-black space-y-6 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-900/40 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-[11px] text-slate-400 print:text-gray-700 leading-relaxed">
            <strong>CITIZEN DECLARATION:</strong> I hereby declare that the information provided in this complaint is true and accurate to the best of my knowledge and belief. I request the investigating authorities to register an FIR / cyber complaint and initiate appropriate legal action under the Information Technology Act, 2000 and the Bharatiya Nyaya Sanhita (BNS), 2023.
          </div>

          <div className="flex justify-between items-end pt-8">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400 print:text-gray-600 font-mono">Date: {new Date().toLocaleDateString('en-GB')}</p>
              <p className="text-[11px] text-slate-400 print:text-gray-600 font-mono">Place: {complainant.city || 'Noida'}</p>
            </div>

            <div className="text-right space-y-2">
              <div className="w-48 border-b border-slate-600 print:border-black mb-1" />
              <p className="font-bold text-slate-200 print:text-black">{complainant.name}</p>
              <p className="text-[10px] font-mono text-slate-400 print:text-gray-600">Signature of Complainant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDraftPage;
