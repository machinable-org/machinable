import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
const { path } = require('@vuepress/utils')
const { defaultTheme } = require('@vuepress/theme-default')

export default defineUserConfig<DefaultThemeOptions>({
    // site config
    base: '/',
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
    // theme and its config
    theme: defaultTheme({
      repo: 'machinable-org/machinable',
      editLinks: true,
      docsDir: 'docs',
    }),
    themeConfig: {
        nav: [
          {
            text: "Guide",
            link: "/guide/"
          },
          // {
          //   text: "Reference",
          //   link: "/reference/"
          // },
          {
            text: "Learn More",
            ariaLabel: "Learn More",
            items: [
              {
                text: "Adoption",
                items: [
                  // {
                  //   text: "FAQ",
                  //   link: "/faq/"
                  // },
                  {
                    text: "Changelog",
                    link: "https://github.com/machinable-org/machinable/blob/master/CHANGELOG.md"
                  }
                ]
              },
              {
                text: "Meta",
                items: [
                  // {
                  //   text: "Design principles",
                  //   link: "/miscellaneous/design-principles.html"
                  // },
                  // {
                  //   text: "Comparison with alternatives",
                  //   link: "/miscellaneous/comparison.html"
                  // },
                  {
                    text: "Contribution guide",
                    link: "/miscellaneous/contribution-guide.html"
                  }
                ]
              }
            ]
          }
        ],
        sidebar: {
          '/guide/': [
            {
              title: 'Essentials',
              collapsable: false,
              children: [
                'installation',
                '',
              ]
            },
          ],
          // '/reference/': [
          //   {
          //     title: 'Core',
          //     collapsable: false,
          //     sidebarDepth: 2,
          //     children: [
          //     ]
          //   },
          //   {
          //     title: 'System',
          //     collapsable: false,
          //     sidebarDepth: 2,
          //     children: [
          //       'cli',
          //       'settings'
          //     ]
          //   }
          // ]
        },
        themePlugins: {
            externalLinkIcon: false,
            git: false
        }
    },
})
