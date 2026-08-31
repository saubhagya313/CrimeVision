import React from 'react';
import { Bot, User, FileText, ExternalLink, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatMessage = ({ message }) => {
  const navigate = useNavigate();
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-cyan-glow mt-1">
          <Bot className="w-5 h-5 stroke-[2.5]" />
        </div>
      )}

      <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Header Label */}
        <div className={`flex items-center gap-2 text-[10px] font-mono text-slate-400 ${isUser ? 'justify-end' : ''}`}>
          <span>{isUser ? 'Investigator' : 'CrimeVision AI Assistant'}</span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Message Box */}
        <div
          className={`p-4 rounded-2xl text-xs leading-relaxed ${
            isUser
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 font-medium rounded-tr-none shadow-cyan-glow'
              : 'glass-panel border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap font-sans'
          }`}
        >
          {message.text}
        </div>

        {/* Source Evidence Pills if present */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Source Evidence References:
            </span>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/evidence/${src.evidenceId}`)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-[11px] border border-slate-700 transition-colors"
                >
                  <FileText className="w-3 h-3 text-cyan-400" />
                  <span>{src.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
