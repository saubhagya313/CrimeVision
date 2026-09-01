import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await login(email.trim().toLowerCase(), password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-200 flex items-center justify-center p-4 cyber-grid-bg relative overflow-hidden font-sans">
      {/* Visual Ambient Light Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6 relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-glow">
            <Shield className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Crime<span className="text-cyan-400">Vision</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
