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
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > img {
  display: block;
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

.${BLOG_RENDERED_CONTENT_CLASS} img.blog-img-center {
  display: block;
  float: none;
  clear: both;
  margin-left: auto;
  margin-right: auto;
}

.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure {
  margin: 0.85rem 0;
  max-width: 100%;
  height: auto;
}
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  float: none !important;
  margin: 0 !important;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row figure.blog-figure img,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] figure.blog-figure img {
  width: auto;
  max-width: none;
}
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure {
  display: flex;
  gap: 0.65rem;
}
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure--below { flex-direction: column; }
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure--above { flex-direction: column-reverse; }
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure--left { flex-direction: row-reverse; align-items: center; }
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure--right { flex-direction: row; align-items: center; }
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure.blog-img-left,
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure.blog-img-wrap {
  float: left;
  margin: 0 1rem 0.85rem 0;
}
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure.blog-img-right {
  float: right;
  margin: 0 0 0.85rem 1rem;
}
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure.blog-img-center {
  display: flex;
  float: none;
  clear: both;
  margin-left: auto;
  margin-right: auto;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-figcaption,
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure figcaption {
  font-size: 0.9em;
  line-height: 1.45;
  color: #4b5563;
  margin: 0;
}
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure > p,
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure > h1,
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure > h2,
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure > h3,
.${BLOG_RENDERED_CONTENT_CLASS} figure.blog-figure > h4 {
  margin: 0.25em 0;
  flex: 1 1 auto;
  min-width: 120px;
}

.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row],
.${BLOG_RENDERED_CONTENT_CLASS} .blog-card-row,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-card-row] {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 0.85rem 0;
  clear: both;
  width: 100%;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] {
  flex-wrap: nowrap;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row > figure,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > figure,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > [data-image-text] {
  flex: 0 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 !important;
  float: none !important;
  clear: none !important;
  box-sizing: border-box;
}
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > figure img,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > [data-image-text] img {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
  margin: 0 !important;
  float: none !important;
  clear: none !important;
}
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > figure h1,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > figure h2,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > figure h3,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > figure h4,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > figure p {
  width: 100%;
  text-align: center;
  margin: 0.35em 0 0;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row--center,
.${BLOG_RENDERED_CONTENT_CLASS} .blog-card-row--center,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row][data-align="center"],
.${BLOG_RENDERED_CONTENT_CLASS} div[data-card-row][data-align="center"] {
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row--right,
.${BLOG_RENDERED_CONTENT_CLASS} .blog-card-row--right,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row][data-align="right"],
.${BLOG_RENDERED_CONTENT_CLASS} div[data-card-row][data-align="right"] {
  justify-content: flex-end;
}
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] > img {
  float: none !important;
  margin: 0 !important;
  clear: none !important;
  flex: 0 1 auto !important;
  min-width: 0 !important;
  height: auto !important;
  box-sizing: border-box !important;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row img.blog-img-top,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] img.blog-img-top,
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row img.blog-img-left,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] img.blog-img-left,
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row img.blog-img-right,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] img.blog-img-right,
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row img.blog-img-wrap,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] img.blog-img-wrap,
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row img.blog-img-center,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] img.blog-img-center {
  display: block !important;
  float: none !important;
  clear: none !important;
  margin: 0 !important;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-image-row figure.blog-figure,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-image-row] figure.blog-figure {
  float: none !important;
  clear: none !important;
  margin: 0 !important;
}

.${BLOG_RENDERED_CONTENT_CLASS} .blog-card,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-blog-card] {
  flex: 1 1 180px;
  min-width: 160px;
  max-width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem 0.85rem;
  background: #f9fafb;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-card img,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-blog-card] img {
  float: none !important;
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 0 0 0.5rem !important;
}
.${BLOG_RENDERED_CONTENT_CLASS} .blog-card h4,
.${BLOG_RENDERED_CONTENT_CLASS} div[data-blog-card] h4 {
  margin-top: 0.25rem;
}

.${BLOG_RENDERED_CONTENT_CLASS} .tableWrapper,
.${BLOG_RENDERED_CONTENT_CLASS} .blog-table-scroll {
  display: block;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  margin: 0.75rem 0;
}
.${BLOG_RENDERED_CONTENT_CLASS} table {
  border-collapse: collapse;
  table-layout: auto;
  width: 100%;
  margin: 0;
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
  overflow-wrap: anywhere;
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
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .tableWrapper,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  margin: 0.85rem 0;
  max-width: 100%;
  border: 1px solid rgba(201, 168, 76, 0.22);
  border-radius: 0.75rem;
  background: rgba(14, 13, 9, 0.55);
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal table {
  border-collapse: collapse;
  table-layout: auto;
  width: max(100%, 520px);
  margin: 0;
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
  overflow-wrap: anywhere;
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
  max-width: 100%;
  overflow-x: auto;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal img,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal img.blog-img {
  border: 1px solid rgba(201, 168, 76, 0.16);
  height: auto !important;
}

/* Image rows — admin sizes on desktop; 2 per row on tablet/mobile */
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-image-row,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] {
  display: flex !important;
  gap: 12px !important;
  align-items: flex-start !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-image-row--center,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row][data-align="center"] {
  justify-content: center !important;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-image-row--right,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row][data-align="right"] {
  justify-content: flex-end !important;
}
@media (min-width: 1024px) {
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-image-row,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] {
    display: flex !important;
    flex-wrap: nowrap !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] > img[data-saved-width] {
    flex: 0 1 var(--saved-width, auto) !important;
    max-width: var(--saved-width, 100%) !important;
    width: var(--saved-width, auto) !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-image-row figure.blog-figure,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure.blog-figure,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] [data-image-text] {
    flex: 0 1 var(--saved-width, auto) !important;
    max-width: var(--saved-width, 100%) !important;
  }
}
@media (max-width: 1023px) {
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-image-row,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px !important;
    justify-content: stretch !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row]:has(> :nth-child(1):last-child) {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] > img,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] > figure,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] > [data-image-text] {
    flex: unset !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] > figure.blog-figure.blog-img-top,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] > figure.blog-img-top {
    float: none !important;
    clear: none !important;
    margin: 0 !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] img.blog-img-top {
    clear: none !important;
    float: none !important;
    width: 100% !important;
    max-width: 100% !important;
  }
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] > img {
  float: none !important;
  clear: none !important;
  margin: 0 !important;
  display: block !important;
  height: auto !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-image-row figure.blog-figure,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure.blog-figure,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] [data-image-text] {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  min-width: 0 !important;
  float: none !important;
  clear: none !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-image-row figure.blog-figure img,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure.blog-figure img,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] [data-image-text] img {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  float: none !important;
  margin: 0 !important;
  display: block !important;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h1,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h2,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h3,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h4,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure p,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] .blog-image-row-caption {
  width: 100% !important;
  text-align: center !important;
  margin: 0.35em 0 0 !important;
  white-space: normal !important;
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  line-height: 1.35 !important;
  color: #F2EDD8 !important;
}
@media (max-width: 1023px) {
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h1,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h2,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h3,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h4,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure p,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] .blog-image-row-caption {
    font-size: 0.82rem !important;
    line-height: 1.4 !important;
    font-weight: 500 !important;
    letter-spacing: 0.01em !important;
    padding: 0 2px !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h1 span,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h2 span,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h3 span,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] figure h4 span,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-image-row] .blog-image-row-caption span {
    font-size: inherit !important;
    line-height: inherit !important;
  }
}

.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] {
  border: 1px solid rgba(201, 168, 76, 0.22);
  border-radius: 0.5rem;
  padding: 0.75rem 0.85rem;
  box-sizing: border-box;
  background: rgba(14, 13, 9, 0.45);
  color: rgba(242, 237, 216, 0.85);
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card h1,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card h2,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card h3,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card h4,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] h1,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] h2,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] h3,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] h4 {
  color: #F2EDD8 !important;
  background-color: transparent !important;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card p,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card span,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card strong,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card em,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] p,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] span,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] strong,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] em {
  color: rgba(242, 237, 216, 0.85) !important;
  background-color: transparent !important;
}
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card mark,
.${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] mark {
  background: none !important;
  background-color: transparent !important;
  color: inherit !important;
  padding: 0 !important;
}

/* Card rows on tablet+ */
@media (min-width: 768px) {
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card-row,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-card-row] {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 12px !important;
    align-items: stretch !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] {
    flex: 1 1 180px !important;
    min-width: 160px !important;
    width: auto !important;
    max-width: 100% !important;
  }
}

/* Mobile — typography + card grid; image rows keep admin widths (shrink only) */
@media (max-width: 767px) {
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal {
    font-size: 15px;
    overflow-x: hidden;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h1 { font-size: 1.45rem; }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h2 { font-size: 1.25rem; }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h3 { font-size: 1.1rem; }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal h4 { font-size: 1.05rem; }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal img.blog-img-left,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal img.blog-img-right,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal img.blog-img-wrap {
    float: none !important;
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0.75rem 0 !important;
  }

  /* Cards: 3 per row; exactly 4 → 2+2; exactly 2 → 2; exactly 1 → 1; 5 → 3+2 */
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card-row,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-card-row] {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 10px !important;
    align-items: stretch !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card-row:has(> :nth-child(1):last-child),
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-card-row]:has(> :nth-child(1):last-child) {
    grid-template-columns: 1fr !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card-row:has(> :nth-child(2):last-child),
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-card-row]:has(> :nth-child(2):last-child),
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card-row:has(> :nth-child(4):last-child),
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-card-row]:has(> :nth-child(4):last-child) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] {
    flex: unset !important;
    min-width: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    padding: 0.55rem 0.65rem !important;
    font-size: 13px !important;
    line-height: 1.45 !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card h1,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card h2,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card h3,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card h4,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] h1,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] h2,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] h3,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] h4 {
    font-size: 1rem !important;
    margin: 0.2em 0 !important;
    color: #F2EDD8;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card p,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] p {
    font-size: 13px !important;
    margin: 0.25em 0 !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-card span,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal div[data-blog-card] span {
    font-size: 1em !important;
  }

  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal figure.blog-figure.blog-img-left,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal figure.blog-figure.blog-img-right,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal figure.blog-figure.blog-img-wrap {
    float: none !important;
    display: flex !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0.75rem 0 !important;
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-figcaption,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal figure.blog-figure figcaption {
    color: rgba(242, 237, 216, 0.62);
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .tableWrapper,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal .blog-table-scroll {
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    border-radius: 0.65rem;
    background-image: linear-gradient(90deg, rgba(201,168,76,0.08), transparent 12%, transparent 88%, rgba(201,168,76,0.08));
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal table {
    width: max(100%, 560px);
  }
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal td,
  .${BLOG_RENDERED_CONTENT_CLASS}.blog-rendered-content--portal th {
    padding: 0.55rem 0.65rem;
    font-size: 0.92em;
  }
}
`;

export const BLOG_RENDERED_CONTENT_CSS = BASE_CSS;
export const BLOG_RENDERED_CONTENT_PORTAL_CSS = BASE_CSS + PORTAL_OVERRIDE_CSS;
