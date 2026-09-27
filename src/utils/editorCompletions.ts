import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { snippet } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';

/* ---------------------------------------------------------
   Void HTML Tags (Tags without closing tags)
   --------------------------------------------------------- */
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/* ---------------------------------------------------------
   Comprehensive HTML Tag List
   --------------------------------------------------------- */
const HTML_TAGS = [
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi',
  'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code',
  'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog',
  'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer',
  'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr',
  'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li',
  'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object',
  'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress',
  'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small',
  'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody',
  'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
  'track', 'u', 'ul', 'var', 'video', 'wbr'
];

/* ---------------------------------------------------------
   Standard HTML Attributes
   --------------------------------------------------------- */
const HTML_ATTRIBUTES = [
  'class', 'id', 'style', 'src', 'href', 'type', 'name', 'value', 'placeholder',
  'target', 'rel', 'title', 'alt', 'width', 'height', 'disabled', 'required',
  'readonly', 'checked', 'selected', 'autofocus', 'autocomplete', 'role',
  'aria-label', 'aria-hidden', 'aria-expanded', 'tabindex', 'data-', 'hidden',
  'onclick', 'onchange', 'onsubmit', 'method', 'action', 'rows', 'cols',
  'download', 'preload', 'crossorigin', 'integrity', 'loading', 'as'
];

/* ---------------------------------------------------------
   Tag Specific Inbuilt Snippets (With Required Attributes)
   --------------------------------------------------------- */
export const TAG_SNIPPET_TEMPLATES: Record<string, { label: string; apply: any; detail: string }> = {
  // 1. Anchor Tag with inbuilt required href attribute
  'a': {
    label: '<a href>',
    apply: snippet('<a href="${1:#}">${0}</a>'),
    detail: 'Anchor link with href attribute'
  },
  'button': {
    label: '<button>',
    apply: snippet('<button type="${1:button}">${0}</button>'),
    detail: 'Button with type attribute'
  },
  'img': {
    label: '<img src alt>',
    apply: snippet('<img src="${1}" alt="${2}" />'),
    detail: 'Image with required src and alt'
  },
  'input': {
    label: '<input type>',
    apply: snippet('<input type="${1:text}" placeholder="${2}" />'),
    detail: 'Input element with type attribute'
  },
  'link': {
    label: '<link rel="stylesheet">',
    apply: snippet('<link rel="stylesheet" href="${1:style.css}">'),
    detail: 'Link external CSS stylesheet'
  },
  'script': {
    label: '<script src>',
    apply: snippet('<script src="${1:script.js}"></script>'),
    detail: 'External JavaScript script tag'
  },
  'form': {
    label: '<form action method>',
    apply: snippet('<form action="${1}" method="${2:post}">\n  ${0}\n</form>'),
    detail: 'Form with action and method'
  },
  'select': {
    label: '<select option>',
    apply: snippet('<select name="${1:select}">\n  <option value="${2:val1}">${3:Option 1}</option>\n  <option value="${4:val2}">${5:Option 2}</option>\n</select>'),
    detail: 'Select dropdown menu'
  },
  'textarea': {
    label: '<textarea>',
    apply: snippet('<textarea name="${1}" rows="${2:4}" placeholder="${3}"></textarea>'),
    detail: 'Multi-line text area'
  },
  'audio': {
    label: '<audio controls>',
    apply: snippet('<audio controls src="${1}"></audio>'),
    detail: 'Audio player with controls'
  },
  'video': {
    label: '<video controls>',
    apply: snippet('<video controls width="${1:640}">\n  <source src="${2}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>'),
    detail: 'Video player with controls'
  },
  'iframe': {
    label: '<iframe src>',
    apply: snippet('<iframe src="${1}" width="${2:100%}" height="${3:400}" frameborder="0"></iframe>'),
    detail: 'Embedded iframe frame'
  },
  'table': {
    label: '<table>',
    apply: snippet('<table>\n  <thead>\n    <tr>\n      <th>${1:Header}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>${2:Data}</td>\n    </tr>\n  </tbody>\n</table>'),
    detail: 'HTML Table structure'
  }
};

/* ---------------------------------------------------------
   All Types of Link & Script Linking Snippets
   --------------------------------------------------------- */
export const LINK_AND_SCRIPT_SNIPPETS = [
  // Link Variants
  {
    prefix: 'link:css',
    label: 'link:css',
    apply: snippet('<link rel="stylesheet" href="${1:style.css}">'),
    detail: 'Link external CSS stylesheet',
    boost: 10
  },
  {
    prefix: 'link:suicss',
    label: 'link:suicss',
    apply: snippet('<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Suman-11-web/SUI-FRAMEWORK.CSS@v2.0.0/dist/sui.min.css">'),
    detail: 'SUI Framework 2.0 CSS CDN',
    boost: 12
  },
  {
    prefix: 'link:favicon',
    label: 'link:favicon',
    apply: snippet('<link rel="shortcut icon" href="${1:favicon.ico}" type="image/x-icon">'),
    detail: 'Link favicon icon',
    boost: 9
  },
  {
    prefix: 'link:font',
    label: 'link:font (Google Fonts)',
    apply: snippet('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="${1:https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap}" rel="stylesheet">'),
    detail: 'Google Fonts with preconnect links',
    boost: 9
  },
  {
    prefix: 'link:googlefonts',
    label: 'link:googlefonts',
    apply: snippet('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="${1:https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap}" rel="stylesheet">'),
    detail: 'Google Fonts preconnect + stylesheet',
    boost: 8
  },
  {
    prefix: 'link:fontawesome',
    label: 'link:fontawesome',
    apply: snippet('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">'),
    detail: 'Font Awesome 6 icons CDN',
    boost: 8
  },
  {
    prefix: 'link:bootstrap',
    label: 'link:bootstrap',
    apply: snippet('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">'),
    detail: 'Bootstrap 5.3 CSS CDN',
    boost: 8
  },
  {
    prefix: 'link:animate',
    label: 'link:animate',
    apply: snippet('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">'),
    detail: 'Animate.css CDN',
    boost: 7
  },
  {
    prefix: 'link:canonical',
    label: 'link:canonical',
    apply: snippet('<link rel="canonical" href="${1:https://example.com/}">'),
    detail: 'Canonical URL link',
    boost: 7
  },
  {
    prefix: 'link:manifest',
    label: 'link:manifest',
    apply: snippet('<link rel="manifest" href="${1:manifest.json}">'),
    detail: 'Web App Manifest link',
    boost: 7
  },
  {
    prefix: 'link:apple',
    label: 'link:apple-touch-icon',
    apply: snippet('<link rel="apple-touch-icon" href="${1:apple-touch-icon.png}">'),
    detail: 'Apple Touch Icon link',
    boost: 6
  },
  {
    prefix: 'link:preload',
    label: 'link:preload',
    apply: snippet('<link rel="preload" href="${1:style.css}" as="${2:style}">'),
    detail: 'Resource preload link',
    boost: 6
  },

  // Script Variants
  {
    prefix: 'link:js',
    label: 'link:js',
    apply: snippet('<script src="${1:script.js}"></script>'),
    detail: 'Link JavaScript file (<script src>)',
    boost: 10
  },
  {
    prefix: 'script:src',
    label: 'script:src',
    apply: snippet('<script src="${1:script.js}"></script>'),
    detail: 'External JavaScript script tag',
    boost: 10
  },
  {
    prefix: 'script:js',
    label: 'script:js',
    apply: snippet('<script src="${1:script.js}"></script>'),
    detail: 'External JavaScript script tag',
    boost: 10
  },
  {
    prefix: 'script:suijs',
    label: 'script:suijs',
    apply: snippet('<script src="https://cdn.jsdelivr.net/gh/Suman-11-web/SUI-FRAMEWORK.CSS@v2.0.0/dist/sui.min.js"></script>'),
    detail: 'SUI Framework 2.0 JavaScript CDN',
    boost: 12
  },
  {
    prefix: 'script:tailwind',
    label: 'script:tailwind',
    apply: snippet('<script src="https://cdn.tailwindcss.com"></script>'),
    detail: 'Tailwind CSS Play CDN script',
    boost: 9
  },
  {
    prefix: 'script:module',
    label: 'script:module',
    apply: snippet('<script type="module" src="${1:main.js}"></script>'),
    detail: 'ES Module script tag',
    boost: 8
  },
  {
    prefix: 'script:defer',
    label: 'script:defer',
    apply: snippet('<script src="${1:script.js}" defer></script>'),
    detail: 'Deferred script tag',
    boost: 8
  },
  {
    prefix: 'script:async',
    label: 'script:async',
    apply: snippet('<script src="${1:script.js}" async></script>'),
    detail: 'Asynchronous script tag',
    boost: 8
  },
  {
    prefix: 'script:confetti',
    label: 'script:confetti',
    apply: snippet('<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>'),
    detail: 'Canvas Confetti party animation CDN',
    boost: 8
  },
  {
    prefix: 'script:three',
    label: 'script:three (Three.js)',
    apply: snippet('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'),
    detail: 'Three.js 3D WebGL library CDN',
    boost: 8
  },
  {
    prefix: 'script:gsap',
    label: 'script:gsap',
    apply: snippet('<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>'),
    detail: 'GSAP Animation library CDN',
    boost: 8
  },
  {
    prefix: 'script:axios',
    label: 'script:axios',
    apply: snippet('<script src="https://cdn.jsdelivr.net/npm/axios@1.6.8/dist/axios.min.js"></script>'),
    detail: 'Axios HTTP Client CDN',
    boost: 7
  },
  {
    prefix: 'script:lodash',
    label: 'script:lodash',
    apply: snippet('<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>'),
    detail: 'Lodash Utility library CDN',
    boost: 7
  },

  // Anchor Variants (All with inbuilt href attribute)
  {
    prefix: 'a:blank',
    label: 'a:blank',
    apply: snippet('<a href="${1:https://}" target="_blank" rel="noopener noreferrer">${0}</a>'),
    detail: 'Link opening in new tab (_blank)',
    boost: 10
  },
  {
    prefix: 'a:external',
    label: 'a:external',
    apply: snippet('<a href="${1:https://}" target="_blank" rel="noopener noreferrer">${0}</a>'),
    detail: 'External link with secure rel',
    boost: 9
  },
  {
    prefix: 'a:mail',
    label: 'a:mail',
    apply: snippet('<a href="mailto:${1:name@example.com}">${0}</a>'),
    detail: 'Email mailto link',
    boost: 8
  },
  {
    prefix: 'a:tel',
    label: 'a:tel',
    apply: snippet('<a href="tel:${1:+1234567890}">${0}</a>'),
    detail: 'Telephone phone link',
    boost: 8
  },
  {
    prefix: 'a:btn',
    label: 'a:btn',
    apply: snippet('<a href="${1:#}" class="btn ${2:btn-primary}">${0}</a>'),
    detail: 'Anchor tag styled as button',
    boost: 9
  },
  {
    prefix: 'a:suibtn',
    label: 'a:suibtn',
    apply: snippet('<a href="${1:#}" class="sui-btn ${2:sui-btn-primary}">${0}</a>'),
    detail: 'Anchor tag styled as SUI button',
    boost: 9
  },
  {
    prefix: 'a:download',
    label: 'a:download',
    apply: snippet('<a href="${1:file.pdf}" download="${2:filename}">${0}</a>'),
    detail: 'Download file link',
    boost: 7
  },

  // Button Variants
  {
    prefix: 'btn',
    label: 'btn',
    apply: snippet('<button type="button" class="btn ${1:btn-primary}">${0}</button>'),
    detail: 'Button with class="btn"',
    boost: 10
  },
  {
    prefix: 'btn:primary',
    label: 'btn:primary',
    apply: snippet('<button type="button" class="btn btn-primary">${0}</button>'),
    detail: 'Primary action button',
    boost: 10
  },
  {
    prefix: 'btn:secondary',
    label: 'btn:secondary',
    apply: snippet('<button type="button" class="btn btn-secondary">${0}</button>'),
    detail: 'Secondary action button',
    boost: 9
  },
  {
    prefix: 'btn:outline',
    label: 'btn:outline',
    apply: snippet('<button type="button" class="btn btn-outline">${0}</button>'),
    detail: 'Outline action button',
    boost: 8
  },
  {
    prefix: 'btn:danger',
    label: 'btn:danger',
    apply: snippet('<button type="button" class="btn btn-danger">${0}</button>'),
    detail: 'Danger/Delete action button',
    boost: 8
  },
  {
    prefix: 'btn:sui',
    label: 'btn:sui',
    apply: snippet('<button type="button" class="sui-btn sui-btn-primary">${0}</button>'),
    detail: 'SUI Framework primary button',
    boost: 11
  },
  {
    prefix: 'btn:suisecondary',
    label: 'btn:suisecondary',
    apply: snippet('<button type="button" class="sui-btn sui-btn-secondary">${0}</button>'),
    detail: 'SUI Framework secondary button',
    boost: 9
  },
  {
    prefix: 'btn:suioutline',
    label: 'btn:suioutline',
    apply: snippet('<button type="button" class="sui-btn sui-btn-outline">${0}</button>'),
    detail: 'SUI Framework outline button',
    boost: 9
  },
  {
    prefix: 'btn:submit',
    label: 'btn:submit',
    apply: snippet('<button type="submit" class="btn btn-primary">${1:Submit}</button>'),
    detail: 'Submit form button',
    boost: 9
  },
  {
    prefix: 'button:submit',
    label: 'button:submit',
    apply: snippet('<button type="submit">${1:Submit}</button>'),
    detail: 'Submit button with type="submit"',
    boost: 10
  },
  {
    prefix: 'button:reset',
    label: 'button:reset',
    apply: snippet('<button type="reset">${1:Reset}</button>'),
    detail: 'Reset button with type="reset"',
    boost: 8
  },
  {
    prefix: 'btn:icon',
    label: 'btn:icon',
    apply: snippet('<button type="button" class="btn-icon" aria-label="${1:Action}">\n  ${0}\n</button>'),
    detail: 'Accessible icon button',
    boost: 7
  },

  // Input Variants
  {
    prefix: 'input:text',
    label: 'input:text',
    apply: snippet('<input type="text" name="${1}" placeholder="${2}" />'),
    detail: 'Text input with placeholder',
    boost: 9
  },
  {
    prefix: 'input:password',
    label: 'input:password',
    apply: snippet('<input type="password" name="${1}" placeholder="${2:Password}" />'),
    detail: 'Password input',
    boost: 8
  },
  {
    prefix: 'input:email',
    label: 'input:email',
    apply: snippet('<input type="email" name="${1}" placeholder="${2:name@example.com}" />'),
    detail: 'Email input with validation',
    boost: 8
  },
  {
    prefix: 'input:number',
    label: 'input:number',
    apply: snippet('<input type="number" name="${1}" min="${2:0}" max="${3:100}" />'),
    detail: 'Number input with min/max',
    boost: 7
  },
  {
    prefix: 'input:checkbox',
    label: 'input:checkbox',
    apply: snippet('<label class="checkbox-item"><input type="checkbox" name="${1}" /> ${2:Remember me}</label>'),
    detail: 'Checkbox input with label',
    boost: 7
  },
  {
    prefix: 'input:radio',
    label: 'input:radio',
    apply: snippet('<label class="radio-item"><input type="radio" name="${1:group}" value="${2}" /> ${3:Option}</label>'),
    detail: 'Radio input with label',
    boost: 7
  },
  {
    prefix: 'input:file',
    label: 'input:file',
    apply: snippet('<input type="file" name="${1}" accept="${2:image/*}" />'),
    detail: 'File upload input',
    boost: 7
  },
  {
    prefix: 'input:submit',
    label: 'input:submit',
    apply: snippet('<input type="submit" value="${1:Submit}" />'),
    detail: 'Submit input element',
    boost: 7
  },

  // Form Variants
  {
    prefix: 'form:post',
    label: 'form:post',
    apply: snippet('<form action="${1}" method="post">\n  ${0}\n</form>'),
    detail: 'Form with method="post"',
    boost: 9
  },
  {
    prefix: 'form:get',
    label: 'form:get',
    apply: snippet('<form action="${1}" method="get">\n  ${0}\n</form>'),
    detail: 'Form with method="get"',
    boost: 8
  },

  // Meta Tags
  {
    prefix: 'meta:vp',
    label: 'meta:vp (viewport)',
    apply: snippet('<meta name="viewport" content="width=device-width, initial-scale=1.0">'),
    detail: 'Responsive viewport meta tag',
    boost: 9
  },
  {
    prefix: 'meta:utf',
    label: 'meta:utf (charset)',
    apply: snippet('<meta charset="UTF-8">'),
    detail: 'UTF-8 charset meta tag',
    boost: 9
  },
  {
    prefix: 'meta:desc',
    label: 'meta:desc',
    apply: snippet('<meta name="description" content="${1}">'),
    detail: 'SEO page description meta tag',
    boost: 8
  },
  {
    prefix: 'meta:og',
    label: 'meta:og (OpenGraph)',
    apply: snippet('<meta property="og:title" content="${1}">\n<meta property="og:description" content="${2}">\n<meta property="og:image" content="${3}">'),
    detail: 'Social sharing OpenGraph meta tags',
    boost: 8
  },

  // Component Structures
  {
    prefix: 'card:sui',
    label: 'card:sui',
    apply: snippet('<div class="sui-card">\n  <div class="sui-card-header">\n    <h3 class="sui-card-title">${1:Card Title}</h3>\n  </div>\n  <div class="sui-card-body">\n    <p>${0}</p>\n  </div>\n</div>'),
    detail: 'SUI Framework card component',
    boost: 9
  },
  {
    prefix: 'alert:sui',
    label: 'alert:sui',
    apply: snippet('<div class="sui-alert sui-alert-info">\n  ${0:Information alert message}\n</div>'),
    detail: 'SUI Framework alert notification',
    boost: 8
  }
];

/* ---------------------------------------------------------
   Attribute-Specific Value Completions
   --------------------------------------------------------- */
const INPUT_TYPES = [
  'text', 'password', 'email', 'number', 'checkbox', 'radio',
  'button', 'submit', 'reset', 'file', 'date', 'time', 'color',
  'range', 'search', 'url', 'tel', 'hidden'
];

const TARGET_VALUES = ['_blank', '_self', '_parent', '_top'];

const REL_VALUES = [
  'stylesheet', 'noopener noreferrer', 'noopener', 'noreferrer',
  'icon', 'preload', 'prefetch', 'author', 'canonical', 'manifest'
];

const METHOD_VALUES = ['GET', 'POST'];

const COMMON_CLASSES = [
  'container', 'flex', 'grid', 'btn', 'card', 'active', 'hidden',
  'text-center', 'box', 'header', 'footer', 'nav', 'modal', 'badge',
  'items-center', 'justify-between', 'justify-center', 'gap-2', 'gap-4',
  'p-2', 'p-4', 'm-2', 'm-4', 'rounded-lg', 'shadow-md', 'w-full', 'h-full',
  'sui-btn', 'sui-card', 'sui-badge', 'sui-alert', 'sui-container', 'sui-grid'
];

/**
 * Determine if position is inside an unescaped quoted string (double or single quote).
 * Scans backward from pos on the current line to check for unmatched opening quotes.
 */
function checkQuoteContext(textBefore: string): { insideQuote: boolean; quoteChar: string; attrName?: string } {
  let insideDouble = false;
  let insideSingle = false;
  let lastQuotePos = -1;

  for (let i = 0; i < textBefore.length; i++) {
    const ch = textBefore[i];
    const prev = i > 0 ? textBefore[i - 1] : '';

    if (ch === '"' && prev !== '\\') {
      if (!insideSingle) {
        insideDouble = !insideDouble;
        if (insideDouble) lastQuotePos = i;
      }
    } else if (ch === "'" && prev !== '\\') {
      if (!insideDouble) {
        insideSingle = !insideSingle;
        if (insideSingle) lastQuotePos = i;
      }
    }
  }

  if (insideDouble || insideSingle) {
    const quoteChar = insideDouble ? '"' : "'";
    // Check if preceded by an attribute name (e.g. class=", type=')
    const beforeQuote = textBefore.slice(0, lastQuotePos);
    const attrMatch = beforeQuote.match(/([a-zA-Z0-9_\-]+)\s*=\s*$/);
    const attrName = attrMatch ? attrMatch[1].toLowerCase() : undefined;
    return { insideQuote: true, quoteChar, attrName };
  }

  return { insideQuote: false, quoteChar: '' };
}

/**
 * Return default snippet for an HTML tag
 */
function getTagSnippet(tag: string) {
  if (TAG_SNIPPET_TEMPLATES[tag]) {
    return TAG_SNIPPET_TEMPLATES[tag].apply;
  }
  if (VOID_TAGS.has(tag)) {
    return snippet(`<${tag} />`);
  }
  return snippet(`<${tag}>\${0}</${tag}>`);
}

/* ---------------------------------------------------------
   HTML Autocomplete Provider
   --------------------------------------------------------- */
export function htmlCompletions(context: CompletionContext): CompletionResult | null {
  const state = context.state;
  const pos = context.pos;
  const line = state.doc.lineAt(pos);
  const textBefore = line.text.slice(0, pos - line.from);

  // 1. Resolve syntax tree to inspect context node and ancestors
  let nodeName = '';
  let inScriptTag = false;
  let inStyleTag = false;

  try {
    const tree = syntaxTree(state);
    let curr = tree.resolveInner(pos, -1);
    nodeName = curr.name;

    // Walk up ancestor chain
    let temp: typeof curr | null = curr;
    while (temp) {
      if (temp.name === 'Script' || temp.name === 'ScriptText') inScriptTag = true;
      if (temp.name === 'StyleSheet' || temp.name === 'StyleText') inStyleTag = true;
      if (temp.name === 'AttributeValue' || temp.name === 'QuotedAttributeValue') {
        nodeName = 'AttributeValue';
      }
      temp = temp.parent;
    }
  } catch (e) {}

  // If inside <script>, delegate to JS completions (never suggest HTML tags!)
  if (inScriptTag) {
    return jsCompletions(context);
  }

  // If inside <style>, delegate to CSS completions (never suggest HTML tags!)
  if (inStyleTag) {
    return cssCompletions(context);
  }

  // 2. Check if cursor is inside double or single quotes
  const quoteCtx = checkQuoteContext(textBefore);

  if (quoteCtx.insideQuote || nodeName === 'AttributeValue' || nodeName.includes('String') || nodeName === 'Comment') {
    // Determine the attribute we are in
    let attr = quoteCtx.attrName;
    if (!attr) {
      const match = textBefore.match(/([a-zA-Z0-9_\-]+)\s*=\s*["'][^"']*$/);
      if (match) attr = match[1].toLowerCase();
    }

    const word = context.matchBefore(/[a-zA-Z0-9_\-]*/);
    const fromPos = word ? word.from : pos;

    // Attribute-specific completions inside quotes
    if (attr === 'class') {
      if (!word || (word.from === word.to && !context.explicit)) return null;
      return {
        from: fromPos,
        options: COMMON_CLASSES.map(cls => ({
          label: cls,
          type: 'keyword',
          detail: 'CSS class'
        }))
      };
    }

    if (attr === 'type') {
      return {
        from: fromPos,
        options: INPUT_TYPES.map(t => ({
          label: t,
          type: 'keyword',
          detail: 'Input type'
        }))
      };
    }

    if (attr === 'target') {
      return {
        from: fromPos,
        options: TARGET_VALUES.map(t => ({
          label: t,
          type: 'keyword',
          detail: 'Link target'
        }))
      };
    }

    if (attr === 'rel') {
      return {
        from: fromPos,
        options: REL_VALUES.map(r => ({
          label: r,
          type: 'keyword',
          detail: 'Link relation'
        }))
      };
    }

    if (attr === 'method') {
      return {
        from: fromPos,
        options: METHOD_VALUES.map(m => ({
          label: m,
          type: 'keyword',
          detail: 'Form method'
        }))
      };
    }

    // Inside ANY other double quote or string: DO NOT SUGGEST TAGS!
    return null;
  }

  // 3. Check if inside a tag definition (between '<tagname' and '>')
  const lastOpen = textBefore.lastIndexOf('<');
  const lastClose = textBefore.lastIndexOf('>');
  const insideTag = lastOpen > lastClose;

  if (insideTag) {
    const tagContent = textBefore.slice(lastOpen + 1);

    // If typing tag name immediately after '<' (e.g. '<d' or '<h1' without space)
    if (!/\s/.test(tagContent)) {
      const word = context.matchBefore(/<[a-zA-Z0-9_\-:]*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;

      // Check link / script / button shortcuts first
      const specialMatches = LINK_AND_SCRIPT_SNIPPETS.map(snip => ({
        label: `<${snip.prefix}>`,
        apply: snip.apply,
        type: 'keyword',
        detail: snip.detail,
        boost: snip.boost + 2
      }));

      const standardTags = HTML_TAGS.map(tag => ({
        label: `<${tag}>`,
        apply: getTagSnippet(tag),
        type: 'type',
        detail: TAG_SNIPPET_TEMPLATES[tag]?.detail || (VOID_TAGS.has(tag) ? 'Self-closing tag' : `HTML <${tag}> tag`),
        boost: tag === 'a' || tag === 'button' || tag === 'div' || tag === 'link' || tag === 'script' ? 5 : 2
      }));

      return {
        from: word.from,
        options: [...specialMatches, ...standardTags]
      };
    }

    // Space exists after tag name -> user is typing attributes (e.g. '<a ' or '<button ')
    const word = context.matchBefore(/[a-zA-Z0-9_\-]*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    // Detect current tag name to boost tag-specific attributes (e.g. href for a, src for img)
    const tagMatch = tagContent.match(/^([a-zA-Z0-9_\-]+)/);
    const currentTagName = tagMatch ? tagMatch[1].toLowerCase() : '';

    return {
      from: word.from,
      options: HTML_ATTRIBUTES.map(attr => {
        let boost = 2;
        if (currentTagName === 'a' && (attr === 'href' || attr === 'target' || attr === 'rel')) boost = 10;
        if (currentTagName === 'img' && (attr === 'src' || attr === 'alt')) boost = 10;
        if (currentTagName === 'button' && (attr === 'type' || attr === 'onclick')) boost = 10;
        if (currentTagName === 'link' && (attr === 'rel' || attr === 'href')) boost = 10;
        if (currentTagName === 'script' && (attr === 'src' || attr === 'type')) boost = 10;

        return {
          label: attr,
          apply: snippet(`${attr}="\${0}"`),
          type: 'property',
          detail: `HTML attribute (${attr})`,
          boost
        };
      })
    };
  }

  // 4. In document body / text area:
  // Match word including colon ':' for shortcuts like link:css, script:src, a:blank, btn:primary
  const word = context.matchBefore(/<?[a-zA-Z0-9_\-:]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const text = word.text;

  // Emmet boilerplate '!' or '<!'
  if (text === '!' || text === '<!') {
    return {
      from: word.from,
      options: [{
        label: '! (HTML5 Boilerplate)',
        apply: snippet('<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${1:Document}</title>\n</head>\n<body>\n  ${0}\n</body>\n</html>'),
        type: 'keyword',
        detail: 'Emmet HTML5 template',
        boost: 20
      }]
    };
  }

  // Check if starts with '<'
  const startsWithBracket = text.startsWith('<');

  // Match special link, script, anchor, and button shortcuts (e.g. link:css, link:suicss, a:blank, btn:primary)
  const specialOptions = LINK_AND_SCRIPT_SNIPPETS.map(snip => ({
    label: startsWithBracket ? `<${snip.prefix}>` : snip.prefix,
    apply: snip.apply,
    type: 'keyword',
    detail: snip.detail,
    boost: snip.boost
  }));

  // Standard HTML tags with inbuilt attributes
  const standardTagOptions = HTML_TAGS.map(tag => ({
    label: startsWithBracket ? `<${tag}>` : tag,
    apply: getTagSnippet(tag),
    type: 'type',
    detail: TAG_SNIPPET_TEMPLATES[tag]?.detail || `HTML <${tag}> tag`,
    boost: tag === 'a' || tag === 'button' || tag === 'div' || tag === 'link' || tag === 'script' ? 6 : 2
  }));

  return {
    from: word.from,
    options: [...specialOptions, ...standardTagOptions]
  };
}

/* ---------------------------------------------------------
   Comprehensive CSS Properties, Values & Selectors Autocomplete List
   --------------------------------------------------------- */
const CSS_PROPERTIES: { prop: string; detail?: string; snippetVal?: string; type?: string }[] = [
  // Layout & Box Model
  { prop: 'display', detail: 'flex | grid | block | inline-block | none | contents', snippetVal: 'display: ${1:flex};' },
  { prop: 'position', detail: 'relative | absolute | fixed | sticky | static', snippetVal: 'position: ${1:relative};' },
  { prop: 'top', snippetVal: 'top: ${1:0};' },
  { prop: 'right', snippetVal: 'right: ${1:0};' },
  { prop: 'bottom', snippetVal: 'bottom: ${1:0};' },
  { prop: 'left', snippetVal: 'left: ${1:0};' },
  { prop: 'inset', detail: 'top right bottom left', snippetVal: 'inset: ${1:0};' },
  { prop: 'z-index', detail: 'stack order integer', snippetVal: 'z-index: ${1:10};' },
  { prop: 'width', snippetVal: 'width: ${1:100%};' },
  { prop: 'min-width', snippetVal: 'min-width: ${1:0};' },
  { prop: 'max-width', snippetVal: 'max-width: ${1:1200px};' },
  { prop: 'height', snippetVal: 'height: ${1:100%};' },
  { prop: 'min-height', snippetVal: 'min-height: ${1:100vh};' },
  { prop: 'max-height', snippetVal: 'max-height: ${1};' },
  { prop: 'aspect-ratio', detail: '16/9 | 1/1 | 4/3', snippetVal: 'aspect-ratio: ${1:16 / 9};' },
  { prop: 'box-sizing', detail: 'border-box | content-box', snippetVal: 'box-sizing: ${1:border-box};' },
  { prop: 'margin', snippetVal: 'margin: ${1:0};' },
  { prop: 'margin-top', snippetVal: 'margin-top: ${1:1rem};' },
  { prop: 'margin-right', snippetVal: 'margin-right: ${1:1rem};' },
  { prop: 'margin-bottom', snippetVal: 'margin-bottom: ${1:1rem};' },
  { prop: 'margin-left', snippetVal: 'margin-left: ${1:1rem};' },
  { prop: 'padding', snippetVal: 'padding: ${1:1rem};' },
  { prop: 'padding-top', snippetVal: 'padding-top: ${1:1rem};' },
  { prop: 'padding-right', snippetVal: 'padding-right: ${1:1rem};' },
  { prop: 'padding-bottom', snippetVal: 'padding-bottom: ${1:1rem};' },
  { prop: 'padding-left', snippetVal: 'padding-left: ${1:1rem};' },

  // Flexbox & Grid
  { prop: 'flex', snippetVal: 'flex: ${1:1};' },
  { prop: 'flex-direction', detail: 'row | column | row-reverse | column-reverse', snippetVal: 'flex-direction: ${1:column};' },
  { prop: 'flex-wrap', detail: 'nowrap | wrap | wrap-reverse', snippetVal: 'flex-wrap: ${1:wrap};' },
  { prop: 'flex-grow', snippetVal: 'flex-grow: ${1:1};' },
  { prop: 'flex-shrink', snippetVal: 'flex-shrink: ${1:0};' },
  { prop: 'flex-basis', snippetVal: 'flex-basis: ${1:auto};' },
  { prop: 'justify-content', detail: 'center | flex-start | flex-end | space-between | space-around | space-evenly', snippetVal: 'justify-content: ${1:center};' },
  { prop: 'align-items', detail: 'center | flex-start | flex-end | stretch | baseline', snippetVal: 'align-items: ${1:center};' },
  { prop: 'align-self', detail: 'auto | center | flex-start | flex-end | stretch', snippetVal: 'align-self: ${1:center};' },
  { prop: 'align-content', snippetVal: 'align-content: ${1:center};' },
  { prop: 'gap', snippetVal: 'gap: ${1:1rem};' },
  { prop: 'row-gap', snippetVal: 'row-gap: ${1:1rem};' },
  { prop: 'column-gap', snippetVal: 'column-gap: ${1:1rem};' },
  { prop: 'grid', snippetVal: 'grid: ${1};' },
  { prop: 'grid-template-columns', snippetVal: 'grid-template-columns: repeat(${1:3}, 1fr);' },
  { prop: 'grid-template-rows', snippetVal: 'grid-template-rows: ${1:auto};' },
  { prop: 'grid-column', snippetVal: 'grid-column: span ${1:2};' },
  { prop: 'grid-row', snippetVal: 'grid-row: span ${1:2};' },
  { prop: 'place-items', detail: 'align-items and justify-items shorthand', snippetVal: 'place-items: ${1:center};' },
  { prop: 'place-content', snippetVal: 'place-content: ${1:center};' },

  // Typography & Text
  { prop: 'color', snippetVal: 'color: ${1:#ffffff};' },
  { prop: 'font-family', snippetVal: "font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" },
  { prop: 'font-size', snippetVal: 'font-size: ${1:1rem};' },
  { prop: 'font-weight', detail: '100 - 900 | bold | normal', snippetVal: 'font-weight: ${1:600};' },
  { prop: 'line-height', snippetVal: 'line-height: ${1:1.5};' },
  { prop: 'letter-spacing', snippetVal: 'letter-spacing: ${1:0.05em};' },
  { prop: 'text-align', detail: 'left | center | right | justify', snippetVal: 'text-align: ${1:center};' },
  { prop: 'text-decoration', detail: 'none | underline | line-through', snippetVal: 'text-decoration: ${1:none};' },
  { prop: 'text-transform', detail: 'uppercase | lowercase | capitalize | none', snippetVal: 'text-transform: ${1:uppercase};' },
  { prop: 'text-overflow', detail: 'ellipsis | clip', snippetVal: 'text-overflow: ${1:ellipsis};' },
  { prop: 'text-shadow', snippetVal: 'text-shadow: 0 2px 4px rgba(0, 0, 0, ${1:0.2});' },
  { prop: 'white-space', detail: 'normal | nowrap | pre | pre-wrap', snippetVal: 'white-space: ${1:nowrap};' },
  { prop: 'word-break', detail: 'normal | break-all | keep-all | break-word', snippetVal: 'word-break: ${1:break-word};' },

  // Background & Borders
  { prop: 'background', snippetVal: 'background: ${1:#0f172a};' },
  { prop: 'background-color', snippetVal: 'background-color: ${1:#1e293b};' },
  { prop: 'background-image', snippetVal: 'background-image: ${1:linear-gradient(135deg, #6366f1, #a855f7)};' },
  { prop: 'background-size', detail: 'cover | contain | auto', snippetVal: 'background-size: ${1:cover};' },
  { prop: 'background-position', detail: 'center | top | bottom | left | right', snippetVal: 'background-position: ${1:center};' },
  { prop: 'background-repeat', detail: 'no-repeat | repeat | repeat-x | repeat-y', snippetVal: 'background-repeat: no-repeat;' },
  { prop: 'background-clip', detail: 'border-box | padding-box | content-box | text', snippetVal: 'background-clip: ${1:text};' },
  { prop: 'border', snippetVal: 'border: 1px solid ${1:#e2e8f0};' },
  { prop: 'border-radius', snippetVal: 'border-radius: ${1:8px};' },
  { prop: 'border-color', snippetVal: 'border-color: ${1:#3b82f6};' },
  { prop: 'border-width', snippetVal: 'border-width: ${1:1px};' },
  { prop: 'border-style', detail: 'solid | dashed | dotted | none', snippetVal: 'border-style: ${1:solid};' },
  { prop: 'outline', snippetVal: 'outline: 2px solid ${1:#3b82f6};' },
  { prop: 'outline-offset', snippetVal: 'outline-offset: ${1:2px};' },
  { prop: 'box-shadow', snippetVal: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);' },

  // Visual Effects, Transforms & Filters
  { prop: 'opacity', snippetVal: 'opacity: ${1:1};' },
  { prop: 'transform', snippetVal: 'transform: ${1:translateY(-2px)};' },
  { prop: 'transform-origin', snippetVal: 'transform-origin: ${1:center};' },
  { prop: 'transition', snippetVal: 'transition: all ${1:0.2s} ease;' },
  { prop: 'transition-property', snippetVal: 'transition-property: ${1:all};' },
  { prop: 'transition-duration', snippetVal: 'transition-duration: ${1:0.3s};' },
  { prop: 'transition-timing-function', detail: 'ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier', snippetVal: 'transition-timing-function: ${1:ease-in-out};' },
  { prop: 'filter', detail: 'blur() | brightness() | contrast() | drop-shadow() | grayscale()', snippetVal: 'filter: ${1:blur(4px)};' },
  { prop: 'backdrop-filter', detail: 'blur() | saturate() | brightness()', snippetVal: 'backdrop-filter: blur(${1:12px});' },
  { prop: 'clip-path', snippetVal: 'clip-path: ${1:polygon(0 0, 100% 0, 100% 100%, 0 100%)};' },
  { prop: 'overflow', detail: 'hidden | visible | auto | scroll', snippetVal: 'overflow: ${1:hidden};' },
  { prop: 'overflow-x', snippetVal: 'overflow-x: ${1:auto};' },
  { prop: 'overflow-y', snippetVal: 'overflow-y: ${1:auto};' },

  // Animations & Keyframes
  { prop: 'animation', snippetVal: 'animation: ${1:spin} ${2:1s} ${3:linear} ${4:infinite};' },
  { prop: 'animation-name', snippetVal: 'animation-name: ${1:fadeIn};' },
  { prop: 'animation-duration', snippetVal: 'animation-duration: ${1:0.5s};' },
  { prop: 'animation-timing-function', snippetVal: 'animation-timing-function: ${1:ease-in-out};' },
  { prop: 'animation-iteration-count', detail: 'infinite | 1 | 2...', snippetVal: 'animation-iteration-count: ${1:infinite};' },
  { prop: 'animation-fill-mode', detail: 'forwards | backwards | both', snippetVal: 'animation-fill-mode: ${1:forwards};' },
  { prop: 'animation-delay', snippetVal: 'animation-delay: ${1:0.2s};' },

  // User Interaction & System
  { prop: 'cursor', detail: 'pointer | default | not-allowed | grab | text', snippetVal: 'cursor: pointer;' },
  { prop: 'pointer-events', detail: 'auto | none', snippetVal: 'pointer-events: ${1:auto};' },
  { prop: 'user-select', detail: 'none | auto | text | all', snippetVal: 'user-select: none;' },
  { prop: 'scroll-behavior', detail: 'smooth | auto', snippetVal: 'scroll-behavior: smooth;' },
  { prop: 'accent-color', snippetVal: 'accent-color: ${1:#3b82f6};' },
  { prop: 'content', detail: 'Generated content for ::before / ::after', snippetVal: 'content: "${1}";' },
  { prop: 'visibility', detail: 'visible | hidden | collapse', snippetVal: 'visibility: ${1:hidden};' },
  { prop: 'will-change', detail: 'transform | opacity | scroll-position', snippetVal: 'will-change: ${1:transform};' },

  // Selectors & Pseudo-Classes (Direct snippets)
  { prop: ':hover', detail: 'State when mouse is over element', snippetVal: ':hover {\n  ${0}\n}' },
  { prop: ':focus', detail: 'State when element receives focus', snippetVal: ':focus {\n  outline: 2px solid ${1:#3b82f6};\n  outline-offset: 2px;\n}' },
  { prop: ':focus-visible', detail: 'Accessible keyboard focus state', snippetVal: ':focus-visible {\n  outline: 2px solid ${1:#3b82f6};\n  outline-offset: 2px;\n}' },
  { prop: ':active', detail: 'State when element is being clicked', snippetVal: ':active {\n  transform: scale(${1:0.98});\n}' },
  { prop: '::before', detail: 'Pseudo-element inserted before content', snippetVal: '::before {\n  content: "";\n  ${0}\n}' },
  { prop: '::after', detail: 'Pseudo-element inserted after content', snippetVal: '::after {\n  content: "";\n  ${0}\n}' },
  { prop: ':root', detail: 'CSS custom properties root selector', snippetVal: ':root {\n  --primary: ${1:#6366f1};\n  --bg: ${2:#0f172a};\n  --text: ${3:#f8fafc};\n}' },
  { prop: '@keyframes', detail: 'Define CSS animation keyframes', snippetVal: '@keyframes ${1:pulse} {\n  0% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.05); opacity: 0.8; }\n  100% { transform: scale(1); opacity: 1; }\n}' },
  { prop: '@media', detail: 'Responsive media query breakpoint', snippetVal: '@media (max-width: ${1:768px}) {\n  ${0}\n}' }
];

export function cssCompletions(context: CompletionContext): CompletionResult | null {
  const line = context.state.doc.lineAt(context.pos);
  const textBefore = line.text.slice(0, context.pos - line.from);

  // Check quotes - inside quotes: NEVER suggest properties
  const quoteCtx = checkQuoteContext(textBefore);
  if (quoteCtx.insideQuote) return null;

  try {
    const node = syntaxTree(context.state).resolveInner(context.pos, -1);
    if (node.name === 'StringLiteral' || node.name === 'Comment' || node.name === 'BlockComment') return null;
  } catch (e) {}

  const word = context.matchBefore(/[:@a-zA-Z0-9_\-]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  return {
    from: word.from,
    options: CSS_PROPERTIES.map(item => ({
      label: item.prop,
      apply: snippet(item.snippetVal || `${item.prop}: \${0};`),
      type: item.prop.startsWith(':') || item.prop.startsWith('@') ? 'keyword' : 'property',
      detail: item.detail || 'CSS property'
    }))
  };
}

/* ---------------------------------------------------------
   JavaScript DOM & Built-in Snippets Autocomplete List
   --------------------------------------------------------- */
const JS_SNIPPETS = [
  // Console
  { label: 'console.log', apply: snippet('console.log(${0});'), detail: 'Log message to console' },
  { label: 'console.warn', apply: snippet('console.warn(${0});'), detail: 'Log warning to console' },
  { label: 'console.error', apply: snippet('console.error(${0});'), detail: 'Log error to console' },
  { label: 'console.table', apply: snippet('console.table(${0});'), detail: 'Log data in table format' },
  { label: 'console.time', apply: snippet('console.time("${1:timer}");\n${0}\nconsole.timeEnd("${1:timer}");'), detail: 'Benchmark execution time' },

  // DOM Selection & Elements
  { label: 'document.getElementById', apply: snippet('document.getElementById("${1:id}")'), detail: 'Select element by ID' },
  { label: 'document.querySelector', apply: snippet('document.querySelector("${1:selector}")'), detail: 'Query single element' },
  { label: 'document.querySelectorAll', apply: snippet('document.querySelectorAll("${1:selector}")'), detail: 'Query all elements matching selector' },
  { label: 'document.createElement', apply: snippet('const ${1:el} = document.createElement("${2:div}");'), detail: 'Create a new DOM node' },
  { label: 'element.appendChild', apply: snippet('${1:parent}.appendChild(${2:child});'), detail: 'Append child element' },
  { label: 'element.addEventListener', apply: snippet('${1:element}.addEventListener("${2:click}", (e) => {\n  ${0}\n});'), detail: 'Attach event listener' },
  { label: 'element.classList.add', apply: snippet('${1:element}.classList.add("${2:className}");'), detail: 'Add CSS class' },
  { label: 'element.classList.remove', apply: snippet('${1:element}.classList.remove("${2:className}");'), detail: 'Remove CSS class' },
  { label: 'element.classList.toggle', apply: snippet('${1:element}.classList.toggle("${2:className}");'), detail: 'Toggle CSS class' },
  { label: 'element.setAttribute', apply: snippet('${1:element}.setAttribute("${2:attr}", "${3:val}");'), detail: 'Set HTML attribute' },
  { label: 'element.getAttribute', apply: snippet('${1:element}.getAttribute("${2:attr}")'), detail: 'Get HTML attribute' },
  { label: 'element.innerHTML', apply: snippet('${1:element}.innerHTML = `${2:content}`;'), detail: 'Set element inner HTML' },
  { label: 'element.textContent', apply: snippet('${1:element}.textContent = "${2:text}";'), detail: 'Set element text content' },
  { label: 'element.style', apply: snippet('${1:element}.style.${2:display} = "${3:block}";'), detail: 'Direct inline style' },

  // Events & Timing
  { label: 'addEventListener', apply: snippet('addEventListener("${1:click}", (event) => {\n  ${0}\n});'), detail: 'Attach event listener' },
  { label: 'setTimeout', apply: snippet('setTimeout(() => {\n  ${0}\n}, ${1:1000});'), detail: 'Execute once after delay' },
  { label: 'setInterval', apply: snippet('setInterval(() => {\n  ${0}\n}, ${1:1000});'), detail: 'Execute periodically' },
  { label: 'requestAnimationFrame', apply: snippet('function loop() {\n  ${0}\n  requestAnimationFrame(loop);\n}\nrequestAnimationFrame(loop);'), detail: 'Smooth 60fps animation loop' },

  // HTTP & Asynchronous
  { label: 'fetch (JSON)', apply: snippet('fetch("${1:https://api.example.com/data}")\n  .then(res => res.json())\n  .then(data => {\n    ${0}\n  })\n  .catch(err => console.error(err));'), detail: 'Fetch API GET JSON' },
  { label: 'async/await function', apply: snippet('async function ${1:loadData}() {\n  try {\n    const response = await fetch("${2:url}");\n    const data = await response.json();\n    ${0}\n  } catch (err) {\n    console.error(err);\n  }\n}'), detail: 'Async function with try/catch' },
  { label: 'new Promise', apply: snippet('new Promise((resolve, reject) => {\n  ${0}\n});'), detail: 'Create a new Promise' },
  { label: 'Promise.all', apply: snippet('Promise.all([${1:promise1}, ${2:promise2}]).then(([res1, res2]) => {\n  ${0}\n});'), detail: 'Wait for all promises' },

  // Storage
  { label: 'localStorage.setItem', apply: snippet('localStorage.setItem("${1:key}", JSON.stringify(${2:value}));'), detail: 'Save data to localStorage' },
  { label: 'localStorage.getItem', apply: snippet('JSON.parse(localStorage.getItem("${1:key}") || "null")'), detail: 'Read data from localStorage' },

  // Array Methods
  { label: 'array.map', apply: snippet('${1:array}.map((${2:item}) => ${3:item})'), detail: 'Array map transform' },
  { label: 'array.filter', apply: snippet('${1:array}.filter((${2:item}) => ${3:item})'), detail: 'Array filter condition' },
  { label: 'array.reduce', apply: snippet('${1:array}.reduce((acc, curr) => acc + curr, 0)'), detail: 'Array reduce accumulator' },
  { label: 'array.forEach', apply: snippet('${1:array}.forEach((${2:item}) => {\n  ${0}\n});'), detail: 'Array forEach loop' },
  { label: 'array.find', apply: snippet('${1:array}.find((${2:item}) => ${3:item.id === id})'), detail: 'Find first matching element' },
  { label: 'array.includes', apply: snippet('${1:array}.includes(${2:item})'), detail: 'Check if array contains value' },

  // Objects & JSON
  { label: 'JSON.stringify', apply: snippet('JSON.stringify(${1:object}, null, 2)'), detail: 'Convert object to JSON string' },
  { label: 'JSON.parse', apply: snippet('JSON.parse(${1:jsonString})'), detail: 'Parse JSON string to object' },
  { label: 'Object.keys', apply: snippet('Object.keys(${1:object})'), detail: 'Get object keys array' },
  { label: 'Object.values', apply: snippet('Object.values(${1:object})'), detail: 'Get object values array' },
  { label: 'Object.entries', apply: snippet('Object.entries(${1:object})'), detail: 'Get object [key, value] pairs' },

  // Functions & Control Flow
  { label: 'function', apply: snippet('function ${1:name}(${2:params}) {\n  ${0}\n}'), detail: 'Function declaration' },
  { label: 'arrow function', apply: snippet('const ${1:name} = (${2:params}) => {\n  ${0}\n};'), detail: 'Arrow function expression' },
  { label: 'const', apply: snippet('const ${1:name} = ${0};'), detail: 'Declare constant' },
  { label: 'let', apply: snippet('let ${1:name} = ${0};'), detail: 'Declare mutable variable' },
  { label: 'if statement', apply: snippet('if (${1:condition}) {\n  ${0}\n}'), detail: 'If block' },
  { label: 'if/else statement', apply: snippet('if (${1:condition}) {\n  ${2}\n} else {\n  ${0}\n}'), detail: 'If-else block' },
  { label: 'for loop', apply: snippet('for (let ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n  ${0}\n}'), detail: 'For indexed loop' },
  { label: 'try/catch', apply: snippet('try {\n  ${0}\n} catch (err) {\n  console.error(err);\n}'), detail: 'Exception handling' }
];

export function jsCompletions(context: CompletionContext): CompletionResult | null {
  const line = context.state.doc.lineAt(context.pos);
  const textBefore = line.text.slice(0, context.pos - line.from);

  // Check quotes - inside quotes: NEVER suggest JS statement snippets or HTML tags!
  const quoteCtx = checkQuoteContext(textBefore);
  if (quoteCtx.insideQuote) return null;

  // Check backticks
  const backticks = (textBefore.match(/(?<!\\)`/g) || []).length;
  if (backticks % 2 !== 0) return null;

  // Check line comments
  if (/\/\/.*$/.test(textBefore)) return null;

  try {
    const node = syntaxTree(context.state).resolveInner(context.pos, -1);
    if (node.name === 'String' || node.name === 'TemplateString' || node.name === 'LineComment' || node.name === 'BlockComment') {
      return null;
    }
  } catch (e) {}

  const word = context.matchBefore(/[a-zA-Z0-9_.]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  return {
    from: word.from,
    options: JS_SNIPPETS.map(item => ({
      label: item.label,
      apply: item.apply,
      type: 'function',
      detail: item.detail
    }))
  };
}
