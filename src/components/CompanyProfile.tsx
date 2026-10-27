export interface CompanyData {
  companyName: string;
  industry: string;
  companySize: string;
  product: string;
  targetAudience: string;
  painPoints: string;
  uniqueValue: string;
  meetingGoal: string;
  competitorMention: string;
  additionalInfo: string;
}

interface Props {
  data: CompanyData;
  onChange: (data: CompanyData) => void;
}

const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm bg-white placeholder-gray-400";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function CompanyProfile({ data, onChange }: Props) {
  const update = (field: keyof CompanyData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <span className="text-xl">🏢</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Профиль компании</h2>
          <p className="text-sm text-gray-500">Заполните информацию для персонализации скрипта</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Название вашей компании</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Например: TechSolutions"
            value={data.companyName}
            onChange={(e) => update('companyName', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Сфера деятельности</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Например: IT-консалтинг, SaaS, Производство"
            value={data.industry}
            onChange={(e) => update('industry', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Размер компании</label>
          <select
            className={inputClass}
            value={data.companySize}
            onChange={(e) => update('companySize', e.target.value)}
          >
            <option value="">Выберите...</option>
            <option value="1-10">1-10 сотрудников (стартап)</option>
            <option value="11-50">11-50 сотрудников (малый бизнес)</option>
            <option value="51-200">51-200 сотрудников (средний бизнес)</option>
            <option value="201-1000">201-1000 сотрудников</option>
            <option value="1000+">1000+ сотрудников (корпорация)</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Ваш продукт / услуга</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Что вы продаёте?"
            value={data.product}
            onChange={(e) => update('product', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Целевая аудитория (кто ваш клиент?)</label>
        <textarea
          className={inputClass + " h-20 resize-none"}
          placeholder="Опишите идеального клиента: должность, компания, задачи, боли..."
          value={data.targetAudience}
          onChange={(e) => update('targetAudience', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Основные боли / проблемы клиентов</label>
        <textarea
          className={inputClass + " h-20 resize-none"}
          placeholder="Какие проблемы решает ваш продукт? Что не даёт клиентам спать по ночам?"
          value={data.painPoints}
          onChange={(e) => update('painPoints', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Уникальное торговое предложение (УТП)</label>
        <textarea
          className={inputClass + " h-20 resize-none"}
          placeholder="Чем вы отличаетесь от конкурентов? Почему выбирают вас?"
          value={data.uniqueValue}
          onChange={(e) => update('uniqueValue', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Цель встречи</label>
          <select
            className={inputClass}
            value={data.meetingGoal}
            onChange={(e) => update('meetingGoal', e.target.value)}
          >
            <option value="">Выберите...</option>
            <option value="qualification">Квалификация лида</option>
            <option value="demo">Презентация / Демо</option>
            <option value="negotiation">Переговоры</option>
            <option value="closing">Закрытие сделки</option>
            <option value="followup">Follow-up встреча</option>
            <option value="cold">Холодная встреча</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Основные конкуренты</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Кого упоминают клиенты?"
            value={data.competitorMention}
            onChange={(e) => update('competitorMention', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Дополнительная информация</label>
        <textarea
          className={inputClass + " h-20 resize-none"}
          placeholder="Любая дополнительная информация, которая может помочь..."
          value={data.additionalInfo}
          onChange={(e) => update('additionalInfo', e.target.value)}
        />
      </div>
    </div>
  );
}
