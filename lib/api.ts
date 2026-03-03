import type { Hero, HeroProfile, PatchHeroProfilePayload } from "./types";

const BASE_URL = "https://hahow-recruit.herokuapp.com";

export async function fetchHeroes(): Promise<Hero[]> {
  const res = await fetch(`${BASE_URL}/heroes`, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch heroes");
  return res.json();
}

export async function fetchHeroProfile(heroId: string): Promise<HeroProfile> {
  const res = await fetch(`${BASE_URL}/heroes/${heroId}/profile`, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Failed to fetch profile for hero ${heroId}`);
  return res.json();
}

export async function patchHeroProfile(
  heroId: string,
  payload: PatchHeroProfilePayload,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/heroes/${heroId}/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to patch profile for hero ${heroId}`);
}
