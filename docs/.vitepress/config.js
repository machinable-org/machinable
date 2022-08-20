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
        { text: 'Guide', link: '/guide/index.html' },
        { text: 'Changelog', link: 'https://github.com/machinable-org/machinable/blob/main/CHANGELOG.md' }
      ],
      footer: {
        message: 'MIT Licensed',
        copyright: 'Copyright © 2021-present'
      }
    }
})
