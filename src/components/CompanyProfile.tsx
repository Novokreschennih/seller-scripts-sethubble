import { CompanyData, businessCategories } from '../data/methodologies';

interface Props {
  data: CompanyData;
  onChange: (data: CompanyData) => void;
}

export default function CompanyProfile({ data, onChange }: Props) {
  const update = (field: keyof CompanyData, value: string) => {
    onChange({ ...data, [field]: value });
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Минимум данных — максимум пользы для скрипта</p>
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
              placeholder="https://2gis.ru/... или https://yandex.ru/maps/..."
              value={data.mapLink}
              onChange={(e) => update('mapLink', e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 Ссылка для вашего контекста — приложение её не парсит
            </p>
          </div>
        </div>
      </div>

      {/* Категория бизнеса */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <span>🏢</span> Категория бизнеса
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Выберите то, что видно на карте/вывеске — это всё, что вам нужно знать заранее
        </p>
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

      {/* Дополнительные заметки */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <span>📝</span> Дополнительные заметки (опционально)
        </h3>
        <textarea
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all text-sm h-24 resize-none"
          placeholder="Если есть какая-то инфа о бизнесе — запишите. Например: 'Владелец жаловался в отзывах на рекламу' или 'Рядом открылся конкурент'"
          value={data.additionalNotes}
          onChange={(e) => update('additionalNotes', e.target.value)}
        />
      </div>

      {/* Подсказка */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>💡</span> Почему так мало полей?
        </h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>Вы не знаете бизнес изнутри</strong> — и это нормально. Боли, цели и характеристики 
            вы <strong>выявите в ходе разговора</strong> через правильные вопросы методики.
          </p>
          <p>
            <strong>Что вам нужно заранее:</strong> только категория бизнеса (это видно) и название. 
            Всё остальное — в диалоге.
          </p>
          <p>
            <strong>Скрипт поможет:</strong> задать правильные вопросы, выявить боли и подвести к преимуществам SetHubble.
          </p>
        </div>
      </div>

      {/* Анализ */}
      {(data.businessName || data.businessSubcategory) && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>✓</span> Готово к генерации скрипта
          </h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {data.businessName && (
              <p><strong>Бизнес:</strong> {data.businessName}</p>
            )}
            {data.businessSubcategory && (
              <p><strong>Тип:</strong> {data.businessSubcategory}</p>
            )}
            {data.mapLink && (
              <p>
                <strong>Карта:</strong>{' '}
                <a href={data.mapLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Открыть
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
