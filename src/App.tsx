import { useState, useEffect } from 'react';
import { methodologies, CompanyData } from './data/methodologies';
import MethodologySelector from './components/MethodologySelector';
import CompanyProfile from './components/CompanyProfile';
import ScriptGenerator from './components/ScriptGenerator';
import ObjectionHandler from './components/ObjectionHandler';
import ApiKeyManager from './components/ApiKeyManager';
import SalesTrainer from './components/SalesTrainer';
import ModelSelector from './components/ModelSelector';
import ScriptHistory from './components/ScriptHistory';
import ROICalculator from './components/ROICalculator';
import { useScriptHistory, SavedScript } from './hooks/useScriptHistory';

type Tab = 'settings' | 'methodology' | 'profile' | 'script' | 'objections' | 'trainer' | 'history';

const initialCompanyData: CompanyData = {
  businessName: '',
  mapLink: '',
  businessCategory: '',
  businessSubcategory: '',
  additionalNotes: '',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const hasKey = localStorage.getItem('polza_api_key');
    return hasKey ? 'methodology' : 'settings';
  });
  const [selectedMethodologyId, setSelectedMethodologyId] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData>(initialCompanyData);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('polza_api_key') || '';
  });
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('polza_model') || 'deepseek/deepseek-v4.1-flash-1017';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // История скриптов
  const { scripts, saveScript, deleteScript, toggleFavorite, clearHistory } = useScriptHistory();
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [currentScriptContent, setCurrentScriptContent] = useState<string>('');

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('polza_api_key', apiKey);
    } else {
      localStorage.removeItem('polza_api_key');
    }
  }, [apiKey]);

  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('polza_model', selectedModel);
    }
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const selectedMethodology = methodologies.find(m => m.id === selectedMethodologyId) || null;

  const tabs: { id: Tab; label: string; icon: string; disabled?: boolean }[] = [
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
    { id: 'methodology', label: 'Методика', icon: '📋' },
    { id: 'profile', label: 'Профиль клиента', icon: '🏢' },
    { id: 'script', label: 'Скрипт', icon: '📝', disabled: !selectedMethodology },
    { id: 'objections', label: 'Возражения', icon: '🛡️' },
    { id: 'trainer', label: 'Тренажёр', icon: '🎭' },
    { id: 'history', label: 'История', icon: '📚' },
  ];

  const getProgress = () => {
    let steps = 0;
    let completed = 0;
    
    steps++;
    if (selectedMethodologyId) completed++;
    
    steps++;
    if (companyData.businessName && companyData.businessCategory) completed++;
    
    return { steps, completed, percentage: Math.round((completed / steps) * 100) };
  };

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">ScriptForge</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Скрипты для продажи SetHubble</p>
              </div>
            </div>
            
            {/* Progress & Theme Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{progress.percentage}%</span>
              </div>

              {/* API Status Indicator */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  apiKey
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'
                    : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                }`}
                title={apiKey ? 'API настроен' : 'Настроить API'}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                <span>{apiKey ? 'API ✓' : 'Настроить API'}</span>
              </button>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 py-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : tab.disabled
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'settings' && apiKey && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
                {tab.id === 'methodology' && selectedMethodologyId && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
                {tab.id === 'profile' && companyData.businessName && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Настройки</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">API-ключ и выбор ИИ-модели</p>
              </div>
            </div>

            <ApiKeyManager apiKey={apiKey} onChange={setApiKey} />

            {apiKey && (
              <ModelSelector selectedModel={selectedModel} onChange={setSelectedModel} />
            )}

            {!apiKey && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>💡</span> Зачем нужен API-ключ?
                </h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>Без ключа приложение работает с <strong>заготовленными шаблонами</strong> — этого достаточно для базовых скриптов.</p>
                  <p>С ключом Polza.ai вы получаете:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>🎭 <strong>Тренажёр продаж</strong> — ИИ играет роль клиента</li>
                    <li>✨ <strong>ИИ-генерация скриптов</strong> — уникальные фразы под ваш бизнес</li>
                    <li>🎭 <strong>Выбор тона</strong> — деловой, дружеский, экспертный, эмпатичный</li>
                  </ul>
                  <p className="mt-3">Получить ключ: <a href="https://polza.ai/dashboard/api-keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">polza.ai/dashboard/api-keys</a></p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'methodology' && (
          <div>
            <MethodologySelector
              methodologies={methodologies}
              selectedId={selectedMethodologyId}
              onSelect={(id) => {
                setSelectedMethodologyId(id);
              }}
            />
            {selectedMethodologyId && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
                >
                  Далее: Профиль клиента
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <CompanyProfile data={companyData} onChange={setCompanyData} />
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setActiveTab('methodology')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
              >
                Сгенерировать скрипт
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'script' && selectedMethodology && (
          <div>
            <ScriptGenerator
              methodology={selectedMethodology}
              companyData={companyData}
              apiKey={apiKey}
              selectedModel={selectedModel}
              onSaveScript={(content) => {
                saveScript({
                  businessName: companyData.businessName || 'Без названия',
                  methodology: selectedMethodology.name,
                  category: companyData.businessSubcategory || '',
                  content
                });
                alert('✅ Скрипт сохранён в историю!');
              }}
              onOpenROI={() => setShowROICalculator(true)}
            />
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Редактировать профиль
              </button>
              <button
                onClick={() => setActiveTab('objections')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
              >
                Работа с возражениями
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'objections' && (
          <div>
            <ObjectionHandler companyData={companyData} />
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => setActiveTab('script')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Вернуться к скрипту
              </button>
            </div>
          </div>
        )}

        {activeTab === 'trainer' && (
          <div>
            <SalesTrainer companyData={companyData} apiKey={apiKey} selectedModel={selectedModel} />
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <ScriptHistory
              scripts={scripts}
              onDelete={deleteScript}
              onToggleFavorite={toggleFavorite}
              onClearAll={clearHistory}
              onLoadScript={(script) => {
                // Загружаем скрипт — можно добавить логику восстановления данных
                console.log('Загрузка скрипта:', script);
                setActiveTab('script');
              }}
            />
          </div>
        )}
      </main>

      {/* Калькулятор ROI */}
      {showROICalculator && (
        <ROICalculator onClose={() => setShowROICalculator(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ScriptForge — генератор скриптов для продажи платформы SetHubble
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
              <span>6 методик</span>
              <span>•</span>
              <span>6 типов возражений</span>
              <span>•</span>
              <a href="https://sethubble.com/ru/main" target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                sethubble.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
