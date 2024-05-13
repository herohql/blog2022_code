<template>
  <li class="post-tag">
    <router-link :to="'/tag/' + tag">
      #{{ tag }}
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'PostTag',
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
.post-tag
    margin-top:12px
    font-size 0

  &:not(:last-child)
    margin-right 10px

  a
    background-color rgba($subColor,.6)
    border-radius 3px
    padding 0 5px
    text-decoration none
    height 26px
    line-height 26px
    display inline-block
    transition none
    font-weight 400
    font-size 15px
    color #767676

    &:hover
      background-color rgba($subColor,1)

</style>
