import { marked } from "marked";

// Configure marked for safe HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}
