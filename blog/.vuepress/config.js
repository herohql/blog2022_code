const path = require("path");
module.exports = (options, context, api) => {
  return {
    title: "Home",
    description: "Web development, Frontend, JavaScript",
    theme: "@vuepress/blog",
    base: "/blog2022/",
    plugins: [
      [
        "@vuepress/google-analytics",
        {
          ga: process.env.GA
        }
      ]
    ],
    themeConfig: {
      directories: [
        {
          id: "posts",
          dirname: "_posts",
          title: "帖子",
          path: "/posts/",
          itemPermalink: "/posts/:year/:month/:day/:slug",
          pagination: {
            lengthPerPage: 10,
          },

        },
        // {
        //   id: "en",
        //   dirname: "_en",
        //   title: "Post",
        //   path: "/en/",
        //   itemPermalink: "/en/:year/:month/:day/:slug",
        //   pagination: {
        //     lengthPerPage: 10,
        //   },
        // }
      ],
      sitemap: {
        hostname: "https://herohql521.github.io/blog2022/"
      },
      comment: {
        service: "vssue",
        autoCreateIssue: true,
        prefix: "[Post]",
        owner: "herohql521",
        repo: "blog2022",
        clientId: "70c41e00a317a8279e5e",
        clientSecret: "f97fc7ab57efc2b0b2ce71db5ec4440eed1d6b66"
      },
      // comment: {
      //   // Which service you'd like to use
      //   service: 'disqus',
      //   // The owner's name of repository to store the issues and comments.
      //   shortname: 'heql',
      // },
      // newsletter: {
      //   endpoint:
      //     "https://gmail.us5.list-manage.com/subscribe/post?u=942c0d587f8ea28269e80d6cd&amp;id=d77d789d53"
      // },
      // feed: {
      //   canonical_base: "https://billyyyyy3320.com/",
      //   posts_directories: ["/_en/"]
      // },
      nav: [
        {
          text: "Posts",
          link: "/posts/"
        },
        {
          text: "Tag",
          link: "/tag/"
        },
        // {
        //   text: "Blog",
        //   link: "/en/"
        // },
        
      ],
      // footer: {
      //   contact: [
      //     {
      //       type: "github",
      //       link: "https://github.com/billyyyyy3320"
      //     },
      //     {
      //       type: "mail",
      //       link: "mailto:newsbielt703@gmail.com"
      //     }
      //   ],
      //   copyright: [
      //     {
      //       text: "Billy Chin © 2019",
      //       link: ""
      //     }
      //   ]
      // },
      smoothScroll: true
    },
    alias: {
      "@assets": path.resolve(__dirname, "../assets")
    },
    chainWebpack: config => {
      config.resolve.alias.set('core-js/library/fn', 'core-js/features')//解决引入第三方组件库报错
    }
  };
};
