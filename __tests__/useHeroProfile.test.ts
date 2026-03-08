import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHeroProfile } from "@/hooks/useHeroProfile";

vi.mock("@/lib/api", () => ({
  patchHeroProfile: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { patchHeroProfile } from "@/lib/api";
import toast from "react-hot-toast";

const mockPatch = vi.mocked(patchHeroProfile);

const initialProfile = { str: 5, int: 3, agi: 4, luk: 2 };

describe("useHeroProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初始狀態: remainingPoints 為 0, isDirty 為 false", () => {
    const { result } = renderHook(() => useHeroProfile("1", initialProfile));
    expect(result.current.remainingPoints).toBe(0);
    expect(result.current.isDirty).toBe(false);
  });

  it("increment: 增加能力值, 剩餘點數減少", () => {
    const { result } = renderHook(() =>
      useHeroProfile("1", { str: 5, int: 3, agi: 4, luk: 2 }),
    );

    act(() => result.current.decrement("str"));
    expect(result.current.profile.str).toBe(4);
    expect(result.current.remainingPoints).toBe(1);

    act(() => result.current.increment("int"));
    expect(result.current.profile.int).toBe(4);
    expect(result.current.remainingPoints).toBe(0);
  });

  it("increment 邊界: 剩餘點數為 0 時無效", () => {
    const { result } = renderHook(() => useHeroProfile("1", initialProfile));

    act(() => result.current.increment("str"));
    expect(result.current.profile.str).toBe(5);
  });

  it("decrement 邊界: 能力值為 0 時無效", () => {
    const { result } = renderHook(() =>
      useHeroProfile("1", { str: 0, int: 3, agi: 4, luk: 7 }),
    );

    act(() => result.current.decrement("str"));
    expect(result.current.profile.str).toBe(0);
  });

  it("isDirty: 修改後為 true, 還原後回到 false", () => {
    const { result } = renderHook(() => useHeroProfile("1", initialProfile));

    act(() => result.current.decrement("str"));
    expect(result.current.isDirty).toBe(true);

    act(() => result.current.increment("str"));
    expect(result.current.isDirty).toBe(false);
  });

  it("save: remainingPoints !== 0 時不送出", async () => {
    const { result } = renderHook(() => useHeroProfile("1", initialProfile));

    act(() => result.current.decrement("str"));

    await act(() => result.current.save());
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it("save: 未修改時不送出", async () => {
    const { result } = renderHook(() => useHeroProfile("1", initialProfile));

    await act(() => result.current.save());
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it("save 成功: 呼叫 API 並顯示成功 toast", async () => {
    mockPatch.mockResolvedValue(undefined);
    const { result } = renderHook(() => useHeroProfile("1", initialProfile));

    act(() => result.current.decrement("str"));
    act(() => result.current.increment("int"));

    await act(() => result.current.save());

    expect(mockPatch).toHaveBeenCalledWith("1", {
      str: 4,
      int: 4,
      agi: 4,
      luk: 2,
    });
    expect(toast.success).toHaveBeenCalled();
    expect(result.current.isDirty).toBe(false);
  });

  it("save: isSaving 期間再次呼叫不重複送出", async () => {
    // 讓 patchHeroProfile 永遠不 resolve，模擬請求進行中
    mockPatch.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useHeroProfile("1", initialProfile));

    act(() => result.current.decrement("str"));
    act(() => result.current.increment("int"));

    // 不 return Promise 給 act，避免等待永遠不 resolve 的 Promise
    act(() => {
      result.current.save();
    });
    expect(result.current.isSaving).toBe(true);

    await act(() => result.current.save());
    expect(mockPatch).toHaveBeenCalledTimes(1);
  });

  it("save: profile 含負數時即使總和不變也不送出", async () => {
    const negativeProfile = { str: -2, int: 5, agi: 4, luk: 3 };
    const { result } = renderHook(() => useHeroProfile("1", negativeProfile));

    expect(result.current.hasNegative).toBe(true);

    act(() => result.current.decrement("luk"));
    act(() => result.current.increment("str"));
    expect(result.current.profile.str).toBe(-1);
    expect(result.current.remainingPoints).toBe(0);
    expect(result.current.isDirty).toBe(true);

    await act(() => result.current.save());
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it("save: 負數 profile 加到全部 >= 0 後可送出", async () => {
    mockPatch.mockResolvedValue(undefined);
    const negativeProfile = { str: -2, int: 5, agi: 4, luk: 3 };
    const { result } = renderHook(() => useHeroProfile("1", negativeProfile));

    act(() => result.current.decrement("int"));
    act(() => result.current.decrement("int"));
    act(() => result.current.increment("str"));
    act(() => result.current.increment("str"));

    expect(result.current.profile.str).toBe(0);
    expect(result.current.hasNegative).toBe(false);
    expect(result.current.remainingPoints).toBe(0);

    await act(() => result.current.save());
    expect(mockPatch).toHaveBeenCalledWith("1", {
      str: 0,
      int: 3,
      agi: 4,
      luk: 3,
    });
  });

  it("save 失敗: 顯示錯誤 toast", async () => {
    mockPatch.mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useHeroProfile("1", initialProfile));

    act(() => result.current.decrement("str"));
    act(() => result.current.increment("int"));

    await act(() => result.current.save());

    expect(toast.error).toHaveBeenCalled();
    expect(result.current.isDirty).toBe(true);
  });
});
