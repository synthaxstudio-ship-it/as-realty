import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useAuth, AuthMode } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    signup,
    resetPassword,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sync internal mode with context
  useEffect(() => {
    setMode(authModalMode);
    setErrorMessage(null);
    setSuccessNotice(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhone('');
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (mode === 'reset') {
      setIsLoading(true);
      const res = await resetPassword(email);
      setIsLoading(false);
      if (res.success) {
        setSuccessNotice('A password reset link has been dispatched to your email address.');
      } else {
        setErrorMessage(res.error || 'Failed to send reset link. Please try again.');
      }
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }

      setIsLoading(true);
      const res = await signup(email, password, {
        full_name: fullName,
        phone,
      });
      setIsLoading(false);

      if (res.success) {
        if (res.needsEmailConfirmation) {
          setSuccessNotice(
            `Account created! We've sent a verification link to ${email}. Please check your inbox (or spam) to complete verification, then sign in.`
          );
        } else {
          setSuccessNotice('Welcome to AS Realty! Your VIP client account is now active.');
          setTimeout(() => {
            closeAuthModal();
            resetFields();
          }, 1500);
        }
      } else {
        setErrorMessage(res.error || 'Unable to register. Please check your details.');
      }
      return;
    }

    // Login mode
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      resetFields();
    } else {
      setErrorMessage(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#001730]/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md bg-white border border-slate-200 border-b-4 border-b-[#002347] rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col transition-all"
      >
        {/* Luxury Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#002347] via-[#C5A059] to-[#E6C687]" />

        {/* Modal Header */}
        <div className="p-6 pb-4 bg-[#F8F9FA] border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#002347] text-[#E6C687] border border-[#C5A059]/40 flex items-center justify-center shadow-md shrink-0">
              {mode === 'login' && <Lock className="w-5 h-5" />}
              {mode === 'signup' && <Sparkles className="w-5 h-5" />}
              {mode === 'reset' && <KeyRound className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">
                  AS Realty Private Portal
                </span>
              </div>
              <h3 className="text-xl font-serif-luxury font-bold text-[#002347]">
                {mode === 'login' && 'VIP Client Sign In'}
                {mode === 'signup' && 'Create Client Account'}
                {mode === 'reset' && 'Reset Password'}
              </h3>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher for Login / Signup */}
        {mode !== 'reset' && (
          <div className="flex border-b border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
                mode === 'login'
                  ? 'border-[#002347] text-[#002347] bg-slate-50/50'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'border-[#002347] text-[#002347] bg-slate-50/50'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Banner */}
          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successNotice}</div>
            </div>
          )}

          {/* SIGNUP: Full Name */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-[#C5A059]">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>
          )}

          {/* SIGNUP: Phone */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone / WhatsApp Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>
          )}

          {/* ALL: Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-[#C5A059]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          {/* LOGIN & SIGNUP: Password */}
          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password <span className="text-[#C5A059]">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('reset')}
                    className="text-[11px] text-[#C5A059] hover:text-[#B8924B] font-semibold transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must be at least 6 characters.
                </span>
              )}
            </div>
          )}

          {/* SIGNUP: Confirm Password */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password <span className="text-[#C5A059]">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#002347] via-[#001730] to-[#002347] hover:from-[#001730] hover:to-[#002347] text-[#E6C687] font-bold text-xs uppercase tracking-wider shadow-lg border border-[#C5A059]/40 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#E6C687] border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to Client Portal'}
                  {mode === 'signup' && 'Register VIP Client Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </>
            )}
          </button>

          {/* Mode Footer Switching Links */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'login' && (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="text-[#002347] font-bold hover:text-[#C5A059] underline ml-1 cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="text-[#002347] font-bold hover:text-[#C5A059] underline ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="text-[#002347] font-bold hover:text-[#C5A059] underline ml-1 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </form>

        {/* Security Assurance Footer */}
        <div className="p-3 bg-[#F8F9FA] border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured by Supabase Authentication &amp; 256-bit SSL Encryption</span>
        </div>
      </div>
    </div>
  );
};
