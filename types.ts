
export enum MemorizationCategory {
  LAST_5_JUZ = 'LAST_5_JUZ',
  LAST_10_JUZ = 'LAST_10_JUZ',
  HALF_QURAN = 'HALF_QURAN',
  FULL_QURAN = 'FULL_QURAN',
}

export interface CategorySurahRange {
  startSurahId: number;
  startAyah: number;
  endSurahId: number;
  endAyah: number;
}

export interface CategoryInfo {
  id: MemorizationCategory;
  title: string;
  description: string;
  range: CategorySurahRange;
  startJuz: number;
  endJuz: number;
}

export interface Trial {
  surahId: number;
  surahName: string; // Arabic name of starting surah
  surahEnglishName: string; // Transliterated name of starting surah
  startAyah: number;
  startGlobalAyahNumber: number; // Global number of the starting Ayah in the Quran
  endSurahId: number;
  endSurahName: string; // Arabic name of ending surah
  endSurahEnglishName: string; // Transliterated name of ending surah
  endAyah: number;
  arabicSnippet: string; // First 3-4 words of the starting ayah, or full ayah if short
  arabicEndSnippet?: string; // Optional: First 3-4 words of the ending ayah
}

export interface JuzBoundary {
  juz: number;
  startSurahId: number;
  startAyah: number;
  endSurahId: number;
  endAyah: number;
}

export interface TrialRecord {
  trial: Trial;
  score: number | null;
  notes: string;
}
