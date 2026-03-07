# Not Found 處理計畫

## 問題

目前進入不存在的英雄路由（例如 `/heroes/23`），API 回傳 404 時 `fetchHeroProfile` 直接 throw Error，被 `error.tsx` 接住。應該觸發 `not-found.tsx` 才符合語意。

## 修改項目

### 1. `lib/api.ts` — fetchHeroProfile

- 404 時回傳 `null`，其他錯誤仍 throw
- 回傳型別改為 `Promise<HeroProfile | null>`

### 2. `app/heroes/[heroId]/page.tsx`

- 收到 `null` 時呼叫 `notFound()`

### 3. `app/heroes/[heroId]/not-found.tsx` — 新增

- 顯示「找不到此英雄，請從列表中選擇」提示
- 在 layout 內顯示，上方仍有英雄列表可點選

### 4. `app/not-found.tsx` — 新增（全域）

- 處理所有不存在的路由（例如 `/abc`）
- 顯示「頁面不存在」+ 返回英雄列表按鈕
- 背景風格與 `/heroes` 一致（bg-gray-100）
