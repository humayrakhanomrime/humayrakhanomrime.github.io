import Image from "next/image";
import type { Profile } from "@/types";

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col items-center text-center w-full md:w-auto">
      <div className="relative w-full sm:w-48 md:w-52 lg:w-56 aspect-square">
        <Image
          src={profile.image}
          alt={`Portrait of ${profile.name}, ${profile.subtitle}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 192px, (max-width: 1024px) 208px, 224px"
          className="rounded object-cover"
          priority
          fetchPriority="high"
        />
      </div>
      <p className="mt-3 text-text-muted text-xs">{profile.location}</p>
    </div>
  );
}
