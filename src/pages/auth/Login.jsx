import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, TriangleAlert } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import { signInWithIdentifier } from '../../lib/supabase/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/portal';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithIdentifier({ identifier, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not log you in. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Seo title="Log In" description="Log in to your InnoSpeak Global student portal." path="/login" />

      <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-navy-gradient py-20">
        <div className="pointer-events-none absolute inset-0 bg-navy-radial opacity-60" />
        <div className="container-premium relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-premium-lg sm:p-10"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
              <LogIn size={22} />
            </div>
            <h1 className="mt-5 text-center font-display text-2xl font-bold text-navy-900">
              Welcome back
            </h1>
            <p className="mt-2 text-center font-body text-sm text-navy-500">
              Log in with your Student ID or email to access your portal.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="identifier" className="mb-1.5 block font-body text-xs font-semibold text-navy-700">
                  Student ID or Email
                </label>
                <input
                  id="identifier"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="e.g. ISG-2026-0001 or you@email.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 transition-colors duration-200 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                />
                <p className="mt-1.5 font-body text-xs text-navy-400">
                  Newly admitted students: use the Student ID and temporary password issued by the institution.
                </p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="font-body text-xs font-semibold text-navy-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="font-body text-xs font-semibold text-gold-600 hover:text-gold-700">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 transition-colors duration-200 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                />
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
                {isSubmitting ? 'Logging in\u2026' : 'Log In'}
              </motion.button>
            </form>

            <p className="mt-6 text-center font-body text-sm text-navy-500">
              Don&rsquo;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-gold-600 hover:text-gold-700">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}