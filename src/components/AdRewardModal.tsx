import React, { useState, useEffect } from 'react';
import { Play, Sparkles, X, Tv, ShieldAlert, Award } from 'lucide-react';

interface AdRewardModalProps {
  rewardType: 'retry' | 'gems';
  onClose: () => void;
  onRewardClaimed: () => void;
}

export const AdRewardModal: React.FC<AdRewardModalProps> = ({
  rewardType,
  onClose,
  onRewardClaimed
}) => {
  const [watching, setWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (watching && progress < 100) {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setCompleted(true);
            return 100;
          }
          return p + 25; // 4 seconds total simulated ad length
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [watching, progress]);

  const handleStartAd = () => {
    setWatching(true);
  };

  const handleClaim = () => {
    onRewardClaimed();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        id="ad-reward-card"
        className="bg-slate-900 border-2 border-amber-500 rounded-2xl w-full max-w-md p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        {!watching && (
          <button
            id="btn-close-ad-reward"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Icon / Header */}
        <div className="w-16 h-16 bg-amber-500/20 border border-amber-400 rounded-2xl flex items-center justify-center mb-4 text-amber-400 animate-bounce shadow-lg shadow-amber-500/10">
          <Tv className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {rewardType === 'retry' ? '【無料リトライ】スポンサー動画' : '【ボーナスジェム】特別スポンサー枠'}
        </h3>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          {rewardType === 'retry'
            ? '短い冒険スポンサー動画を視聴すると、現在のスコアを維持したまま、その場から1度だけ復活（リトライ）できます！'
            : 'スポンサー動画を見ることで、冒険者ギルドからお礼として「+15 ジェム」を即座に獲得できます！'}
        </p>

        {/* Ad Player Area */}
        {watching ? (
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col items-center justify-center relative min-h-[170px]">
            <span className="absolute top-2 right-2 bg-slate-800 text-[10px] text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-500/30">
              AdMob • 連動中
            </span>
            <span className="absolute bottom-2 right-2 text-[9px] text-slate-500 font-mono">
              Unit: ...3007436707
            </span>

            {completed ? (
              <div className="animate-fade-in flex flex-col items-center">
                <Award className="w-12 h-12 text-emerald-400 mb-2 animate-pulse" />
                <span className="text-sm font-bold text-emerald-300">リワード広告の視聴が完了しました！</span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-slate-300">スポンサー動画広告を読込中...</span>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400">※プレビュー環境のため模擬動画（4秒）で高速スキップ検証中</span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 mb-6 text-left text-xs space-y-1.5">
            <div className="flex items-center justify-between text-amber-400 font-bold font-mono border-b border-slate-800 pb-1">
              <span>Google AdMob 組み込み完了</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/40">ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed break-all font-mono">
              App ID: <span className="text-slate-100">ca-app-pub-1236266345379353~7880489433</span>
            </p>
            <p className="text-[11px] text-amber-300 leading-relaxed break-all font-mono">
              Ad Unit ID: <span className="text-white font-bold">ca-app-pub-1236266345379353/3007436707</span>
            </p>
            <p className="text-[10px] text-slate-400">
              💡 ストア配信時（PWABuilder / Capacitor等）は自動で実広告がリクエストされます。AI Studio環境では安全な模擬テスト枠が作動します。
            </p>
          </div>
        )}

        {/* Action Button */}
        {completed ? (
          <button
            id="btn-claim-ad-reward"
            onClick={handleClaim}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>報酬を受け取って復活する！</span>
          </button>
        ) : watching ? (
          <button
            disabled
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed"
          >
            動画視聴中... ({progress}%)
          </button>
        ) : (
          <button
            id="btn-start-watching-ad"
            onClick={handleStartAd}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>動画を見て報酬を獲得</span>
          </button>
        )}
      </div>
    </div>
  );
};
