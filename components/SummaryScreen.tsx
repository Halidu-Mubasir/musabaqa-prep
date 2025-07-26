
import React from 'react';
import { TrialRecord } from '../types';
import { RestartIcon } from './icons/RestartIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { DownloadIcon } from './icons/DownloadIcon'; 

interface SummaryScreenProps {
  records: TrialRecord[];
  onRestart: () => void;
  onBackToCategories: () => void;
  onExportCSV: () => void;
  totalTrialsConfigured: number;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({
  records,
  onRestart,
  onBackToCategories,
  onExportCSV,
  totalTrialsConfigured,
}) => {
  const completedTrials = records.filter(r => r.trial).length;

  if (completedTrials === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-xl text-yellow-700 dark:text-yellow-400 mb-4">No trial data to display for this session.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You had {totalTrialsConfigured} trials configured.</p>
        <button
            onClick={onBackToCategories}
            className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white dark:text-gray-900 text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center mx-auto group"
        >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn w-full">
      <h2 className="text-3xl font-semibold text-center text-green-700 dark:text-green-300 mb-2">Session Summary</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">You completed {completedTrials} of {totalTrialsConfigured} configured trials.</p>
      
      <div className="overflow-x-auto bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-green-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider">#</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider">Surah (Start)</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider arabic-text">الآية</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider arabic-text">بداية الآية</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider arabic-text">نهاية الآية (اختياري)</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider">Score</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {records.map((record, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-beige-50/50 dark:bg-gray-700/70'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {record.trial.surahEnglishName}
                  <span className="block text-xs arabic-text text-gray-500 dark:text-gray-400">{record.trial.surahName}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {record.trial.startAyah}
                  {record.trial.surahId !== record.trial.endSurahId && (
                    ` - ${record.trial.endSurahEnglishName} ${record.trial.endAyah}`
                  )}
                  {record.trial.surahId === record.trial.endSurahId && record.trial.startAyah !== record.trial.endAyah && (
                    ` - ${record.trial.endAyah}`
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 arabic-text text-right min-w-[150px] max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={record.trial.arabicSnippet}>
                  {record.trial.arabicSnippet || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 arabic-text text-right min-w-[150px] max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={record.trial.arabicEndSnippet}>
                  {record.trial.arabicEndSnippet || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-700 dark:text-yellow-400 font-semibold">
                  {record.score ? `${'★'.repeat(record.score)}${'☆'.repeat(5 - record.score)}` : 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 min-w-[200px] max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" title={record.notes}>
                  {record.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onExportCSV}
          className="px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 flex items-center group"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onBackToCategories}
          className="px-6 py-3 bg-gray-500 dark:bg-gray-600 text-white dark:text-gray-100 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 flex items-center group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          New Category
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white dark:text-gray-900 text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 flex items-center group"
        >
          <RestartIcon className="w-5 h-5 mr-2" />
          Restart Test (Same Category)
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;
