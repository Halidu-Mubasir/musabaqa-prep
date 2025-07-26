
import React, { useState } from 'react';
import { CategoryInfo } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ConfigureSessionScreenProps {
  category: CategoryInfo;
  onStartSession: (numberOfTrials: number) => void;
  onBack: () => void;
}

const ConfigureSessionScreen: React.FC<ConfigureSessionScreenProps> = ({ category, onStartSession, onBack }) => {
  const [selectedTrials, setSelectedTrials] = useState<number>(5);
  const trialOptions = [3, 5, 7, 10];

  return (
    <div className="animate-fadeInUp w-full">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-sm text-green-600 dark:text-green-300 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors duration-200 group"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400" />
        Back to Categories
      </button>

      <h2 className="text-3xl font-semibold text-center text-green-700 dark:text-green-300 mb-4">Configure Session</h2>
      <div className="p-4 bg-green-50 dark:bg-gray-700 border border-green-200 dark:border-gray-600 rounded-lg mb-6">
        <p className="text-xl font-medium text-green-800 dark:text-green-200">{category.title}</p>
        <p className="text-sm text-yellow-700 dark:text-yellow-400">{category.description}</p>
      </div>

      <div className="mb-8">
        <label htmlFor="numberOfTrials" className="block text-lg font-medium text-green-700 dark:text-green-300 mb-2 text-center">
          Select Number of Trials:
        </label>
        <div className="flex justify-center gap-3 sm:gap-4">
          {trialOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedTrials(option)}
              className={`px-4 py-2 sm:px-6 sm:py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${selectedTrials === option 
                  ? 'bg-yellow-500 text-green-900 dark:bg-yellow-400 dark:text-gray-900 ring-yellow-400 dark:ring-yellow-300' 
                  : 'bg-green-100 text-green-800 dark:bg-gray-600 dark:text-gray-100 hover:bg-green-200 dark:hover:bg-gray-500 ring-green-300 dark:ring-gray-500'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStartSession(selectedTrials)}
        className="w-full sm:w-auto mx-auto px-8 py-4 bg-green-600 dark:bg-green-500 text-white dark:text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center group"
      >
        Start Test with {selectedTrials} Trials
        <ChevronRightIcon className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default ConfigureSessionScreen;
