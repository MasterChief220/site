import { defineThemeConfig } from './types'

export default defineThemeConfig({
  site: 'https://snowdensvault.fyi/',
  title: 'SnowdensVault',
  description: 'Cybersecurity Blog',
  author: 'Bassam',
  navbarItems: [
    { label: 'Blog', href: '/posts' },
    //{ label: 'Projects', href: '/projects' },
    { label: 'Tags', href: '/tags' },
    { label: 'About', href: '/about' },
    {
      label: 'Other pages',
      children: [
        { label: 'Landing page', href: '/' },
        { label: '404 page', href: '/404' },
        { label: 'Author: BassamKhan', href: '/authors/BassamKhan' },
        { label: 'Tag: documentation', href: '/tags/documentation' }
      ]
    }
  ],
  footerItems: [
    {
      icon: 'tabler--brand-github',
      href: 'https://github.com/MasterChief220/site',
      label: 'Github'
    },
    {
      icon: 'tabler--rss',
      href: '/feed.xml',
      label: 'RSS feed'
    }
  ],

  // optional settings
  locale: 'en',
  mode: 'dark',
  modeToggle: true,
  colorScheme: 'scheme-mono',
  openGraphImage: undefined,
  postsPerPage: 4,
  projectsPerPage: 3,
  scrollProgress: false,
  scrollToTop: true,
  tagIcons: {
    tailwindcss: 'tabler--brand-tailwind',
    astro: 'tabler--brand-astro',
    documentation: 'tabler--book'
  },
  shikiThemes: {
    light: 'vitesse-light',
    dark: 'vitesse-black'
  }
})
