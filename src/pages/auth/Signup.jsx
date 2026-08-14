import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, TriangleAlert, CheckCircle2 } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import { signUpWithEmail } from '../../lib/supabase/auth';

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signUpWithEmail({ email, password, fullName });
      if (data.session) {
        navigate('/portal', { replace: true });
      } else {
        setNeedsVerification(true);
      }
    } catch (err) {
      setError(err.message || 'Could not create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Seo title="Sign Up" description="Create your InnoSpeak Global student account." path="/signup" />

      <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-navy-gradient py-20">
        <div className="pointer-events-none absolute inset-0 bg-navy-radial opacity-60" />
        <div className="container-premium relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-premium-lg sm:p-10"
          >
            {needsVerification ? (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
                  <CheckCircle2 size={22} />
                </div>
                <h1 className="mt-5 font-display text-2xl font-bold text-navy-900">Check your email</h1>
                <p className="mt-2 font-body text-sm text-navy-500">
                  We&rsquo;ve sent a confirmation link to <strong>{email}</strong>. Click it to activate
                  your account, then log in.
                </p>
                <Link to="/login" className="btn-gold mt-6 inline-block">
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
                  <UserPlus size={22} />
                </div>
                <h1 className="mt-5 text-center font-display text-2xl font-bold text-navy-900">
                  Create your account
                </h1>
                <p className="mt-2 text-center font-body text-sm text-navy-500">
                  Join the InnoSpeak Global student portal.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div>
                    <label htmlFor="fullName" className="mb-1.5 block font-body text-xs font-semibold text-navy-700">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 transition-colors duration-200 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block font-body text-xs font-semibold text-navy-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 transition-colors duration-200 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-1.5 block font-body text-xs font-semibold text-navy-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 transition-colors duration-200 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                    <p className="mt-1 font-body text-[11px] text-navy-400">At least 8 characters.</p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 font-body text-sm text-navy-800">
                      <TriangleAlert size={16} className="mt-0.5 shrink-0 text-gold-700" />
                      <span>{error}</span>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full disabled:opacity-60"
                  >
                    {isSubmitting ? 'Creating account\u2026' : 'Sign Up'}
                  </motion.button>
                </form>

                <p className="mt-6 text-center font-body text-sm text-navy-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-700">
                    Log in
                  </Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}