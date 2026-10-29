import { useState } from 'react';
import { popularModels, badgeLabels, AIModel } from '../data/models';

interface Props {
  selectedModel: string;
  onChange: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onChange }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const displayedModels = showAll ? popularModels : popularModels.slice(0, 4);

  const handleCustomSave = () => {
    if (customModel.trim()) {
      onChange(customModel.trim());
      setShowCustom(false);
      setCustomModel('');
    }
  };

  const selectedModelData = popularModels.find(m => m.id === selectedModel);

  return (
    <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-5 border border-violet-200 dark:border-violet-800">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/50 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-xl">🤖</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white">Выбор ИИ-модели</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {selectedModelData ? (
              <span className="text-violet-600 dark:text-violet-400">
                ✓ Выбрана: {selectedModelData.name} ({selectedModelData.provider})
              </span>
            ) : (
              <span>Выберите модель для генерации скриптов</span>
            )}
          </p>
        </div>
      </div>

      {/* Список моделей */}
      <div className="space-y-2 mb-3">
        {displayedModels.map(model => (
          <button
            key={model.id}
            onClick={() => onChange(model.id)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedModel === model.id
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {model.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {model.provider}
                  </span>
                  {model.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badgeLabels[model.badge].color}`}>
                      {badgeLabels[model.badge].label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {model.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>📥 {model.inputPrice}₽ / 1M</span>
                  <span>📤 {model.outputPrice}₽ / 1M</span>
                  <span>📏 {model.context}</span>
                </div>
              </div>
              {selectedModel === model.id && (
                <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Показать все / Своя модель */}
      <div className="flex gap-2 flex-wrap">
        {!showAll && popularModels.length > 4 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
          >
            Показать все модели ({popularModels.length})
          </button>
        )}
        {showAll && popularModels.length > 4 && (
          <button
            onClick={() => setShowAll(false)}
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
          >
            Свернуть
          </button>
        )}
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
        >
          Ввести ID модели вручную
        </button>
      </div>

      {/* Кастомная модель */}
      {showCustom && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            ID модели (например: openai/gpt-4o)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="provider/model-name"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleCustomSave}
              disabled={!customModel.trim()}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              OK
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            📌 Полный список моделей: <a href="https://polza.ai/models" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">polza.ai/models</a>
          </p>
        </div>
      )}

      {/* Расчёт стоимости */}
      {selectedModelData && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 <strong>Ориентировочная стоимость:</strong> один скрипт (~2000 токенов) ≈{' '}
            <strong className="text-violet-600 dark:text-violet-400">
              {((selectedModelData.inputPrice * 1500 + selectedModelData.outputPrice * 500) / 1_000_000).toFixed(2)}₽
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
