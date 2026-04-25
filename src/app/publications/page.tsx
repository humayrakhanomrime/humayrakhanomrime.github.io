import { publications } from "@/data/publications";
import PageHeader from "@/components/PageHeader";
import PublicationCard from "@/components/PublicationCard";
import {
  SITE_URL,
  AUTHOR_FULL_NAME,
  AUTHOR_SCHOLAR_URL,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

const PAGE_DESCRIPTION = `Peer-reviewed publications by ${AUTHOR_FULL_NAME} in graph neural networks, attention-based fault diagnosis, hyperspectral image classification, generative AI, and remote sensing — spanning Nature Scientific Reports, IEEE Access, and IEEE ICCIT.`;

export const metadata = buildPageMetadata({
  title: "Publications",
  description: PAGE_DESCRIPTION,
  path: "/publications/",
});

export default function PublicationsPage() {
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/publications/#collection`,
    url: `${SITE_URL}/publications/`,
    name: `Publications | ${AUTHOR_FULL_NAME}`,
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
          name: "Publications",
          item: `${SITE_URL}/publications/`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: publications.length,
      itemListElement: publications.map((pub, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "ScholarlyArticle",
          "@id": `${SITE_URL}/publications/#${pub.id}`,
          headline: pub.title,
          name: pub.title,
          datePublished: String(pub.year),
          author: pub.authors.map((a) => ({ "@type": "Person", name: a })),
          isPartOf: {
            "@type": "PublicationVolume",
            name: pub.venue,
          },
          publisher: { "@id": `${SITE_URL}/#person` },
          inLanguage: "en",
          ...(pub.annotation ? { creativeWorkStatus: pub.annotation } : {}),
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
      <PageHeader title="Publications" />
      <p className="text-sm text-text-secondary mb-8">
        See{" "}
        <a
          href={AUTHOR_SCHOLAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2"
        >
          Google Scholar
        </a>{" "}
        for the full list.
      </p>
      <div>
        {publications.map((pub) => (
          <PublicationCard key={pub.id} pub={pub} />
        ))}
      </div>
    </div>
  );
}
