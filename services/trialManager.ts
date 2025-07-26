import { CategoryInfo, Trial, JuzBoundary } from '../types';
import { Surah } from './quranData';
import { MIN_TRIAL_VERSE_COUNT, MAX_TRIAL_VERSE_COUNT } from '../constants';
import { juzBoundaries } from './juzData';

const findSurahById = (id: number, allSurahs: Surah[]): Surah | undefined => allSurahs.find(s => s.id === id);

const fetchAndProcessAyahText = async (surahId: number, ayahNum: number): Promise<{ text: string, globalAyahNum: number | null }> => {
  let snippet = '';
  let globalAyahNumber: number | null = null;
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahId}:${ayahNum}/quran-uthmani`);
    if (response.ok) {
      const ayahData = await response.json();
      const ayahTextContent = ayahData?.data?.text;
      globalAyahNumber = ayahData?.data?.number ?? null;

      if (ayahTextContent) {
        const trimmedText = ayahTextContent.trim();
        if (trimmedText) { 
          const words = trimmedText.split(/\s+/);
          if (words.length <= 4) { 
            snippet = trimmedText;
          } else {
            snippet = words.slice(0, 4).join(' ') + ' ...';
          }
        }
      } else {
        console.warn(`No text found in API response for S${surahId}A${ayahNum}`);
      }
    } else {
      console.error(`API error for S${surahId}A${ayahNum}: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Failed to fetch Ayah text for S${surahId}A${ayahNum}:`, error);
  }
  return { text: snippet, globalAyahNum: globalAyahNumber };
};


export const generateTrial = async (
  category: CategoryInfo,
  currentAttemptForTrial: number, // 1-indexed
  allSurahs: Surah[],
  totalTrialsInSession: number // Parameter for dynamic Juz segmentation
  // shouldFetchEndSnippet removed
): Promise<Trial | null> => {
  if (currentAttemptForTrial < 1 || currentAttemptForTrial > totalTrialsInSession) {
    console.error("Invalid attempt number:", currentAttemptForTrial, "for total trials:", totalTrialsInSession);
    return null;
  }

  const totalJuzInCategory = category.endJuz - category.startJuz + 1;

  // Distribute Juz across trials as evenly as possible.
  // This robustly handles all combinations of Juz counts and trial counts,
  // including cases where there are more trials than available Juz.
  const baseSegmentSize = Math.floor(totalJuzInCategory / totalTrialsInSession);
  const remainder = totalJuzInCategory % totalTrialsInSession;

  // The first `remainder` trials get an extra Juz to distribute them evenly.
  const segmentSizeForCurrentTrial = baseSegmentSize + (currentAttemptForTrial <= remainder ? 1 : 0);

  // If a segment has no Juz assigned, it's not a valid trial.
  if (segmentSizeForCurrentTrial <= 0) {
    console.warn(`Trial ${currentAttemptForTrial}/${totalTrialsInSession} has no Juz assigned in category "${category.title}". This can happen if you request more trials than there are Juz.`);
    return null;
  }

  // Calculate the starting offset based on the sizes of previous segments.
  const juzOffsetForPriorSegments = (currentAttemptForTrial - 1) * baseSegmentSize + Math.min(currentAttemptForTrial - 1, remainder);

  const segmentStartJuzNum = category.startJuz + juzOffsetForPriorSegments;
  const segmentEndJuzNum = segmentStartJuzNum + segmentSizeForCurrentTrial - 1;

  const segmentStartJuzInfo = juzBoundaries.find(j => j.juz === segmentStartJuzNum);
  const segmentEndJuzInfo = juzBoundaries.find(j => j.juz === segmentEndJuzNum);

  if (!segmentStartJuzInfo || !segmentEndJuzInfo) {
    console.error("Could not find Juz info for segment:", segmentStartJuzNum, segmentEndJuzNum);
    return null;
  }
  
  const actualSegmentStartSurahId = segmentStartJuzInfo.startSurahId;
  const actualSegmentEndSurahId = segmentEndJuzInfo.endSurahId;

  const eligibleSurahsForStarting = allSurahs.filter(surah => {
    const isInJuzSegmentSurahRange = surah.id >= actualSegmentStartSurahId && surah.id <= actualSegmentEndSurahId;
    const isInCateogrySurahRange = surah.id >= category.range.startSurahId && surah.id <= category.range.endSurahId;
    return isInJuzSegmentSurahRange && isInCateogrySurahRange;
  });

  if (eligibleSurahsForStarting.length === 0) {
    console.warn("No eligible Surahs found for starting a trial in category and Juz segment:", category.title, `Juz ${segmentStartJuzNum}-${segmentEndJuzNum}`);
    return null;
  }

  const chosenStartSurah = eligibleSurahsForStarting[Math.floor(Math.random() * eligibleSurahsForStarting.length)];

  let minPossibleStartAyahInChosenSurah = 1;
  if (chosenStartSurah.id === category.range.startSurahId) {
    minPossibleStartAyahInChosenSurah = Math.max(minPossibleStartAyahInChosenSurah, category.range.startAyah);
  }
  if (chosenStartSurah.id === segmentStartJuzInfo.startSurahId) {
    minPossibleStartAyahInChosenSurah = Math.max(minPossibleStartAyahInChosenSurah, segmentStartJuzInfo.startAyah);
  }

  let maxPossibleStartAyahInChosenSurah = chosenStartSurah.totalVerses;
   if (chosenStartSurah.id === category.range.endSurahId) {
    maxPossibleStartAyahInChosenSurah = Math.min(maxPossibleStartAyahInChosenSurah, category.range.endAyah);
  }
  if (chosenStartSurah.id === segmentEndJuzInfo.endSurahId) {
     maxPossibleStartAyahInChosenSurah = Math.min(maxPossibleStartAyahInChosenSurah, segmentEndJuzInfo.endAyah);
  }
  
  const currentTrialTargetLength = Math.floor(Math.random() * (MAX_TRIAL_VERSE_COUNT - MIN_TRIAL_VERSE_COUNT + 1)) + MIN_TRIAL_VERSE_COUNT;

  const effectiveMaxStartAyah = Math.max(minPossibleStartAyahInChosenSurah, maxPossibleStartAyahInChosenSurah - currentTrialTargetLength + 1);
  
  if (minPossibleStartAyahInChosenSurah > effectiveMaxStartAyah) {
     console.warn(`Cannot pick a start ayah in Surah ${chosenStartSurah.englishName} (${chosenStartSurah.id}) that allows for ${currentTrialTargetLength} verses. Min: ${minPossibleStartAyahInChosenSurah}, EffectiveMax: ${effectiveMaxStartAyah}, TrueMax: ${maxPossibleStartAyahInChosenSurah}. Constraints may be too tight or surah too short.`);
      if (minPossibleStartAyahInChosenSurah > maxPossibleStartAyahInChosenSurah) return null; 
  }

  const trialStartAyah = Math.floor(Math.random() * (effectiveMaxStartAyah - minPossibleStartAyahInChosenSurah + 1)) + minPossibleStartAyahInChosenSurah;

  let versesCollected = 0;
  let currentCollectingSurah = chosenStartSurah;
  let currentCollectingAyah = trialStartAyah;
  
  let trialEndSurahId = chosenStartSurah.id;
  let trialEndSurahName = chosenStartSurah.name;
  let trialEndSurahEnglishName = chosenStartSurah.englishName;
  let trialEndAyah = trialStartAyah;

  while (versesCollected < currentTrialTargetLength) {
    let surahEndBoundaryAyah = currentCollectingSurah.totalVerses;
    if (currentCollectingSurah.id === category.range.endSurahId) {
      surahEndBoundaryAyah = Math.min(surahEndBoundaryAyah, category.range.endAyah);
    }
    if (currentCollectingSurah.id === segmentEndJuzInfo.endSurahId) {
      surahEndBoundaryAyah = Math.min(surahEndBoundaryAyah, segmentEndJuzInfo.endAyah);
    }

    const ayahsAvailableInCurrentSurah = surahEndBoundaryAyah - currentCollectingAyah + 1;

    if (ayahsAvailableInCurrentSurah <= 0) break; 
    
    const ayahsToTakeFromCurrentSurah = Math.min(ayahsAvailableInCurrentSurah, currentTrialTargetLength - versesCollected);
    
    trialEndAyah = currentCollectingAyah + ayahsToTakeFromCurrentSurah - 1;
    trialEndSurahId = currentCollectingSurah.id;
    trialEndSurahName = currentCollectingSurah.name;
    trialEndSurahEnglishName = currentCollectingSurah.englishName;
    versesCollected += ayahsToTakeFromCurrentSurah;

    if (versesCollected >= currentTrialTargetLength) break;
    
    const isLastSurahOfQuran = currentCollectingSurah.id >= 114;
    const isLastSurahOfCategory = currentCollectingSurah.id >= category.range.endSurahId;
    const isLastSurahOfJuzSegment = currentCollectingSurah.id >= segmentEndJuzInfo.endSurahId;

    if (isLastSurahOfQuran || isLastSurahOfCategory || isLastSurahOfJuzSegment) break; 

    const nextSurahCandidateId = currentCollectingSurah.id + 1;
    if (nextSurahCandidateId > category.range.endSurahId || nextSurahCandidateId > segmentEndJuzInfo.endSurahId) break;

    const nextSurah = findSurahById(nextSurahCandidateId, allSurahs);
    if (!nextSurah) break;
    
    currentCollectingSurah = nextSurah;
    currentCollectingAyah = 1; 
    
    if (currentCollectingSurah.id === category.range.startSurahId && category.range.startAyah > 1) {
        currentCollectingAyah = Math.max(currentCollectingAyah, category.range.startAyah);
    }
    if (currentCollectingSurah.id === segmentStartJuzInfo.startSurahId && segmentStartJuzInfo.startAyah > 1) {
       currentCollectingAyah = Math.max(currentCollectingAyah, segmentStartJuzInfo.startAyah);
    }
  }

  if (versesCollected === 0 && chosenStartSurah && trialStartAyah >=1 && trialStartAyah <= chosenStartSurah.totalVerses) { 
     trialEndAyah = trialStartAyah;
     trialEndSurahId = chosenStartSurah.id;
     trialEndSurahName = chosenStartSurah.name;
     trialEndSurahEnglishName = chosenStartSurah.englishName;
     console.warn("Forced 1-ayah trial as collection failed but start was valid.");
  } else if (versesCollected === 0) {
    console.warn("Failed to collect any verses. Constraints might be too tight or data issue.");
    return null;
  }
  
  const { text: startSnippet, globalAyahNum: startGlobalAyahNumber } = await fetchAndProcessAyahText(chosenStartSurah.id, trialStartAyah);
  if (startGlobalAyahNumber === null) {
    console.error("Failed to get global ayah number for the starting verse. Audio might not work.");
  }

  // Always fetch the end snippet
  const { text: fetchedEndSnippet } = await fetchAndProcessAyahText(trialEndSurahId, trialEndAyah);
  const endSnippet = fetchedEndSnippet;

  return {
    surahId: chosenStartSurah.id,
    surahName: chosenStartSurah.name,
    surahEnglishName: chosenStartSurah.englishName,
    startAyah: trialStartAyah,
    startGlobalAyahNumber: startGlobalAyahNumber ?? 0, 
    endSurahId: trialEndSurahId,
    endSurahName: trialEndSurahName,
    endSurahEnglishName: trialEndSurahEnglishName,
    endAyah: trialEndAyah,
    arabicSnippet: startSnippet,
    arabicEndSnippet: endSnippet,
  };
};