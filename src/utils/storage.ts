import { PlayerProfile } from '../types';

const STORAGE_KEY = 'pixel_flappy_quest_profile_v1';

const DEFAULT_PROFILE: PlayerProfile = {
  playerName: '見習い冒険者',
  selectedCharacterId: 'hero',
  selectedEquipmentIds: ['none'],
  gems: 30, // Initial bonus gems!
  unlockedCharacterIds: ['hero'],
  unlockedEquipmentIds: ['none'],
  highScore: 0,
  totalRuns: 0,
  soundEnabled: true,
  bgmEnabled: true,
};

export function loadProfile(): PlayerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch (e) {
    console.error('Failed to load profile', e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}
