import { useState } from 'react';
import { Methodology } from '../data/methodologies';
import { CompanyData } from './CompanyProfile';

interface Props {
  methodology: Methodology;
  companyData: CompanyData;
}

export default function ScriptGenerator({ methodology, companyData }: Props) {
  const [expandedSections, setExpandedSections] = useState<number[]>(
    methodology.sections.map((_, i) => i)
  );

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const generateScriptSection = (sectionIndex: number): string => {
    const section = methodology.sections[sectionIndex];
    const d = companyData;
    
    let script = `## ${section.title}\n\n`;
    script += `**Цель:** ${section.description}\n\n`;
    script += `### Скрипт:\n\n`;

    // Генерируем персонализированные фразы
    section.templatePhrases.forEach((phrase, i) => {
      let personalized = phrase
        .replace(/\{process\}/g, d.product || 'ваш бизнес-процесс')
        .replace(/\{task\}/g, d.product || 'ключевая задача')
        .replace(/\{problem\}/g, d.painPoints || 'ключевая проблема')
        .replace(/\{industry\}/g, d.industry || 'ваша отрасль')
        .replace(/\{company_name\}/g, d.companyName || '[Название компании]')
        .replace(/\{similar_company\}/g, d.companyName || 'ваша компания')
        .replace(/\{competitor\}/g, d.competitorMention || 'конкурент')
        .replace(/\{product\}/g, d.product || 'наш продукт')
        .replace(/\{benefit\}/g, d.uniqueValue || 'ключевая выгода')
        .replace(/\{benefit1\}/g, d.uniqueValue || 'выгода 1')
        .replace(/\{benefit2\}/g, 'повышение эффективности')
        .replace(/\{benefit3\}/g, 'снижение затрат')
        .replace(/\{goal\}/g, d.meetingGoal === 'closing' ? 'закрыть сделку' : 'достичь результата')
        .replace(/\{metric\}/g, 'ключевой показатель')
        .replace(/\{amount\}/g, 'значительные суммы')
        .replace(/\{time\}/g, '30 дней')
        .replace(/\{result\}/g, 'достигнет новых результатов')
        .replace(/\{cost\}/g, 'потерь в прибыли')
        .replace(/\{scale\}/g, d.companySize || 'ваш масштаб')
        .replace(/\{period\}/g, 'квартал')
        .replace(/\{feature\}/g, d.product || 'наша ключевая функция')
        .replace(/\{advantage\}/g, d.uniqueValue || 'ключевое преимущество')
        .replace(/\{alternative\}/g, d.competitorMention || 'альтернативное решение')
        .replace(/\{small_step\}/g, 'короткого ознакомительного звонка')
        .replace(/\{next_step\}/g, 'пробный период')
        .replace(/\{action\}/g, 'начать')
        .replace(/\{positive_outcome\}/g, 'ваша цель достигнута')
        .replace(/\{describe_problem\}/g, d.painPoints || 'эта ситуация')
        .replace(/\{problem_symptom\}/g, d.painPoints || 'проблема')
        .replace(/\{direct_impact\}/g, 'прямые потери')
        .replace(/\{indirect_impact\}/g, 'потерянные возможности')
        .replace(/\{solution_description\}/g, d.product || 'наше решение')
        .replace(/\{step1\}/g, 'анализ ситуации')
        .replace(/\{step2\}/g, 'подбор решения')
        .replace(/\{step3\}/g, 'внедрение')
        .replace(/\{example\}/g, 'конкретный кейс')
        .replace(/\{calculate_roi\}/g, 'считать ROI вместе')
        .replace(/\{cost_per_period\}/g, 'доступная сумма')
        .replace(/\{comparison\}/g, 'стоимость бездействия')
        .replace(/\{small_start_option\}/g, 'пилотного проекта')
        .replace(/\{benefit_amount\}/g, 'значительная экономия')
        .replace(/\{key_benefit\}/g, d.uniqueValue || 'решает вашу задачу');

      script += `${i + 1}. "${personalized}"\n`;
    });

    script += `\n### 💡 Советы:\n`;
    section.tips.forEach(tip => {
      script += `• ${tip}\n`;
    });

    return script;
  };

  const generateFullScript = (): string => {
    let fullScript = `# СКРИПТ ВСТРЕЧИ\n`;
    fullScript += `Методика: ${methodology.name}\n`;
    if (companyData.companyName) fullScript += `Компания: ${companyData.companyName}\n`;
    if (companyData.product) fullScript += `Продукт: ${companyData.product}\n`;
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
            <h2 className="text-xl font-bold text-gray-900">{methodology.name}</h2>
            <p className="text-sm text-gray-500">Персонализированный скрипт</p>
          </div>
        </div>
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
                        let personalized = phrase
                          .replace(/\{process\}/g, companyData.product || 'ваш бизнес-процесс')
                          .replace(/\{task\}/g, companyData.product || 'ключевая задача')
                          .replace(/\{problem\}/g, companyData.painPoints || 'ключевая проблема')
                          .replace(/\{industry\}/g, companyData.industry || 'ваша отрасль')
                          .replace(/\{company_name\}/g, companyData.companyName || '[Название компании]')
                          .replace(/\{similar_company\}/g, companyData.companyName || 'ваша компания')
                          .replace(/\{competitor\}/g, companyData.competitorMention || 'конкурент')
                          .replace(/\{product\}/g, companyData.product || 'наш продукт')
                          .replace(/\{benefit\}/g, companyData.uniqueValue || 'ключевая выгода')
                          .replace(/\{benefit1\}/g, companyData.uniqueValue || 'выгода 1')
                          .replace(/\{benefit2\}/g, 'повышение эффективности')
                          .replace(/\{benefit3\}/g, 'снижение затрат')
                          .replace(/\{goal\}/g, 'достичь результата')
                          .replace(/\{metric\}/g, 'ключевой показатель')
                          .replace(/\{amount\}/g, 'значительные суммы')
                          .replace(/\{time\}/g, '30 дней')
                          .replace(/\{result\}/g, 'достигнет новых результатов')
                          .replace(/\{cost\}/g, 'потерь в прибыли')
                          .replace(/\{scale\}/g, companyData.companySize || 'ваш масштаб')
                          .replace(/\{period\}/g, 'квартал')
                          .replace(/\{feature\}/g, companyData.product || 'наша ключевая функция')
                          .replace(/\{advantage\}/g, companyData.uniqueValue || 'ключевое преимущество')
                          .replace(/\{alternative\}/g, companyData.competitorMention || 'альтернативное решение')
                          .replace(/\{small_step\}/g, 'короткого ознакомительного звонка')
                          .replace(/\{next_step\}/g, 'пробный период')
                          .replace(/\{action\}/g, 'начать')
                          .replace(/\{positive_outcome\}/g, 'ваша цель достигнута')
                          .replace(/\{describe_problem\}/g, companyData.painPoints || 'эта ситуация')
                          .replace(/\{problem_symptom\}/g, companyData.painPoints || 'проблема')
                          .replace(/\{direct_impact\}/g, 'прямые потери')
                          .replace(/\{indirect_impact\}/g, 'потерянные возможности')
                          .replace(/\{solution_description\}/g, companyData.product || 'наше решение')
                          .replace(/\{step1\}/g, 'анализ ситуации')
                          .replace(/\{step2\}/g, 'подбор решения')
                          .replace(/\{step3\}/g, 'внедрение')
                          .replace(/\{example\}/g, 'конкретный кейс')
                          .replace(/\{key_benefit\}/g, companyData.uniqueValue || 'решает вашу задачу');

                        return (
                          <div key={pi} className="flex items-start gap-2 group">
                            <div className="flex-1 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100">
                              "{personalized}"
                            </div>
                            <button
                              onClick={() => copyToClipboard(personalized)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-200 rounded"
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

      {/* Checklist */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>✅</span> Чек-лист подготовки к встрече
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'Изучить сайт и соцсети клиента',
            'Подготовить персонализированные примеры',
            'Проверить технические средства (презентация, демо)',
            'Подготовить ответы на возможные возражения',
            'Определить следующий шаг (call to action)',
            'Подготовить материалы для отправки после встречи',
            'Узнать имена и роли участников встречи',
            'Поставить конкретную цель на встречу'
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
