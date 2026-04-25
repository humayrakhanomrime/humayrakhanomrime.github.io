import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import PageHeader from "@/components/PageHeader";
import BlogPostMeta from "@/components/BlogPostMeta";
import {
  SITE_URL,
  AUTHOR_FULL_NAME,
  OG_IMAGE_PATH,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}/`,
    ogType: "article",
    article: {
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [AUTHOR_FULL_NAME],
      tags: post.tags,
    },
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const postLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}/#post`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
    url: `${SITE_URL}/blog/${post.slug}/`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
    keywords: post.tags.join(", "),
    wordCount: Math.round(post.readingTime * 200),
    image: `${SITE_URL}${OG_IMAGE_PATH}`,
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
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `${SITE_URL}/blog/${post.slug}/`,
        },
      ],
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postLd) }}
      />
      <nav aria-label="Breadcrumb" className="mt-4 sm:mt-6 text-xs">
        <Link
          href="/blog"
          className="text-accent hover:underline inline-flex items-center"
        >
          &larr; All posts
        </Link>
      </nav>
      <PageHeader title={post.title} />
      <BlogPostMeta
        date={post.date}
        readingTime={post.readingTime}
        tags={post.tags}
      />
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  );
}
