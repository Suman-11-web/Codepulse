import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { snippet } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { CODE_REFERENCE } from '../data/codeReference';

/* ---------------------------------------------------------
   Helper: CamelCase to kebab-case
   --------------------------------------------------------- */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/* ---------------------------------------------------------
   Void HTML Tags (Tags without closing tags)
   --------------------------------------------------------- */
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/* ---------------------------------------------------------
   Compiled HTML Tag Items from CODE_REFERENCE.htmlTags
   --------------------------------------------------------- */
export interface HtmlTagSnippetInfo {
  tag: string;
  category: string;
  rawHtml: string;
  snippetStr: string;
  detail: string;
  boost: number;
}

function buildHtmlTagSnippets(): HtmlTagSnippetInfo[] {
  const result: HtmlTagSnippetInfo[] = [];
  const tagCategories = CODE_REFERENCE.htmlTags as Record<string, Record<string, string>>;

  for (const [category, tags] of Object.entries(tagCategories)) {
    for (const [tag, rawHtml] of Object.entries(tags)) {
      let snippetStr = '';
      let detail = `${category.charAt(0).toUpperCase() + category.slice(1)} element (<${tag}>)`;
      let boost = 3;

      // Tailored interactive snippets for tags from reference
      if (tag === 'br' || tag === 'hr' || tag === 'wbr') {
        snippetStr = rawHtml;
        boost = 2;
      } else if (tag === 'meta') {
        snippetStr = '<meta charset="${1:UTF-8}">';
        detail = 'Meta character encoding tag';
      } else if (tag === 'link') {
        snippetStr = '<link rel="${1:stylesheet}" href="${2:style.css}">';
        detail = 'Link external stylesheet';
        boost = 10;
      } else if (tag === 'input') {
        snippetStr = '<input type="${1:text}" id="${2:name}" name="${3:name}" placeholder="${4}" />';
        detail = 'HTML input element';
        boost = 10;
      } else if (tag === 'button') {
        snippetStr = '<button type="${1:button}">${0:Click Me}</button>';
        detail = 'Interactive button element';
        boost = 10;
      } else if (tag === 'a') {
        snippetStr = '<a href="${1:https://example.com}">${0:Link}</a>';
        detail = 'Anchor hyperlink';
        boost = 10;
      } else if (tag === 'img') {
        snippetStr = '<img src="${1:image.jpg}" alt="${2:Description}" />';
        detail = 'Image with required src & alt';
        boost = 9;
      } else if (tag === 'dialog') {
        snippetStr = '<dialog ${1:open}>\n  ${0:Dialog content}\n</dialog>';
        detail = 'Modal / dialog element';
        boost = 6;
      } else if (tag === 'details') {
        snippetStr = '<details>\n  <summary>${1:More information}</summary>\n  <p>${0:Content}</p>\n</details>';
        detail = 'Expandable details disclosure';
        boost = 6;
      } else if (tag === 'summary') {
        snippetStr = '<summary>${0:Click to expand}</summary>';
        detail = 'Disclosure summary caption';
        boost = 5;
      } else if (tag === 'picture') {
        snippetStr = '<picture>\n  <source srcset="${1:image.webp}" type="image/webp">\n  <img src="${2:image.jpg}" alt="${3:Image}">\n</picture>';
        detail = 'Responsive picture container';
        boost = 6;
      } else if (tag === 'video') {
        snippetStr = '<video controls width="${1:640}">\n  <source src="${2:video.mp4}" type="video/mp4">\n</video>';
        detail = 'HTML5 video player';
        boost = 7;
      } else if (tag === 'audio') {
        snippetStr = '<audio controls>\n  <source src="${1:audio.mp3}" type="audio/mpeg">\n</audio>';
        detail = 'HTML5 audio player';
        boost = 7;
      } else if (tag === 'form') {
        snippetStr = '<form action="${1:/submit}" method="${2:post}">\n  ${0}\n</form>';
        detail = 'Form container with action/method';
        boost = 8;
      } else if (tag === 'select') {
        snippetStr = '<select name="${1:select}">\n  <option value="${2:1}">${3:Option 1}</option>\n  <option value="${4:2}">${5:Option 2}</option>\n</select>';
        detail = 'Select dropdown list';
        boost = 8;
      } else if (tag === 'option') {
        snippetStr = '<option value="${1:1}">${0:Option}</option>';
        detail = 'Select dropdown option';
        boost = 5;
      } else if (tag === 'optgroup') {
        snippetStr = '<optgroup label="${1:Group}">\n  <option>${0:Item}</option>\n</optgroup>';
        detail = 'Option group container';
        boost = 4;
      } else if (tag === 'datalist') {
        snippetStr = '<datalist id="${1:suggestions}">\n  <option value="${2:Option}">\n</datalist>';
        detail = 'Predefined option list';
        boost = 5;
      } else if (tag === 'table') {
        snippetStr = '<table>\n  <thead>\n    <tr>\n      <th>${1:Heading}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>${2:Data}</td>\n    </tr>\n  </tbody>\n</table>';
        detail = 'Structured HTML table';
        boost = 7;
      } else if (tag === 'hgroup') {
        snippetStr = '<hgroup>\n  <h1>${1:Title}</h1>\n  <p>${2:Subtitle}</p>\n</hgroup>';
        detail = 'Heading group element';
        boost = 5;
      } else if (tag === 'search') {
        snippetStr = '<search>\n  ${0}\n</search>';
        detail = 'Semantic search container';
        boost = 6;
      } else if (tag === 'ruby') {
        snippetStr = '<ruby>${1:漢}<rt>${2:Kan}</rt></ruby>';
        detail = 'East Asian ruby phonetic annotation';
        boost = 4;
      } else if (tag === 'abbr') {
        snippetStr = '<abbr title="${1:HyperText Markup Language}">${2:HTML}</abbr>';
        detail = 'Abbreviation with explanation';
        boost = 5;
      } else if (tag === 'time') {
        snippetStr = '<time datetime="${1:2026-10-03}">${2:October 3}</time>';
        detail = 'Machine-readable date/time';
        boost = 5;
      } else if (tag === 'data') {
        snippetStr = '<data value="${1:123}">${2:Product}</data>';
        detail = 'Machine-readable data tag';
        boost = 4;
      } else if (tag === 'progress') {
        snippetStr = '<progress value="${1:50}" max="${2:100}"></progress>';
        detail = 'Progress bar indicator';
        boost = 5;
      } else if (tag === 'meter') {
        snippetStr = '<meter value="${1:0.7}">${2:70%}</meter>';
        detail = 'Scalar gauge measurement';
        boost = 5;
      } else if (tag === 'template') {
        snippetStr = '<template>\n  <div>${0:Template content}</div>\n</template>';
        detail = 'Client-side template container';
        boost = 5;
      } else if (tag === 'slot') {
        snippetStr = '<slot name="${1:content}"></slot>';
        detail = 'Web Component placeholder slot';
        boost = 5;
      } else if (tag === 'textarea') {
        snippetStr = '<textarea rows="${1:4}" cols="${2:30}" placeholder="${3}">${0}</textarea>';
        detail = 'Multi-line text input';
        boost = 8;
      } else if (tag === 'ul') {
        snippetStr = '<ul>\n  <li>${1:Item}</li>\n</ul>';
        boost = 7;
      } else if (tag === 'ol') {
        snippetStr = '<ol>\n  <li>${1:Item}</li>\n</ol>';
        boost = 7;
      } else if (tag === 'dl') {
        snippetStr = '<dl>\n  <dt>${1:Term}</dt>\n  <dd>${2:Description}</dd>\n</dl>';
        boost = 5;
      } else if (tag === 'div') {
        snippetStr = '<div>\n  ${0}\n</div>';
        boost = 10;
      } else if (tag === 'section' || tag === 'article' || tag === 'aside' || tag === 'header' || tag === 'footer' || tag === 'nav' || tag === 'main' || tag === 'menu') {
        snippetStr = `<${tag}>\n  \${0}\n</${tag}>`;
        boost = 7;
      } else {
        // Parse rawHtml for standard tags
        const match = rawHtml.match(/^<([a-zA-Z0-9_-]+)([^>]*)>(.*)<\/\1>$/s);
        if (match) {
          const [, tagName, attrs, inner] = match;
          const trimmed = inner.trim();
          if (trimmed) {
            snippetStr = `<${tagName}${attrs}>\${0:${trimmed}}</${tagName}>`;
          } else {
            snippetStr = `<${tagName}${attrs}>\${0}</${tagName}>`;
          }
        } else {
          snippetStr = `<${tag}>\${0}</${tag}>`;
        }
      }

      result.push({
        tag,
        category,
        rawHtml,
        snippetStr,
        detail,
        boost
      });
    }
  }

  return result;
}

export const HTML_TAG_SNIPPETS = buildHtmlTagSnippets();

/* ---------------------------------------------------------
   Compiled HTML Attributes from CODE_REFERENCE.htmlAttributes
   --------------------------------------------------------- */
export interface HtmlAttributeInfo {
  attr: string;
  sampleVal: string;
  snippetStr: string;
  detail: string;
  isBoolean: boolean;
}

function buildHtmlAttributes(): HtmlAttributeInfo[] {
  const result: HtmlAttributeInfo[] = [];
  const entries = Object.entries(CODE_REFERENCE.htmlAttributes);

  const booleanAttrs = new Set([
    'disabled', 'readonly', 'required', 'checked', 'selected', 'multiple',
    'autofocus', 'hidden', 'download', 'controls', 'autoplay', 'muted', 'loop',
    'async', 'defer'
  ]);

  for (const [key, rawStr] of entries) {
    const isBool = booleanAttrs.has(key);
    let sampleVal = '';
    let snippetStr = '';

    const eqMatch = rawStr.match(/^([a-zA-Z0-9_\-]+)="([^"]*)"$/);
    if (eqMatch) {
      sampleVal = eqMatch[2];
      snippetStr = `${key}="\${1:${sampleVal}}"`;
    } else if (isBool) {
      snippetStr = key;
    } else {
      snippetStr = `${key}="\${0}"`;
    }

    result.push({
      attr: key,
      sampleVal,
      snippetStr,
      detail: `HTML attribute (${rawStr})`,
      isBoolean: isBool
    });
  }

  return result;
}

export const COMPILED_HTML_ATTRIBUTES = buildHtmlAttributes();

/* ---------------------------------------------------------
   Fast Lookup for Link and Script Shortcuts
   --------------------------------------------------------- */
export const LINK_AND_SCRIPT_SNIPPETS = [
  // Links
  { prefix: 'link:css', label: 'link:css', apply: snippet('<link rel="stylesheet" href="${1:style.css}">'), detail: 'Link external CSS stylesheet', boost: 12 },
  { prefix: 'link:favicon', label: 'link:favicon', apply: snippet('<link rel="shortcut icon" href="${1:favicon.ico}" type="image/x-icon">'), detail: 'Link favicon icon', boost: 9 },
  { prefix: 'link:font', label: 'link:font (Google Fonts)', apply: snippet('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="${1:https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap}" rel="stylesheet">'), detail: 'Google Fonts with preconnect links', boost: 10 },
  { prefix: 'link:fontawesome', label: 'link:fontawesome', apply: snippet('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">'), detail: 'Font Awesome 6 icons CDN', boost: 9 },
  { prefix: 'link:bootstrap', label: 'link:bootstrap', apply: snippet('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">'), detail: 'Bootstrap 5.3 CSS CDN', boost: 9 },
  { prefix: 'link:animate', label: 'link:animate', apply: snippet('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">'), detail: 'Animate.css CDN', boost: 8 },
  { prefix: 'link:canonical', label: 'link:canonical', apply: snippet('<link rel="canonical" href="${1:https://example.com/}">'), detail: 'Canonical URL link', boost: 7 },
  { prefix: 'link:manifest', label: 'link:manifest', apply: snippet('<link rel="manifest" href="${1:manifest.json}">'), detail: 'Web App Manifest link', boost: 7 },
  { prefix: 'link:preload', label: 'link:preload', apply: snippet('<link rel="preload" href="${1:style.css}" as="${2:style}">'), detail: 'Resource preload link', boost: 7 },

  // Scripts
  { prefix: 'script:src', label: 'script:src', apply: snippet('<script src="${1:app.js}" defer></script>'), detail: 'External JavaScript script tag', boost: 12 },
  { prefix: 'script:js', label: 'script:js', apply: snippet('<script src="${1:app.js}"></script>'), detail: 'External JavaScript script tag', boost: 11 },
  { prefix: 'script:module', label: 'script:module', apply: snippet('<script type="module" src="${1:main.js}"></script>'), detail: 'ES Module script tag', boost: 9 },
  { prefix: 'script:defer', label: 'script:defer', apply: snippet('<script src="${1:app.js}" defer></script>'), detail: 'Deferred script tag', boost: 9 },
  { prefix: 'script:async', label: 'script:async', apply: snippet('<script src="${1:app.js}" async></script>'), detail: 'Asynchronous script tag', boost: 9 },
  { prefix: 'script:tailwind', label: 'script:tailwind', apply: snippet('<script src="https://cdn.tailwindcss.com"></script>'), detail: 'Tailwind CSS Play CDN script', boost: 9 },

  // Anchors
  { prefix: 'a:blank', label: 'a:blank', apply: snippet('<a href="${1:https://example.com}" target="_blank" rel="noopener noreferrer">${0}</a>'), detail: 'Link opening in new tab (_blank)', boost: 10 },
  { prefix: 'a:mail', label: 'a:mail', apply: snippet('<a href="mailto:${1:name@example.com}">${0}</a>'), detail: 'Email mailto link', boost: 8 },
  { prefix: 'a:tel', label: 'a:tel', apply: snippet('<a href="tel:${1:+1234567890}">${0}</a>'), detail: 'Telephone phone link', boost: 8 },
  { prefix: 'a:download', label: 'a:download', apply: snippet('<a href="${1:file.pdf}" download="${2:filename}">${0}</a>'), detail: 'Download file link', boost: 7 },

  // Buttons
  { prefix: 'btn:primary', label: 'btn:primary', apply: snippet('<button type="button" class="btn btn-primary">${0}</button>'), detail: 'Primary action button', boost: 10 },
  { prefix: 'btn:submit', label: 'btn:submit', apply: snippet('<button type="submit">${1:Submit}</button>'), detail: 'Form submit button', boost: 10 },
  { prefix: 'btn:reset', label: 'btn:reset', apply: snippet('<button type="reset">${1:Reset}</button>'), detail: 'Form reset button', boost: 8 },

  // Inputs
  { prefix: 'input:text', label: 'input:text', apply: snippet('<input type="text" id="${1:name}" name="${2:name}" placeholder="${3:Type here...}" />'), detail: 'Text input with placeholder', boost: 10 },
  { prefix: 'input:password', label: 'input:password', apply: snippet('<input type="password" id="${1:password}" name="${2:password}" placeholder="${3:Password}" />'), detail: 'Password input', boost: 9 },
  { prefix: 'input:email', label: 'input:email', apply: snippet('<input type="email" id="${1:email}" name="${2:email}" placeholder="${3:name@example.com}" />'), detail: 'Email input', boost: 9 },
  { prefix: 'input:number', label: 'input:number', apply: snippet('<input type="number" id="${1:qty}" name="${2:qty}" min="${3:0}" max="${4:100}" />'), detail: 'Numeric input', boost: 8 },
  { prefix: 'input:file', label: 'input:file', apply: snippet('<input type="file" id="${1:file}" name="${2:file}" accept="${3:image/*}" />'), detail: 'File upload input', boost: 9 },
  { prefix: 'input:checkbox', label: 'input:checkbox', apply: snippet('<input type="checkbox" id="${1:check}" name="${2:check}" checked />'), detail: 'Checkbox input', boost: 8 },
  { prefix: 'input:radio', label: 'input:radio', apply: snippet('<input type="radio" id="${1:opt}" name="${2:choice}" value="${3:val}" />'), detail: 'Radio button input', boost: 8 },
  { prefix: 'input:date', label: 'input:date', apply: snippet('<input type="date" id="${1:date}" name="${2:date}" />'), detail: 'Date picker input', boost: 8 },
  { prefix: 'input:color', label: 'input:color', apply: snippet('<input type="color" id="${1:color}" name="${2:color}" value="${3:#3b82f6}" />'), detail: 'Color picker input', boost: 8 },
  { prefix: 'input:range', label: 'input:range', apply: snippet('<input type="range" id="${1:range}" name="${2:range}" min="${3:0}" max="${4:100}" />'), detail: 'Range slider input', boost: 8 }
];

/* ---------------------------------------------------------
   Compiled CSS Properties from CODE_REFERENCE.cssProperties
   --------------------------------------------------------- */
export interface CssPropertyInfo {
  prop: string;
  sampleVal: string;
  snippetStr: string;
  detail: string;
  boost: number;
}

function buildCssProperties(): CssPropertyInfo[] {
  const result: CssPropertyInfo[] = [];
  const entries = Object.entries(CODE_REFERENCE.cssProperties);

  for (const [key, rawRule] of entries) {
    const propName = toKebabCase(key);
    let sampleVal = '';
    const colonIdx = rawRule.indexOf(':');

    if (colonIdx !== -1) {
      sampleVal = rawRule.slice(colonIdx + 1).trim().replace(/;$/, '');
    }

    const snippetStr = sampleVal
      ? `${propName}: \${1:${sampleVal}};`
      : `${propName}: \${0};`;

    let boost = 3;
    if (['display', 'color', 'background', 'background-color', 'font-size', 'font-family', 'margin', 'padding', 'border', 'border-radius', 'width', 'height', 'flex', 'grid', 'position', 'align-items', 'justify-content', 'gap', 'cursor', 'opacity', 'transform', 'transition', 'box-shadow', 'overflow'].includes(propName)) {
      boost = 10;
    } else if (['color-scheme', 'container', 'container-type', 'field-sizing', 'interpolate-size', 'view-transition-name', 'anchor-name', 'position-anchor', 'position-area', 'overlay', 'transition-behavior', 'animation-composition'].includes(propName)) {
      boost = 8;
    }

    result.push({
      prop: propName,
      sampleVal,
      snippetStr,
      detail: `CSS: ${rawRule}`,
      boost
    });
  }

  return result;
}

export const COMPILED_CSS_PROPERTIES = buildCssProperties();

/* ---------------------------------------------------------
   Compiled CSS Selectors from CODE_REFERENCE.cssSelectors
   --------------------------------------------------------- */
export interface CssSelectorInfo {
  selector: string;
  name: string;
  snippetStr: string;
  detail: string;
}

function buildCssSelectors(): CssSelectorInfo[] {
  const result: CssSelectorInfo[] = [];
  const entries = Object.entries(CODE_REFERENCE.cssSelectors);

  for (const [name, sel] of entries) {
    let snippetStr = '';
    if (sel.startsWith(':') || sel.startsWith('::')) {
      if (sel === '::before' || sel === '::after') {
        snippetStr = `${sel} {\n  content: "";\n  \${0}\n}`;
      } else if (sel.includes('(')) {
        snippetStr = `${sel} {\n  \${0}\n}`;
      } else {
        snippetStr = `${sel} {\n  \${0}\n}`;
      }
    } else {
      snippetStr = `${sel} {\n  \${0}\n}`;
    }

    result.push({
      selector: sel,
      name,
      snippetStr,
      detail: `CSS Selector (${sel})`
    });
  }

  return result;
}

export const COMPILED_CSS_SELECTORS = buildCssSelectors();

/* ---------------------------------------------------------
   Compiled CSS At-Rules from CODE_REFERENCE.cssAtRules
   --------------------------------------------------------- */
export interface CssAtRuleInfo {
  rule: string;
  name: string;
  snippetStr: string;
  detail: string;
}

function buildCssAtRules(): CssAtRuleInfo[] {
  const result: CssAtRuleInfo[] = [];
  const entries = Object.entries(CODE_REFERENCE.cssAtRules);

  for (const [name, rawRule] of entries) {
    const atName = rawRule.split(/\s/)[0]; // e.g. '@media', '@keyframes'
    let snippetStr = rawRule;

    if (atName === '@media') {
      snippetStr = '@media (max-width: ${1:768px}) {\n  ${0}\n}';
    } else if (atName === '@keyframes') {
      snippetStr = '@keyframes ${1:fadeIn} {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}';
    } else if (atName === '@container') {
      snippetStr = '@container (min-width: ${1:400px}) {\n  ${0}\n}';
    } else if (atName === '@supports') {
      snippetStr = '@supports (${1:display: grid}) {\n  ${0}\n}';
    } else if (atName === '@property') {
      snippetStr = '@property --${1:my-color} {\n  syntax: "<color>";\n  inherits: true;\n  initial-value: ${2:red};\n}';
    } else if (atName === '@starting-style') {
      snippetStr = '@starting-style {\n  opacity: 0;\n  ${0}\n}';
    } else if (atName === '@font-face') {
      snippetStr = '@font-face {\n  font-family: "${1:MyFont}";\n  src: url("${2:font.woff2}");\n}';
    }

    result.push({
      rule: atName,
      name,
      snippetStr,
      detail: rawRule
    });
  }

  return result;
}

export const COMPILED_CSS_AT_RULES = buildCssAtRules();

/* ---------------------------------------------------------
   CSS Values Map from CODE_REFERENCE.cssValues
   --------------------------------------------------------- */
const CSS_PROPERTY_VALUE_MAP: Record<string, string[]> = {
  'display': CODE_REFERENCE.cssValues.display,
  'position': CODE_REFERENCE.cssValues.position,
  'flex-direction': CODE_REFERENCE.cssValues.flexDirection,
  'flex-flow': ['row wrap', 'row nowrap', 'column wrap', 'column nowrap'],
  'flex-wrap': CODE_REFERENCE.cssValues.flexWrap,
  'justify-content': CODE_REFERENCE.cssValues.justifyContent,
  'align-items': CODE_REFERENCE.cssValues.alignItems,
  'align-self': CODE_REFERENCE.cssValues.alignItems,
  'align-content': CODE_REFERENCE.cssValues.justifyContent,
  'font-weight': CODE_REFERENCE.cssValues.fontWeight,
  'text-align': CODE_REFERENCE.cssValues.textAlign,
  'text-align-last': CODE_REFERENCE.cssValues.textAlign,
  'overflow': CODE_REFERENCE.cssValues.overflow,
  'overflow-x': CODE_REFERENCE.cssValues.overflow,
  'overflow-y': CODE_REFERENCE.cssValues.overflow,
  'cursor': CODE_REFERENCE.cssValues.cursor,
  'border-style': CODE_REFERENCE.cssValues.borderStyle,
  'outline-style': CODE_REFERENCE.cssValues.borderStyle,
  'transition-timing-function': CODE_REFERENCE.cssValues.transitionTiming,
  'animation-timing-function': CODE_REFERENCE.cssValues.transitionTiming,
  'object-fit': CODE_REFERENCE.cssValues.objectFit,
  'background-size': CODE_REFERENCE.cssValues.backgroundSize,
  'text-decoration': CODE_REFERENCE.cssValues.textDecoration,
  'text-decoration-line': CODE_REFERENCE.cssValues.textDecoration,
  'animation-direction': CODE_REFERENCE.cssValues.animationDirection,
  'box-sizing': CODE_REFERENCE.cssValues.boxSizing,
  'visibility': CODE_REFERENCE.cssValues.visibility,
  'white-space': CODE_REFERENCE.cssValues.whiteSpace,
  'color-scheme': ['light', 'dark', 'light dark', 'only light', 'only dark'],
  'pointer-events': ['auto', 'none', 'inherit', 'initial'],
  'user-select': ['none', 'auto', 'text', 'all', 'contain'],
  'scroll-behavior': ['smooth', 'auto'],
  'field-sizing': ['content', 'fixed'],
  'interpolate-size': ['allow-keywords', 'numeric-only'],
  'overlay': ['auto', 'none'],
  'transition-behavior': ['allow-discrete', 'normal'],
  'animation-composition': ['add', 'replace', 'accumulate']
};

/**
 * Determine if position is inside an unescaped quoted string (double or single quote).
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
    const beforeQuote = textBefore.slice(0, lastQuotePos);
    const attrMatch = beforeQuote.match(/([a-zA-Z0-9_\-]+)\s*=\s*$/);
    const attrName = attrMatch ? attrMatch[1].toLowerCase() : undefined;
    return { insideQuote: true, quoteChar, attrName };
  }

  return { insideQuote: false, quoteChar: '' };
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
  let inScriptTag = false;
  let inStyleTag = false;

  try {
    const tree = syntaxTree(state);
    let curr = tree.resolveInner(pos, -1);

    let temp: typeof curr | null = curr;
    while (temp) {
      if (temp.name === 'Script' || temp.name === 'ScriptText') inScriptTag = true;
      if (temp.name === 'StyleSheet' || temp.name === 'StyleText') inStyleTag = true;
      temp = temp.parent;
    }
  } catch (e) {}

  if (inScriptTag) return jsCompletions(context);
  if (inStyleTag) return cssCompletions(context);

  // 2. Check if cursor is inside quotes (attribute values)
  const quoteCtx = checkQuoteContext(textBefore);

  if (quoteCtx.insideQuote) {
    let attr = quoteCtx.attrName;
    if (!attr) {
      const match = textBefore.match(/([a-zA-Z0-9_\-]+)\s*=\s*["'][^"']*$/);
      if (match) attr = match[1].toLowerCase();
    }

    const word = context.matchBefore(/[a-zA-Z0-9_\-]*/);
    const fromPos = word ? word.from : pos;

    if (attr === 'type') {
      const types = ['text', 'password', 'email', 'number', 'checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'date', 'time', 'color', 'range', 'search', 'url', 'tel', 'hidden'];
      return {
        from: fromPos,
        options: types.map(t => ({ label: t, type: 'keyword', detail: 'Input type' }))
      };
    }

    if (attr === 'target') {
      return {
        from: fromPos,
        options: ['_blank', '_self', '_parent', '_top'].map(t => ({ label: t, type: 'keyword', detail: 'Link target' }))
      };
    }

    if (attr === 'rel') {
      return {
        from: fromPos,
        options: ['stylesheet', 'noopener noreferrer', 'noopener', 'noreferrer', 'icon', 'preload', 'prefetch', 'author', 'canonical', 'manifest'].map(r => ({ label: r, type: 'keyword', detail: 'Link relation' }))
      };
    }

    if (attr === 'method') {
      return {
        from: fromPos,
        options: ['GET', 'POST'].map(m => ({ label: m, type: 'keyword', detail: 'Form method' }))
      };
    }

    if (attr === 'loading') {
      return {
        from: fromPos,
        options: ['lazy', 'eager'].map(l => ({ label: l, type: 'keyword', detail: 'Image loading' }))
      };
    }

    if (attr === 'decoding') {
      return {
        from: fromPos,
        options: ['async', 'sync', 'auto'].map(d => ({ label: d, type: 'keyword', detail: 'Image decoding' }))
      };
    }

    return null;
  }

  // 3. Inside a tag definition (between '<tagname' and '>') -> Suggest Attributes
  const lastOpen = textBefore.lastIndexOf('<');
  const lastClose = textBefore.lastIndexOf('>');
  const insideTag = lastOpen > lastClose;

  if (insideTag) {
    const tagContent = textBefore.slice(lastOpen + 1);

    // If typing tag name immediately after '<' (e.g. '<s' or '<p')
    if (!/\s/.test(tagContent)) {
      const word = context.matchBefore(/<[a-zA-Z0-9_\-:]*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;

      // Special link/script shortcuts
      const specialMatches = LINK_AND_SCRIPT_SNIPPETS.map(snip => ({
        label: `<${snip.prefix}>`,
        apply: snip.apply,
        type: 'keyword',
        detail: snip.detail,
        boost: snip.boost + 2
      }));

      // Full HTML elements catalog from CODE_REFERENCE
      const allTags = HTML_TAG_SNIPPETS.map(item => ({
        label: `<${item.tag}>`,
        apply: snippet(item.snippetStr),
        type: 'type',
        detail: item.detail,
        boost: item.boost
      }));

      return {
        from: word.from,
        options: [...specialMatches, ...allTags]
      };
    }

    // Space exists after tag name -> User is typing attributes!
    const word = context.matchBefore(/[a-zA-Z0-9_\-]*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    const tagMatch = tagContent.match(/^([a-zA-Z0-9_\-]+)/);
    const currentTagName = tagMatch ? tagMatch[1].toLowerCase() : '';

    return {
      from: word.from,
      options: COMPILED_HTML_ATTRIBUTES.map(item => {
        let boost = 2;
        if (currentTagName === 'a' && (item.attr === 'href' || item.attr === 'target' || item.attr === 'rel')) boost = 10;
        if (currentTagName === 'img' && (item.attr === 'src' || item.attr === 'alt' || item.attr === 'loading')) boost = 10;
        if (currentTagName === 'input' && (item.attr === 'type' || item.attr === 'placeholder' || item.attr === 'name' || item.attr === 'value' || item.attr === 'required')) boost = 10;
        if (currentTagName === 'button' && (item.attr === 'type' || item.attr === 'disabled')) boost = 10;
        if (currentTagName === 'link' && (item.attr === 'rel' || item.attr === 'href')) boost = 10;
        if (currentTagName === 'script' && (item.attr === 'src' || item.attr === 'defer' || item.attr === 'async')) boost = 10;
        if (currentTagName === 'form' && (item.attr === 'action' || item.attr === 'method')) boost = 10;
        if (currentTagName === 'label' && item.attr === 'for') boost = 10;
        if (item.attr === 'class' || item.attr === 'id') boost = 9;

        return {
          label: item.attr,
          apply: snippet(item.snippetStr),
          type: 'property',
          detail: item.detail,
          boost
        };
      })
    };
  }

  // 4. In document body / text area:
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
        boost: 25
      }]
    };
  }

  const startsWithBracket = text.startsWith('<');

  const specialOptions = LINK_AND_SCRIPT_SNIPPETS.map(snip => ({
    label: startsWithBracket ? `<${snip.prefix}>` : snip.prefix,
    apply: snip.apply,
    type: 'keyword',
    detail: snip.detail,
    boost: snip.boost
  }));

  const allTagOptions = HTML_TAG_SNIPPETS.map(item => ({
    label: startsWithBracket ? `<${item.tag}>` : item.tag,
    apply: snippet(item.snippetStr),
    type: 'type',
    detail: item.detail,
    boost: item.boost
  }));

  return {
    from: word.from,
    options: [...specialOptions, ...allTagOptions]
  };
}

/* ---------------------------------------------------------
   CSS Autocomplete Provider
   --------------------------------------------------------- */
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

  // 1. Context-aware value completion: Check if cursor is after a colon (e.g. "display: ", "position: rel")
  const colonMatch = textBefore.match(/([a-zA-Z0-9_\-]+)\s*:\s*([^;{}]*)$/);
  if (colonMatch) {
    const propName = colonMatch[1].toLowerCase();
    const valPrefix = colonMatch[2];
    const word = context.matchBefore(/[a-zA-Z0-9_\-#%()]*/);
    const fromPos = word ? word.from : context.pos;

    // Check if property has pre-defined value suggestions
    const validValues = CSS_PROPERTY_VALUE_MAP[propName];
    const valueOptions: { label: string; apply: string; type: string; detail: string; boost: number }[] = [];

    if (validValues && validValues.length > 0) {
      for (const val of validValues) {
        valueOptions.push({
          label: val,
          apply: `${val};`,
          type: 'value',
          detail: `Value for ${propName}`,
          boost: 10
        });
      }
    }

    // If property accepts colors, suggest colors
    if (propName.includes('color') || propName === 'background' || propName.includes('fill') || propName.includes('stroke')) {
      for (const col of CODE_REFERENCE.cssValues.colors) {
        valueOptions.push({
          label: col,
          apply: `${col};`,
          type: 'color',
          detail: `CSS color`,
          boost: 8
        });
      }
    }

    // Units suggestions
    if (['width', 'height', 'top', 'bottom', 'left', 'right', 'margin', 'padding', 'gap', 'font-size', 'border-width', 'border-radius', 'inset'].some(p => propName.includes(p))) {
      for (const unit of ['px', 'rem', 'em', '%', 'vh', 'vw']) {
        valueOptions.push({
          label: `0${unit}`,
          apply: `0${unit};`,
          type: 'unit',
          detail: `CSS unit (${unit})`,
          boost: 5
        });
      }
    }

    if (valueOptions.length > 0) {
      return {
        from: fromPos,
        options: valueOptions
      };
    }
  }

  // 2. Check if typing at-rules (starts with '@')
  if (/@/.test(textBefore.slice(Math.max(0, textBefore.length - 20)))) {
    const atWord = context.matchBefore(/@[a-zA-Z0-9_\-]*/);
    if (atWord) {
      return {
        from: atWord.from,
        options: COMPILED_CSS_AT_RULES.map(item => ({
          label: item.rule,
          apply: snippet(item.snippetStr),
          type: 'keyword',
          detail: item.detail,
          boost: 12
        }))
      };
    }
  }

  // 3. Check if typing pseudo-selectors (starts with ':' or '::')
  if (/:/.test(textBefore.slice(Math.max(0, textBefore.length - 25)))) {
    const selWord = context.matchBefore(/:[:a-zA-Z0-9_\-]*/);
    if (selWord && selWord.text.startsWith(':')) {
      return {
        from: selWord.from,
        options: COMPILED_CSS_SELECTORS.map(item => ({
          label: item.selector,
          apply: snippet(item.snippetStr),
          type: 'keyword',
          detail: item.detail,
          boost: 10
        }))
      };
    }
  }

  // 4. Standard CSS Properties matching
  const word = context.matchBefore(/[:@a-zA-Z0-9_\-]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const propertyOptions = COMPILED_CSS_PROPERTIES.map(item => ({
    label: item.prop,
    apply: snippet(item.snippetStr),
    type: 'property',
    detail: item.detail,
    boost: item.boost
  }));

  const atRuleOptions = COMPILED_CSS_AT_RULES.map(item => ({
    label: item.rule,
    apply: snippet(item.snippetStr),
    type: 'keyword',
    detail: item.detail,
    boost: 5
  }));

  const selectorOptions = COMPILED_CSS_SELECTORS.map(item => ({
    label: item.selector,
    apply: snippet(item.snippetStr),
    type: 'keyword',
    detail: item.detail,
    boost: 4
  }));

  return {
    from: word.from,
    options: [...propertyOptions, ...atRuleOptions, ...selectorOptions]
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
