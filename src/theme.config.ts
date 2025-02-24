import { defineThemeConfig } from './types'

export default defineThemeConfig({
  site: 'https://nordlys.fjelloverflow.dev',
  title: "Snowden's Vault",
  description: 'My personal Domain',
  author: 'FjellOverflow',
  navbarItems: [
    { label: 'Blog', href: '/posts' },
    { label: 'Tags', href: '/tags' },
    { label: 'Walkthroughs', href: 'https://blog.snowdensvault.fyi/writeups' },
    { label: 'Terminal', href: 'https://terminalcv.snowdensvault.fyi/' },
    { label: 'About', href: '/about' }
  ],
  footerItems: [
    {
      icon: 'tabler--brand-github',
      href: 'https://github.com/MasterChief220',
      label: 'Github'
    },
    {
      icon: 'tabler--brand-medium',
      href: 'https://medium.com/@bassam-khan',
      label: 'Github'
    },
    {
      icon: 'tabler--brand-linkedin',
      href: 'https://www.linkedin.com/in/mbassamkhan/',
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
    documentation: 'tabler--book',
    cybersecurity: 'tabler--shield-lock',
    guides: 'tabler--manual-gearbox',
    blueteam: 'tabler--shield',
    siem:'tabler--letter-s-small'
  },
  shikiThemes: {
    light: 'vitesse-light',
    dark: 'vitesse-black'
  }
})
