import type { SocialLink } from "@/types";

function Icon({ platform, size }: { platform: SocialLink["platform"]; size: number }) {
  switch (platform) {
    case "email":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "github":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case "scholar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
        </svg>
      );
    case "orcid":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-3.919-3.722h-2.4z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
  }
}

const sizeMap = { sm: 16, md: 22, lg: 26 };

const platformLabel: Record<SocialLink["platform"], string> = {
  email: "Email",
  github: "GitHub profile",
  scholar: "Google Scholar profile",
  orcid: "ORCID profile",
  linkedin: "LinkedIn profile",
};

export default function SocialLinks({
  socials,
  size = "md",
  className = "",
}: {
  socials: SocialLink[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const px = sizeMap[size];
  return (
    <ul
      className={`flex items-center list-none p-0 m-0 ${
        size === "sm" ? "gap-3" : "gap-4 sm:gap-5"
      } ${className}`}
    >
      {socials.map((s) => {
        const isExternal = s.platform !== "email";
        const identityPlatforms: SocialLink["platform"][] = [
          "github",
          "scholar",
          "orcid",
          "linkedin",
        ];
        const relParts = [
          isExternal ? "noopener" : null,
          isExternal ? "noreferrer" : null,
          identityPlatforms.includes(s.platform) ? "me" : null,
        ].filter(Boolean);
        return (
          <li key={s.platform}>
            <a
              href={s.url}
              target={isExternal ? "_blank" : undefined}
              rel={relParts.length ? relParts.join(" ") : undefined}
              aria-label={`${platformLabel[s.platform]}: ${s.label}`}
              title={platformLabel[s.platform]}
              className="text-text-primary hover:text-accent transition-colors inline-flex"
            >
              <Icon platform={s.platform} size={px} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
