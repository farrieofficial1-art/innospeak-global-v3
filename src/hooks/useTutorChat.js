import { useCallback, useEffect, useMemo, useState } from 'react';
import { askTutor, isTutorConfigured } from '../lib/tutor/tutorApi';
import { DEFAULT_PERSONA_ID } from '../components/tutor/tutorPersonas';

const STORAGE = 'innospeak:tutor:workspace:v2';
let counter = 0;
const id = (prefix='tutor') => `${prefix}-${Date.now()}-${++counter}`;

function blankConversation() {
  return { id: id('chat'), title: 'New learning session', personaId: DEFAULT_PERSONA_ID, messages: [], updatedAt: Date.now() };
}

export default function useTutorChat(initialPersonaId = DEFAULT_PERSONA_ID) {
  const [conversations, setConversations] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE)) || [blankConversation()]; } catch { return [blankConversation()]; }
  });
  const [conversationId, setConversationId] = useState(() => conversations[0]?.id);
  const [personaId, setPersonaId] = useState(initialPersonaId);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [webSearch, setWebSearch] = useState(false);
  const [deepThink, setDeepThink] = useState(false);

  const active = conversations.find(c => c.id === conversationId) || conversations[0] || blankConversation();
  const messages = active?.messages || [];
  const conversationTitle = active?.title || 'New learning session';

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(conversations.map(c => ({
      ...c,
      messages: c.messages.map(m => ({ ...m, attachments: (m.attachments || []).map(a => ({ ...a, previewUrl: undefined })) }))
    }))));
  }, [conversations]);

  const updateActive = useCallback((patch) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, ...patch, updatedAt: Date.now() } : c));
  }, [conversationId]);

  const newConversation = useCallback(() => {
    const c = blankConversation();
    c.personaId = personaId;
    setConversations(prev => [c, ...prev]);
    setConversationId(c.id);
    setError(null);
  }, [personaId]);

  const openConversation = useCallback((cid) => {
    const c = conversations.find(x => x.id === cid);
    if (!c) return;
    setConversationId(cid);
    setPersonaId(c.personaId || DEFAULT_PERSONA_ID);
    setError(null);
  }, [conversations]);

  const changePersona = useCallback((next) => {
    setPersonaId(next);
    updateActive({ personaId: next });
    setError(null);
  }, [updateActive]);

  const resetConversation = useCallback(() => {
    updateActive({ messages: [], title: 'New learning session' });
    setError(null);
  }, [updateActive]);

  const sendMessage = useCallback(async (text, attachments = []) => {
    const trimmed = text.trim();
    if ((!trimmed && !attachments.length) || isSending) return;

    const userMessage = {
      id: id('msg'), role: 'user', content: trimmed,
      attachments: attachments.map(({ id, name, mimeType, kind, previewUrl }) => ({ id, name, mimeType, kind, previewUrl })),
    };
    const history = [...messages, userMessage];
    const title = active.title === 'New learning session'
      ? (trimmed || attachments[0]?.name || 'New learning session').slice(0, 52)
      : active.title;

    updateActive({ messages: history, title });
    setError(null);
    setIsSending(true);

    try {
      const result = await askTutor({
        personaId, messages: history.map(({ role, content }, index) => ({
          role, content,
          attachments: index === history.length - 1 ? attachments.map(({ mimeType, base64 }) => ({ mimeType, base64 })) : undefined,
        })),
        webSearch, deepThink,
      });
      updateActive({ messages: [...history, { id: id('msg'), role: 'assistant', content: result.reply, sources: result.sources || [] }] });
    } catch (e) {
      setError(e.message || 'The Tutor could not respond. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [active.title, isSending, messages, personaId, updateActive, webSearch, deepThink]);

  const regenerate = useCallback(async () => {
    if (isSending || messages.length < 2) return;
    const lastUserIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    const idx = messages.length - 1 - lastUserIndex;
    if (idx < 0) return;
    const prior = messages.slice(0, idx + 1);
    updateActive({ messages: prior });
    setIsSending(true);
    setError(null);
    try {
      const result = await askTutor({ personaId, messages: prior.map(({ role, content }) => ({ role, content })), webSearch, deepThink });
      updateActive({ messages: [...prior, { id: id('msg'), role: 'assistant', content: result.reply, sources: result.sources || [] }] });
    } catch (e) { setError(e.message || 'Regeneration failed.'); }
    finally { setIsSending(false); }
  }, [deepThink, isSending, messages, personaId, updateActive, webSearch]);

  const stop = useCallback(() => {
    // The request is safely ignored by the UI after cancellation. The Edge Function
    // itself remains server-side and cannot be forcibly cancelled through invoke().
    setIsSending(false);
  }, []);

  return {
    personaId, messages, isSending, error, sendMessage, resetConversation, changePersona,
    isConfigured: isTutorConfigured(), conversations, conversationId, conversationTitle,
    newConversation, openConversation, regenerate, stop, webSearch, setWebSearch, deepThink, setDeepThink,
  };
}
