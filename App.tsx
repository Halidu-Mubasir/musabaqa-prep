
import React, { useState, useCallback, useEffect } from 'react';
import { CategoryInfo, Trial, TrialRecord } from './types';
import { CATEGORY_DEFINITIONS } from './constants';
import { surahData } from './services/quranData';
import { generateTrial } from './services/trialManager';
import CategorySelectionScreen from './components/CategorySelectionScreen';
import ConfigureSessionScreen from './components/ConfigureSessionScreen';
import TrialScreen from './components/TrialScreen';
import SummaryScreen from './components/SummaryScreen';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';

type ViewMode = 'category' | 'configureSession' | 'trial' | 'summary';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);
  const [numberOfTrials, setNumberOfTrials] = useState<number>(5);
  const [currentAttempt, setCurrentAttempt] = useState<number>(0);
  const [currentTrialDisplay, setCurrentTrialDisplay] = useState<Trial | null>(null);
  const [sessionMessage, setSessionMessage] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  
  const [sessionRecords, setSessionRecords] = useState<Array<TrialRecord | null>>([]);
  const [currentTrialScore, setCurrentTrialScore] = useState<number | null>(null);
  const [currentTrialNotes, setCurrentTrialNotes] = useState<string>('');
  
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isAudioCurrentlyPlaying, setIsAudioCurrentlyPlaying] = useState<boolean>(false);

  // Settings
  const [showEndVerseSnippet, setShowEndVerseSnippet] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Theme
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('musabaqaTheme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
    // Fallback to system preference if localStorage is not set
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const rootHtmlElement = document.documentElement;
    if (theme === 'dark') {
      rootHtmlElement.classList.add('dark');
    } else {
      rootHtmlElement.classList.remove('dark');
    }
    localStorage.setItem('musabaqaTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const clearAudioState = useCallback(() => {
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.oncanplaythrough = null;
      audioPlayer.onerror = null;
      audioPlayer.onended = null;
      audioPlayer.onplay = null;
      audioPlayer.onpause = null;
      audioPlayer.src = ''; 
      setAudioPlayer(null); 
    }
    setIsAudioLoading(false);
    setIsAudioCurrentlyPlaying(false);
  }, [audioPlayer]);


  const resetToCategorySelection = useCallback(() => {
    clearAudioState();
    setSelectedCategory(null);
    setCurrentAttempt(0);
    setCurrentTrialDisplay(null);
    setSessionMessage('');
    setSessionRecords(Array(numberOfTrials).fill(null));
    setCurrentTrialScore(null);
    setCurrentTrialNotes('');
    setViewMode('category');
  }, [clearAudioState, numberOfTrials]);

  const commitCurrentTrialData = useCallback(() => {
    setSessionRecords(prevRecords => {
      if (currentAttempt > 0 && currentAttempt <= numberOfTrials && prevRecords[currentAttempt - 1]?.trial) {
        const updatedRecords = [...prevRecords];
        const existingRecord = updatedRecords[currentAttempt - 1];
        if (existingRecord) {
            updatedRecords[currentAttempt - 1] = {
              ...existingRecord, 
              score: currentTrialScore, 
              notes: currentTrialNotes,
            };
            return updatedRecords;
        }
      }
      return prevRecords;
    });
  }, [currentAttempt, currentTrialScore, currentTrialNotes, numberOfTrials]);
  
  const generateAndDisplayTrial = useCallback(async (attemptNumber: number, categoryOverride?: CategoryInfo) => {
    const categoryToUse = categoryOverride || selectedCategory;

    if (!categoryToUse) {
      setSessionMessage("Error: No category selected.");
      setViewMode('category'); 
      return;
    }

    // Check if this is for finishing the session
    if (attemptNumber > numberOfTrials) {
      commitCurrentTrialData(); 
      setViewMode('summary');
      setSessionMessage(`Session finished. ${numberOfTrials} trials completed.`);
      setCurrentTrialDisplay(null); 
      return;
    }
    
    setCurrentTrialDisplay(null); 
    setSessionMessage('Generating trial...');

    const newTrial = await generateTrial(
      categoryToUse, 
      attemptNumber, 
      surahData, 
      numberOfTrials
    );

    if (newTrial) {
      setSessionRecords(prevRecords => {
        const updatedRecords = [...prevRecords];
         // If regenerating, reset score and notes for this attempt slot
         if (attemptNumber -1 < updatedRecords.length) {
            updatedRecords[attemptNumber - 1] = { 
              trial: newTrial, 
              score: null, // Reset score for new/regenerated trial
              notes: ''    // Reset notes for new/regenerated trial
            };
        } else { // Should not happen if array is initialized correctly
             updatedRecords.push({ trial: newTrial, score: null, notes: '' });
        }
        return updatedRecords;
      });

      setCurrentTrialDisplay(newTrial);
      setCurrentAttempt(attemptNumber);
      // Reset UI state for score and notes as it's a new trial (or regenerated)
      setCurrentTrialScore(null);
      setCurrentTrialNotes('');
      
      setViewMode('trial');
      setSessionMessage('');
    } else {
      setViewMode('trial'); 
      setCurrentTrialDisplay(null);
      setSessionMessage(
        `Could not generate Trial ${attemptNumber} for ${categoryToUse.title}. This may be due to category constraints. Please try restarting.`
      );
    }
  }, [selectedCategory, commitCurrentTrialData, numberOfTrials]); // Removed sessionRecords from dependencies


  const startNewSession = useCallback(async (categoryForSession: CategoryInfo, trialsCount: number) => {
    clearAudioState();
    setSelectedCategory(categoryForSession); 
    setNumberOfTrials(trialsCount);
    setSessionRecords(Array(trialsCount).fill(null)); 
    setCurrentAttempt(0); 
    setCurrentTrialScore(null); 
    setCurrentTrialNotes('');   
    setCurrentTrialDisplay(null);
    setSessionMessage('');
    setViewMode('trial'); 
    await generateAndDisplayTrial(1, categoryForSession);
  }, [generateAndDisplayTrial, clearAudioState]);

  const handleNextTrial = useCallback(async () => {
    commitCurrentTrialData(); 
    clearAudioState();
    const nextAttemptNumber = currentAttempt + 1;
    await generateAndDisplayTrial(nextAttemptNumber); 
  }, [currentAttempt, generateAndDisplayTrial, commitCurrentTrialData, clearAudioState]);

  const handleRegenerateTrial = useCallback(async () => {
    if (!currentTrialDisplay || currentAttempt === 0) return; // Can't regenerate if no trial or session not started
    
    clearAudioState();
    // Reset score and notes for the UI before regenerating
    setCurrentTrialScore(null);
    setCurrentTrialNotes('');
    
    // Call generateAndDisplayTrial for the current attempt number
    // It will handle resetting the score/notes in sessionRecords
    await generateAndDisplayTrial(currentAttempt); 
  }, [currentAttempt, generateAndDisplayTrial, clearAudioState, currentTrialDisplay]);

  const loadAndPlayAudio = useCallback(async () => {
    if (!currentTrialDisplay || !currentTrialDisplay.startGlobalAyahNumber) return;

    clearAudioState(); 
    setIsAudioLoading(true);

    try {
      const { startGlobalAyahNumber } = currentTrialDisplay;
      const audioSrc = `https://cdn.islamic.network/quran/audio/128/ar.minshawi/${startGlobalAyahNumber}.mp3`;
      
      const newAudioPlayerInstance = new Audio(audioSrc);
      setAudioPlayer(newAudioPlayerInstance); 

      newAudioPlayerInstance.oncanplaythrough = () => {
        setIsAudioLoading(false);
        newAudioPlayerInstance.play().catch(playError => {
          console.error("Error attempting to play audio:", playError);
          setSessionMessage(`Audio play failed: ${(playError as Error).message}.`);
          clearAudioState(); 
        });
      };

      newAudioPlayerInstance.onplay = () => {
        setIsAudioCurrentlyPlaying(true);
      };

      newAudioPlayerInstance.onpause = () => {
        setIsAudioCurrentlyPlaying(false);
      };

      newAudioPlayerInstance.onended = () => {
        setIsAudioCurrentlyPlaying(false);
        setAudioPlayer(null); 
      };

      newAudioPlayerInstance.onerror = () => {
        setIsAudioLoading(false);
        let detailedErrorMessage = "Audio playback error: ";
        const error = newAudioPlayerInstance.error;
        console.error("Audio playback error object:", error);

        if (error) {
            switch (error.code) {
                case MediaError.MEDIA_ERR_ABORTED: detailedErrorMessage += "Playback aborted by user."; break;
                case MediaError.MEDIA_ERR_NETWORK: detailedErrorMessage += "Network error. Please check your connection."; break;
                case MediaError.MEDIA_ERR_DECODE: detailedErrorMessage += "Audio decoding error. The file might be corrupted or unsupported."; break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: detailedErrorMessage += "Audio source not supported or recitation unavailable for this Ayah."; break;
                default: detailedErrorMessage += "An unknown audio error occurred.";
            }
            if (error.message && error.message.trim() !== "") {
                detailedErrorMessage += ` (Details: ${error.message})`;
            }
        } else {
            detailedErrorMessage += "An unknown error occurred. Recitation may not be available or network issue.";
        }
        setSessionMessage(detailedErrorMessage);
        clearAudioState(); 
      };

    } catch (error: any) { 
      setIsAudioLoading(false);
      setSessionMessage(`Failed to initialize audio player: ${error?.message || "Unknown error"}. Please check your connection or the API service.`);
      console.error("Audio initialization error:", error);
      clearAudioState();
    }
  }, [currentTrialDisplay, clearAudioState]); 

  const handlePlayPauseToggle = useCallback(async () => {
    if (isAudioLoading) return; 

    if (audioPlayer) {
      if (isAudioCurrentlyPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play().catch(playError => {
          console.error("Error attempting to resume play:", playError);
          setSessionMessage(`Audio play failed: ${(playError as Error).message}.`);
          clearAudioState();
        });
      }
    } else {
      await loadAndPlayAudio();
    }
  }, [audioPlayer, isAudioLoading, isAudioCurrentlyPlaying, loadAndPlayAudio, clearAudioState]);

  const handleStopAudio = useCallback(() => {
    clearAudioState(); 
  }, [clearAudioState]);


  const exportToCSV = useCallback(() => {
    const activeRecords = sessionRecords.filter(r => r !== null && r.trial !== null) as TrialRecord[];
    if (activeRecords.length === 0) {
        alert("No data to export.");
        return;
    }

    const headers = "Trial #,Surah Name (English),Surah Name (Arabic),Start Ayah,End Surah (English),End Surah (Arabic),End Ayah,Arabic Snippet Start,Arabic Snippet End,Score,Notes";
    const rows = activeRecords.map((record, index) => {
        const trial = record.trial;
        const trialNum = index + 1; 
        const surah = `"${trial.surahEnglishName}"`;
        const surahAr = `"${trial.surahName}"`;
        const verse = trial.startAyah;
        const endSurah = `"${trial.endSurahEnglishName}"`;
        const endSurahAr = `"${trial.endSurahName}"`;
        const endVerse = trial.endAyah;
        const firstWords = `"${trial.arabicSnippet.replace(/"/g, '""')}"`; 
        const endWords = `"${trial.arabicEndSnippet?.replace(/"/g, '""') ?? ""}"`;
        const score = record.score ?? ""; 
        const notes = `"${record.notes?.replace(/"/g, '""') ?? ""}"`; 
        return [trialNum, surah, surahAr, verse, endSurah, endSurahAr, endVerse, firstWords, endWords, score, notes].join(',');
    }).join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "musabaqa_prep_summary.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }, [sessionRecords]);
  
  useEffect(() => {
    const playerInstanceToCleanUp = audioPlayer;
    return () => {
      if (playerInstanceToCleanUp) {
        playerInstanceToCleanUp.pause();
        playerInstanceToCleanUp.oncanplaythrough = null;
        playerInstanceToCleanUp.onerror = null;
        playerInstanceToCleanUp.onended = null;
        playerInstanceToCleanUp.onplay = null;
        playerInstanceToCleanUp.onpause = null;
        playerInstanceToCleanUp.src = '';
      }
    };
  }, [audioPlayer]); 

  const handleCategorySelected = (category: CategoryInfo) => {
    setSelectedCategory(category);
    setViewMode('configureSession');
  };

  const handleSessionConfigured = (trials: number) => {
    if (selectedCategory) {
      startNewSession(selectedCategory, trials);
    } else {
      resetToCategorySelection();
    }
  };


  return (
    <div className="min-h-screen dark:bg-gray-800/50 islamic-bg-pattern text-green-900 dark:text-green-100 flex flex-col items-center justify-center p-4 selection:bg-yellow-400 selection:text-yellow-900 transition-colors duration-300">
      <header className="mb-6 text-center w-full max-w-2xl relative">
        <h1 className="text-5xl font-bold text-green-700 dark:text-green-300 arabic-text" style={{ fontVariantLigatures: 'common-ligatures' }}>مُسابَقَة بْرِيب</h1>
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-300">Musabaqa Prep</h1>
        <p className="text-lg text-yellow-700 dark:text-yellow-400 mt-2">Practice for your Quran Memorization Competition</p>
        
        <div className="absolute top-0 right-0 mt-2 mr-2 flex items-center space-x-2">
            <button
                onClick={toggleTheme}
                className="p-2 text-green-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <button 
                onClick={() => setShowSettings(prev => !prev)} 
                className="p-2 text-green-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
                title="Settings"
                aria-label="Toggle Settings"
            >
                <SettingsIcon className="w-7 h-7" />
            </button>
        </div>
      </header>
      
      {showSettings && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-lg p-4 mb-4 w-full max-w-md animate-fadeInDown">
          <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-3">Settings</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showEndSnippet"
              checked={showEndVerseSnippet}
              onChange={(e) => setShowEndVerseSnippet(e.target.checked)}
              className="w-5 h-5 text-yellow-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 focus:ring-2"
            />
            <label htmlFor="showEndSnippet" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Show first words of the <span className="font-semibold">ending verse</span> for each trial.
            </label>
          </div>
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">Note: Enabling this might affect the trial's objectivity.</p>
        </div>
      )}


      <main className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-10 w-full max-w-2xl min-h-[400px]">
        {viewMode === 'category' && (
          <CategorySelectionScreen
            categories={CATEGORY_DEFINITIONS}
            onSelectCategory={handleCategorySelected}
          />
        )}
        {viewMode === 'configureSession' && selectedCategory && (
          <ConfigureSessionScreen
            category={selectedCategory}
            onStartSession={handleSessionConfigured}
            onBack={() => setViewMode('category')}
          />
        )}
        {viewMode === 'trial' && selectedCategory && (
          <TrialScreen
            category={selectedCategory}
            currentAttempt={currentAttempt}
            maxAttempts={numberOfTrials} 
            trial={currentTrialDisplay}
            sessionMessage={sessionMessage}
            onNextTrial={handleNextTrial}
            onChangeCategory={resetToCategorySelection}
            score={currentTrialScore}
            onScoreChange={setCurrentTrialScore}
            notes={currentTrialNotes}
            onNotesChange={setCurrentTrialNotes}
            onRegenerateTrial={handleRegenerateTrial} // Updated prop name
            onPlayPauseToggle={handlePlayPauseToggle}
            onStopAudio={handleStopAudio}
            isAudioLoading={isAudioLoading}
            isAudioCurrentlyPlaying={isAudioCurrentlyPlaying}
            audioPlayerExists={!!audioPlayer} 
            isSessionActive={currentAttempt > 0 && currentAttempt <= numberOfTrials && !!currentTrialDisplay}
            onStartSession={() => { 
              if (selectedCategory) {
                setViewMode('configureSession'); 
              }
            }}
            showEndVerseSnippetSetting={showEndVerseSnippet} 
          />
        )}
        {viewMode === 'summary' && (
          <SummaryScreen
            records={sessionRecords.filter(r => r !== null && r.trial !== null) as TrialRecord[]}
            onRestart={() => { 
              if (selectedCategory) {
                setViewMode('configureSession'); 
              } else {
                resetToCategorySelection(); 
              }
            }}
            onBackToCategories={resetToCategorySelection}
            onExportCSV={exportToCSV}
            totalTrialsConfigured={numberOfTrials}
          />
        )}
      </main>
      <footer className="mt-8 text-center text-sm text-green-600 dark:text-green-300">
        <p>&copy; {new Date().getFullYear()} Musabaqa Prep. Enhance your Hifdh.</p>
      </footer>
    </div>
  );
};

export default App;
