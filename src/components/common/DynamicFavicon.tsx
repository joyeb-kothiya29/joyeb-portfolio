'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DynamicFavicon() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until component is fully mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Do nothing until mounted and theme is resolved
    if (!mounted || !resolvedTheme) return;

    // Safety check - ensure we are in browser
    if (typeof document === 'undefined') return;
    if (!document.head) return;

    const isDark = resolvedTheme === 'dark';
    const faviconHref = isDark ? '/favicon-dark.png' : '/favicon-light.png';
    const themeColor = isDark ? '#FFD700' : '#3B82F6';

    try {
      // Safely remove existing favicon links
      const existingFavicons = document.querySelectorAll(
        "link[rel='icon'], link[rel='shortcut icon']"
      );
      existingFavicons.forEach((el) => {
        try {
          // Only remove if it actually has a parent node
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        } catch {
          // Silently ignore if removal fails
        }
      });

      // Inject new favicon link
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.sizes = '256x256';
      link.href = `${faviconHref}?v=3`;

      if (document.head) {
        document.head.appendChild(link);
      }

      // Update theme-color meta tag for mobile URL bar
      const existingMeta = document.querySelector("meta[name='theme-color']");
      if (existingMeta) {
        existingMeta.setAttribute('content', themeColor);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = themeColor;
        if (document.head) {
          document.head.appendChild(meta);
        }
      }
    } catch (error) {
      // Silently fail - favicon switching is non-critical
      console.warn('DynamicFavicon: could not update favicon', error);
    }
  }, [resolvedTheme, mounted]);

  // Render nothing - this is a head manipulation component
  return null;
}
