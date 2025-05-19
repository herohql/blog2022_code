const removeMd = require('remove-markdown')
const path = require('path')
const pick = require('lodash/pick')

module.exports = themeConfig => {
  /**
   * Default theme configuration
   */
  themeConfig = Object.assign(themeConfig, {
    nav: themeConfig.nav || [
      {
        text: 'Blog',
        link: '/',
      },
      {
        text: 'Tags',
        link: '/tag/',
      },
    ],
    summary: themeConfig.summary === undefined ? true : themeConfig.summary,
    summaryLength:
      typeof themeConfig.summaryLength === 'number'
        ? themeConfig.summaryLength
        : 200,
    pwa: !!themeConfig.pwa,
  })

  /**
   * Configure blog plugin
   */
  const defaultBlogPluginOptions = {
    directories: [
      {
        id: 'post',
        dirname: '_posts',
        path: '/',
      },
    ],
    frontmatters: [
      {
        id: 'tag',
        keys: ['tags'],
        path: '/tag/',
      },
    ],
    globalPagination: {
      lengthPerPage: 5,
    },
  }

  let resolvedFeedOptions
  const isFeedEnabled = themeConfig.feed && themeConfig.feed.canonical_base
  if (isFeedEnabled) {
    const {
      rss = true,
      atom = false,
      json = false,
      ...feedOptions
    } = themeConfig.feed
    resolvedFeedOptions = Object.assign({}, feedOptions, {
      feeds: {
        rss2: { enable: rss },
        atom1: { enable: atom },
        json1: { enable: json },
      },
    })
  }

  const properties = [
    'directories',
    'frontmatters',
    'globalPagination',
    'sitemap',
    'comment',
    'newsletter',
  ]
  const themeConfigPluginOptions = {
    ...pick(themeConfig, properties),
    feed: resolvedFeedOptions,
  }

  const blogPluginOptions = Object.assign(
    {},
    defaultBlogPluginOptions,
    themeConfigPluginOptions
  )

  /**
   * Integrate plugins
   */

  const enableSmoothScroll = themeConfig.smoothScroll === true

  const plugins = [
    '@vuepress/plugin-nprogress',
    ['@vuepress/medium-zoom', true],
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 10,
      },
    ],
    ['@vuepress/blog', blogPluginOptions],
    ['smooth-scroll', enableSmoothScroll],
  ]

  /**
   * Enable pwa
   */
  if (themeConfig.pwa) {
    plugins.push([
      '@vuepress/pwa',
      {
        // @ts-ignore
        serviceWorker: true,
        updatePopup: true,
      },
    ])
  }

  const config = {
    plugins,
    define: {
      THEME_BLOG_PAGINATION_COMPONENT: themeConfig.paginationComponent
        ? themeConfig.paginationComponent
        : 'Pagination',
    },
    alias: {
      fonts: path.resolve(__dirname, 'fonts'),
    },
    /**
     * Generate summary.
     */
    extendPageData(pageCtx) {
      console.log(pageCtx)
      const strippedContent = pageCtx._strippedContent
      if (!strippedContent) {
        return
      }
      if (themeConfig.summary) {
        pageCtx.summary =
          removeMd(
            strippedContent
              .trim()
              .replace(/^#+\s+(.*)/, '')
              .slice(0, themeConfig.summaryLength)
          ) + ' ...'
        pageCtx.frontmatter.description = pageCtx.summary
      }
      if (pageCtx.frontmatter.summary) {
        pageCtx.frontmatter.description = pageCtx.frontmatter.summary
      }
      //取正文朗读
      // pageCtx.context =
      // removeMd(
      //   strippedContent
      //     .trim()
      //     // .replace(/^#+\s+(.*)/, '')
          
      //     .replace(/(?<!\!)\==/g, '等于')// ===  ==, 排除!==的情况
      //     .replace(/\!==?/g, '不等于')//!==  !=
      //     .replace(/\./g, '点')
      //     .replace(/(?<=\s+)\[/g, '数组') // [只有再空格后面才转数组
      //     .replace(/(?<!(\)\s+))\{/g, '对象') // '{' 前面不是 ')空格' 才匹配, 排除func和if
      //     .replace(/(?<=if\s+)\(/g, '条件为') // if() 读作 if条件为
      //     .replace(/(?<=for\s+)\(/g, '循环') // for() 读作 for循环
      //     .replace(/(?<=function.*?)\(/g, '函数, 参数为') // function a(b){ 读作 function a函数 参数为b
          
      // )
     },
  }

  return config
}
