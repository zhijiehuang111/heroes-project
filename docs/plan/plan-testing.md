# Testing Plan

## Unit / Integration Tests（已完成）

### 工具選擇

| 工具 | 用途 |
|------|------|
| Vitest | 測試框架 |
| jsdom | 瀏覽器環境模擬 |
| @testing-library/react | render、screen、within、cleanup |
| @testing-library/user-event | 模擬使用者互動（click 等） |
| @testing-library/jest-dom | 額外 matcher（toBeDisabled、toHaveTextContent 等） |
| @vitejs/plugin-react | Vitest 編譯 JSX/TSX |
| vite-tsconfig-paths | 讓 Vitest 認得 `@/` alias |

### 測試範圍

#### 1. `useHeroProfile` hook — 核心邏輯

- increment / decrement 與剩餘點數連動
- 邊界：剩餘點數為 0 時 increment 無效、能力值為 0 時 decrement 無效
- remainingPoints = baseTotal - currentTotal
- isDirty：修改後 true，還原後 false
- save：條件不符時不送出、成功時更新 baseProfile 並顯示 toast、失敗時顯示錯誤 toast

#### 2. `HeroProfile` 元件 — 畫面整合

- 初始渲染：四個能力值正確、剩餘點數 0、儲存按鈕 disabled
- 使用者操作：STR -1、INT +1 → 數值更新 → 儲存按鈕 enabled → 點儲存呼叫 API

### 檔案結構

```
__tests__/
  setup.ts                    # jest-dom matcher 註冊 + cleanup
  useHeroProfile.test.ts      # hook 邏輯測試
  HeroProfile.test.tsx        # 元件整合測試
vitest.config.ts              # Vitest 設定
```

---

## E2E Tests（已完成）

### 工具

Playwright（Chromium only）

### 目標

只測一條 happy path：選擇英雄 → 調整能力值 → 儲存成功。

### 測試步驟

1. 進入 `/heroes`，透過 `a[href^="/heroes/"]` 等待英雄卡片出現
2. 點擊第一個英雄卡片
3. 確認 HeroProfile 載入（STR / INT / AGI / LUK 可見）
4. 確認剩餘點數為 `0`、儲存按鈕 disabled
5. 找第一個 enabled 的 `-` 點擊，再對不同行點 `+`，確保 isDirty
6. 確認儲存按鈕 enabled，點擊儲存
7. 確認 toast「儲存成功！」出現

### 安裝

```bash
npm install -D @playwright/test
npx playwright install chromium
```

### 檔案結構

```
e2e/
  hero-profile.spec.ts
playwright.config.ts
```

### npm script

`"test:e2e": "playwright test"`
