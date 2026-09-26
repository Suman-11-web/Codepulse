import beautify from 'js-beautify';
import { EditorLanguage } from '../types';

/**
 * Production-ready code beautifier for HTML, CSS, and JavaScript.
 * Automatically indents, cleans linebreaks, and structures code cleanly.
 */
export function formatCode(code: string, language: EditorLanguage): string {
  if (!code || !code.trim()) return code;

  try {
    if (language === 'html') {
      return beautify.html(code, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 1,
        preserve_newlines: true,
        indent_inner_html: true,
        wrap_line_length: 120,
        end_with_newline: true,
        extra_liners: []
      });
    } else if (language === 'css') {
      return beautify.css(code, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 1,
        preserve_newlines: true,
        selector_separator_newline: true,
        newline_between_rules: true,
        end_with_newline: true
      });
    } else if (language === 'javascript') {
      return beautify.js(code, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        space_after_anon_function: true,
        brace_style: 'collapse',
        break_chained_methods: false,
        end_with_newline: true
      });
    }
  } catch (error) {
    console.warn(`Format error for ${language}:`, error);
  }

  return code;
}
