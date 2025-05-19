---
title: 开发npm组件包
date: 2024-06-28
tags: 
  - 沉思
summary: vue轮子发布到npm
comment:
  title: 开发npm组件
---

## 新建项目
```bash
vue create <Project Name> //用于发布npm包的项目文件名
```
这里选择用vue2

## 调整目录文件
* 将 src 文件夹名称更改为 examples （ examples 用作示例展示 ）。
* 根目录下（src同级目录）新增 packages 文件夹，用于编写要发布的组件。
* 修改 vue.config.js
```js
  //由于修改了src文件夹名称，重新指定启动入口
    module.exports = {
  // 将 examples 目录添加为新的页面
      pages: {
        index: {
          // page 的入口
          entry: 'examples/main.js',
          // 模板来源
          template: 'public/index.html',
          // 输出文件名
          filename: 'index.html'
        }
      }
    }
```

![mulu](@assets/2024/1.png)


## 开发组件
在 packages 文件内新建一个文件夹btn，然后在其内新建一个 xx.vue  开发的组件；再新建一个 index.js 用于组件的导入导出。
```js
//packages/btn/myBtn.vue
<template>
  <div>
    mybtn
 </div>
</template>

<script>
export default {
  name: 'myBtn',
  data() { 
    return {

    }
  },
  props: {

  },
  components:{
  },
  mounted() {

  },
  methods:{

  },
 }
</script>

<style scoped lang='scss'>
</style>
```

```js
//packages/btn/index.js
import myBtn from './myBtn.vue'
// 为组件添加 install 方法，用于按需引入
myBtn.install = function (Vue) {
  Vue.component(myBtn.name, myBtn)
}
export default myBtn;

```

在 packages 文件内新建 index.js 文件作为入口文件用于组件的导入导出并安装
```js
// packages/index.js
    // 导入组件,可有多个
    import myBtn from './btn/index'

    // 把组件保存到一个数组中,可有多个
    const components = [
      myBtn
    ]
    
    // 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，那么所有的组件都会被注册
    const install = function (Vue) {
      // 判断是否安装
      if (install.installed) return
      install.installed = true
      // 遍历组件列表并注册全局组件
      components.map(component => {
        Vue.component(component.name, component)
      })
    }
    
    // 判断是否是直接引入文件
    if (typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }
    
    export default {
      // 导出的对象必须具备一个 install 方法，才能被 Vue.use() 方法安装
      install,
      // 组件列表
      ...components
    }
    
```

## 测试组件
在 examples 文件夹内的入口文件 main.js 中导入并使用我们开发的组件。
```js
import Vue from 'vue'
import App from './App.vue'
import myBtn  from '/packages'


Vue.config.productionTip = false

Vue.use(myBtn)

new Vue({
  render: h => h(App),
}).$mount('#app')

```
App.vue中使用
```html
<template>
  <div id="app">
  <my-btn></my-btn>
  </div>
</template>
```
`npm run serve`

## 配置package.json打包命令
在 scripts 中加上打包命令,  `"lib": "vue-cli-service build --target lib --name warn-sun-btn --dest lib packages/index.js"`

* target: 默认为构建应用，改为 lib 即可启用构建库模式
* name: 输出文件名
* dest: 输出目录，默认为 dist，这里我们改为 lib
* entry: 入口文件路径，默认为 src/App.vue，这里改为 packages/index.js

执行 `npm run lib `
根目录中会生成一个 lib 文件夹。

![lib](@assets/2024/2.png)

## 修改 package.json 文件的包名、版本号等信息。

* name： 包名，该名不能和npm上已有的名称冲突（必须）
* version： 版本号，不能和历史版本号相同（必须）
* main： 入口文件，应指向编译后的包文件（必须）
* private： 是否私有，需要修改为 false 才能发布到 npm（必须）
* license： "MIT"     开源协议（必须）
* description： 简介
* author： 作者
* keyword： 关键字，以空格分割
* typings： ts入口文件
* repository： 指定仓库

![lib](@assets/2024/3.png)

## 根目录下创建发布忽略文件 .npmignore
```bash
    .DS_Store
    node_modules/
    examples/
    packages/
    public/
    vue.config.js
    babel.config.js
    *.map
    *.html

    # 本地开发文件
    .env.local
    .env.*.local

    # 日志文件
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*

    # 编辑器文件
    .idea
    .vscode
    *.suo
    *.ntvs*
    *.njsproj
    *.sln
    *.sw*

```

## 修改README.md文件
写文档之类的
## 发布npm

检查npm源是不是: https://registry.npmjs.org/，大多数人都改成了淘宝镜像，需要改回来


根目录下

```bash
npm login
```

需输入账号、密码、邮箱、验证码

```bash
npm publish
```

发布成功

如果出现了更新完但是npm官网上没有更新
```bash
npm publish .
```

## 报错信息
` 403 Forbidden - PUT https://registry.npmjs.org/mytest - You do not have permission to publish "mytest". Are you logged in as the correct user?`
意思是`mytest`这个包名已经存在了，需要换个不重复的名字

## 安装使用
```bash
npm install hqltestbtn
```