import { Character, Obstacle, Particle } from '../types';

// Helper to draw pixel blocks
function drawPixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

export function renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) {
  // Sky Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#0f172a'); // deep sky
  grad.addColorStop(0.6, '#1e3a8a');
  grad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Distant stars / sparkles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  for (let i = 0; i < 20; i++) {
    const sx = ((i * 97 + frame * 0.2) % width);
    const sy = (i * 43) % (height * 0.5);
    ctx.fillRect(sx, sy, 2, 2);
  }

  // Pixel Mountains / Castles in background
  ctx.fillStyle = '#1e293b';
  for (let i = 0; i < width + 100; i += 80) {
    const mx = (i - (frame * 0.5) % 80) - 40;
    ctx.beginPath();
    ctx.moveTo(mx, height - 40);
    ctx.lineTo(mx + 40, height - 140 - (i % 3) * 30);
    ctx.lineTo(mx + 80, height - 40);
    ctx.fill();
  }

  // Scrolling ground
  const groundH = 40;
  ctx.fillStyle = '#15803d'; // grass top
  ctx.fillRect(0, height - groundH, width, 10);
  ctx.fillStyle = '#854d0e'; // dirt
  ctx.fillRect(0, height - groundH + 10, width, groundH - 10);

  // Ground pixel details
  ctx.fillStyle = '#a16207';
  const scrollOffset = (frame * 3) % 40;
  for (let x = -scrollOffset; x < width; x += 40) {
    ctx.fillRect(x + 10, height - 20, 8, 8);
    ctx.fillRect(x + 28, height - 12, 6, 6);
  }
}

export function renderCharacter(
  ctx: CanvasRenderingContext2D,
  char: Character,
  x: number,
  y: number,
  vy: number,
  frame: number,
  equippedEffect: string
) {
  ctx.save();
  ctx.translate(x, y);

  // Rotate based on velocity (tilt up when jumping, tilt down when falling)
  const angle = Math.max(-0.4, Math.min(Math.PI / 4, vy * 0.08));
  ctx.rotate(angle);

  const size = 32;
  const half = size / 2;

  // Draw Aura if equipped
  if (equippedEffect === 'aura_holy') {
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, half + 6 + Math.sin(frame * 0.2) * 2, 0, Math.PI * 2);
    ctx.stroke();
  } else if (equippedEffect === 'aura_dark') {
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, half + 6 + Math.cos(frame * 0.2) * 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw Character Pixel Art (Simplified 8-bit style representation)
  const p = 4; // pixel size

  // Shadow / Cape
  drawPixelRect(ctx, -half, -half + 8, p * 3, p * 4, '#1e293b');

  // Body Base
  drawPixelRect(ctx, -half + 4, -half + 6, p * 5, p * 5, char.color);

  // Head/Face
  drawPixelRect(ctx, -half + 8, -half + 2, p * 4, p * 4, '#fde047'); // skin

  // Eyes
  drawPixelRect(ctx, -half + 16, -half + 6, p, p, '#000000');

  // Hat / Hair / Helmet based on type
  if (char.spriteType === 'wizard' || char.spriteType === 'archmage') {
    // Witch/Wizard Hat
    drawPixelRect(ctx, -half + 4, -half - 6, p * 6, p * 2, char.accentColor);
    drawPixelRect(ctx, -half + 8, -half - 14, p * 3, p * 2, char.accentColor);
  } else if (char.spriteType === 'paladin') {
    // Helmet
    drawPixelRect(ctx, -half + 6, -half, p * 5, p * 3, '#94a3b8');
    drawPixelRect(ctx, -half + 12, -half - 4, p * 2, p * 2, '#eab308');
  } else {
    // Hero Hair/Bandana
    drawPixelRect(ctx, -half + 6, -half, p * 5, p * 2, char.accentColor);
  }

  // Weapon / Staff if equipped or default
  if (equippedEffect === 'weapon_sword' || char.spriteType === 'hero') {
    // Sword pointing forward
    drawPixelRect(ctx, half - 4, -4, p * 3, p, '#e2e8f0');
    drawPixelRect(ctx, half - 8, -4, p, p * 3, '#eab308');
  }

  // Wing / Flap animation
  const wingY = (frame % 10 < 5) ? -2 : 4;
  drawPixelRect(ctx, -half - 4, wingY, p * 3, p * 2, '#ffffff');

  ctx.restore();
}

export function renderObstacles(ctx: CanvasRenderingContext2D, obstacles: Obstacle[], height: number, frame: number) {
  const groundH = 40;
  
  obstacles.forEach(obs => {
    // Pillar color themes based on type
    let mainColor = '#475569'; // brick grey
    let detailColor = '#334155';
    let capColor = '#64748b';
    
    if (obs.type === 'dragon_pillar') {
      mainColor = '#7f1d1d'; // dark red
      detailColor = '#991b1b';
      capColor = '#dc2626';
    } else if (obs.type === 'demon_gate') {
      mainColor = '#3b0764'; // dark purple
      detailColor = '#581c87';
      capColor = '#9333ea';
    }

    // Top Pillar
    drawPixelRect(ctx, obs.x, 0, obs.width, obs.topHeight - 16, mainColor);
    drawPixelRect(ctx, obs.x - 4, obs.topHeight - 16, obs.width + 8, 16, capColor);
    // Detail lines
    for (let y = 10; y < obs.topHeight - 20; y += 30) {
      drawPixelRect(ctx, obs.x + 8, y, obs.width - 16, 6, detailColor);
    }

    // Bottom Pillar
    const botH = height - groundH - obs.bottomY;
    drawPixelRect(ctx, obs.x, obs.bottomY + 16, obs.width, botH, mainColor);
    drawPixelRect(ctx, obs.x - 4, obs.bottomY, obs.width + 8, 16, capColor);
    for (let y = obs.bottomY + 26; y < height - groundH; y += 30) {
      drawPixelRect(ctx, obs.x + 8, y, obs.width - 16, 6, detailColor);
    }

    // Floating Gem / Coin in the gap
    if (obs.hasCoin && !obs.coinCollected && obs.coinY) {
      const bob = Math.sin(frame * 0.15 + obs.x * 0.01) * 4;
      const cx = obs.x + obs.width / 2;
      const cy = obs.coinY + bob;

      // Draw Diamond Gem
      ctx.fillStyle = '#38bdf8'; // bright cyan gem
      ctx.beginPath();
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx + 8, cy);
      ctx.lineTo(cx, cy + 10);
      ctx.lineTo(cx - 8, cy);
      ctx.closePath();
      ctx.fill();

      // Inner sparkle
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 2, cy - 4, 4, 4);
    }
  });
}

export function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  });
  ctx.globalAlpha = 1.0;
}
