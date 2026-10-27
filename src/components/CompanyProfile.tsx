import {
  CompanyData,
  businessCategories,
  businessCharacteristics,
  businessGoals,
  businessPains
} from '../data/methodologies';

interface Props {
  data: CompanyData;
  onChange: (data: CompanyData) => void;
}

export default function CompanyProfile({ data, onChange }: Props) {
  const update = (field: keyof CompanyData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleCharacteristic = (id: string) => {
    const current = data.characteristics || [];
    if (current.includes(id)) {
      update('characteristics', current.filter((c: string) => c !== id));
    } else {
      update('characteristics', [...current, id]);
    }
  };

  const toggleGoal = (id: string) => {
    const current = data.mainGoals || [];
    if (current.includes(id)) {
      update('mainGoals', current.filter((g: string) => g !== id));
    } else {
      update('mainGoals', [...current, id]);
    }
  };

  const togglePain = (id: string) => {
    const current = data.mainPains || [];
    if (current.includes(id)) {
      update('mainPains', current.filter((p: string) => p !== id));
    } else {
      update('mainPains', [...current, id]);
    }
  };

  const selectedCategory = businessCategories.find(c => c.id === data.businessCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
          <span className="text-xl">🎯</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Профиль компании клиента</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Выберите характеристики для генерации персонализированного скрипта</p>
        </div>
      </div>

      {/* Основная информация */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <span>📋</span> Основная информация
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Название бизнеса</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all text-sm"
              placeholder="Например: Салон красоты «Аврора»"
              value={data.businessName}
              onChange={(e) => update('businessName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Ссылка на компанию (2ГИС, Яндекс Карты, Google Maps)
            </label>
            <input
              type="url"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all text-sm"
              placeholder="https://2gis.ru/... или https://yandex.ru/maps/... или https://goo.gl/maps/..."
              value={data.mapLink}
              onChange={(e) => update('mapLink', e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 Вставьте ссылку — система проанализирует информацию о компании
            </p>
          </div>
        </div>
      </div>

      {/* Категория бизнеса */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <span>🏢</span> Категория бизнеса
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {businessCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => update('businessCategory', cat.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                data.businessCategory === cat.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</div>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Уточните тип:</label>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => update('businessSubcategory', sub)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    data.businessSubcategory === sub
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Характеристики */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <span>✨</span> Ключевые характеристики
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(выберите все подходящие)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businessCharacteristics.map(char => (
            <label
              key={char.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.characteristics?.includes(char.id)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <input
                type="checkbox"
                checked={data.characteristics?.includes(char.id) || false}
                onChange={() => toggleCharacteristic(char.id)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{char.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{char.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Цели */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <span>🎯</span> Цели бизнеса
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(что хочет достичь клиент)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businessGoals.map(goal => (
            <label
              key={goal.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.mainGoals?.includes(goal.id)
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
              }`}
            >
              <input
                type="checkbox"
                checked={data.mainGoals?.includes(goal.id) || false}
                onChange={() => toggleGoal(goal.id)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{goal.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{goal.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Боли */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <span>😣</span> Боли бизнеса
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(что мешает клиенту)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businessPains.map(pain => (
            <label
              key={pain.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.mainPains?.includes(pain.id)
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
              }`}
            >
              <input
                type="checkbox"
                checked={data.mainPains?.includes(pain.id) || false}
                onChange={() => togglePain(pain.id)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{pain.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{pain.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Дополнительные заметки */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <span>📝</span> Дополнительные заметки
        </h3>
        <textarea
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all text-sm h-24 resize-none"
          placeholder="Любая дополнительная информация о встрече, контексте, особенностях..."
          value={data.additionalNotes}
          onChange={(e) => update('additionalNotes', e.target.value)}
        />
      </div>

      {/* Анализ */}
      {(data.businessName || data.mapLink) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>🔍</span> Анализ для скрипта
          </h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {data.businessName && (
              <p><strong>Бизнес:</strong> {data.businessName}</p>
            )}
            {data.businessSubcategory && (
              <p><strong>Тип:</strong> {data.businessSubcategory}</p>
            )}
            {data.characteristics?.length > 0 && (
              <p>
                <strong>Особенности:</strong> {data.characteristics.length} характеристик выбрано
              </p>
            )}
            {data.mainGoals?.length > 0 && (
              <p>
                <strong>Цели:</strong> {data.mainGoals.length} целей
              </p>
            )}
            {data.mainPains?.length > 0 && (
              <p>
                <strong>Боли:</strong> {data.mainPains.length} болей
              </p>
            )}
            {data.mapLink && (
              <p>
                <strong>Ссылка:</strong>{' '}
                <a href={data.mapLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Открыть на карте
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
