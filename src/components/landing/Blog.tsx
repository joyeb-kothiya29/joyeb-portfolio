import { getPublishedBlogPosts } from '@/lib/blog';
import { Link } from 'next-view-transitions';

import { BlogCard } from '../blog/BlogCard';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Button } from '../ui/button';

export default function Blog() {
  const posts = getPublishedBlogPosts();

  return (
    <section id="blogs">
      <Container className="mt-20">
        <SectionHeading subHeading="Featured" heading="Blogs" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <BlogCard
              key={post.slug}
              post={post}
              index={index}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline">
            <Link href="/#blogs">Show all blogs</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
