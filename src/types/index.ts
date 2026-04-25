export interface SocialLink {
  platform: "email" | "github" | "scholar" | "orcid" | "linkedin";
  url: string;
  label: string;
}

export interface Profile {
  name: string;
  subtitle: string;
  location: string;
  image: string;
  bio: string;
  summary: string;
  socials: SocialLink[];
}

export interface ResearchInterest {
  title: string;
  description: string;
}

export interface NewsItem {
  date: string;
  content: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  venueAbbr: string;
  venueColor: string;
  year: number;
  selected: boolean;
  annotation?: string;
  bibtex?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "work" | "research";
  description: string;
  contributions: string[];
  links?: {
    code?: string;
    paper?: string;
  };
  stars?: number;
  isOpenSource?: boolean;
}

export interface Education {
  institution: string;
  location: string;
  url: string;
  logo?: string;
  degree: string;
  startYear: number;
  endYear: number;
  score: string;
  courses: string[];
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  logo?: string;
  url?: string;
}

export interface SkillCategory {
  name: string;
  keywords: string[];
}

export interface Collaborator {
  name: string;
  institution: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: number;
  updated?: string;
  draft: boolean;
}

export interface BlogPost extends BlogPostMeta {
  html: string;
  raw: string;
}
