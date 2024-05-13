---
title: angular 模板引擎
date: 2022-09-03
tags:
  - angular 
summary: 
comment:
  title: angular-Ivy
---
[AngularUP 2019 会议上关于 Angular Ivy 的演讲(youtube)](https://www.youtube.com/watch?v=x4omLHzRW20)

Ivy 是对 Angular 渲染引擎的完全重写, Angular9+开始 默认使用了 `Ivy 模板引擎` 和 `AOT 编译方式`。以前AOT 编译比 JIT 编译慢很多，所以 JIT 用于开发和测试，目前高版本已删除了配置方法来切换到 View Engine引擎。[切换方法](https://www.infoq.com/news/2021/05/angular-12-ivy-default/)

## Ivy 做了哪些提升
### Tree Shaking
Tree Shaking 是一个术语，表示在打包过程中删除未使用的代码, Ivy 编译后的代码，只会把需要用到的代码打包，大大减少文件的大小, 普通的摇树工具无法识别 if 语句中未使用的路径, Ivy可以。

### 运行

引擎基于增量 DOM 的概念（Incremental DOM），有点类似于 React/Vue 里的 Virtual DOM，跟 Virtual DOM 不同的是：Virtual DOM 是基于整个树做 diff，然后再把diff渲染到页面上（会在内存里生成一个完整的 DOM Tree）；Incremental DOM 是基于节点对比（内存里不会有 DOM Tree），如果节点有变化，直接把变化更新页面，不需要分配内存来保存这个更新，只有增加或删除节点的时候才会分配内存来保存新加/删除的节点。[更多关于增量DOM的介绍](https://medium.com/google-developers/introducing-incremental-dom-e98f79ce2c5f)

当我们用 Incremental DOM，指令不需要框架来解析编译，指令本身就是渲染引擎，那么在生成这些指令的时候（也就是编译过程中），用不到的指令不会打包到最终的 bundle 文件里。Virtual DOM 是需要解析编译运行的，在真正运行的时候才知道需要哪些指令，所以打包的时候，会把所有的指令都打包到 bundle 文件里。

Incremental DOM 并不需要内存来生成 DOM Tree，它根本不会去更改 DOM Tree，只是在新加/删除节点的时候分配内存。

### 调试
相比于 View Engine引擎 , Ivy 的报错信息更丰富，定位更精准。