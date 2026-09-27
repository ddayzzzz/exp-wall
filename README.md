# Hero-Program (exp-wall)

深色主題的 Hero 作品集落地頁。React + TypeScript + TailwindCSS + Framer-Motion + Three.js + GSAP。

線上網址:https://ddayzzzz.github.io/exp-wall/

本文件是給「任何人或任何 AI 工具」接手維護用的完整說明,包含專案結構、設計參數、部署流程、目前進度與待辦。無論之後用 Claude / ChatGPT / Cursor / 其他工具接手,只要讀完這份 README + `docs/SPEC.md` + `docs/STATUS.md`,就能無縫接續開發,不需要额外口頭交接。

---

## 技術棧與版本

| 套件 | 版本 |
|---|---|
| react / react-dom | 18.3.1 |
| typescript | ^5.4.5 |
| vite | ^5.2.0 |
| tailwindcss | 3.4.1 |
| framer-motion | 12.38.0 |
| lucide-react | 0.344.0 |
| three | 0.128.0 |
| gsap | 3.12.5 |
| gh-pages | ^6.1.1 (未使用,部署改走 GitHub Actions) |

## 快速開始

```bash
npm install       # 安裝相依套件
npm run dev       # 本機開發伺服器(含 HMR)
npm run build     # 型別檢查 + 產出 dist/
npm run preview   # 預覽 build 後的成品
```

## 部署流程(GitHub Pages)

- 部署方式:GitHub Actions(`.github/workflows/deploy.yml`),推送到 `main` 分支會自動觸發:
  build → `actions/upload-pages-artifact` → `actions/deploy-pages`。
- GitHub repo 的 Settings → Pages → Build and deployment → Source 必須設為 **GitHub Actions**(已設定)。
- `vite.config.ts` 的 `base` 設為 `/exp-wall/`,對應 GitHub Pages 的專案頁面路徑
  `https://<帳號>.github.io/exp-wall/`。**若之後改 repo 名稱或改用自訂網域,一定要同步改這個 `base`。**
- 發布新版本只要:
  ```bash
  git add -A
  git commit -m "說明這次改了什麼"
  git push
  ```
  push 後到 repo 的 Actions 分頁可以看到建置進度,約 1 分鐘內網站會更新。

## 專案結構

```
exp-wall/
├─ public/images/
│  ├─ hero/portrait.jpg         # Hero 區塊人像(現在是佔位圖)
│  ├─ marquee/1.jpg ~ 21.jpg    # 跑馬燈 21 張圖(現在是佔位圖)
│  └─ projects/pN-1.jpg / pN-2.jpg / pN-wide.jpg  # 4 個專案各 3 張圖(現在是佔位圖)
├─ src/
│  ├─ index.css                 # 全局重置、Kanit 字體、.hero-heading 漸層文字
│  ├─ main.tsx / App.tsx        # 進入點,組裝所有 Section + 特效
│  ├─ components/
│  │  ├─ ContactButton.tsx      # 公共按鈕(藥丸漸層)
│  │  ├─ FadeIn.tsx             # 公共進場動畫
│  │  ├─ AnimatedText.tsx       # 逐字滾動透明度動畫
│  │  └─ StarfieldBackground.tsx# Three.js 星雲背景
│  ├─ effects/
│  │  ├─ ClothEffect.tsx        # 滑鼠布料按壓效果(SVG feDisplacementMap + GSAP 物理)
│  │  └─ ClickInkEffect.tsx     # 點擊/拖曳霓虹墨水擴散特效
│  └─ sections/
│     ├─ HeroSection.tsx
│     ├─ MarqueeSection.tsx
│     ├─ AboutSection.tsx
│     └─ ProjectsSection.tsx
├─ .github/workflows/deploy.yml # GitHub Pages 自動部署
├─ docs/SPEC.md                 # 原始需求規格(逐項記錄,含所有數值參數)
└─ docs/STATUS.md               # 目前完成度與待辦事項
```

## 內容編輯速查

- **文案**:改 `src/sections/*.tsx` 裡的字串。
- **圖片**:直接覆蓋 `public/images/` 底下同名檔案即可,不用改程式碼。
- **顏色/字體/漸層**:`src/index.css`(`.hero-heading` 漸層、全局背景色)、`tailwind.config.js`(自訂色票 `ink` `mist`)。
- **按鈕文字/樣式**:`src/components/ContactButton.tsx`。
- **動畫參數**(delay/duration/easing):各 Section 內呼叫 `<FadeIn delay=... y=.../>` 的地方。

## 詳細規格與進度

- 完整原始需求與所有數值參數(顏色 hex、動畫緩動曲線、粒子數、網格解析度等)記錄在 `docs/SPEC.md`,不要憑印象改數值,先查這份文件。
- 目前完成度、已知限制、待辦事項記錄在 `docs/STATUS.md`。**任何 AI 工具接手前請先讀這份文件**,避免重複做已完成的部分或漏掉待辦。
