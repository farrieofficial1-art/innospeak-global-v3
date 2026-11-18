import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import TextField from '../../components/ui/TextField.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { ErrorState } from '../../components/portal/PortalStates.jsx';
import { useAuth } from '../../context/AuthContext';
import { updateStudentProfile } from '../../lib/supabase/studentPortal';

const EDITABLE_FIELD_GROUPS = [
  {
    title: 'Personal Information',
    description: 'Your basic identity details on file with the institution.',
    fields: [{ name: 'full_name', label: 'Full Name' }],
  },
  {
    title: 'Contact Information',
    description: 'How the institution reaches you.',
    fields: [{ name: 'phone', label: 'Phone Number' }],
  },
];

const READ_ONLY_FIELDS = [
  ['Date of Birth', 'date_of_birth'],
  ['Gender', 'gender'],
  ['National ID / Passport', 'national_id'],
  ['Address', 'address'],
  ['Emergency Contact', 'emergency_contact_name'],
  ['Emergency Phone', 'emergency_contact_phone'],
  ['Next of Kin', 'next_of_kin_name'],
  ['Next of Kin Phone', 'next_of_kin_phone'],
];

export default function Profile() {
  const { profile } = useAuth();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  function handleChange(name) {
    return (e) => {
      setSaved(false);
      setForm((prev) => ({ ...prev, [name]: e.target.value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updates = {};
      EDITABLE_FIELD_GROUPS.flatMap((g) => g.fields).forEach(({ name }) => {
        updates[name] = form[name] ?? null;
      });
      await updateStudentProfile(updates);
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Seo title="My Profile" description="Manage your student profile." path="/portal/profile" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Student Portal</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Profile</h1>
        <p className="mt-2 font-body text-sm text-navy-500">
          Keep your personal, contact and emergency details up to date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {EDITABLE_FIELD_GROUPS.map((group) => (
          <SectionCard key={group.title} title={group.title} description={group.description}>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type || 'text'}
                  value={form[field.name] || ''}
                  onChange={handleChange(field.name)}
                />
              ))}
            </div>
          </SectionCard>
        ))}

        <SectionCard title="Institution-Controlled Information" description="These details are managed by the institution. Contact support to request a correction.">
          <div className="grid gap-4 sm:grid-cols-2">
            {READ_ONLY_FIELDS.map(([label, name]) => (
              <div key={name} className="rounded-xl border border-navy-100 bg-navy-50/50 px-4 py-3">
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-navy-400">{label}</p>
                <p className="mt-1 font-body text-sm font-semibold text-navy-700">{form[name] || 'Not recorded'}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {error && <ErrorState message={error} />}
        {saved && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-body text-sm text-emerald-800">
            Your profile has been updated.
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-gold inline-flex items-center gap-2 disabled:opacity-60">
          <Save size={16} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </>
  );
}
