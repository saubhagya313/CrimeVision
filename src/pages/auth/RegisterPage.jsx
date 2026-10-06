import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillDemoData = () => {
    setFormData({
      name: 'Ajit Kumar',
      email: 'ajit.citizen@example.com',
      phone: '+91 98765 43210',
      address: 'Sector 62',
      city: 'Noida',
      pincode: '201301',
      password: 'password123',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please provide your name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim() || 'Noida',
        state: 'Uttar Pradesh',
        pincode: formData.pincode.trim() || '201301',
        password: formData.password,
      });

      setSuccess('Account created! Redirecting...');
      setTimeout(() => {
        if (res?.user?.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 700);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-200 flex items-center justify-center p-4 cyber-grid-bg relative overflow-hidden font-sans">
      {/* Ambient background light */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-5 relative z-10 my-4">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-glow">
            <Shield className="w-7 h-7 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-slate-400">
            Sign up to report cyber threats & receive resolution PDFs
          </p>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Minimal Clean Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 text-[11px] font-mono block mb-1 uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ajit Kumar"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 text-[11px] font-mono block mb-1 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] font-mono block mb-1 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] font-mono block mb-1 uppercase tracking-wider">
              Residential Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House / Flat / Area"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-400 text-[11px] font-mono block mb-1 uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Noida / Delhi"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs font-sans"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[11px] font-mono block mb-1 uppercase tracking-wider">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="201301"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] font-mono block mb-1 uppercase tracking-wider">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Minimal 1-line note */}
          <p className="text-[10px] text-cyan-400/80 font-mono text-center pt-1">
            📧 Solved case PDF reports will be sent to your registered email.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
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

        {/* Demo Fill & Sign In Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <button
            type="button"
            onClick={handleFillDemoData}
            className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Demo Fill</span>
          </button>

          <div className="text-slate-400">
            Have an account?{' '}
            <Link to="/login" className="text-cyan-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
