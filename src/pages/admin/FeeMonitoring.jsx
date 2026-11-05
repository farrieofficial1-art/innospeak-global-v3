import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listAdminFeeBalances, listAdminFeePayments } from '../../lib/supabase/portal.js';

const currency = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function FeeMonitoring() {
  const [balances, setBalances] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('outstanding');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([listAdminFeeBalances(), listAdminFeePayments()])
      .then(([b, p]) => {
        if (cancelled) return;
        setBalances(b);
        setPayments(p);
        setError('');
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Could not load fee records.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const visible = useMemo(() => {
    if (filter === 'overdue') return balances.filter((b) => b.isOverdue);
    if (filter === 'outstanding') return balances.filter((b) => b.balanceUsd > 0);
    return balances;
  }, [balances, filter]);

  const totals = useMemo(
    () =>
      balances.reduce(
        (acc, b) => ({
          tuition: acc.tuition + b.tuitionUsd,
          paid: acc.paid + b.paidUsd,
          outstanding: acc.outstanding + Math.max(b.balanceUsd, 0),
          overdue: acc.overdue + (b.isOverdue ? 1 : 0),
        }),
        { tuition: 0, paid: 0, outstanding: 0, overdue: 0 },
      ),
    [balances],
  );

  return (
    <>
      <Seo title="Fee Monitoring" description="Student fee balances and payment history." path="/admin/fees" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Finance</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Fee Monitoring</h1>
          <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-navy-500">
            Track every enrolment's balance and the verified payments behind it.
          </p>
        </div>
        <button type="button" onClick={() => setReloadKey((k) => k + 1)} className="btn-outline inline-flex shrink-0 items-center gap-2 text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && (
        <SectionCard className="mt-6">
          <LoadingState />
        </SectionCard>
      )}

      {error && !loading && <ErrorState message={error} />}

      {!loading && !error && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <Tile label="Total tuition" value={currency(totals.tuition)} />
            <Tile label="Collected" value={currency(totals.paid)} />
            <Tile label="Outstanding" value={currency(totals.outstanding)} />
            <Tile label="Past deadline" value={String(totals.overdue)} tone={totals.overdue > 0 ? 'warn' : 'neutral'} />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              ['outstanding', 'With balance'],
              ['overdue', 'Past deadline'],
              ['all', 'All enrolments'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
                  filter === key ? 'bg-navy-900 text-white' : 'border border-navy-100 bg-white text-navy-600 hover:border-navy-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <SectionCard className="mt-4">
            {visible.length === 0 ? (
              <EmptyState title="No enrolments match this filter" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left font-body text-sm">
                  <thead className="text-xs uppercase tracking-wider text-navy-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Student</th>
                      <th className="px-4 py-3 font-semibold">Course</th>
                      <th className="px-4 py-3 font-semibold">Deadline</th>
                      <th className="px-4 py-3 text-right font-semibold">Tuition</th>
                      <th className="px-4 py-3 text-right font-semibold">Paid</th>
                      <th className="px-4 py-3 text-right font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((b) => (
                      <tr key={b.enrollmentId} className="border-t border-navy-100">
                        <td className="px-4 py-3 text-navy-900">{b.studentName || b.studentId.slice(0, 8)}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-navy-900">{b.courseTitle}</p>
                          <p className="font-mono text-xs text-navy-500">{b.courseCode} · {b.termName}</p>
                        </td>
                        <td className={`px-4 py-3 ${b.isOverdue ? 'font-semibold text-amber-800' : 'text-navy-700'}`}>
                          {b.isOverdue && <AlertTriangle size={12} className="mr-1 inline text-amber-700" />}
                          {formatDate(b.feeDeadline)}
                        </td>
                        <td className="px-4 py-3 text-right text-navy-900">{currency(b.tuitionUsd)}</td>
                        <td className="px-4 py-3 text-right text-navy-900">{currency(b.paidUsd)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-navy-900">{currency(Math.max(b.balanceUsd, 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard className="mt-6" title="Payment history">
            {payments.length === 0 ? (
              <EmptyState title="No verified payments yet" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left font-body text-sm">
                  <thead className="text-xs uppercase tracking-wider text-navy-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Receipt</th>
                      <th className="px-4 py-3 font-semibold">Student</th>
                      <th className="px-4 py-3 font-semibold">Course</th>
                      <th className="px-4 py-3 font-semibold">Method</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-t border-navy-100">
                        <td className="px-4 py-3 font-mono text-xs text-navy-900">{p.receiptNumber}</td>
                        <td className="px-4 py-3 text-navy-900">{p.studentName || '-'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-navy-700">{p.courseCode}</td>
                        <td className="px-4 py-3 capitalize text-navy-700">{p.provider.replace('_', ' ')}</td>
                        <td className="px-4 py-3 text-navy-700">{formatDate(p.paidAt)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-navy-900">{currency(p.amountUsd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </>
      )}
    </>
  );
}

function Tile({ label, value, tone = 'neutral' }) {
  const toneClass = tone === 'warn' ? 'border-amber-200 bg-amber-50' : 'border-navy-100 bg-white';
  return (
    <div className={`rounded-2xl border p-5 shadow-premium ${toneClass}`}>
      <p className="font-body text-xs font-semibold uppercase tracking-wider text-navy-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-navy-900">{value}</p>
    </div>
  );
}
