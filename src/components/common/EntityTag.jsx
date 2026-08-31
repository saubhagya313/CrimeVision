import React from 'react';
import { Phone, Mail, Link as LinkIcon, CreditCard, Hash, MapPin, Calendar, User, Building } from 'lucide-react';

export const getEntityIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'phone':
    case 'phone_number':
      return Phone;
    case 'email':
      return Mail;
    case 'url':
    case 'domain':
      return LinkIcon;
    case 'upi_id':
    case 'vpa':
    case 'bank_account':
    case 'bank':
      return CreditCard;
    case 'transaction_id':
    case 'txn_id':
    case 'ifsc':
      return Hash;
    case 'location':
    case 'ip_address':
      return MapPin;
    case 'date':
      return Calendar;
    case 'name':
      return User;
    default:
      return Building;
  }
};

export const EntityTag = ({ type, value, label, risk = 'Low', onClick }) => {
  const Icon = getEntityIcon(type);

  const getRiskStyle = () => {
    switch (risk?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-950/70 text-rose-300 border-rose-500/50 hover:bg-rose-900/80';
      case 'high':
        return 'bg-orange-950/70 text-orange-300 border-orange-500/50 hover:bg-orange-900/80';
      case 'medium':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/50 hover:bg-amber-900/80';
      default:
        return 'bg-slate-900/80 text-cyan-300 border-cyan-500/30 hover:bg-slate-800';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${getRiskStyle()}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="font-semibold">{value}</span>
      {label && <span className="opacity-60 text-[10px] uppercase">({label})</span>}
    </button>
  );
};

export const EntityCard = ({ type, value, label, risk = 'Low', details }) => {
  const Icon = getEntityIcon(type);

  return (
    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 flex items-start gap-3 hover:border-cyan-500/40 transition-all">
      <div className={`p-2 rounded-lg ${risk === 'Critical' || risk === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">{type}</span>
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${risk === 'Critical' ? 'bg-rose-950 text-rose-400 border-rose-500/40' : (risk === 'High' ? 'bg-orange-950 text-orange-400 border-orange-500/40' : 'bg-slate-800 text-slate-400 border-slate-700')}`}>
            {risk} RISK
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-100 font-mono truncate mt-0.5">{value}</p>
        {label && <p className="text-xs text-slate-400 mt-0.5">{label}</p>}
        {details && <p className="text-xs text-slate-500 mt-1 font-mono">{details}</p>}
      </div>
    </div>
  );
};

export default EntityTag;
