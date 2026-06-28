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
    if (!watching || completed) return;

    const timer = setInterval(() => {
      setProgress(p => {
        const next = p + 25;
        if (next >= 100) {
          setCompleted(true);
          return 100;
        }
        return next;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [watching, completed]);

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
          <div className="w-full bg-slate-950 border-2 border-amber-500/80 rounded-xl p-5 mb-6 flex flex-col items-center justify-center relative min-h-[190px] shadow-inner overflow-hidden">
            <div className="absolute top-2.5 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] px-2 py-0.5 rounded font-extrabold tracking-wider shadow">
              ▶ SPONSORED CM
            </div>
            <span className="absolute top-2.5 right-3 bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">
              {completed ? "✅ 完了" : `残り ${Math.max(0, Math.ceil((100 - progress) / 25))} 秒`}
            </span>

            {completed ? (
              <div className="animate-fade-in flex flex-col items-center py-4">
                <Award className="w-14 h-14 text-emerald-400 mb-2 animate-bounce drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
                <span className="text-base font-bold text-emerald-300">動画視聴が完了しました！</span>
                <span className="text-xs text-slate-300 mt-1">下のボタンを押して報酬をお受け取りください</span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center my-4 animate-fade-in">
                {progress < 50 ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl animate-bounce">⚔️👑🐉</div>
                    <div className="text-sm font-extrabold text-amber-300 tracking-wide">王道ファンタジーRPG『ピクセル・サーガ』</div>
                    <div className="text-[11px] text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                      🎁 今なら新規ログインで「ダイヤ3000個」進呈中！
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 animate-fade-in">
                    <div className="text-4xl animate-pulse">💎🕊️✨</div>
                    <div className="text-sm font-extrabold text-sky-300 tracking-wide">空のパズル大冒険『スカイ・ジュエル』</div>
                    <div className="text-[11px] text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                      ⚡ 伝説の翼を手に入れ、未知の大空へ旅立とう！
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-slate-700 mt-5 mb-1.5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400">模擬動画スポンサーバナーを高速プレビュー再生中</span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 mb-6 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-amber-400 font-bold font-mono border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Google AdMob ユニット設定済
              </span>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] px-2 py-0.5 rounded border border-sky-500/40 font-sans font-bold">
                Webプレビュー動作中
              </span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
              <p className="text-slate-300 break-all">
                App ID: <span className="text-slate-100 font-semibold">ca-app-pub-1236266345379353~7880489433</span>
              </p>
              <p className="text-amber-300 break-all">
                Unit ID: <span className="text-white font-bold">ca-app-pub-1236266345379353/3007436707</span>
              </p>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg font-sans">
              <p className="font-bold text-amber-300">💡 なぜ今は本物の広告が出ないの？</p>
              <p>
                Google AdMobは<strong className="text-white">「スマホアプリ（Android / iOS）」専用の仕様</strong>となっています。現在のWebブラウザ（AI StudioやGitHub Pages）上でテスト中の間は安全な【模擬動画シミュレーター】が作動します。
              </p>
              <p className="text-slate-400 text-[10px] pt-0.5">
                ※PWABuilderやCapacitor等でAndroidアプリ（.apk）化してスマホにインストールすると、上記IDの実広告動画が自動配信されます。
              </p>
            </div>
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
