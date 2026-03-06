# Testing Plan

## 工具選擇

| 工具 | 用途 |
|------|------|
| Vitest | 測試框架 |
| jsdom | 瀏覽器環境模擬 |
| @testing-library/react | render、screen、within、cleanup |
| @testing-library/user-event | 模擬使用者互動（click 等） |
| @testing-library/jest-dom | 額外 matcher（toBeDisabled、toHaveTextContent 等） |
| @vitejs/plugin-react | Vitest 編譯 JSX/TSX |
| vite-tsconfig-paths | 讓 Vitest 認得 `@/` alias |

## 測試範圍

### 1. `useHeroProfile` hook — 核心邏輯

- increment / decrement 與剩餘點數連動
- 邊界：剩餘點數為 0 時 increment 無效、能力值為 0 時 decrement 無效
- remainingPoints = baseTotal - currentTotal
- isDirty：修改後 true，還原後 false
- save：條件不符時不送出、成功時更新 baseProfile 並顯示 toast、失敗時顯示錯誤 toast

### 2. `HeroProfile` 元件 — 畫面整合

- 初始渲染：四個能力值正確、剩餘點數 0、儲存按鈕 disabled
- 使用者操作：STR -1、INT +1 → 數值更新 → 儲存按鈕 enabled → 點儲存呼叫 API

## 檔案結構

```
__tests__/
  setup.ts                    # jest-dom matcher 註冊 + cleanup
  useHeroProfile.test.ts      # hook 邏輯測試
  HeroProfile.test.tsx        # 元件整合測試
vitest.config.ts              # Vitest 設定
```
