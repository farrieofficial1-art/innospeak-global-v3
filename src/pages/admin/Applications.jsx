import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import DataTable from '../../components/portal/DataTable.jsx';
import StatusBadge from '../../components/portal/StatusBadge.jsx';
import SelectField from '../../components/ui/SelectField.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listApplications, updateApplicationStatus } from '../../lib/supabase/admin';

const STATUS_OPTIONS = ['submitted', 'under_review', 'additional_info_required', 'accepted', 'rejected', 'enrolled'];

export default function Applications() {
  const [state, setState] = useState({ loading: true, error: null, applications: [] });

  function load() {
    listApplications()
      .then((applications) => setState({ loading: false, error: null, applications }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load applications.', applications: [] }));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id, status) {
    try {
      await updateApplicationStatus(id, status);
      load();
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message || 'Could not update this application.' }));
    }
  }

  const columns = [
    { key: 'application_number', label: 'Application #' },
    { key: 'name', label: 'Applicant', render: (r) => `${r.first_name || ''} ${r.last_name || ''}`.trim() || r.full_name || '—' },
    {
      key: 'division',
      label: 'Division',
      render: (r) => {
        if (!r.division) return '—';
        return r.division === 'labs' ? 'Labs' : r.division === 'academy' ? 'Academy' : r.division;
      },
    },
    { key: 'programme', label: 'Programme', render: (r) => r.programme || r.course_code || '—' },
    { key: 'email', label: 'Email' },
    { key: 'created_at', label: 'Submitted', render: (r) => new Date(r.created_at).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      label: 'Update',
      render: (r) => (
        <SelectField
          name={`app-status-${r.id}`}
          value={r.status}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          options={STATUS_OPTIONS}
          className="min-w-[9rem]"
        />
      ),
    },
  ];

  return (
    <>
      <Seo title="Applications" description="Review and action admission applications." path="/admin/applications" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Admin Panel</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Applications</h1>
        <p className="mt-2 font-body text-sm text-navy-500">
          Admissions submitted via the public Apply form. Approving an application does not yet automatically
          create a student account — use Students → Create Student Account once you're ready to admit them.
        </p>
      </div>

      <div className="mt-6">
        <SectionCard>
          {state.loading && <LoadingState />}
          {!state.loading && state.error && <ErrorState message={state.error} />}
          {!state.loading && !state.error && state.applications.length === 0 && (
            <EmptyState icon={ClipboardList} title="No applications yet" message="Submitted admission applications will appear here." />
          )}
          {!state.loading && !state.error && state.applications.length > 0 && <DataTable columns={columns} rows={state.applications} />}
        </SectionCard>
      </div>
    </>
  );
}
