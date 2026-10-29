import { useState } from 'react';
import { CompanyData } from '../data/methodologies';

interface Props {
  companyData: CompanyData;
  onClose: () => void;
}

export default function CommercialProposal({ companyData, onClose }: Props) {
  const [partnerReward, setPartnerReward] = useState('10');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const generateProposal = () => {
    const businessName = companyData.businessName || 'Ваш бизнес';
    const category = companyData.businessSubcategory || 'ваш бизнес';
    const date = new Date().toLocaleDateString('ru-RU');

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Коммерческое предложение - ${businessName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #6366f1;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #4f46e5;
      font-size: 20px;
      margin-bottom: 15px;
      border-left: 4px solid #6366f1;
      padding-left: 10px;
    }
    .section p {
      margin-bottom: 10px;
      text-align: justify;
    }
    .highlight {
      background: #f0f9ff;
      border-left: 4px solid #0ea5e9;
      padding: 15px;
      margin: 15px 0;
    }
    .benefits {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    .benefit {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .benefit h3 {
      color: #0ea5e9;
      font-size: 16px;
      margin-bottom: 8px;
    }
    .pricing {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .pricing h3 {
      color: #d97706;
      margin-bottom: 10px;
    }
    .cta {
      background: #6366f1;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
    }
    .cta h3 {
      margin-bottom: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Коммерческое предложение</h1>
    <p>Платформа SetHubble для ${businessName}</p>
    <p>Дата: ${date}</p>
  </div>

  <div class="section">
    <h2>Уважаемые партнёры!</h2>
    <p>Благодарим вас за интерес к платформе SetHubble. Мы подготовили индивидуальное предложение для ${businessName}, основанное на анализе вашего бизнеса в сфере "${category}".</p>
    ${additionalInfo ? `<p><strong>Дополнительная информация:</strong> ${additionalInfo}</p>` : ''}
  </div>

  <div class="section">
    <h2>Что такое SetHubble?</h2>
    <p>SetHubble — это платформа для оцифровки сарафанного радио. Мы помогаем бизнесам превращать довольных клиентов в мотивированных рекомендателей через прозрачную систему вознаграждений.</p>
    <div class="highlight">
      <strong>Ключевой принцип:</strong> Вы платите только за реальных приведённых клиентов. Нет клиентов — нет расходов.
    </div>
  </div>

  <div class="section">
    <h2>Как это работает для ${businessName}?</h2>
    <p><strong>1. Регистрация и настройка (5 минут)</strong></p>
    <p>Вы регистрируетесь на платформе, добавляете свои услуги/товары и настраиваете партнёрскую программу.</p>
    
    <p><strong>2. Привлечение партнёров</strong></p>
    <p>Ваши клиенты получают персональные ссылки и могут приглашать друзей. За каждого приведённого клиента партнёр получает вознаграждение ${partnerReward}%.</p>
    
    <p><strong>3. Автоматический учёт</strong></p>
    <p>Система автоматически отслеживает, кто кого привёл, рассчитывает вознаграждения и управляет выплатами.</p>
  </div>

  <div class="section">
    <h2>Выгоды для ${businessName}</h2>
    <div class="benefits">
      <div class="benefit">
        <h3>📈 Рост клиентской базы</h3>
        <p>Увеличение потока новых клиентов на 30-50% через рекомендации</p>
      </div>
      <div class="benefit">
        <h3>💰 Снижение CAC</h3>
        <p>Стоимость привлечения клиента снижается в 3-5 раз по сравнению с рекламой</p>
      </div>
      <div class="benefit">
        <h3>🎯 Нулевой риск</h3>
        <p>Оплата только за реальных клиентов. Нет результата — нет расходов</p>
      </div>
      <div class="benefit">
        <h3>⚡ Быстрый старт</h3>
        <p>Подключение за 5 минут. Первые результаты через 2-3 недели</p>
      </div>
    </div>
  </div>

  <div class="pricing">
    <h3>💼 Условия сотрудничества</h3>
    <p><strong>Вознаграждение партнёрам:</strong> ${partnerReward}% от продаж приведённых клиентов</p>
    <p><strong>Комиссия платформы SetHubble:</strong></p>
    <ul style="margin-left: 20px; margin-top: 10px;">
      <li>Тариф "Самолёт": 5% (бесплатно, для старта)</li>
      <li>Тариф "Ракета": 3% ($110/год, рекомендуется)</li>
      <li>Тариф "Шаттл": 1% ($350/год, для крупных бизнесов)</li>
    </ul>
    <p style="margin-top: 15px;"><strong>Важно:</strong> Вы платите только при выводе средств. Нет вывода — нет комиссии.</p>
  </div>

  <div class="section">
    <h2>Почему это работает для ${category}?</h2>
    <p>В сфере "${category}" рекомендации играют ключевую роль. Клиенты доверяют мнению друзей и знакомых больше, чем рекламе. SetHubble позволяет:</p>
    <ul style="margin-left: 20px; margin-top: 10px;">
      <li>Систематизировать сарафанное радио</li>
      <li>Мотивировать клиентов приводить друзей</li>
      <li>Отслеживать эффективность рекомендаций</li>
      <li>Создать устойчивый канал привлечения</li>
    </ul>
  </div>

  <div class="cta">
    <h3>🚀 Готовы начать?</h3>
    <p>Подключение бесплатное и занимает 5 минут. Первые результаты вы увидите уже через 2-3 недели.</p>
    <p style="margin-top: 15px;"><strong>Следующий шаг:</strong> Регистрация на платформе SetHubble</p>
  </div>

  <div class="section">
    <h2>Контакты для связи</h2>
    <p>Если у вас остались вопросы, свяжитесь с нами:</p>
    <p><strong>Сайт:</strong> sethubble.com</p>
    <p><strong>Email:</strong> support@sethubble.com</p>
  </div>

  <div class="footer">
    <p>Коммерческое предложение подготовлено в ScriptForge</p>
    <p>© ${new Date().getFullYear()} SetHubble. Все права защищены.</p>
  </div>

  <script>
    setTimeout(() => window.print(), 500);
  </script>
</body>
</html>
    `.trim();
  };

  const handleExport = () => {
    const html = generateProposal();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
              <span className="text-xl">📄</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Коммерческое предложение</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Для {companyData.businessName || 'клиента'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Вознаграждение партнёрам (%)
            </label>
            <input
              type="number"
              value={partnerReward}
              onChange={(e) => setPartnerReward(e.target.value)}
              min="1"
              max="50"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Процент от продаж, который будут получать партнёры
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Дополнительная информация (опционально)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Любая дополнительная информация для клиента..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📋 Что включено в КП:</h3>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>✓ Персонализированное описание для {companyData.businessName || 'клиента'}</li>
              <li>✓ Объяснение работы платформы</li>
              <li>✓ Конкретные выгоды для бизнеса</li>
              <li>✓ Условия сотрудничества и тарифы</li>
              <li>✓ Призыв к действию</li>
            </ul>
          </div>

          <button
            onClick={handleExport}
            className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Экспортировать в PDF
          </button>
        </div>
      </div>
    </div>
  );
}
