import { useState } from 'react';
import { CompanyData } from '../data/methodologies';
import { generateWithPolza, PolzaMessage } from '../utils/polza';

interface Props {
  companyData: CompanyData;
  apiKey?: string;
  selectedModel?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SalesTrainer({ companyData, apiKey, selectedModel }: Props) {
  const [scenario, setScenario] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const scenarios = [
    {
      id: 'cold_meeting',
      name: 'Холодная встреча',
      icon: '🤝',
      description: 'Первый контакт с потенциальным клиентом'
    },
    {
      id: 'presentation',
      name: 'Презентация SetHubble',
      icon: '📊',
      description: 'Показ платформы и её возможностей'
    },
    {
      id: 'objection_expensive',
      name: 'Возражение: "Дорого"',
      icon: '💰',
      description: 'Клиент считает, что тарифы высокие'
    },
    {
      id: 'objection_mlm',
      name: 'Возражение: "Это MLM"',
      icon: '🔄',
      description: 'Клиент путает с сетевым маркетингом'
    },
    {
      id: 'objection_crypto',
      name: 'Возражение: "Не работаю с криптой"',
      icon: '₿',
      description: 'Клиент не хочет использовать криптовалюту'
    },
    {
      id: 'closing',
      name: 'Закрытие сделки',
      icon: '✅',
      description: 'Финальный этап — подключение клиента'
    }
  ];

  const startScenario = async () => {
    if (!apiKey || !scenario) return;

    setIsLoading(true);
    setIsStarted(true);
    setMessages([]);

    const scenarioData = scenarios.find(s => s.id === scenario);
    const businessName = companyData.businessName || 'ваш бизнес';
    const businessType = companyData.businessSubcategory || 'бизнес';

    const systemPrompt = getScenarioPrompt(scenario, businessName, businessType);

    try {
      const response = await generateWithPolza(
        apiKey,
        [{ role: 'user', content: systemPrompt }],
        selectedModel || 'deepseek/deepseek-v4.1-flash-1017'
      );

      setMessages([{
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages([{
        role: 'assistant',
        content: 'Извините, произошла ошибка при запуске сценария. Проверьте API-ключ и попробуйте снова.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getScenarioPrompt = (scenarioId: string, businessName: string, businessType: string): string => {
    const basePrompt = `Ты — ${businessName ? `владелец бизнеса "${businessName}"` : 'предприниматель'}, который работает в сфере "${businessType}". 
Ты скептически относишься к новым предложениям, но готов выслушать, если увидишь реальную пользу.
Твоя задача — играть роль клиента на встрече с продавцом платформы SetHubble.

Отвечай кратко (2-3 предложения), задавай уточняющие вопросы, выражай сомнения, но будь реалистичным.
Не соглашайся сразу — требуй аргументов и доказательств.`;

    const scenarioPrompts: Record<string, string> = {
      'cold_meeting': `${basePrompt}

Сценарий: Это первая встреча. Ты не знаешь, что тебе будут предлагать. Ты занят, у тебя мало времени.
Начни с короткого приветствия и вопроса "Что вы хотели мне показать?"`,

      'presentation': `${basePrompt}

Сценарий: Тебе уже вкратце рассказали о SetHubble. Сейчас тебе показывают платформу подробнее.
Ты интересуешься, но сомневаешься. Задавай вопросы о том, как это работает именно для твоего бизнеса.
Начни с вопроса "Хорошо, я понял общую идею. Но как это будет работать именно для моего бизнеса?"`,

      'objection_expensive': `${basePrompt}

Сценарий: Тебе показали тарифы. Ты считаешь, что это дорого.
Начни с возражения: "Смотрите, я посчитал. Даже самый дешёвый тариф — это дополнительные расходы. А я не уверен, что это окупится."`,

      'objection_mlm': `${basePrompt}

Сценарий: Ты услышал о партнёрской программе и подозреваешь, что это сетевой маркетинг.
Начни с возражения: "Подождите, это что, сетевой маркетинг? Я не хочу этим заниматься."`,

      'objection_crypto': `${basePrompt}

Сценарий: Тебе объяснили, что SetHubble работает с криптовалютой. Ты не хочешь с этим связываться.
Начни с возражения: "Я слышал, вы работаете с криптовалютой. Я не хочу иметь с этим ничего общего."`,

      'closing': `${basePrompt}

Сценарий: Вы уже обсудили все детали. Ты почти готов подписать, но есть последние сомнения.
Задавай финальные вопросы перед принятием решения. Начни с "В целом интересно, но у меня есть пара вопросов перед тем, как я приму решение..."`
    };

    return scenarioPrompts[scenarioId] || scenarioPrompts['cold_meeting'];
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !apiKey) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationHistory: PolzaMessage[] = messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    conversationHistory.push({
      role: 'user',
      content: input
    });

    try {
      const response = await generateWithPolza(apiKey, conversationHistory, selectedModel || 'deepseek/deepseek-v4.1-flash-1017');

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте снова.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScenario = () => {
    setMessages([]);
    setIsStarted(false);
    setInput('');
  };

  if (!apiKey) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-6xl mb-4">🎭</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Тренажёр продаж</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Для использования тренажёра необходим API-ключ Polza.ai
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Добавьте ключ в разделе "API-ключ" на главной странице
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
          <span className="text-xl">🎭</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Тренажёр продаж</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Потренируйтесь в продажах с ИИ-клиентом
          </p>
        </div>
      </div>

      {!isStarted ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Выберите сценарий
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {scenarios.map(s => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  scenario === s.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-medium text-gray-900 dark:text-white">{s.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{s.description}</div>
              </button>
            ))}
          </div>

          <button
            onClick={startScenario}
            disabled={!scenario || isLoading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Запуск...' : 'Начать сценарий'}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {scenarios.find(s => s.id === scenario)?.name}
            </h3>
            <button
              onClick={resetScenario}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Начать заново
            </button>
          </div>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="text-sm mb-1">
                    {msg.role === 'user' ? '👤 Вы' : '🤵 Клиент'}
                  </div>
                  <div>{msg.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Введите ваш ответ..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Отправить
            </button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>💡</span> Советы по использованию тренажёра
        </h3>
        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>• Отвечайте так, как отвечали бы реальному клиенту</li>
          <li>• Используйте фразы из сгенерированных скриптов</li>
          <li>• Тренируйтесь работать с возражениями</li>
          <li>• Пробуйте разные сценарии для разных ситуаций</li>
          <li>• ИИ-клиент будет реагировать реалистично — не соглашайтесь сразу</li>
        </ul>
      </div>
    </div>
  );
}
