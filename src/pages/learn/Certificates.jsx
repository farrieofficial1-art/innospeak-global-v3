import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, ExternalLink, ShieldCheck, Download, Copy, Check,
  ArrowLeft, X, Calendar, Hash, User, BookOpen, Building2, Printer,
} from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import StatusBadge from '../../components/portal/StatusBadge.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listMyCertificates, getMyCertificate } from '../../lib/supabase/lms';

function CertificateDocument({ cert }) {
  if (!cert) return null;
  const issueDate = new Date(cert.issue_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const completionDate = new Date(cert.completion_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const verifyUrl = `${window.location.origin}/verify-certificate/${cert.certificate_number}`;

  return (
    <div className="certificate-print-area mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl border-4 border-gold-500 bg-white p-8 shadow-premium-lg sm:p-12">
        {/* Decorative corner ornaments */}
        <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 border-l-4 border-t-4 border-navy-900 rounded-tl-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 border-r-4 border-t-4 border-navy-900 rounded-tr-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 border-b-4 border-l-4 border-navy-900 rounded-bl-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 border-b-4 border-r-4 border-navy-900 rounded-br-3xl" />

        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Award size={200} className="text-navy-50 opacity-80" />
        </div>

        <div className="relative z-10 text-center">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900">
              <Award size={28} className="text-gold-400" />
            </div>
            <p className="font-display text-lg font-bold tracking-wide text-navy-900">InnoSpeak Global</p>
            <div className="mt-1 h-px w-32 bg-gold-500" />
          </div>

          {/* Title */}
          <p className="mt-6 font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            Certificate of Completion
          </p>

          {/* Student name */}
          <p className="mt-6 font-body text-sm text-navy-500">This certifies that</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            {cert.student_name}
          </p>

          {/* Course title */}
          <p className="mt-4 font-body text-sm text-navy-500">has successfully completed</p>
          <p className="mt-2 font-display text-xl font-bold text-navy-800 sm:text-2xl">
            {cert.course_title}
          </p>

          {/* Dates */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-body text-xs text-navy-500">
            <span>Completed: <strong className="text-navy-700">{completionDate}</strong></span>
            <span>Issued: <strong className="text-navy-700">{issueDate}</strong></span>
          </div>

          {/* Instructor */}
          {cert.instructor_name && (
            <p className="mt-4 font-body text-xs text-navy-500">
              Instructor: <strong className="text-navy-700">{cert.instructor_name}</strong>
            </p>
          )}

          {/* Signature line */}
          <div className="mt-10 flex items-end justify-center gap-12">
            <div className="text-center">
              <div className="h-8 w-40 border-b border-navy-300" />
              <p className="mt-1 font-body text-xs font-semibold text-navy-600">InnoSpeak Global</p>
              <p className="font-body text-xs text-navy-400">Issuing Organization</p>
            </div>
            {cert.instructor_name && (
              <div className="text-center">
                <div className="h-8 w-40 border-b border-navy-300" />
                <p className="mt-1 font-body text-xs font-semibold text-navy-600">{cert.instructor_name}</p>
                <p className="font-body text-xs text-navy-400">Instructor</p>
              </div>
            )}
          </div>

          {/* Certificate ID + verification */}
          <div className="mt-8 flex flex-col items-center gap-1">
            <p className="font-body text-xs text-navy-400">
              Certificate ID: <strong className="text-navy-600">{cert.certificate_number}</strong>
            </p>
            <p className="font-body text-xs text-navy-400">
              Verify at: {verifyUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificateDetailModal({ certificateId, onClose }) {
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!certificateId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getMyCertificate(certificateId);
      setCert(data);
    } catch (e) {
      setError(e.message || 'Could not load certificate.');
    } finally {
      setLoading(false);
    }
  }, [certificateId]);

  useEffect(() => { load(); }, [load]);

  const verifyUrl = cert
    ? `${window.location.origin}/verify-certificate/${cert.certificate_number}`
    : '';

  function handleCopyLink() {
    if (!verifyUrl) return;
    navigator.clipboard.writeText(verifyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <AnimatePresence>
      {certificateId && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 print:static print:bg-white print:p-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative my-8 w-full max-w-4xl rounded-3xl bg-cream p-6 shadow-premium-lg print:my-0 print:rounded-none print:bg-white print:p-0 print:shadow-none sm:p-8"
          >
            {/* Close button (hidden when printing) */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-lg bg-white/80 p-2 text-navy-600 shadow-sm hover:bg-white print:hidden"
            >
              <X size={20} />
            </button>

            {loading && <LoadingState />}
            {error && <ErrorState message={error} />}

            {cert && !loading && (
              <div>
                {/* Action bar (hidden when printing) */}
                <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="btn-gold inline-flex items-center gap-2"
                  >
                    <Printer size={16} /> Print / Save PDF
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2.5 font-body text-sm font-semibold text-navy-700 shadow-sm hover:bg-navy-50"
                  >
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    {copied ? 'Link Copied!' : 'Copy Verification Link'}
                  </button>
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2.5 font-body text-sm font-semibold text-navy-700 shadow-sm hover:bg-navy-50"
                  >
                    <ExternalLink size={16} /> Open Verification Page
                  </a>
                </div>

                {/* Certificate document */}
                <CertificateDocument cert={cert} />

                {/* Details grid (hidden when printing) */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2 print:hidden">
                  <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3">
                    <Hash size={16} className="text-gold-600" />
                    <div>
                      <p className="font-body text-xs text-navy-400">Certificate ID</p>
                      <p className="font-body text-sm font-semibold text-navy-800">{cert.certificate_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <div>
                      <p className="font-body text-xs text-navy-400">Status</p>
                      <StatusBadge status={cert.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3">
                    <Calendar size={16} className="text-gold-600" />
                    <div>
                      <p className="font-body text-xs text-navy-400">Issue Date</p>
                      <p className="font-body text-sm font-semibold text-navy-800">
                        {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3">
                    <BookOpen size={16} className="text-gold-600" />
                    <div>
                      <p className="font-body text-xs text-navy-400">Course</p>
                      <p className="font-body text-sm font-semibold text-navy-800">{cert.course_title}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function Certificates() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCertId, setSelectedCertId] = useState(null);

  useEffect(() => {
    listMyCertificates()
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  return (
    <>
      <Seo
        title="My Certificates"
        description="Your verified InnoSpeak Global learning credentials."
        path="/learn/certificates"
      />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Credentials</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">My Certificates</h1>
        <p className="mt-2 font-body text-sm text-navy-500">
          Completed courses issue verifiable credentials. Click a certificate to view, print, or share.
        </p>
      </div>

      {loading && <div className="mt-8"><LoadingState /></div>}
      {error && (
        <div className="mt-5 rounded-xl bg-rose-50 p-4 font-body text-sm text-rose-700">{error}</div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="mt-8">
          <SectionCard>
            <EmptyState
              icon={Award}
              title="No certificates yet"
              message="Complete an eligible course to receive a verifiable certificate."
            />
          </SectionCard>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {data.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCertId(c.id)}
              className="group text-left"
            >
              <SectionCard className="transition-all group-hover:border-gold-300 group-hover:shadow-premium-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-700">
                    <Award size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-display text-sm font-bold text-navy-900">
                      {c.course_title || c.lms_courses?.title || 'Course Certificate'}
                    </h2>
                    <p className="font-body text-xs text-navy-400">{c.certificate_number}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-4 flex items-center gap-4 font-body text-xs text-navy-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} /> Issued {new Date(c.issue_date).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    {c.status === 'active' ? 'Verified' : 'Revoked'}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 font-body text-xs font-semibold text-gold-700">
                  <ExternalLink size={13} /> View certificate
                </div>
              </SectionCard>
            </button>
          ))}
        </div>
      )}

      <CertificateDetailModal
        certificateId={selectedCertId}
        onClose={() => setSelectedCertId(null)}
      />
    </>
  );
}
