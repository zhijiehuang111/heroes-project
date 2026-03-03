import { Suspense } from "react";
import HeroList from "@/components/HeroList";

export default function HeroesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4 bg-gray-100">
      <Suspense fallback={<HeroListSkeleton />}>
        <HeroList />
      </Suspense>
      <div className="w-full max-w-3xl mt-6">{children}</div>
    </div>
  );
}

function HeroListSkeleton() {
  return (
    <div className="w-full max-w-3xl border border-gray-200 rounded-lg bg-white p-4 animate-pulse">
      <div className="flex flex-wrap justify-around gap-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center w-36 rounded-lg overflow-hidden border-2 border-gray-200 bg-white"
          >
            <div className="w-full aspect-square bg-gray-200" />
            <div className="w-20 h-4 bg-gray-200 rounded my-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
