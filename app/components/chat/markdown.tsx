import { Components } from "react-markdown";

export const createMarkdownComponents = (textColor: string): Components => ({
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={`${textColor} mb-2`} {...props}>{children}</p>
    ),
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className="text-[#2E191E] font-semibold" {...props}>{children}</strong>
    ),
    code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code className="text-[#2E191E] bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
    ),
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <pre className="bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto text-sm" {...props}>{children}</pre>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-[#2E191E] text-lg font-semibold mb-2" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-[#2E191E] text-base font-semibold mb-2" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-[#2E191E] text-sm font-semibold mb-1" {...props}>{children}</h3>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={`list-disc list-inside space-y-1 ${textColor}`} {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={`list-decimal list-inside space-y-1 ${textColor}`} {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={textColor} {...props}>{children}</li>
    ),
  });