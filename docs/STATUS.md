# 目前完成度與待辦(給任何接手的人 / AI 工具看)

> 更新時間請每次修改後手動更新最上面這一行:2026-09-27

## 已完成 ✅

- [x] 一、專案骨架:Vite + React18.3.1 + TS + Tailwind3.4.1 + Framer-Motion12.38.0 + lucide-react0.344.0,四大 Section + 三個公共組件,`.hero-heading` 漸層、Kanit 字體、全局重置全部依規格實作
- [x] 二、Three.js 星雲背景(6000 點粒子、1200³空間、z=220、Y/X 軸緩慢旋轉、resize 自適應)
- [x] 五、裝飾組件決策:不做地球元件,沿用星空粒子當唯一裝飾
- [x] 六、滑鼠布料按壓效果(SVG feDisplacementMap + GSAP 物理網格,詳見 `docs/SPEC.md` 技術選擇說明)
- [x] 七、點擊/拖曳霓虹墨水擴散特效
- [x] 八、Git 版本控制(用 git CLI,未裝 TortoiseGit,使用者已知情同意)
- [x] 九、部署到 GitHub Pages(GitHub Actions 自動部署),上線網址 https://ddayzzzz.github.io/exp-wall/

## 待辦 ⏳

- [ ] **三、故事拆章與生圖** —— 阻塞原因:等待使用者提供「這裡放你自己的故事」的完整原文。
  拿到全文後:
  1. 拆成 20–30 章,每章「標題(總結)+ 正文(原文原樣擷取)」
  2. 每章依標題+正文生成對應 16:9 圖片(需使用者提供 3–5 張主角參考圖統一風格),存到 `public/images/story/1.png ~ N.png`
  3. 圖片生成完成後才能做「四、資源替換」

- [ ] **四、圖片替換 + 點擊彈出 md 內容視窗**
  - 目前 `public/images/` 底下全部是程式產生的隨機漸層佔位圖(`hero/portrait.jpg`、`marquee/1~21.jpg`、`projects/pN-1/pN-2/pN-wide.jpg`),需替換成正式圖片
  - 需新增「點擊圖片彈出 Modal,內容讀取對應章節的本地 `.md` 檔」的功能(目前完全未實作,需要新增 Modal 元件 + fetch `public/story/N.md`)
  - 圖片較大時要壓縮(可用 `sharp` 或 `vite-imagetools`,尚未安裝)

## 已知取捨 / 技術決策記錄(避免重複踩坑)

1. **布料效果不是逐節點 DOM 拆分**,是 SVG 濾鏡視覺置換方案。原因與細節見 `docs/SPEC.md` 的「鼠標動效」章節。
2. **`ContactButton` 預設文字已從 SPEC 原文的簡體「联系我」改為繁體「聯繫我」**,因使用者要求頁面語言為繁體中文+英文、不出現簡體中文。之後新增任何文案都要遵守這個規則,即使 SPEC 貼的是簡體。
3. Bundle 大小警告(`dist/assets/index-*.js` ~860KB):目前未做 code-splitting,因為 three.js 本身體積大。若之後要優化,可以考慮 `React.lazy` 延遲載入 `StarfieldBackground` / `ClothEffect`,或用 `build.rollupOptions.output.manualChunks` 分包。

## 給接手的 AI 工具的建議閱讀順序

1. 先讀這份 `docs/STATUS.md`(知道現況)
2. 再讀 `docs/SPEC.md`(知道所有數值參數的來源與原因)
3. 再讀 `README.md`(知道怎麼跑起來、怎麼部署)
4. 最後才開始改程式碼
