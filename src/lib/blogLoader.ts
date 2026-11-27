import fs from "node:fs";
import path from "node:path";
import { BLOG_ARTICLES, type BlogArticle } from "@/data/siteData";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function sanitizeImagePath(raw: unknown): string {
  if (typeof raw !== "string") return "/images/grains.jpg";
  const trimmed = raw.trim();
  if (trimmed.startsWith("/images/")) {
    return trimmed;
  }
  return "/images/grains.jpg";
}

function parseBlogFile(filePath: string): BlogArticle | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    const slug = path.basename(filePath, ".json");

    const title = typeof data.title === "string" ? data.title.trim() : "";
    const excerpt = typeof data.excerpt === "string" ? data.excerpt.trim() : "";
    const category =
      typeof data.category === "string" && data.category.trim()
        ? data.category.trim().toUpperCase()
        : "INGREDIENT GUIDE";
    const readTime =
      typeof data.readTime === "string" && data.readTime.trim()
        ? data.readTime.trim()
        : "2 min read";
    const date =
      typeof data.date === "string" && data.date.trim()
        ? data.date.trim()
        : "2026";
    const coverImage = sanitizeImagePath(data.coverImage);

    let content: string[] = [];
    if (Array.isArray(data.content)) {
      content = data.content
        .map((entry) => {
          if (typeof entry === "string") return entry.trim();
          if (
            entry &&
            typeof entry === "object" &&
            typeof (entry as { paragraph?: unknown }).paragraph === "string"
          ) {
            return (entry as { paragraph: string }).paragraph.trim();
          }
          return "";
        })
        .filter(Boolean);
    }

    if (!title || !excerpt || content.length === 0) {
      return null;
    }

    return {
      slug,
      title,
      category,
      readTime,
      date,
      coverImage,
      excerpt,
      content,
    };
  } catch {
    return null;
  }
}

export function getAllBlogArticles(): BlogArticle[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    return BLOG_ARTICLES;
  }

  const files = fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((f) => f.endsWith(".json"));

  const loaded = files
    .map((f) => parseBlogFile(path.join(BLOG_CONTENT_DIR, f)))
    .filter((a): a is BlogArticle => a !== null);

  if (loaded.length === 0) {
    return BLOG_ARTICLES;
  }

  // Sort by parsed date descending (fallback to slug)
  return loaded.sort((a, b) => {
    const timeA = Date.parse(a.date);
    const timeB = Date.parse(b.date);
    if (!Number.isNaN(timeA) && !Number.isNaN(timeB) && timeA !== timeB) {
      return timeB - timeA;
    }
    return a.slug.localeCompare(b.slug);
  });
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return getAllBlogArticles().find((a) => a.slug === slug);
}
