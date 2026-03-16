import TypeScript from '@/components/technologies/TypeScript';
import CSS from '@/components/technologies/CSS';
import Vite from '@/components/technologies/Vite';
import { getGithubRepoUrl } from '@/config/Github';
import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    title: 'Harikrushna Agro Chemicals',
    description:
      'A professional business website for an agro chemicals company showcasing their products and services.',
    image: '/project/harikrushna-agro.png',
    link: 'https://www.harikrushnaagrochemicals.in/',
    live: 'https://www.harikrushnaagrochemicals.in/',
    github: getGithubRepoUrl('harikrushn-agro-hub'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
  {
    title: 'Zack Salon',
    description:
      'A premium salon website with elegant design showcasing services, pricing and booking experience.',
    image: '/project/zack-salon.png',
    link: 'https://z-ack-salon-premium.vercel.app/',
    live: 'https://z-ack-salon-premium.vercel.app/',
    github: getGithubRepoUrl('z-ack-salon-premium'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
  {
    title: 'Vala Gym',
    description:
      'A modern gym website showcasing membership plans, training programs and facilities.',
    image: '/project/vala-gym.png',
    link: 'https://vala-gymj.vercel.app/',
    live: 'https://vala-gymj.vercel.app/',
    github: getGithubRepoUrl('vala-gym'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
  {
    title: 'Maniax Dance',
    description:
      'A vibrant dance academy website showcasing classes, instructors and performance events.',
    image: '/project/maniax-dance.png',
    link: 'https://maniaxdancedemo.vercel.app/',
    live: 'https://maniaxdancedemo.vercel.app/',
    github: getGithubRepoUrl('maniaxdance-demo-webapp'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
  {
    title: 'Mira Collection',
    description:
      'A premium clothing collection website with elegant product showcase and modern shopping experience.',
    image: '/project/mira-collection.png',
    link: 'https://cloth-collection-premium-demobuildj.vercel.app/',
    live: 'https://cloth-collection-premium-demobuildj.vercel.app/',
    github: getGithubRepoUrl('mira-collection-premium-build'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
  {
    title: 'Mahalaxmi Taxi',
    description:
      'A taxi service website with clean design showcasing cab booking, routes and contact information.',
    image: '/project/mahalaxmi-taxi.png',
    link: 'https://taxidemoj.vercel.app/',
    live: 'https://taxidemoj.vercel.app/',
    github: getGithubRepoUrl('mahalaxmi'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
  {
    title: 'Auracelle Jewellery',
    description:
      'A luxury jewellery brand website with stunning product showcase and premium visual experience.',
    image: '/project/auracelle-jewellery.png',
    link: 'https://jewelerydemoj.vercel.app/',
    live: 'https://jewelerydemoj.vercel.app/',
    github: getGithubRepoUrl('Jewellaryshowcase'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
  {
    title: 'The Coffee Bond',
    description:
      'A cozy coffee shop website showcasing menu, ambiance and the unique coffee experience.',
    image: '/project/coffee-bond.png',
    link: 'https://thecoffeebondj.vercel.app/',
    live: 'https://thecoffeebondj.vercel.app/',
    github: getGithubRepoUrl('coffee-bond-cafe'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
  {
    title: 'Sankalp Restaurant',
    description:
      'A restaurant website with appetizing design showcasing menu, ambiance and dining experience.',
    image: '/project/sankalp-restaurant.png',
    link: 'https://sankalrestaurantdemoj.vercel.app/',
    live: 'https://sankalrestaurantdemoj.vercel.app/',
    github: getGithubRepoUrl('sankalprestaurant'),
    technologies: [
      { name: 'Vite', icon: <Vite key="vite" /> },
      { name: 'TypeScript', icon: <TypeScript key="ts" /> },
      { name: 'CSS', icon: <CSS key="css" /> },
    ],
    details: false,
    projectDetailsPageSlug: '',
    isWorking: true,
  },
];
