
import { CategoryInfo, MemorizationCategory } from './types';
import { surahData } from './services/quranData';

// Helper to safely get Surah total verses, defaulting to a high number if not found (should not happen with complete data)
const getSurahTotalVerses = (id: number): number => {
  const surah = surahData.find(s => s.id === id);
  return surah ? surah.totalVerses : 286; // Default to Al-Baqarah's verses if error
};

export const CATEGORY_DEFINITIONS: CategoryInfo[] = [
  {
    id: MemorizationCategory.LAST_5_JUZ, // Juz 26-30
    title: 'Last 5 Juz',
    description: 'Juz 26-30 (Approx. Surah Al-Ahqaf to An-Nas)',
    range: {
      startSurahId: 46, 
      startAyah: 1,     
      endSurahId: 114, 
      endAyah: getSurahTotalVerses(114),
    },
    startJuz: 26,
    endJuz: 30,
  },
  {
    id: MemorizationCategory.LAST_10_JUZ, // Juz 21-30
    title: 'Last 10 Juz',
    description: 'Juz 21-30 (Approx. Surah Al-Ankabut Ayah 46 to An-Nas)',
    range: {
      startSurahId: 29, 
      startAyah: 46,    
      endSurahId: 114, 
      endAyah: getSurahTotalVerses(114),
    },
    startJuz: 21,
    endJuz: 30,
  },
  {
    id: MemorizationCategory.HALF_QURAN, // Juz 16-30
    title: 'Half Quran (Last 15 Juz)',
    description: 'Juz 16-30 (Approx. Surah Al-Kahf Ayah 75 to An-Nas)',
    range: {
      startSurahId: 18, 
      startAyah: 75,    
      endSurahId: 114, 
      endAyah: getSurahTotalVerses(114),
    },
    startJuz: 16,
    endJuz: 30,
  },
  {
    id: MemorizationCategory.FULL_QURAN,
    title: 'Full Quran (Juz 1-30)',
    description: 'Juz 1-30 (Surah Al-Baqarah to An-Nas)',
    range: {
      startSurahId: 2, 
      startAyah: 1,
      endSurahId: 77, 
      endAyah: getSurahTotalVerses(77),
    },
    startJuz: 1,
    endJuz: 29,
  },
];

// MAX_ATTEMPTS is removed from here. It's now a state `numberOfTrials` in App.tsx.
// Default number of trials can be set in App.tsx's state.

export const MIN_TRIAL_VERSE_COUNT = 10; // Each trial should cover at least this many verses.
export const MAX_TRIAL_VERSE_COUNT = 25; // Each trial should cover at most this many verses.