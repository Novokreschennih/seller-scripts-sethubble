import { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function ROICalculator({ onClose }: Props) {
  const [avgCheck, setAvgCheck] = useState('');
  const [clientsPerMonth, setClientsPerMonth] = useState('');
  const [currentMarketingBudget, setCurrentMarketingBudget] = useState('');
  const [sethubbleCommission, setSethubbleCommission] = useState('3'); // 3% для Ракеты

  const calculateROI = () => {
    const check = parseFloat(avgCheck) || 0;
    const clients = parseFloat(clientsPerMonth) || 0;
    const budget = parseFloat(currentMarketingBudget) || 0;
    const commission = parseFloat(sethubbleCommission) / 100;

    if (!check || !clients) return null;

    // Текущая ситуация
    const currentRevenue = check * clients;
    const currentCAC = budget > 0 ? budget / clients : 0;

    // С SetHubble (предполагаем 30% рост клиентов через рекомендации)
    const additionalClients = Math.round(clients * 0.3);
    const additionalRevenue = additionalClients * check;
    const newTotalClients = clients + additionalClients;
    const newTotalRevenue = currentRevenue + additionalRevenue;

    // Стоимость SetHubble (комиссия с дополнительного оборота)
    const sethubbleCost = additionalRevenue * commission;

    // Экономия на маркетинге (предполагаем, что 30% бюджета можно перенаправить)
    const marketingSavings = budget * 0.3;

    // Чистая выгода
    const netBenefit = additionalRevenue - sethubbleCost + marketingSavings;

    // ROI
    const roi = ((netBenefit - sethubbleCost) / sethubbleCost) * 100;

    // Окупаемость (месяцев)
    const paybackMonths = sethubbleCost > 0 ? Math.ceil(sethubbleCost / (netBenefit / 12)) : 0;

    return {
      currentRevenue,
      currentCAC,
      additionalClients,
      additionalRevenue,
      newTotalClients,
      newTotalRevenue,
      sethubbleCost,
      marketingSavings,
      netBenefit,
      roi,
      paybackMonths
    };
  };

  const result = calculateROI();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
              <span className="text-xl">🧮</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Калькулятор ROI</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Рассчитайте выгоду от SetHubble</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ввод данных */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Средний чек (₽)
              </label>
              <input
                type="number"
                value={avgCheck}
                onChange={(e) => setAvgCheck(e.target.value)}
                placeholder="5000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Клиентов в месяц
              </label>
              <input
                type="number"
                value={clientsPerMonth}
                onChange={(e) => setClientsPerMonth(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Бюджет на маркетинг (₽/мес)
              </label>
              <input
                type="number"
                value={currentMarketingBudget}
                onChange={(e) => setCurrentMarketingBudget(e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тариф SetHubble
              </label>
              <select
                value={sethubbleCommission}
                onChange={(e) => setSethubbleCommission(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="5">Самолёт (5%)</option>
                <option value="3">Ракета (3%)</option>
                <option value="1">Шаттл (1%)</option>
              </select>
            </div>
          </div>

          {/* Результаты */}
          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Результаты расчёта</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Текущий оборот/мес</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.currentRevenue.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {clientsPerMonth} клиентов × {avgCheck} ₽
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Дополнительный оборот</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +{result.additionalRevenue.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    +{result.additionalClients} клиентов (+30%)
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Новый оборот/мес</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.newTotalRevenue.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {result.newTotalClients} клиентов
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Финансовые показатели</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Стоимость SetHubble/мес:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {result.sethubbleCost.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Экономия на маркетинге:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      +{result.marketingSavings.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Чистая выгода/мес:</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{result.netBenefit.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">ROI:</span>
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {result.roi.toFixed(0)}%
                    </span>
                  </div>

                  {result.paybackMonths > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Окупаемость:</span>
                      <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {result.paybackMonths} мес.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Визуализация */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Сравнение: До и После</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Текущий оборот</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.currentRevenue.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-8">
                      <div
                        className="bg-blue-500 h-8 rounded-full flex items-center justify-end px-3"
                        style={{ width: '100%' }}
                      >
                        <span className="text-white text-sm font-medium">100%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">С SetHubble</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.newTotalRevenue.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-8">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-8 rounded-full flex items-center justify-end px-3"
                        style={{ width: `${(result.newTotalRevenue / result.currentRevenue) * 100}%` }}
                      >
                        <span className="text-white text-sm font-medium">+30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Вывод */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">💡 Вывод</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Подключение SetHubble принесёт дополнительную прибыль{' '}
                  <strong className="text-green-600 dark:text-green-400">
                    {result.netBenefit.toLocaleString('ru-RU')} ₽ в месяц
                  </strong>
                  {' '}при ROI{' '}
                  <strong className="text-indigo-600 dark:text-indigo-400">{result.roi.toFixed(0)}%</strong>.
                  {result.paybackMonths > 0 && ` Инвестиции окупятся за ${result.paybackMonths} месяцев.`}
                </p>
              </div>
            </div>
          )}

          {!result && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Заполните поля выше для расчёта
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
