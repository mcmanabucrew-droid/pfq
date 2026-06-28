import React, { useState, useEffect, useCallback } from 'react';
import { PlayerProfile, Character, Equipment } from './types';
import { loadProfile, saveProfile } from './utils/storage';
import { CHARACTERS, EQUIPMENTS } from './data/items';
import { sounds } from './utils/audio';
import { Navbar } from './components/Navbar';
import { ShopModal } from './components/ShopModal';
import { RankingModal } from './components/RankingModal';
import { AdRewardModal } from './components/AdRewardModal';
import { GameOverModal } from './components/GameOverModal';
import { ReleaseGuideModal } from './components/ReleaseGuideModal';
import { GameCanvas } from './components/GameCanvas';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [gameState, setGameState] = useState<'home' | 'playing' | 'gameover'>('home');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [runGems, setRunGems] = useState<number>(0);
  const [hasUsedAdRetry, setHasUsedAdRetry] = useState<boolean>(false);
  const [isContinuing, setIsContinuing] = useState<boolean>(false);
  
  // Modals
  const [activeModal, setActiveModal] = useState<'shop' | 'ranking' | 'ad_retry' | 'ad_gems' | 'release_guide' | null>(null);

  // Sync profile to localStorage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Sync sound settings & Start BGM
  useEffect(() => {
    sounds.setMuted(!profile.soundEnabled);
    if (profile.soundEnabled) {
      sounds.startBGM();
    } else {
      sounds.stopBGM();
    }
  }, [profile.soundEnabled]);

  // First touch unlocker for browser autoplay policies
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (profile.soundEnabled) {
        sounds.startBGM();
      }
    };
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [profile.soundEnabled]);

  const handleToggleSound = useCallback(() => {
    setProfile(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const handleStartGame = useCallback(() => {
    setGameState('playing');
    setIsContinuing(false);
    setCurrentScore(0);
    setRunGems(0);
    setHasUsedAdRetry(false);
    if (profile.soundEnabled) {
      sounds.playRandomBGM();
    }
  }, [profile.soundEnabled]);

  const handleGoHome = useCallback(() => {
    setGameState('home');
    setIsContinuing(false);
    setActiveModal(null);
  }, []);

  const handleScoreUpdate = useCallback((score: number) => {
    setCurrentScore(score);
  }, []);

  const handleCoinCollect = useCallback((coinBonus: number) => {
    setRunGems(prev => prev + coinBonus);
    setProfile(prev => ({ ...prev, gems: prev.gems + coinBonus }));
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('gameover');
    setIsContinuing(false);
    setProfile(prev => {
      // Every 3 score points also give 1 gem
      const scoreBonus = Math.floor(currentScore / 3);
      const totalEarned = runGems + scoreBonus;
      const newHighScore = Math.max(prev.highScore, currentScore);
      return {
        ...prev,
        gems: prev.gems + scoreBonus,
        highScore: newHighScore,
        totalRuns: prev.totalRuns + 1
      };
    });
  }, [currentScore, runGems]);

  const handleRetry = useCallback(() => {
    setGameState('playing');
    setIsContinuing(false);
    setCurrentScore(0);
    setRunGems(0);
    setHasUsedAdRetry(false);
    setActiveModal(null);
    if (profile.soundEnabled) {
      sounds.playRandomBGM();
    }
  }, [profile.soundEnabled]);

  // Shop actions
  const handleBuyCharacter = useCallback((char: Character) => {
    if (profile.gems < char.price) return;
    sounds.playBuy();
    setProfile(prev => ({
      ...prev,
      gems: prev.gems - char.price,
      unlockedCharacterIds: [...prev.unlockedCharacterIds, char.id],
      selectedCharacterId: char.id
    }));
  }, [profile.gems]);

  const handleSelectCharacter = useCallback((charId: string) => {
    sounds.playFlap();
    setProfile(prev => ({ ...prev, selectedCharacterId: charId }));
  }, []);

  const handleBuyEquipment = useCallback((eq: Equipment) => {
    if (profile.gems < eq.price) return;
    sounds.playBuy();
    setProfile(prev => ({
      ...prev,
      gems: prev.gems - eq.price,
      unlockedEquipmentIds: [...prev.unlockedEquipmentIds, eq.id],
      selectedEquipmentIds: [eq.id]
    }));
  }, [profile.gems]);

  const handleToggleEquipment = useCallback((eqId: string) => {
    sounds.playFlap();
    setProfile(prev => {
      const isEquipped = prev.selectedEquipmentIds.includes(eqId);
      if (isEquipped) {
        return { ...prev, selectedEquipmentIds: ['none'] };
      } else {
        return { ...prev, selectedEquipmentIds: [eqId] };
      }
    });
  }, []);

  const handleUpdatePlayerName = useCallback((newName: string) => {
    setProfile(prev => ({ ...prev, playerName: newName }));
  }, []);

  // Selected object lookups
  const activeChar = CHARACTERS.find(c => c.id === profile.selectedCharacterId) || CHARACTERS[0];
  const activeEq = EQUIPMENTS.find(e => e.id === (profile.selectedEquipmentIds[0] || 'none')) || EQUIPMENTS[0];

  // Ad Reward handle
  const handleClaimAdReward = useCallback(() => {
    sounds.playCoin();
    if (activeModal === 'ad_retry') {
      setHasUsedAdRetry(true);
      setActiveModal(null);
      setIsContinuing(true);
      setGameState('playing'); // Resume playing from current score
    } else if (activeModal === 'ad_gems') {
      setProfile(prev => ({ ...prev, gems: prev.gems + 15 }));
      setActiveModal(null);
    }
  }, [activeModal]);

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <Navbar
        gems={profile.gems}
        soundEnabled={profile.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenShop={() => setActiveModal('shop')}
        onOpenRanking={() => setActiveModal('ranking')}
        onGoHome={handleGoHome}
        gameState={gameState}
      />

      {/* Main Responsive Game Viewport */}
      <main className="flex-1 w-full relative flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
        <GameCanvas
          character={activeChar}
          equippedEffect={activeEq.effectType}
          gameState={gameState}
          isContinuing={isContinuing}
          onScoreUpdate={handleScoreUpdate}
          onCoinCollect={handleCoinCollect}
          onGameOver={handleGameOver}
          onStartGame={handleStartGame}
        />
      </main>

      {/* Modals */}
      {activeModal === 'release_guide' && (
        <ReleaseGuideModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'shop' && (
        <ShopModal
          profile={profile}
          onClose={() => setActiveModal(null)}
          onBuyCharacter={handleBuyCharacter}
          onBuyEquipment={handleBuyEquipment}
          onSelectCharacter={handleSelectCharacter}
          onToggleEquipment={handleToggleEquipment}
        />
      )}

      {activeModal === 'ranking' && (
        <RankingModal
          profile={profile}
          currentScore={currentScore}
          onClose={() => setActiveModal(null)}
          onUpdatePlayerName={handleUpdatePlayerName}
        />
      )}

      {(activeModal === 'ad_retry' || activeModal === 'ad_gems') && (
        <AdRewardModal
          rewardType={activeModal === 'ad_retry' ? 'retry' : 'gems'}
          onClose={() => setActiveModal(null)}
          onRewardClaimed={handleClaimAdReward}
        />
      )}

      {gameState === 'gameover' && activeModal === null && (
        <GameOverModal
          score={currentScore}
          highScore={profile.highScore}
          gemsEarned={runGems + Math.floor(currentScore / 3)}
          characterName={activeChar.name}
          hasUsedAdRetry={hasUsedAdRetry}
          onRetry={handleRetry}
          onWatchAdRetry={() => setActiveModal('ad_retry')}
          onOpenRanking={() => setActiveModal('ranking')}
          onOpenShop={() => setActiveModal('shop')}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
