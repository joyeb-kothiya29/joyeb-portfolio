import { about } from './About';
import { heroConfig } from './Hero';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

// Base site configuration
export const siteConfig = {
  name: heroConfig.name,
  title: 'Sleek Portfolio',
  description: 'Sleek Portfolio Template by @joyebdev',
  url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ogImage: '/meta/opengraph-image.png',
  author: {
    name: about.name,
    twitter: '@joyebdev',
    github: 'joyeb-kothiya29',
    linkedin: 'joyeb-kothiya-197b783b6',
    email: 'joyebkofficial@gmail.com',
  },
  keywords: [
    'portfolio',
    'developer',
    'full-stack',
    'react',
    'nextjs',
    'typescript',
    'web development',
    heroConfig.name.toLowerCase(),
  ],
};

export const pageMetadata: Record<string, PageMeta> = {
  // Home page
  '/': {
    title: `${heroConfig.name} - ${heroConfig.title}`,
    description: `${about.description} Explore my projects, experience, and technical expertise.`,
    keywords: [
      'portfolio',
      'developer',
      'full-stack',
      'web development',
      'projects',
    ],
    ogImage: '/meta/hero.png',
    twitterCard: 'summary_large_image',
  },

  // Contact page
  '/contact': {
    title: 'Contact - Get in Touch',
    description:
      "Get in touch with me for collaborations, projects, or opportunities. I'd love to hear from you!",
    keywords: ['contact', 'hire', 'collaboration', 'freelance', 'developer'],
    ogImage: '/assets/logo.png',
    twitterCard: 'summary',
  },

  // Blog page
  '/blog': {
    title: 'Blog - Thoughts & Tutorials',
    description:
      'Read my thoughts, tutorials, and insights on engineering, programming, and web development.',
    keywords: [
      'blog',
      'tutorials',
      'programming',
      'web development',
      'technical writing',
    ],
    ogImage: '/meta/blogs.png',
    twitterCard: 'summary_large_image',
  },
};

// Helper function to get metadata for a specific page
export function getPageMetadata(pathname: string): PageMeta {
  return pageMetadata[pathname] || pageMetadata['/'];
}

// Helper function to generate complete metadata object for Next.js
export function generateMetadata(pathname: string) {
  const pageMeta = getPageMetadata(pathname);

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageMeta.title,
    description: pageMeta.description,
    icons: {
      icon: [
        {
          url: '/favicon-light.png?v=3',
          media: '(prefers-color-scheme: light)',
          type: 'image/png',
          sizes: '256x256',
        },
        {
          url: '/favicon-dark.png?v=3',
          media: '(prefers-color-scheme: dark)',
          type: 'image/png',
          sizes: '256x256',
        },
      ],
      shortcut: '/favicon-dark.png',
      apple: '/favicon-dark.png',
    },
    keywords: pageMeta.keywords?.join(', '),
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    openGraph: {
      type: 'website',
      url: `${siteConfig.url}${pathname}`,
      title: pageMeta.title,
      description: pageMeta.description,
      siteName: siteConfig.title,
      images: [
        {
          url: pageMeta.ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: pageMeta.title,
        },
      ],
    },
    twitter: {
      card: pageMeta.twitterCard || 'summary_large_image',
      title: pageMeta.title,
      description: pageMeta.description,
      creator: siteConfig.author.twitter,
      images: [pageMeta.ogImage || siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteConfig.url}${pathname}`,
    },
  };
}
