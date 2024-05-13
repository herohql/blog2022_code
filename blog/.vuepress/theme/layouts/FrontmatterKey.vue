<template>
  <div id="vuepress-theme-blog__tags-layout">
    <BlogTags :tags="$frontmatterKey.list" />
  </div>
</template>

<style lang="stylus">
#vuepress-theme-blog__tags-layout 
  padding-top:80px
</style>