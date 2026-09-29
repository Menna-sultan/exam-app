import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/lib/utils/tailwind-cn";
import { IDiploma } from "@/shared/types/diploma";

export function DiplomaCard({ diploma }: { diploma: IDiploma }) {
  return (
    <Link
      href={`/diplomas/${diploma.id}`}
      className={cn(
  "group relative flex w-full h-112 flex-col justify-end overflow-hidden border border-[#dfeaf7] bg-white shadow-sm transition-shadow hover:shadow-md",
  !diploma.image && "bg-gradient-to-br from-[#edf6ff] to-[#dfeeff]"
)}
    >
      {diploma.image && (
        <Image
          src={diploma.image}
          alt={diploma.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 90vw, 400px"
        />
      )}
<div
  className="
    relative mx-3 mb-3 h-27 space-y-1
    overflow-hidden
    bg-[#1b7af4]/90 p-4 font-mono
    transition-all duration-300
    group-hover:h-70
  "
>
  <p className="text-base font-bold text-white">
    {diploma.title}
  </p>

  <p
    className="
      line-clamp-2 text-xs leading-relaxed text-white/85
      transition-all duration-300
      group-hover:line-clamp-6
    "
  >
    {diploma.description}
  </p>
</div>
    </Link>
  );
}