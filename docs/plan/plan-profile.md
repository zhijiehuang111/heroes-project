# Plan: HeroProfile 架構重構 + 增減點數 / 儲存邏輯

## Context

Phase 1（UI）已完成，現在要實作 Phase 2：能力值增減與儲存。
同時重構 HeroProfile，將 fetch 移至 Server Component（`page.tsx`），讓 HeroProfile 只負責編輯互動。

---

## 改動清單

### 1. `app/heroes/[heroId]/page.tsx`（Server Component） ✅

- 在 page 裡呼叫 `fetchHeroProfile(heroId)` 取得 `initialProfile`
- 將 `heroId` + `initialProfile` 作為 props 傳入 `HeroProfile`
- Loading 由 layout 的 `<Suspense>` 自動處理（page 是 async，Suspense 會捕捉）

```tsx
import HeroProfile from "@/components/HeroProfile";
import { fetchHeroProfile } from "@/lib/api";

export default async function HeroProfilePage({ params }) {
  const { heroId } = await params;
  const initialProfile = await fetchHeroProfile(heroId);
  return (
    <HeroProfile key={heroId} heroId={heroId} initialProfile={initialProfile} />
  );
}
```

- 加 `key={heroId}` 讓切換英雄時 React 強制 unmount/remount HeroProfile，自動重設所有 state

### 2. `hooks/useHeroProfile.ts`（新實作） ✅

接收 `heroId` 和 `initialProfile`，回傳編輯相關的狀態與方法：

**State：**

- `profile`：目前編輯中的能力值（初始值 = `initialProfile`）
- `isSaving`：PATCH 請求中

**Derived：**

- `originalTotal`：`initialProfile` 四項能力值總和
- `currentTotal`：`profile` 四項能力值總和
- `remainingPoints`：`originalTotal - currentTotal`
- `isDirty`：`profile` 與 `initialProfile` 任一 stat 不同（表示有修改過）

**Methods：**

- `increment(stat)`：`remainingPoints > 0` 時，將該 stat +1
- `decrement(stat)`：該 stat `> 0` 時，-1
- `save()`：`remainingPoints === 0` 時，呼叫 `patchHeroProfile(heroId, profile)`

**重點：** 切換英雄時的 state 重設由 `page.tsx` 的 `key={heroId}` 處理（強制 remount），hook 內不需要額外的 `useEffect` 同步邏輯。

### 3. `components/HeroProfile.tsx`（重構） ✅

- 移除 `useEffect` fetch 邏輯、`fetchResult` state、`isStale` pattern、`HeroProfileSkeleton`
- Props 改為 `{ heroId: string; initialProfile: HeroProfileType }`
- 呼叫 `useHeroProfile(heroId, initialProfile)` 取得狀態與方法
- 將 `increment` / `decrement` 連接到 `StatControl` 的 `onIncrement` / `onDecrement`
- `canIncrement` = `remainingPoints > 0`
- `canDecrement` = `profile[stat] > 0`
- 儲存按鈕：`disabled` = `!isDirty || remainingPoints !== 0 || isSaving`，點擊呼叫 `save()`
- 顯示 `remainingPoints`

### 4. `components/StatControl.tsx` ✅

- 不需修改，現有的 props interface 已完備

---

## 設計決策

- **PATCH 後不重新 GET**：信任本地 state，儲存成功後更新 `baseProfile` 為當前 `profile`。不預期多人同時編輯同一英雄。

---

## 驗證方式

1. `npm run build` 確認無型別錯誤
2. 開啟 `/heroes/1`，確認能力值正確顯示（SSR，無 loading flash）
3. 點 +/- 按鈕，確認數值變化、剩餘點數即時更新
4. 剩餘點數 > 0 時 + 按鈕可用、= 0 時 disabled
5. 能力值 = 0 時 - 按鈕 disabled
6. 有修改且剩餘點數 = 0 時儲存按鈕可點，否則 disabled
7. 點擊儲存，確認 PATCH 發送成功（Network tab 確認）
8. 切換英雄，確認 profile 重新載入為新英雄的值
