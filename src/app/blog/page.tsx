import { getAllPosts } from "@/lib/blog";
import PageHeader from "@/components/PageHeader";
import BlogPostCard from "@/components/BlogPostCard";
import { SITE_URL, AUTHOR_FULL_NAME } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

const PAGE_DESCRIPTION = `Writing by ${AUTHOR_FULL_NAME} — research notes, paper summaries, and technical essays on graph neural networks, attention mechanisms, and intelligent fault diagnosis.`;

export const metadata = buildPageMetadata({
  title: "Blog",
  description: PAGE_DESCRIPTION,
  path: "/blog/",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog/#blog`,
    url: `${SITE_URL}/blog/`,
    name: `Blog | ${AUTHOR_FULL_NAME}`,
    description: PAGE_DESCRIPTION,
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
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
          name: "Blog",
          item: `${SITE_URL}/blog/`,
        },
      ],
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}/blog/${post.slug}/#post`,
      mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      author: { "@id": `${SITE_URL}/#person` },
      keywords: post.tags.join(", "),
      inLanguage: "en",
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <PageHeader title="Blog" subtitle="Notes, essays, and research writing." />
      {posts.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No posts yet — check back soon.
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
