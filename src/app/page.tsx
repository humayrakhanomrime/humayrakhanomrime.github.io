import Link from "next/link";
import { profile, researchInterests } from "@/data/profile";
import { news } from "@/data/news";
import { publications } from "@/data/publications";
import ProfileCard from "@/components/ProfileCard";
import SectionHeading from "@/components/SectionHeading";
import ResearchInterests from "@/components/ResearchInterests";
import NewsTimeline from "@/components/NewsTimeline";
import PublicationCard from "@/components/PublicationCard";
import {
  SITE_NAME,
  SITE_URL,
  AUTHOR_FULL_NAME,
  AUTHOR_JOB_TITLE,
  AUTHOR_AFFILIATION,
  SITE_DESCRIPTION,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

const HOME_DESCRIPTION = `${AUTHOR_FULL_NAME} is a ${AUTHOR_JOB_TITLE} at ${AUTHOR_AFFILIATION}. Research interests include graph neural networks, attention mechanisms, intelligent fault diagnosis, and hyperspectral image classification, with peer-reviewed publications in Nature Scientific Reports, IEEE Access, and ICCIT.`;

export const metadata = buildPageMetadata({
  title: `${SITE_NAME} — ${AUTHOR_JOB_TITLE}`,
  description: HOME_DESCRIPTION,
  path: "/",
  ogType: "profile",
  absoluteTitle: true,
});

export default function Home() {
  const selectedPubs = publications.filter((p) => p.selected);

  const profilePageLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: `${SITE_URL}/`,
    name: `${SITE_NAME} — ${AUTHOR_JOB_TITLE}`,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    mainEntity: { "@id": `${SITE_URL}/#person` },
    about: { "@id": `${SITE_URL}/#person` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/prof_pic.jpeg`,
      caption: `Profile photograph of ${AUTHOR_FULL_NAME}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
      ],
    },
  };

  return (
    <div className="space-y-10 sm:space-y-12 mt-4 sm:mt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageLd) }}
      />
      <header>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-text-primary leading-tight break-words">
          <span className="font-bold">Humayra Khanom</span> Rime
        </h1>
        <p className="text-text-secondary text-sm sm:text-base mt-1">
          {profile.subtitle}
        </p>
      </header>

      <section
        aria-label="About"
        className="flex flex-col-reverse md:flex-row gap-6 sm:gap-8 items-start"
      >
        <div className="flex-1 min-w-0">
          <div
            className="text-sm sm:text-[15px] text-text-secondary leading-relaxed text-justify hyphens-auto [&_a]:text-accent [&_a]:hover:underline break-words"
            dangerouslySetInnerHTML={{ __html: profile.bio }}
          />
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <ProfileCard profile={profile} />
        </div>
      </section>

      <section aria-labelledby="research-interests-heading">
        <SectionHeading id="research-interests-heading" title="Research Interests" />
        <ResearchInterests interests={researchInterests} />
      </section>

      <section aria-labelledby="news-heading">
        <SectionHeading id="news-heading" title="News" />
        <NewsTimeline items={news.slice(0, 6)} />
      </section>

      <section aria-labelledby="selected-publications-heading">
        <SectionHeading
          id="selected-publications-heading"
          title="Selected Publications"
        />
        <div>
          {selectedPubs.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} />
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/publications"
            className="text-sm text-accent hover:underline inline-flex items-center"
            aria-label="View all publications"
          >
            View all publications &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
