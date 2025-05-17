
import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs'; // Import the main Prism object

// These imports extend Prism.languages and Prism.highlight capabilities
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup'; // For HTML
import 'prismjs/components/prism-css';
// Note: PrismJS theme (e.g., 'prismjs/themes/prism-okaidia.css') is handled globally in index.css or via Tailwind theme integration.

interface CodeEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript';
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onValueChange,
  language,
  placeholder,
}) => {
  // Access the grammar for the current language from the Prism.languages object.
  // The side-effect imports (e.g., 'prismjs/components/prism-javascript') populate Prism.languages.
  const prismGrammar = language === 'html' ? Prism.languages.markup : Prism.languages[language];

  return (
    <div className="relative h-full bg-secondary rounded-md border border-border overflow-hidden">
      <Editor
        value={value}
        onValueChange={onValueChange}
        highlight={(code) => {
          // Ensure the grammar is loaded before attempting to highlight
          if (prismGrammar) {
            return Prism.highlight(code, prismGrammar, language);
          }
          return code; // Return original code if grammar is not found (fallback)
        }}
        padding={16}
        textareaClassName="focus:outline-none"
        className="font-mono text-sm h-full !bg-secondary" // Override default styles
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 14,
          outline: 'none',
          minHeight: '200px', // Ensure editor has some height
          height: '100%',
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CodeEditor;
