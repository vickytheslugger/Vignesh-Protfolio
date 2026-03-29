import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/update-password',
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mb-4"
      >
        <Link
          to="/admin"
          className="flex items-center text-slate-400 mb-8 group transition-colors"
        >
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.div>
          <span className="ml-3 text-sm group-hover:text-emerald-400 transition-colors">
            Back to Login
          </span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100 font-mono">
            Password Reset
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email to receive a secure reset link
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-emerald-400 text-sm font-medium">
              Reset link sent successfully!
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Check your email inbox for a password reset link. The link will
              expire in 1 hour. If you don't see it, check your spam folder.
            </p>
            <Link
              to="/admin"
              className="inline-block mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4"
            >
              Return to Login
            </Link>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md text-sm text-center"
              >
                {error}
              </motion.div>
            )}
            <div>
              <label className="sr-only">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="forgot-password-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600"
                  placeholder="Enter your admin email"
                />
              </div>
            </div>

            <button
              id="forgot-password-submit"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-70"
            >
              <Mail className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </motion.div>

      {/* Decorative scan line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 0.5 }}
        className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)]"
      />
    </div>
  );
}
