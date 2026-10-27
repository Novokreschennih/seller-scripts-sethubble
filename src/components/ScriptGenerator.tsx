import { useState } from 'react';
import { Methodology, pricingPlans } from '../data/methodologies';
import { CompanyData } from './CompanyProfile';

interface Props {
  methodology: Methodology;
  companyData: CompanyData;
}

function personalize(phrase: string, d: CompanyData): string {
  return phrase
    .replace(/\{industry\}/g, d.industry || 'ваша отрасль')
    .replace(/\{business_name\}/g, d.businessName || 'ваш бизнес')
    .replace(/\{client_name\}/g, d.clientName || '')
    .replace(/\{avg_check\}/g, d.avgCheck || 'ваш средний чек')
    .replace(/\{clients_per_month\}/g, d.clientsPerMonth || 'N')
    .replace(/\{marketing_budget\}/g, d.marketingBudget || 'ваш маркетинговый бюджет')
    .replace(/\{cac\}/g, d.clientAcquisitionCost || 'стоимость привлечения')
    .replace(/\{new_clients\}/g, (() => {
      const clients = parseInt(d.clientsPerMonth?.replace(/[^\d]/g, '') || '0');
      return clients ? String(Math.round(clients * 0.3)) : '30-50';
    })())
    .replace(/\{monthly_revenue\}/g, (() => {
      const check = parseFloat(d.avgCheck?.replace(/[^\d.]/g, '') || '0');
      const clients = parseInt(d.clientsPerMonth?.replace(/[^\d]/g, '') || '0');
      const rev = check * clients * 0.3;
      return rev ? `${Math.round(rev).toLocaleString()}${d.avgCheck?.includes('$') ? '$' : '₽'}` : '[рассчитать]';
    })())
    .replace(/\{potential_revenue\}/g, (() => {
      const check = parseFloat(d.avgCheck?.replace(/[^\d.]/g, '') || '0');
      const clients = parseInt(d.clientsPerMonth?.replace(/[^\d]/g, '') || '0');
      const rev = check * clients * 0.4;
      return rev ? `${Math.round(rev).toLocaleString()}${d.avgCheck?.includes('$') ? '$' : '₽'}` : '[рассчитать]';
    })())
    .replace(/\{lost_revenue\}/g, (() => {
      const check = parseFloat(d.avgCheck?.replace(/[^\d.]/g, '') || '0');
      const clients = parseInt(d.clientsPerMonth?.replace(/[^\d]/g, '') || '0');
      const rev = check * clients * 0.2;
      return rev ? `${Math.round(rev).toLocaleString()}${d.avgCheck?.includes('$') ? '$' : '₽'}` : '[рассчитать]';
    })())
    .replace(/\{current_spend\}/g, d.marketingBudget || 'ваш текущий бюджет')
    .replace(/\{competitor\}/g, d.competitorsUsingReferral || 'ваши конкуренты')
    .replace(/\{pain\}/g, d.painPoints || 'ключевая проблема')
    .replace(/\{revenue\}/g, (() => {
      const check = parseFloat(d.avgCheck?.replace(/[^\d.]/g, '') || '0');
      const rev = check * 50 * 3;
      return rev ? `${Math.round(rev).toLocaleString()}${d.avgCheck?.includes('$') ? '$' : '₽'}` : '[рассчитать]';
    })());
}

export default function ScriptGenerator({ methodology, companyData }: Props) {
  const [expandedSections, setExpandedSections] = useState<number[]>(
    methodology.sections.map((_, i) => i)
  );
  const [showPricing, setShowPricing] = useState(false);

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const generateScriptSection = (sectionIndex: number): string => {
    const section = methodology.sections[sectionIndex];
    let script = `## ${section.title}\n\n`;
    script += `**Цель:** ${section.description}\n\n`;
    script += `### Скрипт:\n\n`;

    section.templatePhrases.forEach((phrase, i) => {
      script += `${i + 1}. "${personalize(phrase, companyData)}"\n`;
    });

    script += `\n### 💡 Советы:\n`;
    section.tips.forEach(tip => {
      script += `• ${tip}\n`;
    });

    return script;
  };

  const generateFullScript = (): string => {
    let fullScript = `# СКРИПТ ВСТРЕЧИ — ПРОДАЖА SETHUBBLE\n`;
    fullScript += `Методика: ${methodology.name}\n`;
    if (companyData.businessName) fullScript += `Бизнес клиента: ${companyData.businessName}\n`;
    if (companyData.industry) fullScript += `Сфера: ${companyData.industry}\n`;
    if (companyData.clientName) fullScript += `Контакт: ${companyData.clientName}\n`;
    fullScript += `\n---\n\n`;

    methodology.sections.forEach((_, i) => {
      fullScript += generateScriptSection(i) + '\n\n---\n\n';
    });

    return fullScript;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">{methodology.icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Скрипт: {methodology.name}</h2>
            <p className="text-sm text-gray-500">
              {companyData.businessName ? `Для: ${companyData.businessName}` : 'Персонализированный скрипт'}
              {companyData.industry ? ` • ${companyData.industry}` : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPricing(!showPricing)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            💰 Тарифы
          </button>
          <button
            onClick={() => copyToClipboard(generateFullScript())}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Копировать всё
          </button>
        </div>
      </div>

      {/* Pricing block */}
      {showPricing && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200 mb-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💰</span> Тарифы SetHubble — для презентации клиенту
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900">{plan.name}</h4>
                <p className="text-indigo-600 font-semibold text-lg">{plan.price}</p>
                <p className="text-sm text-gray-500 mb-3">Комиссия: {plan.commission}</p>
                <ul className="space-y-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-3 italic">{plan.bestFor}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {methodology.sections.map((section, index) => (
          <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.includes(index) ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedSections.includes(index) && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 Шаблоны фраз:</h4>
                    <div className="space-y-2">
                      {section.templatePhrases.map((phrase, pi) => {
                        const personalized = personalize(phrase, companyData);
                        return (
                          <div key={pi} className="flex items-start gap-2 group">
                            <div className="flex-1 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100">
                              "{personalized}"
                            </div>
                            <button
                              onClick={() => copyToClipboard(personalized)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-200 rounded shrink-0"
                              title="Копировать"
                            >
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">💡 Советы:</h4>
                    <ul className="space-y-1">
                      {section.tips.map((tip, ti) => (
                        <li key={ti} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key SetHubble points */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200 mt-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>🔑</span> Ключевые аргументы SetHubble
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Бесплатное подключение — нулевой риск для клиента',
            'Оплата только за результат (от 1% с продаж)',
            'Готовые инструменты: сайты-визитки, QR-коды, флайеры',
            'Автоматический учёт рекомендаций и расчёт вознаграждений',
            'Клиенты остаются вашими (не уходят к конкурентам)',
            'Работает для онлайн и офлайн бизнеса',
            'Масштабирование через сеть партнёров',
            'Принимает криптоплатежи — обход ограничений'
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>✅</span> Чек-лист подготовки к встрече
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'Изучить сайт и соцсети бизнеса клиента',
            'Подготовить расчёт ROI на его цифрах',
            'Открыть демо sethubble.com — показать интерфейс',
            'Подготовить ответы на возражения (крипта, MLM)',
            'Иметь готовую ссылку на регистрацию',
            'Подготовить PDF-флайер для демонстрации',
            'Узнать имена и роли участников встречи',
            'Поставить цель: подключение на бесплатном плане'
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-700 transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
