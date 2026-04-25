import { unified, type Processor } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";

let processor: Processor | null = null;

function buildProcessor(): Processor {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaHidden: "true",
        tabIndex: -1,
      },
      content: { type: "text", value: "#" },
    })
    .use(rehypePrettyCode, {
      theme: { light: "github-light", dark: "github-dark-dimmed" },
      keepBackground: false,
      defaultLang: "plaintext",
    })
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
      protocols: ["http", "https"],
    })
    .use(rehypeStringify) as unknown as Processor;
}

export async function renderMarkdown(source: string): Promise<string> {
  if (!processor) processor = buildProcessor();
  const file = await processor.process(source);
  return String(file);
}
