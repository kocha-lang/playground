import * as monaco from 'monaco-editor';

export function useKochaSyntax() {
  const languageId = 'kocha';
  monaco.languages.register({ id: languageId });

  monaco.languages.setMonarchTokensProvider(languageId, {
    // defaultToken: fallback token
    defaultToken: '',
    tokenPostfix: '.kocha',

    keywords: ['agar', 'yemasa', 'oxiri', 'aylan', 'qarama', 'toxta', 'qaytar'],
    declarations: ['xullas', 'jovob', 'endi', 'tema'],
    operators: ['va', 'yoki', 'endi', '='],
    builtinFunctions: ['korsat', 'shara', 'gapir', 'kelishtir'],

    // tokenizer rules
    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment.line.number-sign.kocha'],

        // Strings
        [/"/, { token: 'string.quoted.double.kocha', bracket: '@open', next: '@string' }],

        // Keywords & declarations
        [/\b(agar|yemasa|oxiri|aylan|qarama|toxta|qaytar)\b/, 'keyword.control.kocha'],
        [/\b(xullas|jovob|endi|tema)\b/, 'keyword.declaration.kocha'],

        // Operators
        [/\b(va|yoki|endi|=)\b/, 'keyword.operator.kocha'],

        // Numbers
        [/\b\d+\b/, 'constant.numeric.kocha'],

        // Functions
        [/\bfn\s+(\w+)\b/, ['keyword.declaration.kocha', 'entity.name.function.declaration.kocha']],
        [/\b(korsat)\b/, 'support.function.builtin.kocha'],
        [/\b(\w+)\s*(?=\()/, 'entity.name.function.call.kocha'],

        // Variables
        [/\bjovob\s+(\w+)\b/, 'variable.other.constant.kocha'],
        [/\bxullas\s+(\w+)\b/, 'variable.other.readwrite.kocha'],
        [/\b\w+\b/, 'variable.other.identifier.kocha'],
      ],

      string: [
        [/[^\\"]+/, 'string.quoted.double.kocha'],
        [/\\./, 'constant.character.escape.kocha'],
        [/"/, { token: 'string.quoted.double.kocha', bracket: '@close', next: '@pop' }],
      ],
    },
  });

  monaco.editor.defineTheme('kochaAtom', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword.control.kocha', foreground: 'C792EA', fontStyle: 'bold' },
      { token: 'keyword.declaration.kocha', foreground: 'C792EA', fontStyle: 'bold' },
      { token: 'keyword.operator.kocha', foreground: '89DDFF' },
      { token: 'constant.numeric.kocha', foreground: 'F78C6C' },
      { token: 'string.quoted.double.kocha', foreground: 'C3E88D' },
      { token: 'comment.line.number-sign.kocha', foreground: '546E7A', fontStyle: 'italic' },
      { token: 'entity.name.function.declaration.kocha', foreground: '82AAFF' },
      { token: 'entity.name.function.call.kocha', foreground: '82AAFF' },
      { token: 'variable.other.*.kocha', foreground: 'FF5370' },
      { token: 'support.function.builtin.kocha', foreground: 'FFCB6B' },
    ],
    colors: {
      'editor.background': '#282C34',
      'editor.foreground': '#D8DEE9',
      'editor.selectionBackground': '#3E4451',
      'editor.lineHighlightBackground': '#2C313C',
      'editorCursor.foreground': '#528BFF',
    },
  });

  return { languageId, theme: 'kochaAtom' };
}
