import type { Hero, HeroProfile, PatchHeroProfilePayload } from "./types";

export async function fetchHeroes(): Promise<Hero[]> {
  throw new Error("Not implemented");
}

export async function fetchHeroProfile(heroId: string): Promise<HeroProfile> {
  throw new Error("Not implemented");
}

export async function patchHeroProfile(
  heroId: string,
  profile: PatchHeroProfilePayload
): Promise<void> {
  throw new Error("Not implemented");
}
