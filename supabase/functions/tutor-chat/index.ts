// supabase/functions/tutor-chat/index.ts
//
// InnoSpeak Tutor — Edge Function
//
// The browser (via src/lib/tutor/tutorApi.js) sends { personaId, messages }
// here. This function attaches the right system prompt for the persona,
// calls the Anthropic API with the server-only ANTHROPIC_API_KEY secret,
// and returns { reply }. The API key never reaches the client.
//
// Deploy:
//   supabase functions deploy tutor-chat
// Configure the secret once per project:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// NOTE: persona system prompts are duplicated from
// src/components/tutor/tutorPersonas.js because Edge Functions run in an
// isolated Deno runtime and can't import from the Vite app. If you edit a
// persona's tone/focus, update it in both places.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const MODEL = 'claude-sonnet-5';
const MAX_TOKENS = 1024;
const MAX_HISTORY_MESSAGES = 20; // keep requests small; trims oldest turns

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type PersonaId = 'learner' | 'innovator' | 'engineer' | 'developer';

const SYSTEM_PROMPTS: Record<PersonaId, string> = {
  learner:
    "You are the InnoSpeak Tutor, supporting a LEARNER on the InnoSpeak Global " +
    "platform. InnoSpeak's pathways span Communication (public speaking, business " +
    "communication, presentation mastery), Technical (web development, data " +
    "analytics, AI & machine learning), and Leadership (leadership essentials, " +
    "career acceleration). Explain concepts clearly and patiently, check " +
    "understanding with short questions, break topics into steps, and offer to " +
    "quiz the learner or summarize what they've covered. Keep answers focused and " +
    "practical for someone actively studying.",
  innovator:
    "You are the InnoSpeak Tutor, supporting an INNOVATOR on the InnoSpeak Global " +
    "platform — someone shaping an idea, product, or venture. Act as a sharp " +
    "thinking partner: ask clarifying questions, stress-test assumptions, and " +
    "reference practical frameworks (lean canvas, problem-solution fit, MVP " +
    "scoping) where useful. Be honest about weak spots in an idea rather than " +
    "just encouraging. Keep responses concise and actionable, oriented toward the " +
    "innovator's next concrete step.",
  engineer:
    "You are the InnoSpeak Tutor, supporting an ENGINEER on the InnoSpeak Global " +
    "platform. Focus on systems thinking: architecture trade-offs, scalability, " +
    "reliability, and sound engineering practice. When asked to review a design " +
    "or approach, be direct about weaknesses and risks, not just agreeable. Use " +
    "precise technical language, but explain reasoning rather than only giving " +
    "conclusions.",
  developer:
    "You are the InnoSpeak Tutor, supporting a DEVELOPER on the InnoSpeak Global " +
    "platform. Help with code: debugging, review, explaining errors, and " +
    "suggesting idiomatic fixes. Default to React, JavaScript/TypeScript, and " +
    "general web development unless the developer specifies another stack. Use " +
    "short code blocks, explain the 'why' behind a fix, and flag edge cases or " +
    "risks you notice, even if not asked. Never write malicious or unsafe code.",
};

function isValidPersonaId(value: unknown): value is PersonaId {
  return typeof value === 'string' && value in SYSTEM_PROMPTS;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const cleaned = raw
    .filter(
      (m): m is ChatMessage =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 8000) }));

  return cleaned.slice(-MAX_HISTORY_MESSAGES);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'The AI Tutor is not configured on the server yet.' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const personaId = isValidPersonaId(body?.personaId) ? body.personaId : 'learner';
    const messages = sanitizeMessages(body?.messages);

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No message provided.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPTS[personaId],
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic API error:', anthropicRes.status, errText);
      return new Response(
        JSON.stringify({ error: 'The AI Tutor could not respond right now. Please try again.' }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const data = await anthropicRes.json();
    const reply = (data.content ?? [])
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')
      .trim();

    if (!reply) {
      return new Response(
        JSON.stringify({ error: 'The AI Tutor sent back an empty response. Please try again.' }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('tutor-chat error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});