import Container from '@/components/common/Container';
import About from '@/components/landing/About';
import Blog from '@/components/landing/Blog';
import Github from '@/components/landing/Github';
import Hero from '@/components/landing/Hero';
import MasonryProjects from '@/components/landing/MasonryProjects';
import React from 'react';

export default function page() {
  return (
    <Container className="min-h-screen py-16">
      <Hero />
      <MasonryProjects />
      <About />
      <Github />
      <Blog />
    </Container>
  );
}
