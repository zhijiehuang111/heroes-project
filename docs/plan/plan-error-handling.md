# Error Handling 計畫

## 現況

- `HeroList` — 已有 try/catch，顯示錯誤訊息 ✅
- `HeroProfilePage` — error.tsx 處理 ✅
- `useHeroProfile.save` — react-hot-toast 處理 ✅

## 完成項目

### 1. `app/heroes/[heroId]/error.tsx` ✅

- 使用 Next.js Error Boundary 捕捉 `fetchHeroProfile` 錯誤
- 顯示錯誤訊息 + 重試按鈕
- 重試搭配 `router.refresh()` + `reset()`（refresh 強制 Server Component 重新 fetch，reset 清除錯誤狀態）
- page.tsx 不需修改

### 2. 安裝 `react-hot-toast` ✅

- 在 `app/layout.tsx` 加入 `<Toaster position="top-center" />`

### 3. `hooks/useHeroProfile.ts` ✅

- `save()` 成功時 `toast.success("儲存成功！")`
- `save()` 失敗時 `toast.error("儲存失敗，請稍後再試。")`

### 4. `components/HeroProfile.tsx`

- 不需修改（toast 由 hook 內觸發）
