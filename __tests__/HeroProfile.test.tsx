import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeroProfile from "@/components/HeroProfile";

vi.mock("@/lib/api", () => ({
  patchHeroProfile: vi.fn(),
}));

import { patchHeroProfile } from "@/lib/api";

const mockPatch = vi.mocked(patchHeroProfile);

const initialProfile = { str: 5, int: 3, agi: 4, luk: 2 };

function statRow(label: string) {
  return screen.getByText(label).closest("div") as HTMLElement;
}

describe("HeroProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初始狀態：顯示正確能力值、剩餘點數 0、儲存按鈕 disabled", () => {
    render(<HeroProfile heroId="1" initialProfile={initialProfile} />);

    expect(within(statRow("STR")).getByText("5")).toBeInTheDocument();
    expect(within(statRow("INT")).getByText("3")).toBeInTheDocument();
    expect(within(statRow("AGI")).getByText("4")).toBeInTheDocument();
    expect(within(statRow("LUK")).getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/剩餘點數/)).toHaveTextContent("0");
    expect(screen.getByRole("button", { name: "儲存" })).toBeDisabled();
  });

  it("STR -1, INT +1 後可儲存，點擊儲存呼叫 API", async () => {
    const user = userEvent.setup();
    render(<HeroProfile heroId="1" initialProfile={initialProfile} />);

    const strMinus = within(statRow("STR")).getByRole("button", { name: "-" });
    const intPlus = within(statRow("INT")).getByRole("button", { name: "+" });
    await user.click(strMinus);
    await user.click(intPlus);

    expect(within(statRow("STR")).getByText("4")).toBeInTheDocument();
    expect(within(statRow("INT")).getByText("4")).toBeInTheDocument();

    const saveButton = screen.getByRole("button", { name: "儲存" });
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(mockPatch).toHaveBeenCalledWith("1", {
      str: 4,
      int: 4,
      agi: 4,
      luk: 2,
    });
  });
});
