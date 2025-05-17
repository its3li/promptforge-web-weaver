
import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup'; // For HTML
import 'prismjs/components/prism-css';
// You might need to import a PrismJS theme CSS file here if not handled globally
// import 'prismjs/themes/prism-okaidia.css'; // Example theme

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
  const prismLanguage = language === 'html' ? languages.markup : languages[language];

  return (
    <div className="relative h-full bg-secondary rounded-md border border-border overflow-hidden">
      <Editor
        value={value}
        onValueChange={onValueChange}
        highlight={(code) => highlight(code, prismLanguage, language)}
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
