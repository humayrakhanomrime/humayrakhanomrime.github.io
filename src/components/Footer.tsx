import { profile } from "@/data/profile";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="footer-section border-t border-surface-300 mt-12 sm:mt-16"
    >
      <div className="max-w-[930px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center flex flex-col items-center">
        <SocialLinks socials={profile.socials} size="lg" />
        <p className="mt-4 text-text-muted text-lg break-words">
          &copy; {new Date().getFullYear()}{" "}
          <span itemProp="name">{profile.name}</span>.
        </p>
      </div>
    </footer>
  );
}
