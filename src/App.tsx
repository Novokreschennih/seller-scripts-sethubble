import { useState } from 'react';
import { methodologies } from './data/methodologies';
import MethodologySelector from './components/MethodologySelector';
import CompanyProfile, { CompanyData } from './components/CompanyProfile';
import ScriptGenerator from './components/ScriptGenerator';
import ObjectionHandler from './components/ObjectionHandler';

type Tab = 'methodology' | 'profile' | 'script' | 'objections';

const initialCompanyData: CompanyData = {
  companyName: '',
  industry: '',
  companySize: '',
  product: '',
  targetAudience: '',
  painPoints: '',
  uniqueValue: '',
  meetingGoal: '',
  competitorMention: '',
  additionalInfo: '',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('methodology');
  const [selectedMethodologyId, setSelectedMethodologyId] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData>(initialCompanyData);

  const selectedMethodology = methodologies.find(m => m.id === selectedMethodologyId) || null;

  const tabs: { id: Tab; label: string; icon: string; disabled?: boolean }[] = [
    { id: 'methodology', label: 'Методика', icon: '📋' },
    { id: 'profile', label: 'Профиль', icon: '🏢' },
    { id: 'script', label: 'Скрипт', icon: '📝', disabled: !selectedMethodology },
    { id: 'objections', label: 'Возражения', icon: '🛡️' },
  ];

  const getProgress = () => {
    let steps = 0;
    let completed = 0;
    
    steps++;
    if (selectedMethodologyId) completed++;
    
    steps++;
    if (companyData.companyName && companyData.product && companyData.painPoints) completed++;
    
    return { steps, completed, percentage: Math.round((completed / steps) * 100) };
  };

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ScriptForge</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Генератор продающих скриптов</p>
              </div>
            </div>
            
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">{progress.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 py-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : tab.disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'methodology' && selectedMethodologyId && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
                {tab.id === 'profile' && companyData.companyName && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200"
                >
                  Далее: Профиль компании
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
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200"
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
            />
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Редактировать профиль
              </button>
              <button
                onClick={() => setActiveTab('objections')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200"
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
            <ObjectionHandler
              companyName={companyData.companyName}
              product={companyData.product}
            />
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => setActiveTab('script')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Вернуться к скрипту
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              ScriptForge — создавайте эффективные скрипты для встреч с предпринимателями
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>6 методик</span>
              <span>•</span>
              <span>5 типов возражений</span>
              <span>•</span>
              <span>Персонализация</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
