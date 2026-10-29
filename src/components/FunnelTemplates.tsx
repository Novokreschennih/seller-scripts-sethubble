import { useState } from 'react';
import { funnelStages, funnelTips, FunnelStage } from '../data/funnelTemplates';

export default function FunnelTemplates() {
  const [selectedStage, setSelectedStage] = useState<FunnelStage | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllPhrases = (phrases: string[]) => {
    const text = phrases.join('\n\n');
    navigator.clipboard.writeText(text);
  };

  if (selectedStage) {
    return (
      <div className="space-y-6">
        {/* Заголовок этапа */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <button
            onClick={() => setSelectedStage(null)}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к этапам
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{selectedStage.icon}</div>
            <div>
              <h2 className="text-3xl font-bold">{selectedStage.name}</h2>
              <p className="text-white/80 mt-1">⏱ {selectedStage.duration}</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="font-medium mb-2">🎯 Цель этапа:</p>
            <p className="text-lg">{selectedStage.goal}</p>
          </div>
        </div>

        {/* Описание */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">📝 Описание</h3>
          <p className="text-gray-700 dark:text-gray-300">{selectedStage.description}</p>
        </div>

        {/* Ключевые моменты */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🔑 Ключевые моменты</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {selectedStage.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{i + 1}.</span>
                <span className="text-gray-700 dark:text-gray-300">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Скрипт */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">💬 Готовый скрипт</h3>
            <button
              onClick={() => copyAllPhrases(selectedStage.script)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              📋 Копировать всё
            </button>
          </div>
          
          <div className="space-y-4">
            {selectedStage.script.map((phrase, i) => (
              <div key={i} className="relative group">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 pr-12">
                  <p className="text-gray-700 dark:text-gray-300 italic">"{phrase}"</p>
                </div>
                <button
                  onClick={() => copyToClipboard(phrase, i)}
                  className="absolute right-2 top-2 p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                  title="Копировать фразу"
                >
                  {copiedIndex === i ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Советы */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💡 Советы</h3>
          <ul className="space-y-2">
            {selectedStage.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Типичные ошибки */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">⚠️ Типичные ошибки</h3>
          <ul className="space-y-2">
            {selectedStage.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span className="text-gray-700 dark:text-gray-300">{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">📊 Шаблоны по этапам воронки</h1>
        <p className="text-white/90 text-lg">
          Готовые скрипты для каждого этапа продажи SetHubble
        </p>
      </div>

      {/* Этапы воронки */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funnelStages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setSelectedStage(stage)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg text-left"
          >
            <div className="text-4xl mb-3">{stage.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {stage.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              ⏱ {stage.duration}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
              {stage.goal}
            </p>
          </button>
        ))}
      </div>

      {/* Общие советы */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">💡 Общие советы</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📋 Во время встречи
            </h3>
            <ul className="space-y-2">
              {funnelTips.general.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🎯 Подготовка
            </h3>
            <ul className="space-y-2">
              {funnelTips.preparation.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📧 Follow-up после встречи
            </h3>
            <ul className="space-y-2">
              {funnelTips.followUp.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Визуализация воронки */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔄 Воронка продаж</h2>
        
        <div className="space-y-3">
          {funnelStages.map((stage, i) => (
            <div key={stage.id} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {i + 1}
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{stage.icon}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{stage.name}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">⏱ {stage.duration}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stage.goal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
