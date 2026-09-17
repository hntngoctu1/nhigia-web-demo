export const MAX_CHAT_BODY_BYTES = 32_000;
export const MAX_CONTACT_BODY_BYTES = 12_000;
export const MAX_CHAT_MESSAGES = 20;
export const MAX_CHAT_MESSAGE_CHARS = 2_000;

export function normalizeChatMessages(raw) {
  if (!Array.isArray(raw)) {
    return { ok: false, messages: [], error: "messages_must_be_array" };
  }

  const selected = raw.slice(-MAX_CHAT_MESSAGES);
  const messages = [];
  for (const item of selected) {
    if (!item || typeof item !== "object") {
      return { ok: false, messages: [], error: "invalid_message" };
    }
    const role = item.role;
    if (role !== "user" && role !== "assistant") {
      return { ok: false, messages: [], error: "invalid_role" };
    }
    if (typeof item.content !== "string") {
      return { ok: false, messages: [], error: "invalid_content" };
    }
    messages.push({
      role,
      content: item.content.slice(0, MAX_CHAT_MESSAGE_CHARS),
    });
  }
  return { ok: true, messages };
}

export function jsonBodyTooLarge(value, maxBytes = MAX_CHAT_BODY_BYTES) {
  try {
    return JSON.stringify(value).length > maxBytes;
  } catch {
    return true;
  }
}
