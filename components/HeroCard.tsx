"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Hero } from "@/lib/types";

interface HeroCardProps {
  hero: Hero;
}

export default function HeroCard({ hero }: HeroCardProps) {
  const params = useParams();
  const isSelected = params?.heroId === hero.id;

  return (
    <Link href={`/heroes/${hero.id}`}>
      <div
        className={`
          flex flex-col items-center w-36 rounded-lg overflow-hidden cursor-pointer
          border-2 transition-all duration-200
          ${
            isSelected
              ? "border-yellow-400 shadow-md shadow-yellow-200"
              : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
          }
          bg-white
        `}
      >
        <div className="relative w-full aspect-square">
          <Image
            src={hero.image}
            alt={hero.name}
            fill
            className="object-cover"
            sizes="144px"
          />
        </div>
        <div className="w-full px-2 py-2 text-center">
          <span
            className={`text-sm font-semibold ${
              isSelected ? "text-yellow-600" : "text-gray-800"
            }`}
          >
            {hero.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
