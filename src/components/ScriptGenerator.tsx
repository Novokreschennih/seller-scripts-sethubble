import { useState, useEffect } from 'react';
import { Methodology, pricingPlans, commissionDistribution, tariffFAQ, businessCategories, CompanyData } from '../data/methodologies';
import { generateWithPolza, buildPrompt } from '../utils/polza';

interface Props {
  methodology: Methodology;
  companyData: CompanyData;
  apiKey?: string;
}

function personalize(phrase: string, d: CompanyData): string {
  const category = businessCategories.find(c => c.id === d.businessCategory);
  const categoryName = category?.name || 'ваш бизнес';
  const subcategory = d.businessSubcategory || categoryName;

  return phrase
    .replace(/\{business_name\}/g, d.businessName || 'ваш бизнес')
    .replace(/\{category\}/g, categoryName)
    .replace(/\{subcategory\}/g, subcategory)
    .replace(/\{additional\}/g, d.additionalNotes || '');
}

export default function ScriptGenerator({ methodology, companyData, apiKey }: Props) {
  const [expandedSections, setExpandedSections] = useState<number[]>(
    methodology.sections.map((_, i) => i)
  );
  const [showPricing, setShowPricing] = useState(false);
  const [showCommission, setShowCommission] = useState(false);
  const [aiPhrases, setAiPhrases] = useState<Record<number, string[]>>({});
  const [loadingSections, setLoadingSections] = useState<Set<number>>(new Set());
  const [useAI, setUseAI] = useState(!!apiKey);
  const [showFAQ, setShowFAQ] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

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
    if (companyData.businessSubcategory) fullScript += `Тип: ${companyData.businessSubcategory}\n`;
    fullScript += `\n---\n\n`;

    methodology.sections.forEach((_, i) => {
      fullScript += generateScriptSection(i) + '\n\n---\n\n';
    });

    return fullScript;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateAISection = async (sectionIndex: number) => {
    if (!apiKey) return;
    
    const section = methodology.sections[sectionIndex];
    setLoadingSections(prev => new Set(prev).add(sectionIndex));
    
    try {
      const messages = buildPrompt(
        methodology.name,
        companyData,
        section.title,
        section.description
      );
      
      const response = await generateWithPolza(apiKey, messages);
      
      // Парсим ответ - извлекаем фразы из формата "1. "фраза""
      const phrases = response
        .split('\n')
        .filter(line => line.match(/^\d+\.\s*["«]/))
        .map(line => line.replace(/^\d+\.\s*["«]?(.*?)["»]?\s*$/, '$1').trim())
        .filter(Boolean);
      
      if (phrases.length > 0) {
        setAiPhrases(prev => ({ ...prev, [sectionIndex]: phrases }));
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert(`Ошибка генерации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoadingSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionIndex);
        return newSet;
      });
    }
  };

  const category = businessCategories.find(c => c.id === companyData.businessCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">{methodology.icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Скрипт: {methodology.name}</h2>
            <p className="text-sm text-gray-500">
              {companyData.businessName ? `Для: ${companyData.businessName}` : 'Персонализированный скрипт'}
              {companyData.businessSubcategory ? ` • ${companyData.businessSubcategory}` : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowPricing(!showPricing)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-sm font-medium ${showPricing ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            💰 Тарифы
          </button>
          <button
            onClick={() => setShowCommission(!showCommission)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-sm font-medium ${showCommission ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            📊 Комиссия
          </button>
          <button
            onClick={() => setShowFAQ(!showFAQ)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-sm font-medium ${showFAQ ? 'bg-amber-50 border-amber-300 text-amber-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            ❓ FAQ
          </button>
          <button
            onClick={() => copyToClipboard(generateFullScript())}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Копировать
          </button>
        </div>
      </div>

      {/* Business summary */}
      {(companyData.businessName || companyData.businessSubcategory) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🎯</span> Контекст для скрипта
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {companyData.businessName && (
              <p><strong>Бизнес:</strong> {companyData.businessName}</p>
            )}
            {companyData.businessSubcategory && (
              <p><strong>Тип:</strong> {companyData.businessSubcategory}</p>
            )}
            {companyData.mapLink && (
              <p>
                <strong>Карта:</strong>{' '}
                <a href={companyData.mapLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  Открыть
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Pricing block */}
      {showPricing && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200 mb-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💰</span> Тарифы SetHubble — из личного кабинета
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`bg-white rounded-lg p-4 border-2 ${i === 2 ? 'border-indigo-400 shadow-lg' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900">{plan.name}</h4>
                  {i === 2 && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Рекомендуем</span>}
                </div>
                <p className="text-indigo-600 font-semibold text-xl">{plan.price}</p>
                <p className="text-xs text-gray-500 mb-3">{plan.priceNote}</p>
                <div className="bg-gray-50 rounded p-2 mb-3">
                  <p className="text-xs text-gray-600"><strong>Комиссия при выводе:</strong> {plan.commission}</p>
                  <p className="text-xs text-gray-500 italic mt-1">{plan.example}</p>
                </div>
                <ul className="space-y-1.5">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-3 italic border-t border-gray-100 pt-2">{plan.bestFor}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <strong>⚠️ Важно:</strong> Тариф открывает функции и лимиты кабинета. Он НЕ является вкладом, инвестицией или гарантией дохода. Начисление возможно только при наличии соответствующей операции.
            </p>
          </div>
        </div>
      )}

      {/* Commission distribution */}
      {showCommission && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200 mb-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> Как платформа делит комиссию
          </h3>
          <p className="text-sm text-gray-700 mb-3">{commissionDistribution.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {commissionDistribution.breakdown.map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500">{item.role}</p>
                <p className="text-lg font-bold text-emerald-600">{item.share}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">{commissionDistribution.example.title}:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p className="text-gray-600">Вывод: <strong>{commissionDistribution.example.withdrawal}</strong></p>
              <p className="text-gray-600">Тариф: <strong>{commissionDistribution.example.tariff}</strong></p>
              <p className="text-gray-600">Общая комиссия: <strong>{commissionDistribution.example.totalCommission}</strong></p>
              <p className="text-gray-600">Прямому пригласившему: <strong>{commissionDistribution.example.directInviter}</strong></p>
              <p className="text-gray-600">Уровни 2-10: <strong>{commissionDistribution.example.levels2to10}</strong></p>
              <p className="text-gray-600">Всего пригласившим: <strong className="text-emerald-600">{commissionDistribution.example.totalToInviters}</strong></p>
              <p className="text-gray-600">Платформе: <strong>{commissionDistribution.example.toPlatform}</strong></p>
              <p className="text-gray-600">Продавец получает: <strong className="text-indigo-600">{commissionDistribution.example.sellerReceives}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {showFAQ && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>❓</span> FAQ по тарифам — ответы на вопросы клиента
          </h3>
          <div className="space-y-2">
            {tariffFAQ.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-gray-900">{item.question}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ml-2 ${expandedFAQ === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === i && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mt-2">{item.answer}</p>
                  </div>
                )}
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
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700">
                        {aiPhrases[index] ? '✨ ИИ-фразы:' : '📝 Шаблоны фраз:'}
                      </h4>
                      {apiKey && !aiPhrases[index] && (
                        <button
                          onClick={() => generateAISection(index)}
                          disabled={loadingSections.has(index)}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                        >
                          {loadingSections.has(index) ? (
                            <>
                              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Генерация...
                            </>
                          ) : (
                            <>✨ Сгенерировать с ИИ</>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {(aiPhrases[index] || section.templatePhrases.map(p => personalize(p, companyData))).map((phrase, pi) => (
                        <div key={pi} className="flex items-start gap-2 group">
                          <div className={`flex-1 rounded-lg p-3 text-sm border ${
                            aiPhrases[index] 
                              ? 'bg-purple-50 text-purple-900 border-purple-200' 
                              : 'bg-gray-50 text-gray-700 border-gray-100'
                          }`}>
                            "{phrase}"
                          </div>
                          <button
                            onClick={() => copyToClipboard(phrase)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-200 rounded shrink-0"
                            title="Копировать"
                          >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    {aiPhrases[index] && (
                      <button
                        onClick={() => setAiPhrases(prev => {
                          const newPhrases = { ...prev };
                          delete newPhrases[index];
                          return newPhrases;
                        })}
                        className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Вернуться к шаблонам
                      </button>
                    )}
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
            'Старт бесплатно (план Самолёт) — нулевой риск',
            'Комиссия только при выводе: 5% / 3% / 1%',
            'Партнёрские программы до 10 уровней на ВСЕХ тарифах',
            'Две ссылки: на оплату (прямые продажи) и для партнёров',
            'Автоматический вывод на Ракете и Шаттле',
            'Webhook для интеграции с вашими системами',
            'Работает для онлайн и офлайн бизнеса',
            'Криптоплатежи — обход ограничений в вашей стране',
            'Клиенты остаются вашими (не уходят к конкурентам)',
            '57% комиссии платформы идёт пригласившим'
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 mt-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>⚙️</span> Как это работает (для объяснения клиенту)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Для продавца:</h4>
            <ol className="space-y-1 text-sm text-gray-700 list-decimal list-inside">
              <li>Регистрация и добавление товара/услуги/компании</li>
              <li>Настройка партнёрской программы (опционально)</li>
              <li>Получение двух ссылок: на оплату и для партнёров</li>
              <li>Размещение ссылок на своих ресурсах</li>
              <li>Вывод средств (комиссия только при выводе)</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Для партнёра:</h4>
            <ol className="space-y-1 text-sm text-gray-700 list-decimal list-inside">
              <li>Получает ссылку от продавца</li>
              <li>Приводит покупателей по своей ссылке</li>
              <li>Покупатель оплачивает через SetHubble</li>
              <li>Партнёр получает вознаграждение автоматически</li>
              <li>Может привлекать других партнёров (до 10 уровней)</li>
            </ol>
          </div>
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
            'Открыть компанию на картах (2ГИС/Яндекс/Google)',
            'Подготовить расчёт ROI на его цифрах',
            'Открыть демо sethubble.com — показать интерфейс',
            'Подготовить ответы на возражения (крипта, MLM)',
            'Иметь готовую ссылку на регистрацию',
            'Подготовить PDF-флайер для демонстрации',
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
