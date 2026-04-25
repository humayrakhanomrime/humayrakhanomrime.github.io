import Image from "next/image";
import type { SkillCategory as SkillCategoryType } from "@/types";
import { skillIcons } from "@/lib/skill-icons";

export default function SkillCategory({
  skill,
}: {
  skill: SkillCategoryType;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-3 last:mb-0">
      <span className="text-xs font-medium text-text-primary sm:w-32 lg:w-36 shrink-0">
        {skill.name}
      </span>
      <div className="flex flex-wrap gap-1.5 min-w-0">
        {skill.keywords.map((k) => {
          const icon = skillIcons[k];
          const src = icon
            ? icon.startsWith("/") || icon.startsWith("http")
              ? icon
              : `https://cdn.simpleicons.org/${icon}`
            : null;
          const isLocal = !!icon && icon.startsWith("/");
          return (
            <span
              key={k}
              className="text-[11px] px-2 py-0.5 rounded-sm bg-surface-200 text-text-secondary border border-surface-300 inline-flex items-center gap-1.5 break-words"
            >
              {src && (
                <Image
                  src={src}
                  alt=""
                  aria-hidden
                  width={isLocal ? 28 : 12}
                  height={12}
                  unoptimized
                  className={`${isLocal ? "h-3 w-auto max-w-[28px]" : "w-3 h-3"} shrink-0`}
                  loading="lazy"
                />
              )}
              {k}
            </span>
          );
        })}
      </div>
    </div>
  );
}
