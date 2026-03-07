import { test, expect } from "@playwright/test";

test("Hero Profile happy path: 選擇英雄 → 調整能力值 → 儲存", async ({
  page,
}) => {
  // 1. 進入英雄列表，等待卡片出現
  await page.goto("/heroes");
  const heroLinks = page.locator('a[href^="/heroes/"]');
  await expect(heroLinks.first()).toBeVisible();

  // 2. 點擊第一個英雄
  await heroLinks.first().click();

  // 3. 確認 HeroProfile 載入
  await expect(page.getByText("STR")).toBeVisible();
  await expect(page.getByText("INT")).toBeVisible();
  await expect(page.getByText("AGI")).toBeVisible();
  await expect(page.getByText("LUK")).toBeVisible();

  // 4. 初始狀態：剩餘點數 0、儲存 disabled
  await expect(page.getByText(/剩餘點數/)).toContainText("0");
  await expect(page.getByRole("button", { name: "儲存" })).toBeDisabled();

  // 5. 找第一個可扣的 stat 點 -，再對不同 stat 點 +
  const minusButtons = page.getByRole("button", { name: "-" });
  const plusButtons = page.getByRole("button", { name: "+" });
  const count = await minusButtons.count();
  let decIndex = 0;
  for (let i = 0; i < count; i++) {
    if (await minusButtons.nth(i).isEnabled()) {
      await minusButtons.nth(i).click();
      decIndex = i;
      break;
    }
  }
  await plusButtons.nth(decIndex === 0 ? 1 : 0).click();

  // 6. 儲存按鈕 enabled → 點擊儲存
  await expect(page.getByRole("button", { name: "儲存" })).toBeEnabled();
  await page.getByRole("button", { name: "儲存" }).click();

  // 7. 儲存完成，確認 toast 出現
  await expect(page.getByText("儲存成功！")).toBeVisible();
});
