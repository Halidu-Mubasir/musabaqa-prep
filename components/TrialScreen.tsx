
import React from 'react';
import { CategoryInfo, Trial } from '../types';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { RestartIcon } from './icons/RestartIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SpeakerIcon } from './icons/SpeakerIcon'; 
import { PauseIcon } from './icons/PauseIcon';
import { StopIcon } from './icons/StopIcon';
// SkipIcon is no longer used here but kept in project as it's an existing file.

interface TrialScreenProps {
  category: CategoryInfo;
  isSessionActive: boolean; 
  currentAttempt: number;
  maxAttempts: number;
  trial: Trial | null;
  sessionMessage: string;
  onStartSession: () => void; 
  onNextTrial: () => void;
  onChangeCategory: () => void;
  score: number | null;
  onScoreChange: (score: number | null) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onRegenerateTrial: () => void; // Changed from onSkipTrial
  onPlayPauseToggle: () => void; 
  onStopAudio: () => void;
  isAudioLoading: boolean;
  isAudioCurrentlyPlaying: boolean; 
  audioPlayerExists: boolean;
  showEndVerseSnippetSetting: boolean;
}

const TrialScreen: React.FC<TrialScreenProps> = ({
  category,
  isSessionActive,
  currentAttempt,
  maxAttempts,
  trial,
  sessionMessage,
  onStartSession,
  onNextTrial,
  onChangeCategory,
  score,
  onScoreChange,
  notes,
  onNotesChange,
  onRegenerateTrial, // Changed from onSkipTrial
  onPlayPauseToggle,
  onStopAudio,
  isAudioLoading,
  isAudioCurrentlyPlaying,
  audioPlayerExists,
  showEndVerseSnippetSetting,
}) => {
  const isSessionFinishedWithMessage = !isSessionActive && currentAttempt >= maxAttempts && !!sessionMessage;
  const showInitialStartButton = !isSessionActive && currentAttempt === 0 && !trial && !sessionMessage;
  
  const progressPercent = currentAttempt > 0 && maxAttempts > 0 ? (Math.min(currentAttempt, maxAttempts) / maxAttempts) * 100 : 0;

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((starValue) => (
      <button
        key={starValue}
        onClick={() => onScoreChange(starValue === score ? null : starValue)}
        className={`text-3xl mx-1 focus:outline-none transition-colors duration-200 ${
          score && starValue <= score ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300 dark:hover:text-yellow-500'
        }`}
        aria-label={`Rate ${starValue} star`}
        title={`Rate ${starValue} star`}
      >
        ★
      </button>
    ));
  };

  const showStopButton = audioPlayerExists && !isAudioLoading;
  const canRegenerate = trial && isSessionActive && currentAttempt > 0;


  return (
    <div className="animate-fadeInUp w-full">
      <button
        onClick={onChangeCategory}
        className="mb-6 flex items-center text-sm text-green-600 dark:text-green-300 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors duration-200 group"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400" />
        Back to Categories
      </button>
      <h2 className="text-3xl font-semibold text-center text-green-700 dark:text-green-300 mb-1">{category.title}</h2>
      
      {isSessionActive && currentAttempt > 0 && (
        <div className="my-4">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-green-700 dark:text-green-300">Trial {currentAttempt} of {maxAttempts}</span>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-yellow-500 dark:bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {showInitialStartButton && (
         <div className="text-center mt-8">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Select a category first, then configure your session.</p>
         </div>
      )}

      {trial && isSessionActive && (
        <div className="mt-4 p-5 bg-gradient-to-br from-beige-50 to-green-50 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-xl text-center">
          <div className="flex justify-center items-center mb-3 space-x-2">
             <h3 className="text-5xl md:text-6xl text-green-800 dark:text-green-200 font-bold arabic-text">
                {trial.surahName}
             </h3>
            <button 
                onClick={onPlayPauseToggle} 
                disabled={isAudioLoading}
                className="p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 disabled:opacity-50"
                aria-label={isAudioCurrentlyPlaying ? "Pause audio recitation" : "Play audio recitation of start verse"}
                title={isAudioCurrentlyPlaying ? "Pause audio recitation" : "Play audio recitation of start verse"}
            >
                {isAudioCurrentlyPlaying ? (
                    <PauseIcon className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
                ) : (
                    <SpeakerIcon className={`w-7 h-7 ${isAudioLoading ? 'animate-pulse text-yellow-500 dark:text-yellow-400' : 'text-green-600 dark:text-green-300'}`} />
                )}
            </button>
            {showStopButton && (
              <button
                onClick={onStopAudio}
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500"
                aria-label="Stop audio recitation"
                title="Stop audio recitation"
              >
                <StopIcon className="w-7 h-7 text-red-500 dark:text-red-400" />
              </button>
            )}
          </div>
          <p className="text-xl text-green-700 dark:text-green-300 mb-3">({trial.surahEnglishName})</p>

          {trial.arabicSnippet && (
            <div className="my-4 p-3 bg-yellow-50 dark:bg-yellow-800/30 rounded-md border border-yellow-200 dark:border-yellow-700">
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-1">Starting from:</p>
              <p className="text-3xl md:text-4xl text-yellow-600 dark:text-yellow-300 arabic-text leading-relaxed px-2">
                {trial.arabicSnippet}
              </p>
            </div>
          )}

          <p className="text-4xl md:text-5xl text-green-800 dark:text-green-200 font-semibold mb-1">
            {trial.surahId === trial.endSurahId ? (
              `Ayah: ${trial.startAyah} – ${trial.endAyah}`
            ) : (
              <>
                Ayah: {trial.startAyah}
                <span className="block text-2xl md:text-3xl mt-1">
                  to {trial.endSurahEnglishName} (<span className="arabic-text">{trial.endSurahName}</span>)
                  , Ayah: {trial.endAyah}
                </span>
              </>
            )}
          </p>

          {showEndVerseSnippetSetting && trial.arabicEndSnippet && (
            <div className="my-4 p-3 bg-green-50 dark:bg-green-800/30 rounded-md border border-green-200 dark:border-green-700">
              <p className="text-xs text-green-700 dark:text-green-400 mb-1">Ending with (first words):</p>
              <p className="text-xl text-green-600 dark:text-green-300 arabic-text leading-relaxed px-2">
                {trial.arabicEndSnippet}
              </p>
            </div>
          )}
          
          <div className="my-6">
            <p className="text-md text-green-700 dark:text-green-300 mb-2">Rate your confidence (1-5 stars):</p>
            <div className="flex justify-center">{renderStars()}</div>
          </div>

          <div className="my-6">
            <label htmlFor="trialNotes" className="block text-md text-green-700 dark:text-green-300 mb-2">Notes for this trial:</label>
            <textarea
              id="trialNotes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
              className="w-full p-3 border border-green-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-yellow-500 dark:focus:border-yellow-400 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="E.g., common mistakes, points to review..."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <button
              onClick={onRegenerateTrial} // Changed from onSkipTrial
              disabled={!canRegenerate} // Updated disabled condition
              className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 flex items-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RestartIcon className="w-5 h-5 mr-2"/> {/* Changed Icon */}
              Regenerate Trial {/* Changed Text */}
            </button>
            <button
              onClick={onNextTrial}
              className="px-8 py-3 bg-yellow-500 dark:bg-yellow-400 text-green-900 dark:text-gray-900 text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-300 focus:ring-opacity-50 flex items-center group"
            >
              {currentAttempt >= maxAttempts ? 'Finish & View Summary' : 'Next Trial'}
              {currentAttempt < maxAttempts && <ChevronRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      )}
      
      {sessionMessage && !trial && ( 
         <div className="mt-8 text-center p-6 bg-yellow-50 dark:bg-yellow-800/30 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-md">
           <p className="text-xl text-yellow-800 dark:text-yellow-300 font-semibold">{sessionMessage}</p>
           {isSessionFinishedWithMessage && ( 
            <button
              onClick={onStartSession} 
              className="mt-6 px-6 py-3 bg-green-600 dark:bg-green-500 text-white dark:text-gray-900 text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center mx-auto group"
            >
              <RestartIcon className="w-5 h-5 mr-2" />
              Start New Test (Same Category)
            </button>
           )}
         </div>
      )}
    </div>
  );
};

export default TrialScreen;
