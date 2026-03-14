import { getPublishedBlogPosts } from '@/lib/blog';

import BlogScroll from './BlogScroll';
import SectionHeading from '../common/SectionHeading';

export default function Blog() {
  const posts = getPublishedBlogPosts();

  return (
    <>
      <div className="mt-16 md:mt-20 mb-0">
        <SectionHeading subHeading="Featured" heading="Blogs" />
      </div>
      <BlogScroll posts={posts} />
    </>
  );
}
