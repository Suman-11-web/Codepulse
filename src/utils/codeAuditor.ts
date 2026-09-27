import { AuditIssue, AuditReport } from '../types';

/**
 * Real-time Code Health, Linter & Accessibility (a11y) Auditor
 * Analyzes HTML, CSS, and JS code for accessibility, semantics, and best practices.
 */
export function auditCode(html: string, css: string, _js: string): AuditReport {
  const issues: AuditIssue[] = [];

  // Basic HTML Stats
  const tagMatches = html.match(/<([a-z0-9-]+)\b/gi) || [];
  const totalTags = tagMatches.length;
  const imageMatches = html.match(/<img\b[^>]*>/gi) || [];
  const linkMatches = html.match(/<a\b[^>]*>/gi) || [];
  const buttonMatches = html.match(/<button\b[^>]*>/gi) || [];
  const cssRuleMatches = css.match(/[^{}]+\{[^{}]*\}/g) || [];

  // ==========================================
  // 1. ACCESSIBILITY (a11y) AUDITS
  // ==========================================

  // Check 1: <img> without alt attribute
  imageMatches.forEach((imgTag) => {
    if (!/\balt\s*=/i.test(imgTag) && !/\brole\s*=\s*["']presentation["']/i.test(imgTag)) {
      issues.push({
        id: 'a11y-img-alt-' + Math.random().toString(36).substring(2, 6),
        type: 'a11y',
        severity: 'error',
        title: 'Image missing alternative text (alt)',
        description: 'Screen readers require an alt attribute on all <img> elements to explain visuals to visually impaired users.',
        codeSnippet: imgTag.length > 70 ? imgTag.substring(0, 67) + '...' : imgTag,
        canAutoFix: true
      });
    }
  });

  // Check 2: <a> without href or empty href
  linkMatches.forEach((aTag) => {
    if (!/\bhref\s*=/i.test(aTag)) {
      issues.push({
        id: 'a11y-link-href-' + Math.random().toString(36).substring(2, 6),
        type: 'a11y',
        severity: 'warning',
        title: 'Anchor link missing href attribute',
        description: 'Links without an href attribute cannot receive keyboard focus or function as interactive hyperlinks.',
        codeSnippet: aTag.length > 70 ? aTag.substring(0, 67) + '...' : aTag,
        canAutoFix: true
      });
    } else if (/\bhref\s*=\s*["']\s*["']/i.test(aTag)) {
      issues.push({
        id: 'a11y-link-empty-' + Math.random().toString(36).substring(2, 6),
        type: 'a11y',
        severity: 'warning',
        title: 'Empty href attribute on anchor link',
        description: 'Links with href="" reload the entire page or cause unwanted navigation jumps.',
        codeSnippet: aTag.length > 70 ? aTag.substring(0, 67) + '...' : aTag,
        canAutoFix: true
      });
    }
  });

  // Check 3: Buttons with empty content or without accessible name
  const emptyButtonRegex = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
  let btnMatch: RegExpExecArray | null;
  while ((btnMatch = emptyButtonRegex.exec(html)) !== null) {
    const attrs = btnMatch[1] || '';
    const content = btnMatch[2].trim();
    const hasAria = /\baria-label\s*=/i.test(attrs) || /\btitle\s*=/i.test(attrs);
    if (!content && !hasAria) {
      issues.push({
        id: 'a11y-btn-empty-' + Math.random().toString(36).substring(2, 6),
        type: 'a11y',
        severity: 'error',
        title: 'Button has no readable text or aria-label',
        description: 'Screen reader users cannot determine the function of empty buttons or icon-only buttons without an aria-label.',
        codeSnippet: btnMatch[0].length > 70 ? btnMatch[0].substring(0, 67) + '...' : btnMatch[0],
        canAutoFix: true
      });
    }
  }

  // Check 4: Inputs without label or placeholder/aria
  const inputMatches = html.match(/<input\b[^>]*>/gi) || [];
  inputMatches.forEach((inp) => {
    // Hidden inputs don't need labels
    if (/\btype\s*=\s*["']hidden["']/i.test(inp)) return;
    const hasLabelAttrs = /\b(aria-label|aria-labelledby|placeholder|title)\s*=/i.test(inp);
    if (!hasLabelAttrs) {
      issues.push({
        id: 'a11y-input-label-' + Math.random().toString(36).substring(2, 6),
        type: 'a11y',
        severity: 'info',
        title: 'Input field without accessible label or placeholder',
        description: 'Add a <label>, placeholder, or aria-label attribute so users know what information to enter.',
        codeSnippet: inp.length > 70 ? inp.substring(0, 67) + '...' : inp,
        canAutoFix: true
      });
    }
  });

  // ==========================================
  // 2. HTML SEMANTICS & QUALITY
  // ==========================================

  // Check 5: Duplicate ID attributes
  const idRegex = /\bid\s*=\s*["']([^"']+)["']/gi;
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();
  let idMatch: RegExpExecArray | null;
  while ((idMatch = idRegex.exec(html)) !== null) {
    const val = idMatch[1];
    if (seenIds.has(val)) {
      duplicateIds.add(val);
    } else {
      seenIds.add(val);
    }
  }
  duplicateIds.forEach((dupId) => {
    issues.push({
      id: 'html-duplicate-id-' + dupId,
      type: 'html',
      severity: 'error',
      title: `Duplicate element ID "#${dupId}"`,
      description: `HTML IDs must be unique within a document. Multiple elements share id="${dupId}", which breaks CSS selectors, forms, and getElementById().`,
      codeSnippet: `id="${dupId}"`,
      canAutoFix: false
    });
  });

  // Check 6: Deprecated HTML tags
  const deprecatedTags = ['font', 'center', 'marquee', 'strike', 'big', 'frame', 'frameset'];
  deprecatedTags.forEach((tag) => {
    const r = new RegExp(`<${tag}\\b`, 'i');
    if (r.test(html)) {
      issues.push({
        id: 'html-deprecated-' + tag,
        type: 'html',
        severity: 'warning',
        title: `Deprecated HTML tag <${tag}>`,
        description: `<${tag}> is obsolete in modern HTML5 standards. Use modern CSS styling instead.`,
        codeSnippet: `<${tag}>`,
        canAutoFix: false
      });
    }
  });

  // Check 7: Inline styles excessive use
  const inlineStyleMatches = html.match(/\bstyle\s*=\s*["'][^"']*["']/gi) || [];
  if (inlineStyleMatches.length > 5) {
    issues.push({
      id: 'html-inline-styles',
      type: 'html',
      severity: 'info',
      title: `Heavy inline styling (${inlineStyleMatches.length} occurrences)`,
      description: 'Using inline style="..." tags makes code difficult to maintain and override. Move styles to the CSS panel.',
      canAutoFix: false
    });
  }

  // ==========================================
  // 3. CSS QUALITY & BEST PRACTICES
  // ==========================================

  // Check 8: Heavy use of !important
  const importantMatches = css.match(/!important/gi) || [];
  if (importantMatches.length >= 3) {
    issues.push({
      id: 'css-important-abuse',
      type: 'css',
      severity: 'warning',
      title: `Excessive !important flags (${importantMatches.length} found)`,
      description: '!important breaks CSS specificity cascading. Refactor selectors with proper classes instead.',
      canAutoFix: false
    });
  }

  // Check 9: Empty CSS rulesets
  const emptyCssRegex = /([^{}]+)\{\s*\}/g;
  let emptyCssMatch: RegExpExecArray | null;
  while ((emptyCssMatch = emptyCssRegex.exec(css)) !== null) {
    const sel = emptyCssMatch[1].trim();
    if (sel) {
      issues.push({
        id: 'css-empty-rule-' + Math.random().toString(36).substring(2, 6),
        type: 'css',
        severity: 'info',
        title: `Empty CSS rule for "${sel}"`,
        description: 'Selector has no declarations inside its block.',
        codeSnippet: emptyCssMatch[0],
        canAutoFix: true
      });
    }
  }

  // Check 10: display: none paired with :hover on the same element
  const cssRules = css.match(/([^{}]+)\{([^}]+)\}/g) || [];
  const displayNoneSelectors = new Set<string>();
  const hoverSelectors: { selector: string; snippet: string }[] = [];

  cssRules.forEach(rule => {
    const parts = rule.split('{');
    const selector = parts[0]?.trim();
    const body = parts[1] || '';
    if (selector && /display\s*:\s*none\b/i.test(body)) {
      displayNoneSelectors.add(selector.replace(/\s+/g, ' '));
    }
    if (selector && /:hover\b/i.test(selector)) {
      hoverSelectors.push({ selector: selector.replace(/\s+/g, ' '), snippet: rule });
    }
  });

  hoverSelectors.forEach(({ selector, snippet }) => {
    const baseSelector = selector.replace(/:hover\b/g, '').trim();
    if (displayNoneSelectors.has(baseSelector)) {
      issues.push({
        id: 'css-hover-display-none-' + Math.random().toString(36).substring(2, 6),
        type: 'css',
        severity: 'error',
        title: `":hover" will never fire on "${baseSelector}" with "display: none"`,
        description: `Elements with "display: none" are removed from layout, so mouse hover cannot reach them. Auto-Fix will convert this to "opacity: 0 / opacity: 1" with pointer-events so hover triggers smoothly.`,
        codeSnippet: snippet,
        canAutoFix: true
      });
    }
  });

  // Calculate score
  let score = 100;
  issues.forEach((issue) => {
    if (issue.severity === 'error') score -= 12;
    else if (issue.severity === 'warning') score -= 6;
    else if (issue.severity === 'info') score -= 2;
  });
  score = Math.max(0, Math.min(100, score));

  // Determine grade
  let grade: AuditReport['grade'] = 'A+';
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 50) grade = 'C';
  else grade = 'D';

  return {
    score,
    grade,
    issues,
    stats: {
      totalTags,
      imagesCount: imageMatches.length,
      linksCount: linkMatches.length,
      buttonsCount: buttonMatches.length,
      cssRulesCount: cssRuleMatches.length
    }
  };
}

/**
 * 1-Click Auto-Fix Engine
 * Intelligently patches common accessibility and HTML/CSS issues
 */
export function autoFixCode(
  html: string,
  css: string,
  js: string
): { html: string; css: string; js: string; fixedCount: number } {
  let fixedCount = 0;
  let nextHtml = html;
  let nextCss = css;

  // Fix 1: Add missing alt to <img>
  nextHtml = nextHtml.replace(/<img\b(?![^>]*\balt=)([^>]*?)(\/?)>/gi, (_match, p1, p2) => {
    fixedCount++;
    return `<img${p1} alt="Image description"${p2}>`;
  });

  // Fix 2: Fix missing href on <a>
  nextHtml = nextHtml.replace(/<a\b(?![^>]*\bhref=)([^>]*?)>/gi, (_match, p1) => {
    fixedCount++;
    return `<a href="#"${p1}>`;
  });

  // Fix 3: Fix empty href="" on <a>
  nextHtml = nextHtml.replace(/<a\b([^>]*?)\bhref=(["'])\s*\2([^>]*?)>/gi, (_match, p1, _q, p2) => {
    fixedCount++;
    return `<a${p1}href="#"${p2}>`;
  });

  // Fix 4: Fix empty buttons
  nextHtml = nextHtml.replace(/<button\b([^>]*)>\s*<\/button>/gi, (_match, p1) => {
    fixedCount++;
    const hasAria = /\baria-label=/i.test(p1);
    if (hasAria) {
      return `<button${p1}>Button</button>`;
    }
    return `<button${p1} aria-label="Action button">Button</button>`;
  });

  // Fix 5: Strip empty CSS rules
  const prevCss = nextCss;
  nextCss = nextCss.replace(/[^{}]+\{\s*\}/g, '');
  if (prevCss !== nextCss) {
    fixedCount++;
  }

  // Fix 6: Resolve display: none on hovered elements to opacity
  const hoverMatches = Array.from(nextCss.matchAll(/([^{}]+)\{([^}]+)\}/g));
  const badHoverBases = new Set<string>();
  hoverMatches.forEach(m => {
    const sel = m[1].trim();
    if (/:hover\b/i.test(sel)) {
      badHoverBases.add(sel.replace(/:hover\b/g, '').trim());
    }
  });

  badHoverBases.forEach(baseSel => {
    const displayNoneRegex = new RegExp(`(${baseSel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]*?)display\\s*:\\s*none\\s*;?`, 'gi');
    if (displayNoneRegex.test(nextCss)) {
      nextCss = nextCss.replace(displayNoneRegex, `$1opacity: 0; pointer-events: auto; transition: opacity 0.2s ease;`);
      const hoverDisplayBlockRegex = new RegExp(`(${baseSel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:hover\\s*\\{[^}]*?)display\\s*:\\s*(?:block|inline-block|flex|grid)\\s*;?`, 'gi');
      nextCss = nextCss.replace(hoverDisplayBlockRegex, `$1opacity: 1;`);
      fixedCount++;
    }
  });

  return {
    html: nextHtml,
    css: nextCss,
    js,
    fixedCount
  };
}
