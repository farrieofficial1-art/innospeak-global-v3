export function normalizeOpportunities(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    id: row.id,
    title: row.title || row.job_title || '',
    organisation: row.organisation || row.company_name || '',
    location: row.location || '',
    type: row.employment_type || row.type || '',
    summary: row.summary || row.description || '',
    postedAt: row.posted_at || row.created_at || null,
    deadline: row.deadline || null,
    tags: row.tags || row.skills || [],
    ...row,
  }));
}
