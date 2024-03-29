// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dongle',
  tagline: 'Til Blog For me!',
  url: 'https://dgle.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'sk1737030', // Usually your GitHub org/user name.
  projectName: 'Dongle Til Blog For Me ', // Usually your repo name.
  scripts: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=G-BESW8T9G3W",
      async: true,
    },
    {
    src: "https://cdn.jsdelivr.net/npm/@docsearch/js@3",
      async: true,
    },
    {
      src: "js/googleAnalytics.js",
      async: true,
    },
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        blog: {
          showReadingTime: true,
          routeBasePath: '/'
          /*editUrl:
          //'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            'https://github.com/facebook/docusaurus/edit/main/website'*/,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'G-BESW8T9G3W',
          anonymizeIP: true, // Should IPs be anonymized?
        },
      },
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: 'L7PLUQ38M6',
        apiKey: '6dc030b16b65c9a246f4e1850045f40d',
        indexName: 'dgle.dev',
        contextualSearch: true
      },
      navbar: {
        title: 'Dongle',
        logo: {
          alt: 'My Site Logo',
          src: 'https://avatars.githubusercontent.com/u/28296218?s=400&u=4e1e0c55274f6595e4f2e0a6148c7e209c9e7541&v=4',
        },
        items: [
          {to: "/archive", label: "목록", position: "left"},
          {
            href: 'https://github.com/sk1737030',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://bit.ly/3sWvIA4',
            label: 'TIL',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Dongle😀`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['java', 'groovy']

      },
    }),
};

module.exports = config;
