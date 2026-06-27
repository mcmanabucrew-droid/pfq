import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

export interface RankingEntry {
  id: string;
  playerName: string;
  score: number;
  characterId: string;
  equipmentId: string;
  createdAt: number;
}

// Initial default leaderboard so users have someone to compete with!
let rankings: RankingEntry[] = [
  { id: '1', playerName: '伝説の勇者アルス', score: 128, characterId: 'hero', equipmentId: 'fire_sword', createdAt: Date.now() - 86400000 * 2 },
  { id: '2', playerName: '大魔導士マーリン', score: 95, characterId: 'wizard', equipmentId: 'holy_aura', createdAt: Date.now() - 86400000 },
  { id: '3', playerName: '聖騎士ガレイン', score: 74, characterId: 'paladin', equipmentId: 'gold_crown', createdAt: Date.now() - 3600000 * 12 },
  { id: '4', playerName: '旅の盗賊ロキ', score: 52, characterId: 'rogue', equipmentId: 'none', createdAt: Date.now() - 3600000 * 5 },
  { id: '5', playerName: '見習い魔法使いユウ', score: 35, characterId: 'wizard', equipmentId: 'rainbow_trail', createdAt: Date.now() - 3600000 * 2 },
  { id: '6', playerName: 'スライムハンター', score: 19, characterId: 'hero', equipmentId: 'none', createdAt: Date.now() - 1800000 }
];

const DATA_DIR = path.join(__dirname, 'data');
const RANKINGS_FILE = path.join(DATA_DIR, 'rankings.json');

// Try loading persisted rankings
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(RANKINGS_FILE)) {
    const data = fs.readFileSync(RANKINGS_FILE, 'utf8');
    rankings = JSON.parse(data);
  }
} catch (e) {
  console.error('Failed to load rankings file, using memory storage:', e);
}

function saveRankings() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(RANKINGS_FILE, JSON.stringify(rankings, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save rankings:', e);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/rankings', (req, res) => {
  const filter = req.query.filter as string || 'all';
  let list = [...rankings];
  if (filter === 'daily') {
    const oneDayAgo = Date.now() - 86400000;
    list = list.filter(r => r.createdAt >= oneDayAgo);
  }
  list.sort((a, b) => b.score - a.score);
  res.json(list.slice(0, 50)); // Top 50
});

app.post('/api/rankings', (req, res) => {
  const { playerName, score, characterId, equipmentId } = req.body;
  if (typeof score !== 'number' || !playerName) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  
  const trimmedName = String(playerName).trim().slice(0, 15) || '名無し勇者';
  
  // Check if player already exists in rankings
  const existingIdx = rankings.findIndex(r => r.playerName.toLowerCase() === trimmedName.toLowerCase());
  
  if (existingIdx >= 0) {
    // Update score only if higher
    if (score > rankings[existingIdx].score) {
      rankings[existingIdx].score = score;
      rankings[existingIdx].characterId = characterId || rankings[existingIdx].characterId;
      rankings[existingIdx].equipmentId = equipmentId || rankings[existingIdx].equipmentId;
      rankings[existingIdx].createdAt = Date.now();
    }
  } else {
    rankings.push({
      id: Math.random().toString(36).substring(2, 11),
      playerName: trimmedName,
      score,
      characterId: characterId || 'hero',
      equipmentId: equipmentId || 'none',
      createdAt: Date.now()
    });
  }
  
  rankings.sort((a, b) => b.score - a.score);
  saveRankings();
  
  // Find player's current rank (1-indexed)
  const rank = rankings.findIndex(r => r.playerName.toLowerCase() === trimmedName.toLowerCase()) + 1;
  res.json({ success: true, rank });
});

// Gemini AI Narrator Quotes endpoint
const fallbackQuotes = [
  "「ぬわーーっっ！！石像の角に頭をぶつけてしまった！」",
  "「魔王の城への道は険しい…もう一度装備を見直して挑もう！」",
  "「おしい！あと少しで伝説のドラゴンに追いつけたかもしれない！」",
  "「冒険はここで終わってしまった…しかし勇者の意志は継がれる！」",
  "「空を飛ぶのは思ったより体力がいる。次はもっと高く羽ばたこう！」",
  "「マナが尽きたか…宿屋で休んで再挑戦じゃ！」"
];

app.post('/api/ai/narrator', async (req, res) => {
  const { score, characterName, obstacleName } = req.body;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return res.json({ quote: randomQuote });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `あなたはレトロファンタジーRPGのユーモア溢れる天の声（ナレーター）です。
プレイヤー（キャラクター: ${characterName || '勇者'}）がフラッピー風の飛行冒険ゲームで、スコア「${score}」で「${obstacleName || '魔法の石柱'}」に激突してゲームオーバーになりました。
この勇者へのツッコミ、励まし、またはファンタジー風の面白劇中ナレーションを日本語で1〜2文（MAX60文字程度）で生成してください。
セリフのみを出力してください（カギカッコ「」をつけてもOKです）。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const quote = response.text ? response.text.trim() : fallbackQuotes[0];
    res.json({ quote });
  } catch (err) {
    console.error('Gemini API Error:', err);
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    res.json({ quote: randomQuote });
  }
});

// Vite Middleware for SPA
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
