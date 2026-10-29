import { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function ROICalculator({ onClose }: Props) {
  const [avgCheck, setAvgCheck] = useState('');
  const [clientsPerMonth, setClientsPerMonth] = useState('');
  const [currentMarketingBudget, setCurrentMarketingBudget] = useState('');
  const [sethubbleCommission, setSethubbleCommission] = useState('3'); // 3% для Ракеты
  const [partnerReward, setPartnerReward] = useState('10'); // 10% партнёрам
  const [partnerConversion, setPartnerConversion] = useState('30'); // 30% рост клиентов

  const calculateROI = () => {
    const check = parseFloat(avgCheck) || 0;
    const clients = parseFloat(clientsPerMonth) || 0;
    const budget = parseFloat(currentMarketingBudget) || 0;
    const commission = parseFloat(sethubbleCommission) / 100;
    const reward = parseFloat(partnerReward) / 100;
    const conversion = parseFloat(partnerConversion) / 100;

    if (!check || !clients) return null;

    // === ТЕКУЩАЯ СИТУАЦИЯ ===
    const currentRevenue = check * clients;
    const currentCAC = budget > 0 ? budget / clients : 0; // Стоимость привлечения клиента

    // === С SETHUBBLE ===
    
    // Дополнительные клиенты от партнёров
    const additionalClients = Math.round(clients * conversion);
    const newTotalClients = clients + additionalClients;
    
    // Дополнительный оборот от новых клиентов
    const additionalRevenue = additionalClients * check;
    const newTotalRevenue = currentRevenue + additionalRevenue;

    // === РАСХОДЫ НА SETHUBBLE ===
    
    // 1. Комиссия SetHubble (при выводе всего оборота)
    const sethubbleCost = newTotalRevenue * commission;
    
    // 2. Выплаты партнёрам (только с дополнительных клиентов, которых они привели)
    const partnerRewards = additionalRevenue * reward;
    
    // Общие расходы на SetHubble
    const totalSethubbleExpenses = sethubbleCost + partnerRewards;

    // === ЭКОНОМИЯ ===
    // Предполагаем, что можно сократить маркетинг на 30-50% 
    // (партнёры заменяют часть рекламных каналов)
    const marketingSavings = budget * 0.4; // 40% экономии

    // === ФИНАНСОВЫЕ ПОКАЗАТЕЛИ ===
    
    // Дополнительная прибыль (без учёта экономии)
    const additionalProfit = additionalRevenue - totalSethubbleExpenses;
    
    // Чистая выгода (с учётом экономии на маркетинге)
    const netBenefit = additionalProfit + marketingSavings;
    
    // ROI (возврат инвестиций)
    const roi = totalSethubbleExpenses > 0 
      ? ((netBenefit / totalSethubbleExpenses) * 100) 
      : 0;

    // Стоимость привлечения нового клиента через SetHubble
    const newCAC = totalSethubbleExpenses / additionalClients;

    // Сравнение CAC
    const cacReduction = currentCAC > 0 
      ? ((currentCAC - newCAC) / currentCAC * 100) 
      : 0;

    return {
      // Текущая ситуация
      currentRevenue,
      currentCAC,
      
      // С SetHubble
      additionalClients,
      additionalRevenue,
      newTotalClients,
      newTotalRevenue,
      
      // Расходы
      sethubbleCost,
      partnerRewards,
      totalSethubbleExpenses,
      
      // Экономия
      marketingSavings,
      
      // Прибыль
      additionalProfit,
      netBenefit,
      
      // Эффективность
      roi,
      newCAC,
      cacReduction
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
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Данные вашего бизнеса</h3>
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
            </div>
          </div>

          {/* Настройки SetHubble */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Настройки SetHubble</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тариф SetHubble (комиссия платформе)
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Комиссия платформе при выводе средств
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Вознаграждение партнёрам (%)
                </label>
                <input
                  type="number"
                  value={partnerReward}
                  onChange={(e) => setPartnerReward(e.target.value)}
                  placeholder="10"
                  min="1"
                  max="50"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Процент от продаж, который вы платите партнёрам
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Рост клиентов от партнёров (%)
                </label>
                <input
                  type="number"
                  value={partnerConversion}
                  onChange={(e) => setPartnerConversion(e.target.value)}
                  placeholder="30"
                  min="10"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  На сколько % увеличится поток клиентов
                </p>
              </div>
            </div>
          </div>

          {/* Результаты */}
          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Результаты расчёта</h3>

              {/* Текущая ситуация vs Новая */}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Новый оборот/мес</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.newTotalRevenue.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    +{result.additionalClients} клиентов (+{partnerConversion}%)
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Дополнительный оборот</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    +{result.additionalRevenue.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    От партнёрской программы
                  </p>
                </div>
              </div>

              {/* Расходы */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Расходы на SetHubble</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">Комиссия SetHubble ({sethubbleCommission}%):</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Платформе при выводе средств</p>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {result.sethubbleCost.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">Выплаты партнёрам ({partnerReward}%):</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Вознаграждение за приведённых клиентов</p>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {result.partnerRewards.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-red-200 dark:border-red-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Общие расходы:</span>
                    <span className="text-xl font-bold text-red-600 dark:text-red-400">
                      -{result.totalSethubbleExpenses.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>

              {/* Прибыль и эффективность */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Финансовые показатели</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Дополнительная прибыль:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {result.additionalProfit.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Экономия на маркетинге (40%):</span>
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
                    <span className="text-gray-700 dark:text-gray-300">ROI (возврат инвестиций):</span>
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {result.roi.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Сравнение CAC */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Стоимость привлечения клиента (CAC)</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Текущий CAC (реклама)</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.currentCAC > 0 ? `${result.currentCAC.toLocaleString('ru-RU')} ₽` : 'Не указан'}
                      </span>
                    </div>
                    {result.currentCAC > 0 && (
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-8">
                        <div
                          className="bg-red-500 h-8 rounded-full flex items-center justify-end px-3"
                          style={{ width: '100%' }}
                        >
                          <span className="text-white text-sm font-medium">100%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Новый CAC (SetHubble)</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.newCAC.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    {result.currentCAC > 0 && (
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-8">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-8 rounded-full flex items-center justify-end px-3"
                          style={{ width: `${Math.min((result.newCAC / result.currentCAC) * 100, 100)}%` }}
                        >
                          <span className="text-white text-sm font-medium">
                            -{result.cacReduction.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}
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
                  {result.currentCAC > 0 && (
                    <> Стоимость привлечения клиента снизится на{' '}
                    <strong className="text-green-600 dark:text-green-400">{result.cacReduction.toFixed(0)}%</strong>.</>
                  )}
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
