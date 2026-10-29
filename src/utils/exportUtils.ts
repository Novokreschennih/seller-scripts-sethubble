import { SavedScript } from '../hooks/useScriptHistory';

export function exportToPDF(script: SavedScript) {
  // Создаем HTML для печати
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для экспорта в PDF');
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Скрипт: ${script.businessName || 'Без названия'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 28px;
      color: #6366f1;
      margin-bottom: 10px;
    }
    .meta {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      font-size: 14px;
      color: #6b7280;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .content {
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.8;
    }
    .content h2 {
      font-size: 20px;
      color: #4f46e5;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 5px;
    }
    .content h3 {
      font-size: 16px;
      color: #1f2937;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .content strong {
      color: #4f46e5;
    }
    .content ul {
      margin-left: 20px;
      margin-bottom: 15px;
    }
    .content li {
      margin-bottom: 5px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
      🖨️ Печать / Сохранить как PDF
    </button>
  </div>

  <div class="header">
    <h1>${script.businessName || 'Скрипт встречи'}</h1>
    <div class="meta">
      <div class="meta-item">
        <span>📋</span>
        <span>${script.methodology}</span>
      </div>
      <div class="meta-item">
        <span>🏢</span>
        <span>${script.category || 'Не указана'}</span>
      </div>
      <div class="meta-item">
        <span>📅</span>
        <span>${new Date(script.createdAt).toLocaleDateString('ru-RU')}</span>
      </div>
    </div>
  </div>

  <div class="content">
    ${formatContent(script.content)}
  </div>

  <div class="footer">
    <p>Создано в ScriptForge • Генератор скриптов продаж SetHubble</p>
    <p>${new Date().toLocaleDateString('ru-RU')}</p>
  </div>

  <script>
    // Автоматически открываем диалог печати
    setTimeout(() => window.print(), 500);
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

function formatContent(content: string): string {
  // Простое форматирование Markdown в HTML
  return content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

export function exportToMarkdown(script: SavedScript): string {
  let markdown = `# Скрипт: ${script.businessName || 'Без названия'}\n\n`;
  markdown += `**Методика:** ${script.methodology}\n`;
  markdown += `**Категория:** ${script.category || 'Не указана'}\n`;
  markdown += `**Дата:** ${new Date(script.createdAt).toLocaleDateString('ru-RU')}\n\n`;
  markdown += `---\n\n`;
  markdown += script.content;
  
  return markdown;
}

export function downloadMarkdown(script: SavedScript) {
  const markdown = exportToMarkdown(script);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `script-${script.businessName || 'без-названия'}-${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
