import { JuzBoundary } from '../types';

// Data based on common Juz divisions (e.g., as found on quran.com)
// Note: Ayah counts are inclusive for the Juz.
export const juzBoundaries: JuzBoundary[] = [
  { juz: 1, startSurahId: 1, startAyah: 1, endSurahId: 2, endAyah: 141 },
  { juz: 2, startSurahId: 2, startAyah: 142, endSurahId: 2, endAyah: 252 },
  { juz: 3, startSurahId: 2, startAyah: 253, endSurahId: 3, endAyah: 92 },
  { juz: 4, startSurahId: 3, startAyah: 93, endSurahId: 4, endAyah: 23 },
  { juz: 5, startSurahId: 4, startAyah: 24, endSurahId: 4, endAyah: 147 },
  { juz: 6, startSurahId: 4, startAyah: 148, endSurahId: 5, endAyah: 81 },
  { juz: 7, startSurahId: 5, startAyah: 82, endSurahId: 6, endAyah: 110 },
  { juz: 8, startSurahId: 6, startAyah: 111, endSurahId: 7, endAyah: 87 },
  { juz: 9, startSurahId: 7, startAyah: 88, endSurahId: 8, endAyah: 40 },
  { juz: 10, startSurahId: 8, startAyah: 41, endSurahId: 9, endAyah: 92 },
  { juz: 11, startSurahId: 9, startAyah: 93, endSurahId: 11, endAyah: 5 },
  { juz: 12, startSurahId: 11, startAyah: 6, endSurahId: 12, endAyah: 52 },
  { juz: 13, startSurahId: 12, startAyah: 53, endSurahId: 14, endAyah: 52 }, // Ibrahim ends at 52
  { juz: 14, startSurahId: 15, startAyah: 1, endSurahId: 16, endAyah: 128 }, // Al-Hijr starts at 1, An-Nahl ends at 128
  { juz: 15, startSurahId: 17, startAyah: 1, endSurahId: 18, endAyah: 74 }, // Al-Isra starts at 1, Al-Kahf to 74
  { juz: 16, startSurahId: 18, startAyah: 75, endSurahId: 20, endAyah: 135 }, // Al-Kahf from 75, Taha ends at 135
  { juz: 17, startSurahId: 21, startAyah: 1, endSurahId: 22, endAyah: 78 }, // Al-Anbiya starts at 1, Al-Hajj ends at 78
  { juz: 18, startSurahId: 23, startAyah: 1, endSurahId: 25, endAyah: 20 }, // Al-Muminun starts at 1, Al-Furqan to 20
  { juz: 19, startSurahId: 25, startAyah: 21, endSurahId: 27, endAyah: 55 }, // Al-Furqan from 21, An-Naml to 55
  { juz: 20, startSurahId: 27, startAyah: 56, endSurahId: 29, endAyah: 45 }, // An-Naml from 56, Al-Ankabut to 45
  { juz: 21, startSurahId: 29, startAyah: 46, endSurahId: 33, endAyah: 30 }, // Al-Ankabut from 46, Al-Ahzab to 30
  { juz: 22, startSurahId: 33, startAyah: 31, endSurahId: 36, endAyah: 27 }, // Al-Ahzab from 31, Ya-Sin to 27
  { juz: 23, startSurahId: 36, startAyah: 28, endSurahId: 39, endAyah: 31 }, // Ya-Sin from 28, Az-Zumar to 31
  { juz: 24, startSurahId: 39, startAyah: 32, endSurahId: 41, endAyah: 46 }, // Az-Zumar from 32, Fussilat to 46
  { juz: 25, startSurahId: 41, startAyah: 47, endSurahId: 45, endAyah: 37 }, // Fussilat from 47, Al-Jathiya ends at 37
  { juz: 26, startSurahId: 46, startAyah: 1, endSurahId: 51, endAyah: 30 }, // Al-Ahqaf starts at 1, Adh-Dhariyat to 30
  { juz: 27, startSurahId: 51, startAyah: 31, endSurahId: 57, endAyah: 29 }, // Adh-Dhariyat from 31, Al-Hadid ends at 29
  { juz: 28, startSurahId: 58, startAyah: 1, endSurahId: 66, endAyah: 12 }, // Al-Mujadila starts at 1, At-Tahrim ends at 12
  { juz: 29, startSurahId: 67, startAyah: 1, endSurahId: 77, endAyah: 50 }, // Al-Mulk starts at 1, Al-Mursalat ends at 50
  { juz: 30, startSurahId: 78, startAyah: 1, endSurahId: 114, endAyah: 6 },   // An-Naba starts at 1, An-Nas ends at 6
];
