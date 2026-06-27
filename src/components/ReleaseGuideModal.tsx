import React from 'react';
import { Smartphone, Download, Share2, Globe, ExternalLink, CheckCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ReleaseGuideModalProps {
  onClose: () => void;
}

export const ReleaseGuideModal: React.FC<ReleaseGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border-4 border-amber-500 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-4 mb-5">
          <div className="bg-amber-500/20 p-3 rounded-xl text-amber-400 border border-amber-500/50">
            <Smartphone className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-wider text-amber-400 font-mono">スマホアプリ化ガイド</h2>
            <p className="text-xs text-slate-300">PWA即時インストール ＆ ストア正式配信の手順</p>
          </div>
        </div>

        {/* Option A: PWA Instant Install */}
        <div className="bg-slate-800/80 border-2 border-blue-500/50 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
            <Download className="w-5 h-5" />
            <span className="text-lg">① 今すぐお使いのスマホにアプリとして入れる（推奨）</span>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            このゲームは<strong>PWA（Web App Manifest）</strong>に対応しています。AppStoreを通さずに、ホーム画面に専用アイコン付きの全画面アプリとして即座にインストール可能です！
          </p>
          <div className="space-y-2 text-xs bg-slate-900/90 p-3 rounded-lg border border-slate-700">
            <div className="flex items-start gap-2">
              <span className="bg-slate-700 px-1.5 py-0.5 rounded text-amber-300 font-bold">iPhone</span>
              <span>Safariの画面下にある<strong>「共有ボタン（ <Share2 className="w-3.5 h-3.5 inline" /> ）」</strong>を押し、<strong>「ホーム画面に追加」</strong>をタップします。</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-slate-700 px-1.5 py-0.5 rounded text-green-300 font-bold">Android</span>
              <span>Chrome右上の<strong>「メニュー（︙）」</strong>を開き、<strong>「アプリをインストール」</strong>または<strong>「ホーム画面に追加」</strong>をタップします。</span>
            </div>
          </div>
        </div>

        {/* Option B: Official Store Release */}
        <div className="bg-slate-800/80 border-2 border-emerald-500/50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
            <Globe className="w-5 h-5" />
            <span className="text-lg">② AppStore / GooglePlayストアに正式配信する</span>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            AI Studioで作成したこのソースコードをネイティブアプリに変換してストア申請できます：
          </p>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 pl-1 leading-relaxed">
            <li>AI Studio画面右上の設定メニューから<strong>「GitHubへエクスポート」</strong>（またはZIPダウンロード）を実行します。</li>
            <li>
              Microsoft公式の無料ツール 
              <a 
                href="https://www.pwabuilder.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-amber-400 underline font-bold mx-1 inline-flex items-center"
              >
                PWABuilder.com <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
              にアクセスします。
            </li>
            <li>共有URLを入力するだけで、<strong>Android用（APK/AABファイル）</strong>や<strong>iOS Xcode用プロジェクト</strong>が自動生成されます。</li>
            <li>あとはGoogle Play ConsoleやApple Developerアカウントからストア申請を行うだけで世界中にリリース可能です！</li>
          </ol>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              sounds.playFlap();
              onClose();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base rounded-xl shadow-lg transform active:scale-95 transition flex items-center justify-center gap-2 font-mono"
          >
            <CheckCircle className="w-5 h-5" />
            確認してゲームに戻る
          </button>
        </div>

      </div>
    </div>
  );
};
