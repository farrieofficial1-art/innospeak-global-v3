import { supabase } from './client';

/**
 * portal — data layer for the student portal (Phase 1: read-only
 * enrollments for the dashboard).
 */

export async function getMyEnrollments() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('enrollments')
    .select('id, status, progress_percent, enrolled_at, courses ( id, code, title, pathway )')
    .order('enrolled_at', { ascending: false });
  if (error) throw error;
  return data || [];
}