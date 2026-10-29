// Polza.ai API интеграция (совместим с OpenAI)

const POLZA_BASE_URL = 'https://polza.ai/api/v1';

export interface PolzaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateWithPolza(
  apiKey: string,
  messages: PolzaMessage[],
  model: string = 'openai/gpt-4o-mini'
): Promise<string> {
  const response = await fetch(`${POLZA_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Ошибка API: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export function buildPrompt(
  methodology: string,
  businessData: any,
  sectionTitle: string,
  sectionDescription: string,
  tone: string = 'professional'
): PolzaMessage[] {
  const context = buildContext(businessData);
  
  const toneDescriptions: Record<string, string> = {
    'professional': 'Деловой, официальный, структурированный. Используй профессиональную лексику, четкие формулировки.',
    'friendly': 'Дружеский, неформальный, тёплый. Используй простой язык, обращайся на "ты" если уместно, будь как хороший знакомый.',
    'expert': 'Экспертный, убедительный, с фактами и цифрами. Позиционируй себя как специалиста, используй статистику и примеры.',
    'empathetic': 'Эмпатичный, поддерживающий, понимающий. Проявляй эмпатию к проблемам клиента, используй мягкие формулировки.'
  };
  
  const toneDescription = toneDescriptions[tone] || toneDescriptions['professional'];
  
  return [
    {
      role: 'system',
      content: `Ты — эксперт по продажам платформы SetHubble (платформа для оцифровки сарафанного радио). 
SetHubble позволяет бизнесам создавать партнёрские программы, где клиенты и партнёры приводят новых клиентов за вознаграждение.
Тарифы: Самолёт (бесплатно, 5% комиссия), Ракета ($110/год, 3%), Шаттл ($350/год, 1%).

Ключевые преимущества SetHubble для бизнеса:
- Бесплатный старт (план Самолёт) — нулевой риск
- Оплата только за результат: комиссия 5%/3%/1% только при выводе средств
- Партнёрские программы до 10 уровней на ВСЕХ тарифах
- Автоматический учёт рекомендаций и расчёт вознаграждений
- Готовые инструменты: сайты-визитки для партнёров, QR-коды, флайеры
- Работает для онлайн и офлайн бизнеса
- Клиенты остаются вашими (не уходят к конкурентам)
- 57% комиссии платформы идёт пригласившим

Твоя задача — создавать персонализированные скрипты продаж, которые:
1. Помогают выявить боли клиента через правильные вопросы
2. Подчёркивают преимущества SetHubble для конкретной категории бизнеса
3. Подводят к подключению платформы
4. Говорят на языке выгод, а не функций

Тон общения: ${toneDescription}`
    },
    {
      role: 'user',
      content: `Создай скрипт для раздела "${sectionTitle}" используя методологию ${methodology}.

Контекст бизнеса:
${context}

Описание раздела: ${sectionDescription}

Создай 4 конкретные фразы для этого раздела, которые:
1. Персонализированы под этот конкретный бизнес (${businessData.businessSubcategory || 'категория бизнеса'})
2. Помогают выявить боли или потребности клиента через вопросы (если это уместно для раздела)
3. Подчёркивают преимущества SetHubble именно для этой категории бизнеса
4. Говорят на языке выгод и результатов, а не технических функций
5. Подводят к следующему шагу — подключению SetHubble
6. Соответствуют выбранному тону: ${toneDescription}

Важно:
- Фразы должны быть естественными, разговорными
- Избегай давления — веди через вопросы и выгоды
- Используй конкретные примеры для этой категории бизнеса
- Если это раздел выявления проблем — задавай вопросы, которые помогут клиенту самому осознать боли
- Строго следуй выбранному тону общения

Формат ответа:
1. "фраза 1"
2. "фраза 2"
3. "фраза 3"
4. "фраза 4"

Каждая фраза должна быть готовой к использованию в разговоре.`
    }
  ];
}

function buildContext(data: any): string {
  const parts = [];
  
  if (data.businessName) parts.push(`Название: ${data.businessName}`);
  if (data.businessSubcategory) parts.push(`Тип бизнеса: ${data.businessSubcategory}`);
  
  if (data.additionalNotes) {
    parts.push(`Дополнительно: ${data.additionalNotes}`);
  }
  
  return parts.join('\n') || 'Бизнес не указан';
}
