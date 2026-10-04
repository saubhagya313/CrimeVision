/**
 * Forensic Indicator of Compromise (IOC) and Entity Extractor
 * Extracts phone numbers, UPI IDs, URLs, currency amounts, crypto wallets,
 * transaction IDs, bank names, dates, and emails from digital evidence.
 */

export const extractForensicEntities = (text = '') => {
  if (!text || typeof text !== 'string') return [];

  const entities = [];
  const seenValues = new Set();

  // 1. Phone Numbers (Indian format + international)
  const phoneRegex = /(?:\+?91[\s-]?)?[6-9]\d{9}|\+?\d{1,3}[\s-]?\d{3,4}[\s-]?\d{4,6}/g;
  let match;
  while ((match = phoneRegex.exec(text)) !== null) {
    const val = match[0].trim();
    const digits = val.replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 13 && !seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'Phone',
        value: val,
        label: 'Extracted Phone Number',
        risk: 'High',
      });
    }
  }

  // 2. UPI IDs / VPAs (e.g., user@okhdfcbank, money-refund@ybl, cbi@sbi)
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@(okaxis|okhdfcbank|okicici|oksbi|paytm|ybl|ibl|axl|upi|sbi|hdfcbank|icici|barodampay|federal|kotak|pnb)/gi;
  while ((match = upiRegex.exec(text)) !== null) {
    const val = match[0].trim().toLowerCase();
    if (!seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'UPI_ID',
        value: val,
        label: 'Virtual Payment Address (UPI VPA)',
        risk: 'Critical',
      });
    }
  }

  // 3. URLs and Domains
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*|www\.[^\s]+\.[a-z]{2,}/gi;
  while ((match = urlRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (!seenValues.has(val)) {
      seenValues.add(val);
      const isSuspiciousDomain = /(\.xyz|\.top|\.biz|\.cc|\.work|\.ru|\.tk|\.info|free|cashback|reward|claim|bonus|airdrop|verify|kyc|apk)/i.test(val);
      entities.push({
        type: 'URL',
        value: val,
        label: isSuspiciousDomain ? 'Suspicious / Phishing URL' : 'Extracted Web Link',
        risk: isSuspiciousDomain ? 'Critical' : 'Medium',
      });
    }
  }

  // 4. Currency Amounts (e.g., Rs 25,000, ₹50,000, $500, USD 100)
  const amountRegex = /(?:rs\.?|inr|₹|\$|usd|eur)\s?(\d+(?:,\d+)*(?:\.\d+)?)/gi;
  while ((match = amountRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (!seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'Amount',
        value: val,
        label: 'Monetary Amount',
        risk: 'Medium',
      });
    }
  }

  // 5. Transaction IDs / Reference Numbers (UTR, Txn ID, Ref No, 12-digit UTRs)
  const txnRegex = /\b(?:UTR|TXN|TRANSACTION|REF|ORDER|CHQ|IMPS|NEFT)[\s#:_-]*([A-Za-z0-9]{8,22})\b|\b\d{12}\b/gi;
  while ((match = txnRegex.exec(text)) !== null) {
    const val = match[1] || match[0];
    const cleanVal = val.trim();
    // Exclude if it was matched as a phone number
    if (!seenValues.has(cleanVal) && cleanVal.length >= 8 && !/^[6-9]\d{9}$/.test(cleanVal)) {
      seenValues.add(cleanVal);
      entities.push({
        type: 'Transaction_ID',
        value: cleanVal,
        label: 'Transaction / UTR Reference ID',
        risk: 'High',
      });
    }
  }

  // 6. Bank Names
  const bankNames = [
    'State Bank of India', 'SBI', 'HDFC Bank', 'HDFC', 'ICICI Bank', 'ICICI',
    'Axis Bank', 'Axis', 'Punjab National Bank', 'PNB', 'Bank of Baroda', 'BOB',
    'Kotak Mahindra Bank', 'Kotak', 'Canara Bank', 'Union Bank', 'IndusInd Bank',
    'Paytm Payments Bank', 'Airtel Payments Bank', 'Federal Bank', 'Yes Bank'
  ];
  const bankRegex = new RegExp(`\\b(${bankNames.join('|')})\\b`, 'gi');
  while ((match = bankRegex.exec(text)) !== null) {
    const val = match[0].trim();
    const upper = val.toUpperCase();
    if (!seenValues.has(upper)) {
      seenValues.add(upper);
      entities.push({
        type: 'Bank_Name',
        value: val,
        label: 'Identified Bank / Financial Entity',
        risk: 'Low',
      });
    }
  }

  // 7. Dates & Timestamps
  const dateRegex = /\b(?:\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*[\s,]+\d{2,4}|(?:yesterday|today|tomorrow))\b/gi;
  while ((match = dateRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (!seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'Date',
        value: val,
        label: 'Extracted Date Timestamp',
        risk: 'Low',
      });
    }
  }

  // 8. Crypto Wallets
  const cryptoRegex = /\b(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|T[A-Za-z1-9]{33})\b/g;
  while ((match = cryptoRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (!seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'CryptoWallet',
        value: val,
        label: 'Cryptocurrency Wallet Address',
        risk: 'Critical',
      });
    }
  }

  // 9. Emails
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  while ((match = emailRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (!val.includes('@ok') && !val.includes('@paytm') && !val.includes('@ybl') && !seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'Email',
        value: val,
        label: 'Email Address',
        risk: 'Medium',
      });
    }
  }

  return entities;
};

/**
 * Heuristic Threat Detection & Explainable AI Reason Generator
 */
export const calculateHeuristicRisk = (text = '', entities = []) => {
  const lower = text.toLowerCase();
  let score = 15; // baseline
  const indicators = [];

  const hasUPI = entities.some((e) => e.type === 'UPI_ID');
  const hasAmount = entities.some((e) => e.type === 'Amount');
  const hasURL = entities.some((e) => e.type === 'URL');
  const hasSuspiciousURL = entities.some((e) => e.type === 'URL' && e.risk === 'Critical');

  // 1. UPI / QR PIN Scam Check
  if (/upi pin|enter pin|scan qr|receive money|claim cashback|refund.*pin|enter.*mpin/i.test(lower)) {
    score += 45;
    indicators.push({
      name: 'Payment Request / PIN Trick Detected',
      explanation: 'Message prompts victim to enter a UPI PIN or scan a QR code to "receive" funds, which in reality authorizes an immediate bank debit.',
      confidence: 96,
      weight: 45,
    });
  } else if (hasUPI && hasAmount) {
    score += 30;
    indicators.push({
      name: 'UPI Payment Coordinate Detected',
      explanation: 'Detected combination of a Virtual Payment Address (UPI VPA) and specific monetary demand.',
      confidence: 90,
      weight: 30,
    });
  }

  // 2. Law Enforcement / Digital Arrest Impersonation
  if (/cbi|police|customs|narcotics|ed directorate|arrest warrant|fir registered|illegal parcel|cyber cell|high court/i.test(lower)) {
    score += 50;
    indicators.push({
      name: 'Law Enforcement / Digital Arrest Impersonation',
      explanation: 'Coercive language impersonating Police/CBI/Customs claiming illegal courier or pending arrest warrant to intimidate the user.',
      confidence: 98,
      weight: 50,
    });
  }

  // 3. Phishing / Fake Links
  if (hasSuspiciousURL || /login.*account|verify.*otp|password.*expired|update.*pan|aadhaar.*link|download.*apk/i.test(lower)) {
    score += 40;
    indicators.push({
      name: 'Credential Harvesting / Phishing URL',
      explanation: 'Contains suspicious domain or request to input OTP/credentials through an unverified external link.',
      confidence: 93,
      weight: 40,
    });
  }

  // 4. Fake High Return / Investment / Telegram Scam
  if (/guaranteed.*return|100% profit|crypto.*mining|daily.*income|part time job|like youtube video|earn.*5000.*day|telegram.*group/i.test(lower)) {
    score += 40;
    indicators.push({
      name: 'Unrealistic Financial Return / Task Fraud Pattern',
      explanation: 'Language promises unrealistic high daily returns or tasks on Telegram, characteristic of organized investment task fraud.',
      confidence: 92,
      weight: 40,
    });
  }

  // 5. Urgency & Panic Induction
  if (/immediately|within 24 hours|account blocked|electricity.*disconnect|sim.*deactivated|last warning|action.*taken/i.test(lower)) {
    score += 25;
    indicators.push({
      name: 'Urgency & Pressure Tactics Detected',
      explanation: 'High-pressure wording designed to induce panic and force hasty financial or credential disclosure.',
      confidence: 88,
      weight: 25,
    });
  }

  // Clamp score
  score = Math.min(Math.max(score, 5), 98);

  let riskLevel = 'Low';
  if (score >= 75) riskLevel = 'Critical';
  else if (score >= 50) riskLevel = 'High';
  else if (score >= 30) riskLevel = 'Medium';

  // If score < 30 and no major indicators found, ensure Low risk
  if (indicators.length === 0) {
    score = 12;
    riskLevel = 'Low';
  }

  return { riskScore: score, riskLevel, indicators };
};

/**
 * Generate an automatic investigation timeline from extracted dates and text cues
 */
export const generateTimelineFromText = (text = '', entities = []) => {
  const timeline = [];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const dateEntities = entities.filter((e) => e.type === 'Date');

  if (dateEntities.length > 0) {
    dateEntities.forEach((d, idx) => {
      let eventDesc = 'Activity recorded in evidence';
      if (idx === 0) eventDesc = 'Initial suspicious contact / message received';
      else if (idx === 1) eventDesc = 'Payment request / suspicious link shared';
      else eventDesc = 'Transaction or follow-up communication recorded';

      timeline.push({
        date: d.value,
        time: 'Evidence timestamp',
        event: eventDesc,
        source: 'Extracted from Evidence',
      });
    });
  } else {
    // If no explicit dates found, create a logical 2-step event outline
    timeline.push({
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: 'Approx. Incident Time',
      event: 'Suspicious communication received via digital channel',
      source: 'User Evidence',
    });
  }

  return timeline;
};
