import HeroProfile from "@/components/HeroProfile";
import { fetchHeroProfile } from "@/lib/api";

interface HeroProfilePageProps {
  params: Promise<{ heroId: string }>;
}

export default async function HeroProfilePage({
  params,
}: HeroProfilePageProps) {
  const { heroId } = await params;
  const initialProfile = await fetchHeroProfile(heroId);
  return <HeroProfile heroId={heroId} initialProfile={initialProfile} />;
}
