// Web Audio API Sound Synthesizer for Retro 8-bit sound effects & RPG BGM

interface BgmTrack {
  name: string;
  tempoMs: number;
  melody: number[];
  bass: number[];
}

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private bgmTimer: NodeJS.Timeout | null = null;
  private currentNoteIdx: number = 0;
  private currentTrackIdx: number = 0;

  // 4種類のランダム8bit風ループBGMトラック
  private readonly tracks: BgmTrack[] = [
    {
      name: '王道勇者の旅立ち',
      tempoMs: 160,
      melody: [
        523.25, 523.25, 659.25, 783.99,   880.00, 783.99, 659.25, 523.25,
        698.46, 698.46, 880.00, 1046.50,  987.77, 880.00, 783.99, 0,
        523.25, 659.25, 783.99, 1046.50,  1174.66, 1046.50, 987.77, 783.99,
        880.00, 698.46, 783.99, 659.25,   587.33, 659.25, 523.25, 0
      ],
      bass: [
        130.81, 0, 130.81, 164.81, 174.61, 0, 174.61, 164.81,
        174.61, 0, 174.61, 220.00, 196.00, 0, 196.00, 146.83,
        130.81, 0, 164.81, 0,      174.61, 0, 196.00, 0,
        174.61, 0, 196.00, 0,      146.83, 0, 130.81, 130.81
      ]
    },
    {
      name: '大魔導士の幻想曲',
      tempoMs: 150,
      melody: [
        440.00, 0, 523.25, 659.25, 880.00, 783.99, 659.25, 0,
        587.33, 659.25, 698.46, 880.00, 783.99, 659.25, 523.25, 0,
        659.25, 783.99, 880.00, 1046.50, 987.77, 880.00, 783.99, 659.25,
        698.46, 587.33, 523.25, 493.88, 440.00, 0, 440.00, 0
      ],
      bass: [
        220.00, 220.00, 0, 220.00, 196.00, 0, 164.81, 0,
        174.61, 0, 174.61, 0, 196.00, 196.00, 0, 196.00,
        220.00, 0, 196.00, 0, 174.61, 0, 164.81, 0,
        174.61, 0, 196.00, 0, 220.00, 0, 110.00, 220.00
      ]
    },
    {
      name: '竜騎士の天空バトル',
      tempoMs: 135,
      melody: [
        659.25, 659.25, 783.99, 987.77, 1046.50, 987.77, 783.99, 659.25,
        880.00, 783.99, 659.25, 587.33, 659.25, 0, 659.25, 0,
        987.77, 1046.50, 1174.66, 1318.51, 1174.66, 1046.50, 987.77, 880.00,
        783.99, 880.00, 987.77, 783.99, 659.25, 0, 659.25, 0
      ],
      bass: [
        164.81, 164.81, 164.81, 0, 174.61, 174.61, 0, 164.81,
        146.83, 0, 130.81, 0, 164.81, 0, 82.41, 164.81,
        196.00, 0, 220.00, 0, 246.94, 0, 220.00, 196.00,
        174.61, 0, 196.00, 0, 164.81, 0, 164.81, 164.81
      ]
    },
    {
      name: 'お気楽ドット散歩道',
      tempoMs: 175,
      melody: [
        783.99, 880.00, 987.77, 783.99, 1046.50, 987.77, 880.00, 783.99,
        659.25, 698.46, 783.99, 880.00, 783.99, 0, 783.99, 0,
        1046.50, 987.77, 880.00, 783.99, 880.00, 987.77, 1046.50, 1174.66,
        1046.50, 987.77, 880.00, 698.46, 783.99, 0, 783.99, 0
      ],
      bass: [
        196.00, 0, 196.00, 0, 130.81, 0, 146.83, 0,
        164.81, 0, 174.61, 0, 196.00, 0, 98.00, 196.00,
        130.81, 0, 146.83, 0, 174.61, 0, 196.00, 0,
        130.81, 0, 146.83, 0, 196.00, 0, 196.00, 0
      ]
    }
  ];

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
    } else {
      // Resume BGM if it was supposed to be playing
      this.startBGM();
    }
  }

  // スタート時などに新しいランダム曲へ変更して再生スタート
  public playRandomBGM() {
    if (this.isMuted || typeof window === 'undefined') return;
    this.stopBGM();

    // 前回と違う曲をランダムに選ぶ
    if (this.tracks.length > 1) {
      let nextIdx = Math.floor(Math.random() * this.tracks.length);
      if (nextIdx === this.currentTrackIdx) {
        nextIdx = (nextIdx + 1) % this.tracks.length;
      }
      this.currentTrackIdx = nextIdx;
    }

    this.currentNoteIdx = 0;
    this.startBGM();
  }

  public startBGM() {
    if (this.isMuted || typeof window === 'undefined') return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.bgmPlaying && this.bgmTimer) return; // Already playing

    this.bgmPlaying = true;
    const track = this.tracks[this.currentTrackIdx];
    const tempoMs = track.tempoMs;

    const playStep = () => {
      if (!this.bgmPlaying || this.isMuted || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      const melodyFreq = track.melody[this.currentNoteIdx % track.melody.length];
      const bassFreq = track.bass[this.currentNoteIdx % track.bass.length];

      // Play melody (square wave 50% pulse)
      if (melodyFreq > 0) {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(melodyFreq, now);
          
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + tempoMs * 0.001 * 0.9);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + tempoMs * 0.001);
        } catch (e) {}
      }

      // Play bass (triangle wave)
      if (bassFreq > 0) {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(bassFreq, now);
          
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.linearRampToValueAtTime(0.001, now + tempoMs * 0.001 * 0.95);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + tempoMs * 0.001);
        } catch (e) {}
      }

      this.currentNoteIdx++;
    };

    this.bgmTimer = setInterval(playStep, tempoMs);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public playFlap() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error(e);
    }
  }

  public playCoin() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.error(e);
    }
  }

  public playCrash() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error(e);
    }
  }

  public playBuy() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.06 + 0.1);
        osc.connect(gain);
        gain.connect(ctx!.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + (idx + 1) * 0.06 + 0.1);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export const sounds = new SoundManager();
