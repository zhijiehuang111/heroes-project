"use client";

import type { HeroProfile as HeroProfileType } from "@/lib/types";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import StatControl from "./StatControl";

interface HeroProfileProps {
  heroId: string;
  initialProfile: HeroProfileType;
}

export default function HeroProfile({
  heroId,
  initialProfile,
}: HeroProfileProps) {
  const {
    profile,
    remainingPoints,
    isDirty,
    isSaving,
    increment,
    decrement,
    save,
  } = useHeroProfile(heroId, initialProfile);

  const stats = [
    { label: "STR", key: "str" as const },
    { label: "INT", key: "int" as const },
    { label: "AGI", key: "agi" as const },
    { label: "LUK", key: "luk" as const },
  ];

  const canSave = isDirty && remainingPoints === 0 && !isSaving;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-10 py-6">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          {stats.map(({ label, key }) => (
            <StatControl
              key={key}
              label={label}
              value={profile[key]}
              onIncrement={() => increment(key)}
              onDecrement={() => decrement(key)}
              canIncrement={remainingPoints > 0}
              canDecrement={profile[key] > 0}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 mt-6 sm:items-start sm:justify-end sm:mt-0 sm:ml-auto">
          <p className="text-sm text-gray-600">
            剩餘點數：
            <span className="font-semibold text-gray-800">
              {remainingPoints}
            </span>
          </p>
          <button
            disabled={!canSave}
            onClick={save}
            className={`px-6 py-2 rounded border text-sm font-medium transition-colors ${
              canSave
                ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-60"
            }`}
          >
            <span className="inline-block w-12 text-center">
              {isSaving ? "儲存中" : "儲存"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
