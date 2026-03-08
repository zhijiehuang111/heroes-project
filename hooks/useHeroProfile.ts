"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { patchHeroProfile } from "@/lib/api";
import type { HeroProfile } from "@/lib/types";

type StatKey = keyof HeroProfile;

export function useHeroProfile(heroId: string, initialProfile: HeroProfile) {
  const [profile, setProfile] = useState<HeroProfile>(initialProfile);

  const [baseProfile, setBaseProfile] = useState<HeroProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  const originalTotal =
    baseProfile.str + baseProfile.int + baseProfile.agi + baseProfile.luk;
  const currentTotal = profile.str + profile.int + profile.agi + profile.luk;
  const remainingPoints = originalTotal - currentTotal;
  const isDirty =
    profile.str !== baseProfile.str ||
    profile.int !== baseProfile.int ||
    profile.agi !== baseProfile.agi ||
    profile.luk !== baseProfile.luk;
  const hasNegative =
    profile.str < 0 || profile.int < 0 || profile.agi < 0 || profile.luk < 0;

  function increment(stat: StatKey) {
    if (remainingPoints <= 0) return;
    setProfile((prev) => ({ ...prev, [stat]: prev[stat] + 1 }));
  }

  function decrement(stat: StatKey) {
    if (profile[stat] <= 0) return;
    setProfile((prev) => ({ ...prev, [stat]: prev[stat] - 1 }));
  }

  async function save() {
    if (remainingPoints !== 0 || !isDirty || isSaving || hasNegative) return;
    setIsSaving(true);
    try {
      await patchHeroProfile(heroId, profile);
      setBaseProfile(profile);
      toast.success("儲存成功！");
    } catch {
      toast.error("儲存失敗，請稍後再試。");
    } finally {
      setIsSaving(false);
    }
  }

  return {
    profile,
    remainingPoints,
    isDirty,
    isSaving,
    hasNegative,
    increment,
    decrement,
    save,
  };
}
