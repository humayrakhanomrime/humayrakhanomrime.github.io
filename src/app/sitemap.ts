import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: "yearly" | "monthly" | "weekly" | "daily";
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "monthly" },
    { path: "/publications/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blog/", priority: 0.85, changeFrequency: "weekly" },
    { path: "/projects/", priority: 0.8, changeFrequency: "monthly" },
    { path: "/cv/", priority: 0.7, changeFrequency: "monthly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: new Date(`${post.updated ?? post.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
