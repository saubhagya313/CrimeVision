/**
 * Forensic Indicator of Compromise (IOC) and Entity Extractor
 * Extracts phone numbers, UPI IDs, URLs, currency amounts, crypto wallets, and emails from raw digital evidence.
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
    if (val.replace(/\D/g, '').length >= 10 && !seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'Phone',
        value: val,
        label: 'Extracted Suspect Mobile',
        risk: 'High',
      });
    }
  }

  // 2. UPI IDs / VPAs (e.g., user@okhdfcbank, money-refund@ybl, cbi@sbi)
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@(okaxis|okhdfcbank|okicici|oksbi|paytm|ybl|ibl|axl|upi|sbi|hdfcbank|icici)/gi;
  while ((match = upiRegex.exec(text)) !== null) {
    const val = match[0].trim().toLowerCase();
    if (!seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'UPI_ID',
        value: val,
        label: 'Flagged Virtual Payment Address (VPA)',
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
      const isSuspiciousDomain = /(\.xyz|\.top|\.biz|\.cc|\.work|\.cc|\.ru|free|cashback|reward|claim)/i.test(val);
      entities.push({
        type: 'URL',
        value: val,
        label: isSuspiciousDomain ? 'High-Risk Phishing Link' : 'Extracted Web Address',
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
        label: 'Transaction/Demand Amount',
        risk: 'Medium',
      });
    }
  }

  // 5. Crypto Wallets (BTC, ETH, TRON addresses)
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

  // 6. Emails
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  while ((match = emailRegex.exec(text)) !== null) {
    const val = match[0].trim();
    // Exclude if already flagged as UPI
    if (!val.includes('@ok') && !val.includes('@paytm') && !seenValues.has(val)) {
      seenValues.add(val);
      entities.push({
        type: 'Email',
        value: val,
        label: 'Email Communication Handle',
        risk: 'Medium',
      });
    }
  }

  return entities;
};

/**
 * Heuristic Threat Detection & Fraud Weight Calculator
 */
export const calculateHeuristicRisk = (text = '', entities = []) => {
  const lower = text.toLowerCase();
  let score = 20; // baseline
  const indicators = [];

  // Keyword flags
  if (/upi pin|enter pin|scan qr|receive money/i.test(lower)) {
    score += 40;
    indicators.push({
      name: 'UPI PIN Scam Mechanism',
      explanation: 'Text prompts victim to enter PIN to "receive" money (classic UPI debit trick).',
      confidence: 96,
      weight: 40,
    });
  }

  if (/cbi|police|customs|narcotics|fir|arrest warrant|illegal parcel/i.test(lower)) {
    score += 45;
    indicators.push({
      name: 'Law Enforcement / Digital Arrest Impersonation',
      explanation: 'Coercive language impersonating CBI/Customs/Police with threats of FIR/arrest.',
      confidence: 98,
      weight: 45,
    });
  }

  if (/guaranteed.*return|100% profit|crypto arbitrage|daily roi|deposit.*usdt/i.test(lower)) {
    score += 35;
    indicators.push({
      name: 'High-Yield Investment / Ponzi Lure',
      explanation: 'Unrealistic return promises characteristic of crypto or forex investment fraud.',
      confidence: 92,
      weight: 35,
    });
  }

  if (/electricity.*disconnected|sim card.*blocked|kyc.*expire|update aadhaar/i.test(lower)) {
    score += 35;
    indicators.push({
      name: 'Urgent KYC / Service Disconnection Threat',
      explanation: 'Artificial panic created by threatening essential utility disconnection.',
      confidence: 94,
      weight: 35,
    });
  }

  // URL flags
  if (entities.some((e) => e.type === 'URL' && e.risk === 'Critical')) {
    score += 25;
    indicators.push({
      name: 'Unverified Domain / Phishing Landing Link',
      explanation: 'Suspicious top-level domain identified in body text.',
      confidence: 90,
      weight: 25,
    });
  }

  // Clamp score
  score = Math.min(Math.max(score, 5), 99);

  let riskLevel = 'Low';
  if (score >= 85) riskLevel = 'Critical';
  else if (score >= 65) riskLevel = 'High';
  else if (score >= 40) riskLevel = 'Medium';

  return { riskScore: score, riskLevel, indicators };
};
