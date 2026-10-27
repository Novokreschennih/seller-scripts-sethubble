import { Methodology } from '../data/methodologies';

interface Props {
  methodologies: Methodology[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function MethodologySelector({ methodologies, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
          <span className="text-xl">📋</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Выберите методику</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Каждая методика подходит для разных типов встреч</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methodologies.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              selectedId === m.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white">{m.name}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">{m.shortName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{m.description}</p>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                    {m.bestFor}
                  </span>
                </div>
              </div>
            </div>
            {selectedId === m.id && (
              <div className="mt-3 flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Выбрано</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
