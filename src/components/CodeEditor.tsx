import React, { useEffect, useRef, useState } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, indentWithTab, history, historyKeymap, undo, redo } from '@codemirror/commands';
import { searchKeymap, openSearchPanel, search } from '@codemirror/search';
import { bracketMatching, foldGutter, codeFolding, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { 
  closeBrackets, 
  closeBracketsKeymap, 
  autocompletion, 
  completionKeymap, 
  nextSnippetField, 
  prevSnippetField, 
  clearSnippet 
} from '@codemirror/autocomplete';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorLanguage, ThemeMode, EditorCursorInfo } from '../types';
import { proLightTheme, proLightHighlightStyle, proDarkTheme, proDarkHighlightStyle } from '../utils/editorThemes';
import { htmlCompletions, cssCompletions, jsCompletions } from '../utils/editorCompletions';
import { formatCode } from '../utils/formatUtils';
import { 
  Copy, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Search, 
  Check, 
  Maximize2, 
  Minimize2,
  AlertCircle,
  Sparkles,
  Wand2,
  Plus
} from 'lucide-react';

interface CodeEditorProps {
  language: EditorLanguage;
  value: string;
  onChange: (val: string) => void;
  title: string;
  badgeColor?: string;
  theme: ThemeMode;
  fontSize: number;
  wordWrap: boolean;
  suggestions: boolean;
  onCursorChange?: (info: EditorCursorInfo) => void;
  onCopySuccess?: (msg: string) => void;
  onFormatSuccess?: (msg: string) => void;
  onInsertSnippet?: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onClearRequest?: () => void;
  dialect?: 'css' | 'scss' | 'javascript' | 'typescript';
  onDialectChange?: (dialect: any) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  title,
  badgeColor = '#3b82f6',
  theme,
  fontSize,
  wordWrap,
  suggestions,
  onCursorChange,
  onCopySuccess,
  onFormatSuccess,
  onInsertSnippet,
  isMaximized = false,
  onToggleMaximize,
  onClearRequest,
  dialect,
  onDialectChange
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const [copied, setCopied] = useState(false);
  const [formattedFeedback, setFormattedFeedback] = useState(false);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Compartments for dynamic reconfig
  const themeCompartment = useRef(new Compartment());
  const highlightCompartment = useRef(new Compartment());
  const wrapCompartment = useRef(new Compartment());
  const fontSizeCompartment = useRef(new Compartment());
  const completionCompartment = useRef(new Compartment());

  const handleFormat = () => {
    const formatted = formatCode(value, language);
    if (formatted && formatted !== value) {
      onChange(formatted);
      const view = editorViewRef.current;
      if (view) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: formatted }
        });
      }
    }
    setFormattedFeedback(true);
    setTimeout(() => setFormattedFeedback(false), 1200);
    if (onFormatSuccess) {
      onFormatSuccess(`Formatted ${title} code ✨`);
    }
  };

  // Basic syntax validation (debounced for smooth typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!value) {
        setValidationWarning(null);
        return;
      }

      if (language === 'javascript') {
        try {
          new Function(value);
          setValidationWarning(null);
        } catch (err: any) {
          setValidationWarning(err.message || 'Syntax error in JavaScript');
        }
      } else if (language === 'html') {
        const openDivs = (value.match(/<div/gi) || []).length;
        const closeDivs = (value.match(/<\/div>/gi) || []).length;
        if (openDivs !== closeDivs) {
          setValidationWarning(`Unmatched <div> tags (${openDivs} open, ${closeDivs} closed)`);
        } else {
          setValidationWarning(null);
        }
      } else if (language === 'css') {
        const openBraces = (value.match(/{/g) || []).length;
        const closeBraces = (value.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
          setValidationWarning(`Unmatched braces in CSS (${openBraces} open, ${closeBraces} closed)`);
        } else {
          setValidationWarning(null);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value, language]);

  // Autocomplete provider selector
  const getCompletionExtension = (enabled: boolean) => {
    if (!enabled) return [];

    let overrideFn = htmlCompletions;
    if (language === 'css') overrideFn = cssCompletions;
    if (language === 'javascript') overrideFn = jsCompletions;

    return [
      autocompletion({
        override: [overrideFn],
        activateOnTyping: true,
        closeOnBlur: true,
        maxRenderedOptions: 30
      })
    ];
  };

  // Initialize CodeMirror instance
  useEffect(() => {
    if (!containerRef.current) return;

    let langExtension = html({ autoCloseTags: true });
    if (language === 'css') {
      langExtension = css() as any;
    } else if (language === 'javascript') {
      langExtension = javascript() as any;
    }

    const currentTheme = theme === 'dark' ? proDarkTheme : proLightTheme;
    const currentHighlight = theme === 'dark' 
      ? syntaxHighlighting(proDarkHighlightStyle) 
      : syntaxHighlighting(proLightHighlightStyle);

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        foldGutter(),
        codeFolding(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        search({ top: true }),
        keymap.of([
          {
            key: 'Shift-Alt-f',
            run: () => {
              handleFormat();
              return true;
            }
          },
          { key: 'Tab', run: nextSnippetField, shift: prevSnippetField },
          { key: 'Escape', run: clearSnippet },
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          ...completionKeymap,
          indentWithTab
        ]),
        langExtension,
        themeCompartment.current.of(currentTheme),
        highlightCompartment.current.of(currentHighlight),
        wrapCompartment.current.of(wordWrap ? EditorView.lineWrapping : []),
        completionCompartment.current.of(getCompletionExtension(suggestions)),
        fontSizeCompartment.current.of(
          EditorView.theme({
            "&": { fontSize: `${fontSize}px` }
          })
        ),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const nextValue = update.state.doc.toString();
            onChange(nextValue);
          }
          if (update.selectionSet || update.docChanged) {
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            if (onCursorChange) {
              onCursorChange({
                line: line.number,
                col: pos - line.from + 1,
                linesTotal: update.state.doc.lines,
                charsTotal: update.state.doc.length
              });
            }
          }
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [language]);

  // Synchronize external value updates without losing cursor selection
  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (value !== currentDoc) {
      const currentSelection = view.state.selection;
      const targetPos = Math.min(currentSelection.main.head, value.length);
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
        selection: { anchor: targetPos, head: targetPos }
      });
    }
  }, [value]);

  // Dynamic theme & syntax highlighting update
  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;
    const currentTheme = theme === 'dark' ? proDarkTheme : proLightTheme;
    const currentHighlight = theme === 'dark' 
      ? syntaxHighlighting(proDarkHighlightStyle) 
      : syntaxHighlighting(proLightHighlightStyle);

    view.dispatch({
      effects: [
        themeCompartment.current.reconfigure(currentTheme),
        highlightCompartment.current.reconfigure(currentHighlight)
      ]
    });
  }, [theme]);

  // Dynamic suggestions / autocomplete update
  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;
    view.dispatch({
      effects: completionCompartment.current.reconfigure(getCompletionExtension(suggestions))
    });
  }, [suggestions, language]);

  // Dynamic word wrap update
  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;
    view.dispatch({
      effects: wrapCompartment.current.reconfigure(wordWrap ? EditorView.lineWrapping : [])
    });
  }, [wordWrap]);

  // Dynamic font size update
  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;
    view.dispatch({
      effects: fontSizeCompartment.current.reconfigure(
        EditorView.theme({
          "&": { fontSize: `${fontSize}px` }
        })
      )
    });
  }, [fontSize]);

  // Handlers for Undo, Redo, Copy, Search, Clear
  const handleUndo = () => {
    if (editorViewRef.current) {
      undo(editorViewRef.current);
      editorViewRef.current.focus();
    }
  };

  const handleRedo = () => {
    if (editorViewRef.current) {
      redo(editorViewRef.current);
      editorViewRef.current.focus();
    }
  };

  const handleSearch = () => {
    if (editorViewRef.current) {
      openSearchPanel(editorViewRef.current);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (onCopySuccess) {
        onCopySuccess(`${title} copied to clipboard!`);
      }
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleClear = () => {
    if (onClearRequest) {
      onClearRequest();
    } else {
      onChange('');
    }
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden rounded-xl border transition-all duration-200 ${
      theme === 'dark' 
        ? 'bg-[#090d16] border-neutral-800 shadow-lg shadow-black/20' 
        : 'bg-white border-neutral-200/80 shadow-md shadow-neutral-200/40'
    }`}>
      {/* Editor Header Bar */}
      <div className={`flex items-center justify-between px-3.5 py-2 border-b select-none ${
        theme === 'dark' 
          ? 'bg-[#0d1117] border-neutral-800/80' 
          : 'bg-neutral-100/95 border-neutral-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <div 
            className="w-2.5 h-2.5 rounded-full shadow-xs" 
            style={{ backgroundColor: badgeColor }} 
            aria-hidden="true"
          />
          <span className={`text-xs font-extrabold tracking-wider uppercase ${
            theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'
          }`}>
            {title}
          </span>

          {language === 'css' && onDialectChange && (
            <div className={`flex items-center p-0.5 rounded-md border text-[10px] font-semibold ${
              theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-200/70 border-neutral-300'
            }`}>
              <button
                type="button"
                onClick={() => onDialectChange('css')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  dialect !== 'scss' ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                CSS
              </button>
              <button
                type="button"
                onClick={() => onDialectChange('scss')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  dialect === 'scss' ? 'bg-pink-600 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                SCSS
              </button>
            </div>
          )}

          {language === 'javascript' && onDialectChange && (
            <div className={`flex items-center p-0.5 rounded-md border text-[10px] font-semibold ${
              theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-200/70 border-neutral-300'
            }`}>
              <button
                type="button"
                onClick={() => onDialectChange('javascript')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  dialect !== 'typescript' ? 'bg-yellow-500 text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                JS
              </button>
              <button
                type="button"
                onClick={() => onDialectChange('typescript')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  dialect === 'typescript' ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                TS
              </button>
            </div>
          )}
          {suggestions && (
            <span 
              title="IntelliSense typing suggestions enabled" 
              className="hidden lg:flex items-center gap-1 text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-1.5 py-0.2 rounded-full"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Auto-Suggest</span>
            </span>
          )}
          {validationWarning && (
            <div 
              className="flex items-center gap-1 text-[11px] text-amber-500 font-medium cursor-help"
              title={validationWarning}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="hidden xl:inline truncate max-w-[140px]">{validationWarning}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark' 
                ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' 
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark' 
                ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' 
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          {onInsertSnippet && (
            <button
              onClick={onInsertSnippet}
              title={`Insert Link, Button or Snippet into ${title}`}
              aria-label="Insert Snippet"
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'text-neutral-400 hover:text-blue-400 hover:bg-neutral-800' 
                  : 'text-neutral-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleFormat}
            title={`Format ${title} Code (Shift+Alt+F)`}
            aria-label={`Format ${title} Code`}
            className={`p-1.5 rounded-md transition-colors ${
              formattedFeedback
                ? 'text-emerald-500 bg-emerald-500/10'
                : theme === 'dark' 
                  ? 'text-neutral-400 hover:text-purple-400 hover:bg-neutral-800' 
                  : 'text-neutral-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            {formattedFeedback ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Wand2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleSearch}
            title="Search & Replace (Ctrl+F)"
            aria-label="Find & Replace"
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark' 
                ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' 
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopy}
            title="Copy Code"
            aria-label="Copy Code"
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark' 
                ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' 
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            title={`Clear ${title}`}
            aria-label={`Clear ${title}`}
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark' 
                ? 'text-neutral-400 hover:text-red-400 hover:bg-neutral-800' 
                : 'text-neutral-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onToggleMaximize && (
            <button
              onClick={onToggleMaximize}
              title={isMaximized ? "Restore size" : "Maximize editor"}
              aria-label="Toggle Fullscreen"
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
              }`}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div 
        ref={containerRef} 
        className="flex-1 w-full overflow-hidden text-sm relative"
      />
    </div>
  );
};
