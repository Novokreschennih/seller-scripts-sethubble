import { useState, useEffect } from 'react';

interface Props {
  apiKey: string;
  onChange: (key: string) => void;
}

export default function ApiKeyManager({ apiKey, onChange }: Props) {
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    onChange(tempKey);
  };

  const handleClear = () => {
    setTempKey('');
    onChange('');
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-xl">🔑</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white">API-ключ Polza.ai</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {apiKey ? (
              <span className="text-green-600 dark:text-green-400">✓ ИИ активен — скрипты генерируются индивидуально</span>
            ) : (
              <span>Без ключа используются заготовленные шаблоны</span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="pk-..."
            className="w-full px-4 py-2.5 pr-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all text-sm font-mono"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {showKey ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!tempKey.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Сохранить ключ
          </button>
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Очистить
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>📌 Получить ключ: <a href="https://polza.ai/dashboard/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">polza.ai/dashboard/api-keys</a></p>
          <p>💰 Стоимость: ~0.01-0.05₽ за генерацию скрипта</p>
          <p>🔒 Ключ хранится только в вашем браузере (localStorage)</p>
        </div>
      </div>
    </div>
  );
}
