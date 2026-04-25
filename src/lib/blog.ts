import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { BlogPost, BlogPostMeta } from "@/types";
import { renderMarkdown } from "./markdown";

const CONTENT_DIR = join(process.cwd(), "src", "content", "blog");
const WORDS_PER_MINUTE = 200;

type RawPost = {
  slug: string;
  meta: BlogPostMeta;
  raw: string;
};

let rawCache: Map<string, RawPost> | null = null;
const htmlCache = new Map<string, string>();

function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}

function countWords(source: string): number {
  const matches = source.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

function computeReadingTime(source: string): number {
  return Math.max(1, Math.ceil(countWords(source) / WORDS_PER_MINUTE));
}

function requireString(
  value: unknown,
  field: string,
  file: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `Invalid frontmatter in ${file}: "${field}" is required and must be a non-empty string.`,
    );
  }
  return value;
}

function parseTags(value: unknown, file: string): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error(
      `Invalid frontmatter in ${file}: "tags" must be an array of strings.`,
    );
  }
  return value.map((t, i) => {
    if (typeof t !== "string") {
      throw new Error(
        `Invalid frontmatter in ${file}: tags[${i}] must be a string.`,
      );
    }
    return t;
  });
}

function parseRawPost(slug: string, file: string, contents: string): RawPost {
  const { data, content } = matter(contents);

  const title = requireString(data.title, "title", file);
  const date = requireString(data.date, "date", file);
  const description = requireString(data.description, "description", file);
  const tags = parseTags(data.tags, file);
  const draft = data.draft === true;
  const updated =
    data.updated === undefined || data.updated === null
      ? undefined
      : requireString(data.updated, "updated", file);

  if (Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())) {
    throw new Error(
      `Invalid frontmatter in ${file}: "date" must be an ISO date (YYYY-MM-DD).`,
    );
  }

  const readingTime = computeReadingTime(content);

  return {
    slug,
    raw: content,
    meta: {
      slug,
      title,
      date,
      description,
      tags,
      readingTime,
      updated,
      draft,
    },
  };
}

function loadRawCache(): Map<string, RawPost> {
  if (rawCache) return rawCache;
  const map = new Map<string, RawPost>();
  const entries = readdirSync(CONTENT_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".md")) continue;
    if (entry.name.startsWith("_")) continue;
    const slug = entry.name.slice(0, -3);
    const file = join(CONTENT_DIR, entry.name);
    const contents = readFileSync(file, "utf8");
    map.set(slug, parseRawPost(slug, file, contents));
  }
  rawCache = map;
  return map;
}

function isVisible(post: RawPost): boolean {
  if (!post.meta.draft) return true;
  return !isProd();
}

export function getAllPostSlugs(): string[] {
  const cache = loadRawCache();
  return [...cache.values()].filter(isVisible).map((p) => p.slug);
}

export function getAllPosts(): BlogPostMeta[] {
  const cache = loadRawCache();
  return [...cache.values()]
    .filter(isVisible)
    .map((p) => p.meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const cache = loadRawCache();
  const post = cache.get(slug);
  if (!post || !isVisible(post)) return null;

  let html = htmlCache.get(slug);
  if (html === undefined) {
    html = await renderMarkdown(post.raw);
    htmlCache.set(slug, html);
  }

  return { ...post.meta, html, raw: post.raw };
}
