import { transform } from 'sucrase';

/**
 * Transpiles TypeScript or ESNext code into browser-runnable JavaScript
 */
export function transpileTypeScript(code: string): { code: string; error?: string } {
  if (!code || !code.trim()) {
    return { code: '' };
  }

  try {
    const result = transform(code, {
      transforms: ['typescript'],
      disableESTransforms: true
    });
    return { code: result.code };
  } catch (err: any) {
    return {
      code,
      error: err.message || 'TypeScript transpile error'
    };
  }
}

/**
 * Transpiles SCSS into standard CSS in-browser:
 * - Resolves SCSS variables ($primary: #6366f1)
 * - Expands nested CSS selectors (.parent { &:hover { ... } .child { ... } })
 * - Expands @mixin and @include directives
 * - Converts single-line // comments to CSS-compatible /* ... * /
 */
export function transpileScss(scss: string): { code: string; error?: string } {
  if (!scss || !scss.trim()) {
    return { code: '' };
  }

  try {
    let output = scss;

    // 1. Convert single-line comments // ... to /* ... */
    output = output.replace(/\/\/(.*)$/gm, '/* $1 */');

    // 2. Extract and replace SCSS variables: $var-name: value;
    const variables: Record<string, string> = {};
    const varRegex = /^\s*\$([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/gm;
    let varMatch;
    while ((varMatch = varRegex.exec(output)) !== null) {
      variables[varMatch[1]] = varMatch[2].trim();
    }
    // Remove variable declaration lines
    output = output.replace(/^\s*\$([a-zA-Z0-9_-]+)\s*:\s*([^;]+);\n?/gm, '');

    // Substitute variable usages (sort by longest name first to avoid prefix clashes)
    const sortedVarNames = Object.keys(variables).sort((a, b) => b.length - a.length);
    for (const varName of sortedVarNames) {
      const varVal = variables[varName];
      const usageRegex = new RegExp(`\\$${varName}\\b`, 'g');
      output = output.replace(usageRegex, varVal);
    }

    // 3. Process @mixin and @include
    const mixins: Record<string, { params: string[]; body: string }> = {};
    const mixinRegex = /@mixin\s+([a-zA-Z0-9_-]+)(?:\s*\(([^)]*)\))?\s*\{([^}]+)\}/g;
    let mixinMatch;
    while ((mixinMatch = mixinRegex.exec(output)) !== null) {
      const name = mixinMatch[1];
      const params = mixinMatch[2] ? mixinMatch[2].split(',').map(p => p.trim().replace(/^\$/, '')) : [];
      const body = mixinMatch[3];
      mixins[name] = { params, body };
    }
    // Remove mixin definitions
    output = output.replace(/@mixin\s+([a-zA-Z0-9_-]+)(?:\s*\(([^)]*)\))?\s*\{([^}]+)\}\n?/g, '');

    // Replace @include mixinName(...)
    for (const [name, mixin] of Object.entries(mixins)) {
      const includeRegex = new RegExp(`@include\\s+${name}(?:\\s*\\(([^)]*)\\))?;`, 'g');
      output = output.replace(includeRegex, (_match, argsStr) => {
        let body = mixin.body;
        if (argsStr && mixin.params.length > 0) {
          const args = argsStr.split(',').map((a: string) => a.trim());
          mixin.params.forEach((param, idx) => {
            if (args[idx]) {
              body = body.replace(new RegExp(`\\$${param}\\b`, 'g'), args[idx]);
            }
          });
        }
        return body;
      });
    }

    // 4. Expand SCSS selector nesting
    output = expandScssNesting(output);

    return { code: output };
  } catch (err: any) {
    return {
      code: scss,
      error: err.message || 'SCSS parsing error'
    };
  }
}

/**
 * Tokenizes CSS/SCSS and resolves nested rules into flattened CSS
 */
function expandScssNesting(source: string): string {
  // Simple yet effective recursive block unnester
  interface RuleBlock {
    selector: string;
    declarations: string[];
    children: RuleBlock[];
  }

  function parseBlocks(css: string): string {
    const lines = css.split('\n');
    const resultRules: { selector: string; rules: string[] }[] = [];
    const selectorStack: string[] = [];
    const declarationStack: string[][] = [[]];

    let currentSelector = '';
    let inBlock = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.endsWith('{')) {
        const selPart = line.slice(0, -1).trim();
        let resolvedSel = selPart;

        if (selectorStack.length > 0) {
          const parentSel = selectorStack[selectorStack.length - 1];
          // Handle & parent selector
          if (selPart.includes('&')) {
            resolvedSel = selPart.replace(/&/g, parentSel);
          } else {
            // Split parent and child by commas if multi-selector
            const parents = parentSel.split(',').map(s => s.trim());
            const children = selPart.split(',').map(s => s.trim());
            const combined: string[] = [];
            for (const p of parents) {
              for (const c of children) {
                combined.push(`${p} ${c}`);
              }
            }
            resolvedSel = combined.join(', ');
          }
        }

        selectorStack.push(resolvedSel);
        declarationStack.push([]);
        inBlock++;
      } else if (line === '}' || line.startsWith('}')) {
        if (inBlock > 0) {
          const currentDecls = declarationStack.pop() || [];
          const curSel = selectorStack.pop() || '';
          if (currentDecls.length > 0 && curSel) {
            resultRules.push({
              selector: curSel,
              rules: currentDecls
            });
          }
          inBlock--;
        }
      } else {
        // Declaration or @rule
        if (declarationStack.length > 0) {
          declarationStack[declarationStack.length - 1].push(line);
        } else {
          resultRules.push({
            selector: '',
            rules: [line]
          });
        }
      }
    }

    if (resultRules.length === 0) return css;

    return resultRules
      .map(r => {
        if (!r.selector) return r.rules.join('\n');
        return `${r.selector} {\n  ${r.rules.join('\n  ')}\n}`;
      })
      .join('\n\n');
  }

  return parseBlocks(source);
}
