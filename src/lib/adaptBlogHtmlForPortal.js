import { sanitizeBlogEditorHtml } from '@/lib/sanitizeBlogEditorHtml';
import { buildMediaUrl } from '@/utils/imagehelper';

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
  const inCard = Boolean(el.closest?.('[data-blog-card]'));

  const color = el.style?.color;
  if (!color || isDarkColor(color)) {
    if (/^h[1-4]$/.test(tag) || el.closest?.('h1,h2,h3,h4')) {
      el.style.color = PORTAL_HEADING;
    } else if (tag === 'blockquote') {
      el.style.color = PORTAL_MUTED;
    } else {
      el.style.color = PORTAL_TEXT;
    }
  }

  const bg = el.style?.backgroundColor;
  if (bg && isNearWhite(bg)) {
    if (inCard || el.hasAttribute?.('data-blog-card')) {
      el.style.removeProperty('background-color');
      el.style.removeProperty('background');
    } else {
      el.style.backgroundColor = 'rgba(14, 13, 9, 0.55)';
    }
  }
}

function stripCardTextDecorations(card) {
  card.querySelectorAll('mark, span, p, strong, em, h1, h2, h3, h4').forEach((el) => {
    el.style.removeProperty('background-color');
    el.style.removeProperty('background');
    el.style.removeProperty('color');
    el.removeAttribute('data-color');
    if (el.getAttribute('style')?.trim() === '') {
      el.removeAttribute('style');
    }
  });
  card.querySelectorAll('mark').forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  });
}

function adaptCardMarkup(root) {
  root.querySelectorAll('[data-blog-card]').forEach((card) => {
    stripCardTextDecorations(card);
  });
}

function readImageWidthPx(el) {
  const fromAttr = parseInt(el.getAttribute('data-width') || el.getAttribute('width') || '0', 10);
  if (Number.isFinite(fromAttr) && fromAttr > 0) return fromAttr;
  const inline = String(el.style?.width || '').replace(/px$/i, '').trim();
  const fromStyle = parseInt(inline, 10);
  if (Number.isFinite(fromStyle) && fromStyle > 0) return fromStyle;
  return 0;
}

function applySavedImageWidth(el, { inRow = false, inFigure = false } = {}) {
  if (!el || el.tagName !== 'IMG') return 0;
  el.style.removeProperty('float');
  el.style.removeProperty('clear');
  el.style.setProperty('margin', '0', 'important');
  el.style.setProperty('display', 'block', 'important');
  el.style.setProperty('height', 'auto', 'important');
  const w = readImageWidthPx(el);
  if (inRow && inFigure) {
    el.style.setProperty('width', '100%');
    el.style.setProperty('max-width', '100%');
    el.style.removeProperty('flex');
  } else if (w > 0) {
    el.setAttribute('data-saved-width', String(w));
    el.style.setProperty('--saved-width', `${w}px`);
    if (inRow) {
      el.style.removeProperty('width');
      el.style.removeProperty('max-width');
      el.style.removeProperty('flex');
    } else {
      el.style.setProperty('width', `${w}px`, 'important');
      el.style.setProperty('max-width', '100%', 'important');
    }
  } else {
    el.style.setProperty('max-width', '100%', 'important');
    if (inRow) el.style.removeProperty('flex');
  }
  el.style.setProperty('min-width', '0', 'important');
  return w;
}

function normalizeImageRowFigure(figure) {
  const img = figure.querySelector('img');
  const w = readImageWidthPx(img) || 200;
  figure.setAttribute('data-saved-width', String(w));
  figure.style.setProperty('--saved-width', `${w}px`);
  figure.style.setProperty('display', 'flex', 'important');
  figure.style.setProperty('flex-direction', 'column', 'important');
  figure.style.setProperty('align-items', 'center', 'important');
  figure.style.setProperty('margin', '0', 'important');
  figure.style.setProperty('float', 'none', 'important');
  figure.style.setProperty('clear', 'none', 'important');
  figure.style.setProperty('min-width', '0', 'important');
  figure.style.setProperty('box-sizing', 'border-box', 'important');
  figure.style.removeProperty('flex');
  figure.style.removeProperty('max-width');
  figure.style.removeProperty('width');
  if (img) applySavedImageWidth(img, { inRow: true, inFigure: true });
  figure.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
    el.classList.add('blog-image-row-caption');
    el.style.setProperty('margin', '0.35em 0 0', 'important');
    el.style.setProperty('width', '100%', 'important');
    el.style.setProperty('text-align', 'center', 'important');
    el.style.setProperty('white-space', 'normal', 'important');
    el.style.removeProperty('font-size');
    el.querySelectorAll('span').forEach((span) => {
      span.style.removeProperty('font-size');
    });
  });
}

function applyImageRowContainerStyles(row) {
  row.style.removeProperty('display');
  row.style.removeProperty('flex-wrap');
  row.style.setProperty('gap', '12px', 'important');
  row.style.setProperty('align-items', 'flex-start', 'important');
  row.style.setProperty('width', '100%', 'important');
  row.style.setProperty('max-width', '100%', 'important');
  row.style.setProperty('box-sizing', 'border-box', 'important');

  const align = row.getAttribute('data-align') || 'left';
  row.style.setProperty(
    'justify-content',
    align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
    'important'
  );
  row.style.setProperty('margin', '0.85rem 0', 'important');
}

function normalizeImageRows(root) {
  root.querySelectorAll('[data-image-row]').forEach((row) => {
    applyImageRowContainerStyles(row);
    row.querySelectorAll(':scope > img').forEach((img) => {
      applySavedImageWidth(img, { inRow: true, inFigure: false });
    });
    row.querySelectorAll(':scope > figure.blog-figure, :scope > [data-image-text]').forEach((figure) => {
      normalizeImageRowFigure(figure);
    });
  });
}

function normalizeStandaloneImages(root) {
  root.querySelectorAll('img[data-width], img[width]').forEach((img) => {
    if (img.closest('[data-image-row], [data-blog-card]')) return;
    applySavedImageWidth(img, { inRow: false });
  });
}

function patchInlineStyle(existing, { remove = [], set = {} } = {}) {
  const props = new Map();
  String(existing || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((decl) => {
      const splitAt = decl.indexOf(':');
      if (splitAt === -1) return;
      const key = decl.slice(0, splitAt).trim().toLowerCase();
      const value = decl.slice(splitAt + 1).trim();
      if (key) props.set(key, value);
    });

  remove.forEach((key) => props.delete(String(key).toLowerCase()));
  Object.entries(set).forEach(([key, value]) => props.set(String(key).toLowerCase(), value));

  return Array.from(props.entries())
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}

/** Server-safe: lock image rows to admin pixel widths (no DOMParser required). */
function fixRowFigureHtml(figureHtml) {
  const wMatch =
    figureHtml.match(/\bdata-width=["'](\d+)["']/i) ||
    figureHtml.match(/\bwidth=["'](\d+)["']/i);
  const w = wMatch ? wMatch[1] : '200';

  let out = figureHtml.replace(/<figure\b([^>]*)>/i, (m, attrs) => {
    const figStyle = patchInlineStyle((attrs.match(/\bstyle=["']([^"']*)["']/i) || [])[1], {
      remove: ['display', 'float', 'clear', 'margin', 'width', 'max-width', 'flex', 'flex-direction'],
      set: {
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        margin: '0',
        float: 'none',
        clear: 'none',
        '--saved-width': `${w}px`,
        'min-width': '0',
        'box-sizing': 'border-box',
      },
    });
    let newAttrs = attrs.replace(/\s*\bstyle=["'][^"']*["']/i, '').trim();
    if (!/\bdata-saved-width=/i.test(newAttrs)) {
      newAttrs = `${newAttrs} data-saved-width="${w}"`.trim();
    }
    return `<figure ${newAttrs} style="${figStyle}">`;
  });

  out = out.replace(/<img\b([^>]*?)>/gi, (imgFull, imgAttrs) => {
    const imgStyle = patchInlineStyle((imgAttrs.match(/\bstyle=["']([^"']*)["']/i) || [])[1], {
      remove: ['float', 'clear', 'margin', 'width', 'max-width', 'display', 'flex'],
      set: {
        display: 'block',
        margin: '0',
        width: '100%',
        'max-width': '100%',
        height: 'auto',
      },
    });
    const newImgAttrs = imgAttrs.replace(/\s*\bstyle=["'][^"']*["']/i, '').trim();
    return `<img ${newImgAttrs} style="${imgStyle}">`;
  });

  return out;
}

function fixDirectRowImgHtml(imgFull, imgAttrs) {
  const wMatch =
    imgAttrs.match(/\bdata-width=["'](\d+)["']/i) ||
    imgAttrs.match(/\bwidth=["'](\d+)["']/i);
  if (!wMatch) return imgFull;
  const w = wMatch[1];
  const imgStyle = patchInlineStyle((imgAttrs.match(/\bstyle=["']([^"']*)["']/i) || [])[1], {
    remove: ['float', 'clear', 'margin', 'width', 'max-width', 'display', 'flex', 'min-width'],
    set: {
      display: 'block',
      margin: '0',
      height: 'auto',
      '--saved-width': `${w}px`,
      'min-width': '0',
    },
  });
  let newImgAttrs = imgAttrs.replace(/\s*\bstyle=["'][^"']*["']/i, '').trim();
  if (!/\bdata-saved-width=/i.test(newImgAttrs)) {
    newImgAttrs = `${newImgAttrs} data-saved-width="${w}"`.trim();
  }
  return `<img ${newImgAttrs} style="${imgStyle}">`;
}

function normalizeImageRowsInHtml(html) {
  return html.replace(
    /<div\b([^>]*\bdata-image-row\b[^>]*)>([\s\S]*?)<\/div>/gi,
    (full, divAttrs, inner) => {
      const alignMatch = divAttrs.match(/\bdata-align=["']([^"']+)["']/i);
      const align = alignMatch?.[1] || 'left';

      const divStyle = patchInlineStyle((divAttrs.match(/\bstyle=["']([^"']*)["']/i) || [])[1], {
        remove: ['width', 'flex-wrap', 'flexWrap', 'justify-content', 'margin', 'display'],
        set: {
          gap: '12px',
          'align-items': 'flex-start',
          'justify-content':
            align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
          width: '100%',
          'max-width': '100%',
          margin: '0.85rem 0',
          clear: 'both',
          'box-sizing': 'border-box',
        },
      });

      const figures = [];
      let newInner = inner.replace(/<figure\b[\s\S]*?<\/figure>/gi, (fig) => {
        figures.push(fixRowFigureHtml(fig));
        return `\x00FIG${figures.length - 1}\x00`;
      });
      newInner = newInner.replace(/<img\b([^>]*?)>/gi, fixDirectRowImgHtml);
      newInner = newInner.replace(/\x00FIG(\d+)\x00/g, (_, i) => figures[Number(i)]);

      const newDivAttrs = divAttrs.replace(/\s*\bstyle=["'][^"']*["']/i, '').trim();
      return `<div ${newDivAttrs} style="${divStyle}">${newInner}</div>`;
    }
  );
}

function ensureImageWidths(html) {
  return html.replace(/<img\b([^>]*?)>/gi, (full, attrs) => {
    const widthMatch =
      attrs.match(/\bdata-width=["'](\d+)["']/i) ||
      attrs.match(/\bwidth=["'](\d+)["']/i);
    if (!widthMatch) return full;
    const widthPx = widthMatch[1];
    if (/style\s*=\s*["'][^"']*width\s*:/i.test(attrs)) return full;
    if (/style\s*=\s*["']/i.test(attrs)) {
      return full.replace(
        /style\s*=\s*["']/i,
        `style="width:${widthPx}px;max-width:100%;height:auto;`
      );
    }
    return `<img${attrs} style="width:${widthPx}px;max-width:100%;height:auto;">`;
  });
}

function stripCardCustomColors(root) {
  root.querySelectorAll('[data-blog-card]').forEach((card) => {
    card.removeAttribute('data-bg');
    card.removeAttribute('data-border');
    card.removeAttribute('data-color');
    card.style.removeProperty('background-color');
    card.style.removeProperty('border-color');
    card.style.removeProperty('color');
  });
}

function resolveInlineMediaUrls(root) {
  root.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!src || /^https?:\/\//i.test(src) || /^blob:/i.test(src) || /^cid:/i.test(src)) {
      return;
    }
    img.setAttribute('src', buildMediaUrl(src));
  });
}

function wrapTablesForMobile(root) {
  root.querySelectorAll('table').forEach((table) => {
    const parent = table.parentElement;
    if (!parent) return;
    if (
      parent.classList?.contains('blog-table-scroll') ||
      parent.classList?.contains('tableWrapper')
    ) {
      parent.classList.add('blog-table-scroll');
      return;
    }

    const wrap = root.ownerDocument.createElement('div');
    wrap.className = 'blog-table-scroll tableWrapper';
    parent.insertBefore(wrap, table);
    wrap.appendChild(table);

    // Fixed pixel widths from the editor blow out mobile — keep layout but allow shrink/scroll
    if (table.style.width && /px$/i.test(table.style.width)) {
      table.style.minWidth = table.style.width;
      table.style.width = '100%';
    }
    table.querySelectorAll('td, th, col').forEach((cell) => {
      if (cell.style.width && /px$/i.test(cell.style.width)) {
        cell.style.minWidth = cell.style.width;
        cell.style.width = '';
      }
      const colwidth = cell.getAttribute('colwidth') || cell.getAttribute('data-colwidth');
      if (colwidth) {
        const n = parseInt(String(colwidth).split(',')[0], 10);
        if (Number.isFinite(n) && n > 0) {
          cell.style.minWidth = `${Math.min(n, 220)}px`;
        }
      }
    });
  });
}

/**
 * @param {string} html
 * @returns {string}
 */
export function adaptBlogHtmlForPortal(html) {
  if (!html || typeof html !== 'string') return '';
  const cleaned = normalizeImageRowsInHtml(
    ensureImageWidths(sanitizeBlogEditorHtml(html))
  );
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return cleaned
      .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, `color: ${PORTAL_TEXT};`)
      .replace(/color:\s*rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*[\d.]+\s*\)\s*;?/gi, `color: ${PORTAL_TEXT};`)
      .replace(/color:\s*#000(?:000)?\s*;?/gi, `color: ${PORTAL_TEXT};`)
      .replace(/color:\s*black\s*;?/gi, `color: ${PORTAL_TEXT};`)
      .replace(/background-color:\s*rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)\s*;?/gi, '')
      .replace(/background:\s*rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)\s*;?/gi, '')
      .replace(/background-color:\s*#fff(?:fff)?\s*;?/gi, '')
      .replace(/background:\s*#fff(?:fff)?\s*;?/gi, '')
      .replace(
        /(<img\b[^>]*\ssrc=["'])(\/media\/[^"']+)(["'])/gi,
        (_, pre, src, post) => `${pre}${buildMediaUrl(src)}${post}`
      );
  }

  try {
    const doc = new DOMParser().parseFromString(`<div id="__blog_root">${cleaned}</div>`, 'text/html');
    const root = doc.getElementById('__blog_root');
    if (!root) return cleaned;

    root.querySelectorAll('[style]').forEach((el) => {
      if (!el.closest?.('[data-blog-card]')) adaptElementColors(el);
    });
    stripCardCustomColors(root);
    adaptCardMarkup(root);
    normalizeImageRows(root);
    normalizeStandaloneImages(root);
    resolveInlineMediaUrls(root);
    wrapTablesForMobile(root);

    return root.innerHTML;
  } catch {
    return cleaned;
  }
}
