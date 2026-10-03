import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  EditorLanguage, 
  DeviceMode, 
  ThemeMode, 
  ConsoleMessage, 
  Project, 
  StarterTemplate, 
  ToastMessage, 
  EditorCursorInfo,
  ExternalLibrary,
  InspectedElement,
  DomTreeNode
} from './types';
import { STARTER_TEMPLATES } from './data/templates';
import { POPULAR_LIBRARIES } from './data/libraries';
import { formatCode } from './utils/formatUtils';
import { auditCode, autoFixCode } from './utils/codeAuditor';
import { 
  downloadProjectZip, 
  downloadFile, 
  parseImportedFile, 
  loadStoredSettings, 
  saveStoredSettings, 
  loadSavedProjects, 
  saveProjectsList, 
  loadCurrentProject, 
  saveCurrentProjectToStorage, 
  encodeProjectToShareUrl, 
  decodeProjectFromUrl,
  generateStandAloneHtml
} from './utils/fileUtils';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { ConsolePanel } from './components/ConsolePanel';
import { ElementsInspector } from './components/ElementsInspector';
import { CssStudioModal } from './components/CssStudioModal';
import { MobileQrModal } from './components/MobileQrModal';
import { CodeHealthModal } from './components/CodeHealthModal';
import { ProjectsModal } from './components/ProjectsModal';
import { SuiModal } from './components/SuiModal';
import { HelpModal } from './components/HelpModal';
import { AboutModal } from './components/AboutModal';
import { ShareModal } from './components/ShareModal';
import { LibrariesModal } from './components/LibrariesModal';
import { AssetInsertModal } from './components/AssetInsertModal';
import { CommandPaletteModal, CommandItem } from './components/CommandPaletteModal';
import { Toast } from './components/Toast';
import { StatusBar } from './components/StatusBar';
import { KeyframeStudioModal } from './components/KeyframeStudioModal';
import { GlassMeshStudioModal } from './components/GlassMeshStudioModal';
import { PaletteContrastModal } from './components/PaletteContrastModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { CodeCardModal } from './components/CodeCardModal';
import { ResponsiveMatrixModal } from './components/ResponsiveMatrixModal';
import { transpileTypeScript, transpileScss } from './utils/languageTranspiler';
import { CssDialect, JsDialect, EditorLayoutMode, CodeCheckpoint } from './types';
import { SUI_CSS_CDN, SUI_JS_CDN } from './utils/fileUtils';
import { 
  Play, 
  RotateCw, 
  Download, 
  Upload, 
  Folder, 
  Sparkles, 
  Share2, 
  Sun, 
  Moon, 
  HelpCircle, 
  Info, 
  Maximize, 
  Minimize, 
  Trash2, 
  Layers, 
  FileCode, 
  ChevronDown, 
  RotateCcw,
  Zap,
  Columns,
  Rows,
  Sliders,
  Settings,
  Menu,
  Check,
  Command,
  Wand2,
  WrapText,
  ZoomIn,
  ZoomOut,
  Plus,
  Crosshair,
  QrCode,
  ShieldCheck,
  Box,
  Terminal,
  X,
  History,
  Palette,
  Monitor,
  LayoutGrid,
  Image as ImageIcon
} from 'lucide-react';

export default function App() {
  // Settings & Theme
  const [settings, setSettings] = useState(() => loadStoredSettings());
  const [theme, setTheme] = useState<ThemeMode>(settings.theme);

  // Active Project State
  const [currentProject, setCurrentProject] = useState<Project>(() => {
    const shared = decodeProjectFromUrl();
    if (shared && (shared.html || shared.css || shared.js)) {
      return {
        id: 'shared-' + Date.now(),
        name: shared.name || 'Shared Project',
        html: shared.html || '',
        css: shared.css || '',
        js: shared.js || '',
        includeSui: shared.includeSui !== false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    }

    const saved = loadCurrentProject();
    if (saved) return saved;

    const defaultTmpl = STARTER_TEMPLATES[0];
    return {
      id: 'default-project',
      name: 'Hello SUI.css Demo',
      html: defaultTmpl.html,
      css: defaultTmpl.css,
      js: defaultTmpl.js,
      includeSui: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  });

  // Editor states (instant edits)
  const [htmlCode, setHtmlCode] = useState(currentProject.html);
  const [cssCode, setCssCode] = useState(currentProject.css);
  const [jsCode, setJsCode] = useState(currentProject.js);

  // Preview compiled code states
  const [previewHtml, setPreviewHtml] = useState(currentProject.html);
  const [previewCss, setPreviewCss] = useState(currentProject.css);
  const [previewJs, setPreviewJs] = useState(currentProject.js);

  // Auto Save status
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Saved Projects List
  const [savedProjects, setSavedProjects] = useState<Project[]>(() => loadSavedProjects());

  // Mobile navigation tabs
  const [mobileTab, setMobileTab] = useState<'html' | 'css' | 'js' | 'preview'>('preview');

  // Preview Device mode
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  // Console state
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [preserveLog, setPreserveLog] = useState(false);
  const [executionCount, setExecutionCount] = useState(0);
  const seenMsgIdsRef = useRef<Set<string>>(new Set());
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Responsive device view check to avoid duplicate mounted iframes
  const [isMobileView, setIsMobileView] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cursor & Status bar stats
  const [activeLang, setActiveLang] = useState<EditorLanguage>('html');
  const [cursorInfo, setCursorInfo] = useState<EditorCursorInfo>({
    line: 1,
    col: 1,
    linesTotal: 1,
    charsTotal: 0
  });

  // Maximized editor panel ('html' | 'css' | 'js' | null)
  const [maximizedPanel, setMaximizedPanel] = useState<EditorLanguage | null>(null);

  // Fullscreen states
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

  // Panels Resizing dimensions (%)
  const [splitRatio, setSplitRatio] = useState(50); // Height of editor vs preview
  const [editorCols, setEditorCols] = useState({ html: 33.33, css: 33.33, js: 33.34 });

  // Dropdown Menus
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | 'view' | 'studios' | null>(null);

  // Modals & Tools
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isSuiModalOpen, setIsSuiModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLibrariesModalOpen, setIsLibrariesModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isCssStudioOpen, setIsCssStudioOpen] = useState(false);
  const [isMobileQrOpen, setIsMobileQrOpen] = useState(false);
  const [isCodeHealthOpen, setIsCodeHealthOpen] = useState(false);

  // Upgraded Feature States
  const [editorLayoutMode, setEditorLayoutMode] = useState<EditorLayoutMode>('split-pen');
  const [isZenMode, setIsZenMode] = useState(false);
  const [cssDialect, setCssDialect] = useState<CssDialect>('css');
  const [jsDialect, setJsDialect] = useState<JsDialect>('javascript');
  const [isKeyframeStudioOpen, setIsKeyframeStudioOpen] = useState(false);
  const [isGlassMeshStudioOpen, setIsGlassMeshStudioOpen] = useState(false);
  const [isPaletteContrastOpen, setIsPaletteContrastOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isCodeCardOpen, setIsCodeCardOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // Inspector & Bottom Dock State
  const [isInspectActive, setIsInspectActive] = useState(false);
  const [inspectedElement, setInspectedElement] = useState<InspectedElement | null>(null);
  const [domTree, setDomTree] = useState<DomTreeNode | null>(null);
  const [bottomDockTab, setBottomDockTab] = useState<'console' | 'elements'>('console');
  const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Active External Libraries (CDN Packages)
  const [activeLibraries, setActiveLibraries] = useState<ExternalLibrary[]>(() => {
    return POPULAR_LIBRARIES.map(lib => ({
      ...lib,
      enabled: lib.id === 'sui' ? (currentProject.includeSui !== false) : false
    }));
  });

  const handleToggleLibrary = (lib: ExternalLibrary) => {
    setActiveLibraries(prev => prev.map(l => {
      if (l.id === lib.id) {
        return { ...l, enabled: !l.enabled };
      }
      return l;
    }));
    addToast(`${lib.name} ${!lib.enabled ? 'Enabled' : 'Disabled'}`, `Live preview and exports updated`, 'info');
  };

  const handleAddCustomLibrary = (lib: ExternalLibrary) => {
    setActiveLibraries(prev => [lib, ...prev]);
    addToast(`Added ${lib.name}`, `Custom CDN link added to project`);
  };

  const handleRemoveCustomLibrary = (id: string) => {
    setActiveLibraries(prev => prev.filter(l => l.id !== id));
    addToast('Removed Custom Library');
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Hidden file input for import
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const appContainerRef = useRef<HTMLDivElement | null>(null);

  // Debounce timer for Auto Run
  const autoRunTimerRef = useRef<any>(null);

  const addToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-menu-container]')) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      document.body.className = 'bg-[#060910] text-neutral-100 font-sans antialiased overflow-hidden select-none dark-theme';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      document.body.className = 'bg-[#f4f6fa] text-neutral-900 font-sans antialiased overflow-hidden select-none light-theme';
    }
    const nextSettings = { ...settings, theme };
    setSettings(nextSettings);
    saveStoredSettings(nextSettings);
  }, [theme]);

  // Helper to compile dialects (SCSS, TypeScript)
  const getCompiledCode = useCallback(() => {
    let finalCss = cssCode;
    if (cssDialect === 'scss') {
      const res = transpileScss(cssCode);
      finalCss = res.code;
    }

    let finalJs = jsCode;
    if (jsDialect === 'typescript') {
      const res = transpileTypeScript(jsCode);
      finalJs = res.code;
    }

    return { html: htmlCode, css: finalCss, js: finalJs };
  }, [htmlCode, cssCode, jsCode, cssDialect, jsDialect]);

  // Handle Run preview
  const executeCode = useCallback(() => {
    if (!preserveLog) {
      setConsoleMessages([]);
      seenMsgIdsRef.current.clear();
    }
    const compiled = getCompiledCode();
    setPreviewHtml(compiled.html);
    setPreviewCss(compiled.css);
    setPreviewJs(compiled.js);
    setExecutionCount(prev => prev + 1); // Forces fresh iframe execution and console output
    addToast('Code executed', 'Preview refreshed with latest changes', 'info');
  }, [getCompiledCode, preserveLog, addToast]);

  // Format all code blocks (HTML, CSS, JS)
  const handleFormatAll = useCallback(() => {
    const nextHtml = formatCode(htmlCode, 'html');
    const nextCss = formatCode(cssCode, 'css');
    const nextJs = formatCode(jsCode, 'javascript');
    setHtmlCode(nextHtml);
    setCssCode(nextCss);
    setJsCode(nextJs);
    addToast('Code Formatted ✨', 'Cleaned up HTML, CSS, and JavaScript formatting');
  }, [htmlCode, cssCode, jsCode, addToast]);

  // Intelligent Link, Script, Button, Tag snippet insertion
  const handleInsertSnippet = useCallback((code: string, name: string) => {
    setHtmlCode(prev => {
      // If code contains <head>, insert before </head> for stylesheets, scripts, metas
      if (
        (code.startsWith('<link') || code.startsWith('<script') || code.startsWith('<meta')) &&
        prev.includes('</head>')
      ) {
        return prev.replace('</head>', `  ${code}\n</head>`);
      }
      // If code contains <body>, insert before </body> for buttons, anchors, forms, media
      if (
        !code.startsWith('<link') &&
        !code.startsWith('<meta') &&
        prev.includes('</body>')
      ) {
        return prev.replace('</body>', `  ${code}\n</body>`);
      }
      // Fallback: append cleanly
      return prev ? `${prev}\n\n${code}` : code;
    });

    addToast('Inserted into HTML ✨', `Added "${name}" to your code`, 'success');
  }, [addToast]);

  // Auto Run effect: debounced compilation when code or dialect changes
  useEffect(() => {
    if (!settings.autoRun) return;

    if (autoRunTimerRef.current) {
      clearTimeout(autoRunTimerRef.current);
    }

    autoRunTimerRef.current = setTimeout(() => {
      const compiled = getCompiledCode();
      setPreviewHtml(prev => (prev !== compiled.html ? compiled.html : prev));
      setPreviewCss(prev => (prev !== compiled.css ? compiled.css : prev));
      setPreviewJs(prev => (prev !== compiled.js ? compiled.js : prev));

      // Persist code changes without triggering re-render dependency loop
      setCurrentProject(prev => {
        if (prev.html === htmlCode && prev.css === cssCode && prev.js === jsCode) {
          return prev;
        }
        const updated: Project = {
          ...prev,
          html: htmlCode,
          css: cssCode,
          js: jsCode,
          updatedAt: Date.now()
        };
        saveCurrentProjectToStorage(updated);
        return updated;
      });

      setAutoSaveStatus('saved');
    }, Math.max(400, settings.autoRunDelay || 600));

    return () => {
      if (autoRunTimerRef.current) {
        clearTimeout(autoRunTimerRef.current);
      }
    };
  }, [getCompiledCode, htmlCode, cssCode, jsCode, settings.autoRun, settings.autoRunDelay]);

  // Auto Save when autoRun is off
  useEffect(() => {
    if (settings.autoRun) return;

    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      setCurrentProject(prev => {
        if (prev.html === htmlCode && prev.css === cssCode && prev.js === jsCode) {
          return prev;
        }
        const updated: Project = {
          ...prev,
          html: htmlCode,
          css: cssCode,
          js: jsCode,
          updatedAt: Date.now()
        };
        saveCurrentProjectToStorage(updated);
        return updated;
      });
      setAutoSaveStatus('saved');
    }, 1000);

    return () => clearTimeout(timer);
  }, [htmlCode, cssCode, jsCode, settings.autoRun]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isMod = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === 'Escape') {
        setIsZenMode(false);
      } else if (e.key === 'F11') {
        e.preventDefault();
        setIsZenMode(prev => !prev);
      } else if (isMod && (e.key === '`' || e.key === '~' || e.key === '\\')) {
        e.preventDefault();
        setIsConsoleOpen(prev => !prev);
        setBottomDockTab('console');
      } else if (isMod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (isMod && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (isMod && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        setIsAssetModalOpen(prev => !prev);
      } else if (e.shiftKey && e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        handleFormatAll();
      } else if (isMod && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
      } else if (isMod && e.key === 's') {
        e.preventDefault();
        const updated: Project = {
          ...currentProject,
          html: htmlCode,
          css: cssCode,
          js: jsCode,
          updatedAt: Date.now()
        };
        setCurrentProject(updated);
        saveCurrentProjectToStorage(updated);
        const exists = savedProjects.some(p => p.id === updated.id);
        const nextList = exists
          ? savedProjects.map(p => (p.id === updated.id ? updated : p))
          : [updated, ...savedProjects];
        setSavedProjects(nextList);
        saveProjectsList(nextList);
        setAutoSaveStatus('saved');
        addToast('Project saved', `"${updated.name}" saved successfully`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeCode, currentProject, htmlCode, cssCode, jsCode, savedProjects, addToast]);

  // Toggle Theme
  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    addToast('Theme changed', `Switched to ${next} mode`, 'info');
  };

  // Toggle Auto Run
  const handleToggleAutoRun = () => {
    const nextVal = !settings.autoRun;
    const nextSettings = { ...settings, autoRun: nextVal };
    setSettings(nextSettings);
    saveStoredSettings(nextSettings);
    addToast('Auto Run updated', `Auto Run is now ${nextVal ? 'ON' : 'OFF'}`, 'info');
  };

  // Toggle Suggestions
  const handleToggleSuggestions = () => {
    const nextVal = !settings.suggestions;
    const nextSettings = { ...settings, suggestions: nextVal };
    setSettings(nextSettings);
    saveStoredSettings(nextSettings);
    addToast('Typing Suggestions', `Code suggestions ${nextVal ? 'enabled' : 'disabled'}`, 'info');
  };

  // Change font size
  const handleChangeFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(22, settings.fontSize + delta * 2));
    const nextSettings = { ...settings, fontSize: newSize };
    setSettings(nextSettings);
    saveStoredSettings(nextSettings);
  };

  // Toggle Word Wrap
  const handleToggleWordWrap = () => {
    const nextVal = !settings.wordWrap;
    const nextSettings = { ...settings, wordWrap: nextVal };
    setSettings(nextSettings);
    saveStoredSettings(nextSettings);
    addToast('Word Wrap', `Word Wrap ${nextVal ? 'enabled' : 'disabled'}`, 'info');
  };

  // Toggle Layout
  const handleToggleLayout = () => {
    const nextLayout: 'split-horizontal' | 'split-vertical' = 
      settings.layout === 'split-horizontal' ? 'split-vertical' : 'split-horizontal';
    const nextSettings = { ...settings, layout: nextLayout };
    setSettings(nextSettings);
    saveStoredSettings(nextSettings);
  };

  // Reset Layout to default
  const handleResetLayout = () => {
    setSplitRatio(50);
    setEditorCols({ html: 33.33, css: 33.33, js: 33.34 });
    setMaximizedPanel(null);
    addToast('Layout reset', 'Restored default split proportions', 'info');
  };

  // App Fullscreen
  const handleToggleAppFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsAppFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsAppFullscreen(false);
    }
  };

  // Clear specific editor
  const handleClearEditor = (type: 'html' | 'css' | 'js') => {
    if (type === 'html') setHtmlCode('');
    if (type === 'css') setCssCode('');
    if (type === 'js') setJsCode('');
    addToast(`Cleared ${type.toUpperCase()}`, '', 'info');
  };

  // Clear All confirmation
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all code (HTML, CSS, and JS)?')) {
      setHtmlCode('');
      setCssCode('');
      setJsCode('');
      setPreviewHtml('');
      setPreviewCss('');
      setPreviewJs('');
      addToast('All editors cleared', 'Started fresh canvas', 'info');
    }
  };

  // Reset Project to Starter Template
  const handleResetProject = () => {
    if (window.confirm('Reset this project? Your current code will be replaced with the default template.')) {
      const defaultTmpl = STARTER_TEMPLATES[0];
      setHtmlCode(defaultTmpl.html);
      setCssCode(defaultTmpl.css);
      setJsCode(defaultTmpl.js);
      setPreviewHtml(defaultTmpl.html);
      setPreviewCss(defaultTmpl.css);
      setPreviewJs(defaultTmpl.js);
      addToast('Project reset', 'Restored default template', 'info');
    }
  };

  // Load Template
  const handleLoadTemplate = (tmpl: StarterTemplate) => {
    setHtmlCode(tmpl.html);
    setCssCode(tmpl.css);
    setJsCode(tmpl.js);
    setPreviewHtml(tmpl.html);
    setPreviewCss(tmpl.css);
    setPreviewJs(tmpl.js);
    setCurrentProject({
      id: 'tmpl-' + tmpl.id + '-' + Date.now(),
      name: tmpl.name,
      html: tmpl.html,
      css: tmpl.css,
      js: tmpl.js,
      includeSui: tmpl.includeSui !== false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    addToast('Template loaded', `"${tmpl.name}" is now loaded in editor`);
  };

  // Save Current Project to List
  const handleSaveCurrentProject = (name: string) => {
    const updated: Project = {
      ...currentProject,
      name,
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      updatedAt: Date.now()
    };
    setCurrentProject(updated);
    saveCurrentProjectToStorage(updated);

    const exists = savedProjects.some(p => p.id === updated.id);
    const nextList = exists
      ? savedProjects.map(p => (p.id === updated.id ? updated : p))
      : [updated, ...savedProjects];
    setSavedProjects(nextList);
    saveProjectsList(nextList);
    addToast('Project saved', `"${name}" saved to local projects`);
  };

  // Load Saved Project
  const handleLoadProject = (project: Project) => {
    setCurrentProject(project);
    setHtmlCode(project.html);
    setCssCode(project.css);
    setJsCode(project.js);
    setPreviewHtml(project.html);
    setPreviewCss(project.css);
    setPreviewJs(project.js);
    saveCurrentProjectToStorage(project);
    addToast('Project loaded', `"${project.name}" opened in editor`);
  };

  // Delete Saved Project
  const handleDeleteProject = (id: string) => {
    const nextList = savedProjects.filter(p => p.id !== id);
    setSavedProjects(nextList);
    saveProjectsList(nextList);
    addToast('Project deleted', '', 'info');
  };

  // Rename Saved Project
  const handleRenameProject = (id: string, newName: string) => {
    const nextList = savedProjects.map(p => (p.id === id ? { ...p, name: newName } : p));
    setSavedProjects(nextList);
    saveProjectsList(nextList);
    if (currentProject.id === id) {
      setCurrentProject(prev => ({ ...prev, name: newName }));
    }
    addToast('Project renamed', `Project renamed to "${newName}"`);
  };

  // Handle File Import
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const parsed = await parseImportedFile(file);

      if (parsed.html !== undefined) setHtmlCode(parsed.html);
      if (parsed.css !== undefined) setCssCode(parsed.css);
      if (parsed.js !== undefined) setJsCode(parsed.js);

      if (parsed.name) {
        setCurrentProject(prev => ({
          ...prev,
          name: parsed.name!,
          html: parsed.html ?? prev.html,
          css: parsed.css ?? prev.css,
          js: parsed.js ?? prev.js
        }));
      }

      setPreviewHtml(parsed.html ?? htmlCode);
      setPreviewCss(parsed.css ?? cssCode);
      setPreviewJs(parsed.js ?? jsCode);

      addToast('Project imported', `Successfully imported ${file.name}`);
    } catch (err: any) {
      console.error(err);
      addToast('Import error', err.message || 'Failed to read file', 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Insert Snippet from SUI.css modal
  const handleInsertSuiSnippet = (snippet: string) => {
    setHtmlCode(prev => prev + '\n\n' + snippet);
    addToast('Snippet inserted', 'Added SUI.css component to HTML editor');
  };

  // Console message handler from Preview
  const handleConsoleMessage = useCallback((msg: Omit<ConsoleMessage, 'id' | 'timestamp'> & { msgId?: string; rawData?: any }) => {
    // Precise msgId deduplication for dual-channel (direct hook + postMessage)
    if (msg.msgId) {
      if (seenMsgIdsRef.current.has(msg.msgId)) {
        return;
      }
      seenMsgIdsRef.current.add(msg.msgId);
      if (seenMsgIdsRef.current.size > 1000) {
        const arr = Array.from(seenMsgIdsRef.current);
        seenMsgIdsRef.current = new Set(arr.slice(-500));
      }
    }

    const newMsg: ConsoleMessage = {
      type: msg.type,
      content: msg.content,
      resultType: msg.resultType,
      tableData: msg.tableData,
      rawData: msg.rawData,
      msgId: msg.msgId,
      id: msg.msgId || (Date.now().toString() + Math.random().toString(36).substring(2, 6)),
      timestamp: new Date().toLocaleTimeString([], { hour12: false })
    };
    setConsoleMessages(prev => [...prev.slice(-250), newMsg]);

    // Automatically open console when an error occurs so the developer immediately sees it
    if (msg.type === 'error') {
      setIsConsoleOpen(true);
      setBottomDockTab('console');
    }
  }, []);

  const handleClearConsole = useCallback(() => {
    setConsoleMessages([]);
    seenMsgIdsRef.current.clear();
    addToast('Console cleared', '', 'info');
  }, [addToast]);

  // Element Inspector Event Handlers
  const handleElementInspected = useCallback((el: InspectedElement, tree: DomTreeNode) => {
    setInspectedElement(el);
    if (tree) setDomTree(tree);
    setBottomDockTab('elements');
    setIsConsoleOpen(true);
  }, []);

  // Synchronous direct bridge for Preview iframe console messages
  useEffect(() => {
    (window as any).__CODEPULSE_CONSOLE_HOOK__ = (msg: any) => {
      if (msg && msg.source === 'codepulse-preview') {
        if (msg.type === 'clear') {
          handleClearConsole();
        } else if (msg.type === 'ELEMENT_INSPECTED') {
          if (msg.element) handleElementInspected(msg.element, msg.domTree);
        } else {
          handleConsoleMessage({
            msgId: msg.msgId,
            type: msg.type,
            content: msg.content,
            resultType: msg.resultType,
            tableData: msg.tableData,
            rawData: msg.rawData
          });
        }
      }
    };
    return () => {
      delete (window as any).__CODEPULSE_CONSOLE_HOOK__;
    };
  }, [handleClearConsole, handleConsoleMessage, handleElementInspected]);

  // Interactive DevTools Console REPL command execution
  const handleExecuteConsoleCommand = useCallback((code: string) => {
    if (!code.trim()) return;
    const inputMsg: ConsoleMessage = {
      id: 'in-' + Date.now() + Math.random().toString(36).substring(2, 5),
      type: 'input',
      content: [code],
      timestamp: new Date().toLocaleTimeString([], { hour12: false })
    };
    setConsoleMessages(prev => [...prev.slice(-150), inputMsg]);

    const iframe = previewIframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'EVAL_JS', code }, '*');
    } else {
      handleConsoleMessage({
        type: 'error',
        content: ['❌ Preview runtime not ready. Click Run to initialize preview.']
      });
    }
  }, [handleConsoleMessage]);

  const handleToggleInspect = useCallback(() => {
    setIsInspectActive(prev => {
      const next = !prev;
      if (next) {
        setBottomDockTab('elements');
        setIsConsoleOpen(true);
        addToast('Element Inspector Active', 'Hover over any element in the live preview to inspect its DOM node and styles', 'info');
      }
      return next;
    });
  }, [addToast]);

  // Real-time Code Health & Accessibility Audit
  const auditReport = React.useMemo(() => {
    return auditCode(htmlCode, cssCode, jsCode);
  }, [htmlCode, cssCode, jsCode]);

  const handleApplyAutoFix = useCallback(() => {
    const result = autoFixCode(htmlCode, cssCode, jsCode);
    if (result.fixedCount > 0) {
      setHtmlCode(result.html);
      setCssCode(result.css);
      setJsCode(result.js);
      setPreviewHtml(result.html);
      setPreviewCss(result.css);
      setPreviewJs(result.js);
      addToast('Auto-Fix Applied', `Cleaned & resolved ${result.fixedCount} code standards issues`, 'success');
    } else {
      addToast('No Fixes Needed', 'Code already conforms cleanly to guidelines', 'info');
    }
    setIsCodeHealthOpen(false);
  }, [htmlCode, cssCode, jsCode, addToast]);

  // Draggable Split Divider Handlers
  const handleDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startRatio = splitRatio;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const containerHeight = appContainerRef.current?.clientHeight || window.innerHeight;
      const delta = ((moveEvent.clientY - startY) / containerHeight) * 100;
      const newRatio = Math.min(80, Math.max(20, startRatio + delta));
      setSplitRatio(newRatio);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleEditorDividerMouseDown = (firstKey: 'html' | 'css', secondKey: 'css' | 'js', e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const initialCols = { ...editorCols };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = appContainerRef.current?.clientWidth || window.innerWidth;
      const deltaPercent = ((moveEvent.clientX - startX) / containerWidth) * 100;

      const newFirst = Math.max(15, Math.min(70, initialCols[firstKey] + deltaPercent));
      const newSecond = Math.max(15, Math.min(70, initialCols[secondKey] - deltaPercent));

      setEditorCols(prev => ({
        ...prev,
        [firstKey]: newFirst,
        [secondKey]: newSecond
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Share URL Generator
  const shareUrl = encodeProjectToShareUrl({
    name: currentProject.name,
    html: htmlCode,
    css: cssCode,
    js: jsCode,
    includeSui: currentProject.includeSui
  });

  const totalLines = (htmlCode.split('\n').length) + (cssCode.split('\n').length) + (jsCode.split('\n').length);
  const totalChars = htmlCode.length + cssCode.length + jsCode.length;
  const consoleErrorCount = consoleMessages.filter(m => m.type === 'error').length;

  // Generate complete HTML bundle for Multi-Device Matrix
  const generateMatrixSrcDoc = useCallback(() => {
    const suiTags = currentProject.includeSui !== false
      ? `<link rel="stylesheet" href="${SUI_CSS_CDN}">\n  <script src="${SUI_JS_CDN}"></script>`
      : '';
    const libTags = activeLibraries
      .filter(l => l.enabled && l.id !== 'sui')
      .map(lib => {
        const parts = [];
        if (lib.cssUrl) parts.push(`<link rel="stylesheet" href="${lib.cssUrl}">`);
        if (lib.jsUrl) parts.push(`<script src="${lib.jsUrl}"></script>`);
        return parts.join('\n  ');
      })
      .filter(Boolean)
      .join('\n  ');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  ${suiTags}
  ${libTags}
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: ${theme === 'dark' ? '#090d16' : '#ffffff'};
      color: ${theme === 'dark' ? '#f1f5f9' : '#0f172a'};
      min-height: 100vh;
      line-height: 1.5;
    }
    ${previewCss}
  </style>
</head>
<body>
  ${previewHtml}
  <script>
    try {
      ${previewJs}
    } catch(err) {
      console.error(err);
    }
  </script>
</body>
</html>`;
  }, [currentProject.includeSui, activeLibraries, theme, previewCss, previewHtml, previewJs]);

  // Command Palette Items
  const commandItems: CommandItem[] = [
    {
      id: 'cmd-run',
      title: 'Run Code Preview',
      category: 'Editor',
      shortcut: 'Ctrl+Enter',
      icon: <Play className="w-4 h-4 text-emerald-500" />,
      action: executeCode
    },
    {
      id: 'cmd-format',
      title: 'Format All Code (Prettier)',
      category: 'Editor',
      shortcut: 'Shift+Alt+F',
      icon: <Wand2 className="w-4 h-4 text-purple-500" />,
      action: handleFormatAll
    },
    {
      id: 'cmd-split-pen',
      title: 'Toggle Split-Pane Editing (CodePen Style)',
      category: 'Layout',
      icon: <Columns className="w-4 h-4 text-blue-500" />,
      action: () => setEditorLayoutMode(prev => prev === 'split-pen' ? 'tabs' : 'split-pen')
    },
    {
      id: 'cmd-zen-mode',
      title: 'Toggle Zen / Presentation Mode',
      category: 'View',
      shortcut: 'F11',
      icon: <Monitor className="w-4 h-4 text-purple-500" />,
      action: () => setIsZenMode(prev => !prev)
    },
    {
      id: 'cmd-console',
      title: 'Toggle Developer Console',
      category: 'View',
      shortcut: 'Ctrl+`',
      icon: <Terminal className="w-4 h-4 text-blue-500" />,
      action: () => {
        setIsConsoleOpen(prev => !prev);
        setBottomDockTab('console');
      }
    },
    {
      id: 'cmd-keyframes',
      title: 'CSS Keyframe & Animation Timeline Studio',
      category: 'Studio',
      icon: <Sparkles className="w-4 h-4 text-blue-500" />,
      action: () => setIsKeyframeStudioOpen(true)
    },
    {
      id: 'cmd-glass-mesh',
      title: 'Mesh Gradient & Glassmorphism Studio',
      category: 'Studio',
      icon: <Layers className="w-4 h-4 text-purple-500" />,
      action: () => setIsGlassMeshStudioOpen(true)
    },
    {
      id: 'cmd-palette-contrast',
      title: 'Color Palette & WCAG AAA Contrast Checker',
      category: 'Studio',
      icon: <Palette className="w-4 h-4 text-emerald-500" />,
      action: () => setIsPaletteContrastOpen(true)
    },
    {
      id: 'cmd-version-history',
      title: 'Version History & Local Checkpoints',
      category: 'Project',
      icon: <History className="w-4 h-4 text-amber-500" />,
      action: () => setIsVersionHistoryOpen(true)
    },
    {
      id: 'cmd-code-card',
      title: 'Export Shareable Code Card (Ray.so / Carbon)',
      category: 'Export',
      icon: <ImageIcon className="w-4 h-4 text-indigo-500" />,
      action: () => setIsCodeCardOpen(true)
    },
    {
      id: 'cmd-matrix',
      title: 'Multi-Device Responsive Matrix (375px / 768px / 1200px)',
      category: 'View',
      icon: <LayoutGrid className="w-4 h-4 text-sky-500" />,
      action: () => setIsMatrixOpen(true)
    },
    {
      id: 'cmd-inspect',
      title: 'Inspect Element in Live Preview (DevTools)',
      category: 'Tools',
      icon: <Crosshair className="w-4 h-4 text-blue-500" />,
      action: handleToggleInspect
    },
    {
      id: 'cmd-css-studio',
      title: 'Open Visual CSS Studio (Gradients & Shadows)',
      category: 'Tools',
      icon: <Sliders className="w-4 h-4 text-purple-500" />,
      action: () => setIsCssStudioOpen(true)
    },
    {
      id: 'cmd-mobile-qr',
      title: 'Scan on Phone (Live Mobile QR Code)',
      category: 'Tools',
      icon: <QrCode className="w-4 h-4 text-sky-500" />,
      action: () => setIsMobileQrOpen(true)
    },
    {
      id: 'cmd-code-health',
      title: `Code Health & Accessibility Audit (${auditReport.score}%)`,
      category: 'Audit',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      action: () => setIsCodeHealthOpen(true)
    },
    {
      id: 'cmd-auto-fix',
      title: '1-Click Auto-Fix Accessibility & Code Issues',
      category: 'Audit',
      icon: <Wand2 className="w-4 h-4 text-emerald-500" />,
      action: handleApplyAutoFix
    },
    {
      id: 'cmd-insert-tag',
      title: 'Insert Required Links, Buttons & Tags...',
      category: 'Editor',
      icon: <Plus className="w-4 h-4 text-blue-500" />,
      action: () => setIsAssetModalOpen(true)
    },
    {
      id: 'cmd-libraries',
      title: 'Manage External Libraries & CDNs',
      category: 'Tools',
      icon: <Layers className="w-4 h-4 text-blue-500" />,
      action: () => setIsLibrariesModalOpen(true)
    },
    {
      id: 'cmd-projects',
      title: 'Open Projects & Templates',
      category: 'Project',
      shortcut: 'Ctrl+O',
      icon: <Folder className="w-4 h-4 text-amber-500" />,
      action: () => setIsProjectsModalOpen(true)
    },
    {
      id: 'cmd-save',
      title: 'Save Current Project',
      category: 'Project',
      shortcut: 'Ctrl+S',
      icon: <FileCode className="w-4 h-4 text-emerald-500" />,
      action: () => handleSaveCurrentProject(currentProject.name)
    },
    {
      id: 'cmd-export-zip',
      title: 'Export Full Project (ZIP)',
      category: 'Project',
      icon: <Download className="w-4 h-4 text-blue-500" />,
      action: () => {
        downloadProjectZip({
          name: currentProject.name,
          html: htmlCode,
          css: cssCode,
          js: jsCode,
          includeSui: currentProject.includeSui,
          externalLibraries: activeLibraries
        });
        addToast('Project exported', 'Downloaded standalone project.zip');
      }
    },
    {
      id: 'cmd-theme',
      title: `Switch Theme to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      category: 'Theme',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />,
      action: handleToggleTheme
    },
    {
      id: 'cmd-sui',
      title: 'SUI-FRAMEWORK.CSS Showcase & Docs',
      category: 'Tools',
      icon: <Sparkles className="w-4 h-4 text-blue-500" />,
      action: () => setIsSuiModalOpen(true)
    },
    {
      id: 'cmd-clear-console',
      title: 'Clear Developer Console',
      category: 'Tools',
      icon: <Trash2 className="w-4 h-4 text-red-500" />,
      action: handleClearConsole
    },
    {
      id: 'cmd-toggle-wrap',
      title: `Toggle Word Wrap (${settings.wordWrap ? 'On' : 'Off'})`,
      category: 'Editor',
      icon: <WrapText className="w-4 h-4 text-neutral-400" />,
      action: handleToggleWordWrap
    },
    {
      id: 'cmd-zoom-in',
      title: 'Increase Editor Font Size',
      category: 'View',
      icon: <ZoomIn className="w-4 h-4 text-neutral-400" />,
      action: () => handleChangeFontSize(1)
    },
    {
      id: 'cmd-zoom-out',
      title: 'Decrease Editor Font Size',
      category: 'View',
      icon: <ZoomOut className="w-4 h-4 text-neutral-400" />,
      action: () => handleChangeFontSize(-1)
    }
  ];

  return (
    <div 
      ref={appContainerRef}
      className={`h-screen w-screen flex flex-col overflow-hidden select-none ${
        theme === 'dark' ? 'bg-[#060910] text-neutral-100' : 'bg-[#f4f6fa] text-neutral-900'
      }`}
    >
      {/* Floating Zen Mode Toolbar */}
      {isZenMode && (
        <div className="fixed top-3 right-5 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900/90 text-white backdrop-blur-md border border-neutral-700/80 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 mr-1.5">
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span>Zen Mode</span>
          </div>
          <button
            onClick={executeCode}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
            title="Execute Code (Ctrl+Enter)"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run</span>
          </button>
          <button
            onClick={() => setEditorLayoutMode(prev => prev === 'split-pen' ? 'tabs' : 'split-pen')}
            className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Toggle Split / Tabs"
          >
            {editorLayoutMode === 'split-pen' ? <Rows className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
            <span>{editorLayoutMode === 'split-pen' ? 'Tabs' : 'Split'}</span>
          </button>
          <button
            onClick={handleToggleTheme}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
          </button>
          <div className="h-4 w-px bg-neutral-700 mx-0.5" />
          <button
            onClick={() => setIsZenMode(false)}
            className="px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Exit Zen / Presentation Mode (Esc or F11)"
          >
            <Minimize className="w-3 h-3" />
            <span>Exit Zen (Esc)</span>
          </button>
        </div>
      )}

      {/* ========================================================
          1. TOP APP BAR / BRAND HEADER & COMPACT MENU BARS
      ======================================================== */}
      {!isZenMode && (
        <header className={`h-12 sm:h-13 px-2 sm:px-4 border-b flex items-center justify-between z-30 shrink-0 backdrop-blur-md w-full max-w-full ${
          theme === 'dark' ? 'bg-[#090d16]/95 border-neutral-800' : 'bg-white/95 border-neutral-200/80 shadow-xs'
        }`}>
        {/* Left Zone: Brand, Studio Menus, Command Palette & Libraries */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0" data-menu-container>
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20">
              ⚡
            </div>
            <div className="hidden min-[480px]:flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-base tracking-tight">
                CodePulse
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest hidden md:inline">
                PRO
              </span>
            </div>
          </div>

          <div className="h-4 sm:h-5 w-px bg-neutral-200 dark:bg-neutral-800 mx-0.5 sm:mx-1 hidden sm:block" />

          {/* STUDIO MENU BARS (File | Edit | View) */}
          <nav className="flex items-center gap-0.5 relative text-xs">
            {/* FILE MENU */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-0.5 sm:gap-1 ${
                  activeMenu === 'file'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
                }`}
              >
                <span>File</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
              </button>

              {activeMenu === 'file' && (
                <div className={`absolute left-0 top-full mt-1.5 w-56 rounded-xl shadow-2xl border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                }`}>
                  <button
                    onClick={() => {
                      setIsProjectsModalOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Folder className="w-3.5 h-3.5 text-blue-500 group-hover:text-white" />
                      <span>Projects & Templates</span>
                    </span>
                    <kbd className="text-[10px] opacity-60">Ctrl+O</kbd>
                  </button>

                  <button
                    onClick={() => {
                      handleSaveCurrentProject(currentProject.name);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Save Project</span>
                    </span>
                    <kbd className="text-[10px] opacity-60">Ctrl+S</kbd>
                  </button>

                  <label className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-sky-500" />
                      <span>Import File / ZIP</span>
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".html,.htm,.css,.js,.zip"
                      onChange={(e) => {
                        handleFileUpload(e);
                        setActiveMenu(null);
                      }}
                      className="hidden"
                    />
                  </label>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      downloadProjectZip({
                        name: currentProject.name,
                        html: htmlCode,
                        css: cssCode,
                        js: jsCode,
                        includeSui: currentProject.includeSui
                      });
                      setActiveMenu(null);
                      addToast('Project exported', 'Downloaded standalone project.zip');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between font-semibold transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-amber-500" />
                      <span>Export Full Project (ZIP)</span>
                    </span>
                    <span className="text-[10px] opacity-60">.zip</span>
                  </button>

                  <button
                    onClick={() => {
                      const fullHtml = generateStandAloneHtml(htmlCode, currentProject.includeSui);
                      downloadFile('index.html', fullHtml, 'text/html');
                      setActiveMenu(null);
                      addToast('Downloaded HTML', 'Saved index.html');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between text-xs transition-colors"
                  >
                    <span>Download index.html</span>
                    <span className="text-[10px] opacity-60">.html</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile('style.css', cssCode, 'text/css');
                      setActiveMenu(null);
                      addToast('Downloaded CSS', 'Saved style.css');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between text-xs transition-colors"
                  >
                    <span>Download style.css</span>
                    <span className="text-[10px] opacity-60">.css</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile('script.js', jsCode, 'application/javascript');
                      setActiveMenu(null);
                      addToast('Downloaded JavaScript', 'Saved script.js');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between text-xs transition-colors"
                  >
                    <span>Download script.js</span>
                    <span className="text-[10px] opacity-60">.js</span>
                  </button>
                </div>
              )}
            </div>

            {/* EDIT MENU */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-0.5 sm:gap-1 ${
                  activeMenu === 'edit'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
                }`}
              >
                <span>Edit</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
              </button>

              {activeMenu === 'edit' && (
                <div className={`absolute left-0 top-full mt-1.5 w-56 rounded-xl shadow-2xl border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                }`}>
                  <button
                    onClick={() => {
                      handleFormatAll();
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between font-semibold transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Wand2 className="w-3.5 h-3.5 text-purple-500" />
                      <span>Format Document</span>
                    </span>
                    <kbd className="text-[10px] opacity-60">Shift+Alt+F</kbd>
                  </button>

                  <button
                    onClick={() => {
                      setIsAssetModalOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between font-semibold transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5 text-blue-500" />
                      <span>Insert Links, Scripts &amp; Tags</span>
                    </span>
                    <kbd className="text-[10px] opacity-60">Ctrl+I</kbd>
                  </button>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      handleClearEditor('html');
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
                  >
                    Clear HTML
                  </button>
                  <button
                    onClick={() => {
                      handleClearEditor('css');
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
                  >
                    Clear CSS
                  </button>
                  <button
                    onClick={() => {
                      handleClearEditor('js');
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
                  >
                    Clear JavaScript
                  </button>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      handleClearAll();
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white font-semibold transition-colors"
                  >
                    Clear All Editors
                  </button>
                  <button
                    onClick={() => {
                      handleResetProject();
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white font-semibold transition-colors"
                  >
                    Reset Project to Starter
                  </button>
                </div>
              )}
            </div>

            {/* VIEW / PREFERENCES MENU */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-0.5 sm:gap-1 ${
                  activeMenu === 'view'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
                }`}
              >
                <span>View</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
              </button>

              {activeMenu === 'view' && (
                <div className={`absolute left-0 top-full mt-1.5 w-60 rounded-xl shadow-2xl border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                }`}>
                  <button
                    onClick={() => {
                      handleToggleSuggestions();
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Typing Suggestions</span>
                    </span>
                    {settings.suggestions ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-[10px] opacity-60">Off</span>}
                  </button>

                  <button
                    onClick={() => {
                      handleToggleAutoRun();
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Auto Run Preview</span>
                    </span>
                    {settings.autoRun ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-[10px] opacity-60">Off</span>}
                  </button>

                  <button
                    onClick={() => {
                      setIsConsoleOpen(prev => !prev);
                      setBottomDockTab('console');
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-blue-500" />
                      <span>Developer Console</span>
                    </span>
                    {isConsoleOpen ? (
                      <span className="flex items-center gap-1">
                        {consoleMessages.length > 0 && <span className="text-[10px] opacity-75">({consoleMessages.length})</span>}
                        <Check className="w-4 h-4 text-emerald-500" />
                      </span>
                    ) : (
                      <span className="text-[10px] opacity-60">Ctrl+`</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      handleToggleWordWrap();
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span>Editor Word Wrap</span>
                    {settings.wordWrap ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-[10px] opacity-60">Off</span>}
                  </button>

                  <button
                    onClick={() => {
                      handleResetLayout();
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span>Reset Layout Split</span>
                    <RotateCcw className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      setEditorLayoutMode(prev => prev === 'split-pen' ? 'tabs' : 'split-pen');
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Columns className="w-3.5 h-3.5 text-blue-500" />
                      <span>{editorLayoutMode === 'split-pen' ? 'Switch to Tabs View' : 'Switch to Split-Pen View'}</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsZenMode(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-purple-500" />
                      <span>Zen Presentation Mode</span>
                    </span>
                    <kbd className="text-[10px] opacity-60">F11</kbd>
                  </button>

                  <button
                    onClick={() => {
                      setIsMatrixOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-sky-500" />
                      <span>Multi-Device Matrix (3 Devices)</span>
                    </span>
                  </button>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      setIsKeyframeStudioOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Keyframe Animation Studio</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsGlassMeshStudioOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-purple-500" />
                      <span>Glass & Mesh Gradient Studio</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPaletteContrastOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Palette className="w-3.5 h-3.5 text-emerald-500" />
                      <span>WCAG AAA Contrast Checker</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsVersionHistoryOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-amber-500" />
                      <span>Version History & Checkpoints</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCodeCardOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Export Shareable Code Card</span>
                    </span>
                  </button>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      handleToggleTheme();
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-between font-semibold transition-colors"
                  >
                    <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                    {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                </div>
              )}
            </div>
          </nav>

          <div className="h-4 sm:h-5 w-px bg-neutral-200 dark:bg-neutral-800 mx-0.5 sm:mx-1 hidden md:block shrink-0" />

          {/* COMMAND PALETTE BUTTON */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Command Palette (Ctrl+K or ⌘K)"
            className="hidden sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs font-semibold shrink-0"
          >
            <Command className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="hidden lg:inline text-[11px]">Commands</span>
            <kbd className="text-[10px] font-mono px-1 py-0.2 bg-neutral-200/80 dark:bg-neutral-800 rounded">
              ⌘K
            </kbd>
          </button>

          {/* LIBRARIES BUTTON */}
          <button
            onClick={() => setIsLibrariesModalOpen(true)}
            title="External CDN Libraries (Tailwind, Bootstrap, Three.js, Lucide, FontAwesome)"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="hidden sm:inline">Libraries</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
              {activeLibraries.filter(l => l.enabled).length}
            </span>
          </button>
        </div>

        {/* Right Zone: Primary Actions, Studios & Running */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* STUDIOS DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'studios' ? null : 'studios')}
              title="Visual Design Studios & Advanced Tools"
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border transition-colors shrink-0 ${
                activeMenu === 'studios'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden md:inline">Studios</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {activeMenu === 'studios' && (
              <div className={`absolute right-0 top-full mt-1.5 w-64 rounded-xl shadow-2xl border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                theme === 'dark' ? 'bg-[#0d1117] border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
              }`}>
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Visual Studios &amp; Generators
                </div>
                <button
                  onClick={() => {
                    setIsCssStudioOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center gap-2 text-xs transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-purple-500" />
                  <span>Visual CSS Studio</span>
                </button>
                <button
                  onClick={() => {
                    setIsKeyframeStudioOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center gap-2 text-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Keyframe Animation Timeline</span>
                </button>
                <button
                  onClick={() => {
                    setIsGlassMeshStudioOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center gap-2 text-xs transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>Glass &amp; Mesh Gradients</span>
                </button>
                <button
                  onClick={() => {
                    setIsPaletteContrastOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center gap-2 text-xs transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WCAG AAA Contrast Checker</span>
                </button>
                <button
                  onClick={() => {
                    setIsVersionHistoryOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center gap-2 text-xs transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-amber-500" />
                  <span>Version History &amp; Checkpoints</span>
                </button>
                <button
                  onClick={() => {
                    setIsCodeCardOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center gap-2 text-xs transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Export Code Card (Ray.so)</span>
                </button>
                <button
                  onClick={() => {
                    setIsMatrixOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center gap-2 text-xs transition-colors"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-sky-500" />
                  <span>Multi-Device Matrix</span>
                </button>
              </div>
            )}
          </div>

          {/* CODE HEALTH AUDITOR BUTTON */}
          <button
            onClick={() => setIsCodeHealthOpen(true)}
            title={`Code Health & Accessibility: ${auditReport.score}% (Grade ${auditReport.grade})`}
            className={`hidden xl:flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border transition-colors shrink-0 ${
              auditReport.score >= 90
                ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                : auditReport.score >= 70
                  ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                  : 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden 2xl:inline">Health:</span>
            <span className="font-bold">{auditReport.score}%</span>
          </button>

          {/* FORMAT CODE BUTTON */}
          <button
            onClick={handleFormatAll}
            title="Format Code (Shift+Alt+F)"
            className="hidden sm:flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden lg:inline">Format</span>
          </button>

          {/* RUN BUTTON */}
          <button
            onClick={executeCode}
            title="Run Code (Ctrl+Enter)"
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1 sm:gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
            <span>Run</span>
          </button>

          {/* SUI.CSS PROMOTION BUTTON */}
          <button
            onClick={() => setIsSuiModalOpen(true)}
            title="Discover SUI-FRAMEWORK.CSS by Suman M"
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden min-[540px]:inline">SUI.css</span>
          </button>

          {/* SHARE BUTTON */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            title="Share Project URL"
            className="p-1 sm:p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* THEME TOGGLE (Sun/Moon - always visible & never pushed outside) */}
          <button
            onClick={handleToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-1 sm:p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />}
          </button>

          {/* HELP MODAL */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            title="Keyboard Shortcuts & Guidance"
            className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden sm:inline-flex shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* ABOUT MODAL */}
          <button
            onClick={() => setIsAboutModalOpen(true)}
            title="About Developer Suman M & SUI.css"
            className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden sm:inline-flex shrink-0"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* FULLSCREEN APP */}
          <button
            onClick={handleToggleAppFullscreen}
            title={isAppFullscreen ? 'Exit Fullscreen' : 'Fullscreen Application'}
            className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden lg:inline-flex shrink-0"
          >
            {isAppFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>
      )}

      {/* ========================================================
          2. MOBILE NAVIGATION TABS (Visible on < 768px screens)
      ======================================================== */}
      {!isZenMode && (
        <div className={`flex md:hidden border-b px-2 py-1.5 gap-1 shrink-0 ${
          theme === 'dark' ? 'border-neutral-800 bg-[#090d16]' : 'border-neutral-200 bg-neutral-100'
        }`}>
          <button
            onClick={() => {
              setMobileTab('html');
              setActiveLang('html');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'html'
                ? 'bg-orange-600 text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => {
              setMobileTab('css');
              setActiveLang('css');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'css'
                ? 'bg-sky-600 text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => {
              setMobileTab('js');
              setActiveLang('javascript');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'js'
                ? 'bg-amber-600 text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
            }`}
          >
            JS
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Preview</span>
          </button>
        </div>
      )}


      {/* ========================================================
          3. MAIN WORKSPACE VIEWPORT
      ======================================================== */}
      <main className="flex-1 flex flex-col overflow-hidden relative p-2 gap-2">
        {/* MOBILE VIEW (Single Active Tab on small screens) */}
        <div className="flex-1 md:hidden h-full overflow-hidden flex flex-col">
          {mobileTab === 'html' && (
            <CodeEditor
              language="html"
              value={htmlCode}
              onChange={setHtmlCode}
              title="HTML"
              badgeColor="#ea580c"
              theme={theme}
              fontSize={settings.fontSize}
              wordWrap={settings.wordWrap}
              suggestions={settings.suggestions}
              onCursorChange={(info) => {
                setActiveLang('html');
                setCursorInfo(info);
              }}
              onCopySuccess={(msg) => addToast('Copied', msg)}
              onFormatSuccess={(msg) => addToast('Formatted', msg)}
              onInsertSnippet={() => setIsAssetModalOpen(true)}
              onClearRequest={() => handleClearEditor('html')}
            />
          )}
          {mobileTab === 'css' && (
            <CodeEditor
              language="css"
              value={cssCode}
              onChange={setCssCode}
              title={cssDialect.toUpperCase()}
              dialect={cssDialect}
              onDialectChange={setCssDialect}
              badgeColor="#0284c7"
              theme={theme}
              fontSize={settings.fontSize}
              wordWrap={settings.wordWrap}
              suggestions={settings.suggestions}
              onCursorChange={(info) => {
                setActiveLang('css');
                setCursorInfo(info);
              }}
              onCopySuccess={(msg) => addToast('Copied', msg)}
              onFormatSuccess={(msg) => addToast('Formatted', msg)}
              onClearRequest={() => handleClearEditor('css')}
            />
          )}
          {mobileTab === 'js' && (
            <CodeEditor
              language="javascript"
              value={jsCode}
              onChange={setJsCode}
              title={jsDialect === 'typescript' ? 'TypeScript' : 'JavaScript'}
              dialect={jsDialect}
              onDialectChange={setJsDialect}
              badgeColor="#eab308"
              theme={theme}
              fontSize={settings.fontSize}
              wordWrap={settings.wordWrap}
              suggestions={settings.suggestions}
              onCursorChange={(info) => {
                setActiveLang('javascript');
                setCursorInfo(info);
              }}
              onCopySuccess={(msg) => addToast('Copied', msg)}
              onFormatSuccess={(msg) => addToast('Formatted', msg)}
              onClearRequest={() => handleClearEditor('js')}
            />
          )}
          {isMobileView && mobileTab === 'preview' && (
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              <div className="flex-1 h-full">
                <Preview
                  html={previewHtml}
                  css={previewCss}
                  js={previewJs}
                  includeSui={currentProject.includeSui}
                  externalLibraries={activeLibraries}
                  deviceMode={deviceMode}
                  onDeviceModeChange={setDeviceMode}
                  deviceOrientation={deviceOrientation}
                  onToggleDeviceOrientation={() => setDeviceOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
                  onConsoleMessage={handleConsoleMessage}
                  onClearConsole={handleClearConsole}
                  consoleCount={{ error: consoleErrorCount, total: consoleMessages.length }}
                  isConsoleOpen={isConsoleOpen}
                  onToggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
                  isInspectActive={isInspectActive}
                  onToggleInspect={handleToggleInspect}
                  onElementInspected={handleElementInspected}
                  onOpenMobileQr={() => setIsMobileQrOpen(true)}
                  onOpenResponsiveMatrix={() => setIsMatrixOpen(true)}
                  theme={theme}
                  isFullscreen={isPreviewFullscreen}
                  onToggleFullscreen={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                  iframeRef={previewIframeRef}
                  executionCount={executionCount}
                />
              </div>
              {isConsoleOpen && (
                <div className="h-56 shrink-0 mt-1 flex flex-col border-t border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#090d16] rounded-xl overflow-hidden shadow-lg">
                  {/* Dock Tab Switcher */}
                  <div className={`flex items-center justify-between px-3 py-1 border-b text-xs select-none ${
                    theme === 'dark' ? 'bg-[#0d1117] border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                  }`}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setBottomDockTab('console')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                          bottomDockTab === 'console'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Console</span>
                        {consoleErrorCount > 0 ? (
                          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-red-500 text-white font-bold">
                            {consoleErrorCount}
                          </span>
                        ) : consoleMessages.length > 0 ? (
                          <span className="text-[10px] opacity-75">({consoleMessages.length})</span>
                        ) : null}
                      </button>

                      <button
                        onClick={() => setBottomDockTab('elements')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                          bottomDockTab === 'elements'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Elements</span>
                        {inspectedElement && (
                          <span className="px-1 py-0.2 text-[10px] rounded bg-purple-500/20 text-purple-400 font-mono font-bold">
                            &lt;{inspectedElement.tagName}&gt;
                          </span>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => setIsConsoleOpen(false)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Dock Panels */}
                  <div className="flex-1 overflow-hidden">
                    {bottomDockTab === 'console' ? (
                      <ConsolePanel
                        messages={consoleMessages}
                        onClear={handleClearConsole}
                        onClose={() => setIsConsoleOpen(false)}
                        onExecuteCommand={handleExecuteConsoleCommand}
                        preserveLog={preserveLog}
                        onTogglePreserveLog={() => setPreserveLog(prev => !prev)}
                        theme={theme}
                      />
                    ) : (
                      <ElementsInspector
                        inspectedElement={inspectedElement}
                        domTree={domTree}
                        onSelectNode={(_path) => {}}
                        isInspectActive={isInspectActive}
                        onToggleInspect={handleToggleInspect}
                        theme={theme}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DESKTOP VIEW (Desktop 3 Editors + Live Preview with Draggable Dividers) */}
        {!isMobileView && (
          <div className="hidden md:flex flex-1 flex-col h-full overflow-hidden">
          {/* Top Bar for Desktop Editor: Tab switcher or Split indicator */}
          <div className={`flex items-center justify-between px-3 py-1.5 border-b shrink-0 ${
            theme === 'dark' ? 'bg-[#090d16] border-neutral-800' : 'bg-neutral-100 border-neutral-200'
          }`}>
            {editorLayoutMode === 'tabs' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveLang('html')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeLang === 'html'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span>HTML</span>
                </button>
                <button
                  onClick={() => setActiveLang('css')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeLang === 'css'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>{cssDialect.toUpperCase()}</span>
                </button>
                <button
                  onClick={() => setActiveLang('javascript')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeLang === 'javascript'
                      ? 'bg-yellow-500 text-neutral-950 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span>{jsDialect === 'typescript' ? 'TypeScript' : 'JavaScript'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
                <Columns className="w-3.5 h-3.5 text-blue-500" />
                <span>CodePen Split-Pane (HTML · {cssDialect.toUpperCase()} · {jsDialect === 'typescript' ? 'TypeScript' : 'JavaScript'})</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditorLayoutMode(prev => prev === 'split-pen' ? 'tabs' : 'split-pen')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Toggle between side-by-side Split View and Single Tab View"
              >
                {editorLayoutMode === 'split-pen' ? <Rows className="w-3 h-3 text-blue-500" /> : <Columns className="w-3 h-3 text-blue-500" />}
                <span>{editorLayoutMode === 'split-pen' ? 'Switch to Tabs' : 'Switch to Split'}</span>
              </button>
            </div>
          </div>

          {/* TOP SECTION: 3 CODE EDITORS (HTML, CSS, JS) */}
          <div 
            style={{ height: isPreviewFullscreen ? '0%' : maximizedPanel ? '100%' : `${splitRatio}%` }}
            className={`flex flex-row overflow-hidden transition-all duration-100 ${
              isPreviewFullscreen ? 'hidden' : 'flex'
            }`}
          >
            {/* HTML Editor */}
            {(editorLayoutMode === 'tabs' ? activeLang === 'html' : (!maximizedPanel || maximizedPanel === 'html')) && (
              <div 
                style={{ width: (editorLayoutMode === 'tabs' || maximizedPanel) ? '100%' : `${editorCols.html}%` }} 
                className="h-full flex flex-col overflow-hidden"
              >
                <CodeEditor
                  language="html"
                  value={htmlCode}
                  onChange={setHtmlCode}
                  title="HTML"
                  badgeColor="#ea580c"
                  theme={theme}
                  fontSize={settings.fontSize}
                  wordWrap={settings.wordWrap}
                  suggestions={settings.suggestions}
                  onCursorChange={(info) => {
                    setActiveLang('html');
                    setCursorInfo(info);
                  }}
                  onCopySuccess={(msg) => addToast('Copied', msg)}
                  onFormatSuccess={(msg) => addToast('Formatted', msg)}
                  onInsertSnippet={() => setIsAssetModalOpen(true)}
                  isMaximized={maximizedPanel === 'html'}
                  onToggleMaximize={() => setMaximizedPanel(maximizedPanel === 'html' ? null : 'html')}
                  onClearRequest={() => handleClearEditor('html')}
                />
              </div>
            )}

            {/* Draggable Divider between HTML and CSS */}
            {editorLayoutMode === 'split-pen' && !maximizedPanel && (
              <div
                onMouseDown={(e) => handleEditorDividerMouseDown('html', 'css', e)}
                title="Drag to resize HTML / CSS panels"
                className="w-2 cursor-col-resize hover:bg-blue-500/40 rounded-full transition-colors mx-0.5 z-10 shrink-0 flex items-center justify-center group"
              >
                <div className="w-0.5 h-8 bg-neutral-300 dark:bg-neutral-700 group-hover:bg-blue-500 rounded-full" />
              </div>
            )}

            {/* CSS Editor */}
            {(editorLayoutMode === 'tabs' ? activeLang === 'css' : (!maximizedPanel || maximizedPanel === 'css')) && (
              <div 
                style={{ width: (editorLayoutMode === 'tabs' || maximizedPanel) ? '100%' : `${editorCols.css}%` }} 
                className="h-full flex flex-col overflow-hidden"
              >
                <CodeEditor
                  language="css"
                  value={cssCode}
                  onChange={setCssCode}
                  title={cssDialect.toUpperCase()}
                  dialect={cssDialect}
                  onDialectChange={setCssDialect}
                  badgeColor="#0284c7"
                  theme={theme}
                  fontSize={settings.fontSize}
                  wordWrap={settings.wordWrap}
                  suggestions={settings.suggestions}
                  onCursorChange={(info) => {
                    setActiveLang('css');
                    setCursorInfo(info);
                  }}
                  onCopySuccess={(msg) => addToast('Copied', msg)}
                  onFormatSuccess={(msg) => addToast('Formatted', msg)}
                  isMaximized={maximizedPanel === 'css'}
                  onToggleMaximize={() => setMaximizedPanel(maximizedPanel === 'css' ? null : 'css')}
                  onClearRequest={() => handleClearEditor('css')}
                />
              </div>
            )}

            {/* Draggable Divider between CSS and JS */}
            {editorLayoutMode === 'split-pen' && !maximizedPanel && (
              <div
                onMouseDown={(e) => handleEditorDividerMouseDown('css', 'js', e)}
                title="Drag to resize CSS / JS panels"
                className="w-2 cursor-col-resize hover:bg-blue-500/40 rounded-full transition-colors mx-0.5 z-10 shrink-0 flex items-center justify-center group"
              >
                <div className="w-0.5 h-8 bg-neutral-300 dark:bg-neutral-700 group-hover:bg-blue-500 rounded-full" />
              </div>
            )}

            {/* JS Editor */}
            {(editorLayoutMode === 'tabs' ? activeLang === 'javascript' : (!maximizedPanel || maximizedPanel === 'javascript')) && (
              <div 
                style={{ width: (editorLayoutMode === 'tabs' || maximizedPanel) ? '100%' : `${editorCols.js}%` }} 
                className="h-full flex flex-col overflow-hidden"
              >
                <CodeEditor
                  language="javascript"
                  value={jsCode}
                  onChange={setJsCode}
                  title={jsDialect === 'typescript' ? 'TypeScript' : 'JavaScript'}
                  dialect={jsDialect}
                  onDialectChange={setJsDialect}
                  badgeColor="#eab308"
                  theme={theme}
                  fontSize={settings.fontSize}
                  wordWrap={settings.wordWrap}
                  suggestions={settings.suggestions}
                  onCursorChange={(info) => {
                    setActiveLang('javascript');
                    setCursorInfo(info);
                  }}
                  onCopySuccess={(msg) => addToast('Copied', msg)}
                  onFormatSuccess={(msg) => addToast('Formatted', msg)}
                  isMaximized={maximizedPanel === 'javascript'}
                  onToggleMaximize={() => setMaximizedPanel(maximizedPanel === 'javascript' ? null : 'javascript')}
                  onClearRequest={() => handleClearEditor('js')}
                />
              </div>
            )}
          </div>

          {/* HORIZONTAL DRAGGABLE DIVIDER (Between Editors and Preview) */}
          {!maximizedPanel && !isPreviewFullscreen && (
            <div
              onMouseDown={handleDividerMouseDown}
              title="Drag up or down to resize Editors & Preview"
              className="h-2.5 cursor-row-resize flex items-center justify-center hover:bg-blue-500/20 group my-0.5 z-10 shrink-0"
            >
              <div className="w-16 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-blue-500 transition-colors" />
            </div>
          )}

          {/* BOTTOM SECTION: LIVE PREVIEW & DEVELOPER CONSOLE */}
          {!maximizedPanel && (
            <div 
              style={{ height: isPreviewFullscreen ? '100%' : `${100 - splitRatio}%` }}
              className="flex-1 flex flex-col overflow-hidden min-h-[140px]"
            >
              <div className="flex-1 overflow-hidden">
                <Preview
                  html={previewHtml}
                  css={previewCss}
                  js={previewJs}
                  includeSui={currentProject.includeSui}
                  externalLibraries={activeLibraries}
                  deviceMode={deviceMode}
                  onDeviceModeChange={setDeviceMode}
                  deviceOrientation={deviceOrientation}
                  onToggleDeviceOrientation={() => setDeviceOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
                  onConsoleMessage={handleConsoleMessage}
                  onClearConsole={handleClearConsole}
                  consoleCount={{ error: consoleErrorCount, total: consoleMessages.length }}
                  isConsoleOpen={isConsoleOpen}
                  onToggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
                  isInspectActive={isInspectActive}
                  onToggleInspect={handleToggleInspect}
                  onElementInspected={handleElementInspected}
                  onOpenMobileQr={() => setIsMobileQrOpen(true)}
                  onOpenResponsiveMatrix={() => setIsMatrixOpen(true)}
                  theme={theme}
                  isFullscreen={isPreviewFullscreen}
                  onToggleFullscreen={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                  iframeRef={previewIframeRef}
                  executionCount={executionCount}
                />
              </div>

              {/* Developer Console & Elements Inspector Unified Dock */}
              {isConsoleOpen && (
                <div className="h-56 shrink-0 mt-1 flex flex-col border-t border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#090d16] rounded-xl overflow-hidden shadow-lg">
                  {/* Dock Tab Switcher */}
                  <div className={`flex items-center justify-between px-3 py-1 border-b text-xs select-none ${
                    theme === 'dark' ? 'bg-[#0d1117] border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                  }`}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setBottomDockTab('console')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                          bottomDockTab === 'console'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Console</span>
                        {consoleErrorCount > 0 ? (
                          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-red-500 text-white font-bold">
                            {consoleErrorCount}
                          </span>
                        ) : consoleMessages.length > 0 ? (
                          <span className="text-[10px] opacity-75">({consoleMessages.length})</span>
                        ) : null}
                      </button>

                      <button
                        onClick={() => setBottomDockTab('elements')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                          bottomDockTab === 'elements'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Elements Inspector</span>
                        {inspectedElement && (
                          <span className="px-1.5 py-0.2 text-[10px] rounded bg-purple-500/20 text-purple-400 font-mono font-bold">
                            &lt;{inspectedElement.tagName}&gt;
                          </span>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => setIsConsoleOpen(false)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Dock Panels */}
                  <div className="flex-1 overflow-hidden">
                    {bottomDockTab === 'console' ? (
                      <ConsolePanel
                        messages={consoleMessages}
                        onClear={handleClearConsole}
                        onClose={() => setIsConsoleOpen(false)}
                        onExecuteCommand={handleExecuteConsoleCommand}
                        preserveLog={preserveLog}
                        onTogglePreserveLog={() => setPreserveLog(prev => !prev)}
                        theme={theme}
                      />
                    ) : (
                      <ElementsInspector
                        inspectedElement={inspectedElement}
                        domTree={domTree}
                        onSelectNode={(_path) => {}}
                        isInspectActive={isInspectActive}
                        onToggleInspect={handleToggleInspect}
                        theme={theme}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </main>

      {/* ========================================================
          4. BOTTOM STATUS BAR
      ======================================================== */}
      {!isZenMode && (
        <StatusBar
          cursorInfo={cursorInfo}
          activeLanguage={activeLang}
          totalLines={totalLines}
          totalChars={totalChars}
          autoSaveStatus={autoSaveStatus}
          autoRun={settings.autoRun}
          onToggleAutoRun={handleToggleAutoRun}
          wordWrap={settings.wordWrap}
          onToggleWordWrap={handleToggleWordWrap}
          suggestions={settings.suggestions}
          onToggleSuggestions={handleToggleSuggestions}
          fontSize={settings.fontSize}
          onChangeFontSize={handleChangeFontSize}
          healthScore={auditReport.score}
          onOpenCodeHealth={() => setIsCodeHealthOpen(true)}
          onOpenCssStudio={() => setIsCssStudioOpen(true)}
          theme={theme}
          consoleCount={{ error: consoleErrorCount, total: consoleMessages.length }}
          isConsoleOpen={isConsoleOpen}
          onToggleConsole={() => {
            setIsConsoleOpen(prev => !prev);
            setBottomDockTab('console');
          }}
        />
      )}

      {/* ========================================================
          5. MODALS & OVERLAYS
      ======================================================== */}
      <LibrariesModal
        isOpen={isLibrariesModalOpen}
        onClose={() => setIsLibrariesModalOpen(false)}
        activeLibraries={activeLibraries}
        onToggleLibrary={handleToggleLibrary}
        onAddCustomLibrary={handleAddCustomLibrary}
        onRemoveCustomLibrary={handleRemoveCustomLibrary}
        theme={theme}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commandItems}
        theme={theme}
      />

      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        currentProject={currentProject}
        savedProjects={savedProjects}
        onSaveCurrentProject={handleSaveCurrentProject}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
        onRenameProject={handleRenameProject}
        onLoadTemplate={handleLoadTemplate}
        theme={theme}
      />

      <SuiModal
        isOpen={isSuiModalOpen}
        onClose={() => setIsSuiModalOpen(false)}
        onInsertSnippet={handleInsertSuiSnippet}
        onCopyNotice={(msg) => addToast('Copied', msg)}
        theme={theme}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        theme={theme}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        theme={theme}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        onCopySuccess={(msg) => addToast('Copied Link', msg)}
        theme={theme}
      />

      {/* Visual CSS Studio Modal */}
      <CssStudioModal
        isOpen={isCssStudioOpen}
        onClose={() => setIsCssStudioOpen(false)}
        onInsertCss={(snippet) => {
          setCssCode(prev => prev + '\n' + snippet);
          addToast('CSS Inserted', 'Added to stylesheet', 'success');
        }}
        theme={theme}
      />

      {/* Mobile QR Code Modal */}
      <MobileQrModal
        isOpen={isMobileQrOpen}
        onClose={() => setIsMobileQrOpen(false)}
        shareUrl={shareUrl}
        projectName={currentProject.name}
        theme={theme}
      />

      {/* Code Health & Accessibility Modal */}
      <CodeHealthModal
        isOpen={isCodeHealthOpen}
        onClose={() => setIsCodeHealthOpen(false)}
        report={auditReport}
        onApplyAutoFix={handleApplyAutoFix}
        theme={theme}
      />

      {/* Required Links, Buttons & Tags Catalog Modal */}
      <AssetInsertModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onInsert={handleInsertSnippet}
        theme={theme}
      />

      {/* Visual CSS Keyframe & Animation Timeline Studio */}
      <KeyframeStudioModal
        isOpen={isKeyframeStudioOpen}
        onClose={() => setIsKeyframeStudioOpen(false)}
        onInjectCss={(cssSnippet) => {
          setCssCode(prev => prev + cssSnippet);
          addToast('Keyframes Injected ✨', 'Added animation keyframes to stylesheet', 'success');
        }}
        theme={theme}
      />

      {/* Mesh Gradient & Glassmorphism Studio */}
      <GlassMeshStudioModal
        isOpen={isGlassMeshStudioOpen}
        onClose={() => setIsGlassMeshStudioOpen(false)}
        onInjectCss={(cssSnippet) => {
          setCssCode(prev => prev + cssSnippet);
          addToast('Styles Injected ✨', 'Added glassmorphism / mesh gradient styles', 'success');
        }}
        theme={theme}
      />

      {/* Color Palette & WCAG AAA Contrast Checker */}
      <PaletteContrastModal
        isOpen={isPaletteContrastOpen}
        onClose={() => setIsPaletteContrastOpen(false)}
        onInjectCss={(cssSnippet) => {
          setCssCode(prev => cssSnippet + '\n\n' + prev);
          addToast('Palette Injected ✨', 'Added WCAG AAA :root variables to stylesheet', 'success');
        }}
        theme={theme}
      />

      {/* Version History & Checkpoints */}
      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        projectId={currentProject.id}
        currentHtml={htmlCode}
        currentCss={cssCode}
        currentJs={jsCode}
        onRestoreCheckpoint={(cp) => {
          setHtmlCode(cp.html);
          setCssCode(cp.css);
          setJsCode(cp.js);
          setPreviewHtml(cp.html);
          setPreviewCss(cp.css);
          setPreviewJs(cp.js);
          addToast('Milestone Restored', `Rolled back code to "${cp.name}"`, 'success');
        }}
        theme={theme}
      />

      {/* Export Shareable Code Card (Ray.so / Carbon style) */}
      <CodeCardModal
        isOpen={isCodeCardOpen}
        onClose={() => setIsCodeCardOpen(false)}
        html={htmlCode}
        css={cssCode}
        js={jsCode}
        activeLanguage={activeLang}
        theme={theme}
      />

      {/* Multi-Device Responsive Matrix */}
      <ResponsiveMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        previewSrcDoc={generateMatrixSrcDoc()}
        theme={theme}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
