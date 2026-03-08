# Heroes App

英雄列表與能力值編輯 Web App，使用 Next.js App Router 開發。

## 如何執行

### 環境需求

- Node.js 20.9+

### 安裝與啟動

```bash
npm install
npm run dev
```

開啟 http://localhost:3000 即可使用，首頁會自動導向 `/heroes`。

### 測試

```bash
npm run test                                # 單元 / 整合測試 (Vitest)

# 基本安裝
npx playwright install chromium

# 若在 Linux 環境，建議加上 --with-deps 以自動安裝缺少的系統函式庫
npx playwright install --with-deps chromium

npm run test:e2e                                # E2E 測試 (Playwright)
# 可加 --headed 開啟瀏覽器畫面：npm run test:e2e -- --headed
```

## 資料夾架構

```
heroes-project/
├── app/
│   ├── globals.css                  # 全域樣式
│   ├── layout.tsx                   # Root Layout (html, body, 字體)
│   ├── page.tsx                     # 根路徑 → redirect 到 /heroes
│   ├── not-found.tsx                # 全域 404 頁面
│   ├── icon.tsx                     # Favicon 動態生成
│   └── heroes/
│       ├── layout.tsx               # Heroes Layout（包含 Hero List）
│       ├── page.tsx                 # /heroes 頁面（僅顯示 Hero List）
│       └── [heroId]/
│           ├── page.tsx             # /heroes/:heroId（fetch profile，傳入 HeroProfile）
│           ├── not-found.tsx        # 英雄不存在時的提示
│           ├── error.tsx            # HeroProfile 錯誤邊界
│           └── loading.tsx          # HeroProfile 載入骨架
├── components/
│   ├── HeroList.tsx                 # Hero 列表（Server Component）
│   ├── HeroCard.tsx                 # 單一 Hero 卡片（Client Component）
│   ├── HeroProfile.tsx              # Hero 能力值編輯面板（Client Component）
│   └── StatControl.tsx              # 單一能力值 +/- 控制元件（Client Component）
├── hooks/
│   └── useHeroProfile.ts            # Profile 編輯邏輯 hook
├── lib/
│   ├── api.ts                       # API 請求封裝
│   └── types.ts                     # TypeScript 型別定義
├── __tests__/
│   ├── setup.ts                     # 測試環境設定（jest-dom matcher 註冊）
│   ├── useHeroProfile.test.ts       # useHeroProfile hook 邏輯測試
│   └── HeroProfile.test.tsx         # HeroProfile 元件整合測試
├── e2e/
│   └── hero-profile.spec.ts         # E2E happy path 測試
└── docs/                            # 需求文件與開發規劃
```

## Application 邏輯架構與設計理念

### 元件架構與資料流

```
RootLayout (Server)
└── HeroesLayout (Server)
    ├── HeroList (Server) ─── fetchHeroes() 取得英雄列表
    │   └── HeroCard × N (Client) ─── useParams() 比對 URL 判斷選取狀態
    └── {children}
        ├── /heroes → 空頁面
        └── /heroes/[heroId]
            └── HeroProfilePage (Server) ─── fetchHeroProfile() 取得能力值
                └── HeroProfile (Client) ─── useHeroProfile() 管理能力值增減與儲存
                    └── StatControl × 4 (Client) ─── +/- 按鈕操作
```

### 設計理念

**1. 利用 Nested Layout 實現共享 Hero List**

需求要求「Hero List 不因切換連結重新 render」。將 HeroList 放在 `app/heroes/layout.tsx` 中，子路由共享此 Layout，切換英雄時 Layout 不會重新 mount。

**2. Server / Client Component 劃分**

| 元件        | 類型   | 原因                                            |
| ----------- | ------ | ----------------------------------------------- |
| HeroList    | Server | 負責 fetch 英雄列表，無需互動                   |
| HeroCard    | Client | 需要 `useParams()` 判斷選取狀態                 |
| HeroProfile | Client | 使用 `useHeroProfile` hook 管理能力值狀態與儲存 |
| StatControl | Client | 接收 onClick handler 處理 +/- 按鈕事件          |

**3. 選取狀態由 URL 驅動**

HeroCard 透過 `useParams()` 取得 URL 中的 heroId，與自身 prop 比對來決定 highlight 樣式。不需要額外的全域狀態管理，HeroList 也能維持 Server Component。

**4. 能力值編輯的職責分離**

將編輯邏輯抽離至 `useHeroProfile` hook，`HeroProfile` 作為容器元件連接 hook 與 UI，`StatControl` 則是純展示元件，只透過 props 接收數值與 callback。三者關係：

- `useHeroProfile` — 持有狀態，提供 `increment` / `decrement` / `save` function，計算剩餘點數與按鈕啟用條件
- `HeroProfile` — 呼叫 hook，將狀態與 function 傳遞給各 `StatControl` 和儲存按鈕
- `StatControl` — 無狀態，依據 props 渲染數值與觸發 callback

## Framework / Library

### 核心技術

| 套件                                            | 用途       | 選用原因                                                                                     |
| ----------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| [Next.js](https://nextjs.org/)                  | 框架核心   | 現代化 React framework，提供檔案系統路由與 layout / loading / error 等檔案慣例，減少配置成本 |
| [React](https://react.dev/)                     | UI 渲染    | Next.js 搭配的 UI library                                                                    |
| [Tailwind CSS](https://tailwindcss.com/)        | 樣式系統   | Utility-first CSS，開發快速且不需額外 CSS 檔案                                               |
| [react-hot-toast](https://react-hot-toast.com/) | Toast 通知 | 輕量、API 簡潔，用於儲存成功/失敗的即時回饋                                                  |

### 測試工具

| 套件                                                                                   | 用途                                          |
| -------------------------------------------------------------------------------------- | --------------------------------------------- |
| [Vitest](https://vitest.dev/)                                                          | 單元 / 整合測試框架，與 Vite 生態整合，速度快 |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | 以使用者行為角度撰寫測試，搭配 Vitest 使用    |
| [Playwright](https://playwright.dev/)                                                  | E2E 測試，模擬真實瀏覽器操作                  |

## 註解原則

盡量讓程式碼本身透過變數與函式命名來解釋「做了什麼」，我通常在以下幾種情況才會加註解：

1. 程式碼邏輯違反直覺時，註解解釋原因
2. 複雜的業務規則或計算邏輯
3. TODO 或臨時的技術債標記

補充：E2E 測試中有用註解標示步驟，雖然可以透過 Page Object Model 讓測試步驟本身更具可讀性來取代註解，但考量目前只有一個測試檔案，暫不引入 POM。

## 遇到的困難與解決方法

**1. 需求邊界與細節處理**

拿到作業時，我發現部分細節沒有明確定義，例如：剛儲存完後使用者可以重複送出相同的請求、API 錯誤該如何呈現等。主動向團隊確認後，開始處理這些情況——儲存按鈕加上 `isDirty` 判斷（點數分配與原始資料不同才可儲存），API 錯誤以 toast 通知使用者。

**2. PATCH 後的資料同步策略**

儲存成功後，曾考慮重新 fetch profile 來確保前後端資料一致。但 PATCH response 只回傳 `"OK"`，要同步就需要多發一次 GET。此外，若有其他人同時修改，重新 fetch 可能拿到與剛存入不同的值，反而讓使用者困惑。最終決定直接信任前端 state，將目前的 `profile` 更新為新的 `baseProfile`。

**3. E2E 測試在 CI 環境的連線問題**

最初將 E2E 測試整合到 GitHub Actions 中，但因為測試依賴外部 API，在 CI 環境中頻繁出現連線問題，嘗試排除後未能解決。最終決定先將 E2E 測試改為在本地執行。

## 加分項目

### 讓專案更加完整的功能

- **全域 404 頁面** — 輸入不存在的路徑時，顯示提示並引導使用者返回英雄列表
- **英雄不存在處理** — 當 heroId 無效時，透過 `notFound()` 觸發專屬的 not-found 頁面，提示使用者從列表中選擇
- **Toast 通知** — 儲存成功或失敗時，以 toast 即時回饋結果，讓使用者明確知道操作是否完成
  補充：額外處理一種情況，PATCH API 沒有限制各點數一定大於等於 0。若有能力值在非 UI 操作被改成小於 0，使用者必須先將所有能力值調整至 0 以上才能送出。

### 可提升程式碼品質的做法

- **useHeroProfile hook 職責分離** — 將能力值的增減、剩餘點數計算、儲存等邏輯封裝至 custom hook，UI 元件只負責渲染與傳遞 props，職責清晰且方便獨立測試
- **測試覆蓋** — useHeroProfile hook 進行單元測試驗證邊界條件（如剩餘點數為 0 不可增加、儲存保護等），HeroProfile 元件進行整合測試模擬使用者操作，另有 E2E 測試驗證完整流程

### UX friendly 的功能

- **Skeleton UI** — 資料載入期間顯示骨架動畫，讓使用者知道內容正在載入
- **即時操作回饋** — 儲存結果以 toast 通知呈現，按鈕在不可操作時（如剩餘點數為 0、儲存中）自動 disabled 並調整樣式，讓使用者了解當前狀態

### AI 輔助開發

本專案使用 [Claude Code](https://code.claude.com/docs) 輔助開發。

**使用方式：先規劃、再實作**

參考 [How I Use Claude Code](https://boristane.com/blog/how-i-use-claude-code/) 的部分做法，開發流程分為兩階段：

1. **規劃階段** — 先將需求提供給 Claude Code，請它產出實作計畫（包含元件劃分、資料流設計、檔案結構等），過程中反覆 review 並修正方向，確認架構合理後才進入實作
2. **實作階段** — 依照計畫逐步實作，每完成一個階段就確認結果，遇到問題時透過對話修正

讓 AI 先產出計畫再寫 code，好處是開發者能在架構層面就介入修正，避免實作完才發現方向錯誤。同時計畫文件也成為開發過程的紀錄，方便回顧決策過程。
