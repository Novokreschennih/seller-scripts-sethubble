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
  sectionDescription: string
): PolzaMessage[] {
  const context = buildContext(businessData);
  
  return [
    {
      role: 'system',
      content: `Ты — эксперт по продажам платформы SetHubble (платформа для оцифровки сарафанного радио). 
SetHubble позволяет бизнесам создавать партнёрские программы, где клиенты и партнёры приводят новых клиентов за вознаграждение.
Тарифы: Самолёт (бесплатно, 5% комиссия), Ракета ($110/год, 3%), Шаттл ($350/год, 1%).
Твоя задача — создавать персонализированные скрипты продаж для конкретных бизнесов.`
    },
    {
      role: 'user',
      content: `Создай скрипт для раздела "${sectionTitle}" используя методологию ${methodology}.

Контекст бизнеса:
${context}

Описание раздела: ${sectionDescription}

Создай 4 конкретные фразы для этого раздела, которые:
1. Персонализированы под этот конкретный бизнес
2. Используют реальные данные из контекста
3. Говорят на языке выгод для клиента
4. Подводят к подключению SetHubble

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
  
  if (data.characteristics?.length > 0) {
    parts.push(`Особенности: ${data.characteristics.join(', ')}`);
  }
  
  if (data.mainGoals?.length > 0) {
    parts.push(`Цели: ${data.mainGoals.join(', ')}`);
  }
  
  if (data.mainPains?.length > 0) {
    parts.push(`Боли: ${data.mainPains.join(', ')}`);
  }
  
  if (data.additionalNotes) {
    parts.push(`Дополнительно: ${data.additionalNotes}`);
  }
  
  return parts.join('\n') || 'Бизнес не указан';
}
