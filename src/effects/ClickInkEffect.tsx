import { useEffect, useRef } from "react";

/**
 * 點擊 / 拖曳霓虹墨水擴散特效
 * - 點擊:從點擊處炸開一團彩色液體,0.5s 內擴散到約 200px,之後 2s 內慢慢淡出消失
 * - 拖曳:留下一道會自己扭動、慢慢消散的彩色軌跡
 * - 顏色每次隨機、偏霓虹,邊緣發光
 * - canvas 全螢幕覆蓋、pointer-events:none、背景透明,絕不遮擋按鈕點擊/滾動,也不會蓋住作品圖片
 */

const NEON_HUES = [320, 300, 280, 190, 170, 40, 20];

interface InkBlob {
  x: number;
  y: number;
  hue: number;
  maxRadius: number;
  bornAt: number;
  seedAngle: number;
  wiggleSpeed: number;
  wiggleAmp: number;
  isTrail: boolean;
}

function randomNeonHue() {
  const base = NEON_HUES[Math.floor(Math.random() * NEON_HUES.length)];
  return base + (Math.random() * 20 - 10);
}

export default function ClickInkEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let blobs: InkBlob[] = [];
    let isDragging = false;
    let lastTrailTime = 0;

    const spawnBlob = (x: number, y: number, isTrail: boolean) => {
      blobs.push({
        x,
        y,
        hue: randomNeonHue(),
        maxRadius: isTrail ? 60 + Math.random() * 30 : 180 + Math.random() * 40,
        bornAt: performance.now(),
        seedAngle: Math.random() * Math.PI * 2,
        wiggleSpeed: 1.5 + Math.random() * 1.5,
        wiggleAmp: 6 + Math.random() * 6,
        isTrail,
      });
      if (blobs.length > 60) blobs.shift();
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      spawnBlob(e.clientX, e.clientY, false);
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const now = performance.now();
      if (now - lastTrailTime > 45) {
        spawnBlob(e.clientX, e.clientY, true);
        lastTrailTime = now;
      }
    };
    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);

    let animationId: number;
    const GROW_DURATION = 500; // 0.5s 擴散
    const FADE_DURATION = 2000; // 2s 淡出

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";

      const now = performance.now();
      blobs = blobs.filter((b) => now - b.bornAt < GROW_DURATION + FADE_DURATION);

      for (const b of blobs) {
        const age = now - b.bornAt;
        const growT = Math.min(age / GROW_DURATION, 1);
        const growEased = 1 - Math.pow(1 - growT, 3); // easeOutCubic
        const radius = b.maxRadius * growEased;

        let alpha = 1;
        if (age > GROW_DURATION) {
          const fadeT = Math.min((age - GROW_DURATION) / FADE_DURATION, 1);
          alpha = 1 - fadeT;
        }
        if (alpha <= 0 || radius <= 0) continue;

        const wiggleT = age * 0.001 * b.wiggleSpeed;

        ctx.save();
        ctx.shadowBlur = 28;
        ctx.shadowColor = `hsla(${b.hue}, 95%, 60%, ${alpha})`;

        // 用多片不規則花瓣疊加模擬墨水扭動邊緣
        const petals = 6;
        ctx.beginPath();
        for (let p = 0; p <= petals; p++) {
          const angle = b.seedAngle + (p / petals) * Math.PI * 2;
          const wobble = Math.sin(wiggleT + p * 1.3) * b.wiggleAmp * growEased;
          const r = radius + wobble;
          const px = b.x + Math.cos(angle) * r;
          const py = b.y + Math.sin(angle) * r;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, radius || 1);
        gradient.addColorStop(0, `hsla(${b.hue}, 95%, 68%, ${alpha * 0.85})`);
        gradient.addColorStop(0.6, `hsla(${b.hue + 20}, 90%, 55%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${b.hue + 20}, 90%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}
