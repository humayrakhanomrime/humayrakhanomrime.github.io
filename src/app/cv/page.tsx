import Image from "next/image";
import {
  education,
  experience,
  skills,
  collaborators,
} from "@/data/cv";
import PageHeader from "@/components/PageHeader";
import CVSection from "@/components/CVSection";
import ExperienceEntry from "@/components/ExperienceEntry";
import SkillCategory from "@/components/SkillCategory";
import CollaboratorRow from "@/components/CollaboratorRow";
import {
  SITE_URL,
  AUTHOR_FULL_NAME,
  AUTHOR_JOB_TITLE,
  AUTHOR_KNOWS_ABOUT,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

const PAGE_DESCRIPTION = `Curriculum vitae of ${AUTHOR_FULL_NAME} — ${AUTHOR_JOB_TITLE}. Education, research experience at MTSU, InfinitiBit, ELITE Research Lab, Hanyang University, and Universiti Brunei Darussalam; technical skills across deep learning, graph neural networks, and MLOps.`;

export const metadata = buildPageMetadata({
  title: "CV",
  description: PAGE_DESCRIPTION,
  path: "/cv/",
  ogType: "profile",
});

export default function CVPage() {
  const allSkills = skills.flatMap((s) => s.keywords);

  const aboutPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/cv/#aboutpage`,
    url: `${SITE_URL}/cv/`,
    name: `CV | ${AUTHOR_FULL_NAME}`,
    description: PAGE_DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR_FULL_NAME,
      jobTitle: AUTHOR_JOB_TITLE,
      url: SITE_URL,
      knowsAbout: [...AUTHOR_KNOWS_ABOUT, ...allSkills],
      alumniOf: education.map((edu) => ({
        "@type": "CollegeOrUniversity",
        name: edu.institution,
        url: edu.url,
        address: edu.location,
      })),
      worksFor: experience
        .filter((exp) => exp.endDate === "Present")
        .map((exp) => ({
          "@type": "Organization",
          name: exp.company,
          address: exp.location,
        })),
      hasOccupation: experience.map((exp) => ({
        "@type": "Role",
        roleName: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.summary,
        memberOf: {
          "@type": "Organization",
          name: exp.company,
        },
      })),
      colleague: collaborators.map((c) => ({
        "@type": "Person",
        name: c.name,
        affiliation: { "@type": "Organization", name: c.institution },
      })),
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
        {
          "@type": "ListItem",
          position: 2,
          name: "CV",
          item: `${SITE_URL}/cv/`,
        },
      ],
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }}
      />
      <PageHeader title="Curriculum Vitae" />

      <CVSection title="Education">
        <div className="space-y-5">
          {education.map((edu) => (
            <div key={edu.institution} className="flex gap-3 sm:gap-4">
              {edu.logo && (
                <a
                  href={edu.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={edu.institution}
                  className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-surface-100 border border-surface-300 flex items-center justify-center overflow-hidden"
                >
                  <Image
                    src={edu.logo}
                    alt={`${edu.institution} logo`}
                    width={56}
                    height={56}
                    className="max-w-[80%] max-h-[80%] object-contain"
                    loading="lazy"
                  />
                </a>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-3 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary break-words min-w-0">
                    {edu.degree}
                  </h3>
                  <span className="text-xs text-text-muted font-mono shrink-0">
                    {edu.startYear} &ndash; {edu.endYear || "Present"}
                  </span>
                </div>
                <p className="text-xs text-accent mb-1 break-words">
                  <a
                    href={edu.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {edu.institution}
                  </a>{" "}
                  &middot; {edu.location}
                </p>
                {edu.score && (
                  <p className="text-xs text-text-secondary mb-2 break-words">
                    {edu.score}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {edu.courses.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] px-2 py-0.5 rounded bg-surface-200 text-text-secondary border border-surface-300 break-words"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CVSection>

      <CVSection title="Professional Experience">
        {experience.map((exp) => (
          <ExperienceEntry key={exp.company} exp={exp} />
        ))}
      </CVSection>

      <CVSection title="Technical Skills">
        {skills.map((s) => (
          <SkillCategory key={s.name} skill={s} />
        ))}
      </CVSection>

      <CVSection title="Collaborators">
        {collaborators.map((c) => (
          <CollaboratorRow key={c.name} collab={c} />
        ))}
      </CVSection>
    </div>
  );
}
