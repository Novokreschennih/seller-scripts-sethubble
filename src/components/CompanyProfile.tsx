export interface CompanyData {
  // О бизнесе клиента
  clientName: string;
  businessName: string;
  industry: string;
  businessType: string; // online, offline, both
  companySize: string;
  avgCheck: string;
  clientsPerMonth: string;
  
  // Текущий маркетинг
  currentMarketing: string;
  marketingBudget: string;
  clientAcquisitionCost: string;
  
  // Боли
  painPoints: string;
  referralSystem: string; // есть/нет/частично
  
  // Цели
  meetingGoal: string;
  decisionMaker: string;
  
  // Дополнительно
  competitorsUsingReferral: string;
  additionalInfo: string;
}

interface Props {
  data: CompanyData;
  onChange: (data: CompanyData) => void;
}

const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm bg-white placeholder-gray-400";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
const sectionTitleClass = "text-lg font-bold text-gray-900 flex items-center gap-2 mb-4";

export default function CompanyProfile({ data, onChange }: Props) {
  const update = (field: keyof CompanyData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <span className="text-xl">🏢</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Профиль бизнеса клиента</h2>
          <p className="text-sm text-gray-500">Заполните данные для персонализации скрипта продажи SetHubble</p>
        </div>
      </div>

      {/* О бизнесе */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className={sectionTitleClass}>
          <span>👤</span> О бизнесе клиента
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Имя клиента / ЛПР</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Имя Отчество"
              value={data.clientName}
              onChange={(e) => update('clientName', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Название бизнеса</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Например: Салон красоты «Аврора»"
              value={data.businessName}
              onChange={(e) => update('businessName', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Сфера деятельности</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Например: Стоматология, Фитнес, Ритейл"
              value={data.industry}
              onChange={(e) => update('industry', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Тип бизнеса</label>
            <select
              className={inputClass}
              value={data.businessType}
              onChange={(e) => update('businessType', e.target.value)}
            >
              <option value="">Выберите...</option>
              <option value="offline">Офлайн (магазин, салон, клиника)</option>
              <option value="online">Онлайн (курс, SaaS, digital-услуги)</option>
              <option value="both">Онлайн + Офлайн</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Размер бизнеса</label>
            <select
              className={inputClass}
              value={data.companySize}
              onChange={(e) => update('companySize', e.target.value)}
            >
              <option value="">Выберите...</option>
              <option value="solo">Соло-предприниматель</option>
              <option value="1-5">1-5 сотрудников</option>
              <option value="6-20">6-20 сотрудников</option>
              <option value="21-50">21-50 сотрудников</option>
              <option value="50+">50+ сотрудников</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Средний чек</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Например: 3000₽, $100"
              value={data.avgCheck}
              onChange={(e) => update('avgCheck', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Клиентов в месяц</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Примерное количество"
              value={data.clientsPerMonth}
              onChange={(e) => update('clientsPerMonth', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>ЛПР (принимающий решение)</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Владелец, директор, маркетолог..."
              value={data.decisionMaker}
              onChange={(e) => update('decisionMaker', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Текущий маркетинг */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className={sectionTitleClass}>
          <span>📢</span> Текущий маркетинг
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Текущие каналы привлечения</label>
            <textarea
              className={inputClass + " h-20 resize-none"}
              placeholder="Контекст, таргет, соцсети, сарафанное радио..."
              value={data.currentMarketing}
              onChange={(e) => update('currentMarketing', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Бюджет на маркетинг / мес</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Например: 100 000₽"
              value={data.marketingBudget}
              onChange={(e) => update('marketingBudget', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Стоимость привлечения клиента (CAC)</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Сколько стоит 1 новый клиент?"
              value={data.clientAcquisitionCost}
              onChange={(e) => update('clientAcquisitionCost', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Система рекомендаций</label>
            <select
              className={inputClass}
              value={data.referralSystem}
              onChange={(e) => update('referralSystem', e.target.value)}
            >
              <option value="">Выберите...</option>
              <option value="none">Нет системы</option>
              <option value="partial">Частично (скидки постоянным)</option>
              <option value="full">Есть программа лояльности</option>
            </select>
          </div>
        </div>
      </div>

      {/* Боли и цели */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className={sectionTitleClass}>
          <span>🎯</span> Боли и цели
        </h3>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Основные боли / проблемы</label>
            <textarea
              className={inputClass + " h-20 resize-none"}
              placeholder="Дорогая реклама, нестабильный поток клиентов, нет системы рекомендаций..."
              value={data.painPoints}
              onChange={(e) => update('painPoints', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Цель встречи</label>
            <select
              className={inputClass}
              value={data.meetingGoal}
              onChange={(e) => update('meetingGoal', e.target.value)}
            >
              <option value="">Выберите...</option>
              <option value="cold">Холодная встреча / знакомство</option>
              <option value="presentation">Презентация SetHubble</option>
              <option value="demo">Демо / показ платформы</option>
              <option value="negotiation">Переговоры об условиях</option>
              <option value="closing">Закрытие на подключение</option>
              <option value="followup">Повторная встреча</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Конкуренты, использующие реферальные системы</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Известно ли, что конкуренты используют рекомендации?"
              value={data.competitorsUsingReferral}
              onChange={(e) => update('competitorsUsingReferral', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Дополнительная информация</label>
            <textarea
              className={inputClass + " h-20 resize-none"}
              placeholder="Контекст встречи, особенности, предыдущий опыт..."
              value={data.additionalInfo}
              onChange={(e) => update('additionalInfo', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Быстрый расчёт */}
      {data.avgCheck && data.clientsPerMonth && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>📊</span> Быстрый расчёт потенциала
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Текущий оборот/мес</p>
              <p className="text-lg font-bold text-gray-900">
                {(() => {
                  const check = parseFloat(data.avgCheck.replace(/[^\d.]/g, '')) || 0;
                  const clients = parseInt(data.clientsPerMonth.replace(/[^\d]/g, '')) || 0;
                  return `${(check * clients).toLocaleString()}${data.avgCheck.includes('$') ? '$' : '₽'}`;
                })()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">+30% через рекомендации</p>
              <p className="text-lg font-bold text-green-600">
                {(() => {
                  const check = parseFloat(data.avgCheck.replace(/[^\d.]/g, '')) || 0;
                  const clients = parseInt(data.clientsPerMonth.replace(/[^\d]/g, '')) || 0;
                  return `${Math.round(check * clients * 0.3).toLocaleString()}${data.avgCheck.includes('$') ? '$' : '₽'}`;
                })()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Экономия на маркетинге</p>
              <p className="text-lg font-bold text-indigo-600">
                {data.marketingBudget || '—'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
