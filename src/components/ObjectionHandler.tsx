import { useState } from 'react';
import { objectionTemplates, CompanyData } from '../data/methodologies';

interface Props {
  companyData: CompanyData;
}

export default function ObjectionHandler({ companyData }: Props) {
  const [expandedObjection, setExpandedObjection] = useState<number | null>(null);
  const [customObjection, setCustomObjection] = useState('');
  const [customResponses, setCustomResponses] = useState<string[]>([]);

  const businessContext = companyData.businessName || 'ваш бизнес';
  const industry = companyData.businessSubcategory || 'ваша сфера';

  const generateCustomResponses = () => {
    if (!customObjection.trim()) return;
    
    const responses = [
      `Понимаю вашу точку зрения. ${businessContext} в сфере ${industry} — как раз тот случай, где SetHubble показывает максимальный результат. Позвольте показать на вашем примере...`,
      `Интересное замечание. Многие предприниматели в ${industry} изначально думали так же. Что их убедило — конкретные результаты: система оцифровки сарафанного радио без рисков и абонентских плат.`,
      `Согласен, это важный вопрос. Давайте разберём детально: SetHubble не требует от вас менять бизнес-процессы. Вы продолжаете работать как обычно — просто добавляете систему рекомендаций, которая работает автоматически.`,
      `Спасибо за честность. Вот что важно: подключение бесплатное, комиссия только с реальных продаж. Нет клиента — нет оплаты. Какие конкретно аспекты вас беспокоят? Давайте разберём каждый.`
    ];
    setCustomResponses(responses);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
          <span className="text-xl">🛡️</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Работа с возражениями</h2>
          <p className="text-sm text-gray-500">Типичные возражения при продаже SetHubble и ответы на них</p>
        </div>
      </div>

      {/* Custom objection */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>✍️</span> Своё возражение клиента
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-sm"
            placeholder="Что сказал клиент? Например: «А если мне не понравится?»"
            value={customObjection}
            onChange={(e) => setCustomObjection(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateCustomResponses()}
          />
          <button
            onClick={generateCustomResponses}
            className="px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Ответы
          </button>
        </div>
        {customResponses.length > 0 && (
          <div className="mt-3 space-y-2">
            {customResponses.map((response, i) => (
              <div key={i} className="flex items-start gap-2 group">
                <div className="flex-1 bg-white rounded-lg p-3 text-sm text-gray-700 border border-amber-100">
                  {response}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(response)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-amber-100 rounded shrink-0"
                  title="Копировать"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset objections */}
      <div className="space-y-3">
        {objectionTemplates.map((objection, index) => (
          <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setExpandedObjection(expandedObjection === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {['🔄', '₿', '🤷', '😰', '🤔', '🛡️'][index] || '💬'}
                </span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">"{objection.objection}"</h3>
                  <p className="text-xs text-gray-500">Техника: {objection.technique}</p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${expandedObjection === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedObjection === index && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Варианты ответов:</p>
                  {objection.responses.map((response, ri) => (
                    <div key={ri} className="flex items-start gap-2 group">
                      <div className="flex-1 bg-green-50 rounded-lg p-3 text-sm text-gray-700 border border-green-100">
                        {response}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(response)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-green-100 rounded shrink-0"
                        title="Копировать"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick reference */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 mt-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>📌</span> Золотые правила работы с возражениями
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          <p>• <strong>Присоединяйтесь:</strong> "Понимаю", "Согласен", "Это важный вопрос"</p>
          <p>• <strong>Уточняйте:</strong> "Что именно вас беспокоит?"</p>
          <p>• <strong>Не спорьте:</strong> ведите диалог, а не дискуссию</p>
          <p>• <strong>Возвращайте к выгодам:</strong> "Давайте посмотрим, что вы получаете..."</p>
          <p>• <strong>Используйте цифры:</strong> считайте вместе с клиентом</p>
          <p>• <strong>Закрывайте:</strong> "Что ещё мешает принять решение?"</p>
        </div>
      </div>
    </div>
  );
}
