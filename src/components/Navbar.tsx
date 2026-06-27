import React from 'react';
import { Volume2, VolumeX, Gem, Home, Trophy, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  gems: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShop: () => void;
  onOpenRanking: () => void;
  onGoHome: () => void;
  gameState: 'home' | 'playing' | 'gameover' | 'paused';
}

export const Navbar: React.FC<NavbarProps> = ({
  gems,
  soundEnabled,
  onToggleSound,
  onOpenShop,
  onOpenRanking,
  onGoHome,
  gameState
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 px-3 py-2 flex items-center justify-between z-20 sticky top-0 shadow-md">
      {/* Brand / Home button */}
      <div className="flex items-center gap-2">
        <button
          id="btn-nav-home"
          onClick={onGoHome}
          className="flex items-center gap-2 text-white font-bold tracking-wider hover:text-amber-400 transition cursor-pointer"
        >
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center border border-blue-400 shadow-inner">
            <span className="text-xs">⚔️</span>
          </div>
          <span className="hidden sm:inline font-mono">PIXEL FLAPPY QUEST</span>
        </button>
      </div>

      {/* Center Actions / Status */}
      <div className="flex items-center gap-2 xs:gap-3">
        {/* Gem Display */}
        <div 
          id="nav-gem-display"
          className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-full border border-sky-500/30 shadow-inner"
        >
          <Gem className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span className="text-sky-300 font-mono font-bold text-xs sm:text-sm">{gems}</span>
        </div>

        {/* Quick Shop Button */}
        {gameState !== 'playing' && (
          <button
            id="btn-nav-shop"
            onClick={onOpenShop}
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1.5 rounded-lg font-bold text-xs shadow transition active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden md:inline">装備</span>
          </button>
        )}

        {/* Ranking Button */}
        {gameState !== 'playing' && (
          <button
            id="btn-nav-ranking"
            onClick={onOpenRanking}
            className="flex items-center gap-1 bg-violet-600 hover:bg-violet-500 text-white px-2.5 py-1.5 rounded-lg font-bold text-xs shadow transition active:scale-95 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">順位</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5">
        {gameState !== 'home' && (
          <button
            id="btn-go-home-icon"
            onClick={onGoHome}
            title="タイトルへ戻る"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>
        )}

        <button
          id="btn-toggle-sound"
          onClick={onToggleSound}
          title={soundEnabled ? 'ミュートにする' : '音声をオンにする'}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>
      </div>
    </header>
  );
};
