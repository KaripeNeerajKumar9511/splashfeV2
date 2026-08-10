const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const AI_GENERATION_DISABLED_MESSAGE =
  'The AI server is down. Please wait for some time or contact the support team.';

export const AI_SERVER_DOWN_EVENT = 'splash:ai-server-down';

let cachedDisabled = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 15000;

export async function fetchAiGenerationDisabled() {
  const now = Date.now();
  if (cachedDisabled !== null && now < cacheExpiry) {
    return cachedDisabled;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/credits/ai-generation-status/`, {
      cache: 'no-store',
    });
    const data = await response.json();
    cachedDisabled = Boolean(data?.disabled);
    cacheExpiry = now + CACHE_TTL_MS;
    return cachedDisabled;
  } catch {
    return false;
  }
}

export function clearAiGenerationStatusCache() {
  cachedDisabled = null;
  cacheExpiry = 0;
}

export function isAiServerDownError(error) {
  return Boolean(error?.aiGenerationDisabled);
}

export function notifyAiServerDown() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AI_SERVER_DOWN_EVENT));
}

function createAiServerDownError(message = AI_GENERATION_DISABLED_MESSAGE) {
  const error = new Error(message);
  error.aiGenerationDisabled = true;
  notifyAiServerDown();
  return error;
}

export async function ensureAiGenerationEnabled() {
  const disabled = await fetchAiGenerationDisabled();
  if (disabled) {
    throw createAiServerDownError();
  }
}

export function throwIfAiGenerationDisabledResponse(data, status) {
  if (status === 503 && data?.ai_generation_disabled) {
    throw createAiServerDownError(data?.error || AI_GENERATION_DISABLED_MESSAGE);
  }
}

export function wrapAxiosAiGenerationError(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;
  if (status === 503 && data?.ai_generation_disabled) {
    throw createAiServerDownError(data?.error || AI_GENERATION_DISABLED_MESSAGE);
  }
  throw error;
}
