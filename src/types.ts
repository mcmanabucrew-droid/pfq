export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number; // in Gems
  unlockedByDefault: boolean;
  color: string;
  accentColor: string;
  flapStrength: number; // e.g. -7 to -8.5
  gravity: number;
  spriteType: 'hero' | 'wizard' | 'paladin' | 'archmage' | 'dragon_knight' | 'dark_knight';
  perkText: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'aura' | 'trail' | 'head';
  price: number;
  unlockedByDefault: boolean;
  description: string;
  effectType: 'trail_fire' | 'trail_rainbow' | 'trail_gold' | 'trail_shadow' | 'aura_holy' | 'aura_dark' | 'weapon_sword' | 'weapon_staff' | 'weapon_excalibur' | 'none';
  coinBonusMultiplier?: number; // e.g. 1.2x coins
}

export interface PlayerProfile {
  playerName: string;
  selectedCharacterId: string;
  selectedEquipmentIds: string[]; // equipped items
  gems: number;
  unlockedCharacterIds: string[];
  unlockedEquipmentIds: string[];
  highScore: number;
  totalRuns: number;
  soundEnabled: boolean;
  bgmEnabled: boolean;
}

export interface Obstacle {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
  hasCoin: boolean;
  coinCollected?: boolean;
  coinY?: number;
  type: 'golem' | 'dragon_pillar' | 'dungeon_brick' | 'demon_gate';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface RankingItem {
  id: string;
  playerName: string;
  score: number;
  characterId: string;
  equipmentId: string;
  createdAt: number;
}
