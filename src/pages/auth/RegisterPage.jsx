import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all fields (Name, Email, Password).');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-200 flex items-center justify-center p-4 cyber-grid-bg font-sans">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-glow">
            <Shield className="w-7 h-7 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-slate-100">
            Register Account
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Create your CrimeVision account
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-slate-400 uppercase block mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ajit Kumar"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 uppercase block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ajit@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 uppercase block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs font-mono text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
