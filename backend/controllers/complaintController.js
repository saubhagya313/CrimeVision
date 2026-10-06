import ComplaintDraft from '../models/ComplaintDraft.js';
import Analysis from '../models/Analysis.js';
import AuditLog from '../models/AuditLog.js';
import { sendComplaintDraftPdfEmail } from '../utils/emailService.js';

/**
 * @desc    Create a new editable police complaint draft
 * @route   POST /api/complaints/draft
 * @access  Private (User/Citizen)
 */
export const createComplaintDraft = async (req, res, next) => {
  try {
    const {
      analysisId,
      complainantInfo,
      incidentInfo,
      suspectInfo,
      evidence,
      aiAnalysis,
      timeline,
      policeStation,
      legalSections,
    } = req.body;

    if (!complainantInfo?.name || !complainantInfo?.mobile || !incidentInfo?.description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complainant name, mobile number, and incident description.',
      });
    }

    const count = await ComplaintDraft.countDocuments();
    const year = new Date().getFullYear();
    const draftId = `CV-CMP-${year}-${String(count + 1).padStart(4, '0')}`;

    const defaultLegalSections = legalSections || [
      {
        statute: 'Information Technology Act, 2000 (Amended 2008)',
        section: 'Section 66D',
        description: 'Punishment for cheating by personation by using computer resource or communication device.',
      },
      {
        statute: 'Bharatiya Nyaya Sanhita (BNS), 2023 / IPC 420',
        section: 'Section 318(4)',
        description: 'Cheating and dishonestly inducing delivery of property.',
      },
      {
        statute: 'Information Technology Act, 2000',
        section: 'Section 43',
        description: 'Penalty and compensation for damage to computer system or electronic data tampering.',
      },
    ];

    const draft = await ComplaintDraft.create({
      draftId,
      userId: req.user._id,
      userName: req.user.name,
      analysisId: analysisId || '',
      complainantInfo: {
        name: complainantInfo.name,
        mobile: complainantInfo.mobile,
        email: complainantInfo.email || req.user.email,
        address: complainantInfo.address || '',
        city: complainantInfo.city || '',
        state: complainantInfo.state || '',
        pincode: complainantInfo.pincode || '',
      },
      incidentInfo: {
        incidentDate: incidentInfo.incidentDate || new Date().toISOString().split('T')[0],
        incidentTime: incidentInfo.incidentTime || '',
        incidentType: incidentInfo.incidentType || 'UPI / Payment Fraud',
        description: incidentInfo.description,
        financialLoss: incidentInfo.financialLoss || 0,
        currency: incidentInfo.currency || 'INR (₹)',
      },
      suspectInfo: {
        phoneNumbers: suspectInfo?.phoneNumbers || [],
        upiIds: suspectInfo?.upiIds || [],
        emails: suspectInfo?.emails || [],
        urls: suspectInfo?.urls || [],
        transactionIds: suspectInfo?.transactionIds || [],
        bankAccounts: suspectInfo?.bankAccounts || [],
        names: suspectInfo?.names || [],
        otherDetails: suspectInfo?.otherDetails || '',
      },
      evidence: {
        files: evidence?.files || [],
        extractedTextSummary: evidence?.extractedTextSummary || '',
      },
      aiAnalysis: {
        fraudCategory: aiAnalysis?.fraudCategory || 'Cyber Fraud',
        riskLevel: aiAnalysis?.riskLevel || 'High',
        confidence: aiAnalysis?.confidence || 90,
        indicators: aiAnalysis?.indicators || [],
      },
      timeline: timeline || [],
      policeStation: policeStation || {
        name: 'Cyber Crime Police Station',
        address: 'District Cyber Crime Cell',
        city: complainantInfo.city || 'Local Jurisdiction',
        contact: 'National Helpline: 1930',
        distance: 'Nearby',
      },
      legalSections: defaultLegalSections,
      declarationAccepted: true,
      status: 'Draft',
    });

    // Mark analysis as having complaint generated
    if (analysisId) {
      await Analysis.findOneAndUpdate(
        { analysisId },
        { complaintDraftGenerated: true, complaintDraftId: draftId }
      ).catch(() => {});
    }

    // Audit log
    await AuditLog.create({
      action: 'COMPLAINT_DRAFT_CREATED',
      performedBy: req.user._id,
      userName: req.user.name,
      userRole: req.user.role || 'User',
      ipAddress: req.ip || '127.0.0.1',
      details: `Generated citizen complaint draft [${draftId}] for ${incidentInfo.incidentType}`,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Complaint draft created successfully. You can edit and review it before downloading.',
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's complaint drafts
 * @route   GET /api/complaints/my-drafts
 * @access  Private (User/Citizen)
 */
export const getMyComplaintDrafts = async (req, res, next) => {
  try {
    const drafts = await ComplaintDraft.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drafts.length,
      data: drafts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single complaint draft by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
export const getComplaintDraftById = async (req, res, next) => {
  try {
    const draft = await ComplaintDraft.findOne({
      $or: [
        { draftId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: 'Complaint draft not found.',
      });
    }

    // Citizen access guard
    if (
      req.user.role !== 'Admin' &&
      draft.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this draft.',
      });
    }

    res.status(200).json({
      success: true,
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update editable fields in complaint draft
 * @route   PUT /api/complaints/:id
 * @access  Private (User/Citizen)
 */
export const updateComplaintDraft = async (req, res, next) => {
  try {
    const draft = await ComplaintDraft.findOne({
      $or: [
        { draftId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: 'Complaint draft not found.',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      draft.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to edit this draft.',
      });
    }

    const {
      complainantInfo,
      incidentInfo,
      suspectInfo,
      evidence,
      timeline,
      policeStation,
      status,
    } = req.body;

    if (complainantInfo) draft.complainantInfo = { ...draft.complainantInfo.toObject(), ...complainantInfo };
    if (incidentInfo) draft.incidentInfo = { ...draft.incidentInfo.toObject(), ...incidentInfo };
    if (suspectInfo) draft.suspectInfo = { ...draft.suspectInfo.toObject(), ...suspectInfo };
    if (evidence) draft.evidence = { ...draft.evidence.toObject(), ...evidence };
    if (timeline) draft.timeline = timeline;
    if (policeStation) draft.policeStation = { ...draft.policeStation.toObject(), ...policeStation };
    if (status) draft.status = status;

    await draft.save();

    res.status(200).json({
      success: true,
      message: 'Complaint draft updated successfully.',
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete complaint draft
 * @route   DELETE /api/complaints/:id
 * @access  Private
 */
export const deleteComplaintDraft = async (req, res, next) => {
  try {
    const draft = await ComplaintDraft.findOne({
      $or: [
        { draftId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: 'Draft not found.',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      draft.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    await ComplaintDraft.findByIdAndDelete(draft._id);

    res.status(200).json({
      success: true,
      message: 'Complaint draft deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin complaint monitoring (aggregate stats and list)
 * @route   GET /api/complaints/admin/all
 * @access  Private (Admin only)
 */
export const getAdminComplaints = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin authorization required.',
      });
    }

    const complaints = await ComplaintDraft.find()
      .select('draftId userId userName incidentInfo aiAnalysis policeStation status createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    const totalComplaints = await ComplaintDraft.countDocuments();

    res.status(200).json({
      success: true,
      totalComplaints,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send formal police complaint draft PDF to user's registered email
 * @route   POST /api/complaints/:id/send-email
 * @access  Private
 */
export const emailComplaintDraft = async (req, res, next) => {
  try {
    const draft = await ComplaintDraft.findOne({
      $or: [
        { draftId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: 'Complaint draft not found.',
      });
    }

    const recipientEmail = draft.complainantInfo?.email || req.user.email;
    const recipientAddress = [
      draft.complainantInfo?.address || req.user.address,
      draft.complainantInfo?.city || req.user.city,
      draft.complainantInfo?.state || req.user.state,
      draft.complainantInfo?.pincode || req.user.pincode,
    ]
      .filter(Boolean)
      .join(', ');

    const result = await sendComplaintDraftPdfEmail({
      recipientEmail,
      recipientName: draft.complainantInfo?.name || req.user.name,
      recipientAddress: recipientAddress || 'Verified Citizen Address',
      draftId: draft.draftId,
      incidentType: draft.incidentInfo?.incidentType || 'Cyber Fraud',
      lossAmount: draft.incidentInfo?.financialLoss || 0,
      policeStation: draft.policeStation?.name || 'Cyber Crime Police Station',
      userId: req.user._id,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
