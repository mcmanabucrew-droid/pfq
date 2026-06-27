import React, { useState } from 'react';
import { X, Check, Lock, Gem, Sparkles, Shield, Wand2 } from 'lucide-react';
import { CHARACTERS, EQUIPMENTS } from '../data/items';
import { Character, Equipment, PlayerProfile } from '../types';

interface ShopModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onBuyCharacter: (char: Character) => void;
  onBuyEquipment: (eq: Equipment) => void;
  onSelectCharacter: (charId: string) => void;
  onToggleEquipment: (eqId: string) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  profile,
  onClose,
  onBuyCharacter,
  onBuyEquipment,
  onSelectCharacter,
  onToggleEquipment
}) => {
  const [tab, setTab] = useState<'character' | 'equipment'>('character');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        id="shop-modal-card"
        className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-mono">冒険者装備ショップ</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-full border border-sky-500/40">
              <Gem className="w-4 h-4 text-sky-400" />
              <span className="text-sky-300 font-mono font-bold">{profile.gems}</span>
            </div>

            <button
              id="btn-close-shop"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            id="tab-shop-characters"
            onClick={() => setTab('character')}
            className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              tab === 'character'
                ? 'bg-amber-600/20 text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>キャラクター（勇者・魔法使い）</span>
          </button>
          <button
            id="tab-shop-equipments"
            onClick={() => setTab('equipment')}
            className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              tab === 'equipment'
                ? 'bg-amber-600/20 text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>特殊スキン・軌跡エフェクト</span>
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
          {tab === 'character' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHARACTERS.map(char => {
                const isUnlocked = profile.unlockedCharacterIds.includes(char.id);
                const isSelected = profile.selectedCharacterId === char.id;
                const canAfford = profile.gems >= char.price;

                return (
                  <div
                    key={char.id}
                    id={`char-card-${char.id}`}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10'
                        : isUnlocked
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-900/60 border-slate-800 opacity-85'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          {/* Pixel Avatar Preview */}
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden"
                            style={{ backgroundColor: char.color }}
                          >
                            <div className="w-6 h-6 bg-yellow-300 rounded-sm absolute top-2 right-2" />
                            <div className="w-8 h-3 absolute bottom-2" style={{ backgroundColor: char.accentColor }} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-amber-400 font-mono">{char.title}</span>
                            <h3 className="text-base font-bold text-white">{char.name}</h3>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> 使用中
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mb-2 leading-relaxed">{char.description}</p>
                      
                      <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 mb-3">
                        <span className="text-[11px] text-sky-300 font-bold flex items-center gap-1">
                          ✨ 特殊能力: {char.perkText}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end">
                      {isUnlocked ? (
                        <button
                          id={`btn-select-char-${char.id}`}
                          onClick={() => onSelectCharacter(char.id)}
                          disabled={isSelected}
                          className={`w-full py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-slate-700 text-slate-400 cursor-default'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow active:scale-95'
                          }`}
                        >
                          {isSelected ? '選択中' : 'このキャラクターで冒険する'}
                        </button>
                      ) : (
                        <button
                          id={`btn-buy-char-${char.id}`}
                          onClick={() => onBuyCharacter(char)}
                          disabled={!canAfford}
                          className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            canAfford
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow active:scale-95'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>解放する ({char.price} ジェム)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EQUIPMENTS.map(eq => {
                const isUnlocked = profile.unlockedEquipmentIds.includes(eq.id);
                const isEquipped = profile.selectedEquipmentIds.includes(eq.id);
                const canAfford = profile.gems >= eq.price;

                return (
                  <div
                    key={eq.id}
                    id={`eq-card-${eq.id}`}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                      isEquipped
                        ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-500/10'
                        : isUnlocked
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-900/60 border-slate-800 opacity-85'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            {eq.type === 'trail' ? '飛行トレイル' : eq.type === 'aura' ? '全身オーラ' : '武器'}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">{eq.name}</h3>
                        </div>

                        {isEquipped && (
                          <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> 装備中
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">{eq.description}</p>
                      {eq.coinBonusMultiplier && (
                        <div className="text-[11px] text-emerald-400 font-bold mb-3">
                          💰 報酬ジェム獲得量 {eq.coinBonusMultiplier}倍ボーナス！
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end">
                      {isUnlocked ? (
                        <button
                          id={`btn-equip-item-${eq.id}`}
                          onClick={() => onToggleEquipment(eq.id)}
                          className={`w-full py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                            isEquipped
                              ? 'bg-slate-700 hover:bg-rose-600 text-slate-200 hover:text-white'
                              : 'bg-amber-600 hover:bg-amber-500 text-white shadow active:scale-95'
                          }`}
                        >
                          {isEquipped ? '装備を外す' : '装備する'}
                        </button>
                      ) : (
                        <button
                          id={`btn-buy-eq-${eq.id}`}
                          onClick={() => onBuyEquipment(eq)}
                          disabled={!canAfford}
                          className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            canAfford
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow active:scale-95'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>購入する ({eq.price} ジェム)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
