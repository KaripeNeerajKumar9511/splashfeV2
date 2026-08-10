const OOPS_ERROR_EVENT = 'splash:oops-error';
const OOPS_SESSION_KEY = 'splash_oops_session';
const OOPS_SESSION_RESET_MS = 15 * 60 * 1000;

let pendingRetry = null;

export function setOopsRetry(onRetry) {
  pendingRetry = typeof onRetry === 'function' ? onRetry : null;
}

export function clearOopsRetry() {
  pendingRetry = null;
}

function readSession() {
  if (typeof window === 'undefined') return { count: 0, at: Date.now() };
  try {
    const raw = sessionStorage.getItem(OOPS_SESSION_KEY);
    if (!raw) return { count: 0, at: Date.now() };
    const data = JSON.parse(raw);
    if (!data || typeof data.count !== 'number') return { count: 0, at: Date.now() };
    if (Date.now() - Number(data.at || 0) > OOPS_SESSION_RESET_MS) {
      return { count: 0, at: Date.now() };
    }
    return { count: data.count, at: data.at };
  } catch {
    return { count: 0, at: Date.now() };
  }
}

function writeSession(session) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(OOPS_SESSION_KEY, JSON.stringify(session));
}

/** Reset failure count only (keep pending retry for in-flight generate → poll flows). */
export function clearOopsSessionCount() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(OOPS_SESSION_KEY);
}

/** Full reset after a completed successful user action. */
export function clearOopsSession() {
  clearOopsSessionCount();
  clearOopsRetry();
}

export function bumpOopsSession() {
  const current = readSession();
  const next = { count: current.count + 1, at: Date.now() };
  writeSession(next);
  return next.count;
}

export function getOopsFailureCount() {
  return readSession().count;
}

export function isOopsNotifiedError(error) {
  return Boolean(error?.oopsNotified);
}

/** App wallet / organization credits — keep dedicated UX, not Oops. */
export function isAppCreditsError(error) {
  if (error?.isAppCreditsError) return true;
  const msg = String(error?.message || error?.error || '').toLowerCase();
  return (
    msg.includes('insufficient credit') ||
    msg.includes('insufficient credits') ||
    msg.includes('not enough credit') ||
    msg.includes('pls recharge') ||
    msg.includes('please recharge') ||
    msg.includes('no credits') ||
    msg.includes('credit balance')
  );
}

/**
 * Show the Oops popup. Hides raw backend messages from users.
 * First failure in session → Try Again. Later failures → wait message only.
 */
export function notifyOopsError(options = {}) {
  if (typeof window === 'undefined') return;

  const error = options.error;
  if (error?.aiGenerationDisabled) return;
  if (error?.status === 401) return;
  if (error?.skipOops) return;
  if (error?.oopsNotified) return;
  if (isAppCreditsError(error)) {
    if (error && typeof error === 'object') {
      error.isAppCreditsError = true;
      error.skipOops = true;
    }
    return;
  }
  // Ignore aborted / cancelled requests (common on refresh / navigation)
  if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') return;

  if (error && typeof error === 'object') {
    error.oopsNotified = true;
  }

  // Prefer explicit onRetry; fall back to pendingRetry set before the action
  const onRetry =
    (typeof options.onRetry === 'function' ? options.onRetry : null) ||
    pendingRetry;
  // Keep pendingRetry until Try Again is used or a full success clears it,
  // so closing the modal and opening again on 2nd fail still works cleanly.
  if (typeof options.onRetry === 'function') {
    pendingRetry = options.onRetry;
  }

  const count = bumpOopsSession();
  const showTryAgain = count <= 1;

  window.dispatchEvent(
    new CustomEvent(OOPS_ERROR_EVENT, {
      detail: {
        showTryAgain,
        onRetry: showTryAgain ? onRetry : null,
        failureCount: count,
      },
    })
  );
}

/**
 * Handle a caught error in UI: AI-down / auth / Oops / app credits.
 * Returns true if the UI should not show a raw error banner.
 */
export function reportPortalError(error, { onRetry } = {}) {
  if (!error) return true;
  if (error.aiGenerationDisabled) return true;
  if (error.status === 401) return true;
  if (isAppCreditsError(error)) return false; // caller shows credits indication
  if (isOopsNotifiedError(error)) return true;
  notifyOopsError({ error, onRetry });
  return true;
}

export { OOPS_ERROR_EVENT };
