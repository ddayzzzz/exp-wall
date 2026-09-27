# 原始需求規格(SPEC)完整記錄

> 此文件逐項記錄使用者原始 SPEC 的所有數值參數與需求描述,作為日後修改的「唯一真相來源」。
> 若程式碼與此文件有落差,以此文件為準,並回頭修正程式碼或修正本文件(兩者需保持一致)。
> 使用者原 SPEC 部分文字為簡體中文,頁面顯示規則已統一為「繁體中文 + 英文,不出現簡體中文」,
> 本文件保留原始需求語意但示例文案已轉繁體。

## 技術棧

React + TypeScript + TailwindCSS + Framer-Motion + lucide-react + Three.js(背景)+ GSAP(布料效果)

## 產品概述

- Hero 作品集落地頁,深色主題
- `html` / `body` / `#root` / 外層主容器背景色:`#0C0C0C`
- 字體:Google Font **Kanit**,粗細 300–900
- 頁面 `<title>`:`Hero-Program`
- 全局重置:`box-sizing: border-box`,`margin/padding: 0`
- 外層主容器:`overflow-x: clip`
- `.hero-heading` 漸層文字:
  ```css
  background-image: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  ```

## 頁面章節順序

HeroSection → MarqueeSection → AboutSection → ProjectsSection

## 公共組件

### 1. ContactButton
- 藥丸圓角(`rounded-full`)
- 背景:`linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)`
- 內陰影 + 白色 2px 外描邊,偏移 `-3px`
- 文字:白色、大寫、繁體「聯繫我」(原規格簡體「联系我」已依頁面語言規則轉換)
- 內邊距/字號依斷點響應式調整

### 2. FadeIn
- 基於 Framer-Motion `whileInView`
- `viewport={{ once: true, margin: "50px" }}`
- 入參:`delay`、`duration`、`x`、`y`
- 緩動曲線:`[0.25, 0.1, 0.25, 1]`

### 3. AnimatedText
- 逐字元(character-by-character)透明度動畫
- 字元 `opacity`:`0.2 → 1`
- 使用 Framer-Motion `useScroll` + `useTransform`
- `offset: ['start 0.8', 'end 0.2']`

## 1. HeroSection

- 全螢幕 `h-screen`,`overflow-x: clip`
- 導航列 3 個連結:About / Projects / Contact
  - 文字色 `#D7E2EA`,大寫,`tracking-wider`
  - hover:`opacity: 70%`,`200ms` 過渡
- `<h1>` 大標題:「英雄之家」,套用 `.hero-heading`
  - `font-black`,大寫
  - 字號:`text-[14vw] sm:[15vw] md:[16vw] lg:[17.5vw]`
  - 外層 `overflow-hidden`
- 底部左右布局:左側小字(`#D7E2EA`,`font-light`,大寫)、右側 `ContactButton`
- 進場動畫延遲(全部用 `FadeIn`):
  - 導航:`delay=0`
  - 標題:`delay=0.15, y=40`
  - 左側文字:`delay=0.35, y=20`
  - 按鈕:`delay=0.5, y=20`
  - 人像:`delay=0.6, y=30`

## 2. MarqueeSection

- 背景 `#0C0C0C`
- 2 行橫向滾動圖片,共 21 張(目前為程式產生的隨機漸層佔位圖,等待使用者提供正式圖片)
- 第 1 行:前 11 個;第 2 行:後 10 個
- 每行資料三倍複製(`[...base, ...base, ...base]`)以實現無縫循環視覺
- 滾動偏移公式:
  ```
  offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3
  ```
  - 第一行:`translateX(offset - 200)`
  - 第二行:`translateX(-(offset - 200))`
- 每張卡片:`420×270px`,`rounded-2xl`,`object-cover`,`loading="lazy"`
- 行內 `gap-3`
- `will-change: transform`
- scroll 監聽使用 `passive: true`

## 3. AboutSection

- `min-h-screen`
- 標題「About me」套用 `.hero-heading`,`clamp()` 流體字號,置中 `FadeIn`
- 正文使用 `AnimatedText`,文案(繁體版):「這裡放你的自我介紹啊喂」
  - 文字色 `#D7E2EA`,`max-w-[560px]` 置中
- 正文下方放 `ContactButton`
- 嚴格控制區塊間距(`gap`)

## 4. ProjectsSection

- 背景 `#0C0C0C`
- 頂部大圓角,向上負 margin,`z-10`(視覺上蓋在 Marquee 之上)
- 標題「Project」套用 `.hero-heading`
- 4 個 Framer-Motion 粘性堆疊卡片效果:
  - 使用 `useScroll` + `useTransform`
  - 父容器 `h-[85vh]`
  - 每張卡片 `sticky top-24 md:top-32`
  - `targetScale = 1 - (totalCards - 1 - index) * 0.03`
  - 每張卡片 `top` 額外偏移:`index * 28px`
- 卡片樣式:大圓角、`border-2 #D7E2EA`、背景 `#0C0C0C`
- 卡片內容布局:
  - 頂部行:大序號 + 項目名稱
  - 底部雙欄圖片網格:左 40%(Col1,兩張堆疊圖 image1/image2)、右 60%(Col2,一張高圖)
  - 全部大圖圓角

## 技術與響應式

- 相依版本:`react` `18.3.1`、`framer-motion` `12.38.0`、`lucide-react` `0.344.0`、`tailwindcss` `3.4.1`、`vite`、`typescript`
- Tailwind 預設斷點:`sm 640` / `md 768` / `lg 1024`
- 大量使用 `clamp()` 做流體字號
- 移動端優先(mobile-first)

## 背景動效(Three.js 星雲背景)

- Three.js r128(專案實際使用 `three@0.128.0`)
- 立方體空間 `1200×1200×1200` 內隨機分布約 **6000** 個藍色點粒子
- `THREE.Points` + `PointsMaterial`,半透明,`size ≈ 1.4`
- 相機 `z = 220`
- 每帧旋轉:`rotation.y += 0.0012`、`rotation.x += 0.0004`
- 視窗 `resize` 自適應
- 全螢幕無滾動條殘留

## 資源生成(故事拆章與生圖) —— 待辦,等待使用者提供正式故事全文

- 需將故事全文拆成 **20–30 章**,每章「標題 + 一段正文」
  - 正文須「原封不動」從原文擷取
  - 標題是對正文的總結,後續要拿「標題 + 正文」給豆包批量生圖
- 每章依「標題 + 正文」生成對應圖片:
  - 主角與風格參考使用者提供的 3–5 張參考圖
  - 比例 **16:9**
  - 存到專案 `images/` 目錄,命名為 `1.png`、`2.png`、`3.png` ... 依章節順序到最後一章

## 資源替換 —— 待辦

- 把網頁中所有圖片替換成 `images/` 目錄下的正式圖片
- 圖片較大時需自行壓縮,兼顧效能
- 點擊圖片彈出一個框,內容為對應章節的本地 `.md` 檔案內容(需額外實作 Modal + fetch 本地 md)

## 裝飾組件決策

> 「這個地球組件用上以後還挺卡的,還是不建議放了。可以選擇一些比較簡單的其它組件。」

- **決策**:不做地球(globe)元件,沿用第二節的 Three.js 星空粒子作為唯一的輕量裝飾背景,不再疊加其他 3D 裝飾。

## 鼠標動效(布料物理按壓效果)

原始需求:
1. 整個網頁視口是一塊彈性布料,頁面內部所有 DOM 元素(文字、按鈕、div)跟隨布料一起形變,不使用 Canvas 渲染頁面內容
2. 鼠標位置模拟手指向下按壓布料:鼠標懸停移動,鼠標坐標處產生局部凹陷、拉扯形變,周邊產生波紋扭曲
3. 物理特性:布料有彈性阻尼,鼠標移動實時形變,鼠標移開,布料平滑回彈復原;按壓強度跟隨鼠標距離衰減
4. 實現思路(原文建議):把頁面分割成大量細小網格節點,每個節點維護物理位置,鼠標對節點施加斥力,再通過 `transform: matrix3d` 扭曲網格實現 DOM 形變
5. 性能:限制網格數量保證流暢,避免卡頓,兼容桌面端,不需要移動端適配

**實際技術選擇與原因**(記錄給後續維護者/AI):
頁面同時存在即時運行的 Three.js 星空 canvas 與大量互動元件(導航連結、按鈕、滾動觸發動畫)。若照原文字面實作「把整頁 DOM 拆成上百個網格節點各自 `matrix3d` 形變」,會需要把整棵 DOM 樹複製 N 份塞進每個網格 cell 才能讓每個 cell 顯示對應切片,這樣:
- 效能上無法接受(尤其還有一個 WebGL canvas 在跑)
- 複製後的按鈕/連結會失去原生可點擊性,或需要額外做座標映射,複雜且容易出 bug

因此改用等價視覺效果但技術路徑不同的方案(`src/effects/ClothEffect.tsx`):
- 用一個**低解析度物理網格**(`GRID_COLS=24 × GRID_ROWS=16`)模擬彈簧-阻尼系統,每個節點有位移(dispX/dispY)、速度(velX/velY)
- 每帧(用 `gsap.ticker`)依滑鼠位置計算「向內吸附」的按壓力(模擬手指壓入的凹陷),疊加距離衰減的波紋振盪
- 節點另有回彈彈力(`SPRING`)與阻尼(`DAMPING`),滑鼠移開後自然回彈到 0
- 把這個網格即時畫成一張很小的灰階位移貼圖(R 通道 = X 位移、G 通道 = Y 位移),透過 `<feImage>` 餵給 SVG `<feDisplacementMap>` 濾鏡,套用在 `#root`/App 根節點的 `filter: url(#cloth-filter)` 上
- 效果:整頁視覺上會像「布料」一樣被滑鼠拉扯凹陷、回彈,**但底下真實 DOM 元素的幾何位置完全沒變**,所以按鈕點擊、連結、滾動事件全部正常運作,天然滿足「不能擋住點擊/滾動」的需求,也不需要拆解、複製整棵 DOM 樹
- 使用 GSAP(`gsap.ticker`)驅動更新迴圈,滿足規格要求的技術棧
- 可調參數集中在檔案頂部:`GRID_COLS`/`GRID_ROWS`(網格解析度)、`SPRING`/`DAMPING`(彈力/阻尼)、`PRESS_STRENGTH`/`PRESS_RADIUS`(按壓強度/半徑)、`RIPPLE_WAVELENGTH`/`RIPPLE_SPEED`(波紋)、`DISPLACEMENT_SCALE`(位移貼圖套用的最終強度)

若之後真的需要「逐字元/逐按鈕獨立形變」的字面效果,再考慮用 CSS `clip-path` 分割搭配 `will-change`,但要先做效能測試。

## 點擊特效(霓虹墨水擴散)

- 點擊位置炸開一團類似墨水散開的彩色液體
- 0.5 秒內擴散到約 200px 停止,之後 2 秒內慢慢淡出消失
- 按住拖動時留下一道會自己扭動、慢慢消散的彩色軌跡
- 顏色每次隨機、偏霓虹,邊緣發光(`shadowBlur`)
- 必須浮在頁面內容上面發光,但不能擋住按鈕點擊和滾動,也不能有黑色背景蓋住作品圖片

實作:`src/effects/ClickInkEffect.tsx`,全螢幕 `<canvas>`,`pointer-events: none`,`globalCompositeOperation: 'lighter'` + 透明漸層,不填滿黑色背景。參數:`GROW_DURATION=500ms`、`FADE_DURATION=2000ms`、`NEON_HUES` 色相清單。

## Git / TortoiseGit(第八節)

- 使用者本機是 Windows,想裝 Git + TortoiseGit,並修改 hosts 檔案解決 GitHub 連線問題
- **限制記錄**:AI 助手實際可操作的是連接到使用者電腦的一個 Linux 沙盒環境(透過 remote-devices 橋接),裡面已內建 `git 2.34.1`,可以做 `git init`/`commit`/`push`,但**無法安裝或設定 Windows 版 TortoiseGit(GUI 軟體)、也無法直接修改 Windows 系統的 hosts 檔案**(`C:\Windows\System32\drivers\etc\hosts`)
- 使用者已確認:版本控制改用 AI 這邊的 git CLI 處理,不裝 TortoiseGit

## GitHub Pages 部署(第九節)

- Repo:`https://github.com/ddayzzzz/exp-wall`
- 部署方式:GitHub Actions(見 `.github/workflows/deploy.yml`),而非 `gh-pages` 分支推送
- `vite.config.ts` 的 `base: '/exp-wall/'`
- 已完成第一次 `git init` + commit + push(使用者提供 Personal Access Token,權限需同時包含 `repo` 與 `workflow`,推送完 token 已從本機 git 設定清除)
- 上線網址:`https://ddayzzzz.github.io/exp-wall/`
