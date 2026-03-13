import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BlogFrontmatter } from '@/types/blog';
import rehypeHighlight from '@shikijs/rehype';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

import Calender from '../svgs/Calender';
import { BlogComponents } from './BlogComponents';

interface BlogContentProps {
  frontmatter: BlogFrontmatter;
  content: string;
}

export function BlogContent({ frontmatter, content }: BlogContentProps) {
  const {
    title,
    description,
    image,
    tags,
    tag,
    date,
    readTime,
    author,
    originalUrl,
  } = frontmatter;
  const displayTags = Array.isArray(tags) && tags.length > 0 ? tags : tag ? [tag] : [];

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mx-auto max-w-4xl">
      {/* Hero Section */}
      <header className="mb-8 space-y-6">
        {image && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {displayTags.map((tagName) => (
                <Badge key={tagName} variant="secondary">
                  {tagName}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-4xl leading-tight font-bold lg:text-5xl">
            {title}
          </h1>

          <p className="text-muted-foreground text-xl">{description}</p>

          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <Calender className="size-6" />
            <time dateTime={date}>{formattedDate}</time>
            {readTime && <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />}
            {readTime && <span>{readTime}</span>}
            {author && <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />}
            {author && <span>{author}</span>}
          </div>
        </div>

        <Separator />
      </header>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote
          source={content}
          components={BlogComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypeHighlight,
                  {
                    theme: 'github-dark',
                  },
                ],
              ],
            },
          }}
        />
      </div>

      {originalUrl && (
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 mt-10 border-t border-border pt-6 w-full"
        >
          Originally published on The Curious Creator
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      )}
    </article>
  );
}
