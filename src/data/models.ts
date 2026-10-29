// Популярные модели Polza.ai для текстовых задач с ценами в рублях за 1M токенов
// Цены актуальны на 2026 год, обновляются на polza.ai/models

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  inputPrice: number; // ₽ за 1M токенов (вход)
  outputPrice: number; // ₽ за 1M токенов (выход)
  context: string;
  description: string;
  badge?: 'cheap' | 'balanced' | 'premium' | 'fast';
}

export const popularModels: AIModel[] = [
  // Бюджетные
  {
    id: 'deepseek/deepseek-v4.1-flash-1017',
    name: 'DeepSeek V4.1 Flash',
    provider: 'DeepSeek',
    inputPrice: 11.54,
    outputPrice: 17.13,
    context: '1M',
    description: 'Быстрая и дешёвая. Отличный выбор для большинства задач.',
    badge: 'cheap'
  },
  {
    id: 'anthropic/claude-haiku-5.5',
    name: 'Claude Haiku 5.5',
    provider: 'Anthropic',
    inputPrice: 11.66,
    outputPrice: 58.32,
    context: '1M',
    description: 'Быстрая модель Anthropic. Хороша для суммаризации и классификации.',
    badge: 'fast'
  },
  {
    id: 'minimax/minimax-m3.1-flash',
    name: 'MiniMax M3.1 Flash',
    provider: 'MiniMax',
    inputPrice: 16.28,
    outputPrice: 65.11,
    context: '1M',
    description: 'Мультимодальная модель для программирования и агентных задач.',
    badge: 'fast'
  },
  // Средние
  {
    id: 'openai/gpt-6.1-terra',
    name: 'GPT-6.1 Terra',
    provider: 'OpenAI',
    inputPrice: 57.11,
    outputPrice: 285.56,
    context: '1M',
    description: 'Универсальная модель OpenAI. Отлично подходит для продаж и диалогов.',
    badge: 'balanced'
  },
  {
    id: 'perceptron/perceptron-mk1.5',
    name: 'Perceptron Mk1.5',
    provider: 'Perceptron',
    inputPrice: 17.13,
    outputPrice: 171.34,
    context: '37K',
    description: 'Мультимодальная модель для рассуждений и анализа.',
    badge: 'balanced'
  },
  // Премиум
  {
    id: 'anthropic/claude-sonnet-5.5',
    name: 'Claude Sonnet 5.5',
    provider: 'Anthropic',
    inputPrice: 186.62,
    outputPrice: 933.09,
    context: '1M',
    description: 'Топовая модель Anthropic. Лучшее качество для сложных задач.',
    badge: 'premium'
  },
  {
    id: 'openai/gpt-6.1-sol',
    name: 'GPT-6.1 Sol',
    provider: 'OpenAI',
    inputPrice: 116.64,
    outputPrice: 583.19,
    context: '1M',
    description: 'Мощная модель OpenAI для сложных рабочих процессов.',
    badge: 'premium'
  },
  {
    id: 'google/gemini-4-argon',
    name: 'Gemini 4 Argon',
    provider: 'Google',
    inputPrice: 116.64,
    outputPrice: 583.21,
    context: '1M',
    description: 'Флагман Google для анализа и программирования.',
    badge: 'premium'
  },
  {
    id: 'qwen/qwen3.8-max-prime',
    name: 'Qwen3.8 Max Prime',
    provider: 'Qwen',
    inputPrice: 456.9,
    outputPrice: 1370.7,
    context: '1M',
    description: 'Мультимодальная модель для исследований и длительной работы.',
    badge: 'premium'
  }
];

export const badgeLabels: Record<string, { label: string; color: string }> = {
  cheap: { label: '💰 Дешёвая', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  fast: { label: '⚡ Быстрая', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  balanced: { label: '⚖️ Баланс', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
  premium: { label: '👑 Премиум', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' }
};
