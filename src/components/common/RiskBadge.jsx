import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

const RiskBadge = ({ level = 'Low', showIcon = true, className = '' }) => {
  const getBadgeStyle = () => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-rose-950/60 text-rose-400 border-rose-500/40 shadow-rose-glow',
          icon: AlertOctagon,
          label: 'CRITICAL RISK'
        };
      case 'high':
        return {
          bg: 'bg-orange-950/60 text-orange-400 border-orange-500/40',
          icon: ShieldAlert,
          label: 'HIGH RISK'
        };
      case 'medium':
        return {
          bg: 'bg-amber-950/60 text-amber-400 border-amber-500/40',
          icon: AlertTriangle,
          label: 'MEDIUM RISK'
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
          icon: ShieldCheck,
          label: 'LOW RISK'
        };
    }
  };

  const style = getBadgeStyle();
  const IconComponent = style.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${style.bg} ${className}`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      {style.label}
    </span>
  );
};

export default RiskBadge;
