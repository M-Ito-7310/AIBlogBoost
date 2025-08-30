import type { BlogArticle } from '../stores/article'

class ExportService {
  // Export as Markdown
  exportAsMarkdown(article: BlogArticle): void {
    const markdown = this.convertToMarkdown(article)
    this.downloadFile(markdown, `${this.sanitizeFilename(article.title)}.md`, 'text/markdown')
  }
  
  // Export as HTML
  exportAsHTML(article: BlogArticle): void {
    const html = this.convertToHTML(article)
    this.downloadFile(html, `${this.sanitizeFilename(article.title)}.html`, 'text/html')
  }
  
  // Export as Plain Text
  exportAsText(article: BlogArticle): void {
    const text = this.convertToPlainText(article)
    this.downloadFile(text, `${this.sanitizeFilename(article.title)}.txt`, 'text/plain')
  }
  
  // Copy to clipboard
  async copyToClipboard(article: BlogArticle, format: 'markdown' | 'html' | 'text' = 'markdown'): Promise<void> {
    let content = ''
    
    switch (format) {
      case 'markdown':
        content = this.convertToMarkdown(article)
        break
      case 'html':
        content = this.convertToHTML(article)
        break
      case 'text':
        content = this.convertToPlainText(article)
        break
    }
    
    await navigator.clipboard.writeText(content)
  }
  
  // Convert to Markdown
  private convertToMarkdown(article: BlogArticle): string {
    const frontmatter = `---
title: ${article.title}
genre: ${article.genre}
theme: ${article.theme}
keywords: ${article.keywords.join(', ')}
date: ${article.createdAt.toISOString()}
---

`
    
    return frontmatter + article.content
  }
  
  // Convert to HTML
  private convertToHTML(article: BlogArticle): string {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="${article.keywords.join(', ')}">
    <meta name="description" content="${article.title}">
    <title>${article.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
        }
        h1 { color: #2c3e50; margin-bottom: 30px; }
        h2 { color: #34495e; margin-top: 30px; margin-bottom: 20px; }
        h3 { color: #7f8c8d; margin-top: 25px; margin-bottom: 15px; }
        p { margin-bottom: 15px; }
        .metadata {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="metadata">
        <strong>ジャンル:</strong> ${article.genre} | 
        <strong>テーマ:</strong> ${article.theme} | 
        <strong>作成日:</strong> ${article.createdAt.toLocaleDateString('ja-JP')}
    </div>
    ${this.markdownToHTML(article.content)}
</body>
</html>`
    
    return html
  }
  
  // Convert to Plain Text
  private convertToPlainText(article: BlogArticle): string {
    const header = `${article.title}
${'='.repeat(article.title.length)}

ジャンル: ${article.genre}
テーマ: ${article.theme}
キーワード: ${article.keywords.join(', ')}
作成日: ${article.createdAt.toLocaleDateString('ja-JP')}

${'─'.repeat(50)}

`
    
    // Remove markdown formatting
    const plainContent = article.content
      .replace(/#{1,6}\s/g, '')  // Remove headers
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold
      .replace(/\*([^*]+)\*/g, '$1')  // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links
      .replace(/`([^`]+)`/g, '$1')  // Remove inline code
    
    return header + plainContent
  }
  
  // Simple Markdown to HTML converter
  private markdownToHTML(markdown: string): string {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
  }
  
  // Sanitize filename
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龠々]/g, '_')
      .substring(0, 50)
  }
  
  // Download file
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const exportService = new ExportService()