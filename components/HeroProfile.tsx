"use client";

import { useEffect, useState } from "react";
import { fetchHeroProfile } from "@/lib/api";
import type { HeroProfile as HeroProfileType } from "@/lib/types";
import StatControl from "./StatControl";

interface HeroProfileProps {
  heroId: string;
}

export default function HeroProfile({ heroId }: HeroProfileProps) {
  // Store result alongside which heroId it belongs to.
  // Derived loading/error/profile avoids synchronous setState in effects.
  const [fetchResult, setFetchResult] = useState<{
    heroId: string;
    profile: HeroProfileType | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    fetchHeroProfile(heroId)
      .then((profile) => setFetchResult({ heroId, profile, error: null }))
      .catch(() =>
        setFetchResult({ heroId, profile: null, error: "無法載入英雄資料" })
      );
  }, [heroId]);

  const isStale = fetchResult?.heroId !== heroId;
  const loading = isStale;
  const profile = isStale ? null : (fetchResult?.profile ?? null);
  const error = isStale ? null : (fetchResult?.error ?? null);

  if (loading) return <HeroProfileSkeleton />;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!profile) return null;

  const stats = [
    { label: "STR", key: "str" as const },
    { label: "INT", key: "int" as const },
    { label: "AGI", key: "agi" as const },
    { label: "LUK", key: "luk" as const },
  ];

  // 剩餘點數在 UI 階段固定為 0（無互動邏輯）
  const remainingPoints = 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-10 py-6">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {/* 能力值 */}
        <div className="flex flex-col items-center gap-4 sm:items-start">
          {stats.map(({ label, key }) => (
            <StatControl
              key={key}
              label={label}
              value={profile[key]}
              onIncrement={() => {}}
              onDecrement={() => {}}
              canIncrement={false}
              canDecrement={false}
            />
          ))}
        </div>

        {/* 剩餘點數 + 儲存：小螢幕置中排在下方，大螢幕靠右底部對齊 LUK */}
        <div className="flex flex-col items-center gap-3 mt-6 sm:items-end sm:justify-end sm:mt-0 sm:ml-auto">
          <p className="text-sm text-gray-600">
            剩餘點數：
            <span className="font-semibold text-gray-800">
              {remainingPoints}
            </span>
          </p>
          <button
            disabled
            className="px-6 py-2 rounded border border-gray-300 bg-gray-100 text-gray-500 text-sm font-medium cursor-not-allowed opacity-60"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroProfileSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-10 py-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="w-8 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3 mt-6 sm:items-end sm:justify-end sm:mt-0 sm:ml-auto">
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-9 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
