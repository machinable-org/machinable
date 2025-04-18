import { defineConfig } from 'vitepress'

export default defineConfig({
  // site config
  lang: 'en-US',
  title: 'machinable',
  description: 'A modular configuration system for research projects',
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  themeConfig: {
    logo: '/logo/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Reference', link: '/reference/' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'About',
        items: [
          { text: "Approach", link: '/about/approach' },
          { text: 'Changelog', link: 'https://github.com/machinable-org/machinable/blob/main/CHANGELOG.md' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            {
              text: 'Introduction',
              link: '/guide/introduction'
            },
            {
              text: 'Installation',
              link: '/guide/installation'
            }
          ]
        },
        {
          text: 'Concepts',
          items: [
            {
              text: 'Element',
              link: '/guide/element'
            },
            {
              text: 'Interface',
              link: '/guide/interface'
            },
            {
              text: 'Component',
              link: '/guide/component'
            },
          ]
        },
        {
          text: 'Basics',
          items: [
            {
              text: 'Execution',
              link: '/guide/execution'
            },
            {
              text: 'CLI',
              link: '/guide/cli'
            },
          ]
        },
      ],
      '/examples/': [
        {
          text: 'Storage',
          items: [
            {
              text: 'Aimstack',
              link: '/examples/aimstack-storage/'
            },
            {
              text: 'Globus',
              link: '/examples/globus-storage/'
            }
          ]
        },
        {
          text: 'Execution',
          items: [
            {
              text: 'MPI',
              link: '/examples/mpi-execution/'
            },
            {
              text: 'Slurm',
              link: '/examples/slurm-execution/'
            },
            {
              text: 'Require',
              link: '/examples/require-execution/'
            },
          ]
        },
        {
          text: 'Component',
          items: [
            {
              text: 'dmosopt',
              link: '/examples/dmosopt-component/'
            },
          ]
        },
      ]
    },
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2021-present'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/machinable-org/machinable' }
    ],

    editLink: {
      pattern: 'https://github.com/machinable-org/machinable/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
  },
  markdown: {
    lineNumbers: false
  }
})
