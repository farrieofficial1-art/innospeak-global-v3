import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import { TextField, Button } from '../components/ui';
import { signIn } from '../lib/supabase/auth';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  const [data, setData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!data.email.trim()) e.email = 'Required';
    if (!data.password) e.password = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');
      await signIn(data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Seo title="Sign In" path="/sign-in" />
      <section className="flex min-h-screen items-center bg-cream py-32">
        <div className="container-premium">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="mx-auto max-w-md rounded-3xl border border-navy-100 bg-white p-8 shadow-premium-lg md:p-10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <LogIn size={22} aria-hidden="true" />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">Welcome Back</h1>
            <p className="mt-2 font-body text-sm text-navy-600">
              Sign in to continue your learning journey.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <TextField
                label="Email Address"
                name="email"
                type="email"
                required
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                error={errors.email}
                placeholder="jane@example.com"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                required
                value={data.password}
                onChange={(e) => update('password', e.target.value)}
                error={errors.password}
                placeholder="••••••••"
              />
            </div>

            {submitError && (
              <p className="mt-4 font-body text-sm font-semibold text-red-600">{submitError}</p>
            )}

            <Button type="submit" variant="gold" size="lg" className="mt-8 w-full" disabled={isSubmitting} withArrow={false}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="mt-6 text-center font-body text-sm text-navy-600">
              Don't have an account?{' '}
              <Link to="/sign-up" className="font-semibold text-gold-600 hover:underline">
                Create one
              </Link>
            </p>
          </motion.form>
        </div>
      </section>
    </>
  );
}