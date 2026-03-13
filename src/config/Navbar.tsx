export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  logo: {
    src: '/assets/logo.png',
    alt: 'logo',
    width: 100,
    height: 100,
  },
  navItems: [
    {
      label: 'About',
      href: '/#about',
    },
    {
      label: 'Blogs',
      href: '/#blogs',
    },
    {
      label: 'Contact',
      href: '/contact',
    },
  ] as NavItem[],
};
