/**
 * Shared styles for published blog HTML.
 * Spacing, heading sizes, image widths/floats, and tables match the TipTap editor.
 * Portal theme variant swaps typefaces/colors to the marketing site look.
 */
export const BLOG_RENDERED_CONTENT_CLASS = 'blog-rendered-content';
export const BLOG_RENDERED_CONTENT_PORTAL_CLASS = 'blog-rendered-content blog-rendered-content--portal';

const BASE_CSS = `
.${BLOG_RENDERED_CONTENT_CLASS} {
  box-sizing: border-box;
  color: #111827;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.65;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.${BLOG_RENDERED_CONTENT_CLASS} *,
.${BLOG_RENDERED_CONTENT_CLASS} *::before,
.${BLOG_RENDERED_CONTENT_CLASS} *::after {
  box-sizing: border-box;
}
.${BLOG_RENDERED_CONTENT_CLASS} p {
  margin: 0.5em 0;
  line-height: 1.65;
}
.${BLOG_RENDERED_CONTENT_CLASS} h1,
.${BLOG_RENDERED_CONTENT_CLASS} h2,
.${BLOG_RENDERED_CONTENT_CLASS} h3,
.${BLOG_RENDERED_CONTENT_CLASS} h4 {
  font-weight: 600;
  margin: 0.75em 0 0.4em;
  color: inherit;
  line-height: 1.3;
}
.${BLOG_RENDERED_CONTENT_CLASS} h1 { font-size: 1.75rem; }
.${BLOG_RENDERED_CONTENT_CLASS} h2 { font-size: 1.4rem; }
.${BLOG_RENDERED_CONTENT_CLASS} h3 { font-size: 1.2rem; }
.${BLOG_RENDERED_CONTENT_CLASS} h4 { font-size: 1.05rem; }
.${BLOG_RENDERED_CONTENT_CLASS} ul,
.${BLOG_RENDERED_CONTENT_CLASS} ol {
  padding-left: 1.4rem;
  margin: 0.5em 0;
}
.${BLOG_RENDERED_CONTENT_CLASS} li { margin: 0.2em 0; }
.${BLOG_RENDERED_CONTENT_CLASS} a {
  color: #2563eb;
  text-decoration: underline;
}
.${BLOG_RENDERED_CONTENT_CLASS} strong { font-weight: 700; }
.${BLOG_RENDERED_CONTENT_CLASS} em { font-style: italic; }
.${BLOG_RENDERED_CONTENT_CLASS} u { text-decoration: underline; }
.${BLOG_RENDERED_CONTENT_CLASS} mark {
  background-color: #fef08a;
  border-radius: 0.15em;
  padding: 0 0.15em;
}

.${BLOG_RENDERED_CONTENT_CLASS} img,
.${BLOG_RENDERED_CONTENT_CLASS} img.blog-img {
  height: auto !important;
  max-width: 100%;
  border-radius: 0.375rem;
  display: inline-block;
  vertical-align: middle;
}
.${BLOG_RENDERED_CONTENT_CLASS} img.blog-img-top {
  display: block;
  float: none;
  clear: both;
}
.${BLOG_RENDERED_CONTENT_CLASS} img.blog-img-left,
.${BLOG_RENDERED_CONTENT_CLASS} img.blog-img-wrap {
  float: left;
  margin: 0 1rem 0.85rem 0;
}
.${BLOG_RENDERED_CONTENT_CLASS} img.blog-img-right {
  float: right;
  margin: 0 0 0.85rem 1rem;
}

.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  margin: 0.85rem 0;
  clear: both;
  width: 100%;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row img,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] img {
  float: none !important;
  margin: 0 !important;
  clear: none !important;
}

.${BLOG_RENDERED_CONTENT_CLASS} .tableWrapper {
  overflow-x: auto;
  margin: 0.75rem 0;
  max-width: 100%;
}
.${BLOG_RENDERED_CONTENT_CLASS} table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0.75rem 0;
  overflow: hidden;
}
.${BLOG_RENDERED_CONTENT_CLASS} td,
.${BLOG_RENDERED_CONTENT_CLASS} th {
  border: 1px solid #d1d5db;
  padding: 0.45rem 0.6rem;
  min-width: 48px;
  vertical-align: top;
  position: relative;
  word-break: break-word;
}
.${BLOG_RENDERED_CONTENT_CLASS} th {
  background: #f3f4f6;
  font-weight: 600;
}

.${BLOG_RENDERED_CONTENT_CLASS} blockquote {
  margin: 0.75em 0;
  padding-left: 1rem;
  border-left: 3px solid #d1d5db;
  color: #374151;
}
.${BLOG_RENDERED_CONTENT_CLASS} hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 1.25em 0;
}
.${BLOG_RENDERED_CONTENT_CLASS} pre,
.${BLOG_RENDERED_CONTENT_CLASS} code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
}
.${BLOG_RENDERED_CONTENT_CLASS} pre {
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin: 0.75em 0;
}

.${BLOG_RENDERED_CONTENT_CLASS}::after {
  content: "";
  display: table;
  clear: both;
}
`;

/** Portal / marketing theme: same sizes & layout, Splash typefaces + dark gold palette */
const PORTAL_OVERRIDE_CSS = `
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal {
  color: rgba(242, 237, 216, 0.85);
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 1.65;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h1,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h2,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h3,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h4 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  color: #F2EDD8;
}
/* Keep admin font-size on nested spans; only restyle typeface/color */
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h1 span,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h2 span,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h3 span,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h4 span {
  font-family: inherit;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal a {
  color: #C9A84C;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal strong {
  font-weight: 500;
  color: #F2EDD8;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal mark {
  background-color: rgba(201, 168, 76, 0.35);
  color: #F2EDD8;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal blockquote {
  border-left-color: rgba(201, 168, 76, 0.45);
  color: rgba(242, 237, 216, 0.65);
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal hr {
  border-top-color: rgba(255, 255, 255, 0.1);
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .tableWrapper {
  overflow-x: auto;
  margin: 0.85rem 0;
  max-width: 100%;
  border: 1px solid rgba(201, 168, 76, 0.22);
  border-radius: 0.75rem;
  background: rgba(14, 13, 9, 0.55);
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0.85rem 0;
  background: transparent;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal td,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal th {
  border: 1px solid rgba(201, 168, 76, 0.28);
  padding: 0.75rem 0.85rem;
  vertical-align: top;
  color: rgba(242, 237, 216, 0.85);
  background: transparent;
  word-break: break-word;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal th {
  background: rgba(201, 168, 76, 0.1);
  color: #F2EDD8;
  font-weight: 500;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal pre {
  background: #0E0D09;
  border: 1px solid rgba(201, 168, 76, 0.2);
  color: rgba(242, 237, 216, 0.85);
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal img,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal img.blog-img {
  border: 1px solid rgba(201, 168, 76, 0.16);
  height: auto !important;
  max-width: 100%;
}
`;

export const BLOG_RENDERED_CONTENT_CSS = BASE_CSS;
export const BLOG_RENDERED_CONTENT_PORTAL_CSS = BASE_CSS + PORTAL_OVERRIDE_CSS;
