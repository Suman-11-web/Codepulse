import JSZip from 'jszip';
import { Project, EditorSettings, ExternalLibrary } from '../types';

export const SUI_CSS_CDN = 'https://cdn.jsdelivr.net/gh/Suman-11-web/SUI-FRAMEWORK.CSS@v2.0.0/dist/sui.min.css';
export const SUI_JS_CDN = 'https://cdn.jsdelivr.net/gh/Suman-11-web/SUI-FRAMEWORK.CSS@v2.0.0/dist/sui.min.js';

/**
 * Generates clean index.html linking style.css and script.js, plus any active CDNs
 */
export function generateStandAloneHtml(
  html: string, 
  includeSui: boolean = true,
  externalLibraries: ExternalLibrary[] = []
): string {
  // If html already has <html> or <body>, merge appropriately, otherwise wrap
  const hasDocType = /<!DOCTYPE/i.test(html);
  const hasHtmlTag = /<html/i.test(html);
  const hasHeadTag = /<head/i.test(html);
  const hasBodyTag = /<body/i.test(html);

  const suiLink = includeSui
    ? `\n    <!-- SUI.css -->\n    <link rel="stylesheet" href="${SUI_CSS_CDN}">\n    <!-- SUI.js -->\n    <script src="${SUI_JS_CDN}"></script>`
    : '';

  // Generate CDN tags for active external libraries
  const libLinks = externalLibraries
    .filter(lib => lib.enabled && lib.id !== 'sui')
    .map(lib => {
      const parts = [];
      if (lib.cssUrl) parts.push(`<!-- ${lib.name} CSS -->\n    <link rel="stylesheet" href="${lib.cssUrl}">`);
      if (lib.jsUrl) parts.push(`<!-- ${lib.name} JS -->\n    <script src="${lib.jsUrl}"></script>`);
      return parts.join('\n    ');
    })
    .filter(Boolean)
    .join('\n    ');

  const headInject = `${suiLink}${libLinks ? '\n    ' + libLinks : ''}\n    <link rel="stylesheet" href="style.css">`;
  const bodyInject = `\n    <script src="script.js"></script>`;

  if (hasDocType || hasHtmlTag) {
    let result = html;
    if (hasHeadTag) {
      result = result.replace(/<\/head>/i, `${headInject}\n  </head>`);
    } else {
      result = result.replace(/<html[^>]*>/i, `$&<head>${headInject}</head>`);
    }

    if (hasBodyTag) {
      result = result.replace(/<\/body>/i, `${bodyInject}\n  </body>`);
    } else {
      result += bodyInject;
    }
    return result;
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SUI CodePulse Project</title>${suiLink}${libLinks ? '\n    ' + libLinks : ''}
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
${html.split('\n').map(l => '    ' + l).join('\n')}

    <script src="script.js"></script>
  </body>
</html>`;
}

/**
 * Downloads a single text file to user's computer
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports complete project as project.zip containing index.html, style.css, script.js
 */
export async function downloadProjectZip(project: { 
  name: string; 
  html: string; 
  css: string; 
  js: string; 
  includeSui?: boolean;
  externalLibraries?: ExternalLibrary[];
}) {
  const zip = new JSZip();
  const folderName = (project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'project');
  const projectFolder = zip.folder(folderName) || zip;

  const fullHtml = generateStandAloneHtml(
    project.html, 
    project.includeSui !== false,
    project.externalLibraries || []
  );
  projectFolder.file('index.html', fullHtml);
  projectFolder.file('style.css', project.css);
  projectFolder.file('script.js', project.js);

  const readme = `# ${project.name}
Created with SUI CodePulse Studio (Live Code Editor)
Featuring SUI-FRAMEWORK.CSS (https://suman-11-web.github.io/SUI-FRAMEWORK.CSS/)
Developer: Suman M (Instagram: @__suman._.007)

## How to run
Simply open \`index.html\` in any web browser, or serve this folder using any static HTTP server (e.g., Live Server, \`npx serve\`, or Python \`python -m http.server\`).
`;
  projectFolder.file('README.md', readme);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports file or zip and extracts code
 */
export async function parseImportedFile(file: File): Promise<{
  name?: string;
  html?: string;
  css?: string;
  js?: string;
}> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'zip') {
    const zip = await JSZip.loadAsync(file);
    let html = '';
    let css = '';
    let js = '';

    // Search for index.html or *.html
    const htmlFiles = Object.keys(zip.files).filter(f => f.endsWith('.html') && !f.startsWith('__MACOSX'));
    const cssFiles = Object.keys(zip.files).filter(f => f.endsWith('.css') && !f.startsWith('__MACOSX'));
    const jsFiles = Object.keys(zip.files).filter(f => f.endsWith('.js') && !f.startsWith('__MACOSX'));

    const targetHtml = htmlFiles.find(f => f.endsWith('index.html')) || htmlFiles[0];
    const targetCss = cssFiles.find(f => f.endsWith('style.css')) || cssFiles[0];
    const targetJs = jsFiles.find(f => f.endsWith('script.js')) || jsFiles[0];

    if (targetHtml) {
      html = await zip.files[targetHtml].async('text');
      // If html has internal style or script and no external files were found, extract them
      if (!targetCss && /<style[^>]*>([\s\S]*?)<\/style>/i.test(html)) {
        const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        if (match) css = match[1].trim();
      }
      if (!targetJs && /<script[^>]*>([\s\S]*?)<\/script>/i.test(html)) {
        const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (match && !match[0].includes('src=')) js = match[1].trim();
      }
    }

    if (targetCss) {
      css = await zip.files[targetCss].async('text');
    }

    if (targetJs) {
      js = await zip.files[targetJs].async('text');
    }

    const cleanName = file.name.replace(/\.zip$/i, '');
    return { name: cleanName, html, css, js };
  } else if (ext === 'html' || ext === 'htm') {
    const text = await file.text();
    return { html: text };
  } else if (ext === 'css') {
    const text = await file.text();
    return { css: text };
  } else if (ext === 'js') {
    const text = await file.text();
    return { js: text };
  }

  throw new Error('Unsupported file type. Please upload .html, .css, .js, or .zip');
}

/**
 * Storage Keys
 */
const STORAGE_PREFIX = 'sui_codepulse_';
const KEY_CURRENT_PROJECT = `${STORAGE_PREFIX}current_project`;
const KEY_SAVED_PROJECTS = `${STORAGE_PREFIX}projects_list`;
const KEY_SETTINGS = `${STORAGE_PREFIX}settings`;

export const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  wordWrap: true,
  autoRun: true,
  autoRunDelay: 500,
  includeSui: true,
  theme: 'dark',
  layout: 'split-vertical',
  suggestions: true
};

export function loadStoredSettings(): EditorSettings {
  try {
    const raw = localStorage.getItem(KEY_SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed reading settings from storage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: EditorSettings): void {
  try {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed saving settings to storage', e);
  }
}

export function loadSavedProjects(): Project[] {
  try {
    const raw = localStorage.getItem(KEY_SAVED_PROJECTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed loading projects', e);
  }
  return [];
}

export function saveProjectsList(projects: Project[]): void {
  try {
    localStorage.setItem(KEY_SAVED_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed saving projects list', e);
  }
}

export function loadCurrentProject(): Project | null {
  try {
    const raw = localStorage.getItem(KEY_CURRENT_PROJECT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed loading current project', e);
  }
  return null;
}

export function saveCurrentProjectToStorage(project: Project): void {
  try {
    localStorage.setItem(KEY_CURRENT_PROJECT, JSON.stringify(project));
  } catch (e) {
    console.error('Failed saving current project', e);
  }
}

/**
 * Encode project into URL Hash for sharing without server
 */
export function encodeProjectToShareUrl(project: { name: string; html: string; css: string; js: string; includeSui?: boolean }): string {
  try {
    const payload = JSON.stringify({
      n: project.name,
      h: project.html,
      c: project.css,
      j: project.js,
      s: project.includeSui ? 1 : 0
    });
    // UTF-8 safe base64
    const utf8Bytes = new TextEncoder().encode(payload);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const b64 = btoa(binary);
    const url = new URL(window.location.href);
    url.hash = `code=${encodeURIComponent(b64)}`;
    return url.toString();
  } catch (e) {
    console.error('Failed to create share URL', e);
    return window.location.href;
  }
}

/**
 * Decode project from URL Hash if present
 */
export function decodeProjectFromUrl(): Partial<Project> | null {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#code=')) return null;

    const b64 = decodeURIComponent(hash.substring(6));
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const data = JSON.parse(jsonStr);

    return {
      name: data.n || 'Shared Project',
      html: data.h || '',
      css: data.c || '',
      js: data.j || '',
      includeSui: data.s === 1
    };
  } catch (e) {
    console.error('Failed to parse share URL hash', e);
    return null;
  }
}
