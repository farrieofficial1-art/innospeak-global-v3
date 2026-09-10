import { useCallback, useState } from 'react';
import { askTutor, isTutorConfigured } from '../lib/tutor/tutorApi';
import { DEFAULT_PERSONA_ID } from '../components/tutor/tutorPersonas';

let messageIdCounter = 0;
function nextId() {
  messageIdCounter += 1;
  return `tutor-msg-${messageIdCounter}`;
}

/**
 * useTutorChat — conversation state + send logic for the InnoSpeak AI Tutor.
 *
 * Shared by TutorWidget (floating) and the /tutor page (full session) so
 * both surfaces behave identically and only differ in presentation.
 */
export default function useTutorChat(initialPersonaId = DEFAULT_PERSONA_ID) {
  const [personaId, setPersonaId] = useState(initialPersonaId);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (text, attachments = []) => {
      const trimmed = text.trim();
      if ((!trimmed && attachments.length === 0) || isSending) return;

      const userMessage = {
        id: nextId(),
        role: 'user',
        content: trimmed,
        // Kept locally for display (previewUrl is a data: URL, cheap to hold
        // in memory); only the current turn's base64 payload is sent below.
        attachments: attachments.map(({ id, name, mimeType, kind, previewUrl }) => ({
          id,
          name,
          mimeType,
          kind,
          previewUrl,
        })),
      };
      const history = [...messages, userMessage];
      setMessages(history);
      setError(null);
      setIsSending(true);

      try {
        const reply = await askTutor({
          personaId,
          messages: history.map(({ role, content }, index) => ({
            role,
            content,
            // Only re-send raw attachment bytes for the message just sent —
            // resending every past image/video on every turn would balloon
            // the request. Earlier attachments stay visible in the UI via
            // their local previewUrl above.
            attachments:
              index === history.length - 1
                ? attachments.map(({ mimeType, base64 }) => ({ mimeType, base64 }))
                : undefined,
          })),
        });
        setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: reply }]);
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsSending(false);
      }
    },
    [messages, personaId, isSending]
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const changePersona = useCallback((nextPersonaId) => {
    setPersonaId(nextPersonaId);
    setMessages([]);
    setError(null);
  }, []);

  return {
    personaId,
    messages,
    isSending,
    error,
    sendMessage,
    resetConversation,
    changePersona,
    isConfigured: isTutorConfigured(),
  };
}