import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Crown, Flame, RefreshCw, Send } from 'lucide-react';
import { RankingItem, PlayerProfile } from '../types';
import { CHARACTERS } from '../data/items';

interface RankingModalProps {
  profile: PlayerProfile;
  currentScore: number;
  onClose: () => void;
  onUpdatePlayerName: (newName: string) => void;
}

export const RankingModal: React.FC<RankingModalProps> = ({
  profile,
  currentScore,
  onClose,
  onUpdatePlayerName
}) => {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'daily'>('all');
  const [nameInput, setNameInput] = useState<string>(profile.playerName);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rankings?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setRankings(data);
      }
    } catch (e) {
      console.error('Failed to fetch rankings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [filter]);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !nameInput.trim()) return;

    setSubmitting(true);
    setSubmittedMsg(null);
    onUpdatePlayerName(nameInput.trim());

    try {
      const bestScore = Math.max(currentScore, profile.highScore);
      const res = await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: nameInput.trim(),
          score: bestScore,
          characterId: profile.selectedCharacterId,
          equipmentId: profile.selectedEquipmentIds[0] || 'none'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedMsg(`スコア ${bestScore} をランキングに登録しました！（現在 ${data.rank}位）`);
        fetchRankings();
      }
    } catch (err) {
      console.error('Error submitting score:', err);
      setSubmittedMsg('送信エラーが発生しました。時間を置いて再試行してください。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        id="ranking-modal-card"
        className="bg-slate-900 border-2 border-violet-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-mono">オンライン冒険者ランキング</h2>
          </div>

          <button
            id="btn-close-ranking"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submit Score Box */}
        <div className="bg-gradient-to-r from-violet-950/60 via-slate-900 to-blue-950/60 p-4 border-b border-slate-800">
          <form onSubmit={handleSubmitScore} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs text-slate-400 mb-1 font-mono">冒険者ネーム（ランキング表示用）</label>
              <input
                id="input-ranking-playername"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={15}
                placeholder="勇者ネームを入力"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="w-full sm:w-auto flex items-end gap-2">
              <div className="bg-slate-950 px-4 py-2 rounded-lg border border-amber-500/30 text-center min-w-[100px]">
                <span className="block text-[10px] text-slate-400 font-mono">自己ベスト</span>
                <span className="text-lg font-bold text-amber-400 font-mono">{Math.max(currentScore, profile.highScore)}</span>
              </div>

              <button
                id="btn-submit-score"
                type="submit"
                disabled={submitting || !nameInput.trim()}
                className={`px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  submitting
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow active:scale-95'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? '送信中...' : 'スコア登録'}</span>
              </button>
            </div>
          </form>

          {submittedMsg && (
            <div className="mt-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
              🎉 {submittedMsg}
            </div>
          )}
        </div>

        {/* Filters & Refresh */}
        <div className="p-3 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="btn-filter-all"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                filter === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              👑 全期間TOP
            </button>
            <button
              id="btn-filter-daily"
              onClick={() => setFilter('daily')}
              className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                filter === 'daily' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🔥 24時間以内
            </button>
          </div>

          <button
            id="btn-refresh-rankings"
            onClick={fetchRankings}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>更新</span>
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2 custom-scrollbar min-h-[300px]">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-violet-500" />
              <p className="font-mono text-sm">ランキング情報を読み込み中...</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono">
              まだランキングデータがありません。一番乗りの勇者になろう！
            </div>
          ) : (
            rankings.map((item, idx) => {
              const rank = idx + 1;
              const char = CHARACTERS.find(c => c.id === item.characterId) || CHARACTERS[0];
              const isMe = item.playerName.toLowerCase() === profile.playerName.toLowerCase();

              let RankIcon = <span className="font-mono font-bold text-slate-400 w-6 text-center">{rank}</span>;
              if (rank === 1) RankIcon = <Crown className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />;
              else if (rank === 2) RankIcon = <Medal className="w-6 h-6 text-slate-300" />;
              else if (rank === 3) RankIcon = <Medal className="w-6 h-6 text-amber-600" />;

              return (
                <div
                  key={item.id || idx}
                  className={`p-3 rounded-xl flex items-center justify-between border transition ${
                    isMe
                      ? 'bg-violet-950/40 border-violet-500 shadow-md'
                      : rank <= 3
                      ? 'bg-slate-800/90 border-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8">{RankIcon}</div>

                    <div 
                      className="w-9 h-9 rounded flex items-center justify-center shadow"
                      style={{ backgroundColor: char.color }}
                      title={char.name}
                    >
                      <span className="text-xs">
                        {char.spriteType === 'wizard' ? '🧙‍♀️' : char.spriteType === 'paladin' ? '🛡️' : '⚔️'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.playerName}</span>
                        {isMe && <span className="bg-violet-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">あなた</span>}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">使用キャラ: {char.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="text-base font-bold text-amber-400 font-mono">{item.score}</span>
                    <span className="text-[10px] text-slate-500">pt</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
