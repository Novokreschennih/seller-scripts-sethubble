import { useState } from 'react';
import { generateWithPolza } from '../utils/polza';

interface Props {
  userMessage: string;
  apiKey?: string;
  selectedModel?: string;
  scenario: string;
  mood: string;
}

interface Feedback {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  suggestion: string;
}

export default function SmartFeedback({ userMessage, apiKey, selectedModel, scenario, mood }: Props) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeResponse = async () => {
    if (!apiKey || !userMessage.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Ты — эксперт по продажам платформы SetHubble. Проанализируй ответ продавца клиенту и дай обратную связь.

Контекст:
- Сценарий: ${scenario}
- Настроение клиента: ${mood}
- Ответ продавца: "${userMessage}"

Проанализируй ответ по следующим критериям:
1. Насколько хорошо выявляет потребности клиента
2. Насколько убедительно представляет SetHubble
3. Насколько хорошо работает с возражениями (если есть)
4. Насколько близок к закрытию сделки

Дай оценку от 0 до 100 и конкретные рекомендации.

Формат ответа (JSON):
{
  "score": число от 0 до 100,
  "strengths": ["сильная сторона 1", "сильная сторона 2"],
  "improvements": ["что улучшить 1", "что улучшить 2"],
  "suggestion": "конкретная рекомендация, как улучшить ответ"
}`;

      const response = await generateWithPolza(
        apiKey,
        [{ role: 'user', content: prompt }],
        selectedModel || 'deepseek/deepseek-v4.1-flash-1017'
      );

      // Парсим JSON из ответа
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setFeedback(parsed);
      }
    } catch (error) {
      console.error('Error analyzing response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userMessage.trim()) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🎯</span> Анализ вашего ответа
        </h3>
        <button
          onClick={analyzeResponse}
          disabled={isLoading || !apiKey}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isLoading ? 'Анализирую...' : 'Проанализировать'}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {feedback && !isLoading && (
        <div className="space-y-3">
          {/* Оценка */}
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-bold ${
              feedback.score >= 80 ? 'text-green-600' :
              feedback.score >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {feedback.score}
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    feedback.score >= 80 ? 'bg-green-600' :
                    feedback.score >= 60 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${feedback.score}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Сильные стороны */}
          {feedback.strengths.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">✓ Сильные стороны:</p>
              <ul className="space-y-1">
                {feedback.strengths.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Что улучшить */}
          {feedback.improvements.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">⚠ Что улучшить:</p>
              <ul className="space-y-1">
                {feedback.improvements.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Рекомендация */}
          {feedback.suggestion && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">💡 Рекомендация:</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.suggestion}</p>
            </div>
          )}
        </div>
      )}

      {!feedback && !isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
          Нажмите "Проанализировать" для получения обратной связи
        </p>
      )}
    </div>
  );
}
