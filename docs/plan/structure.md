# 專案架構規劃

## 選用技術

| 技術         | 版本            | 用途                                |
| ------------ | --------------- | ----------------------------------- |
| Next.js      | 16 (App Router) | 框架核心，提供路由、SSR/SSG、API 層 |
| React        | 19              | UI 渲染                             |
| TypeScript   | 5               | 型別安全                            |
| Tailwind CSS | 4               | 樣式系統                            |

---

## 路由設計

根據需求，專案有兩個頁面：

| 頁面              | 路徑              | 說明                         |
| ----------------- | ----------------- | ---------------------------- |
| Hero List Page    | `/heroes`         | 顯示所有英雄列表             |
| Hero Profile Page | `/heroes/:heroId` | 顯示選取英雄的能力值編輯面板 |

另外根目錄 `/` 會自動 redirect 到 `/heroes`。

### 利用 Next.js Nested Layout 實現共享 Hero List

需求中指出「Hero List 不因切換連結重新 render」，這正好對應 Next.js App Router 的 **Nested Layout** 機制：

- 在 `app/heroes/layout.tsx` 中放置 Hero List 元件
- 子路由 (`/heroes` 和 `/heroes/[heroId]`) 共享此 Layout
- 切換英雄時，Layout 不會重新 mount，Hero List 保持原位

---

## 資料夾結構

```
heroes-project/
├── app/
│   ├── globals.css                  # 全域樣式
│   ├── layout.tsx                   # Root Layout (html, body, 字體)
│   ├── page.tsx                     # 根路徑 → redirect 到 /heroes
│   └── heroes/
│       ├── layout.tsx               # Heroes Layout（包含 Hero List）
│       ├── page.tsx                 # /heroes 頁面（僅顯示 Hero List，無 Profile）
│       └── [heroId]/
│           ├── page.tsx             # /heroes/:heroId 頁面（fetch profile，傳入 HeroProfile）
│           ├── error.tsx            # HeroProfile 錯誤邊界（重試按鈕）
│           └── loading.tsx          # HeroProfile 載入骨架
├── components/
│   ├── HeroList.tsx                 # Hero 列表元件
│   ├── HeroCard.tsx                 # 單一 Hero 卡片元件
│   ├── HeroProfile.tsx             # Hero 能力值編輯面板
│   └── StatControl.tsx             # 單一能力值的 +/- 控制元件
├── lib/
│   ├── api.ts                       # API 請求封裝
│   └── types.ts                     # TypeScript 型別定義
├── hooks/
│   └── useHeroProfile.ts           # Hero Profile 編輯邏輯（increment/decrement/save）
├── __tests__/
│   ├── setup.ts                   # jest-dom matcher 註冊 + cleanup
│   ├── useHeroProfile.test.ts     # hook 邏輯測試
│   └── HeroProfile.test.tsx       # 元件整合測試
├── docs/
│   ├── requirements.md
│   └── plan/
│       ├── structure.md            # (本文件)
│       ├── plan-basic-ui.md       # Phase 1：基礎 UI 實作計劃
│       ├── plan-profile.md        # Phase 2：HeroProfile 重構 + 互動邏輯
│       └── plan-testing.md        # Phase 3：測試計劃
├── public/
├── package.json
├── vitest.config.ts                # Vitest 設定
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── README.md
```

---

## 元件架構

```
RootLayout (app/layout.tsx)
└── HeroesLayout (app/heroes/layout.tsx)
    ├── HeroList (components/HeroList.tsx)                        ← 所有頁面共享，不隨路由重新 mount
    │   └── HeroCard × N (components/HeroCard.tsx)               ← 可點擊，選取時 highlight
    └── {children}
        ├── HeroesPage (app/heroes/page.tsx)                      ← /heroes（空內容或歡迎提示）
        └── HeroProfilePage (app/heroes/[heroId]/page.tsx)        ← /heroes/[heroId]
            └── HeroProfile (components/HeroProfile.tsx)
                └── StatControl × 4 (components/StatControl.tsx)  ← str, int, agi, luk
```

---

## 各層職責說明

### 1. `lib/types.ts` — 型別定義

```ts
// Hero 基本資訊（列表 API 回傳）
interface Hero {
  id: string;
  name: string;
  image: string;
}

// Hero 能力值（Profile API 回傳）
interface HeroProfile {
  str: number;
  int: number;
  agi: number;
  luk: number;
}

// PATCH request body（結構與 HeroProfile 相同，明確區分用途）
type PatchHeroProfilePayload = HeroProfile;
```

### 2. `lib/api.ts` — API 封裝

集中管理所有對外部 API 的請求：

| 函式                                | HTTP Method | 端點                      | 說明               |
| ----------------------------------- | ----------- | ------------------------- | ------------------ |
| `fetchHeroes()`                     | GET         | `/heroes`                 | 取得所有英雄列表   |
| `fetchHeroProfile(heroId)`          | GET         | `/heroes/:heroId/profile` | 取得單一英雄能力值 |
| `patchHeroProfile(heroId, profile)` | PATCH       | `/heroes/:heroId/profile` | 更新英雄能力值     |

### 3. `components/HeroList.tsx` — Hero 列表

- 使用 `fetchHeroes()` 取得英雄列表
- 使用 flexbox + wrap 實現響應式橫向排列

### 4. `components/HeroCard.tsx` — Hero 卡片

- 顯示英雄圖片 (`next/image`) 與名字
- 使用 `<Link>` 前往 `/heroes/[heroId]`
- 接收 `heroId` prop，用來和目前的 URL 的 heroId 比對
- Hover 效果提升互動體驗

### 5. `components/HeroProfile.tsx` — 能力值編輯面板

- **Client Component**（需要互動狀態管理）
- 接收 `heroId` 和 `initialProfile` props（由 `page.tsx` server-side fetch 後傳入）
- 呼叫 `useHeroProfile` hook 管理編輯狀態
- 顯示四項能力值，各搭配 `StatControl` 元件
- 顯示「剩餘點數」
- 「儲存」按鈕：有修改且剩餘點數 = 0 時可點，否則 disabled

### 6. `components/StatControl.tsx` — 能力值控制

- 顯示能力值名稱、數值
- 左右 +/- 按鈕
- `-` 按鈕在數值為 0 時 disabled
- `+` 按鈕在剩餘點數為 0 時 disabled

### 7. `hooks/useHeroProfile.ts` — Profile 邏輯 Hook

- 接收 `heroId` 和 `initialProfile`，負責：
  - 管理編輯中的能力值狀態（`profile`）和儲存基準（`baseProfile`）
  - 計算剩餘點數 = `baseProfile` 總和 - `profile` 總和
  - 計算 `isDirty`：`profile` 與 `baseProfile` 是否不同
  - 提供 `increment(stat)` / `decrement(stat)` 方法
  - 提供 `save()` 方法送出 PATCH 請求，成功後更新 `baseProfile`

---

## 關鍵設計決策

### 1. Server vs Client Component 劃分

| 元件           | 類型   | 原因                                          |
| -------------- | ------ | --------------------------------------------- |
| `HeroesLayout` | Server | 純 Layout 結構，無互動需求                    |
| `HeroList`     | Server | 負責 fetch 英雄列表，無需互動                 |
| `HeroCard`     | Client | 需要 `useParams()` 取得目前路由來判斷是否選取 |
| `HeroProfile`  | Client | 需要管理編輯狀態、按鈕互動                    |
| `StatControl`  | Client | 按鈕互動                                      |

### 2. 選取狀態的實作

`HeroList` 為 Server Component，負責 fetch 英雄列表並將每張卡片的 `heroId` 傳入 `HeroCard`。`HeroCard` 為 Client Component，透過 `useParams()` 取得 URL 中目前的 `heroId`，與自身的 `heroId` prop 比對，若相符則套用 highlight 樣式。

這樣的好處是選取狀態完全由 URL 驅動，不需要額外的全域狀態管理，且 `HeroList` 本身仍可保持 Server Component 以直接 fetch 資料。

### 3. 能力值編輯邏輯

- 取得 profile 後，計算原始總和 `originalTotal = str + int + agi + luk`
- 編輯時即時計算 `currentTotal`，剩餘點數 = `originalTotal - currentTotal`
- `+` 按鈕：剩餘點數 > 0 時可用
- `-` 按鈕：該能力值 > 0 時可用
- 儲存按鈕：有修改（`isDirty`）且剩餘點數 = 0 時才可提交

### 4. 響應式設計

- Hero List 使用 `flex-wrap` 實現自動換行
- 卡片使用固定或 min-width，在小螢幕自動堆疊
- 使用 Tailwind 的 responsive utility classes

### 5. 錯誤處理與載入狀態

- API 請求加上 loading 狀態顯示
- 儲存成功/失敗給予使用者回饋
- 網路錯誤時顯示錯誤提示

---

## 第三方套件

| 套件             | 用途                         |
| ---------------- | ---------------------------- |
| react-hot-toast  | 儲存成功/失敗的 toast 通知   |

其餘功能（狀態管理、資料請求、樣式、路由）皆使用 Next.js / React / Tailwind 內建機制。
