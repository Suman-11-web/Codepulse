export type EditorLanguage = 'html' | 'css' | 'javascript';

export type CssDialect = 'css' | 'scss';
export type JsDialect = 'javascript' | 'typescript';
export type EditorLayoutMode = 'tabs' | 'split-pen';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type ThemeMode = 'dark' | 'light';

export interface CodeCheckpoint {
  id: string;
  name: string;
  timestamp: number;
  html: string;
  css: string;
  js: string;
  cssDialect?: CssDialect;
  jsDialect?: JsDialect;
}

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info' | 'input' | 'result' | 'table';
  content: string[];
  timestamp: string;
  resultType?: string;
  count?: number;
  tableData?: any;
}

export interface ExternalLibrary {
  id: string;
  name: string;
  category: 'css' | 'js' | 'font';
  description: string;
  cssUrl?: string;
  jsUrl?: string;
  enabled: boolean;
  version?: string;
  badge?: string;
}

export interface Project {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  includeSui: boolean;
  externalLibraries?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface EditorSettings {
  fontSize: number; // 12, 14, 16, 18, 20
  wordWrap: boolean;
  autoRun: boolean;
  autoRunDelay: number; // ms, e.g. 500
  includeSui: boolean;
  theme: ThemeMode;
  layout: 'split-horizontal' | 'split-vertical';
  suggestions: boolean; // Autocomplete typing suggestions ON/OFF
  activeLibraries?: string[];
}

export interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  badge?: string;
  html: string;
  css: string;
  js: string;
  includeSui?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface EditorCursorInfo {
  line: number;
  col: number;
  linesTotal: number;
  charsTotal: number;
}

export interface BoxModelMetrics {
  margin: { top: number; right: number; bottom: number; left: number };
  border: { top: number; right: number; bottom: number; left: number };
  padding: { top: number; right: number; bottom: number; left: number };
  content: { width: number; height: number };
}

export interface InspectedElement {
  tagName: string;
  id: string;
  className: string;
  attributes: Record<string, string>;
  innerTextPreview: string;
  selectorPath: string;
  computedStyles: Record<string, string>;
  boxModel: BoxModelMetrics;
  rect: { top: number; left: number; width: number; height: number };
}

export interface DomTreeNode {
  id: string;
  tagName: string;
  idAttr?: string;
  classNames?: string;
  textPreview?: string;
  attributes: Record<string, string>;
  children: DomTreeNode[];
  isVoid?: boolean;
}

export interface AuditIssue {
  id: string;
  type: 'a11y' | 'html' | 'css';
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  codeSnippet?: string;
  canAutoFix?: boolean;
}

export interface AuditReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  issues: AuditIssue[];
  stats: {
    totalTags: number;
    imagesCount: number;
    linksCount: number;
    buttonsCount: number;
    cssRulesCount: number;
  };
}
