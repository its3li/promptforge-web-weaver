
import React from 'react';

interface PreviewProps {
  html: string;
  css: string;
  js: string;
}

const Preview: React.FC<PreviewProps> = ({ html, css, js }) => {
  const srcDoc = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

  return (
    <div className="h-full bg-background border border-border rounded-md overflow-hidden">
      <iframe
        srcDoc={srcDoc}
        title="Preview"
        sandbox="allow-scripts allow-same-origin" // Security measure
        className="w-full h-full border-0"
      />
    </div>
  );
};

export default Preview;
