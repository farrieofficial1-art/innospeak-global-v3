import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const code = String(children).replace(/\n$/, '');

  const handleCopy = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');

        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="relative z-10 my-5 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-900 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {language || 'code'}
        </span>

        <button
          type="button"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={handleCopy}
          className="relative z-20 flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white active:scale-95"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span>⧉</span>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: '1.6',
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function TutorMarkdown({ content }) {
  return (
    <div className="tutor-markdown pointer-events-auto max-w-none text-[15px] leading-7 text-slate-700 dark:text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-xl font-bold text-slate-900 dark:text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-900 dark:text-white">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-4 last:mb-0">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-slate-950 dark:text-white">
              {children}
            </strong>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-2">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-2">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-indigo-400 bg-indigo-50 px-4 py-3 text-slate-700 dark:border-indigo-500 dark:bg-indigo-950/30 dark:text-slate-300">
              {children}
            </blockquote>
          ),

          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(
              className || ''
            );

            if (inline) {
              return (
                <code className="rounded-md bg-slate-200 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={match?.[1]}>
                {children}
              </CodeBlock>
            );
          },

          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="min-w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="border-b border-slate-200 bg-slate-100 px-4 py-3 text-left font-semibold dark:border-slate-700 dark:bg-slate-800">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              {children}
            </td>
          ),

          hr: () => (
            <hr className="my-6 border-slate-200 dark:border-slate-700" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}