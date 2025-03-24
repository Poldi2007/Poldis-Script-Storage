import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-csharp";
import "prismjs/themes/prism-tomorrow.css";

interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: string;
}

export function CodeBlock({ code, language = "csharp", maxHeight }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <pre className={`rounded-md bg-secondary border border-gray-800 ${maxHeight ? `max-h-${maxHeight} overflow-auto` : ""}`}>
      <code ref={codeRef} className={`language-${language} font-mono text-sm`}>
        {code}
      </code>
    </pre>
  );
}
