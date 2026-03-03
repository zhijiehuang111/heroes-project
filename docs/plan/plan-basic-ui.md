# 實作計劃（UI 階段）

> 本階段目標：依照 wireframe 完成所有頁面 UI，**暫不實作加減點數與儲存的互動邏輯**。

---

## 實作順序

按照依賴關係由底層到上層逐步建立：

```
1. API 層（lib/）
2. 基礎元件（HeroCard、StatControl）
3. 組合元件（HeroList、HeroProfile）
4. 頁面整合（pages 與 layout）
```

---

## 第 1 步：API 封裝

### `lib/api.ts`

三個函式，全部用原生 `fetch`：

| 函式                                | 說明                                                        |
| ----------------------------------- | ----------------------------------------------------------- |
| `fetchHeroes()`                     | GET /heroes                                                 |
| `fetchHeroProfile(heroId)`          | GET /heroes/:heroId/profile                                 |
| `patchHeroProfile(heroId, payload)` | PATCH /heroes/:heroId/profile（UI 階段先 stub，不實際呼叫） |

---

## 第 2 步：HeroCard 元件

**檔案**：`components/HeroCard.tsx`（Client Component）

### UI 規格

- 固定卡片寬度（約 `w-40`），白色背景，圓角，輕陰影
- 上方：英雄圖片，使用 `next/image`，固定正方形比例（`aspect-square`）
- 下方：英雄名字，文字置中
- 整個卡片為 `<Link href="/heroes/:heroId">`
- **選取 highlight**：透過 `useParams()` 取得目前 URL `heroId`，與 prop 比對
  - 未選取：白色背景，hover 時輕微提亮邊框
  - 已選取：金黃色邊框（`border-yellow-400`）或背景色變化，視覺上清楚區分

### Props

```ts
interface HeroCardProps {
  hero: Hero;
}
```

---

## 第 3 步：HeroList 元件

**檔案**：`components/HeroList.tsx`（Server Component）

### UI 規格

- 呼叫 `fetchHeroes()` 取得資料
- 卡片排列：`flex flex-wrap justify-around gap-y-4`
- 將每個 hero 傳入 `HeroCard`
- Loading 狀態由 `layout.tsx` 的 `<Suspense>` + `HeroListSkeleton` 處理

### 容器樣式

- 整體 HeroList 區塊有明顯邊框/背景，對應 wireframe 外框
- 水平置中於頁面

---

## 第 4 步：StatControl 元件

**檔案**：`components/StatControl.tsx`（Client Component）

### UI 規格

依照 wireframe，每列格式為：

```
STR  [+]  5  [-]
```

- 標籤（STR/INT/AGI/LUK）：固定寬度，左對齊
- `[+]` 按鈕：方形按鈕，灰色背景
- 數值：固定寬度，置中顯示
- `[-]` 按鈕：方形按鈕，灰色背景
- **UI 階段**：按鈕顯示但不連接邏輯（靜態顯示）；disabled 狀態樣式先預備好

### Props（UI 階段）

```ts
interface StatControlProps {
  label: string; // "STR" | "INT" | "AGI" | "LUK"
  value: number;
  onIncrement: () => void; // UI 階段傳空函式
  onDecrement: () => void; // UI 階段傳空函式
  canIncrement: boolean; // UI 階段傳 true
  canDecrement: boolean; // UI 階段傳 value > 0
}
```

---

## 第 5 步：HeroProfile 元件

**檔案**：`components/HeroProfile.tsx`（Client Component）

### UI 規格

依照 wireframe：

```
STR  [+]  5  [-]
INT  [+]  5  [-]      剩餘點數: 30
AGI  [+]  0  [-]
LUK  [+]  5  [-]      [   儲存   ]
```

- 左側：4 個 `StatControl`，垂直排列，間距一致
- 右側：「剩餘點數: N」文字 + 「儲存」按鈕
  - 儲存按鈕：灰色背景，有邊框，hover 效果
  - **UI 階段**：按鈕不連接邏輯，disabled 樣式預備
- 整體在一個有邊框的容器內

### 資料取得（UI 階段）

- 接收 `heroId` prop，呼叫 `fetchHeroProfile(heroId)` 取得初始資料
- 直接靜態顯示，不需要互動狀態管理
- 顯示 loading 骨架屏

### Props

```ts
interface HeroProfileProps {
  heroId: string;
}
```

---

## 第 6 步：整合頁面

### `app/heroes/layout.tsx`（Server Component）

```tsx
export default async function HeroesLayout({ children }) {
  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4 bg-gray-100">
      <HeroList />
      <div className="w-full max-w-3xl mt-8">{children}</div>
    </div>
  );
}
```

### `app/heroes/page.tsx`

空白頁（只顯示 HeroList，無 Profile）：

```tsx
export default function HeroesPage() {
  return null; // HeroList 已在 layout 中
}
```

### `app/heroes/[heroId]/page.tsx`

```tsx
export default function HeroProfilePage({ params }) {
  return <HeroProfile heroId={params.heroId} />;
}
```

---

## 整體視覺設計方向

參考 wireframe 的簡潔風格，使用：

- **背景**：淺灰色（`bg-gray-100`）
- **卡片/容器**：白色背景，`rounded-lg`，`shadow-sm`，`border border-gray-200`
- **按鈕**：方形，灰色（`bg-gray-200 hover:bg-gray-300`），有圓角
- **選取 highlight**：金黃/橘色邊框（`border-2 border-yellow-400`）
- **字體**：沿用 Geist Sans（已在 root layout 設定）

---

## 不在此階段實作的功能

- `+`/`-` 按鈕的互動邏輯（`useHeroProfile` hook）
- 儲存按鈕送出 PATCH 請求
- 能力點數加減驗證
- 成功/失敗 toast 提示

這些邏輯留待下一階段實作。
