import React, { useRef, useEffect, useCallback } from 'react';
import { Character, Obstacle, Particle } from '../types';
import { renderBackground, renderCharacter, renderObstacles, renderParticles } from '../utils/renderer';
import { sounds } from '../utils/audio';

interface GameCanvasProps {
  character: Character;
  equippedEffect: string;
  gameState: 'home' | 'playing' | 'gameover' | 'paused';
  onScoreUpdate: (score: number) => void;
  onCoinCollect: (coinBonus: number) => void;
  onGameOver: () => void;
  onStartGame: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  character,
  equippedEffect,
  gameState,
  onScoreUpdate,
  onCoinCollect,
  onGameOver,
  onStartGame
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game internal physics refs
  const stateRef = useRef({
    x: 100,
    y: 250,
    vy: 0,
    score: 0,
    frame: 0,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    speed: 3.2,
    gap: 160,
    isDead: false
  });

  const animFrameRef = useRef<number>(0);

  // Reset physics state
  const resetPhysics = useCallback((canvasHeight: number) => {
    stateRef.current = {
      x: 80,
      y: canvasHeight / 2 - 20,
      vy: 0,
      score: 0,
      frame: 0,
      obstacles: [],
      particles: [],
      speed: character.spriteType === 'dragon_knight' ? 3.5 : 3.2,
      gap: 165,
      isDead: false
    };
  }, [character]);

  // Spawn trail/jump particles
  const spawnFlapParticles = useCallback((x: number, y: number, color: string) => {
    const list = stateRef.current.particles;
    for (let i = 0; i < 6; i++) {
      list.push({
        x: x - 10,
        y: y + (Math.random() - 0.5) * 16,
        vx: -(Math.random() * 3 + 1),
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 6 + 4,
        color,
        life: 20,
        maxLife: 20
      });
    }
  }, []);

  const flap = useCallback(() => {
    if (gameState === 'home') {
      onStartGame();
      sounds.playFlap();
      return;
    }

    sounds.startBGM();

    if (gameState !== 'playing' || stateRef.current.isDead) return;

    stateRef.current.vy = character.flapStrength;
    sounds.playFlap();

    // Determine trail particle color
    let pColor = 'rgba(255, 255, 255, 0.8)';
    if (equippedEffect === 'trail_fire') pColor = '#ef4444';
    else if (equippedEffect === 'trail_rainbow') {
      const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a855f7'];
      pColor = colors[Math.floor(Math.random() * colors.length)];
    } else if (equippedEffect === 'trail_shadow') pColor = '#4c1d95';
    else pColor = character.accentColor;

    spawnFlapParticles(stateRef.current.x, stateRef.current.y, pColor);
  }, [gameState, character, equippedEffect, onStartGame, spawnFlapParticles]);

  // Handle Touch/Click events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Prevent triggering if clicked on UI buttons outside canvas
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    flap();
  }, [flap]);

  // Keyboard Spacebar handle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    // Resize canvas to match responsive container
    const updateCanvasSize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = Math.max(400, h);
        if (gameState === 'home') {
          resetPhysics(canvas.height);
        }
      }
    };

    updateCanvasSize();
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    const loop = () => {
      if (!running) return;
      updateCanvasSize();

      const w = canvas.width;
      const h = canvas.height;
      const groundH = 40;
      const playableH = h - groundH;

      const st = stateRef.current;

      if (gameState === 'playing' && !st.isDead) {
        st.frame++;

        // Apply gravity
        st.vy += character.gravity;
        st.y += st.vy;

        // Ceiling clamp
        if (st.y < 16) {
          st.y = 16;
          st.vy = 0;
        }

        // Continuous trail emission if equipped
        if (st.frame % 3 === 0 && equippedEffect !== 'none') {
          let c = '#fbbf24';
          if (equippedEffect === 'trail_fire') c = '#f97316';
          else if (equippedEffect === 'trail_rainbow') c = '#38bdf8';
          else if (equippedEffect === 'trail_shadow') c = '#312e81';
          st.particles.push({
            x: st.x - 12,
            y: st.y + (Math.random() - 0.5) * 8,
            vx: -st.speed * 0.8,
            vy: (Math.random() - 0.5),
            size: 6,
            color: c,
            life: 15,
            maxLife: 15
          });
        }

        // Spawn obstacles
        const spawnInterval = Math.floor(130 / (st.speed / 3.2));
        if (st.frame % spawnInterval === 0) {
          const minTop = 60;
          const maxTop = playableH - st.gap - 60;
          const topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
          const botY = topH + st.gap;

          const types: Obstacle['type'][] = ['dungeon_brick', 'dragon_pillar', 'demon_gate'];
          const chosenType = types[Math.floor(Math.random() * types.length)];

          st.obstacles.push({
            x: w + 20,
            topHeight: topH,
            bottomY: botY,
            width: 54,
            passed: false,
            hasCoin: Math.random() > 0.35, // 65% chance to have bonus gem
            coinY: topH + st.gap / 2,
            type: chosenType
          });
        }

        // Move obstacles & Check collisions
        const charRadius = 14;

        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const obs = st.obstacles[i];
          obs.x -= st.speed;

          // Score pass check
          if (!obs.passed && obs.x + obs.width < st.x) {
            obs.passed = true;
            st.score++;
            onScoreUpdate(st.score);

            // Slightly increase speed every 5 points
            if (st.score % 5 === 0 && st.speed < 6.5) {
              st.speed += 0.2;
              st.gap = Math.max(130, st.gap - 3);
            }
          }

          // Coin collect check
          if (obs.hasCoin && !obs.coinCollected && obs.coinY) {
            const dist = Math.hypot(st.x - (obs.x + obs.width / 2), st.y - obs.coinY);
            if (dist < charRadius + 14) {
              obs.coinCollected = true;
              sounds.playCoin();
              
              // Base bonus is 1 gem
              let bonus = 1;
              if (character.id === 'paladin') bonus = 2;
              if (character.id === 'dark_knight') bonus = 3;
              onCoinCollect(bonus);

              // Spawn sparkle particles
              for (let p = 0; p < 8; p++) {
                st.particles.push({
                  x: obs.x + obs.width / 2,
                  y: obs.coinY,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  size: 5,
                  color: '#38bdf8',
                  life: 25,
                  maxLife: 25
                });
              }
            }
          }

          // Collision Check
          const hitX = st.x + charRadius > obs.x && st.x - charRadius < obs.x + obs.width;
          const hitY = st.y - charRadius < obs.topHeight || st.y + charRadius > obs.bottomY;

          if (hitX && hitY) {
            st.isDead = true;
            sounds.playCrash();
            onGameOver();
          }

          // Remove offscreen
          if (obs.x < -80) {
            st.obstacles.splice(i, 1);
          }
        }

        // Ground check
        if (st.y + charRadius >= playableH) {
          st.y = playableH - charRadius;
          st.isDead = true;
          sounds.playCrash();
          onGameOver();
        }

      } else if (gameState === 'home') {
        // Idle floating animation
        st.frame++;
        st.y = h / 2 - 20 + Math.sin(st.frame * 0.05) * 12;
      }

      // Update particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) st.particles.splice(i, 1);
      }

      // Render Everything
      renderBackground(ctx, w, h, st.frame);
      renderObstacles(ctx, st.obstacles, h, st.frame);
      renderParticles(ctx, st.particles);
      renderCharacter(ctx, character, st.x, st.y, st.vy, st.frame, equippedEffect);

      // Overlay Instructions / Titles
      if (gameState === 'home') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        
        // Title banner shadow
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 36px monospace';
        ctx.fillText('PIXEL FLAPPY QUEST', w / 2 + 3, h * 0.35 + 3);
        
        ctx.fillStyle = '#f59e0b'; // amber
        ctx.fillText('PIXEL FLAPPY QUEST', w / 2, h * 0.35);

        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('〜 ドット絵の冒険者と空の旅 〜', w / 2, h * 0.35 + 40);

        // Tap to start pill
        const pulse = Math.sin(st.frame * 0.1) * 4;
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.roundRect(w / 2 - 130, h * 0.65 - 24 + pulse, 260, 48, 24);
        ctx.fill();
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 18px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('👆 画面をタップして冒険開始', w / 2, h * 0.65 + 6 + pulse);

      } else if (gameState === 'playing') {
        // Big Score Watermark
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = 'bold 100px monospace';
        ctx.fillText(String(st.score), w / 2, h * 0.4);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [gameState, character, equippedEffect, resetPhysics, onScoreUpdate, onCoinCollect, onGameOver]);

  // When reset trigger happens
  useEffect(() => {
    if (gameState === 'playing' && canvasRef.current) {
      resetPhysics(canvasRef.current.height);
    }
  }, [gameState, resetPhysics]);

  return (
    <div 
      ref={containerRef}
      id="game-canvas-container"
      onPointerDown={handlePointerDown}
      className="w-full flex-1 relative select-none overflow-hidden cursor-pointer touch-none bg-slate-950"
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
