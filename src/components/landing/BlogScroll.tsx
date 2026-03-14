'use client';

import type { BlogPostPreview } from '@/types/blog';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'next-view-transitions';
import { useRef } from 'react';

const CARD_WIDTH = 320;
const CARD_GAP = 24;

export default function BlogScroll({ posts }: { posts: BlogPostPreview[] }) {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -((CARD_WIDTH + CARD_GAP) * Math.max(posts.length - 1, 0))],
  );

  return (
    <section
      ref={containerRef}
      id="blogs"
      style={{ height: `${100 + posts.length * 40}vh` }}
      className="relative mt-2"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-background to-transparent" />
        <motion.div style={{ x }} className="flex flex-row gap-6">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BlogCard({ post, index }: { post: BlogPostPreview; index: number }) {
  const num = String(index + 1).padStart(2, '0');
  const tag = post.frontmatter.tag ?? post.frontmatter.tags?.[0] ?? 'Blog';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block h-[260px] w-[320px] shrink-0"
    >
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-200 hover:border-border/60">
        <span className="pointer-events-none absolute right-4 top-2 select-none text-7xl font-black leading-none text-muted-foreground/10">
          {num}
        </span>
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {tag}
          </span>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
            {post.frontmatter.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.frontmatter.description}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{post.frontmatter.date}</span>
            {post.frontmatter.readTime && (
              <>
                <span>·</span>
                <span>{post.frontmatter.readTime}</span>
              </>
            )}
          </div>
          <span className="shrink-0 font-medium text-foreground/70">Read →</span>
        </div>
      </div>
    </Link>
  );
}
