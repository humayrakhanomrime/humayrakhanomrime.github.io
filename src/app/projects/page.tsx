import { projects } from "@/data/projects";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { SITE_URL, AUTHOR_FULL_NAME } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

const PAGE_DESCRIPTION = `Open-source software and research projects by ${AUTHOR_FULL_NAME}, including the GraphBit agentic AI framework memory architecture, dual graph attention networks for photovoltaic fault diagnosis, and attention-aware hyperspectral image classification.`;

export const metadata = buildPageMetadata({
  title: "Projects",
  description: PAGE_DESCRIPTION,
  path: "/projects/",
});

export default function ProjectsPage() {
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/projects/#collection`,
    url: `${SITE_URL}/projects/`,
    name: `Projects | ${AUTHOR_FULL_NAME}`,
    description: PAGE_DESCRIPTION,
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
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
          name: "Projects",
          item: `${SITE_URL}/projects/`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type":
            project.isOpenSource || project.links?.code
              ? "SoftwareSourceCode"
              : "CreativeWork",
          "@id": `${SITE_URL}/projects/#${project.id}`,
          name: project.title,
          headline: project.title,
          description: project.description,
          author: { "@id": `${SITE_URL}/#person` },
          inLanguage: "en",
          ...(project.links?.code ? { codeRepository: project.links.code } : {}),
          ...(project.links?.paper ? { sameAs: project.links.paper } : {}),
          ...(project.subtitle ? { alternativeHeadline: project.subtitle } : {}),
        },
      })),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <PageHeader title="Projects" />
      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
