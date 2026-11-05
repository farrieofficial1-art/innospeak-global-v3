import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Receipt, RefreshCw } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import { getMyFeeStatement, listMyFeePayments } from '../../lib/supabase/portal.js';

const currency = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function FeeStatement() {
  const [lines, setLines] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getMyFeeStatement(), listMyFeePayments()])
      .then(([statement, payments]) => {
        if (cancelled) return;
        setLines(statement);
        setReceipts(payments);
        setError('');
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Could not load your fee statement. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const totals = lines.reduce(
    (acc, l) => ({
      tuition: acc.tuition + l.tuitionUsd,
      paid: acc.paid + l.paidUsd,
      balance: acc.balance + Math.max(l.balanceUsd, 0),
    }),
    { tuition: 0, paid: 0, balance: 0 },
  );
  const overdueCount = lines.filter((l) => l.isOverdue).length;
  const courseName = (enrollmentId) => lines.find((l) => l.enrollmentId === enrollmentId)?.courseCode || '';

  return (
    <>
      <Seo title="Fees & Payments" description="Your term fee statement, balances and receipts." path="/learn/fees" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Fees</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Fees & Payments</h1>
          <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-navy-500">
            You can keep learning while you pay. Clear your balance by each term's fee deadline.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="btn-outline inline-flex shrink-0 items-center gap-2 text-sm"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-body text-sm text-navy-800">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading && <p className="mt-6 font-body text-sm text-navy-500">Loading your statement…</p>}

      {!loading && !error && lines.length === 0 && (
        <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 font-body text-sm text-navy-600">
          You have no enrolments yet. Enrolled courses and their fee balances will appear here.
        </div>
      )}

      {!loading && !error && lines.length > 0 && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <SummaryTile label="Total tuition" value={currency(totals.tuition)} />
            <SummaryTile label="Amount paid" value={currency(totals.paid)} />
            <SummaryTile
              label="Outstanding balance"
              value={currency(totals.balance)}
              tone={totals.balance > 0 ? 'warn' : 'ok'}
            />
          </div>

          {overdueCount > 0 && (
            <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-body text-sm text-amber-950">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-700" />
              <span>
                {overdueCount} course{overdueCount === 1 ? '' : 's'} past the fee deadline still have a balance. Learning stays open, but please clear the balance as soon as possible.
              </span>
            </div>
          )}

          <div className="mt-6 overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-premium">
            <table className="w-full min-w-[640px] text-left font-body text-sm">
              <thead className="bg-navy-50 text-xs uppercase tracking-wider text-navy-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Term</th>
                  <th className="px-4 py-3 font-semibold">Deadline</th>
                  <th className="px-4 py-3 text-right font-semibold">Tuition</th>
                  <th className="px-4 py-3 text-right font-semibold">Paid</th>
                  <th className="px-4 py-3 text-right font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.enrollmentId} className="border-t border-navy-100">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy-900">{l.courseTitle}</p>
                      <p className="font-mono text-xs text-navy-500">{l.courseCode}</p>
                    </td>
                    <td className="px-4 py-3 text-navy-700">{l.termName}</td>
                    <td className={`px-4 py-3 ${l.isOverdue ? 'font-semibold text-amber-800' : 'text-navy-700'}`}>
                      {formatDate(l.feeDeadline)}
                    </td>
                    <td className="px-4 py-3 text-right text-navy-900">{currency(l.tuitionUsd)}</td>
                    <td className="px-4 py-3 text-right text-navy-900">{currency(l.paidUsd)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy-900">
                      {l.balanceUsd > 0 ? currency(l.balanceUsd) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 size={14} /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !error && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold text-navy-900">Receipts</h2>
          {receipts.length === 0 ? (
            <p className="mt-2 font-body text-sm text-navy-500">No verified payments yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-premium">
              {receipts.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 font-body text-sm">
                  <span className="flex items-center gap-2 text-navy-900">
                    <Receipt size={16} className="text-gold-600" />
                    <span className="font-mono text-xs">{p.receipt_number}</span>
                    <span className="text-navy-500">{courseName(p.enrollment_id)}</span>
                  </span>
                  <span className="text-navy-600">
                    {formatDate(p.paid_at)} · {p.provider.replace('_', ' ')} · <span className="font-semibold text-navy-900">{currency(p.amount_usd)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}

function SummaryTile({ label, value, tone = 'neutral' }) {
  const toneClass = tone === 'warn' ? 'border-amber-200 bg-amber-50' : tone === 'ok' ? 'border-emerald-200 bg-emerald-50' : 'border-navy-100 bg-white';
  return (
    <div className={`rounded-2xl border p-5 shadow-premium ${toneClass}`}>
      <p className="font-body text-xs font-semibold uppercase tracking-wider text-navy-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-navy-900">{value}</p>
    </div>
  );
}
