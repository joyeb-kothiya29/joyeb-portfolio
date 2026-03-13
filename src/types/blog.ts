export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  image?: string;
  tags?: string[];
  tag?: string;
  readTime?: string;
  slug?: string;
  published?: boolean;
  isPublished?: boolean;
  author?: string;
  originalUrl?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

export interface BlogPostPreview {
  slug: string;
  frontmatter: BlogFrontmatter;
}
