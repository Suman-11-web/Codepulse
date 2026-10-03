import React, { useEffect, useRef, useState, useMemo } from 'react';
import { DeviceMode, ConsoleMessage, ThemeMode, ExternalLibrary, InspectedElement, DomTreeNode } from '../types';
import { SUI_CSS_CDN, SUI_JS_CDN } from '../utils/fileUtils';
import { 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Terminal, 
  ExternalLink, 
  ShieldCheck, 
  Sun,
  Moon,
  Sparkles,
  QrCode,
  Crosshair,
  RotateCcw
} from 'lucide-react';

interface PreviewProps {
  html: string;
  css: string;
  js: string;
  includeSui: boolean;
  externalLibraries?: ExternalLibrary[];
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  deviceOrientation?: 'portrait' | 'landscape';
  onToggleDeviceOrientation?: () => void;
  onConsoleMessage: (msg: Omit<ConsoleMessage, 'id' | 'timestamp'>) => void;
  onClearConsole?: () => void;
  consoleCount: { error: number; total: number };
  isConsoleOpen: boolean;
  onToggleConsole: () => void;
  isInspectActive?: boolean;
  onToggleInspect?: () => void;
  onElementInspected?: (el: InspectedElement, domTree: DomTreeNode) => void;
  onOpenMobileQr?: () => void;
  onOpenResponsiveMatrix?: () => void;
  theme: ThemeMode;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  executionCount?: number;
}

export const Preview: React.FC<PreviewProps> = ({
  html,
  css,
  js,
  includeSui,
  externalLibraries = [],
  deviceMode,
  onDeviceModeChange,
  deviceOrientation = 'portrait',
  onToggleDeviceOrientation,
  onConsoleMessage,
  onClearConsole,
  consoleCount,
  isConsoleOpen,
  onToggleConsole,
  isInspectActive = false,
  onToggleInspect,
  onElementInspected,
  onOpenMobileQr,
  onOpenResponsiveMatrix,
  theme,
  isFullscreen = false,
  onToggleFullscreen,
  iframeRef: externalIframeRef,
  executionCount = 0
}) => {
  const localIframeRef = useRef<HTMLIFrameElement | null>(null);
  const activeIframeRef = externalIframeRef || localIframeRef;
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewThemeOverride, setPreviewThemeOverride] = useState<'auto' | 'light' | 'dark'>('auto');

  // Trigger preview refresh only when executionCount explicitly changes from manual Run
  const prevExecCountRef = useRef(executionCount);
  useEffect(() => {
    if (executionCount > 0 && executionCount !== prevExecCountRef.current) {
      prevExecCountRef.current = executionCount;
      setRefreshKey(prev => prev + 1);
    }
  }, [executionCount]);

  // Compute effective theme for the preview iframe
  const effectiveTheme: ThemeMode = previewThemeOverride === 'auto' ? theme : previewThemeOverride;

  // Sync inspect mode to iframe
  useEffect(() => {
    const iframe = activeIframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'SET_INSPECT_MODE',
        enabled: isInspectActive
      }, '*');
    }
  }, [isInspectActive, activeIframeRef]);

  // In-place dynamic CSS update to avoid iframe reloads during CSS edits
  const lastInjectedCssRef = useRef<string>(css);
  useEffect(() => {
    if (lastInjectedCssRef.current === css) return;
    lastInjectedCssRef.current = css;
    try {
      const iframe = activeIframeRef.current;
      if (iframe && iframe.contentDocument) {
        const doc = iframe.contentDocument;
        const styleTag = doc.getElementById('__codepulse_live_styles__');
        if (styleTag) {
          styleTag.textContent = css;
          return;
        }
      }
    } catch (e) {}
  }, [css, activeIframeRef]);

  // Re-generate iframe bundle with safe real JS engine, console interception, and DOM Inspector
  const generatePreviewSrcDoc = () => {
    const suiTags = includeSui
      ? `<link rel="stylesheet" href="${SUI_CSS_CDN}">\n  <script src="${SUI_JS_CDN}"></script>`
      : '';

    // Generate tags for active external libraries
    const libTags = externalLibraries
      .filter(l => l.enabled && l.id !== 'sui')
      .map(lib => {
        const parts = [];
        if (lib.cssUrl) parts.push(`<link rel="stylesheet" href="${lib.cssUrl}">`);
        if (lib.jsUrl) parts.push(`<script src="${lib.jsUrl}"></script>`);
        return parts.join('\n  ');
      })
      .filter(Boolean)
      .join('\n  ');

    const hasDocType = /<!DOCTYPE/i.test(html);
    const hasHtmlTag = /<html/i.test(html);
    const hasHeadTag = /<head/i.test(html);

    // Safely encode user code into a JSON string literal to prevent script tag or token breakage
    const userJsJson = JSON.stringify(js || '').replace(/<\/script/gi, '<\\/script');

    const internalHeadAssets = `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="${effectiveTheme}">
  <title>Live Preview</title>
  ${suiTags}
  ${libTags}
  <style>
    :root {
      color-scheme: ${effectiveTheme};
    }
    html {
      color-scheme: ${effectiveTheme};
      box-sizing: border-box;
      background-color: ${effectiveTheme === 'dark' ? '#090d16' : '#ffffff'};
    }
    *, *::before, *::after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      background-color: ${effectiveTheme === 'dark' ? '#090d16' : '#ffffff'};
      color: ${effectiveTheme === 'dark' ? '#f1f5f9' : '#0f172a'};
      min-height: 100vh;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    /* Inspector Blueprint Highlight Overlay */
    .__codepulse_highlight {
      position: absolute;
      pointer-events: none;
      z-index: 2147483647;
      background: rgba(59, 130, 246, 0.25);
      border: 1px solid #3b82f6;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
      transition: all 0.05s ease-out;
    }
    .__codepulse_badge {
      position: absolute;
      pointer-events: none;
      z-index: 2147483647;
      background: #1e293b;
      color: #f8fafc;
      font-family: monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #475569;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      white-space: nowrap;
    }
  </style>
  <style id="__codepulse_live_styles__">
${css}
  </style>
  <script id="__codepulse_engine__">
    (function() {
      const counts = {};
      const timers = {};

      function safeStringify(obj, maxDepth) {
        if (maxDepth === undefined) maxDepth = 3;
        var seen = [];

        function serialize(val, depth) {
          if (val === null) return 'null';
          if (val === undefined) return 'undefined';
          if (typeof val === 'number') return isNaN(val) ? 'NaN' : String(val);
          if (typeof val === 'boolean') return String(val);
          if (typeof val === 'string') return depth > 0 ? JSON.stringify(val) : val;
          if (typeof val === 'symbol') return val.toString();
          if (typeof val === 'bigint') return val.toString() + 'n';
          if (typeof val === 'function') {
            var name = val.name ? ' ' + val.name : '';
            return 'ƒ' + name + '()';
          }
          if (val instanceof Error) {
            return (val.stack || (val.name + ': ' + val.message));
          }
          if (val instanceof Date) {
            return depth > 0 ? JSON.stringify(val.toISOString()) : val.toISOString();
          }
          if (val instanceof RegExp) {
            return depth > 0 ? JSON.stringify(val.toString()) : val.toString();
          }
          if (typeof Element !== 'undefined' && val instanceof Element) {
            var desc = '<' + val.tagName.toLowerCase();
            if (val.id) desc += '#' + val.id;
            if (val.className && typeof val.className === 'string') {
              desc += '.' + val.className.trim().split(/\\s+/).join('.');
            }
            desc += '>';
            return desc;
          }

          if (typeof val === 'object') {
            if (seen.indexOf(val) !== -1) return '"[Circular]"';
            seen.push(val);

            if (depth >= maxDepth) {
              return Array.isArray(val) ? '"[...Array(' + val.length + ')]"' : '"{...Object}"';
            }

            if (Array.isArray(val)) {
              try {
                return '[' + val.map(function(item) {
                  return serialize(item, depth + 1);
                }).join(', ') + ']';
              } catch(e) {
                return '[Array]';
              }
            }

            try {
              var keys = Object.keys(val);
              var props = keys.slice(0, 100).map(function(k) {
                var vStr;
                try { vStr = serialize(val[k], depth + 1); }
                catch(e) { vStr = '"[Unreadable]"'; }
                return JSON.stringify(k) + ': ' + vStr;
              });
              if (keys.length > 100) props.push('"... ' + (keys.length - 100) + ' more"');
              return '{ ' + props.join(', ') + ' }';
            } catch(e) {
              return Object.prototype.toString.call(val);
            }
          }

          return String(val);
        }

        return serialize(obj, 0);
      }

      var msgSequence = 0;

      function sendToParent(type, args, resultType, tableData, rawData) {
        try {
          var serializable = Array.from(args || []).map(function(arg) {
            if (typeof arg === 'string') return arg;
            return safeStringify(arg);
          });

          // Extract single object/array for interactive inspector
          if (rawData === undefined && args && args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            try {
              rawData = JSON.parse(JSON.stringify(args[0]));
            } catch(e) {}
          }

          var msgId = 'cp_' + Date.now() + '_' + (++msgSequence) + '_' + Math.random().toString(36).substring(2, 7);

          var payload = {
            source: 'codepulse-preview',
            msgId: msgId,
            type: type,
            content: serializable,
            resultType: resultType,
            tableData: tableData,
            rawData: rawData
          };

          // 1. Direct parent hook (instant & synchronous)
          try {
            if (window.parent && typeof window.parent.__CODEPULSE_CONSOLE_HOOK__ === 'function') {
              window.parent.__CODEPULSE_CONSOLE_HOOK__(payload);
            }
          } catch(e1) {}

          // 2. postMessage to parent (cross-origin / backup delivery)
          try {
            if (window.parent && window.parent.postMessage) {
              window.parent.postMessage(payload, '*');
            }
          } catch(e2) {}
        } catch(e) {}
      }

      // Expose globally inside preview
      window.__codepulse_send = sendToParent;

      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;
      const origInfo = console.info;
      const origClear = console.clear;

      console.log = function() {
        sendToParent('log', arguments);
        if (origLog) { try { origLog.apply(console, arguments); } catch(e) {} }
      };
      console.info = function() {
        sendToParent('info', arguments);
        if (origInfo) { try { origInfo.apply(console, arguments); } catch(e) {} }
      };
      console.warn = function() {
        sendToParent('warn', arguments);
        if (origWarn) { try { origWarn.apply(console, arguments); } catch(e) {} }
      };
      console.error = function() {
        sendToParent('error', arguments);
        if (origError) { try { origError.apply(console, arguments); } catch(e) {} }
      };
      console.debug = function() {
        sendToParent('info', arguments);
      };
      console.clear = function() {
        sendToParent('clear', []);
        if (origClear) { try { origClear.apply(console); } catch(e) {} }
      };

      console.count = function(label) {
        label = label === undefined ? 'default' : String(label);
        counts[label] = (counts[label] || 0) + 1;
        sendToParent('info', [label + ': ' + counts[label]]);
      };

      console.countReset = function(label) {
        label = label === undefined ? 'default' : String(label);
        counts[label] = 0;
      };

      console.time = function(label) {
        label = label === undefined ? 'default' : String(label);
        timers[label] = performance.now();
      };

      console.timeEnd = function(label) {
        label = label === undefined ? 'default' : String(label);
        if (timers[label] !== undefined) {
          const elapsed = performance.now() - timers[label];
          delete timers[label];
          sendToParent('info', [label + ': ' + elapsed.toFixed(2) + ' ms']);
        } else {
          sendToParent('warn', ["Timer '" + label + "' does not exist"]);
        }
      };

      console.timeLog = function(label) {
        label = label === undefined ? 'default' : String(label);
        if (timers[label] !== undefined) {
          const elapsed = performance.now() - timers[label];
          sendToParent('info', [label + ': ' + elapsed.toFixed(2) + ' ms']);
        }
      };

      console.assert = function(condition) {
        if (!condition) {
          var args = Array.prototype.slice.call(arguments, 1);
          var msg = args.length > 0 ? args.map(safeStringify).join(' ') : 'console.assert failed';
          sendToParent('error', ['Assertion failed: ' + msg]);
        }
      };

      console.table = function(data) {
        let tableFormatted = null;
        try {
          if (Array.isArray(data)) {
            tableFormatted = data.map((item, idx) => {
              if (typeof item === 'object' && item !== null) {
                return { '(index)': idx, ...item };
              }
              return { '(index)': idx, 'Value': item };
            });
          } else if (typeof data === 'object' && data !== null) {
            tableFormatted = Object.keys(data).map(key => ({
              '(index)': key,
              'Value': data[key]
            }));
          }
        } catch(e) {}

        const serialized = safeStringify(data);
        sendToParent('table', [serialized], 'object', tableFormatted, data);
      };

      console.dir = function(data) {
        sendToParent('log', [safeStringify(data, 5)], undefined, undefined, data);
      };

      console.group = function(label) {
        sendToParent('info', ['▼ ' + (label || 'console.group')]);
      };
      console.groupCollapsed = function(label) {
        sendToParent('info', ['▶ ' + (label || 'console.group')]);
      };
      console.groupEnd = function() {};

      function showInPreviewAlert(msg) {
        try {
          var existing = document.getElementById('__codepulse_alert_modal__');
          if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

          var overlay = document.createElement('div');
          overlay.id = '__codepulse_alert_modal__';
          overlay.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:12px;background:#0f172a;color:#f8fafc;padding:10px 18px;border-radius:10px;box-shadow:0 12px 28px -4px rgba(0,0,0,0.5);border:1px solid #334155;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;max-width:90%;';

          var textSpan = document.createElement('span');
          textSpan.style.cssText = 'display:flex;align-items:center;gap:6px;';
          var strongTag = document.createElement('strong');
          strongTag.style.color = '#38bdf8';
          strongTag.textContent = '📢 Alert:';
          var msgNode = document.createTextNode(' ' + msg);
          textSpan.appendChild(strongTag);
          textSpan.appendChild(msgNode);

          var btn = document.createElement('button');
          btn.textContent = 'OK';
          btn.style.cssText = 'background:#2563eb;color:#ffffff;border:none;padding:4px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;outline:none;';
          btn.onclick = function() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };

          overlay.appendChild(textSpan);
          overlay.appendChild(btn);

          if (document.body) {
            document.body.appendChild(overlay);
          } else if (document.documentElement) {
            document.documentElement.appendChild(overlay);
          }

          setTimeout(function() {
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
          }, 4500);
        } catch(e) {}
      }

      window.alert = function(msg) {
        var str = String(msg === undefined ? '' : msg);
        sendToParent('info', ['📢 [Alert]: ' + str]);
        showInPreviewAlert(str);
      };

      window.confirm = function(msg) {
        var str = String(msg === undefined ? '' : msg);
        sendToParent('info', ['❓ [Confirm]: ' + str]);
        return true;
      };

      window.prompt = function(msg, defaultVal) {
        var str = String(msg === undefined ? '' : msg);
        sendToParent('info', ['💬 [Prompt]: ' + str + (defaultVal ? ' (Default: ' + defaultVal + ')' : '')]);
        return defaultVal || null;
      };

      // Comprehensive error interception
      window.onerror = function(message, source, lineno, colno, error) {
        var lineInfo = '';
        if (lineno) lineInfo = ' (Line ' + lineno + (colno ? ':' + colno : '') + ')';
        var errMsg = '';
        if (error && error.stack) {
          errMsg = error.stack;
        } else if (error && error.message) {
          errMsg = error.name ? (error.name + ': ' + error.message) : error.message;
        } else {
          errMsg = String(message || 'Unknown error');
        }
        sendToParent('error', ['❌ ' + errMsg + lineInfo]);
        return true; // Suppress uncaught browser errors in Chrome host console
      };

      window.addEventListener('unhandledrejection', function(event) {
        var reason = event.reason ? ((event.reason && event.reason.stack) || event.reason.message || String(event.reason)) : 'Unknown';
        sendToParent('error', ['❌ Unhandled Promise: ' + reason]);
      });

      window.addEventListener('error', function(event) {
        if (event && event.error) {
          var errMsg = event.error.stack || event.error.message || String(event.error);
          var lineInfo = event.lineno ? (' (Line ' + event.lineno + (event.colno ? ':' + event.colno : '') + ')') : '';
          sendToParent('error', ['❌ ' + errMsg + lineInfo]);
        }
      }, true);

      // -------------------------------------------------------------
      // INTERACTIVE DOM INSPECTOR ENGINE INSIDE IFRAME
      // -------------------------------------------------------------
      let inspectMode = ${isInspectActive ? 'true' : 'false'};
      let highlightBox = null;
      let highlightBadge = null;

      function getOrCreateHighlightElements() {
        if (!highlightBox) {
          highlightBox = document.createElement('div');
          highlightBox.className = '__codepulse_highlight';
          document.documentElement.appendChild(highlightBox);
        }
        if (!highlightBadge) {
          highlightBadge = document.createElement('div');
          highlightBadge.className = '__codepulse_badge';
          document.documentElement.appendChild(highlightBadge);
        }
      }

      function hideHighlight() {
        if (highlightBox) highlightBox.style.display = 'none';
        if (highlightBadge) highlightBadge.style.display = 'none';
      }

      function serializeDomTree(element, idPrefix) {
        if (!idPrefix) idPrefix = 'node';
        if (!element || element.nodeType !== 1) return null;
        if (element.classList && element.classList.contains('__codepulse_highlight')) return null;
        if (element.classList && element.classList.contains('__codepulse_badge')) return null;

        const tagName = element.tagName.toLowerCase();
        if (tagName === 'script' || tagName === 'style') return null;

        const idAttr = element.id || undefined;
        const classNames = element.className && typeof element.className === 'string' ? element.className.trim() : undefined;
        
        const attributes = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          if (!attr.name.startsWith('__')) {
            attributes[attr.name] = attr.value;
          }
        }

        const isVoid = ['img', 'input', 'br', 'hr', 'link', 'meta'].includes(tagName);
        let textPreview = undefined;
        if (!isVoid && element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
          textPreview = element.textContent.trim().substring(0, 40);
        }

        const children = [];
        for (let i = 0; i < element.children.length; i++) {
          const childNode = serializeDomTree(element.children[i], idPrefix + '-' + i);
          if (childNode) children.push(childNode);
        }

        return {
          id: idPrefix,
          tagName,
          idAttr,
          classNames,
          textPreview,
          attributes,
          children,
          isVoid
        };
      }

      function inspectElement(target) {
        if (!target || target.nodeType !== 1) return;
        const style = window.getComputedStyle(target);
        const rect = target.getBoundingClientRect();

        const parsePx = (val) => parseFloat(val) || 0;

        const boxModel = {
          margin: {
            top: parsePx(style.marginTop),
            right: parsePx(style.marginRight),
            bottom: parsePx(style.marginBottom),
            left: parsePx(style.marginLeft)
          },
          border: {
            top: parsePx(style.borderTopWidth),
            right: parsePx(style.borderRightWidth),
            bottom: parsePx(style.borderBottomWidth),
            left: parsePx(style.borderLeftWidth)
          },
          padding: {
            top: parsePx(style.paddingTop),
            right: parsePx(style.paddingRight),
            bottom: parsePx(style.paddingBottom),
            left: parsePx(style.paddingLeft)
          },
          content: {
            width: rect.width - parsePx(style.paddingLeft) - parsePx(style.paddingRight) - parsePx(style.borderLeftWidth) - parsePx(style.borderRightWidth),
            height: rect.height - parsePx(style.paddingTop) - parsePx(style.paddingBottom) - parsePx(style.borderTopWidth) - parsePx(style.borderBottomWidth)
          }
        };

        const keyStyles = [
          'display', 'position', 'width', 'height', 'margin', 'padding', 'border',
          'color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight',
          'letterSpacing', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
          'zIndex', 'opacity', 'boxShadow', 'borderRadius', 'overflow'
        ];

        const computedStyles = {};
        keyStyles.forEach(k => {
          computedStyles[k] = style[k] || style.getPropertyValue(k);
        });

        // Compute selector path
        let selectorPath = target.tagName.toLowerCase();
        if (target.id) selectorPath += '#' + target.id;
        if (target.className && typeof target.className === 'string') {
          selectorPath += '.' + target.className.trim().split(/\\s+/).join('.');
        }

        const attributes = {};
        for (let i = 0; i < target.attributes.length; i++) {
          const attr = target.attributes[i];
          attributes[attr.name] = attr.value;
        }

        const inspectedPayload = {
          tagName: target.tagName.toLowerCase(),
          id: target.id || '',
          className: (typeof target.className === 'string' ? target.className : ''),
          attributes,
          innerTextPreview: target.innerText ? target.innerText.trim().substring(0, 80) : '',
          selectorPath,
          computedStyles,
          boxModel,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          }
        };

        const tree = serializeDomTree(document.body, 'body');

        window.parent.postMessage({
          source: 'codepulse-preview',
          type: 'ELEMENT_INSPECTED',
          element: inspectedPayload,
          domTree: tree
        }, '*');
      }

      document.addEventListener('mouseover', function(e) {
        if (!inspectMode) return;
        const target = e.target;
        if (!target || target === document.documentElement || target === document.body || target.classList.contains('__codepulse_highlight') || target.classList.contains('__codepulse_badge')) return;

        getOrCreateHighlightElements();
        const rect = target.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        highlightBox.style.display = 'block';
        highlightBox.style.top = (rect.top + scrollY) + 'px';
        highlightBox.style.left = (rect.left + scrollX) + 'px';
        highlightBox.style.width = rect.width + 'px';
        highlightBox.style.height = rect.height + 'px';

        let badgeText = target.tagName.toLowerCase();
        if (target.id) badgeText += '#' + target.id;
        if (target.className && typeof target.className === 'string') {
          badgeText += '.' + target.className.trim().split(/\\s+/)[0];
        }
        badgeText += ' | ' + Math.round(rect.width) + '×' + Math.round(rect.height);

        highlightBadge.textContent = badgeText;
        highlightBadge.style.display = 'block';
        highlightBadge.style.top = Math.max(0, rect.top + scrollY - 24) + 'px';
        highlightBadge.style.left = (rect.left + scrollX) + 'px';
      }, true);

      document.addEventListener('mouseout', function(e) {
        if (!inspectMode) return;
        hideHighlight();
      }, true);

      document.addEventListener('click', function(e) {
        if (!inspectMode) return;
        e.preventDefault();
        e.stopPropagation();
        inspectElement(e.target);
      }, true);

      window.addEventListener('message', function(ev) {
        if (!ev.data) return;
        if (ev.data.type === 'SET_INSPECT_MODE') {
          inspectMode = Boolean(ev.data.enabled);
          if (!inspectMode) hideHighlight();
        }
        if (ev.data.type === 'EVAL_JS') {
          try {
            if (!window.$) window.$ = document.querySelector.bind(document);
            if (!window.$$) window.$$ = function(s) { return Array.from(document.querySelectorAll(s)); };
            if (!window.clear) window.clear = function() { console.clear(); };
            if (!window.dir) window.dir = function(x) { console.dir(x); };
            if (!window.table) window.table = function(x) { console.table(x); };

            const rawCode = ev.data.code;
            const res = (0, eval)(rawCode);
            const rType = typeof res;
            const displayStr = safeStringify(res, 4);

            var rawData = undefined;
            if (typeof res === 'object' && res !== null) {
              try { rawData = JSON.parse(JSON.stringify(res)); } catch(e) {}
            }

            sendToParent('result', [displayStr], rType, undefined, rawData);
          } catch(evalErr) {
            var errStr = (evalErr && evalErr.stack) ? evalErr.stack : (evalErr && evalErr.message) ? (evalErr.name + ': ' + evalErr.message) : String(evalErr);
            sendToParent('error', ['❌ ' + errStr]);
          }
        }
      });
    })();
  </script>`;

    // Runner script placed right before </body> to run after DOM is constructed
    const userRunnerScript = `
  <script id="__codepulse_user_runner__">
    (function() {
      var rawUserJs = ${userJsJson};
      if (!rawUserJs || !rawUserJs.trim()) return;

      function executeUserEngine() {
        // 1. Pre-flight Syntax Check: Catches SyntaxError (invalid tokens, unexpected tokens, etc.)
        try {
          new Function(rawUserJs);
        } catch (syntaxErr) {
          var lineInfo = '';
          if (syntaxErr && syntaxErr.lineNumber) {
            lineInfo = ' (Line ' + syntaxErr.lineNumber + ')';
          }
          if (typeof window.__codepulse_send === 'function') {
            window.__codepulse_send('error', ['❌ ' + (syntaxErr.name || 'SyntaxError') + ': ' + (syntaxErr.message || 'Invalid or unexpected token') + lineInfo]);
          }
          return;
        }

        // 2. Global Execution Engine: Executes code in global scope with top-level window exposure
        try {
          (0, eval)(rawUserJs);
        } catch (runtimeErr) {
          var errMsg = '';
          if (runtimeErr && runtimeErr.stack) {
            errMsg = runtimeErr.stack;
          } else if (runtimeErr && runtimeErr.message) {
            errMsg = (runtimeErr.name ? (runtimeErr.name + ': ') : '') + runtimeErr.message;
          } else {
            errMsg = String(runtimeErr || 'Runtime error');
          }
          if (typeof window.__codepulse_send === 'function') {
            window.__codepulse_send('error', ['❌ ' + errMsg]);
          }
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeUserEngine);
      } else {
        executeUserEngine();
      }
    })();
  </script>`;

    if (hasDocType || hasHtmlTag) {
      let result = html;
      if (hasHeadTag) {
        result = result.replace(/<head[^>]*>/i, (m) => m + '\n' + internalHeadAssets);
      } else if (hasHtmlTag) {
        result = result.replace(/<html[^>]*>/i, (m) => m + '<head>' + internalHeadAssets + '</head>');
      } else {
        result = '<head>' + internalHeadAssets + '</head>' + result;
      }

      if (userRunnerScript) {
        if (/<\/body>/i.test(result)) {
          result = result.replace(/<\/body>/i, (m) => userRunnerScript + '\n' + m);
        } else {
          result = result + userRunnerScript;
        }
      }
      return result;
    }

    return `<!DOCTYPE html>
<html lang="en" class="${effectiveTheme}" data-theme="${effectiveTheme}">
<head>
${internalHeadAssets}
</head>
<body class="${effectiveTheme === 'dark' ? 'dark-preview' : 'light-preview'}">
  ${html}
  ${userRunnerScript}
</body>
</html>`;
  };

  // Memoize previewSrcDoc so unnecessary parent re-renders do not reload the iframe
  const previewSrcDoc = useMemo(() => {
    lastInjectedCssRef.current = css;
    return generatePreviewSrcDoc();
  }, [html, js, effectiveTheme, includeSui, externalLibraries, refreshKey]);

  // Dynamically update iframe document classes on theme change
  useEffect(() => {
    try {
      const iframe = activeIframeRef.current;
      if (iframe && iframe.contentDocument) {
        const doc = iframe.contentDocument;
        if (doc.documentElement) {
          doc.documentElement.className = effectiveTheme;
          doc.documentElement.setAttribute('data-theme', effectiveTheme);
          doc.documentElement.style.colorScheme = effectiveTheme;
        }
        if (doc.body) {
          doc.body.className = effectiveTheme === 'dark' ? 'dark-preview' : 'light-preview';
          if (!css.includes('background') && !css.includes('background-color')) {
            doc.body.style.backgroundColor = effectiveTheme === 'dark' ? '#090d16' : '#ffffff';
            doc.body.style.color = effectiveTheme === 'dark' ? '#f1f5f9' : '#0f172a';
          }
        }
      }
    } catch (e) {}
  }, [effectiveTheme, css, activeIframeRef]);

  // Handle postMessage from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'codepulse-preview') {
        if (event.data.type === 'clear') {
          if (onClearConsole) onClearConsole();
        } else if (event.data.type === 'ELEMENT_INSPECTED') {
          if (onElementInspected && event.data.element) {
            onElementInspected(event.data.element, event.data.domTree);
          }
        } else {
          onConsoleMessage({
            msgId: event.data.msgId,
            type: event.data.type,
            content: event.data.content,
            resultType: event.data.resultType,
            tableData: event.data.tableData
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onConsoleMessage, onClearConsole, onElementInspected]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const handleCyclePreviewTheme = () => {
    setPreviewThemeOverride(prev => {
      if (prev === 'auto') return 'dark';
      if (prev === 'dark') return 'light';
      return 'auto';
    });
  };

  const handleOpenNewWindow = () => {
    const srcDoc = generatePreviewSrcDoc();
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(srcDoc);
      win.document.close();
    }
  };

  // Device width and orientation styles
  const getDeviceContainerStyle = () => {
    if (deviceMode === 'tablet') {
      return deviceOrientation === 'landscape'
        ? { width: '1024px', maxWidth: '100%', height: '768px', maxHeight: '100%' }
        : { width: '768px', maxWidth: '100%', height: '100%' };
    }
    if (deviceMode === 'mobile') {
      return deviceOrientation === 'landscape'
        ? { width: '667px', maxWidth: '100%', height: '375px', maxHeight: '100%' }
        : { width: '375px', maxWidth: '100%', height: '100%' };
    }
    return { width: '100%', height: '100%' };
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden rounded-xl border transition-all duration-200 ${
      theme === 'dark' 
        ? 'bg-[#090d16] border-neutral-800 shadow-lg shadow-black/20' 
        : 'bg-white border-neutral-200/80 shadow-md shadow-neutral-200/40'
    }`}>
      {/* Preview Header / Device Toolbar */}
      <div className={`flex items-center justify-between px-3.5 py-2 border-b select-none ${
        theme === 'dark' 
          ? 'bg-[#0d1117] border-neutral-800/80' 
          : 'bg-neutral-100/95 border-neutral-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" aria-hidden="true" />
            <span className={`text-xs font-extrabold tracking-wider uppercase ${
              theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'
            }`}>
              Live Preview
            </span>
          </div>

          {/* Inspect Element Toggle Button */}
          {onToggleInspect && (
            <button
              onClick={onToggleInspect}
              title={isInspectActive ? "Stop inspecting element" : "Inspect Element in Preview (DevTools)"}
              className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 font-bold transition-all ${
                isInspectActive
                  ? 'bg-blue-600 text-white shadow-xs animate-pulse'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">
                {isInspectActive ? 'Inspecting' : 'Inspect'}
              </span>
            </button>
          )}

          {/* Device Switcher */}
          <div className="hidden sm:flex items-center p-0.5 bg-neutral-200/60 dark:bg-neutral-800/80 rounded-lg">
            <button
              onClick={() => onDeviceModeChange('desktop')}
              className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 font-semibold transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
              title="Desktop View (100% width)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('tablet')}
              className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 font-semibold transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden md:inline">768px</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('mobile')}
              className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 font-semibold transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden md:inline">375px</span>
            </button>
            {onOpenResponsiveMatrix && (
              <button
                onClick={onOpenResponsiveMatrix}
                className="px-2 py-1 rounded-md text-xs flex items-center gap-1 font-semibold transition-all text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                title="Open Multi-Device Responsive Matrix (Mobile + Tablet + Desktop side-by-side)"
              >
                <Monitor className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[11px] hidden md:inline">Matrix</span>
              </button>
            )}
          </div>

          {/* Orientation Rotate Button (For mobile/tablet) */}
          {deviceMode !== 'desktop' && onToggleDeviceOrientation && (
            <button
              onClick={onToggleDeviceOrientation}
              title={`Switch Orientation: Currently ${deviceOrientation} — Click to rotate`}
              className="px-2 py-1 rounded-md text-xs flex items-center gap-1 font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] hidden lg:inline capitalize">{deviceOrientation}</span>
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Mobile QR Code Button */}
          {onOpenMobileQr && (
            <button
              onClick={onOpenMobileQr}
              title="Scan with Mobile Camera to test on physical device"
              aria-label="Mobile QR Code"
              className="px-2 py-1 rounded-md text-xs flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden md:inline">Mobile QR</span>
            </button>
          )}

          {/* Preview Theme Toggle Button */}
          <button
            onClick={handleCyclePreviewTheme}
            title={`Preview Theme: ${effectiveTheme === 'dark' ? 'Dark' : 'Light'} (${previewThemeOverride === 'auto' ? 'Syncs with Studio' : 'Manual'}) — Click to toggle`}
            aria-label="Toggle preview theme"
            className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 font-semibold transition-all ${
              previewThemeOverride !== 'auto'
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                : theme === 'dark'
                  ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
            }`}
          >
            {effectiveTheme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="text-[11px] hidden lg:inline capitalize">
              {previewThemeOverride === 'auto' ? `Theme: Auto` : `Theme: ${effectiveTheme}`}
            </span>
          </button>

          {/* Console Drawer Trigger */}
          <button
            onClick={onToggleConsole}
            title="Toggle Developer Console"
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 font-semibold transition-all ${
              isConsoleOpen
                ? 'bg-blue-600 text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 border border-neutral-700/60'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80 border border-neutral-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Console</span>
            {consoleCount.error > 0 ? (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-500 text-white animate-pulse">
                {consoleCount.error}
              </span>
            ) : consoleCount.total > 0 ? (
              <span className="text-[10px] text-neutral-400">({consoleCount.total})</span>
            ) : null}
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            title="Refresh Preview"
            aria-label="Refresh Preview"
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark'
                ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          {/* Open in new window */}
          <button
            onClick={handleOpenNewWindow}
            title="Open in new window"
            aria-label="Open in new window"
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark'
                ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit preview fullscreen" : "Fullscreen preview"}
              aria-label="Toggle Fullscreen"
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Frame Viewport Area */}
      <div className={`flex-1 w-full flex items-center justify-center p-0 sm:p-2 overflow-auto ${
        deviceMode !== 'desktop' 
          ? 'bg-neutral-200/70 dark:bg-neutral-900/60' 
          : effectiveTheme === 'dark' ? 'bg-[#060910]' : 'bg-neutral-100/50'
      }`}>
        <div 
          style={getDeviceContainerStyle()}
          className={`relative transition-all duration-200 flex flex-col ${
            deviceMode !== 'desktop' 
              ? `rounded-2xl shadow-2xl border-4 border-neutral-700/80 dark:border-neutral-800 ${effectiveTheme === 'dark' ? 'bg-[#090d16]' : 'bg-white'} overflow-hidden my-auto max-h-full` 
              : 'w-full h-full'
          }`}
        >
          {deviceMode !== 'desktop' && (
            <div className="bg-neutral-800 text-neutral-300 text-[10px] font-mono py-1 px-3 text-center flex items-center justify-between select-none shrink-0">
              <span>
                {deviceMode === 'tablet' 
                  ? `Tablet (${deviceOrientation === 'landscape' ? '1024×768' : '768×1024'})` 
                  : `Mobile (${deviceOrientation === 'landscape' ? '667×375' : '375×667'})`}
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Sandboxed
              </span>
            </div>
          )}

          <iframe
            key={`preview-${refreshKey}-${effectiveTheme}-${includeSui}`}
            ref={(node) => {
              if (externalIframeRef) {
                (externalIframeRef as React.MutableRefObject<HTMLIFrameElement | null>).current = node;
              }
              localIframeRef.current = node;
            }}
            srcDoc={previewSrcDoc}
            title="SUI CodePulse Live Preview"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className={`w-full flex-1 border-0 transition-opacity duration-150 ${effectiveTheme === 'dark' ? 'bg-[#090d16]' : 'bg-white'}`}
          />
        </div>
      </div>
    </div>
  );
};

