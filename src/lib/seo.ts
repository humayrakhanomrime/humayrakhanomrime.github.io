import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  SITE_LOCALE,
  OG_IMAGE_PATH,
  OG_IMAGE_ALT,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
} from "./constants";

type OgType =
  | "website"
  | "article"
  | "profile"
  | "book"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

export type ArticleSeoInput = {
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  ogType?: OgType;
  absoluteTitle?: boolean;
  article?: ArticleSeoInput;
};

export function buildPageMetadata({
  title,
  description,
  path,
  ogType = "website",
  absoluteTitle = false,
  article,
}: PageSeoInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  const baseOg = {
    locale: SITE_LOCALE,
    url,
    siteName: SITE_NAME,
    title: ogTitle,
    description,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
        type: "image/png",
      },
    ],
  };

  const openGraph: Metadata["openGraph"] =
    ogType === "article" && article
      ? {
          ...baseOg,
          type: "article",
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: article.authors,
          tags: article.tags,
        }
      : { ...baseOg, type: ogType };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [
        {
          url: OG_IMAGE_PATH,
          alt: OG_IMAGE_ALT,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      ],
    },
  };
}
