import HeroProfile from "@/components/HeroProfile";

interface HeroProfilePageProps {
  params: Promise<{ heroId: string }>;
}

export default async function HeroProfilePage({
  params,
}: HeroProfilePageProps) {
  const { heroId } = await params;
  return <HeroProfile heroId={heroId} />;
}
