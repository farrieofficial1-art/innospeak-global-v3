import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import { TextField, Button } from '../components/ui';
import { signUp } from '../lib/supabase/auth';

export default function SignUp() {
  const navigate = useNavigate();

  const [data, setData] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!data.fullName.trim()) e.fullName = 'Required';
    if (!data.email.trim()) e.email = 'Required';
    if (!data.password) e.password = 'Required';
    else if (data.password.length < 8) e.password = 'At least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');
      await signUp({ email: data.email, password: data.password, fullName: data.fullName });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <Seo title="Check Your Email" path="/sign-up" />
        <section className="flex min-h-screen items-center bg-cream py-32">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-navy-100 bg-white p-10 text-center shadow-premium-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10">
                <CheckCircle2 size={32} className="text-gold-600" aria-hidden="true" />
              </div>
              <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">Check Your Email</h1>
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">
                We've sent a confirmation link to <strong>{data.email}</strong>. Confirm your email to
                finish creating your account, then sign in.
              </p>
              <Button to="/sign-in" variant="outline" size="md" className="mt-8" withArrow={false}>
                Go to Sign In
              </Button>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo title="Create Account" path="/sign-up" />
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
              <UserPlus size={22} aria-hidden="true" />
            </div>

            <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">Create Your Account</h1>
            <p className="mt-2 font-body text-sm text-navy-600">
              Start learning with InnoSpeak Global.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <TextField
                label="Full Name"
                name="fullName"
                required
                value={data.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                error={errors.fullName}
                placeholder="Jane Doe"
              />
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
                placeholder="At least 8 characters"
              />
            </div>

            {submitError && (
              <p className="mt-4 font-body text-sm font-semibold text-red-600">{submitError}</p>
            )}

            <Button type="submit" variant="gold" size="lg" className="mt-8 w-full" disabled={isSubmitting} withArrow={false}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="mt-6 text-center font-body text-sm text-navy-600">
              Already have an account?{' '}
              <Link to="/sign-in" className="font-semibold text-gold-600 hover:underline">
                Sign in
              </Link>
            </p>
          </motion.form>
        </div>
      </section>
    </>
  );
}