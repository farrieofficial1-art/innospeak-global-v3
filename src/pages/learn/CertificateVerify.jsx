import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Search, ShieldCheck, XCircle, Award, Calendar, Hash,
  User, BookOpen, Building2, Printer, AlertTriangle, ArrowLeft,
} from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { verifyCertificate } from '../../lib/supabase/platform.js';

function VerifyResultCard({ result, onPrint }) {
  if (!result) return null;
  const isValid = result.valid;
  const isRevoked = result.status === 'revoked';

  return (
    <div
      className={`mt-6 rounded-2xl border p-6 ${
        isValid
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-rose-200 bg-rose-50'
      }`}
    >
      <div className="flex items-center gap-3">
        {isValid ? (
          <ShieldCheck size={28} className="text-emerald-600" />
        ) : (
          <XCircle size={28} className="text-rose-600" />
        )}
        <div>
          <p
            className={`font-display text-lg font-bold ${
              isValid ? 'text-emerald-900' : 'text-rose-900'
            }`}
          >
            {isValid ? 'Certificate Verified' : 'Certificate Invalid'}
          </p>
          <p
            className={`font-body text-sm ${
              isValid ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isValid
              ? 'This certificate is valid and active.'
              : isRevoked
                ? 'This certificate has been revoked.'
                : 'No matching certificate was found.'}
          </p>
        </div>
      </div>

      {result.found && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoItem icon={Hash} label="Certificate ID" value={result.certificate_number} />
            <InfoItem icon={User} label="Student Name" value={result.student_name} />
            <InfoItem icon={BookOpen} label="Course" value={result.course_title} />
            <InfoItem icon={Building2} label="Issuing Organization" value={result.issuing_organization} />
            <InfoItem
              icon={Calendar}
              label="Issue Date"
              value={new Date(result.issue_date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            />
            <InfoItem
              icon={Calendar}
              label="Completion Date"
              value={new Date(result.completion_date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            />
            {result.instructor_name && (
              <InfoItem icon={User} label="Instructor" value={result.instructor_name} />
            )}
            <InfoItem icon={ShieldCheck} label="Status" value={result.status} />
          </div>

          {isRevoked && result.revoke_reason && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-rose-700">
                  Revocation Reason
                </p>
                <p className="mt-1 font-body text-sm text-rose-800">{result.revoke_reason}</p>
              </div>
            </div>
          )}

          {isValid && (
            <div className="mt-6 print:hidden">
              <button
                onClick={onPrint}
                className="btn-gold inline-flex items-center gap-2"
              >
                <Printer size={16} /> Print Certificate
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-gold-700">
        <Icon size={16} />
      </span>
      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-navy-400">
          {label}
        </p>
        <p className="mt-0.5 font-body text-sm font-semibold text-navy-800">{value || '—'}</p>
      </div>
    </div>
  );
}

function PrintableCertificate({ result }) {
  if (!result || !result.valid) return null;
  const issueDate = new Date(result.issue_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const completionDate = new Date(result.completion_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="hidden print:block">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border-4 border-gold-500 bg-white p-12">
        <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 border-l-4 border-t-4 border-navy-900 rounded-tl-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 border-r-4 border-t-4 border-navy-900 rounded-tr-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 border-b-4 border-l-4 border-navy-900 rounded-bl-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 border-b-4 border-r-4 border-navy-900 rounded-br-3xl" />

        <div className="relative z-10 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900">
              <Award size={28} className="text-gold-400" />
            </div>
            <p className="font-display text-lg font-bold tracking-wide text-navy-900">
              InnoSpeak Global
            </p>
            <div className="mt-1 h-px w-32 bg-gold-500" />
          </div>

          <p className="mt-6 font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            Certificate of Completion
          </p>
          <p className="mt-6 font-body text-sm text-navy-500">This certifies that</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy-900">
            {result.student_name}
          </p>
          <p className="mt-4 font-body text-sm text-navy-500">has successfully completed</p>
          <p className="mt-2 font-display text-xl font-bold text-navy-800">
            {result.course_title}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-body text-xs text-navy-500">
            <span>Completed: <strong className="text-navy-700">{completionDate}</strong></span>
            <span>Issued: <strong className="text-navy-700">{issueDate}</strong></span>
          </div>

          {result.instructor_name && (
            <p className="mt-4 font-body text-xs text-navy-500">
              Instructor: <strong className="text-navy-700">{result.instructor_name}</strong>
            </p>
          )}

          <div className="mt-10 flex items-end justify-center gap-12">
            <div className="text-center">
              <div className="h-8 w-40 border-b border-navy-300" />
              <p className="mt-1 font-body text-xs font-semibold text-navy-600">InnoSpeak Global</p>
              <p className="font-body text-xs text-navy-400">Issuing Organization</p>
            </div>
            {result.instructor_name && (
              <div className="text-center">
                <div className="h-8 w-40 border-b border-navy-300" />
                <p className="mt-1 font-body text-xs font-semibold text-navy-600">{result.instructor_name}</p>
                <p className="font-body text-xs text-navy-400">Instructor</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-1">
            <p className="font-body text-xs text-navy-400">
              Certificate ID: <strong className="text-navy-600">{result.certificate_number}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificateVerify() {
  const { certificateId } = useParams();
  const [searchParams] = useSearchParams();
  const initialNumber = certificateId || searchParams.get('number') || searchParams.get('id') || '';
  const [number, setNumber] = useState(initialNumber);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const doVerify = useCallback(async (num) => {
    if (!num || !num.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setSearched(true);
    try {
      const data = await verifyCertificate(num);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Could not verify certificate.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialNumber) {
      doVerify(initialNumber);
    }
  }, [initialNumber, doVerify]);

  function submit(e) {
    e.preventDefault();
    doVerify(number);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <Seo
        title="Certificate Verification"
        description="Verify an InnoSpeak Global certificate."
        path={`/verify-certificate${initialNumber ? `/${initialNumber}` : ''}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white">
        <div className="container-premium py-16 sm:py-20">
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-300">
            Credential Verification
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Verify a Certificate
          </h1>
          <p className="mt-4 max-w-2xl font-body text-sm text-navy-200">
            Enter a certificate ID or open a verification link to confirm its authenticity.
            No account is needed — verification is available to the public.
          </p>
        </div>
      </section>

      <div className="container-premium py-12">
        {/* Search form (hidden when printing) */}
        <div className="print:hidden">
          <SectionCard>
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="e.g. ISG-2026-..."
                className="flex-1 rounded-xl border border-navy-200 px-4 py-3 font-body text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gold inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Search size={16} />
                {loading ? 'Checking…' : 'Verify'}
              </button>
            </form>
            {error && (
              <p className="mt-4 font-body text-sm text-rose-600">{error}</p>
            )}
          </SectionCard>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 print:hidden">
            <VerifyResultCard result={result} onPrint={handlePrint} />
          </div>
        )}

        {/* No result found */}
        {searched && !loading && !result && !error && (
          <div className="mt-6 print:hidden">
            <div className="flex items-center gap-3 rounded-xl bg-navy-50 p-5">
              <XCircle size={20} className="text-rose-600" />
              <p className="font-body text-sm font-semibold text-navy-800">
                No matching certificate was found for "{number}".
              </p>
            </div>
          </div>
        )}

        {/* Printable certificate (only visible when printing) */}
        <PrintableCertificate result={result} />
      </div>
    </>
  );
}
