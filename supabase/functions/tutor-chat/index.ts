// supabase/functions/tutor-chat/index.ts
//
// InnoSpeak Tutor — Edge Function (Gemini backend, free tier)
//
// The browser (via src/lib/tutor/tutorApi.js) sends { personaId, messages }
// here. This function attaches the right system prompt for the persona,
// calls Google's Gemini API with the server-only GEMINI_API_KEY secret,
// and returns { reply }. The API key never reaches the client.
//
// Get a free key (no credit card, ~1,500 requests/day on Flash):
//   https://aistudio.google.com -> Get API key -> Create API key
//
// Deploy:
//   supabase functions deploy tutor-chat
// Configure the secret once per project:
//   supabase secrets set GEMINI_API_KEY=AIza...
//
// NOTE: persona system prompts are duplicated from
// src/components/tutor/tutorPersonas.js because Edge Functions run in an
// isolated Deno runtime and can't import from the Vite app. If you edit a
// persona's tone/focus, update it in both places.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_OUTPUT_TOKENS = 1024;
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

interface Attachment {
  mimeType: string;
  base64: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
}

const MAX_ATTACHMENTS_PER_MESSAGE = 4;

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const cleaned = raw
    .filter((m): m is Record<string, unknown> => Boolean(m) && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => {
      const content = typeof m.content === 'string' ? m.content.slice(0, 8000) : '';
      const attachments = Array.isArray(m.attachments)
        ? m.attachments
            .filter(
              (a: unknown): a is Attachment =>
                Boolean(a) &&
                typeof (a as Attachment).mimeType === 'string' &&
                typeof (a as Attachment).base64 === 'string'
            )
            .slice(0, MAX_ATTACHMENTS_PER_MESSAGE)
        : undefined;
      return { role: m.role as 'user' | 'assistant', content, attachments };
    })
    .filter((m) => m.content.trim().length > 0 || (m.attachments && m.attachments.length > 0));

  return cleaned.slice(-MAX_HISTORY_MESSAGES);
}

// Gemini has no separate "assistant" role — it uses "model". Attachments
// become inlineData parts alongside the text part for that turn.
function toGeminiContents(messages: ChatMessage[]) {
  return messages.map((m) => {
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
    if (m.content) parts.push({ text: m.content });
    for (const a of m.attachments ?? []) {
      parts.push({ inlineData: { mimeType: a.mimeType, data: a.base64 } });
    }
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts,
    };
  });
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

  if (!GEMINI_API_KEY) {
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

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: toGeminiContents(messages),
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPTS[personaId] }],
        },
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);

      if (geminiRes.status === 429) {
        return new Response(
          JSON.stringify({
            error: "The AI Tutor is getting a lot of requests right now. Please try again in a moment.",
          }),
          { status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'The AI Tutor could not respond right now. Please try again.' }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const data = await geminiRes.json();
    const reply = (data.candidates?.[0]?.content?.parts ?? [])
      .map((part: { text?: string }) => part.text ?? '')
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