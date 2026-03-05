"use client";

import { useRouter } from "next/navigation";

interface ErrorProps {
  reset: () => void;
}

export default function HeroProfileError({ reset }: ErrorProps) {
  const router = useRouter();

  function handleRetry() {
    router.refresh();
    reset();
  }

  return (
    <div className="w-full max-w-3xl border border-gray-200 rounded-lg bg-white p-6">
      <p className="text-center text-red-500">無法載入英雄能力值</p>
      <div className="mt-4 text-center">
        <button
          onClick={handleRetry}
          className="px-4 py-2 rounded border border-blue-500 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 cursor-pointer"
        >
          重試
        </button>
      </div>
    </div>
  );
}
