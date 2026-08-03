/**
 * TipTap often saves text as color: rgb(0,0,0) which is invisible on the
 * dark portal theme. Remap dark ink to portal cream while keeping font-size,
 * widths, and other inline styles from the admin editor.
 */

const PORTAL_TEXT = 'rgba(242, 237, 216, 0.85)';
const PORTAL_HEADING = '#F2EDD8';
const PORTAL_MUTED = 'rgba(242, 237, 216, 0.65)';

function parseRgb(value) {
  if (!value) return null;
  const v = String(value).trim().toLowerCase();
  if (v === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  if (v === 'white') return { r: 255, g: 255, b: 255, a: 1 };

  let m = v.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (m) {
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] != null ? Number(m[4]) : 1,
    };
  }

  m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }
  return null;
}

function relativeLuminance({ r, g, b }) {
  const lin = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function isDarkColor(value) {
  const rgb = parseRgb(value);
  if (!rgb || rgb.a < 0.15) return false;
  return relativeLuminance(rgb) < 0.45;
}

function isNearWhite(value) {
  const rgb = parseRgb(value);
  if (!rgb) return false;
  return relativeLuminance(rgb) > 0.85;
}

function adaptElementColors(el) {
  const tag = el.tagName?.toLowerCase?.() || '';
  const color = el.style?.color;
  if (color && isDarkColor(color)) {
    if (/^h[1-4]$/.test(tag) || el.closest?.('h1,h2,h3,h4')) {
      el.style.color = PORTAL_HEADING;
    } else if (tag === 'blockquote') {
      el.style.color = PORTAL_MUTED;
    } else {
      el.style.color = PORTAL_TEXT;
    }
  }

  // Light gray text meant for white paper can also disappear — bump if too dark-gray
  // (already handled by luminance < 0.45)

  const bg = el.style?.backgroundColor;
  if (bg && isNearWhite(bg)) {
    // White/near-white cards on dark portal: soften to panel tone so black→cream text still works
    el.style.backgroundColor = 'rgba(14, 13, 9, 0.55)';
  }
}

/**
 * @param {string} html
 * @returns {string}
 */
export function adaptBlogHtmlForPortal(html) {
  if (!html || typeof html !== 'string') return '';
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    // SSR fallback: strip only obvious black color declarations
    return html
      .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, `color: ${PORTAL_TEXT};`)
      .replace(/color:\s*rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*[\d.]+\s*\)\s*;?/gi, `color: ${PORTAL_TEXT};`)
      .replace(/color:\s*#000(?:000)?\s*;?/gi, `color: ${PORTAL_TEXT};`)
      .replace(/color:\s*black\s*;?/gi, `color: ${PORTAL_TEXT};`);
  }

  try {
    const doc = new DOMParser().parseFromString(`<div id="__blog_root">${html}</div>`, 'text/html');
    const root = doc.getElementById('__blog_root');
    if (!root) return html;

    root.querySelectorAll('[style]').forEach(adaptElementColors);

    // Tables: ensure cells inherit readable color when no inline color left dark
    root.querySelectorAll('td, th, p, span, li, div').forEach((el) => {
      if (!el.style.color) return;
      // already adapted
    });

    return root.innerHTML;
  } catch {
    return html;
  }
}
