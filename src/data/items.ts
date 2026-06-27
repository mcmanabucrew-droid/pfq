import { Character, Equipment } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'hero',
    name: 'ドット勇者アルス',
    title: '旅立ちの若き剣士',
    description: '伝説の剣を求めて空を旅するスタンダードな勇者。バランスが良く初心者におすすめ。',
    price: 0,
    unlockedByDefault: true,
    color: '#3b82f6', // blue
    accentColor: '#fbbf24', // gold
    flapStrength: -7.5,
    gravity: 0.42,
    spriteType: 'hero',
    perkText: '標準ステータス（バランス型）'
  },
  {
    id: 'wizard',
    name: '見習い魔法使いルイズ',
    title: 'ホウキの乗り手',
    description: '魔法のホウキでふわりと浮遊する女の子。浮遊感が強く、落下速度が少しゆっくり。',
    price: 50,
    unlockedByDefault: false,
    color: '#ec4899', // pink
    accentColor: '#8b5cf6', // purple
    flapStrength: -6.8,
    gravity: 0.36,
    spriteType: 'wizard',
    perkText: 'ふんわりジャンプ（落下速度 -15%）'
  },
  {
    id: 'paladin',
    name: '聖騎士レオナード',
    title: '鉄壁の光盾',
    description: '重い甲冑をまとった聖なる騎士。少し体が重いが、コイン獲得時に追加ボーナス発生。',
    price: 120,
    unlockedByDefault: false,
    color: '#eab308', // gold
    accentColor: '#ffffff',
    flapStrength: -8.0,
    gravity: 0.46,
    spriteType: 'paladin',
    perkText: '獲得ジェム +25% ボーナス'
  },
  {
    id: 'archmage',
    name: '大魔導士ソロモン',
    title: '深淵を知る賢者',
    description: '古代の禁呪を操る最高峰の魔法使い。鋭い魔力ステップで機敏に上下できる。',
    price: 250,
    unlockedByDefault: false,
    color: '#8b5cf6', // violet
    accentColor: '#38bdf8', // sky
    flapStrength: -7.8,
    gravity: 0.44,
    spriteType: 'archmage',
    perkText: '機敏な魔法ジャンプ（操作性バツグン）'
  },
  {
    id: 'dragon_knight',
    name: '竜騎士バルバロス',
    title: '天空の支配者',
    description: 'ドラゴンの翼を背に宿した最強クラスの戦士。空中の制圧力は圧倒的。',
    price: 500,
    unlockedByDefault: false,
    color: '#ef4444', // red
    accentColor: '#f97316', // orange
    flapStrength: -7.6,
    gravity: 0.40,
    spriteType: 'dragon_knight',
    perkText: '竜の翼（スコア上昇速度 +10%）'
  },
  {
    id: 'dark_knight',
    name: '暗黒騎士ゼファー',
    title: '復讐の黒炎',
    description: '闇の契約を結んだ謎の騎士。超重量級のジャンプと独特の軌道を持つ上級者向け。',
    price: 800,
    unlockedByDefault: false,
    color: '#1e293b', // slate
    accentColor: '#a855f7', // purple
    flapStrength: -8.5,
    gravity: 0.50,
    spriteType: 'dark_knight',
    perkText: '闇の恩恵（ジェム獲得量 2倍）'
  }
];

export const EQUIPMENTS: Equipment[] = [
  {
    id: 'none',
    name: '初期装備なし',
    type: 'trail',
    price: 0,
    unlockedByDefault: true,
    description: '特に特殊なエフェクトはありません。純粋な腕前を試せます。',
    effectType: 'none'
  },
  {
    id: 'trail_fire',
    name: '爆炎の軌跡',
    type: 'trail',
    price: 40,
    unlockedByDefault: false,
    description: '飛行中、後ろに真っ赤な炎の軌跡が残るド派手なスキン。',
    effectType: 'trail_fire',
    coinBonusMultiplier: 1.1
  },
  {
    id: 'trail_rainbow',
    name: '虹色のマナテイル',
    type: 'trail',
    price: 90,
    unlockedByDefault: false,
    description: '七色のマナがキラキラと舞う幻想的なトレイルエフェクト。',
    effectType: 'trail_rainbow',
    coinBonusMultiplier: 1.2
  },
  {
    id: 'aura_holy',
    name: '聖なる光輪のオーラ',
    type: 'aura',
    price: 150,
    unlockedByDefault: false,
    description: '全身を神聖な黄金のオラで包み込む高貴なスキン。',
    effectType: 'aura_holy',
    coinBonusMultiplier: 1.3
  },
  {
    id: 'weapon_excalibur',
    name: '聖剣エクスカリバー',
    type: 'weapon',
    price: 300,
    unlockedByDefault: false,
    description: '魔王を討ち果たすと言われる伝説の聖剣を背負って飛行する。',
    effectType: 'weapon_sword',
    coinBonusMultiplier: 1.5
  },
  {
    id: 'trail_shadow',
    name: '深淵のシャドウテイル',
    type: 'trail',
    price: 450,
    unlockedByDefault: false,
    description: '闇夜に溶け込む黒紫色の残像を残すエリート勇者の証。',
    effectType: 'trail_shadow',
    coinBonusMultiplier: 1.8
  }
];
