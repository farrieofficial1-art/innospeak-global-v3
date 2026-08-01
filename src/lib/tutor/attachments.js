/**
 * attachments — helpers for turning image/video files the user picks in
 * the AI Tutor composer into something we can both preview locally and
 * send to Gemini as inlineData.
 *
 * Kept deliberately simple: everything is base64-encoded client-side and
 * sent inline with the request (no upload step, no storage bucket). This
 * comfortably covers photos and short clips; very large videos should use
 * Gemini's File API instead, which is a larger feature than this covers.
 */

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB per file
export const MAX_ATTACHMENTS = 4;
export const ACCEPTED_MIME_PREFIXES = ['image/', 'video/'];

export function isAcceptedFile(file) {
  return ACCEPTED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix));
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let attachmentIdCounter = 0;
function nextAttachmentId() {
  attachmentIdCounter += 1;
  return `attachment-${attachmentIdCounter}`;
}

/**
 * Reads a File into an attachment object: a data URL for local preview,
 * plus the raw base64 payload (no "data:mime;base64," prefix) for sending
 * to the tutor-chat Edge Function.
 */
export function fileToAttachment(file) {
  return new Promise((resolve, reject) => {
    if (!isAcceptedFile(file)) {
      reject(new Error(`${file.name} isn't an image or video.`));
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      reject(new Error(`${file.name} is too large (max ${formatFileSize(MAX_FILE_SIZE_BYTES)}).`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const base64 = dataUrl.split(',')[1] || '';
      resolve({
        id: nextAttachmentId(),
        name: file.name,
        mimeType: file.type,
        kind: file.type.startsWith('video/') ? 'video' : 'image',
        size: file.size,
        previewUrl: dataUrl,
        base64,
      });
    };
    reader.onerror = () => reject(new Error(`Couldn't read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}