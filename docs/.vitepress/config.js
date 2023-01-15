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
        { text: 'Tutorial', link: '/tutorial/introduction' },
        { text: 'Reference', link: '/reference/' },
        { text: 'Examples', link: '/examples/overview' },
        { text: 'About', 
          items: [
            { text: "Approach", link: '/about/approach' },
            { text: 'Changelog', link: 'https://github.com/machinable-org/machinable/blob/main/CHANGELOG.md' }
          ]
        }
      ],
      sidebar: {
        '/tutorial/': [
          {
            text: 'Getting Started',
            items: [
              {
                text: 'Introduction',
                link: '/tutorial/introduction'
              },
              {
                text: 'Installation',
                link: '/tutorial/installation'
              }
            ]
          },
          {
            text: 'Essentials',
            items: [
              {
                text: 'Project structure',
                link: '/tutorial/essentials/project-structure'
              },
              {
                text: 'Implementing experiments',
                link: '/tutorial/essentials/implementing-experiments'
              },
              {
                text: 'Running experiments',
                link: '/tutorial/essentials/running-experiments'
              },
              {
                text: 'Storage and retrieval',
                link: '/tutorial/essentials/storage-and-retrieval'
              }
            ]
          },
          {
            text: 'Elements in-depth',
            items: [
              {
                text: 'Overview',
                link: '/tutorial/elements-in-depth/overview'
              },
              {
                text: 'Advanced configuration',
                link: '/tutorial/elements-in-depth/advanced-configuration'
              },
              {
                text: 'Relationships',
                link: '/tutorial/elements-in-depth/relationships'
              },
              {
                text: 'Experiments',
                link: '/tutorial/elements-in-depth/experiments'
              },
              {
                text: 'Execution',
                link: '/tutorial/elements-in-depth/execution'
              },
            ]
          },
          {
            text: 'Extra topics',
            items: [
              {
                text: 'Collections',
                link: '/tutorial/extra-topics/collections'
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
        { icon: 'github', link: 'https://github.com/machinable-org/machinable'}
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
