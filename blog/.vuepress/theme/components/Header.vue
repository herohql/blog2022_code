<template>
  <section id="header-wrapper">
    <header id="header">
      <div class="header-wrapper">
        <div class="title">
          <RouterLink :to="$localePath" class="home-link" title="Home">{{nowTime}}, China</RouterLink>
        </div>
        <div class="header-right-wrap">
          <ul v-if="$themeConfig.nav" class="nav">
            <li
              v-for="item in $themeConfig.nav"
              :key="item.text"
              class="nav-item"
            >
              <NavLink :link="item.link">{{ item.text }}</NavLink>
            </li>
          </ul>
          <div class="theme-change" @click="themeChange()">
            <span class="svg-img"></span>
          </div>
          <!-- <read/> -->
          <SearchBox />
          <Feed />
        </div>
      </div>
    </header>
  </section>
</template>

<script>
import SearchBox from '@SearchBox'
import Feed from './Feed'
import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import timezone  from 'dayjs/plugin/timezone'
dayjs.extend(dayjsPluginUTC)
dayjs.extend(timezone)

export default {
  components: { SearchBox, Feed},
   data() {
    return {
      nowTime: '00:00',
      shine: true
    }
  },
  mounted() {
    this.getNowDate()
    this.getTheme()
  },

  methods:{
    getNowDate() {
      this.timer = setInterval(() => {
        if(this.shine){
          this.$nextTick(() => {
            this.nowTime =  dayjs().tz('Asia/Shanghai').format('HH:mm')
          })
          
        }else{
          this.nowTime =  dayjs().tz('Asia/Shanghai').format('HH mm')
        }
        // this.shine = !this.shine
        
      }, 1000)
    },
    themeChange(){
      let dark = document.body.classList.contains('dark')
      if(dark){
         document.body.classList.remove('dark')
         localStorage.removeItem('theme','dark')
      }else{
        document.body.classList.add('dark')
        localStorage.setItem('theme','dark')
      }
    },
    getTheme(){
      //默认获取一下皮肤
      const theme = localStorage.getItem('theme')
      console.log(theme)
      if(theme){
        document.body.classList.add(theme)
      }
    }

  },
   beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="stylus">
@import '~@app/style/config'

#header
  z-index 12
  position fixed
  top 0
  width 100vw
  height $headerHeight
  box-sizing border-box
  background-color $headerBgColor
  padding 20px 32px 20px
  margin auto
  box-shadow 0 5px 20px rgba(0, 0, 0, 0.03), 0 6px 6px rgba(0, 0, 0, 0.05)
  transition all 1s cubic-bezier(0.25, 0.8, 0.25, 1)

  ol, ul
    list-style none
    margin 0
    padding 0

  &:hover
    box-shadow 0 5px 20px rgba(0, 0, 0, 0.08), 0 6px 6px rgba(0, 0, 0, 0.1)

// border-bottom 5px solid lighten(#3eaf7c, 50%)
.header-wrapper
  display flex
  line-height 40px
  height 40px

  .title
    /* flex 0 0 200px */
    font-size 20px
    margin 0
    letter-spacing 2px
    display block
   
    a
      color $darkTextColor
      font-family PT Serif, Serif
      text-decoration none

  .header-right-wrap
    flex 1
    display flex
    justify-content flex-end
    align-items center

    .nav
      flex 0 0 auto
      display flex
      margin 0

      .nav-item
        margin-left 20px

        a
          font-family PT Serif, Serif
          font-size 20px
          // color lighten(#3eaf7c, 30%)
          text-decoration none
          transition color 0.3s

    .search-box
      font-family PT Serif, Serif
      margin-left 20px

      input
        border-radius 5px
        transition all 0.5s
        border 1px solid #cecece

        &:hover
          border 1px solid $accentColor
          box-shadow 0 0 5px $accentColor

      .suggestions
        border 1px solid $darkBorderColor
        top 40px
        right 0

        a
          color $darkTextColor
          text-decoration none

          &.focused
            color $accentColor
.theme-change
  display flex
  margin 0 10px
  cursor pointer
  .svg-img
    width 30px
    height 30px
    display inline-block
    background-color #4e4e4e
    -webkit-mask-image url('../img/sun.svg')
    transition: all 0.5s ease
.dark
  .theme-change
    .svg-img
       background-color #dadfe7
       -webkit-mask-image url('../img/moon.svg')
       transform:scale(0.8) rotate(-40deg)
@media (max-width: $MQMobile)
  #header
    display none

  .header-wrapper
    flex-direction column

    .header-right-wrap
      display none
</style>
