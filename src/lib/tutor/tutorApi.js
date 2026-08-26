import { supabase } from '../supabase/client';

export async function askTutor({ personaId, messages, webSearch = false, deepThink = false, courseContext = null }) {
  if (!supabase) throw new Error('The AI Tutor is unavailable because Supabase has not been configured.');

  const { data, error } = await supabase.functions.invoke('tutor-chat', {
    body: { personaId, messages, webSearch, deepThink, courseContext },
  });

  if (error) throw new Error(error.message || 'The AI Tutor could not respond. Please try again.');
  if (!data?.reply) throw new Error('The AI Tutor sent back an empty response. Please try again.');

  return { reply: data.reply, sources: data.sources || [] };
}

export function isTutorConfigured() {
  return Boolean(supabase);
}
