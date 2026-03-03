import { fetchHeroes } from "@/lib/api";
import HeroCard from "./HeroCard";

export default async function HeroList() {
  let heroes;
  try {
    heroes = await fetchHeroes();
  } catch {
    return (
      <div className="w-full max-w-3xl border border-gray-200 rounded-lg bg-white p-6">
        <p className="text-center text-red-500">無法載入英雄列表</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl border border-gray-200 rounded-lg bg-white p-4">
      <div className="flex flex-wrap justify-around gap-y-4">
        {heroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} />
        ))}
      </div>
    </div>
  );
}
