export function parseMarkdown(content: string): string {
  // Simple markdown parser for basic formatting
  let html = content;

  // Headers
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-card-foreground">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 text-card-foreground">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 text-card-foreground">$1</h3>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="font-mono text-sm">$1</code></pre>');

  // Inline code
  html = html.replace(/`(.*?)`/gim, '<code class="bg-muted px-2 py-1 rounded font-mono text-sm">$1</code>');

  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="mb-4 text-muted-foreground">');
  html = '<p class="mb-4 text-muted-foreground">' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p class="mb-4 text-muted-foreground"><\/p>/g, '');

  return html;
}
