import { supabase } from '../supabase/client';

/**
 * tutorApi — data layer for the InnoSpeak AI Tutor.
 *
 * Mirrors the pattern used by src/lib/supabase/applications.js: the UI
 * calls these functions, never Supabase (or Anthropic) directly, so the
 * transport can change later without touching components.
 *
 * The actual Claude API key lives only in the Supabase Edge Function's
 * environment (`supabase/functions/tutor-chat`) — it is never sent to,
 * or reachable from, the browser.
 */

/**
 * Send the conversation so far to the tutor-chat Edge Function and get
 * back the assistant's reply.
 *
 * @param {Object} params
 * @param {string} params.personaId - which tutor persona is active
 * @param {Array<{role: 'user'|'assistant', content: string}>} params.messages
 * @returns {Promise<string>} the assistant's reply text
 */
export async function askTutor({ personaId, messages }) {
  if (!supabase) {
    throw new Error(
      'The AI Tutor is unavailable because Supabase has not been configured.'
    );
  }

  const { data, error } = await supabase.functions.invoke('tutor-chat', {
    body: { personaId, messages },
  });

  if (error) {
    throw new Error(error.message || 'The AI Tutor could not respond. Please try again.');
  }

  if (!data?.reply) {
    throw new Error('The AI Tutor sent back an empty response. Please try again.');
  }

  return data.reply;
}

export function isTutorConfigured() {
  return Boolean(supabase);
}