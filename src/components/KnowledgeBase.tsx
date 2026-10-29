import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  category: string;
  icon: string;
  content: string;
  keyPoints: string[];
}

const articles: Article[] = [
  {
    id: 'spin',
    title: 'Методика SPIN-продаж',
    category: 'Методики',
    icon: '🎯',
    content: `SPIN — это методика структурированных вопросов, разработанная Нилом Рэкхемом. Она помогает выявлять скрытые потребности клиента через четыре типа вопросов:

**S (Situational) — Ситуационные вопросы**
Узнайте текущую ситуацию клиента. Не спрашивайте то, что можно найти в открытых источниках.

**P (Problem) — Проблемные вопросы**
Выявите трудности и проблемы, с которыми сталкивается клиент.

**I (Implication) — Извлекающие вопросы**
Покажите последствия проблем. Помогите клиенту осознать масштаб.

**N (Need-payoff) — Направляющие вопросы**
Помогите клиенту самому сформулировать потребность в решении.`,
    keyPoints: [
      'Не задавайте больше 2-3 ситуационных вопросов',
      'Извлекающие вопросы — самые важные в SPIN',
      'Клиент должен сам сказать, что ему нужно решение',
      'Не презентуйте продукт до этапа Need-payoff'
    ]
  },
  {
    id: 'aida',
    title: 'Методика AIDA',
    category: 'Методики',
    icon: '🚀',
    content: `AIDA — классическая модель рекламного воздействия:

**A (Attention) — Внимание**
Захватите внимание с первых секунд. Используйте факт, вопрос или провокацию.

**I (Interest) — Интерес**
Поддержите интерес, раскрыв релевантность для конкретного клиента.

**D (Desire) — Желание**
Сформируйте желание получить решение, показав конкретные выгоды.

**A (Action) — Действие**
Чёткий призыв к следующему шагу. Уберите неопределённость.`,
    keyPoints: [
      'У вас 7-10 секунд на первое впечатление',
      'Говорите о клиенте, а не о себе',
      'Используйте социальное доказательство',
      'Один конкретный следующий шаг'
    ]
  },
  {
    id: 'challenger',
    title: 'Challenger Sale',
    category: 'Методики',
    icon: '💡',
    content: `Challenger Sale — методика для сложных B2B-продаж:

**Teach — Обучение**
Покажите клиенту то, чего он не знал. Дайте новый взгляд на его бизнес.

**Tailor — Адаптация**
Адаптируйте сообщение под конкретного клиента и его контекст.

**Take Control — Взять контроль**
Ведите разговор, не бойтесь давить на боль и предлагать конкретные шаги.`,
    keyPoints: [
      'Принесите инсайт из другой отрасли или исследования',
      'Покажите, что понимаете именно ЕГО бизнес',
      'Не бойтесь говорить о деньгах прямо',
      'Создавайте конструктивное напряжение'
    ]
  },
  {
    id: 'objections',
    title: 'Работа с возражениями',
    category: 'Техники',
    icon: '🛡️',
    content: `Возражения — это не отказ, а запрос на дополнительную информацию. Основные техники:

**Присоединение**
"Понимаю вас", "Согласен", "Это важный вопрос"

**Уточнение**
"Что именно вас беспокоит?", "Можете уточнить?"

**Изоляция**
"Если мы решим этот вопрос, вы готовы двигаться дальше?"

**Аргументация**
Приведите факты, цифры, кейсы

**Закрытие**
"Что ещё мешает принять решение?"`,
    keyPoints: [
      'Не спорьте — присоединяйтесь',
      'Выслушайте возражение до конца',
      'Задавайте уточняющие вопросы',
      'Возвращайтесь к выгодам'
    ]
  },
  {
    id: 'closing',
    title: 'Техники закрытия сделки',
    category: 'Техники',
    icon: '✅',
    content: `Закрытие — это не давление, а помощь клиенту в принятии решения:

**Закрытие выбором**
"Вам удобнее начать с понедельника или со среды?"

**Закрытие резюмированием**
"Итак, мы договорились о... Правильно?"

**Закрытие дефицитом**
"Это предложение действует до конца недели"

**Закрытие пробным**
"Если бы мы могли решить эту проблему, вы бы начали?"

**Заключение прямого вопроса**
"Что нужно сделать, чтобы начать сотрудничество?"`,
    keyPoints: [
      'Подведите итоги перед закрытием',
      'Предложите конкретный следующий шаг',
      'Не бойтесь паузы после вопроса',
      'Помогите клиенту принять решение'
    ]
  },
  {
    id: 'sethubble',
    title: 'Продажа SetHubble',
    category: 'Продукт',
    icon: '🌐',
    content: `SetHubble — платформа для оцифровки сарафанного радио. Ключевые преимущества:

**Для бизнеса:**
- Бесплатный старт (план "Самолёт")
- Оплата только за результат (комиссия 1-5%)
- Автоматический учёт рекомендаций
- Готовые инструменты (QR-коды, сайты-визитки)

**Для партнёров:**
- Прозрачная система вознаграждений
- Персональные ссылки и промокоды
- Моментальный вывод средств

**Тарифы:**
- Самолёт: 5% комиссия, бесплатно
- Ракета: 3% комиссия, $110/год
- Шаттл: 1% комиссия, $350/год`,
    keyPoints: [
      'Подчеркивайте нулевой риск',
      'Показывайте ROI на цифрах клиента',
      'Используйте кейсы из похожей сферы',
      'Помогайте начать с бесплатного плана'
    ]
  }
];

export default function KnowledgeBase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = ['all', ...new Set(articles.map(a => a.category))];
  
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к списку
        </button>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-5xl mb-4">{selectedArticle.icon}</div>
          <h1 className="text-3xl font-bold mb-2">{selectedArticle.title}</h1>
          <p className="text-white/80">{selectedArticle.category}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="prose dark:prose-invert max-w-none">
            {selectedArticle.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>💡</span> Ключевые моменты
          </h3>
          <ul className="space-y-2">
            {selectedArticle.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">📚 База знаний</h1>
        <p className="text-white/90 text-lg">
          Статьи по методикам продаж, техникам и продукту SetHubble
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map(article => (
          <button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg text-left"
          >
            <div className="text-4xl mb-3">{article.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {article.category}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
              {article.content.split('\n\n')[0]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
