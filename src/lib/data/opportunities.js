// src/lib/data/opportunities.js
//
// Career opportunities data layer: normalisation, filtering, sorting and
// deadline helpers for the Opportunities page. The page fetches rows from
// the `career_opportunities` table via listCareerOpportunities() and passes
// them through normalizeOpportunities() before filtering/sorting.

const URGENT_DAYS = 3;

export function normalizeOpportunities(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    id: row.id,
    title: row.title || row.job_title || '',
    organisation: row.organisation || row.company_name || '',
    location: row.location || '',
    opportunity_type: row.opportunity_type || row.type || row.employment_type || '',
    mode: row.mode || row.work_mode || '',
    level: row.level || row.seniority || '',
    description: row.description || row.summary || '',
    closing_date: row.closing_date || row.deadline || null,
    postedAt: row.posted_at || row.created_at || null,
    skills: row.skills || row.tags || [],
    featured: !!row.featured,
    verified: !!row.verified,
    ...row,
  }));
}

function uniqueValues(items, key) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const v = item?.[key];
    if (!v) continue;
    const k = String(v).toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
}

export function availableTypes(opportunities) {
  return uniqueValues(opportunities, 'opportunity_type');
}

export function availableModes(opportunities) {
  return uniqueValues(opportunities, 'mode');
}

export function availableLevels(opportunities) {
  return uniqueValues(opportunities, 'level');
}

// deadlineInfo — returns { label, expired, urgent, date } or null.
export function deadlineInfo(closingDate) {
  if (!closingDate) return null;
  const date = new Date(closingDate);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  const msDiff = date.getTime() - now.getTime();
  const days = Math.ceil(msDiff / 86400000);
  if (days < 0) {
    return { label: 'Closed', expired: true, urgent: false, date };
  }
  if (days === 0) {
    return { label: 'Closes today', expired: false, urgent: true, date };
  }
  if (days === 1) {
    return { label: 'Closes tomorrow', expired: false, urgent: true, date };
  }
  if (days <= URGENT_DAYS) {
    return { label: `Closes in ${days} days`, expired: false, urgent: true, date };
  }
  return {
    label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    expired: false,
    urgent: false,
    date,
  };
}

export function filterOpportunities(opportunities, { query, type, mode, level, hideExpired = true } = {}) {
  const q = (query || '').trim().toLowerCase();
  return opportunities.filter((o) => {
    if (type && type !== 'all' && o.opportunity_type !== type) return false;
    if (mode && mode !== 'all' && o.mode !== mode) return false;
    if (level && level !== 'all' && o.level !== level) return false;
    if (hideExpired) {
      const d = deadlineInfo(o.closing_date);
      if (d?.expired) return false;
    }
    if (q) {
      const haystack = [o.title, o.organisation, o.location, o.description, ...(o.skills || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortOpportunities(opportunities) {
  return [...opportunities].sort((a, b) => {
    // Featured first, then soonest deadline, then most recent.
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const da = a.closing_date ? new Date(a.closing_date).getTime() : Infinity;
    const db = b.closing_date ? new Date(b.closing_date).getTime() : Infinity;
    if (da !== db) return da - db;
    const pa = a.postedAt ? new Date(a.postedAt).getTime() : 0;
    const pb = b.postedAt ? new Date(b.postedAt).getTime() : 0;
    return pb - pa;
  });
}
