import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, ShoppingBag, Home, Tv, Sparkles, Flame, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameOverModalProps {
  score: number;
  highScore: number;
  gemsEarned: number;
  characterName: string;
  hasUsedAdRetry: boolean;
  onRetry: () => void;
  onWatchAdRetry: () => void;
  onOpenRanking: () => void;
  onOpenShop: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  gemsEarned,
  characterName,
  hasUsedAdRetry,
  onRetry,
  onWatchAdRetry,
  onOpenRanking,
  onOpenShop,
  onGoHome
}) => {
  const [quote, setQuote] = useState<string>('天の声が勇者の戦いぶりを見守っている…');
  const [loadingQuote, setLoadingQuote] = useState<boolean>(true);
  const isNewHighScore = score > highScore && score > 0;

  useEffect(() => {
    if (isNewHighScore) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Fetch AI narrator quote
    const fetchQuote = async () => {
      setLoadingQuote(true);
      try {
        const res = await fetch('/api/ai/narrator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score,
            characterName,
            obstacleName: '古代遺跡の石柱'
          })
        });
        if (res.ok) {
          const data = await res.json();
          setQuote(data.quote || '「さらなる高みを目指して再び羽ばたけ！」');
        }
      } catch (e) {
        setQuote('「勇者の旅路は何度でも蘇る！」');
      } finally {
        setLoadingQuote(false);
      }
    };

    fetchQuote();
  }, [score]);

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        id="gameover-modal-card"
        className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl w-full max-w-md p-6 flex flex-col items-center shadow-2xl relative overflow-hidden"
      >
        {/* Top Banner */}
        <div className="bg-rose-950 text-rose-400 font-mono text-xs font-bold px-4 py-1 rounded-full border border-rose-500/40 uppercase tracking-widest mb-4">
          GAME OVER • 冒険失敗
        </div>

        {isNewHighScore && (
          <div className="animate-bounce bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold px-4 py-1 rounded-full text-xs shadow-lg mb-3 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span>新記録（NEW HIGH SCORE）達成！</span>
          </div>
        )}

        {/* Score Board */}
        <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5 flex items-center justify-around shadow-inner">
          <div className="text-center">
            <span className="block text-[11px] text-slate-400 font-mono mb-1">獲得スコア</span>
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-500" />
              <span className="text-3xl font-extrabold text-white font-mono">{score}</span>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="text-center">
            <span className="block text-[11px] text-slate-400 font-mono mb-1">ハイスコア</span>
            <span className="text-xl font-bold text-amber-400 font-mono block mt-1">
              {Math.max(score, highScore)}
            </span>
          </div>
        </div>

        {/* Gem Reward Box */}
        <div className="w-full bg-gradient-to-r from-sky-950/50 via-slate-900 to-blue-950/50 border border-sky-500/30 rounded-xl p-3 mb-5 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="text-xs text-sky-200 font-bold">今回の冒険報酬</span>
          </div>
          <span className="text-lg font-bold font-mono text-sky-300">+{gemsEarned} ジェム</span>
        </div>

        {/* AI Narrator Quote Box */}
        <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 mb-6 relative">
          <span className="absolute -top-2.5 left-4 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            ✨ AI 天の声（ナレーター）
          </span>
          {loadingQuote ? (
            <div className="text-xs text-slate-400 italic py-1 animate-pulse">
              天の声が言葉を紡ぎ出している...
            </div>
          ) : (
            <p className="text-xs text-amber-200 font-medium leading-relaxed italic">
              {quote}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {/* Ad Continue Button */}
          {!hasUsedAdRetry && (
            <button
              id="btn-ad-retry"
              onClick={onWatchAdRetry}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-600/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30 animate-pulse"
            >
              <Tv className="w-4 h-4" />
              <span>広告を見てこのスコアから復活する (無料)</span>
            </button>
          )}

          {/* Normal Retry */}
          <button
            id="btn-gameover-retry"
            onClick={onRetry}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>最初からリトライする</span>
          </button>

          {/* Secondary links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id="btn-gameover-ranking"
              onClick={onOpenRanking}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>ランキング登録</span>
            </button>

            <button
              id="btn-gameover-shop"
              onClick={onOpenShop}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>装備強化</span>
            </button>
          </div>

          <button
            id="btn-gameover-gohome"
            onClick={onGoHome}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition font-mono flex items-center justify-center gap-1 mt-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>タイトル画面へ戻る</span>
          </button>
        </div>
      </div>
    </div>
  );
};
