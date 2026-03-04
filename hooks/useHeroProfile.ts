"use client";

import { useState } from "react";
import { patchHeroProfile } from "@/lib/api";
import type { HeroProfile } from "@/lib/types";

type StatKey = keyof HeroProfile;

export function useHeroProfile(heroId: string, initialProfile: HeroProfile) {
  const [profile, setProfile] = useState<HeroProfile>(initialProfile);

  // 儲存初始值，用來判斷 isDirty。儲存成功後更新
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

  function increment(stat: StatKey) {
    if (remainingPoints <= 0) return;
    setProfile((prev) => ({ ...prev, [stat]: prev[stat] + 1 }));
  }

  function decrement(stat: StatKey) {
    if (profile[stat] <= 0) return;
    setProfile((prev) => ({ ...prev, [stat]: prev[stat] - 1 }));
  }

  // 儲存成功後更新 baseProfile
  async function save() {
    if (remainingPoints !== 0 || !isDirty || isSaving) return;
    setIsSaving(true);
    try {
      await patchHeroProfile(heroId, profile);
      setBaseProfile(profile);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    profile,
    remainingPoints,
    isDirty,
    isSaving,
    increment,
    decrement,
    save,
  };
}
