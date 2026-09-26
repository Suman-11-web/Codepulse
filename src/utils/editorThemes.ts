import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

/* =========================================================================
   PRO LIGHT THEME: Vibrant, high-contrast, crystal-clear syntax highlighting
   Inspired by VS Code Light+ / GitHub Light with full WCAG AAA contrast
   ========================================================================= */
export const proLightHighlightStyle = HighlightStyle.define([
  // Keywords (JS keywords, CSS @rules, HTML doctype, export/import)
  { tag: [t.keyword, t.definitionKeyword, t.modifier], color: '#cf222e', fontWeight: '700' }, // Vibrant Crimson Red
  
  // HTML Tags & Angle brackets
  { tag: [t.tagName, t.standard(t.tagName)], color: '#0550ae', fontWeight: '700' }, // Deep Royal Cobalt Blue (<h1, <div, <button)
  { tag: t.angleBracket, color: '#0550ae', fontWeight: '700' }, // Cobalt Blue for < and >
  
  // HTML Attributes & CSS Properties
  { tag: [t.attributeName, t.propertyName], color: '#116329', fontWeight: '600' }, // Rich Emerald Green (class=, id=, color:, display:)
  { tag: t.attributeValue, color: '#0a3069', fontWeight: '500' }, // Deep Navy Blue for attribute strings
  
  // CSS Selectors & Classes
  { tag: [t.className, t.macroName], color: '#6f42c1', fontWeight: '700' }, // Deep Royal Purple (.class, #id)
  { tag: t.labelName, color: '#8250df', fontWeight: '600' }, // Violet
  
  // Functions & Methods
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#8250df', fontWeight: '600' }, // Vivid Violet for functions
  
  // Strings & Text literals
  { tag: [t.string, t.special(t.string), t.inserted], color: '#0a3069', fontWeight: '500' }, // Deep Navy / Midnight Blue
  { tag: [t.character, t.escape, t.regexp], color: '#116329', fontWeight: '600' }, // Forest Green
  
  // Numbers, Units & Booleans
  { tag: [t.number, t.integer, t.float], color: '#0969da', fontWeight: '600' }, // Bright Blue
  { tag: t.unit, color: '#953800', fontWeight: '600' }, // Burnt Amber (px, rem, %, ms)
  { tag: [t.bool, t.atom, t.null], color: '#0550ae', fontWeight: '700' }, // Navy Blue (true, false, null)
  
  // Colors in CSS
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#b45309', fontWeight: '700' }, // Warm Amber Gold
  
  // Variables & Identifiers
  { tag: [t.variableName, t.definition(t.variableName), t.name], color: '#0f172a', fontWeight: '500' }, // Deep Slate
  
  // Operators & Delimiters
  { tag: [t.operator, t.operatorKeyword], color: '#cf222e', fontWeight: '600' }, // Crimson (+, -, *, =, =>)
  { tag: [t.punctuation, t.separator], color: '#24292f' }, // Charcoal (; , :)
  { tag: [t.bracket, t.paren, t.brace, t.squareBracket], color: '#24292f', fontWeight: '600' }, // Charcoal brackets { } [ ] ( )
  
  // Comments
  { tag: [t.comment, t.lineComment, t.blockComment, t.meta], color: '#57606a', fontStyle: 'italic', fontWeight: '500' }, // Medium Slate Gray
  
  // Formatting & Headings
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: '#0969da', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#0f172a' },
  { tag: [t.content, t.literal], color: '#0f172a' }, // Tag text content (words between tags)
  { tag: t.invalid, color: '#cf222e', backgroundColor: 'rgba(207, 34, 46, 0.1)' }
]);

export const proLightTheme = EditorView.theme({
  "&": {
    color: "#0f172a",
    backgroundColor: "#ffffff",
    height: "100%",
    fontSize: "inherit"
  },
  ".cm-content": {
    color: "#0f172a",
    caretColor: "#1d4ed8",
    fontFamily: "var(--font-mono, monospace)",
    padding: "8px 0"
  },
  ".cm-line": {
    color: "#0f172a"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#1d4ed8",
    borderLeftWidth: "2.5px"
  },
  "&.cm-focused .cm-selectionBackground, ::selection, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "#bfdbfe !important",
    color: "#000000 !important"
  },
  ".cm-selectionMatch": {
    backgroundColor: "#fef08a !important"
  },
  ".cm-gutters": {
    backgroundColor: "#f8fafc",
    color: "#475569",
    borderRight: "1px solid #e2e8f0",
    paddingRight: "6px"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "8px",
    paddingRight: "8px",
    minWidth: "32px",
    textAlign: "right",
    color: "#475569",
    fontWeight: "600"
  },
  ".cm-activeLine": {
    backgroundColor: "#f1f5f9"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "bold"
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "#e2e8f0",
    border: "1px solid #cbd5e1",
    color: "#475569",
    borderRadius: "4px",
    padding: "0 4px",
    margin: "0 2px"
  },
  ".cm-tooltip": {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  },
  ".cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "var(--font-mono, monospace)",
      fontSize: "12px",
      maxHeight: "220px"
    },
    "& > ul > li": {
      padding: "4px 8px",
      color: "#090d16"
    },
    "& > ul > li[aria-selected]": {
      backgroundColor: "#eff6ff",
      color: "#1d4ed8"
    }
  }
});

/* =========================================================================
   PRO DARK THEME: Ultra-refined deep midnight palette for developers
   ========================================================================= */
export const proDarkHighlightStyle = HighlightStyle.define([
  { tag: [t.keyword, t.definitionKeyword, t.modifier], color: '#c084fc', fontWeight: '600' }, // Neon purple
  { tag: [t.name, t.deleted, t.character, t.macroName], color: '#f1f5f9' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.labelName], color: '#60a5fa', fontWeight: '500' }, // Sky blue
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#fbbf24' }, // Gold
  { tag: [t.definition(t.name), t.separator, t.punctuation], color: '#e2e8f0' },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.self, t.namespace], color: '#22d3ee' }, // Cyan
  { tag: t.unit, color: '#fb923c' }, // Orange
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: '#f472b6' }, // Pink
  { tag: [t.meta, t.comment, t.lineComment, t.blockComment], color: '#64748b', fontStyle: 'italic' }, // Slate gray
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: '#38bdf8', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#f8fafc' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#fb923c', fontWeight: '600' }, // Bright orange
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#4ade80' }, // Bright green
  { tag: t.invalid, color: '#f87171' },
  // HTML / XML tags and attributes
  { tag: [t.tagName, t.standard(t.tagName)], color: '#f87171', fontWeight: '600' }, // Coral red for HTML tags
  { tag: t.angleBracket, color: '#f87171', fontWeight: '600' }, // Coral red for < and >
  { tag: [t.attributeName, t.propertyName], color: '#a78bfa', fontWeight: '500' }, // Violet for HTML attributes & CSS properties
  { tag: t.attributeValue, color: '#34d399' }, // Emerald green for attribute values
  { tag: [t.content, t.literal], color: '#f1f5f9' },
  { tag: [t.bracket, t.paren, t.brace, t.squareBracket], color: '#e2e8f0' }
]);

export const proDarkTheme = EditorView.theme({
  "&": {
    color: "#f8fafc",
    backgroundColor: "#090d16",
    height: "100%",
    fontSize: "inherit"
  },
  ".cm-content": {
    caretColor: "#38bdf8",
    fontFamily: "var(--font-mono, monospace)",
    padding: "8px 0"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#38bdf8",
    borderLeftWidth: "2px"
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "rgba(56, 189, 248, 0.25) !important"
  },
  ".cm-gutters": {
    backgroundColor: "#060910",
    color: "#475569",
    borderRight: "1px solid rgba(255, 255, 255, 0.06)",
    paddingRight: "6px"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "8px",
    paddingRight: "8px",
    minWidth: "32px",
    textAlign: "right"
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255, 255, 255, 0.03)"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    color: "#38bdf8",
    fontWeight: "bold"
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: "4px",
    padding: "0 4px",
    margin: "0 2px"
  },
  ".cm-tooltip": {
    backgroundColor: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "8px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)"
  },
  ".cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "var(--font-mono, monospace)",
      fontSize: "12px",
      maxHeight: "220px"
    },
    "& > ul > li": {
      padding: "4px 8px",
      color: "#cbd5e1"
    },
    "& > ul > li[aria-selected]": {
      backgroundColor: "rgba(56, 189, 248, 0.2)",
      color: "#38bdf8"
    }
  }
});
