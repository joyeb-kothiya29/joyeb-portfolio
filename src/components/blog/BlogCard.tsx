import { BlogPostPreview } from '@/types/blog';
import { Link } from 'next-view-transitions';

interface BlogCardProps {
  post: BlogPostPreview;
  index: number;
}

type BlogCardMeta = BlogPostPreview['frontmatter'] & {
  tag?: string;
  category?: string;
  readTime?: string;
  readingTime?: string;
  publishedAt?: string;
  excerpt?: string;
};

export function BlogCard({ post, index }: BlogCardProps) {
  const meta = post.frontmatter as BlogCardMeta;
  const publishedDate = meta.date || meta.publishedAt;
  const readingTime = meta.readTime || meta.readingTime;
  const label = meta.tag || meta.category || meta.tags?.[0];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 hover:border-border/60 transition-all duration-200 min-h-[200px]"
    >
      <div className="flex flex-col gap-3">
        <span className="text-5xl font-bold text-muted-foreground/20 leading-none select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        {label && (
          <span className="self-start text-xs px-2.5 py-0.5 rounded-full border border-border text-muted-foreground bg-muted/50">
            {label}
          </span>
        )}

        <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-foreground/80 transition-colors duration-150 line-clamp-2">
          {meta.title}
        </h3>

        {(meta.description || meta.excerpt) && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {meta.description || meta.excerpt}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
          {publishedDate && (
            <span>
              {new Date(publishedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
          {publishedDate && readingTime && (
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          )}
          {readingTime && <span>{readingTime}</span>}
        </div>

        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground flex items-center gap-1 transition-colors duration-150">
          Read
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-px group-hover:-translate-y-px transition-transform duration-150"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
