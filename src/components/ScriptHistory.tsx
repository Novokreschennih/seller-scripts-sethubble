import { useState } from 'react';
import { SavedScript } from '../hooks/useScriptHistory';

interface Props {
  scripts: SavedScript[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearAll: () => void;
  onLoadScript: (script: SavedScript) => void;
}

export default function ScriptHistory({ scripts, onDelete, onToggleFavorite, onClearAll, onLoadScript }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.methodology.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || (filter === 'favorites' && script.isFavorite);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    if (hours < 24) return `${hours} ч. назад`;
    if (days < 7) return `${days} дн. назад`;
    return date.toLocaleDateString('ru-RU');
  };

  if (scripts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          История пуста
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Сохранённые скрипты появятся здесь
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок и поиск */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
            <span className="text-xl">📚</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">История скриптов</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {scripts.length} {scripts.length === 1 ? 'скрипт' : 'скриптов'} сохранено
            </p>
          </div>
        </div>

        <button
          onClick={onClearAll}
          className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Очистить всё
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Поиск по названию, методике..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'favorites'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            ⭐ Избранное
          </button>
        </div>
      </div>

      {/* Список скриптов */}
      <div className="space-y-3">
        {filteredScripts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Ничего не найдено
          </div>
        ) : (
          filteredScripts.map(script => (
            <div
              key={script.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                      {script.businessName || 'Без названия'}
                    </h3>
                    {script.isFavorite && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span>📋</span>
                      {script.methodology}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🏢</span>
                      {script.category || 'Не указана'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🕒</span>
                      {formatDate(script.createdAt)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                    {script.content.slice(0, 200)}...
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onLoadScript(script)}
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Загрузить
                    </button>
                    <button
                      onClick={() => onToggleFavorite(script.id)}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {script.isFavorite ? '⭐ Убрать из избранного' : '☆ В избранное'}
                    </button>
                    <button
                      onClick={() => onDelete(script.id)}
                      className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
