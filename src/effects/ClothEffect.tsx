import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * 滑鼠交互「布料物理按壓」網頁效果
 *
 * 技術說明:頁面所有 DOM 元素(文字/按鈕/div)本身完全不動、不被拆解、
 * 保持原生可點擊/可滾動;真正被「拉扯形變」的是一個覆蓋在整個
 * #root 上的 SVG feDisplacementMap 濾鏡貼圖。這張貼圖來自一個
 * 極低解析度(GRID_COLS x GRID_ROWS)的彈簧-阻尼物理網格,由 GSAP
 * ticker 每帧更新:滑鼠對鄰近網格節點施加「向内吸附」的按壓力
 * (模擬手指壓入布料的凹陷),並疊加以距離衰減的波紋振盪;節點另有
 * 回彈彈力(spring)與阻尼(damping),滑鼠移開後會平滑回彈到原狀。
 * 因為只是「視覺置換」濾鏡,底下的真實 DOM 幾何位置完全不變,
 * 所以按鈕點擊、連結、滾動事件全部正常運作,不會被「布料」擋住。
 */

const GRID_COLS = 24;
const GRID_ROWS = 16;
const MAP_SIZE_X = GRID_COLS;
const MAP_SIZE_Y = GRID_ROWS;

const SPRING = 0.08; // 回彈彈力
const DAMPING = 0.9; // 阻尼(值越小回彈越快停止震盪)
const PRESS_STRENGTH = 46; // 按壓吸附強度
const PRESS_RADIUS = 0.34; // 按壓影響半徑(相對於視口對角線比例)
const RIPPLE_WAVELENGTH = 0.055;
const RIPPLE_SPEED = 6;
const DISPLACEMENT_SCALE = 46;

export default function ClothEffect() {
  const svgRef = useRef<SVGSVGElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const feDisplaceRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = MAP_SIZE_X;
    canvas.height = MAP_SIZE_Y;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    const nodeCount = GRID_COLS * GRID_ROWS;
    const dispX = new Float32Array(nodeCount);
    const dispY = new Float32Array(nodeCount);
    const velX = new Float32Array(nodeCount);
    const velY = new Float32Array(nodeCount);

    const mouse = { x: -9999, y: -9999, active: false };
    let elapsed = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 33) / 16.67; // 正規化到約 60fps 的時間步
      elapsed += deltaMs * 0.001;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const diag = Math.sqrt(w * w + h * h);
      const radiusPx = diag * PRESS_RADIUS;

      for (let gy = 0; gy < GRID_ROWS; gy++) {
        for (let gx = 0; gx < GRID_COLS; gx++) {
          const idx = gy * GRID_COLS + gx;
          const px = (gx / (GRID_COLS - 1)) * w;
          const py = (gy / (GRID_ROWS - 1)) * h;

          let fx = 0;
          let fy = 0;

          if (mouse.active) {
            const dx = mouse.x - px;
            const dy = mouse.y - py;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
            const falloff = Math.exp(-dist / radiusPx);
            const ripple =
              1 + 0.35 * Math.sin(dist * RIPPLE_WAVELENGTH - elapsed * RIPPLE_SPEED);
            const forceMag = PRESS_STRENGTH * falloff * ripple;
            fx = (dx / dist) * forceMag;
            fy = (dy / dist) * forceMag;
          }

          // 目標位移(按壓吸附) -> 換算成 -1..1 正規化位移
          const targetX = fx / radiusPx;
          const targetY = fy / radiusPx;

          velX[idx] += (targetX - dispX[idx]) * SPRING * dt;
          velY[idx] += (targetY - dispY[idx]) * SPRING * dt;
          velX[idx] *= Math.pow(DAMPING, dt);
          velY[idx] *= Math.pow(DAMPING, dt);

          dispX[idx] += velX[idx] * dt;
          dispY[idx] += velY[idx] * dt;
        }
      }

      // 寫入位移貼圖:R = X 位移, G = Y 位移(128 為中心 = 無位移)
      const imageData = ctx.createImageData(MAP_SIZE_X, MAP_SIZE_Y);
      for (let i = 0; i < nodeCount; i++) {
        const r = Math.max(0, Math.min(255, 128 + dispX[i] * 127));
        const g = Math.max(0, Math.min(255, 128 + dispY[i] * 127));
        imageData.data[i * 4] = r;
        imageData.data[i * 4 + 1] = g;
        imageData.data[i * 4 + 2] = 128;
        imageData.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);

      const dataUrl = canvas.toDataURL();
      if (feImageRef.current) {
        feImageRef.current.setAttribute("href", dataUrl);
      }
      if (feDisplaceRef.current) {
        feDisplaceRef.current.setAttribute("scale", String(DISPLACEMENT_SCALE));
      }
    };

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="cloth-filter"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feImage
            ref={feImageRef}
            result="dispMap"
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
          <feDisplacementMap
            ref={feDisplaceRef}
            in="SourceGraphic"
            in2="dispMap"
            scale={DISPLACEMENT_SCALE}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
